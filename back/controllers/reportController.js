const Report = require("../models/Report");

exports.addReports = async (req, res) => {
  const {
    user_id,
    start_date,
    end_date,
    reports,
  } = req.body;


  try {
    await Report.addReports({
      user_id,
      reports,
      start_date,
      end_date
    })
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
  console.log(req.user);

  const results = await Report.getMyReports(req.user.id);
  console.log(results);

  return res.send({ 
    message: 'reports/',
    userId : req.user_id,
    results : results
  })
}

exports.updateReport = async (req, res) => {};