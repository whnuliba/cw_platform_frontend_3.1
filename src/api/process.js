import request from '@/utils/fms-request'
import common from '@/utils/common'
export function getProcessInfo(data) {
  return request({
    url: common.fmsPath('/process/list'),
    method: 'post',
    data
  })
}

export function getProcessFlowInfo(data) {
  return request({
    url: common.fmsPath('/process-flow/list'),
    method: 'post',
    data
  })
}

export function getApproveStateInfo(data) {
  return request({
    url: common.fmsPath('/constant/approve-state'),
    method: 'post',
    data
  })
}


export function getProcessFlowDtsInfo(data) {
  return request({
    url: common.fmsPath('/process-flow-dts/guest/get-dts'),
    method: 'post',
    data
  })
}
