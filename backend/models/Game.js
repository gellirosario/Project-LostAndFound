const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const GameSchema = new Schema({
  gameType: {
    type: String,
    required: true
  },
  gameName: {
    type: String,
    required: true
  },
  noOfPlay: {
    type: Number,
    required: true
  },
});

module.exports = Game = mongoose.model("game", GameSchema);