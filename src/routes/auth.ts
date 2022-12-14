import isAuth from "../middleware/is-auth";
import express from "express";
import authController from "../controllers/auth";
import { tryCatch } from "../utils/try-catch";

const router = express.Router();

router.post("/users", tryCatch(authController.signup));

router.post("/login", tryCatch(authController.login));

router.get("/users/me", isAuth, tryCatch(authController.getUser));

export default router;
