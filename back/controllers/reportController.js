const timestampToMySQLDate = require("../utils/utils");
const Report = require("../models/Report");

exports.addReport = async (req, res) => {
  const { start_date, end_date, report } = req.body;
  const user_id = req.user.id;

  if (!user_id) {
    return res.status(500).json({
      message: "Ошибка с user_id",
    });
  }

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

  if (!validateReport(report)) {
    return res.status(500).json({
      message: "Не корректно передан объект report",
    });
  }

  try {
    await Report.addReport({
      user_id,
      report,
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
      end_date: req.query.to || null,
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

exports.updateReport = async (req, res) => {
  console.log('update report');

  // console.log(req.body);
  // console.log(req.user);
  const updates = {
    ...req.body.report,
    start_date : req.body.start_date,
    end_date : req.body.end_date,
    user_id : req.user.id,
  }
  console.log(updates, 'updates');

  await Report.updateReport(updates);

  return res.send({
    message: 'report updated'
  })
};

const validateReport = (report) => {
  const {
    report_description,
    service_id_array,
    how_good_are_you,
    what_get,
    conclusions,
    links,
    plans,
    hanging,
    projectId,
  } = report;

  console.log(report);

  if (
    typeof report_description != "string" ||
    typeof how_good_are_you != "string" ||
    typeof service_id_array != "object" ||
    typeof what_get != "string" ||
    typeof conclusions != "string" ||
    typeof links != "string" ||
    typeof plans != "string" ||
    typeof hanging != "string" ||
    typeof projectId != "number"
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
  if (
    !(
      how_good_are_you === "good" ||
      how_good_are_you === "bad" ||
      how_good_are_you === "excellent"
    )
  ) {
    console.error("how_good_are_you has not supported value");
    return false;
  }

  return true;
};
