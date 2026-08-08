import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取所有库区信息
export function getWhArea(query) {
  return request_proxy({
    url: common.wmsPath('/api/Area/GetAreaList'),
    method: 'get',
    params: query
  })
}

// 新建库区
export function createWhArea(data) {
  return request_proxy({
    url: common.wmsPath('/api/Area/CreateArea'),
    method: 'post',
    data
  })
}

// 更新库区
export function updateWhArea(data) {
  return request_proxy({
    url: common.wmsPath('/api/Area/UpdateArea'),
    method: 'post',
    data
  })
}

// 删除库区
export function deleteWhArea(data) {
  return request_proxy({
    url: common.wmsPath('/api/Area/DeleteArea'),
    method: 'post',
    data
  })
}
