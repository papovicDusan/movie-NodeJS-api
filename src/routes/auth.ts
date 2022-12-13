import isAuth from "../middleware/is-auth";
import express from "express";
import authController from "../controllers/auth";

const router = express.Router();

router.post("/users", authController.signup);

router.post("/login", authController.login);

router.get("/users/me", isAuth, authController.getUser);

export default router;
