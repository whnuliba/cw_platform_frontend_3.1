import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取所有仓库信息
export function getWhWarehouse(query) {
  return request_proxy({
    url: common.wmsPath('/api/Warehouse/GetWarehouseList'),
    method: 'get',
    params: query
  })
}

// 新建仓库
export function createWhWarehouse(data) {
  return request_proxy({
    url: common.wmsPath('/api/Warehouse/CreateWarehouse'),
    method: 'post',
    data
  })
}

// 更新仓库
export function updateWhWarehouse(data) {
  return request_proxy({
    url: common.wmsPath('/api/Warehouse/UpdateWarehouse'),
    method: 'post',
    data
  })
}

// 删除仓库
export function deleteWhWarehouse(data) {
  return request_proxy({
    url: common.wmsPath('/api/Warehouse/DeleteWarehouse'),
    method: 'post',
    data
  })
}
