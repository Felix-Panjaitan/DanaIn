const db = require("../models");
const User = db.user;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Check username
    const usernameUser = await User.findOne({ username: req.body.username });
    if (usernameUser) {
      return res.status(400).send({ message: "Username is already in use!" });
    }

    // Check email
    const emailUser = await User.findOne({ email: req.body.email });
    if (emailUser) {
      return res.status(400).send({ message: "Email is already in use!" });
    }

    next();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;
