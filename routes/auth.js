const express = require("express");

const authController = require("../controllers/auth");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post("/register", authController.signup);

router.post("/login", authController.login);

router.get("/users/me", isAuth, authController.getUser);

module.exports = router;
