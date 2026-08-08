<template>
  <div ref="myref" class="dyn-myImage" v-bind="$attrs">
    {{txtVal ? txtVal : (component.attribute.txtName ? commonI18n(component.attribute.txtName) ? commonI18n(component.attribute.txtName) : component.attribute.txtName : '文本')}}
  </div>
</template>
<script>
export default {
  name: 'CwText',
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
    component:{
        type: Object,
        default: () =>{}
      },
    bindData:{
      type: Object,
      default: () =>{}
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
  },
  data() {
    return {
      methods:{},
      vueContext:{},
      value: this.componentModalObj[this.fieldName],
      txtVal: ''
    };
  },
  mounted() {

  },
  beforeDestroy() { },

  methods: {
    getStyleCols() {
      return [
        { field: 'width', title: '长度', queryType: 'input', defaultValue: '187px', unit: 'px' },
        { field: 'height', title: '高度', queryType: 'input', defaultValue: '21px', unit: 'px' },
        { field: 'fontSize', title: '字体大小', queryType: 'input', defaultValue: '16px', unit: 'px' },
        { field: 'fontWeight', title: '字体粗细', queryType: 'input', defaultValue: '100' },
        { field: 'color', title: '字体颜色', queryType: 'colorpicker', defaultValue: '#000', },
        { field: 'borderColor', title: '边框颜色', queryType: 'colorpicker', defaultValue: '#127310', },
        { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', defaultValue: '#fff', },
      ]
    },
    getAttributeCols() {
        return [
          { field: 'txtName', title: '文本名称', queryType: 'input', require: false, query: true, hide: false },
        ]
      },
    comText() {
      return '文本'
    },
    ificationType() {
      return {
        classification: '基础组件',
        isCanvasview: false,
      }
    },
    handleDragStart(event) {
      event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY }));
    },
    handleDragEnd() { }
  },
  created() {
    this.comText();
  }
}
</script>
<style lang="scss" scoped></style>