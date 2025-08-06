const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.login = async (req, res) => {
  console.log(req.body);

  const { username, password } = req.body;
  const user = await User.findByUsername(username);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (!(await User.comparePasswords(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  return res.json({
    message: "Login successful",
    token,
    user: { id: user.id, username: user.username },
  });
};
