<template>
  <div ref="myref" v-bind="$attrs" class="svg-container" :style="{width: component.styles.width, height:component.styles.height, flexDirection: flexDirection }">
    <svg width="20" height="20" v-for="(item,index) in boxArr" :key="index">
    <!-- 使用 path 绘制正方形 -->
    <path d="M0 0 H20 V20 H0 Z" fill="rgba(128, 128, 128, 0.5)" stroke="rgba(128, 128, 128, 1)" stroke-width="1" />
    <!-- 在正方形中间添加数字 -->
    <text x="50%" y="69%" text-anchor="middle" fill="#000" font-size="12">{{parseInt(component.attribute.startRowNum) || parseInt(component.attribute.startRowNum) == 0 ? parseInt(component.attribute.startRowNum)+index : index+1}}</text>
  </svg>
  </div>
</template>
<script>
export default {
  name: 'CwWarehouseLocNumberSvg',
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
          this.boxNum = parseInt(newVal)
          this.boxArr = Array.from({ length: parseInt(newVal) }, (_, index) => ({
            index: index,
            // value: `Item ${index + 1}`,
            bg1color: 'white',
            bg2color: 'white',
            bg3color: 'white',
            bg4color: 'white',
          }));
          switch (this.component.attribute.nodeDirec) {
            case 1: 
            case 2: {
              this.component.styles.width = '20px'
              this.component.styles.height = this.boxNum * 20 + 'px'
              this.svgViewBox = `0 0 20 ${this.boxNum * 20}`
              break;
            }; // 从下到上
            case 3: 
            case 4: {
              this.component.styles.width = this.boxNum * 20 + 'px'
              this.component.styles.height = '20px'
              this.svgViewBox = `0 0 ${this.boxNum * 20} 20`
              break;
            }; // 从左到右
            default: {
              this.component.styles.width = '20px'
              this.component.styles.height = this.boxNum * 20 + 'px'
              this.svgViewBox = `0 0 20 ${this.boxNum * 20}`
              break;
            }; // 默认从上到下
          }
        }
      },
      deep: true,
      immediate: true
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
    'component.attribute.nodeDirec':{
      handler: function (newVal, oldVal) {
        if (newVal) {
          switch (newVal) {
            case 1: 
            case 2: {
              this.component.styles.width = '20px'
              this.component.styles.height = this.boxNum * 20 + 'px'
              this.svgViewBox = `0 0 20 ${this.boxNum * 20}`
              break;
            }; // 从下到上
            case 3: 
            case 4: {
              this.component.styles.width = this.boxNum * 20 + 'px'
              this.component.styles.height = '20px'
              this.svgViewBox = `0 0 ${this.boxNum * 20} 20`
              break;
            }; // 从左到右
            default: {
              this.component.styles.width = '20px'
              this.component.styles.height = this.boxNum * 20 + 'px'
              this.svgViewBox = `0 0 20 ${this.boxNum * 20}`
              break;
            }; // 默认从上到下
          }
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
      svgViewBox: `0 0 20 20`,
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
  },
  beforeDestroy() { },
  methods: {
    getStyleCols() {
      return [
        { field: 'width', title: '长度', queryType: 'input', defaultValue: '20px', unit: 'px' },
        { field: 'height', title: '高度', queryType: 'input', defaultValue: '20px', unit: 'px' },
        { field: 'color', title: '字体颜色', queryType: 'colorpicker', defaultValue: 'rgba(128, 128, 128, 1)', },
        { field: 'position', title: 'position', queryType: 'select', defaultValue: 'absolute', },
        { field: 'textColor', title: 'textColor', queryType: 'colorpicker', defaultValue: '#000', },
        { field: 'fillColor', title: 'fillColor', queryType: 'colorpicker', defaultValue: 'rgba(128, 128, 128, 0.7)', },
        { field: 'textRotationAngle', title: 'textRotationAngle', queryType: 'input', defaultValue: '0', },
        { field: 'bg1color', title: 'bg1color', queryType: 'colorpicker', defaultValue: '#666', },
        { field: 'bg2color', title: 'bg2color', queryType: 'colorpicker', defaultValue: '#666', },
        { field: 'bg3color', title: 'bg3color', queryType: 'colorpicker', defaultValue: '#666', },
        { field: 'bg4color', title: 'bg4color', queryType: 'colorpicker', defaultValue: '#666', },

      ]
    },
    getAttributeCols() {
      return [
        { field: 'text', title: '文本', queryType: 'input', require: false, query: true, hide: false, },
        // { field: 'adsorptionDirection', title: '吸附方向', queryType: 'select', require: false, query: true, hide: false, defaultValue: 'none' },
        { field: 'nodeDirec', title: '方向', queryType: 'select', require: false, query: true, hide: false, defaultValue: 1 },
        { field: 'z', title: '层数', queryType: 'input', require: false, query: true, hide: false, defaultValue: 1 },
        // { field: 'y', title: '列号', queryType: 'input', require: false, query: true, hide: false, },
        // { field: 'x', title: '排号', queryType: 'input', require: false, query: true, hide: false, },
        { field: 'startRowNum', title: '起始层号', queryType: 'input', require: false, query: true, hide: false, },
      ]
    },
    selectOptions() {
      return {
        adsorptionDirection: [
          { label: 'left', value: 'left' },
          { label: 'top', value: 'top' },
          { label: 'right', value: 'right' },
          { label: 'bottom', value: 'bottom' },
          { label: 'all', value: 'all' },
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
            width: "20",
            height: "20",
          }
        },
        [
          h('path', {
            attrs: {
              fill: "rgba(128, 128, 128, 0.5)",
              d: 'M0 0 H20 V20 H0 Z',
              stroke: "rgba(128, 128, 128, 1)"
            }
          }),
          h('text', {
            attrs: {
              x: "10",
              y: '14',
              'font-size':"12",
              'text-anchor':"middle"
            }
          },'1'),
         
        ]
      )
    },
    ificationType() {
      return {
        classification: '调度组件(货位)',
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
    createSvgPath() {
      let containerBox = "M0 0 H20 V20 H0 Z";
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