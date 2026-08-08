<template>
    <CwInputs v-bind="$attrs" v-model="value" :itemStyle="itemStyle" @input="(val) => { inputchange(val) }" @change="change"/>
</template>
<script>
import CwInputs from "@/components/Cw/CwInput.vue"
  import {dispatchEvent} from "../utils/eventUtils"

export default {
  name: 'CwInput',
  components: { CwInputs },
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
    getStyleCols() {
      return [
        { field: 'width', title: '宽度', queryType: 'input', defaultValue: '187px', unit: 'px' },
        { field: 'height', title: '高度', queryType: 'input', defaultValue: '21px', unit: 'px' },
        { field: 'fontSize', title: '字体大小', queryType: 'input', defaultValue: '16px', unit: 'px' },
        { field: 'borderColor', title: '边框颜色', queryType: 'colorpicker', defaultValue: '#127310', },
        { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', defaultValue: '#fff', },
      ]
    },
    getAttributeCols() {
      return [
        { field: 'placeholder', title: 'placeholder', queryType: 'input', require: false, query: true, hide: false },
      ]
    },
    comText() {
      return '输入框'
    },
    ificationType() {
      return {
        classification: '表单组件',
        isCanvasview: false,
      }
    },
    handleDragStart(event) {
      // event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY, action: 'setLocation', compId: this.compId }));

    },
    handleDragEnd() { },
    inputchange(val) {
       //console.log(val)

    },
    change(val){
      this.handlerEvent('changeEnter',val)
    },
    handlerEvent(tag,v1,v2,v3,v4){
        let args = []
        if(v1)  args.push(v1)
        if(v2)  args.push(v2)
        if(v3)  args.push(v3)
        if(v4)  args.push(v4)
        this.$nextTick(()=>{
            const ele = this.$el//$refs.myrefTree.$el
            if(ele){
              dispatchEvent(ele,tag,args)
            }
        })
      },
  },

}
</script>
<style lang="scss" scoped></style>