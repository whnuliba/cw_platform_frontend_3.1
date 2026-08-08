<template>
  <div >
     <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @row-click="poRowClick"  @row-dblclick="showDetails" >
      
      <!-- <el-table-column min-width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
           <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column   v-for="(item) in cols"  :key="item.id" :label="commonI18n(item)" :prop="item.field"  :width="item.width" :min-width="item.minWidth"  v-if="!item.hide" v-show="!item.hide"  :align="item.align"  show-overflow-tooltip> 
						<template  slot-scope="{row}">           
                       <div v-if="!item.edit || !is_all_edit" >{{commonFilter(row[item.field],item.field)}}</div>
                       <div v-if="item.edit && item.queryType=='input' && is_all_edit" > 
                       <el-input
                                placeholder="请输入内容"
                                v-model="row[item.field]"
                                clearable style="padding:0">
                        </el-input>
                      </div>
                      <div v-if="item.edit && item.queryType=='select' && is_all_edit" > 
                        <el-select v-model="row[item.field]"  placeholder="...">
                          <el-option
                            v-for="ops in initSelect[item.field]"
                            :key="ops.value"
                            :label="ops.label"
                            :value="ops.value">
                          </el-option>
                        </el-select>
                       </div>
                       </template>
            <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="left" :label="$t('common.oper')" fixed="right" width="100">
        <template slot-scope="scope">
            <el-button type="primary" v-if="is_all_edit"  icon="el-icon-edit" plain @click="editSave(scope.row)" size="mini">暂存</el-button>
        </template>
      </el-table-column>
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
         <el-form-item  v-if="item.set && item.queryType==='datetime'"  :label="commonI18n(item)" :prop="item.field" label-width="90px" >
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
  </div>

</template>

<script>
import waves from "@/directive/waves"; // waves directive
import elDragDialog from "@/directive/el-drag-dialog";
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import i18n from '@/lang';
export default {
  name: 'materialDistItem',
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
      materialDistItemId:String
   },
  data() {
    const  _initdata ={
      table_mark:"mdm_po",
      dialogFormVisible: false,
            allowDisable:false,
      sectionNo:"",      
      dialogSelectFieldVisible:false,
      queryParams:{
        requestData:{ }
        },
        materialDistId:"",
      initSelect:{
        stationNo:[],
         trayType:[],
         priority:[],
         wsNo:[],
         poState:[],
         useState:[{label:'启用',value:0},{label:'警用',value:1}]
      }, 
      url:{
          add:"/material-dist-item/add",
          del:"/material-dist-item/del",
          list:"/material-dist-item/guest/hedid"
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
      is_all_edit:false,
      listLoading: false,
      listQuery: {
        current: 1,
        pageSize: 20
      },
      cols: [       
            { field: 'pn', title: '物料编码', align: "left",query:true,queryType:'input',set:true,require:true   },
             { field: 'pnName', title: '物料名称', align: "left",query:true,queryType:'input',set:true,require:true   },
            { field: 'gn', title: '图号',query:true,align: "left",queryType:'input',set:true,require:true  },
            { field: 'createTime', title: '创建时间', align: "left",query:false,queryType:'input',set:false,require:true   },
            { field: 'lastModifyTime', title: '拣货时间', align: "left",query:false,queryType:'input',set:false,require:true   },
            { field: 'lastModifyUser', title: '拣货人', align: "left",query:false,queryType:'input',set:false,require:true   },
            { field: 'qty', title: '需求数量', align: "left",query:false,queryType:'input',set:false,require:true   },
            { field: 'processNo', title: '配送工序', align: "left",query:false,queryType:'input',set:false,require:true   },
            { field: 'stationNo', title: '配送工位', align: "left",query:false,queryType:'select',set:false,require:true,edit:true   },
            { field: 'actualQty', title: '配送数量', align: "left",query:false,queryType:'input',set:false,require:true,edit:true },

      ]
    }
    Object.assign(_initdata.defaultForm.params,this.initData(_initdata.cols))
    return _initdata
  },

    watch:{
    // materialDistItemId:function(val){
    //    this.materialDistId = val
    //    this.getList()
    // }
  },
  created() {
         this.selectOptions()
  },

  methods: {
      materialDistItem:function(val){
      this.is_all_edit = (val.status==100?true:false)
      let _data = {url:'/factory/guest/get-station-no',params:{data:val.scNo}}
       this.$store.dispatch('fmsCommon/actionMdmPost',_data)
      .then(data => {
           this.initSelect.stationNo = data.map(c=>{
             return {
               label:c.stationName,
               value:c.stationNo
             }
           })
       }).catch(err => {
          console.error(err)
       })
 
       this.materialDistId = val.id
       this.getList()
    },

    updateActualQty(){
         const _data = {url:"/material-dist-item/update-packing",params:{
          data:this.list
       }}
       for(let item of this.list){
         if(item.actualQty==0 || item.stationNo==null){
          this.$alert(`${item.pn}存在配送数量位0，配送工位位空的情况`, '提示信息', {
          confirmButtonText: '确定',
          callback: action => {
          }
        });         
             return
         }
       }

       this.$confirm("你确定拣货完成了吗？提交后当前配送单不可再变更", i18n.t("common.tip_info.tips"), {
            confirmButtonText: i18n.t("common.btn.ok"),
            cancelButtonText: i18n.t("common.btn.cancel"),
            type: 'warning'
          }).then(() => {        
          this.$store.dispatch('fmsCommon/actionWmsPost',_data)
              .then(data => {
              this.$message({
                    type: 'success',
                    message: 'change success!=>'+data
                  });
                  this.query()
              }).catch(err => {
                  console.error(err)
              }).finally(()=>{
          })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: 'cancel packing'
            });          
        })
       },
       poRowClick(row, column, event){
             this.$emit('changeBomItem',  row)
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
      this.listLoading = true
      const _data = {url:this.url.list,params:{data:this.materialDistId}}
      this.$store.dispatch('fmsCommon/actionWmsPost',_data)
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
  add(){
       this.allowDisable = false
     this.destory(true)
  },
  showDetails(row, column){
  },
  editSave(row){
      console.log(row)
      const _data = {url:this.url.add,params:{
          data:row
       }}
    this.$store.dispatch('fmsCommon/actionWmsPost',_data)
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
              this.$store.dispatch('fmsCommon/actionWmsost',_data)
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
              this.$store.dispatch('fmsCommon/actionWmsPost',_data)
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
                this.$store.dispatch('fmsCommon/actionWmsPost',_data)
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
