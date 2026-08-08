import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取角色信息
export function getRoles(query) {
  return request_proxy({
    url: common.wmsPath('/api/Role/GetRoleList'),
    method: 'get',
    params: query
  })
}

// 获取角色信息
export function getRolesNormal(query) {
  return request_proxy({
    url: common.wmsPath('/api/Role/GetRolesNormal'),
    method: 'get',
    params: query
  })
}

// 获取角色信息
export function getRole(query) {
  return request_proxy({
    url: common.wmsPath('/api/Role/GetRole'),
    method: 'get',
    params: query
  })
}

// 新建角色
export function createRole(data) {
  return request_proxy({
    url: common.wmsPath('/api/Role/CreateRole'),
    method: 'post',
    data
  })
}
// 获取角色信息-new
export function newgetRole(data) {
  return request_proxy({
    url: common.authPath('/user/list'),
    method: 'post',
    data
  })
}
// 添加用户
export function addUser(data) {
  return request_proxy({
    url: common.authPath('/user/add'),
    method: 'post',
    data
  })
}
// 编辑用户
export function editUser(data) {
  return request_proxy({
    url: common.authPath('/user/add'),
    method: 'post',
    data
  })
}
// 角色信息
export function roleAll(data) {
  return request_proxy({
    url: common.authPath('/role/role_all'),
    method: 'post',
    data
  })
}

// 角色组获取角色
export function roleItem(data) {
  return request_proxy({
    url: common.authPath('/role/role_items'),
    method: 'post',
    data
  })
}
// 角色组添加角色
export function saveRoleGrpRole(data) {
  return request_proxy({
    url: common.authPath('/roleGrp/batch_save_role'),
    method: 'post',
    data
  })
}

//提交授权
export function saveUserRole(data) {
  return request_proxy({
    url: common.authPath('/user/batch_save_user_role'),
    method: 'post',
    data
  })
}
//提交授权
export function delUserRole(data) {
  return request_proxy({
    url: common.authPath('/user/del_user_role'),
    method: 'post',
    data
  })
}

// 更新角色
export function updateRole(data) {
  return request_proxy({
    url: common.wmsPath('/api/Role/UpdateRole'),
    method: 'post',
    data
  })
}

// 删除角色
export function deleteRole(data) {
  return request_proxy({
    url: common.wmsPath('/api/Role/DeleteRole'),
    method: 'post',
    data
  })
}
