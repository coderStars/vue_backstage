import request from '@/utils/request'
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
// attrInfoList

// DELETE /admin/product/deleteAttr/{attrId}
// deleteAttr

// GET /admin/product/getAttrValueList/{attrId}
// getAttrValueList

// POST /admin/product/saveAttrInfo
// saveAttrInfo
export default{
  // 获取所有的属性
  getList(category1Id,category2Id,category3Id){
    return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },
  // 删除属性
  delete(attrId){
    return request.delete(`/admin/product/deleteAttr/${attrId}`)
  },
  // 添加或者修改属性
  addOrUpdate(attr){
    return request.post('/admin/product/saveAttrInfo', attr)
  }
}



