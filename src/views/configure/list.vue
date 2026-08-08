<template>
  <div class="app-container">
        <div class="filter-container">
          <div   v-for="(item,index) in cols" :key="index" style="display:inline">
                  <el-input  v-if="item.query && item.queryType==='input'"  v-model="queryParams.requestData[item.field]" :placeholder="item.title" style="width: 120px" class="filter-item">
                     <!-- {{queryParams.requestData[item.field]=''}} -->
               </el-input>
                  <el-select   v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="item.title" style="width: 120px" class="filter-item">
                    <el-option
                    v-for="item in initSelect[item.field]"
                    :key="item.value"
                    :label="commonI18n(item)"
                    :value="item.value">
                  </el-option>
               </el-select>
                <el-date-picker v-if="item.query && item.queryType==='datetime'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"  v-model="queryParams.requestData[item.field]"  type="datetime"   :placeholder="item.title"  style="width: 150" class="filter-item"> </el-date-picker>
                <el-date-picker v-if="item.query && item.queryType==='date'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"  v-model="queryParams.requestData[item.field]"  type="date"   :placeholder="item.title"  style="width: 150" class="filter-item"> </el-date-picker>

          </div>
          <el-button type="primary"     class="filter-item"  @click="query()" >
             {{ $t("common.btn.query") }}
          </el-button>
          <el-button type="info"     class="filter-item" @click="reset" >
             {{ $t("common.btn.reset") }}
          </el-button>
           <el-button type="warning"   class="filter-item" @click="add" v-ele-show="{btnCode:'fms_task_page_add'}">
               {{ $t("common.btn.add") }}
           </el-button>
        </div>
     <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"  @row-dblclick="showDetails" >

      <el-table-column min-width="50px" label="序号" align="center">
        <template slot-scope="scope">
           <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column   v-for="(item) in cols"  :key="item.id" :label="commonI18n(item)" :prop="item.field"  :width="item.width" :min-width="item.minWidth"  v-if="!item.hide"  :align="item.align"  show-overflow-tooltip>
						<template  slot-scope="{row}">{{commonFilter(row[item.field],item.field)}}</template>
            <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="left" label="操作" fixed="right" width="280">
        <template slot-scope="scope">
          <el-button type="primary" size="small" v-ele-show="{btnCode:'fms_task_page_add'}"   icon="el-icon-edit" @click="edit(scope.row)">
             {{ commonI18n("common.btn.edit") }}
          </el-button>
           &nbsp;
           <el-button type="warning" v-if="scope.row.bizType!='I18N'"  v-ele-show="{btnCode:'fms_task_page_del'}"   size="small" icon="el-icon-edit" @click="del(scope.$index,scope.row)">
              {{ commonI18n("common.btn.delete") }}
          </el-button>
         <el-button type="primary" size="small"  icon="el-icon-edit" @click="myscript(scope.row)">
             {{ commonI18n("common.btn.script") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog title="编辑" v-el-drag-dialog :visible.sync="dialogFormVisible" width="700px" >
      <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="80px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item  v-if="item.set && item.queryType==='input'" :label="commonI18n(item)" :prop="item.field"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
          >
            <!--:disabled="item.isEdit && item.disable"-->
             <el-input  :show-password="item.password" v-model="defaultForm.params[item.field]" style="width:220px;"  />
          </el-form-item>
           <el-form-item  v-if="item.set && item.queryType==='select'" :label="item.title"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'change' }]"
           >
              <el-select v-model="defaultForm.params[item.field]" @change="$forceUpdate()" placeholder="请选择" style="width:220px;">
                <el-option
                  v-for="item in initSelect[item.field]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="destory(false)">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.id==='' || defaultForm.params.id===null" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.id!='' && defaultForm.params.id!=null" @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>


       <!--编写脚本-->
     <!-- <el-dialog :title="'['+11+']明细'" v-el-drag-dialog :visible.sync="scriptsVisible"  width="1366px" >
            <component  :is="dtsOfswitch" ref="scriptsEditer" :scriptsEditer="scriptsEditer" @changeScript="setScript"> </component >
             <div slot="footer" class="dialog-footer" >
            <el-button @click="scriptsVisible = false">  {{ $t("common.btn.cancel") }}</el-button>
            <el-button type="primary"  @click="saveScript()">  {{ $t("common.btn.submit") }}</el-button>
           </div>
     </el-dialog>   -->
         <!-- :before-close="handleClose" -->
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
import waves from "@/directive/waves"; // waves directive
import elDragDialog from "@/directive/el-drag-dialog";
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import i18n from '@/lang';
import script_editer from './components/script-editer'

