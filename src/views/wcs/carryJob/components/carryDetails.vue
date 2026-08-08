<template>
  <div class="app-container">
        <div class="filter-container">
          <div   v-for="(item,index) in cols" :key="index" style="display:inline">
                  <el-input  v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="item.title" style="width: 120px" class="filter-item">
                     <!-- {{queryParams.requestData[item.field]=''}} -->
               </el-input>
                  <el-select clearable   v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="item.title" style="width: 120px" class="filter-item">
                    <el-option
                    v-for="item in initSelect[item.field]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
               </el-select>
                <el-date-picker v-if="item.query && item.queryType==='datetime'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"  v-model="queryParams.requestData[item.field]"  type="datetime"   :placeholder="item.title"  style="width: 150" class="filter-item"> </el-date-picker>
                <el-date-picker v-if="item.query && item.queryType==='date'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"  v-model="queryParams.requestData[item.field]"  type="date"   :placeholder="item.title"  style="width: 150" class="filter-item"> </el-date-picker>

          </div>
           <el-button type="warning" v-ele-show="{btnCode:'wcs_carryDetailAdd'}"  class="filter-item" @click="add" >
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
      <el-table-column   v-for="(item) in cols"  :key="item.id" :label="item.title" :prop="item.field"  :width="item.width" :min-width="item.minWidth"  v-if="!item.hide"  :align="item.align"  show-overflow-tooltip> 
						<template  slot-scope="{row}">{{commonFilter(row[item.field],item.field)}}</template>
            <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="left" label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" v-ele-show="{btnCode:'wcs_carryDetailAdd'}"  icon="el-icon-edit" @click="edit(scope.row)">
             {{ $t("common.btn.edit") }}
          </el-button>
           &nbsp;
           <el-button type="warning" v-ele-show="{btnCode:'wcs_carryDetailDel'}"   size="small" icon="el-icon-edit" @click="del(scope.$index,scope.row)">
              {{ $t("common.btn.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" /> -->
    <el-dialog :title="dialogtitle" v-el-drag-dialog :visible.sync="dialogFormVisible" width="800px" >
      <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="80px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item  v-if="item.set && item.queryType==='input'" :label="item.title" :prop="item.field"
            :rules="[{ required: item.required, message: item.title+'不能为空', trigger: 'blur' }]"
          >
             <el-input v-model="defaultForm.params[item.field]" :disabled="!((difDiag && item.isEdit) || (!difDiag))" width='200px'  />
          </el-form-item>
           <el-form-item  v-if="item.set && item.queryType==='select'" :label="item.title"
            :rules="[{ required: item.required, message: item.title+'不能为空', trigger: 'blur' }]"
           >
              <el-select v-model="defaultForm.params[item.field]" @change="$forceUpdate()" :disabled="!((difDiag && item.isEdit) || (!difDiag))" placeholder="请选择"  width='200px'>
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
        <el-button type="primary" v-if="defaultForm.params.itemId==='' || defaultForm.params.itemId===null" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.itemId!='' && defaultForm.params.itemId!=null"  @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import waves from "@/directive/waves"; // waves directive
import elDragDialog from "@/directive/el-drag-dialog";
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import i18n from '@/lang';
export default {
  name: 'carryDetails',
  components: { Pagination },
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
  props:['carryDetails'],
  data() {
    const  _initdata ={
      dialogFormVisible: false,
      dialogtitle:'编辑',
      queryParams:{
        requestData:{ }
        },
      initSelect:{
         roadId:[],
         jobUseState:[{label:'启用',value:1},{label:'禁用',value:0}]
      }, 
      defaultForm: {
        row:{},
        params:{
         id:'',
         itemId:'',
         jobId:''
        }
      },
      difDiag:false,
      isEdit:true,
      carryJobId:null,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        current: 1,
        pageSize: 15
      },
      cols: [
                { field: 'itemId', title: '明细Id', minWidth: 100,hide:true, align: "center" },
                { field: 'jobId', title: '定时器Id', minWidth: 100,hide:true, align: "center" },
                { field: 'roadId', title: '路径', minWidth: 100,hide:true, align: "center" ,queryType:'select',set:true,required:true},
                { field: 'roadName', title: '路径名称', minWidth: 100, align: "center" },
                { field: 'carryNum', title: '搬运顺序', minWidth: 100, align: "center",isEdit:true,query:false,queryType:'input',set:true,required:true },
                { field: 'jobUseState', title: '使用标志', align: 'center' ,queryType:'select',set:true,required:true},
       ]
    }
    Object.assign(_initdata.defaultForm.params,this.initData(_initdata.cols))
    return _initdata
  },
  created() {
  },
    watch:{
     carryDetails(val){
         this.carryJobId = val.jobId
         this.getList(val.jobId)
         this.selectOptions()
     }
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
    getList(val) {
      this.listLoading = true
      this.queryParams.requestData = val;
      Object.assign(this.queryParams,this.listQuery)
      const _data = {url:'/api/Job/GetCarryJobItem',params:{data:val}}
      this.$store.dispatch('fmsCommon/actionWcsPost',_data)
      .then(data => {
          this.list = data
          this.listLoading = false
       }).catch(err => {
          console.error(err)
       })
    //   httpUtils.actionFmsPost('/line/list',this.listQuery).then(data => {
    //       console.log(data)
    //   })
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
     this.difDiag = false
     this.dialogtitle = '新增'
  },
  showDetails(row, column){
  },
  edit(row){
    this.difDiag = true
    this.dialogFormVisible = true
    this.dialogtitle = '编辑'
     for(let p in this.defaultForm.params){
        if(this.defaultForm.params.hasOwnProperty(p)){
          this.defaultForm.params[p]=row[p]
        }
     }
  },
  submit(formName){
       this.defaultForm.params.jobId = this.carryJobId
       let _request = this.defaultForm.params
      _request.id = _request.itemId
       const _data = {url:'/api/Job/AddCarryJobItem',params:{
          data:_request
       }}
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$store.dispatch('fmsCommon/actionWcsPost',_data)
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
     this.getList(this.carryJobId)
   },
   reset(){
     for(let p in  this.queryParams.requestData){
        if(this.queryParams.requestData.hasOwnProperty(p)){
          this.queryParams.requestData[p]=''
        }
     }
   },
   selectOptions(){
       //获取搬运路径
       let _data = {url:'/api/Job/GetCarryRoad',params:{requestData:{"jobId":this.carryJobId}}}
       this.$store.dispatch('fmsCommon/actionWcsPost',_data)
      .then(data => {
           this.initSelect.roadId = data.data.map(c=>{
             return {
               label: c.roadName,
               value: c.roadId
             }
           })
       }).catch(err => {
          console.error(err)
       })
      }, 
       //保存新增
   save(formName){
      this.defaultForm.row = {}
      this.defaultForm.params.id=''
      this.defaultForm.params.jobId = this.carryJobId
      let _request = this.defaultForm.params
      _request.id = _request.itemId
      let _data = {url:'/api/Job/AddCarryJobItem',params:{data:_request}}
         this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$store.dispatch('fmsCommon/actionWcsPost',_data)
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
                const _data = {url:'/api/Job/DelCarryJobItem',params:{data:row.itemId}}
                this.$store.dispatch('fmsCommon/actionWcsPost',_data)
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
.pagination-container {
    margin-top: 10px !important;
    padding: 10px !important;
}


</style>
