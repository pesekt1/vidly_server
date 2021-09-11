const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output-for-heroku.json";
const endpointsFiles = ["./startup/routes.js"];

const doc = {
  // info: General information about the API, such as: version, title and description.
  info: {
    version: "1.0.0",
    title: "Vidly server API",
    description: "Documentation for vidly server API",
  },
  // host: Path and port where your API will start.
  host: "vidly-web-server.herokuapp.com",
  // basePath: This is the root of your project.
  basePath: "/",
  // schemes: These are the protocols used.
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "Customers",
      description: "CRUD for customers",
    },
    {
      name: "Authentication",
      description: "Authentication for the different types: user / admin",
    },
    {
      name: "Genres",
      description: "CRUD for genres",
    },
    {
      name: "Movies",
      description: "CRUD for movies",
    },
    {
      name: "Rentals",
      description: "CRUD for rentals",
    },
    {
      name: "Genres - MySQL",
      description: "CRUD for genres - MySQL",
    },
  ],
  definitions: {
    LoginUser: {
      login: {
        email: "user1@gmail.com",
        password: "user1password",
      },
    },
  },
};

// rewrites the swagger_output file each time we run it with "node swagger.js"
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./index.js");
});
