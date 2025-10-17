const pool = require("../config/db");
const Project = require("../models/Project");
const Service = require("../models/Service");
const Task = require("../models/Task");
const User = require('../models/User');

exports.getInfo = async (req, res) => {
  const data = {}

  const projects = await Project.getAll();
  const services = await Service.getAll();
  const tasks = await Task.getAll(req.user.id);
  const users = await User.getAll();

  if (!projects || !services) {
    return res.status(500).json({message: 'projects или services не найдены в бд'})
  }
  data.projects = projects;
  data.services = services;
  data.tasks = tasks;
  data.users = users;

  res.send(data);
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.getAll(req.user.id);
    res.send(tasks);
  } catch (error) {
    res.status(500).json({message: 'Получить задачи не получилось, не фартануло, не повезло эх'})
  }


}