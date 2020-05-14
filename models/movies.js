const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const { genreSchema } = require("./genres");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: genreSchema, //subdocument genre
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: Number,
});

//class based on our schema compiled into a model
const Movie = mongoose.model("Movie", movieSchema);

function validate(movie) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number(),
  });

  return schema.validate(movie);
}

module.exports.Movie = Movie;
module.exports.movieSchema = movieSchema;
module.exports.validate = validate;
