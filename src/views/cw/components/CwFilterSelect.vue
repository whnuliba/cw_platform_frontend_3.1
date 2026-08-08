<template>
  <div v-bind="$attrs">
  <CwFilterSelectDropdown
      v-model="value"
      :initValue="initValue"
      :url="component.attribute.url"  
      :lazy="component.attribute.lazy==='false'?false:true"
      :selectColumn="component.attribute.id"
      :radio="()=>{ return (component.attribute.radio==='true')?true:false }"
      :loadData="(val,callback)=>{
             handlerEvent('loadData',self,val,callback)
        }"
      :itemStyle="itemStyle"
      @onChange="(result)=>{handlerEvent('onChange',result)}"
  ></CwFilterSelectDropdown>
  </div>
  </template>
<script>
import CwFilterSelectDropdown from "@/components/Cw/CwFilterSelectDropdown";
import {dispatchEvent} from "../utils/eventUtils"

export default {
  name: 'CwFilterSelect',
  components: { CwFilterSelectDropdown },
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
      style:{},
      modeValue:undefined,
      initValue:[]
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
    handlerEvent(tag,data,v2,v3){
        let args = []
        if(data)  args.push(data)
        if(v2)  args.push(v2)
        if(v3)  args.push(v3)
        //console.log(this,this.$refs,this.$refs.myrefTree)
        this.$nextTick(()=>{
          const ele = this.$el//$refs.myrefTree.$el

        if(ele){
          dispatchEvent(ele,tag,args)
        }
        })
      },
    getAttributeCols() {
        return [
          { field: 'url', title: 'url', queryType: 'input', require: false, query: true, hide: false },
          { field: 'radio', title: 'radio', queryType: 'input', require: false, query: true, hide: false },
          { field: 'lazy', title: 'lazy', queryType: 'input', require: false, query: true, hide: false },
          { field: 'id', title: 'ID标识字段', queryType: 'input', require: false, query: true, hide: false },

         ]
         },
    getStyleCols() {
      return [
        { field: 'width', title: '宽度', queryType: 'input', defaultValue: '187px', unit: 'px' },
        { field: 'height', title: '高度', queryType: 'input', defaultValue: '21px', unit: 'px' },
        { field: 'fontSize', title: '字体大小', queryType: 'input', defaultValue: '16px', unit: 'px' },
        { field: 'borderColor', title: '边框颜色', queryType: 'colorpicker', defaultValue: '#127310', },
        { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', defaultValue: '#fff', },
      ]
    },
    comText() {
      return '过滤选择器'
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
      // console.log(val)

    },
  },

}
</script>
<style lang="scss" scoped></style>