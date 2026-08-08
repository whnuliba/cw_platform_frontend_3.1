<template>
  <div ref="myref" v-bind="$attrs" class="svg-container" >
    <svg :viewBox="svgViewBox" :width="component.styles.width" :height="component.styles.height">
    <!-- 使用 path 绘制正方形 -->
    <path fill-rule="nonzero" d="M 40,40m-39,0a39,39.00156 0 1 0 78,0a39,39.00156 0 1 0 -78,0 Z" fill="rgba(128, 128, 128, 0.5)" stroke="rgba(128, 128, 128, 1)" stroke-width="1" />
   
    <!-- 在正方形中间添加数字 -->
    <text x="50%" y="50%" text-anchor="middle" fill="#000" font-size="12">节点1</text>
  </svg>
  </div>
</template>
<script>
export default {
  name: 'CwProcessNodeSvg',
  components: {},
  props: {
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
    itemStyle: {
      type: Object,
      default: () => {
        return { width: "100px", height: "100px", backgroundColor: "aqua" }
      }
    },
    component: {
      type: Object,
      default: () => { }
    },
    bindData: {
      type: Object,
      default: () => { }
    },
  },
  computed: {
    flexDirection() {
      switch (this.component.attribute.nodeDirec) {
        case 1: return 'column-reverse'; // 从下到上
        case 2: return 'column'; // 从上到下
        case 3: return 'row'; // 从左到右
        case 4: return 'row-reverse'; // 从右到左
        default: return 'column'; // 默认从上到下
      }
    }
  },
  watch: {
    itemStyle: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          for (let i in newVal) {
            this.$refs.myref.style[i] = newVal[i]
          }
        }
      },
      deep: true
    },
    boxArr: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          let elementCode = this.component.elementCode ? JSON.parse(this.component.elementCode) : {}
          this.component.elementCode = JSON.stringify({...elementCode, boxArr: this.boxArr})

        }
      },
      deep: true
    },
    'component.attribute.z': {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.component.styles.height = parseInt(newVal) * 20 + 'px'
          this.boxNum = parseInt(newVal)
          this.boxArr = Array.from({ length: parseInt(newVal) }, (_, index) => ({
            index: index,
            // value: `Item ${index + 1}`,
            bg1color: 'white',
            bg2color: 'white',
            bg3color: 'white',
            bg4color: 'white',
          }));
        }
      },
      // deep: true
    },
    'component.styles': {
      handler: function (newVal, oldVal) {
        if (newVal.bg1color !== oldVal.bg1color && this.clickNum !== null) {
          this.boxArr[this.clickNum].bg1color = newVal.bg1color
        }else if (newVal.bg2color !== oldVal.bg2color) {
          this.boxArr[this.clickNum].bg2color = newVal.bg2color
        }else if (newVal.bg3color !== oldVal.bg3color) {
          this.boxArr[this.clickNum].bg3color = newVal.bg3color
        }else if (newVal.bg4color !== oldVal.bg4color) {
          this.boxArr[this.clickNum].bg4color = newVal.bg4color
        }
      },
      // deep: true
    },
    'component.elementCode':{
      handler: function (newVal, oldVal) {
        if (newVal) {
        }
      },
      // deep: true
    },
  },
  data() {
    return {
      methods: {},
      vueContext: {},
      txtVal: '',
      svgViewBox: `0 0 40 40`,
      controlPoints: [
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 200 }
      ],
      draggingIndex: null,
      startX: 0,
      startY: 0,
      boxNum: parseInt(this.component.attribute.z),
      boxArr: [{
        index: 0,
        bg1color: 'white',
        bg2color: 'white',
        bg3color: 'white',
        bg4color: 'white',
      }],
      clickNum:null,
      outerSquarePath: 'M 0 0 H 20 V 20 H 0 Z',
      smallSquarePath1: 'M 2 2 H 10 V 10 H 2 Z',
      smallSquarePath2: 'M 10 2 H 18 V 10 H 10 Z',
      smallSquarePath3: 'M 2 10 H 10 V 18 H 2 Z',
      smallSquarePath4: 'M 10 10 H 18 V 18 H 10 Z'
    };
  },
  created() {
    // this.component.elementCode = JSON.stringify({
    //   boxArr: this.boxArr,
    // })
    if(this.component.elementCode){
      this.boxArr =  eval("("+this.component.elementCode+")").boxArr
    }

  },
  mounted() {
    this.updateTextTransform();
  },
  beforeDestroy() { },
  methods: {
    getStyleCols() {
      return [
        { field: 'width', title: '长度', queryType: 'input', defaultValue: '80px', unit: 'px' },
        { field: 'height', title: '高度', queryType: 'input', defaultValue: '80px', unit: 'px' },
        { field: 'color', title: '字体颜色', queryType: 'colorpicker', defaultValue: 'rgba(128, 128, 128, 1)', },
        { field: 'position', title: 'position', queryType: 'select', defaultValue: 'absolute', },
        { field: 'textColor', title: 'textColor', queryType: 'colorpicker', defaultValue: '#000', },
        { field: 'fillColor', title: 'fillColor', queryType: 'colorpicker', defaultValue: 'rgba(128, 128, 128, 0.7)', },
        { field: 'textRotationAngle', title: 'textRotationAngle', queryType: 'input', defaultValue: '0', },

      ]
    },
    getAttributeCols() {
      return [
        { field: 'text', title: '工艺节点', queryType: 'select', require: false, query: true, hide: false, defaultValue: '节点1' },
        { field: 'processTemplate', title: '节点模板', queryType: 'input', require: false, query: true, hide: false, defaultValue: '无' },
        { field: 'nodeLabel', title: '工艺编码', queryType: 'input', require: false, query: true, hide: false, defaultValue: '无' },
      ]
    },
    selectOptions() {
      return {
        adsorptionDirection: [
          { label: 'left-right', value: 'left' },
          { label: 'top-bottom', value: 'top' },
          { label: 'none', value: 'none' },
        ],
        position: [
          { label: 'absolute', value: 'absolute' },
          { label: 'relative', value: 'relative' },
          { label: 'fixed', value: 'fixed' },
          { label: 'static', value: 'static' },
          { label: 'inherit', value: 'inherit' },
        ],
        nodeDirec: [
          { label: "从下到上", value: 1 },
          { label: "从上到下", value: 2 },
          { label: "从左到右", value: 3 },
          { label: "从右到左", value: 4 },
        ],
      }
    },
    comText() {
      return '库位'
    },
    comSvg(h) {
      return h(
        'svg',
        {
          attrs: {
            width: "80",
            height: "80",
            display: "block",
          },
        },
        [
          h('path', {
            attrs: {
              fill: "rgba(128, 128, 128, 0.5)",
              d: 'M 40,40m-39,0a39,39.00156 0 1 0 78,0a39,39.00156 0 1 0 -78,0 Z',
              stroke: "rgba(128, 128, 128, 1)"
            }
          }),
          h('text', {
            attrs: {
              x: "50%",
              y: '55%',
              'font-size':"14",
              'text-anchor':"middle"
            }
          },'节点1'),
         
        ]
      )
    },
    ificationType() {
      return {
        classification: '调度组件(单机)',
        isCanvasview: true,
      }
    },
    svgClick(index){
      this.clickNum = index
      this.component.styles.bg1color = this.boxArr[index].bg1color
      this.component.styles.bg2color = this.boxArr[index].bg2color
      this.component.styles.bg3color = this.boxArr[index].bg3color
      this.component.styles.bg4color = this.boxArr[index].bg4color
      // this.boxArr[index]
    },
    handleDragStart(event) {
      event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY }));
    },
    updateTextTransform() {
      const textElement = this.$refs.textElement;
      if (textElement) {
        // 获取文字元素的边界框
        const bbox = textElement.getBBox();
        const centerX = bbox.x + bbox.width / 2;
        const centerY = bbox.y + bbox.height / 2;
        const angle = this.component.styles.textRotationAngle;
        this.textTransform = `translate(${centerX}, ${centerY}) rotate(${angle}) translate(${-centerX}, ${-centerY})`;
      }
    },
    generateCombinedPath() {
      const outerSquarePath = `M 0 0 H 100 V 100 H 0 Z`;
      const smallSquareSize = 40;
      const smallSquarePath1 = `M 10 10 H 50 V 50 H 10 Z`;
      const smallSquarePath2 = `M 50 10 H 90 V 50 H 50 Z`;
      const smallSquarePath3 = `M 10 50 H 50 V 90 H 10 Z`;
      const smallSquarePath4 = `M 50 50 H 90 V 90 H 50 Z`;
      // "M 0 0 H 100 V 100 H 0 Z M 10 10 H 50 V 50 H 10 Z M 50 10 H 90 V 50 H 50 Z M 10 50 H 50 V 90 H 10 Z M 50 50 H 90 V 90 H 50 Z"
      this.combinedPath = `${outerSquarePath} ${smallSquarePath1} ${smallSquarePath2} ${smallSquarePath3} ${smallSquarePath4}`;
    },
    createSvgPath() {
      let containerBox = "M 40,40m-39,0a39,39.00156 0 1 0 78,0a39,39.00156 0 1 0 -78,0 Z"
      return containerBox;
    },
    handleDragEnd() { }
  },

}
</script>
<style lang="scss" scoped>
// .warehouseLocationSvg{
//   display: block;
// }
.svg-container {
  display: flex;
  flex-direction: column-reverse;
}
</style>