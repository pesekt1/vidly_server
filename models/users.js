const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: String,
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

//class based on our schema compiled into a model
const User = mongoose.model("User", userSchema);

function validate(user) {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .required(),
    email: Joi.string().required(),
    password: Joi.string().min(4)
  });

  return schema.validate(user);
}

module.exports.User = User;
module.exports.userSchema = userSchema;
module.exports.validate = validate;
