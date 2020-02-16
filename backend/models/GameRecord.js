const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gameRecordSchema = new Schema({
    gameType: {
        type: Number,
        required: true,
        default: 0
    },
    userId: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
        validate : {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer value'
          }
    },

}, { timestamps: true, });

const GameRecord = mongoose.model('GameRecord', gameRecordSchema);

module.exports = GameRecord;