import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
//创建计划详细条件配置
export function PlanOutChangeFlag(data) {
    return request_proxy({
      url: common.wmsPath('/api/PlanDealWith/PlanOutChangeFlag'),
      method: 'post',
      data
    })
  }