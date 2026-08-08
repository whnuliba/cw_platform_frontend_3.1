import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取所有用户信息
export function getUserList(query) {
  return request_proxy({
    url: common.wmsPath('/api/Users/GetUserList'),
    method: 'get',
    params: query
  })
}

// 登录获取token用户信息接口
export function getUser(data) {
  return request_proxy({
    url: common.authPath('/auth'),  // /api/Users/GetUser
    method: 'post',
    data
  })
}

// 获取用户信息 (手势登录)
export function getUserByGestrue(query) {
  return request_proxy({
    url: common.wmsPath('/api/Users/GetUserByGestrue'),
    method: 'get',
    params: query
  })
}

// 获取用户信息 （验证码登录）
export function getUserByCode(query) {
  return request_proxy({
    url: common.wmsPath('/api/Users/GetUserByCode'),
    method: 'get',
    params: query
  })
}

// 获取用户令牌
export function getUserToken(query) {
  return request_proxy({
    url: common.wmsPath('/api/Users/GetUserToken'),
    method: 'get',
    params: query
  })
}

// 新建用户
export function createUser(data) {
  return request_proxy({
    url: common.wmsPath('/api/Users/CreateUser'),
    method: 'post',
    data
  })
}

// 更新用户
export function updateUser(data) {
  return request_proxy({
    url: common.wmsPath('/api/Users/UpdateUser'),
    method: 'post',
    data
  })
}

// 删除用户
export function deleteUser(data) {
  return request_proxy({
    url: common.wmsPath('/api/Users/DeleteUser'),
    method: 'post',
    data
  })
}
