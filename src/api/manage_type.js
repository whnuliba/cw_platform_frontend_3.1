import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取任务类型
export function getManageTypeList(query) {
  return request_proxy({
    url: common.wmsPath('/api/ManageType/GetManageTypeList'),
    method: 'get',
    params: query
  })
}

// 创建任务类型
export function createManageType(data) {
  return request_proxy({
    url: common.wmsPath('/api/ManageType/CreateManageType'),
    method: 'post',
    data
  })
}

// 更新任务类型
export function updateManageType(data) {
  return request_proxy({
    url: common.wmsPath('/api/ManageType/UpdateManageType'),
    method: 'post',
    data
  })
}

// 删除任务类型
export function deleteManageType(data) {
  return request_proxy({
    url: common.wmsPath('/api/ManageType/DeleteManageType'),
    method: 'post',
    data
  })
}
