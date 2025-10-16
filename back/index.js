const express = require("express");
const cors = require("cors");
require('dotenv').config();
const authMiddleware = require('./middleware/auth');

const { createUser, updateUser } = require("./controllers/userController");
const { login, refresh } = require("./controllers/authController");
const {addTask, updateTask,deleteTask} = require('./controllers/taskController');
const { getInfo, getTasks } = require("./controllers/infoController");
const { addReports, getReports } = require("./controllers/reportController");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.get("/get-info", authMiddleware , getInfo);
app.get("/get-tasks", authMiddleware, getTasks);
app.put("/update-task/:id", authMiddleware, updateTask);
app.delete('/delete-task/:id', authMiddleware, deleteTask);

app.post("/login", login);
app.post("/create-user", createUser);
app.put('/update-user', authMiddleware, updateUser)
app.post("/refresh-token", refresh);

app.post("/add-task", authMiddleware, addTask);

app.get("/reports", authMiddleware, getReports);
app.post("/add-report", authMiddleware, addReports);

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
