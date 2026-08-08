<template>
  <div v-bind="$attrs">
  <CwUserDropdown
   :selectRange="component.attribute.selectRange===undefined?[300]:component.attribute.selectRange.split(',')"  v-model="value" :orgType="component.attribute.orgType||300"
      :initValue="initValue"
      :selectColumn="selectColumn"
      :radio="()=>{ return component.attribute.radio }"
      :itemStyle="itemStyle"
      @onChange="(result)=>{handlerEvent('onChange',result)}"
  ></CwUserDropdown>
  </div>
  </template>
<script>
import CwUserDropdown from "@/components/Cw/CwUserDropdown";
import {dispatchEvent} from "../utils/eventUtils"

export default {
  name: 'CwOrganizationInput',
  components: { CwUserDropdown },
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
      value: '', //this.componentModalObj[this.fieldName],
      compVal: '',
      initValue:[],
      selectColumn: 'label'
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
    handlerEvent(tag,data,v1){
     // console.log(v1)
        let args = []
        if(v1)  args.push(data)
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
          { field: 'selectRange', title: '选择范围[100,200,300]', queryType: 'input', require: false, query: true, hide: false },
          { field: 'radio', title: '是否单选[true/false]', queryType: 'input', require: false, query: true, hide: false },
          { field: 'orgType', title: '组织类型[200/300]', queryType: 'input', require: false, query: true, hide: false },
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
      return '组织选择器'
    },
    ificationType() {
      return {
        classification: '表单组件',
        isCanvasview: false,
      }
    },
    handleDragStart(event) {
      //event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY, action: 'setLocation', compId: this.compId }));

    },
    handleDragEnd() { },
    inputchange(val) {
      // console.log(val)

    },
  },

}
</script>
<style lang="scss" scoped></style>