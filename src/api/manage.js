import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取所有任务信息
export function getManagemain(query) {
  return request_proxy({
    url: common.wmsPath('/api/Manage/GetManageMain'),
    method: 'get',
    params: query
  })
}

// 获取managelistid对应的任务信息
export function getManagelistbycellid(query) {
  return request_proxy({
    url: common.wmsPath('/api/Manage/GetManageListByManageid'),
    method: 'get',
    params: query
  })
}

// 新建入库任务--------等待下达
export function createManageUp(data) {
  return request_proxy({
    url: common.wmsPath('/api/Managetask/CreateManageUp'),
    method: 'post',
    data
  })
}

// 创建入库任务--------等待执行
export function createManageIn(data) {
  return request_proxy({
    url: common.wmsPath('/api/Managetask/CreateManageIn'),
    method: 'post',
    data
  })
}

// 创建出库任务---------计划
export function createManagePlanOut(data) {
  return request_proxy({
    url: common.wmsPath('/api/Managetask/CreateManagePlanOut'),
    method: 'post',
    data
  })
}

// 创建出库任务---------无计划
export function createManageOut(data) {
  return request_proxy({
    url: common.wmsPath('/api/Managetask/CreateManageOut'),
    method: 'post',
    data
  })
}

// 创建出库任务----拣选
export function createManageSortOut(query) {
  return request_proxy({
    url: common.wmsPath('/api/Managetask/CreateManageSortOut'),
    method: 'get',
    params: query
  })
}

// 创建移库任务
export function createManageMove(data) {
  return request_proxy({
    url: common.wmsPath('/api/Managetask/CreateManageMove'),
    method: 'post',
    data
  })
}

// 更新任务
export function updateManage(data) {
  return request_proxy({
    url: common.wmsPath('/api/Managetask/UpdateManage'),
    method: 'post',
    data
  })
}

// 删除任务
export function deleteManage(data) {
  return request_proxy({
    url: common.wmsPath('/api/Managetask/DeleteManage'),
    method: 'post',
    data
  })
}

// 下发任务
export function sendTask(data) {
  return request_proxy({
    url: common.wmsPath('/api/Managetask/SendTask'),
    method: 'post',
    data
  })
}

// 完成任务
export function completeTask(data) {
  return request_proxy({
    url: common.wmsPath('/api/Managetask/CompleteTask'),
    method: 'post',
    data
  })
}
