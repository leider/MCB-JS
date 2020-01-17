const builder = require("electron-builder");
const Platform = builder.Platform;

builder
  .build({
    targets: Platform.MAC.createTarget(),
    config: {
      asar: true,
      appId: "mcb-js",
      productName: "MCB-APP",
      files: ["build", "server", "index.js"],
      mac: {
        artifactName: "${productName}.${ext}",
        electronLanguages: "de",
        target: "zip"
      }
    }
  })
  .then(() => {
    // handle result
  })
  .catch(error => {
    console.log(error);
  });
