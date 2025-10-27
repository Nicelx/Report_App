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

  static async updateTask({
    id,
    task_description,
    completed_date,
    project_id,
    service_id,
    user_id
  }) {
    try {
      if (id === undefined) {
        throw new Error("Task ID is required for update");
      }

      const sql = `
      UPDATE tasks 
       SET task_description = ?, completed_date = ?, project_id = ?, service_id = ?
       WHERE id = ? AND user_id = ?`;

      const [result] = await pool.execute(sql, [
        task_description,
        completed_date,
        project_id,
        service_id,
        id,
        user_id
      ]);
    } catch (error) {
      throw new Error(error);
    }
  }
  static async deleteTask(taskId, user_id) {
    const [result] = await pool.execute("DELETE FROM tasks WHERE id = ? AND user_id = ?", [
      taskId, user_id
    ]);
    console.log(result);
  }

  static async getAll(user_id) {
    let query;
    let params = [];

    if (user_id) {
      query = "SELECT * FROM tasks WHERE user_id = ?";
      params = [user_id];
    } else {
      query = `SELECT * FROM tasks`;
    }

    const [rows] = await pool.query(query, params);
    return rows;
  }
}

module.exports = Task;
