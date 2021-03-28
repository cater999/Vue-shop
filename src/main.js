import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 引入全局css样式
import './assets/css/global.css'
// 引入iconfont
import './assets/font/iconfont.css'
Vue.config.productionTip = false

// 引入axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {

    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
})
Vue.prototype.$http = axios;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')