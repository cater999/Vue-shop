import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 挂载富文本
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor);

// 引入全局css样式
import './assets/css/global.css'

// 引入iconfont
import './assets/font/iconfont.css'
Vue.config.productionTip = false

// 引入 vue-table-with-tree
import ZkTable from 'vue-table-with-tree-grid'
Vue.component('vue-table', ZkTable);

// 引入nprogress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 引入axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {

    config.headers.Authorization = window.sessionStorage.getItem('token');
    NProgress.start();
    return config;
});

axios.interceptors.response.use(config => {
    NProgress.done();
    return config;
})

Vue.prototype.$http = axios;

// 定一个时间过滤器
Vue.filter('filterTime', function(param) {
    const dt = new Date(param);
    const year = dt.getFullYear();
    const month = (dt.getMonth() + 1 + "").padStart(2, "0");
    const date = (dt.getDate() + "").padStart(2, "0");

    const h = (dt.getHours() + "").padStart(2, "0");
    const m = (dt.getMinutes() + "").padStart(2, "0")
    const s = (dt.getSeconds() + "").padStart(2, "0");
    return `${year}-${month}-${date} ${h}:${m}:${s}`
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')