<template>
    <div id="cards">
      <div class="card-item" v-for="(item, index) in dataSource" :key="index+'t'">
        <div class="card-header">
          <div class="card-header-left">测试设备</div>
          <div class="card-header-right">{{`0${index+1}`}}</div>
        </div>
        <div class=" ring-charts">
            <div :id="'pieechart'+index" class="pieechart" ></div>
        </div>
        <div class="card-footer">
          <div class="card-footer-item">
            <div class="footer-title">累计金额</div>
            <div class="footer-detail">
                <div class= "moneynum">9000</div>
                <div style="color: #1294fb;">元</div>
            </div>
          </div>
          <div class="card-footer-item">
            <div class="footer-title">巡查病害</div>
            <div class="footer-detail">
                <div class= "chunum">49</div>
                <div style="color: #1294fb;">出</div>
            </div>
          </div>
        </div>
      </div>
      </div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "dashPie",

  data() {
    return {
      dataSource: [
        {a:'01'},
        {a:'02'},
        {a:'03'},
        {a:'04'},
        {a:'05'},
      ],
    };
  },

  

  methods: {
    initChart() {
      this.dataSource.forEach((item,ind)=>{
        var pieecharts = document.getElementById('pieechart'+ind)
        var myChart = echarts.init(pieecharts);
        myChart.setOption({
        tooltip: {
          trigger: "item",
        },
        legend: {
         show:false
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: ["85%", "100%"],
            avoidLabelOverlap: false,
            tooltip: {
              show: false,
              trigger: "item",
            },
            
            silent: "ture",
            label: {
              position: "center",
              show: true,
              formatter: () => {
                let str = "维修占比51%"
                return str;
              },
              color: "#03D3EC",
              lineHeight: 16,
              fontSize: 20,
            },

            emphasis: {
              label: {
                show: false,
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 1048, name: "Search Engine", itemStyle:{color:'#03D3EC'} },
              { value: 735, name: "Direct", itemStyle:{color:'rgba(6,30,93,.5)'} },
            ],
          },
        ],
      })

      })
      
    },
  },

  mounted() {
      this.initChart();
  },
};


</script>

<style lang="scss" scoped>
#cards {
  height:100%;
  width:100%;
  display:flex;
  justify-content: space-between;
}
.card-item {
  background-color: rgba(6, 30, 93, 0.5);
  border-top: 2px solid rgba(1, 153, 209, 0.5);
  width: 19%;
  flex-direction: column;
  padding-bottom: 10px;
}
.card-header {
  display: flex;
  height: 20%;
  align-items: center;
  justify-content: space-between;
  .card-header-left {
    font-size: 18px;
    font-weight: 700;
    padding-left: 20px;
    color: white;
  }
  .card-header-right {
    padding-right: 20px;
    font-size: 40px;
    color: #03d3ec;
  }
}
.ring-charts {
  width: 100%;
  height: 200px;
}
.pieechart {
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
}
.card-footer {
  height: 25%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: distribute;
  justify-content: space-around;
  
}
.card-footer-item {
    padding: 5px 10px 0 10px;
    margin-top: 30px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 40%;
    background-color: rgba(6,30,93,.7);
    border-radius: 3px;
  }
.footer-title {
  font-size: 15px;
  margin-bottom: 5px;
  color: white;
}
.footer-detail {
  font-size: 20px;
  display: flex;
  font-size: 18px;
  align-items: center;
  justify-content:end;
 
 
}
.moneynum{
  color: rgb(234,96,39);
  font-weight: bold;
  font-size: 30px;
}
.chunum{
  color:#03D3EC;
  font-weight: bold;
  font-size: 30px;
}
</style>