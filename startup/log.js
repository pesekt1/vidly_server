require("express-async-errors"); //we apply express-async-errors package
const winston = require("winston"); //logger
require("winston-mongodb"); //package for mongoDB logger
const config = require("config");

module.exports = function () {
  //winston.exitOnError = false; //if we dont want to exit the process on uncaughtException
  //Subscribing to uncaughtException event:
  process.on("uncaughtException", (ex) => {
    console.log("We got an uncaught exception");
    winston.error(ex.message, ex);
  });

  //subscribing to unhandledRejection event:
  process.on("unhandledRejection", (ex) => {
    console.log("We got an unhandled promise rejection. ");
    winston.error(ex.message, ex);
    process.exit(1); //if we want to exit the proces. Anything else than 0 means failure
  });

  winston.add(
    new winston.transports.File({
      filename: "logfile.log",
      options: { useUnifiedTopology: true, useNewUrlParser: true },
    })
  );

  winston.add(
    new winston.transports.Console({
      options: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      },
    })
  );

  //we load the connection string dynamically using config.get("db")
  const db = config.get("db");

  winston.add(
    new winston.transports.MongoDB({
      db: db,
      level: "info",
      handleExceptions: true,
      options: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      },
    })
  );

  //subscribing to uncaughtException event:
  //NOTE: its good to implement Console here because its more obvious than to search in a file.
  // winston.exceptions.handle(
  //   new winston.transports.Console({ colorize: true, prettyPrint: true }),
  //   new winston.transports.File({
  //     filename: "logfile.log",
  //     options: { useUnifiedTopology: true, useNewUrlParser: true },
  //   })
  // );
};
