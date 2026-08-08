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
      default: "100%",
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
    bardata: function (newValue, oldValue) {
      if (newValue) {
        this.getlinedata(newValue);
        // this.initChart();
      }
    },
  },
  created() {
      // this.getlinedata(this.bardata)
  },
  mounted() {
    this.$nextTick(() => {
      let _this = this
      this.getlinedata(this.bardata)
      let row_data = eval("("+this.bardata.fieldText+")")
      if(row_data.timer){
        this.timer = setInterval(() => {
          _this.getlinedata(_this.bardata)
        },row_data.timer);
      }
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
    picdown(){
      const link = document.createElement('a');
      link.download = "imageName";
      link.style.display = 'none';
      link.href = this.chart.getDataURL({
        type:'png',
        pixelRatio: 1.5,
        backgroundColor: '#fff'
      }); // 导出图表图片，返回一个 base64 的 URL
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href); //释放URL对象
      document.body.removeChild(link);
    },
    getlinedata(row) {
      let row_data = eval("("+row.fieldText+")")
      // let params = {
      //   data:{},
      //   resourceNo:row_data.resourceNo
      // }
      if(row_data.url && row_data.request!=false){
         const _data = {url:row_data.url,params:row_data.data}
        this.$store.dispatch('fmsCommon/action',_data)
        .then(data => {
          if(data.data.message){
            this.$emit('sendwarninf',{id:row.id,data:data.data.message})
          }
          this.chart = echarts.init(this.$el, "macarons");
          row_data.datatransformation(this,data.data,echarts) 
          // row_data.setOptions(this,data);
          
        }).catch(err => {
            console.error(err)
        }).finally(()=>{
        })
      }else{
        this.chart = echarts.init(this.$el, "macarons");
        row_data.datatransformation(this,{},echarts) 
      }     
    },
    // initChart() {
    //   this.chart = echarts.init(this.$el, "macarons");
    //   this.setOptions(this.chartData,this.ucl,this.lcl,this.cl);
    // },
    // setOptions(_this,data) {
    //   let chartData = {}
    //   chartData["yexpectedData"] = data.dataSet
    //   chartData["xactualData"] = data.dataSet.map((val,ind)=>{
    //     return ind+1
    //   })
             
    //   for(let i in data){
    //     if(i.includes('ucl'))chartData['ucl'] = data[i]
    //     if(i.includes('lcl'))chartData['lcl'] = data[i]
    //     if(i.includes('cl')&&(!i.includes('ucl')))chartData['cl'] = data[i]
    //   }
    //   let { yexpectedData, xactualData ,ucl,lcl,cl} = chartData
    //   _this.chart.setOption(
    //     {
    //       backgroundColor:'#fff ',
    //       grid: {
    //         // top:'-5%',
    //         width:'55%',
    //         height:'40%',
    //         left: '15%',
    //         show: true,
    //         borderColor :'#fff',
    //         backgroundColor:'white'
    //       },
          
    //       xAxis: {
    //         type: "category",
    //         data: xactualData,
    //         axisLine: {
    //           lineStyle: {
    //             color: "#333",
    //             fontSize: "14",
    //             width:2,
    //           },
    //           symbol:['none', 'arrow'],

    //         },
    //       },
    //       tooltip: {
    //         trigger: "axis",
    //         formatter: "{b}: {c}",
    //         // borderColor: 'red' ,
    //         // backgroundColor: 'red' ,
    //         axisPointer :{
    //           lineStyle:{
    //             color:'black'
    //           }
    //         }
    //       },

    //       yAxis: {
    //         type: "value",
    //         axisLabel: {
    //           fontSize: "14",
    //           // color: '#999',
    //           // formatter:function (value){
    //           //   if (value>2990){
    //           //     value = value * 0.9+1000
    //           //   } else{
    //           //     // value = value * 0.2

    //           //   }
    //           //   return value
    //             // console.log(value);
    //           // },
    //         },
            
    //         splitNumber: 5,
          
    //         axisLine: {
    //           symbol:['none', 'arrow'],
    //           lineStyle: {
    //             color: "#333",
    //             fontSize: "14",
    //             width:2,
              
    //           },
    //         },
    //         nameTextStyle: {
    //           color: "#999",
    //         },
            
    //         min: function (value) {
    //           return lcl.toFixed(2)-5;
    //         },
    //         max: function (value) {
    //           return ucl.toFixed(2)+5  ;
    //         }
    //       },
    //       series: [
    //         {
    //           data: yexpectedData,
    //           type: "line",
    //           smooth: false ,
    //           lineStyle: {
    //             normal: {
    //               width: 2,
    //               color:'#FFBA00'
    //             },
    //           },
    //           itemStyle: {
    //               color: "red",
    //               borderWidth: 6,
    //               borderColor: "red",
    //           },
    //           markLine:{
    //                 symbol:'none',

    //             data: [
    //               {
    //                 yAxis: [ucl.toFixed(2)],
    //                 name: 'UCL',
    //                 label: {formatter: '上控制线({b})={c}', fontSize: "14", fontWeight:"bolder", color: '#000'},
    //                 lineStyle: {
    //                   color: 'darkred',
    //                   width: 2,
                      
    //                 },

    //               },
    //               {
    //                 yAxis: [cl.toFixed(2)] ,
    //                 name: 'CL',
    //                 label: {formatter: '中心线({b})={c}', fontSize: "14", fontWeight:"bolder", color: '#000'},
    //                 lineStyle: {
    //                   color: '#000',
    //                   type: 'solid',
    //                   width: 2,
    //                 },

    //               },
    //               {
    //                 yAxis: [lcl.toFixed(2)],
    //                 name: 'LCL',
    //                 label: {formatter: '下控制线({b})={c}', fontSize: "14",  fontWeight:"bolder", color: '#000'},
    //                 symbol:'none',

    //                 lineStyle: {
    //                   color: 'darkred',
    //                   width: 2,
    //                 },
    //               }
    //             ]
    //           }
    //         },
    //       ],
    //     },
    //     true
    //   );
    // },
  },
};
</script>
