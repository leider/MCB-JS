/* eslint no-console: 0 */

const path = require("path");
const express = require("express");
const compress = require("compression");
const configureApp = require("./configureApp");

const app = express();
app.use(compress());
configureApp(app);
app.use(express.static(path.join(__dirname + "/../dist")));
let server;

app.start = function(port, done) {
  server = require("http").createServer(this);
  const realPort = port || process.env.PORT || 8080;
  server.listen(realPort, () => {
    console.log("Server started on port: " + realPort);
    done();
  });
};

app.stop = done => {
  server.close(() => {
    console.log(" Server stopped\n");
    done();
  });
};

module.exports = app;
