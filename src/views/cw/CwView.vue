<template>
    <div class="app-container-view">
      <CwCanvasDrawView v-if="isViewUseCanvasDraw"
        :width="page.panelStyle.width"
        :height="page.panelStyle.height" :panelStyle="page.panelStyle" 
        :nodeData="componentData"/>
      <component v-for="item in componentData"
        :key="item.id"
        :is="renderSubComponent(item.component)"
        :id="'component' + item.id"
        :compId="item.component + '-' + item.id"
        :ref="item.component + '-' + item.id"
        class="component"
        :itemStyle="getComponentShapeStyle(item.styles)"
        :fieldName="item.fieldName"
        :style="{...item.styles,transform :Number(item.styles.rotationAngle) ? 'rotate(' + item.styles.rotationAngle + 'deg)' : 'none',position: item.styles.position ? item.styles.position :'absolute'}"
        :component="item"
        :componentModalObj="componentModalObj"
        :vueContext="vueContext"
      />
    </div>
   
  </template>
  <script>
  import i18n from "@/lang";
  import modules from "./components/loadModule.js";
  import {deepCopy} from "./utils/eventUtils";
  import CwCanvasDrawView from "./CwCanvasDrawView.vue";
  //,transform : 'rotate(' + item.attribute.rotationAngle + 'deg)'  对于带有模态的不能增加旋转
  export default {
    name: 'CwView',
    components: {...modules,CwCanvasDrawView},
    directives: {},
    filters: {},
    props: {
      width: {
        type: Number,
        default: () => { return 1920 }
      },
      height: {
        type: Number,
        default: () => { return 1080 }
      },
      page: {
        type: Object,
        default: ()=>undefined
      }
    },
    data() {
      const _initdata = {
        isViewUseCanvasDraw: false,
        componentData:[],
        componentModalObj:{},
        fullElementCodeHanler : {},
        sortFullElementCodeHanler:[],
        vueContext:{},
        methods:{}
      }
      //Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
      return _initdata
    },
    created() {
      this.sortFullElementCodeHanler = []
      const padeCode = this.page //JSON.parse(JSON.stringify(this.$route.params.pageCode)) 
      if(!padeCode){
          this.$emit('initPageCode',(page)=>{
              this.initCreated(page)
              this.$nextTick(() => {
                    if(this.methods.mounted){
                        this.methods.mounted.call(this)
                    }
               this.sortFullElementHandler()     
               this.executeElementCodeCreated()
               this.executeElementCodeMounted()
               //开始排序
            })
          })
       }else{
          this.initCreated(padeCode)
          this.sortFullElementHandler()     
          this.executeElementCodeCreated() 
       }
    },
    mounted() {
      this.$nextTick(() => {
        const padeCode = this.page 
         if(padeCode){
          if(this.methods.mounted){
            this.methods.mounted.call(this)
             this.executeElementCodeMounted()
           }
      
         }
         this.isViewUseCanvasDraw = this.$store.getters.isCanvaview;
      })
    },
    destroyed(){
      this.$nextTick(() => {
        if(this.methods.destroyed){
            this.methods.destroyed.call(this)
         }
         const padeCode = this.page 
         this.executeElementCodedestroyed()
      })
    
    },
    methods: {
      sortFullElementHandler(){
        this.sortFullElementCodeHanler.sort((a,b)=>{
            return a.element.order-b.element.order
        })
      },
      initCreated(padeCode){
        this.componentData = padeCode.element
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
            this.createContext(this.vueContext,this)
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
            this.vueContext[element].$el.addEventListener(event,(e)=>{
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
          this.vueContext[element].$el.removeEventListener(event)
        },
        getChildComponentByChildren(context,vue,compData){
          if(vue.$children){
            for(let index in vue.$children){
              const vueComp = vue.$children[index]
              if(vueComp && vueComp.component && vueComp.component.attribute && vueComp.component.attribute.fieldName &&  vueComp.fieldName.trim()!==''){
                 //context[vueComp.fieldName]=vueComp   
                 this.$set(context,vueComp.fieldName,vueComp)    
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
              if(vueComp && vueComp.component && vueComp.component.attribute && vueComp.component.attribute.fieldName &&  vueComp.fieldName.trim()!=='' ){
                 this.$set(context,vueComp.fieldName,vueComp)
                //context[vueComp.fieldName]=vueComp       
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
        this.createContext(this.vueContext,vueComp)
    }

    if (vueComp.$refs.myTabPanel && vueComp.$refs.myTabPanel.panes.length) {
        let panes = vueComp.$refs.myTabPanel.panes
        panes.forEach(item => {
          item.$children && item.$children.forEach(vueItem => {
            vueComp = vueItem
            if(vueComp.component && vueComp.component.subComponent && vueComp.component.subComponent.length){
              this.createContext(this.vueContext,vueComp)
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
              let _vue = this.vueContext[fieldName]
              if(_vue){
               // _vue.vueContext = this.vueContext
                //_vue.$set(_vue.component,'vueContext',this.vueContext)
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
              let _vue = this.vueContext[fieldName]
              if(_vue){
                //_vue.vueContext = this.vueContext
               // _vue.$set(_vue.$data,'vueContext',this.vueContext)

               //初初始化函数
               for(let func in item){
                  // _vue[item] = item[func]
                  
                    if( item[func] && typeof  item[func]==='function'){
                      // _vue.$set(_vue.methods,func,item[func])
                       _vue[func] = item[func]
                        _vue.methods[func] =  item[func];
                    } 
                }

               if(_vue.vueContext){
                for(let k in this.vueContext)
                _vue.vueContext[k] = this.vueContext[k] 
                //_vue.vueContext = this.vueContext
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
                else if(item.component === 'CwDrawerPanel')
                {  
                    item.component ='CwDrawerPanelView'
                } 
                else if(item.component === 'CwDialogPanel')
                {  
                    item.component ='CwDialogPanelView'
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
      // getComponentShapeStyle(item) {
      //   if (item && item.styles){
      //     let obj = JSON.parse(JSON.stringify(item.styles))
      //     const keys = Object.keys(obj);
      //     const newObj = {};
      //     for (const key of keys) {
      //         if (/^[a-z][A-Z0-9]*$/.test(key)) {
      //             newObj[key.replace(/([A-Z])/g, '-$1').toLowerCase()] = obj[key];
      //         } else {
      //             newObj[key] = obj[key];
      //         }
      //     }
      //     return newObj
      //   }
      //   // if (item && item.styles) return { ...item.styles };
      // },
    }
  }
  </script>
     
  <style lang="less" scoped>
  .app-container-view{
    padding: 20px;
    transition: transform 0.3s ease; 
    // position: absolute;
  }
  </style>