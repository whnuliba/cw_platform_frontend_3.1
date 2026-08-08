<template>
  <div class="app-container">
        <div class="filter-container">
          <div   v-for="(item,index) in cols" :key="index" style="display:inline">
                  <el-input  v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="item.title" style="width: 120px" class="filter-item">
                     <!-- {{queryParams.requestData[item.field]=''}} -->
               </el-input>
                  <el-select  clearable  v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="item.title" style="width: 120px" class="filter-item">
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
          <el-date-picker class="filter-item" v-model="FinishTime" type="datetimerange"  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right"></el-date-picker>
          <el-button type="primary"     class="filter-item"  @click="query()" >
             {{ $t("common.btn.query") }}
          </el-button>
          <el-button type="info"     class="filter-item" @click="reset" >
             {{ $t("common.btn.reset") }}
          </el-button>
        </div>
     <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"  @row-dblclick="showDetails" >
      
      <el-table-column min-width="50px" label="序号" align="center">
        <template slot-scope="scope">
           <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column   v-for="(item) in cols"  :sortable="true"  :key="item.id" :label="item.title" :prop="item.field"  :width="item.width" :min-width="item.minWidth"  v-if="!item.hide"  :align="item.align"  show-overflow-tooltip> 
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
  name: 'carlibraReq',
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
      FinishTime:[new Date(new Date().getTime() - 3600*1000*24*7), new Date()],
      queryParams:{
        requestData:{ 

        }
        },
      initSelect:{
         pltCateId:[],
         rackFunc:[],
         dirState:[]
      }, 
      defaultForm: {
        row:{},
        params:{
         id:'',
        }
      },
      beginTime:null,
      endTime:null,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 15
      },
      cols: [
                { field: 'id', title: '日志Id', minWidth: 100,hide:true, align: "center" },
                { field: 'pltCateId', title: '托盘类型', minWidth: 100,query:true,queryType:'select' ,align: "center" },
                { field: 'rackCode', title: '位置编号', minWidth: 100, align: "center",query:true,queryType:'input' },
                { field: 'rackFunc', title: '货架功能', minWidth: 100, align: "center",query:true,queryType:'select'},
                { field: 'dirState', title: '货架方向', minWidth: 100, align: "center",query:true,queryType:'select'},
                { field: 'sourceCode', title: '资源号', align: 'center',query:false,queryType:'input'},
                // { field: 'transUser', title: '处理人', align: 'center',query:false,queryType:'input'},
                { field: 'finishTime', title: '记录时间', align: 'center' ,queryType:'select'},
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
      this.queryParams.requestData["beginTime"] = this.FinishTime[0]
      this.queryParams.requestData["endTime"] = this.FinishTime[1]
      const _data = {url:'/api/Common/GetCarlibReqApi',params:this.queryParams}
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
       //获取托盘类型
      let _data = {url:'/api/Cache/PltCate',params:{}}
      this.$store.dispatch('fmsCommon/actionWcsPost',_data)
            .then(data => {
                this.initSelect.pltCateId = data.filter(f=>f.pltFunc == 1).map(c=>{
                  return {
                    label:c.pltCateName,
                    value:c.pltCateId
                  }
                })
            }).catch(err => {
                console.error(err)
            })
            //获取货架功能
      _data = {url:'/api/Const/LocFunc',params:{}}
      this.$store.dispatch('fmsCommon/actionWcsPost',_data)
            .then(data => {
                this.initSelect.rackFunc = data.filter(f=>f.id==405|f.id == 404).map(c=>{
                        return {
                                label:c.name,
                                value:c.id
                            }
                })
            }).catch(err => {
                console.error(err)
            })
               //获取货架方向
      _data = {url:'/api/Const/DirState',params:{}}
      this.$store.dispatch('fmsCommon/actionWcsPost',_data)
            .then(data => {
                this.initSelect.dirState = data.map(c=>{
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
