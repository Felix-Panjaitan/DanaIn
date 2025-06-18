const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifySignUp } = require("../middlewares");

// Register new user
router.post(
  "/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail],
  authController.signup
);

// User login
router.post("/signin", authController.signin);

module.exports = router;
