<template>
   <component  :is="editScript" ref="scriptsEditer" :scriptsEditer="scriptsEditer" @changeScript="setScript" :codeStyle="itemStyle"> </component ></template>
<script>
import EditScript from '@/components/EditScript'
export default {
  name: 'CwCodeEditor',
  components: { EditScript },
  props: {
    itemStyle: {
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
    itemVal: {
      type: String,
      default: ''
    },
    compId: {
      type: String,
      default: ''
    },
    fieldName: {
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
  },
  data() {
    return {
      methods:{},
      vueContext:{},
      editScript: EditScript,
      scriptsEditer:'',
      value: this.componentModalObj[this.fieldName],
      compVal: '',

    };
  },
  watch: {
    compVal: {
      handler: function (newVal, oldVal) {
        if (newVal) {
        }
      },
      deep: true
    },
    itemStyle: {
      handler: function (newVal, oldVal) {
        if (newVal) {
        }
      },
      deep: true
    },
  },
  computed: {},
  created() {
    this.comText();
  },
  mounted() {
  },
  beforeDestroy() { },
  methods: {
    setScript(data){
        this.scriptsEditer = data
    },
    saveScript(){
      this.saveprint()
    },
    getStyleCols() {
      return [
        { field: 'width', title: '宽度', queryType: 'input', defaultValue: '500px', unit: 'px' },
        { field: 'height', title: '高度', queryType: 'input', defaultValue: '600px', unit: 'px' },
        { field: 'fontSize', title: '字体大小', queryType: 'input', defaultValue: '16px', unit: 'px' },
        { field: 'borderColor', title: '边框颜色', queryType: 'colorpicker', defaultValue: '#127310', },
        { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', defaultValue: '#fff', },
      ]
    },
    comText() {
      return 'CodeEditor'
    },
    ificationType() {
      return {
        classification: '布局容器组件',
        isCanvasview: false,
      }
    },
    handleDragStart(event) {
      // event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY, action: 'setLocation', compId: this.compId }));

    },
    handleDragEnd() { },
    inputchange(val) {
      // console.log(val)

    },
  },

}
</script>
<style lang="scss" scoped></style>