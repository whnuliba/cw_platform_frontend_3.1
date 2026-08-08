<template>
      <CwColorPickers v-bind="$attrs" v-model="value" :itemStyle="itemStyle">
      </CwColorPickers>
  </template>
  <script>
  import CwColorPickers from "@/components/Cw/CwColorPicker.vue"
  
  export default {
    name: 'CwColorPicker',
    components: { CwColorPickers },
    props: {
      componentModalObj: {
        type: Object,
        default: () => {
          return { }
        }
      },
      fieldName: {
        type: String,
        default: ''
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
      }
    },
    computed: {},
    data() {
      return {
        methods:{},
        vueContext:{},
        value: this.componentModalObj[this.fieldName],
        compVal: ''
      };
    },
    mounted() {
    },
    beforeDestroy() { },
  
    methods: {
      getStyleCols() {
        return [
          { field: 'width', title: '长度', queryType: 'input', defaultValue: '38px', unit: 'px' },
          { field: 'height', title: '高度', queryType: 'input', defaultValue: '38px', unit: 'px' },
        ]
      },
      comText() {
            return '颜色选择器'
        },
      ificationType() {
        return {
          classification: '表单组件',
          isCanvasview: false,
        }
      },
      handleDragStart(event) {
        event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY,action:'setLocation',compId:this.compId}));
      },
      handleDragEnd() { }
    },
    created() {
      this.comText() 
    }
  }
  </script>
  <style lang="scss" scoped>

  </style>