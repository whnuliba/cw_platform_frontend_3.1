import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取计划类型
export function getPlanTypeList(query) {
  return request_proxy({
    url: common.wmsPath('/api/PlanType/GetPlanTypeList'),
    method: 'get',
    params: query
  })
}

// 创建计划类型
export function createPlanType(data) {
  return request_proxy({
    url: common.wmsPath('/api/PlanType/CreatePlanType'),
    method: 'post',
    data
  })
}

// 更新计划类型
export function updatePlanType(data) {
  return request_proxy({
    url: common.wmsPath('/api/PlanType/UpdatePlanType'),
    method: 'post',
    data
  })
}

// 删除计划类型
export function deletePlanType(data) {
  return request_proxy({
    url: common.wmsPath('/api/PlanType/DeletePlanType'),
    method: 'post',
    data
  })
}
