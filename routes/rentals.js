const express = require("express");
const router = express.Router();
const { Rental, validate } = require("../models/rentals");
const { Movie } = require("../models/movies");
const { Customer } = require("../models/customers");
const Fawn = require("fawn");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");

Fawn.init(mongoose);
router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const rentals = await Rental.find();
    res.send(rentals);
  } catch (error) {
    console.log("error: " + error.message);
  }
});

// router.get("/:id", async (req, res) => {
//   try {
//     const genre = await Genre.findById(req.params.id);
//     if (!genre)
//       return res.status(404).send("genre with given id was not found");

//     res.send(genre);
//   } catch (error) {
//     console.log("error: " + error.message);
//   }
// });

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send("invalid movie id");
  if (movie.numberInStock < 1) res.status(400).send("movie out of stock");

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send("invalid customer id");

  let rental = new Rental({
    customer: customer,
    movie: movie,
    date: req.body.date,
  });

  try {
    // all operations are treated as a unit, if some fail, it will rollback all
    new Fawn.Task() // transaction - can contain multiple operations
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run(); // this is the final method to close the transaction

    res.send(rental);
  } catch (ex) {
    res.status(500).send("something failed");
  }
});

// router.put("/:id", async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const genre = await Genre.findByIdAndUpdate(
//     req.params.id,
//     { name: req.body.name },
//     { new: true }
//   );
//   if (!genre) return res.status(404).send("genre with given id was not found");

//   res.send(genre);
// });

// router.delete("/:id", async (req, res) => {
//   const genre = await Genre.findByIdAndDelete(req.params.id);

//   if (!genre) return res.status(404).send("Genre not found");

//   res.send(genre);
// });

module.exports = router;
