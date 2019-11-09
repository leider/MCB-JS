const puppeteer = require("puppeteer");

async function renderInBrowser(options, html) {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
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
  generatePdf: function generatePdf(options, res, next) {
    return (err, html) => {
      if (err) {
        return next(err);
      }
      (async () => {
        const pdf = await renderInBrowser(options, html);
        res.set("Content-Type", "application/pdf");
        res.send(pdf);
      })();
    };
  },

  generatePdfAsBuffer: function generatePdfAsBuffer(options, html, callback) {
    (async () => {
      const pdf = await renderInBrowser(options, html);
      callback(null, pdf);
    })();
  }
};
