const mongoose = require("mongoose");

const PaymentMethodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["CREDIT_CARD", "DEBIT_CARD", "BANK_ACCOUNT"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  lastFour: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: String,
    required: function () {
      return this.type === "CREDIT_CARD" || this.type === "DEBIT_CARD";
    },
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PaymentMethod = mongoose.model("PaymentMethod", PaymentMethodSchema);
module.exports = PaymentMethod;
