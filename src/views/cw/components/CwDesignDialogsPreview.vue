<template>
  <div
    id="mySubScrollbarContentPanel"
    ref="mySubScrollbarContentPanel"
    class="my-sub-scrollbar-content"
    :style="{overflow: 'auto',display:isShow}"
   
  >
      <div id="modalTitle" :style="{height:'50px',border:'1px solid #ccc',display:'flex',justifyContent: 'space-between',padding:'5px',cursor:'move'}"  @mousedown="mousedown">
            <div>模态框</div>
            <div :style="{color:'#666',cursor:'pointer'}" @click="handleClose">x</div>
      </div>
      <component  v-for="item in component.subComponent"
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
      fieldName: {
        type: String,
        default: ''
      },
      vueContext: {
        type: Object,
        default: () => {
          return {}
        }
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
    },
    watch: {
      //'component.subComponent': {
      //  handler: function (newVal, oldVal) {
      //    console.log(newVal)
      //  this.$bus.$emit('componentData', newVal)
      //  },
      //  deep: true,
      //},
    },
    data() {
      const _initdata = {
        methods:{},
        isShow: 'none',
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
        componentData1:[]
      };
      return _initdata;
    },
    created() {
    },
    mounted() {
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
    methods: {
      comText(){
        return 'CwDesignDialogsPreview'
      },
      handleClose() {
      this.isShow = 'none'
      },
      dialogOpen(){
        this.isShow = 'block'
      },
      mousedown() {
        let sourceDom = this.$refs.mySubScrollbarContentPanel, titleEle =  document.getElementById('modalTitle');
        // 改变元素位置 其原理还是改变它的定位值 所以我们需要设置dom元素的定位 （子绝父相）
        sourceDom.style.position = "absolute";
        let previewPanelEle = sourceDom.parentNode;
        previewPanelEle.onmousemove = (event) => {
          /**
          * pageX和pageY 鼠标到可视窗口左侧上侧距离 + 滚动条滚动距离(如果有滚动条)
          * clientWidth clientHeigh 的实际宽度是  width（height） + 左右（上下）的padding
          */
          sourceDom.style.left = event.pageX - sourceDom.clientWidth/2 - titleEle.clientWidth/3 + "px";
          sourceDom.style.top = event.pageY - sourceDom.clientHeight/2 + titleEle.clientHeight + 45 + "px";
        };
        previewPanelEle.onmouseup = () => {
          //这俩都要置为null
          previewPanelEle.onmousemove = null;
          previewPanelEle.onmouseup = null;
          return false;
        };
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