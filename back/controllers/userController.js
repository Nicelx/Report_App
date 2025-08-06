const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.getAll(); // Используем const
    res.json(users); // Отправляем один ответ
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" }); // Один ответ при ошибке
  }
};

exports.createUser = async (req, res) => {
  try {
    response = await User.createUser({
      username: req.body.username,
      passwrod: req.body.passwrod,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

  if (response)
    res.send({
      message: "user created",
    });
};
