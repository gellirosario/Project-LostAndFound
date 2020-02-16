const express = require('express');
const cors = require('cors'); // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
const mongoose = require('mongoose');

require('dotenv').config(); // environment var. in dotenv file

const app = express();
const port = process.env.PORT || 5000; // port number

app.use(cors()); 
app.use(express.json()); // parse json as db server uses json

const uri = process.env.ATLAS_URI; // database url stored in .env file
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const gameRecordRouter = require('./routes/gamerecord'); 

app.use('/record', gameRecordRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`); // start server
});