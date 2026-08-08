<template>
  <div class="app-container">
        <div class="filter-container">
          <div   v-for="(item,index) in cols" :key="index" style="display:inline">
                  <el-input  v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 200px" class="filter-item">
               </el-input>
                  <el-select  clearable  v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 200px" class="filter-item">
                    <el-option
                    v-for="item in initSelect[item.field]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
               </el-select>
                <el-date-picker v-if="item.query && item.queryType==='datetime'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"  v-model="queryParams.requestData[item.field]"  type="datetime"   :placeholder="commonI18n(item)"  style="width: 150" class="filter-item"> </el-date-picker>
                <el-date-picker v-if="item.query && item.queryType==='date'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"  v-model="queryParams.requestData[item.field]"  type="date"   :placeholder="commonI18n(item)"  style="width: 150" class="filter-item"> </el-date-picker>
          </div>
          <el-button type="primary"     class="filter-item"  @click="query()" >
             {{ $t("common.btn.query") }}
          </el-button>
          <el-button type="info"     class="filter-item" @click="reset" >
             {{ $t("common.btn.reset") }}
          </el-button>
           <el-button type="warning" v-ele-show="{btnCode:'wcs_carryJobAdd'}"  class="filter-item" @click="add" >
               {{ $t("common.btn.add") }}
           </el-button>
        </div>
     <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"  @row-dblclick="showDetails" @row-click="triggerCarryEvent" :row-class-name="tableRowClassName">
      <el-table-column min-width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
           <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column   v-for="(item) in cols"  :sortable="true"  :key="item.id" :label="commonI18n(item)" :prop="item.field"  :width="item.width" :min-width="item.minWidth"  v-if="!item.hide"  :align="item.align"  show-overflow-tooltip> 
						<template  slot-scope="{row}">{{commonFilter(row[item.field],item.field)}}</template>
      </el-table-column>
      <el-table-column align="center" :label="$t('common.oper')" fixed="right" width="400">
        <template slot-scope="scope">
          <el-button type="primary" size="small" v-ele-show="{btnCode:'wcs_carryJobAdd'}" icon="el-icon-info"
                     @click="detail(scope.row)">
            {{ $t('common.btn.detail') }}
          </el-button>
          <el-button type="primary" size="small" v-ele-show="{btnCode:'wcs_carryJobAdd'}"  icon="el-icon-edit" @click="edit(scope.row)">
             {{ $t("common.btn.edit") }}
          </el-button>
           &nbsp;
           <el-button type="warning" v-ele-show="{btnCode:'wcs_carryJobDel'}"   size="small" icon="el-icon-delete" @click="del(scope.$index,scope.row)">
              {{ $t("common.btn.delete") }}
          </el-button>
          <el-button type="primary" size="small"  icon="el-icon-files" @click="copy(scope.row)">
             {{ $t("common.btn.copy") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="dialogtitle" v-el-drag-dialog :visible.sync="dialogFormVisible" width="600px" >
      <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="120px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
       <!--<el-form :label-position="labelPosition" ref="addParam" label-width="110px" :model="addParam" style="display:inline">
            <el-form-item label="调度服务代码" :prop="addParam.jobCode" :rules="[{ required:true, message: '调度服务代码不能为空', trigger: 'blur' }]">   
              <el-input v-model="addParam.jobCode" style="width: 70%"></el-input>
            </el-form-item>
            <el-form-item label="调度服务名称"  :rules="[{ required:true, message: '调度服务名称不能为空', trigger: 'blur' }]">   
              <el-input v-model="addParam.jobName" style="width: 70%"></el-input>
            </el-form-item>
            <el-form-item label="调度服务分组"  :rules="[{ required:true, message: '调度服务分组不能为空', trigger: 'blur' }]">   
              <el-input v-model="addParam.jobGroup" style="width: 70%"></el-input>
            </el-form-item>
            <el-form-item label="调度执行计划" :rules="[{ required:true, message: '调度执行计划不能为空', trigger: 'change' }]">
            <el-select v-model="addParam.timeId" style="width: 70%" >
              <el-option v-for="item in initSelect.timeId" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组件类型"  :rules="[{ required:true, message: '组件类型不能为空', trigger: 'change' }]">   
              <el-select v-model="addParam.comName" style="width: 70%" >
              <el-option v-for="item in initSelect.comName" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务选择服务" :rules="[{ required:true, message: '任务选择服务不能为空', trigger: 'blur' }]">
            <el-select v-model="addParam.taskSelector" style="width: 70%" >
              <el-option v-for="item in initSelect.taskSelector" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="互斥锁名称"  :rules="[{ required:true, message: '互斥锁名称不能为空', trigger: 'blur' }]">   
              <el-input v-model="addParam.lockName" style="width: 70%"></el-input>
            </el-form-item>
          <el-form-item label="允许控制标识" :rules="[{ required:true, message: '允许控制标识不能为空', trigger: 'blur' }]">
            <el-select v-model="addParam.ctrlTag" style="width: 70%" >
              <el-option v-for="item in initSelect.ctrlTag" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用标志" :rules="[{ required:true, message: '使用标志不能为空', trigger: 'blur' }]">
            <el-select v-model="addParam.useState" style="width: 70%" >
              <el-option v-for="item in initSelect.useState" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item  v-if="item.set && item.queryType==='input'" :label="commonI18n(item)" :prop="item.field"
            :rules="[{ required: item.required, message: commonI18n(item)+$t('const.cannotNull'), trigger: 'blur' }]"
          >
             <el-input v-model="defaultForm.params[item.field]" style="width:360px;" />
          </el-form-item>
           <el-form-item  v-if="item.set && item.queryType==='select'" :label="commonI18n(item)" :prop="item.field"
            :rules="[{ required: item.required, message: commonI18n(item)+$t('const.cannotNull'), trigger: 'change' }]"
           >
              <el-select v-model="defaultForm.params[item.field]" @change="$forceUpdate()" filterable clearable :placeholder="$t('const.pleaseSelect')" style="width:360px;" :allow-create="item.allowCreate" >
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="destory(false)">{{$t('common.btn.cancel')}}</el-button>
        <el-button type="primary" @click="submit('defaultForm.params')">{{$t('common.btn.ok')}}</el-button>
      </div>
    </el-dialog>

    <!--搬运路径-->
    <el-dialog :title="$t('common.btn.detail')" :visible.sync="areaItemVisible" width="80%" top="5vh" >
      <div style="margin-bottom: 10px">
        <el-button type="warning" v-ele-show="{btnCode:'wcs_carryDetailAdd'}" class="filter-item" @click="addDts">
          {{ $t('common.btn.add') }}
        </el-button>
        <el-button type="danger" v-ele-show="{btnCode:'wcs_carryDetailDel'}" class="filter-item" @click="deleteDts">
          {{ $t('common.btn.delete') }}
        </el-button>
      </div>
      <div style="width: 100%; height: 640px;overflow:auto">
        <el-table v-loading="listLoading" :data="listDts" border fit highlight-current-row style="width: 100%"
                  @row-dblclick="showDetails" @selection-change="selectionLineChangeHandle">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column v-for="(item) in colsDts" :key="item.id" :label="commonI18n(item)" :prop="item.field"
                           :width="item.width"
                           :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip>
                <template  slot-scope="{row}">{{commonFilter(row[item.field],item.field)}}</template>
          </el-table-column>
          <el-table-column align="left" :label="$t('common.oper')" fixed="right"  >
            <template slot-scope="scope">  
              <el-button type="primary" size="small" v-ele-show="{btnCode:'wcs_carryDetailAdd'}"  icon="el-icon-edit" @click="editDts(scope.row)">
                {{ $t("common.btn.edit") }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!--路径编辑-->
    <el-dialog :title="detailDialogTitle" v-el-drag-dialog :visible.sync="dialogDtsFormVisible" width="500px" >
      <el-form ref="defaultDtsForm.params" :inline="false" :model="defaultDtsForm.params" label-width="120px">
        <div v-for="(item) in colsDts" :key="item.id" style="display:inline">
          <el-form-item  v-if="item.set && item.queryType==='input'" :label="commonI18n(item)" :prop="item.field"
            :rules="[{ required: item.required, message: commonI18n(item)+$t('const.cannotNull'), trigger: 'blur' }]"
          >
             <el-input v-model="defaultDtsForm.params[item.field]"  style="width:300px;"  />
          </el-form-item>
           <el-form-item  v-if="item.set && item.queryType==='select'" :label="commonI18n(item)" :prop="item.field"
            :rules="[{ required: item.required, message:commonI18n(item)+$t('const.cannotNull'), trigger: 'change' }]"
           >
              <el-select v-model="defaultDtsForm.params[item.field]" @change="$forceUpdate()" filterable :placeholder="$t('const.pleaseSelect')" style="width:300px;">
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
        <el-button @click="destoryDts(false)">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" v-if="defaultDtsForm.params.itemId==='' || defaultDtsForm.params.itemId===null" @click="saveDts('defaultDtsForm.params')">  {{ $t("common.btn.save") }}</el-button>
        <el-button type="primary" v-if="defaultDtsForm.params.itemId!='' && defaultDtsForm.params.itemId!=null"  @click="submitDts('defaultDtsForm.params')">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>
    
  </div>

</template>

<script>
import waves from "@/directive/waves"; // waves directive
import elDragDialog from "@/directive/el-drag-dialog";
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import i18n from '@/lang';
import carryDetails from './components/carryDetails'
export default {
  name: 'carryJob',
 components: { Pagination,carryDetails },
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
  computed:{
    initSelect:{
      get(){
        return {
         timeId:this.timeId,
         comName:this.comName,
         taskSelector:this.taskSelector,
         jobGroup: this.jobGroup,
         roadId:this.roadId,
         ctrlTag:[{label:this.$t('const.permit.allowed'),value:1},{label:this.$t('const.permit.forbidden'),value:0}],
         useState:[{label:this.$t('common.ProcessFlowList.enable'),value:1},{label:this.$t('common.ProcessFlowList.disabled'),value:0}]
      }
      }
    }
  },
  data() {
    const  _initdata ={
      dialogFormVisible: false,
      dialogDtsFormVisible: false,
      dialogtitle: '编辑',
      detailDialogTitle:'编辑',
      roadAddVisible: false,
      queryParams:{
        requestData:{ }
        },
      carryDetails:{},  
      carryCompDetails:'carryDetails',
      timeId:[],
      comName:[],
      taskSelector:[],
      roadId:[],
      jobGroup:[],
      defaultForm: {
        row:{},
        params:{
         id:'',
         jobId:''
        }
      },
      defaultDtsForm: {
        row:{},
        params:{
         id:'',
         itemId:'',
         jobId:'' 
        }
      },
      list: null,
      carryJobId:null,
      listDts: [],
      roadList: [],
      selectedRoadList:[],
      total: 0,
      difDiag:false,
      queryRoadName:null,
      listLoading: true,
      roadLoading: false,
      areaItemVisible:false,
      labelPosition: 'right',
      listQuery: {
        current: 1,
        pageSize: 15
      },
      addParam:{
        jobGroup:'',
        jobId:'',
        jobCode:'',
        jobName:'',
        comName:'',
        taskSelector:'',
        lockName:'',
        param:'',
        useState:'',
        timeId:'',
        ctrlTag:'',
        jobText:''
      },
      cols: [
                { field: 'jobGroup', title: '组别', minWidth: 150, align: "center" ,query:true,queryType:'input',set:true,required:true,allowCreate:true},
                { field: 'jobId', title: '定时器Id', minWidth: 100,hide:true, align: "center" },
                { field: 'jobCode', title: '服务代码', minWidth: 100, align: "center",query:false,queryType:'input',set:true,required:true },
                { field: 'jobName', title: '服务名称', minWidth: 100, align: "center",query:true,queryType:'input',set:true,required:true },
                { field: 'comName', title: '组件类型', minWidth: 200, align: "center",query:false,queryType:'select',set:true,required:true},
                { field: 'taskSelector', title: '任务选择', minWidth: 100, align: 'center',query:false,queryType:'select',set:true,required:false},
                {field: 'lockName', title: '互斥锁',minWidth: 100, align: 'center',query:false,queryType:'input',set:true,filter:true,required:true},
                {field: 'param', title: '参数',minWidth: 100, align: 'center',query:false,queryType:'input',set:true,filter:true,required:false},
                { field: 'useState', title: '使用标志',minWidth: 100, align: 'center' ,queryType:'select',set:true,required:true},
                { field: 'timeId', title: '执行计划', minWidth: 150, align: 'center' ,query:false,queryType:'select',set:true,required:true},
                { field: 'ctrlTag', title: '控制标识',minWidth: 100, align: 'center' ,query:false,queryType:'select',set:true,required:true},
                { field: 'jobText', title: '内容',minWidth: 100, align: 'center' ,query:true,queryType:'input',set:true,required:false},
                { field: 'sortNum', title: '排序编号', minWidth: 100, align: "center" ,query:true,queryType:'input',set:true,required:true},
       ],
      colsDts: [
                { field: 'itemId', title: '明细Id', minWidth: 100,hide:true, align: "center" },
                { field: 'jobId', title: '定时器Id', minWidth: 100,hide:true, align: "center" },
                { field: 'roadId', title: '路径',hide:true, minWidth: 100, align: "center" ,queryType:'select',set:true,required:true},
                { field: 'roadName', title: '路径名称',  minWidth: 100, align: "center" },
                { field: 'carryNum', title: '搬运顺序', minWidth: 100, align: "center",isEdit:true,query:false,queryType:'input',set:true,required:true },
                { field: 'useState', title: '使用标志',minWidth: 100, align: 'center' ,queryType:'select',set:true,required:true,template:this.useStateFormatter},
       ]
    }
    Object.assign(_initdata.defaultForm.params,this.initData(_initdata.cols))
    Object.assign(_initdata.defaultDtsForm.params,this.initData(_initdata.colsDts))
    return _initdata
  },
  created() {
    this.selectOptions()
    this.getList()
  },
  methods: {
      useStateFormatter(row, column, cellValue, index) {
       if(cellValue==1)
        return this.$t('common.ProcessFlowList.enable')
       else 
        return this.$t('common.ProcessFlowList.disabled')
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
      const _data = {url:'/api/Job/GetCarryJob',params:this.queryParams}
      this.$store.dispatch('fmsCommon/actionWcsPost',_data)
      .then(data => {
          this.list = data.data
          this.total = data.total
          this.listLoading = false
          this.autoWidth()
       }).catch(err => {
          console.error(err)
       })
    },
    autoWidth(){
      //获取当页所有数据
      this.cols.forEach(col=>{ 
        if(col.hide) return;
      //获取每一列数据的最大长度 
        //输入框 
        if(col.queryType === "input")
          {
            col.innerLen = 0;
            this.list.forEach(item =>{  
              if(item[col.field] !== null && item[col.field].length > col.innerLen)
                col.innerLen = item[col.field].length
              });
          }
          //下拉框 
        else if(col.queryType === "select" && col.field !== "comName")
        {
          col.innerLen = 0; 
          this.list.forEach(item =>{ 
            var stores = this.initSelect[col.field];  
            var label = stores.filter(f=>f.value === item[col.field]);  
            if(label[0] != undefined && label[0].label.length > col.innerLen)
                col.innerLen = label[0].label.length
            }); 
        } 
        if(col.innerLen < col.title.length)
          col.innerLen = col.title.length + 2 //+2是为了排序的宽度
        //制定字符长度和宽度的比例 基础宽度48 比率 1:10
        //cols的minWidth赋值 
        if(col.innerLen!=undefined&&col.innerLen!=0)
            col.minWidth = 48 + col.innerLen * 10
      });
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
    //定时器方法
  destory(hide=false){
    this.dialogFormVisible = hide
    //重置提示信息
    this.$refs['defaultForm.params'].resetFields();
       for(let p in this.defaultForm.params){
        if(this.defaultForm.params.hasOwnProperty(p)){
          if(p == "taskSelector")  this.defaultForm.params[p]=''
          else if(p == "lockName")  this.defaultForm.params[p]='#'
          else if(p == "ctrlTag")  this.defaultForm.params[p]=1
          else if(p == "useState")  this.defaultForm.params[p]=1
          else this.defaultForm.params[p]=''
        }
     }
  },
  add(){
       for(let p in this.defaultForm.params){
        if(this.defaultForm.params.hasOwnProperty(p)){
          if(p == "taskSelector")  this.defaultForm.params[p]=''
          else if(p == "lockName")  this.defaultForm.params[p]='#'
          else if(p == "ctrlTag")  this.defaultForm.params[p]=1
          else if(p == "useState")  this.defaultForm.params[p]=1
          else this.defaultForm.params[p]=''
        }
      this.dialogtitle = this.$t('common.btn.add')
        this.dialogFormVisible = true;
    }
  },
  edit(row){
    for(let p in this.defaultForm.params){
        if(this.defaultForm.params.hasOwnProperty(p)){
          this.defaultForm.params[p]=row[p]
        }
    }
      this.dialogtitle = this.$t('common.btn.edit')
    this.dialogFormVisible = true;
  },
  copy(row){
    for(let p in this.defaultForm.params){
        if(this.defaultForm.params.hasOwnProperty(p)){
          this.defaultForm.params[p]=row[p]
        }
    }
      this.dialogtitle = this.$t('common.btn.add')
    this.defaultForm.params.jobId = ''
    this.dialogFormVisible = true;
  },
  submit(formName){
      const _data = {url:'/api/Job/AddCarryJob',params:{data:this.defaultForm.params}}
      this.$refs[formName].validate((valid) => {
      if (valid) {
        this.$store.dispatch('fmsCommon/actionWcsPost',_data)
              .then(data => {
              this.$message({
                    type: 'success',
                    message: this.dialogtitle+this.$t('const.result.success')
                  });
                  this.dialogFormVisible = false
                  this.getList()
              }).catch(err => {
                  this.$message({
                  message:  this.dialogtitle+this.$t('const.result.fail'),
                  type: 'error'
                  })
              }) 
        }
        else{
          this.$message({
            type: 'error',
            message: this.$t('const.savedData')+this.$t('const.cannotNull')
          }); 
        }
      });
  },
  query(){
     //this.listQuery.current =1
     this.getList()
   },
  reset(){
     for(let p in  this.queryParams.requestData){
        if(this.queryParams.requestData.hasOwnProperty(p)){
          this.queryParams.requestData[p]=''
        }
     }
   },
   //明细方法
   //监视下拉多选
  selectionLineChangeHandle(val){
      this.selectedRoadList = val
    },
  destoryDts(hide=false){
    this.dialogDtsFormVisible = hide
    this.$refs['defaultDtsForm.params'].resetFields();
       for(let p in this.defaultDtsForm.params){
        if(this.defaultDtsForm.params.hasOwnProperty(p)){
          this.defaultDtsForm.params[p]=''
        }
     }
  },
  destoryRoad(hide=false){
    this.roadAddVisible = hide
    this.$refs['defaultDtsForm.params'].resetFields();
  },
  getDtsList(val) {
        this.listLoading = true
        const _data = { url: '/api/Job/GetCarryJobItem', params:{data:val} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.listDts = data;
            this.listLoading = false
          }).catch(err => {
          console.error(err)
        })
      },
  getRoadList(val) {
        const _data = { url: '/api/Job/GetSurplusRoad', params:{data:val} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.roadId = data.map(c=>{
             return {
               label: c.roadName,
               value: c.roadId
             }
           })
          }).catch(err => {
          console.error(err)
        })
      },
  addDts(){
    //  this.roadAddVisible = true
    this.getRoadList(null)
     this.dialogDtsFormVisible = true
     this.difDiag = false
     this.detailDialogTitle=this.$t('common.btn.add')
     for(let p in this.defaultDtsForm.params){
        if(this.defaultDtsForm.params.hasOwnProperty(p)){
          if(p === "carryNum")
          this.defaultDtsForm.params[p]=0
          else if(p === "useState")
          this.defaultDtsForm.params[p]=1
          else this.defaultDtsForm.params[p]=''
        }
     }
  },
  editDts(row){
    this.getRoadList(row.roadId)
    this.difDiag = true
    this.dialogDtsFormVisible = true
    this.defaultDtsForm.params['roadId'] = null
     this.detailDialogTitle=this.$t('common.btn.edit')
     for(let p in this.defaultDtsForm.params){
        if(this.defaultDtsForm.params.hasOwnProperty(p)){
          this.defaultDtsForm.params[p]=row[p]
        }
     }
  },
 deleteDts(){
     this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {        
                let delList = this.selectedRoadList.map(f => { return f.itemId})
                const _data = {url:'/api/Job/DelCarryJobItem',params:{data:delList}}
                this.$store.dispatch('fmsCommon/actionWcsPost',_data)
                .then(data => {
                      this.$message({
                      type: 'success',
                      message: this.$t('common.btn.deleteSuccess')
                    });
                  this.getDtsList(this.carryJobId)
                }).catch(err => {
                    console.error(err)
                })
        }).catch(() => {
          this.$message({
            type: 'info',
            message:  this.$t('common.btn.Cancelled')
          });          
        })
  },
  showDetails(row, column){

  },

  tableRowClassName({row, rowIndex}) {  
      if (row.carryJobItem.length > 0 && row.useState === 1 && row.ctrlTag === 1 && row.carryJobItem[0].useState ===1){
        return 'enable-row';
      }else if (row.carryJobItem.length == 0 && row.useState == 1 ){
        return '';
      }else if (row.useState === 0 && row.ctrlTag === 0 && row.carryJobItem[0].useState === 0) {
        return 'disable-row2';
      }else if (row.useState == 0 || row.ctrlTag === 0 || row.carryJobItem[0].useState === 0) {
        return 'disable-row1';
      }   
      return '';
    },

  triggerCarryEvent(row, column){
    this.carryDetails = row
  },
  detail(row) {
        this.areaItemVisible = true
        this.listLoading = true
        this.carryJobId = row.jobId
        this.getDtsList(row.jobId)
      },
  
  submitDts(formName){
      this.defaultDtsForm.params.jobId = this.carryJobId
       let _request = this.defaultDtsForm.params
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
                    message:this.$t('common.btn.updateSuccess')
                  });
                  this.dialogDtsFormVisible = false
                  this.getDtsList(this.carryJobId)
              }).catch(err => {
                  console.error(err)
              }).finally(()=>{
                  this.destoryDts()
                })
          } else {
            this.$message({
                    type: 'error',
                    message: this.$t('const.savedData')+this.$t('const.cannotNull')
                  });
          }
        });
  },
   queryRoad(){
     this.getRoadList()
   },
  //下拉
   selectOptions(){
       //获取执行时间
       let _data = {url:'/api/Job/GetJobTime',params:{}}
       this.$store.dispatch('fmsCommon/actionWcsPost',_data)
      .then(data => {
           this.timeId = data.map(c=>{
             return {
               label: c.timeName,
               value: c.timeId
             }
           })
       }).catch(err => {
          console.error(err)
       }),
       //获取组件名称
       _data = {url:'/api/Job/GetCarryJobComponent',params:{}}
      this.$store.dispatch('fmsCommon/actionWcsPost',_data)
            .then(data => {
                this.comName = data
                .map(c=>{
                  return {
                    label:c,
                    value:c
                  }
                })
            }).catch(err => {
                console.error(err)
            }),
       //获取任务选择器
       _data = {url:'/api/Const/GetTaskSelectors',params:{}}
      this.$store.dispatch('fmsCommon/actionWcsPost',_data)
            .then(data => {
                this.taskSelector = data.map(c=>{
                  return {
                    label:c,
                    value:c
                  }
                })
            }).catch(err => {
                console.error(err)
            })
            //获取搬运路径
      //  _data = {url:'/api/Job/GetCarryRoad',params:{requestData:{"jobId":this.carryJobId}}}
      //  this.$store.dispatch('fmsCommon/actionWcsPost',_data)
      // .then(data => {
      //      this.initSelect.roadId = data.data.map(c=>{
      //        return {
      //          label: c.roadName,
      //          value: c.roadId
      //        }
      //      })
      //  }).catch(err => {
      //     console.error(err)
      //  })
      _data = {url:'/api/Common/GetDevColumns',params:{data:{'fields':["jobGroup"],table:"CarryJob"}}}
      this.$store.dispatch('fmsCommon/actionWcsPost',_data)
            .then(data => {
                this.jobGroup = data.result["jobGroup"].sort().map(f=>{return{label:f,value:f}})
            }).catch(err => {
                console.error(err)
            })
      }, 
      saveDts(formName){
        this.defaultDtsForm.row = {}
        this.defaultDtsForm.params.id=''
        this.defaultDtsForm.params.jobId = this.carryJobId
        let _request = this.defaultDtsForm.params
        _request.id = _request.itemId
        let _data = {url:'/api/Job/AddCarryJobItem',params:{data:_request}}
          this.$refs[formName].validate((valid) => {
            if (valid) {
                this.$store.dispatch('fmsCommon/actionWcsPost',_data)
                .then(data => {
                this.$message({
                      type: 'success',
                      message: this.$t('common.btn.addSuccess')
                    });
                    this.dialogFormDtsVisible = false
                    this.getDtsList(this.carryJobId)
                }).catch(err => {
                    console.error(err)
                }).finally(()=>{
                    this.destoryDts()
                  })
            } else {
              this.$message({
                      type: 'error',
                      message:this.$t('const.savedData')+this.$t('const.cannotNull')
                    }); 
            }
          });
      },
       //保存新增
  //  save(formName){
  //     this.defaultForm.row = {}
  //     this.defaultForm.params.id=''
  //     let _data = {url:'/api/Job/AddCarryJob',params:{data:this.defaultForm.params}}
  //        this.$refs[formName].validate((valid) => {
  //         if (valid) {
  //             this.$store.dispatch('fmsCommon/actionWcsPost',_data)
  //             .then(data => {
  //             this.$message({
  //                   type: 'success',
  //                   message: 'change success!=>'+data
  //                 });
  //                 this.dialogFormVisible = false
  //                 this.query()
  //             }).catch(err => {
  //                 console.error(err)
  //             }).finally(()=>{
  //                 this.destory()
  //               })
  //         } else {
  //           this.$message({
  //                   type: 'error',
  //                   message: '输入数据不能为空'
  //                 });
  //         }
  //       });


  //  },
   del(index,row){
      this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {        
                const _data = {url:'/api/Job/DelCarryJob',params:{data:row.jobId}}
                this.$store.dispatch('fmsCommon/actionWcsPost',_data)
                .then(data => {
                      this.list.splice(index, 1)
                      this.$message({
                      type: 'success',
                      message: this.$t('common.btn.deleteSuccess')
                    });
                    this.getList()
                }).catch(err => {
                    console.error(err)
                })
        }).catch(() => {
          this.$message({
            type: 'info',
            message:  this.$t('common.btn.Cancelled')
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
