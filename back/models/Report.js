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
    console.log('start date', data.start_date);
    
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
    ORDER BY reports.start_date DESC;
  `;

    console.log('SQL', sql);

    const [result] = await pool.execute(sql, values);
    return result;
  }
}

module.exports = Report;
