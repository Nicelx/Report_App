const timestampToMySQLDate = require("../utils/utils");
const Report = require("../models/Report");

exports.addReports = async (req, res) => {
  const { user_id, start_date, end_date, reports } = req.body;

  try {
    await Report.addReports({
      user_id,
      reports,
      start_date,
      end_date,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Ошибка добавления отчёта в базу данных",
    });
  }

  return res.send({
    message: "report added",
  });
};

exports.getReports = async (req, res) => {
  try {
    const filters = {
      project_id: req.query.project_id || null,
      user_id: req.query.user_id || null,
      start_date: req.query.from || null,
    };

    const result = await Report.getReports(filters);
    return res.send({
      result,
      message: "reports/",
      userId: req.user_id,
    });
  } catch (error) {
    return res.status(500).json({message: error})
  }
};

exports.updateReport = async (req, res) => {};
