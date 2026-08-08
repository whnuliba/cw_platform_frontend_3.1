<template>
    <div class="dashboard-top-left">
        <div class="eq-intact">
            <div>
                <div class="intact-text">设备完好率</div>
                <div class="intact-percent"><span>{{eqCompelete}}</span>%</div>
                <div class="eq-intact-chart" ref="eqIntact" id="eqIntact" :style="{ width:'90%', height: '80%'}"></div>
            </div>
        </div>
        <div class="eq-breakdown">
            <div>
                <div class="repair-text">维修平均用时</div>
                <div class="repair-time"><span>{{repairTime}}</span>小时</div>
                <div class="average-time" ref="averageTime" id="averageTime" :style="{ width:'90%', height: '50%'}"></div>  
            </div>
            
        </div>
    </div>
</template>
  
  <script>
  import echarts from "echarts";
  export default {
    name: 'Bottom',
    components: { },
    data() {
      return {
        eqCompelete: 81.01,
        repairTime: 55.1,
        eqCompleteData: [
                                    {
                                        value: 5,
                                        name: '数据1'
                                    },
                                    {
                                        value: 15,
                                        name: '数据2'
                                    },
                                    {
                                        value: 25,
                                        name: '数据3'
                                    },
                                    {
                                        value: 20,
                                        name: '数据4'
                                    },
                                    {
                                        value: 35,
                                        name: '数据5'
                                    },
                                    {
                                        value: 35,
                                        name: '数据6'
                                    },
                                    {
                                        value: 35,
                                        name: '数据7'
                                    }
                                ]
      }
    },
    computed: {
    },
    mounted() {
        const intactChart = echarts.init(document.getElementById('eqIntact'));
        const aveTime = echarts.init(document.getElementById('averageTime'));
        this.eqIntact(intactChart);
        this.averageTime(aveTime);
        window.onresize = () => {
            intactChart.resize();
            aveTime.resize();
        }
    },
    methods: {
        // 完好率ecahrts
        eqIntact(chart) {
            // let intactChart = echarts.init(this.$refs.eqIntact);
            chart.setOption({
                            backgroundColor: 'transparent',
                            color: ["#F86464", "#19DC7C", "#34A6FE", "#FA9022", "#DCDB01", "#8C70F8", "#2A4AD1", "#E76FE3", "#5032C0", "#168FB2"],
                            grid: {
                                left: '2%',
                                top: '1%',
                                bottom: 10,
                                right: '1%',
                                containLabel: true
                            },
                            tooltip: {
                                trigger: 'item',
                                textStyle: {
                                    fontSize: 14
                                },
                                formatter: "{b} : {c} ({d}%)"
                            },
                            calculable: true,
                            series: [
                            
                            {
                                stack: 'a',
                                type: 'pie',
                                radius: ['20%', '40%'],
                                center: ['55%', '35%'],
                                roseType: 'area',
                                zlevel: 10,
                                label: {
                                    normal: {
                                        formatter: '{d}%',
                                        borderWidth: 0,
                                        borderRadius: 4,
                                        padding: [0, -50],
                                        height: 40,
                                        fontSize: 12,
                                        align: 'center',
                                        rich: {
                                            b: {
                                                fontSize: 13,
                                                lineHeight: 5,
                                                color: '#41B3DC'
                                            }
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: true,
                                        length: 20,
                                        length2: 55
                                    },
                                    emphasis: {
                                        show: false
                                    }
                                },
                                data: this.eqCompleteData
                            }, ]
                        })
                    },
        // 用时
        averageTime(chart) {
            // let aveTime = echarts.init(this.$refs.averageTime);
            chart.setOption(
               {
                backgroundColor: 'transparent',
                angleAxis: {
                    type: 'value',
                    min: 0,
                    max: 70,
                    axisLine: {
                    show: false,
                    },
                    axisTick: {
                    show: false,
                    },
                    splitLine: {
                    show: false,
                    },
                    axisLabel: {
                    show: false,
                    },
                },
                radiusAxis: {
                    type: 'category',
                    data: ['其他', '资源加工工业', '轻纺工业', '机械电子制造业'],
                    z: 100,
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        show: true,
                        margin: 8,
                        fontSize: 10,
                        formatter: function (value, index) {
                            var list = ['72小时以内', '48小时以内', '24小时以内', '8小时以内'];
                            return list[index];
                        },
                        textStyle: {
                            color: '#fff',
                        },
                        interval: 0,
                    },
                },
                polar: {
                    center: ['50%', '50%'],
                    radius: ['20%', '94.5%'],
                },
                tooltip: {
                    show: false,
                },
                series: [
                    {
                    type: 'bar',
                    barWidth: '20%',
                    data: [12],
                    coordinateSystem: 'polar',
                    name: '其他',
                    stack: 'a',
                    roundCap: true,
                    itemStyle: {
                        color: '#00c0ff',
                        barBorderRadius: 5,
                    },
                    z: 2,
                    },
                    {
                    type: 'bar',
                    data: [0, 25, 0, 0],
                    coordinateSystem: 'polar',
                    name: '资源加工工业',
                    stack: 'a',
                    roundCap: true,
                    itemStyle: {
                        color: '#00c0ff',
                    },
                    },
                    {
                    type: 'bar',
                    data: [0, 0, 40, 0],
                    coordinateSystem: 'polar',
                    name: '轻纺工业',
                    stack: 'a',
                    roundCap: true,
                    itemStyle: {
                        color: '#00c0ff',
                        barBorderRadius: 5,
                    },
                    },
                    {
                    type: 'bar',
                    data: [0, 0, 0, 60],
                    coordinateSystem: 'polar',
                    name: '机械电子制造业',
                    stack: 'a',
                    roundCap: true,
                    itemStyle: {
                        color: '#00c0ff',
                        barBorderRadius: 5,
                    },
                    },
                ],
                }
            )
        },
        
    },
  }
  </script>
  <style lang="less" scoped>
    .dashboard-top-left {
        width: 95%;
        height: 100%;
        display: flex;
        justify-content: center;
       .eq-intact {
            width:50%;
            >div {
                color:#fff;
                text-align: center;
                position: relative;
                .intact-text {
                    font-size: 20px;
                    margin-bottom: 20%;
                }
                .intact-percent {
                    font-weight: 700;
                    span {
                        color: #00c0ff;
                        font-size: 45px;
                    }
                }
                .eq-intact-chart{
                    margin:120px auto;
                    // position: absolute;
                    // left: 0;
                    // top: 0;
                }
            }
       }
       .eq-breakdown {
            width:50%;
            position: relative;
            >div {
                color: #fff;
                text-align: center;
                .repair-text {
                    font-size: 20px;
                    margin-bottom: 20%;
                }
                .repair-time {
                    font-weight: 700;
                    span {
                        color: #00c0ff;
                        font-size: 45px;
                    }
                }
                .average-time{
                    margin:80px auto;
                    position: absolute;
                    left:15px;
                }
            }
            
       }
    }
  </style>
  