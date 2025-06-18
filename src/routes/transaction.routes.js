const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");
const { authJwt } = require("../middlewares");

// Apply authentication middleware to all transaction routes
router.use(authJwt.verifyToken);

// Get all user transactions
router.get("/", transactionController.getUserTransactions);

// Get a single transaction
router.get("/:id", transactionController.getTransactionById);

// Create a new transaction
router.post("/", transactionController.createTransaction);

module.exports = router;
