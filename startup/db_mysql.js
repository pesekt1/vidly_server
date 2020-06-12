const dbConfig = require("../config_mysql/db.config");
const Sequelize = require("sequelize");
const winston = require("winston");
db = require("../models_mysql/db_mysql");

module.exports = function () {
  db.sequelize
    .authenticate()
    .then(function (err) {
      winston.info(`connected to ${dbConfig.DB}`);
    })
    .catch(function (err) {
      winston.info(`connected to ${dbConfig.DB}`);
    });

  db.sequelize.sync(); //here we can change the schema in mysql database via sequelize models
};
