<template>
  <div ref="myref" v-bind="$attrs">
    <svg :viewBox="svgViewBox" :width="component.styles.width" :height="component.styles.height"
      preserveAspectRatio="none">
      <path fill-rule="nonzero" :fill="component.styles.fillColor" :d="pathData" :stroke="component.styles.color" />
      <text ref="textElement" x="30%" y="50%" text-anchor="middle" dy=".3em" font-weight="bold"
        font-size="8px" font-family="Lato, sans-serif" :fill="component.styles.textColor"
        :transform="textTransform">
        {{ component.attribute.text ? component.attribute.text : '' }}
      </text>
    </svg>
  </div>
</template>
<script>
export default {
  name: 'CwDoubleStockerSvg',
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
          let width = parseInt(newVal) * 10 + 30;
          this.component.styles.width = width + 'px'
          this.svgViewBox = `0 0 ${width} 55`
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
      svgViewBox: `0 0 ${parseInt(this.component.attribute.nodeLayers) * 10 + 30} 55`,
      controlPoints: [
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 200 }
      ],
      // pathData: "M0 20 L10 20 L10 0 L50 0 L50 20 L70 20 L70 25 L90 25 L90 30 L70 30 L70 35 L50 35 L50 55 L10 55 L10 35 L0 35z M14 4 L16 4 L16 49 L14 49z M24 4 L26 4 L26 49 L24 49z M34 4 L36 4 L36 49 L34 49z M44 4 L46 4 L46 49 L44 49z",
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
        { field: 'width', title: '长度', queryType: 'input', defaultValue: '90px', unit: 'px' },
        { field: 'height', title: '高度', queryType: 'input', defaultValue: '55px', unit: 'px' },
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
        // { field: 'adsorptionDirection', title: '吸附方向', queryType: 'select', require: false, query: true, hide: false, defaultValue: 'left' },
        { field: 'nodeLayers', title: '节点层数', queryType: 'input', require: false, query: true, hide: false, defaultValue: '6' },
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
    
    comSvg(h){
      return h(
        'svg',
        {
          attrs: {
            width:"90px",
            height:"55px",
          }
        },
        [
          h('path', {
            attrs: {
              fill:"rgba(128, 128, 128, 0.7)",
              d:"M0 20 L10 20 L10 0 L50 0 L50 20 L70 20 L70 25 L90 25 L90 30 L70 30 L70 35 L50 35 L50 55 L10 55 L10 35 L0 35z M14 4 L16 4 L16 49 L14 49z M24 4 L26 4 L26 49 L24 49z M34 4 L36 4 L36 49 L34 49z M44 4 L46 4 L46 49 L44 49z",
              stroke:"rgba(128, 128, 128, 1)"
            }
          })
        ]
      )
    },

    ificationType() {
      return {
        classification: '调度组件(堆垛机)',
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
      // 外框
      let boxSize = 20;
      let boxHeight = 60;
      let interval = 5;
      let dirSiz = 10;
      let width = createCount * 10;
      let contact_w = 4;
      let contact_h = 2;
      let offsetY = 20; 
      let a = dirSiz + (dirSiz * 2) + (width)
      // 外框路径
      let outBox = `M 0 ${offsetY} h ${dirSiz} v ${-dirSiz * 2} h ${boxSize + dirSiz * 2} v ${dirSiz * 2
        } h ${dirSiz * 2} v ${boxHeight / 2 - dirSiz * 2 - interval} h  ${width - dirSiz * 2 - boxSize
        } v ${interval}
           h ${-(width - dirSiz * 2 - boxSize)}  v ${boxHeight / 2 - dirSiz * 2 - interval
        } h ${-dirSiz * 2} v ${dirSiz * 2} h  ${-(boxSize + dirSiz * 2)} v ${-dirSiz * 2
        } h ${-dirSiz} v ${dirSiz * 4 + interval - boxHeight} z`;

      // 内框路径
      let innerBox = `M ${dirSiz + contact_w} ${-dirSiz * 2 + contact_w + offsetY
        } h ${contact_h} v ${boxHeight - dirSiz - interval} h ${-contact_h} v ${dirSiz + interval - boxHeight} z
                M ${dirSiz - contact_w - contact_h + boxSize} ${-dirSiz * 2 + contact_w + offsetY
        } h ${contact_h} v ${boxHeight - dirSiz - interval} h ${-contact_h} v ${dirSiz + interval - boxHeight} z
                m ${dirSiz} 0 h ${contact_h} v ${boxHeight - dirSiz - interval
        } h ${-contact_h} v ${dirSiz + interval - boxHeight} z
                M ${dirSiz - contact_w - contact_h + boxSize + dirSiz * 2} ${-dirSiz * 2 + contact_w + offsetY
        } h ${contact_h} v ${boxHeight - dirSiz - interval} h ${-contact_h} v ${dirSiz + interval - boxHeight} z `;
      let containerBox = `${outBox} ${innerBox}`;
      return containerBox;
    },

    handleDragEnd() { }
  },

}
</script>
<style lang="scss" scoped></style>