import Layout from '@/layout'
import home from './modules/home'
import product from './modules/product'
import order from './modules/order'
import user from './modules/user'
import common from './modules/common'

export default [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/other/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    title: '首页',
    icon: 'home',
    redirect: { name: 'dashboard' },
    children: home
  },
  {
    path: '/product',
    component: Layout,
    title: '商品管理',
    icon: 'product',
    children: product
  },
  {
    path: '/order',
    component: Layout,
    title: '订单管理',
    icon: 'order',
    children: order
  },
  {
    path: '/user',
    component: Layout,
    icon: 'system',
    title: '权限管理',
    children: user
  },
  {
    path: '/common',
    component: Layout,
    icon: 'common',
    title: '常用操作',
    children: common
  },
  {
    path: '/user',
    component: Layout,
    icon: 'user',
    title: '用户管理',
    children: user,
    hidden: true
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
