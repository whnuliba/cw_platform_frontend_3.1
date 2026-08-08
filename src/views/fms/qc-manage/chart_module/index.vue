<template>
  <div class="app-container spclayout"  @click.right.prevent="showright" @click.left.prevent="  isShowMenu = false">
    <!-- <div class="spc_header">
      <el-button type="primary" class="filter-item" @click="myscript">
          {{ '新增' }}
        </el-button>
    </div> -->
    <div class="rightclick" v-if="isShowMenu" :style="{'left': menuLeft + 'px', 'top': menuTop + 'px'}">
      <div class="menu-item" @click='myscript'>
        <i style="margin-right:10px" class="el-icon-plus icon_button"></i>
        <span>新增</span>
      </div>
      <div></div>
    </div>
    <div class="chartlayout">
      <el-row :gutter="32">
      <el-col  :xs="36" :sm="36" :lg="item.width" v-for="(item,i) in lineData">
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
        <LineChart @sendwarninf='sendwarninf' ref="linechartex" :id='item.id' v-if="lineData.length>0" :key="item.id"  :bardata='item'   />
      </div>
       <div  class="warninfo">
        <transition>
        <ul v-show='item.warnshow'>
          <li transiton="fade" v-for="(val,ind) in item.warnobj">
            <span>{{ind+':'+val}}</span>
          </li>
        </ul>
         </transition>
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
  },
  created() {
    const fullpath =this.$route.fullPath
    let cp = fullpath
    if (cp && cp != null && cp.indexOf("\\") != -1)
          cp = cp.replace("\\", "/");
    let apArr = cp.split("/");
    if (!apArr.length || apArr.length<2) 
          {
            this.$message({
              type:"error",
              message: '路由错误'
            })
              return
          }   
    this.viewType = apArr[4]
    this.status = apArr[5]
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
    sendwarninf(val){
      this.lineData.forEach(item=>{
        if(item.id === val.id){
          this.$set(item,'warnobj',val.data)
          this.$set(item,'warnshow',true)
        }
      })
    },
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
            // console.log(data);

            this.lineData = data;
            this.warnshow = false;
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
        this.isShowMenu = false
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
<style scoped lang="scss">
.spclayout{
  background-color: #f0f2f5;
  
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
  height:450px;
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
