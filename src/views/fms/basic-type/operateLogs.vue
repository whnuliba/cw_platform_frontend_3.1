/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: 系统管理-操作日志
 */
 <template>
  <div class="app-container">
        <div class="filter-container">
          <div   v-for="(item,index) in cols" :key="index" style="display:inline">
                  <el-input  v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="item.title" style="width: 120px" class="filter-item">
               </el-input>
                  <el-select   v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="item.title" style="width: 120px" class="filter-item">
                    <el-option
                    v-for="item in initSelect[item.field]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
               </el-select>
                <el-date-picker 
                v-if="item.query && item.queryType==='date'" 
                format="yyyy-MM-dd HH:mm:ss" 
                value-format="yyyy-MM-dd HH:mm:ss"  
                v-model="queryParams.requestData[item.field]"
                type="datetimerange"  
                range-separator="至"  
                start-placeholder="开始日期"
                end-placeholder="结束日期"  
                style="width: 150" 
                class="filter-item"/>
          </div>
          <el-button type="primary"     class="filter-item"  @click="query()" >
             {{ $t("common.btn.query") }}
          </el-button>
          <el-button type="info"     class="filter-item" @click="reset" >
             {{ $t("common.btn.reset") }}
          </el-button>
        </div>
     <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"  @row-dblclick="showDetails" >
      <!-- 表格 -->
      <el-table-column width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
           <span>{{(listQuery.current - 1) * listQuery.pageSize + (scope.$index+1)}}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(item) in cols"  :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width" :min-width="item.minWidth"  :align="item.align" > 
		    <template  slot-scope="{row}">{{commonFilter(row[item.field],item.field)}}</template>
      </el-table-column>
      <el-table-column align="center" :label="$t('common.btn.operate')" fixed="right" width="280">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="detail(scope.row,0)"
          >
          {{ $t('common.btn.beforeModify') }}
          </el-button>

          <el-button
            type="primary"
            size="small"
            @click="detail(scope.row,1)"
          >
          {{ $t('common.btn.afterModify') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
<!-- 页码 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <ContentShow ref="ContentShow"></ContentShow>
  </div>

</template>

<script>
import waves from "@/directive/waves"; 
import elDragDialog from "@/directive/el-drag-dialog";
import Pagination from '@/components/Pagination' 
import i18n from '@/lang';
import ContentShow from '../../common/ContentShow.vue';
export default {
  name: 'CellList',
  components: {Pagination,ContentShow },
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
         type:[{label:'启用业务编码',value:0},{label:'禁用业务编码',value:1}]
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
                { field: 'bizName', title: '接口名称', align: 'center',width: 125, query: true, align: "center", queryType:'input'},
                { field: 'createUser', title: '变更用户', align: 'center',width: 125, align: "center"},
                { field: 'createTime', title: '创建时间', align: 'center',width: 150, align: "center"},
                { field: 'originalMsg', title: '修改前参数', align: 'left', query: true, align: "center", queryType:'input' },
                { field: 'targetMsg', title: '修改后参数', align: 'left', query: true, align: "center", queryType:'input' },
        ]
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
      this.listLoading = true
      Object.assign(this.queryParams,this.listQuery)
      const _data = {url:'/operationLog/list',params:this.queryParams}  // /operation-log/list
      let a = new Date()
      this.$store.dispatch('fmsCommon/actionFmsPost',_data)
      .then(data => {
          let b = new Date()
          this.list = data.data
          this.list.map(c=>{
              if(c.originalMsg && c.originalMsg.length>50000){
                c.originalMsg =c.originalMsg.substring(0,5000)
              }
              if(c.targetMsg && c.targetMsg.length>50000){
                c.targetMsg =c.targetMsg.substring(0,5000)
              }
          })
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
  },
  showDetails(row, column){
  },
  detail(row,state){
        if(state == 0){
          this.$refs.ContentShow.detail(row.originalMsg);
        }else {
          this.$refs.ContentShow.detail(row.targetMsg);
        }
      },
// 查询和重置回调
  query(){
     this.listQuery.current = 1;
     this.getList();
  },
  reset(){
    for(let p in  this.queryParams.requestData){
      if(this.queryParams.requestData.hasOwnProperty(p)){
        this.queryParams.requestData[p]=''
      }
    }
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
::v-deep .el-table .cell{  
  white-space: pre!important;
}
</style>
