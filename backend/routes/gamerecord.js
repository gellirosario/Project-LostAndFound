const router = require('express').Router();
let GameRecord = require('../models/GameRecord');

router.route('/').get((req, res) => {
    GameRecord.find()
    .then(gameRecord => res.json(gameRecord))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const gameType = req.body.gameType;
  const userId = req.body.userId;
  const score = req.body.score;

  const newGameRecord = new GameRecord({gameType,userId,score});

  newGameRecord.save()
    .then(() => res.json('Game Record added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;