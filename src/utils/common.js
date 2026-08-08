let common = {
  enableI18N: true,
  commonI18N: undefined,
  metaI18N: {},
  metaI18NAll: {},
  currentFc: "",
  // loginCheck: "10.2.200.210:7700",
  // authRoot: "/cw-fms-auth",
  // taskRoot: "/cw-fms-task",
  // //柔性制造
  // fmsRoot: "/cw-fms-fms",
  // mdmRoot: "/cw-pms-mdm",
  // tpmRoot: "/cw-pms-tpm",
  // fmsHisRoot: "/cw-pms-archive",
  // wcsRoot: "/tti-mes-wcs",
  // wmsRoot: "/cw-wms-app",
  // serverRoot: "/cw-pms-server",
  // productRoot: "/cw-pms-app",
  // modelRoot: "/page/model/",

  // enableI18N: window.lobal_parameters.enableI18N,
  // commonI18N:  window.lobal_parameters.commonI18N,
  // currentFc:  window.lobal_parameters.currentFc,
  // loginCheck:  window.lobal_parameters.loginCheck,
  // authRoot:  window.lobal_parameters.authRoot,
  // taskRoot:  window.lobal_parameters.taskRoot,
  // //柔性制造
  // fmsRoot:  window.lobal_parameters.fmsRoot,
  // mdmRoot:  window.lobal_parameters.mdmRoot,
  // tpmRoot:  window.lobal_parameters.tpmRoot,
  // fmsHisRoot:  window.lobal_parameters.fmsHisRoot,
  // wcsRoot:  window.lobal_parameters.wcsRoot,
  // wmsRoot:  window.lobal_parameters.wmsRoot,
  // serverRoot:  window.lobal_parameters.serverRoot,
  // productRoot:  window.lobal_parameters.productRoot,
  // modelRoot:  window.lobal_parameters.modelRoot,

  getGlobalParameters(key) {
    return window.global_parameters[key];
  },

  authPath: function (path) {
    return this.getGlobalParameters("authRoot") + path;
  },
  taskPath: function (path) {
    return this.getGlobalParameters("taskRoot") + path;
    //return this.taskRoot + path;
  },
  productPath: function (path) {
    return this.getGlobalParameters("productRoot") + path;

    //return this.productRoot + path;
  },
  tpmPath: function (path) {
    return this.getGlobalParameters("tpmRoot") + path;
    //return this.tpmRoot + path;
  },
  fmsPath: function (path) {
    return this.getGlobalParameters("fmsRoot") + path;
    //return this.fmsRoot + path;
  },
  mdmPath: function (path) {
    return this.getGlobalParameters("mdmRoot") + path;
    //return this.mdmRoot + path;
  },
  fmsHisPath: function (path) {
    return this.getGlobalParameters("fmsHisRoot") + path;
    //return this.fmsHisRoot + path;
  },
  wcsPath: function (path) {
    return this.getGlobalParameters("wcsRoot") + path;
    //return this.wcsRoot + path;
  },
  serverPath: function (path) {
    return this.getGlobalParameters("serverRoot") + path;
    //return this.serverRoot + path;
  },
  wmsPath: function (path) {
    return this.getGlobalParameters("wmsRoot") + path;
    //return this.wmsRoot + path;
  },
  modelPath: function (path, suffix) {
    return (
      this.modelRoot +
      path +
      "." +
      suffix +
      "?v=" +
      new Date().getMilliseconds()
    );
  },
  parseValue: function (arr, val) {
    for (var i in arr) {
      if (arr[i].value === val) return arr[i];
    }
    return val;
  },
  hasKey:function(field,lu){
         if(!field) return false
        //现在meta下面找  找不到到页面下找
        if (this.metaI18NAll && this.metaI18NAll.hasOwnProperty(lu)) {
          if (field.indexOf(".") > -1) {
            let keys = field.split(".");
            let o = this.metaI18NAll[lu];
            if (o && keys && keys.length) {
              for (let i = 0; i < keys.length; i++) {
                if (o.hasOwnProperty(keys[i])) {
                  //  console.log(123123,o,lu,o[lu])
                  if (i == keys.length - 1 &&  o.hasOwnProperty(keys[i])) 
                    return o.hasOwnProperty(keys[i]);
                  o = o[keys[i]];
                } else {
                  break;
                }
              }
            }
          }
          else {
            if(this.metaI18NAll[lu].hasOwnProperty(field))
               return this.metaI18NAll[lu].hasOwnProperty(field);
          }
        }

    
    //现在meta下面找  找不到到页面下找
    if (this.metaI18N && this.metaI18N.hasOwnProperty(lu)) {
      if (field.indexOf(".") > -1) {
        let keys = field.split(".");
        let o = this.metaI18N[lu];
        if (o && keys && keys.length) {
          for (let i = 0; i < keys.length; i++) {
            if (o.hasOwnProperty(keys[i])) {
              // console.log(1111,field,lu,keys[i],o.hasOwnProperty(keys[i]))
              if (i == keys.length - 1)
                 return o.hasOwnProperty(keys[i]);
               o = o[keys[i]];
              //  console.log(123123,o,lu,o[lu])          
            
            } else {
              break;
            }
          }
        } 
      }else {
        return this.metaI18N[lu].hasOwnProperty(field);
      }
    }
    return false
  },
  //field->key->label->item
  getI18N: function (item, lu, _key) {
    let field = undefined;
    if (!item) return item;
    if (typeof item === "string") {
      field = item;
    } else if (item && item.i18nKey) {
      field = item.i18nKey;
    } else if (item && item.field) {
      field = item.field;
    } else if (item && !item.field && item.key) {
      field = item.key;
    } else if (item && !item.field && item.label) {
      field = item.label;
    } else if (item && !item.field && _key && item[_key]) {
      field = item[_key];
    }

    //现在metaall下面找  找不到到页面下找
    if (this.metaI18NAll && this.metaI18NAll.hasOwnProperty(lu)) {
      if (field.indexOf(".") > -1) {
        let keys = field.split(".");
        let o = this.metaI18NAll[lu];
        if (o && keys && keys.length) {
          for (let i = 0; i < keys.length; i++) {
            if (o[keys[i]]) {
              o = o[keys[i]];
              if (i == keys.length - 1) return o;
            } else {
              break;
            }
          }
        } 
      }else {
        if (this.metaI18NAll[lu].hasOwnProperty(field)) {
          let val = this.metaI18NAll[lu][field];
          if (val !== undefined) return val;
        }
      }
    }
    //现在meta下面找  找不到到页面下找
    if (this.metaI18N && this.metaI18N.hasOwnProperty(lu)) {
      if (field.indexOf(".") > -1) {
        let keys = field.split(".");
        let o = this.metaI18N[lu];
        if (o && keys && keys.length) {
          for (let i = 0; i < keys.length; i++) {
            if (o[keys[i]]) {
              o = o[keys[i]];
              //  console.log(123123,o,lu,o[lu])
              if (i == keys.length - 1) return o;
            } else {
              break;
            }
          }
        }
      } else {
        if (this.metaI18N[lu].hasOwnProperty(field)) {
          let val = this.metaI18N[lu][field];
          if (val !== undefined) return val;
        }
      }
    }

    if (this.enableI18N && this.commonI18N) {
      //

      if (item && typeof item !=='string' &&  field) {
        if (
          this.commonI18N &&
          this.commonI18N.page &&
          this.commonI18N.page[field] &&
          this.commonI18N.page[field][lu]
        ) {
          return this.commonI18N.page[field][lu];
        } else {
          if (typeof field === "string" && field.indexOf(".") > -1) {
            let keys = field.split(".");
            if (this.commonI18N) {
              let o = this.commonI18N.page;
              if (o && keys && keys.length) {
                for (let i = 0; i < keys.length; i++) {
                  if (o[keys[i]]) {
                    o = o[keys[i]];
                    //  console.log(123123,o,lu,o[lu])
                    if (i == keys.length - 1) return o[lu];
                  } else {
                    break;
                  }
                }
              }
            }
          }
          if (lu == "zh") return item.label || item.title;
          else if (lu == "en") {
            let title =
              item.en_title ||
              item.field ||
              item.prop ||
              item.key ||
              item.label;
            if (!title) {
              return title;
            }
            let start = title.substring(0, 1).toUpperCase();
            let end = title.substring(1);
            return start + end;
          } else {
            return item.en_title || item.title;
          }
        }
      } else if (item) {
        if (typeof item === "string" && item.indexOf(".") > -1) {
          let keys = item.split(".");
          if (this.commonI18N) {
            let o = this.commonI18N.page;
            if (o && keys && keys.length) {
              for (let i = 0; i < keys.length; i++) {
                if (o[keys[i]]) {
                  o = o[keys[i]];
                  if (i == keys.length - 1) return o[lu];
                } else {
                  break;
                }
              }
            }
          }
        } else if (
          this.commonI18N &&
          this.commonI18N.page &&
          this.commonI18N.page[item] &&
          this.commonI18N.page[item][lu]
        ) {
          return this.commonI18N.page[item][lu];
        } else if (item && item.title) {
          return item.title;
        }
      }
    } else if (item && item.title) {
      return item.title;
    }
    return item;
  },
  sysCode: function () {
    var code = {
      // MES:"制造执行",
      // MDM:"主数据管理",
      // WMS:"仓储管理",
      // WCS:"调度管理",
      // PCS:"过程管理",
      // FMS:"柔性制造",
      // PM:"生产信息",
      // BI:"报表中心",
      // TPM:"生产维护",
      // SYS:"配置中心",
      // PDA:'手持终端'
    };
    return code;
  },
  isShowBtn(btnCode) {},
};
export default {
  name: "common",
  ...common,
};
