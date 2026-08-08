import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取所有货位描述信息
export function GetFrontData() {
  return request_proxy({
    url: common.fmsPath('/dailyefficiencystatisticsbydatetime/guest/getHomeAllData'),
    method: 'get'
  })
}
export function GetHomeNgData(query) {
  return request_proxy({
    url: common.fmsPath('/dailyefficiencystatisticsbydatetime/guest/getHomeNgData'),
    method: 'get',
    params: query
  })
}
export function getHomeNgDataCellBarCode(query) {
  return request_proxy({
    url: common.fmsPath('/dailyefficiencystatisticsbydatetime/guest/getHomeNgDataCellBarCode'),
    method: 'get',
    params: query
  })
}