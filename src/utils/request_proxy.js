import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getLToken, setLToken } from '@/utils/auth'
import common from '@/utils/common'

import i18n from '@/lang' // internationalization
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_WEB_API, // url = base url + request url
  timeout: common.getGlobalParameters('requestTimeout')|| 30000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const accesstoken = getLToken()// 从本地缓存取出访问令牌
    // console.log(common,store.getters.sySwitch,config)
    //config.baseURL = store.getters.sySwitch
    if (accesstoken) {
      // 让每个请求携带自定义token 请根据实际情况自行修改
      config.headers['my-accept-lang'] =  i18n.locale
      config.headers['fms-fc-proxy'] = common.currentFc
      config.headers.Authorization = 'Bearer ' + accesstoken
    } else {
      const user = sessionStorage.getItem('userInfo')
      if (user) {
        // 判断刷新令牌是否过期
        // const promisefresh = new Promise(function(resolve, reject) {
        //   // 刷新token
        //   axios.get('/web-api/api/Users/GetUserToken', {
        //     params: { username: user }
        //   }).then(response => {
        //     if (response.data.E_COMM_RETURN.TYPE === 'S') {
        //       setLToken(response.data.E_COMM_RETURN.ACCESS_TOKEN)
        //       config.headers.Authorization = 'Bearer ' + response.data.E_COMM_RETURN.ACCESS_TOKEN
        //       resolve(config)
        //     } else {
        //       MessageBox.confirm('你的令牌已过期，可以取消继续留在该页面，或者重新登录', '确定登出', {
        //         confirmButtonText: '重新登录',
        //         cancelButtonText: '取消',
        //         type: 'warning'
        //       }).then(() => {
        //         store.dispatch('user/resetToken').then(() => {
        //           location.reload()
        //         })
        //       })
        //     }
        //   })
        // })
        // return promisefresh
      }
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * 如果您想获取http信息，如标题或状态
   * 请返回  response => response
  */

  /**
   *通过自定义代码确定请求状态
   * 您还可以通过HTTP状态代码来判断状态
   */
  response => {
    const res = response
    let res_data = res.data
    if (res_data.code === 50008 || res_data.code === 50012 || res_data.code === 50014 || res_data.code === 401) {
      // to re-loginn
      MessageBox.confirm('当前该你没有权限操作,可能是会话已经过期，也可能是你没被授权，可以尝试重新登录!', '确定退出吗', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    }

    if (response.status === 200) {
      return res
    }
    /* if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    } */
  },
  error => {
    if (error.response.status === 401 && error.response.headers.act === 'expired') {
      /* MessageBox.confirm('你的令牌已过期，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }) */
    } else {
      console.log('err' + error) // for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
