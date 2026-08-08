import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取巷道信息
export function GetIOControls() {
    return request_proxy({
      url: common.wmsPath('/api/IoControl/GetIOControls'),
      method: 'get',
    })
  }
// 获取巷道信息
export function GetIOControlById(query) {
    return request_proxy({
      url: common.wmsPath('/api/IoControl/GetIOControlById'),
      method: 'get',
      params:query
    })
  }
  // 获取巷道信息
export function AddIOControl(data) {
    return request_proxy({
      url: common.wmsPath('/api/IoControl/AddIOControl'),
      method: 'post',
      data
    })
  }
    // 获取巷道信息
export function DeleteIoControl(data) {
    return request_proxy({
      url: common.wmsPath('/api/IoControl/DeleteIoControl'),
      method: 'post',
      data
    })
  }
      // 获取巷道信息
export function UpdateIOControl(data) {
    return request_proxy({
      url: common.wmsPath('/api/IoControl/UpdateIOControl'),
      method: 'post',
      data
    })
  }