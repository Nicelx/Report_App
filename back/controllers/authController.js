const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findByUsername(username);
    console.log("user", user);

    if (!user) {
      throw new Error("Invalid credentials");
    }
    if (!user.role) {
      throw new Error("no role found");
    }

    if (!(await User.comparePasswords(password, user.password))) {
      throw new Error("invalid credentials");
    }

    const accessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "4h" }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
    );

    return res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
};

exports.refresh = async (req, res) => {
  const authHeader = req.headers.authorization;

  const refreshToken = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id, username: decoded.username, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "4h" }
    );

    const newRefreshToken = jwt.sign(
      { id: decoded.id, username: decoded.username, role: decoded.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "28d" }
    );

    return res.json({
      newAccessToken: newAccessToken,
      newRefreshToken: newRefreshToken,
      user: { id: decoded.id, username: decoded.username, role: decoded.role },
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};
