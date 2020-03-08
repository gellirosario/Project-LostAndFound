const router = require('express').Router();
let GameRecord = require('../models/GameRecord');
let User = require("../models/User");
let Game = require('../models/Game');
const { ObjectID } = require('mongodb');

const dict = {
            "CardMatch":["5e57968f64000fb4ecc0c365","flips","time"],
            "WhackAMole":["5e5796a364000fb4ecc0c366","score","time"],
            "SimonSays":["5e5796ab64000fb4ecc0c367","score"]};


//count of all game records
router.route('/').get((req, res) => {
    //GameRecord.find()
      GameRecord.find()
      .then(gameRecord => res.json(gameRecord))
      .catch(err => res.status(400).json('Error: ' + err));
  });


//find all record of one game one user sort by measurement(descending)
router.route('/:gameName/:userId').get((req, res) => {
    const gameName = String(req.params.gameName)
    console.log(gameName)
    sort_dict = {}
    sort_keys = dict[gameName].slice(1,)
    console.log(sort_keys)
    sort_keys.forEach(element => {
        sort_dict[element] = -1
    });
      GameRecord.find({"gameId":ObjectID(dict[gameName][0]),"userId": req.params.userId}).sort(sort_dict)
      .then(gameRecord => res.json(gameRecord))
      .catch(err => res.status(400).json('Error: ' + err));
  });


//number of record of userId and gameId
router.route('/:gameName/:userId/count').get((req, res)=>{
    const gameName = String(req.params.gameName)
    console.log(gameName)
    sort_dict = {}
    sort_keys = dict[gameName].slice(1,)
    console.log(sort_keys)
    sort_keys.forEach(element => {
        sort_dict[element] = -1
    });

    const userId= req.params.userId;
    GameRecord.find({"gameId":ObjectID(dict[gameName][0]),"userId": req.params.userId}).count()
    // GameRecord.aggregate([
    //        {$match :{"userId" : ObjectID(userId),"gameId":ObjectID(dict[gameName][0])}},
    //        { $group: { _id: {gameId:"gameId"}, count: { $sum: "score" } } }
    // ])
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