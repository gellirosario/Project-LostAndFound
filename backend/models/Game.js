const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Game Schema
const GameSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

module.exports = Game = mongoose.model("game", GameSchema);