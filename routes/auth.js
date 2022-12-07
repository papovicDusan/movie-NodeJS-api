const express = require("express");

const authController = require("../controllers/auth");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post("/users", handleAsync(authController.signup));

router.post("/login", authController.login);

router.get("/users/me", isAuth, authController.getUser);

const handleAsync = async (callback) => {
  try {
    await callback();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = router;
