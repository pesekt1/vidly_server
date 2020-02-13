const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

//We have 2 separate validators here:
// 1) mongoose schema,
// 2) our validate function

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

//class based on our schema compiled into a model
const Genre = mongoose.model("Genre", genreSchema);

function validate(genre) {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .required()
  });

  return schema.validate(genre);
}

module.exports.Genre = Genre;
module.exports.genreSchema = genreSchema;
module.exports.validate = validate;
