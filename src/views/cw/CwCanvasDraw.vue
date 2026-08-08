47<template>
    <CwBasicNode ref="baseNode" v-bind="$attrs" v-on="$listeners" :itemStyle="itemStyle" :panelStyle="panelStyle">
    </CwBasicNode>
  </template>
  <script>
  import CwBasicNode from "@/components/Cw/CwBasicNode.vue";
  // import jq from 'jquery';
  export default {
    name: 'CwCanvasDraw',
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
            console.log(newVal.left,oldVal.left)
            if (newVal) {
                let x = parseInt(newVal.left), y = parseInt(newVal.top);
                let x1 = parseInt(oldVal.left), y1 = parseInt(oldVal.top);
                // console.log(x,y)
                this.nodeLineMoveByMouse(x,y,x1,y1)
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
           console.log(newVal)
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
      this.canvasLine.addEventListener('mousedown',this.mousedownEvent);
      this.canvasLine.addEventListener('mouseup',this.mouseUpEvent);
      this.canvasLine.addEventListener('mouseout',this.mouseOutEvent);
      // 监听节点位置变化想x,y坐标
      this.$nextTick(() => {
            this.$bus.$on("styleData", (attributeObj) => {
                if (attributeObj && attributeObj.data) {
                  this.nodePosition = attributeObj.data
                }
            });
      })
    },
    beforeDestroy() { },
    destroyed() { 
        this.canvasLine.removeEventListener('mousedown',this.mousedownEvent);
        this.canvasLine.removeEventListener('mouseup',this.mouseUpEvent);
        this.canvasLine.removeEventListener('mouseout',this.mouseOutEvent);
    },
    methods: {
      // 线随着节点移动
      nodeLineMoveByMouse(left, top,leftOld,topOld) {
        console.log(left, top,leftOld,topOld)
        let newLines = this.lineDatas.map((item, i) => {
          console.log(item,i)
            if (item.startPoint[0] === leftOld && item.startPoint[1] === topOld) {
              // debugger
              console.log('首个节点',item)
                item.startPoint = [left, top]
            }
            if (item.endPoint[0] === leftOld && item.endPoint[1] === leftOld) {
              // debugger
              console.log('末位节点',item)
              // item.startPoint = [leftOld, topOld]
                item.endPoint = [left, top]
            } 
            // else if (this.lineDatas[i].endPoint[0] == leftOld && this.lineDatas[i+1].startPoint[0] == leftOld){
            //   this.lineDatas[i].endPoint = [left,top];
            //   this.lineDatas[i+1].startPoint = [left,top];
            // }
            return item
        })
        console.log(newLines)
        this.canvasDraw(newLines)
      },
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
      mousedownEvent(e) {
        if (this.nodeData.length > 0) {
                    let newVal = this.nodeData;
                    let x = 0;
                    let y = 0;
                    const position = this.getCanvasPosition(e);
                    this.ctx.strokeStyle = "lightblue";
                    this.ctx.lineWidth = 2;
                    newVal.forEach((item,i) => {
                        // 如果靠近第一个节点坐标-15到15范围内就可以开始画线  
                        if ( (position.x -  parseInt(item.styles.left) <=15 && position.x -  parseInt(item.styles.left) >=-15) && (position.y -  parseInt(item.styles.top) <=15 && position.y -  parseInt(item.styles.top)>= -15) ) {
                            // 绘制起点圆点
                            console.log("绘制起点圆点")
                            this.startPosition0 = parseInt(item.styles.left) // + 105;
                            this.startPosition1 = parseInt(item.styles.top) // + 55;
                            this.drawCircle(x,y,10,"red");
                            this.isMouseDraw = true
                            this.$refs.baseNode.mouseToDrawLines(this.ctx,this.startPosition0,this.startPosition1)
                        }
                    })
                    this.canvasLine.addEventListener('mousemove',this.mouseMoveEvent);
        
        }
      },
      mouseMoveEvent(e) {
        const position = this.getCanvasPosition(e);
        let newVal = this.nodeData;
        this.endPosition0 = parseInt(position.x)
        this.endPosition1 = parseInt(position.y) 
        this.$refs.baseNode.mouseToDrawLines1(this.ctx,this.endPosition0,this.endPosition1,this.isMouseDraw)
        newVal.forEach((item,i) => {
            // 如果靠近下一个节点坐标-15到15范围内就自动连接到该节点           
            if (( position.x -  parseInt(item.styles.left) <=15 && position.x -  parseInt(item.styles.left) >=-15) && 
            (position.y -  parseInt(item.styles.top) <=15 && position.y -  parseInt(item.styles.top) >= -15)) {
                // this.ctx.clearRect(0,0, this.canvasLine.width, this.canvasLine.height);
                let x1 = parseInt(item.styles.left);// + 105;
                let y1 = parseInt(item.styles.top) // + 55;
                this.endX = x1; this.endY = y1;
                this.drawCircle(x1,y1,10,"red");
                this.$refs.baseNode.mouseToDrawLines(this.ctx,this.startPosition0,this.startPosition1)
                this.$refs.baseNode.mouseToDrawLines1(this.ctx,x1,y1,this.isMouseDraw)
                
            } 
        })        

      },
      mouseUpEvent(e) { 
        // 连接成功后线体变成绿色
        this.ctx.strokeStyle = "lightgreen";  
        const position = this.getCanvasPosition(e);
        let newVal = this.nodeData;
        this.endPosition0 = position.x 
        this.endPosition1 = position.y 
        this.$refs.baseNode.mouseToDrawLines1(this.ctx,this.endPosition0,this.endPosition1,this.isMouseDraw)
        newVal.forEach((item,i) => {
            let x1 = parseInt(item.styles.left) // + 105;
            let y1 = parseInt(item.styles.top) // + 55;
            this.endX = x1; this.endY = y1;
            // 如果靠近下一个节点坐标-15到15范围内就自动连接到该节点                 
            if (( position.x -  x1 <=15 && position.x -  x1 >=-15) && (position.y -  y1 <=15 && position.y -  y1 >= -15) ) {
                // 绘制结束点箭头
                this.drawArrow(this.startPosition0,this.startPosition1,x1,y1)
                this.lineDatas.push({startPoint:[this.startPosition0,this.startPosition1], endPoint:[this.endX, this.endY]});
            } 
        })    
        
        this.isMouseDraw = false;
        this.canvasLine.removeEventListener('mousemove',this.mouseMoveEvent);
        
        this.canvasDraw(this.lineDatas);
      },
      mouseOutEvent(e) {
        this.isMouseDraw = false;
      },
      //  根据保存好的数据lineDatas绘制线体
      canvasDraw(lines) {
        this.ctx.clearRect(0,0, this.canvasLine.width, this.canvasLine.height);
        lines.forEach((item,i) => {
          this.ctx.beginPath();
          this.ctx.moveTo(item.startPoint[0],item.startPoint[1]);
          this.ctx.lineTo(item.endPoint[0],item.endPoint[1]);
          // ctx.closePath(); 
          this.ctx.stroke();
          this.drawArrow(item.startPoint[0],item.startPoint[1],item.endPoint[0],item.endPoint[1])
        })
        
      },


    },
  }
  </script>
  <style lang="scss" scoped>

  </style>