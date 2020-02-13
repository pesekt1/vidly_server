require("express-async-errors"); //we apply express-async-errors package
const winston = require("winston"); //logger
require("winston-mongodb"); //package for mongoDB logger
config = require("config");

module.exports = function() {
  //subscribing to uncaughtException event:
  //NOTE: its good to implement Console here because its more obvious than to search in a file.
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({
      filename: "logfile.log",
      options: { useUnifiedTopology: true, useNewUrlParser: true }
    })
  );

  //this is alternative to winston.exceptions.handle:
  // process.on("uncaughtException", ex => {
  //   winston.error(ex.message, ex);
  //   process.exit(1); //anything else than 0 means failure
  // });

  //subscribing to unhandledRejection event:
  process.on("unhandledRejection", ex => {
    winston.error(ex.message, ex);
    process.exit(1); //anything else than 0 means failure
  });

  winston.add(
    new winston.transports.File({
      filename: "logfile.log",
      options: { useUnifiedTopology: true, useNewUrlParser: true }
    })
  );

  winston.add(
    new winston.transports.Console({
      options: { useUnifiedTopology: true, useNewUrlParser: true }
    })
  );

  //we load the connection string dynamically using config.get("db")
  const db = config.get("db");

  winston.add(
    new winston.transports.MongoDB({
      db: db,
      level: "info",
      options: { useUnifiedTopology: true, useNewUrlParser: true }
    })
  );
};
