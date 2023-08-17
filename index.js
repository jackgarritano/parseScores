const scrapeHtml = require('./scrapeHtml');
const parseHtml = require('./parseHtml');
const resolveNames = require('./resolveNames');

const main = async (event) => {
  try{
    const htmlContent = await scrapeHtml('partizan+belgrade+vs+sabah+fk+august+2023');
    const outcome = parseHtml(htmlContent);
    const resolvedNameOutcome = resolveNames(['par bel', 'sab fk'], outcome);
    return {outcomeList: resolvedNameOutcome};
  }
  catch(e){
    return {error: e.message};
  }
};

main()
  .then((res) => {
    console.log(res);
    process.exit();
  })
