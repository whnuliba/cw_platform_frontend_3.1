<template>
  <div class="app-container">
        <div class="filter-container">
          <div   v-for="(item,index) in cols" :key="index" style="display:inline">
                  <el-input  v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
                     <!-- {{queryParams.requestData[item.field]=''}} -->
               </el-input>
                  <el-select clearable    v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]"  :filterable="true" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
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
        </div>
     <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"  @row-dblclick="showDetails" >
      
      <el-table-column min-width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
           <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="commonI18n(item)" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column   v-for="(item) in cols"  :sortable="true"  :key="item.id" :label="commonI18n(item)" :prop="item.field"  :width="item.width" :min-width="item.minWidth"  v-if="!item.hide"  :align="item.align"  show-overflow-tooltip> 
						<template  slot-scope="{row}">{{commonFilter(row[item.field],item.field)}}</template>
            <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <!-- <el-table-column align="left" label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" v-ele-show="{btnCode:'wcs_staAdd'}"  icon="el-icon-edit" @click="edit(scope.row)">
             {{ $t("common.btn.edit") }}
          </el-button>
           &nbsp;
           <el-button type="warning" v-ele-show="{btnCode:'wcs_staDel'}"   size="small" icon="el-icon-edit" @click="del(scope.$index,scope.row)">
              {{ $t("common.btn.delete") }}
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog title="编辑" v-el-drag-dialog :visible.sync="dialogFormVisible" width="800px" >
      <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="80px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item  v-if="item.set && item.queryType==='input'" :label="commonI18n(item)" :prop="item.field"
            :rules="[{ required: item.required, message: item.title+'不能为空', trigger: 'blur' }]"
          >
             <el-input v-model="defaultForm.params[item.field]"  width='200px'  />
          </el-form-item>
           <el-form-item  v-if="item.set && item.queryType==='select'" :label="commonI18n(item)"
            :rules="[{ required: item.required, message: item.title+'不能为空', trigger: 'blur' }]"
           >
              <el-select clearable  v-model="defaultForm.params[item.field]" @change="$forceUpdate()" placeholder="请选择"  width='200px'>
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
        <el-button type="primary" v-if="defaultForm.params.laneName==='' || defaultForm.params.laneName===null" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.laneName!='' && defaultForm.params.laneName!=null"  @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
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
  name: 'pltCount',
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
  data() {
    const  _initdata ={
      dialogFormVisible: false,
      queryParams:{
        requestData:{ }
        },
      initSelect:{
         pltCateId:[],
         matlState:[],
         pltLoadState:[],
         laneName:[],
         wareName:[]
      }, 
      defaultForm: {
        row:{},
        params:{
         id:'',
         laneName:''
        }
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 20
      },
      cols: [
                { field: 'wareName', title: '仓库/物流线', align: 'center' ,query:true,queryType:'select',set:true,required:true},
                { field: 'laneName', title: '巷道/站台', minWidth: 100, align: "center", query:true,queryType:'select',},
                { field: 'pltCateId', title: '托盘类型', minWidth: 100, align: "center",query:true,queryType:'select',set:true,required:true },
                { field: 'matlState', title: '电芯状态', minWidth: 100, align: "center",query:true,queryType:'select',set:true,required:true },
                { field: 'pltLoadState', title: '载货状态', minWidth: 100, align: "center" ,query:true,queryType:'select',set:true,required:true},
                { field: 'pltCount', title: '托盘数量', minWidth: 100, align: "center",query:false,queryType:'input',set:true,required:true},
                { field: 'matlCount', title: '电芯数量', align: 'center',query:false,queryType:'input',set:true,required:true},
       ]
    }
    Object.assign(_initdata.defaultForm.params,this.initData(_initdata.cols))
    return _initdata
  },
  created() {
    this.getList()
    this.selectOptions()
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
    getList() {
      this.listLoading = true
      Object.assign(this.queryParams,this.listQuery)
      const _data = {url:'/api/Common/GetPltCountApi',params:this.queryParams}
      this.$store.dispatch('fmsCommon/actionWcsPost',_data)
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
       const _data = {url:'/api/LocInfo/AddStaInfo',params:{
          data:this.defaultForm.params
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
       //获取电池状态
       let _data = {url:'/api/Cache/MatlState',params:{}}
       this.$store.dispatch('fmsCommon/actionWcsPost',_data)
      .then(data => {
           this.initSelect.matlState = data.map(c=>{
             return {
               label: c.stateName,
               value: c.stateNum
             }
           })
       }).catch(err => {
          console.error(err)
       }),
       //获取装载状态
       _data = {url:'/api/Const/PltLoadState',params:{}}
      this.$store.dispatch('fmsCommon/actionWcsPost',_data)
            .then(data => {
                this.initSelect.pltLoadState = data.map(c=>{
                  return {
                    label:c.name,
                    value:c.id
                  }
                })
            }).catch(err => {
                console.error(err)
            }),
            //获取托盘类型
       _data = {url:'/api/Cache/PltCate',params:{}}
      this.$store.dispatch('fmsCommon/actionWcsPost',_data)
            .then(data => {
                this.initSelect.pltCateId = data.map(c=>{
                  return {
                    label:c.pltCateName,
                    value:c.pltCateId
                  }
                })
            }).catch(err => {
                console.error(err)
            }),
            //获取位置
       _data = {url:'/api/Common/GetLaneAndSta',params:{}}
      this.$store.dispatch('fmsCommon/actionWcsPost',_data)
            .then(data => {
                this.initSelect.laneName = data.map(c=>{
                  return {
                    label:c.name,
                    value:c.id
                  }
                })
            }).catch(err => {
                console.error(err)
            }),
            //获取仓库
       _data = {url:'/api/Common/GetWareAndCarry',params:{}}
      this.$store.dispatch('fmsCommon/actionWcsPost',_data)
            .then(data => {
                this.initSelect.wareName = data.map(c=>{
                  return {
                    label:c.name,
                    value:c.id
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
      let _data = {url:'/api/LocInfo/AddStaInfo',params:{data:this.defaultForm.params}}
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
                const _data = {url:'/api/LocInfo/DelStaInfo',params:{data:row.laneName}}
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

</style>
