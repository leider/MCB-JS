const configureAPI = require("./server/configureApp");

module.exports = {
  outputDir: "build",
  devServer: {
    before: configureAPI
  }
};
