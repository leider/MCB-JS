const builder = require("electron-builder");
const Platform = builder.Platform;

builder
  .build({
    targets: Platform.WINDOWS.createTarget(),
    config: {
      appId: "mcb-js",
      productName: "MCB-APP",
      files: ["build", "server", "index.js"],
      win: {
        artifactName: "${productName}.${ext}",
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
