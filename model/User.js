const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
    Editor: Number,
    Admin: Number,
  },
  password: {
    type: String,
    required: true,
  },
  stats: {
    gamesPlayed: {
      type: Number,
      default: 0,
    },
    winPercentage: {
      type: Number,
      default: 0,
    },
    wins: {
      type: Number,
      default: 0,
    },
    losses: {
      type: Number,
      default: 0,
    },
    winLossHistory: [Boolean],
    winStreak: {
      type: Number,
      default: 0,
    },
    rowWon: [Number],
    secondsToWinHistory: [Number],
    averageTimeToWin: Number,
    bestTimeToWin: Number,
  },
  refreshToken: String,
  dateCreated: String,
});

module.exports = mongoose.model("User", userSchema);
