import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
Element.Dialog.props.closeOnClickModal.default = false

import './utils/button-util'

import '@/styles/index.scss' // global css
import less from 'less'

import App from './App'
import store from './store'
import router from './router'
import preventReClick from './directive/input/preventReClick' //防多次点击，重复提交

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import { getToken } from '@/utils/auth'

import * as filters from './filters' // global filters

import Axios from 'axios'

import limitNum from './directive/input/inputValid'
import gojs from 'gojs'
import VueBarcode from "vue-barcode";
import Print from 'vue-print-nb'
import request from '@/utils/fms-request'
Vue.use(Print);
Vue.component('barcode', VueBarcode);
Vue.prototype.go = gojs

Vue.prototype.$bus = new Vue();
Vue.directive('limitNum', limitNum)

import 'font-awesome/css/font-awesome.css'
import iconPicker from 'vue-fontawesome-elementui-icon-picker'
// import VueSweetalert2 from 'vue-sweetalert2'
import i18n from './lang' // internationalization
// import 'sweetalert2/dist/sweetalert2.min.css'
// Vue.use(VueSweetalert2)
Vue.use(iconPicker)
import scroll from 'vue-seamless-scroll'
Vue.use(scroll)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
/* if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
 */
let resloveScript=(script) =>{
  let sc =  undefined
  try {
    sc=eval("("+script+")")
   } 
   catch (e) {
       this.$message({
              type: 'info',
              message: '脚本解析错误'
     });
  }
  return sc
}
Vue.prototype.resloveScript=resloveScript
function requestTaskPost(url,data){
  return  request({
    url: common.taskPath(url),
    method: 'post',
    data
  })
}
async function requestI18n(obj){
   return new Promise((resolve,reject)=> {
    requestTaskPost(obj.url,obj.params).then(data=>{           
        resolve(data)
    }).catch(error => {
        reject(error)
    })
})
} 
async function initI18NScript(callback) {
       let defaultI18n = common.getGlobalParameters("defaultI18n");

          const _data = {
            url: "/page-conf/guest/get-script",
            params: { data: { bizType: "I18N", bizCode: "CommonI18N" } },
          };
        await  requestI18n(_data)
            .then((data) => {
              if (!data) return;
              let script = resloveScript(data);
              if (!script) {
                return;
              }
              common.commonI18N = script;
            })
            .catch((err) => {
              console.error(err);
            });
    
          //循环获取其他的国际化
          if (common.getGlobalParameters("selectLang")) {
            let selectLang = common.getGlobalParameters("selectLang");
            //language
            selectLang.forEach(async (element) => {
              const _data1 = {
                url: "/page-conf/guest/get-script",
                params: {
                  data: {
                    bizType: "I18N",
                    bizCode: `MetaI18N_${element.language}`,
                  },
                },
              };
              await  requestI18n(_data1)
                .then((data) => {
                  if (!data) return;
                  let script = resloveScript(data);
                  if (script) {
                    common.metaI18N[element.language] = script;
                   }                 
                })
                .catch((err) => {
                  console.error(err);
                });
            });
          }
          const _data2 = {
            url: "/page-conf/guest/get-script",
            params: { data: { bizType: "I18N", bizCode: `MetaI18N_all` } },
          };
          await  requestI18n(_data2)
            .then((data) => {
              if (!data) return;
              let script = resloveScript(data);
              if (script) {
                for(let lu in defaultI18n){
                    if(script[lu]){
                      script[lu] = {...script[lu],...defaultI18n[lu]}
                    }else{
                      script[lu] =defaultI18n[lu]
                    }
                }
                common.metaI18NAll = script;
              }                  
            })
            .catch((err) => {
              console.error(err);
            });
        }
common.metaI18NAll =  common.getGlobalParameters("defaultI18n");    
 initI18NScript()
 Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.i18n().t(key, value)
})
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// 引入全局axios
Vue.prototype.$axios = Axios
Vue.use(less)
// 按钮组件 全局使用
import KtButton from './components/ktbutton/ktButton.vue'
import common from './utils/common'
import httpUtils from '@/api/fms-common'

Vue.prototype.commonUtils = common
Vue.component('KtButton', KtButton)

Vue.prototype.selectLang = function(item) {
  if (!item) { return item }
  const lang = i18n.locale
  if (lang === 'zh') {
    return item.COLUMN_TITLE
  }
  if (lang === 'en') {
    return item.COLUMN_TITLE_EN
  }
}
Vue.prototype.dateFormats = function(date){
    if(date && typeof date==='string')
       date = new Date(date)
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}



Vue.prototype.actionPost = function(options){
  return new Promise((resolve,reject)=> {
    httpUtils.actionPost(options.url,options.params).then(data=>{           
        resolve(data)
    }).catch(error => {
        reject(error)
    })
  })
}
// 点击跳转路由
Vue.prototype.$taskLogDetails = function(tableRowInfo,routerName) {
  this.$router.push({ name: routerName, params: {
      row: tableRowInfo,
      isRouterJump: true
    }
  })
}

Vue.prototype.$fileView = function(tag,fn,row,data,url) { // 这里的参数要按照handlerEvent里面的参数排序来
 // console.log(tag,fn,row,data,url)
  let response = new Promise((resolve,reject) => Axios.post(url, {data:JSON.stringify(data)}, {
        responseType: 'arraybuffer',
        headers: {Authorization: 'Bearer ' + getToken()},
        }).then((res) => {
          // 获得文本数据流
            resolve(res.data);
      })
    );
    return response;
},

