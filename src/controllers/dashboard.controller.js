const db = require("../models");
const User = db.user;
const Transaction = db.transaction;

exports.getDashboardData = async (req, res) => {
  try {
    // Get user data
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Get recent transactions
    const recentTransactions = await Transaction.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate spending summary (optional)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlySpending = await Transaction.aggregate([
      {
        $match: {
          userId: req.userId,
          type: { $in: ["PAYMENT", "TRANSFER"] },
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const dashboardData = {
      balance: user.balance,
      recentTransactions: recentTransactions,
      monthlySpending:
        monthlySpending.length > 0 ? monthlySpending[0].total : 0,
    };

    res.status(200).send(dashboardData);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
