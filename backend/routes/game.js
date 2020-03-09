const router = require('express').Router();
let Game = require('../models/Game');

// Get All Games
router.route('/').get((req, res) => {
    Game.find()
    .then(game => res.json(game))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:_id').get((req, res) => {
  Game.findOne({ _id: (req.params._id) })
    .then(userid => res.json(userid))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/find/:name').get((req, res) => {
  Game.findOne({ name: (req.params.name) })
    .then(game => res.json(game))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add Games
router.route('/add').post((req, res) => {
  const type = req.body.type;
  const name = req.body.name;

  const newGame = new Game({type,name});

  newGame.save()
    .then(() => res.json('Game added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;