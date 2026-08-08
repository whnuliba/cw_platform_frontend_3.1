<template>
    <div class="dyn-radio" v-bind="$attrs">
      <CwCheckboxs v-model="compVal" @change="cheChange" :itemStyle="itemStyle" size="medium" :dataSource="dataSource"/>
    </div>
  </template>
  <script>
    import CwCheckboxs from "@/components/Cw/CwCheckbox.vue"
  
    export default {
      name: 'CwCheckbox',
      components: { CwCheckboxs },
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
            return { }
          }
        },
        fieldName: {
          type: String,
          default: ''
        },
        myStyle: {
          type: Object,
          default: () => {
            return { width: "100px", height: "100px", backgroundColor: "pink" }
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
        fieldName: {
          handler: function (newVal, oldVal) {
            if (newVal) {
              this.compVal = this.componentModalObj[this.fieldName]
            }
  
          },
          deep: true
        },
        dataSource: {
          handler: function (newVal, oldVal) {
          },
          deep: true
        },
      },
      computed: {},
      data() {
        return {
          methods:{},
          vueContext:{},
          value: this.componentModalObj[this.fieldName],
          compVal: [],
          dataSource: [
            {label: '上海',value:'SH'},
            {label: '北京',value:'BJ'},
          ],
        };
      },
      mounted() {
      },
      beforeDestroy() { },
      methods: {
        comText() {
            return '复选框'
        },
        ificationType() {
          return {
            classification: '表单组件',
            isCanvasview: false,
          }
        },
        handleDragStart(event) {
          event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY, action: 'setLocation', compId: this.compId }));
        },
        handleDragEnd() { },
        cheChange(val) {
        },
      },
      created() {
        this.comText();
      }
    }
  </script>
  <style lang="scss" scoped>
  </style>