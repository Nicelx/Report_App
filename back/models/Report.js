const pool = require("../config/db");

class Report {
  static async addReports({ user_id, start_date, end_date, reports }) {
    console.log(user_id, "userid");
    console.log(start_date, "start Date");
    console.log(end_date, "end date");
    console.log(reports, "reports");

    try {
      const sql = `
        insert into reports
        (user_id, project_id, start_date, end_date, report_description, what_get, 
       conclusions, links, plans, how_good_are_you, hanging, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      const values = [
        user_id,
        10,
        start_date,
        end_date,
        'reportData.report_description',
        'reportData.what_get',
        'reportData.conclusions',
        'reportData.links',
        'reportData.plans',
        'good',
        'reportData.hanging',
      ];

      const [result] = await pool.execute(sql, values);
      console.log(result);
      return result.insertId;
    } catch (error) {}
    // try {
    //   const [result] = await pool.execute(
    //     "INSERT INTO tasks (user_id, task_description, completed_date, project_id, service_id) VALUES (?, ?, ?, ?, ?)",
    //     [user_id, task_description, completed_date, project_id, service_id]
    //   );

    //   if (result) return result.insertId;
    // } catch (error) {
    //   console.error(error);
    // }
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
