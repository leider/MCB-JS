const fs = require("fs");
const path = require("path");

function pngToBase64(filename) {
  const subdir = process.env.NODE_ENV === "production" ? "../build" : "../public";
  // eslint-disable-next-line no-sync
  const file = fs.readFileSync(path.join(__dirname, subdir, filename));
  return `data:image/png;base64,${file.toString("base64")}`;
}

module.exports = {
  mcblogo: pngToBase64("mcblogo.png"),
  background: pngToBase64("background.png")
};
