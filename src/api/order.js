import request_proxy from '@/utils/request_proxy'
import request from '@/utils/request'
import common from '@/utils/common'
// 获取所有库区信息
export function initOrderList(data) {
  return request({
    url: common.fmsPath('/order/get-orders'),
    method: 'post',
    data
  })
}

export function deleteOrder(data) {
  return request({
    url:  common.fmsPath('/order/del'),
    method: 'post',
    data
  })
}

export function forceComplete(data) {
  return request({
    url:  common.fmsPath('/order/force-complete'),
    method: 'post',
    data
  })
}

export function initFmsToSapList(data) {
  return request({
    url:  common.fmsPath('/fmssubmitworktosap/list'),
    method: 'post',
    data
  })
}

export function initCellCompleteProductOrder(data) {
  return request({
    url:  common.fmsPath('/cell-complete-product-order/list'),
    method: 'post',
    data
  })
}

export function getAllLine(data) {
  return request({
    url:  common.fmsPath('/line/guest/all'),
    method: 'post',
    data
  })
}
