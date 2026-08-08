import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取所有叠盘站台信息
export function getcelldisk(query) {
  return request_proxy({
    url: common.wmsPath('/api/ForceController/GetCellDisk'),
    method: 'get',
    params: query
  })
}

// 获取叠盘站台--库区
export function getcelldiskbygroupid(query) {
    return request_proxy({
      url: common.wmsPath('/api/ForceController/GetCellDiskByGroupId'),
      method: 'get',
      params: query
    })
  }

  // 获取叠盘站台--可用状态
export function getcelldiskbyflagid(query) {
    return request_proxy({
      url: common.wmsPath('/api/ForceController/GetCellDiskByFlagId'),
      method: 'get',
      params: query
    })
  }

// 新建
export function createcelldisk(data) {
  return request_proxy({
    url: common.wmsPath('/api/ForceController/CreateCellDisk'),
    method: 'post',
    data
  })
}

// 更新
export function updatecelldisk(data) {
  return request_proxy({
    url: common.wmsPath('/api/ForceController/UodateCellDisk'),
    method: 'post',
    data
  })
}

// 删除
export function deletcelldisk(data) {
  return request_proxy({
    url: common.wmsPath('/api/ForceController/DeleteCellDisk'),
    method: 'post',
    data
  })
}

// 强制叠盘完成
export function finishcelldisk(data) {
  return request_proxy({
    url: common.wmsPath('/api/ForceController/GetFinishStackBox'),
    method: 'post',
    data
  })
}
