const User = require("../model/User");

const getWinPercentage = (wins, gamesPlayed) => {
  return ((wins / gamesPlayed) * 100).toFixed(2);
};

const getAccurateWinTime = (time) => {
  let timeArr = [];
  let placementCount = 1;
  while (time >= 60) {
    time = time / 60;
    placementCount++;
  }
  for (let i = 0; i < placementCount; i++) {
    let num = time;
    num = Math.floor(num);
    timeArr.push(num);
    time = time - num;
    time = time * 60;
  }
  return timeArr;
};

const getAvgWinTime = (timesArr) => {
  let sum = 0;
  timesArr.forEach((num) => {
    sum += num;
  });
  const avgTime = getAccurateWinTime(sum / timesArr.length);
  return avgTime;
};

const getFastestWinTime = (timesArr) => {
  if (timesArr.length === 0) {
    return -1;
  }
  let fastest = timesArr[0];
  timesArr.forEach((num) => {
    if (num < fastest) {
      fastest = num;
    }
  });
  const fastestTime = getAccurateWinTime(fastest);
  return fastestTime;
};

const getDidWin = (winLossHistory) => {
  return winLossHistory[winLossHistory.length - 1];
};

const getRowDataChart = (rowWonArr) => {
  const rowData = [
    {
      row: 1,
      wins: 0,
    },
    {
      row: 2,
      wins: 0,
    },
    {
      row: 3,
      wins: 0,
    },
    {
      row: 4,
      wins: 0,
    },
    {
      row: 5,
      wins: 0,
    },
    {
      row: 6,
      wins: 0,
    },
  ];
  rowWonArr.forEach((row) => {
    rowData[row - 1].wins++;
  });
  return rowData;
};

const formulateStats = (stats) => {
  const winPercentage = getWinPercentage(stats.wins, stats.gamesPlayed);
  const winTime = getAccurateWinTime(
    stats.secondsToWinHistory[stats.secondsToWinHistory.length - 1]
  );
  const avgWinTime = getAvgWinTime(stats.secondsToWinHistory);
  const fastestWinTime = getFastestWinTime(stats.secondsToWinHistory);
  const didWin = getDidWin(stats.winLossHistory);
  const rowData = getRowDataChart(stats.rowWon);
  return {
    winPercentage,
    winTime,
    avgWinTime,
    fastestWinTime,
    didWin,
    rowData,
  };
};

const handleGetStats = async (req, res) => {
  const name = JSON.parse(req.query.user);
  User.findOne({ username: name }, function (err, doc) {
    if (err) {
      console.error(err);
    } else {
      const additionalStats = formulateStats(doc.stats);

      res.json({ ...doc, additionalStats });
    }
  });
};

module.exports = { handleGetStats };
