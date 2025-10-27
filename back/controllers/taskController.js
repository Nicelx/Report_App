const Task = require("../models/Task");

exports.addTask = async (req, res) => {
  const { task_description, completed_date, project_id, service_id } = req.body;
  const { id: user_id } = req.user;

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
  try {
    const updates = req.body;
    const { id: user_id } = req.user;
    const {id} = req.params;

    if (!user_id) {
      throw new Error('no user_id');
    }

    await Task.updateTask({
      id,
      user_id,
      ...updates,
    });

    return res.send({
      message: "task updated",
    });
  } catch (error) {
    res.status(500).json({
      message: "Ошибка обновления задачи",
    });
  }
};
exports.deleteTask = async (req, res) => {
  try {
    const{id: user_id} = req.user;
    const {id }= req.params

    if (!user_id) {
      throw new Error('Нет user id');
    }

    await Task.deleteTask(id, user_id);

    res.send({
      message: "task Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "удалить не получилось",
    });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const {id : user_id} = req.user;
    if (!user_id) {
      throw new Error('Нет user_id');
    }

    const tasks = await Task.getAll(user_id);
    res.send(tasks);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Получить задачи не получилось, не фартануло, не повезло эх",
      });
  }
};
