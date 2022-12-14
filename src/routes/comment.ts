import isAuth from "../middleware/is-auth";
import express from "express";
import commentController from "../controllers/comment";
import { tryCatch } from "../utils/try-catch";

const router = express.Router();

router.post(
  "/:movieId/comments",
  isAuth,
  tryCatch(commentController.createComment)
);

router.get(
  "/:movieId/comments",
  isAuth,
  tryCatch(commentController.getComments)
);

export default router;
