import request from '@/utils/fms-request'

import request_global from '@/utils/request'
import common from '@/utils/common'


const actions = {
actionFmsPost(url,data){
    return  request({
        url: common.fmsPath(url),
        method: 'post',
        data
      })
},
actionMdmPost(url,data){
  return  request({
      url: common.mdmPath(url),
      method: 'post',
      data
    })
},
actionProductPost(url,data){
  return  request({
      url: common.productPath(url),
      method: 'post',
      data
    })
},
actionTpmPost(url,data){
  return  request({
      url: common.tpmPath(url),
      method: 'post',
      data
    })
},
actionWmsPost(url,data){
  return  request({
      url: common.wmsPath(url),
      method: 'post',
      data
    })
}
,actionAuthPost(url,data){
    return  request({
        url: common.authPath(url),
        method: 'post',
        data
      })
}
,actionTaskPost(url,data){
  return  request({
      url: common.taskPath(url),
      method: 'post',
      data
    })
}
,actionWcsPost(url,data){
    return  request({
        url: common.wcsPath(url),
        method: 'post',
        data
      })
}
,actionFmsHisPost(url,data){
  return  request({
      url: common.fmsHisPath(url),
      method: 'post',
      data
    })
},
actionServerPost(url,data){
  return  request({
      url: common.serverPath(url),
      method: 'post',
      data
    })
},
actionPost(url,data){
  return  request({
      url: url,
      method: 'post',
      data
    })
},
action(url,data,options,method='post'){
  return  request_global({
      url: url,
      method: method,
      ...options,
      data
    })
}
//

}
export default {
  name:'httpUtils',
  ...actions
}