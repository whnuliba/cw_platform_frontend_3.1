<template>
    <div class="app-container">
    <div class="filter-container">
            <div  v-for="(item,index) in cols" :key="index" style="display:inline">
                    <el-input  v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 140px" class="filter-item">
                       <!-- {{queryParams.requestData[item.field]=''}} -->
                 </el-input>
                    <el-select   v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 140px" class="filter-item">
                      <el-option
                      v-for="item in initSelect[item.field]"
                      :key="item.value"
                      :label="commonI18n(item)"
                      :value="item.value">
                    </el-option>
                 </el-select>
                  <el-date-picker v-if="item.query && item.queryType==='datetime'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"  v-model="queryParams.requestData[item.field]"  type="datetime"   :placeholder="commonI18n(item)"  style="width: 150" class="filter-item"> </el-date-picker>
                  <el-date-picker v-if="item.query && item.queryType==='date'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"  v-model="queryParams.requestData[item.field]"  type="date"   :placeholder="commonI18n(item)"  style="width: 150" class="filter-item"> </el-date-picker>
                  <el-date-picker
                        v-if="item.query && item.queryType==='rangedatetime'"
                        v-model="queryParams.requestData[item.field]"
                        format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"  
                        class="filter-item"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        style="width: 200"
                        >
                  </el-date-picker>
            </div>
            <el-button type="primary"     class="filter-item"  @click="query()" >
               {{ $t("common.btn.query") }}
            </el-button>
            <el-button type="info"     class="filter-item" @click="reset" >
            {{ $t("common.btn.reset") }}
            </el-button>
             <!-- v-ele-show="{btnCode:'add_pn_info'}" -->
             <!-- <el-button type="warning"   class="filter-item" @click="add"  v-ele-show="{btnCode:'b_test_demo_add'}">
                 {{ $t("common.btn.add") }}
             </el-button> -->
       </div>
       <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"  @row-dblclick="showDetails" >
        
        <el-table-column min-width="50px" :label="$t('common.no')" align="center">
          <template slot-scope="scope">
             <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
        <el-table-column   v-for="(item) in cols"  :key="item.id" :label="commonI18n(item)" :prop="item.field"  :width="item.width" :min-width="item.minWidth"  v-if="!item.hide" v-show="!item.hide"  :align="item.align"  show-overflow-tooltip> 
                          <template  slot-scope="{row}">{{commonFilter(row[item.field],item.field)}}</template>
              <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
        </el-table-column>
        <!-- <el-table-column align="left" :label="$t('common.oper')" fixed="right" width="80">
          <template slot="header" slot-scope="scope">
             {{$t('common.oper')}} <i style="margin-left: 10px;cursor:pointer;" class="el-icon-bank-card"  @click="selectFields" ></i>
         </template>
          <template slot-scope="scope">
            <i class="el-icon-edit"  @click="edit(scope.row)"  v-ele-show="{btnCode:'b_test_demo_add'}"></i>
            &nbsp;
            <i class="el-icon-delete"  @click="del(scope.$index,scope.row)"  v-ele-show="{btnCode:'b_test_demo_del'}"></i>
          </template>
        </el-table-column> -->
      </el-table>
  
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <el-dialog :title="$t('common.btn.edit')" v-el-drag-dialog :visible.sync="dialogFormVisible" width="700px" >
        <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="120px">
          <div v-for="(item) in cols" :key="item.id" style="display:inline">
            <el-form-item  v-if="item.set && item.queryType==='input'" :label="commonI18n(item)" :prop="item.field" label-width="90px"
              :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
            >
              <!--:disabled="item.isEdit && item.disable"-->
               <el-input  v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" style="width:180px;" />
            </el-form-item>
             <el-form-item  v-if="item.set && item.queryType==='select'" :label="commonI18n(item)" label-width="90px"
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
           <el-form-item  v-if="item.set && item.queryType==='datetime'"  :label="commonI18n(item)" :prop="item.field" >
                <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :disabled="allowDisable && item.editReadonly"  v-model="defaultForm.params[item.field]"  type="datetime"    :placeholder="commonI18n(item)"  style="width: 180px"> </el-date-picker>
            </el-form-item>
           <el-form-item  v-if="item.set && item.queryType==='rangedatetime'"  :label="commonI18n(item)" :prop="item.field" >
                <el-date-picker
                  v-model="defaultForm.params[item.field]"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 180px"
                  >
                </el-date-picker>
            </el-form-item>
          </div>
  
        </el-form>
        <div slot="footer" class="dialog-footer" >
          <el-button @click="destory(false)">  {{ $t("common.btn.cancel") }}</el-button>
          <el-button type="primary" v-if="defaultForm.params.id==='' || defaultForm.params.id===null" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
          <el-button type="primary" v-if="defaultForm.params.id!='' && defaultForm.params.id!=null" @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
        </div>
      </el-dialog>
  
      
        <el-dialog title="字段选择" v-el-drag-dialog :visible.sync="dialogSelectFieldVisible" width="700px" >
        <el-form ref="exportColumn" :inline="true" :model="selectColumn" label-width="80px">
  
            <template>
                   <el-transfer v-model="selectColumn.fields"
                    :titles="['源字段', '目标字段']"
                    :data="selectColumn.colMap"></el-transfer>
            </template>
        </el-form>
        <div slot="footer" class="dialog-footer" >
          <el-button type="primary"  @click="saveSelectField()">  {{ $t("common.btn.submit") }}</el-button>
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
    name: 'list',
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
        processInfoId:String
     },
    data() {
      const  _initdata ={
        table_mark:"base-material",
        dialogFormVisible: false,
              allowDisable:false,
        dialogSelectFieldVisible:false,
        url:{
            add:"/base-material/add",
            del:"/base-material/del",
            list:"/base-material/items"
        },
        queryParams:{
          requestData:{ }
          },
        initSelect:{
           trayType:[],
           useState:[{label:'启用',value:0},{label:'警用',value:1}]
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
        listLoading: true,
        listQuery: {
          current: 1,
          pageSize: 15
        },
        cols: [
                  { field: 'pn', title: '物料代码', align: "left",query:true,queryType:'input',set:true,editReadonly:true,require:true,width:150},
                  { field: 'pnName', title: '物料名称', align: "left",query:true,queryType:'input',set:true,require:true,width:180},               
                  { field: 'pnDsc', title: '物料描述', align: "left",query:false,queryType:'input',set:false,require:true   },
                  { field: 'createTime', title: '创建时间', align: "left",query:true,queryType:'rangedatetime',set:true,require:true,width:180},               
                  { field: 'lastModifyTime', title: '修改时间', align: 'center' ,query:false,queryType:'date',width:150 },   
                  { field: 'unit', title: '单位', align: 'left', queryType: 'input', set: true, require: false },
                  { field: 'dn', title: '图号', align: 'left', queryType: 'input', set: true, require: false },
                  { field: 'pmType', title: '采购类型', align: 'left', queryType: 'input', set: true, require: false },
                  { field: 'abcCate', title: 'ABC分类', align: 'left', queryType: 'input', set: true, require: false },
                  { field: 'spPmType', title: '特殊采购类型', align: 'left', queryType: 'input', set: true, require: false },
                  { field: 'spec', title: '规格型号', align: 'left', queryType: 'input', set: true, require: false },
                  { field: 'isKey', title: '是否关键件', align: 'left', queryType: 'input', set: true, require: false },
                  { field: 'isLot', title: '是否批次管理', align: 'left', queryType: 'input', set: true, require: false },
                  { field: 'minPack', title: '最小包装数量', align: 'left', queryType: 'input', set: true, require: false },
                  { field: 'packSpec', title: '包装容器规格', align: 'left', queryType: 'input', set: true, require: false },
                  { field: 'pullType', title: '厂内拉动类型', align: 'left', queryType: 'input', set: true, require: false },
                  { field: 'supplierNo', title: '供应商编码', align: 'left', queryType: 'input', set: true, require: false },
                  { field: 'lotNo', title: '批次信息', align: 'left', queryType: 'input', set: true, require: false },
  
  
      ]
      }
      Object.assign(_initdata.defaultForm.params,this.initData(_initdata.cols))
      return _initdata
    },
    created() {
           this.initCustomVol(data=>{
             if(data && data.length>0){
                let fds = data.map(c=>c.item)
                this.cols.forEach(item=>{             
                    if(fds.indexOf(item.field)>=0){
                      item.hide = false
                    }else{
                      item.hide = true
                    }
                })
             }
           })
           this.getList()
           this.selectOptions()
    },
    methods: {
        initCustomVol(callback){
            const customColumn = {mark:this.table_mark,userName:sessionStorage.getItem("userInfo")}  
            const _data = {url:'/custom-item/guest/query',params:customColumn}
            this.$store.dispatch('fmsCommon/actionTaskPost',_data)
                .then(data => {                 
                    if(callback && typeof callback =="function"){
                         callback(data)
                    }
                }).catch(err => {
                    console.error(err)
                }).finally(()=>{
                
                })
        },
        selectFields(){
            this.dialogSelectFieldVisible = true   
            this.initCustomVol((data)=>{
              this.selectColumn.colMap=[]
              this.selectColumn.fields=[]
              this.selectColumn.origin = {}
              this.selectColumn.fields = data.map(c=>c.item)
              this.cols.forEach(item=>{
              this.selectColumn.origin[item.field] = item.title
                this.selectColumn.colMap.push({
                      key: item.field,
                      label: item.title,
                      disabled: false
                  })    
              })  
            })
        },
        saveSelectField(){
           const fields = {}
            // this.currScripts.cols.forEach(item=>{
            //    if(item.export){
            //      fields[item.field] = item.title
            //    }
            // })     
            let arr = []      
            this.selectViewCol.length = 1
            this.selectColumn.fields.forEach(item=>{
              if(this.selectColumn.origin[item]){
                 fields[item]=this.selectColumn.origin[item]
                 arr.push({item:item}) 
                 this.selectViewCol.push(item)
              }
            })
  
            if(this.selectColumn.fields.length==0)
               {
                      this.$message({
                      type: 'info',
                      message: '没有选择字段'
                    });
                    return
               }
  
            const customColumn = {mark:this.table_mark,userName:sessionStorage.getItem("userInfo"),items:arr}  
            const _data = {url:'/custom-item/guest/save',params:customColumn}
            this.$store.dispatch('fmsCommon/actionTaskPost',_data)
                .then(data => {
                this.$message({
                      type: 'success',
                      message: 'change success!=>'+data
                    });
                    this.dialogSelectFieldVisible = false
                    this.cols.forEach(item=>{
                        if(this.selectViewCol.indexOf(item.field)>=0){
                          item.hide = false
                        }else{
                          item.hide = true
                        }
  
                    })
                    //this.query()
                }).catch(err => {
                    console.error(err)
                }).finally(()=>{
                
                })
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
        // console.log(this.queryParams)
        if(this.queryParams.requestData.createTime){
            this.queryParams.requestData['startTime'] = this.queryParams.requestData.createTime[0]
            this.queryParams.requestData['endTime'] = this.queryParams.requestData.createTime[1]
            // delete this.queryParams.requestData.createTime
        }
        let param = JSON.parse(JSON.stringify(this.queryParams)) 
        delete param.requestData.createTime

        const _data = {url:this.url.list,params:param}
        this.$store.dispatch('fmsCommon/actionMdmPost',_data)
        .then(data => {
            this.list = data.data
            this.total = data.total
            this.listLoading = false
         }).catch(err => {
            console.error(err)
         })
        // httpUtils.actionFmsPost('/line/list',this.listQuery).then(data => {
        //     console.log(data)
        // })
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
  