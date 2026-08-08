import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取权限对应的按钮
export function getRoleButtonList(query) {
  return request_proxy({
    url: common.wmsPath('/api/RoleButton/GetRoleButtonList'),
    method: 'get',
    params: query
  })
}

// 获取权限对应的按钮
export function getRoleButtonListByRoleMenu(query) {
  return request_proxy({
    url: '/menu/get-button', // /api/RoleButton/GetRoleButtonListByRoleMenu
    method: 'post',
    params: query
  })
}

// 更新角色按钮状态
export function updateRoleButton(data) {
  return request_proxy({
    url: common.wmsPath('/api/RoleButton/UpdateRoleButton'),
    method: 'post',
    data
  })
}
