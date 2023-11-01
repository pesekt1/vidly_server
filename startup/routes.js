const express = require("express");
const genresRouter = require("../routes/genres");
const customersRouter = require("../routes/customers");
const moviesRouter = require("../routes/movies");
const rentalsRouter = require("../routes/rentals");
const usersRouter = require("../routes/users");
const authRouter = require("../routes/auth");
const returnsRouter = require("../routes/returns");
//const sql_moviesRouter = require("../routes_mysql/movies_mysql");
const sql_genresRouter = require("../routes_mysql/genres_mysql");
const error = require("../middleware/error"); //error handler

module.exports = function (app) {
  //routers:
  app.use(express.json());
  app.use("/api/genres", genresRouter);
  app.use("/api/customers", customersRouter);
  app.use("/api/movies", moviesRouter);
  app.use("/api/rentals", rentalsRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/returns", returnsRouter);
  //app.use("/api/movies_sql", sql_moviesRouter);
  //app.use("/api/genres_sql", sql_genresRouter);

  app.use(error); // error handler
};
