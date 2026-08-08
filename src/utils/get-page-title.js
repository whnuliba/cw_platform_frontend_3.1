import defaultSettings from '@/settings'
import i18n from '@/lang'
import Cookies from 'js-cookie'
import common from '@/utils/common'
const title = defaultSettings.title || 'SaaS.FMS'

// export default function getPageTitle(key) {
// const hasKey = i18n.te(`route.${key}`)
//   if (hasKey) {
//     const pageName = i18n.t(`route.${key}`)
//     return `${pageName} - ${title}`
//   }
//   return `${title}`
// }

export default function getPageTitle(item,_key){
  if(item===undefined)   return `${title}`
   item = `route.${item}`  
  let lu =Cookies.get('language')
  const hasKey  = common.hasKey(item,lu)
  if (hasKey){
    let val =  common.getI18N(item,lu,_key);
    if(val===undefined ||val===null || val===''){
      return common.getI18N(item,common.getGlobalParameters("defaultLang"),_key)
    }else{
      return val
    }
  }
  return `${title}`
}
