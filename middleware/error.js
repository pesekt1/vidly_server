const winston = require("winston");

module.exports = function (err, req, res, next) {
  //logging
  //error, warn, info, verbose, debug, silly
  winston.error(err.message, err);

  //winston.log("info", info.message);

  //error
  res.status(500).send("Something failed.");
};
