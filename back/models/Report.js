const pool = require("../config/db");

class Report {
  static async addTask({
    user_id,
    task_description,
    project_id,
    service_id,
    completed_date,
  }) {
    try {
      const [result] = await pool.execute(
        "INSERT INTO tasks (user_id, task_description, completed_date, project_id, service_id) VALUES (?, ?, ?, ?, ?)",
        [user_id, task_description, completed_date, project_id, service_id]
      );

      if (result) return result.insertId;
    } catch (error) {
      console.error(error);
    }
  }

//   static async updateTask({
//     id,
//     task_description,
//     completed_date,
//     project_id,
//     service_id,
//   }) {
//     try {
//       if (id === undefined) {
//         throw new Error("Task ID is required for update");
//       }
//       const executedStr =  `
//         update tasks
//         set
//         task_description = '${task_description}',
//         completed_date = '${completed_date}',
//         project_id = ${project_id},
//         service_id = ${service_id}
//         where id = ${id}
//       `;
//       console.log(executedStr);
//       const [result] = await pool.execute(executedStr);
//       console.log("result =", result);
//     } catch (error) {
//         throw new Error(error);
//     }

//   }
//   static async deleteTask(taskId) {
//     if (!taskId) {
//       throw new Error('task id - false');
//     }
//     const [result] = await pool.execute(`
//         delete from tasks where id = ${taskId}
//       `)

//   }


//   static async getAll(user_id) {
//     let query;
//     if (user_id) {
//       query = `SELECT * FROM tasks where user_id = ${user_id}`;
//     } else {
//       query = `SELECT * FROM tasks`;
//     }

//     const [rows] = await pool.query(query);
//     return rows;
//   }
}

module.exports = Report;