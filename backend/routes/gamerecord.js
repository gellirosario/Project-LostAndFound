const router = require('express').Router();
let GameRecord = require('../models/GameRecord');
let User = require("../models/User");
let Game = require('../models/Game');

router.route('/').get((req, res) => {
  GameRecord.find()
    .then(gameRecord => res.json(gameRecord))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const gameId = req.body.gameId;
  const userId = req.body.userId;
  const score = req.body.score;
  const reactionTime = req.body.reactionTime;
  const flips = req.body.flips;
  const totalTime = req.body.totalTime;

  // Find user by userId
  User.
    findOne({ _id: (req.params.id) }).
    populate('User').
    exec(function (error, doc) {
      // Find game by gameId
      Game.
        findOne({ _id: (req.params.gameId) }).
        populate('Game').
        exec(function (error, doc) {

          const newGameRecord = new GameRecord({ userId, gameId, score, reactionTime, flips, totalTime});

          newGameRecord.save()
            .then(() => res.json('Game Record added!'))
            .catch(err => res.status(400).json('Error: ' + err));
        });
    });

});

module.exports = router;