const express = require("express");

const likeController = require("../controllers/like");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post("/", isAuth, likeController.createLike);

router.delete("/movies/:movieId", isAuth, likeController.deleteLike);

module.exports = router;
