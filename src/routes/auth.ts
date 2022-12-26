import isAuth from "../middleware/is-auth";
import express from "express";
import authController from "../controllers/auth";
import { tryCatch } from "../utils/try-catch";
import {
  validationLoginData,
  validationUserData,
} from "../middleware/validation";

const router = express.Router();

router.post("/users", validationUserData, tryCatch(authController.signup));

router.post("/login", validationLoginData, tryCatch(authController.login));

router.get("/users/me", isAuth, tryCatch(authController.getUser));

export default router;
