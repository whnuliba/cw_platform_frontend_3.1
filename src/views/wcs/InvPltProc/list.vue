<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item,index) in cols" :key="index" style="display:inline">
        <el-input
          v-if="item.query && item.queryType==='input'"
          v-model="queryParams.requestData[item.field]"
          :placeholder="commonI18n(item)"
          style="width: 120px"
          class="filter-item"
        />
        <el-select clearable 
          v-if="item.query && item.queryType==='select'"
          v-model="queryParams.requestData[item.field]"
          :placeholder="commonI18n(item)"
          style="width: 120px"
          class="filter-item"
        >
          <el-option
            v-for="item in initSelect[item.field]"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-date-picker
          v-if="item.query && item.queryType==='datetime'"
          v-model="queryParams.requestData[item.field]"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          :placeholder="commonI18n(item)"
          style="width: 150"
          class="filter-item"
        />
        <el-date-picker
          v-if="item.query && item.queryType==='date'"
          v-model="queryParams.requestData[item.field]"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="date"
          :placeholder="commonI18n(item)"
          style="width: 150"
          class="filter-item"
        />

      </div>
      <el-button type="primary" :style="{marginLeft:'10px'}" class="filter-item" @click="query()">
        {{ $t('common.btn.query') }}
      </el-button>
      <el-button type="info" class="filter-item" @click="reset">
        {{ $t('common.btn.reset') }}
      </el-button>
      <el-button type="info" class="filter-item" @click="handleDownload">
        {{ $t('table.exports') }}
      </el-button>
      <el-table
        id="ta"
        :data="list"
        border:cell-style="cellStyle"
        style="width: 100%"
      >
        <el-table-column
          v-for="(items) in cols"
          :sortable="true"
          v-if="!items.hide"
          :key="items.id"
          :label="commonI18n(items)"
          :prop="items.field"
          :width="items.width"
          :fixed="items.fixed"
          :min-width="items.minWidth"
          :align="items.align"
          show-overflow-tooltip
          :formatter="items.template == undefined ? function(row, column, cellValue, index) {
            return cellValue;
          } : items.template"
        />
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.current"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />
    </div>

    <el-drawer
      title="托盘电芯详细"
      :visible.sync="drawer"
      direction="rtl"
    >
      <el-col :span="24" style="padding: 20px;">
        <el-table
          :data="tableData"
          border
          style="width: 100%;"
        >
          <el-table-column
            type="index"
            align="center"
            label="序号"
          />
          <el-table-column
            prop="matlCode"
            align="center"
            label="电芯条码"
          />
        </el-table>
      </el-col>
    </el-drawer>

  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import constParam from './constParam'
  import waves from '@/directive/waves' // waves directive
  import elDragDialog from '@/directive/el-drag-dialog'

  export default {
    name: 'InvPltProc',
    components: { Pagination },
    directives: { waves, elDragDialog },
    data() {
      return {
        tableData: [],
        drawer: false,
        selectValue: 0,
        fromLocOption: [],
        cols: [
          {
            field: 'pltCode',
            title: '托盘条码',
            minWidth: 110,
            align: 'left',
            query: true,
            queryType: 'input',
            set: true,
            required: true
          },
          {
            field: 'pltCtrlCode', title: '托盘编号', minWidth: 80, align: 'right',
            query: true,
            queryType: 'input',
            set: true,
            required: true
          },
          { field: 'pltCateName', title: '托盘类型', minWidth: 120, align: 'left' },
          {
            field: 'carryState', title: '搬运状态', minWidth: 120, align: 'left',
            template: constParam.formatter.PltCarryState
          },
          { field: 'locName', title: '当前位置', minWidth: 180, align: 'left' },
          {
            field: 'matlState', title: '电池状态', minWidth: 120, align: 'left',
            template: constParam.formatter.MatlState,
            query: true,
            queryType: 'select',
            set: true,
            required: true
          },
          {
            field: 'mesState', title: '接口状态', minWidth: 120, align: 'left',
            template: constParam.formatter.MesState
          },
          { field: 'reWorkFlag', title: '复测标记', minWidth: 120, align: 'left' },
          {
            field: 'loadState', title: '载货状态', minWidth: 120, align: 'left',
            template: constParam.formatter.PltLoadState
          },
          { field: 'capacity', title: '电芯数量', minWidth: 120, align: 'left' },

          { field: 'wareId', title: '所在仓库', minWidth: 120, align: 'left', hide: true, query: true,
            queryType: 'select',
            set: true,
            required: true
          },
          { field: 'wareName', title: '所在仓库', minWidth: 120, align: 'left' },
          { field: 'laneId', title: '所在巷道', minWidth: 120, align: 'left', hide: true, query: true,
            queryType: 'select',
            set: true,
            required: true
          },

          { field: 'laneName', title: '所在巷道', minWidth: 120, align: 'left' },
          { field: 'toMatlState', title: '下一状态', minWidth: 120, align: 'left',
            template: constParam.formatter.MatlState
          },
          { field: 'readyTime', title: '到位时间', minWidth: 150, align: 'left' },
          {
            field: 'xx', title: '已用(分钟)', minWidth: 90, align: 'right',
            template: this.usedTime
          },
          { field: 'finishTime', title: '完成时间', minWidth: 150, align: 'left' },
          {
            field: 'remaining', title: '剩余时间', minWidth: 190, align: 'left', fixed: 'right',
            template: this.remainingTime
          }
        ],
        queryParams: {
          requestData: {}
        },
        listLoading: false,
        listQuery: {
          current: 1,
          pageSize: 15
        },
        allLaneInfo: {},
        initSelect: {},
        total: 0,
        list: [],
        labelPosition: 'left',
        loading: false,
        downloadLoading: false,
        filename: '托盘静止时间'
      }
    },
    watch: {
      // 'queryParams.requestData.wareId'(val) {

      //   console.log("---"+val)

      //   if (val!= NaN)
      //     this.initSelect.laneId = this.allLaneInfo.filter(f => f.wareId === val)
      //   else
      //     this.initSelect.laneId = this.allLaneInfo
      //   this.queryParams.requestData.laneId = null

      // }
    },
    created() {
      constParam.finalPara.WareInfos()
      constParam.finalPara.LaneInfo()
      constParam.finalPara.MatlState()
      constParam.finalPara.CodeState()
      constParam.finalPara.MesState()
      constParam.finalPara.TaskPostState()
      constParam.finalPara.LocType()
      constParam.finalPara.PltCarryState()
      constParam.finalPara.PltLoadState()
      this.getList()
    },
    methods: {
      // rowClick(row) {
      //   this.drawer = true
      //   const _data = { url: '/api/PltInfo/GetPltDetails', params: { data: row.pltId } }
      //   this.$store.dispatch('fmsCommon/actionWcsPost', _data)
      //     .then(data => {
      //       this.tableData = data
      //     }).catch(err => {
      //     console.error(err)
      //   })
      // },
      remainingTime(row, column, cellValue, index) {
        if (row.finishTime != null) {
          const finishTime = new Date(row.finishTime)
          const nowTime = new Date()
          const time = finishTime.getTime() - nowTime.getTime()
          const day = Math.ceil(time / (1000 * 60 * 60 * 24))
          const hour = Math.ceil((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const min = Math.ceil(((time % (1000 * 60 * 60 * 24)) % (1000 * 60 * 60)) / (1000 * 60))
          const second = Math.ceil((((time % (1000 * 60 * 60 * 24)) % (1000 * 60 * 60)) % (1000 * 60)) / 1000)
          if (time < 0) {
            return '超出：' + Math.abs(day) + '天' + Math.abs(hour) + '时' + Math.abs(min) + '分' + Math.abs(second) + '秒'
          }
        }
        return cellValue
      },
      usedTime(row, column, cellValue, index) {
        const startTime = new Date(row.readyTime)
        const endTime = new Date()
        return ((endTime.getTime() - startTime.getTime()) / 60000).toFixed(0)
      },
      getData() {
        // return constParam.getData(val)
        this.initSelect.wareId = constParam.getData('WareInfos').map(item => {
          item.id = item.wareId
          item.name = item.wareName
          return item
        })
        this.allLaneInfo = constParam.getData('LaneInfo').map(item => {
          item.id = item.laneId
          item.name = item.laneName
          return item
        })
        this.initSelect.laneId = this.allLaneInfo
        this.initSelect.matlState = constParam.getData('MatlState').map(item => {
          item.id = item.stateNum
          item.name = item.stateName
          return item
        })
      },
      reset() {
        const data = this.queryParams.requestData
        for (const item in data) {
          data[item] = ''
        }
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          // const tHeader = ['Id']
          const tHeader = this.cols.map(c => c.title)
          // const filterVal = ['id']
          const filterVal = this.cols.map(c => c.field)
          const list = this.list
          console.log(list)
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data: data,
            filename: this.filename
          })
        })
        this.downloadLoading = false
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      cellStyle(row) {
        if (row.row.finishTime != null) {
          const finishTime = new Date(row.row.finishTime)
          const nowTime = new Date()
          const time = finishTime.getTime() - nowTime.getTime()
          if (time < 0) {
            return 'color:orange'
          }
        }
      },
      query() {
        this.listQuery.current = 1
        this.getList()
      },
      getList() {
        this.listLoading = true
        Object.assign(this.queryParams, this.listQuery)
        console.log(this.queryParams)
        const _data = { url: '/api/Common/GetInvPltProcTimes', params: this.queryParams }
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
            this.list = data.data
            this.total = data.total
            this.getData()
            this.listLoading = false
          }).catch(err => {
          console.error(err)
        })
      }
    }
  }
</script>
<style>
  .el-drawer.rtl {
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: scroll;
  }
</style>
