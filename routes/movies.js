const express = require("express");
const router = express.Router();
const { Movie, validate } = require("../models/movies");
const { Genre } = require("../models/genres");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const admin = require("../middleware/admin");

router.use(express.json());

router.get("/", async (req, res) => {
  // #swagger.tags = ['Movies']

  try {
    const movies = await Movie.find();
    res.send(movies);
  } catch (error) {
    console.log("error: " + error.message);
  }
});

//middleware validateObjectId - we cannot access random id like movies/2
router.get("/:id", validateObjectId, async (req, res) => {
  // #swagger.tags = ['Movies']

  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie)
      return res.status(404).send("movie with given id was not found");
    res.send(movie);
  } catch (error) {
    console.log("error: " + error.message);
  }
});

router.post("/", auth, async (req, res) => {
  // #swagger.tags = ['Movies']

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send("invalid genre");

  const movie = new Movie({
    title: req.body.title,
    genre: genre,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  try {
    await movie.save();
    res.send(movie);
  } catch (error) {
    console.log("error: " + error.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  // #swagger.tags = ['Movies']

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

//middleware: auth - checks jwt, if ok it goes to admin middleware
//checks if user isAdmin
router.delete("/:id", [auth, admin], async (req, res) => {
  // #swagger.tags = ['Movies']

  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie) return res.status(404).send("Movie not found");

  res.send(movie);
});

module.exports = router;
