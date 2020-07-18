import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Uesrs from "../components/user/Uesrs"
import rigths from "../components/power/rigths"
import roles from "../components/power/roles"
import Cate from "../components/goods/Cate"
import Params from "../components/goods/Params"
import Goods from "../components/goods/Goods";
import Add from "../components/goods/Add";
import orders from "../components/Orders/orders";
import reports from "../components/Reports/reports";
import '../assets/css/global.css'

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {path: '/', redirect: '/login'},
    {path: '/login', component: Login},
    {path: '/Home', component: Home, redirect:'/Welcome',
      //children 为Home路由的子路由
      children: [
        { path:'/Welcome', component: Welcome},
        { path: '/Users', component: Uesrs},
        { path:'/rights',component: rigths},
        { path:'/roles',component:roles},
        { path:'/categories',component:Cate},
        { path:'/params', component:Params},
        { path:'/goods', component:Goods },
        { path:'/goods/add', component: Add},
        { path:'/orders', component:orders },
        { path:'/reports', component:reports}
        ]},

  ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 代表将要访问的路径
  //from 代表从哪个路径跳转过来的
  //next 代表是一个函数，代表放行
  // next() 放行   next('/login') 强制跳转login

  //这里如果用户想要访问login登录页面 选择直接放行return next
  if (to.path === '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  //如果获取token令牌失败则跳转login
  if (!tokenStr) {
    return next('/login')
  }
  //获取成功的话 则放行
  next()


});

export default router
