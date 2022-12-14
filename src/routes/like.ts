import isAuth from "../middleware/is-auth";
import express from "express";
import likeController from "../controllers/like";
import { tryCatch } from "../utils/try-catch";

const router = express.Router();

router.post("/:movieId/likes", isAuth, tryCatch(likeController.createLike));

router.delete("/:movieId/likes", isAuth, tryCatch(likeController.deleteLike));

export default router;
