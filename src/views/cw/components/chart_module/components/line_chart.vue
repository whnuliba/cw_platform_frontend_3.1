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
    itemData: {
      type: Object,
      default: {},
    },
    executionmethod:{
      type: Function,
      default: () => {
        return Function;
      },
    },

    bardata: {
      type: Array,
    },
    externalreportdata: {
      type: Array,
    },
  },
  data() {
    return {
      timer:'',
      ucl:0,
      cl:0,
      lcl:0,
      chart: null,
    };
  },
  watch: {
    bardata: function (newValue, oldValue) {
      if (newValue) {
        // this.getlinedata(newValue);
        // this.initChart();
      }
    },
    externalreportdata: function (newValue, oldValue) {
      if (newValue) {
      }
    },
  },
  created() {
      // this.getlinedata(this.bardata)
  },
  mounted() {
    this.$nextTick(() => {

      this.getlinedata()
      // if(row_data.timer){
      //   this.timer = setInterval(() => {
      //     _this.getlinedata(_this.bardata)
      //   },row_data.timer);
      // }
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
    getlinedata() {
        this.chart = echarts.init(this.$el, "macarons");
        this.executionmethod(this,this.bardata,this.externalreportdata,this.itemData.chartitle)
    },
    
  },
};
</script>
