jwt = require("jsonwebtoken");

const isProdEnv = () => {
  return process.env.NODE_ENV === "production";
};

const isDevEnv = () => {
  return process.env.NODE_ENV !== "production";
};

const generateAccessToken = (user) =>
  jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    process.env.JWT_ACCESS_SECRET_KEY,
    { expiresIn: "30m" }
  );

const generateRefreshToken = (user) =>
  jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    process.env.JWT_REFRESH_SECRET_KEY
  );

module.exports = Object.freeze({
  isProdEnv,
  isDevEnv,
  generateAccessToken,
  generateRefreshToken,
});
