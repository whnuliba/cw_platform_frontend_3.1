<template>
  <div ref="myref" v-bind="$attrs">
    <svg :viewBox="svgViewBox" :width="component.styles.width" :height="component.styles.height"
      preserveAspectRatio="none">
      <path fill-rule="nonzero" :fill="component.styles.fillColor" :d="pathData" :stroke="component.styles.color" />
      <text ref="textElement" x="45%" y="50%" text-anchor="middle" dy=".3em" font-weight="bold" font-size="8px"
        font-family="Lato, sans-serif" :fill="component.styles.textColor" :transform="textTransform">
        {{ component.attribute.text ? component.attribute.text : '' }}
      </text>
    </svg>
  </div>
</template>
<script>
export default {
  name: 'CwVerticalEndTopContactSvg',
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
      svgViewBox: `0 0 30 ${parseInt(this.component.attribute.nodeLayers) * 10 + 20}`,
      controlPoints: [
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 200 }
      ],
      // pathData: "M0 0 L30 0 L30 80 L0 80 L0 0z M5 0 L5 5 L15 10 L25 5 L25 0 L15 5z M5 10 L5 75 L25 75 L25 10z M5 16 L5 19 L9 19 L9 20 L21 20 L21 19 L25 19 L25 17 L21 17 L21 16 L9 16 L9 17 L5 17z M5 26 L5 29 L9 29 L9 30 L21 30 L21 29 L25 29 L25 27 L21 27 L21 26 L9 26 L9 27 L5 27z M5 36 L5 39 L9 39 L9 40 L21 40 L21 39 L25 39 L25 37 L21 37 L21 36 L9 36 L9 37 L5 37z M5 46 L5 49 L9 49 L9 50 L21 50 L21 49 L25 49 L25 47 L21 47 L21 46 L9 46 L9 47 L5 47z M5 56 L5 59 L9 59 L9 60 L21 60 L21 59 L25 59 L25 57 L21 57 L21 56 L9 56 L9 57 L5 57z M5 66 L5 69 L9 69 L9 70 L21 70 L21 69 L25 69 L25 67 L21 67 L21 66 L9 66 L9 67 L5 67z",
      pathData: this.createSvgPath(this.component.attribute.nodeLayers),
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
        { field: 'text', title: '文本', queryType: 'input', require: false, query: true, hide: false, },
        { field: 'adsorptionDirection', title: '吸附方向', queryType: 'select', require: false, query: true, hide: false, defaultValue: 'top-bottom' },
        { field: 'nodeLayers', title: '节点层数', queryType: 'input', require: false, query: true, hide: false, defaultValue: '6' },
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
            height: "80px",
          }
        },
        [
          h('path', {
            attrs: {
              fill: "rgba(128, 128, 128, 0.7)",
              d: "M0 0 L30 0 L30 80 L5 80 L5 50 L0 50z M5 0 L5 5 L15 10 L25 5 L25 0 L15 5z M5 10 L5 75 L25 75 L25 10z M5 16 L5 19 L9 19 L9 20 L21 20 L21 19 L25 19 L25 17 L21 17 L21 16 L9 16 L9 17 L5 17z M5 26 L5 29 L9 29 L9 30 L21 30 L21 29 L25 29 L25 27 L21 27 L21 26 L9 26 L9 27 L5 27z M5 36 L5 39 L9 39 L9 40 L21 40 L21 39 L25 39 L25 37 L21 37 L21 36 L9 36 L9 37 L5 37z M5 46 L5 49 L9 49 L9 50 L21 50 L21 49 L25 49 L25 47 L21 47 L21 46 L9 46 L9 47 L5 47z M5 56 L5 59 L9 59 L9 60 L21 60 L21 59 L25 59 L25 57 L21 57 L21 56 L9 56 L9 57 L5 57z M5 66 L5 69 L9 69 L9 70 L21 70 L21 69 L25 69 L25 67 L21 67 L21 66 L9 66 L9 67 L5 67z",
              stroke: "rgba(128, 128, 128, 1)"
            }
          })
        ]
      )
    },
    changeWidthHeight(val) {
      return ['height', 10 + 5 + parseInt(val) * 10 + 5]
    },
    ificationType() {
      return {
        classification: '调度组件(输送线)',
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
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        //let outBox = `M 0 0  v ${width-length} h ${boxSize} v ${length} h ${length-boxSize}  v ${-width}  h ${-length} z  M ${boxSize} 0 v ${boxSize} l ${(length-boxSize*2)/2} ${interval-boxSize} l ${(length-boxSize*2)/2} ${-(interval-boxSize)} v ${-boxSize} l ${-(length-boxSize*2)/2} ${(interval-boxSize)} z `
        let outBox = `M 0 0  h ${length} v ${width} h ${
          -length + boxSize
        } v ${-length} h ${-boxSize} v${length - width} z  M ${boxSize} 0 v ${boxSize} l ${
          (length - boxSize * 2) / 2
        } ${interval - boxSize} l ${(length - boxSize * 2) / 2} ${-(
          interval - boxSize
        )} v ${-boxSize} l ${-(length - boxSize * 2) / 2} ${interval - boxSize} L ${boxSize} 0 z `;

        let innerBox = `M ${boxSize} ${interval} v ${width - (interval + boxSize)} h ${
          length - boxSize * 2
        } v  ${-(width - (interval + boxSize))} h ${boxSize * 2 - length} z`;

        let direction1 = `m 0 ${dirSiz} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;

        let direction = `m 0 ${dirSiz + cellSize} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h} v ${-contact_w} z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      },
    handleDragEnd() { }
  },

}
</script>
<style lang="scss" scoped></style>