Vue.prototype.$downloadFile = function(url,fileData,success,fail, complete){
  // const _dataUpload = { url: this.initScript.url.removeFile, params: {data:JSON.stringify(fileData)},
  //   options:{
  //     responseType: 'blob',
  //   }};
     Axios.post(url, {data:JSON.stringify(fileData)}, {
    responseType: 'blob',
    headers: {Authorization: 'Bearer ' + getToken() },
    }).then((res) => {
        let dowLoadFileName =fileData.fileName 
        let result=res.data
        let blob = new Blob([result]);
        const fileName = dowLoadFileName;
        // 判断浏览器
        var brower = '';
        if (navigator.userAgent.indexOf('Edge') > -1) {
            brower = 'Edge';
        }
        if ('download' in document.createElement('a')) {
            // 非IE下载

            if (brower == 'Edge') {
                navigator.msSaveBlob(blob, fileName);
                return;
            }
            const elink = document.createElement('a');
            elink.download = fileName;
            elink.style.display = 'none';
            elink.href = window.URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href);
            // 释放URL 对象
            document.body.removeChild(elink);
        } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName);
        }


        if(success && typeof success==='function'){
          fail.call(this,success)
        }
    }).catch(
      err => {
            if(fail && typeof fail==='function'){
              fail.call(this,err)
            }
          }

    ).finally(() => {
            if(complete && typeof complete==='function'){
              complete.call(this)
            }      
        });

},

Vue.prototype.getCurrentUser = function(){
   let uStr  = sessionStorage.getItem("userInfoArray")
   if(uStr)
      return JSON.parse(uStr)
    return undefined
}
Vue.prototype.commonI18n=function(item,_key){
    let lu =this.$store.getters.language
    let val = common.getI18N(item,lu,_key)
    let dlu = common.getGlobalParameters("defaultLang")
    if(val && typeof item === "string" && val===item && lu!==dlu){
       let val1 = common.getI18N(item,common.getGlobalParameters("defaultLang"),_key)
       if(val===undefined ||val===null || val==='') return val
       return val1
    }
    if(val===undefined ||val===null || val===''){
      return common.getI18N(item,common.getGlobalParameters("defaultLang"),_key)
    }else{
      return val
    }
}

Vue.prototype.$t =function(item,_key){
  let lu =this.$store.getters.language
  // if (typeof item === "string"){
  //   let itemval = i18n.t(item)
  //   if(itemval!==item && itemval!==undefined &&itemval!==null && itemval!=='')
  //     return itemval
  //   }  
  let val =  common.getI18N(item,lu,_key);
  let dlu = common.getGlobalParameters("defaultLang")
  if(val && typeof item === "string" && val===item && lu!==dlu){
     let val1 = common.getI18N(item,common.getGlobalParameters("defaultLang"),_key)
     if(val===undefined ||val===null || val==='') return val
     return val1
  }
  if(val===undefined ||val===null || val===''){
    return common.getI18N(item,common.getGlobalParameters("defaultLang"),_key)
  }else{
    return val
  }
}


Vue.prototype.$t2 =function(item,_key){
  let lu =this.$store.getters.language
  // if (typeof item === "string"){
  //   let itemval = i18n.t(item)
  //   if(itemval!==item && itemval!==undefined &&itemval!==null && itemval!=='')
  //     return itemval
  //   }  
  let val =  common.getI18N(item,lu,_key);
  let dlu = common.getGlobalParameters("defaultLang")
  if(val && typeof item === "string" && val===item && lu!==dlu){
     let val1 = common.getI18N(item,common.getGlobalParameters("defaultLang"),_key)
     if(val===undefined ||val===null || val==='') return val
     return val1
  }
  if(val===undefined ||val===null || val===''){
    return common.getI18N(item,common.getGlobalParameters("defaultLang"),_key)
  }else{
    return val
  }
}

Vue.prototype.$hasKey = function(key){
  let lu =this.$store.getters.language 
  return common.hasKey(key,lu)
}

Vue.prototype.extendContext = {}
// Vue.prototype.i18n=function(key){
//   let lu = i18n.t(key)||key
//   return lu
// }

Vue.prototype.i18n =function(item,_key){
  let lu =this.$store.getters.language
  // if (typeof item === "string"){
  //   let itemval = i18n.t(item)
  //   if(itemval!==item && itemval!==undefined &&itemval!==null && itemval!=='')
  //     return itemval
  // }  
  let val =  common.getI18N(item,lu,_key);
  let dlu = common.getGlobalParameters("defaultLang")
  if(val && typeof item === "string" && val===item && lu!==dlu){
     let val1 = common.getI18N(item,common.getGlobalParameters("defaultLang"),_key)
     if(val===undefined ||val===null || val==='') return val
     return val1
  }
  if(val===undefined ||val===null || val===''){
    return common.getI18N(item,common.getGlobalParameters("defaultLang"),_key)
  }else{
    return val
  }
}
Vue.prototype.uuid=function(){
   let s = [];
    let hexDigits = "0123456789ABCDEF";
    for (let i = 0; i < 32; i++) {
         let n = Math.floor(Math.random() * 0x10)
         s[i] = hexDigits.substring(n , n + 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substring((s[19] & 0x3) | 0x8,((s[19] & 0x3) | 0x8) + 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23];
    let uuid = s.join("");
    return uuid;
}
Element.Dialog.props.lockScroll.default = false

new Vue({
  el: '#app',
  router,
  store,
  i18n:i18n.i18n(),
  render: h => h(App)
})
