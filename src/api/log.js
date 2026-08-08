import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取系统日志信息
export function GetLogInfo(query) {
  return request_proxy({
    url: common.wmsPath('/api/LogRead/GetLogData'),
    method: 'get',
    params: query
  })
}

// 获取接口日志信息
export function GetInterfaceLogInfo(query) {
  return request_proxy({
    url: common.wmsPath('/api/LogRead/GetInterfaceLogData'),
    method: 'get',
    params: query
  })
}

// 获取接口日志信息
export function GetLogSysLambda(data) {
  return request_proxy({
    url: common.wmsPath('/api/LogRead/GetLogSysLambda'),
    method: 'post',
    data
  })
}

// 获取接口日志信息
export function GetLogSysLambdaCount(data) {
  return request_proxy({
    url: common.wmsPath('/api/LogRead/GetLogSysLambdaCount'),
    method: 'post',
    data
  })
}
// 获取接口日志信息
export function GetLogInterFaceLambda(data) {
  return request_proxy({
    url: common.wmsPath('/api/LogRead/GetLogInterFaceLambda'),
    method: 'post',
    data
  })
}

// 获取接口日志信息
export function GetLogInterFaceLambdaCount(data) {
  return request_proxy({
    url: common.wmsPath('/api/LogRead/GetLogInterFaceLambdaCount'),
    method: 'post',
    data
  })
}