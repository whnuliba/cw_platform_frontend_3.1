<template>
    <div class="dyn-color-picker" v-bind="$attrs">
      <CwTransfers v-model="componentModalObj[fieldName]"  :data="transferData"/>
    </div>
  </template>
  <script>
  import CwTransfers from "@/components/Cw/CwTransfer.vue"
  
  export default {
    name: 'CwTransfer',
    components: { CwTransfers },
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
      myStyle: {
        type: Object,
        default: () => {
          return { color:'black' }
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
      'component.attribute.url': {
        handler: function(newVal, oldVal){
            if (newVal !== oldVal) {
                this.dataView()
            }
        },
        deep: true,
      },
      'component.attribute.params': {
        handler: function(newVal, oldVal){
            if (newVal !== oldVal) {
                this.dataView()
            }
        },
        deep: true,
      },
    },
    computed: {},
    data() {
        let dataTest = [];
        for (let i = 1; i <= 15; i++) {
            dataTest.push({
            key: i,
            label: `科目${ i }`,
            disabled: i % 4 === 0
          });
        }
      return {
        methods:{},
        vueContext:{},
        compVal: [],
        transferData: dataTest
      };
    },
    created() {
      this.comText();
    },
    mounted() {
      this.dataView();
    },
    beforeDestroy() { },
  
    methods: {
      getStyleCols() {
        return [
          { field: 'width', title: '长度', queryType: 'input', defaultValue: '100%', },
          { field: 'borderColor', title: '边框颜色', queryType: 'colorpicker', defaultValue: 'transparent', },
          { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', defaultValue: 'transparent', },
        ]
      },
      getAttributeCols() {
        return [
          { field: 'url', title: 'url', queryType: 'input', require: false, query: true, hide: false },
          { field: 'params', title: 'params', queryType: 'input', require: false, query: true, hide: false },
        ]
      },
      comText(){
        return '穿梭框'
      },
      ificationType() {
        return {
          classification: '表单组件',
          isCanvasview: false,
        }
      },
      dataView() {
        let url = this.component.attribute.url, params = this.component.attribute.params;
        let urlParams = {url: url, params: params};
        if (url && params) {
          this.$store.dispatch('fmsCommon/actionPost',urlParams)
            .then(data => {
              this.transferData = eval(`(${this.component.elementCode})`).shuttleFrame(data);
            }).catch(err => {
              this.transferData = [];
              this.$message.error('输入url,params错误');
           })
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