import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 根据工艺号查询工艺主表
export function GetTechnicsProcessMainByBatteryType(query) {
  return request_proxy({
    url: common.wmsPath('/api/Technics/GetTechnicsProcessMainByBatteryType'),
    method: 'Get',
    params:query
  })
}
// 根据主表ID查询子表
export function GetTechnicsProcessListByTechnicsId(query) {
    return request_proxy({
      url: common.wmsPath('/api/Technics/GetTechnicsProcessListByTechnicsId'),
      method: 'Get',
      params:query
    })
  }
  // 根据工艺号查询工艺主表Temp
export function GetTechnicsProcessMainTempByBatteryType(query) {
    return request_proxy({
      url: common.wmsPath('/api/Technics/GetTechnicsProcessMainTempByBatteryType'),
      method: 'Get',
      params:query
    })
  }
  // 根据工艺号查询工艺子表Temp
export function GetTechnicsProcessListTempByTechnicsId(query) {
    return request_proxy({
      url: common.wmsPath('/api/Technics/GetTechnicsProcessListTempByTechnicsId'),
      method: 'Get',
      params:query
    })
  }
  // 添加工艺主表
export function AddTechnicsProcessMain(data) {
    return request_proxy({
      url: common.wmsPath('/api/Technics/AddTechnicsProcessMain'),
      method: 'Post',
      data
    })
  }
  // 修改工艺主表
export function UpdateTechnicsProcessMain(data) {
    return request_proxy({
      url: common.wmsPath('/api/Technics/UpdateTechnicsProcessMain'),
      method: 'Post',
      data
    })
  }
  // 删除工艺主表及子表
export function DeleteTechnicsProcessMainAndList(data) {
    return request_proxy({
      url: common.wmsPath('/api/Technics/DeleteTechnicsProcessMainAndList'),
      method: 'Post',
      data
    })
  }
  // 添加工艺子表
export function AddTechnicsProcessList(data) {
    return request_proxy({
      url: common.wmsPath('/api/Technics/AddTechnicsProcessList'),
      method: 'Post',
      data
    })
  }
  // 删除工艺子表
export function DeleteTechnicsProcessList(data) {
    return request_proxy({
      url: common.wmsPath('/api/Technics/DeleteTechnicsProcessList'),
      method: 'Post',
      data
    })
  }
  // 更改工艺子表
export function UpdateTechnicsProcessList(data) {
    return request_proxy({
      url: common.wmsPath('/api/Technics/UpdateTechnicsProcessList'),
      method: 'Post',
      data
    })
  }
  // 创建主表及子表
export function CreateTechnicsProcessMainAndList(data) {
    return request_proxy({
      url: common.wmsPath('/api/Technics/CreateTechnicsProcessMainAndList'),
      method: 'Post',
      data
    })
  }
  
  export function GetTechnicsProcessMainsByLambdaSearch(data) {
    return request_proxy({
      url: common.wmsPath('/api/Technics/GetTechnicsProcessMainsByLambdaSearch'),
      method: 'Post',
      data
    })
  }
  export function GetTechnicsProcessMains(query) {
    return request_proxy({
      url: common.wmsPath('/api/Technics/GetTechnicsProcessMains'),
      method: 'Get',
      params:query
    })
  }
  export function GetTechnicsProcessMainTemps(query) {
    return request_proxy({
      url: common.wmsPath('/api/Technics/GetTechnicsProcessMainTemps'),
      method: 'Get',
      params:query
    })
  }

  export function GetTechnicsProcessMainsTempByLambdaSearch(data) {
    return request_proxy({
      url: common.wmsPath('/api/Technics/GetTechnicsProcessMainsTempByLambdaSearch'),
      method: 'Post',
      data
    })
  }
  export function GetTechnicsProcessListTemps(data) {
    return request_proxy({
      url: common.wmsPath('/api/Technics/GetTechnicsProcessListTemps'),
      method: 'Get',
      data
    })
  }
  export function GetGroupByMain(data) {
    return request_proxy({
      url: common.wmsPath('/api/Technics/GetGroupByMain'),
      method: 'Get',
      data
    })
  }
  export function GetGroupByMainTemp(data) {
    return request_proxy({
      url: common.wmsPath('/api/Technics/GetGroupByMainTemp'),
      method: 'Get',
      data
    })
  }