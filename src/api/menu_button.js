import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取所有菜单按钮
export function getMenuButtonList(query) {
  return request_proxy({
    url: common.wmsPath('/api/MenuButton/GetMenuButtonList'),
    method: 'get',
    params: query
  })
}

// 获取菜单按钮
export function getMenuButtonListByMenuID(query) {
  return request_proxy({
    url: common.wmsPath('/api/MenuButton/GetMenuButtonListByMenuID'),
    method: 'get',
    params: query
  })
}

// 创建菜单按钮
export function createMenuButton(data) {
  return request_proxy({
    url: common.wmsPath('/api/MenuButton/CreateMenuButton'),
    method: 'post',
    data
  })
}

// 更新菜单按钮
export function updateMenuButton(data) {
  return request_proxy({
    url: common.wmsPath('/api/MenuButton/UpdateMenuButton'),
    method: 'post',
    data
  })
}

// 删除菜单按钮
export function deleteMenuButton(data) {
  return request_proxy({
    url: common.wmsPath('/api/MenuButton/DeleteMenuButton'),
    method: 'post',
    data
  })
}
