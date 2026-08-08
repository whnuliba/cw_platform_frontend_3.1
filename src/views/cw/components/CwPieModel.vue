<template>
    <div :ref="`echartsRef${component.id}`" :class="className" @click="onClick" :style="myStyle" :itemStyle="itemStyle">
    </div>
  </template>
  <script>
  import echarts from "echarts";
  require("echarts/theme/macarons"); 
  
  export default {
    name: 'CwPieModel',
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
            "data": [
                {value:120,name:'data1'},
                {value:200,name:'data2'},
                {value:150,name:'data3'},
                {value:80,name:'data4'},
                {value:130,name:'data5'}
            ],    
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
          this.component.attribute.labelFormatter = '{b}'
          this.component.attribute.tooltipFormatter = '{b}:{c}({d}%)'
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
          { field: 'labelFormatter', title: '标签格式', queryType: 'select', require: false, query: true, hide: false},
          { field: 'tooltipFormatter', title: '提示框格式', queryType: 'select', require: false, query: true, hide: false},
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
            ],
            labelFormatter:[
              {label:'{b}',value:'{b}'},
              {label:'{b}:{c}',value:'{b}:{c}'},
              {label:'{b}:{c}({d}%)',value:'{b}:{c}({d}%)'}
            ],
            tooltipFormatter:[
              {label:'{b}',value:'{b}'},
              {label:'{b}:{c}',value:'{b}:{c}'},
              {label:'{b}:{c}({d}%)',value:'{b}:{c}({d}%)'}
            ],
        }
      },
      onClick(e){},
      comText() {
        return '饼图'
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
            trigger: 'item',
            formatter: this.component.attribute.tooltipFormatter
          },
          legend: {
            show: this.component.attribute.legend,
            orient: this.component.attribute.legend_orient,
            left: this.component.attribute.legend_left,
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          series: [
            {
              data: result.data,
              type: 'pie',
              radius: '50%',
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              label: {
                show: true,
                position: 'outside',
                formatter: this.component.attribute.labelFormatter
              }
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
                  "data": [
                    {value:120,name:'data1'},
                    {value:200,name:'data2'},
                    {value:150,name:'data3'},
                    {value:80,name:'data4'},
                    {value:130,name:'data5'}
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