<template>
  <div ref="myref" v-bind="$attrs" class="svg-cwregionalboxsvg-container">
    <svg  :width="component.styles.width" :height="component.styles.height"  preserveAspectRatio="none">
      <!-- 使用 path 绘制正方形 -->
      <path fill-rule="nonzero" :d="`M0 0 H${parseInt(component.styles.width,10)} V${parseInt(component.styles.height,10)} H0 Z`" :fill="component.styles.fillColor" :stroke="component.styles.color" stroke-width="1" />
        <text ref="textElement" vector-effect="non-scaling-stroke"  x="50%" y="50%" text-anchor="middle" dy=".3em" font-weight="bold" font-size="8px"
          font-family="Lato, sans-serif" :fill="component.styles.textColor" :transform="textTransform">
          {{ component.attribute.text ? component.attribute.text : '' }}
        </text>
    </svg>

  </div>
</template>
<script>
export default {
  name: 'CwRegionalBoxSvg',
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
   
    'component.styles.textRotationAngle': {
      handler() {
        this.updateTextTransform();
      },
      // deep: true
    }
  },
  data() {
    return {
      methods: {},
      vueContext: {},
      txtVal: '',
      textTransform:'',
      svgViewBox: `0 0 20 20`,
      controlPoints: [
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 200 }
      ],
      pathData: "M0 0 L0 20 L20 20 L20 0z M19.5 19.5 L0.5 19.5 L0.5 0.5 L19.5 0.5z",
      // pathData: this.createSvgPath(6),
      draggingIndex: null,
      startX: 0,
      startY: 0
    };
  },
  created() {
  },
  mounted() {
    this.updateTextTransform();
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
      ]
    },
    getAttributeCols() {
      return [
        { field: 'text', title: '文本', queryType: 'input', require: false, query: true, hide: false, },
        // { field: 'adsorptionDirection', title: '吸附方向', queryType: 'select', require: false, query: true, hide: false, defaultValue: 'none' },
        // { field: 'nodeLayers', title: '节点层数', queryType: 'input', require: false, query: true, hide: false, defaultValue: '6' },
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
        ]
      }
    },
    comText() {
      return '输送线(右)'
    },
    comSvg(h) {
      return h(
        'svg',
        {
          attrs: {
            width: "20px",
            height: "20px",
          }
        },
        [
          h('path', {
            attrs: {
              fill: "rgba(128, 128, 128, 0.7)",
              d: "M0 0 L0 20 L20 20 L20 0z M19.5 19.5 L0.5 19.5 L0.5 0.5 L19.5 0.5z",
              stroke: "rgba(128, 128, 128, 1)"
            }
          })
        ]
      )
    },
    ificationType() {
      return {
        classification: '调度组件(其他)',
        isCanvasview: true,
      }
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
    createSvgPath(createCount = 6, length = 30) {
      let containerBox = "M0 0 H20 V20 H0 Z";
      return containerBox;
    },
    handleDragEnd() { }
  },

}
</script>
<style lang="scss" scoped></style>