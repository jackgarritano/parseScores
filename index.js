const scrapeHtml = require('./scrapeHtml');
const parseHtml = require('./parseHtml');
const resolveNames = require('./resolveNames');

const main = async (event) => {
  const htmlContent = await scrapeHtml('wolves+vs+manchester+united+august+2023');
  const outcome = parseHtml(htmlContent);
  const resolvedNameOutcome = resolveNames(['wolves', 'manchester united'], outcome);
  return resolvedNameOutcome;
};

main()
  .then((res) => {
    console.log(res);
    process.exit();
  })
  .catch((e) => {
    console.log('error', e);
  })
