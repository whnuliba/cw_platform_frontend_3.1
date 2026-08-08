<template>
  <div class="app-container">
    <el-switch v-model="isDts" style="margin-bottom: 20px" active-color="#13ce66" inactive-color="#ff4949" :active-text="$t('const.time.history')" :inactive-text="$t('const.time.now')" @change="isDtsChange" />
    <div v-if="!isDts" class="filter-container">
      <div v-for="(items, index) in cols" :key="index" style="display: inline">
        <div v-for="(item, index) in items.list" :key="index" style="display: inline">
          <el-input v-if="item.query && item.queryType === 'input'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item" />
          <el-select filterable clearable v-if="item.query && item.queryType === 'select'" v-model="queryParams.requestData[item.field]" :filterable="true" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
            <el-option v-for="item in initSelect[item.field]" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <el-date-picker v-if="item.query && item.queryType === 'datetime'" v-model="queryParams.requestData[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="commonI18n(item)" style="width: 150" class="filter-item" />
          <el-date-picker v-if="item.query && item.queryType === 'date'" v-model="queryParams.requestData[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="date" :placeholder="commonI18n(item)" style="width: 150" class="filter-item" />
        </div>
      </div>
      <el-button type="primary" :style="{ marginLeft: '10px' }" class="filter-item" @click="query()">
        {{ $t('common.btn.query') }}
      </el-button>
      <el-button type="info" class="filter-item" @click="reset">
        {{ $t('common.btn.reset') }}
      </el-button>
      <el-button v-if="!isDts" type="info" :style="{ marginLeft: '10px' }" class="filter-item" @click="Cancel">
        <i class="el-icon-document-delete" />
        {{ $t('taskOperate.canceltask') }}
      </el-button>
      <el-button type="info" class="filter-item" @click="handleDownload">
        {{ $t('table.exports') }}
      </el-button>
      <el-table :data="list" :cell-style="cellStyle" style="width: 100%" @row-dblclick="rowClick" @selection-change="selectionChangeCancel">
        <el-table-column v-for="item in cols" :label="commonI18n(item)" :type="item.type">
          <el-table-column
            v-for="items in item.list"
            v-if="!items.hide"
            :key="items.id"
            :sortable="true"
            :label="commonI18n(items)"
            :prop="items.field"
            :width="items.width"
            :min-width="items.minWidth"
            :align="items.align"
            show-overflow-tooltip
            :formatter="
              items.template == undefined
                ? function (row, column, cellValue, index) {
                  return cellValue
                }
                : items.template
            "
          />
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
    </div>

    <div v-if="isDts" class="filter-container">
      <div v-for="(items, index) in cols" :key="index" style="display: inline">
        <div v-for="(item, index) in items.list" :key="index" style="display: inline">
          <el-input v-if="item.query && item.queryType === 'input'" v-model="queryParamsHis.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item" />
          <el-select v-if="item.query && item.queryType === 'select'" v-model="queryParamsHis.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
            <el-option v-for="item in initSelect[item.field]" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <el-date-picker v-if="item.query && item.queryType === 'datetime'" v-model="queryParamsHis.requestData[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="commonI18n(item)" style="width: 150" class="filter-item" />
          <el-date-picker v-if="item.query && item.queryType === 'date'" v-model="queryParamsHis.requestData[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="date" :placeholder="commonI18n(item)" style="width: 150" class="filter-item" />
        </div>
      </div>
      <el-button type="primary" :style="{ marginLeft: '10px' }" class="filter-item" @click="query()">
        {{ $t('common.btn.query') }}
      </el-button>
      <el-button type="info" class="filter-item" @click="reset">
        {{ $t('common.btn.reset') }}
      </el-button>
      <el-button type="info" class="filter-item" @click="handleDownload">
        {{ $t('table.exports') }}
      </el-button>

      <el-table :data="list" :cell-style="cellStyle" style="width: 100%" @row-dblclick="rowClick">
        <el-table-column v-for="item in cols" v-if="item.title === '选择' ? false : true" :label="commonI18n(item)">
          <el-table-column
            v-for="items in item.list"
            v-if="!items.hide"
            :key="items.id"
            :label="commonI18n(items)"
            :prop="items.field"
            :width="items.width"
            :min-width="items.minWidth"
            :align="items.align"
            show-overflow-tooltip
            :formatter="
              items.template == undefined
                ? function (row, column, cellValue, index) {
                  return cellValue
                }
                : items.template
            "
          />
        </el-table-column>
      </el-table>
      <pagination v-show="totalHis > 0" :total="totalHis" :page.sync="listQueryHis.current" :limit.sync="listQueryHis.pageSize" @pagination="getListHis" />
    </div>

    <el-dialog :title="$t('common.btn.detail')" :visible.sync="dialogFormCurrentTask" width="80%">
      <el-button v-if="!isDts" type="danger" class="filter-item" @click="Finish">
        <i class="el-icon-document-checked" />
        {{ $t('taskOperate.completeForcibly') }}
      </el-button>
      <el-button v-if="!isDts" type="warning" class="filter-item" @click="again">
        <i class="el-icon-refresh-right" />
        {{ $t('taskOperate.postAgain') }}
      </el-button>

      <el-table :data="listDts" :cell-style="cellStyle" style="width: 100%; margin-top: 10px">
        <el-table-column v-for="item in colsDts" :label="commonI18n(item)">
          <el-table-column
            v-for="items in item.list"
            v-if="!items.hide"
            :key="items.id"
            :label="commonI18n(items)"
            :prop="items.field"
            :width="items.width"
            :min-width="items.minWidth"
            :align="items.align"
            show-overflow-tooltip
            :formatter="
              items.template == undefined
                ? function (row, column, cellValue, index) {
                  return cellValue
                }
                : items.template
            "
          />
        </el-table-column>
      </el-table>
      <el-table :data="listGroupDts" :cell-style="cellStyle" style="width: 100%; margin-top: 20px" @selection-change="selectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column v-for="item in colsGroupDts" :label="commonI18n(item)">
          <el-table-column
            v-for="items in item.list"
            v-if="!items.hide"
            :key="items.id"
            :label="commonI18n(items)"
            :prop="items.field"
            :width="items.width"
            :min-width="items.minWidth"
            :align="items.align"
            show-overflow-tooltip
            :formatter="
              items.template == undefined
                ? function (row, column, cellValue, index) {
                  return cellValue
                }
                : items.template
            "
          />
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import constParam from './constParam'
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog'
import i18n from '@/lang'
export default {
  name: 'CurrentTask',
  components: { Pagination },
  directives: { waves, elDragDialog },
  data() {
    return {
      tableData: [],
      textI18n: {
        pleaseSelectOne: { zh: '请选择一条任务！', en: 'Please select one item.' },
        empty: { zh: '空盘', en: 'empty' },
        filled: { zh: '实盘', en: 'filled' }
      },
      cols: [
        {
          title: '选择',
          type: 'selection',
          hide: false
        },
        {
          field: 'taskInfo',
          title: '任务信息',
          list: [
            {
              field: 'taskNum',
              title: '任务号',
              minWidth: 110,
              align: 'center',
              query: true,
              queryType: 'input',
              set: true,
              required: true
            },
            {
              field: 'carryType',
              title: '搬运类型',
              minWidth: 110,
              align: 'center',
              template: constParam.formatter.CarryType,
              query: true,
              queryType: 'select',
              set: true,
              required: true
            },
            {
              field: 'taskState',
              title: '任务状态',
              minWidth: 110,
              align: 'center',
              template: constParam.formatter.TaskState,
              query: true,
              queryType: 'select',
              set: true,
              required: true
            },
            {
              field: 'taskType',
              title: '任务类型',
              minWidth: 110,
              align: 'center',
              query: true,
              queryType: 'select',
              set: true,
              required: true,
              template: constParam.formatter.TaskType
            },
            {
              field: 'roadName',
              title: '搬运路径',
              minWidth: 300,
              align: 'left',
              query: true,
              queryType: 'input',
              set: true,
              required: true
            },
            { field: 'planExecTime', title: '计划时间', minWidth: 150, align: 'center' },
            { field: 'carryPriority', title: '优先级', minWidth: 130, align: 'center' },
            { field: 'isFire', title: '火警', minWidth: 80, align: 'center', template: this.isFireFormatter }
          ]
        },
        {
          title: '托盘信息',
          field: 'pltInfo',
          list: [
            {
              field: 'pltCode',
              title: '托盘条码',
              minWidth: 110,
              align: 'center',
              query: true,
              queryType: 'input',
              set: true,
              required: true
            },
            {
              field: 'pltCateId',
              title: '托盘类型',
              hide: true,
              minWidth: 110,
              align: 'center',
              query: true,
              queryType: 'select',
              set: true,
              required: true
            },
            {
              field: 'lotNo',
              title: '批次',
              minWidth: 110,
              align: 'center',
              query: true,
              queryType: 'input'
            },
            {
              field: 'pltCateName',
              title: '托盘类型',
              minWidth: 150,
              align: 'center'
            },
            { field: 'matlCateName', title: '物料类别', minWidth: 150, align: 'center' },
            {
              field: 'containerCtrlCode',
              title: '托盘组号',
              minWidth: 80,
              align: 'center',
              query: true,
              queryType: 'input',
              set: true,
              required: true
            },
            {
              field: 'isNullPlt',
              title: '是否空盘',
              minWidth: 100,
              align: 'center',
              template: this.isNullPltFormatter,
              query: true,
              queryType: 'select',
              set: true,
              required: true
            }
          ]
        },
        {
          title: '起始位置',
          field: 'fromLoc',
          list: [
            {
              field: 'fromLocType',
              title: '起始位置类型',
              minWidth: 100,
              align: 'center',
              template: constParam.formatter.LocType,
              query: true,
              queryType: 'select',
              set: true,
              required: true
            },
            {
              field: 'fromLocName',
              title: '起始位置名称',
              minWidth: 120,
              align: 'left',
              query: false,
              queryType: 'input',
              set: true,
              required: true
            },
            {
              field: 'fromLocId',
              title: '起始位置',
              hide: true,
              minWidth: 120,
              align: 'left',
              query: true,
              queryType: 'select',
              set: true,
              required: true
            },
            { field: 'fromCtrlCode', title: '调度号', minWidth: 90, align: 'center' },
            {
              field: 'fromMatlState',
              title: '起始电池状态',
              minWidth: 140,
              align: 'center',
              template: constParam.formatter.MatlState,
              query: true,
              queryType: 'select',
              set: true,
              required: true
            },
            {
              field: 'fromCodeState',
              title: '扫码状态',
              minWidth: 100,
              align: 'center',
              template: constParam.formatter.CodeState
            },
            {
              field: 'fromMesState',
              title: '接口状态',
              minWidth: 100,
              align: 'center',
              template: constParam.formatter.MesState
            },
            {
              field: 'fromDirState',
              title: '托盘方向',
              minWidth: 100,
              align: 'center',
              template: constParam.formatter.DirState
            },
            // { field: 'x', title: '站台组', minWidth: 60, align: 'center' },
            { field: 'fromBoxCode', title: '箱号', minWidth: 60, align: 'center' },
            { field: 'fromUseFork', title: '货叉', minWidth: 60, align: 'center' }
          ]
        },
        {
          title: '目标位置',
          field: 'toLoc',
          list: [
            {
              field: 'toLocType',
              title: '目标位置类型',
              minWidth: 100,
              align: 'center',
              template: constParam.formatter.LocType,
              query: true,
              queryType: 'select',
              set: true,
              required: true
            },
            {
              field: 'toLocName',
              title: '目标位置名称',
              minWidth: 150,
              align: 'left',
              query: false,
              queryType: 'input',
              set: true,
              required: true
            },
            {
              field: 'toLocId',
              title: '目标位置',
              hide: true,
              minWidth: 150,
              align: 'left',
              query: true,
              queryType: 'select',
              set: true,
              required: true
            },
            { field: 'toCtrlCode', title: '调度号', minWidth: 90, align: 'center' },
            {
              field: 'toMatlState',
              title: '目标电池状态',
              minWidth: 140,
              align: 'center',
              template: constParam.formatter.MatlState,
              query: true,
              queryType: 'select',
              set: true,
              required: true
            },
            {
              field: 'toCodeState',
              title: '扫码状态',
              minWidth: 100,
              align: 'center',
              template: constParam.formatter.CodeState
            },
            {
              field: 'toMesState',
              title: '接口状态',
              minWidth: 100,
              align: 'center',
              template: constParam.formatter.MesState
            },
            {
              field: 'toDirState',
              title: '托盘方向',
              minWidth: 100,
              align: 'center',
              template: constParam.formatter.DirState
            },
            // { field: 'x', title: '站台组', minWidth: 60, align: 'center' },
            { field: 'toBoxCode', title: '箱号', minWidth: 60, align: 'center' },
            { field: 'toUseFork', title: '货叉', minWidth: 60, align: 'center' }
          ]
        },
        {
          title: '执行信息',
          field: 'execInfo',
          list: [
            {
              field: 'postState',
              title: '下达状态',
              minWidth: 100,
              align: 'center',
              template: constParam.formatter.TaskPostState,
              query: true,
              queryType: 'select',
              set: true,
              required: true
            },
            { field: 'postCount', title: '下达次数', minWidth: 100, align: 'center' },
            {
              field: 'execState',
              title: '执行状态',
              minWidth: 100,
              align: 'center',
              template: constParam.formatter.TaskExecState,
              query: true,
              queryType: 'select',
              set: true,
              required: true
            },
            { field: 'createTime', title: '创建时间', minWidth: 150, align: 'center' },
            { field: 'postTime', title: '下达时间', minWidth: 150, align: 'center' },
            { field: 'finishTime', title: '完成时间', minWidth: 150, align: 'center' },
            { field: 'StartCreateTime', title: '创建开始时间', hide: true, query: true, queryType: 'datetime', minWidth: 150, align: 'center' },
            { field: 'EndCreateTime', title: '创建结束时间', hide: true, query: true, queryType: 'datetime', minWidth: 150, align: 'center' }
          ]
        }
      ],
      colsGroupDts: [
        {
          title: '子任务信息',
          field: 'childTaskInfo',
          list: [
            {
              field: 'taskNum',
              title: '任务号',
              minWidth: 100,
              align: 'center'
            },
            {
              field: 'carryType',
              title: '搬运类型',
              minWidth: 150,
              align: 'center',
              template: constParam.formatter.CarryType
            },
            {
              field: 'taskState',
              title: '任务状态',
              minWidth: 100,
              align: 'center',
              template: constParam.formatter.TaskState
            },
            { field: 'createTime', title: '计划时间', minWidth: 150, align: 'center' },
            { field: 'carryPriority', title: '优先级', minWidth: 60, align: 'center' },
            { field: 'isFire', title: '火警', minWidth: 60, align: 'center', template: this.isFireFormatter },
            { field: 'cmdCode', title: '使用货叉', minWidth: 100, align: 'center' }
          ]
        },
        // {
        //   title: '货叉1',
        //   field: 'fork1',
        //   list: [
        //     {
        //       field: 'fork1PltCode', title: '托盘条码', minWidth: 110, align: 'center'
        //     },
        //     {
        //       field: 'fork1StateAfter', title: '执行前', minWidth: 110, align: 'center',
        //       template: constParam.formatter.ForkState
        //     },
        //     {
        //       field: 'fork1StateBefore', title: '执行后', minWidth: 80, align: 'center',
        //       template: constParam.formatter.ForkState
        //     }
        //   ]
        // },
        // {
        //   title: '货叉2',
        //   field: 'fork2',
        //   list: [
        //     {
        //       field: 'fork2PltCode', title: '托盘条码', minWidth: 110, align: 'center'
        //     },
        //     {
        //       field: 'fork2StateAfter', title: '执行前', minWidth: 110, align: 'center',
        //       template: constParam.formatter.ForkState
        //     },
        //     {
        //       field: 'fork2StateBefore', title: '执行后', minWidth: 80, align: 'center',
        //       template: constParam.formatter.ForkState
        //     }
        //   ]
        // },
        {
          title: '取货位置',
          field: 'fromLoc',
          list: [
            {
              field: 'fromLocType',
              title: '位置类型',
              minWidth: 110,
              align: 'center',
              template: constParam.formatter.LocType
            },
            {
              field: 'fromCtrlCode',
              title: '调度号',
              minWidth: 110,
              align: 'center'
            }
          ]
        },
        {
          title: '放货位置',
          field: 'toLoc',
          list: [
            {
              field: 'toLocType',
              title: '位置类型',
              minWidth: 110,
              align: 'center',
              template: constParam.formatter.LocType
            },
            {
              field: 'toCtrlCode',
              title: '调度号',
              minWidth: 110,
              align: 'center'
            }
          ]
        },
        {
          title: '执行信息',
          field: 'execInfo',
          list: [
            {
              field: 'postState',
              title: '下达状态',
              minWidth: 110,
              align: 'center',
              template: constParam.formatter.TaskPostState
            },
            {
              field: 'postCount',
              title: '下达次数',
              minWidth: 110,
              align: 'center'
            },
            {
              field: 'execState',
              title: '执行状态',
              minWidth: 110,
              align: 'center',
              template: constParam.formatter.TaskExecState
            },
            {
              field: 'createTime',
              title: '创建时间',
              minWidth: 150,
              align: 'center'
            },
            {
              field: 'postTime',
              title: '下达时间',
              minWidth: 150,
              align: 'center'
            },
            {
              field: 'finishTime',
              title: '完成时间',
              minWidth: 150,
              align: 'center'
            }
          ]
        }
      ],
      colsDts: [
        {
          title: '任务信息',
          field: 'taskInfo',
          list: [
            {
              field: 'taskNum',
              title: '任务号',
              minWidth: 60,
              align: 'center'
            },
            {
              field: 'carryType',
              title: '搬运类型',
              minWidth: 100,
              align: 'center',
              template: constParam.formatter.CarryType
            },
            {
              field: 'taskState',
              title: '任务状态',
              minWidth: 100,
              align: 'center',
              template: constParam.formatter.TaskState
            },
            { field: 'planExecTime', title: '计划时间', minWidth: 150, align: 'center' },
            { field: 'carryPriority', title: '优先级', minWidth: 60, align: 'center' },
            { field: 'isFire', title: '火警', minWidth: 60, align: 'center', template: this.isFireFormatter }
          ]
        },
        {
          title: '托盘信息',
          field: 'pltInfo',
          list: [
            {
              field: 'pltCode',
              title: '托盘条码',
              minWidth: 110,
              align: 'center'
            },
            {
              field: 'containerCtrlCode',
              title: '托盘组号',
              minWidth: 80,
              align: 'center'
            }
          ]
        },
        {
          title: '起始位置',
          field: 'fromLoc',
          list: [
            {
              field: 'fromLocName',
              title: '起始位置名称',
              minWidth: 180,
              align: 'left'
            },
            { field: 'fromCtrlCode', title: '调度号', minWidth: 100, align: 'right' },
            {
              field: 'fromMatlState',
              title: '起始电池状态',
              minWidth: 100,
              align: 'center',
              template: constParam.formatter.MatlState
            },
            { field: 'fromUseFork', title: '货叉', minWidth: 60, align: 'center' }
          ]
        },
        {
          title: '目标位置',
          field: 'toLoc',
          list: [
            {
              field: 'toLocName',
              title: '位置名称',
              minWidth: 150,
              align: 'left'
            },
            { field: 'toCtrlCode', title: '调度号', minWidth: 100, align: 'right' },
            {
              field: 'toMatlState',
              title: '目标电池状态',
              minWidth: 100,
              align: 'center',
              template: constParam.formatter.MatlState
            },
            { field: 'toUseFork', title: '货叉', minWidth: 60, align: 'center' }
          ]
        },
        {
          title: '执行信息',
          field: 'execInfo',
          list: [
            {
              field: 'postState',
              title: '下达状态',
              minWidth: 100,
              align: 'center',
              template: constParam.formatter.TaskPostState
            },
            { field: 'postCount', title: '下达次数', minWidth: 100, align: 'center' },
            {
              field: 'execState',
              title: '执行状态',
              minWidth: 100,
              align: 'center',
              template: constParam.formatter.TaskExecState
            },
            { field: 'postTime', title: '下达时间', minWidth: 150, align: 'center' },
            { field: 'finishTime', title: '完成时间', minWidth: 150, align: 'center' }
          ]
        }
      ],
      queryParams: {
        requestData: {}
      },
      queryParamsHis: {
        requestData: {}
      },
      initSelect: {},
      listLoading: true,
      dialogFormCurrentTask: false,
      listQuery: {
        current: 1,
        pageSize: 15
      },
      listQueryHis: {
        current: 1,
        pageSize: 15
      },
      total: 0,
      totalHis: 0,
      list: [],
      listDts: [],
      listGroupDts: [],
      labelPosition: 'left',
      isDts: false,
      selectionChangeArray: [],
      selectionChangeCancelArray: [],
      downloadLoading: false,
      filename: '托盘搬运任务',
      isNullPlt: [
        { name: '是', id: 1 },
        { name: '否', id: 0 }
      ]
    }
  },
  created() {
    constParam.finalPara.TaskState()
    constParam.finalPara.CarryType()
    constParam.finalPara.TaskType()
    constParam.finalPara.LocType()
    constParam.finalPara.MatlState()
    constParam.finalPara.CodeState()
    constParam.finalPara.MesState()
    constParam.finalPara.DirState()
    constParam.finalPara.TaskPostState()
    constParam.finalPara.TaskExecState()
    constParam.finalPara.PltCate()
    constParam.finalPara.ForkState()
    constParam.finalPara.LocInfo()
    this.getList()
  },

  methods: {
    translateText(type) {
      return this.textI18n[type][this.$store.state.app.language]
    },
    isNullPltFormatter(row, column, cellValue, index) {
      return cellValue ? this.translateText('empty') : this.translateText('filled')
    },
    isFireFormatter(row, column, cellValue, index) {
      return cellValue ? this.$t('const.yesNo.yes') : this.$t('const.yesNo.no')
    },
    isDtsChange(value) {
      if (value) {
        if (Object.keys(this.queryParamsHis.requestData).length == 0) {
          this.list = null
          this.totalHis = 0
        } else this.getListHis()
      } else {
        this.getList()
      }
    },
    getData() {
      this.initSelect.carryType = constParam.getData('CarryType')
      this.initSelect.taskState = constParam.getData('TaskState')
      this.initSelect.taskType = constParam.getData('TaskType')
      this.initSelect.pltCateId = constParam.getData('PltCate').map((item) => {
        item.id = item.pltCateId
        item.name = item.pltCateName
        return item
      })
      this.initSelect.fromLocType = constParam.getData('LocType')

      this.initSelect.isNullPlt = this.isNullPlt
      this.initSelect.toLocType = constParam.getData('LocType')

      this.initSelect.fromLocId = constParam.getData('LocInfo').map((item) => {
        item.id = item.locId
        item.name = item.locName
        return item
      })

      this.initSelect.toLocId = constParam.getData('LocInfo').map((item) => {
        item.id = item.locId
        item.name = item.locName
        return item
      })
      this.initSelect.fromMatlState = constParam.getData('MatlState').map((item) => {
        item.id = item.stateNum
        item.name = item.stateName
        return item
      })
      this.initSelect.toMatlState = constParam.getData('MatlState').map((item) => {
        item.id = item.stateNum
        item.name = item.stateName
        return item
      })
      this.initSelect.postState = constParam.getData('TaskPostState')
      this.initSelect.execState = constParam.getData('TaskExecState')
    },
    reset() {
      if (this.isDts) {
        const data = this.queryParamsHis.requestData
        for (const item in data) {
          data[item] = ''
        }
      } else {
        const data = this.queryParams.requestData
        for (const item in data) {
          data[item] = ''
        }
      }
    },
    query() {
      if (this.isDts) {
        this.listQueryHis.current = 1
        this.getListHis()
      } else {
        this.listQuery.current = 1
        this.getList()
      }
    },
    getList() {
      this.listLoading = true
      Object.assign(this.queryParams, this.listQuery)
      const _data = { url: '/api/CarryTask/GetCurrentTask', params: this.queryParams }
      this.$store
        .dispatch('fmsCommon/actionWcsPost', _data)
        .then((data) => {
          this.list = data.data
          this.total = data.total
          this.getData()
          this.autoWidth()
          this.listLoading = false
        })
        .catch((err) => {
          console.error(err)
        })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        var tHeader = []
        var filterVal = []
        this.cols.forEach((col1) => {
          if (col1.title === '选择') return
          const tHeader1 = col1.list.map((c) => c.title)
          const filterVal1 = col1.list.map((c) => c.field)
          tHeader = [...tHeader, ...tHeader1]
          filterVal = [...filterVal, ...filterVal1]
        })
        const list = this.list
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
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    getListHis() {
      this.listLoading = true
      Object.assign(this.queryParamsHis, this.listQueryHis)
      const _data = { url: '/api/CarryTask/GetHistoryTask', params: this.queryParamsHis }
      this.$store
        .dispatch('fmsCommon/actionWcsPost', _data)
        .then((data) => {
          this.list = data.data
          this.totalHis = data.total
          this.listLoading = false
          this.getData()
          this.autoWidth()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    autoWidth() {
      // 获取当页所有数据
      this.cols.forEach((col1) => {
        if (col1.title === '选择') return
        // 获取每一列数据的最大长度
        // 输入框
        col1.list.forEach((col) => {
          if (col.hide) return
          if (col.queryType === 'input') {
            col.innerLen = 0
            this.list.forEach((item) => {
              if (item[col.field] !== null && item[col.field].length > col.innerLen) col.innerLen = item[col.field].length
            })
          }
          // 下拉框
          else if (col.queryType === 'select') {
            col.innerLen = 0
            this.list.forEach((item) => {
              var stores = this.initSelect[col.field]
              var label = stores.filter((f) => f.value === item[col.field])
              if (label[0] != undefined && label[0].label.length > col.innerLen) col.innerLen = label[0].label.length
            })
          }
          if (col.innerLen < col.title.length) col.innerLen = col.title.length + 2 // +2是为了排序的宽度
          // 制定字符长度和宽度的比例 基础宽度48 比率 1:10
          // cols的minWidth赋值
          if (col.innerLen != undefined && col.innerLen != 0) col.minWidth = 48 + col.innerLen * 8
        })
      })
    },
    cellStyle(row) {
      if (row.row.postState == 1) {
        return 'color:blue'
      }
      if (row.row.postState == 0) {
        return 'color:orange'
      }
      if (row.row.taskstate == 1) {
        return 'color:red'
      }
    },
    rowClick(row, column, event) {
      this.dialogFormCurrentTask = true
      if (this.isDts) {
        this.getTaskByGroupId(row.taskGroupId, 'GetHistoryTask')
        this.getTaskDtsByGroupId(row.taskGroupId, 'GetHistoryTaskDetail')
      } else {
        this.getTaskByGroupId(row.taskGroupId, 'GetCurrentTask')
        this.getTaskDtsByGroupId(row.taskGroupId, 'GetCurrentTaskDetail')
      }
    },
    getTaskByGroupId(id, url) {
      this.listLoading = true
      const data = { requestData: { taskGroupId: id }}
      Object.assign(data, this.listQuery)
      data.current = 1
      const _data = { url: '/api/CarryTask/' + url, params: data }
      this.$store
        .dispatch('fmsCommon/actionWcsPost', _data)
        .then((data) => {
          this.listDts = data.data
          this.listLoading = false
          this.autoWidth()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    getTaskDtsByGroupId(id, url) {
      this.listLoading = true
      const _data = { url: '/api/CarryTask/' + url, params: { data: id }}
      this.$store
        .dispatch('fmsCommon/actionWcsPost', _data)
        .then((data) => {
          this.listGroupDts = data
          this.listLoading = false
          this.autoWidth()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    again() {
      const data = this.selectionChangeArray
      if (data.length != 1) {
        this.$message.error(this.translateText('pleaseSelectOne'))
        return false
      }
      const taskGroupId = data[0].taskGroupId
      this.$confirm(i18n.t('common.tip_info.common_info'), i18n.t('common.tip_info.tips'), {
        confirmButtonText: i18n.t('common.btn.ok'),
        cancelButtonText: i18n.t('common.btn.cancel'),
        type: 'warning'
      })
        .then(() => {
          const _data = { url: '/api/CarryTask/RePostTaskDetail', params: { data: data[0].id }}
          this.$store
            .dispatch('fmsCommon/actionWcsPost', _data)
            .then((data) => {
              this.$message.success(this.$t('common.btn.operateSuccess'))
              this.query()
              this.getTaskDtsByGroupId(taskGroupId, 'GetCurrentTaskDetail')
            })
            .catch((err) => {
              console.error(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common.btn.Cancelled')
          })
        })
    },
    Cancel() {
      const data = this.selectionChangeCancelArray
      if (data.length != 1) {
        this.$message.error(this.translateText('pleaseSelectOne'))
        return false
      }

      this.$confirm(i18n.t('common.tip_info.common_info'), i18n.t('common.tip_info.tips'), {
        confirmButtonText: i18n.t('common.btn.ok'),
        cancelButtonText: i18n.t('common.btn.cancel'),
        type: 'warning'
      })
        .then(() => {
          const _data = { url: '/api/CarryTask/CancelCarryTask', params: { data: data[0].taskGroupId }}
          this.$store
            .dispatch('fmsCommon/actionWcsPost', _data)
            .then((data) => {
              this.$message.success(this.$t('common.btn.operateSuccess'))
              this.query()
            })
            .catch((err) => {
              console.error(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common.btn.Cancelled')
          })
        })
    },
    Finish() {
      const data = this.selectionChangeArray
      if (data.length != 1) {
        this.$message.error(this.translateText('pleaseSelectOne'))
        return false
      }
      const taskGroupId = data[0].taskGroupId
      this.$confirm(i18n.t('common.tip_info.common_info'), i18n.t('common.tip_info.tips'), {
        confirmButtonText: i18n.t('common.btn.ok'),
        cancelButtonText: i18n.t('common.btn.cancel'),
        type: 'warning'
      })
        .then(() => {
          const _data = { url: '/api/CarryTask/FinishTaskDetail', params: { data: data[0].id }}
          this.$store
            .dispatch('fmsCommon/actionWcsPost', _data)
            .then((data1) => {
              this.$message.success(this.$t('common.btn.operateSuccess'))
              this.query()

              // 双叉任务有多条子任务，强制完成后刷新列表数据。如果只有一笔子任务关闭弹窗
              if (this.listGroupDts.length > 1) {
                this.getTaskByGroupId(taskGroupId, 'GetCurrentTask')
                this.getTaskDtsByGroupId(taskGroupId, 'GetCurrentTaskDetail')
              } else {
                this.dialogFormCurrentTask = false
              }
            })
            .catch((err) => {
              console.error(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common.btn.Cancelled')
          })
        })
    },
    selectionChange(val) {
      this.selectionChangeArray = val
    },
    selectionChangeCancel(val) {
      this.selectionChangeCancelArray = val
    }
  }
}
</script>
