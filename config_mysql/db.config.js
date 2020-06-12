module.exports = {
  HOST: "localhost",
  USER: "vidly",
  PASSWORD: "123456",
  DB: "sql_vidly",
  dialect: "mysql",
  define: {
    timestamps: false,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
