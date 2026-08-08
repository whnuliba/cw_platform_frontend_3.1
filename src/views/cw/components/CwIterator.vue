<template>
    <div class="dyn-iterator"
    :style="{...itemStyle}"
    >
        <CwSubPanel 
            :component="component"
            :componentData="componentData"  
             :itemStyle="{width:'100px',minHeight:'400px'}"
           />
    </div>
  </template>
  <script>
  import CwSubPanel from "./CwSubPanel.vue"
  export default {
    name: 'CwIterator',
    components: { CwSubPanel },
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
          default: () =>{

          }
        },
        componentData: {
        type: Array,
        default: () => {
          return []
        }
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
        list:[],
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
          { field: 'width', title: '长度', queryType: 'input', defaultValue: '600px', unit: 'px' },
          { field: 'height', title: '高度', queryType: 'input', defaultValue: '400px', unit: 'px' },
          { field: 'fontSize', title: '字体大小', queryType: 'input', defaultValue: '16px', unit: 'px' },
          { field: 'borderColor', title: '边框颜色', queryType: 'colorpicker', defaultValue: '#127310', },
          { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', defaultValue: '#E8D9D9', },
          { field: 'float', title: 'float', queryType: 'input', defaultValue: 'left', unit: 'px' },
          { field: 'marginTop', title: 'marginTop', queryType: 'input', defaultValue: '5px', unit: 'px' },
          { field: 'marginLeft', title: 'marginLeft', queryType: 'input', defaultValue: '5px', unit: 'px' },
        //   { field: 'marginRight', title: 'marginRight', queryType: 'input', defaultValue: '0', unit: 'px' },
        //   { field: 'marginBottom', title: 'marginBottom', queryType: 'input', defaultValue: '0', unit: 'px' },
        ]
      },
      comText() {
        return '迭代器'
      },
      ificationType() {
        return {
          classification: '布局容器组件',
          isCanvasview: false,
        }
      },
      handleDragStart(event) {
       //  event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY, action: 'setLocation', compId: this.compId }));
  
      },
      handleDragEnd() { },
      inputchange(val) {
        // console.log(val)
  
      },
    },
  
  }
  </script>
  <style lang="scss" scoped></style>