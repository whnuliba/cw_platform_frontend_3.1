<template>
  <div
    id="myScrollbarContentPanel-process"
    ref="myScrollbarContentPanel-process"
    @dragover="handleDragOver"
    @dragenter="handleDragEnter"
    @drop="handleDropProcess"
    class="my-scrollbar-content-process"
    :style="{ transform: 'scale(' + this.scaleValue + ')' }"
    @contextmenu.prevent="onContextmenu"
    @mousedown="startSelection"
    @click="myScrollbarContentPanelClick"
    :key="keyC"
  >
  <canvas 
    ref="canvas" 
    id="testcanvas1"
    :width="'100%'"
    :height="'100%'"
    style="position: absolute; top: 0; left: 0;background:rgba(0, 161, 255, .16862745098039217);"
  ></canvas>
  <!-- v-if="!isDialogUseCanvasDraw"     v-if="!isDialogUseCanvasDraw" -->
    <!-- <div
      class="myScrollbarContentDesingerPanel_main"
      :style="{position: 'absolute',width:panelStyle.width+'px',height:panelStyle.height+'px'}"
      @keyup.stop="movePanel"
    >
      <Shape
        ref='Shaperef'
        v-for="item in componentDataProcess"
        :key="item.id"
        v-if="!item.onCanvas"
        :style="getShapeStyle(item)"
        :shapeId="'shape' + item.id"
        :compId="item.component + '-' + item.id"
        @openMenu="rightclick"
        @deleteData="deleteData"
        @tocopyData="tocopyData"
        :component="item"
        :itemStyle="item.styles"
        :attribute="item.attribute"
        :rectStyle="panelStyle"
        :isSelected="selectedElements.includes('shape' + item.id)"
        :selectedElements="selectedElements"
        @nodeSavaQueueManager="nodeSavaQueueManager"
      >
        <component
          :is="item.component"
          :id="'component' + item.id"
          v-if="!item.onCanvas"
          :compId="item.component + '-' + item.id"
          :ref="item.component + '-' + item.id"
          class="component"
          :itemStyle="getComponentShapeStyle(item.styles)"
          :attribute="item.attribute"
          :style="{left:0,top:0,width:'100%',height:'100%'}"
          :componentModalObj="componentModalObj"
          :fieldName="item.fieldName"
          :component="item"
          :componentDataProcess="componentDataProcess"
        />
      </Shape>
    </div> -->
  </div>
</template>
<script>
import i18n from "@/lang";
import Shape from "./NodeShape.vue";
import modules from "../loadModule.js";
import { deepCopy } from "../../utils/eventUtils";
import {dispatchEvent} from "../../utils/eventUtils";

