const builder = require("electron-builder");
const Platform = builder.Platform;

builder
  .build({
    targets: Platform.MAC.createTarget(),
    config: {
      appId: "mcb-js",
      icon: "mac/icon.png",
      productName: "MCB-APP",
      files: ["build", "server", "index.js"],
      mac: {
        artifactName: "${productName}.${ext}",
        electronLanguages: "de",
        target: "dir",
        asar: false,
      },
    },
  })
  .then(() => {
    // handle result
  })
  .catch((error) => {
    console.log(error);
  });
