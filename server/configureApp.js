module.exports = function configure(app) {
  const path = require("path");
  const bodyparser = require("body-parser");
  const history = require("connect-history-api-fallback");
  const dataAccess = require("./dataAccess");

  app.set("views", path.join(__dirname, "/views"));
  app.set("view engine", "pug");
  app.use(bodyparser.json());
  app.use(history());

  function standardCallback(res) {
    return (err, json) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.set("Content-Type", "application/json").send(json);
    };
  }

  app.get("/help.html", (req, res) => {
    res.render("help");
  });

  app.get("/addresses.json", (req, res) => {
    dataAccess.allAddresses(standardCallback(res));
  });

  app.get("/treffen.json", (req, res) => {
    dataAccess.allTreffen(standardCallback(res));
  });

  app.post("/saveAddress", (req, res) => {
    const address = req.body;
    dataAccess.saveAddress(address, standardCallback(res));
  });

  app.post("/deleteAddress", (req, res) => {
    const id = req.body.id;
    dataAccess.deleteAddress(id, standardCallback(res));
  });

  app.post("/saveTreffen", (req, res) => {
    const treffen = req.body;
    dataAccess.saveTreffen(treffen, standardCallback(res));
  });

  app.post("/deleteTreffen", (req, res) => {
    const id = req.body.id;
    dataAccess.deleteTreffen(id, standardCallback(res));
  });

  app.use(require("./outputJobs"));
};
