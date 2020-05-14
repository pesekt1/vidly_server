module.exports = function (req, res, next) {
  //req.user will be set by auth so the pipeline is: ... auth -> admin -> ...
  //403 Forbidden - if jwt is valid but the user does not have rights
  if (!req.user.isAdmin) return res.status(403).send("Access denied");
  next();
};
