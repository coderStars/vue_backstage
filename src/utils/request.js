import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
import store from '@/store'

const _Message = Message // 必须定义新的名称, 否则会报错

// create an axios instance
const service = axios.create({
  baseURL: '/dev-api', // api 的 base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const result = response.data
    /* 
    code为非20000或200是抛错 可结合自己业务进行修改
    */
    if (result.code !== 20000 && result.code !== 200) {
      if (result.code === 201) { // 删除商品相关的系统数据时, 错误信息保存在了data上
        _Message.error(result.data || '未知错误')
      } else {
        _Message.error(result.message || '未知错误')
      }

      // 返回了一个失败的promise
      // return Promise.reject(new Error(result.data || result.message || '未知错误'))
      return Promise.reject(new Error(result.message || '未知错误'))
    } else {
      return result
    }
  },
  error => {
    console.log('err' + error)
    // 统一显示错误提示
    _Message({
      message: error.message || '请求出错了',
      type: 'error',
      duration: 5 * 1000
    })
    // 向下传递错误, 具体的请求右以选择处理或不处理
    return Promise.reject(error)
  }
)

export default service
