import Vue from 'vue'
import VueRouter from 'vue-router'
//1.安装插件
Vue.use(VueRouter)

//6.懒加载
const Home = () => import('../views/home/Home.vue')
const Category = () => import('../views/category/Category.vue')
const Cart = () => import('../views/cart/Cart.vue')
const Profile = () => import('../views/profile/Profile.vue')
const Detail = () => import('../views/detail/Detail.vue')

//4.传入属性
const routes = [
    //5.映射关系
    {
        path: '/',
        redirect: '/home'   //默认重定向
    },{
        path: '/home',      //地址
        component: Home     //组件名
    },{
        path: '/category',
        component: Category
    },{
        path: '/cart',
        component: Cart
    },{
        path: '/profile',
        component: Profile
    },{
        path: '/detail/:iid',
        component: Detail
    }
]
//2.创建router
const router = new VueRouter({
    routes,     //注意是routes而不是routers,坑就在这里
    mode: 'history' //history模式
})

//3.导出
export default router