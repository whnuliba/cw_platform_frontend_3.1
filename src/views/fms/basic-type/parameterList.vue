/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: 系统管理-系统参数
 */
 <template>
  <div class="app-container">
        <div class="filter-container">
          <div   v-for="(item,index) in cols" :key="index" style="display:inline">
                  <el-input  v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="item.title" style="width: 120px" class="filter-item">
                     <!-- {{queryParams.requestData[item.field]=''}} -->
               </el-input>
                  <el-select   v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="item.title" style="width: 120px" class="filter-item">
                    <el-option
                    v-for="item in initSelect[item.field]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
               </el-select>
                <el-date-picker v-if="item.query && item.queryType==='date'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"  v-model="queryParams.requestData[item.field]"  type="datetime"   :placeholder="item.title"  style="width: 150" class="filter-item"> </el-date-picker>
          </div>
          <el-button type="primary"     class="filter-item"  @click="query()" v-ele-show="{btnCode:'SYS_PARAMETER_LIST'}">
             {{ $t("common.btn.query") }}
          </el-button>
          <el-button type="info"     class="filter-item" @click="reset" >
             {{ $t("common.btn.reset") }}
          </el-button>
           <el-button type="warning"   class="filter-item" @click="add" v-ele-show="{btnCode:'SYS_PARAMETER_ADD'}">
               {{ $t("common.btn.add") }}
           </el-button>
        </div>
     <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"  @row-dblclick="showDetails" >
      
      <el-table-column min-width="50px" label="序号" align="center">
        <template slot-scope="scope">
           <span>{{(listQuery.current - 1) * listQuery.pageSize + (scope.$index+1)}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column   v-for="(item) in cols"  :key="item.id" :label="item.title" :prop="item.field"  :width="item.width" :min-width="item.minWidth"  :align="item.align"  show-overflow-tooltip> 
						<template  slot-scope="{row}">{{commonFilter(row[item.field],item.field)}}</template>
            <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="350">
        <template slot-scope="scope">
            <el-button type="primary" size="small" @click="detail(scope.row)" v-ele-show="{btnCode:'SYS_PATAMETER_DTS_LIST'}">
             {{ $t("common.btn.detail") }}
          </el-button>
          <el-button type="primary" size="small"  icon="el-icon-edit" @click="edit(scope.row)" v-ele-show="{btnCode:'SYS_PARAMETER_ADD'}">
             {{ $t("common.btn.edit") }}
          </el-button>
          <el-button type="primary" size="small"  icon="" @click="refreshCache(scope.row)">
             {{ $t("common.cache") }}
          </el-button>
           <!-- &nbsp; -->
           <el-button type="warning" v-ele-show="{btnCode:'SYS_PARAMETER_DEL'}"   size="small" icon="el-icon-edit" @click="del(scope.$index,scope.row)">
              {{ $t("common.btn.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="dialogTitle" v-el-drag-dialog :visible.sync="dialogFormVisible" width="700px" >
      <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="80px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item  v-if="item.set && item.queryType==='input'" :label="item.title" :prop="item.field"
            :rules="[{ required: true, message: item.title+'不能为空', trigger: 'blur' }]"
          >
             <el-input v-model="defaultForm.params[item.field]" />
          </el-form-item>
           <el-form-item  v-if="item.set && item.queryType==='select'" :label="item.title">
              <el-select v-model="defaultForm.params[item.field]" @change="$forceUpdate()" placeholder="请选择">
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
    <el-dialog :title="detailTitle" v-el-drag-dialog :visible.sync="dialogDetailVisible" width="80%" top="50px">
      <ParamDetailtb :listData='detailList' :rowId="rowId"/>
    </el-dialog>
  </div>

</template>

<script>
import waves from "@/directive/waves"; // waves directive
import elDragDialog from "@/directive/el-drag-dialog";
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import ParamDetailtb from './components/paramDetailtb'
import i18n from '@/lang';
export default {
 name: 'CellList',
 components: { Pagination, ParamDetailtb },
 directives: { waves, elDragDialog },
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
      rowId: '',
      detailTitle: '',
      dialogTitle: '',
      dialogFormVisible: false,
      queryParams:{
        requestData:{ }
        },
      initSelect:{
         trayType:[],
         status:[{label:'启用',value:0},{label:'禁用',value:1}],
         scope:[{label:'全局',value:'1'},{label:'私有',value:'0'}],

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
                { field: 'paramCode', title: '参数编码', align: 'left', minWidth: 100,query:true,queryType:'input',set:true },
                { field: 'paramName', title: '参数名称', align: 'left',  minWidth: 100,query:true,queryType:'input',set:true  },
                { field: 'createTime', title: '创建日期', minWidth: 100, query:false, align: "center",queryType:'input',set:false },          
                { field: 'createUser', title: '创建人', align: 'center' },
                { field: 'scope', title: '范围', align: "left",queryType:'select',set:true,require:true   },   
                { field: 'status', title: '使用状态',  minWidth: 100, align: "center", query:true, queryType:'select',set:true },
        ],
      dialogDetailVisible: false,
      // 详情弹窗变量
      detailList: [],
      detailTotal: 0,
      detailQuery: {
        current: 1,
        pageSize: 15
      },
      detailParam: {
        requestData: {}
      }
    }
    Object.assign(_initdata.defaultForm.params,this.initData(_initdata.cols))
    return _initdata
  },
  created() {
    this.getList()
  },
  methods: {
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
   //初始化表格信息
    getList() {
      this.listLoading = true,
      Object.assign(this.queryParams,this.listQuery)
      const _data = {url:'/sys/list',params:this.queryParams}
      this.$store.dispatch('fmsCommon/actionAuthPost',_data)
      .then(data => {
          this.list = data.data
          this.total = data.total
          this.listLoading = false
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
     this.dialogTitle = this.$t('common.btn.add')
  },
  showDetails(row, column){},
   // 详细弹窗数据初始化
  detailTable() {
     this.detailParams = {
        requestData: {
          paramId: this.rowId
        }
      }
     Object.assign(this.detailParams,this.detailQuery)
     const _data = {url:'/sys-p/list',params:this.detailParams}
     this.$store.dispatch('fmsCommon/actionAuthPost',_data).then(data => {
          this.detailList = data
          this.detailTotal = data.total
          this.detailTitle = this.$t('common.detailModal')
          this.dialogDetailVisible = true
       }).catch(err => {
          console.error(err)
       })
  },
  //  详细点击事件
  detail(row) {
     this.rowId = row.id;
     this.detailTable();
  },
  edit(row){
     this.dialogTitle = this.$t('common.btn.edit')
     this.dialogFormVisible = true
     for(let p in this.defaultForm.params){
        if(this.defaultForm.params.hasOwnProperty(p)){
          this.defaultForm.params[p]=row[p]
        }
     }
  },
  submit(formName){
       const _data = {url:'/sys/add',params:{
          data:this.defaultForm.params
       }}
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$store.dispatch('fmsCommon/actionAuthPost',_data)
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
     this.listQuery.current = 1;
     this.getList()
   },
   reset(){
     for(let p in  this.queryParams.requestData){
        if(this.queryParams.requestData.hasOwnProperty(p)){
          this.queryParams.requestData[p]=''
        }
     }
   },
   save(formName){
      this.defaultForm.row = {}
      this.defaultForm.params.id=''
      let _data = {url:'/sys/add',params:{data:this.defaultForm.params}}
         this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$store.dispatch('fmsCommon/actionAuthPost',_data)
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
  //  刷新参数到缓存系统
  refreshCache(row) {
      this.$confirm(i18n.t("common.tip_info.cache_info"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {        
                const _data = {url:'/sys/refresh_param_to_cache',params:{data: row.paramCode}}
                this.$store.dispatch('fmsCommon/actionAuthPost',_data)
                .then(data => {
                      this.getList();
                      this.$message({
                      type: 'success',
                      message: 'cache success!'
                    });
                }).catch(err => {
                    console.error(err)
                })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'cancel cache'
          });          
        })
  },
  // 删除
   del(index,row){
      this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {        
                const _data = {url:'/sys/del',params:{data:row.id}}
                this.$store.dispatch('fmsCommon/actionAuthPost',_data)
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
