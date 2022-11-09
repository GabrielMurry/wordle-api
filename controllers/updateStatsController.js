const User = require("../model/User");

const handleUpdateStats = async (req, res) => {
  const { user, win, loss, guessRow, time } = req.body;
  const name = JSON.parse(user);
  const row = JSON.parse(guessRow);
  const seconds = JSON.parse(time);
  let currentWinStreak;
  let longestWinStreak;
  let bestTimeToWin;
  let timeWinArr = [];
  // finding user's longest win streak to compare to current win streak
  User.findOne({ username: name }, function (err, doc) {
    if (err) {
      console.error(err);
    } else {
      currentWinStreak = doc.stats.currentWinStreak;
      longestWinStreak = doc.stats.longestWinStreak;
      bestTimeToWin = doc.stats.bestTimeToWin;
      timeWinArr = doc.stats.secondsToWinHistory;
    }
  });
  // UPDATING! must determine if user won or loss before updating
  if (win) {
    try {
      const resultMain = await User.updateOne(
        { username: name }, // find user in db
        {
          // update stats
          $inc: {
            "stats.wins": 1,
            "stats.gamesPlayed": 1,
            "stats.currentWinStreak": 1,
          },
          $push: {
            "stats.winLossHistory": true,
            "stats.rowWon": row,
            "stats.secondsToWinHistory": seconds,
          },
        },
        { new: true } // options (confirming to change in db immediately)
      );
      // updating longest win streak (incrementing by 1)
      if (currentWinStreak + 1 > longestWinStreak) {
        await User.updateOne(
          { username: name }, // find user in db
          {
            // update stats
            $inc: {
              "stats.longestWinStreak": 1,
            },
          },
          { new: true } // options (confirming to change in db immediately)
        );
      }
      // updating fastest win time (null being initial default value for new users)
      if (seconds < bestTimeToWin || bestTimeToWin == null) {
        await User.updateOne(
          { username: name },
          {
            $set: {
              "stats.bestTimeToWin": seconds,
            },
          }
        );
      }
      // updating average win time.
      // seconds of game just played used as initial value since timeWinArr is of previous games
      let sum = seconds;
      for (let i = 0; i < timeWinArr.length; i++) {
        sum += timeWinArr[i];
      }
      const avg = sum / (timeWinArr.length + 1); // increase length by 1 since initial length is or previous games (need to include game just played)
      await User.updateOne(
        { username: name },
        {
          $set: {
            "stats.averageTimeToWin": avg,
          },
        }
      );
      console.log(resultMain);
      res.status(200).json({ success: `Stats updated for ${user}!` });
    } catch (err) {
      console.error(err);
    }
  }
  if (loss) {
    try {
      const result = await User.updateOne(
        { username: name },
        {
          $inc: { "stats.losses": 1, "stats.gamesPlayed": 1 },
          $push: { "stats.winLossHistory": false },
          $set: { "stats.currentWinStreak": 0 },
        },
        { new: true }
      );
      console.log(result);
      res.status(200).json({ success: `Stats updated for ${user}!` });
    } catch (err) {
      console.error(err);
    }
  }
};

module.exports = { handleUpdateStats };
