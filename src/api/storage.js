import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取所有库存信息
export function getStoragelist(query) {
  return request_proxy({
    url: common.wmsPath('/api/Storage/GetStorageList'),
    method: 'get',
    params: query
  })
}
// 托盘无分页查询
export function GetViewStorageListType(data) {
  return request_proxy({
    url: common.wmsPath('/api/Storage/GetViewStorageListType'),
    method: 'post',
    data
  })
}
// 物料无分页查询
export function GetStorageListTypes(data) {
  return request_proxy({
    url: common.wmsPath('/api/Storage/GetStorageListTypes'),
    method: 'post',
    data
  })
}

// 获取所有库存信息（物料或托盘)
export function getStoragelistType(query) {
  return request_proxy({
    url: common.wmsPath('/api/Storage/GetStorageListType'),
    method: 'get',
    params: query
  })
}


// 获取分页计划库存信息1
export function GetStorageListPageType(data) {
  return request_proxy({
    url: common.wmsPath('/api/Storage/GetStorageListPageType'),
    method: 'post',
    data
  })
}

// 获取分页计划库存信息2
export function GetStorageListPageTypes(data) {
  return request_proxy({
    url: common.wmsPath('/api/Storage/GetStorageListPageTypes'),
    method: 'post',
    data
  })
}

// 获取所有可用库存信息(立库、平库)
export function getStoragelistEnable(query) {
  return request_proxy({
    url: common.wmsPath('/api/Storage/GetStorageListEnable'),
    method: 'get',
    params: query
  })
}

// 获取cellid对应的库存信息
export function getStoragelistbycellid(query) {
  return request_proxy({
    url: common.wmsPath('/api/Storage/GetStorageListByCellid'),
    method: 'get',
    params: query
  })
}

// 获取cellid对应的库存信息
export function GetStorageReportYear(query) {
  return request_proxy({
    url: common.wmsPath('/api/Storage/GetStorageReportYear'),
    method: 'get',
    params: query
  })
}

// 获取stockbarcode对应的库存信息
export function getStoragelistbystockbarcode(query) {
  return request_proxy({
    url: common.wmsPath('/api/Storage/GetStorageListByStockBarcode'),
    method: 'get',
    params: query
  })
}

// 新建暂存库存
export function createStorageTemp(data) {
  return request_proxy({
    url: common.wmsPath('/api/Storage/CreateTempStorage'),
    method: 'post',
    data
  })
}

// 在库电池信息分页
export function GetStorageDetailList(data) {
  return request_proxy({
    url: common.wmsPath('/api/Storage/GetStorageDetailList'),
    method: 'post',
    data
  })
}

// 在库电池信息分页
export function GetStorageDetailHisList(data) {
  return request_proxy({
    url: common.wmsPath('/api/Storage/GetStorageDetailHisList'),
    method: 'post',
    data
  })
}


// 获取线上缓存信息
export function getStorageCache(data) {
  return request_proxy({
    url: common.wmsPath('/api/Storage/GetStorageCache'),
    method: 'post',
    data
  })
}


// 获取异常库存信息
export function getStorageListNotNormal(data) {
  return request_proxy({
    url: common.wmsPath('/api/Storage/GetStorageListNotNormal'),
    method: 'post',
    data
  })
}