export default {
  name: 'ConfigureList',
  components: { Pagination,script_editer  },
 directives: { waves, elDragDialog},
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '未启用',
        1: '启用'
      }
      return statusMap[status]
    }
  },
  data() {
    const  _initdata ={
      dialogFormVisible: false,
      scriptsVisible:false,
      dtsOfswitch:'script_editer',

      scriptsEditer:'',
      scriptOps:{
          scriptValue:'',
           scriptId:''
      },
      queryParams:{
        requestData:{ }
        },
      initSelect:{
         dsType:[{label:'新建连接',value:1},{label:'连接池',value:2}],
         trayType:[],
         useState:[{label:'启用',value:0},{label:'警用',value:1}]
      },
      defaultForm: {
        row:{},
        params:{
         id:'',
        }
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 15
      },
      cols: [
                { field: 'pageCode', title: '页面编码', align: 'center',queryType:'input',set:true,require:true},
                { field: 'pageName', title: '页面名称', align: 'center',queryType:'input',set:true,require:true },
                { field: 'bizType', title: '业务类别', align: 'center',queryType:'input' ,query:true,set:true,require:true},
                { field: 'bizName', title: '类别名称', align: 'center',queryType:'input' ,query:true,set:true,require:true },
                { field: 'createTime', title: '创建日期', align: 'center' ,query:true,queryType:'date' },
    ],

    }
    Object.assign(_initdata.defaultForm.params,this.initData(_initdata.cols))
    return _initdata
  },
  created() {
    this.getList()
    this.selectOptions()
  },

  methods: {
     handleClose(done) {
        this.$confirm(this.$t('common.btn.sureClose'))
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
     initData(arr){
       let args = {}
          arr.map(c=>{
            if(c.set){
              args[c.field] = null
            }
          })
          return args
        },
        commonFilter(value,type) {

           if(this.initSelect.hasOwnProperty(type) && typeof this.initSelect[type] !=undefined && Array.isArray( this.initSelect[type]))
            {
              return this.getValueConvert(this.initSelect[type],value)
            }
           if(this.initSelect.hasOwnProperty(type) && !Array.isArray( this.initSelect[type]) && this.initSelect[type].hasOwnProperty(value)){
             return this.initSelect[type][value]
           }
           return value
      },

    getList() {
      this.listLoading = true
      Object.assign(this.queryParams,this.listQuery)
      const _data = {url:'/page-conf/guest/list',params:this.queryParams}
      this.$store.dispatch('fmsCommon/actionTaskPost',_data)
      .then(data => {
          this.list = data.data
          this.total = data.total
          this.listLoading = false
       }).catch(err => {
          console.error(err)
       })
    //   httpUtils.actionFmsPost('/line/list',this.listQuery).then(data => {
    //       console.log(data)
    //   })
    },
    setScript(data){
        this.scriptOps.scriptValue=data
    },
    myscript(row){
        this.scriptOps.scriptValue=''
        this.scriptsEditer =row.id
        this.scriptsVisible = true
        this.scriptOps.scriptId = row.id
        this.$nextTick(function(){
          this.$refs.scriptsEditer.initScript(row.id)
        })

    },
    saveScript(){

      const _this = this
       let _scripts
      try {
          _scripts =  eval("("+_this.scriptOps.scriptValue+")")
        } catch (e) {
             this.$message({
                    type: 'info',
                    message: '脚本解析一次'
           });
           return
      }
      // if(!_scripts.sql || !_scripts.totalSql){
      //      this.$message({
      //               type: 'info',
      //               message: '没有配置数据源脚本'
      //      });
      //      return
      // }
      const _data = {url:'/page-conf/save-script',params:{data:{scripts: _this.scriptOps.scriptValue,id: _this.scriptOps.scriptId}}}
      this.$store.dispatch('fmsCommon/actionTaskPost',_data)
      .then(data => {
          this.$message({
                    type: 'success',
                    message: 'change success!=>'+data
              });
          this.scriptsVisible = false
       }).catch(err => {
          console.error(err)
       })
    },
    getValueConvert(arr,value){
          for(let v of arr){
            if(v.value ==value )
              {
                return v.label
              }
        }
        return value
    },
  destory(hide=false){
    this.dialogFormVisible = hide
       for(let p in this.defaultForm.params){
        if(this.defaultForm.params.hasOwnProperty(p)){
          this.defaultForm.params[p]=''
        }
     }
  },
  add(){
     this.destory(true)
  },
  showDetails(row, column){
  },
  edit(row){
    this.dialogFormVisible = true
     for(let p in this.defaultForm.params){
        if(this.defaultForm.params.hasOwnProperty(p)){
          this.defaultForm.params[p]=row[p]
        }
     }
  },
  submit(formName){
       const _data = {url:'/page-conf/add',params:{
          data:this.defaultForm.params
       }}
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$store.dispatch('fmsCommon/actionTaskPost',_data)
              .then(data => {
              this.$message({
                    type: 'success',
                    message: 'change success!=>'+data
                  });
                  this.dialogFormVisible = false
                  this.query()
              }).catch(err => {
                  console.error(err)
              }).finally(()=>{
                  this.destory()
                })
          } else {
            this.$message({
                    type: 'error',
                    message: '输入数据不能为空'
                  });
             this.destory()
          }
        });
  },
  query(){
     this.listQuery.current =1
     this.getList()
   },
   reset(){
     for(let p in  this.queryParams.requestData){
        if(this.queryParams.requestData.hasOwnProperty(p)){
          this.queryParams.requestData[p]=''
        }
     }
   },
   selectOptions(){
    //    //初始化线体信息
    //    let _data = {url:'/constant/tool-type',params:{}}
    //    this.$store.dispatch('fmsCommon/actionFmsPost',_data)
    //   .then(data => {
    //        this.initSelect.trayType = data.map(c=>{
    //          return {
    //            label:c.name,
    //            value:c.value
    //          }
    //        })
    //    }).catch(err => {
    //       console.error(err)
    //    })

       //初始化工序信息
      },
   save(formName){
      this.defaultForm.row = {}
      this.defaultForm.params.id=''
      let _data = {url:'/page-conf/add',params:{data:this.defaultForm.params}}
         this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$store.dispatch('fmsCommon/actionTaskPost',_data)
              .then(data => {
              this.$message({
                    type: 'success',
                    message: 'change success!=>'+data
                  });
                  this.dialogFormVisible = false
                  this.query()
              }).catch(err => {
                  console.error(err)
              }).finally(()=>{
                  this.destory()
                })
          } else {
            this.$message({
                    type: 'error',
                    message: '输入数据不能为空'
                  });
             this.destory()
          }
        });


   },
   del(index,row){
      this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
                const _data = {url:'/page-conf/del',params:{data:row.id}}
                this.$store.dispatch('fmsCommon/actionTaskPost',_data)
                .then(data => {
                      this.list.splice(index, 1)
                      this.$message({
                      type: 'success',
                      message: 'delete success!'
                    });
                }).catch(err => {
                    console.error(err)
                })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'cancel delete'
          });
        })
   }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.filter-item{
  margin-left: 3px;
}

</style>
