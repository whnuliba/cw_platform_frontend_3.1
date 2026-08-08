<template>
    <div class="app-container-view">
      <!-- <CwCanvasDrawView v-if="isViewUseCanvasDraw"
        :width="page.panelStyle.width"
        :height="page.panelStyle.height" :panelStyle="page.panelStyle" 
        :nodeData="componentData"/> -->
        <canvas 
          ref="canvas" 
          id="paintingCanvas"
          v-show="isViewUseCanvasDraw"
          :width="page.panelStyle.width"
          :height="page.panelStyle.height"
          style="position: absolute; top: 0; left: 0;"
        >
</canvas>

      <component v-for="item in componentData"
        :key="item.id"
        :is="renderSubComponent(item.component)"
        v-if="!item.onCanvas"
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
    components: { ...modules, CwCanvasDrawView },
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
        default: () => undefined
      }
    },
    data() {
      const _initdata = {
        isViewUseCanvasDraw: false,
        componentData: [],
        componentModalObj: {},
        fullElementCodeHanler: {},
        sortFullElementCodeHanler: [],
        vueContext: {},
        methods: {},
        canvas: null,           // 画布元素
        scale: 1,                // 缩放比例
        preScale: 1,             // 上一次的缩放比例
        scaleStep: 0.1,          // 缩放步长
        maxScale: 5,             // 最大缩放比例
        minScale: 1,           // 最小缩放比例
        handledotsSize: 4, //选中时候的点的大小
        handledotsOffset: 6, //选中时候的点的偏移量
        hoveredHandleType: null, // 悬停的调整点类型
        contentOffsetX: 0, // 水平偏移量
        contentOffsetY: 0, // 垂直偏移量
      }
      //Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
      return _initdata
    },
    watch: {
      componentData: {
        handler: function (newVal, oldVal) {
          this.isViewUseCanvasDraw && this.canvas && this.redrawCanvas(this.lineDatas);
        },
        deep: true,
        // immediate: true,
      },
    },
    created() {
      this.sortFullElementCodeHanler = []
      const padeCode = this.page //JSON.parse(JSON.stringify(this.$route.params.pageCode)) 
      if (!padeCode) {
        this.$emit('initPageCode', (page) => {
          this.initCreated(page)
          this.$nextTick(() => {
            if (this.methods.mounted) {
              this.methods.mounted.call(this)
            }
            this.sortFullElementHandler()
            this.executeElementCodeCreated()
            this.executeElementCodeMounted()
            //开始排序
          })
        })
      } else {
        this.initCreated(padeCode)
        this.sortFullElementHandler()
        this.executeElementCodeCreated()
        this.isViewUseCanvasDraw = this.componentData.some(item => item.onCanvas === true);
      }
    },
    mounted() {
      this.$nextTick(() => {
        const padeCode = this.page
        const Canvas = document.getElementById("paintingCanvas");
        this.canvas = Canvas
        this.redrawCanvas(this.$store.getters.lineDatas);
        if (padeCode) {
          if (this.methods.mounted) {
            this.methods.mounted.call(this)
            this.executeElementCodeMounted()
            
          }

        }
       

        // console.log('Canvas', Canvas)
        // Canvas.addEventListener('click', this.onCanvasClick);

      })
    },
    destroyed() {
      this.$nextTick(() => {
        if (this.methods.destroyed) {
          this.methods.destroyed.call(this)
        }
        const padeCode = this.page
        this.executeElementCodedestroyed()
      })

    },
    methods: {
      canvansHandleScroll(event) {
        if (!event.ctrlKey) {
          return;
        }
        event.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        // 鼠标在画布上的相对位置（未缩放前）
        const mouseX = 0;
        const mouseY = 0;

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
        this.updateScrollArea()
        this.updateCanvasSize()
        this.redrawCanvas(this.$store.getters.lineDatas);
      },
      updateCanvasSize() {
        if (this.canvas) {
          const canvasWidth = this.page.panelStyle.width || 1920;
          const canvasHeight = this.page.panelStyle.height || 1080;

          // 根据缩放比例调整 canvas 尺寸
          const scaledWidth = canvasWidth * Math.max(this.scale, 1);
          const scaledHeight = canvasHeight * Math.max(this.scale, 1);

          // 确保 canvas 尺寸足够大，避免空白区域
          this.canvas.width = Math.max(scaledWidth, 1980);
          this.canvas.height = Math.max(scaledHeight, 1080);
        }
      },
      updateScrollArea() {
        this.$nextTick(() => {
          const contentPanel = this.$refs.myScrollbarContentPanel;
          if (contentPanel) {
            // 获取画布的实际尺寸
            const canvasWidth = this.page.panelStyle.width || 1920;
            const canvasHeight = this.page.panelStyle.height || 1080;

            // 计算缩放后的画布尺寸
            const scaledWidth = canvasWidth * this.scale;
            const scaledHeight = canvasHeight * this.scale;

            // 设置内容区域的尺寸，确保可以滚动到所有区域
            const contentElement = contentPanel.$el || contentPanel;
            if (contentElement) {
              const contentWrapper = contentElement.querySelector('.myScrollbarContentPanel_main') ||
                contentElement.querySelector('.my-scrollbar-content') ||
                contentElement;

              if (contentWrapper) {
                // 设置最小尺寸，确保能滚动到画布边缘
                const minWidth = Math.max(scaledWidth, contentElement.clientWidth);
                const minHeight = Math.max(scaledHeight, contentElement.clientHeight);

                contentWrapper.style.width = `${minWidth}px`;
                contentWrapper.style.height = `${minHeight}px`;

              }
            }
          }
        });
      },
      onselectElementByPosition(x, y) {
        let selectedItem = null;
        const handleSize = this.handledotsSize;
        const handleOffset = this.handledotsOffset; // 选中点的偏移量
        console.log('onselectElementByPosition', this.componentData)
        // 反向遍历，优先选中顶层元素
        for (let i = this.componentData.length - 1; i >= 0; i--) {
          const item = this.componentData[i];
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
          }
        }

        // 设置选中状态

      },
      onCanvasClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.scale;  // 缩放比例
        const scaleY = this.scale;
        const offsetX = this.contentOffsetX || 0;
        const offsetY = this.contentOffsetY || 0;
        const mouseX = (event.clientX - rect.left - offsetX) / scaleX;
        const mouseY = (event.clientY - rect.top - offsetY) / scaleY;
        let selItem = this.onselectElementByPosition(mouseX, mouseY);
        if (selItem) {
          return selItem
        }

      },
      // 绘制箭头
      drawArrow(ctx,x1,y1, x2, y2, headLength = 15, headAngle = Math.PI / 6) {
            const angle = Math.atan2(y2 - y1, x2 - x1); // 计算箭头方向的角度
            // 计算箭头尖端的两个分支
            const arrowHeadX1 = x2 - headLength * Math.cos(angle - headAngle);
            const arrowHeadY1 = y2 - headLength * Math.sin(angle - headAngle);
            const arrowHeadX2 = x2 - headLength * Math.cos(angle + headAngle);
            const arrowHeadY2 = y2 - headLength * Math.sin(angle + headAngle);
            // 绘制箭头的两个分支
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(arrowHeadX1, arrowHeadY1);
            ctx.moveTo(x2, y2);
            ctx.lineTo(arrowHeadX2, arrowHeadY2);
            ctx.stroke();
        },
       //  根据保存好的数据lineDatas绘制线体
      canvasDraw(ctx,lines) {
        ctx.strokeStyle = "lightgreen";
        ctx.lineWidth = 3;
        lines.forEach((item,i) => {
          ctx.beginPath();
          ctx.moveTo(item.startPoint[0].locating,item.startPoint[1].locating);
          switch (item.startPoint[0].direction) {
            case "right":
              // this.ctx.lineTo(item.startPoint[0].locating + (item.endPoint[0].locating - item.startPoint[0].locating)/2, item.startPoint[1].locating)
              // this.ctx.lineTo(item.startPoint[0].locating + (item.endPoint[0].locating - item.startPoint[0].locating)/2, item.endPoint[1].locating)
              // 使用arcTo绘制弯曲角
              ctx.arcTo(
                    item.startPoint[0].locating + (item.endPoint[0].locating - item.startPoint[0].locating)/2, 
                    item.startPoint[1].locating,
                    item.startPoint[0].locating + (item.endPoint[0].locating - item.startPoint[0].locating)/2, 
                    item.endPoint[1].locating,
                    5); // 最后参数是圆角半径radius
              ctx.arcTo(
                    item.startPoint[0].locating + (item.endPoint[0].locating - item.startPoint[0].locating)/2, 
                    item.endPoint[1].locating,
                    item.endPoint[0].locating,item.endPoint[1].locating,
                    5);
            break;
            case "left":
              // this.ctx.lineTo(item.startPoint[0].locating - (item.startPoint[0].locating - item.endPoint[0].locating)/2, item.startPoint[1].locating)
              // this.ctx.lineTo(item.startPoint[0].locating - (item.startPoint[0].locating - item.endPoint[0].locating)/2, item.endPoint[1].locating)
              ctx.arcTo(
                  item.startPoint[0].locating - (item.startPoint[0].locating - item.endPoint[0].locating)/2, item.startPoint[1].locating,
                  item.startPoint[0].locating - (item.startPoint[0].locating - item.endPoint[0].locating)/2, item.endPoint[1].locating,
                  5);
              ctx.arcTo(
                  item.startPoint[0].locating - (item.startPoint[0].locating - item.endPoint[0].locating)/2, item.endPoint[1].locating,
                  item.endPoint[0].locating,item.endPoint[1].locating,
                  5);
            break;
            case "top":
              // this.ctx.lineTo(item.startPoint[0].locating, item.startPoint[1].locating - (item.startPoint[1].locating - item.endPoint[1].locating)/2)
              // this.ctx.lineTo(item.endPoint[0].locating, item.startPoint[1].locating + (item.endPoint[1].locating - item.startPoint[1].locating)/2)
              ctx.arcTo(
                  item.startPoint[0].locating, item.startPoint[1].locating - (item.startPoint[1].locating - item.endPoint[1].locating)/2,
                  item.endPoint[0].locating, item.startPoint[1].locating + (item.endPoint[1].locating - item.startPoint[1].locating)/2,
                  5);
              ctx.arcTo(
                  item.endPoint[0].locating, item.startPoint[1].locating + (item.endPoint[1].locating - item.startPoint[1].locating)/2,
                  item.endPoint[0].locating,item.endPoint[1].locating,
                  5);
            break;
            case "bottom":
              // this.ctx.lineTo(item.startPoint[0].locating, item.startPoint[1].locating + (item.endPoint[1].locating - item.startPoint[1].locating)/2)
              // this.ctx.lineTo(item.startPoint[0].locating - (item.startPoint[0].locating - item.endPoint[0].locating), item.startPoint[1].locating + (item.endPoint[1].locating - item.startPoint[1].locating)/2)
              ctx.arcTo(
                  item.startPoint[0].locating, item.startPoint[1].locating + (item.endPoint[1].locating - item.startPoint[1].locating)/2,
                  item.startPoint[0].locating - (item.startPoint[0].locating - item.endPoint[0].locating), item.startPoint[1].locating + (item.endPoint[1].locating - item.startPoint[1].locating)/2,
                  5);
              ctx.arcTo(
                  item.startPoint[0].locating - (item.startPoint[0].locating - item.endPoint[0].locating), item.startPoint[1].locating + (item.endPoint[1].locating - item.startPoint[1].locating)/2,
                  item.endPoint[0].locating,item.endPoint[1].locating,
                  5);
            break;
            default:
            break;
          }
          ctx.lineTo(item.endPoint[0].locating,item.endPoint[1].locating);
          ctx.stroke();
          // this.drawArrow(ctx,item.startPoint[0].locating,item.startPoint[1].locating,item.endPoint[0].locating,item.endPoint[1].locating)
          switch (item.startPoint[0].direction) {
            case "right":
            this.drawArrow(ctx, item.startPoint[0].locating + (item.endPoint[0].locating - item.startPoint[0].locating)/2, 
                             item.endPoint[1].locating,item.endPoint[0].locating,item.endPoint[1].locating)
            break;
            case "left":
            this.drawArrow(ctx, item.startPoint[0].locating - (item.startPoint[0].locating - item.endPoint[0].locating)/2, item.endPoint[1].locating,
                             item.endPoint[0].locating,item.endPoint[1].locating)
            break;
            case "top":
            this.drawArrow(ctx, item.endPoint[0].locating, item.startPoint[1].locating + (item.endPoint[1].locating - item.startPoint[1].locating)/2,
                          item.endPoint[0].locating,item.endPoint[1].locating)
            break;
            case "bottom":
            this.drawArrow(ctx, item.startPoint[0].locating - (item.startPoint[0].locating - item.endPoint[0].locating), item.startPoint[1].locating + (item.endPoint[1].locating - item.startPoint[1].locating)/2,
                          item.endPoint[0].locating,item.endPoint[1].locating)
            break;
            default:
            break;
          }    
        })
        
      },
      redrawCanvas(lines) {
        const ctx = this.canvas.getContext("2d");
        ctx.setTransform(1, 0, 0, 1, 0, 0); // 重置变换
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 应用平移和缩放
        ctx.translate(this.contentOffsetX, this.contentOffsetY);
        ctx.scale(this.scale, this.scale);
        // 绘制元素
        this.componentData.forEach(item => {
          if (item.onCanvas) {
            this.drawSVGPath(ctx, item)
          }
        });
        // ctx.restore();
        lines && this.canvasDraw(ctx,lines)
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
        ctx.font = "10px Arial";
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
        // ctx.textBaseline = "middle";
        // ctx.textAlign = "start";
        if(compt.component.includes('CwBrineTankSvg')){
          ctx.fillText(compt.attribute.text ? compt.attribute.text : '', 5, 24);
        }else if(compt.component.includes('CwCreateSingleStockerSvg')){
          ctx.fillText(compt.attribute.text ? compt.attribute.text : '', 0, 28);
        }else if(compt.component.includes('CwProcessNodeSvg')){
          ctx.fillText(compt.attribute.text ? compt.attribute.text : '', 5, 24);
        }else if(compt.component.includes('CwNailRemovalMachineSvg')){
          ctx.fillText(compt.attribute.text ? compt.attribute.text : '', 12, 18);
        }else if(compt.component.includes('CwOcvEquipmentSvg') || compt.component.includes('CwSquareMachineEquipmentSvg')){
          ctx.fillText(compt.attribute.text ? compt.attribute.text : '', 12, 18);
        }
        else{
          ctx.fillText(compt.attribute.text ? compt.attribute.text : '', 20, 20);
        }
        ctx.closePath()

      }



      // if (compt.isSelected) {
      //   ctx.save();
      //   ctx.translate(parseFloat(left.replace('px', '')), parseFloat(top.replace('px', '')));
      //   const rotationAngle = parseFloat(compt.styles.rotationAngle) || 0; // 单位：度
      //   const rotationInRadians = (rotationAngle * Math.PI) / 180;
      //   ctx.translate(x + w / 2, y + h / 2);
      //   ctx.rotate(rotationInRadians);
      //   ctx.translate(-w / 2, -h / 2);
      //   ctx.setLineDash([3, 3]);
      //   ctx.strokeStyle = 'blue';
      //   ctx.beginPath();
      //   ctx.moveTo(handles[0].x, handles[0].y); // 左上角
      //   ctx.lineTo(handles[1].x, handles[1].y); // 顶部中间
      //   ctx.lineTo(handles[2].x, handles[2].y); // 右上角
      //   ctx.lineTo(handles[3].x, handles[3].y); // 右侧中间
      //   ctx.lineTo(handles[4].x, handles[4].y); // 右下角
      //   ctx.lineTo(handles[5].x, handles[5].y); // 底部中间
      //   ctx.lineTo(handles[6].x, handles[6].y); // 左下角
      //   ctx.lineTo(handles[7].x, handles[7].y); // 左侧中间
      //   ctx.closePath(); // 关闭路径
      //   ctx.stroke();
      //   ctx.setLineDash([]);

      //   // 绘制调整点（实心圆）
      //   ctx.fillStyle = 'red';


      //   handles.forEach(handle => {
      //     ctx.beginPath();
      //     ctx.arc(
      //       handle.x,
      //       handle.y,
      //       handleSize,
      //       0,
      //       Math.PI * 2
      //     );
      //     ctx.fill();
      //     ctx.closePath();
      //   });
      //   ctx.restore();

      // }
      ctx.restore();
    },
      sortFullElementHandler() {
        this.sortFullElementCodeHanler.sort((a, b) => {
          return a.element.order - b.element.order
        })
      },
      initCreated(padeCode) {
        this.componentData = padeCode.element
        if (padeCode.handler && padeCode.handler !== '') {
          let handler = eval("(" + padeCode.handler + ")")
          if (handler) {
            for (let item in handler) {
              this[item] = handler[item]
              this.$set(this.methods, item, handler[item])
              if (handler[item] && typeof handler[item] === 'function') {
                this.methods[item] = handler[item];
              }
            }
          }
        }
        this.$forceUpdate()
        this.fullElementCodeHanler = {}
        this.initPreview(this.componentData)
        this.$nextTick(() => {
          this.createContext(this.vueContext, this)
          if (this.methods.created) {
            this.methods.created.call(this)
          }
        })
      },
      getComponentShapeStyle(component) {
        let result = {}
        const style = deepCopy(component)
        const excludes = ['top', 'left', 'position']
        Object.keys(style).forEach((key) => {
          if (!excludes.includes(key)) {
            result[key] = style[key]
          }
        })
        return result
      },
      canvasAddEventListener(event, callback) {
        if (callback && typeof callback === 'function') {
          let _this = this
          this.canvas.addEventListener(event, (e) => {
            let eventItem = _this.onCanvasClick(e)
            if (e.detail)
              if (typeof e.detail === 'object' && e.detail instanceof Array) {
                callback.apply(_this, [e].concat(e.detail))
              }
              else {
                callback.apply(_this, [e, e.detail,eventItem])
              }
            else {
              callback.apply(_this, [e])

            }
          })
        }
      },
      addEventListener(element, event, callback) {
        if (callback && typeof callback === 'function') {
          let _this = this
          if(element === 'canvas'){
            this.canvasAddEventListener(event, callback)
            return
          }else{
            this.vueContext[element].$el.addEventListener(event, (e) => {
              if (e.detail)
                if (typeof e.detail === 'object' && e.detail instanceof Array) {
                  callback.apply(_this, [e].concat(e.detail))
                }
                else {
                  callback.apply(_this, [e, e.detail])
                }
              else {
                callback.apply(_this, [e])
              }
            })
          }
          
        }
      },
      removeEventListener(element, event) {
        this.vueContext[element].$el.removeEventListener(event)
      },
      getChildComponentByChildren(context, vue, compData) {
        if (vue.$children) {
          for (let index in vue.$children) {
            const vueComp = vue.$children[index]
            if (vueComp && vueComp.component && vueComp.component.attribute && vueComp.component.attribute.fieldName && vueComp.fieldName.trim() !== '') {
              //context[vueComp.fieldName]=vueComp   
              this.$set(context, vueComp.fieldName, vueComp)
            } else if (vueComp) {
              this.getChildComponentByChildren(context, vueComp, compData)
            }
          }
        }
      },

      createContext(context, vue) {
        if (vue.$children) {
          for (let index in vue.$children) {
            const vueComp = vue.$children[index]
            if (vueComp && vueComp.component && vueComp.component.attribute && vueComp.component.attribute.fieldName && vueComp.fieldName.trim() !== '') {
              this.$set(context, vueComp.fieldName, vueComp)
              //context[vueComp.fieldName]=vueComp       
            }
            this.createContext(context, vueComp)

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
      executeElementCodedestroyed() {
        const elementHander = this.sortFullElementCodeHanler

        //判断order,及时
        if (elementHander) {
          elementHander.forEach(ele => {
            let item = ele.element
            if (item.destroyed && typeof item.destroyed === 'function') {
              if (_vue) {
                item.destroyed.call(_vue, this)
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
      executeElementCodeMounted() {

        const elementHander = this.sortFullElementCodeHanler
        if (elementHander) {
          elementHander.forEach(ele => {
            let item = ele.element
            let fieldName = ele.fieldName
            let _vue = this.vueContext[fieldName]
            if (_vue) {
              // _vue.vueContext = this.vueContext
              //_vue.$set(_vue.component,'vueContext',this.vueContext)
            }

            if (item.mounted && typeof item.mounted === 'function') {
              if (_vue) {
                item.mounted.call(_vue, this)
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
      executeElementCodeCreated() {
        const elementHander = this.sortFullElementCodeHanler
        if (elementHander) {
          elementHander.forEach(ele => {
            let item = ele.element
            let fieldName = ele.fieldName
            let _vue = this.vueContext[fieldName]
            if (_vue) {
              //_vue.vueContext = this.vueContext
              // _vue.$set(_vue.$data,'vueContext',this.vueContext)

              //初初始化函数
              for (let func in item) {
                // _vue[item] = item[func]

                if (item[func] && typeof item[func] === 'function') {
                  // _vue.$set(_vue.methods,func,item[func])
                  _vue[func] = item[func]
                  _vue.methods[func] = item[func];
                }
              }

              if (_vue.vueContext) {
                for (let k in this.vueContext)
                  _vue.vueContext[k] = this.vueContext[k]
                //_vue.vueContext = this.vueContext
              }
            }
            if (item.created && typeof item.created === 'function') {
              if (_vue) {
                item.created.call(_vue, this)
              }
            }
          })
        }
      },
      initElementCode(component) {
        if (component.elementCode) {
          let data = eval("(" + component.elementCode + ")") //JSON.parse(val.scripts)
          //this.component.handler=data
          component['handler'] = data
          let key = `handler_${component.fieldName}`
          if (data && !data.order) {
            data.order = 9999999
          }
          if (data && typeof data.order !== 'number') {
            data.order = 9999999
          }
          this.fullElementCodeHanler[key] = data
          // {fieldName:component.fieldName,element:data}
          this.sortFullElementCodeHanler.push({ fieldName: component.fieldName, element: data })
        }
      },
      initPreview(componentData) {
        if (componentData && componentData.length && componentData.length > 0) {
          componentData.forEach(item => {
            if (item.component === 'CwSubPanel') {
              item.component = 'CwSubPanelPreview'
            } else if (item.component === 'CwDesignDialogs') {
              item.component = 'CwDesignDialogsPreview'
            } else if (item.component === 'CwUCPanel') {
              item.component = 'CwUCPanelPreview'
            }
            else if (item.component === 'CwWorkFlow') {
              item.component = 'CwWorkFlowPreview'
            }
            else if (item.component === 'CwIterator') {
              item.component = 'CwIteratorView'
            }
            else if (item.component === 'CwDrawerPanel') {
              item.component = 'CwDrawerPanelView'
            }
            else if (item.component === 'CwDialogPanel') {
              item.component = 'CwDialogPanelView'
            }
            else if (item.component === 'CwTabPanel') {
              item.component = 'CwTabPanelView'
              //判断面板
              if (item.tabPanels && item.tabPanels.length && item.tabPanels.length > 0) {
                const cop = item.tabPanels.map(c => c.component)
                this.initPreview(cop)
              }
            }

            this.initElementCode(item)
            if (item.subComponent && item.subComponent.length && item.subComponent.length > 0) {
              this.initPreview(item.subComponent)
            }

          })
        }
      },
      renderSubComponent(item) {
        return modules[item]
      },
      preview() {
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