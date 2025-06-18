const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const { authJwt } = require("../middlewares");

// Apply authentication middleware
router.use(authJwt.verifyToken);

// Get dashboard data
router.get("/", dashboardController.getDashboardData);

module.exports = router;
