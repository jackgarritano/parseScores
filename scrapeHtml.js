const puppeteer = require("puppeteer");

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19582';

async function scrapeHtml(searchQuery){
  let browser = null;
  let page = null;
  let htmlContent = null;
  try {
    browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
      headless: 'new',
    });
    
    page = await browser.newPage();
    await page.setUserAgent(userAgent);
    await page.goto(`https://www.bing.com/search?q=${searchQuery}`, {waitUntil: 'networkidle0'});
    htmlContent = await page.content();
    
  }
  catch (error){
    console.log(error);
  }
  finally{
    if(page !== null && !page.isClosed()){
      await page.close();
    }
  }
  return htmlContent;
}

module.exports = scrapeHtml;