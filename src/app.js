const express = require("express");
const cors = require("cors");
const dbConfig = require("./config/db.config");
const mongoose = require("mongoose");

const app = express();

// Configure CORS
app.use(cors());

// Parse request content-type - application/json
app.use(express.json());

// Parse request content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Connect to the database
mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to DANAin application." });
});

// Models
const db = {
  mongoose: mongoose,
  user: require("./models/user.model"),
  transaction: require("./models/transaction.model"),
  paymentMethod: require("./models/paymentMethod.model"),
  notification: require("./models/notification.model"),
};

// Routes
const authRoutes = require("./routes/auth.routes");
const transactionRoutes = require("./routes/transaction.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const userRoutes = require("./routes/user.routes");
const paymentMethodRoutes = require("./routes/paymentMethod.routes");
const notificationRoutes = require("./routes/notification.routes");

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment-methods", paymentMethodRoutes);
app.use("/api/notifications", notificationRoutes);

// Error handling middleware
const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

// Set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
