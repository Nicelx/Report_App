const pool = require("../config/db");
const Project = require("../models/Project");
const Service = require("../models/Service");
const Task = require("../models/Task");
const User = require("../models/User");

exports.getInfo = async (req, res) => {
  try {
    const data = {};
    const user_id = req.user.id;
    if (!user_id) {
      throw new Error("no user id!");
    }

    const projects = await Project.getAll();
    const services = await Service.getAll();
    const tasks = await Task.getAll(req.user.id);
    const users = await User.getAll();

    if (!projects || !services) {
      throw new Error('projects или services не найдены в бд');
    }

    data.projects = projects;
    data.services = services;
    data.tasks = tasks;
    data.users = users;

    res.send(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
};
