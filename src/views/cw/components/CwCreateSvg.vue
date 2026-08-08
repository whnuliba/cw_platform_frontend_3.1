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
  name: 'CwCreateSvg',
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
          let width = 10 + 5 + parseInt(newVal) * 10 + 5;
          this.component.styles.width = width + 'px'
          this.svgViewBox = `0 0 ${width} 30`
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
      svgViewBox: `0 0 ${parseInt(this.component.attribute.nodeLayers) * 10 + 20} 30`,
      controlPoints: [
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 200 }
      ],
      // pathData: "M0 0 L79 0 L79 30 L0 30 L10 15 L0 0z L0 4 L8 15 L0 26 L0 30z M10 4 L75 4 L75 26 L10 26z M16 4 L19 4 L19 8 L20 8 L20 22 L19 22 L19 26 L17 26 L17 22 L16 22 L16 8 L17 8 L17 4z M26 4 L29 4 L29 8 L30 8 L30 22 L29 22 L29 26 L27 26 L27 22 L26 22 L26 8 L27 8 L27 4z M36 4 L39 4 L39 8 L40 8 L40 22 L39 22 L39 26 L37 26 L37 22 L36 22 L36 8 L37 8 L37 4z M46 4 L49 4 L49 8 L50 8 L50 22 L49 22 L49 26 L47 26 L47 22 L46 22 L46 8 L47 8 L47 4z M56 4 L59 4 L59 8 L60 8 L60 22 L59 22 L59 26 L57 26 L57 22 L56 22 L56 8 L57 8 L57 4z M66 4 L69 4 L69 8 L70 8 L70 22 L69 22 L69 26 L67 26 L67 22 L66 22 L66 8 L67 8 L67 4z",
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
        { field: 'width', title: '长度', queryType: 'input', defaultValue: '80px', unit: 'px' },
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
            width: "80px",
            height: "30px",
          }
        },
        [
          h('path', {
            attrs: {
              fill: "rgba(128, 128, 128, 0.7)",
              d: "M0 0 L79 0 L79 30 L0 30 L10 15 L0 0z L0 4 L8 15 L0 26 L0 30z M10 4 L75 4 L75 26 L10 26z M16 4 L19 4 L19 8 L20 8 L20 22 L19 22 L19 26 L17 26 L17 22 L16 22 L16 8 L17 8 L17 4z M26 4 L29 4 L29 8 L30 8 L30 22 L29 22 L29 26 L27 26 L27 22 L26 22 L26 8 L27 8 L27 4z M36 4 L39 4 L39 8 L40 8 L40 22 L39 22 L39 26 L37 26 L37 22 L36 22 L36 8 L37 8 L37 4z M46 4 L49 4 L49 8 L50 8 L50 22 L49 22 L49 26 L47 26 L47 22 L46 22 L46 8 L47 8 L47 4z M56 4 L59 4 L59 8 L60 8 L60 22 L59 22 L59 26 L57 26 L57 22 L56 22 L56 8 L57 8 L57 4z M66 4 L69 4 L69 8 L70 8 L70 22 L69 22 L69 26 L67 26 L67 22 L66 22 L66 8 L67 8 L67 4z",
              stroke: "rgba(128, 128, 128, 1)"
            }
          })
        ]
      )
    },
    changeWidthHeight(val) {
      return ['width', 10 + 5 + parseInt(val) * 10 + 5]
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
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        let outBox = `M 0 0 h ${width} v ${length} h ${-width} v ${-length} v ${length} l ${interval} ${
          -length / 2
        } l ${-interval}  ${-length / 2} z v ${contact_h} l ${interval - 2}  ${
          (length - 8) / 2
        } l ${-(interval - 2)} ${(length - 8) / 2} v ${contact_h} z`;

        let innerBox = `M ${interval} ${boxSize} h ${width - (interval + boxSize)} v ${
          length - boxSize * 2
        } h  ${-(width - (interval + boxSize))} v ${ boxSize * 2 - length } z`;
        let direction1 = `m ${dirSiz} 0 h ${
          boxSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -boxSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h} h ${contact_w*3 -boxSize} z`;

        //let direction = `m ${dirSiz+boxSize} 0 h ${boxSize} v ${length-boxSize*2} h ${-boxSize} z`
        let direction = `m ${dirSiz + boxSize} 0 h ${
          boxSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -boxSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h} h ${-2} z`;

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