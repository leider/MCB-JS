const configureAPI = require("./server/configureApp");

module.exports = {
  devServer: {
    before: configureAPI
  }
};
