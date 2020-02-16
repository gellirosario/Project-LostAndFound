const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  birthday: {
    type: Date,
    required: true,
    index: true
  },
  //Just calculate using birthday or smth - this one is for stats/report purposes?
  age: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  }
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;