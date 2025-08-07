const pool = require("../config/db");
const Project = require("../models/Project");
const Service = require("../models/Service");
const Task = require("../models/Task");

exports.getInfo = async (req, res) => {
  const data = {}

  const projects = await Project.getAll();
  const services = await Service.getAll();
  const tasks = await Task.getAll(req.user.id)

  if (!projects || !services) {
    return res.status(500).json({message: 'projects или services не найдены в бд'})
  }
  data.projects = projects;
  data.services = services;
  data.tasks = tasks;

  res.send(data);


//   getting services


};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.getAll(req.user.id);
    res.send(tasks);
  } catch (error) {
    res.status(500).json({message: 'Получить задачи не получилось, не фартануло, не повезло эх'})
  }


}