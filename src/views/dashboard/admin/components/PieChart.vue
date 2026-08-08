<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";
import { GetItemList } from "@/api/sysitem";
import { GetRecordRedis } from "@/api/chartinfo";

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
    pieData: {
      type: Array,
      default: ()=> [],
    },
  },
  data() {
    return {
      chart: null,
      value1: [],
      charData1: [],
      charData: [
        {name:'a',value:0},
        {name:'b',value:0}, 
        {name:'c',value:0},
        {name:'a1',value:0},
        {name:'b1',value:0}, 
        {name:'c1',value:0},
        {name:'a2',value:0},
        {name:'b2',value:0}, 
        {name:'c2',value:0},
        {name:'a3',value:0},
        {name:'b3',value:0}, 
        {name:'c3',value:0},
        {name:'a4',value:0},
        {name:'b4',value:0}, 
        {name:'c4',value:0},
      ],
      timer: {},
      cellStatusOptions: [],
    };
  },
  watch: {
     pieData:function(newValue,oldValue){
        if(newValue){
        this.charData = [];

        this.pieData?.forEach(item=>{
         let obj = {
           ...item,
          name:item.processCode,
          value:item.total,
          }
          this.charData.push(obj);


        })
          this.initChart();

      }
    },
  },
 
  created() {
    this.getStorageStatusOptionType();
  },
  mounted() {
     this.pieData?.forEach(item=>{
       let obj = {
         ...item,
        name:item.processCode,
        value:item.total,
      }
      this.charData = [...this.charData,obj]
    })
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
    getStorageStatusOptionType() {
      let query = {
        item_code: "CELL_STATUS",
      };
  /*    GetItemList(query).then((response) => {
        response.data.forEach((item, index, array) => {
          let statesOption = {
            key: item.ITEM_LIST_CODE,
            display_name: item.ITEM_LIST_NAME,
          };
          this.cellStatusOptions[index] = statesOption;
        });
      });*/
    },
    initChart() {
      let _this = this
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.on("click", function(params) {
              //  var a = params.dataIndex
            _this.$emit('pieClick',params)

      });
      this.chart.setOption({
        color:['#ee6666',"#1492ff",'#fac858','#91cc75','#5470c6', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc','#0ed2ff'],
        title: [
           {
           text: '各工序NG分布',
          //  subtext: 'Fake Data',
           left: 'left'
          },
          {
            text: this.pieTitle,
            textStyle:{
                fontSize:20,
                color:"black",
                fontWeight:'bold'
            },
            subtextStyle: {
                fontSize: 20,
                color: 'black'
            },
            textAlign:"center",
            x: '49%',
            y: '45.5%',
          }
        ],
        tooltip: {
          trigger: "item",
          formatter: function (params) {
							let str=' ';
							str ='<div style="width:100%;padding:10px 15px 10px 15px;font-size:13px;box-sizing:border-box;border-radius:4px;position:relative;background:rgba(000,000,000,0.5)">' +
			              "<div style='display:flex;align-items:center;'>" +
			              params.data.remark +':'+params.data.total+
			             
			              "</div>" +
			              "</div>";
			              return str
					}
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            center: ['50%', '50%'],
            radius: ['20%', '65%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            label: {
              show: true,
              // position: 'center',
              formatter:function(params){
                return `${params.name}:${params.value}`;
              },
            },
            labelLine: {
                normal: {
                  length:5,
                  length2:3,
                  smooth:true,
                }
            },
            data:this.charData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
  });
    },
  },
};
</script>
