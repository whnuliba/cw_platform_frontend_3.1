<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item,index) in cols" :key="index" style="display:inline">
        <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="item.title" style="width: 120px" class="filter-item">
          <!-- {{queryParams.requestData[item.field]=''}} -->
        </el-input>
        <el-select v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="item.title" style="width: 120px" class="filter-item">
          <el-option v-for="item in initSelect[item.field]"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker v-if="item.query && item.queryType==='datetime'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]" type="datetime" :placeholder="item.title" style="width: 150" class="filter-item"> </el-date-picker>
        <el-date-picker v-if="item.query && item.queryType==='date'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]" type="date" :placeholder="item.title" style="width: 150" class="filter-item"> </el-date-picker>

      </div>
      <el-button type="primary" class="filter-item" @click="query()">
        {{ $t("common.btn.query") }}
      </el-button>
      <el-button type="info" class="filter-item" @click="reset">
        {{ $t("common.btn.reset") }}
      </el-button>
      <!--<el-button type="warning" class="filter-item" @click="add" v-ele-show="{btnCode:'ADD_TOOL_INFO'}">
        {{ $t("common.btn.add") }}
      </el-button>-->
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @row-dblclick="showDetails">

      <el-table-column min-width="50px" label="序号" align="center">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column v-for="(item) in cols" :key="item.id" :label="item.title" :prop="item.field" :width="item.width" :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{commonFilter(row[item.field],item.field)}}
        </template>
        <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="left" label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="small"  icon="el-icon-edit" @click="edit(scope.row)">
             {{ $t("common.btn.edit") }}
          </el-button>
           &nbsp;
           <el-button type="warning" v-ele-show="{btnCode:'DEL_TOOL_INFO'}"   size="small" icon="el-icon-edit" @click="del(scope.$index,scope.row)">
              {{ $t("common.btn.delete") }}
          </el-button> -->

          <el-button type="primary" size="small" icon="el-icon-edit" @click="details(scope.row)">
            {{ $t("common.btn.details") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog title="编辑" v-el-drag-dialog :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="80px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item v-if="item.set && item.queryType==='input'" :label="item.title" :prop="item.field"
                        :rules="[{ required: true, message: item.title+'不能为空', trigger: 'blur' }]">
            <el-input v-model="defaultForm.params[item.field]" />
          </el-form-item>
          <el-form-item v-if="item.set && item.queryType==='select'" :label="item.title">
            <el-select v-model="defaultForm.params[item.field]" @change="$forceUpdate()" placeholder="请选择">
              <el-option v-for="item in initSelect[item.field]"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="destory(false)">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.id==='' || defaultForm.params.id===null" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.id!='' && defaultForm.params.id!=null" @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>

    <!--显示明细-->
    <el-dialog :title="'['+cellBarCode+']明细'" v-el-drag-dialog :visible.sync="pointForDetailsVisible" height="800">
      <component :is="dtsOfswitch" ref="pointForDetailsList" :pointForDetailsList="pointForDetailsList"> </component>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pointForDetailsVisible = false">  {{ $t("common.btn.cancel") }}</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import waves from "@/directive/waves"; // waves directive
import elDragDialog from "@/directive/el-drag-dialog";
import pointForDetailsList from './components/hisPointsFor-details'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import i18n from '@/lang';
export default {
  name: 'pointForList',
    components: { Pagination, pointForDetailsList },
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
      pointForDetailsList:'',
      pointForDetailsVisible:false,
      cellBarCode:'',
      dtsOfswitch:'pointForDetailsList',
      queryParams:{
        requestData:{ }
        },
      initSelect:{
         cellState:[],
         lineId:[],
         useState:[{label:'启用',value:0},{label:'禁用',value:1}]
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
            { field: 'cellBarCode', title: '电芯条码', minWidth: 220  ,  align: 'center',query:true,queryType:'input' },
            { field: 'lotNo', title: '电芯批次', minWidth: 140, align: 'center' },
            { field: 'lineId', title: '线体', width: 145,  align: "center",query:true,queryType:'select'},
            { field: 'cellType', title: '电芯型号',minWidth: 100, align: 'center' },
            { field: 'pltCode', title: '托盘条码',minWidth: 200,  align: 'center' ,query:true,queryType:'input' },
            { field: 'actId', title: '托盘激活Id',hide:true,  align: 'center' },
            { field: 'channelNo', title: '通道',minWidth: 100,  align: 'center' },
            {field: 'cellState', width: 150,title: '电芯状态', align: 'center'},
            { field: 'inStation', title: '入站时间',  align: 'center'  ,width:200},
            { field: 'outStation', title: '出站时间',  align: 'center' ,width:200},
            { field: 'totalCapacity', title: '总容量',minWidth: 150,  align: 'right' },
            { field: 'beginVoltage', title: '初始电压',minWidth: 100,  align: 'right' },
            { field: 'endVoltage', title: '结束电压',minWidth: 150,  align: 'right' },
            { field: 'protectCode', title: '保护参数',minWidth: 150,  align: 'center' },
            { field: 'temperature', title: '温度', minWidth: 100, align: 'center' },
            { field: 'beginTime', title: '开始时间',  align: 'center' ,width:200},
            { field: 'endTime', title: '结束时间',  align: 'center' ,width:200},
            { field: 'flowCode', title: '化成流程',minWidth: 150,  align: 'center' },
            { field: 'boxCode', title: 'BOX',minWidth: 150,  align: 'center' },
            { field: 'unit', title: '单位', minWidth: 100, align: 'center' },
            { field: 'retest', title: '是否复测', align: 'center', width: 200 },
            { field: 'createTime', title: '创建时间', align: 'center', width: 200 },
            { field: 'workNo', title: '工单', minWidth: 150, align: 'center' },
            { field: 'remark', title: '备注', align: 'left', width:200},
            { field: 'errorCode', title: '错误代码', align: 'center', width:150},
            { field: 'flowVersion', title: '流程版本', align: 'center',width:200 },
            { field: 'processName', title: '工序名称',minWidth: 150,  align: 'center' },
            { field: 'workShift', title: '班次',minWidth: 100,  align: 'center' },
            { field: 'workPeople', title: '人员',minWidth: 100,   align: 'center' },
            { field: 'deviceNo', title: '设备号', align: 'center' ,width:200},
            { field: 'deviceState', title: '设备状态',hide:false,minWidth:150,  align: 'center' },
            { field: 'bTime', title: '开始时间', hide: true, align: 'center', query: true, queryType: 'date' },
            { field: 'eTime', title: '结束时间', hide:true, align: 'center', query: true, queryType: 'date' },

    ]
    }
    Object.assign(_initdata.defaultForm.params,this.initData(_initdata.cols))
    return _initdata
  },
  created() {
    //this.getList()
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
      const _data = { url:'/pointsforresultfmshis/list',params:this.queryParams}
      this.$store.dispatch('fmsCommon/actionFmsHisPost',_data)
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
      details(row){
      this.cellBarCode = row.cellBarCode
        this.pointForDetailsList=row.id
        this.pointForDetailsVisible=true
     // this.dtsOfswitch='chargeDts'
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
       const _data = {url:'/tool/add',params:{
          data:this.defaultForm.params
       }}
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$store.dispatch('fmsCommon/actionFmsPost',_data)
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
       let _data = {url:'/constant/cell-state',params:{}}
       this.$store.dispatch('fmsCommon/actionFmsPost',_data)
      .then(data => {
           this.initSelect.cellState = data.map(c=>{
             return {
               label:c.name,
               value:c.value
             }
           })
       }).catch(err => {
          console.error(err)
       })


       _data = {url:'/line/guest/all',params:{}}
       this.$store.dispatch('fmsCommon/actionFmsPost',_data)
      .then(data => {
           this.initSelect.lineId = data.map(c=>{
             return {
               label:c.lineNo,
               value:c.id
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
      let _data = {url:'/tool/add',params:{data:this.defaultForm.params}}
         this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$store.dispatch('fmsCommon/actionFmsPost',_data)
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
                const _data = {url:'/tool/del',params:{data:row.id}}
                this.$store.dispatch('fmsCommon/actionFmsPost',_data)
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

  .filter-item {
    margin-left: 3px;
  }
</style>
