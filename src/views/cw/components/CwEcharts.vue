<template>
    <div :ref="`echartsRef${component.id}`" :class="className" :style="myStyle"  @click="onClick"  :itemStyle="itemStyle" :panelStyle="panelStyle">
    </div>
    <!-- // v-bind="$attrs" v-on="$listeners"  -->
  </template>
  <script>
  import echarts from "echarts";
  require("echarts/theme/macarons"); // echarts 主题
  import {dispatchEvent} from "../utils/eventUtils"
  //import resize from "./mixins/resize";
  
  export default {
    name: 'CwEcharts',
    components: { },
    // mixins: [resize],
    props: {
      className: {
        type: String,
        default: "chart",
      },
      panelStyle: {
        type: Object,
        default: () => {
          return {
            width:'500px',height: '500px'
          }
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
          return { color:'black',width:'500px',height: '500px',backgroundColor: 'rgba(227, 237, 233, 1)'}
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
      componentData:{
        type: Array,
        default: () =>[]
      },
    bindData:{
      type: Object,
      default: () =>{}
    },
    },
    watch: {
      itemVal: {
        handler: function (newVal, oldVal) {
        },
        deep: true
      },
      itemStyle: {
        handler: function (newVal, oldVal) {
            if (newVal) {
                for (let i in newVal) {
                    this.$refs[`echartsRef${this.component.id}`].style[i] = newVal[i]
                }
            }
        },
        deep: true
      },
      component: {
        handler: function(newVal, oldVal){
        },
        deep: true,
        immediate: true,
      },
      'component.elementCode': {
        handler: function(newVal, oldVal){
            if (newVal !== oldVal) {
                this.initChart(echarts)
                if (this.$parent.$parent.hasOwnProperty('fresh')) {
                  this.$parent.$parent.fresh()
                } else if (this.$parent.$parent.$parent.$parent.hasOwnProperty('fresh')) {
                  this.$parent.$parent.$parent.$parent.fresh()
                }
                
            }
        },
        deep: true,
        //immediate: true,
      },
      'component.attribute.url': {
        handler: function(newVal, oldVal){
            if (newVal !== oldVal) {
                this.initChart()
                if (this.$parent.$parent.hasOwnProperty('fresh')) {
                  this.$parent.$parent.fresh()
                } else if (this.$parent.$parent.$parent.$parent.hasOwnProperty('fresh')) {
                  this.$parent.$parent.$parent.$parent.fresh()
                }
                
            }
        },
        deep: true,
      },
      'component.attribute.params': {
        handler: function(newVal, oldVal){
            if (newVal !== oldVal) {
                this.initChart()
                if (this.$parent.$parent.hasOwnProperty('fresh')) {
                  this.$parent.$parent.fresh()
                } else if (this.$parent.$parent.$parent.$parent.hasOwnProperty('fresh')) {
                  this.$parent.$parent.$parent.$parent.fresh()
                }
                
            }
        },
        deep: true,
      },
    },
    computed: {},
    data() {
      return {
        methods:{},
        vueContext:{},
        myAttribute:{
          onClickEventName:'Event_Button',
        }, 
        chart: echarts,
        urlData: [],
      };
    },
    created() {
    },
    mounted() {
        this.$nextTick(() => {
            
            this.initChart();
            if (this.$el.firstChild && this.$el.firstChild.style) {
              this.$el.firstChild.style.width = '100%'
              this.$el.firstChild.style.height = '100%'
              this.$el.firstChild.firstChild.style.width = '100%'
              this.$el.firstChild.firstChild.style.height = '100%'
            }
            
        });
        window.addEventListener('resize',this.getResize)//开启屏幕监听缩放，刷新图表
    },
    beforeDestroy() { 
      window.removeEventListener('resize', this.getResize)
    },
    methods: {
      handlerEvent(tag,v1,v2,v3,v4){
        let args = []
        if(v1)  args.push(v1)
        if(v2)  args.push(v2)
        if(v3)  args.push(v3)
        if(v4)  args.push(v4)
        this.$nextTick(()=>{
          const ele = this.$el //$refs.echartsRef.$el

          if(ele){
            dispatchEvent(ele,tag,args)
          }
        })
      },
      getStyleCols() {
        return [
          { field: 'width', title: '长度', queryType: 'input', defaultValue: '500px', },
          { field: 'height', title: '高度', queryType: 'input', defaultValue: '400px', },
          { field: 'borderColor', title: '边框颜色', queryType: 'colorpicker', defaultValue: '#127310', },
          { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', defaultValue: 'rgba(227, 237, 233, 1)', },
        ]
      },
      getAttributeCols() {
        return [
          { field: 'url', title: 'url', queryType: 'input', require: false, query: true, hide: false },
          { field: 'params', title: 'params', queryType: 'input', require: false, query: true, hide: false },
        ]
      },
      onClick(e){},
      comText() {
        return 'Echarts模板'
      },
      ificationType() {
        return {
          classification: '图表组件',
          isCanvasview: false,
        }
      },
      handleDragStart(event) { 
        event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY,action:'setLocation',compId:this.compId}));
      },
      handleDragEnd() { },
      // echarts数据渲染接口
      echartsUrlData(urls,eParams,params1,params2) {
        //console.log(urls,eParams,typeof(eParams),params1)
        let newParams = {};
        if(typeof(eParams) === 'string' && eval("(" + eParams + ")")) {
          newParams = eval("(" + eParams + ")") 
        } else { 
          newParams = eParams 
        }
        const _data = {url: urls,params: newParams}
        this.$store.dispatch('fmsCommon/actionPost',_data)
            .then(data => {
              this.urlData = data;  //先写data,如果后面有数据处理在元素配置里面写
              let charts = echarts.init(this.$el,"macarons");   
              charts.setOption(eval(`(${this.component.elementCode})`).chartOption(data,echarts));
            }).catch(err => {
                console.error(err)
            }) 
      },
      initChart(param1,params2) {
         let url = this.component.attribute.url, params = this.component.attribute.params;
         if (url && params) {
            this.echartsUrlData(url,params,param1,params2)
         } else {
            let charts = echarts.init(this.$el,"macarons");
            charts.setOption(
                eval(`(${this.component.elementCode})`).chartOption(null,echarts)
              );
         }   
        
      },

      getResize(){
        let charts = echarts.init(this.$el,"macarons"); 
        charts.resize()
      }
    },
  }
  </script>
  <style lang="scss" scoped>

  </style>