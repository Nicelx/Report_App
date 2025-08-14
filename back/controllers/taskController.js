const Task = require("../models/Task");

exports.addTask = async (req, res) => {
  console.log(req.user);
  const { user_id, task_description, completed_date, project_id, service_id } =
    req.body;

  if (
    !user_id ||
    !task_description ||
    !completed_date ||
    !project_id ||
    !service_id
  )
    return res.status(500).json({
      message: "Не все поля имеют значения",
    });

  try {
    await Task.addTask({
      user_id,
      task_description,
      completed_date,
      project_id,
      service_id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Ошибка добавления задачи в базу данных",
    });
  }

  return res.send({
    message: "task added",
  });
};


exports.updateTask = async (req, res) => {
  console.log('updateTask');
  return res.send({
    message: 'task updated'
  })
}