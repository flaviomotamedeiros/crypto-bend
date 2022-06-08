const mongoose = require('mongoose')
require('dotenv').config()

const connectionURL = process.env.MONGODB_URL
mongoose.connect(connectionURL, {
  useNewUrlParser: true
})

const dbConnection = mongoose.connection;
dbConnection.on("error", (err) => console.log(`Connection error: ${err}`));
dbConnection.once("open", () => console.log("Connected to DB!"));
