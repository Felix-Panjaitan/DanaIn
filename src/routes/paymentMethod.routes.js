const express = require("express");
const router = express.Router();
const paymentMethodController = require("../controllers/paymentMethod.controller");
const { authJwt } = require("../middlewares");

// Apply authentication middleware
router.use(authJwt.verifyToken);

// Get all payment methods
router.get("/", paymentMethodController.getPaymentMethods);

// Add a payment method
router.post("/", paymentMethodController.addPaymentMethod);

// Set default payment method
router.put("/:id/default", paymentMethodController.setDefaultPaymentMethod);

// Delete a payment method
router.delete("/:id", paymentMethodController.deletePaymentMethod);

module.exports = router;
