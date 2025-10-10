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
    console.log(req.body);
    const response = await User.createUser({
      username: req.body.username,
      password: req.body.password,
    });
    console.log(response, "response");

    if (response) {
      res.send({
        message: "user created",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
