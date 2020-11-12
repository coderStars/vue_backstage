import request from '@/utils/request'


export default {
  // GET /admin/product/baseTrademark/getTrademarkList
  getSkuList({ page, limit }) {
    return request.get(`/admin/product/list/${page}/${limit}`)
  },
  // /admin/product/deleteSku/{skuId}
  deleteSkuOne(skuId) {
    return request.delete(`/admin/product/deleteSku/${skuId}`)
  },

  /* 
根据指定的SPU的id查询所有对应的SKU的列表
GET /admin/product/findBySpuId/{spuId}
*/
  getListBySpuId(spuId) {
    return request.get(`/admin/product/findBySpuId/${spuId}`)

  },

  /* 
  获取指定SPU的id对应的图片列表
  GET /admin/product/spuImageList/{spuId}
  */
 getSpuImageList (spuId) {
  return request.get(`/admin/product/spuImageList/${spuId}`)
}
}
