const pug = require("pug");
const path = require("path");

const dateUtil = require("./dateUtil");
const { mcblogo, background } = require("./images");
const puppeteerPrinter = require("./puppeteerPrinter");
const async = require("async");

const workingdir = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + "/MCB/config/";

const config = require(workingdir + "config");
const senderName = config["sender-name"];
const senderAddress = config["sender-address"];
const transportOptions = config["transport-options"];

const mailer = require("nodemailer").createTransport(transportOptions);

function sendEmail(address, aktuellesTreffen, callback) {
  const datum = `${dateUtil.toLocaleDate(new Date(aktuellesTreffen.ersterTag))} bis ${dateUtil.toLocaleDate(
    new Date(aktuellesTreffen.letzterTag)
  )}`;

  const renderingOptions = { mcblogo, background, name: address.vorname, aktuellesTreffen, datum };
  const filename = path.join(__dirname, "views/einladung.pug");

  const printoptions = {
    format: "A4",
    landscape: false,
    margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" }
  };

  const attachedPDF = pug.renderFile(filename, { mcblogo, background, aktuellesTreffen, datum });
  const to = process.env.NODE_ENV === "production" ? address.email : "";

  puppeteerPrinter.generatePdfAsBuffer(printoptions, attachedPDF, (err, pdf) => {
    if (err) {
      return callback(err);
    }
    const transportObject = {
      from: `"${senderName}" <${senderAddress}>`,
      to: to,
      bcc: senderAddress,
      replyTo: senderAddress,
      subject: `Einladung zum ${aktuellesTreffen.beschreibung}`,
      html: pug.renderFile(filename, renderingOptions),
      attachments: [
        {
          filename: "einladung.pdf",
          content: pdf
        }
      ]
    };

    mailer.sendMail(transportObject, err1 => {
      callback(err1);
    });
  });
}

function sendEinladungen(addresses, aktuellesTreffen, callback) {
  async.eachSeries(
    addresses,
    (a, cb) => {
      sendEmail(a, aktuellesTreffen, cb);
    },
    callback
  );
}

module.exports = sendEinladungen;
