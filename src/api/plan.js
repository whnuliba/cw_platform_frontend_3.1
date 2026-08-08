import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取所有计划
export function getPlanMain(query) {
  return request_proxy({
    url: common.wmsPath('/api/Plan/GetPlanMain'),
    method: 'get',
    params: query
  })
}

export function GetPlanReport(query) {
  return request_proxy({
    url: common.wmsPath('/api/Plan/GetPlanReport'),
    method: 'get',
    params: query
  })
}

// 获取计划主表------未完成
export function getPlanMainNoComplete(query) {
  return request_proxy({
    url: common.wmsPath('/api/Plan/GetPlanMainNoComplete'),
    method: 'get',
    params: query
  })
}

// 删除计划配置表
export function DeletePlanDetail(data) {
  return request_proxy({
    url: common.wmsPath('/api/Plan/DeletePlanDetail'),
    method: 'post',
    data
  })
}

// 获取计划明细
export function getPlanListByPlanid(query) {
  return request_proxy({
    url: common.wmsPath('/api/Plan/GetPlanListByPlanid'),
    method: 'get',
    params: query
  })
}

// 获取分页计划明细列表
export function GetPlanListPage(data) {
  return request_proxy({
    url: common.wmsPath('/api/Plan/GetPlanListPage'),
    method: 'post',
    data
  })
}

// 获取计划明细------已完成
export function getPlanListComplete(query) {
  return request_proxy({
    url: common.wmsPath('/api/Plan/GetPlanListComplete'),
    method: 'get',
    params: query
  })
}

// 创建计划
export function createPlan(data) {
  return request_proxy({
    url: common.wmsPath('/api/Plan/CreatePlan'),
    method: 'post',
    data
  })
}

// 更新计划状态
export function updatePlanStatus(data) {
  return request_proxy({
    url: common.wmsPath('/api/Plan/UpdatePlanStatus'),
    method: 'post',
    data
  })
}

// 更新计划明细
export function updatePlanlist(data) {
  return request_proxy({
    url: common.wmsPath('/api/Plan/UpdatePlanlist'),
    method: 'post',
    data
  })
}

// 删除计划
export function deletePlan(data) {
  return request_proxy({
    url: common.wmsPath('/api/Plan/DeletePlan'),
    method: 'post',
    data
  })
}

// 完成计划
export function completePlan(data) {
  return request_proxy({
    url: common.wmsPath('/api/Plan/CompletePlan'),
    method: 'post',
    data
  })
}

// 获取配置信息
export function GetPlanDetailByListId(query) {
  return request_proxy({
    url: common.wmsPath('/api/Plan/GetPlanDetailByListId'),
    method: 'get',
    params:query
  })
}

// 创建计划详细条件配置
export function CreatePlanListDetail(data) {
  return request_proxy({
    url: common.wmsPath('/api/Plan/CreatePlanListDetail'),
    method: 'post',
    data
  })
}

