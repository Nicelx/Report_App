const { pool } = require("../config/db");

class Task {
   static async addTask() {
    try {
      const [result] = await pool.execute(
        "INSERT INTO tasks (user_id, task_description) VALUES (?, ?)",
        [1,"cool task description"]
      );

       if (result) return result.insertId;
    } catch (error) {
        console.error(error)
    }

   
  }

  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM tasks");
    return rows;
  }
}

module.exports = Task;