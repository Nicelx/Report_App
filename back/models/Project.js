const  pool  = require("../config/db");

class Project {
  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM projects");
    return rows;
  }
}

module.exports = Project;
