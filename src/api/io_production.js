import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取巷道信息
export function getIOProductions(query) {
    return request_proxy({
      url: common.wmsPath('/api/IOProduction/GetIOProductions'),
      method: 'get',
      params: query
    })
  }

  // 获取巷道信息
export function GetIOProductionsByCode(query) {
  return request_proxy({
    url: common.wmsPath('/api/IOProduction/GetIOProductionsByCode'),
    method: 'get',
    params: query
  })
}

  // 创建巷道信息
  export function createIOProduction(data) {
    return request_proxy({
      url: common.wmsPath('/api/IOProduction/CreateIOProduction'),
      method: 'post',
      data
    })
  }

  // 更新巷道信息
  export function updateIOProduction(data) {
    return request_proxy({
      url: common.wmsPath('/api/IOProduction/UpdateIOProduction'),
      method: 'post',
      data
    })
  }

    // 更新巷道信息
    export function UpdateIOProductions(data) {
      return request_proxy({
        url: common.wmsPath('/api/IOProduction/UpdateIOProductions'),
        method: 'post',
        data
      })
    }

     // 更新巷道信息
     export function UpdatePlanAndIo(data) {
      return request_proxy({
        url: common.wmsPath('/api/IOProduction/UpdatePlanAndIo'),
        method: 'post',
        data
      })
    }

  // 删除巷道信息
  export function deleteIOProduction(data) {
    return request_proxy({
      url: common.wmsPath('/api/IOProduction/DeleteIOProduction'),
      method: 'post',
      data
    })
  }