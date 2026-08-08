<template>
  <div ref="myref" v-bind="$attrs">
    <svg :viewBox="svgViewBox" :width="component.styles.width" :height="component.styles.height"
      preserveAspectRatio="none">
      <path fill-rule="nonzero" :fill="component.styles.fillColor" :d="pathData" :stroke="component.styles.color" />
      <!-- <text ref="textElement" x="45%" y="50%" text-anchor="middle" dy=".3em" font-weight="bold" font-size="8px"
        font-family="Lato, sans-serif" :fill="component.styles.textColor" :transform="textTransform">
        {{ component.attribute.text ? component.attribute.text : '' }}
      </text> -->
    </svg>
  </div>
</template>
<script>
export default {
  name: 'CwAlarmEquipmentSvg',
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
    'component.attribute.nodeLayers': {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.pathData = this.createSvgPath(newVal)
          let height = 10 + 5 + parseInt(newVal) * 10 + 5;
          this.component.styles.height = height + 'px'
          this.svgViewBox = `0 0 30 ${height}`
        }
      },
      // deep: true
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
      svgViewBox: `0 0 30 30`,
      controlPoints: [
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 200 }
      ],
      // pathData: "M14.3 1l13.3 24.7H1L14.3 1z M14.3 18.4c-0.6 0-1 0.5-1 1.1v2.5v0.1c0.1 0.7 0.6 1.1 1.3 1.1c0.5-0.1 0.9-0.5 0.9-1.1v-0.7v-0.1C15.3 17.5 14.8 18.4 14.3 18.4z M14.3 9.5c-0.6 0-1 0.5-1 1.1v6v0.1c0.1 0.7 0.6 1.2 1.3 1.1c0.5-0.1 0.9-0.5 0.9-1.1v-2.9v-0.1C15.3 8.8 14.8 9.5 14.3 9.5z",
      pathData:"m15.3,2l13.3,24.7l-26.6,0l13.3,-24.7zm0,17.4c-0.6,0 -1,0.5 -1,1.1l0,0.5l0,0.1c0.1,0.7 0.6,1.1 1.3,1.1c0.5,-0.1 0.9,-0.5 0.9,-1.1l0,-0.7l0,-0.1c-0.2,-0.5 -0.7,-0.9 -1.2,-0.9zm0,-8.9c-0.6,0 -1,0.5 -1,1.1l0,5.5l0,0.1c0.1,0.7 0.6,1.2 1.3,1.1c0.5,-0.1 0.9,-0.5 0.9,-1.1l0,-5.6l0,-0.1c-0.2,-0.7 -0.7,-1 -1.2,-1z",
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
        { field: 'width', title: '长度', queryType: 'input', defaultValue: '30px', unit: 'px' },
        { field: 'height', title: '高度', queryType: 'input', defaultValue: '30px', unit: 'px' },
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
        { field: 'adsorptionDirection', title: '吸附方向', queryType: 'select', require: false, query: true, hide: false, defaultValue: 'left-right' },
        // { field: 'nodeLayers', title: '节点层数', queryType: 'input', require: false, query: true, hide: false, defaultValue: '6' },
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
            width: "30px",
            height: "30px",
          }
        },
        [
          h('path', {
            attrs: {
              fill: "rgba(128, 128, 128, 0.7)",
              d: "m15.3,2l13.3,24.7l-26.6,0l13.3,-24.7zm0,17.4c-0.6,0 -1,0.5 -1,1.1l0,0.5l0,0.1c0.1,0.7 0.6,1.1 1.3,1.1c0.5,-0.1 0.9,-0.5 0.9,-1.1l0,-0.7l0,-0.1c-0.2,-0.5 -0.7,-0.9 -1.2,-0.9zm0,-8.9c-0.6,0 -1,0.5 -1,1.1l0,5.5l0,0.1c0.1,0.7 0.6,1.2 1.3,1.1c0.5,-0.1 0.9,-0.5 0.9,-1.1l0,-5.6l0,-0.1c-0.2,-0.7 -0.7,-1 -1.2,-1z",
              stroke: "rgba(128, 128, 128, 1)"
            }
          })
        ]
      )
    },
    ificationType() {
      return {
        classification: '调度组件(单机)',
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
    createSvgPath() {
      let containerBox = "m15.3,2l13.3,24.7l-26.6,0l13.3,-24.7zm0,17.4c-0.6,0 -1,0.5 -1,1.1l0,0.5l0,0.1c0.1,0.7 0.6,1.1 1.3,1.1c0.5,-0.1 0.9,-0.5 0.9,-1.1l0,-0.7l0,-0.1c-0.2,-0.5 -0.7,-0.9 -1.2,-0.9zm0,-8.9c-0.6,0 -1,0.5 -1,1.1l0,5.5l0,0.1c0.1,0.7 0.6,1.2 1.3,1.1c0.5,-0.1 0.9,-0.5 0.9,-1.1l0,-5.6l0,-0.1c-0.2,-0.7 -0.7,-1 -1.2,-1z";
      return containerBox;
    },
    handleDragEnd() { }
  },

}
</script>
<style lang="scss" scoped></style>