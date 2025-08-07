const pool = require("../config/db");

class Task {
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

  static async getAll(user_id) {
    let query;
    if (user_id) {
      query = `SELECT * FROM tasks where user_id = ${user_id}`;
    } else {
      query = `SELECT * FROM tasks`;
    }

    const [rows] = await pool.query(query);
    return rows;
  }
}

module.exports = Task;
