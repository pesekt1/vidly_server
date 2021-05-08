const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

module.exports = function () {
  //connection to database - its async ... promise
  //we load the connection string dynamically using config.get("db")
  const db = config.get("db");
  mongoose
    .connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => winston.info(`connected to ${db}`));

  //otherwise there is some deprecation warning
  mongoose.set("useCreateIndex", true);
  mongoose.set("useFindAndModify", false);

  //showing mongoose queries
  mongoose.set("debug", true);
};
