<template>
    <div class="dyn-color-picker" v-bind="$attrs">
      <CwTimePickers v-model="value" type="date" :itemStyle="itemStyle"/>
    </div>
  </template>
  <script>
  import CwTimePickers from "@/components/Cw/CwTimePicker.vue"
  
  export default {
    name: 'CwTimePicker',
    components: { CwTimePickers },
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
        compVal: '',
        value: this.componentModalObj[this.fieldName],
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
          { field: 'height', title: '高度', queryType: 'input', defaultValue: '21px', unit: 'px' },
        ]
      },
      comText(){
        return '时间选择器'
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
  .dyn-color-picker {
    // width: 100px;
    // height: 100px;
    // position: absolute;
    // background-color: aqua;
  }
  </style>