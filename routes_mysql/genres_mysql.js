const express = require("express");
const router = express.Router();
const genres = require("../controllers_mysql/genre.controller");

// Retrieve all genres
router.get("/", genres.findAll);

// Create a new genre
router.post("/", genres.create);

// Retrieve all published genres
router.get("/published", genres.findAllPublished);

// Retrieve a single genre with id
router.get("/:id", genres.findOne);

// Update a genre with id
router.put("/:id", genres.update);

// Delete a genre with id
router.delete("/:id", genres.delete);

// Create a new genre
router.delete("/", genres.deleteAll);

module.exports = router;
