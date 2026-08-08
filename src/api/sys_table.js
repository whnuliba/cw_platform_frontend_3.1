/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: 系统管理-菜单管理接口
 */
import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取1级菜单信息
export function getMenuTable(data) {
  return request_proxy({
    url: common.authPath('/menu/pid'),
    method: 'post',
    data
  })
}

// 获取2级菜单信息
export function getMenuTree(data) {
  return request_proxy({
    url: common.authPath('/menu/tree'),
    method: 'post',
    data
  })
}

// 获取表格信息
export function getSysTable(query) {
  return request_proxy({
    url: common.wmsPath('/api/Systable/GetSysTable'),
    method: 'get',
    params: query
  })
}

// 获取表格行信息
export function getSysTableColumn(query) {
  return request_proxy({
    url: common.wmsPath('/api/Systable/GetSysTableColumn'),
    method: 'get',
    params: query
  })
}

// 获取表格行信息
export function getSysTableColumnByTableCode(query) {
  return request_proxy({
    url: common.wmsPath('/api/Systable/GetSysTableColumnByTableCode'),
    method: 'get',
    params: query
  })
}

// 新建表格
export function createSysTable(data) {
  return request_proxy({
    url: common.wmsPath('/api/Systable/CreateSysTable'),
    method: 'post',
    data
  })
}

// 更新表格
export function updateSysTable(data) {
  return request_proxy({
    url: common.wmsPath('/api/Systable/UpdateSysTable'),
    method: 'post',
    data
  })
}

// 删除表格
export function deleteSysTable(data) {
  return request_proxy({
    url: common.wmsPath('/api/Systable/DeleteSysTable'),
    method: 'post',
    data
  })
}

// 新建表格行
export function createSysTableColumn(data) {
  return request_proxy({
    url: common.wmsPath('/api/Systable/CreateSysTableColumn'),
    method: 'post',
    data
  })
}

// 更新表格行
export function updateSysTableColumn(data) {
  return request_proxy({
    url: common.wmsPath('/api/Systable/UpdateSysTableColumn'),
    method: 'post',
    data
  })
}

// 删除表格行
export function deleteSysTableColumn(data) {
  return request_proxy({
    url: common.wmsPath('/api/Systable/DeleteSysTableColumn'),
    method: 'post',
    data
  })
}
