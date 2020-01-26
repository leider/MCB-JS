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

const printoptions = {
  format: "A4",
  landscape: false,
  margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" }
};
const filename = path.join(__dirname, "views/einladung.pug");

function sendEmail(address, aktuellesTreffen, pdf, datum, callback) {
  const renderingOptions = { mcblogo, background, name: address.vorname, aktuellesTreffen, datum };
  const renderedMail = pug.renderFile(filename, renderingOptions);

  const transportObject = {
    from: `"${senderName}" <${senderAddress}>`,
    to: process.env.NODE_ENV === "production" ? address.email : "",
    bcc: senderAddress,
    replyTo: senderAddress,
    subject: `Einladung zum ${aktuellesTreffen.beschreibung}`,
    html: renderedMail,
    attachments: [
      {
        filename: "einladung.pdf",
        content: pdf
      }
    ]
  };

  mailer.sendMail(transportObject, callback);
}

function sendEinladungen(addresses, aktuellesTreffen, callback) {
  const datum = `${dateUtil.toLocaleDate(new Date(aktuellesTreffen.ersterTag))} bis ${dateUtil.toLocaleDate(
    new Date(aktuellesTreffen.letzterTag)
  )}`;

  const attachedPDF = pug.renderFile(filename, { mcblogo, background, aktuellesTreffen, datum });

  puppeteerPrinter.generatePdfAsBuffer(printoptions, attachedPDF, pdf => {
    async.each(
      addresses,
      (a, cb) => {
        sendEmail(a, aktuellesTreffen, pdf, datum, cb);
      },
      callback
    );
  });
}

module.exports = sendEinladungen;
