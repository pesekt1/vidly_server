const config = require("config");

module.exports = function () {
  //check if jwtPrivateKey environment variable is defined:
  if (!config.get("jwtPrivateKey")) {
    throw new Error("error: jwtPrivateKey is not defined");
  }
};
