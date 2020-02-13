const express = require("express");
const app = express();
const winston = require("winston");

require("./startup/cors.js")(app); //cors package - to be able to communicate between different ports and send headers
require("./startup/log")(); //logger
require("./startup/routes")(app); // we are calling the method defined in startup/routes.js
require("./startup/db")(); //running startup/db.js function
require("./startup/config")(); //configuration check
require("./startup/validation")(); //validation using Joi
require("./startup/prod")(app); //packages for production

//simulating unhandledRejection:
// const p = Promise.reject(new Error("Something went wrong miserably."));
// // we dont call cach() so we will get unhandled rejection
// p.then(() => console.log(p));

//simulating uncaughtException:
//throw new Error("Something failed during startup");

//port listening:
const port = process.env.PORT || 3900;
const server = app.listen(port, () =>
  winston.info(`listening on port ${port}...`)
);

module.exports = server;
