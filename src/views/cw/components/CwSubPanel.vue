<template>
    <div
      id="mySubScrollbarContentPanel"
      ref="mySubScrollbarContentPanel"
      @dragover="handleDragOver"
      @dragenter="handleDragEnter"
      @drop="handleDrop"
      class="my-sub-scrollbar-content"
      @keyup.stop="movePanel"
      :style="{...itemStyle,width:pageCode? itemStyle.width : '100%!important'}"
    >
      <Shape 
          v-for="item in component.subComponent"
          :key="item.id"
          ref='subShaperef'
          :style="getShapeStyle(item)"
          :shapeId="'shape' + item.id"
          :compId="item.component + '-' + item.id"
          @openMenu="rightclick"
          @tocopyData="tocopyData"
          @deleteData="deleteData"
          :component="item"
          :itemStyle="item.styles"
          :attribute="item.attribute"
          :rectStyle="rectStyle"
          @savaQueueManager="savaQueueManager"
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
        <!-- <CwRightMenu 
          :rightclickInfo="rightclickInfo" 
          @rmenuCopy="rmenuCopy" 
          @rmenuPaste="rmenuPaste" 
          @rmenuDelete="rmenuDelete"
          @rmenuTop="rmenuTop" 
          @rmenuUp="rmenuUp" 
          @rmenuBottom="rmenuBottom" 
          @rmenuDown="rmenuDown" 
        /> -->
    </div>
  </template>
  <script>
  import i18n from "@/lang";
  import Shape from "../CwShape.vue";
  import CwRightMenu from "../CwRightMenu.vue";
  import modules from "./loadModule.js";
  import {deepCopy} from "../utils/eventUtils"

  export default {
    name: "CwSubPanel",
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
      itemStyle: {
        type: Object,
        default: () => {
          return {}
        }
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
        rectStyle:{
          width: 1920,
          height: 1080,
        },
        copyData: {},
        maxNumber:0
      };
      return _initdata;
    },
    beforeDestroy() {
      // window.removeEventListener('keydown', this.movePanel)
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
        // this.initRuler();
        this.$bus.$on('compFocusId', (val) => {  // 页签面板会取到另一个subpanel，判断有选中组件的subpanel
          for(var i = 0; i < this.$children.length; i++){
            if(val == this.$children[i].compId)
              this.rectStyle = { width:this.$el.offsetWidth,height:this.$el.offsetHeight }  // 防止开始取不到
          }
        })
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
      // document.addEventListener("keydown", (e)=>{this.movePanel(e)});
    },
    methods: {
      tocopyData(val){
        this.copyData = JSON.parse(JSON.stringify({...val}))
      },
      movePanel(e){
      if(e.ctrlKey && e.keyCode === 86) {
        // if(this.$refs.Shaperef){
        //   this.$refs.Shaperef[0].ctrlvPaste(e)
        // }
        if (!this.copyData.data) {
            return;
          }
          let uuid = this.uuid();
          let i = this.getCompMaxIndex(this.componentData, this.copyData.data.component) + 1;
          let name = `${this.copyData.data.component}`;
          if (i > 0) name += i;
          let component_data = {
            component: this.copyData.data.component,
            id: uuid,
            subComponent: [],
            styles: {
              ...this.copyData.data.styles,
              left: '0px',
              top: '0px',
            },
            handler: {},
            elementCode: "",
            tabPanels: [],
            fieldName: name,
            attribute: {
              fieldName: name,
            },
          };
          this.component.subComponent.push(component_data);
      }
      },
      getShapeStyle(item){
        let result = {}
        const style = deepCopy(item.styles)
        const excludes = ['top', 'left', 'position', 'width', 'height','marginTop','marginRight','marginBottom','marginLeft', 'display', "overflow",]
        Object.keys(style).forEach((key) => {
          if (excludes.includes(key)) {
            result[key] = style[key]
          }
        })
        //三种类型：(..)px (..)% (..)vh
           if(style.width && this.$parent.$el && this.$parent.$el.clientWidth!=0){
          result['width'] = this.convertPx(style.width,this.$parent.$el.clientWidth);
        }
        if(style.height && this.$parent.$el && this.$parent.$el.clientHeight!=0){
          result['height'] = this.convertPx(style.height,this.$parent.$el.clientHeight);
        }
        result['transform'] = 'rotate(' + item.styles.rotationAngle + 'deg)'
        return result
      },
      convertPx(data,parentData){
        let result = ''
        if(data.match(/[\D]+/g)){
          switch (data.match(/[\D]+/g)[0]) {
            case 'px' : result = parseInt(data) + 'px';break;
            case '%':   result = parseInt(data) / 100 * parseInt(parentData) + 'px';break;
            case 'vw': result = parseInt(data) / 100 * window.innerWidth + 'px';break;
            case 'vh': result = parseInt(data) / 100 * window.innerHeight + 'px';break;
            default: result = parseInt(data) + 'px';
          }
        }
          
        return result
      },
      getComponentShapeStyle(component) {
        let result = {}
        const style = deepCopy(component)
        const excludes = ['top', 'left','position','marginTop','marginRight','marginBottom','marginLeft']
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
        return '容器'
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

      getCompMaxIndex(componentData,name) {
        let i = 0
         componentData.forEach(item => {
          if (item.component === name) {
             if(item.fieldName.indexOf(name)>-1){
              let c = item.fieldName.match(/\d+/g)
              if(c){
                  let num = parseInt( c[0])
                  this.maxNumber = this.maxNumber<=num?num:this.maxNumber
              }else{
                this.maxNumber = 0
              }
             }
          }
          if(item.tabPanels && item.tabPanels.length>0){
            item.tabPanels.forEach(t=>{
                if (t.component.component === name) {
                  if(t.component.fieldName.indexOf(name)>-1){
                    let c = t.component.fieldName.match(/\d+/g)
                    if(c){
                        let num = parseInt( c[0])
                        this.maxNumber = this.maxNumber<=num?num:this.maxNumber
                    }else{
                      this.maxNumber = 0
                    }
                  }
                 }
               if(t.component.subComponent && t.component.subComponent.length){
                    this.maxNumber=this.getCompMaxIndex(t.component.subComponent,name)
                }
            })
          }
          if(item.subComponent && item.subComponent.length){
            this.maxNumber=this.getCompMaxIndex(item.subComponent,name)
          }
        })
        return this.maxNumber
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
            this.maxNumber = 0
            let i = this.getCompMaxIndex(this.componentData,componentData.name)+1

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
            elementCode: '',
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
          this.savaQueueManager()   
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
      rightclick(info) {
        var sidebarArea = document.querySelector('.sidebar-container');
        var navbarArea = document.querySelector('.navbar');
        var tagsArea = document.querySelector('.tags-view-container');
        info.position.x = info.position.x - sidebarArea.clientWidth,
        info.position.y = info.position.y - navbarArea.clientHeight - tagsArea.clientHeight
        let rightclickData = {
          info: info,
          componentData: this.component.subComponent
        }
        this.$bus.$emit("rightclick",rightclickData)
      },
      //快捷键
      deleteData(compId){
        // delete
          for (var i = 0; i < this.component.subComponent.length; i++) {
            if (
              this.component.subComponent[i].component + "-" + this.component.subComponent[i].id == compId
            ) {
              this.component.subComponent.splice(i, 1);
              this.savaQueueManager()
            }
          }
      },
      savaQueueManager (){
        let queueManager = JSON.parse(sessionStorage.getItem('queueManager'))
        let compData = JSON.parse(JSON.stringify(this.componentData))
        if(queueManager.queue.length == queueManager.curIndex ){
          queueManager.queue.push(compData)
        }else{
          // 在撤销的过程中发生的任何改动, 都会清空当前步骤之后的所有记录，最终产生一个新的状态分支
          queueManager.queue.splice(queueManager.curIndex,queueManager.queue.length-queueManager.curIndex)
          queueManager.queue.push(compData)
        }  
        queueManager.curIndex += 1
        sessionStorage.setItem("queueManager",JSON.stringify(queueManager))
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
  