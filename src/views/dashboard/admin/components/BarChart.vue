<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";
import { GetRecordRedis } from "@/api/chartinfo";

const animationDuration = 6000;

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
      default: "300px",
    },
    bartype: {
      type: Number,
      default: 1,
    },
    bardata: {
      type: Object,
       default:function(){
            return {}
        }
    },

  },
  watch: {
    bardata:function(newValue,oldValue){
      if(newValue){
        this.getBardata();
        this.initChart();
      }
      
    }
  },
  data() {
    return {
      chart: null,
      manageIn: [],
      manageOut: [],
      manageUp: [],
      manageDown: [],
      manageMove: [],
      manageSortOut: [],
      stockIn: [],
      stockOut: [],
      timer: {},
      xzdata:['n1', 'n2', 'n3','n1', 'n2', 'n3','n1', 'n2', 'n3','n1', 'n2', 'n3','n3','n1', 'n2', 'n3','n1', 'n2', 'n3','n1', 'n2', 'n3'],
      increase:[100,200,300,100,200,300,100,200,300,100,200,300,300,100,200,300,100,200,300,100,200,300],
      ngIncrease:[100,200,300,100,200,300,100,200,300,100,200,300,300,100,200,300,100,200,300,100,200,300],
    };
  },
  created() {
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
    clearInterval(this.timer);
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    getBardata(){
      this.xzdata = this.bardata.ProcessCodeToday?.map(item=>{
          return item.processCode
      })
      this.increase = this.bardata.ProcessCodeToday?.map(item=>{
          return item.increase
      })
      this.ngIncrease = this.bardata.ProcessCodeToday?.map(item=>{
          return item.ngIncrease
      })
    },
    initChart() {
      let _this = this
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.on("click", function(params) {
              //  var a = params.dataIndex
                console.log(params,"我被点击了");
            _this.$emit('barClick',params)

      });
      this.chart.setOption({
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          type: 'value',
          axisLine:{
              lineStyle:{
                  color:'black',
                  // width:8,//这里是为了突出显示加上的
              }
          } 
        },
        xAxis: {
          type: 'category',
          data: this.xzdata,
          axisLine:{
            lineStyle:{
                color:'black',
            }
          },
          axisLabel:{ 
            rotate : -60 
          }
        },
        series: [
          {
            name: '产品NG',
            type: 'bar',
            emphasis: {
              focus: 'series'
            },
            stack: 'Ad',
            itemStyle: {
              normal: {
              //设置柱子圆角
                // barBorderRadius: [20,20,0,0]
                color: 'rgba(11, 149, 255,1)',
              }
            },
            label: {
              show: true,
              position: 'inside',
              fontSize: 15,
              textShadowColor:'black',
              textShadowOffsetY:1,
              textShadowOffsetX:1,
            },
            data: this.ngIncrease
          },
          {
            name: '产品OK',
            type: 'bar',
             emphasis: {
              focus: 'series'
            },
            stack: 'Ad',
            itemStyle: {
              normal: {
              //设置柱子圆角
                barBorderRadius: [10,10,0,0],
                color: 'rgba(255, 198, 0,1)',
              }
            },
            label: {
              show: true,
              position: 'top',
              fontSize: 15,
              textShadowColor:'black',
              textShadowOffsetY:1,
              textShadowOffsetX:1,
              color:'black'
            },
            data: this.increase
          },
        ]
      });
    },
   
   
  },
};
</script>
