const express = require("express");
const app = express();
const winston = require("winston");

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

require("./startup/log")(); //logger - before other modules, so that we get logs
require("./startup/cors.js")(app); //cors package - to be able to communicate between different ports and send headers
require("./startup/routes")(app); // we are calling the method defined in startup/routes.js
require("./startup/db")(); //running startup/db.js function
//require("./startup/db_mysql")(); //running startup/db.js function
require("./startup/config")(); //configuration check
require("./startup/validation")(); //validation using Joi
require("./startup/prod")(app); //packages for production

//simulating unhandledRejection:
// const p = Promise.reject(new Error("Something went wrong miserably. "));
// p.then(() => console.log(p));

// we dont call catch() so we will get unhandled rejection
// we also dont use await ... try-catch block

//simulating uncaughtException:
//throw new Error("Something failed during startup. ");

//port listening:
const port = process.env.PORT || 3900;
const server = app.listen(port, () =>
  winston.info(`listening on port ${port}...`)
);

module.exports = server;
