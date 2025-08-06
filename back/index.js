const express = require("express");
const cors = require("cors");
require('dotenv').config();
const authMiddleware = require('./middleware/auth');

const User = require("./models/User");

const { getUsers } = require("./controllers/userController");
const { login } = require("./controllers/authController");
const {addTask} = require('./controllers/taskController');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/get-info", authMiddleware , getUsers);
app.get("/get-info", getUsers);
app.get("/get-info2", async (req, res) => {
  // В этом блоке можно обработать запрос и отправить ответ
  res.send({ message: "Это ответ на GET-запрос get-info2" });
});
app.post("/login", login);

app.post("/create-user", async (req, res) => {
  console.log(req.body);

  await User.create({
    username: req.body.username,
    password: req.body.password,
  });

  // В этом блоке можно обработать запрос и отправить ответ
  res.send({ message: "Пользователь создан" });
});

app.post("/add-task", authMiddleware, addTask);

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
