import Vue from 'vue'
import Router from 'vue-router'

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '*',
            redirect: '/Home',
            meta: {}
        },
        {
            path: '/Login',
            name: 'Login',
            component: () => import('@/pages/login/login')
        },
        {
            path: '/Home',
            name: 'Home',
            component: () => import('@/pages/home/home'),
            children: [{
                path: '/',
                name: 'Index',
                component: () => import('@/pages/index/index'),
                meta: {
                    keepAlive: true
                }
            }, {
                path: '/Goods',
                name: 'Goods',
                component: () => import('@/pages/goods/goods'),
                meta: {
                    keepAlive: true
                }
            }, {
                path: '/Order',
                name: 'Order',
                component: () => import('@/pages/order/order'),
                meta: {
                    keepAlive: true
                }
            }, {
                path: '/AddGoods',
                name: 'AddGoods',
                component: () => import('@/pages/goods/goodsDetail'),
                meta: {
                    keepAlive: false
                }
            }, {
                path: '/putGoods',
                name: 'putGoods',
                component: () => import('@/pages/goods/goodsDetail'),
                meta: {
                    keepAlive: false
                }
            }, {
                path: '/GoodsTypeMgt',
                name: 'GoodsTypeMgt',
                component: () => import('@/pages/goods/goodsTypeMgt'),
                meta: {
                    keepAlive: false
                }
            }, {
                path: '/GoodsSpecMgt',
                name: 'GoodsSpecMgt',
                component: () => import('@/pages/goods/goodsSpecMgt'),
                meta: {
                    keepAlive: false
                }
            }]
        }
    ]
})
