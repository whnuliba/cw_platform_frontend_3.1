<template>
    <div
      id="mySubScrollbarContentPanel"
      class="my-sub-scrollbar-content"
      style="overflow: auto;"
      :style="{...itemStyle}"
    >
        <component  v-for="item in componentData"
            :key="item.id"
            style="position: absolute"
            :is="renderSubComponent(item.component)"
            :id="'component' + item.id"
            :compId="item.component + '-' + item.id"
            :ref="item.component + '-' + item.id"
            class="component"
            :itemStyle="getComponentShapeStyle(item.styles)"
            :attribute="item.attribute"
            :style="{...item.styles,transform :Number(item.styles.rotationAngle) ? 'rotate(' + item.styles.rotationAngle + 'deg)' : 'none',transform:'none',position: item.styles.position ? item.styles.position :'absolute'}"
            :componentModalObj="componentModalObj"
            :fieldName="item.fieldName"
            :component="item"
            :bindData="bindData"
            :vueContext="vueContext"
          />
    </div>
  </template>
  <script>
  import i18n from "@/lang";
  import modules from "./loadModule.js";
  import {deepCopy} from "../utils/eventUtils"

  //,transform : 'rotate(' + item.attribute.rotationAngle + 'deg)'
  export default {
    name: "CwUCPanelPreview",
    components: {
      ... modules,
    },
    directives: {},
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: "未启用",
          1: "启用",
        };
        return statusMap[status];
      },
    },
    props: {
      activeName: {
        type: String,
        default: () => { return '' }
      },
      vueContext: {
        type: Object,
        default: () => {
          return {}
        }
      },
      fieldName: {
        type: String,
        default: ''
      },
        component:{
            type:Object,
            default:()=>{return {
                subComponent:[]

            }}
        },   
      width: {
        type: Number,
        default: () => {
          return 1920;
        },
      },
      height: {
        type: Number,
        default: () => {
          return 1080;
        },
      },
    bindData:{
      type: Object,
      default: () =>{}
    },
    itemStyle: {
        type: Object,
        default: () => {
          return {}
        }
      },
    },
    watch: {
      'component.attribute.ucCode':{
        handler: function (newVal, oldVal) {
              if(newVal!==oldVal)
                {
                   this.initCode(newVal)
                }
            },
            deep: true,
     }
    },
    data() {
      const _initdata = {
        vueUcContext:{},
        componentModalObj: {},
        allAttributeData:{},
        // itemStyle: {},
        scaleValue: 1,
        scrollLeft: 0,
        scrollTop: 0,
        time: 0,
        drawingWidth: 1920,
        drawingHeight: 1080,
        element: undefined,
        componentData:[],
        componentData1:[],
        fullElementCodeHanler : {},
        componentModalObj:{},
        pageCode:undefined,
        sortFullElementCodeHanler:[],
        methods:{}
      };
      return _initdata;
    },
    created() {
      this._created()
    },
    destroyed(){
      this._destroyed()
    },
    mounted() {
      this._mounted()
    },
    methods: {
      _destroyed(){
        this.$nextTick(() => {
        if(this.methods.destroyed){
            this.methods.destroyed.call(this)
         }
         const padeCode = this.page 
         this.executeElementCodedestroyed()
      })   
      },
      _created(){
        if(this.component.attribute.ucCode){
          this.initCode(this.component.attribute.ucCode)
      }
      },
      _mounted(){
        this.$nextTick(() => {
        const padeCode = this.page 
         if(padeCode){
          if(this.methods.mounted){
            this.methods.mounted.call(this)
             this.executeElementCodeMounted()
           }
      
         }
      
      })
      this.$bus.$on('selevtComponentData', (data) => {
        this.componentData = data
      })
      
      this.$bus.$on('fieldName', (val, itemData) => {
        this.componentData.forEach(item=>{
          if(itemData.id == item.id){
              item.fieldName = val ? val : 'null'
            }
        })

      })
      this.$nextTick(() => {
        this.$bus.$on("attributeData", (attributeObj) => {
          this.componentData.forEach(item=>{
            if(item.id === attributeObj.compId.split('-')[1]){
              let someObject = Object.assign({}, attributeObj.data)            
              item.attribute = someObject
            }
          })
        });
        this.$bus.$on("styleData", (styleobj) => {
  
          let stObj = JSON.parse(JSON.stringify(styleobj))
          this.componentData.forEach(item=>{
            if (item.id === stObj.compId.split('-')[1]) {
              item.styles = { ...item.styles, ...stObj.data };
            }
          })
        });
      });

      },
      setUcCode(ucCode,callback){
          this.initCode(ucCode,callback)
      },
      initCode(ucCode,callback){
            const _data = {
        url: '/biz-define-relax/query', params: {
          data: {
            sqlWhere: [
              {
                column: 'BIZ_CODE',
                condition: '=',
                value: ucCode
              }]
          }
        }
      }
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
            if(data && data.length)
            {       
                   this.methods = {} 
                
                   this.initCreated(JSON.parse(data[0].SCRIPT))
                   this.initCreateAfter()
                   this.$set(this.vueContext,'uc_'+this.component.fieldName,this.vueUcContext)
                  // this.vueContext['uc_'+this.component.fieldName] = this.vueUcContext
                   if(callback && typeof callback ==='function'){
                        callback.call(this)
                   }
            }           
              else{
                this.$message({
                type:"error",
                message: '页面信息不存在'
            })
             }
        })
        },
      comText(){
        return 'UC'
      },
      renderSubComponent(item){
        return modules[item]
      },
      //拖到目标区域放下时触发
      sortFullElementHandler(){
        this.sortFullElementCodeHanler.sort((a,b)=>{
            return a.element.order-b.element.order
        })
      },
      initCreateAfter(){
        this.sortFullElementCodeHanler = []
        this.$nextTick(() => {
                    if(this.methods.mounted){
                        this.methods.mounted.call(this)
                    }
               this.sortFullElementHandler()     
               this.executeElementCodeCreated()
               this.executeElementCodeMounted()
      })
      },
      initCreated(padeCode){
        this.componentData = padeCode.element
        this.pageCode = padeCode
        //this.component.subComponent= this.componentData 
        if(padeCode.handler && padeCode.handler!==''){
            let handler =  eval("("+padeCode.handler+")") 
            if(handler) {
                for(let item in handler){
                    this[item] = handler[item]
                    this.$set(this.methods,item,handler[item])
                    if(handler[item] && typeof handler[item]==='function'){
                    this.methods[item] = handler[item];
                    } 
                }
            }
        }
        this.$forceUpdate()
        this.fullElementCodeHanler = {}
        this.initPreview(this.componentData)
        this.$nextTick(()=>{
            this.createContext(this.vueUcContext,this)
            if(this.methods.created){
            this.methods.created.call(this)
            }
        })
      },  
      getComponentShapeStyle(component) {
        let result = {}
        const style = deepCopy(component)
        const excludes = ['top', 'left','position']
        Object.keys(style).forEach((key) => {
          if (!excludes.includes(key)) {
            result[key] = style[key]
          }
        })
        return result
      },
        addEventListener(element,event,callback){
          if(callback && typeof callback==='function'){
            let _this = this
            this.vueUcContext[element].$el.addEventListener(event,(e)=>{
               if(e.detail)
                 if(typeof e.detail === 'object' && e.detail instanceof Array)
                  {
                    callback.apply(_this,[e].concat(e.detail))
                  }
                  else
                  {
                    callback.apply(_this,[e,e.detail])
                  }
               else{
                 callback.apply(_this,[e])
               } 
            })
          }
        },
        removeEventListener(element,event){
          this.vueUcContext[element].$el.removeEventListener(event)
        },
        getChildComponentByChildren(context,vue,compData){
          if(vue.$children){
            for(let index in vue.$children){
              const vueComp = vue.$children[index]
              if(vueComp && vueComp.component && vueComp.component.attribute && vueComp.component.attribute.fieldName &&  vueComp.component.attribute.fieldName.trim()!==''){
                 context[vueComp.fieldName]=vueComp       
              }else if(vueComp){
                 this.getChildComponentByChildren(context,vueComp,compData)
              }
            }
          }
        },  

      createContext(context,vue){
        if(vue.$children){
            for(let index in vue.$children){
              const vueComp = vue.$children[index]
              if(vueComp && vueComp.component && vueComp.component.attribute && vueComp.component.attribute.fieldName &&  vueComp.component.attribute.fieldName.trim()!=='' ){
                 context[vueComp.component.attribute.fieldName]=vueComp       
              }
              this.createContext(context,vueComp)

            }
          }
      },
 /*
        createContext(context,vue,child=false){

if(vue.$refs){
  for(let item in vue.$refs){
    let vueComp = vue.$refs[item][0]  
    if(vueComp===undefined)
       return
     context[vueComp.fieldName]=vueComp          
     //判断是否是模态
     if(vueComp.compId && vueComp.compId.indexOf('CwDialogPanelView')==0){
         let dialogComp = vueComp.$refs.cwDialogRef
         if(dialogComp && dialogComp.$children && dialogComp.$children.length){
             vueComp = dialogComp.$children[0]
         }
     }

    if(vueComp.component && vueComp.component.subComponent && vueComp.component.subComponent.length){
        // context[vueComp.fieldName] = {}
        // context[vueComp.fieldName][vueComp.fieldName] = vueComp
        //this.createContext(context[vueComp.fieldName],vueComp)
        this.createContext(this.vueUcContext,vueComp)
    }

    if (vueComp.$refs.myTabPanel && vueComp.$refs.myTabPanel.panes.length) {
        let panes = vueComp.$refs.myTabPanel.panes
        panes.forEach(item => {
          item.$children && item.$children.forEach(vueItem => {
            vueComp = vueItem
            if(vueComp.component && vueComp.component.subComponent && vueComp.component.subComponent.length){
              this.createContext(this.vueUcContext,vueComp)
            }
          })
          
        })
      }
}

}
},
*/     
      executeElementCodedestroyed(){
          const elementHander = this.sortFullElementCodeHanler

          //判断order,及时
          if(elementHander){
            elementHander.forEach(ele=>{
              let item = ele.element
              if(item.destroyed && typeof item.destroyed==='function'){
                if(_vue){
                  item.destroyed.call(_vue,this)
                }
               }
            })
          //   Object.keys(elementHander).forEach(key => {
          //      if(elementHander[key].destroyed && typeof elementHander[key].destroyed==='function'){
          //          elementHander[key].destroyed.call(this)
          //      }
          // });
          }
      },
      executeElementCodeMounted(){
      
          const elementHander = this.sortFullElementCodeHanler
          if(elementHander){
            elementHander.forEach(ele=>{
              let item = ele.element
              let fieldName= ele.fieldName
              let _vue = this.vueUcContext[fieldName]
              if(_vue){
               // _vue.vueUcContext = this.vueUcContext
                //_vue.$set(_vue.component,'vueUcContext',this.vueUcContext)
              }

              if(item.mounted && typeof item.mounted==='function'){
                if(_vue){
                  item.mounted.call(_vue,this)
                }
               }
            })
          //   Object.keys(elementHander).forEach(key => {
          //      if(elementHander[key].mounted && typeof elementHander[key].mounted==='function'){
          //          elementHander[key].mounted.call(this)
          //      }
          // });
          }
      },
      executeElementCodeCreated(){
          const elementHander = this.sortFullElementCodeHanler
          if(elementHander){
            elementHander.forEach(ele=>{
              let item = ele.element
              let fieldName= ele.fieldName
              let _vue = this.vueUcContext[fieldName]
              if(_vue){
                //_vue.vueUcContext = this.vueUcContext
               // _vue.$set(_vue.$data,'vueUcContext',this.vueUcContext)

               //初初始化函数
               for(let func in item){
                  // _vue[item] = item[func]
                  
                    if( item[func] && typeof  item[func]==='function'){
                      // _vue.$set(_vue.methods,func,item[func])
                       _vue[func] = item[func]
                        _vue.methods[func] =  item[func];
                    } 
                }

               if(_vue.vueUcContext){
                for(let k in this.vueUcContext)
                _vue.vueUcContext[k] = this.vueUcContext[k] 
                //_vue.vueUcContext = this.vueUcContext
               }
              }
              if(item.created && typeof item.created==='function'){
                if(_vue){
                  item.created.call(_vue,this)
                }
               }
            })
          }
      },
      initElementCode(component){
        if(component.elementCode){
          let data =  eval("("+component.elementCode+")") //JSON.parse(val.scripts)
          //this.component.handler=data
          component['handler'] = data
          let key = `handler_${component.fieldName}`
          if(data && !data.order){
             data.order = 9999999
          }
          if(data && typeof data.order!=='number'){
             data.order = 9999999
          }
          this.fullElementCodeHanler[key] = data
         // {fieldName:component.fieldName,element:data}
          this.sortFullElementCodeHanler.push({fieldName:component.fieldName,element:data})
        }
      },
      initPreview(componentData){
         if(componentData && componentData.length && componentData.length>0){
             componentData.forEach(item=>{
                if(item.component === 'CwSubPanel')
                {  
                    item.component ='CwSubPanelPreview'
                } else if(item.component === 'CwDesignDialogs')
                {  
                    item.component ='CwDesignDialogsPreview'
                }  else if(item.component === 'CwUCPanel')
                {  
                    item.component ='CwUCPanelPreview'
                }  
                else if(item.component === 'CwWorkFlow')
                {  
                    item.component ='CwWorkFlowPreview'
                } 
                else if(item.component === 'CwIterator')
                {  
                    item.component ='CwIteratorView'
                }  
                else if(item.component === 'CwDialogPanel')
                {  
                    item.component ='CwDialogPanelView'
                } 
                else if(item.component === 'CwDrawerPanel')
                {  
                    item.component ='CwDrawerPanelView'
                } 
                else if(item.component === 'CwTabPanel')
                {  
                    item.component ='CwTabPanelView'
                              //判断面板
                    if(item.tabPanels && item.tabPanels.length && item.tabPanels.length>0){
                          const cop = item.tabPanels.map(c=>c.component)
                          this.initPreview(cop)
                    }
                }  
                
                this.initElementCode(item)
                if(item.subComponent && item.subComponent.length && item.subComponent.length>0){
                    this.initPreview(item.subComponent)
                }
          
             })
         }
      },
      renderSubComponent(item){
          return modules[item]
        },
      preview(){
        const { href } = router.resolve('/preview')
        window.open(href, '_blank')
      },

    },
  };

  </script>
  
  <style lang="less" scoped>
  .my-scrollbar-content {
    cursor: auto;
    transform-origin: left top;
    // transform: scale(v-bind(scaleValue));
    transition: all 0.3s;
  }
  </style>
  