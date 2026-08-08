import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取所有货位描述信息
export function getWhcellDescription(query) {
  return request_proxy({
    url: common.wmsPath('/api/Whcell/GetWhCellDescriptionList'),
    method: 'get',
    params: query
  })
}


// 获取所有货位描述信息
export function GetWhCellOptions(query) {
  return request_proxy({
    url: common.wmsPath('/api/Whcell/GetWhCellOptions'),
    method: 'get',
    params: query
  })
}

export function getWhCellByPageList(data) {
  return request_proxy({
    url: common.wmsPath('/api/Whcell/getWhCellByPageList'),
    method: 'post',
    data
  })
}

// 新建货位描述
export function createWhDescription(data) {
  return request_proxy({
    url: common.wmsPath('/api/Whcell/CreateWhDescription'),
    method: 'post',
    data
  })
}

// 更新货位描述
export function updateWhDescription(data) {
  return request_proxy({
    url: common.wmsPath('/api/Whcell/UpdateWhDescription'),
    method: 'post',
    data
  })
}

// 删除货位描述
export function deleteWhDescription(data) {
  return request_proxy({
    url: common.wmsPath('/api/Whcell/DeleteWhDescription'),
    method: 'post',
    data
  })
}

// 删除货位描述
export function deleteMultiWhDescription(data) {
  return request_proxy({
    url: common.wmsPath('/api/Whcell/DeleteMultiWhDescription'),
    method: 'post',
    data
  })
}

// 初始化货位
export function initialWhcell(data) {
  return request_proxy({
    url: common.wmsPath('/api/Whcell/InitialWhcell'),
    method: 'post',
    data
  })
}

// 获取所有货位信息
export function getWhcells(query) {
  return request_proxy({
    url: common.wmsPath('/api/Whcell/GetWhCellList'),
    method: 'get',
    params: query
  })
}

// 获取area、line对应的货位信息
export function getWhcellbyline(query) {
  return request_proxy({
    url: common.wmsPath('/api/Whcell/GetWhCellListByLine'),
    method: 'get',
    params: query
  })
}

// 获取CELL_ID对应的货位信息
export function getWhCellByID(query) {
  return request_proxy({
    url: common.wmsPath('/api/Whcell/GetWhCellByID'),
    method: 'get',
    params: query
  })
}

// 创建货位
export function createWhcell(data) {
  return request_proxy({
    url: common.wmsPath('/api/Whcell/CreateWhcell'),
    method: 'post',
    data
  })
}

// 更新货位
export function updateWhcell(data) {
  return request_proxy({
    url: common.wmsPath('/api/Whcell/UpdateWhcell'),
    method: 'post',
    data
  })
}

// 删除货位
export function deleteWhcell(data) {
  return request_proxy({
    url: common.wmsPath('/api/Whcell/DeleteWhcell'),
    method: 'post',
    data
  })
}

// 获取所有站台列表
export function getWhStationList(query) {
  return request_proxy({
    url: common.wmsPath('/api/Whcell/GetWhStationList'),
    method: 'get',
    params: query
  })
}

// 获取入/出库站台列表
export function getWhStationListByInOut(query) {
  return request_proxy({
    url: common.wmsPath('/api/Whcell/GetWhStationListByInOut'),
    method: 'get',
    params: query
  })
}

// 获取火警货位
export function getFireCode(query) {
  return request_proxy({
    url: common.wmsPath('/api/Whcell/GetFireCode'),
    method: 'get',
    params: query
  })
}

// 火警处理接口-圆柱
export function comfirmFireCellCodeForCylinder(query) {
  return request_proxy({
    url: common.wmsPath('/api/Whcell/ComfirmFireCellCodeForCylinder'),
    method: 'post',
    params: query
  })
}


// 火警取消接口-圆柱
export function cancelFireCellCodeForCylinder(query) {
  return request_proxy({
    url: common.wmsPath('/api/Whcell/CancelFireCellCodeForCylinder'),
    method: 'post',
    params: query
  })
} 



