const builder = require("electron-builder");
const Platform = builder.Platform;

builder
  .build({
    targets: Platform.WINDOWS.createTarget(),
    config: {
      appId: "mcb-js",
      icon: "win/icon.png",
      productName: "MCB-APP",
      files: ["build", "server", "index.js"],
      win: {
        artifactName: "${productName}.${ext}",
        target: "portable"
      }
    }
  })
  .then(() => {
    // handle result
  })
  .catch(error => {
    console.log(error);
  });
