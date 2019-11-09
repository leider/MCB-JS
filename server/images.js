const fs = require("fs");
const path = require("path");

function pngToBase64(filename) {
  // eslint-disable-next-line no-sync
  const file = fs.readFileSync(path.join(__dirname, `../public/${filename}`));
  return `data:image/png;base64,${file.toString("base64")}`;
}

module.exports = {
  mcblogo: pngToBase64("mcblogo.png"),
  background: pngToBase64("background.png")
};
