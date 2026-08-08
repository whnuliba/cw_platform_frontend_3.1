<template>
  <div @click.right.prevent="showright"  @click.left.prevent=" isShowMenu = false" class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" /> -->
    <div class="rightclick" v-if="isShowMenu" :style="{'left': menuLeft + 'px', 'top': menuTop + 'px'}">
      <div class="menu-item" @click='chartadd'>
        <i style="margin-right:10px" class="el-icon-plus icon_button"></i>
        <span>新增</span>
      </div>
      <div></div>
    </div>
    <!-- <panel-group  @handleSetLineChartData="handleSetLineChartData"  :rowdata='panelData' /> -->

    <!-- <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px"> -->
     <!-- <LineChart  :bardata='panelData' /> -->
     <ChartModule ref="chartmodul" />
    <!-- </el-row> -->
    <!-- <el-row :gutter="32">
      <el-col :xs="36" :sm="36" :lg="16">
        <div class="chart-wrapper">
          <bar-chart @barClick= 'barClick'  :bardata='panelData'  :bartype='1'/>
        </div>
      </el-col>
         <el-col :xs="36" :sm="36" :lg="8">
        <div class="chart-wrapper">
          <pie-chart  :pieData='pieData' @pieClick='pieClick' />
        </div>
      </el-col>
     
    </el-row> -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      >
      <el-button type="primary" @click="download" :style="{float:'right',marginBottom:'10px'}">下载</el-button>
      <el-table
        ref="tableA"
        height='400px'
        :data="tableData"
        highlight-current-row
        style="width: 100%" id="out-table" prop="out-table">
        <el-table-column v-for="(row,i) in this.colums" :key="`rowOne${i}`"
            :prop="row.prop"
            :label="row.label"
            :width="row.width">
          
        </el-table-column>
      </el-table> 
      
      
    </el-dialog>
    <!-- <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    //</el-row>-->
  </div>
</template>

<script>
import GithubCorner from "@/components/GithubCorner";
import PanelGroup from "./components/PanelGroup";
import ChartModule from "./chart_module";
import LineChart from "./components/LineChart";
import RaddarChart from "./components/RaddarChart";
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";
import TransactionTable from "./components/TransactionTable";
import TodoList from "./components/TodoList";
import BoxCard from "./components/BoxCard";
import BarTChart from "./components/Bar2Chart";
import GaugeChart from "./components/GaugeChart";
import { GetRecordRedis } from "@/api/chartinfo";
import { getManageTypeList } from "@/api/manage_type";
import { GetFrontData,GetHomeNgData,getHomeNgDataCellBarCode} from '@/api/frontpage'
import XLSX from "xlsx";
import FileSaver from "file-saver";
import moment from 'moment' 

const lineChartData = {
  ManageIn: {
    expectedData: [],
    actualData: [],
  },
  ManageOut: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [],
  },
  StorageWeek: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [],
  },
  PlanWeek: {
    expectedData: [],
    actualData: [],
  },
};

export default {
  name: "DashboardAdmin",
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    ChartModule,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard,
    BarTChart,
    GaugeChart,
  },
  data() {
    return {
      lineChartData: {},
      value1: [],
      value2: [],
      value3: [],
      value4: [],
      tableData: [],
      colums: [
        {prop: 'createTime',label:'创建时间',width:150,},
        {prop: 'cellBarCode',label:'电芯条码',width:180,},        
        {prop: 'processCode',label:'工序编码',},        
        {prop: 'channel',label:'通道',},
        {prop: 'remark',label:'异常纪录',},
        {prop: 'retest',label:'是否复测',},
      ],
      panelData: undefined,
      pieData: undefined,
      dialogVisible: false,
      isShowMenu: false,
      menuTop: 0,
      menuLeft: 0,
    };
  },
  created() {
    //   GetFrontData().then(res=>{

    //   this.panelData = res.data.data
    // })
    //   GetHomeNgData().then(res=>{
    //   this.pieData = res.data.data
    // })
  },
  mounted() {
   // this.handleSetLineChartData();
  
  },
  methods: {
    chartadd(){
      this.$refs.chartmodul.myscript()
      this.isShowMenu = false

    },
    showright(e){
      // console.log(e);
      this.isShowMenu = true
      // this.menuLeft = e.pageX
      // this.menuTop = e.pageY
      this.menuLeft = e.clientX
      this.menuTop = e.clientY
    },
    download(){
        /* 从表生成工作簿对象 */
        var wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
        /* 获取二进制字符串作为输出 */
        var wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array"
        });
        try {
          FileSaver.saveAs(
            //Blob 对象表示一个不可变、原始数据的类文件对象。 //Blob 表示的不一定是JavaScript原生格式的数据。
            //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
            //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
            new Blob([wbout], { type: "application/octet-stream" }),
            //设置导出文件名称
            "1.xlsx"
          );
        } catch (e) {
          if (typeof console !== "undefined")
            console.log(e, wbout);
        }
        return wbout;
      },
    async handleSetLineChartData() {
     
     
    },
    pieClick(v){
      getHomeNgDataCellBarCode({
        processCode:v.data.processCode,
        remark:v.data.remark,
      }).then(res=>{
       this.tableData =  res.data.data.map(item=>{
          item.createTime = moment(item.createTime).format("yyyy-MM-DD HH:mm:ss")
          return item;
        })
      })
      this.dialogVisible = true
    },
    barClick(v){
      GetHomeNgData({
        processCode:v.name
      }).then(res=>{
        this.pieData = res.data.data

    })
    }
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
.rightclick{
  position: fixed;
  z-index: 1004;
  background-color: #fff;
  width:150px;
  // height:200px;
  background-color: white;
  border-radius: 5px;
  padding: 5px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  .menu-item{
    cursor: pointer;
    padding: 2px 4px;
    border-radius: 3px;
    color: #7e7e7e;
    transition: all .2s ease-in;
  }
  .menu-item:hover {
    background-color: #E9EAEC;
    i{
      color: black;
    }
    color: black;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
