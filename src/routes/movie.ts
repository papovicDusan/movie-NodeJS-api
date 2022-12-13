import isAuth from "../middleware/is-auth";
import express from "express";
import movieController from "../controllers/movie";

const router = express.Router();

router.get("/", isAuth, movieController.getMovies);

router.post("/", isAuth, movieController.createMovie);

router.get("/:movieId/related-movies", isAuth, movieController.getMoviesGenre);

router.put("/:movieId/visits", isAuth, movieController.setMovieVisits);

router.get("/movies-popular", isAuth, movieController.getMoviesPopular);

router.get("/:movieId", isAuth, movieController.getMovie);

export default router;
