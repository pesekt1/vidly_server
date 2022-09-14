# This is a simple server written with NodeJS: Express framework.

Check out package.json to see what libraries are used

## Databases:

- MySQL Database + sequelize ORM mapping library
- MongoDB Database + mongoose ODM mapping library

## To run it locally:

1. We need to define environmental variable vidly_jwtPrivatekey in the terminal: example:
   $env:vidly_jwtPrivatekey="mySecureKey"

2. We need to run mongod in another terminal window - to have mongoDB server running (unless it is already running in the background)

3. We need the databases: folder databases_dumps.
   
   Mysql connection for localhost is defined in config_mysql/db.config.js
   Make sure there is a sql_vidly database (schema). And that there is a user vidly with access to sql_vidly database.
   
   MongoDB connection is simply mapped in config/default.json

Server is listening on port 3900.

Start the app on localhost and test some APIs:

<http://localhost:3900/api/movies>

<http://localhost:3900/api/genres_sql>

## The app can run on cloud as well:

This is implemented using config library. In the config/ folder, there are json files with configuration.

In the cloud custom-environment-variables.json will be used:
That is where environmental variables are mapped - so they have to be set up in the cloud - for example Heroku.

The same principle is how the application choses the database connections:
- If it runs on the cloud, it will read the environmental variables with connection strings for MongoDB and ClearDB MySQL on Heroku.
- If it runs on localhost, it will connect to the local MySQL and MongoDB.

If there is error, use Heroku CLI to read the full logs:

heroku logs --tail app=vidly-web-server

## Swagger documentation.

- swagger.js
- swagger_output.json

run:
```
node swagger.js
```

This will generate swagger_output.json

In the index.js:

```javascript
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
```

API for swagger documentation:
<http://localhost:3900/swagger>

NOTE: For localhost it works with http protocol but for Heroku we need to use https protocol

We need also swagger for the production version of the app. In our case it runs on Heroku.
Create a new file swagger-for-heroku.js and set it up to generate swagger-output-for-heroku.json.

Now we can switch between them based on the environment variable NODE_ENV:

```javascript
const swaggerUi = require("swagger-ui-express");
const host = config.get("host");
const swaggerFile =
  host === "localhost"
    ? require("./swagger_output.json")
    : require("./swagger_output-for-heroku.json");

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
```

## Security

Authentication is done using JWT - Json web token. If a user logs in successfully, JWT is provided. If a user is admin (isAdmin property is TRUE), user will have more rights. 

The information about if a user is admin is saved in JWT (in the payload).

### Authentication
Endpoint for login:

<http://{HOST}/api/auth>

```javascript
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User } = require("../models/users");

router.use(express.json());

router.post("/", async (req, res) => {
  // #swagger.tags = ['Authentication']

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("invaild email or password");

  //bcrypt will get the original salt and rehash the plain text password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("invaild email or password");

  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
  });

  return schema.validate(req);
}

```

### Authorization
auth middleware:

```javascript
const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  if (!config.get("requiresAuth")) return next();

  const token = req.header("x-auth-token");
  //if client is not logged in
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    //now we add user property to the request
    req.user = decoded; //decoded payload based on jwtPrivateKey
    next(); //pass the request to the next function
  } catch (error) {
    res.status(400).send("invalid token");
  }
}

module.exports = auth;
```

Now if we want to protect some routes, we can use this middleware:

In movie routes:
```javascript
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
```

Before the HTTP post request, the auth middleware is called. If the user is not logged in, the request will be stopped and the user will get 401 error - Access denied. No token provided.

## Tests

- Jest framework
- Supertest library
- Cypress

Install these only for development:
package.json:
```json
  "devDependencies": {
    "cypress": "^9.5.4",
    "jest": "^26.6.3",
    "supertest": "^6.1.3"
  }
```

### Unit tests
- middleware
- models

### Integration tests
- testing the database via the endpoints.

```javascript
//test suite for genres API:
describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index"); //loading server before each test
  });
  afterEach(async () => {
    await server.close(); //closing server after each test
    await Genre.deleteMany({}); // dropping collection genres after each test
  });

  //nested test suite for GET request
  describe("GET /", () => {
    it("should return all genres", async () => {
      const payload = [
        { name: "genre1" },
        { name: "genre2" },
        { name: "genre3" },
      ];

      //populate genres collection in test database
      await Genre.insertMany(payload);
      //payload[0].name = "new genre"; //simulating error

      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body).toMatchObject(payload);
    });
  });
```

Testing mongoDB via GitHub Actions:

https://futurestud.io/tutorials/github-actions-using-mongodb


package.json:

```json
"scripts": {
  "test": "jest --watchAll --verbose --detectOpenHandles",
},
```

If tests dont finish because some async communication is still open, we can force it to exit:
```json
  "scripts": {
    "test": "jest --runInBand --detectOpenHandles --forceExit",
  },
```

### End to end tests with Cypress

Example of end to end test:
```javascript
describe("Login test", () => {
  it("Gives alert when logging in with incorrect password", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();
    cy.get("#username").type("pesek@gmail.com");
    cy.get("#password").type("wrong password");
    cy.get("button").contains("Login").click();
    cy.get(".alert").should("contain", "invaild email or password");
  });
});
```
This will open the browser and run the test. It will open the page, click on Login button, type in the username and password, click on Login button and check if the alert is displayed.

