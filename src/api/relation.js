import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取关联信息
export function getRelationByID(query) {
  return request_proxy({
    url: common.wmsPath('/api/Relation/GetRelationByID'),
    method: 'get',
    params: query
  })
}

// 获取关联信息
export function getRelationsByRoleID(query) {
  return request_proxy({
    url: common.wmsPath('/api/Relation/GetRelationsByRoleID'),
    method: 'get',
    params: query
  })
}

// 更新关联信息
export function updateRelation(data) {
  return request_proxy({
    url: common.wmsPath('/api/Relation/UpdateRelation'),
    method: 'post',
    data
  })
}
