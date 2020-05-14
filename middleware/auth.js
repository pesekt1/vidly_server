const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
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
