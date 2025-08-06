const fs = require('fs').promises;
const path = require('path');

const generate = async () => {
    let fullContent = '';

    const root = path.join(__dirname, '..');

    // const paths = [
    //     'index.js',
    //     'config/db.js',
    //     'controllers/userController.js',
    //     'controllers/authController.js',
    //     'middleware/auth.js',
    //     'models/User.js',
    //     '../front/src/App.vue',
    //     '../front/src/main.js',
    //     '../front/src/router/index.js',
    //     '../front/src/views/Home.vue',
    //     '../front/src/views/Login.vue',
    //     '../front/src/views/Register.vue',
    //     '../front/src/views/Settings.vue',
    // ]

    const paths = [
        '../front/src/assets/styles.css',
        '../front/src/App.vue',
        '../front/src/main.js',
        '../front/src/router/index.js',
        '../front/src/views/Home.vue',
        '../front/src/views/Login.vue',
        '../front/src/views/Register.vue',
        '../front/src/views/Settings.vue',
        
    ]

    paths.forEach((item, index) => {
        paths[index] = path.join(root, item);
    })
    for (const p of paths) {
        const content = await fs.readFile(p, 'utf-8');
        fullContent += '\n********************* \n';
        fullContent += p;
        fullContent += '\n\n';
        fullContent += content;
    }

    await fs.writeFile('utils/result.txt', fullContent);
}

generate();