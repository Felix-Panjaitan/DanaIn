const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authJwt } = require("../middlewares");

// Apply authentication middleware
router.use(authJwt.verifyToken);

// Get user profile
router.get("/profile", userController.getProfile);

// Update user profile
router.put("/profile", userController.updateProfile);

// Change password
router.put("/change-password", userController.changePassword);

module.exports = router;
