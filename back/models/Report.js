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
    data.reports[project_id].service_id_array.forEach((service_id) => {
      Report.addServicesToReport(result.insertId, service_id);
    });
  }
  static async addReports(data) {
    data.start_date = timestampToMySQLDate(data.start_date);
    data.end_date = timestampToMySQLDate(data.end_date);

    for (let project_id in data.reports) {
      Report.addSingleReport(data, project_id);
    }
  }
  static async getMyReports(userId) {
    const sql = `
    select r.*, group_concat(rs.service_id) as service_ids
    from reports r
    left join
    report_services rs on r.id = rs.report_id
    where r.user_id = ${userId}
    group by r.id
    order by r.id;
    `;
    const [result] = await pool.execute(sql);
    return result;
  }
}

module.exports = Report;
