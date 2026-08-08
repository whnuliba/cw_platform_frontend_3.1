import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
export function GetReportTable() {
  return request_proxy({
    url: common.wmsPath('/api/Report/GetReportTable'),
    method: 'get',
  })
}

export function GetReportTableColumn(query) {
  return request_proxy({
    url: common.wmsPath('/api/Report/GetReportTableColumn'),
    method: 'get',
    params: query
  })
}
export function GetReportTableByName(query) {
  return request_proxy({
    url: common.wmsPath('/api/Report/GetReportTableByName'),
    method: 'get',
    params: query
  })
}
export function CreateReport(data) {
  return request_proxy({
    url: common.wmsPath('/api/Report/CreateReport'),
    method: 'post',
    data
  })
}
export function UpdateReportTable(data) {
  return request_proxy({
    url: common.wmsPath('/api/Report/UpdateReportTable'),
    method: 'post',
    data
  })
}
export function DeleteReportTable(data) {
  return request_proxy({
    url: common.wmsPath('/api/Report/DeleteReportTable'),
    method: 'post',
    data
  })
}
export function CreateReportTableColumn(data) {
  return request_proxy({
    url: common.wmsPath('/api/Report/CreateReportTableColumn'),
    method: 'post',
    data
  })
}
export function DeleteReportTableColumn(data) {
  return request_proxy({
    url: common.wmsPath('/api/Report/DeleteReportTableColumn'),
    method: 'post',
    data
  })
}
export function UpdateReportTableColumn(data) {
  return request_proxy({
    url: common.wmsPath('/api/Report/UpdateReportTableColumn'),
    method: 'post',
    data
  })
}