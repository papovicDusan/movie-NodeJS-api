import isAuth from "../middleware/is-auth";
import express from "express";
import watchlistController from "../controllers/watchlist";

const router = express.Router();

router.post("/", isAuth, watchlistController.createWatchlist);

router.delete("/:watchlistId", isAuth, watchlistController.deleteWatchlist);

router.put("/:watchlistId", isAuth, watchlistController.setWatchlistWatched);

export default router;
