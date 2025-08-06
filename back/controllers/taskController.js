const Task = require("../models/Task");

exports.addTask = async (req, res) => {
    console.log(req.user);

    await Task.addTask();
    return res.send({
        message: 'task added'
    })
}