<template>
    <CwButtons v-bind="$attrs" v-model="compVal" @click="onClick" v-on="$listeners" :itemStyle="itemStyle" :panelStyle="panelStyle" :disabled="component.attribute.btnDisabled ? component.attribute.btnDisabled : false">
      <div slot="title" :style="myStyle">{{commonI18n(component.attribute.buttonName) ? commonI18n(component.attribute.buttonName) :(component.attribute.buttonName ? component.attribute.buttonName : '确定')}}</div>
    </CwButtons>
  </template>
  <script>
  import CwButtons from "@/components/Cw/CwButton.vue"
  
  export default {
    name: 'CwButton',
    components: { CwButtons },
    props: {
      panelStyle: {
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
      fieldName: {
        type: String,
        default: ''
      },
      myStyle: {
        type: Object,
        default: () => {
          return { }
        }
      },
      itemStyle: {
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
      itemVal: {
        handler: function (newVal, oldVal) {
          if (newVal) {
            this.compVal = newVal
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
    data() {
      return {
        vueContext:{},
        myAttribute:{
          onClckEventName:'Event_Button',
        }, 
        compVal: '',
          methods:{}
      };
    },
    created() {
      this.comText();
    },
    mounted() {
    },
    beforeDestroy() { },
  
    methods: {
      getStyleCols() {
        return [
          { field: 'width', title: '长度', queryType: 'input', defaultValue: '70px', unit: 'px' },
          { field: 'height', title: '高度', queryType: 'input', defaultValue: '36px', unit: 'px' },
          { field: 'borderColor', title: '边框颜色', queryType: 'colorpicker', defaultValue: '#127310', },
          { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', defaultValue: '#fff', },
          { field: 'color', title: '字体颜色', queryType: 'colorpicker', defaultValue: '#000', },
        ]
      },
      getAttributeCols() {
        return [
          { field: 'buttonName', title: '按钮名称', queryType: 'input', require: false, query: true, hide: false },
          { field: 'test', title: '测试', queryType: 'input', require: false, query: true, hide: false },
          { field: 'btnDisabled', title: '是否禁用', queryType: 'select', require: false, query: true, hide: false },

        ]
      },
      selectOptions(){
        return {
          btnDisabled:[
            { label: 'true', value: true },
            { label: 'false', value: false },
          ]
        }
      },
      onClick(e){
         
      },
      comText() {
        return '按钮'
      },
      ificationType() {
        return {
          classification: '基础组件',
          isCanvasview: false,
        }
      },
      handleDragStart(event) {
        event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY,action:'setLocation',compId:this.compId}));
      },
      handleDragEnd() { },
      addBtn() {
        
      },
    },
  }
  </script>
  <style lang="scss" scoped>

  </style>