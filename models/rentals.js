const mongoose = require("mongoose");
const { movieSchema } = require("./movies");
const { customerSchema } = require("./customers");
const Joi = require("@hapi/joi");

// const rentalSchema = new mongoose.Schema({
//   customer: customerSchema,
//   movie: movieSchema,
//   date: { type: Date, default: Date.now }
// });
//class based on our schema compiled into a model
// const Rental = mongoose.model("Rental", rentalSchema);

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50
        },
        isGold: {
          type: Boolean,
          default: false
        },
        phone: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50
        }
      }),
      required: true
    },
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minlength: 5,
          maxlength: 255
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 255
        }
      }),
      required: true
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now
    },
    dateReturned: {
      type: Date
    },
    rentalFee: {
      type: Number,
      min: 0
    }
  })
);

function validate(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
    //date: date()
  });

  return schema.validate(rental);
}

module.exports.Rental = Rental;
module.exports.validate = validate;
