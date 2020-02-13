const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../models/genres");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");
const validateObjectId = require("../middleware/validateObjectId");

router.use(express.json());

router.get("/", async (req, res, next) => {
  // throw new Error("could not get genres");
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre)
      return res.status(404).send("genre with given id was not found");

    res.send(genre);
  } catch (error) {
    console.log("error: " + error.message);
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({ name: req.body.name });
  await genre.save();
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre) return res.status(404).send("genre with given id was not found");

  res.send(genre);
});

//[auth,admin] are middleware functions which will be executed before route handler
router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);

  if (!genre) return res.status(404).send("Genre not found");

  res.send(genre);
});

module.exports = router;
