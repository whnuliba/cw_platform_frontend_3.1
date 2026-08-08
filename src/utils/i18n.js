
import i18n from '@/lang'
import Cookies from 'js-cookie'
import common from '@/utils/common'
// translate router.meta.title, be used in breadcrumb sidebar tagsview

export function generateTitle(title) {
  //const hasKey = this.$te('route.' + title)
  const hasKey = this.$hasKey('route.' + title)
  if (hasKey) {
    // $t :this method from vue-i18n, inject in @/lang/index.js
    const translatedTitle = this.$t('route.' + title)
    return translatedTitle
  }
  return title
}


// export function generateTitle(item1,_key) {
//   //const hasKey = this.$te('route.' + title)
//   if(item1===undefined)   return  item1
//    let item = `route.${item1}`  
//   let lu =Cookies.get('language')
//   const hasKey  = common.hasKey(item,lu)
 
//   if (hasKey){ 
//     const val =  common.getI18N(item,lu,_key);
//     if(val===undefined ||val===null || val===''){
//       return common.getI18N(item,common.getGlobalParameters("defaultLang"),_key)
//     }else{
//       return val
//     }
//   }
//   return item1
// }