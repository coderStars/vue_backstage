import request from '@/utils/request'

export default {
  // /admin/product/deleteAttr/{attrId}
  // 删除属性
  delete(attrId) {
    return request.delete(`/admin/product/deleteAttr/${attrId}`)
  },

  // GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  // 获得属性
  getAttrList(category1Id,category2Id,category3Id) {
    return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },

  // /admin/product/saveAttrInfo
  //保存属性
  saveOrUpdateAttr(attrInfo) {
    return request.post('/admin/product/saveAttrInfo',attrInfo)
  },
  // 获取所有的属性
  getList(category1Id,category2Id,category3Id){
    return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },
  // 添加或者修改属性
  addOrUpdate(attr){
    return request.post('/admin/product/saveAttrInfo', attr)
  }
}



