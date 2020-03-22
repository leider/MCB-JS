const pug = require("pug");
const path = require("path");
const marked = require("marked");

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

function sendEinladungen(addresses, aktuellesTreffen, callback) {
  const filename = path.join(__dirname, "views/einladung.pug");

  const datum = `${dateUtil.toLocaleDate(new Date(aktuellesTreffen.ersterTag))} bis ${dateUtil.toLocaleDate(
    new Date(aktuellesTreffen.letzterTag)
  )}`;

  function sendEmail(address, pdf, innerCallback) {
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

    mailer.sendMail(transportObject, innerCallback);
  }

  const attachedPDF = pug.renderFile(filename, { mcblogo, background, aktuellesTreffen, datum });
  puppeteerPrinter.generatePdfAsBuffer(attachedPDF, pdf => {
    async.each(
      addresses,
      (a, cb) => {
        sendEmail(a, pdf, cb);
      },
      callback
    );
  });
}

function sendFreeEmails(addresses, messageText, subject, callback) {
  const renderingOptions = {
    pretty: true,
    content: marked(messageText),
    plain: messageText
  };
  const mailfilename = path.join(__dirname, "views/mailtemplate.pug");
  const mailfilenameTextonly = path.join(__dirname, "views/mailtemplate-textonly.pug");

  const transportObject = {
    from: `"${senderName}" <${senderAddress}>`,
    to: "",
    bcc: process.env.NODE_ENV === "production" ? addresses.map(a => a.email) : senderAddress,
    subject: subject,
    text: pug.renderFile(mailfilenameTextonly, renderingOptions),
    html: pug.renderFile(mailfilename, renderingOptions)
  };

  mailer.sendMail(transportObject, callback);
}

module.exports = { sendEinladungen, sendFreeEmails };
