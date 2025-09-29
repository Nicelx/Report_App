// const Task = require("../models/Task");

exports.addReport = async (req, res) => {
    const {user_id, project_id, start_date, end_date, report_description, what_get, conclusion, links, plans, how_good_are_you } = req.body;

    if (!user_id ||
        !project_id ||
        !start_date ||
        !end_date ||
        !report_description ||
        !how_good_are_you
    ) return res.status(500).json({
        message: 'Не достаточно данных'
    })

    try {
        
    } catch (error) {
        
    }
}

// exports.addTask = async (req, res) => {
//   console.log(req.user);
//   const { user_id, task_description, completed_date, project_id, service_id } =
//     req.body;

//   if (
//     !user_id ||
//     !task_description ||
//     !completed_date ||
//     !project_id ||
//     !service_id
//   )
//     return res.status(500).json({
//       message: "Не все поля имеют значения",
//     });

//   try {
//     await Task.addTask({
//       user_id,
//       task_description,
//       completed_date,
//       project_id,
//       service_id,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Ошибка добавления задачи в базу данных",
//     });
//   }

//   return res.send({
//     message: "task added",
//   });
// };

// exports.updateTask = async (req, res) => {
//   try {
//     const updates = req.body;

//     await Task.updateTask({
//       ...updates,
//     });

//     return res.send({
//       message: "task updated",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Ошибка обновления задачи",
//     });
//   }
// };
// exports.deleteTask = async (req, res) => {
//   try {
//     const { id } = req.body;

//     await Task.deleteTask(id);

//     res.send({
//       message: "task Deleted",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message : 'удалить не получилось'
//     })
//   }
// };
