<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
// import resize from "./mixins/resize";

export default {
  // mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "90%",
    },
    height: {
      type: String,
      default: "550px",
    },
    autoResize: {
      type: Boolean,
      default: true,
    },

    spcData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    bardata: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      timer:'',
      ucl:0,
      cl:0,
      lcl:0,
      chart: null,
      chartData: {
        xactualData: [1, 2, 3, 4],
        yexpectedData: [1, 2, 3, 4],
      },
    };
  },
  watch: {
    // spcData: function (newValue, oldValue) {
    //   console.log(newValue);
     
    // },
    // bardata: function (newValue, oldValue) {
    //   console.log(newValue);
    //   console.log(oldValue);
    //   if (newValue) {
    //     this.getlinedata();
    //     this.initChart();
    //   }
    // },
  },
  created() {
      // this.getlinedata(this.bardata)
  },
  mounted() {
    this.$nextTick(() => {
      // this.getlinedata();
      this.getlinedata(this.bardata)
      this.timer = setInterval(() => {
          this.getlinedata(this.bardata);
      },10000);

    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
    clearInterval(this.timer);
  },
  methods: {
    getlinedata(row) {
      let row_data = JSON.parse(row.fieldText ) 
     
     
        let params = {
          data:{},
          resourceNo:row_data.resourceNo
        }
        if(row_data.url){
           const _data = {url:row_data.url,params}
          this.$store.dispatch('fmsCommon/actionTaskPost',_data)
          .then(data => {
              this.chartData["yexpectedData"] = data.dataSet
              this.chartData["xactualData"] = data.dataSet.map((val,ind)=>{
                return ind+1
              })
              // xactualData
              for(let i in data){
                if(i.includes('ucl'))this.ucl = data[i]
                if(i.includes('lcl'))this.lcl = data[i]
                if(i.includes('cl')&&(!i.includes('ucl')))this.cl = data[i]
              }
              // this.ucl = data.ucl_x
              // this.lcl = data.lcl_x
              // this.cl = data.cl_x
              this.initChart();

          }).catch(err => {
              console.error(err)
          }).finally(()=>{
          })
        }
        

    
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.chartData);
    },
    setOptions({ yexpectedData, xactualData } = {}) {
      let _this = this
      this.chart.setOption(
        {
          backgroundColor:'#fff ',
          grid: {
            // top:'-5%',
            width:'55%',
            height:'40%',
            left: '15%',
            show: true,
            borderColor :'#fff',
            backgroundColor:'white'
          },
          
          xAxis: {
            type: "category",
            data: xactualData,
            axisLine: {
              lineStyle: {
                color: "#333",
                fontSize: "14",
                width:2,
              },
              symbol:['none', 'arrow'],

            },
          },
          tooltip: {
            trigger: "axis",
            formatter: "{b}: {c}",
            // borderColor: 'red' ,
            // backgroundColor: 'red' ,
            axisPointer :{
              lineStyle:{
                color:'black'
              }
            }
          },

          yAxis: {
            type: "value",
            axisLabel: {
              fontSize: "14",
              // color: '#999',
              // formatter:function (value){
              //   if (value>2990){
              //     value = value * 0.9+1000
              //   } else{
              //     // value = value * 0.2

              //   }
              //   return value
                // console.log(value);
              // },
            },
            
            splitNumber: 5,
          
            axisLine: {
              symbol:['none', 'arrow'],
              lineStyle: {
                color: "#333",
                fontSize: "14",
                width:2,
              
              },
            },
            nameTextStyle: {
              color: "#999",
            },
            
            min: function (value) {
              return _this.lcl.toFixed(2)-5;
            },
            max: function (value) {
              return _this.ucl.toFixed(2)+100 ;
            }
          },
          series: [
            {
              data: yexpectedData,
              type: "line",
              smooth: false ,
              lineStyle: {
                normal: {
                  width: 2,
                  color:'#FFBA00'
                },
              },
              itemStyle: {
                  color: "red",
                  borderWidth: 6,
                  borderColor: "red",
              },
              markLine:{
                    symbol:'none',

                data: [
                  {
                    yAxis: [this.ucl.toFixed(2)],
                    name: 'UCL',
                    label: {formatter: '{b}={c}', fontSize: "14", fontWeight:"bolder", color: '#000'},
                    lineStyle: {
                      color: 'darkred',
                      width: 2,
                      
                    },

                  },
                  {
                    yAxis: [this.cl.toFixed(2)] ,
                    name: 'CL',
                    label: {formatter: '{b}={c}', fontSize: "14", fontWeight:"bolder", color: '#000'},
                    lineStyle: {
                      color: '#000',
                      type: 'solid',
                      width: 2,
                    },

                  },
                  {
                    yAxis: [this.lcl.toFixed(2)],
                    name: 'LCL',
                    label: {formatter: '{b}={c}', fontSize: "14",  fontWeight:"bolder", color: '#000'},
                    symbol:'none',

                    lineStyle: {
                      color: 'darkred',
                      width: 2,
                    },
                  }
                ]
              }
            },
          ],
        },
        true
      );
    },
  },
};
</script>
