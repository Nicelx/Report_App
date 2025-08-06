import './assets/styles.css';

import { createApp } from 'vue'
import router from './router';


import App from './App.vue'


const myApp = createApp(App);

myApp.use(router);
myApp.mount('#app')
