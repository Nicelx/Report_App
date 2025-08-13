import './assets/styles.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia';
import router from './router';


import App from './App.vue'

const pinia = createPinia();
const myApp = createApp(App);

myApp.use(router);
myApp.use(pinia); 

myApp.mount('#app')
