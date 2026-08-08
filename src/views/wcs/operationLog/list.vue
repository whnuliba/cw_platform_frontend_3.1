<template>
  <div class="app-container">
    <div class="filter-container">
        <div v-for="(item,index) in cols" :key="index" style="display:inline">
            <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 200px" class="filter-item">
            </el-input>
            <el-select clearable  v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
            <el-option
                v-for="item in initSelect[item.field]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
            </el-select>
            <el-date-picker v-if="item.query && item.queryType==='datetime'" format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]"
                        type="datetime"
                        :placeholder="commonI18n(item)" style="width: 150" class="filter-item"></el-date-picker>
        <el-date-picker v-if="item.query && item.queryType==='date'" format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]" type="date"
                        :placeholder="commonI18n(item)" style="width: 150" class="filter-item"></el-date-picker>
        </div>
        <el-button type="primary" class="filter-item" @click="query()">
            {{ $t("common.btn.query") }}
        </el-button>
        <el-button type="info" class="filter-item" @click="reset">
            {{ $t("common.btn.reset") }}
        </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" >
        <el-table-column min-width="30px" :label="$t('common.no')" align="center">
            <template slot-scope="scope">
                <span>{{ scope.$index+1 }}</span>
            </template>
        </el-table-column>
        <el-table-column v-for="(item) in cols" :sortable="true"  v-if="!item.hide" :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width" :min-width="item.minWidth" :align="item.align" show-overflow-tooltip>
            <template slot-scope="{row}">{{ commonFilter(row[item.field],item.field) }}</template>
        </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>

</template>

<script>
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import i18n from '@/lang'
export default {
  name: 'operationLog',
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
    const _initdata = {
      dialogFormVisible: false,
      queryParams: {
        requestData: {
           pltCode:''
        }
        },
      initSelect: {

      },
      defaultForm: {
         row: {},
         params: {
         id: ''
        }
      },
      tableData: [],
      list: null,
      total: 0,
      drawer: false,
      listLoading: false,
      listQuery: {
        current: 1,
        pageSize: 15
      },
      cols: [
                { field: 'pltCode', title: '托盘条码', minWidth: 100, hide: true, align: 'center', query: true, queryType: 'input'},
                { field: 'logContent', title: '日志内容', align: 'center', query: false, queryType: 'input' },
                { field: 'logText', title: '操作类型', align: 'center', query: false, queryType: 'input' },
                { field: 'userId', title: '用户名', align: 'center', minWidth: 50, align: 'center' },
                { field: 'serviceName', title: '服务', minWidth: 100, align: 'center' },
                { field: 'methodName', title: '方法', minWidth: 100, align: 'center' }, 
                { field: 'oldData', title: '原始数据', minWidth: 100, align: 'center' },
                { field: 'newData', title: '提交数据', minWidth: 100, align: 'center' },
                { field: 'logTime', title: '操作时间', align: 'center' },
                { field: 'beginLogTime', title: '开始记录时间',hide:true, query: true, queryType: 'datetime', align: 'center' },
                { field: 'endLogTime', title: '结束记录时间', hide:true, query: true, queryType: 'datetime', align: 'center' }

       ]
    }
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
    return _initdata
  },

  created() {
    // this.getList()
  },

  methods: {
        initData(arr) {
         const args = {}
          arr.map(c => {
            if (c.set) {
              args[c.field] = null
            }
          })
          return args
        },

        commonFilter(value, type) {
           if (this.initSelect.hasOwnProperty(type) && typeof this.initSelect[type] !== undefined && Array.isArray(this.initSelect[type])) {
              return this.getValueConvert(this.initSelect[type], value)
            }
           if (this.initSelect.hasOwnProperty(type) && !Array.isArray(this.initSelect[type]) && this.initSelect[type].hasOwnProperty(value)) {
             return this.initSelect[type][value]
           }
           return value
      },

     getList() {
      this.listLoading = true
      Object.assign(this.queryParams, this.listQuery)
      const _data = { url: '/api/Common/GetOperationLog', params: this.queryParams }
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
      .then(data => {
          this.list = data.data
          this.total = data.total
          this.listLoading = false
       }).catch(err => {
          console.error(err)
       })
     },

     getValueConvert(arr, value) {
          for (const v of arr) {
            if (v.value === value) {
                return v.label
              }
        }
        return value
     },
      getItem(arr,field){
        for(let item of arr){
          if(item.field==field)
            return item;
        }
      },
     query() {
      if(!(this.queryParams.requestData.pltCode)) 
      {
        this.$message.warning(this.$t('const.pleaseInput')+this.commonI18n(this.getItem(this.cols,'pltCode')))
        return
      }
      this.listQuery.current = 1
      this.getList()
     },

     reset() {
     for (const p in this.queryParams.requestData) {
        if (this.queryParams.requestData.hasOwnProperty(p)) {
          this.queryParams.requestData[p] = ''
        }
      }
     },

  }
}
</script>

<style>
.el-drawer.rtl {
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .filter-item{
  margin-left: 3px;
}
</style>
