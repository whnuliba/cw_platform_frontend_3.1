import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
export function GetItemList(query) {
  return request_proxy({
    url: common.wmsPath('/api/Item/GetItemList'),
    method: 'get',
    params: query
  })
}

export function GetSysItemList(query) {
  return request_proxy({
    url: common.wmsPath('/api/Item/GetSysItemList'),
    method: 'get',
    params: query
  })
}


export function GetSysItem() {
  return request_proxy({
    url: common.wmsPath('/api/Item/GetSysItem'),
    method: 'get',
  })
}

export function CreateSysItem(data) {
  return request_proxy({
    url: common.wmsPath('/api/Item/CreateSysItem'),
    method: 'post',
    data
  })
}

export function CreateSysItemList(data) {
  return request_proxy({
    url: common.wmsPath('/api/Item/CreateSysItemList'),
    method: 'post',
    data
  })
}

export function DeleteSysItem(data) {
  return request_proxy({
    url: common.wmsPath('/api/Item/DeleteSysItem'),
    method: 'post',
    data
  })
}

export function DeleteSysItemList(data) {
  return request_proxy({
    url: common.wmsPath('/api/Item/DeleteSysItemList'),
    method: 'post',
    data
  })
}
export function UpdateSysItem(data) {
  return request_proxy({
    url: common.wmsPath('/api/Item/UpdateSysItem'),
    method: 'post',
    data
  })
}
export function UpdateSysItemList(data) {
  return request_proxy({
    url: common.wmsPath('/api/Item/UpdateSysItemList'),
    method: 'post',
    data
  })
}