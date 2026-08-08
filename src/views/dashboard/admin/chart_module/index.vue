<template>
  <div class="spclayout">
    <!-- <div class="spc_header">
      <el-button type="primary" class="filter-item" @click="myscript">
          {{ '新增' }}
        </el-button>
    </div> -->
    <div class="chartlayout">
      <el-row :gutter="32">
      <el-col :xs="36" :sm="36" :lg="item.width" v-for="(item,i) in lineData">
       <div class="chartbox"  :style="{'background-color': item.backgroundColor,'height':item.height+'px'}"   >
        <div class="chartbox_header">
          <div class="chartbox_title">{{item.title}}</div>
         
          <div style="margin-right:4px">
            <!-- <el-button type="primary" class="filter-item" @click="editscript(item)">
              {{ '编辑' }}
            </el-button> -->
             <i class="el-icon-download icon_button"  @click="downloadpic(i)"></i>
             <i class="el-icon-edit icon_button" style="margin-left:10px" @click="editscript(item)"></i>
             <i class="el-icon-delete icon_button" style="margin-left:10px"  @click="del(i,item)"></i>
          </div>
          <div>
             <!-- <el-button type="warning" class="filter-item" @click="del(i,item)">
              {{ '删除' }}
            </el-button> -->
          </div>
        </div>
        <LineChart ref="linechartex" :id='item.id' :height="item.height+'px'" v-if="lineData.length>0" :key="item.id"  :bardata='item'   />
      
      </div>
        <div class="warninfo">
          <div >{{warnobj}}</div>
        </div>
      </el-col>
         
    
    </el-row>
      
    </div>
    <div>
    </div>
    
     <el-drawer
        :title="'脚本编写'"
        :visible.sync="scriptsVisible"
        :direction="'ltr'"
        :size="'80%'"
        :withHeader="false"
        :before-close="handleClose"
        
        v-if="viewType"
        >
          <component  :is="dtsOfswitch" ref="scriptsEditer" :scriptsEditer="scriptsEditer" @changeScript="setScript" :viewType="viewType" :status="status"> </component >
            <div style="margin-left:42%">
             <el-button @click="scriptsVisible = false">  {{ $t("common.btn.cancel") }}</el-button>
             <el-button type="primary"  @click="saveScript()">  {{ $t("common.btn.submit") }}</el-button>
            </div>
      </el-drawer>


  </div>
</template>

<script>
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
      dialogFormadd:{},
      warnobj:'',
      pathparams:{},
      lineData:[],
      viewType:'Home',
      status:'1',
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
  },
  created() {
    // this.viewType = this.$route.params.viewType
    // this.status = this.$route.params.status
    this.getlineData()
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
      console.log(this.$refs.linechartex);
        this.$refs.linechartex[i].picdown()
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
              item['width']= eval("("+item.fieldText+")").width ? eval("("+item.fieldText+")").width : 12
              item['height']= eval("("+item.fieldText+")").height ? eval("("+item.fieldText+")").height : 450
            })
            this.lineData = data;
            
          }).catch(err => {
              console.error(err)
          }).finally(()=>{
       })
    },

    setScript(data){
        this.scriptOps.scriptValue=data
    },
    handleClose(done) {
      this.$confirm(this.$t('common.btn.sureClose'))
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    myscript(){
        this.scriptOps.scriptValue=''
        // this.scriptsEditer = row
        this.scriptsVisible = true
        this.scriptOps.scriptId = ''
        this.$nextTick(function(){
          this.$refs.scriptsEditer.initScript()
        })

    },
    editscript(row){
        this.scriptOps.scriptValue=row
        // this.scriptsEditer = row
        this.scriptsVisible = true
        this.scriptOps.scriptId = row.id
        this.$nextTick(function(){
          this.$refs.scriptsEditer.initScript(row)
        })
    },
    saveScript(){

      const _this = this
        try {
            eval("("+_this.scriptOps.scriptValue+")")
       } catch(e) {
        this.$message({
          type: 'info',
          message: 'formatter error!=>'+e
        });
        return
       }
      const str_val = eval("("+_this.scriptOps.scriptValue+")")
      
     
      const _data = {url:'/calc/add',params:{data:{status:this.status,viewType:this.viewType,calcNo:str_val.calcNo, title: str_val.title, fieldText: _this.scriptOps.scriptValue,id: _this.scriptOps.scriptId}}}
      this.$store.dispatch('fmsCommon/actionTaskPost',_data)
      .then(data => {
          this.$message({
                    type: 'success',
                    message: 'change success!=>'+data
              });
          this.scriptsVisible = false
          this.lineData = [];

          this.getlineData()
       }).catch(err => {
          console.error(err)
       })
    },
    openDialog(){
      this.dialogFormVisible = true
    },
   
   
  },
};
</script>
<style lang="scss" scoped>
.spclayout{
  background-color: #f0f2f5;
  margin-bottom: 10px;
}
.spc_header{
  padding: 5px;
  width:100%;
  background-color: #fff;
  border-radius: 5px;
}
/* .chartlayout {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
} */
.chartbox{
  margin-top:10px;
  /* background-color: #fff; */
  height:450;
  padding:20px;
  overflow: hidden;
  /* background-color: lightgrey; */
}
.chartbox_header{
  display: flex;

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
.warninfo{
  width: 100%;
  height:100px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  div{
  width:50%;
  height: 100%;
  // background-color: #fff;

  }
}
</style>
