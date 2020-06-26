const dbConfig = require("../config_mysql/db.config");
const Sequelize = require("sequelize");

function connect() {
  let sequelize = {};
  if (process.env.NODE_ENV == "production") {
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
