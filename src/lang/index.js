import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import common from '@/utils/common'

import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import elementEsLocale from 'element-ui/lib/locale/lang/es'// element-ui lang
import elementJaLocale from 'element-ui/lib/locale/lang/ja'// element-ui lang
import enLocale from './en'
import zhLocale from './zh'
import esLocale from './es'
import jaLocale from './ja'

Vue.use(VueI18n)

const messages = {
  en: {
    //...enLocale,
    ...elementEnLocale
  },
  zh: {
    //...zhLocale,
    ...elementZhLocale
  },
  es: {
  //  ...esLocale,
    ...elementEsLocale
  },
  ja: {
   // ...jaLocale,
    ...elementJaLocale
  }
}
export function initLoacla(){

  if(common.metaI18N){
    for(let la in common.metaI18N){
        
      if(messages.hasOwnProperty(la)){
       messages[la] = {...messages[la],...common.metaI18N[la]}
      }else{
       messages[la]= common.metaI18N[la]
      }
  
    }
 }
  return messages
}

export function getLanguage() {
  const chooseLanguage = Cookies.get('language')
  if (chooseLanguage) return chooseLanguage
  // if has not choose language

  const language = (navigator.language || navigator.browserLanguage).toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'en'
}
// const i18n=  new VueI18n({
//   // set locale
//   // options: en | zh | es
//   locale: getLanguage(),
//   // set locale messages
//   messages,
//   silentTranslationWarn: true
// })
const i18n = {
  i18n: ()=>new VueI18n({
    // set locale
    // options: en | zh | es
    locale: getLanguage(),
    // set locale messages
    messages,
    silentTranslationWarn: true
  }),
  hasKey:function(){

  },
  t:function(item,_key){
    let lu = Cookies.get('language')
    let val =  common.getI18N(item,lu,_key);
    if(val===undefined ||val===null || val===''){
      return common.getI18N(item,common.getGlobalParameters("defaultLang"),_key)
    }else{
      return val
    }
  }
} 
export default i18n
