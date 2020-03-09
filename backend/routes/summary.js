const router = require('express').Router();
let GameRecord = require('../models/GameRecord');
let User = require("../models/User");
let Game = require('../models/Game');
const { ObjectID } = require('mongodb');

const dict = {
            "5e57968f64000fb4ecc0c365":"flips",
            "5e5796a364000fb4ecc0c366":"score",
            "5e5796ab64000fb4ecc0c367":"score"};

            

//count of all game records
router.route('/').get((req, res) => {
    //GameRecord.find()
      GameRecord.find()
      .then(gameRecord => res.json(gameRecord))
      .catch(err => res.status(400).json('Error: ' + err));
  });


// find all record  of one game one user sort by measurement(descending)
router.route('/:gameId').get((req, res) => {
    const gameId = String(req.params.gameId)
    // console.log(gameName)
    sort_dict = {}
    sort_key = dict[gameId]
    console.log(sort_key)
    // sort_keys.forEach(element => {
    //     sort_dict[element] = -1
    // });
    // console.log(sort_dict)
      GameRecord.find({"gameId":ObjectID(req.params.gameId)}).sort(sort_key)
      .then(gameRecord => res.json(gameRecord))
      .catch(err => res.status(400).json('Error: ' + err));
  });


//number of record of userId and gameId
router.route('/:gameId/count').get((req, res)=>{
    GameRecord.find({"gameId":ObjectID(req.params.gameId)}).count()
      .then(gameRecord => res.json(gameRecord))
      .catch(err => res.status(400).json('Error: ' + err));
})
  
//get how many times user play this game
// router.route('/:userId').get((req, res) => {
//     //GameRecord.find()
//     const userId= req.params.userId;
//       GameRecord.find({"userId": ObjectID(userId)})
//       .then(gameRecord => res.json(gameRecord))
//       .catch(err => res.status(400).json('Error: ' + err));
//   });


// router.route('/:userId/count').get((req, res)=>{
//     const gameId = req.params.gameName;

//     GameRecord.find({"gameId": ObjectID(gameId) }).count()
//         .then(gameRecord => res.json(gameRecord))
//         .catch(err => res.status(400).json('Error: ' + err));
// })


module.exports = router;