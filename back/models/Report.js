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
  static async addSingleReport(data, project_id) {
    const sql = `
        insert into reports
        (user_id, project_id, start_date, end_date, report_description, what_get, 
       conclusions, links, plans, how_good_are_you, hanging, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
    const values = [
      data.user_id,
      project_id,
      data.start_date,
      data.end_date,
      data.reports[project_id].report_description,
      data.reports[project_id].what_get,
      data.reports[project_id].conclusions,
      data.reports[project_id].links,
      data.reports[project_id].plans,
      data.reports[project_id].how_good_are_you,
      data.reports[project_id].hanging,
    ];
    console.log(data.reports[project_id].service_id_array);
    const [result] = await pool.execute(sql, values);
    
    for (const service_id of data.reports[project_id].service_id_array) {
      await Report.addServicesToReport(result.insertId, service_id);
    }
  }
  static async addReports(data) {
    data.start_date = timestampToMySQLDate(data.start_date);
    data.end_date = timestampToMySQLDate(data.end_date);

    for (let project_id in data.reports) {
      await Report.addSingleReport(data, project_id);
    }
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
    ORDER BY reports.start_date DESC;
  `;

    const [result] = await pool.execute(sql, values);
    return result;
  }
}

module.exports = Report;
