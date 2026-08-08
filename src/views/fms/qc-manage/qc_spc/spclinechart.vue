<template>
  <div class="app-container spclayout">
    <div class="spc_header">
      <el-button type="primary" class="filter-item" @click="myscript">
          {{ '新增' }}
        </el-button>
    </div>
    <div class="chartlayout">
      <div class="chartbox" v-for="(item,i) in lineData" :style='{color:item.color}'>
        <div class="chartbox_header">
          <div class="chartbox_title">{{item.title}}</div>
          <div class="color_chooose">
            <div style="margin-right:4px">背景颜色选择:</div>
              <el-color-picker @change='(i)=>colorchange(i)' v-model="item.color"></el-color-picker>
          </div>
          <div style="margin-right:4px">
            <el-button type="primary" class="filter-item" @click="editscript(item)">
              {{ '编辑' }}
            </el-button>
           
          </div>
          <div>
             <el-button type="warning" class="filter-item" @click="del(i,item)">
              {{ '删除' }}
            </el-button>
          </div>
        </div>
        <LineChart v-if="lineData.length>0" :key="i" :gridcolor='item.color'  :bardata='item'   />
      </div>
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
        >
          <component  :is="dtsOfswitch" ref="scriptsEditer" :scriptsEditer="scriptsEditer" @changeScript="setScript"> </component >
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
      scriptsEditer:'',
      dtsOfswitch:'script_editer',
      dialogFormVisible:false,
      scriptsVisible:false,
      color1: null,
      chart: null,
      dialogFormadd:{},
      lineData:[],
      viewType:'SPC',
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
      cols: [
        { field: 'ucl', title: '上控制限', align: 'left', query: true, queryType: 'input', set: true, require: false }, 
        { field: 'cl', title: '中心限', align: 'left', query: true, queryType: 'input', set: true, require: false }, 
        { field: 'lcl', title: '下控制限', align: 'left', query: true, queryType: 'input', set: true, require: false }, 
        { field: 'url', title: 'URL', align: 'left', query: true, queryType: 'input', set: true, require: false }, 
        { field: 'url_data', title: 'DATA', align: 'left', query: true, queryType: 'spcinput', set: true, require: false }, 
      ]
    };
  },
  watch: {
    // bardata: function (newValue, oldValue) {
    //   if (newValue) {
    //     console.log(newValue);
    //     this.getlinedata();
    //     this.initChart();
    //   }
    // },
  },
  created() {
    this.getlineData()
    //  const _data = {url:'/calc/del',params:{data:'1e45ae0017fb48abb71cf440957b420a'}}
    //       this.$store.dispatch('fmsCommon/actionTaskPost',_data)
    //       .then(data => {
    //         console.log(data);
    //         this.lineData = data;
    //       }).catch(err => {
    //           console.error(err)
    //       }).finally(()=>{
    //    })
  },
  mounted() {
    this.$nextTick(() => {
    });
  },
  beforeDestroy() {
   
  },
  methods: {
    colorchange(i,val){
        // console.log('====================================');
        console.log(i);
        console.log(val);
        // console.log('====================================');
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
      const _data = {url:'/calc/userItems',params: { data: this.viewType }}
          this.$store.dispatch('fmsCommon/actionTaskPost',_data)
          .then(data => {
            console.log(data);
            data.forEach(item =>{
              item['color'] = null;
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
    myscript(row){
        this.scriptOps.scriptValue=''
        // this.scriptsEditer = row
        this.scriptsVisible = true
        this.scriptOps.scriptId = row.id
        this.$nextTick(function(){
          this.$refs.scriptsEditer.initScript()
        })

    },
    editscript(row){
        this.scriptOps.scriptValue=''
        this.scriptsEditer = row
        this.scriptsVisible = true
        this.scriptOps.scriptId = row.id
        this.$nextTick(function(){
          this.$refs.scriptsEditer.initScript(row)
        })
    },
    saveScript(){

      const _this = this
       const {isYaml,errorMessage} = parseYamlFn(_this.scriptOps.scriptValue)
       if(!isYaml){
           this.$message({
                    type: 'info',
                    message: 'formatter error!=>'+errorMessage
              });
              return
       }
        let addparam = JSON.parse(_this.scriptOps.scriptValue)
      const _data = {url:'/calc/add',params:{data:{viewType:this.viewType,calcNo:addparam.calcNo, title: addparam.title, fieldText: _this.scriptOps.scriptValue,id: _this.scriptOps.scriptId}}}
      this.$store.dispatch('fmsCommon/actionTaskPost',_data)
      .then(data => {
          this.$message({
                    type: 'success',
                    message: 'change success!=>'+data
              });
          this.scriptsVisible = false
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
<style scoped>
.spclayout{
  background-color: #f0f2f5;
  
}
.spc_header{
  padding: 5px;
  width:100%;
  background-color: #fff;
  border-radius: 5px;
}
.chartlayout {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.chartbox{
  margin-top:10px;
  background-color: #fff;
  width:49%;
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
  width: 70%;
}
.color_chooose{
  width:160px;
 margin-right:4px;
 display:flex;
 justify-content:center;
 align-items:center;
}
</style>
