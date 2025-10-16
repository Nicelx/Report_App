const timestampToMySQLDate = require("../utils/utils");
const Report = require("../models/Report");

exports.addReports = async (req, res) => {
  const { user_id, start_date, end_date, reports } = req.body;

  if (
    !start_date ||
    !end_date ||
    typeof start_date != "number" ||
    typeof end_date != "number"
  ) {
    return res.status(500).json({
      message: "Не корректно указан промежуток. start_date or end_date",
    });
  }
  if (!validateReports(reports)) {
    return res.status(500).json({
      message: "Не корректно переданы отчёты reports",
    });
  }

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
    return res.status(500).json({ message: error });
  }
};

exports.updateReport = async (req, res) => {};

const validateReports = (reportsObj) => {
  if (Object.keys(reportsObj).length === 0) {
    console.error("reportsObj is empty");
    return false;
  }

  for (let key in obj) {
    if (typeof key != "string") {
      console.error("report key is not a string");
      return false;
    }
    if (isNaN(key) == true) {
      console.error("key is not numberic string");
      return false;
    }

    const {
      report_description,
      service_id_array,
      how_good_are_you,
      what_get,
      conclusions,
      links,
      plans,
      hanging,
    } = obj[key];

    if (
      typeof report_description != "string" ||
      typeof how_good_are_you != "string" ||
      typeof service_id_array != "object" ||
      typeof what_get != "string" ||
      typeof conclusions != "string" ||
      typeof links != "string" ||
      typeof plans != "string" ||
      typeof hanging != "string"
    ) {
      console.error("wrong types in report object");
      console.error(typeof report_description);
      console.error(typeof how_good_are_you);
      console.error(typeof service_id_array);
      return false;
    }
    if (report_description.length == 0 || service_id_array.length == 0) {
      console.error("важные поля report obj пустые");
      console.error("report_description", report_description);
      console.error("service_id_array", service_id_array);
      return false;
    }
    if (!(how_good_are_you === 'good' || how_good_are_you === 'bad' || how_good_are_you === 'excellent')) {
      console.error('how_good_are_you has not supported value');
      return false;
    }
  }

  return true;
};
