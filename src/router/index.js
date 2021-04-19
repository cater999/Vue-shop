import Vue from 'vue'
import VueRouter from 'vue-router'

// import login from '../components/login.vue'
// import home from '../components/home.vue'
// import Welcome from '../components/welcome.vue'

const login = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ '../components/login.vue');
const home = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ '../components/home.vue');
const Welcome = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ '../components/welcome.vue');

// import User from '../components/user/user.vue'
const User = () =>
    import ( /* webpackChunkName: "user" */ '../components/user/user.vue');

// import Rights from '../components/powers/rights.vue'
// import Roles from '../components/powers/roles.vue'
const Rights = () =>
    import ( /* webpackChunkName: "rights_roles" */ '../components/powers/rights.vue');
const Roles = () =>
    import ( /* webpackChunkName: "rights_roles" */ '../components/powers/roles.vue');

// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'
// import GoodList from '../components/goods/goodList.vue'
// import AddGood from '../components/goods/addGood.vue'
const Cate = () =>
    import ( /* webpackChunkName: "goods" */ '../components/goods/Cate.vue');
const Params = () =>
    import ( /* webpackChunkName: "goods" */ '../components/goods/Params.vue');
const GoodList = () =>
    import ( /* webpackChunkName: "goods" */ '../components/goods/goodList.vue');
const AddGood = () =>
    import ( /* webpackChunkName: "goods" */ '../components/goods/addGood.vue');

// import Order from '../components/order/Order.vue'
const Order = () =>
    import ( /* webpackChunkName: "order" */ '../components/order/Order.vue');

// import Report from '../components/report/Report.vue'
const Report = () =>
    import ( /* webpackChunkName: "report" */ '../components/report/Report.vue');

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
            { path: '/users', component: User },
            { path: '/rights', component: Rights },
            { path: '/roles', component: Roles },
            { path: '/categories', component: Cate },
            { path: '/params', component: Params },
            { path: '/goods', component: GoodList },
            { path: '/goods/add', component: AddGood },
            { path: '/orders', component: Order },
            { path: '/reports', component: Report }
        ]
    }
]

const router = new VueRouter({
    routes
})

// 路由守卫
router.beforeEach((to,  from,  next)  =>  {

        
    if  (to.path  ==  '/login')  {        
        next();    
    } 
    else  {        
        const  token  =  window.sessionStorage.getItem('token');

                
        if  (token)  {            
            next();     
        } 
        else  {            
            next('/login');        
        }    
    }

})

export default router