const dbConfig = require("../config_mysql/db.config");
const Sequelize = require("sequelize");
const config = require("config");

//refactor this - repetitive code, possibly move the function somewhere else
function connect() {
  let sequelize = {};
  const env = config.get("env");
  if (env == "production") {
    const db = config.get("mysql_db");
    sequelize = new Sequelize(db, {
      dialect: dbConfig.dialect,
      operatorsAliases: false,

      pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
      },
    });
  } else {
    sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
      host: dbConfig.HOST,
      dialect: dbConfig.dialect,
      operatorsAliases: false,

      pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
      },
    });
  }
  return sequelize;
}

const sequelize = connect();
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.genres = require("./genre_mysql")(sequelize, Sequelize);

module.exports = db;
