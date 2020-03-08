const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require("passport");
const bodyParser = require("body-parser");
const { Translate } = require("@google-cloud/translate").v2;
const Chatkit = require("@pusher/chatkit-server");
require('dotenv').config();

// Routes
const usersRouter = require("./routes/users");
const gameRouter = require('./routes/game');
const gameRecordRouter = require('./routes/gamerecord');
const summaryRouter = require('./routes/summary');

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
app.use('/game', gameRouter);
app.use('/summary',summaryRouter);

// Initialises chatkit client
const chatkit = new Chatkit.default({
  instanceLocator: process.env.VUE_APP_CHATKIT_INSTANCE_LOCATOR,
  key: process.env.CHATKIT_SECRET_KEY
})

// Instantiates a client
const translate = new Translate({
  projectId: process.env.YOUR_PROJECT_ID,
});

// BOT - TRANSLATE
app.post("/translate", async (req, res) => {
  const messages = req.body.payload.messages;
  const data = extractData(messages[0]["parts"][0]["content"]);
  //const room_id = req.body.payload.messages[0]["room_id"];

  // Retrun response early - see https://pusher.com/docs/chatkit/webhooks#retry-strategy
  res.sendStatus(200);

  if (data) {
    const { text, language } = data;

    const langCode = await getLanguageCode(language);

    if (!langCode) {
      trbotSendMessage("95130309-e65d-47f6-a9df-39b76f41600c", "Sorry, you need to pass in a valid language");
    }

    const translation = await translate.translate(text, langCode);

    trbotSendMessage("95130309-e65d-47f6-a9df-39b76f41600c", translation[0]);
  }
});

// CHAT - GET ROOMS
app.get("/get_rooms", (req, res) => {
  chatkit
    .getRooms({})
    .then(rooms => {
      res.status(200).send({
        status: "success",
        data: rooms
      });
    })
    .catch(err => {
      res.status(200).send({
        status: "error",
        message: err
      });
    });
});

// CHAT - FUNCTION (LANGUAGE CODE)
async function getLanguageCode(lang) {
  const [languages] = await translate.getLanguages();

  var foundLang = languages.find(language => {
    return (
      language.code === lang.toLowerCase() ||
      language.name.toLowerCase() === lang.toLowerCase()
    );
  });

  return foundLang ? foundLang.code : false;
}

// CHAT - FUNCTION (EXTRACT MSG)
function extractData(data) {
  const regex = /(@trbot)\s+translate.*['"](.+)['"].*to\W*(\w+)/gim;

  const found = regex.exec(data);

  if (!found || found.length < 4) {
    return false;
  }

  return { text: found[2], language: found[3] };
}

// BOT - FUNCTION (SEND MSG)
function trbotSendMessage(roomId, message) {
  return chatkit.sendSimpleMessage({
    userId: "trbot",
    roomId: roomId,
    text: message
  });
}

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`); // start server
});
