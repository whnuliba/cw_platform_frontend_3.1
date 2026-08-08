import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 重新下发
export function rePost(data) {
  return request_proxy({
    url: common.wcsPath('/api/CarryTask/RePostTaskDetail'),
    method: 'post',
    data
  })
}
// 强制完成
export function forceFinish(data) {
  return request_proxy({
    url: common.wcsPath('/api/CarryTask/FinishTaskDetail'),
    method: 'post',
    data
  })
}
// 启/禁用自动任务 -- 堆垛机
export function EnableStocker(data) {
  return request_proxy({
    url: common.wcsPath('/api/Stocker/EnableStocker'),
    method: 'post',
    data
  })
}


