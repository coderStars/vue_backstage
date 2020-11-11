import request from '@/utils/request'


export default {
  // GET /admin/product/baseTrademark/getTrademarkList
  getList() {
    return request.get('/admin/product/baseTrademark/getTrademarkList')
  },
  // GET /admin/product/baseTrademark/{page}/{limit}  所有的品牌列表
  // 分页列表
  getPageList(page,limit){
    return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
  },
  // POST /admin/product/baseTrademark/save
  // 新增BaseTrademark
  // PUT /admin/product/baseTrademark/update
  // 修改BaseTrademark
  addOrUpdate(trademark){
    if(trademark.id){
      return request.put('/admin/product/baseTrademark/update',trademark)
    }else{
      return request.post('/admin/product/baseTrademark/save',trademark)
    }
  },
  // DELETE /admin/product/baseTrademark/remove/{id}
  delete(id){
    return request.delete(`/admin/product/baseTrademark/remove/${id}`)
  }

}
