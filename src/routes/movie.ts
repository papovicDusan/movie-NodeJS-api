import isAuth from "../middleware/is-auth";
import express from "express";
import movieController from "../controllers/movie";
import { tryCatch } from "../utils/try-catch";
import { validationMovieData } from "../middleware/validation";

const router = express.Router();

router.get("/", isAuth, tryCatch(movieController.getMovies));

router.post(
  "/",
  isAuth,
  validationMovieData,
  tryCatch(movieController.createMovie)
);

router.get(
  "/:movieId/related-movies",
  isAuth,
  tryCatch(movieController.getMoviesGenre)
);

router.put(
  "/:movieId/visits",
  isAuth,
  tryCatch(movieController.setMovieVisits)
);

router.get(
  "/movies-popular",
  isAuth,
  tryCatch(movieController.getMoviesPopular)
);

router.get("/:movieId", isAuth, tryCatch(movieController.getMovie));

export default router;
