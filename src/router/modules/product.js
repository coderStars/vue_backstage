const pre = '/product/'

export default [
  {
    path: `${pre}index`,
    name: 'product',
    title: '平台属性管理',
    component: () => import('@/views/product/attr'),
    meta: { icon: 'product-list' }
  },
  {
    path: `${pre}add`,
    name: 'addProduct',
    title: '品牌管理',
    component: () => import('@/views/product/trademark'),
    meta: { icon: 'product-add' }
  },
  {
    path: `${pre}category`,
    name: 'productCategory',
    title: 'SPU管理',
    component: () => import('@/views/product/spu'),
    meta: { icon: 'product-category' }
  },
  {
    path: `${pre}category/add`,
    name: 'productCategoryAdd',
    title: 'SKU管理',
    component: () => import('@/views/product/sku'),
    meta: { icon: 'product-category-add' }
  }
]
