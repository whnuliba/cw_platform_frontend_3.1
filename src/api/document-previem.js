import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
export function getBucketList() {
  return request_proxy({
    url: common.productPath('/cw/dyn/queryMainFolder'),
    method: 'post',
  })
}

export function getFileList(data) {
    return request_proxy({
      url: common.productPath('/cw/dyn/queryFiles'),
      method: 'post',
      data
    })
  }

  export function createFile(data) {
    return request_proxy({
      url: common.productPath('/cw/dyn/createFile'),
      method: 'post',
      data
    })
  }

  export function delFile(data) {
    return request_proxy({
      url: common.productPath('/cw/dyn/delFile'),
      method: 'post',
      data
    })
  }

  export function pullFile(data) {
    return request_proxy({
      url: common.productPath('/cw/dyn/pullFile'),
      method: 'post',
      data
    })
  }