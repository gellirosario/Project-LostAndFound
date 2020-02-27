const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose');
const passport = require("passport");
const bodyParser = require("body-parser");
require('dotenv').config(); 

// Routes
const usersRouter = require("./routes/users");
const gameRouter = require('./routes/game');
const gameRecordRouter = require('./routes/gamerecord');


const app = express();
const port = process.env.PORT || 5000; // port number

app.use(cors());

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.use(express.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

// Passport middleware
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Passport config
require("./config/passport")(passport);

// Routes
app.use('/users', usersRouter);
app.use('/record', gameRecordRouter);
app.use('/game',gameRouter)

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`); // start server
});
