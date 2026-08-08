<template>
  <div class="app-container">
        <div class="filter-container">
          <div   v-for="(item,index) in cols" :key="index" style="display:inline">
                  <el-input  v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
                     <!-- {{queryParams.requestData[item.field]=''}} -->
               </el-input>
                  <el-select   v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
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
           <!-- <el-button type="warning" v-ele-show="{btnCode:'wcs_deviceRouteInfoAdd'}"  class="filter-item" @click="add" >
               {{ $t("common.btn.add") }}
           </el-button> -->
        </div>
     <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"   >
      
      <el-table-column min-width="50px" :label="$t('common.no')" align="center" fixed="left">
        <template slot-scope="scope">
           <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="commonI18n(item)" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column   v-for="(item) in cols"  :sortable="true"  :key="item.field" :label="commonI18n(item)" :prop="item.field"  :width="item.width" :min-width="item.minWidth"  v-if="!item.hide"  :align="item.align"  show-overflow-tooltip> 
						<template  slot-scope="{row}">{{commonFilter(row[item.field],item.field)}}</template>
            <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="left" :label="$t('common.oper')" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-info" @click="detail(scope.row)">
            {{ $t('common.btn.detail') }}
          </el-button>
           <el-button type="warning" v-ele-show="{btnCode:'wcs_wmsTaskCancel'}" v-if="scope.row.taskState==0"  size="small" icon="el-icon-edit" @click="cancel(scope.$index,scope.row)">
              {{ $t("common.btn.cancel") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />

      <el-dialog title="托盘信息" v-el-drag-dialog :visible.sync="dialogDtsFormVisible" width="950px" >
        <div style="width: 100%; height: 400px;overflow:auto">
        <el-table v-loading="listLoading" :data="listDts" border fit highlight-current-row style="width: 100%">
          <el-table-column v-for="(item) in colPltInfos" :key="item.id" :label="commonI18n(item)" :prop="item.field"
                           :width="item.width"
                           :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip>
                <template  slot-scope="{row}">{{commonFilter(row[item.field],item.field)}}</template>
          </el-table-column>
        </el-table>
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
  name: 'wmsTask',
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

  },
  data() {
    const  _initdata ={
      textI18n:{
        cancelInfo:{zh:'确定要取消该任务吗？',en:"Are you sure to cancel this task?"},
        cancelSuccess:{zh:'取消成功',en:"Cancel successfully"},
        },

      dialogFormVisible: false,
      dialogDtsFormVisible:false,
      dialogtitle: '编辑',
      queryParams:{
        requestData:{ }
        },
      initSelect:{
        pltFunc:[],
        pltCateId:[],
        fromLocType:[],
        laneId:[],
        toLocType:[],
        carryType:[],
        matlState:[],
        taskState:[]
      },
      defaultForm: {
        row:{},
        params:{
          id:''
        }
      },
      defaultDtsForm: {
        row:{},
        params:{
         id:'', 
        }
      },
      list: null,
      total: 0,
      listDts: [],
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 15
      },
      cols: [
                { field: 'wmsTaskId', title: 'id', minWidth: 100,  align: "center" ,hide:true},
                { field: 'wmsTaskNo', title: '任务号', minWidth: 125,  align: "center" },
                { field: 'wmsTaskGroupId', title: '任务组号',hide:true, minWidth: 160,  align: "center" },
                { field: 'pltCode', title: '托盘号', minWidth: 100,  align: "center",query:true ,queryType:'input'},
                { field: 'containerCtrlCode', title: '托盘组号', minWidth: 165,  align: "center",query:true,queryType:'input' },
                { field: 'pltFunc', title: '托盘功能', minWidth: 100,  align: "center" },
                { field: 'pltCateId', title: '托盘类型', minWidth: 110,  align: "center" },
                { field: 'laneId', title: '巷道',hide:true,queryType: 'select', query: true, minWidth: 100,  align: "center", },
                { field: 'laneCode', title: '巷道编号', minWidth: 110,  align: "center" },
                { field: 'carryType', title: '搬运类型', minWidth: 110,  align: "center" },
                { field: 'priority', title: '优先级', minWidth: 100,  align: "center" },
                { field: 'fork', title: '货叉', minWidth: 100,  align: "center" },
                { field: 'taskState', title: '任务状态', minWidth: 110,  align: "center" },
                { field: 'routeCode', title: '路由编码', minWidth: 115,  align: "center" },
                { field: 'matlState', title: '电池状态', minWidth: 110,  align: "center" },
                { field: 'fromLocType', title: '起始位置类型', minWidth: 130,  align: "center" },
                { field: 'fromLocId', title: '起始位置', minWidth: 100,  align: "center",hide:true },
                { field: 'fromLocCode', title: '起始位置编号', minWidth: 140,  align: "center" ,query:true,queryType:'input'},
                { field: 'fromLocCtrlCode', title: '起始位置控制号', minWidth: 160,  align: "center" },
                { field: 'toLocType', title: '到达位置类型', minWidth: 130,  align: "center" },
                { field: 'toLocId', title: '到达位置', minWidth: 100,  align: "center" ,hide:true},
                { field: 'toLocCode', title: '到达位置编号', minWidth: 130,  align: "center",query:true,queryType:'input' },
                { field: 'toLocCtrlCode', title: '到达位置控制号', minWidth: 140,  align: "center" },
                { field: 'createTime', title: '创建时间', minWidth: 150,  align: "center" },
                { field: 'execTime', title: '执行时间', minWidth: 150,  align: "center"},
                { field: 'finishTime', title: '完成时间', minWidth: 150,  align: "center" },
       ],
       colPltInfos: [  
                { field: 'trayCode', title: '托盘号', minWidth: 100,  align: "center",queryType:'input'},
                { field: 'trayCtrlCode', title: '托盘组号', minWidth: 150,  align: "center",queryType:'input' },
                { field: 'trayIndex', title: '托盘序号', minWidth: 100,  align: "center",queryType:'input'},
                { field: 'lotNo', title: '批次号', minWidth: 150,  align: "center" }, 
                { field: 'matlCateCode', title: '物料类别',queryType: 'input', minWidth: 150,  align: "center", },
                { field: 'levelCode', title: '等级', minWidth: 110,  align: "center" },
                { field: 'lingCode', title: '线体', minWidth: 110,  align: "center" }
       ]
    }
    return _initdata
  },
  created() {
    this.getList()
    this.selectOptions()
  },
  methods: {
      translateText(type){
      return this.textI18n[type][this.$store.state.app.language];
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
      const _data = {url:'/api/CarryTask/GetWmsTasks',params:this.queryParams}
      this.$store.dispatch('fmsCommon/actionWcsPost',_data)
      .then(data => {
          this.list = data.data;
          this.total = data.total
          this.listLoading = false;
       }).catch(err => {
          console.error(err)
       })
    //   httpUtils.actionFmsPost('/line/list',this.listQuery).then(data => {
    //       console.log(data)
    //   })
    },

    detail(row) {
        this.dialogDtsFormVisible = true
        this.listLoading = true
        this.wmsTaskId = row.wmsTaskId
        this.getDtsList(row.wmsTaskId)
      },  
    getDtsList(val) {
        this.listLoading = true
        const _data = { url: '/api/CarryTask/GetWmsTaskPltInfo', params:{data:val} }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.listDts = data;
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
     
       
      let _data = { url: '/api/Const/pltFunc', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.pltFunc = data.map(c => {
                  return {
                    label: c.name,
                    value: c.id
                  }
                })
            }).catch(err => {
                console.error(err)
            })
      _data = { url: '/api/Cache/PltCate', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.pltCateId = data.map(c => {
                  return {
                    label: c.pltCateName,
                    value: c.pltCateId
                  }
                })
            }).catch(err => {
                console.error(err)
            })
      _data = { url: '/api/Cache/locTypes', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.fromLocType = data.map(c => {
                  return {
                    label: c.name,
                    value: c.id
                  }
                }),
                this.initSelect.toLocType = data.map(c => {
                  return {
                    label: c.name,
                    value: c.id
                  }
                })
            }).catch(err => {
                console.error(err)
            })
      _data = { url: '/api/LocInfo/GetCarryTypes', params: {}}
       this.$store.dispatch('fmsCommon/actionWcsPost', _data)
      .then(data => {
           this.initSelect.carryType = data.map(c => {
             return {
               label: '['+c.id+']'+c.name,
               value: c.id
             }
           })
       }).catch(err => {
          console.error(err)
       })
       _data = { url: '/api/Cache/MatlState', params: { data: { 'locType': this.locType }}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.matlState = data.map(c => {
                  return {
                    label:`[${c.stateNum}]${c.stateName}`,
                    value:c.stateNum
                  }
                })
            }).catch(err => {
                console.error(err)
            })
      _data = { url: '/api/Const/WmsTaskState', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.taskState = data.map(c => {
                  return {
                    label: c.name,
                    value: c.id
                  }
                })
            }).catch(err => {
                console.error(err)
            }),
             // 获取关联巷道
       _data = { url: '/api/Cache/LaneInfo', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.laneId = data.map(c => {
                  return {
                    label: c.laneName,
                    value: c.laneId
                  }
                })
            }).catch(err => {
                console.error(err)
            })
      }, 
      
   
   cancel(index,row){
      this.$confirm(this.translateText("cancelInfo"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {        
                const _data = {url:'/api/CarryTask/CancelWmsTask',params:{data:row.wmsTaskId}}
                this.$store.dispatch('fmsCommon/actionWcsPost',_data)
                .then(data => {
                      this.getList()
                      this.$message({
                      type: 'success',
                      message: this.translateText("cancelSuccess")
                    });
                }).catch(err => {
                    console.error(err)
                })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common.btn.Cancelled')
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
