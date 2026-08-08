<template>
    <div
      id="mySubScrollbarContentPanel"
      class="my-sub-scrollbar-content"
      style="overflow: auto;"
      :style="{...itemStyle}"
    >
        <component  v-for="item in component.subComponent"
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
    name: "CwSubPanelPreview",
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
      //'component.subComponent': {
      //  handler: function (newVal, oldVal) {
      //  this.$bus.$emit('componentData', newVal)
      //  },
      //  deep: true,
      //},
    },
    data() {
      const _initdata = {
        // vueContext:{},
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
        // vueContext:{},
        methods:{}
      };
      return _initdata;
    },
    created() {
      // const padeCode = this.page

      // if(!padeCode){
      //     this.$emit('initPageCode',(page)=>{
      //         this.initCreated(page)
      //         this.$nextTick(() => {
      //               if(this.methods.mounted){
      //                   this.methods.mounted.call(this)
      //               }
      //       })
      //     })
      //  }else{
      //     this.initCreated(padeCode)
      //  }
    },
    mounted() {
      // this.createContext(this.vueContext,this)

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
        if(this.methods.mounted){
            this.methods.mounted.call(this)
         }
      });
    },
    methods: {
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
        // this.initPreview(this.componentData)
        this.$nextTick(()=>{
            // this.createContext(this.vueContext,this)
            if(this.methods.created){
            this.methods.created.call(this)
            }

        })
      },  
      createContext(context,vue){
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
              //  if(vueComp.compId && vueComp.compId.indexOf('CwDrawerPanelView')==0){
              //      let dialogComp = vueComp.$refs.cwDialogRef
              //      if(dialogComp && dialogComp.$children && dialogComp.$children.length){
              //          vueComp = dialogComp.$children[0]
              //      }
              //  }
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
        comText(){
        return '容器'
      },
      renderSubComponent(item){
        return modules[item]
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
      //拖到目标区域放下时触发
    
    },
  };
  
  //     - Drag（在拖拽目标时触发事件）
  // dragstart - 元素开始拖动时触发此事件
  
  // drag - 元素正在拖动时触发此事件
  
  // dragend - 元素拖动结束后触发此事件
  
  // - Drop（在目标区域释放时触发事件）
  // dragenter - 当被拖动的元素进入目标区域内时触发此事件
  
  // dragover - 当被拖动的元素在目标区域内拖动时触发此事件
  
  // dragleave - 当被拖动的元素离开目标区域时触发此事件
  
  // drop - 当被拖动的元素在目标区域被放下时触发此事件
  </script>
  
  <style lang="less" scoped>
  .my-scrollbar-content {
    cursor: auto;
    transform-origin: left top;
    // transform: scale(v-bind(scaleValue));
    transition: all 0.3s;
  }
  </style>
  