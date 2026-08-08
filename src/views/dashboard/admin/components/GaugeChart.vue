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
      xzdata:[],
      increase:[],
      ngIncrease:[],
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
    this.chart = null;
  },
  methods: {
    getBardata(){
     
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.setOption({
        tooltip: {
    formatter: '{a} <br/>{b} : {c}%'
  },
  series: [
    {
      name: 'Pressure',
      type: 'gauge',
      progress: {
        show: true
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}%'
      },
      data: [
        {
          value: 50,
          name: 'SCORE'
        }
      ]
    }
  ]
      });
    },
   
   
  },
};
</script>
