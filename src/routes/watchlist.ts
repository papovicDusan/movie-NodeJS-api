import isAuth from "../middleware/is-auth";
import express from "express";
import watchlistController from "../controllers/watchlist";
import { tryCatch } from "../utils/try-catch";

const router = express.Router();

router.post("/", isAuth, tryCatch(watchlistController.createWatchlist));

router.delete(
  "/:watchlistId",
  isAuth,
  tryCatch(watchlistController.deleteWatchlist)
);

router.put(
  "/:watchlistId",
  isAuth,
  tryCatch(watchlistController.setWatchlistWatched)
);

export default router;
