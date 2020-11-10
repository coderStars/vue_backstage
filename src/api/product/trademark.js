import request from '@/utils/request'


export default {
  // GET /admin/product/baseTrademark/getTrademarkList
  getTrademarkListAll() {
    return request.get('/admin/product/baseTrademark/getTrademarkList')
  }
}
