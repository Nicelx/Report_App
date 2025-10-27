const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.getAll(); 
    res.json(users); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" }); 
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

exports.updateUser = async (req, res) => {
  try {
    const user_id = req.user.id;

    if (!user_id) {
      throw new Error('no user id!');
    }

    await User.updateUser({
      user_id: user_id,
      email: req.body.email || null,
      fullname: req.body.fullname || null,
    });

    res.send({
      message: "user updated",
    });
  } catch (error) {
    res.status(500).json({
      message: error
    })
  }
};
