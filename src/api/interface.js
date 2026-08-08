import request_proxy from '@/utils/request_proxy'
import common from '@/utils/common'
// 获取路径信息
export function GetInterFacePalletList(data) {
  return request_proxy({
    url: common.wmsPath('/api/InterFacePallet/GetInterFacePalletList'),
    method: 'post',
    data
  })
}

// 获取路径信息
export function DeleteInterFaceData(data) {
  return request_proxy({
    url: common.wmsPath('/api/InterFacePallet/DeleteInterFaceData'),
    method: 'post',
    data
  })
}