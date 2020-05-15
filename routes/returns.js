const express = require("express");
const router = express.Router();
const { Rental, validate } = require("../models/rentals");
const { Movie } = require("../models/movies");
const { Customer } = require("../models/customers");
const Fawn = require("fawn");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const moment = require("moment");

router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const rentals = await Rental.find();
    res.send(rentals);
  } catch (error) {
    console.log("error: " + error.message);
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body); //we expect rental object
  if (error) return res.status(400).send(error.details[0].message);

  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });

  if (!rental) return res.status(404).send("invalid rental");

  if (rental.dateReturned)
    return res.status(400).send("rental is already processed");

  //we set the return date for this rental
  rental.dateReturned = new Date();

  //we set rental fee
  rental.rentalFee =
    moment().diff(rental.dateOut, "days") * rental.movie.dailyRentalRate;
  // parseInt(rental.dateReturned - rental.dateOut) *
  // rental.movie.dailyRentalRate;

  await rental.save();

  try {
    res.send(rental); //this will automatically have status 200
  } catch (error) {
    console.log("error: " + error.message);
  }
});

module.exports = router;
