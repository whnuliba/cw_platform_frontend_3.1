import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取所有条件配置信息
export function GetSortingData() {
    return request_proxy({
      url: common.wmsPath('/api/Plan/GetSortingData'),
      method: 'get'
    })
  }
  GetSortingsAllData

  export function GetSortingsAllData() {
    return request_proxy({
      url: common.wmsPath('/api/Plan/GetSortingsAllData'),
      method: 'get'
    })
  }

  // 获取所有条件配置信息
export function GetSortingDataToCode(query) {
  return request_proxy({
    url: common.wmsPath('/api/Plan/GetSortingDataToCode'),
    method: 'get',
    params: query
  })
}

  // 添加条件配置信息
export function CreateSorting(data) {
    return request_proxy({
      url: common.wmsPath('/api/Plan/CreateSorting'),
      method: 'post',
      data
    })
  }

    // 修改条件配置信息
export function UpdateSorting(data) {
    return request_proxy({
      url: common.wmsPath('/api/Plan/UpdateSorting'),
      method: 'post',
      data
    })
  }

      // 删除条件配置信息
export function DeleteSorting(data) {
    return request_proxy({
      url: common.wmsPath('/api/Plan/DeleteSorting'),
      method: 'post',
      data
    })
  }