const db = require("../models");
const PaymentMethod = db.paymentMethod;

exports.getPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find({ userId: req.userId });
    res.status(200).send(paymentMethods);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.addPaymentMethod = async (req, res) => {
  try {
    const { type, name, cardNumber, expiryDate } = req.body;

    // Basic validation
    if (!type || !name || !cardNumber) {
      return res.status(400).send({ message: "Required fields missing" });
    }

    // Check if it's the first payment method (to set as default)
    const existingMethods = await PaymentMethod.countDocuments({
      userId: req.userId,
    });

    const lastFour = cardNumber.slice(-4);

    const paymentMethod = new PaymentMethod({
      userId: req.userId,
      type: type,
      name: name,
      lastFour: lastFour,
      expiryDate: expiryDate,
      isDefault: existingMethods === 0,
    });

    await paymentMethod.save();
    res.status(201).send(paymentMethod);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.setDefaultPaymentMethod = async (req, res) => {
  try {
    const paymentMethodId = req.params.id;

    // Verify payment method belongs to user
    const paymentMethod = await PaymentMethod.findOne({
      _id: paymentMethodId,
      userId: req.userId,
    });

    if (!paymentMethod) {
      return res.status(404).send({ message: "Payment method not found" });
    }

    // Remove default status from all payment methods
    await PaymentMethod.updateMany(
      { userId: req.userId },
      { $set: { isDefault: false } }
    );

    // Set the selected one as default
    paymentMethod.isDefault = true;
    await paymentMethod.save();

    res.status(200).send({ message: "Default payment method updated" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.deletePaymentMethod = async (req, res) => {
  try {
    const paymentMethodId = req.params.id;

    // Verify payment method belongs to user
    const paymentMethod = await PaymentMethod.findOne({
      _id: paymentMethodId,
      userId: req.userId,
    });

    if (!paymentMethod) {
      return res.status(404).send({ message: "Payment method not found" });
    }

    // Check if it's the default payment method
    if (paymentMethod.isDefault) {
      // Find another payment method to set as default
      const anotherPaymentMethod = await PaymentMethod.findOne({
        userId: req.userId,
        _id: { $ne: paymentMethodId },
      });

      if (anotherPaymentMethod) {
        anotherPaymentMethod.isDefault = true;
        await anotherPaymentMethod.save();
      }
    }

    await PaymentMethod.findByIdAndDelete(paymentMethodId);

    res.status(200).send({ message: "Payment method deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
