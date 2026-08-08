import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import i18n from '@/lang' // internationalization
import common from '@/utils/common'
import cache from './cache'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: common.getGlobalParameters('requestTimeout')|| 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
      config.headers['my-accept-lang'] =  i18n.locale
      config.headers['fms-fc-proxy'] = common.currentFc

      config.headers['Authorization'] = 'Bearer ' + getToken()
    }

    // if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
    //   const requestObj = {
    //     url: config.url,
    //     data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
    //     time: new Date().getTime()
    //   }
    //   const sessionObj = cache.session.getJSON('sessionObj')
    //   if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
    //     cache.session.setJSON('sessionObj', requestObj)
    //   } else {
    //     const s_url = sessionObj.url;                  // 请求地址
    //     const s_data = sessionObj.data;                // 请求数据
    //     const s_time = sessionObj.time;                // 请求时间
    //     const interval = 5000;                         // 间隔时间(ms)，小于此时间视为重复提交
    //     if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
    //       const message = '数据正在处理，请勿重复提交';
    //       console.warn(`[${s_url}]: ` + message)
    //       return Promise.reject(new Error(message))
    //     } else {
    //       cache.session.setJSON('sessionObj', requestObj)
    //     }
    //   }
    // }
    
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      let msg =  res.message||res.data
      Message({
        message: msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014 || res.code === 401) {
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
      let msg1 =  res.message||res.data
      return Promise.reject(new Error(msg1 || 'Error'))
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
