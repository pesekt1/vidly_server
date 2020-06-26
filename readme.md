## This is a simple server written with NodeJS: Express framework.

Connected to MySQL Database via sequelize ORM library
Connected to MongoDB Database via mongoose ORM library

## To run it locally:

1. We need to define environmental variable vidly_jwtPrivatekey in the terminal:
   \$env:vidly_jwtPrivatekey="mySecureKey"

2. We need to run mongod in another terminal window - to have mongoDB server running

3. Of course we need the databases:
   Mysql connection for localhost is defined in config_mysql/db.config.js
   MongoDB connection is simply mapped in config/default.json

Server is listening on port 3900.

Start the app on localhost and test some APIs:
http://localhost:3900/api/movies

## The app can run on cloud as well:

This is implemented using config library. In the config/ folder, there are json files with configuration.
In the cloud custom-environment-variables.json will be used:
That is where environmental variables are mapped - so they have to be set up in the cloud - for example Heroku.
The same principle is how the application choses the database connections:
If it runs on the cloud, it will read the environmental variables with connection strings for MongoDB and ClearDB MySQL on Heroku.
If it runs on localhost, it will connect to the local MySQL and MongoDB.
