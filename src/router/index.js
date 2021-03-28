import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import User from '../components/user/user.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/login' },

    { path: '/login', component: login },

    {
        path: '/home',
        component: home,
        redirect: '/welcome',
        children: [
            { path: '/welcome', component: Welcome },
            { path: '/users', component: User }
        ]
    }
]

const router = new VueRouter({
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {

    if (to.path == '/login') next();

    const token = window.sessionStorage.getItem('token');

    if (token) {
        next();
    } else {
        next('/login');
    }
})

export default router