const cheerio = require("cheerio");

function parseScore(htmlString) {
  const $ = cheerio.load(htmlString);
  const matchTable = extractTable($);
  let outcome = parseScoreObj($, matchTable);
  if(outcome[0]["score"] === '' || outcome[1]["score"] === ''){
    throw new Error('At least one score is empty');
  }
  return outcome;
}

//get the table element that has team names and score
function extractTable($) {
  const matchTable = $(".spl-matchrow");
  return matchTable;
}

function parseScoreObj($, matchTable) {
  let outcome = []; //will end up holding two team objects, each one having a name and a score

  const cells = matchTable.find("td"); //we expect 3 cells: first team, score, second team
  const team1 = $(cells[0]).find(".spl-matchRowTeamName").text().trim();
  const score = $(cells[1])
    .find(".spl-highlightScore-postgame")
    .text()
    .replaceAll(" ", "");
  const team2 = $(cells[2]).find(".spl-matchRowTeamName").text().trim();
  outcome.push({
    name: team1,
    score: score.substring(0, score.indexOf("-")),
  });
  outcome.push({
    name: team2,
    score: score.substring(score.indexOf("-") + 1),
  });

  return outcome;
}

module.exports = parseScore;