# This is a simple server written with NodeJS: Express framework.

Check out package.json to see what libraries are used

## Databases

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
http://localhost:3900/api/movies
http://localhost:3900/api/genres_sql

## The app can run on cloud as well:

This is implemented using config library. In the config/ folder, there are json files with configuration.

In the cloud custom-environment-variables.json will be used:
That is where environmental variables are mapped - so they have to be set up in the cloud - for example Heroku.

The same principle is how the application choses the database connections:
- If it runs on the cloud, it will read the environmental variables with connection strings for MongoDB and ClearDB MySQL on Heroku.
- If it runs on localhost, it will connect to the local MySQL and MongoDB.

## Swagger documentation

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

## Security

Authentication is done using JWT - Json web token. If a user logs in successfully, JWT is provided. If a user is admin (isAdmin property is TRUE), user will have more rights. 

The information about if a user is admin is saved in JWT (in the payload).

Endpoint for login:

<http://{HOST}/api/auth>

## Tests

- Jest framework
- Supertest library

### Unit tests
- middleware
- models

### Integration tests
- testing the database via the endpoints

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