<template>
  <div class="">
  <div class="filter-container">
          <div  v-for="(item,index) in cols" :key="index" style="display:inline">
                  <el-input  v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 150px" class="filter-item">
                     <!-- {{queryParams.requestData[item.field]=''}} -->
               </el-input>
                  <el-select   v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 150px" class="filter-item">
                    <el-option
                    v-for="item in initSelect[item.field]"
                    :key="item.value"
                    :label="commonI18n(item)"
                    :value="item.value">
                  </el-option>
               </el-select>
                <el-date-picker v-if="item.query && item.queryType==='datetime'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"  v-model="queryParams.requestData[item.field]"  type="datetime"   :placeholder="commonI18n(item)"  style="width: 150px" class="filter-item"> </el-date-picker>
                <el-date-picker v-if="item.query && item.queryType==='date'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"  v-model="queryParams.requestData[item.field]"  type="date"   :placeholder="commonI18n(item)"  style="width: 150px" class="filter-item"> </el-date-picker>
          </div>
          <el-button type="primary"     class="filter-item"  @click="query()" >
             {{ $t("common.btn.query") }}
          </el-button>
           <el-button type="warning"   class="filter-item" @click="add" v-ele-show="{btnCode:'ADD_PROCESS_INFO'}">
               {{ $t("common.btn.add") }}
           </el-button>
     </div>
     <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @row-click="planPeoductRowClick"  @row-dblclick="showDetails" >
      
      <!-- <el-table-column min-width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
           <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column   v-for="(item) in cols"  :key="item.id" :label="commonI18n(item)" :prop="item.field"  :width="item.width" :min-width="item.minWidth"  v-if="!item.hide" v-show="!item.hide"  :align="item.align"  show-overflow-tooltip> 
						<template  slot-scope="{row}">{{commonFilter(row[item.field],item.field)}}</template>
            <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="left" :label="$t('common.oper')" fixed="right" width="80">
        <template slot-scope="scope">
          <i class="el-icon-edit"  v-if="scope.row.planState==100"  @click="edit(scope.row)"></i>
          &nbsp;
          <i class="el-icon-delete"  v-if="scope.row.planState==100" @click="del(scope.$index,scope.row)"></i>
           &nbsp;
        <i class="el-icon-s-operation" v-if="scope.row.planState==100" title="计划分解,一个计划只能做一次排产到产线"  @click="decom(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="$t('common.btn.edit')" v-el-drag-dialog :visible.sync="dialogFormVisible" width="800px" >
      <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="120px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item  v-if="item.set && item.queryType==='input'" :label="commonI18n(item)" :prop="item.field" label-width="150px"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
          >
            <!--:disabled="item.isEdit && item.disable"-->
             <el-input  v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" style="width:180px;" />
          </el-form-item>
           <el-form-item  v-if="item.set && item.queryType==='select'" :label="commonI18n(item)" label-width="150px"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'change' }]"
           >
              <el-select v-model="defaultForm.params[item.field]" @change="$forceUpdate()" placeholder="..." style="width:180px;">
                <el-option
                  v-for="item in initSelect[item.field]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
         <el-form-item  v-if="item.set && item.queryType==='datetime'"  :label="commonI18n(item)" :prop="item.field"  label-width="150px">
              <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :disabled="allowDisable && item.editReadonly"  v-model="defaultForm.params[item.field]"  type="datetime"    :placeholder="commonI18n(item)"  style="width: 180px"> </el-date-picker>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="destory(false)">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.id==='' || defaultForm.params.id===null" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.id!='' && defaultForm.params.id!=null" @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>

       <el-dialog title="工单分解" v-el-drag-dialog :visible.sync="dialogDecomFormVisible" width="700px" >
      <el-form ref="decomData" :inline="true" :model="decomData" label-width="120px" size="mini">
           <el-form-item  label='订单号' label-width="90px"
            :rules="[{ required: true, message:'订单不能为空', trigger: 'blur' }]" >
             <el-input  v-model="decomData.extOrderNo" :disabled="true" style="width:180px;" />
          </el-form-item>
          <el-form-item   label="产线" label-width="150px"
            :rules="[{ required: true, message: '产线不能为空', trigger: 'change' }]"
           >
              <el-select v-model="decomData.sectionId" @change="$forceUpdate()" placeholder="..." style="width:180px;">
                <el-option
                  v-for="item in initSelect.sectionId"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="decomDestory(false)">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary"  @click="decomSubmit('decomData')">  {{ $t("common.btn.submit") }}</el-button>
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
  name: 'productPlan',
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
      props: {
      // 外部传入的内容，用于实现双向绑定
      value: String,
      machingPlanId:String
   },
  data() {
    const  _initdata ={
      table_mark:"mdm_plan_items",
      dialogFormVisible: false,
            allowDisable:false,
      dialogSelectFieldVisible:false,
      dialogDecomFormVisible:false,
      queryParams:{
        requestData:{ }
        },
      decomData:{
          pn:"",
          gn:"",
          exOrderNo:"",
          sectionId:""
        },
      initSelect:{
        planState:[],
         trayType:[],
         sectionId:[],
         useState:[{label:'启用',value:0},{label:'警用',value:1}]
      }, 
      url:{
          add:"/plan/add",
          del:"/plan/del",
          list:"/plan/guest/query"
      },
      defaultForm: {
        row:{},
        params:{
         id:'',
        }
      },
      selectColumn:{
        origin:{},
        fields:[],
        colMap:[]
      },
      selectViewCol:[],
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        current: 1,
        pageSize: 20
      },
      cols: [    
                { field: 'orderNo', title: '计划单号', align: "left",query:false,queryType:'input',set:false,require:true   },
                { field: 'projectNo', title: '项目号', align: "left",query:false,queryType:'input',set:false,require:true   },
                { field: 'workNo', title: '工单号',editReadonly:true, align: "left",query:false,queryType:'input',set:true,require:true   },
                { field: 'qty', title: '排产数量', align: "left",query:false,queryType:'input',set:true,require:true,editReadonly:true   },
                { field: 'createTime', title: '创建日期', align: "left",query:false,queryType:'input',set:false,require:true,width:150   },
                { field: 'createUser', title: '创建人', align: "left",query:false,queryType:'input',set:false,require:true   },
                { field: 'planStartTime', title: '计划开始时间',en_title:"PN",  align: "left",query:false,queryType:'datetime',set:true,require:true,width:150 },               
                { field: 'planEndTime', title: '计划结束时间', align: "left",query:false,queryType:'datetime',set:true,require:true,width:150   },
                { field: 'actualStartTime', title: '实际开始时间',hide:true,en_title:"PN",  align: "left",query:false,queryType:'datetime',editReadonly:false,set:false,require:true },               
                { field: 'actualEndTime', title: '实际结束时间',hide:true, align: "left",query:false,queryType:'datetime',set:false,require:true   },
                { field: 'wsNo', title: '车间',query:true,align: "left",queryType:'input',set:false,require:true  },
                { field: 'routeNo', title: '工艺路线',query:false,align: "left",queryType:'input',set:false,require:true  },
                { field: 'planState', title: '计划状态',en_title:"PN",  align: "left",query:true,queryType:'select',editReadonly:true,set:false,require:true },               
    ]
    }
    Object.assign(_initdata.defaultForm.params,this.initData(_initdata.cols))
    return _initdata
  },
  created() {
         this.selectOptions()
  },
  methods: {
       planPeoductRowClick(row, column, event){
             this.$emit('changeProductPlan',  row)
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
       
      Object.assign(this.queryParams,this.listQuery)
    //    //判断条件
    //    if(this.isNull(this.queryParams.requestData.ppn) && this.isNull(this.queryParams.requestData.pgn)  &&this.isNull(this.queryParams.requestData.bomNo))
    //    {
    //     this.$message({
    //        type: 'warning',
    //       message: '请输入BOM信息(图号、品号、BOM编码)不能同时为空'
    //     })
    //     return 
    //    }
      this.listLoading = true
      const _data = {url:this.url.list,params:this.queryParams}
      this.$store.dispatch('fmsCommon/actionMdmPost',_data)
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
    isNull(val){
      if(val==undefined || val==null || val=='')
        return true
      return false
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
    decom(row){

    //初始化产线
       let  _data = {url:'/section/guest/get-by-wsno',params:{data:row.wsNo}}
       this.$store.dispatch('fmsCommon/actionMdmPost',_data)
      .then(data => {
           this.initSelect.sectionId = data.map(c=>{
             return {
               label:c.scName,
               value:c.id
             }
           })
       }).catch(err => {
          console.error(err)
       })
     console.log(row)
    this.dialogDecomFormVisible = true
    this.decomData.planId = row.id
    this.decomData.extOrderNo = row.orderNo
    this.decomData.qty=0
    
  },
  decomSubmit(formName){
       const _data = {url:"/section-order/add",params:{
          data:this.decomData
       }}
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$store.dispatch('fmsCommon/actionMdmPost',_data)
              .then(data => {
              this.$message({
                    type: 'success',
                    message: 'change success!=>'+data
                  });
                  this.dialogFormVisible = false
                    this.$emit('changeProductPlan',  {orderNo:this.decomData.extOrderNo})
                    this.query()
              }).catch(err => {
                  console.error(err)
              }).finally(()=>{
                  this.decomDestory()
                })
          } else {
            this.$message({
                    type: 'error',
                    message: '输入数据不能为空'
                  });
             this.decomDestory()
          }
        });
  },
  decomDestory(){
    this.dialogDecomFormVisible = false
  },
  add(){
       this.allowDisable = false
     this.destory(true)
  },
  showDetails(row, column){
  },
  edit(row){
    this.dialogFormVisible = true
            this.allowDisable = true

     for(let p in this.defaultForm.params){
        if(this.defaultForm.params.hasOwnProperty(p)){
          this.defaultForm.params[p]=row[p]
        }
     }
  },
  submit(formName){
       const _data = {url:this.url.add,params:{
          data:this.defaultForm.params
       }}
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$store.dispatch('fmsCommon/actionMdmPost',_data)
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
       //初始化线体信息
      let  _data = {url:'/constant/order-states',params:{}}
       this.$store.dispatch('fmsCommon/actionMdmPost',_data)
      .then(data => {
           this.initSelect.planState = data.map(c=>{
             return {
               label:c.name,
               value:c.value
             }
           })
       }).catch(err => {
          console.error(err)
       })
       //初始化工序信息
      }, 
   save(formName){
      this.defaultForm.row = {}
      this.defaultForm.params.id=''
      let _data = {url:this.url.add,params:{data:this.defaultForm.params}}
         this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$store.dispatch('fmsCommon/actionMdmPost',_data)
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
                const _data = {url:this.url.del,params:{data:row.id}}
                this.$store.dispatch('fmsCommon/actionMdmPost',_data)
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
.model-factory{
    position: relative;
   width: 500px;
   height: calc(100vh - 120px);
   float: left;
   background: #D4D7D7;
}
.model-workshop{
   width: calc(100% - 505px);
   height: calc(100vh - 120px);
   float: left;
   margin-left:5px ;
      background: #D4D7D7;
}
.el-dialog__body {
    padding: 5px 20px !important;
}
.el-form-item {
    margin-bottom: 8px !important;
}
</style>
