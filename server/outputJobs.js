const express = require("express");
const path = require("path");
const sendEinladungen = require("./mailer");
const dateUtil = require("./dateUtil");
const dataAccess = require("./dataAccess");
const puppeteerPrinter = require("./puppeteerPrinter");

const { mcblogo, background } = require("./images");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

function displayDate(treffen) {
  return `${dateUtil.toLocaleDate(new Date(treffen.ersterTag))} bis ${dateUtil.toLocaleDate(new Date(treffen.letzterTag))}`;
}

const printoptions = {
  format: "A4",
  landscape: false,
  margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" }
};

function addressesWithIds(receiverIds, callback) {
  dataAccess.allAddresses((err, addr) => {
    if (err) {
      return callback(err);
    }
    const addresses = addr.filter(a => receiverIds.includes(a.id)).sort((a, b) => (a.name < b.name ? -1 : 1));
    callback(null, addresses);
  });
}

app.post("/sendEmails", (req, res) => {
  const { receiverIds, aktuellesTreffen } = req.body;
  addressesWithIds(receiverIds, (err, addresses) => {
    if (err) {
      return res.status(500).send(err);
    }
    sendEinladungen(addresses, aktuellesTreffen, err1 => {
      if (err1) {
        return res.status(500).send(err1);
      }
      res.status(200).send({ severity: "info", message: `${addresses.length} E-Mails verschickt` });
    });
  });
});

app.get("/preview.pdf", (req, res) => {
  const aktuellesTreffen = JSON.parse(req.query.treffen);
  const datum = displayDate(aktuellesTreffen);
  res.render("einladungPreview", { background, mcblogo, aktuellesTreffen, datum });
});

app.get("/emptyEinladung.pdf", (req, res, next) => {
  const aktuellesTreffen = JSON.parse(req.query.treffen);
  const datum = displayDate(aktuellesTreffen);
  app.render("einladung", { background, mcblogo, aktuellesTreffen, datum }, puppeteerPrinter.generatePdf(printoptions, "einladung.pdf", res, next));
});

app.get("/einladungen.pdf", (req, res, next) => {
  const laender = {
    D: "Deutschland",
    F: "Frankreich",
    NL: "Niederlande",
    A: "Österreich",
    B: "Belgien",
    CH: "Schweiz",
    L: "Luxemburg",
    CZ: "Tschechien",
    DK: "Dänemark",
    E: "Spanien",
    FIN: "Finnland",
    FL: "Liechtenstein",
    GB: "Großbritannien",
    GR: "Griechenland",
    H: "Ungarn",
    HR: "Kroatien",
    I: "Italien",
    IRL: "Irland",
    N: "Norwegen",
    P: "Portugal",
    PL: "Polen",
    S: "Schweden"
  };

  const aktuellesTreffen = JSON.parse(req.query.treffen);
  const receiverIds = JSON.parse(req.query.receiverIds);
  addressesWithIds(receiverIds, (err, addresses) => {
    if (err) {
      return res.status(500).send(err);
    }

    const datum = displayDate(aktuellesTreffen);
    app.render(
      "einladung",
      { background, mcblogo, addresses, laender, aktuellesTreffen, datum },
      puppeteerPrinter.generatePdf(printoptions, "einladungen.pdf", res, next)
    );
  });
});

module.exports = app;
