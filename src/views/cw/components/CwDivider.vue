<template>
    <!-- <el-divider :style="{...itemStyle,border:'1px solid'}" border-style="dashed"/> -->
    <hr :style="itemStyle"/>
</template>
<script>
  export default {
    name: 'CwDivider',
    components: {  },
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

        },
        deep: true
      },
    },
    computed: {},
    data() {
      return {
        methods:{},
        myAttribute:{

        }, 
        compVal: '',
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
          { field: 'width', title: '长度', queryType: 'input', defaultValue: '200px', unit: 'px' },
          { field: 'height', title: '高度', queryType: 'input', defaultValue: '1px', unit: 'px' },
           { field: 'border', title: '边框高度', queryType: 'input', defaultValue: '1px', unit: 'px'},
          { field: 'color', title: '颜色', queryType: 'colorpicker', defaultValue: '#DCDFE6', },
          { field: 'borderStyle', title: '样式', queryType: 'select', defaultValue: 'solid', },
         
        ]
      },
      selectOptions() {
        let obj = {}
        obj['borderStyle'] = [
            { label: '实线', value: 'solid' },
            { label: '虚线', value: 'dashed' },
            { label: '点线', value: 'dotted' },
            { label: '双实线', value: 'double' },
        ]
        return obj
      },
      getAttributeCols() {
        return [

        ]
      },
      onClick(e){
         
      },
      comText() {
        return '分割线'
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
*{
  margin: 0 !important;
  height: 0 !important;
  border-left: 0 !important;
  border-bottom: 0 !important;
  border-right: 0 !important;
  box-sizing: border-box;
}
</style>