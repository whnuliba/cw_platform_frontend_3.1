import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取所有货位描述信息
export function GetRecordRedis() {
  return request_proxy({
    url: common.wmsPath('/api/Record/GetRecordRedis'),
    method: 'get'
  })
}