const db = require("../models");
const Notification = db.notification;

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    res.status(200).send(notifications);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;

    const notification = await Notification.findOne({
      _id: notificationId,
      userId: req.userId,
    });

    if (!notification) {
      return res.status(404).send({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).send({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).send({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
