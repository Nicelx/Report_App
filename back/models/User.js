const pool = require("../config/db");
const bcrypt = require("bcryptjs");

class User {
  static async createUser({ username, password }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 12);

      const [result] = await pool.execute(
        "INSERT INTO users (username,  password) VALUES (?, ?)",
        [username, hashedPassword]
      );
      if (result) return result.insertId;
    } catch (error) {
      console.error("create method catch error");
    }
  }

  static async getAll() {
    const [rows] = await pool.query(
      "SELECT id, username, fullname, email FROM users"
    );
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
    return bcrypt.compare(candidatePassword, hashedPassword);
  }
  static async updateUser({ fullname, email, user_id }) {
    const [result] = await pool.execute(
      "UPDATE users SET fullname = ?, email = ? WHERE id = ?",
      [fullname, email, user_id]
    );
    return result;
  }
}

module.exports = User;
