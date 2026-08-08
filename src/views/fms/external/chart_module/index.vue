<template>
  <div class="app-container spclayout"  @click.right.prevent="showright" @click.left.prevent="  isShowMenu = false">
    <div class="chartlayout">
      <el-row :gutter="32">
      <el-col  :xs="36" :sm="36" :lg="item.width ? item.width : 12" v-for="(item,i) in lineData">
       <div class="chartbox"  :style="{'height':item.height ? item.height+'px' : '450px'}"   >
        <!-- <div class="chartbox_header">
          <div class="chartbox_title">{{item.title}}</div>
         
          <div style="margin-right:4px">
           
             <i class="el-icon-download icon_button"  @click="downloadpic(i)"></i>
          </div>
          
        </div> -->
        <LineChart :itemData="item" :externalreportdata='externalreportdata' :executionmethod='item.method' ref="linechartex" :id='item.id' v-if="allchartdata[item.allchartdatakeys]" :key="item.id"  :bardata='allchartdata[item.allchartdatakeys]'   />
      </div>
      
      </el-col>
         
    
    </el-row>
      
    </div>
    <div>
    </div>
    
   
  </div>
</template>

<script>
import Vue from 'vue'
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import script_editer from './components/script-editer'
import LineChart from './components/line_chart'
import i18n from '@/lang'
import jsyaml from "js-yaml"
const parseYamlFn = (str) => {
  let isYaml = false;
  let errorMessage = '';
  try {
     jsyaml.load(str)
     isYaml = true
  } catch(e) {
    isYaml = false
    errorMessage = e;
  }
  return {
    isYaml, errorMessage
  };
}

export default {
  props:{
    currScripts: Object,
    allchartdata: Object,
    externalreportdata: Array,

  },
  components: {script_editer, LineChart},

  data() {
    return {
      scriptsEditer:{},
      timer:'',
      dtsOfswitch:'script_editer',
      dialogFormVisible:false,
      scriptsVisible:false,
      color1: null,
      chart: null,
      isShowMenu: false,
      menuTop: 0,
      menuLeft: 0,
      dialogFormadd:{},
      pathparams:{},
      // singlechartData:[],
      lineData:[],
      viewType:'',
      status:'',
      scriptOps:{
          scriptValue:'',
           scriptId:''
      },
      defaultForm: {
        params: {
          id: ''
        }
      },
      chartData: {
        xactualData: [1, 2, 3, 4],
        yexpectedData: [1, 2, 3, 4],
      },
    };
  },
  watch: {
    externalreportdata: {
      handler: function(val, oldVal) {
      },
      immediate: true,
      deep: true
    },
    currScripts: {
      handler: function(val, oldVal) {
        console.log(val);
        
        let arr = Object.keys(val.chart.plot) 
        this.lineData = Object.values(val.chart.plot) 
        this.lineData.forEach((item,i)=>{
          item['allchartdatakeys'] = arr[i]
        })
        val.cols.forEach(c=>{
          if(c.isChart && val.chart.plot[c.field]){
              this.lineData.forEach((item,i)=>{
                item['allchartdatakeys'] = arr[i]
                if(arr[i] == c.field){
                  item['chartitle'] = c.title
                }
              })
            
          }
        })
      },
      immediate: true,
      deep: true
    },
    allchartdata: {
      handler: function(val, oldVal) {


      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.viewType = this.$route.params.viewType
    this.status = this.$route.params.status
  },
  mounted() {
    this.$nextTick(() => {
    });
    // this.timer = setInterval(() => {
    //       this.getlineData();
    //   },10000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
     
  },
  methods: {
    downloadpic(i){
        this.$refs.linechartex[i].picdown()
    },
    showright(e){
      this.isShowMenu = true
      this.menuLeft = e.pageX
      this.menuTop = e.pageY
    },
     del(index, row) {
      this.$confirm(i18n.t('common.tip_info.delete_info'), i18n.t('common.tip_info.tips'), {
        confirmButtonText: i18n.t('common.btn.ok'),
        cancelButtonText: i18n.t('common.btn.cancel'),
        type: 'warning'
      }).then(() => {
        const _data = { url: '/calc/del', params: { data: row.id }}
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            this.lineData.splice(index, 1)
            this.$message({
              type: 'success',
              message: 'delete success!'
            })
          }).catch(err => {
          console.error(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'cancel delete'
        })
      })
    },
    getlineData(){
      const _data = {url:'/calc/userItems',params: { data: {viewType:this.viewType,status:this.status} }}
          this.$store.dispatch('fmsCommon/actionTaskPost',_data)
          .then(data => {
            data.forEach(item=>{
              item['backgroundColor']= eval("("+item.fieldText+")").backgroundColor ? eval("("+item.fieldText+")").backgroundColor : 'white'
              item['warnshow'] = false;
              item['width']= eval("("+item.fieldText+")").width ? eval("("+item.fieldText+")").width : 12
              item['height']= eval("("+item.fieldText+")").height ? eval("("+item.fieldText+")").height : 450       
              item['timer']= eval("("+item.fieldText+")").timer ? eval("("+item.fieldText+")").timer : false   
          })

            this.lineData = data;
            this.warnshow = false;
          }).catch(err => {
              console.error(err)
          }).finally(()=>{
       })
    },
  
   
   
   
  },
};
</script>
<style scoped lang="scss">
.spclayout{
  background-color: #f0f2f5;
  // background-color: #fff;
  
}
.spc_header{
  padding: 5px;
  width:100%;
  background-color: #fff;
  border-radius: 5px;
}
.el-col{
  background-color: #fff;
  margin-bottom: 5px;

}
.chartbox{
  margin-top:10px;
  /* background-color: #fff; */
  height:450px;
  padding:20px;
  overflow: hidden;
  /* background-color: lightgrey; */
}
.chartbox_header{
  display: flex;
  justify-content: end;
}
.chartbox_title{
  font-size:20px;
  flex: 1;
  /* width: 80%; */
}
.color_chooose{
  width:160px;
 margin-right:4px;
 display:flex;
 justify-content:center;
 align-items:center;
}
.icon_button{
  cursor: pointer;
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
.warninfo{
  width: 100%;
  height:100px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  padding-bottom:20px;
  ::-webkit-scrollbar {
    height: 5px;
    width: 5px;
  }
::-webkit-scrollbar-thumb {
    border-radius: 0px;
    -webkit-box-shadow: inset 0 0 5px grey;
    background: white;
  }
::-webkit-scrollbar-track {
    -webkit-box-shadow: 0;
    border-radius: 0px;
    background:white;
  }
  ul{
    margin:0;
    overflow: auto;
    padding-right:20px;

    li{
      list-style:none;
      color:red;
      transition: all 2s ease-in;
      
    }
    
  }
  
}
.v-enter-active,.v-leave-active {
		  transition: all .8s ease;
          }
		.v-enter, .v-leave-to{
		  transform: translateX(100px);
		  opacity: 0;
		}
</style>
