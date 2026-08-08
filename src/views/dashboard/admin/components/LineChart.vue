<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "350px",
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    
    bardata: {
      type: Object,
       default:function(){
            return {}
        }
    },
  },
  data() {
    return {
      chart: null,
      chartData:{
        xactualData:[1,2,3,3],
        yexpectedData:[1,2,3,3]
      }
    };
  },
 watch: {
    bardata:function(newValue,oldValue){
      if(newValue){
        this.getlinedata();
        this.initChart();
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
        this.initChart();

    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    getlinedata(){
      this.chartData['xactualData'] = this.bardata.ProcessCodeToday?.map(item=>{
          return item.processCode
      })
      this.chartData['yexpectedData'] = this.bardata.ProcessCodeToday?.map(item=>{
          return (item.ngIncrease/(item.ngIncrease+item.increase)*100).toFixed(2)
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.chartData);
    },
    setOptions({ yexpectedData, xactualData } = {}) {
      this.chart.setOption({
        xAxis: {
          type: 'category',
          data: xactualData,
          axisLine: {
            lineStyle: {
                color: "#999"
            }
          }
        },
      tooltip: {
        trigger: 'axis',
        formatter: "{b}: {c}%"
      },
      yAxis: {
        type: 'value',
          axisLabel: { //y轴设置为%
           show: true,
           interval: 'auto',
           formatter: '{value} %',
          },
        max: 100,  //最大值
        min: 0,  //最小值,
        splitNumber: 4,
        splitLine: {
          lineStyle: {
              type: 'dashed',
              color: '#DDD'
          }
        },
        axisLine: {
          show: false,
          lineStyle: {
              color: "#333"
          },
        },
       nameTextStyle: {
           color: "#999"
       },
       splitArea: {
           show: false
       }
      },
       series: [
         {
           data: yexpectedData,
           type: 'line',
           smooth: true,
           lineStyle: {
            normal: {
                width: 8,
                color: {
                    type: 'linear',

                    colorStops: [{
                        offset: 0,
                        color: '#A9F387' // 0% 处的颜色
                    }, {
                        offset: 1,
                        color: '#48D8BF' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                },
                shadowColor: 'rgba(72,216,191, 0.3)',
                shadowBlur: 10,
                shadowOffsetY: 20
            }
        },
        itemStyle: {
            normal: {
                color: '#fff',
                borderWidth: 10,
                /*shadowColor: 'rgba(72,216,191, 0.3)',
                shadowBlur: 100,*/
                borderColor: "#A9F387"
            }
        },
        smooth: true
         }
       ]
      },true);
    },
  },
};
</script>
