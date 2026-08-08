/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: 系统管理-菜单管理api
 */
import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取所有菜单
export function getMenuList(query) {
  return request_proxy({
    url: common.wmsPath('/api/Menu/GetMenuList'),
    method: 'get',
    params: query
  })
}

// 获取层级菜单
export function getMenuListByLevel(query) {
  return request_proxy({
    url: common.wmsPath('/api/Menu/GetMenuListByLevel'),
    method: 'get',
    params: query
  })
}

// 获取所有菜单
export function getMenuListReturn(query) {
  return request_proxy({
    url: common.wmsPath('/api/Menu/GetMenuListReturn'),
    method: 'get',
    params: query
  })
}

// 创建菜单
export function addMenu(data) {
  return request_proxy({
    url:common.authPath('/menu/add'),
    method: 'post',
    data
  })
}

// 更新菜单
export function updateMenu(data) {
  return request_proxy({
    url: common.wmsPath('/api/Menu/UpdateMenu'),
    method: 'post',
    data
  })
}

// 删除菜单
export function deleteMenu(data) {
  return request_proxy({
    url: common.authPath('/menu/menu_del'),
    method: 'post',
    data
  })
}
