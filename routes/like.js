const express = require("express");

const likeController = require("../controllers/like");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post("/:movieId/likes", isAuth, likeController.createLike);

router.delete("/:movieId/likes", isAuth, likeController.deleteLike);

module.exports = router;
