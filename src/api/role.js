import request_proxy from '@/utils/request_proxy'

import common from '@/utils/common'

//****************************角色管理-接口api *************************/
// 获取角色表格信息
export function getRoles(data) {
  return request_proxy({
    url: common.authPath('/role/list'),
    method: 'post',
    data
  })
} 

// 添加角色
export function addRoles(data) {
  return request_proxy({
    url: common.authPath('/role/add'),
    method: 'post',
    data
  })
}

// 编辑角色
export function editRoles(data) {
  return request_proxy({
    url: common.authPath('/role/edit'),
    method: 'post',
    data
  })
}

// 删除角色
export function delRoles(data) {
  return request_proxy({
    url: common.authPath('/role/del_role_del'),
    method: 'post',
    data
  })
}

// 功能管理--菜单全部数据、已授权模块数据
export function funcMenu(data) {
  return request_proxy({
    url: common.authPath('/role/func'),
    method: 'post',
    data
  })
}
// 批量授权角色到对应模块
export function batchSaveFuncMng(data) {
  return request_proxy({
    url: common.authPath('/role/batch_save_func'),
    method: 'post',
    data
  })
}

export function funcByRoleId(data) {
  return request_proxy({
    url: common.authPath('/role/func_by_roleid'),
    method: 'post',
    data
  })
}

//****************************用户管理-接口api *************************/ 
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
    url: common.authPath('/user/edit'),
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
