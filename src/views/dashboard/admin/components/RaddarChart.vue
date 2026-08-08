<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";
import { GetRecordRedis } from "@/api/chartinfo";

const animationDuration = 3000;

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
  watch: {
    value1() {
      this.chart.dispose();
      this.initChart();
    },
  },
  data() {
    return {
      chart: null,
      value1: [],
      charData1: [],
      charData2: [],
      charData3: [],
      charData4: [],
      timer: {},
    };
  },
  created() {
    this.GetPlanRedisList();
    this.timer = setInterval(this.GetPlanRedisList, 120 * (60 * 1000));
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
    async GetPlanRedisList() {
   /*   await GetRecordRedis().then((response) => {
        for (let i = 0; i < response.data.PLAN_CHARDATA.length; i++) {
          if (response.data.PLAN_CHARDATA[i]) {
            this.value1[i] = response.data.PLAN_CHARDATA[i].GOODS_PROPERTY2;
            this.charData1[i] = response.data.PLAN_CHARDATA[i].PLAN_LIST_QUANTITY
            this.charData2[i] = response.data.PLAN_CHARDATA[i].PLAN_LIST_ORDERED_QUANTITY
            this.charData3[i] = response.data.PLAN_CHARDATA[i].PLAN_LIST_FINISHED_QUANTITY
            this.charData4[i] = response.data.PLAN_CHARDATA[i].PLAN_LIST_UNFINISHED_QUANTITY
            // this.charData[i] = {
            //   product: response.data.PLAN_CHARDATA[i].GOODS_PROPERTY1,
            //   预下发计划: response.data.PLAN_CHARDATA[i].PLAN_LIST_QUANTITY,
            //   已下发计划:
            //     response.data.PLAN_CHARDATA[i].PLAN_LIST_ORDERED_QUANTITY,
            //   已完成计划:
            //     response.data.PLAN_CHARDATA[i].PLAN_LIST_FINISHED_QUANTITY,
            //   未完成计划:
            //     response.data.PLAN_CHARDATA[i].PLAN_LIST_UNFINISHED_QUANTITY,
            // };
          }
        }
        // this.value1[0] = "product";
        // this.value1[1] = "预下发计划";
        // this.value1[2] = "已下发计划";
        // this.value1[3] = "已完成计划";
        // this.value1[4] = "未完成计划";
        this.initChart();
      });*/
    },

    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // Use axis to trigger tooltip
            type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
          },
        },
        legend: {},
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          data: this.value1,
        },
        series: [
          {
            name: "预下发计划",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            data: this.charData1,
          },
          {
            name: "已下发计划",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            data:this.charData2,
          },
          {
            name: "已完成计划",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            data: this.charData3,
          },
          {
            name: "未完成计划",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            data: this.charData4,
          },
        ],
        // legend: {},
        // tooltip: {},
        // dataset: {
        //   dimensions: this.value1,
        //   source: [
        //     { product: "P20210912", 预下发计划: 43.3, 已下发计划: 85.8, 已完成计划: 93.7 ,未完成计划:44.5},
        //     { product: "P20210911", 预下发计划: 43.3, 已下发计划: 85.8, 已完成计划: 93.7 ,未完成计划:44.5},
        //     { product: "P20210922", 预下发计划: 43.3, 已下发计划: 85.8, 已完成计划: 93.7 ,未完成计划:44.5},
        //     { product: "P20210910", 预下发计划: 43.3, 已下发计划: 85.8, 已完成计划: 93.7 ,未完成计划:44.5},
        //     { product: "P20210914", 预下发计划: 43.3, 已下发计划: 85.8, 已完成计划: 93.7 ,未完成计划:44.5},
        //     { product: "P20210915", 预下发计划: 43.3, 已下发计划: 85.8, 已完成计划: 93.7 ,未完成计划:44.5},
        //     { product: "P20210916", 预下发计划: 43.3, 已下发计划: 85.8, 已完成计划: 93.7 ,未完成计划:44.5},
        //   ],
        // },
        // xAxis: { type: "category" },
        // yAxis: {},
        // // Declare several bar series, each will be mapped
        // // to a column of dataset.source by default.
        // series: [
        //   { type: "bar" },
        //   { type: "bar" },
        //   { type: "bar" },
        //   { type: "bar" },
        // ],
      });
    },
  },
};
</script>
