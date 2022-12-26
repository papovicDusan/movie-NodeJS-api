import isAuth from "../middleware/is-auth";
import express from "express";
import commentController from "../controllers/comment";
import { tryCatch } from "../utils/try-catch";
import { validationCommentData } from "../middleware/validation";

const router = express.Router();

router.post(
  "/:movieId/comments",
  isAuth,
  validationCommentData,
  tryCatch(commentController.createComment)
);

router.get(
  "/:movieId/comments",
  isAuth,
  tryCatch(commentController.getComments)
);

export default router;
