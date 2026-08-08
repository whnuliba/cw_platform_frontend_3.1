<template>
  <div class="app-container">
        <div class="filter-container">
          <div   v-for="(item,index) in cols" :key="index" style="display:inline">
                  <el-input  v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
                     <!-- {{queryParams.requestData[item.field]=''}} -->
               </el-input>
                  <el-select clearable    v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
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
          <el-date-picker class="filter-item" v-model="warnTime" type="datetimerange"  :range-separator="$t('common.btn.to')" :start-placeholder="$t('const.time.beginTime')" :end-placeholder="$t('const.time.endTime')" align="right"></el-date-picker>
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
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :title="commonI18n(item)" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column   v-for="(item) in cols"  :sortable="true"  :key="item.id" :label="commonI18n(item)" :prop="item.field"  :width="item.width" :min-width="item.minWidth"  v-if="!item.hide"  :align="item.align"  show-overflow-tooltip> 
						<template  slot-scope="{row}">{{commonFilter(row[item.field],item.field)}}</template>
            <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
    
  </div>

</template>

<script>
import waves from "@/directive/waves"; // waves directive
import elDragDialog from "@/directive/el-drag-dialog";
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import i18n from '@/lang';
export default {
  name: 'fireLog',
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
  computed:{
    initSelect:{
      get(){
        return {
         logType:this.logType,
         finishFlag:[{ label:this.$t('const.treat.untreated'), value: 0 },{ label: this.$t('const.treat.treated'), value: 1 }]
        }
      }
    }
  },
  data() {
    const  _initdata ={
      dialogFormVisible: false,
      warnTime:[new Date(new Date().getTime() - 3600*1000*24*7), new Date()],
      queryParams:{
        requestData:{ 
            "logType":2,
            "finishFlag":0
        }
        },
        logType:[],
      defaultForm: {
        row:{},
        params:{
         id:'',
        }
      },
      beginWarnTime:null,
      endWarnTime:null,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 15
      },
      cols: [
                { field: 'id', title: '日志Id', minWidth: 100,hide:true, align: "center" },
                { field: 'logType', title: '日志类型', minWidth: 100,query:true,queryType:'select' ,align: "center" },
                { field: 'locCode', title: '位置编号', minWidth: 100, align: "center",query:true,queryType:'input' },
                { field: 'warnText', title: '报警信息', minWidth: 100, align: "center",query:true,queryType:'input'},
                { field: 'wcsInfo', title: '响应信息', align: 'center',query:false,queryType:'input'},
                { field: 'finishFlag', title: '处理标识', align: 'center',query:true,queryType:'select'},
                // { field: 'transUser', title: '处理人', align: 'center',query:false,queryType:'input'},
                { field: 'warnTime', title: '报警时间', align: 'center' ,queryType:'select'},
                { field: 'transTime', title: '响应时间', align: 'center' ,queryType:'select'},
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
      this.queryParams.requestData["beginWarnTime"] = this.warnTime[0]
      this.queryParams.requestData["endWarnTime"] = this.warnTime[1]
      const _data = {url:'/api/Common/GetFireLogApi',params:this.queryParams}
      this.$store.dispatch('fmsCommon/actionWcsPost',_data)
      .then(data => {
          this.list = data.data;
          this.total = data.total;
          this.listLoading = false;
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
  showDetails(row, column){
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
       //获取火警类型
      let _data = {url:'/api/Const/FireLogTypes',params:{}}
      this.$store.dispatch('fmsCommon/actionWcsPost',_data)
            .then(data => {
                this.logType = data.map(c=>{
                  return {
                    label:c.name,
                    value:c.id
                  }
                })
            }).catch(err => {
                console.error(err)
            })
      }, 
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
