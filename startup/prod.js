const helmet = require("helmet");
const compression = require("compression");

module.exports = function(app) {
  console.log("prod module");
  app.use(helmet());
  app.use(compression());
};
