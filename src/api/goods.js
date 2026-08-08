import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取所有物料信息(物料和托盘)
export function getGoods(query) {
  return request_proxy({
    url: common.wmsPath('/api/Goods/GetGoodsMainFirst'),
    method: 'get',
    params: query
  })
}

// 获取物料信息(物料或托盘)
export function getClassGoods(query) {
  return request_proxy({
    url: common.wmsPath('/api/Goods/GetGoodsMainByClass'),
    method: 'get',
    params: query
  })
}

// 创建物料信息
export function createGoods(data) {
  return request_proxy({
    url: common.wmsPath('/api/Goods/CreateGoods'),
    method: 'post',
    data
  })
}

// 批量上传物料信息
export function createBatchGoods(data) {
  return request_proxy({
    url: common.wmsPath('/api/Goods/CreateBatchGoods'),
    method: 'post',
    data
  })
}

// 更新物料信息
export function updateGoods(data) {
  return request_proxy({
    url: common.wmsPath('/api/Goods/UpdateGoods'),
    method: 'post',
    data
  })
}

// 删除物料信息
export function deleteGoods(data) {
  return request_proxy({
    url: common.wmsPath('/api/Goods/DeleteGoods'),
    method: 'post',
    data
  })
}

// 获取物料静置时间
export function getGoodsProcesssetting(query) {
  return request_proxy({
    url: common.wmsPath('/api/Goods/GetGoodsProcesssetting'),
    method: 'post',
    params: query
  })
}

// 删除物料静置时间设置
export function deleteGoodsProcess(data) {
  return request_proxy({
    url: common.wmsPath('/api/Goods/DeleteGoodsProcess'),
    method: 'post',
    data
  })
}
// 添加物料静置时间
export function createGoodsProcess(data) {
  return request_proxy({
    url: common.wmsPath('/api/Goods/CreateGoodsProcess'),
    method: 'post',
    data
  })
}

export function updateGoodsProcess(data) {
  return request_proxy({
    url: common.wmsPath('/api/Goods/UpdateProcess'),
    method: 'post',
    data
  })
}
  // 获取工艺流程列表
  export function getprocesslist(data) {
    return request_proxy({
      url: common.wmsPath('/api/Goods/GetProcessList'),
      method: 'post',
      data
    })
  }

  // 删除工艺流程
  export function deleteprocesslist(data) {
    return request_proxy({
      url: common.wmsPath('/api/Goods/DeleteTechnicsProcessList'),
      method: 'post',
      data
    })
  }

  // 更新工艺流程
  export function updateeprocesslist(data) {
    return request_proxy({
      url: common.wmsPath('/api/Goods/UpdateTechnicsProcessList'),
      method: 'post',
      data
    })
  }

  // 添加工艺流程
  export function createprocesslist(data) {
    return request_proxy({
      url: common.wmsPath('/api/Goods/AddTechnicsProcessList'),
      method: 'post',
      data
    })
  }
