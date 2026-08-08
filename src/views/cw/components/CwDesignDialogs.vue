<template>
    <div
      id="mySubScrollbarContentPanel"
      ref="mySubScrollbarContentPanel"
      @dragover="handleDragOver"
      @dragenter="handleDragEnter"
      @drop="handleDrop"
      class="my-sub-scrollbar-content"
      :style="{...itemStyle,width:pageCode? itemStyle.width : '100%!important'}"
    >
        <div id="modalTitle" :style="{height:'50px',border:'1px solid #ccc',display:'flex',justifyContent: 'space-between',padding:'5px',cursor:'move'}" >
            <div>模态框</div>
            <div :style="{color:'#666',cursor:'pointer'}">x</div>
        </div>
        <Shape 
          v-for="item in component.subComponent"
          :style="{...item.styles,transform : 'rotate(' + item.styles.rotationAngle + 'deg)',}"
          :shapeId="'shape' + item.id"
          :compId="item.component + '-' + item.id"
          @openMenu="rightclick"
          @keyUp="shortcut"
          :component="item"
          :itemStyle="item.styles"
          :attribute="item.attribute"
          :panelStyle="{width:$el.offsetWidth,height:$el.offsetHeight}"
        >
          <component
            :is="renderSubComponent(item.component)"
            :id="'component' + item.id"
            :compId="item.component + '-' + item.id"
            :ref="item.component + '-' + item.id"
            class="component"
            :itemStyle="getComponentShapeStyle(item.styles)"
            :attribute="item.attribute"
            :style="{left:0,top:0,width:'100%',height:'100%'}"
            :componentModalObj="componentModalObj"
            :fieldName="item.fieldName"
            :component="item"
            :componentData="componentData"
            :vueContext="vueContext"
          /> 
        </Shape>
        <CwRightMenu 
          :rightclickInfo="rightclickInfo" 
          @rmenuCopy="rmenuCopy" 
          @rmenuDelete="rmenuDelete"
          @rmenuTop="rmenuTop" 
          @rmenuUp="rmenuUp" 
          @rmenuBottom="rmenuBottom" 
          @rmenuDown="rmenuDown" 
        />
    </div>
  </template>
  <script>
  import i18n from "@/lang";
  import Shape from "../CwShape.vue";
  import CwRightMenu from "../CwRightMenu.vue";
  import modules from "./loadModule.js";
  import {deepCopy} from "../utils/eventUtils"
  
  export default {
    name: "CwDesignDialogs",
    components: {
      Shape,
      CwRightMenu,
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
      itemStyle: {
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
     componentData: {
        type: Array,
        default: () => {
          return []
        }
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
      'component.subComponent': {
        handler: function (newVal, oldVal) {
        //   console.log(this.component)
        // this.$bus.$emit('componentData', newVal)
   
        },
        deep: true,
       immediate: true,

      },
    },
    data() {
      const _initdata = {
        methods:{},
        pageCode:{},
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
        //componentData:[],
        componentData1:[],
        selectOptionsData:[],
        rightclickInfo: {},
      };
      return _initdata;
    },
    created() {
      this.pageCode = this.$route.params?.pageCode
    },
    mounted() {
    //   this.$bus.$on('selevtComponentData', (data) => {
    //     this.componentData = data
    //   })
      this.$bus.$on('fieldName', (val, itemData) => {
        this.componentData.forEach(item=>{
          if(itemData.id == item.id){
              item.fieldName = val ? val : 'null'
            }
        })

  
      })
      this.$nextTick(() => {
        this.initElement();
        this.initRuler();
        this.$bus.$on("attributeData", (attributeObj) => {
          if(this.component.subComponent && this.component.subComponent.length>0){
            this.component.subComponent.forEach(item=>{
            if(item.id === attributeObj.compId.split('-')[1]){
              let someObject = Object.assign({}, attributeObj.data)
              item.attribute = someObject
            }
            })
          }
        
        });
        this.$bus.$on("styleData", (styleobj) => {

        let stObj = JSON.parse(JSON.stringify(styleobj))

        if(this.component.subComponent && this.component.subComponent.length>0){
          this.component.subComponent.forEach(item=>{
            if (item.id === stObj.compId.split('-')[1]) {
              item.styles = { ...item.styles, ...stObj.data };
            }
          })
        }
        
      });
      });
    },
    methods: {
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
      selectOptions(){
        let overflow = [
          { label: 'auto', value: 'auto' },
          { label: 'hidden', value: 'hidden' },
          { label: 'scroll', value: 'scroll' },
          { label: 'visible', value: 'visible' },
        ]
        let obj = {}
        obj['overflowX'] = overflow
        obj['overflowY'] = overflow
        return obj
      },
      getStyleCols() {
      return [
        { field: 'width', title: 'width', queryType: 'input', defaultValue: '600px', unit: 'px' },
        { field: 'height', title: 'height', queryType: 'input', defaultValue: '400px', unit: 'px' },
        { field: 'fontSize', title: 'fontSize', queryType: 'input', defaultValue: '16px', unit: 'px' },
        { field: 'backgroundColor', title: 'backgroundColor', queryType: 'colorpicker', defaultValue: '#ffe4c4', },
        { field: 'border', title: 'border', queryType: 'input', defaultValue: '', },
        { field: 'overflowX', title: 'overflowX', queryType: 'select', },
        { field: 'overflowY', title: 'overflowY', queryType: 'select', },
        { field: 'minWidth', title: 'minWidth', queryType: 'input', },
        { field: 'maxWidth', title: 'maxWidth', queryType: 'input', },
        { field: 'minHeight', title: 'minHeight', queryType: 'input', },
        { field: 'maxHeight', title: 'maxHeight', queryType: 'input', },
      ]
    },
      comText(){
        return '自定义模态'
      },
      ificationType() {
        return {
          classification: '布局容器组件',
          isCanvasview: false,
        }
      },
      renderSubComponent(item){
        return modules[item]
      },
   
      getCompCount1(name){
      let i = 0
      this.component.subComponent.forEach(item=>{
          if(item.component===name){
             i++
          }
      })
      return i
    },
    getCompCount(componentData,name) {
        let i = 0
         componentData.forEach(item => {
          if (item.component === name) {
            i++
          }
          if(item.tabPanels && item.tabPanels.length>0){
            item.tabPanels.forEach(t=>{
                if (t.component.component === name) {
                     i++
                 }
               if(t.component.subComponent && t.component.subComponent.length){
                    i+=this.getCompCount(t.component.subComponent,name)
                }
            })
          }
          if(item.subComponent && item.subComponent.length){
             i+=this.getCompCount(item.subComponent,name)
          }
        })
        
        return i
      },
      //拖到目标区域放下时触发
      handleDrop(event) {
        event.stopPropagation()
        event.preventDefault()
        let srcEventData = event.dataTransfer.getData("srcEventData");
        let componentData = JSON.parse(srcEventData);
        let components = [];
        if (componentData.action == "setLocation") {
        } else {
            let uuid = this.uuid()
            let i = this.getCompCount(this.componentData,componentData.name)

            //let i = this.getCompCount(this.componentData,componentData.name)
            let name = `${componentData.name}`
            if(i>0)
            name+=i
          let component = {
            component: componentData.name,
            id: uuid, //Math.random(),
            styles: {
              position: 'relative',
              left: event.offsetX - componentData.offsetX + "px",
              top: event.offsetY - componentData.offsetY + "px",
            },
            componentText:'',
            subComponent:[],
            fieldName:name,
            tabPanels:[],
            attribute:{
              fieldName:name,
            },
          };
          for (let key in modules) {
          if (modules[key].methods.hasOwnProperty('getStyleCols') && modules[key].name == componentData.name) {
            let styleCols = modules[key].methods.getStyleCols()
            component.componentText = modules[key].methods.comText()+i
            for (let i in styleCols) {
              component.styles[styleCols[i].field] = styleCols[i].defaultValue
            }
          }
        }
       
          this.component.subComponent.push(component);
        }
      },
      handleDragEnd(event) {
        event.preventDefault();
        //console.log('handleDragEnd',event)
      },
      handleDragStart(event) {
        //event.preventDefault();
        //console.log("handleDragStart",event)
      },
      handleDragOver(event) {
        event.preventDefault();
        // console.log("handleDragOver",event)
      },
      handleDragEnter(event) {
        //console.log("handleDragEnter",event)
      },
      initRuler() {
        let lineColor = "#CBCCCC";
        let textColor = "#CBCCCC";
        const oCanvas = document.getElementById("horizontalRuler");
        const ctx = oCanvas.getContext("2d");
        //ctx.clearRect(0,0,this.drawingWidth,16)
        ctx.beginPath();
        for (let i = 10.5; i < this.drawingWidth; i += 5) {
          ctx.moveTo(i, 0.5);
          if (i % 50 == 0.5) {
            {
              ctx.lineTo(i, 15.5);
              ctx.save();
              //ctx.strokeText(i-0.5, i, 15.5)
              ctx.translate(i, 15.5);
              ctx.fillStyle = textColor;
              ctx.fillText(i - 0.5, 0, 0);
              ctx.restore();
            }
          } else {
            ctx.lineTo(i, 7.5);
          }
  
          ctx.strokeStyle = lineColor;
  
          //ctx.lineWidth = 0.5
          ctx.stroke();
        }
  
        const verticalRuler = document.getElementById("verticalRuler");
  
        const verticalRulerCtx = verticalRuler.getContext("2d");
        //verticalRulerCtx.clearRect(0,0,16,this.drawingWidth)
        verticalRulerCtx.beginPath();
        for (let i = 10.5; i < this.drawingHeight; i += 5) {
          verticalRulerCtx.moveTo(0.5, i);
          if (i % 50 == 0.5) {
            verticalRulerCtx.lineTo(15.5, i);
  
            verticalRulerCtx.save();
            verticalRulerCtx.translate(15.5, i);
            verticalRulerCtx.rotate(-Math.PI / 2);
            verticalRulerCtx.fillStyle = textColor;
            verticalRulerCtx.fillText(i - 0.5, 0, 0);
            //verticalRulerCtx.strokeText(i-0.5, 12.5, i)
  
            verticalRulerCtx.restore();
            // verticalRulerCtx.strokeText(i-0.5, 12.5, i)
          } else {
            verticalRulerCtx.lineTo(7.5, i);
          }
  
          verticalRulerCtx.strokeStyle = lineColor;
          //verticalRulerCtx.lineWidth = 0.5
          verticalRulerCtx.stroke();
        }
      },
      initElement() {
        let self = this;
        let element = (this.element = document.getElementById(
          "myScrollbarContentPanel"
        ));
        let content = document.getElementById("myScrollbarContent");
        function handleMouseDown(event) {
          //console.log(self.$refs)
          let offsetX = event.clientX; //-element.clientLeft;
          let offsetY = event.clientY; //- element.clientTop;
          function handleMouseMove(event) {
            const { altKey, metaKey, deltaY, ctrlKey } = event;
            if (!ctrlKey) return;
            document.querySelector(".my-scrollbar-content").style.cursor = "grab";
            let newPositionX = self.scrollLeft - event.clientX;
            let newPositionY = self.scrollTop - event.clientY;
            if (Math.abs(newPositionX) > 50 || Math.abs(newPositionY) > 20) {
              self.scrollLeft = event.clientX;
              self.scrollTop = event.clientY;
              return;
            }
            //if(this.scrollLeft)
            content.scrollTo(
              content.scrollLeft + newPositionX,
              content.scrollTop + newPositionY
            );
          }
  
          function handleMouseUp(event) {
            document.querySelector(".my-scrollbar-content").style.cursor = "auto";
            element.removeEventListener("mousemove", handleMouseMove);
            element.removeEventListener("mouseup", handleMouseUp);
          }
  
          element.addEventListener("mousemove", handleMouseMove);
          element.addEventListener("mouseup", handleMouseUp);
        }
  
        // 为元素添加鼠标按下事件的监听器
        element.addEventListener("mousedown", handleMouseDown);
      },
      handleMouseDown(e) {},
      handleMouseUp(e) {},
      handleMouseMove(e) {},
      // 右键shape 菜单
      rightclick(event, compId, component, source) {
        this.rightclickInfo = {
          menuId: 'menu' + '-' + compId,
          position: {
            x: event.offsetX + source.offsetLeft,
            y: event.offsetY + source.offsetTop,
          },
          menulists: [
            {
              fnName: "rmenuCopy",
              params: { compId, event },
              btnName: "复制",
              children: [],
            },
            {
              fnName: "rmenuDelete",
              params: { compId, event },
              btnName: "删除",
              children: [],

            },
            {
              fnName: "",
              params: { compId, event },
              btnName: "置于顶层",
              children: [
                {
                  fnName: "rmenuTop",
                  params: { compId, event },
                  btnName: "置于顶层",
                  children: [],
                },
                {
                  fnName: "rmenuUp",
                  params: { compId, event },
                  btnName: "上移一层",
                  children: [],
                },
              ],
            },
            {
              fnName: "",
              params: { compId, event },
              icoName: "",
              btnName: "置于底层",
              children: [
                {
                  fnName: "rmenuBottom",
                  params: { compId, event },
                  btnName: "置于底层",
                  children: [],
                },
                {
                  fnName: "rmenuDown",
                  params: { compId, event },
                  btnName: "下移一层",
                  children: [],
                },
              ],
            },
          ],
        };
      },
      //复制
      rmenuCopy(params) {
        console.log("rmenuCopy", params);
      },
      // 删除
      rmenuDelete(params) {
        //console.log("rmenuDelete", params,this.component.subComponent);
        for (var i = 0; i < this.component.subComponent.length; i++) {
          if (
            this.component.subComponent[i].component + "-" + this.component.subComponent[i].id == params.compId
          ) {
            this.component.subComponent.splice(i, 1);
          }
        }
      },
      // 获取index
      indexGet(item) {
        let componentData = this.component.subComponent
        let len = this.component.subComponent.length
        for (let i = 0; i < len; i++) {
          if (componentData[i].id == item)
            return i
        }
      },
      // 置顶
      rmenuTop(params) {
        let componentData = this.component.subComponent
        let len = this.component.subComponent.length
        let index = this.indexGet(params.compId.split("-")[1])
        if (index < len - 1 && index >= 0) {
          let myComponments = componentData.splice(index, 1)
          componentData.push(myComponments[0])
        } else {
          //message.info('图层已经到顶了')
        }
      },
      // 上移一层
      rmenuUp(params) {
        let componentData = this.component.subComponent
        let len = this.component.subComponent.length
        let index = this.indexGet(params.compId.split("-")[1])
        if (index < len - 1 && index >= 0) {
          componentData.splice(index, 1, ...componentData.splice(index + 1, 1, componentData[index]))
        } else {
          //console.log('图层已经到顶了')
        }
      },
      // 下移一层
      rmenuDown(params) {
        let componentData = this.component.subComponent
        let len = this.component.subComponent.length
        let index = this.indexGet(params.compId.split("-")[1])
        if (index > 0) {
          componentData.splice(index, 1, ...componentData.splice(index - 1, 1, componentData[index]))
        } else {
          //console.log('图层已经到底了')
        }
      },
      // 置底
      rmenuBottom(params) {
        let componentData = this.component.subComponent
        let len = this.component.subComponent.length
        let index = this.indexGet(params.compId.split("-")[1])
        if (index > 0) {
          let myComponments = componentData.splice(index, 1)
          componentData.unshift(myComponments[0])
        } else {
          //message.info('图层已经到底了')
        }
      },
      // 右键画布 菜单
      onContextmenu(e) {
        if (e.target.localName != 'myScrollbarContentPanel_main') return   // 右键shape区域
        this.rightclickInfo = {
          position: {
            x: e.offsetX,
            y: e.offsetY,
          },
          menulists: [
            {
              fnName: "rmenuPaste",
              params: "粘贴",
              icoName: "",
              btnName: "粘贴",
              children: [],
            },
            {
              fnName: "rmenuClear",
              params: "清空画布",
              icoName: "",
              btnName: "清空画布",
              children: [],
            },
          ],
        };
      },
      rmenuPaste(params) {
        console.log("rmenuPaste", params);
      },
      rmenuClear(params) {
        this.component.subComponent = []
        console.log("rmenuClear", params);
      },
      //快捷键
      shortcut(e,compId){
        // delete
        if(e.keyCode == 46){
          this.rmenuDelete({'compId':compId})
        }
      }
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
  
  