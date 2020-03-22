const puppeteer = require("puppeteer");

function getChromiumExecPath() {
  return puppeteer.executablePath().replace("app.asar", "app.asar.unpacked");
}

async function renderInBrowser(options, html) {
  const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-extensions"], executablePath: getChromiumExecPath() });
  const page = await browser.newPage();
  await page.emulateMedia("screen");
  await page.goto(`data:text/html,${html}`, {
    waitUntil: "networkidle0"
  });
  const pdf = await page.pdf(options);
  await browser.close();
  return pdf;
}

module.exports = {
  generatePdf: function generatePdf(options, filename, res, next) {
    return (err, html) => {
      if (err) {
        return next(err);
      }
      (async () => {
        const pdf = await renderInBrowser(options, html);
        res.attachment(filename);
        res.send(pdf);
      })();
    };
  },

  generatePdfAsBuffer: function generatePdfAsBuffer(html, callback) {
    const printoptions = {
      format: "A4",
      landscape: false,
      margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" }
    };


    (async () => {
      const pdf = await renderInBrowser(printoptions, html);
      callback(pdf);
    })();
  }
};
