const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const { authJwt } = require("../middlewares");

// Apply authentication middleware
router.use(authJwt.verifyToken);

// Get all notifications
router.get("/", notificationController.getNotifications);

// Mark notification as read
router.put("/:id/read", notificationController.markAsRead);

// Mark all notifications as read
router.put("/read-all", notificationController.markAllAsRead);

module.exports = router;