export default {
  name: "NodePanel",
  components: {
    Shape,
    ...modules,
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
    panelStyle: {
      type: Object,
      default: () => {
        return {};
      },
    },
    width: {
      type: Number,
      default: () => {
        return 920;
      },
    },
    height: {
      type: Number,
      default: () => {
        return 650;
      },
    },
  },
  watch: {
    componentDataProcess: {
      handler: function (newVal, oldVal) {
        this.$bus.$emit("componentDataProcess", newVal);
        this.$store.dispatch('app/setPageDesignComponentData',newVal);
        this.isDialogUseCanvasDraw && this.redrawCanvas(this.lineDatas);
      },
      deep: true,
      // immediate: true,
    },
    nodePosition: {
      handler: function (newVal, oldVal) {
          if (newVal && newVal.styles) {
              let x = {locating:parseInt(newVal.styles.left),fieldName:newVal.fieldName,nodeWidth:parseInt(newVal.styles.width)}, 
                  y = {locating:parseInt(newVal.styles.top),fieldName:newVal.fieldName,nodeHeight:parseInt(newVal.styles.height)};
              this.nodeLineMoveByMouse(x, y)
          }
      },
      deep: true,
      immediate: true,
    },
    nodeDelDataListen:{
          handler: function (newVal, oldVal) {
              if (newVal) {
                  let aa = [],from = [],to = [],relinkData = {};
                  this.lineDatas.forEach((item,i) => {
                    if(newVal.fieldName === item.endPoint[0].fieldName) {
                      aa.push(item);
                      from = item.startPoint;
                      relinkData.from = item.data.from
                    }  
                    if(newVal.fieldName === item.startPoint[0].fieldName) {
                      aa.push(item);
                      to = item.endPoint;
                      relinkData.to = item.data.to
                    }                 
                  })
                  let newLine = this.lineDatas.filter(item => item !== aa[0] && item !== aa[1])
                        if ( (from.length && from[0].direction == 'right') && (to.length && to[0].direction != 'left') ) {
                          if (to[0].direction == 'top') {
                              to[0].locating = parseInt(to[0].locating) - parseInt(to[0].style.width) /2;
                              to[1].locating = parseInt(to[1].locating) + parseInt(to[0].style.height) /2;
                              to[0].direction = "left"
                              to[1].direction = "left"
                          }
                          if (to[0].direction == 'bottom') {
                              to[0].locating = parseInt(to[0].locating) - parseInt(to[0].style.width) /2;
                              to[1].locating = parseInt(to[1].locating) - parseInt(to[0].style.height) /2;
                              to[0].direction = "left"
                              to[1].direction = "left"
                          }
                      }
                        if ( (from.length && from[0].direction == 'left') && (to.length && to[0].direction != 'right') ) {
                          if (to[0].direction == 'top') {
                              to[0].locating = parseInt(to[0].locating) + parseInt(to[0].style.width) /2;
                              to[1].locating = parseInt(to[1].locating) + parseInt(to[0].style.height) /2;
                              to[0].direction = "right"
                              to[1].direction = "right"
                          }
                          if (to[0].direction == 'bottom') {
                              to[0].locating = parseInt(to[0].locating) + parseInt(to[0].style.width) /2;
                              to[1].locating = parseInt(to[1].locating) - parseInt(to[0].style.height) /2;
                              to[0].direction = "right"
                              to[1].direction = "right"
                          }
                      }
                        if ( (from.length && from[0].direction == 'bottom') && (to.length && to[0].direction != 'top') ) {
                          if (to[0].direction == 'left') {
                              to[0].locating = parseInt(to[0].locating) + parseInt(to[0].style.width) /2
                              to[1].locating = parseInt(to[1].locating) - parseInt(to[0].style.height) /2
                              to[0].direction = "top"
                              to[1].direction = "top"
                          }
                          if (to[0].direction == 'right') {
                              to[0].locating = parseInt(to[0].locating) - parseInt(to[0].style.width) /2
                              to[1].locating = parseInt(to[1].locating) - parseInt(to[0].style.height) /2
                              to[0].direction = "top"
                              to[1].direction = "top"
                          }

                      }
                        if ( (from.length && from[0].direction == 'top') && (to.length && to[0].direction != 'bottom') ) {
                          if (to[0].direction == 'left') {
                              to[0].locating = parseInt(to[0].locating) + parseInt(to[0].style.width) /2
                              to[1].locating = parseInt(to[1].locating) + parseInt(to[0].style.height) /2
                              to[0].direction = "bottom"
                              to[1].direction = "bottom"
                          }
                          if (to[0].direction == 'right') {
                              to[0].locating = parseInt(to[0].locating) - parseInt(to[0].style.width) /2
                              to[1].locating = parseInt(to[1].locating) + parseInt(to[0].style.height) /2
                              to[0].direction = "bottom"
                              to[1].direction = "bottom"
                          }

                      }

                  if (aa.length === 2) {
                      newLine.push({
                                      data: relinkData,startPoint:[...from], endPoint:[...to],
                                  })
                  }
                  
                  this.isDialogUseCanvasDraw && this.redrawCanvas(newLine);
                  this.lineDatas = newLine;
              }
          },
          deep: true,
          immediate: true,
    },
    // "componentDataProcess.length": {
    //   handler: function (newVal, oldVal) {
    //     if (newVal != oldVal) {
    //       let obj = this.componentDataProcess[oldVal];
    //       if(!obj)
    //         return
    //       let name = obj.component + "-" + obj.id;
    //       this.componentModalObj[name] = "";
    //       this.$nextTick(() => {});
    //     }
    //   },
    // },
    // componentModalObj: {
    //   handler: function (newVal, oldVal) {
    //     if (newVal) {
    //     }
    //   },
    //   deep: true,
    // },
  },
  data() {
    const _initdata = {
      endPosition0: 0,
      endPosition1: 0,
      startPosition0:0,
      startPosition1:0,
      endPosition0: 0,
      endPosition1: 0,
      endX: 0,
      endY: 0,
      canvasLine: null,
      ctx: null,
      isMouseDraw: false,
      div1: null,
      div2: null,
      canDrawLineRect:null,
      x: 0,
      y: 0,
      x1: 0,
      y1: 0,
      nodePosition: {},
      lineDatas: [],
      canMouseMoveLineConnect: true,
      lastClickTime: 0,
      isDialogUseCanvasDraw: true,
      keyC: true,
      componentModalObj: {},
      allAttributeData: {},
      // itemStyle: {},
      scaleValue: 1,
      contentMaxScale: 200,
      contentMinScale: 1,
      contentStep: 0.1,
      contentOffsetX: 0, // 水平偏移量
      contentOffsetY: 0,
      isSelecting: false,
      selectionRect: null,
      selectedElements: [],
      scrollLeft: 0,
      scrollTop: 0,
      time: 0,
      // drawingWidth: 1920,
      // drawingHeight: 1080,
      componentDataProcess: [],
      componentDataProcessHis: [],
      element: undefined,
      rightclickInfo: {},
      copyData: {},
      maxNumber: 0,
      initialWidth : 0,
      initialHeight : 0,
      initialLeft : 0,
      initialTop : 0,
      scaleFactor: 1,          // 缩放比例（默认1倍）
      scale: 1,                // 缩放比例
      preScale: 1,             // 上一次的缩放比例
      scaleStep: 0.1,          // 缩放步长
      maxScale: 5,             // 最大缩放比例
      minScale: 1,           // 最小缩放比例
      canvas: null,           // 画布元素
      handledotsSize: 4, //选中时候的点的大小
      handledotsOffset: 6, //选中时候的点的偏移量
      hoveredHandleType: null, // 悬停的调整点类型
      contentOffsetX: 0, // 水平偏移量
      contentOffsetY: 0, // 垂直偏移量
      tableRowInfo: {},
      processFlowNodeArr: [],
    };
    //Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
    return _initdata;
  },
  computed: {
    nodeDelDataListen(){
      return this.$store.getters.deleNode
    }
  },
  beforeDestroy() {
  },
  created() {
  },
  mounted() {
    this.canvasLine = document.getElementById("testcanvas1");
    this.ctx = this.canvasLine.getContext('2d');
    this.$bus.$on("selevtcomponentDataProcess", (data) => {
      this.componentDataProcess = data;
    });

    this.$bus.$on("selevtLineDataProcess", (data) => {
      this.lineDatas = data;
      this.redrawCanvas(this.lineDatas);
    });

    this.$bus.$on("fieldName", (val, itemData) => {
      this.componentDataProcess.forEach((item) => {
        if (itemData.id == item.id) {
          item.fieldName = val ? val : "null";
        }
      });

    });
    this.$nextTick(() => {
      const Canvas = document.getElementById("testcanvas1");
      this.canvas = document.getElementById("testcanvas1")

      const ctx = Canvas.getContext("2d");
      Canvas.width = 970;
		  Canvas.height = 770;
      // ctx.scale(this.ratio, this.ratio)
      Canvas.addEventListener('mousedown', this.onCanvasMouseDown);
      Canvas.addEventListener('click', this.onCanvasClick);
      Canvas.addEventListener('dblclick', this.onCanvasDbClick);
      Canvas.addEventListener('mousemove', this.onCanvasMouseMove);
      Canvas.addEventListener("contextmenu", this.onCanvasContextmenuNode);
      Canvas.addEventListener('mouseup',this.mouseUpEvent);
      Canvas.addEventListener('mouseout',this.mouseOutEvent);
      this.initElement();

      this.$bus.$on('tableRowInfo', (rowInfo, processFlowNodeArr) => {
        this.tableRowInfo = rowInfo;
        this.processFlowNodeArr = processFlowNodeArr;
      })
      this.$bus.$on("attributeDataProcess", (attributeObj) => {
        this.componentDataProcess.forEach((item) => {
          if (item.id === attributeObj.compId.split("-")[1]) {
            let someObject = Object.assign({}, attributeObj.data);
            item.attribute = { ...someObject };
            if( this.isDialogUseCanvasDraw && modules[item.component].methods.changeWidthHeight) {
              let arr = []
              arr = modules[item.component].methods.changeWidthHeight(attributeObj.data.nodeLayers)
              if(attributeObj.data.nodeLayers != 6){
                item.styles[arr[0]] = arr[1]+ 'px';
              }
            }
           
          }
        });
        // 监听节点移动坐标位置
        if (attributeObj && attributeObj.component) {
                  this.nodePosition = attributeObj.component
                }
      });
      this.$bus.$on("styleData", (styleobj) => {
        let _this = this;
        let stObj = JSON.parse(JSON.stringify(styleobj));
        this.componentDataProcess.forEach((item) => {
          if (item.id === stObj.compId.split("-")[1]) {
            item.styles = { ...item.styles, ...stObj.data };
            const w = parseFloat(item.styles.width.replace('px', '')) || 0;
            const h = parseFloat(item.styles.height.replace('px', '')) || 0;
            const offset = _this.handledotsOffset;
            const handles = [
              { type: 'top-left', x: -offset, y: -offset },
              { type: 'top', x: w / 2, y: -offset },
              { type: 'top-right', x: w + offset, y: -offset },
              { type: 'right', x: w + offset, y: h / 2 },
              { type: 'bottom-right', x: w + offset, y: h + offset },
              { type: 'bottom', x: w / 2, y: h + offset },
              { type: 'bottom-left', x: -offset, y: h + offset },
              { type: 'left', x: -offset, y: h / 2 },
            ];
            item['handles'] = handles;

          }
        });
      });
      // this.$refs.myScrollbarContentPanel_main.addEventListener("keyup", (e)=>{
      //   this.movePanel(e)});
    });

  },
  methods: {
    handlerEvent(tag,v1,v2,v3,v4){
              let args = []
              if(v1)  args.push(v1)
              if(v2)  args.push(v2)
              if(v3)  args.push(v3)
              if(v4)  args.push(v4)
              this.$nextTick(()=>{
                const ele = this.$el
                if(ele){
                  dispatchEvent(ele,tag,args)
                }
              })
        },
     // 线随着节点移动
     nodeLineMoveByMouse(left, top, leftOld, topOld) {
      // 以节点的唯一fieldName来判断节点位置坐标变化
      let moveL = {}, moveT = {},eMoveL = {}, eMoveT = {};
      let newLines = this.lineDatas.map((item, i) => {
          if (item.startPoint[0].fieldName === left.fieldName && item.startPoint[1].fieldName === top.fieldName) {
              switch (item.startPoint[0].direction) {  // 判断线开始节点的连接方向
                case 'right': 
                      moveL = {locating:left.locating + left.nodeWidth,fieldName:left.fieldName,style:{width:item.startPoint[0].style.width,height:item.startPoint[0].style.height},direction:'right',lineAttr: {direction:'from',color:'green',width:2} },
                      moveT = {locating:top.locating+ top.nodeHeight/2,fieldName:top.fieldName,direction:'right'};
                      item.startPoint = [moveL, moveT]
                  break;
                  case 'left':
                      moveL = {locating:left.locating,fieldName:left.fieldName,direction:'left',style:{width:item.startPoint[0].style.width,height:item.startPoint[0].style.height},lineAttr: {direction:'from',color:'green',width:2} },
                      moveT = {locating:top.locating+ top.nodeHeight/2,fieldName:top.fieldName,direction:'left'};
                      item.startPoint = [moveL, moveT] 
                  break;
                  case 'bottom':
                      moveL = {locating:left.locating + left.nodeWidth/2,fieldName:left.fieldName,direction:'bottom',style:{width:item.startPoint[0].style.width,height:item.startPoint[0].style.height},lineAttr: {direction:'from',color:'green',width:2} },
                      moveT = {locating:top.locating+ top.nodeHeight,fieldName:top.fieldName,direction:'bottom'};
                      item.startPoint = [moveL, moveT] 
                  break;
                  case 'top':
                      moveL = {locating:left.locating + left.nodeWidth/2,fieldName:left.fieldName,direction:'top',style:{width:item.startPoint[0].style.width,height:item.startPoint[0].style.height},lineAttr: {direction:'from',color:'green',width:2} },
                      moveT = {locating:top.locating,fieldName:top.fieldName,direction:'top'};
                      item.startPoint = [moveL, moveT] 
                  break;
                default:
                  break;
              }
              // item.startPoint = [left, top] 
          } else if (item.endPoint[0].fieldName == left.fieldName && item.endPoint[1].fieldName == top.fieldName) {
              switch (item.endPoint[0].direction) { // 判断线结束节点的连接方向
                case 'right':
                      eMoveL = {locating:left.locating + left.nodeWidth,fieldName:left.fieldName,direction:'right',style:{width:item.endPoint[0].style.width,height:item.endPoint[0].style.height},lineAttr: {direction:'to',color:'green',width:2} },
                      eMoveT = {locating:top.locating+ top.nodeHeight/2,fieldName:top.fieldName,direction:'right'};
                      item.endPoint = [eMoveL, eMoveT] 
                  break;
                  case 'left':
                      eMoveL = {locating:left.locating,fieldName:left.fieldName,direction:'left',style:{width:item.endPoint[0].style.width,height:item.endPoint[0].style.height},lineAttr: {direction:'to',color:'green',width:2} },
                      eMoveT = {locating:top.locating+ top.nodeHeight/2,fieldName:top.fieldName,direction:'left'};
                      item.endPoint = [eMoveL, eMoveT] 
                  break;
                  case 'bottom':
                      eMoveL = {locating:left.locating + left.nodeWidth/2,fieldName:left.fieldName,direction:'bottom',style:{width:item.endPoint[0].style.width,height:item.endPoint[0].style.height},lineAttr: {direction:'to',color:'green',width:2} },
                      eMoveT = {locating:top.locating+ top.nodeHeight,fieldName:top.fieldName,direction:'bottom'};
                      item.endPoint = [eMoveL, eMoveT] 
                  break;
                  case 'top':
                      eMoveL = {locating:left.locating + left.nodeWidth/2,fieldName:left.fieldName,direction:'top',style:{width:item.endPoint[0].style.width,height:item.endPoint[0].style.height},lineAttr: {direction:'to',color:'green',width:2} },
                      eMoveT = {locating:top.locating,fieldName:top.fieldName,direction:'top'};
                      item.endPoint = [eMoveL, eMoveT] 
                  break;
                default:
                  break;
              }
              // item.endPoint = [left, top]
          } 
          return item
      })
      this.redrawCanvas(newLines)
      // this.animateDrawLines(this.lineDatas);
      // requestAnimationFrame();
    },
    mouseToDrawLines(canvasEntity,startPosition0,startPosition1,mousePosX,mousePosY) {
          canvasEntity.beginPath();
          canvasEntity.moveTo(startPosition0,startPosition1)
    },
    mouseToDrawLines1(canvasEntity,endPosition0,endPosition1,stopMouse) {
        if (stopMouse) {
          canvasEntity.lineTo(endPosition0,endPosition1)
          canvasEntity.stroke();
        }
       
    },
    // 监听鼠标移动事件
    onCanvasMouseMove(event) {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.scale;
      const scaleY = this.scale;
      const offsetX = this.contentOffsetX || 0;
      const offsetY = this.contentOffsetY || 0;

      const mouseX = (event.clientX - Math.round(rect.left) - offsetX) / scaleX;
      const mouseY = (event.clientY - Math.round(rect.top) - offsetY) / scaleY;
      // 检测悬停的调整点
      let hoveredHandleType = null;
      this.componentDataProcess.forEach(item => {
        if (item.isSelected && item.handles) {
          item.handles.some(handle => {
            const dx = mouseX - (handle.x + parseFloat(item.styles.left.replace('px', '')));
            const dy = mouseY - (handle.y + parseFloat(item.styles.top.replace('px', '')));
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= this.handledotsSize) {
              hoveredHandleType = handle.type;
              return true; // 找到后停止循环
            }
            return false;
          });
        }
      });

      // 设置光标样式
      if (hoveredHandleType !== this.hoveredHandleType) {
        this.hoveredHandleType = hoveredHandleType;
        // this.canvas.style.cursor = this.getCursorStyle(hoveredHandleType);
      }

      /*------------------------------------------------areaLine-------------------------------------------------------*/
      // 不同节点间连线
      const position = this.getCanvasPosition(event);
      let newVal = this.componentDataProcess;
      this.endPosition0 = parseInt(position.x)
      this.endPosition1 = parseInt(position.y) 

      // 鼠标移动到线段上时，线段width变大
      this.mouseMoveLineEvent(event)
      if (this.canMouseMoveLineConnect) {
        // 重新绘制所有已有的线
        this.redrawCanvas(this.lineDatas);
        // 绘制新的临时线
        this.mouseToDrawLines(this.ctx,this.startPosition0.locating,this.startPosition1.locating)
        // 根据位置判断线段弯曲折行方向
        switch (this.startPosition0.direction) {
          case "right":
            this.ctx.lineTo(this.startPosition0.locating+(position.x - this.startPosition0.locating)/2,this.startPosition1.locating)
            this.ctx.lineTo(this.startPosition0.locating+(position.x - this.startPosition0.locating)/2,position.y)
           break;
          case "left":
            this.ctx.lineTo(this.startPosition0.locating - (this.startPosition0.locating - position.x)/2,this.startPosition1.locating)
            this.ctx.lineTo(this.startPosition0.locating - (this.startPosition0.locating - position.x)/2,position.y)
           break;
          case "top":
            this.ctx.lineTo(this.startPosition0.locating, this.startPosition1.locating+(position.y - this.startPosition1.locating)/2)
            this.ctx.lineTo(position.x,this.startPosition1.locating+(position.y - this.startPosition1.locating)/2)
           break;
          case "bottom":
            this.ctx.lineTo(this.startPosition0.locating,this.startPosition1.locating+(position.y - this.startPosition1.locating)/2)
            this.ctx.lineTo(position.x,this.startPosition1.locating+(position.y - this.startPosition1.locating)/2)
           break;
           default:
           break;
        }
        // 拉线后绘制线和箭头，让线随着鼠标点移动
        this.mouseToDrawLines1(this.ctx,this.endPosition0,this.endPosition1,this.isMouseDraw)
        // this.drawArrow(this.startPosition0.locating,this.startPosition1.locating,this.endPosition0,this.endPosition1)    // 绘制鼠标移动点箭头
        this.drawArrowDirection(this.startPosition0,this.startPosition1,this.endPosition0,this.endPosition1,position);
        // 在出现红色矩形框后绘制线段
        newVal.forEach((item,i) => {
            let topX = parseInt(item.styles.left) + parseInt(item.styles.width)/2, topY = parseInt(item.styles.top);
            let rightX = parseInt(item.styles.left) + parseInt(item.styles.width), rightY = parseInt(item.styles.top) + parseInt(item.styles.height)/2;
            let bottomX = parseInt(item.styles.left) + parseInt(item.styles.width)/2, bottomY = parseInt(item.styles.top);
            let leftX = parseInt(item.styles.left), leftY = parseInt(item.styles.top) + parseInt(item.styles.height)/2;
            //---------------------------------------------------------------------------------------------------------------
            let pTopL = [parseInt(item.styles.left), parseInt(item.styles.top)],
                pTopR = [parseInt(item.styles.left) + parseInt(item.styles.width), parseInt(item.styles.top)];
            let pBottomL = [parseInt(item.styles.left), parseInt(item.styles.top) + parseInt(item.styles.height)],
                pBottomR = [parseInt(item.styles.left) + parseInt(item.styles.width), parseInt(item.styles.top) + parseInt(item.styles.height)];
            // 如果靠近下一个节点出现红框就自动连接到该节点           
            if (  ( pBottomL[1] - position.y <=parseInt(item.styles.height) && position.y - pTopL[1]<= parseInt(item.styles.height) ) &&
                        (pBottomL[0]  - position.x>=10 && pBottomL[0]  - position.x<= Math.sqrt(Math.pow(parseInt(item.styles.height)/2,2)+100)) &&
                      (pTopL[0]  - position.x>=10 && pTopL[0]  - position.x <= Math.sqrt(Math.pow(parseInt(item.styles.height)/2,2)+100)) ) {
                let x1 = {locating: leftX, fieldName: item.fieldName, direction: "left",style:{width:item.styles.width,height:item.styles.height},lineAttr: {direction:'to',color:'green',width:2,shadowColor:`rgba(0,0,0,0.5)`}} //[leftX, item.fieldName,"left"];
                let y1 = {locating: leftY, fieldName: item.fieldName, direction: "left",lineAttr: 'to'} //[leftY,item.fieldName,"left"];
                this.endX = x1; this.endY = y1;
                this.drawRect(leftX -10,topY, 10, parseInt(item.styles.height), "rgba(255,0,0,0.4)");
                this.canvasLine.style.cursor = this.getCursorStyle("pullLines");
                this.mouseToDrawLines1(this.ctx,x1.locating,y1.locating,this.isMouseDraw)
            } else if ( ( pBottomR[1] - position.y <=parseInt(item.styles.height) && position.y - pTopR[1]<= parseInt(item.styles.height) ) &&
                        (position.x - pBottomR[0] >=10 && position.x - pBottomR[0] <= Math.sqrt(Math.pow(parseInt(item.styles.height)/2,2)+100)) &&
                      (position.x - pTopR[0] >=10 && position.x - pTopR[0] <= Math.sqrt(Math.pow(parseInt(item.styles.height)/2,2)+100)) ){
                let x1 = {locating: rightX, fieldName: item.fieldName, direction: "right",style:{width:item.styles.width,height:item.styles.height},lineAttr: {direction:'to',color:'green',width:2,shadowColor:`rgba(0,0,0,0.5)`}} //[rightX,item.fieldName,"right"];
                let y1 = {locating: rightY, fieldName: item.fieldName, direction: "right",lineAttr: 'to'} //[rightY,item.fieldName,"right"];
                this.endX = x1; this.endY = y1;
                this.drawRect(rightX,topY, 10, parseInt(item.styles.height), "rgba(255,0,0,0.4)");
                this.canvasLine.style.cursor = this.getCursorStyle("pullLines");
                this.mouseToDrawLines1(this.ctx,x1.locating,y1.locating,this.isMouseDraw)
            }  else if ( ( pBottomR[0] - position.x <=parseInt(item.styles.width) && position.x - pBottomL[0]<= parseInt(item.styles.width) ) &&
                        (position.y - pBottomL[1] >=10 && position.y - pBottomL[1] <= Math.sqrt(Math.pow(parseInt(item.styles.width)/2,2)+100)) &&
                      (position.y - pBottomR[1] >=10 && position.y - pBottomR[1] <= Math.sqrt(Math.pow(parseInt(item.styles.width)/2,2)+100))  ) {
                let x1 = {locating: bottomX, fieldName: item.fieldName, direction: "bottom",style:{width:item.styles.width,height:item.styles.height},lineAttr: {direction:'to',color:'green',width:2,shadowColor:`rgba(0,0,0,0.5)`}} //[bottomX,item.fieldName,"bottom"];
                let y1 = {locating: bottomY, fieldName: item.fieldName, direction: "bottom",lineAttr: 'to'} //[bottomY,item.fieldName,"bottom"];
                this.endX = x1; this.endY = y1;
                this.drawRect(leftX, bottomY-10, parseInt(item.styles.width), 10, "rgba(255,0,0,0.4)");
                this.canvasLine.style.cursor = this.getCursorStyle("pullLines");
                this.mouseToDrawLines1(this.ctx,x1.locating,y1.locating,this.isMouseDraw)
            }   else if ( ( pTopR[0] - position.x <=parseInt(item.styles.width) && position.x - pTopL[0]<= parseInt(item.styles.width) ) &&
                        (pTopL[1] - position.y>=10 && pTopL[1] - position.y <= Math.sqrt(Math.pow(parseInt(item.styles.width)/2,2)+100)) &&
                      (pTopR[1] - position.y >=10 && pTopR[1] - position.y <= Math.sqrt(Math.pow(parseInt(item.styles.width)/2,2)+100)) ) {
                let x1 = {locating: topX, fieldName: item.fieldName, direction: "top",style:{width:item.styles.width,height:item.styles.height},lineAttr: {direction:'to',color:'green',width:2,shadowColor:`rgba(0,0,0,0.5)`}} //[bottomX,item.fieldName,"bottom"];
                let y1 = {locating: topY, fieldName: item.fieldName, direction: "top",lineAttr: 'to'} //[bottomY,item.fieldName,"bottom"];
                this.drawRect(leftX, topY - 10, parseInt(item.styles.width), 10, "rgba(255,0,0,0.4)");
                this.canvasLine.style.cursor = this.getCursorStyle("pullLines");
                this.mouseToDrawLines1(this.ctx,x1.locating,y1.locating,this.isMouseDraw)
            }
            //  else {
            //   this.canvasLine.style.cursor = this.getCursorStyle();
            // }
        })  
          
      } else {
        this.redrawCanvas(this.lineDatas);
        newVal.forEach(item => {
            let topX = parseInt(item.styles.left) + parseInt(item.styles.width)/2, topY = parseInt(item.styles.top);
            let rightX = parseInt(item.styles.left) + parseInt(item.styles.width), rightY = parseInt(item.styles.top) + parseInt(item.styles.height)/2;
            let bottomX = parseInt(item.styles.left) + parseInt(item.styles.width)/2, bottomY = parseInt(item.styles.top) + parseInt(item.styles.height);
            let leftX = parseInt(item.styles.left), leftY = parseInt(item.styles.top) + parseInt(item.styles.height)/2;
            //---------------------------------------------------------------------------------------------------------------
            let pTopL = [parseInt(item.styles.left), parseInt(item.styles.top)],
                pTopR = [parseInt(item.styles.left) + parseInt(item.styles.width), parseInt(item.styles.top)];
            let pBottomL = [parseInt(item.styles.left), parseInt(item.styles.top) + parseInt(item.styles.height)],
                pBottomR = [parseInt(item.styles.left) + parseInt(item.styles.width), parseInt(item.styles.top) + parseInt(item.styles.height)];          
            if ( ( pBottomL[1] - position.y <=parseInt(item.styles.height) && position.y - pTopL[1]<= parseInt(item.styles.height) ) &&
                        (pBottomL[0]  - position.x>=10 && pBottomL[0]  - position.x<= Math.sqrt(Math.pow(parseInt(item.styles.height)/2,2)+100)) &&
                      (pTopL[0]  - position.x>=10 && pTopL[0]  - position.x <= Math.sqrt(Math.pow(parseInt(item.styles.height)/2,2)+100))) {
                this.canvasLine.style.cursor = this.getCursorStyle("pullLines");
                this.drawRect(leftX -10,topY, 10, parseInt(item.styles.height), "rgba(255,0,0,0.4)");
                
            } else {
                // this.drawRect(leftX -10,topY, 10, parseInt(item.styles.height), "transparent");
                this.canvasLine.style.cursor = this.getCursorStyle();
            }
            if ( ( pBottomR[1] - position.y <=parseInt(item.styles.height) && position.y - pTopR[1]<= parseInt(item.styles.height) ) &&
                        (position.x - pBottomR[0] >=10 && position.x - pBottomR[0] <= Math.sqrt(Math.pow(parseInt(item.styles.height)/2,2)+100)) &&
                      (position.x - pTopR[0] >=10 && position.x - pTopR[0] <= Math.sqrt(Math.pow(parseInt(item.styles.height)/2,2)+100)) ) {
                this.drawRect(rightX,topY, 10, parseInt(item.styles.height), "rgba(255,0,0,0.4)");
                this.canvasLine.style.cursor = this.getCursorStyle("pullLines");
            } else {
                // this.drawRect(rightX,topY, 10, parseInt(item.styles.height), "transparent");
                this.canvasLine.style.cursor = this.getCursorStyle();
            }
            if ( ( pBottomR[0] - position.x <=parseInt(item.styles.width) && position.x - pBottomL[0]<= parseInt(item.styles.width) ) &&
                        (position.y - pBottomL[1] >=10 && position.y - pBottomL[1] <= Math.sqrt(Math.pow(parseInt(item.styles.width)/2,2)+100)) &&
                      (position.y - pBottomR[1] >=10 && position.y - pBottomR[1] <= Math.sqrt(Math.pow(parseInt(item.styles.width)/2,2)+100))  ) {
                this.drawRect(leftX, bottomY, parseInt(item.styles.width), 10, "rgba(255,0,0,0.4)");
                this.canvasLine.style.cursor = this.getCursorStyle("pullLines");
            } else {
                // this.drawRect(leftX, bottomY, parseInt(item.styles.width), 10, "transparent");
                this.canvasLine.style.cursor = this.getCursorStyle();
            }
            if ( ( pTopR[0] - position.x <=parseInt(item.styles.width) && position.x - pTopL[0]<= parseInt(item.styles.width) ) &&
                        (pTopL[1] - position.y>=10 && pTopL[1] - position.y <= Math.sqrt(Math.pow(parseInt(item.styles.width)/2,2)+100)) &&
                      (pTopR[1] - position.y >=10 && pTopR[1] - position.y <= Math.sqrt(Math.pow(parseInt(item.styles.width)/2,2)+100)) ) {
                this.drawRect(leftX, topY - 10, parseInt(item.styles.width), 10, "rgba(255,0,0,0.4)");
                this.canvasLine.style.cursor = this.getCursorStyle("pullLines");
            } else {
                this.canvasLine.style.cursor = this.getCursorStyle();
            }
        }) 
             
      }

    },
    mouseUpEvent(e) { 
      // 连接成功后线体变成绿色
      this.ctx.strokeStyle = "green";  
      const position = this.getCanvasPosition(e);
      let newVal = this.componentDataProcess;
      this.endPosition0 = position.x; 
      this.endPosition1 = position.y;
      this.mouseToDrawLines1(this.ctx,this.endPosition0,this.endPosition1,this.isMouseDraw)
      newVal.forEach((item,i) => {
          let topX = parseInt(item.styles.left) + parseInt(item.styles.width)/2, topY = parseInt(item.styles.top);
          let rightX = parseInt(item.styles.left) + parseInt(item.styles.width), rightY = parseInt(item.styles.top) + parseInt(item.styles.height)/2;
          let bottomX = parseInt(item.styles.left) + parseInt(item.styles.width)/2, bottomY = parseInt(item.styles.top) + parseInt(item.styles.height);
          let leftX = parseInt(item.styles.left), leftY = parseInt(item.styles.top) + parseInt(item.styles.height)/2;
          //---------------------------------------------------------------------------------------------------------------
          let pTopL = [parseInt(item.styles.left), parseInt(item.styles.top)],
                pTopR = [parseInt(item.styles.left) + parseInt(item.styles.width), parseInt(item.styles.top)];
            let pBottomL = [parseInt(item.styles.left), parseInt(item.styles.top) + parseInt(item.styles.height)],
                pBottomR = [parseInt(item.styles.left) + parseInt(item.styles.width), parseInt(item.styles.top) + parseInt(item.styles.height)];
          // 如果靠近下一个节点出现红色矩形就自动连接到该节点                 
          if ( ( pBottomL[1] - position.y <=parseInt(item.styles.height) && position.y - pTopL[1]<= parseInt(item.styles.height) ) &&
                        (pBottomL[0]  - position.x>=10 && pBottomL[0]  - position.x<= Math.sqrt(Math.pow(parseInt(item.styles.height)/2,2)+100)) &&
                      (pTopL[0]  - position.x>=10 && pTopL[0]  - position.x <= Math.sqrt(Math.pow(parseInt(item.styles.height)/2,2)+100)) ){
              this.endX = {locating: leftX, fieldName: item.fieldName, direction: "left",
              style:{width:item.styles.width,height:item.styles.height},
              lineAttr:  {direction:'to',color:'green',width:2,shadowColor:`rgba(0,0,0,0.5)`}} //[leftX, item.fieldName,"left"]; 
              this.endY = {locating: leftY, fieldName: item.fieldName, direction: "left",lineAttr: 'to'} //[leftY, item.fieldName,"left"];
              // 绘制结束点箭头
              this.drawArrow(this.startPosition0.locating,this.startPosition1.locating,leftX,leftY)
              // 绘制左结束点箭头
              if (this.startPosition0.fieldName !== this.endX.fieldName && this.startPosition0.direction === 'right') {  // 防止连接在同一个点
                  this.lineDatas.push({
                  startPoint:[this.startPosition0,this.startPosition1], endPoint:[this.endX, this.endY],
                  data: {from: this.startPosition0.fieldName,to: this.endX.fieldName}
                  });
              }
              // 如果线段起点是bottom,不管箭头靠近哪个方位，都会自动连接到top
              if (this.startPosition0.fieldName !== this.endX.fieldName && this.startPosition0.direction === 'bottom') {  
                  this.lineDatas.push({
                  startPoint:[this.startPosition0,this.startPosition1], 
                  endPoint:[
                    {locating: topX, fieldName: item.fieldName, direction: "top",style:{width:item.styles.width,height:item.styles.height},lineAttr: {direction:'to',color:'green',width:2,shadowColor:`rgba(0,0,0,0.5)`}},
                    {locating: topY, fieldName: item.fieldName, direction: "top",lineAttr: 'to'}],
                  data: {from: this.startPosition0.fieldName,to: this.endX.fieldName}
                  });
              }
              // 如果线段起点是left,不管箭头靠近哪个方位，都会自动连接到right
              if (this.startPosition0.fieldName !== this.endX.fieldName && this.startPosition0.direction === 'top') {
                  this.lineDatas.push(
                    {
                      startPoint:[this.startPosition0,this.startPosition1], 
                      endPoint:[
                      {locating: bottomX, fieldName: item.fieldName, direction: "bottom",style:{width:item.styles.width,height:item.styles.height},lineAttr: {direction:'to',color:'green',width:2,shadowColor:`rgba(0,0,0,0.5)`}},
                      {locating: bottomY, fieldName: item.fieldName, direction: "bottom",lineAttr: 'to'}
                      ],
                      data: {from: this.startPosition0.fieldName,to: this.endX.fieldName}
                    }
                    );
              }
          } else if ( ( ( pBottomR[1] - position.y <=parseInt(item.styles.height) && position.y - pTopR[1]<= parseInt(item.styles.height) ) &&
                        (position.x - pBottomR[0] >=10 && position.x - pBottomR[0] <= Math.sqrt(Math.pow(parseInt(item.styles.height)/2,2)+100)) &&
                      (position.x - pTopR[0] >=10 && position.x - pTopR[0] <= Math.sqrt(Math.pow(parseInt(item.styles.height)/2,2)+100)) )){
              this.endX = {locating: rightX, fieldName: item.fieldName, direction: "right",style:{width:item.styles.width,height:item.styles.height},lineAttr: {direction:'to',color:'green',width:2,shadowColor:`rgba(0,0,0,0.5)`}} //[rightX, item.fieldName,"right"]; 
              this.endY = {locating: rightY, fieldName: item.fieldName, direction: "right",lineAttr: 'to'} //[rightY, item.fieldName,"right"];
              this.drawArrow(this.startPosition0.locating,this.startPosition1.locating,rightX,rightY)
              // 绘制右结束点箭头
              if (this.startPosition0.fieldName !== this.endX.fieldName && this.startPosition0.direction === 'left') {
                  this.lineDatas.push({
                  startPoint:[this.startPosition0,this.startPosition1], endPoint:[this.endX, this.endY],
                  data: {from: this.startPosition0.fieldName,to: this.endX.fieldName}
                });
              }
               // 如果线段起点是right,不管箭头靠近哪个方位，都会自动连接到left
              if (this.startPosition0.fieldName !== this.endX.fieldName && this.startPosition0.direction === 'right') {
                  this.lineDatas.push(
                    {
                      startPoint:[this.startPosition0,this.startPosition1], 
                      endPoint:[
                        {locating: leftX, fieldName: item.fieldName, direction: "left",style:{width:item.styles.width,height:item.styles.height},lineAttr: {direction:'to',color:'green',width:2,shadowColor:`rgba(0,0,0,0.5)`}},
                        {locating: leftY, fieldName: item.fieldName, direction: "left",lineAttr: 'to'} 
                      ],
                      data: {from: this.startPosition0.fieldName,to: this.endX.fieldName}
                    }
                    );
              }
              // 如果线段起点是bottom,不管箭头靠近哪个方位，都会自动连接到top
              if (this.startPosition0.fieldName !== this.endX.fieldName && this.startPosition0.direction === 'bottom') {  
                  this.lineDatas.push({
                  startPoint:[this.startPosition0,this.startPosition1], 
                  endPoint:[
                    {locating: topX, fieldName: item.fieldName, direction: "top",style:{width:item.styles.width,height:item.styles.height},lineAttr: {direction:'to',color:'green',width:2,shadowColor:`rgba(0,0,0,0.5)`}},
                    {locating: topY, fieldName: item.fieldName, direction: "top",lineAttr: 'to'}],
                  data: {from: this.startPosition0.fieldName,to: this.endX.fieldName}
                  });
              }
               // 如果线段起点是left,不管箭头靠近哪个方位，都会自动连接到right
               if (this.startPosition0.fieldName !== this.endX.fieldName && this.startPosition0.direction === 'top') {
                  this.lineDatas.push(
                    {
                      startPoint:[this.startPosition0,this.startPosition1], 
                      endPoint:[
                      {locating: bottomX, fieldName: item.fieldName, direction: "bottom",style:{width:item.styles.width,height:item.styles.height},lineAttr: {direction:'to',color:'green',width:2,shadowColor:`rgba(0,0,0,0.5)`}},
                      {locating: bottomY, fieldName: item.fieldName, direction: "bottom",lineAttr: 'to'}
                      ],
                      data: {from: this.startPosition0.fieldName,to: this.endX.fieldName}
                    }
                    );
              }
          } else if ( ( pBottomR[0] - position.x <=parseInt(item.styles.width) && position.x - pBottomL[0]<= parseInt(item.styles.width) ) &&
                        (position.y - pBottomL[1] >=10 && position.y - pBottomL[1] <= Math.sqrt(Math.pow(parseInt(item.styles.width)/2,2)+100)) &&
                      (position.y - pBottomR[1] >=10 && position.y - pBottomR[1] <= Math.sqrt(Math.pow(parseInt(item.styles.width)/2,2)+100)) ){
              this.endX = {locating: bottomX, fieldName: item.fieldName, direction: "bottom",style:{width:item.styles.width,height:item.styles.height},lineAttr: {direction:'to',color:'green',width:2,shadowColor:`rgba(0,0,0,0.5)`}} //[bottomX, item.fieldName,"bottom"]; 
              this.endY = {locating: bottomY, fieldName: item.fieldName, direction: "bottom",lineAttr: 'to'} //[bottomY, item.fieldName,"bottom"];
              this.drawArrow(this.startPosition0.locating,this.startPosition1.locating,bottomX,bottomY)
              // 绘制底部结束点箭头
              if (this.startPosition0.fieldName !== this.endX.fieldName && this.startPosition0.direction === 'top') {
                  this.lineDatas.push({
                  startPoint:[this.startPosition0,this.startPosition1], endPoint:[this.endX, this.endY],
                  data: {from: this.startPosition0.fieldName,to: this.endX.fieldName}
                });
              }
              // 如果线段起点是right,不管箭头靠近哪个方位，都会自动连接到left
              if (this.startPosition0.fieldName !== this.endX.fieldName && this.startPosition0.direction === 'right') {
                  this.lineDatas.push(
                    {
                      startPoint:[this.startPosition0,this.startPosition1], 
                      endPoint:[
                        {locating: leftX, fieldName: item.fieldName, direction: "left",style:{width:item.styles.width,height:item.styles.height},lineAttr: {direction:'to',color:'green',width:2,shadowColor:`rgba(0,0,0,0.5)`}},
                        {locating: leftY, fieldName: item.fieldName, direction: "left",lineAttr: 'to'} 
                      ],
                      data: {from: this.startPosition0.fieldName,to: this.endX.fieldName}
                    }
                    );
              }
              // 如果线段起点是left,不管箭头靠近哪个方位，都会自动连接到right
              if (this.startPosition0.fieldName !== this.endX.fieldName && this.startPosition0.direction === 'left') {
                  this.lineDatas.push(
                    {
                      startPoint:[this.startPosition0,this.startPosition1], 
                      endPoint:[
                      {locating: rightX, fieldName: item.fieldName, direction: "right",style:{width:item.styles.width,height:item.styles.height},lineAttr: {direction:'to',color:'green',width:2,shadowColor:`rgba(0,0,0,0.5)`}},
                      {locating: rightY, fieldName: item.fieldName, direction: "right",lineAttr: 'to'}
                      ],
                      data: {from: this.startPosition0.fieldName,to: this.endX.fieldName}
                    }
                    );
              }
          } else if ( ( pTopR[0] - position.x <=parseInt(item.styles.width) && position.x - pTopL[0]<= parseInt(item.styles.width) ) &&
                        (pTopL[1] - position.y>=10 && pTopL[1] - position.y <= Math.sqrt(Math.pow(parseInt(item.styles.width)/2,2)+100)) &&
                      (pTopR[1] - position.y >=10 && pTopR[1] - position.y <= Math.sqrt(Math.pow(parseInt(item.styles.width)/2,2)+100)) ){
              this.endX = {locating: topX, fieldName: item.fieldName, direction: "top",style:{width:item.styles.width,height:item.styles.height},lineAttr: {direction:'to',color:'green',width:2,shadowColor:`rgba(0,0,0,0.5)`}} //[bottomX, item.fieldName,"bottom"]; 
              this.endY = {locating: topY, fieldName: item.fieldName, direction: "top",lineAttr: 'to'} //[bottomY, item.fieldName,"bottom"];
              this.drawArrow(this.startPosition0.locating,this.startPosition1.locating,topX,topY)
              // 绘制顶部结束点箭头
              if (this.startPosition0.fieldName !== this.endX.fieldName && this.startPosition0.direction === 'bottom') {
                  this.lineDatas.push({
                  startPoint:[this.startPosition0,this.startPosition1], endPoint:[this.endX, this.endY],
                  data: {from: this.startPosition0.fieldName,to: this.endX.fieldName}
                });
              }
               // 如果线段起点是right,不管箭头靠近哪个方位，都会自动连接到left
              if (this.startPosition0.fieldName !== this.endX.fieldName && this.startPosition0.direction === 'right') {
                  this.lineDatas.push(
                    {
                      startPoint:[this.startPosition0,this.startPosition1], 
                      endPoint:[
                        {locating: leftX, fieldName: item.fieldName, direction: "left",style:{width:item.styles.width,height:item.styles.height},lineAttr: {direction:'to',color:'green',width:2,shadowColor:`rgba(0,0,0,0.5)`}},
                        {locating: leftY, fieldName: item.fieldName, direction: "left",lineAttr: 'to'} 
                      ],
                      data: {from: this.startPosition0.fieldName,to: this.endX.fieldName}
                    }
                    );
              }
              // 如果线段起点是left,不管箭头靠近哪个方位，都会自动连接到right
              if (this.startPosition0.fieldName !== this.endX.fieldName && this.startPosition0.direction === 'left') {
                  this.lineDatas.push(
                    {
                      startPoint:[this.startPosition0,this.startPosition1], 
                      endPoint:[
                      {locating: rightX, fieldName: item.fieldName, direction: "right",style:{width:item.styles.width,height:item.styles.height},lineAttr: {direction:'to',color:'green',width:2,shadowColor:`rgba(0,0,0,0.5)`}},
                      {locating: rightY, fieldName: item.fieldName, direction: "right",lineAttr: 'to'}
                      ],
                      data: {from: this.startPosition0.fieldName,to: this.endX.fieldName}
                    }
                    );
              }
        }
      })
      let newArr = [];
      this.lineDatas.forEach(item => { 
        for(let key in item.data) {
          newArr.push(item.data[key]);
        }
      });
      this.componentDataProcess.map(item => { 
        if(newArr.indexOf(item.fieldName) === -1) {
          item.line = false
        } else {
          item.line = true
        }
        return item;
      })

      this.canvasLine.style.cursor = this.getCursorStyle(); 
      this.canMouseMoveLineConnect = false;
      this.isMouseDraw = false;
      // this.canvasLine.removeEventListener('mousemove',this.mouseMoveEvent);
      // 重新绘制所有线，包括新添加的线
      this.redrawCanvas(this.lineDatas);
    },
    mouseOutEvent(e) {
      this.canMouseMoveLineConnect = false;
      this.isMouseDraw = false;
    },
    // 鼠标移动到线上线变粗
    mouseMoveLineEvent(e) {
      const position = this.getCanvasPosition(e);
        this.lineDatas.map((line, index) => {
          const startX = line.startPoint[0].locating;
          const startY = line.startPoint[1].locating;
          const endX = line.endPoint[0].locating;
          const endY = line.endPoint[1].locating;
          // 使用距离判断来检测是否点击在线上
          const distance = this.distanceToLine(startX, startY, endX, endY, position.x, position.y);
          if (distance < 5) { // 5 是一个阈值，可以根据需要调整
            return line.startPoint[0].lineAttr.width = 5, line.startPoint[0].lineAttr.shadowColor = 'rgba(0,0,0,0.5)';
          } else {
            return line.startPoint[0].lineAttr.width = 3, line.startPoint[0].lineAttr.shadowColor = 'transparent';
          }
        });
    },
    // 绘制矩形
    drawRect(x,y,w,h,color) {
      this.ctx.beginPath();
      this.ctx.fillStyle = color; // 设置填充颜色
      this.ctx.fillRect(x, y, w, h); // 创建一个矩形，x, y是矩形左上角的坐标，w,h分别是宽和高。
      this.ctx.fill(); // 填充圆形
    },
    // 绘制箭头
    drawArrow(x1,y1, x2, y2) {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const headLength = 10;
      const headAngle = Math.PI / 6;

      const arrowHead1 = {
        x: x2 - headLength * Math.cos(angle - headAngle),
        y: y2 - headLength * Math.sin(angle - headAngle)
      };
      const arrowHead2 = {
        x: x2 - headLength * Math.cos(angle + headAngle),
        y: y2 - headLength * Math.sin(angle + headAngle)
      };

      this.ctx.beginPath();
      this.ctx.moveTo(x2, y2);
      this.ctx.lineTo(arrowHead1.x, arrowHead1.y);
      this.ctx.lineTo(arrowHead2.x, arrowHead2.y);
      this.ctx.closePath(); // 闭合路径形成三角形
      this.ctx.fillStyle = 'green'; // 设置填充颜色
      this.ctx.fill(); // 实心填充
    },
    //  根据保存好的数据lineDatas绘制线体
    canvasDraw(lines,x,y) {
      this.ctx.save();
      this.$store.commit('app/SET_LINES_DATA',lines);
      if(!lines) {
          return;
      }
      lines.forEach((item,i) => {
          this.ctx.beginPath();
          /******************设置阴影效果**********************/ 
          // this.ctx.shadowColor = item.startPoint[0].lineAttr.shadowColor; //'rgba(0, 0, 0, 0.5)';  // 阴影颜色
          // this.ctx.shadowBlur = 10;  // 阴影模糊度
          // this.ctx.shadowOffsetX = 5;  // 阴影的X轴偏移
          // this.ctx.shadowOffsetY = 0;  // 阴影的Y轴偏移
          this.ctx.strokeStyle = item.startPoint[0].lineAttr.color;
          this.ctx.lineWidth = item.startPoint[0].lineAttr.width;
          //  绘制线段
          this.ctx.moveTo(item.startPoint[0].locating,item.startPoint[1].locating);
          // 根据位置判断线段弯曲折行方向
          switch (item.startPoint[0].direction) {
            case "right":
              // this.ctx.lineTo(item.startPoint[0].locating + (item.endPoint[0].locating - item.startPoint[0].locating)/2, item.startPoint[1].locating)
              // this.ctx.lineTo(item.startPoint[0].locating + (item.endPoint[0].locating - item.startPoint[0].locating)/2, item.endPoint[1].locating)
              // 使用arcTo绘制弯曲角
              this.ctx.arcTo(
                    item.startPoint[0].locating + (item.endPoint[0].locating - item.startPoint[0].locating)/2, 
                    item.startPoint[1].locating,
                    item.startPoint[0].locating + (item.endPoint[0].locating - item.startPoint[0].locating)/2, 
                    item.endPoint[1].locating,
                    5); // 最后参数是圆角半径radius
              this.ctx.arcTo(
                    item.startPoint[0].locating + (item.endPoint[0].locating - item.startPoint[0].locating)/2, 
                    item.endPoint[1].locating,
                    item.endPoint[0].locating,item.endPoint[1].locating,
                    5);
            break;
            case "left":
              // this.ctx.lineTo(item.startPoint[0].locating - (item.startPoint[0].locating - item.endPoint[0].locating)/2, item.startPoint[1].locating)
              // this.ctx.lineTo(item.startPoint[0].locating - (item.startPoint[0].locating - item.endPoint[0].locating)/2, item.endPoint[1].locating)
              this.ctx.arcTo(
                  item.startPoint[0].locating - (item.startPoint[0].locating - item.endPoint[0].locating)/2, item.startPoint[1].locating,
                  item.startPoint[0].locating - (item.startPoint[0].locating - item.endPoint[0].locating)/2, item.endPoint[1].locating,
                  5);
              this.ctx.arcTo(
                  item.startPoint[0].locating - (item.startPoint[0].locating - item.endPoint[0].locating)/2, item.endPoint[1].locating,
                  item.endPoint[0].locating,item.endPoint[1].locating,
                  5);
            break;
            case "top":
              // this.ctx.lineTo(item.startPoint[0].locating, item.startPoint[1].locating - (item.startPoint[1].locating - item.endPoint[1].locating)/2)
              // this.ctx.lineTo(item.endPoint[0].locating, item.startPoint[1].locating + (item.endPoint[1].locating - item.startPoint[1].locating)/2)
              this.ctx.arcTo(
                  item.startPoint[0].locating, item.startPoint[1].locating - (item.startPoint[1].locating - item.endPoint[1].locating)/2,
                  item.endPoint[0].locating, item.startPoint[1].locating + (item.endPoint[1].locating - item.startPoint[1].locating)/2,
                  5);
              this.ctx.arcTo(
                  item.endPoint[0].locating, item.startPoint[1].locating + (item.endPoint[1].locating - item.startPoint[1].locating)/2,
                  item.endPoint[0].locating,item.endPoint[1].locating,
                  5);
            break;
            case "bottom":
              // this.ctx.lineTo(item.startPoint[0].locating, item.startPoint[1].locating + (item.endPoint[1].locating - item.startPoint[1].locating)/2)
              // this.ctx.lineTo(item.startPoint[0].locating - (item.startPoint[0].locating - item.endPoint[0].locating), item.startPoint[1].locating + (item.endPoint[1].locating - item.startPoint[1].locating)/2)
              this.ctx.arcTo(
                  item.startPoint[0].locating, item.startPoint[1].locating + (item.endPoint[1].locating - item.startPoint[1].locating)/2,
                  item.startPoint[0].locating - (item.startPoint[0].locating - item.endPoint[0].locating), item.startPoint[1].locating + (item.endPoint[1].locating - item.startPoint[1].locating)/2,
                  5);
              this.ctx.arcTo(
                  item.startPoint[0].locating - (item.startPoint[0].locating - item.endPoint[0].locating), item.startPoint[1].locating + (item.endPoint[1].locating - item.startPoint[1].locating)/2,
                  item.endPoint[0].locating,item.endPoint[1].locating,
                  5);
            break;
            default:
            break;
          }
          this.ctx.lineTo(item.endPoint[0].locating,item.endPoint[1].locating);
          this.ctx.stroke();
          switch (item.startPoint[0].direction) {  // 结束点箭头优化
            case "right":
              this.drawArrow(item.startPoint[0].locating + (item.endPoint[0].locating - item.startPoint[0].locating)/2, 
                             item.endPoint[1].locating,item.endPoint[0].locating,item.endPoint[1].locating)
            break;
            case "left":
              this.drawArrow(item.startPoint[0].locating - (item.startPoint[0].locating - item.endPoint[0].locating)/2, item.endPoint[1].locating,
                             item.endPoint[0].locating,item.endPoint[1].locating)
            break;
            case "top":
            this.drawArrow(item.endPoint[0].locating, item.startPoint[1].locating + (item.endPoint[1].locating - item.startPoint[1].locating)/2,
                          item.endPoint[0].locating,item.endPoint[1].locating)
            break;
            case "bottom":
            this.drawArrow(item.startPoint[0].locating - (item.startPoint[0].locating - item.endPoint[0].locating), item.startPoint[1].locating + (item.endPoint[1].locating - item.startPoint[1].locating)/2,
                          item.endPoint[0].locating,item.endPoint[1].locating)
            break;
            default:
            break;
          }    
      }) 
      this.ctx.closePath();
      // requestAnimationFrame(this.canvasDraw(lines));   
      this.ctx.restore();   
    },
  // 鼠标移动后箭头方向设置
  drawArrowDirection(x1,y1,x2,y2,position) { 
          switch (x1.direction) {
            case "right":
              this.drawArrow(x1.locating + (position.x - x1.locating)/2,position.y,x2,y2)
            break;
            case "left":
              this.drawArrow(x1.locating - (x1.locating - position.x)/2,position.y,x2,y2)
            break;
            case "top":
              this.drawArrow(position.x,x1.locating+(position.y - y1.locating)/2,x2,y2)
            break;
            case "bottom":
              this.drawArrow(position.x,y1.locating+(position.y - y1.locating)/2,x2,y2)
            break;
            default:
            break;
          }    
  },
  drawLines(lines, progress) {
    lines.forEach((item, i) => {
      this.ctx.beginPath();
      // 设置阴影效果
      // this.ctx.shadowColor = item.startPoint[0].lineAttr.shadowColor; // 'rgba(0, 0, 0, 0.5)';  // 阴影颜色
      // this.ctx.shadowBlur = 10; // 阴影模糊度
      // this.ctx.shadowOffsetX = 5; // 阴影的X轴偏移
      // this.ctx.shadowOffsetY = 0; // 阴影的Y轴偏移
      this.ctx.strokeStyle = item.startPoint[0].lineAttr.color;
      this.ctx.lineWidth = item.startPoint[0].lineAttr.width;
      // 绘制线段
      const startX = item.startPoint[0].locating;
      const startY = item.startPoint[1].locating;
      const endX = item.endPoint[0].locating;
      const endY = item.endPoint[1].locating;
      const dx = endX - startX;
      const dy = endY - startY;
      const length = Math.sqrt(dx * dx + dy * dy);
      const offset = (progress % length) - length;
      for (let i = offset; i < length; i += 20) {
        const t = i / length;
        const x = startX + dx * t;
        const y = startY + dy * t;
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + dx * 0.05, y + dy * 0.05);
      }
      this.ctx.stroke();
      this.drawArrow(startX, startY, endX, endY);
    });
  },
  handleLineClick(e) {
      const position = this.getCanvasPosition(e);
      this.lineDatas.map((line, index) => {
        const startX = line.startPoint[0].locating;
        const startY = line.startPoint[1].locating;
        const endX = line.endPoint[0].locating;
        const endY = line.endPoint[1].locating;
        // 使用距离判断来检测是否点击在线上
        const distance = this.distanceToLine(startX, startY, endX, endY, position.x, position.y);
        if (distance < 5) { // 5 是一个阈值，可以根据需要调整
          return line.startPoint[0].lineAttr.color = 'deepskyblue';
        } else {
          return line.startPoint[0].lineAttr.color = 'green';
        }
      });
    },
  getCanvasPosition(e) {
      const rect = this.canvasLine.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,  // 事件被触发时鼠标指针相对于浏览器页面的坐标 减去相对偏移量获取鼠标指针相对于canvas的坐标
        y: e.clientY - rect.top,
      };
    },
  distanceToLine(x1, y1, x2, y2, x, y) {
      const A = x - x1; // 鼠标点到线段起点的x分量
      const B = y - y1; // 鼠标点到线段起点的y分量
      const C = x2 - x1; // 线段的x分量
      const D = y2 - y1; // 线段的y分量

      const dot = A * C + B * D; // 向量 (A, B) 和 (C, D) 的点积
      const len_sq = C * C + D * D; // 线段长度的平方
      const param = (len_sq !== 0) ? dot / len_sq : -1; // 鼠标点在投影方向上的归一化位置

      let xx, yy; // 投影点的坐标
      if (param < 0) {
        xx = x1; // 鼠标点投影在线段起点左侧
        yy = y1;
      } else if (param > 1) {
        xx = x2; // 鼠标点投影在线段终点右侧
        yy = y2;
      } else {
        xx = x1 + param * C; // 鼠标点投影在线段上
        yy = y1 + param * D;
      }
      const dx = x - xx; // 鼠标点到投影点的x分量
      const dy = y - yy; // 鼠标点到投影点的y分量
      return Math.sqrt(dx * dx + dy * dy); // 返回鼠标点到线段的最短距离
    },
  // 根据调整点类型返回光标样式
  getCursorStyle(type) {
    switch (type) {
      case 'top-left':
        return 'nw-resize';
      case 'top':
        return 'n-resize';
      case 'top-right':
        return 'ne-resize';
      case 'right':
        return 'e-resize';
      case 'bottom-right':
        return 'se-resize';
      case 'bottom':
        return 's-resize';
      case 'bottom-left':
        return 'sw-resize';
      case 'left':
        return 'w-resize';
      case 'pullLines':
        return 'pointer';
      default:
        return 'default';
    }
  },
  // 节点单机事件
  onCanvasClick(event) {
      if(event.altKey) return;
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.scale;  // 缩放比例
      const scaleY = this.scale;
      const offsetX = this.contentOffsetX || 0; 
      const offsetY = this.contentOffsetY || 0;
      const mouseX = (event.clientX - rect.left - offsetX) / scaleX;
      const mouseY = (event.clientY - rect.top - offsetY) / scaleY;
      this.selectElementByPosition(mouseX, mouseY);

      let selItem = this.onselectElementByPosition(mouseX, mouseY);
      if (selItem) {
        this.$bus.$emit('compFocusId', selItem.component + '-' + selItem.id)
        let attributeObj = {
          compId: selItem.component + '-' + selItem.id,
          component: selItem,
          data: {
            comPname: selItem.component,
            id: selItem.id,
            ...selItem.attribute,
          },
        }

        this.$bus.$emit('attributeDataProcess', attributeObj)
        let obj = {
          compId: selItem.component + '-' + selItem.id,
          data: {
            ...selItem.styles,
            // left: this.$el.style.left,
            // top: this.$el.style.top,
          }
        }
        this.$bus.$emit('styleData', obj)      
      }
      
    },
    // 节点双击事件
    onCanvasDbClick(event) {
      // if(event.altKey) return;
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.scale;  // 缩放比例
      const scaleY = this.scale;
      const offsetX = this.contentOffsetX || 0; 
      const offsetY = this.contentOffsetY || 0;
      const x = (event.clientX - rect.left - offsetX) / scaleX;
      const y = (event.clientY - rect.top - offsetY) / scaleY;
      const handleSize = this.handledotsSize;
      const handleOffset = this.handledotsOffset; // 选中点的偏移量
      // 反向遍历，优先选中顶层元素
      for (let i = this.componentDataProcess.length - 1; i >= 0; i--) {
        const item = this.componentDataProcess[i];
        const { left, top, width, height } = item.styles;
        const itemX = parseFloat(left) || 0;
        const itemY = parseFloat(top) || 0;
        const itemW = parseFloat(width) || 0;
        const itemH = parseFloat(height) || 0;
        const expandedX = itemX - handleSize - handleOffset;
        const expandedY = itemY - handleSize - handleOffset;
        const expandedWidth = itemW + handleSize * 2 + handleOffset * 2;
        const expandedHeight = itemH + handleSize * 2 + handleOffset * 2;
        if (
          x >= expandedX &&
          x <= expandedX + expandedWidth &&
          y >= expandedY &&
          y <= expandedY + expandedHeight
        ) {
          let chartFlowData = this.processFlowNodeArr
          let row = {}, rowId = "";
          chartFlowData.forEach((nodeItem) => {
                  if (nodeItem.processCode === item.attribute.nodeLabel) { // split(" ")[1].replace(/\[|\]/g, '')
                    row = nodeItem;
                    rowId = nodeItem.id;
                  }
                });
          this.handlerEvent('dbClick',item,this.tableRowInfo,row)
          break;
        }
      }
      
    },
    selectElementByPosition(x, y) {
      // 清除所有元素的选中状态
      this.componentDataProcess.forEach(item => {
        item['isSelected'] = false;
      });
      const handleSize = this.handledotsSize;
      const handleOffset = this.handledotsOffset; // 选中点的偏移量
      let selectedItem = null;

      // 反向遍历，优先选中顶层元素
      for (let i = this.componentDataProcess.length - 1; i >= 0; i--) {
        const item = this.componentDataProcess[i];
        const { left, top, width, height } = item.styles;
        const itemX = parseFloat(left) || 0;
        const itemY = parseFloat(top) || 0;
        const itemW = parseFloat(width) || 0;
        const itemH = parseFloat(height) || 0;
        const expandedX = itemX - handleSize - handleOffset;
        const expandedY = itemY - handleSize - handleOffset;
        const expandedWidth = itemW + handleSize * 2 + handleOffset * 2;
        const expandedHeight = itemH + handleSize * 2 + handleOffset * 2;
        if (
          x >= expandedX &&
          x <= expandedX + expandedWidth &&
          y >= expandedY &&
          y <= expandedY + expandedHeight
        ) {
          selectedItem = item;
          this.componentDataProcess[i].isSelected = true; // 设置选中状态
          break;
        }
      }

      // 设置选中状态
      // if (selectedItem) {
        // selectedItem.isSelected = true;
      // }
      // 触发重绘
      this.redrawCanvas(this.lineDatas);
    },
    onselectElementByPosition(x, y) {
      let selectedItem = null;
      const handleSize = this.handledotsSize;
      const handleOffset = this.handledotsOffset; // 选中点的偏移量
      // 反向遍历，优先选中顶层元素
      for (let i = this.componentDataProcess.length - 1; i >= 0; i--) {
        const item = this.componentDataProcess[i];
        const { left, top, width, height } = item.styles;
        const itemX = parseFloat(left) || 0;
        const itemY = parseFloat(top) || 0;
        const itemW = parseFloat(width) || 0;
        const itemH = parseFloat(height) || 0;
        const expandedX = itemX - handleSize - handleOffset;
        const expandedY = itemY - handleSize - handleOffset;
        const expandedWidth = itemW + handleSize * 2 + handleOffset * 2;
        const expandedHeight = itemH + handleSize * 2 + handleOffset * 2;
        if (
          x >= expandedX &&
          x <= expandedX + expandedWidth &&
          y >= expandedY &&
          y <= expandedY + expandedHeight
        ) {
          selectedItem = item;
          
         return selectedItem;
          // break;
        }
      }
    },
    onCanvasContextmenuNode(event){
      event.stopPropagation()
      event.preventDefault();
      let _this = this
      this.canvas = document.getElementById("testcanvas1")
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.scale;  // 缩放比例
      const scaleY = this.scale;
      const offsetX = this.contentOffsetX || 0; 
      const offsetY = this.contentOffsetY || 0;
      const mouseX = (event.clientX - rect.left - offsetX) / scaleX;
      const mouseY = (event.clientY - rect.top - offsetY) / scaleY;
      let selectedItem = this.onselectElementByPosition(mouseX, mouseY);
      
      if (selectedItem && selectedItem.isSelected) {
       _this.openSvgMenu(event,selectedItem)
      }else{
        _this.onContextmenu(event)
      }

    },
    // 鼠标按下监听事件
    onCanvasMouseDown(event) {
      let _this = this
      this.canvas = document.getElementById("testcanvas1")
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.scale;  // 缩放比例
      const scaleY = this.scale;
      const offsetX = this.contentOffsetX || 0; 
      const offsetY = this.contentOffsetY || 0;
      let dragOffsetX = 0;
      let dragOffsetY = 0;
      const mouseX = (event.clientX - rect.left - offsetX) / scaleX;
      const mouseY = (event.clientY - rect.top - offsetY) / scaleY;
      let selItem = this.onselectElementByPosition(mouseX, mouseY);
      let selectedHandle = null;
      let selectedItem = this.onselectElementByPosition(mouseX, mouseY);
      let tselectedItems = _this.componentDataProcess.filter(item => item.isSelected === true);
      let selectedItems = tselectedItems.map(item => {
        const left = parseFloat(item.styles.left) || 0;
        const top = parseFloat(item.styles.top) || 0;

        return {
          item,
          startX: left,
          startY: top,
          offsetX: mouseX - left, // 记录鼠标与元素左上角的偏移
          offsetY: mouseY - top
        };
      });
      if (selectedItem && selectedItem.isSelected && selectedItem.handles) {
        const handles = selectedItem.handles;
        const handleSize = this.handledotsSize; // 调整点半径

        for (let i = 0; i < handles.length; i++) {
          let handle = handles[i];
          let selectedItemLeft = selectedItem.styles.left || 0;
          let selectedItemTop = selectedItem.styles.top || 0;
          const dx = mouseX - (handle.x + parseFloat(selectedItemLeft.replace('px', '')))
          const dy = mouseY - (handle.y + parseFloat(selectedItemTop.replace('px', ''))) 
          if (Math.sqrt(dx * dx + dy * dy) <= handleSize) {
            selectedHandle = handle;
            break;
          }
        }
      }
      if (selectedHandle && selectedItem) {
        selectedItem.isSelected = true; // 显式设置选中状态
        this.selectedHandle = selectedHandle;
        this.selectedItem = selectedItem;
        this.startHandleDrag(mouseX, mouseY);
        this.canvas.addEventListener('mousemove', onMouseMoveHandle);
        this.canvas.addEventListener('mouseup', MouseUpHandle);
        
      }
       // 鼠标左键
       if (event.button === 0 && selItem && !selectedHandle) {
        // 记录鼠标按下时，鼠标的位置
        // this.mouseDownOffsetX = event.x;
        const elementLeft = parseFloat(selItem.styles.left) || 0;
        const elementTop = parseFloat(selItem.styles.top) || 0;
        dragOffsetX = mouseX - elementLeft;
        dragOffsetY = mouseY - elementTop;
        this.canvas.addEventListener('mousemove', onMouseMoveDraw);
        this.canvas.addEventListener('mouseup', onMouseUp);
      }
      // 鼠标按下后节点附近出现连接线
      if (_this.componentDataProcess.length > 0) {
                        // 连接线单机事件
                        this.handleLineClick(event);
                        const currentTime = new Date().getTime();
                        if (currentTime - this.lastClickTime < 300) {
                          // 连接线双击事件
                          this.handleDbLineClick(event)
                        }
                        this.lastClickTime = currentTime;
                        let newVal = _this.componentDataProcess;
                        const position = _this.getCanvasPosition(event);
                        _this.ctx.strokeStyle = "green";
                        _this.ctx.lineWidth = 2;
                        newVal.forEach((item,i) => {
                            let topX = parseInt(item.styles.left) + parseInt(item.styles.width)/2, topY = parseInt(item.styles.top);
                            let rightX = parseInt(item.styles.left) + parseInt(item.styles.width), rightY = parseInt(item.styles.top) + parseInt(item.styles.height)/2;
                            let bottomX = parseInt(item.styles.left) + parseInt(item.styles.width)/2, bottomY = parseInt(item.styles.top) + parseInt(item.styles.height);
                            let leftX = parseInt(item.styles.left), leftY = parseInt(item.styles.top) + parseInt(item.styles.height)/2;
                            // 鼠标靠近节点出现红色矩形就可以画线或连线 
                            let pTopL = [parseInt(item.styles.left), parseInt(item.styles.top)],
                                pTopR = [parseInt(item.styles.left) + parseInt(item.styles.width), parseInt(item.styles.top)];
                            let pBottomL = [parseInt(item.styles.left), parseInt(item.styles.top) + parseInt(item.styles.height)],
                                pBottomR = [parseInt(item.styles.left) + parseInt(item.styles.width), parseInt(item.styles.top) + parseInt(item.styles.height)];
                            if ( ( pBottomR[1] - position.y <=parseInt(item.styles.height) && position.y - pTopR[1]<= parseInt(item.styles.height) ) &&
                              (position.x - pBottomR[0] >=10 && position.x - pBottomR[0] <= Math.sqrt(Math.pow(parseInt(item.styles.height)/2,2)+100)) &&
                            (position.x - pTopR[0] >=10 && position.x - pTopR[0] <= Math.sqrt(Math.pow(parseInt(item.styles.height)/2,2)+100)) )
                            {
                                // 绘制右起点圆点
                                _this.startPosition0 = { locating: rightX, fieldName: item.fieldName,
                                  style:{width:item.styles.width,height:item.styles.height}, direction: "right",lineAttr: {direction:'from',color:'green',width:2,shadowColor:`rgba(0,0,0,0.5)`} } //[rightX, item.fieldName,'right']
                                _this.startPosition1 = {locating: rightY, fieldName: item.fieldName, direction: "right",lineAttr: 'from'} //[rightY, item.fieldName,'right']
                                _this.isMouseDraw = true
                                _this.mouseToDrawLines(_this.ctx,_this.startPosition0.locating,_this.startPosition1.locating,position.x, position.y)
                                // this.ctx.lineTo(this.startPosition0.locating,this.startPosition1.locating+(parseInt(position.y) - this.startPosition1.locating) /2)
                                // this.ctx.lineTo(this.startPosition0.locating- 150,this.startPosition1.locating+(parseInt(position.y) - this.startPosition1.locating)/2)
                            } else if (
                              ( pBottomL[1] - position.y <=parseInt(item.styles.height) && position.y - pTopL[1]<= parseInt(item.styles.height) ) &&
                              (pBottomL[0]  - position.x>=10 && pBottomL[0]  - position.x<= Math.sqrt(Math.pow(parseInt(item.styles.height)/2,2)+100)) &&
                            (pTopL[0]  - position.x>=10 && pTopL[0]  - position.x <= Math.sqrt(Math.pow(parseInt(item.styles.height)/2,2)+100))
                            ) {
                                // 绘制左起点圆点
                                _this.startPosition0 = {locating: leftX, fieldName: item.fieldName, direction: "left",style:{width:item.styles.width,height:item.styles.height},lineAttr:  {direction:'from',color:'green',width:2,shadowColor:`rgba(0,0,0,0.5)`}} //[leftX, item.fieldName,"left"]
                                _this.startPosition1 = {locating: leftY, fieldName: item.fieldName, direction: "left",lineAttr: 'from'} //[leftY, item.fieldName,"left"]
                                _this.isMouseDraw = true
                                _this.mouseToDrawLines(_this.ctx,_this.startPosition0.locating,_this.startPosition1.locating)
                            } else if ( ( pBottomR[0] - position.x <=parseInt(item.styles.width) && position.x - pBottomL[0]<= parseInt(item.styles.width) ) &&
                              (position.y - pBottomL[1] >=10 && position.y - pBottomL[1] <= Math.sqrt(Math.pow(parseInt(item.styles.width)/2,2)+100)) &&
                            (position.y - pBottomR[1] >=10 && position.y - pBottomR[1] <= Math.sqrt(Math.pow(parseInt(item.styles.width)/2,2)+100)) ) {
                                // 绘制底部起点圆点
                                _this.startPosition0 = {locating: bottomX, fieldName: item.fieldName, direction: "bottom",style:{width:item.styles.width,height:item.styles.height},lineAttr:  {direction:'from',color:'green',width:2,shadowColor:`rgba(0,0,0,0.5)`}} //[bottomX, item.fieldName,"bottom"]
                                _this.startPosition1 = {locating: bottomY, fieldName: item.fieldName, direction: "bottom",lineAttr: 'from'} //[bottomY, item.fieldName,"bottom"]
                                _this.isMouseDraw = true
                                _this.mouseToDrawLines(_this.ctx,_this.startPosition0.locating,_this.startPosition1.locating)
                            } else if ( ( pTopR[0] - position.x <=parseInt(item.styles.width) && position.x - pTopL[0]<= parseInt(item.styles.width) ) &&
                              (pTopL[1] - position.y>=10 && pTopL[1] - position.y <= Math.sqrt(Math.pow(parseInt(item.styles.width)/2,2)+100)) &&
                            (pTopR[1] - position.y >=10 && pTopR[1] - position.y <= Math.sqrt(Math.pow(parseInt(item.styles.width)/2,2)+100)) ) {
                                // 绘制顶部起点圆点
                                _this.startPosition0 = {locating: topX, fieldName: item.fieldName, direction: "top",style:{width:item.styles.width,height:item.styles.height},lineAttr:  {direction:'from',color:'green',width:2,shadowColor:`rgba(0,0,0,0.5)`}} //[bottomX, item.fieldName,"bottom"]
                                _this.startPosition1 = {locating: topY, fieldName: item.fieldName, direction: "top",lineAttr: 'from'} //[bottomY, item.fieldName,"bottom"]
                                _this.isMouseDraw = true
                                _this.mouseToDrawLines(_this.ctx,_this.startPosition0.locating,_this.startPosition1.locating)
                            }
                        })
                        _this.canMouseMoveLineConnect = true;
                    // this.canvasLine.addEventListener('mousemove',this.mouseMoveEvent);  
            }
        function onMouseMoveHandle(event)  {
          const rect = _this.canvas.getBoundingClientRect();
          const scaleX = _this.scale;
          const scaleY = _this.scale;
          const offsetX = _this.contentOffsetX || 0; 
          const offsetY = _this.contentOffsetY || 0;

          // 计算当前鼠标位置（已转换为画布坐标）
          const currentX = (event.clientX - rect.left - offsetX) / scaleX;
          const currentY = (event.clientY - rect.top - offsetY) / scaleY;

          // 根据调整点类型计算新的宽高和位置
          const dx = currentX - _this.startX;
          const dy = currentY - _this.startY;

          const handleType = _this.selectedHandle.type;
          const newItem = _this.selectedItem;

          switch (handleType) {
            case 'top-left':
              newItem.styles.left = (_this.initialLeft + dx) + 'px';
              newItem.styles.top = (_this.initialTop + dy) + 'px';
              newItem.styles.width = _this.initialWidth - dx + 'px';
              newItem.styles.height = _this.initialHeight - dy + 'px';
              break;
            case 'top':
              newItem.styles.top = (_this.initialTop + dy) + 'px';
              newItem.styles.height = _this.initialHeight - dy + 'px';
              break;
            case 'top-right':
              newItem.styles.width = _this.initialWidth + dx + 'px';
              newItem.styles.top = (_this.initialTop + dy) + 'px';
              newItem.styles.height = _this.initialHeight - dy + 'px';
              break;
            case 'right':
              newItem.styles.width = _this.initialWidth + dx + 'px';
              break;
            case 'bottom-right':
              newItem.styles.width = _this.initialWidth + dx + 'px';
              newItem.styles.height = _this.initialHeight + dy + 'px';
              break;
            case 'bottom':
              newItem.styles.height = _this.initialHeight + dy + 'px';
              break;
            case 'bottom-left':
              newItem.styles.left = (_this.initialLeft + dx) + 'px';
              newItem.styles.width = _this.initialWidth - dx + 'px';
              newItem.styles.height = _this.initialHeight + dy + 'px';
              break;
            case 'left':
              newItem.styles.left = (_this.initialLeft + dx) + 'px';
              newItem.styles.width = _this.initialWidth - dx + 'px';
              break;
            default:
              break;
          }

          // 确保宽高不为负数
          newItem.styles.width = Math.max(1, parseFloat(newItem.styles.width)) + 'px';
          newItem.styles.height = Math.max(1, parseFloat(newItem.styles.height)) + 'px';
                
          // 触发重绘
          _this.redrawCanvas(_this.lineDatas);
        };

        function MouseUpHandle() {
          // const newItem = _this.selectedItem;
          // const w = parseFloat(newItem.styles.width.replace('px', '')) || 0;
          // const h = parseFloat(newItem.styles.height.replace('px', '')) || 0;
          // const offset = _this.handledotsOffset;
          // const handles = [
          //   { type: 'top-left', x: -offset, y: -offset },
          //   { type: 'top', x: w / 2, y: -offset },
          //   { type: 'top-right', x: w + offset, y: -offset },
          //   { type: 'right', x: w + offset, y: h / 2 },
          //   { type: 'bottom-right', x: w + offset, y: h + offset },
          //   { type: 'bottom', x: w / 2, y: h + offset },
          //   { type: 'bottom-left', x: -offset, y: h + offset },
          //   { type: 'left', x: -offset, y: h / 2 },
          // ];
          // newItem['handles'] = handles;
          _this.selectedHandle = null;
          _this.selectedItem = null;
          _this.canvas.removeEventListener('mousemove', onMouseMoveHandle);
          _this.canvas.removeEventListener('mouseup', MouseUpHandle);
        };

        function onMouseUp() {
          _this.canvas.removeEventListener('mousemove', onMouseMoveDraw);
          _this.canvas.removeEventListener('mouseup', onMouseUp);
        }
        function onMouseMoveDraw(event) {
          const rect = _this.canvas.getBoundingClientRect();
          const scaleX = _this.scale;
          const scaleY = _this.scale;
          const offsetX = _this.contentOffsetX || 0;
          const offsetY = _this.contentOffsetY || 0;
          // 计算当前鼠标位置（已转换为画布坐标）
          const currentX = (event.clientX - rect.left - offsetX) / scaleX;
          const currentY = (event.clientY - rect.top - offsetY) / scaleY;
          const mouseX = (event.clientX - rect.left  ) / scaleX;
          const mouseY = (event.clientY - rect.top  ) / scaleY;
          if (selItem.isSelected && !(selectedItems.length > 1)) {
            let newX = Math.round((currentX - dragOffsetX) / 5) * 5;
            let newY = Math.round((currentY - dragOffsetY) / 5) * 5;
            let obj = {
                compId: selItem.component + '-' + selItem.id,
                data: {
                  ...selItem.styles,
                  left: newX + 'px',
                  top: newY + 'px'
                }
              };

              _this.$bus.$emit('styleData', obj);
            // 吸附检测
            const snapThreshold = 15; // 吸附阈值
            _this.componentDataProcess.forEach(other => {
            
              if (other.id === selItem.id || !other.onCanvas) return;

              const otherLeft = parseFloat(other.styles.left);
              const otherTop = parseFloat(other.styles.top);
              const otherWidth = parseFloat(other.styles.width);
              const otherHeight = parseFloat(other.styles.height);
              let selItemLeft = parseFloat(selItem.styles.left);
              let selItemTop = parseFloat(selItem.styles.top);
              let selItemWidth = parseFloat(selItem.styles.width);
              let selItemHeight = parseFloat(selItem.styles.height);
              let distanceX = Math.abs(selItemLeft + selItemWidth - otherLeft)
              let distanceX_right = Math.abs(selItemLeft - otherLeft - otherWidth)
              let distanceY = Math.abs(selItemTop - otherTop)

              // 水平方向吸附（左对齐、右对齐）
              if (selItem.attribute.adsorptionDirection == 'left-right' && other.attribute.adsorptionDirection == 'left-right') { // 右左吸附
                if (distanceX <= snapThreshold && distanceY <= snapThreshold) {
                  newX = otherLeft - selItemWidth
                  newY = otherTop
                } else if (distanceX_right <= snapThreshold && distanceY <= snapThreshold) {
                  newX = otherLeft + otherWidth
                  newY = otherTop
                }
              }
              if (selItem.attribute.adsorptionDirection == 'top-bottom' && other.attribute.adsorptionDirection == 'top-bottom') { // 上下吸附
                let verDistanceX = Math.abs(selItemLeft - otherLeft)
                let verDistanceY = Math.abs(selItemTop - otherTop - otherHeight)
                let distanceyTop = Math.abs(selItemTop + selItemHeight - otherTop)
                if (verDistanceX <= snapThreshold && verDistanceY <= snapThreshold) {
                      newY = otherTop + otherHeight 
                      newX = otherLeft
                } else if (verDistanceX <= snapThreshold && distanceyTop <= snapThreshold) {
                  newY = otherTop - selItemHeight 
                  newX = otherLeft
                }
              }
          
              let obj = {
                compId: selItem.component + '-' + selItem.id,
                data: {
                  ...selItem.styles,
                  left: newX + 'px',
                  top: newY + 'px'
                }
              };

              _this.$bus.$emit('styleData', obj);

            });
          

          // _this.componentDataProcess.forEach((item) => {
          //   if (item.id === selItem.id) {
          //     item.styles = {
          //       ...selItem.styles,
          //       top: mouseY - dragOffsetY + 'px',
          //       left: mouseX - dragOffsetX + 'px'
          //     }
          //   }
          // });
          _this.redrawCanvas(_this.lineDatas);
        }else{
          // 处理多选元素的拖动逻辑
          selectedItems.forEach(({ item, offsetX: startOffsetX, offsetY: startOffsetY }) => {
            const newLeft = currentX - startOffsetX;
            const newTop = currentY - startOffsetY;
            item.styles.left = `${Math.round((newLeft) / 5) * 5}px`;
            item.styles.top = `${Math.round((newTop) / 5) * 5}px`;
          });
          _this.redrawCanvas(_this.lineDatas);

        }
      }
     
     
    },
    handleDbLineClick(e) {
      const position = this.getCanvasPosition(e);
      this.lineDatas.forEach((line, index) => {
        const startX = line.startPoint[0].locating;
        const startY = line.startPoint[1].locating;
        const endX = line.endPoint[0].locating;
        const endY = line.endPoint[1].locating;
        // 使用距离判断来检测是否点击在线上
        const distance = this.distanceToLine(startX, startY, endX, endY, position.x, position.y);
        if (distance < 5) { // 5 是一个阈值，可以根据需要调整
          this.$confirm(i18n.t("common.tip_info.delete_line_info"), i18n.t("common.tip_info.tips"), {
            confirmButtonText: i18n.t("common.btn.ok"),
            cancelButtonText: i18n.t("common.btn.cancel"),
            type: 'warning'
          }).then(() => {        
              // 在这里处理双击事件，例如删除线
              this.lineDatas.splice(index, 1);
              this.redrawCanvas(this.lineDatas);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: this.$t('common.btn.Cancelled')
            });          
          })
          
        }
      });
    },
    startHandleDrag(currentX, currentY) {
      // 记录初始位置
      this.startX = currentX;
      this.startY = currentY;
      this.initialWidth = parseFloat(this.selectedItem.styles.width.replace('px', '')) || 0;
      this.initialHeight = parseFloat(this.selectedItem.styles.height.replace('px', '')) || 0;
      this.initialLeft = parseFloat(this.selectedItem.styles.left) || 0;
      this.initialTop = parseFloat(this.selectedItem.styles.top) || 0;
    },
   
    myScrollbarContentPanelClick(event){
      if(this.$refs.Shaperef && event.button === 0 && !event.altKey){
        this.$refs.Shaperef.forEach(item => {
          item.allhandleBlur()
        });
        this.selectedElements = [];
      }
    },
    startSelection(event) {
      if (event.button === 0 && event.altKey) { // 左键且未按 Alt 键
        this.isSelecting = true;
        const containerRect = this.$refs.myScrollbarContentPanel-process.getBoundingClientRect();
        this.selectionRect = {
          x: event.clientX - containerRect.left,
          y: event.clientY - containerRect.top,
          width: 0,
          height: 0
        };

        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.pointerEvents = 'none';
        overlay.style.border = '1px dashed #000';
        overlay.style.zIndex = '1000';
        this.$refs.myScrollbarContentPanel-process.appendChild(overlay);
        this.overlay = overlay;

        document.addEventListener('mousemove', this.updateSelection);
        document.addEventListener('mouseup', this.endSelection);
      }
    },
  updateSelection(event) {
    if (!this.isSelecting) return;
    const containerRect = this.$refs.myScrollbarContentPanel-process.getBoundingClientRect();
    const startX = Math.min(event.clientX - containerRect.left, this.selectionRect.x);
    const startY = Math.min(event.clientY - containerRect.top, this.selectionRect.y);
    const endX = Math.max(event.clientX - containerRect.left, this.selectionRect.x);
    const endY = Math.max(event.clientY - containerRect.top, this.selectionRect.y);

    this.selectionRect.width = endX - startX;
    this.selectionRect.height = endY - startY;
    this.selectionRect.x = startX;
    this.selectionRect.y = startY;

    this.overlay.style.left = `${this.selectionRect.x}px`;
    this.overlay.style.top = `${this.selectionRect.y}px`;
    this.overlay.style.width = `${this.selectionRect.width}px`;
    this.overlay.style.height = `${this.selectionRect.height}px`;

    this.checkSelectedElements();
  },
  endSelection() {
    this.isSelecting = false;
    document.removeEventListener('mousemove', this.updateSelection);
    document.removeEventListener('mouseup', this.endSelection);
    if (this.overlay) {
      this.$refs.myScrollbarContentPanel-process.removeChild(this.overlay);
      this.overlay = null;
    }
  },
  checkSelectedElements() {
      if (!this.isDialogUseCanvasDraw) {
        this.selectedElements = [];
        const allSelectableElements = this.$refs.myScrollbarContentPanel-process.querySelectorAll('.shape'); // 确保你的组件有 .selectable 类
        allSelectableElements.length > 0 && allSelectableElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const containerRect = this.$refs.myScrollbarContentPanel-process.getBoundingClientRect();
          const relativeRect = {
            left: rect.left - containerRect.left,
            top: rect.top - containerRect.top,
            right: rect.right - containerRect.left,
            bottom: rect.bottom - containerRect.top
          };

          if (this.isElementInRect(relativeRect)) {
            this.selectedElements.push(el.id);
            el.classList.add('active');
          }
        });
      } else {
        this.componentDataProcess.forEach(item => {
          if (!item.onCanvas) { return; }
          const itemLeft = parseFloat(item.styles.left);
          const itemTop = parseFloat(item.styles.top);
          const itemWidth = parseFloat(item.styles.width);
          const itemHeight = parseFloat(item.styles.height);

          const itemRight = itemLeft + itemWidth;
          const itemBottom = itemTop + itemHeight;
          const relativeRect = {
            left: itemLeft,
            top: itemTop,
            right: itemRight,
            bottom: itemBottom
          };
          if (this.isElementInRect(relativeRect)) {
            item.isSelected = true;
          }
        })
        this.redrawCanvas(this.lineDatas)
      }

    },
  isElementInRect(elementRect) {
    return elementRect.left >= this.selectionRect.x &&
           elementRect.right <= this.selectionRect.x + this.selectionRect.width &&
           elementRect.top >= this.selectionRect.y &&
           elementRect.bottom <= this.selectionRect.y + this.selectionRect.height;
  },
    tocopyData(val){
      this.copyData = JSON.parse(JSON.stringify({...val}))
    },
    movePanel(e){
      // e.stopPropagation();
      if(e.ctrlKey && e.keyCode === 86) {
        // if(this.$refs.Shaperef){
        //   this.$refs.Shaperef[0].ctrlvPaste(e)
        // }
        if (!this.copyData.data) {
            return;
          }
          let uuid = this.uuid();
          let i = this.getCompMaxIndex(this.componentDataProcess, this.copyData.data.component) + 1;
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
          this.componentDataProcess.push(component_data);
      }
    },

    fresh() {
      this.keyC = !this.keyC;
    },
    convertPx(data,parentData){
        let result = ''
        if(data.match(/[\D]+/g)){
          switch (data.match(/[\D]+/g)[0]) {
            case 'px' : result = parseInt(data) +10 + 'px' ;break;
            case '%': result = parseInt(data) / 100 * parseInt(parentData) + 10 + 'px';break; 
            case 'vw': result = parseInt(data) / 100 * window.innerWidth + 10 + 'px';break;
            case 'vh': result = parseInt(data) / 100 * window.innerHeight + 10 + 'px';break;
            default: result = data;
          }
        }
        return result
      },
    getShapeStyle(item) {
      let result = {};
      const style = deepCopy(item.styles);
      const excludes = [
        "top",
        "left",
        "position",
        "width",
        "height",
        "marginTop",
        "marginRight",
        "marginBottom",
        "marginLeft",
        "display",
        "overflow",
      ];
      Object.keys(style).forEach((key) => {
        if (excludes.includes(key)) {
          result[key] = style[key];
        }
      });
      //三种类型：(..)px (..)% (..)vh
      if(style.width){
        result['width'] = this.convertPx(style.width,this.panelStyle.width);
      }
      if(style.height){
        result['height'] = this.convertPx(style.height,this.panelStyle.height);
      }
      result["transform"] = "rotate(" + item.styles.rotationAngle + "deg)";
      return result;
    },
    getComponentShapeStyle(component) {
      let result = {};
      const style = deepCopy(component);
      const excludes = [
        "top",
        "left",
        "position",
        "marginTop",
        "marginRight",
        "marginBottom",
        "marginLeft",
      ];
      Object.keys(style).forEach((key) => {
        if (!excludes.includes(key)) {
          result[key] = style[key];
        }
      });
      return result;
    },
    getCompCount(componentDataProcess, name) {
      let i = 0;
      componentDataProcess.forEach((item) => {
        if (item.component === name) {
          i++;
        }
        if (item.tabPanels && item.tabPanels.length > 0) {
          item.tabPanels.forEach((t) => {
            if (t.component.component === name) {
              i++;
            }
            if (t.component.subComponent && t.component.subComponent.length) {
              i += this.getCompCount(t.component.subComponent, name);
            }
          });
        }
        if (item.subComponent && item.subComponent.length) {
          i += this.getCompCount(item.subComponent, name);
        }
      });
      return i;
    },
    getCompMaxIndex(componentDataProcess, name) {
      let i = 0;
      componentDataProcess.forEach((item) => {
        if (item.component === name) {
          if (item.fieldName.indexOf(name) > -1) {
            let c = item.fieldName.match(/\d+/g);
            if (c) {
              let num = parseInt(c[0]);
              this.maxNumber = this.maxNumber <= num ? num : this.maxNumber;
            } else {
              this.maxNumber = 0;
            }
          }
        }
        if (item.tabPanels && item.tabPanels.length > 0) {
          item.tabPanels.forEach((t) => {
            if (t.component.component === name) {
              if (t.component.fieldName.indexOf(name) > -1) {
                let c = t.component.fieldName.match(/\d+/g);
                if (c) {
                  let num = parseInt(c[0]);
                  this.maxNumber = this.maxNumber <= num ? num : this.maxNumber;
                } else {
                  this.maxNumber = 0;
                }
              }
            }
            if (t.component.subComponent && t.component.subComponent.length) {
              this.maxNumber = this.getCompMaxIndex(
                t.component.subComponent,
                name
              );
            }
          });
        }
        if (item.subComponent && item.subComponent.length) {
          this.maxNumber = this.getCompMaxIndex(item.subComponent, name);
        }
      });
      return this.maxNumber;
    },
    //拖到目标区域放下时触发
    handleDropProcess(event) {
      // event.preventDefault();
      let srcEventData = event.dataTransfer.getData("srcEventData");
      let componentDataProcess = JSON.parse(srcEventData);
      
      if (componentDataProcess.action == "setLocation") {
        // this.$refs[componentDataProcess.compId][0].$el.style.left =
        //   event.offsetX - componentDataProcess.offsetX + "px";
        // this.$refs[componentDataProcess.compId][0].$el.style.top =
        //   event.offsetY - componentDataProcess.offsetY + "px";
      } else {
        let uuid = this.uuid();
        this.maxNumber = 0;
        let i =
          this.getCompMaxIndex(this.componentDataProcess, componentDataProcess.name) + 1;
        let name = `${componentDataProcess.name}`;
        if (i > 0) name += i;
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left - this.contentOffsetX;
        const mouseY = event.clientY - rect.top - this.contentOffsetY;
        // 转换为局部坐标（已除以缩放比例）
        const localX = Math.round((mouseX / this.scale) / 5) * 5 ;
        const localY = Math.round((mouseY / this.scale) / 5) * 5 ;
        let component = {
          component: componentDataProcess.name,
          id: uuid, //Math.random(),
          subComponent: [],
          styles: {
            position: "relative",
            left: this.isDialogUseCanvasDraw ? localX + "px" :event.offsetX - componentDataProcess.offsetX + "px",
            top: this.isDialogUseCanvasDraw ? localY + "px" : event.offsetY - componentDataProcess.offsetY + "px",
          },
          componentText: "",
          handler: {},
          elementCode: "",
          fieldName: name,
          tabPanels: [],
          attribute: {
            fieldName: name,
          },
          isSelected:false,
          onCanvas: this.isDialogUseCanvasDraw ? true : false,
        };
        for (let key in modules) {
          if (
            modules[key].methods.hasOwnProperty("getStyleCols") &&
            modules[key].name == componentDataProcess.name
          ) {
            let styleCols = modules[key].methods.getStyleCols();
            component.componentText = modules[key].methods.comText() + i;
            for (let i in styleCols) {
              component.styles[styleCols[i].field] = styleCols[i].defaultValue;
            }
            // 有类型参数的初始化
            let selectCols ={}
            if (component.styles.hasOwnProperty("types")) {
              for(let i in modules[key].components){
                if(modules[key].components[i].methods.hasOwnProperty('getStyleCols')){
                  styleCols = styleCols.concat(modules[key].components[i].methods.getStyleCols())
                }
                if(modules[key].components[i].methods.hasOwnProperty('selectOptions')){
                  let obj = modules[key].components[i].methods.selectOptions()
                  selectCols = Object.assign({},selectCols,obj)
                }
              }
              for (let i in styleCols) {
                if(styleCols[i].defaultValue)
                  component.styles[styleCols[i].field] = styleCols[i].defaultValue
              }
              Object.keys(selectCols).forEach(key => {
                for(let i in selectCols[key]){
                  if(component.styles[key] == selectCols[key][i].value)
                    component.styles[key] = selectCols[key][i].label
                }
              });
            }
          }
          if (modules[key].methods.hasOwnProperty("getAttributeCols") && modules[key].name == componentDataProcess.name){
            let attributeCols = modules[key].methods.getAttributeCols();
            for (let i in attributeCols) {
              if(attributeCols[i].defaultValue)component.attribute[attributeCols[i].field] = attributeCols[i].defaultValue
            }
          }
        }
        if (this.isDialogUseCanvasDraw) {
          const w = parseFloat(component.styles.width.replace('px', '')) || 0;
          const h = parseFloat(component.styles.height.replace('px', '')) || 0;
          const offset = this.handledotsOffset;
          const handles = [
            { type: 'top-left', x: -offset, y: -offset },
            { type: 'top', x: w / 2, y: -offset },
            { type: 'top-right', x: w + offset, y: -offset },
            { type: 'right', x: w + offset, y: h / 2 },
            { type: 'bottom-right', x: w + offset, y: h + offset },
            { type: 'bottom', x: w / 2, y: h + offset },
            { type: 'bottom-left', x: -offset, y: h + offset },
            { type: 'left', x: -offset, y: h / 2 },
          ];
          component['handles'] = handles;
        }
        this.componentDataProcess.push(component);
        this.componentDataProcess.map(item => { 
          if (component.id === item.id) {
                item.isSelected = true
          } else { item.isSelected = false }
          return item;
        })
        // this.redrawCanvas();
        this.nodeSavaQueueManager()
        // 节点拖拽到canvas面板后节点信息面板获取节点的样式和属性
        this.selectElementByPosition(mouseX, mouseY);
        let selItem = this.onselectElementByPosition(mouseX, mouseY);
        if (selItem) {
          this.$bus.$emit('compFocusId', selItem.component + '-' + selItem.id)
          let attributeObj = {
            compId: selItem.component + '-' + selItem.id,
            component: selItem,
            data: {
              comPname: selItem.component,
              id: selItem.id,
              ...selItem.attribute,
            },
          }

          this.$bus.$emit('attributeDataProcess', attributeObj)
          let obj = {
            compId: selItem.component + '-' + selItem.id,
            data: {
              ...selItem.styles,
            }
          }
          this.$bus.$emit('styleData', obj)
        }
      }
    },
    handleDragEnd(event) {
      event.preventDefault();
    },
    handleDragStart(event) {
      //event.preventDefault();
    },
    handleDragOver(event) {
      event.preventDefault();
    },
    handleDragEnter(event) {
      //console.log("handleDragEnter",event)
    },

    initElement() {
      let self = this;
      let element = (this.element = document.getElementById(
        "myScrollbarContentPanel-process"
      ));
      let content = document.getElementById("myScrollbarContentNode");
      function handleMouseDown(event) {
        let offsetX = event.clientX; //-element.clientLeft;
        let offsetY = event.clientY; //- element.clientTop;
        function handleMouseMove(event) {
          const { altKey, metaKey, deltaY, ctrlKey } = event;
          if (!ctrlKey) return;
          document.querySelector(".my-scrollbar-content-process").style.cursor = "grab";
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
          document.querySelector(".my-scrollbar-content-process").style.cursor = "auto";
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
    
    redrawCanvas(lines) {
      const ctx = this.ctx;//this.canvas.getContext("2d");
      ctx.setTransform(1, 0, 0, 1, 0, 0); // 重置变换
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // 应用平移和缩放
      ctx.translate(this.contentOffsetX, this.contentOffsetY);
      ctx.scale(this.scale, this.scale);

      this.ctx.strokeStyle = 'green';
      this.ctx.lineWidth = 2;
      // 绘制元素
      this.componentDataProcess.forEach(item => {
        if (item.onCanvas) {
          this.drawSVGPath(ctx, item)
        }
      });
      this.canvasDraw(lines)
    },
    parsePathCommands(pathString) {
      const commands = [];
      const commandTokens = pathString.match(/([A-Za-z][^A-Za-z]*)/g) || [];

      commandTokens.forEach(token => {
        const command = token[0];
        const argsStr = token.slice(1).trim();
        const params = argsStr
          .split(/[\s,]+/)
          .map(num => parseFloat(num));
        commands.push({ command, params });
      });

      return commands;
    },
    drawSVGPath(ctx, compt) {
      ctx.save();
      let _this = this;
      const path = modules[compt.component].methods.createSvgPath(compt.attribute.nodeLayers ? compt.attribute.nodeLayers : '');
      let getStyleCols = modules[compt.component].methods.getStyleCols()
      let defaultWidth = 0
      let defaultHight = 0
      // const commands = this.parsePathCommands(path);
      const { left, top, width, height } = compt.styles;
      const x = 0;
      const y = 0;
      const w = parseFloat(width.replace('px', '')) || 0;
      const h = parseFloat(height.replace('px', '')) || 0;
      const handleSize = this.handledotsSize; // 调整点半径
      const offset = this.handledotsOffset;
      const handles = [
        { type: 'top-left', x: -offset, y: -offset },
        { type: 'top', x: w / 2, y: -offset },
        { type: 'top-right', x: w + offset, y: -offset },
        { type: 'right', x: w + offset, y: h / 2 },
        { type: 'bottom-right', x: w + offset, y: h + offset },
        { type: 'bottom', x: w / 2, y: h + offset },
        { type: 'bottom-left', x: -offset, y: h + offset },
        { type: 'left', x: -offset, y: h / 2 },
      ];
      // if(compt.attribute.nodeLayers){
      //   handles.forEach(item => {
      //     item.x = parseFloat(left.replace('px', '')) + item.x * (w / defaultWidth)
      //     item.y = parseFloat(top.replace('px', '')) + item.y * (h / defaultHight)
      //   })
      // }

      getStyleCols.forEach(item => {
        if (item.field == 'width') {
          defaultWidth = parseFloat(item.defaultValue.replace('px', ''))
        }
        if (item.field == 'height') {
          defaultHight = parseFloat(item.defaultValue.replace('px', ''))
        }
      })
      // compt.handles = handles;
      let currentX = 0, currentY = 0;
      ctx.translate(parseFloat(left.replace('px', '')), parseFloat(top.replace('px', '')));
      //放大缩小
      if((compt.attribute.nodeLayers && compt.attribute.nodeLayers == 6) || !compt.attribute.nodeLayers){
        ctx.scale(w / defaultWidth, h / defaultHight);
      }
      const rotationAngle = parseFloat(compt.styles.rotationAngle) || 0; // 单位：度
      const rotationInRadians = (rotationAngle * Math.PI) / 180;
      ctx.translate(x + w / 2, y + h / 2);
      ctx.rotate(rotationInRadians);
      ctx.translate(-w / 2, -h / 2);
      if(compt.attribute.z && compt.attribute.nodeDirec){

      const layers = parseInt(compt.attribute.z) || 1;
      const direction = compt.attribute.nodeDirec || 2; // 默认从上到
      const boxSize = 20; // 每个 canvas 图形大小
      const positions = [];
      for (let i = 0; i < layers; i++) {
        let posX = x;
        let posY = y;

        switch (direction) {
          case 1: // 从下到上
            posY = y + (layers - 1 - i) * boxSize;
            break;
          case 2: // 从上到下
            posY = y + i * boxSize;
            break;
          case 3: // 从左到右
            posX = x + i * boxSize;
            break;
          case 4: // 从右到左
            posX = x + (layers - 1 - i) * boxSize;
            break;
          default:
            posY = y + i * boxSize;
            break;
        }

        positions.push({ x: posX, y: posY });
      }
      // 遍历所有图形位置并绘制
        positions.forEach((pos, i) => {
          ctx.save();
          ctx.translate(pos.x, pos.y);

          if ((compt.attribute.nodeLayers && compt.attribute.nodeLayers == 6) || !compt.attribute.nodeLayers) {
            ctx.scale(w / defaultWidth, h / defaultHight);
          }

          if (path instanceof Array) {
            path.forEach((pathItem, index) => {
              let bgcolor = 'bg' + index + 'color'
              ctx.fillStyle = index == 0 ? compt.styles.fillColor : compt.styles[bgcolor];
              const commands = _this.parsePathCommands(pathItem);
              tocanvas(commands)
            })
          } else {
            ctx.fillStyle = compt.styles.fillColor;
            const commands = _this.parsePathCommands(path);
            tocanvas(commands)
          }
          if (compt.component.includes('CwWarehouseLocNumberSvg')) {
            // 新增：绘制层数编号
            const startRowNum = parseInt(compt.attribute.startRowNum) || 1;
            const layerIndex = startRowNum + i;

            ctx.font = "12px Arial";
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.fillText(layerIndex, boxSize / 2, boxSize / 2);
          }
          
          ctx.restore();
        });

    }

      if (path instanceof Array) {
        path.forEach((pathItem, index) => {
          let bgcolor = 'bg' + index + 'color'
          ctx.fillStyle = index == 0 ? compt.styles.fillColor : compt.styles[bgcolor];
          const commands = _this.parsePathCommands(pathItem);
          tocanvas(commands)
        })
        ctx.restore();
      } else {
        const commands = _this.parsePathCommands(path);
        ctx.fillStyle = compt.styles.fillColor;

        tocanvas(commands)
        ctx.restore();

      }

      function arcToBezier({ px, py, cx, cy, rx, ry, xAxisRotation, largeArcFlag, sweepFlag }) {
        const curves = [];

        // 如果半径为0，则退化为直线
        if (rx === 0 || ry === 0) {
          return [cx, cy, cx, cy, cx, cy];
        }

        // 旋转矩阵
        const sinPhi = Math.sin(xAxisRotation);
        const cosPhi = Math.cos(xAxisRotation);

        // 计算中点
        const dx = (px - cx) / 2.0;
        const dy = (py - cy) / 2.0;

        // 旋转后的点
        const x1p = cosPhi * dx + sinPhi * dy;
        const y1p = -sinPhi * dx + cosPhi * dy;

        // 确保半径足够大
        let rx2 = rx * rx;
        let ry2 = ry * ry;
        const x1p2 = x1p * x1p;
        const y1p2 = y1p * y1p;

        const lambda = x1p2 / rx2 + y1p2 / ry2;
        if (lambda > 1) {
          const sqrtLambda = Math.sqrt(lambda);
          rx *= sqrtLambda;
          ry *= sqrtLambda;
          rx2 = rx * rx;
          ry2 = ry * ry;
        }

        // 计算中心点
        const sign = (largeArcFlag === sweepFlag) ? -1 : 1;
        let cxp, cyp;
        const num = rx2 * ry2 - rx2 * y1p2 - ry2 * x1p2;
        const denom = rx2 * y1p2 + ry2 * x1p2;

        if (num < 0) {
          // 无解，使用近似值
          cxp = 0;
          cyp = 0;
        } else {
          const factor = sign * Math.sqrt(num / denom);
          cxp = factor * (rx * y1p / ry);
          cyp = factor * (-ry * x1p / rx);
        }

        // 旋转回原始坐标系
        const cx0 = cosPhi * cxp - sinPhi * cyp + (px + cx) / 2.0;
        const cy0 = sinPhi * cxp + cosPhi * cyp + (py + cy) / 2.0;

        // 计算起始角度
        const ux = (x1p - cxp) / rx;
        const uy = (y1p - cyp) / ry;
        const vx = (-x1p - cxp) / rx;
        const vy = (-y1p - cyp) / ry;

        // 计算角度
        const n = Math.sqrt(ux * ux + uy * uy);
        const p = ux;
        let theta = Math.acos(Math.max(-1, Math.min(1, p / n)));
        if (uy < 0) theta = -theta;

        // 计算角度差
        const n2 = Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
        const p2 = ux * vx + uy * vy;
        let delta = Math.acos(Math.max(-1, Math.min(1, p2 / n2)));
        if (ux * vy - uy * vx < 0) delta = -delta;

        if (sweepFlag === 0 && delta > 0) {
          delta -= 2 * Math.PI;
        } else if (sweepFlag === 1 && delta < 0) {
          delta += 2 * Math.PI;
        }

        // 分割为多个90度以内的弧段
        const segments = Math.max(1, Math.ceil(Math.abs(delta) / (Math.PI / 2)));
        const deltaSeg = delta / segments;
        const t = 8.0 / 3.0 * Math.sin(deltaSeg / 4.0) * Math.sin(deltaSeg / 4.0) / Math.sin(deltaSeg / 2.0);

        for (let i = 0; i < segments; i++) {
          const cosTheta1 = Math.cos(theta);
          const sinTheta1 = Math.sin(theta);
          theta += deltaSeg;
          const cosTheta2 = Math.cos(theta);
          const sinTheta2 = Math.sin(theta);

          // 计算控制点
          const pcx = rx * (cosPhi * cosTheta1 - sinPhi * sinTheta1) + cx0;
          const pcy = ry * (sinPhi * cosTheta1 + cosPhi * sinTheta1) + cy0;

          const p1x = pcx + t * (-rx * cosPhi * sinTheta1 - ry * sinPhi * cosTheta1);
          const p1y = pcy + t * (-rx * sinPhi * sinTheta1 + ry * cosPhi * cosTheta1);

          const p2x = rx * (cosPhi * cosTheta2 - sinPhi * sinTheta2) + cx0;
          const p2y = ry * (sinPhi * cosTheta2 + cosPhi * sinTheta2) + cy0;

          const p3x = p2x + t * (rx * cosPhi * sinTheta2 + ry * sinPhi * cosTheta2);
          const p3y = p2y + t * (rx * sinPhi * sinTheta2 - ry * cosPhi * cosTheta2);

          // 添加曲线点
          curves.push(p1x, p1y, p3x, p3y, p2x, p2y);
        }

        return curves;
      }
      
      function tocanvas(commands) {
        ctx.beginPath();
        let previousControlPoint = null; // 记录上一个控制点，用于 S 命令
        commands.forEach(({ command, params }) => {
          const cmd = command.toUpperCase();
          const isRelative = command !== cmd;

          switch (cmd) {
            case 'M':
              currentX = isRelative ? currentX + params[0] : params[0];
              currentY = isRelative ? currentY + params[1] : params[1];
              ctx.moveTo(currentX, currentY);
              break;
            case 'L':
              currentX = isRelative ? currentX + params[0] : params[0];
              currentY = isRelative ? currentY + params[1] : params[1];
              ctx.lineTo(currentX, currentY);
              break;
            case 'H':
              currentX = isRelative ? currentX + params[0] : params[0];
              ctx.lineTo(currentX, currentY);
              break;
            case 'V':
              currentY = isRelative ? currentY + params[0] : params[0];
              ctx.lineTo(currentX, currentY);
              break;
            case 'Q': {
              if (params.length !== 4) {
                console.warn('Invalid parameters for Q command:', params);
                break;
              }
              const x1 = isRelative ? currentX + params[0] : params[0];
              const y1 = isRelative ? currentY + params[1] : params[1];
              const x = isRelative ? currentX + params[2] : params[2];
              const y = isRelative ? currentY + params[3] : params[3];

              ctx.quadraticCurveTo(x1, y1, x, y);
              currentX = x;
              currentY = y;

              // 更新上一个控制点
              previousControlPoint = { x: x1, y: y1 };
              break;
            }
            case 'T': {
              if (params.length !== 2) {
                console.warn('Invalid parameters for T command:', params);
                break;
              }

              const x = isRelative ? currentX + params[0] : params[0];
              const y = isRelative ? currentY + params[1] : params[1];

              let x1, y1;
              if (previousControlPoint) {
                // 对称点计算
                x1 = currentX - (previousControlPoint.x - currentX);
                y1 = currentY - (previousControlPoint.y - currentY);
              } else {
                // 如果没有前一个控制点，默认使用当前点
                x1 = currentX;
                y1 = currentY;
              }

              ctx.quadraticCurveTo(x1, y1, x, y);
              currentX = x;
              currentY = y;

              // 更新上一个控制点
              previousControlPoint = { x: x1, y: y1 };
              break;
            }
            case 'S': {
              if (params.length !== 4) {
                console.warn('Invalid parameters for S command:', params);
                break;
              }

              // 计算第一个控制点（对称点）
              const x2 = isRelative ? currentX + params[0] : params[0];
              const y2 = isRelative ? currentY + params[1] : params[1];
              const x = isRelative ? currentX + params[2] : params[2];
              const y = isRelative ? currentY + params[3] : params[3];

              let x1, y1;
              if (previousControlPoint) {
                // 对称点计算
                x1 = currentX - (previousControlPoint.x - currentX);
                y1 = currentY - (previousControlPoint.y - currentY);
              } else {
                // 如果没有前一个控制点，默认使用当前点
                x1 = currentX;
                y1 = currentY;
              }

              ctx.bezierCurveTo(x1, y1, x2, y2, x, y);
              currentX = x;
              currentY = y;

              // 更新上一个控制点
              previousControlPoint = { x: x2, y: y2 };
              break;
            }
            case 'C':
              if (params.length !== 6) {
                console.warn('Invalid parameters for C command:', params);
                break;
              }
              const isRelativeC = command !== cmd; // 判断是否为相对坐标
              const x1 = isRelativeC ? currentX + params[0] : params[0];
              const y1 = isRelativeC ? currentY + params[1] : params[1];
              const x2 = isRelativeC ? currentX + params[2] : params[2];
              const y2 = isRelativeC ? currentY + params[3] : params[3];
              const x = isRelativeC ? currentX + params[4] : params[4];
              const y = isRelativeC ? currentY + params[5] : params[5];

              ctx.bezierCurveTo(x1, y1, x2, y2, x, y);
              currentX = x;
              currentY = y;
              previousControlPoint = { x: x2, y: y2 };
              break;
            case 'Z':
              ctx.closePath();
              break;
            case 'A': {
              const [rx, ry, rotation, largeArc, sweep, x, y] = params;
              const isRelative = command !== cmd.toUpperCase();
              const endX = isRelative ? currentX + x : x;
              const endY = isRelative ? currentY + y : y;

              const curves = arcToBezier({
                px: currentX,
                py: currentY,
                cx: endX,
                cy: endY,
                rx: rx,
                ry: ry,
                xAxisRotation: rotation * (Math.PI / 180),
                largeArcFlag: largeArc,
                sweepFlag: sweep
              });
              for (let i = 0; i < curves.length; i += 6) {
                ctx.bezierCurveTo(
                  curves[i], curves[i + 1],
                  curves[i + 2], curves[i + 3],
                  curves[i + 4], curves[i + 5]
                );
              }

              currentX = endX;
              currentY = endY;
              break;
            }
            default:
              console.warn('Unsupported command:', command);
          }
        });
        ctx.strokeStyle = compt.styles.color;
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
        ctx.closePath()
        ctx.beginPath();
        ctx.font = "12px Arial";
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
        // ctx.textBaseline = "middle";
        // ctx.textAlign = "start";
        if(compt.component.includes('CwBrineTankSvg')){
          ctx.fillText(compt.attribute.text ? compt.attribute.text : '', 5, 24);
        }else if(compt.component.includes('CwCreateSingleStockerSvg')){
          ctx.fillText(compt.attribute.text ? compt.attribute.text : '', 0, 28);
        }else if(compt.component.includes('CwProcessNodeSvg')){
          ctx.fillText(compt.attribute.text ? compt.attribute.text : '', 5, 94);
        }
        else if(compt.component.includes('CwRectSvg')){
          ctx.fillText(compt.attribute.text ? compt.attribute.text : '', 0, 54);
        }
        else if(compt.component.includes('CwNailRemovalMachineSvg')){
          ctx.fillText(compt.attribute.text ? compt.attribute.text : '', 12, 18);
        }else if(compt.component.includes('CwOcvEquipmentSvg') || compt.component.includes('CwSquareMachineEquipmentSvg')){
          ctx.fillText(compt.attribute.text ? compt.attribute.text : '', 12, 18);
        }
        else{
          ctx.fillText(compt.attribute.text ? compt.attribute.text : '', 20, 20);
        }
        ctx.closePath()

      }



      if (compt.isSelected) {
        ctx.save();
        ctx.translate(parseFloat(left.replace('px', '')), parseFloat(top.replace('px', '')));
        const rotationAngle = parseFloat(compt.styles.rotationAngle) || 0; // 单位：度
        const rotationInRadians = (rotationAngle * Math.PI) / 180;
        ctx.translate(x + w / 2, y + h / 2);
        ctx.rotate(rotationInRadians);
        ctx.translate(-w / 2, -h / 2);
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.moveTo(handles[0].x, handles[0].y); // 左上角
        ctx.lineTo(handles[1].x, handles[1].y); // 顶部中间
        ctx.lineTo(handles[2].x, handles[2].y); // 右上角
        ctx.lineTo(handles[3].x, handles[3].y); // 右侧中间
        ctx.lineTo(handles[4].x, handles[4].y); // 右下角
        ctx.lineTo(handles[5].x, handles[5].y); // 底部中间
        ctx.lineTo(handles[6].x, handles[6].y); // 左下角
        ctx.lineTo(handles[7].x, handles[7].y); // 左侧中间
        ctx.closePath(); // 关闭路径
        ctx.stroke();
        ctx.setLineDash([]);

        // 绘制调整点（实心圆）
        // ctx.fillStyle = 'red';


        // handles.forEach(handle => {
        //   ctx.beginPath();
        //   ctx.arc(
        //     handle.x,
        //     handle.y,
        //     handleSize,
        //     0,
        //     Math.PI * 2
        //   );
        //   ctx.fill();
        //   ctx.closePath();
        // });
        ctx.restore();
    
      }
      ctx.restore();

       
    },
    panelScroll(e){
      // if(this.isDialogUseCanvasDraw){
      //   this.canvansHandleScroll(e)
      // }else{
      //   this.handleScroll(e)
      // }
    },
    canvansHandleScroll(event) {
      if (!event.ctrlKey) {
        return;
      }
      event.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      // 鼠标在画布上的相对位置（未缩放前）
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // 更新缩放比例
      if (event.deltaY < 0 && this.scale < this.maxScale) {
        this.scale += this.scaleStep;
      } else if (event.deltaY > 0 && this.scale > this.minScale) {
        this.scale -= this.scaleStep;
      }

      // 计算缩放中心的偏移量
      const centerX = (mouseX - this.contentOffsetX) / this.preScale;
      const centerY = (mouseY - this.contentOffsetY) / this.preScale;

      // 更新偏移量
      this.contentOffsetX = mouseX - centerX * this.scale;
      this.contentOffsetY = mouseY - centerY * this.scale;

      this.preScale = this.scale;
      this.redrawCanvas(this.lineDatas);
    },
    handleScroll(e) {
      const max = 200;
      const min = 1;
      const limit = 1;

      const { altKey, metaKey, deltaY, ctrlKey } = e;
      if (ctrlKey || altKey || metaKey) {
        e.preventDefault();
        if (deltaY > 0) {
          if (this.scaleValue > min) {
            this.scaleValue -= limit;
          }
        }

        if (deltaY < 0) {
          if (this.scaleValue < max) {
            this.scaleValue += limit;
          }
        }
        //this.initRuler()
      }
    },

    // 右键shape 菜单
    rightclick(info) {
      var sidebarArea = document.querySelector('.sidebar-container');
      var navbarArea = document.querySelector('.navbar');
      var tagsArea = document.querySelector('.tags-view-container');
      info.position.x = info.position.x - sidebarArea.clientWidth,
      info.position.y = info.position.y - navbarArea.clientHeight - tagsArea.clientHeight
      let rightclickData = {
        info: info,
        componentDataProcess: this.componentDataProcess
      }
      this.$bus.$emit("rightclick",rightclickData)
    },
    openSvgMenu(event, selectedItem) {
      event.stopPropagation()
      var sidebarArea = document.querySelector('.sidebar-container');
      var navbarArea = document.querySelector('.navbar');
      var tagsArea = document.querySelector('.tags-view-container');
      let compId = selectedItem.component + "-" + selectedItem.id 
      let component = selectedItem
      let selData = this.componentDataProcess.filter(item => item.isSelected === true && item.onCanvas === true).map(item=>item.id);
      let selectedElements = selData.length > 1 ? selData : []
      let rightclickInfo = {
        menuId: "menu" + "-" + this.compId,
        position: {
          x: event.clientX - sidebarArea.clientWidth,
          y: event.clientY - navbarArea.clientHeight - tagsArea.clientHeight,
        },
        menulists: [
          {
            fnName: "rmenuCopyNode",
            params: { compId, component, event, selectedElements },
            btnName: "复制",
            // shortcutKey:"ctrl+c",
            children: [],
          },
          {
            fnName: "rmenuPasteNode",
            params: { compId, component, event },
            btnName: "粘贴",
            // shortcutKey:"ctrl+c",
            children: [],
          },
          {
            fnName: "rmenuDeleteNode",
            params: { compId, event,component, selData },
            btnName: "删除",
            shortcutKey: "delete",
            children: [],
          },
          // {
          //   fnName: "",
          //   params: { compId, event },
          //   btnName: "置于顶层",
          //   children: [
          //     {
          //       fnName: "rmenuTopNode",
          //       params: { compId, event },
          //       btnName: "置于顶层",
          //       children: [],
          //     },
          //     {
          //       fnName: "rmenuUpNode",
          //       params: { compId, event },
          //       btnName: "上移一层",
          //       children: [],
          //     },
          //   ],
          // },
          // {
          //   fnName: "",
          //   params: { compId, event },
          //   icoName: "",
          //   btnName: "置于底层",
          //   children: [
          //     {
          //       fnName: "rmenuBottomNode",
          //       params: { compId, event },
          //       btnName: "置于底层",
          //       children: [],
          //     },
          //     {
          //       fnName: "rmenuDownNode",
          //       params: { compId, event },
          //       btnName: "下移一层",
          //       children: [],
          //     },
          //   ],
          // },
        ],
      };
      let rightclickData = {
        info: rightclickInfo,
        componentDataProcess: this.componentDataProcess
      }
      this.$bus.$emit("nodeRightclick", rightclickData)
    },
    // 右键画布 菜单
    onContextmenu(event) {
     // if (event.target.className != "myScrollbarContentPanel_main") return; // 右键shape区域
      var sidebarArea = document.querySelector('.sidebar-container');
      var navbarArea = document.querySelector('.navbar');
      var tagsArea = document.querySelector('.tags-view-container');
      let info = {
        menuId: "rkeymenu",
        position: {
          x: event.clientX - sidebarArea.clientWidth,
          y: event.clientY - navbarArea.clientHeight - tagsArea.clientHeight,
        },
        menulists: [
          {
            fnName: "rmenuPasteNode",
            params: { event },
            btnName: "粘贴",
            children: [],
          },
          {
            fnName: "rmenuClearNode",
            params: "清空画布",
            icoName: "",
            btnName: "清空画布",
            children: [],
          },
        ],
      };
      let rightclickData = {
        info: info,
        componentDataProcess: this.componentDataProcess
      }
      this.$bus.$emit("nodeRightclick",rightclickData)
    },
    
    //快捷键
    // deleteData(compId) {
    //     for (var i = 0; i < this.componentDataProcess.length; i++) {
    //       if (
    //         this.componentDataProcess[i].component + "-" + this.componentDataProcess[i].id == compId
    //       ) {
    //         this.componentDataProcess.splice(i, 1);
    //       }
    //     }
    //     this.nodeSavaQueueManager()
    // },
    nodeSavaQueueManager (){
      this.$emit("nodeSavaQueueManager",this.componentDataProcess)
    }
  },
};

</script>

<style lang="less" scoped>
.my-scrollbar-content-process {
  cursor: auto;
  transform-origin: left top;
  transition: all 0.3s;
  width: 970px;
  height: 770px;
}
#testcanvas1 {
    // background-color: white;
    z-index: 1;
}

</style>