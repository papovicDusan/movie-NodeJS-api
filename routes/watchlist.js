const express = require("express");

const watchlistController = require("../controllers/watchlist");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post("/", isAuth, watchlistController.createWatchlist);

router.delete("/:watchlistId", isAuth, watchlistController.deleteWatchlist);

router.put("/:watchlistId", isAuth, watchlistController.setWatchlistWatched);

module.exports = router;
