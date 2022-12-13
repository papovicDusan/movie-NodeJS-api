import isAuth from "../middleware/is-auth";
import express from "express";
import commentController from "../controllers/comment";

const router = express.Router();

router.post("/:movieId/comments", isAuth, commentController.createComment);

router.get("/:movieId/comments", isAuth, commentController.getComments);

export default router;
