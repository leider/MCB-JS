const builder = require("electron-builder");
const Platform = builder.Platform;

builder
  .build({
    targets: Platform.WINDOWS.createTarget(),
    config: {
      appId: "mcb-app",
      icon: "win/icon.png",
      productName: "MCB-APP",
      files: ["build", "server", "index.js"],
      win: {
        artifactName: "${productName}.${ext}",
        target: "dir",
      },
    },
  })
  .then(() => {
    // handle result
  })
  .catch((error) => {
    console.log(error);
  });
