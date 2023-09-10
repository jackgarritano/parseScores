const cheerio = require("cheerio");
// var fs = require('fs');

// require.extensions['.html'] = function (module, filename) {
//     module.exports = fs.readFileSync(filename, 'utf8');
// };

// const htmlString = require("../website_content.html");

function parseScore(htmlString) {
	const $ = cheerio.load(htmlString);
	const matchTable = extractTable($);
	let outcome = parseScoreObj($, matchTable);
	if (outcome[0]["score"] === "" || outcome[1]["score"] === "") {
		throw new Error("At least one score is empty");
	}
	if (/\D/.test(outcome[0]["score"]) || /\D/.test(outcome[1]["score"])) {
		throw new Error("Score contains non-digit characters");
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
	// const score = $(cells[1])
	// 	.find(".spl-highlightScore-postgame")
	// 	.text()
	// 	.replaceAll(" ", "");
  const score = getScore($, cells);
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
/*
Tries a couple different ways of pulling the score from the 
second cell
*/
function getScore($, cells) {
	const correctScore = /^\d+-\d+$/;
	let score = $(cells[1])
		.find(".spl-highlightScore-postgame")
		.text()
		.replaceAll(" ", "");
	if (correctScore.test(score)) {
		return score;
	}
	score = $(cells[1]).children().last().text().replaceAll(" ", "");
	if (correctScore.test(score)) {
		return score;
	}
	$(cells[1])
		.children()
		.each((index, element) => {
			let elementText = $(element).text().replaceAll(" ", "");
      if (correctScore.test(elementText)) {
        return elementText;
      }
		});
  return '';
}

module.exports = parseScore;
