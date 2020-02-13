const mongoose = require("mongoose");

module.exports = function(req, res, next) {
  //if invalid ObjectId - return status 404
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("invalid id");

  //if valid ObjectId pass control to the next middleware function
  next();
};
