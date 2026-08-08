<template>
        <component :is="component.styles.types?component.styles.types:'CwBgSvg1'" ref="myBgSvg" id="myBgSvg1" class="svg-myBg" v-bind="$attrs"
         @dragstart="handleDragStart" @dragend="handleDragEnd" :style="itemStyle" :itemStyle="itemStyle"  :component="component" :svgFill="svgFill"/>
  </template>
  <script>
  import CwBgSvg1 from "./svgBgImg/CwBgSvg1"
  import CwBgSvg2 from "./svgBgImg/CwBgSvg2"
  import CwBgSvg3 from "./svgBgImg/CwBgSvg3"
  export default {
    name: 'CwIteratorBg',
    components: { CwBgSvg1,CwBgSvg2,CwBgSvg3 },
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
        default: {}
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
    computed: {},
    watch: {
        itemStyle: {
        handler: function (newVal, oldVal) {
          if (newVal) {
           
          }
        },
        deep: true
      },
    },
    data() {
      return {
        methods:{},
        vueContext:{},
        SVGComp:"",
        svgFill: "rgba(0,0,0,0.8)"
      };
    },
    created() {
      this.comText();
    },
    mounted() {
        this.SVGComp = 'CwBgSvg1';
    },
    beforeDestroy() { },
  
    methods: {
      comText() {
        return '迭代器背景图'
      },
      ificationType() {
        return {
          classification: '基础组件',
          isCanvasview: false,
        }
      },
      getStyleCols() {
        return [
          { field: 'types', title: 'bgSelect', queryType: 'select',defaultValue:'CwBgSvg1', require: false,},
          { field: 'position', title: 'position', queryType: 'select', defaultValue: 'absolute', require: false, query: true, hide: false },
          { field: 'width', title: 'width', queryType: 'input', defaultValue: '100px', require: false, query: true, hide: false },
          { field: 'height', title: 'height', queryType: 'input', defaultValue: '100px', require: false, query: true, hide: false },
          { field: 'backgroundColor', title: 'backgroundColor', queryType: 'colorpicker',defaultValue:'rgba(44, 37, 37, 0.34)', require: false, query: true, hide: false },
        ]
      },
      getAttributeCols() {
          return [  ]
        },  
        selectOptions() {
        let obj = {}
        obj['types'] = [
            { label: 'CwBgSvg1', value: 'CwBgSvg1' },
            { label: 'CwBgSvg2', value: 'CwBgSvg2' },
            { label: 'CwBgSvg3', value: 'CwBgSvg3' },
        ]
        return obj
      },
      handleDragStart(event) {
        event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY }));
      },
      handleDragEnd() { }
    },
  }
  </script>
  <style lang="scss" scoped>
    // #myBgSvg1{
    //     width: 100%;
    //     height: 100%;
    // }

  </style>