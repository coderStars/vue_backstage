import request from '@/utils/request'

// /admin/product/getCategory1
// getCategory1

// GET /admin/product/getCategory2/{category1Id}
// getCategory2

// GET /admin/product/getCategory3/{category2Id}
// getCategory3

/*
  查找一级分类列表
*/
export default{
  /*
    查找一级分类列表
  */
  getCategorys1(){
    // return request({
    //   url: '/admin/product/geCategory1',
    //   method: 'get'
    // })
    // 修改为request.xxx()
    return request.get('/admin/product/getCategory1')
  },
  /*
    查找二级分类列表
  */
  getCategorys2(category1Id){
    // return request({
    //   url: '/admin/product/getCategory2/{category1Id}',
    //   method: 'get'
    // })
    return request.get('/admin/product/getCategory2/' + category1Id)
  },
  /*
    查找三级分类列表
  */
  getCategorys3(category2Id){
    // return request({
    //   url: '/admin/product/getCategory3/{category2Id}',
    //   method: 'get'
    // })
    return request.get('/admin/product/getCategory3/' + category2Id)
  }
}
