const express = require("express");

const commentController = require("../controllers/comment");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post("/:movieId/comments", isAuth, commentController.createComment);

router.get("/:movieId/comments", isAuth, commentController.getComments);

module.exports = router;
