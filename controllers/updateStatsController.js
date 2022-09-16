const User = require("../model/User");

const handleUpdateStats = async (req, res) => {
  const { user, win, loss, guessRow, time } = req.body;
  const name = JSON.parse(user);
  const row = JSON.parse(guessRow);
  const seconds = JSON.parse(time);
  if (win) {
    try {
      const result = await User.updateOne(
        { username: name }, // find user in db
        {
          // update stats
          $inc: {
            "stats.wins": 1,
            "stats.gamesPlayed": 1,
            "stats.winStreak": 1,
          },
          $push: {
            "stats.winLossHistory": true,
            "stats.rowWon": row,
            "stats.secondsToWinHistory": seconds,
          },
        },
        { new: true } // options (confirming to change in db immediately)
      );
      console.log(result);
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
          $set: { "stats.winStreak": 0 },
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
