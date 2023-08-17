const stringSimilarity = require("string-similarity");

function resolveNames(reqStrs, outcome) {
  //currently would only work with 2 teams
  if (outcome[0]["name"] == outcome[1]["name"]) {
    throw new Error('Scraped names are equal');
  }
  const stringMap = compareAll(
    reqStrs,
    [outcome[0]["name"], outcome[1]["name"]],
    compareTwoDice
  );
  outcome[0]["name"] = stringMap[outcome[0]["name"]];
  outcome[1]["name"] = stringMap[outcome[1]["name"]];
  return outcome;
}

function compareAll(reqStrs, scrapedStrs, compareTwoFn) {
  //compareTwoFn is any function which takes two strings and outputs a score where higher means more similar
  let stringMap = {};
  let minScore =
    compareTwoFn(reqStrs[0], scrapedStrs[0]) +
    compareTwoFn(reqStrs[1], scrapedStrs[1]);
  stringMap[scrapedStrs[0]] = reqStrs[0];
  stringMap[scrapedStrs[1]] = reqStrs[1];
  if (
    compareTwoFn(reqStrs[0], scrapedStrs[1]) +
      compareTwoFn(reqStrs[1], scrapedStrs[0]) >
    minScore
  ) {
    stringMap[scrapedStrs[0]] = reqStrs[1];
    stringMap[scrapedStrs[1]] = reqStrs[0];
  }
  return stringMap;
}

function compareTwoDice(str1, str2) {
  //normalize the strings
  str1 = str1.toLowerCase();
  str1 = str1.replace(/[^a-zA-Z0-9 ]/g, "");
  str2 = str2.toLowerCase();
  str2 = str2.replace(/[^a-zA-Z0-9 ]/g, "");
  const score = stringSimilarity.compareTwoStrings(str1, str2);
  console.log(`dice: ${str1} vs ${str2}: ${score}`);
  return score;
}

function compareTwoLevenshtein(str1, str2) {
  //calculate similarity between strings (credit andres.hedges.name)
  function levenshteinenator(a, b) {
    var cost;
    var m = a.length;
    var n = b.length;

    // make sure a.length >= b.length to use O(min(n,m)) space, whatever that is
    if (m < n) {
      var c = a;
      a = b;
      b = c;
      var o = m;
      m = n;
      n = o;
    }

    var r = [];
    r[0] = [];
    for (var c = 0; c < n + 1; ++c) {
      r[0][c] = c;
    }

    for (var i = 1; i < m + 1; ++i) {
      r[i] = [];
      r[i][0] = i;
      for (var j = 1; j < n + 1; ++j) {
        cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        r[i][j] = minimator(
          r[i - 1][j] + 1,
          r[i][j - 1] + 1,
          r[i - 1][j - 1] + cost
        );
      }
    }

    const score = r[r.length - 1][r[0].length - 1]; //last number in the matrix is the lev score
    return score;
  }

  function minimator(x, y, z) {
    if (x <= y && x <= z) return x;
    if (y <= x && y <= z) return y;
    return z;
  }

  //normalize the strings
  str1 = str1.toLowerCase();
  str1 = str1.replace(/[^a-zA-Z0-9 ]/g, "");
  str2 = str2.toLowerCase();
  str2 = str2.replace(/[^a-zA-Z0-9 ]/g, "");

  const score = 1 / levenshteinenator(str1, str2); //return inverse of the lev score so that higher is better so that it is interchangeable with the string-similarity library
  console.log(`lev: ${str1} vs ${str2}: ${score}`);
  return score;
}

module.exports = resolveNames;
