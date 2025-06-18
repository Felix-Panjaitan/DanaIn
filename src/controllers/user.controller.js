const db = require("../models");
const User = db.user;
const bcrypt = require("bcryptjs");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    // Check if username already exists for another user
    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: req.userId },
      });

      if (existingUser) {
        return res.status(400).send({ message: "Username already taken" });
      }
    }

    // Check if email already exists for another user
    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.userId },
      });

      if (existingUser) {
        return res.status(400).send({ message: "Email already in use" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          username: username || undefined,
          email: email || undefined,
        },
      },
      { new: true, omitUndefined: true }
    ).select("-password");

    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Validate current password
    const passwordIsValid = bcrypt.compareSync(currentPassword, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Current password is incorrect" });
    }

    // Update password
    user.password = bcrypt.hashSync(newPassword, 8);
    await user.save();

    res.status(200).send({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
