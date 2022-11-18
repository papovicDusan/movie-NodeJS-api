const express = require("express");

const commentController = require("../controllers/comment");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post("/", isAuth, commentController.createComment);

router.get("/movies/:movieId", isAuth, commentController.getComments);

router.get("/:commentId", isAuth, commentController.getComment);

module.exports = router;
