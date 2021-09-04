if (process.env.NODE_ENV !== "production") require("dotenv").config();

const express = require("express"),
  jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 8888;

const app = express();
app.use(express.json());

console.log(process.env.NODE_ENV);

const users = [
  { id: "1", username: "john", password: "john098", isAdmin: true },
  { id: "2", username: "jane", password: "janedxx", isAdmin: false },
];

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    // generate and access jwt token
    const accessToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET_KEY
    );
    res.json({
      username: user.username,
      isAdmin: user.isAdmin,
      accessToken,
    });
  } else {
    res.status(400).json("Username or pass inscorrect!");
  }
});

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json("Token is invalid!");
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You're not authenticated");
  }
};

app.delete("/api/users/:userId", verify, (req, res) => {
  if (req.user.id === req.params.userId || req.user.isAdmin) {
    res.json("User has been deleted.");
  } else {
    res.status(403).json("You're not authorized to delete this user.");
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
