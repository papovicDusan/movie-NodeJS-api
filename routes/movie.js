const express = require("express");

const movieController = require("../controllers/movie");

const router = express.Router();

router.get("/", movieController.getMovies);

router.post("/", movieController.createMovie);

router.get("/:movieId", movieController.getMovie);

module.exports = router;
