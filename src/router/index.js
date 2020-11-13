import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import { getToken } from '@/utils/auth'
import store from '@/store'

Vue.use(Router)

const originPush = Router.prototype.push
const originReplace = Router.prototype.replace

Router.prototype.push = function(location,onResolved,onRejected){
  if(onResolved === undefined && onRejected === undefined){
    //代表没有传递处理的回调无论是成功还是失败
    return originPush.call(this,location).catch(err => err)
  }else{
    return originPush.call(this,location,onResolved,onRejected)
  }
}
Router.prototype.replace = function(location,onResolved,onRejected){
  if(onResolved === undefined && onRejected === undefined){
    //代表没有传递处理的回调无论是成功还是失败
    return originReplace.call(this,location).catch(() => {})
  }else{
    return originReplace.call(this,location,onResolved,onRejected)
  }
}

const router = new Router({
  routes
})

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  const token = getToken()

  if (token) {
    // console.log('token');
    // store.dispatch('user/getUserInfo')
    next()
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }

  next()
})

// router.afterEach(to => {
// })



export default router
