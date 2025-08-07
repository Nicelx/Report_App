const  pool  = require("../config/db");

class Service {
  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM Services");
    return rows;
  }
}

module.exports = Service;