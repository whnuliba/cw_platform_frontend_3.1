<template>
    <div :ref="`echartsRef${component.id}`" :class="className" @click="onClick" :style="myStyle" :itemStyle="itemStyle">
    </div>
  </template>
  <script>
  import echarts from "echarts";
  require("echarts/theme/macarons"); 
  
  export default {
    name: 'CwRadarModel',
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
          return { color:'black',width:'500px',height: '400px',backgroundColor: 'rgba(227, 237, 233, 1)'}
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
      'component.attribute': {
        handler: function(newVal, oldVal){
          if(newVal && oldVal && !_.isEqual(newVal, oldVal)){
            this.initChart(echarts)
          }
        },
        deep: true,
        immediate: true,
      },
    },
    computed: {},
    data() {
      return {
        methods:{},
        vueContext:{},
        myAttribute:{}, 
        urlData: [],
        result : {
            "indicator": [
                {name:'data1', max:400},
                {name:'data2', max:400},
                {name:'data3', max:400},
                {name:'data4', max:400},
                {name:'data5', max:400}
            ],    
            "data":[
                {
                    value:[120, 200, 150, 80, 130],
                    name:'NAME1'
                },
                {
                    value:[220, 182, 191, 234, 290],
                    name:'NAME2'
                },               
            ]
        }
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
          this.component.attribute.title_left = 'center'
        });
        window.addEventListener('resize',this.handleResize)//开启屏幕监听缩放，刷新图表
    },
    beforeDestroy() { 
      window.removeEventListener('resize', this.handleResize)
    },
    methods: {
      getStyleCols() {
        return [
          { field: 'width', title: '长度', queryType: 'input', defaultValue: '500px', unit: 'px' },
          { field: 'height', title: '高度', queryType: 'input', defaultValue: '400px', unit: 'px' },
          { field: 'borderColor', title: '边框颜色', queryType: 'colorpicker', defaultValue: '#127310' },
          { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', defaultValue: 'rgba(227, 237, 233, 1)' },
        ]
      },
      getAttributeCols() {
        return [
          { field: 'url', title: 'url', queryType: 'input', require: false, query: true, hide: false },
          { field: 'params', title: 'params', queryType: 'input', require: false, query: true, hide: false },
          { field: 'title', title: '标题', queryType: 'input', require: false, query: true, hide: false },
          { field: 'title_left', title: '标题位置', queryType: 'select', require: false, query: true, hide: false },
          { field: 'legend', title: '图例', queryType: 'switch', require: false, query: true, hide: false },
          { field: 'legend_orient', title: '图例方向', queryType: 'select', require: false, query: true, hide: false},
          { field: 'legend_left', title: '图例位置', queryType: 'select', require: false, query: true, hide: false},
        ]
      },
      selectOptions(){
        return {
            title_left:[
                {label:'left',value:'left'},
                {label:'center',value:'center'},
                {label:'right',value:'right'} 
            ],
            legend_orient:[
                {label:'垂直',value:'vertical'},
                {label:'水平',value:'horizontal'}
            ],
            legend_left:[
                {label:'left',value:'left'},
                {label:'center',value:'center'},
                {label:'right',value:'right'} 
            ]
        }
      },
      onClick(e){},
      comText() {
        return '雷达图'
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
      // 赋值
      initChart() {
        let url = this.component.attribute.url, params = this.component.attribute.params;
        if (url && params) {
            this.echartsUrlData(url,params)
        } else {
          let charts = echarts.init(this.$el,"macarons");
          if(this.component.elementCode){
            let obj =  eval(`(${this.component.elementCode})`).chartOption(null,echarts);
            if(!_.isEmpty(obj)){
              this.result = obj;
            }
          }
          this.setOptions(charts,this.result);
            
            
         } 
      },
      echartsUrlData(url,params){
        let _this = this
        let newParams = {};
        if(typeof(params) === 'string' && eval("(" + params + ")")) {
          newParams = eval("(" + params + ")") 
        } else { 
          newParams = params 
        }     
        const _data = {url: url,params: newParams}
        this.$store.dispatch('fmsCommon/actionPost',_data).then(data => {
          let charts = echarts.init(this.$el,"macarons");   
          _this.setOptions(charts,eval(`(${this.component.elementCode})`).chartOption(data,echarts));
        }).catch(err => {
          console.error(err)
        }) 
      },
      setOptions(chart, result) { 
        let option = { 
          title: {
            text: this.component.attribute.title,
            textStyle: {
              color: '#464646',
              fontWeight: 'bold'
            },
            left: this.component.attribute.title_left,
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            show: this.component.attribute.legend,
            orient: this.component.attribute.legend_orient,
            left: this.component.attribute.legend_left,
          },
          radar: {
            indicator: result.indicator
          },
          series: [
            {
              data: result.data,
              type: 'radar'
            }
          ]
        };
        chart.setOption(option)
      },
      handleResize(){
        let charts = echarts.init(this.$el,"macarons"); 
        charts.resize()
      }
      /*
        ------elementCode例子-------
        {
          chartOption(urlData){
            if(urlData){
              return {
                "data": [
                    {value:urlData[0].data1,name:'data1'},
                    {value:urlData[0].data2,name:'data2'},
                ],
              }
            }
              return {
                  "indicator": [
                        {name:'data1', max:400},
                        {name:'data2', max:400},
                        {name:'data3', max:400},
                        {name:'data4', max:400},
                        {name:'data5', max:400}
                    ],    
                    "data":[
                        {
                            value:[120, 200, 150, 80, 130],
                            name:'data1',
                            symbol: 'rect',
                            symbolSize: 12,
                            lineStyle: {
                              type: 'dashed'
                            },
                            label: {
                              show: true,
                              formatter: function (params) {
                                return params.value;
                              }
                            },
                            areaStyle: {
                              color: 'rgba(255, 145, 124, 0.9)'
                            }
                        },
                        {
                            value:[220, 182, 191, 234, 290],
                            name:'data2'
                        },               
                    ]
              }
          }
        }
      */
    },
  }
  </script>
  <style lang="scss" scoped>

  </style>