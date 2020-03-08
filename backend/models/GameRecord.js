const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gameRecordSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    gameId: {
        type: Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
    },
    score: {
        type: Number,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        }
    },
    reactionTime:{
        type: Number,
    },
    totalTime:{
        type: Number,
    },
    flips:{
        type: Number,
    },
    difficulty:{
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const GameRecord = mongoose.model('GameRecord', gameRecordSchema);

module.exports = GameRecord;