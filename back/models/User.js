const pool = require("../config/db");
const bcrypt = require("bcryptjs");

class User {
  static async create({ username, password }) {
    try {
      const [result] = await pool.execute(
        "INSERT INTO users (username,  password) VALUES (?, ?)",
        [username, password]
      );
    } catch (error) {}

    if (result) return result.insertId;
  }

  static async getAll() {
    const [rows] = await pool.query("SELECT id, username FROM users");
    return rows;
  }
  static async findByUsername(username) {
    try {
      const [users] = await pool.execute(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );
      return users[0];
    } catch (error) {}
  }

  static async comparePasswords(candidatePassword, hashedPassword) {
    if (candidatePassword === hashedPassword) return true;
    return false;

    // return bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = User;
