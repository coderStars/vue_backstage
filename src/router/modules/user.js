const pre = '/system/'

export default [
  {
    path: `${pre}user`,
    name: 'product',
    title: '用户管理',
    component: () => import('@/views/user'),
    meta: { icon: 'system-list' }
  }
  // ,
  // {
  //   path: `${pre}cache`,
  //   name: 'addProduct',
  //   title: '角色管理',
  //   component: () => import('@/views/system/cache'),
  //   meta: { icon: 'system-cache' }
  // },
  // {
  //   path: `${pre}bak`,
  //   name: 'systemBak',
  //   title: '菜单管理',
  //   component: () => import('@/views/system/bak'),
  //   meta: { icon: 'bak' }
  // }
]
