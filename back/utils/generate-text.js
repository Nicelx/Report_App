const fs = require("fs").promises;
const path = require("path");

const generate = async () => {
  let fullContent = "";

  const root = path.join(__dirname, "..");

  // all;
  const paths = [
    "config/db.js",
    "controllers/authController.js",
    "controllers/infoController.js",
    "controllers/taskController.js",
    "controllers/userController.js",
    "middleware/auth.js",
    "models/Project.js",
    "models/Task.js",
    "models/User.js",
    "models/Service.js",
    "index.js",
    "../front/src/components/Tasks.vue",
    "../front/src/components/ReportItem.vue",
    "../front/src/router/index.js",
    "../front/src/stores/index.js",
    "../front/src/stores/reportStore.js",
    "../front/src/stores/taskStore.js",
    "../front/src/stores/controlsStore.js",
    "../front/src/stores/coordinatorStore.js",
    "../front/src/utils/util.js",
    "../front/src/views/Home.vue",
    "../front/src/views/Login.vue",
    "../front/src/views/Register.vue",
    "../front/src/views/Settings.vue",
    "../front/src/views/Projects.vue",
    "../front/src/App.vue",
    "../front/src/main.js",
  ];

  paths.forEach((item, index) => {
    paths[index] = path.join(root, item);
  });
  for (const p of paths) {
    const content = await fs.readFile(p, "utf-8");
    fullContent += "\n********************* \n";
    fullContent += p;
    fullContent += "\n\n";
    fullContent += content;
  }

  await fs.writeFile("utils/result.txt", fullContent);
};

generate();
