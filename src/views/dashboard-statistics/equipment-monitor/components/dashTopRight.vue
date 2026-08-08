<template>
    <div class="dashboard-top-right">
        <div class="eq-intact">
            <div>
                设备完好率月趋势
            </div>
            <div class="inact-chart" ref="intactcChart" :style="{ width:'90%', height: '90%'}"></div>
        </div>
        <div class="eq-breakdown">
            <div>
                设备故障率月趋势
            </div>
            <div class="break-chart" ref="breakChart" :style="{ width:'90%', height: '90%'}"></div>
        </div>
    </div>
</template>
  
  <script>
  import echarts from "echarts";
  export default {
    name: 'Top',
    components: { },
    data() {
      return {
        leftNumData:[],
        rqTaskNum: 81,
        eqPercent: 15,
        QOQ: 0,
        intactMonth:['12/1', '12/2', '12/3', '12/4', '12/5', '12/6', '12/7'],
        intactData:[820, 932, 901, 934, 1290, 1330, 1320],
        breakMonth:['12/1', '12/2', '12/3', '12/4', '12/5', '12/6', '12/7'],
        breakData1:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
        breakData2:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
        breakData3:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
      }
    },
    computed: {
    },
    mounted() {
        this.intactChart();
        this.breakChart();
    },
    methods: {
        intactChart() {
            let intactChart = echarts.init(this.$refs.intactcChart);
            const chartObserver = new ResizeObserver(() => {
                intactChart.resize();
            });
            chartObserver.observe(this.$refs.intactcChart)
            intactChart.setOption({
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.intactMonth,
                    axisLine: {
                        lineStyle: {
                            color: '#272729', //x轴的颜色
                            width: 1, //轴线的宽度
                        },
                    },
                    axisLabel: {
                        textStyle: {
                            color: 'rgba(173,216,230,0.5)'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#272729', //x轴的颜色
                            width: 1, //轴线的宽度
                        },
                    },
                    axisLabel: {
                        textStyle: {
                            color: 'rgba(173,216,230,0.5)'
                        },  
                    },
                    splitLine:{show: false}
                },
                legend:{
                    data:['设备完好率'],
                    textStyle:{
                        color:'#fff',
                        align: 'center',
                        fontSize: 13
                    },
                    x:'center',
                    y: 'bottom'
                },
                series: [
                    {
                        data: this.intactData,
                        name: '设备完好率',
                        showAllSymbol: true,
                        symbol: 'circle',
                        symbolSize: 4,
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                                normal: {
                                color: '#42B983', //折线点的颜色
                                borderColor: '#42B983', //拐点边框颜色
                                borderWidth: 2, //拐点边框大小
                                width: 3
                            },
                        },
                        lineStyle: {
                            color: '#00c0ff', //折线的颜色
                        },
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                    offset: 0,
                                    color: '#00f',
                                    },
                                    {
                                    offset: 1,
                                    color: 'rgba(47,196,154,0.01)',
                                    },
                                ],
                                global: false,
                            },
                        }
                    }
                ]
                })
        },
        // 柱状图 + 折线图
        breakChart() {
            let beChart = echarts.init(this.$refs.breakChart);
            const breakChartOb = new ResizeObserver(() => {
                beChart.resize();
            })
            breakChartOb.observe(this.$refs.breakChart)
            beChart.setOption({
                legend: {
                    data: ['故障数量', '维修数量'],
                    y: 'bottom',
                    textStyle:{
                        color:'#fff',
                        align: 'center',
                        fontSize: 13
                    },
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.breakMonth,
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel: {
                            textStyle: {
                                color: 'rgba(173,216,230,0.5)'
                            }
                        },
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '',
                        min: 0,
                        max: 200,
                        interval: 50,
                        axisLabel: {
                            formatter: '{value}',
                            textStyle: {
                                color: 'rgba(173,216,230,0.5)'
                            }
                        },
                        splitLine:{show: false}
                    },
                ],
                series: [
                    {
                        name: '故障数量',
                        type: 'bar',
                        tooltip: {
                            valueFormatter: function (value) {
                            return value + ' ml';
                            }
                        },
                        itemStyle: {
                            color: 'rgba(30,144,255,.5)',
                        },
                        data:this.breakData1 
                    },
                    {
                        name: '维修数量',
                        type: 'line',
                        tooltip: {
                            valueFormatter: function (value) {
                            return value;
                            }
                        },
                        itemStyle: {
                                normal: {
                                color: '#42B983', //折线点的颜色
                                borderColor: '#42B983', //拐点边框颜色
                                borderWidth: 2, //拐点边框大小
                                width: 3
                            },
                        },
                        lineStyle: {
                            color: '#00c0ff', //折线的颜色
                        },
                        data: this.breakData2
                    },
                ]
                })
        },
        
    },
  }
  </script>
  <style lang="less" scoped>
    .dashboard-top-right {
        width: 70%;
        display: flex;
        margin:0;
        padding: 0;
       .eq-intact {
            width:50%;
            // border: 1px solid #778899;
            margin:0 20px;
            >div {
                text-align: right;
                margin:20px 10px 0 0;
            }
            .inact-chart{
                margin:0 auto;
            }
       }
       .eq-breakdown {
            width:50%;
            // border: 1px solid #778899;
            >div {
                text-align: right;
                margin:20px 10px 0 0;
            }
            .break-chart{
                margin:0 auto;
            }
       }
    }
  </style>
  