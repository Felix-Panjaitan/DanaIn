const db = require("../models");
const Transaction = db.transaction;
const User = db.user;

exports.getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    res.status(200).send(transactions);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!transaction) {
      return res.status(404).send({ message: "Transaction not found" });
    }

    res.status(200).send(transaction);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { amount, type, description, recipientId } = req.body;

    // Start a session for transaction
    const session = await db.mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.findById(req.userId).session(session);

      if (type === "TRANSFER" || type === "PAYMENT") {
        // Check if user has enough balance
        if (user.balance < amount) {
          await session.abortTransaction();
          return res.status(400).send({ message: "Insufficient balance" });
        }

        // Deduct from sender
        await User.findByIdAndUpdate(
          req.userId,
          { $inc: { balance: -amount } },
          { session }
        );

        // Add to recipient if it's a transfer
        if (type === "TRANSFER" && recipientId) {
          await User.findByIdAndUpdate(
            recipientId,
            { $inc: { balance: amount } },
            { session }
          );
        }
      } else if (type === "DEPOSIT") {
        // Add to user balance
        await User.findByIdAndUpdate(
          req.userId,
          { $inc: { balance: amount } },
          { session }
        );
      }

      // Create transaction record
      const transaction = new Transaction({
        userId: req.userId,
        amount: amount,
        type: type,
        description: description,
        recipientId: recipientId || null,
        createdAt: new Date(),
      });

      await transaction.save({ session });
      await session.commitTransaction();

      res.status(201).send(transaction);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
