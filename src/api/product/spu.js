import request from '@/utils/request'

export default {
  // GET /admin/product/baseSaleAttrList
  // etBaseSaleAttrList
  getBaseSaleAttrList() {
    return request.get('/admin/product/baseSaleAttrList')
  },

  // DELETE /admin/product/deleteSpu/{spuId}
  // deleteSpu
  delete(spuId) {
    return request.delete(`/admin/product/deleteSpu/${spuId}`)
  },

  // GET /admin/product/getSpuById/{spuId}
  // 获取spu基本信息
  getSpuBaseInfo(spuId) {
    return request.get(`/admin/product/getSpuById/${spuId}`)
  },

  // POST /admin/product/saveSpuInfo
  // saveSpuInfo

  saveSpu(spuInfo) {
    return request.post('/admin/product/saveSpuInfo',spuInfo)
  },

  // POST /admin/product/updateSpuInfo
  // 更改spu信息
  updateSpuInfo(spuInfo){
    return request.post('/admin/product/updateSpuInfo',spuInfo)
  },

  // GET /admin/product/{page}/{limit}
  getSpuInfoPage(page,limit,category3Id) {
    return request.get(`/admin/product/${page}/${limit}`,{params: {category3Id}})
  },

  // GET /admin/product/getSpuById/{spuId}
  getSpuById(spuId) {
    return request.get(`/admin/product/getSpuById/${spuId}`)
  }
}