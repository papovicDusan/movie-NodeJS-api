import isAuth from "../middleware/is-auth";
import express from "express";
import likeController from "../controllers/like";

const router = express.Router();

router.post("/:movieId/likes", isAuth, likeController.createLike);

router.delete("/:movieId/likes", isAuth, likeController.deleteLike);

export default router;
