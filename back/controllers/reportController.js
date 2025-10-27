const timestampToMySQLDate = require("../utils/utils");
const Report = require("../models/Report");

exports.addReport = async (req, res) => {
  try {
    const { start_date, end_date, report } = req.body;
    const user_id = req.user.id;

    if (!user_id) {
      throw new Error("Ошибка с user_id");
    }

    validateDates(start_date, end_date);
    validateReport(report);

    await Report.addReport({
      user_id,
      report,
      start_date,
      end_date,
    });

    return res.send({
      message: "report added",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
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
  try {
    const updates = {
      ...req.body.report,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      user_id: req.user.id,
    };
    console.log(updates, "updates");

    if (!req.body.report.id) {
      throw new Error('Не передан id отчёта');
    }
    validateDates(req.body.start_date, req.body.end_date);
    validateReport(req.body.report);

    await Report.updateReport(updates);

    return res.send({
      message: "report updated",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const {id : user_id} = req.user;
    const {id} = req.params;
    if (!user_id || !id) {
      throw new Error('user_id или id не определены')
    }
    await Report.deleteReport(id, user_id);
    
    return res.send({
      message: "report deleted",
    });
    
  } catch (error) {
      return res.status(500).json({
      message: error.message,
    });
  }
}

const validateDates = (start_date, end_date) => {
  if (
    !start_date ||
    !end_date ||
    typeof start_date != "number" ||
    typeof end_date != "number"
  ) {
    throw new Error("Не корректно указан промежуток. start_date or end_date");
  }
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
    throw new Error("wrong types in report object");
  }

  if (report_description.length == 0 || service_id_array.length == 0) {
    throw new Error("Не заполнено описание или услуги");
  }
  if (
    !(
      how_good_are_you === "good" ||
      how_good_are_you === "bad" ||
      how_good_are_you === "excellent"
    )
  ) {
    throw new Error("Оценка имеет не корректное значение");
  }
};
