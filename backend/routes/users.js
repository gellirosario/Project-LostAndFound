const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../validations/register");
const validateLoginInput = require("../validations/login");
const validateEditInput = require("../validations/edit");

// Load User model
const User = require("../models/User");


router.route('/:_id').get((req, res) => {
  User.findOne({ _id: (req.params._id) })
    .then(userid => res.json(userid))
    .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error:' + err));
}); 


// Edit profile
router.put("/edit", (req, res) => {
  const { errors, isValid } = validateEditInput(req.body);

  if (!isValid){
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user && req.body.id !== user.id) {
      return res.status(400).json({ email: "Email already registered to another user"});
    } else {
      console.log(req.body);

      //Hash new password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw err;
          req.body.password = hash;
          console.log(req.body);
          
          User.findByIdAndUpdate(req.body.id, {
            $set: {
              name: req.body.name,
              email: req.body.email,
              password: req.body.password
            }
          }, {new: true},
          (err,Event) => {
            if (err) throw err;
            res.json({ success: true });
          });
        });
      });
    }
  });
});

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  
  // Form validatinpon
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        userType: "User"
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ email: "Email not found" });
    }

    

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ password: "Password incorrect" });
      }
    });
  });
});

module.exports = router;