<template>
    <div class="dashboard-mid">
        <div class="rose-chart">
            <div class="rose-board-title">故障分类</div>
            <div class="roseCharts" ref="roseCharts" :style="{ height: '90%'}"></div>
        </div>
        <div class="pie-chart">
            <div class="pie-board-title">计划产量累计完成情况</div>
            <div class="water-level-chart-details">累计完成<span>235,680</span>件</div>
            <div class="pieCharts" ref="pieCharts" :style="{ height: '60%'}"></div>
        </div>
    </div>
</template>
  
<script>
import echarts from "echarts";
require("echarts/theme/macarons");
import 'echarts-liquidfill';
import resize from "./mixins/resize";
  export default {
    name: 'Left',
    mix: [resize],
    components: { },
    data() {
      return {
        roseData:[],
      }
    },
    computed: {
    },
    created() {
     
    },
    mounted() {
        let roseCharts = echarts.init(this.$refs.roseCharts);
        let option = {
                backgroundColor: 'transparent',
                title: {
                    show: false,
                },
                tooltip: {
                    trigger: 'item'
                },
                visualMap: {
                    show: false,
                    min: 80,
                    max: 600,
                    inRange: {
                    colorLightness: [0, 1]
                    }
                },
                series: [
                    {
                    name: 'Access From',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: [
                        { value: 335, name: '故障1' },
                        { value: 310, name: '故障2' },
                        { value: 274, name: '故障3' },
                        { value: 235, name: '故障4' },
                        { value: 400, name: '故障5' }
                    ].sort(function (a, b) {
                        return a.value - b.value;
                    }),
                    roseType: 'radius',
                    label: {
                        color: 'rgb(255, 255, 255)',
                        formatter: e => {
                            return `${e.name} ${e.percent}%`
                        }
                    },
                    labelLine: {
                        lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                        },
                        smooth: 0.2,
                        length: 10,
                        length2: 20
                    },
                    itemStyle: {
                        color: '#c23531',
                        shadowBlur: 200,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                        }
                    }
                ]
        };
        roseCharts.setOption(option);
        // pieCharts图
        let num1 = 0.5;
        let pieCharts = echarts.init(this.$refs.pieCharts);
        pieCharts.setOption(
            {
            title: {
                text: (num1 * 100).toFixed(2) + '%',
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: 18,
                    color: '#19c3eb',
                },
                x: 'center',
                y: '40%',
            },
            series: [
                {
                    type: 'liquidFill',
                    radius: '80%',
                    center: ['50%', '50%'],
                    data: [num1],
                    color: 'rgba(69, 229, 155, 0.3)',
                    backgroundStyle: {
                        borderWidth: 20,
                        // color: '#0e6698',
                        opacity:0,
                    },
                    // 图形样式
                    itemStyle: {
                        color: '#0e6698', // 水球显示的背景颜色
                        opacity: 0.5, // 波浪的透明度
                        shadowBlur: 10 // 波浪的阴影范围
                    },
                    label: {
                        normal: {
                            formatter: '',
                        },
                    },
                    outline: {
                        show: false,
                    },
                },
                {
                    type: 'pie',
                    center: ['50%', '50%'],
                    radius: ['90%', '80%'],
                    hoverAnimation: false,
                    data: [
                        {
                            name: '',
                            value: (num1 * 100).toFixed(2),
                            labelLine: {
                                show: false,
                            },
                            itemStyle: {
                                color: '#19c3eb',
                            },
                            emphasis: {
                                labelLine: {
                                    show: false,
                                },
                                itemStyle: {
                                    color: '#5886f0',
                                },
                            },
                        },
                        {
                            //画剩余的刻度圆环
                            name: '',
                            value: '100%',
                            itemStyle: {
                                color: '#19c3eb',
                            },
                            label: {
                                show: false,
                            },
                            labelLine: {
                                show: false,
                            },
                            emphasis: {
                                labelLine: {
                                    show: false,
                                },
                                itemStyle: {
                                    color: '#ffffff',
                                },
                            },
                        },
                    ],
                },
            ],
        })
    },
  }
  </script>
  <style lang="less" scoped>
    .dashboard-mid {
        display: flex;
        width: 100%;
        .rose-board-title {
            height:50px;
            text-indent: 20px;
            font-size: 20px;
            font-weight: 700;
            -webkit-box-align: center;
            display: flex;
            align-items:center;
        }
        .rose-chart {
                width:60%;
                background: rgba(6,30,93,.5);
                border-top: 2px solid rgba(1,153,209,.5);
                color: #fff;
                margin-right: 20px;
                .roseCharts{
                    margin: 20px 0;
                    display: flex;
                    justify-content: center;
                }
            }
        .pie-board-title{
            height:50px;
            font-size: 20px;
            font-weight: 700;
            -webkit-box-align: center;
            display: flex;
            justify-content: center;
            align-items:center;
            }
        .water-level-chart-details {
            height:17%;
            font-size: 17px;
            text-align: center;
            span {
                color: #58a1ff;
                font-weight: 700;
                font-size: 35px;
                margin: 0 5px;
                margin-bottom: -5px;
            }
        }
        .pie-chart {
                color: #fff;
                width:40%;
                background: rgba(6,30,93,.5);
                border-top: 2px solid rgba(1,153,209,.5);
                .pieCharts {
                    display: flex;
                    justify-content: center;
                }
            }
        }
        
    
  </style>
  