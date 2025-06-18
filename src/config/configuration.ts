export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    uri: process.env.MONGODB_URI || "mongodb://localhost/danain",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "secretKey",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },
});
