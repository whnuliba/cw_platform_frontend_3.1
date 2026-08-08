import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取路径信息
export function getControlRoutes(query) {
  return request_proxy({
    url: common.wmsPath('/api/Device/GetControlRouteList'),
    method: 'get',
    params: query
  })
}

// 创建路径信息
export function createControlRoute(data) {
  return request_proxy({
    url: common.wmsPath('/api/Device/CreateRoute'),
    method: 'post',
    data
  })
}

// 更新路径信息
export function updateControlRoute(data) {
  return request_proxy({
    url: common.wmsPath('/api/Device/UpdateRoute'),
    method: 'post',
    data
  })
}

// 删除路径信息
export function deleteControlRoute(data) {
  return request_proxy({
    url: common.wmsPath('/api/Device/DeleteRoute'),
    method: 'post',
    data
  })
}

// 获取巷道信息
export function getManageGroup(query) {
  return request_proxy({
    url: common.wmsPath('/api/Device/GetManageGroup'),
    method: 'get',
    params: query
  })
}

// 创建巷道信息
export function createManageGroup(data) {
  return request_proxy({
    url: common.wmsPath('/api/Device/CreateManageGroup'),
    method: 'post',
    data
  })
}

// 更新巷道信息
export function updateManageGroup(data) {
  return request_proxy({
    url: common.wmsPath('/api/Device/UpdateManageGroup'),
    method: 'post',
    data
  })
}

// 删除巷道信息
export function deleteManageGroup(data) {
  return request_proxy({
    url: common.wmsPath('/api/Device/DeleteManageGroup'),
    method: 'post',
    data
  })
}

export function GetManageGroupListByLaneWay(query) {
  return request_proxy({
    url: common.wmsPath('/api/Device/GetManageGroupListByLaneWay'),
    method: 'get',
    params: query
  })
}

export function GetManageGroupListByStockCode(query) {
  return request_proxy({
    url: common.wmsPath('/api/Device/GetManageGroupListByStockCode'),
    method: 'get',
    params: query
  })
}

export function DeleteManageGrouupList(data) {
  return request_proxy({
    url: common.wmsPath('/api/Device/DeleteManageGrouupList'),
    method: 'post',
    data
  })
}
