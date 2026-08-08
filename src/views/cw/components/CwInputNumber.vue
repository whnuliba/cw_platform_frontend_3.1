<template>
      <CwInputNumbers v-bind="$attrs" v-model="value" :itemStyle="itemStyle">
      </CwInputNumbers>
  </template>
  <script>
  import CwInputNumbers from "@/components/Cw/CwInputNumber.vue"
  
  export default {
    name: 'CwInputNumber',
    components: { CwInputNumbers },
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
        methods:{},
        vueContext:{},
        value: 0, //this.componentModalObj[this.fieldName],
        compVal: ''
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
          { field: 'width', title: '长度', queryType: 'input', defaultValue: '187px', unit: 'px' },
          { field: 'height', title: '高度', queryType: 'input', defaultValue: '40px', unit: 'px' },
        ]
      },
      comText() {
        return '计数器'
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
    
  }
  </script>
  <style lang="scss" scoped>
  </style>