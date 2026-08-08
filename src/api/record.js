import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取所有任务记录
export function getRecordlist(query) {
  return request_proxy({
    url: common.wmsPath('/api/Record/GetRecordList'),
    method: 'get',
    params: query
  })
}

export function getRecordListPage(data) {
  return request_proxy({
    url: common.wmsPath('/api/Record/getRecordListPage'),
    method: 'post',
    data
  })
}

// 获取recordid对应的任务记录
export function getRecordlistbycellid(query) {
  return request_proxy({
    url: common.wmsPath('/api/Record/GetRecordListByRecordid'),
    method: 'get',
    params: query
  })
}

export function GetRecordReport(query) {
  return request_proxy({
    url: common.wmsPath('/api/Record/GetRecordReport'),
    method: 'get',
    params: query
  })
}

// 获取stockbarcode对应的任务记录
export function getRecordlistbystockbarcode(query) {
  return request_proxy({
    url: common.wmsPath('/api/Record/GetRecordListByStockBarcode'),
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

// 获取计划记录
export function GetRecordPlanPage(data) {
  return request_proxy({
    url: common.wmsPath('/api/Record/GetRecordPlanPage'),
    method: 'post',
    data
  })
}
