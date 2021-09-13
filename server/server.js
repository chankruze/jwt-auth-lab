const {
  isDevEnv,
  generateAccessToken,
  generateRefreshToken,
} = require("./utils");
// check for prod or dev environment
// if dev import dotenv
if (isDevEnv()) {
  require("dotenv").config();
}

const express = require("express");

const PORT = process.env.PORT || 8888;

const app = express();
app.use(express.json());

const users = [
  { id: "1", username: "admin", password: "admin", isAdmin: true },
  { id: "2", username: "user", password: "user", isAdmin: false },
];

let refreshTokens = [];

// verify middleware
const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // if Authorization header is present
  if (authHeader) {
    // split Bearer <jwt token>
    const token = authHeader.split(" ")[1];
    // jwt verification
    jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY, (err, user) => {
      // invalid token
      if (err) return res.status(403).json("Token is invalid!");
      // add this user to request
      req.user = user;
      // next
      next();
    });
  } else {
    res.status(401).json("You're not authenticated");
  }
};

// POST (refresh)
app.post("/api/refresh", (req, res) => {
  // take the refresh token
  const refreshToken = req.body.refreshToken;
  // check error
  if (!refreshToken) {
    return res.status(401).json("You're not authenticated.");
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh token not valid");
  }

  // if everything is ok, create new access & refresh token
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, (err, user) => {
    // invalid token
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    refreshTokens.push(newRefreshToken);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
});

// POST (login)
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // find user in db & check pass
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    // generate access token
    const accessToken = generateAccessToken(user);
    // generate refresh token
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);

    // send token
    res.json({
      username: user.username,
      isAdmin: user.isAdmin,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(400).json("Username or pass inscorrect!");
  }
});

// DELETE (user)
app.delete("/api/users/:userId", verify, (req, res) => {
  // if logged in user is requesting delete for it's deletion
  // or logged in user has admin rights
  if (req.user.id === req.params.userId || req.user.isAdmin) {
    res.json("User has been deleted.");
  } else {
    res.status(403).json("You're not authorized to delete this user.");
  }
});

// POST (logout)
app.post("/api/logout", verify, (req, res) => {
  const refreshToken = req.body.refreshToken;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.json("You are logged out successfully");
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
