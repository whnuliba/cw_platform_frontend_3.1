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
  name: 'CwSingleStockerSvg',
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
          let width = parseInt(newVal) * 10 + 31;
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
      svgViewBox: `0 0 60 46`,
      controlPoints: [
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 200 }
      ],
      pathData: "m47.8,20.8c-0.4,0 -0.8,-0.3 -0.8,-0.8l0,-3l-11.3,0c-2.1,0 -3.8,-1.7 -3.8,-3.8l0,0l0,-11.2l-15,0l0,11.3c0,2.1 -1.7,3.8 -3.8,3.8l0,0l-11.1,0l0,15l11.3,0c2.1,0 3.8,1.7 3.8,3.8l0,11.3l15,0l0,-11.3c0,-2.1 1.7,-3.8 3.8,-3.8l11.1,0l0,-3c0,-0.4 0.3,-0.8 0.8,-0.8l14.2,0l0,-7.5l-14.2,0zm-5.7,9l-35.2,0l0,-1.5l35.2,0l0,1.5zm0,-9l-35.2,0l0,-1.5l35.2,0l0,1.5z",
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
        { field: 'width', title: '长度', queryType: 'input', defaultValue: '60px', unit: 'px' },
        { field: 'height', title: '高度', queryType: 'input', defaultValue: '46px', unit: 'px' },
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
    
    comSvg(h){
      return h(
        'svg',
        {
          attrs: {
            width:"60px",
            height:"46px",
          }
        },
        [
          h('path', {
            attrs: {
              fill:"rgba(128, 128, 128, 0.7)",
              d: "m47.8,20.8c-0.4,0 -0.8,-0.3 -0.8,-0.8l0,-3l-11.3,0c-2.1,0 -3.8,-1.7 -3.8,-3.8l0,0l0,-11.2l-15,0l0,11.3c0,2.1 -1.7,3.8 -3.8,3.8l0,0l-11.1,0l0,15l11.3,0c2.1,0 3.8,1.7 3.8,3.8l0,11.3l15,0l0,-11.3c0,-2.1 1.7,-3.8 3.8,-3.8l11.1,0l0,-3c0,-0.4 0.3,-0.8 0.8,-0.8l14.2,0l0,-7.5l-14.2,0zm-5.7,9l-35.2,0l0,-1.5l35.2,0l0,1.5zm0,-9l-35.2,0l0,-1.5l35.2,0l0,1.5z",
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
      let offsetY = 20; // 新增：整体下降20个单位
      let a = dirSiz + (dirSiz * 2) + (width)
      // 外框路径
      let outBox = `M 0 ${offsetY} h ${dirSiz} v ${-dirSiz * 2} h ${boxSize + dirSiz * 2} v ${dirSiz * 2
        } h ${dirSiz * 2} v ${boxHeight / 2 - dirSiz * 2 - interval} h  ${width - dirSiz * 2 - boxSize
        } v ${interval}
           h ${-(width - dirSiz * 2 - boxSize)}  v ${boxHeight / 2 - dirSiz * 2 - interval
        } h ${-dirSiz * 2} v ${dirSiz * 2} h  ${-(boxSize + dirSiz * 2)} v ${-dirSiz * 2
        } h ${-dirSiz} z`;

      // 内框路径
      let innerBox = `M ${dirSiz + contact_w} ${-dirSiz * 2 + contact_w + offsetY
        } h ${contact_h} v ${boxHeight - dirSiz - interval} h ${-contact_h} z
                M ${dirSiz - contact_w - contact_h + boxSize} ${-dirSiz * 2 + contact_w + offsetY
        } h ${contact_h} v ${boxHeight - dirSiz - interval} h ${-contact_h} z
                m ${dirSiz} 0 h ${contact_h} v ${boxHeight - dirSiz - interval
        } h ${-contact_h} z
                M ${dirSiz - contact_w - contact_h + boxSize + dirSiz * 2} ${-dirSiz * 2 + contact_w + offsetY
        } h ${contact_h} v ${boxHeight - dirSiz - interval} h ${-contact_h} z `;
      let containerBox = "m47.8,20.8c-0.4,0 -0.8,-0.3 -0.8,-0.8l0,-3l-11.3,0c-2.1,0 -3.8,-1.7 -3.8,-3.8l0,0l0,-11.2l-15,0l0,11.3c0,2.1 -1.7,3.8 -3.8,3.8l0,0l-11.1,0l0,15l11.3,0c2.1,0 3.8,1.7 3.8,3.8l0,11.3l15,0l0,-11.3c0,-2.1 1.7,-3.8 3.8,-3.8l11.1,0l0,-3c0,-0.4 0.3,-0.8 0.8,-0.8l14.2,0l0,-7.5l-14.2,0zm-5.7,9l-35.2,0l0,-1.5l35.2,0l0,1.5zm0,-9l-35.2,0l0,-1.5l35.2,0l0,1.5z";
      return containerBox;
    },

    handleDragEnd() { }
  },

}
</script>
<style lang="scss" scoped></style>