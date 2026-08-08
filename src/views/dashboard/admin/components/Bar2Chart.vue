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
  },
  data() {
    return {
      chart: null,
      value1: [],
      charData: [],
      timer: {},
    };
  },
  created() {
    this.getMouthCount();
    this.timer = setInterval(this.getMouthCount, 120 * (60 * 1000));
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
  watch: {
/*    value1() {
      this.chart.dispose();
      this.initChart();
    },
    value2() {
      this.chart.dispose();
      this.initChart();
    },
    value3() {
      this.chart.dispose();
      this.initChart();
    },
    value4() {
      this.chart.dispose();
      this.initChart();
    },*/
  },
  methods: {
    async getMouthCount() {
    /*  await GetRecordRedis().then((response) => {
        if (response.data.STORAGE_CHARDATA.length == 0) {
          this.value1 = ["物料", "托盘"];
          this.charData[0] = {
            value: 0,
            name: "物料",
          };
          this.charData[1] = {
            value: 0,
            name: "托盘",
          };
        } else {
          for (let i = 0; i < response.data.STORAGE_CHARDATA.length; i++) {
            this.charData[i] = {
              value: response.data.STORAGE_CHARDATA[i].STORAGESUMTOTAL,
              name: response.data.STORAGE_CHARDATA[i].GOODS_PROPERTY2,
            };
            this.value1[i] = response.data.STORAGE_CHARDATA[i].GOODS_PROPERTY2;
          }
        }
        this.initChart();
      });*/
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          type: "scroll",
          data: this.value1,
        },
        series: [
          {
            name: "WEEKLY WRITE ARTICLES",
            type: "pie",
            roseType: "radius",
            radius: [15, 95],
            data: this.charData,
            animationEasing: "cubicInOut",
            animationDuration: 2600,
          },
        ],
      });
    },
  },
};
</script>
