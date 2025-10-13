const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findByUsername(username);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (!(await User.comparePasswords(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "4h" }
  );

  const refreshToken = jwt.sign({
    id: user.id,
    username: user.username,
  },
  process.env.JWT_REFRESH_SECRET,
  {expiresIn:process.env.JWT_REFRESH_EXPIRES_IN || "7d"}
);



  return res.json({
    message: "Login successful",
    accessToken,
    refreshToken,
    user: { id: user.id, username: user.username },
  });
};

exports.refresh = async (req, res) => {
  const authHeader = req.headers.authorization;

  const refreshToken = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    console.log('refresh token');


    const newAccessToken = jwt.sign(
      {id: decoded.id, username: decoded.username},
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRES_IN || "4h"}
    );

    const newRefreshToken = jwt.sign(
      {id: decoded.id, username: decoded.username},
      process.env.JWT_REFRESH_SECRET,
      {expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "28d"}
    );
    console.log('new refresh,', newRefreshToken);

    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {id: decoded.id, username: decoded.username}
    })
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired refresh token'
    });
  }
};
