<template>
  <CwBasicNode ref="baseNode" v-bind="$attrs" v-on="$listeners" :itemStyle="itemStyle" :panelStyle="panelStyle"/>
</template>
<script>
import CwBasicNode from "@/components/Cw/CwBasicNode.vue";
// import jq from 'jquery';
export default {
  name: 'CwCanvasDrawView',
  components: { CwBasicNode },
  props: {
    panelStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    componentModalObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    fieldName: {
      type: String,
      default: ''
    },
    myStyle: {
      type: Object,
      default: () => {
        return { }
      }
    },
    itemStyle: {
      type: Object,
      default: () => {
        return {  }
      }
    },
    itemVal: {
      type: String,
      default: ''
    },
    compId: {
      type: String,
      default: ''
    },
    component:{
      type: Object,
      default: () =>{}
    },
    bindData:{
      type: Object,
      default: () =>{}
    },
    nodeData: {
      type: Array,
      default: () => []
    },
  },
  watch: {
     nodeData:{
          handler: function (newVal, oldVal) {
              if (newVal) {
                  this.compVal = newVal
              }

          },
          deep: true
    },
    itemVal: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.compVal = newVal
        }
      },
      deep: true
    },
    nodePosition: {
      handler: function (newVal, oldVal) {
          if (newVal) {
            let x = {locating:parseInt(newVal.styles.left),fieldName:newVal.fieldName,nodeWidth:parseInt(newVal.styles.width)}, 
                  y = {locating:parseInt(newVal.styles.top),fieldName:newVal.fieldName,nodeHeight:parseInt(newVal.styles.height)};
              let x1 = {locating:parseInt(oldVal.styles.left),fieldName:newVal.fieldName,nodeWidth:parseInt(oldVal.styles.width)}, 
                  y1 = {locating:parseInt(oldVal.styles.top), fieldName:newVal.fieldName, nodehHeight:parseInt(oldVal.styles.height)};
              // let x = [parseInt(newVal.styles.left),newVal.fieldName,parseInt(newVal.styles.width)], y = [parseInt(newVal.styles.top),newVal.fieldName,parseInt(newVal.styles.height)];
              // let x1 = [parseInt(oldVal.styles.left),oldVal.fieldName,parseInt(oldVal.styles.height)], y1 = [parseInt(oldVal.styles.top),oldVal.fieldName,parseInt(oldVal.styles.height)];
              this.nodeLineMoveByMouse(x, y, x1, y1)
          }
      },
      deep: true,
      immediate: true,
    },
    //  清除画布所有内容
    'panelStyle.drawClear': {
        handler: function (newVal, oldVal) {
          if (newVal) {
            this.ctx.clearRect(0, 0, this.canvasLine.width, this.canvasLine.height);
            this.lineDatas = [];
          }
        },
        deep: true
      },
    lineDatas: {
        handler: function (newVal, oldVal) {
          if (newVal) {
              // console.log(newVal)
          }
        },
        deep: true
    },
  },
  computed: {},
  data() {
    return {
      vueContext:{},
      compVal: '',
      methods:{},
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
      x: 0,
      y: 0,
      x1: 0,
      y1: 0,
      nodePosition: {},
      lineDatas: [],
    };
  },
  created() {
  //   this.comText();
  },
  mounted() {
    this.canvasLine = document.getElementById("nodeConnectLine");
    this.ctx = this.canvasLine.getContext('2d');
    // 监听鼠标事件
    // this.canvasLine.addEventListener('mousedown',this.mousedownEvent);
    // this.canvasLine.addEventListener('mouseup',this.mouseUpEvent);
    // this.canvasLine.addEventListener('mouseout',this.mouseOutEvent);
    // 监听节点位置变化想x,y坐标
    this.$nextTick(() => {
          this.$bus.$on("attributeData", (attributeObj) => {
                if (attributeObj && attributeObj.component) {
                  this.nodePosition = attributeObj.component
                }
          });
    })
    if (this.$route.path === '/preview') {
      this.canvasDraw(this.$store.getters.lineDatas)
    }
  },
  beforeDestroy() { },
  destroyed() { 
      // this.canvasLine.removeEventListener('mousedown',this.mousedownEvent);
      // this.canvasLine.removeEventListener('mouseup',this.mouseUpEvent);
      // this.canvasLine.removeEventListener('mouseout',this.mouseOutEvent);
  },
  methods: {
    // 绘制圆点
    drawCircle(x,y,r,color) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, 2 * Math.PI); // 创建一个圆，x, y是圆心，r是半径
      this.ctx.fillStyle = color; // 设置填充颜色
      this.ctx.fill(); // 填充圆形
    },
    // 绘制箭头
    drawArrow(x1,y1, x2, y2, headLength = 15, headAngle = Math.PI / 6) {
          const angle = Math.atan2(y2 - y1, x2 - x1); // 计算箭头方向的角度
          // 计算箭头尖端的两个分支
          const arrowHeadX1 = x2 - headLength * Math.cos(angle - headAngle);
          const arrowHeadY1 = y2 - headLength * Math.sin(angle - headAngle);
          const arrowHeadX2 = x2 - headLength * Math.cos(angle + headAngle);
          const arrowHeadY2 = y2 - headLength * Math.sin(angle + headAngle);
          // 绘制箭头的两个分支
          this.ctx.beginPath();
          this.ctx.moveTo(x2, y2);
          this.ctx.lineTo(arrowHeadX1, arrowHeadY1);
          this.ctx.moveTo(x2, y2);
          this.ctx.lineTo(arrowHeadX2, arrowHeadY2);
          this.ctx.stroke();
      },
    getCanvasPosition(e) {
      const rect = this.canvasLine.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,  // 事件被出发时鼠标指针相对于浏览器页面的坐标 减去相对偏移量获取鼠标指针相对于canvas的坐标
        y: e.clientY - rect.top,
      };
    },

    //  根据保存好的数据lineDatas绘制线体
    canvasDraw(lines) {
      this.ctx.clearRect(0,0, this.canvasLine.width, this.canvasLine.height);
      this.ctx.strokeStyle = "lightgreen";
      this.ctx.lineWidth = 3;
      lines.forEach((item,i) => {
        this.ctx.beginPath();
        this.ctx.moveTo(item.startPoint[0].locating,item.startPoint[1].locating);
        this.ctx.lineTo(item.endPoint[0].locating,item.endPoint[1].locating);
        this.ctx.stroke();
        this.drawArrow(item.startPoint[0].locating,item.startPoint[1].locating,item.endPoint[0].locating,item.endPoint[1].locating)
      })
      
    },


  },
}
</script>
<style lang="scss" scoped>

</style>