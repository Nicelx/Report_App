const pool = require("../config/db");
const timestampToMySQLDate = require("../utils/utils");

class Report {
  static async addServicesToReport(report_id, service_id) {
    const sql = `
      insert into report_services
      (report_id, service_id)
      values(?,?)
    `;
    const values = [report_id, service_id];

    await pool.execute(sql, values);
  }

  static async addReport(data) {
    data.start_date = timestampToMySQLDate(data.start_date);
    data.end_date = timestampToMySQLDate(data.end_date);
    console.log("start date", data.start_date);

    const sql = `
        insert into reports
        (user_id, project_id, start_date, end_date, report_description, what_get, 
       conclusions, links, plans, how_good_are_you, hanging, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
    const values = [
      data.user_id,
      data.report.projectId,
      data.start_date,
      data.end_date,
      data.report.report_description,
      data.report.what_get,
      data.report.conclusions,
      data.report.links,
      data.report.plans,
      data.report.how_good_are_you,
      data.report.hanging,
    ];

    const [result] = await pool.execute(sql, values);

    for (const service_id of data.report.service_id_array) {
      await Report.addServicesToReport(result.insertId, service_id);
    }
  }

  static async updateReport(updates) {
    const connection = await pool.getConnection();

    try {
      const {
        id,
        user_id,
        report_description,
        hanging,
        conclusions,
        how_good_are_you,
        links,
        plans,
        service_id_array,
        what_get,
        projectId,
      } = updates;
      const start_date = timestampToMySQLDate(updates.start_date);
      const end_date = timestampToMySQLDate(updates.end_date);

      await connection.beginTransaction();

      // check user
      const [checkRows] = await connection.execute(
        "SELECT id FROM reports WHERE id = ? AND user_id = ?",
        [id, user_id]
      );

      if (checkRows.length === 0) {
        await connection.rollback();
        throw new Error(
          "Не найден отчёт или же пользователь не имеет прав изменять данный отчёт"
        );
      }

      // handle services
      await connection.execute(
        `DELETE FROM report_services where report_id = ?`,
        [id]
      );

      for (const service_id of service_id_array) {
        await connection.execute(
          `insert into report_services (report_id, service_id)
      values(?,?) `,
          [id, service_id]
        );
      }

      // update report
      const values = [
        projectId,
        start_date,
        end_date,
        report_description,
        what_get,
        conclusions,
        links,
        plans,
        how_good_are_you,
        hanging,
        id,
      ];
      const [result] = await connection.execute(
        `
        UPDATE reports 
        SET project_id = ?, start_date = ?, end_date = ?, report_description = ?, what_get = ?,  conclusions = ?, links = ?, plans = ?, how_good_are_you = ?, hanging = ?, updated_at = NOW()
        WHERE id = ?
        `,
        values
      );
      console.log("result", result);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async deleteReport(id, user_id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // check user
      const [checkRows] = await connection.execute(
        "SELECT id FROM reports WHERE id = ? AND user_id = ?",
        [id, user_id]
      );

      if (checkRows.length === 0) {
        await connection.rollback();
        throw new Error(
          "Не найден отчёт или же пользователь не имеет прав изменять данный отчёт"
        );
      }
      console.log("report id", id);


      // delete services of reports
      const [result] = await connection.execute(
        `DELETE FROM report_services where report_id = ?`,
        [id]
      );
      if (result.affectedRows < 1) {
        throw new Error('Что-то не так. Удаление услуг не отработало корректно')
      }

      // delete report
      const [deleteReportResult] = await connection.execute(
        `delete FROM reports where id = ?`,
        [id]
      )

      if (deleteReportResult.affectedRows != 1) {
        throw new Error(`затронуты более 1 или 0 строк ${deleteReportResult}`);
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

    console.log("delete Report");
  }

  static async getReports(filters) {
    const conditions = [];
    const values = [];

    if (filters.project_id) {
      conditions.push("project_id = ?");
      values.push(filters.project_id);
    }

    if (filters.user_id) {
      conditions.push("user_id = ?");
      values.push(filters.user_id);
    }

    if (filters.start_date) {
      conditions.push(
        "start_date >= CONVERT_TZ(FROM_UNIXTIME(? / 1000), '+00:00', '-03:00')"
      );
      values.push(filters.start_date);
    }
    if (filters.end_date) {
      conditions.push(
        "end_date <= CONVERT_TZ(FROM_UNIXTIME(? / 1000), '+00:00', '-03:00')"
      );
      values.push(filters.end_date);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const sql = `
    SELECT 
      reports.*, 
      GROUP_CONCAT(report_services.service_id) as service_ids
    FROM reports
    LEFT JOIN report_services ON reports.id = report_services.report_id
    ${whereClause}
    GROUP BY reports.id
    ORDER BY reports.start_date DESC, reports.updated_at DESC;
  `;

    // console.log("SQL", sql);

    const [result] = await pool.execute(sql, values);
    return result;
  }
}

module.exports = Report;
