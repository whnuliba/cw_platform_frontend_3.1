import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'

// 获取所有权限对应的菜单
export function getRoleMenuListReturn(query) {
  return request_proxy({
    url: common.wmsPath('/api/RoleMenu/GetRoleMenuListReturn'),
    method: 'get',
    params: query
  })
}

// 获取角色权限对应的菜单
export function getRoleZeroMenuList(data) {
  return request_proxy({
    url: common.authPath('/menu/get-menu-group'),   // /api/RoleMenu/GetRoleMenuListRolecodeReturn
    method: 'post',
    data
  })
}

// 获取角色权限对应的菜单
export function getRoleMenuListByCodeReturn(data) {
  return request_proxy({
    url: common.authPath('/menu/dir'),   // /api/RoleMenu/GetRoleMenuListRolecodeReturn
    method: 'post',
    data
    // params: query
  })
}

// 获取角色权限对应的菜单
export function getRoleMenuListByCodeAndRouteReturn(data) {
  return request_proxy({
    url: common.authPath('/menu/dir-by-name'),   // /api/RoleMenu/GetRoleMenuListRolecodeReturn
    method: 'post',
    data
    // params: query
  })
}

// 获取角色权限对应的菜单
export function getButton(data) {
  return request_proxy({
    url: common.authPath('/menu/get-button'),  
    method: 'post',
    data
    // params: query
  })
}


// 获取角色权限对应的菜单
export function getRoleGroupMenuListByCodeReturn(data) {
  return request_proxy({
    url: common.authPath('/menu/all-dir'),   // /api/RoleMenu/GetRoleMenuListRolecodeReturn
    method: 'post',
    data
    // params: query
  })
}

// 获取角色权限对应的菜单
export function getRoleMenuListByLevelReturn(query) {
  return request_proxy({
    url: common.wmsPath('/api/RoleMenu/GetRoleMenuListByLevelReturn'),
    method: 'get',
    params: query
  })
}

// 更新用户
export function updateRole(data) {
  return request_proxy({
    url: common.wmsPath('/api/RoleMenu/UpdateRoleMenu'),
    method: 'post',
    data
  })
}
