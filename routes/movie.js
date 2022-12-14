const express = require("express");

const movieController = require("../controllers/movie");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", isAuth, movieController.getMovies);

router.post("/", isAuth, movieController.createMovie);

router.get("/:movieId/related-movies", isAuth, movieController.getMoviesGenre);

router.put("/:movieId/visits", isAuth, movieController.setMovieVisits);

router.get("/movies-popular", isAuth, movieController.getMoviesPopular);

router.get("/:movieId", isAuth, movieController.getMovie);

module.exports = router;
