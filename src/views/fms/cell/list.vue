/*
*  create: 宋丹峰
*  生产信息 - 电芯信息
*  update: (...)
*/
<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item,index) in cols" :key="index" style="display:inline" class="cellbarcode-style">
        <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]"
                  :placeholder="item.title" :style="{width: item.field === 'cellBarCode'? '180px': '120px'}" class="filter-item">
                   <!-- @dblclick.native="item.field === 'cellBarCode'? inputClick() : ''" -->
                   <i slot="suffix"
                   :class="item.field === 'cellBarCode'? 'el-input__icon el-icon-search': 'xxx'"
                   @click="item.field === 'cellBarCode'? inputClick() : ''" title='点击弹出批量搜索弹窗'/>
          <!-- {{queryParams.requestData[item.field]=''}} -->
        </el-input>
        <el-select v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]"
                 filterable :placeholder="item.title" style="width: 120px" class="filter-item">
          <el-option v-for="item in initSelect[item.field]"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>

        <el-date-picker
          class="filter-item"
          v-if="item.query && item.queryType==='date'"
          v-model="queryParams.requestData[item.field]"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          align="right">
        </el-date-picker>


      </div>
      <el-button type="primary" class="filter-item" @click="query()">
        {{ $t("common.btn.query") }}
      </el-button>
      <el-button type="info" class="filter-item" @click="reset">
        {{ $t("common.btn.reset") }}
      </el-button>
      <el-button type="primary" class="filter-item" @click="add">
        {{ $t("common.btn.add") }}
      </el-button>
      <el-button type="primary" class="filter-item" @click="deleteCell">
        {{ $t("common.btn.scrap") }}
      </el-button>
      <el-button type="primary" class="filter-item" @click="filterCell">
        {{ $t("common.btn.intercept") }}
      </el-button>
      <el-button type="primary" class="filter-item" @click="cancelCell">
        {{ $t("common.btn.cancelIntercept") }}
      </el-button>

      <el-button type="primary" class="filter-item" @click="markOk">
        {{ $t("common.btn.markOK") }}
      </el-button>
      <el-button type="primary" class="filter-item" @click="markNg">
        {{ $t("common.btn.markNG") }}
      </el-button>


      <el-button type="warning" class="filter-item" @click="batchStateUpdate">
        {{ $t("common.btn.batchStateUpdate") }}
      </el-button>

      <el-button type="warning" class="filter-item" @click="batchProcessCodeUpdate">
        {{ $t("common.btn.batchProcessCodeUpdate") }}
      </el-button>
      <!-- <el-button type="danger" class="filter-item" @click="ProcessStatusUpdate">
        {{ '工艺状态变更' }}
      </el-button> -->

      <el-button type="warning" class="filter-item" @click="batchGradeUpdate">
        {{ $t("common.btn.batchGradeUpdate") }}
      </el-button>
      <!-- <el-button type="warning"   v-ele-show="{btnCode:'ADD_LINE_INFO'}"   class="filter-item" @click="add" >
        {{ $t("common.btn.add") }}
    </el-button> -->
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row style="width: 100%"
      @selection-change="handleSelectionChange"
    >

      <el-table-column
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column min-width="50px" label="序号" align="center" fixed="left">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column v-for="(item) in cols" :key="item.id" :label="item.title" :prop="item.field" :width="item.width"
                       :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{commonFilter(row[item.field],item.field)}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" width="370">

        <template slot="header" slot-scope="scope">
          {{$t('common.oper')}} <i style="margin-left: 10px;cursor:pointer;" class="el-icon-bank-card"
                                   @click="selectFields"></i>
        </template>
        <template slot-scope="scope">
          <!-- 下拉按钮 -->
          <!-- <el-dropdown @command="dropBtnClick">
            <span class="el-dropdown-link">
              ...
            </span>
            <el-dropdown-menu slot="dropdown" >
              <el-dropdown-item  :command="{row:scope.row,num:1}">{{ $t("common.btn.flowDts") }}</el-dropdown-item>
              <el-dropdown-item  :command="{row:scope.row,num:2}"> {{ $t("common.btn.changCellProc") }}</el-dropdown-item>
              <el-dropdown-item  v-if="scope.row.trayNo!='' && scope.row.trayNo!=null"
                     v-ele-show="{btnCode:'CELL_SINGLE_SPLIT'}" icon="el-icon-edit" @click="unbind(scope.row)" :command="{row:scope.row,num:3}">
                     {{ $t("common.btn.unbind") }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->

          <!-- 直接展示按钮 -->
          <el-button type="primary" size="small" @click="flowDts(scope.row)">
            {{ $t("common.btn.flowDts") }}
          </el-button>

          <el-button type="warning" v-ele-show="{btnCode:'UPDATE_CELL_STATE'}" size="small"
                     @click="changCellState(scope.row)">
            {{ $t("common.btn.changCellState") }}
          </el-button>&nbsp;

          <el-button type="warning" v-ele-show="{btnCode:'UPDATE_PROCESS_CELL'}" size="small"
                     @click="openChangeProcDialog(scope.row)">
            {{ $t("common.btn.changCellProc") }}
          </el-button>

          <el-button type="primary" size="small" v-if="scope.row.trayNo!='' && scope.row.trayNo!=null"
                     v-ele-show="{btnCode:'CELL_SINGLE_SPLIT'}" @click="unbind(scope.row)">
            {{ $t("common.btn.unbind") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>
    <!-- 电芯条码textArea批量输入弹窗 -->
    <FormIndex
      ref='inputDialog'
      :modalTitle="'电芯条码批量查询'"
      :formColumns='formColumns'
      :textareaWidth="'350px'"
      :modalTemp="modalTemp"
      :placeholderText="'输入内容请用逗号分隔开'"
      @testOnFinish="testOnFinish"
    />
    <!--单电池修改工序-->
    <el-dialog title="编辑" v-el-drag-dialog :visible.sync="dialogChangeProcessFormVisible" width="600px">
      <el-form ref="form" :model="changeProcess" label-width="80px">
        <el-select v-model="changeProcess.processId" @change="$forceUpdate()" filterable placeholder="请选择">
          <el-option v-for="item in initSelect.processId"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChangeProcessFormVisible = false"> {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" @click="changCellProc()"> {{ $t("common.btn.save") }}</el-button>
      </div>
    </el-dialog>

<!--批量修改工序-->
    <el-dialog title="批量工序修改" v-el-drag-dialog :visible.sync="cellUpdateProcessBatch" width="600px">
      <el-form ref="form" :model="changeProcess" label-width="80px">
        <el-select v-model="changeProcess.processId" @change="$forceUpdate()" filterable placeholder="请选择">
          <el-option v-for="item in initSelect.processId"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cellUpdateProcessBatch = false"> {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" @click="changCellProcessBatch()"> {{ $t("common.btn.save") }}</el-button>
      </div>
    </el-dialog>



    <!--批量修改等级-->
    <el-dialog title="批量等级修改" v-el-drag-dialog :visible.sync="cellUpdateGradeBatch" width="600px">
      <el-form ref="form" :model="changeProcess" label-width="80px">
        <el-select v-model="changeProcess.processId" @change="$forceUpdate()" filterable placeholder="请选择">
          <el-option v-for="item in initSelect.gradeSelect"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cellUpdateGradeBatch = false"> {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" @click="changCellGradeBatch()"> {{ $t("common.btn.save") }}</el-button>
      </div>
    </el-dialog>


    <!--显示明细-->
    <el-dialog :title="'['+cellBarcode+']明细'" v-el-drag-dialog :visible.sync="flowDetailsVisible"
               custom-class="modal-class">
      <component :is="dtsOfswitch" ref="flowDetailsList"
                 :dtlTableList="dtlTableList"
                 :dtlLoading='dtlLoading'
      />
      <!-- :flowDetailsList="flowDetailsList" -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="flowDetailsVisible = false"> {{ $t("common.btn.cancel") }}</el-button>
      </div>
    </el-dialog>


    <el-dialog title="新增" v-el-drag-dialog :visible.sync="dialogAddCellFormVisible" width="700px">

      <el-form :inline="true" ref="form" :model="changeProcess" label-width="80px">

        <el-form-item :label="commonI18n(cols[4])">
          <el-input v-model="addParam.lotNo" :placeholder="commonI18n(cols[4])" suffix-icon="xxx"></el-input>
        </el-form-item>

        <el-form-item label="电芯类型">
          <el-select @change="initProcessId" v-model="addParam.cellTypeId" placeholder="电芯类型">
            <el-option
              v-for="item in initSelectAdd.cellTypeId"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="commonI18n(cols[2])">
          <el-select v-model="addParam.lineId" :placeholder="commonI18n(cols[2])">
            <el-option
              v-for="item in initSelectAdd.lineId"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="commonI18n(cols[3])">
          <el-select v-model="addParam.orderId" :placeholder="commonI18n(cols[3])">
            <el-option
              v-for="item in initSelectAdd.orderId"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="commonI18n(cols[0])">
              <el-input type="textarea" v-model="addParam.cellBarCode" :placeholder="commonI18n(cols[0])" suffix-icon="xxx"  style="width:203.4px"></el-input>
        </el-form-item>


        <el-form-item :label="commonI18n(cols[7])">
          <el-select v-model="addParam.processId" :placeholder="commonI18n(cols[7])">
            <el-option
              v-for="item in initSelectAdd.processId"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="commonI18n(cols[1])">
          <el-select v-model="addParam.cellState" :placeholder="commonI18n(cols[1])">
            <el-option
              v-for="item in initSelectAdd.cellState"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="commonI18n(cols[17])">
          <el-input v-model="addParam.firstInjectWeight" :placeholder="commonI18n(cols[17])" suffix-icon="xxx"></el-input>
        </el-form-item>

        <el-form-item :label="commonI18n(cols[18])">
          <el-input v-model="addParam.firstBeforeWeight" :placeholder="commonI18n(cols[18])" suffix-icon="xxx"></el-input>
        </el-form-item>

        <el-form-item :label="commonI18n(cols[19])">
          <el-input v-model="addParam.firstAfterWeight" :placeholder="commonI18n(cols[19])" suffix-icon="xxx"></el-input>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddCellFormVisible = false"> {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" @click="addCell()"> {{ $t("common.btn.save") }}</el-button>
      </div>


    </el-dialog>


    <el-dialog title="作废" v-el-drag-dialog :visible.sync="dialogDeleteCellFormVisible" width="700px">

      <el-form ref="form" :model="changeProcess" label-width="80px">
        <el-form-item :label="commonI18n(cols[0])">
          <el-input type="textarea" v-model="deleteParam.cellBarCode" placeholder="电芯作废(多个电芯逗号隔开(,))"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDeleteCellFormVisible = false"> {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" @click="deleteCellRequest()"> {{ $t("common.btn.save") }}</el-button>
      </div>

    </el-dialog>


    <el-dialog title="拦截" v-el-drag-dialog :visible.sync="dialogFilterCellFormVisible" width="700px">


      <el-form ref="form" :model="changeProcess" label-width="80px">

        <el-form-item label="工序">
          <el-select v-model="filterParam.stopProcessId" placeholder="工序">
            <el-option v-for="item in filterSelect.processId"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="commonI18n(cols[0])">
          <el-input type="textarea" v-model="filterParam.cellBarCode" placeholder="请输入电芯条码,多个分号隔开！"></el-input>
        </el-form-item>

        <el-form-item label="拦截原因">
          <el-input type="textarea" v-model="filterParam.reason" placeholder="拦截原因"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFilterCellFormVisible = false"> {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" @click="filterCellRequest()"> {{ $t("common.btn.save") }}</el-button>
      </div>

    </el-dialog>


    <el-dialog title="取消" v-el-drag-dialog :visible.sync="dialogCancelCellFormVisible" width="700px">

      <el-form ref="form" :model="changeProcess" label-width="80px">
        <el-form-item :label="commonI18n(cols[0])">
          <el-input type="textarea" v-model="cancelParam.cellBarCode" placeholder="请输入电芯条码,多个分号(;)隔开！"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCancelCellFormVisible = false"> {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" @click="cancelCellRequest()"> {{ $t("common.btn.save") }}</el-button>
      </div>

    </el-dialog>


    <el-dialog title="标记" v-el-drag-dialog :visible.sync="markOkVisible" width="700px">

      <el-form ref="form" :model="changeProcess" label-width="80px">
        <el-form-item :label="commonI18n(cols[0])">
          <el-input type="textarea" v-model="filterParam.cellBarCode" placeholder="请输入电芯条码,多个分号(;)隔开！"></el-input>
        </el-form-item>
        <el-form-item label="标记原因">
          <el-input type="textarea" v-model="filterParam.reason" placeholder="标记原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="markOkVisible = false"> {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" @click="markOkSave()"> {{ $t("common.btn.save") }}</el-button>
      </div>
    </el-dialog>


    <el-dialog title="取消标记" v-el-drag-dialog :visible.sync="markNgVisible" width="700px">

      <el-form ref="form" :model="changeProcess" label-width="80px">
        <el-form-item :label="commonI18n(cols[0])">
          <el-input type="textarea" v-model="cancelParam.cellBarCode" placeholder="请输入电芯条码,多个分号(;)隔开！"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="markNgVisible = false"> {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" @click="markNgSave()"> {{ $t("common.btn.save") }}</el-button>
      </div>
    </el-dialog>


    <el-dialog title="字段选择" v-el-drag-dialog :visible.sync="dialogSelectFieldVisible" width="700px">
      <el-form ref="exportColumn" :inline="true" :model="selectColumn" label-width="80px">

        <template>
          <el-transfer v-model="selectColumn.fields"
                       :titles="['源字段', '目标字段']"
                       :data="selectColumn.colMap"></el-transfer>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveSelectField()"> {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import waves from "@/directive/waves"; // waves directive
  import elDragDialog from "@/directive/el-drag-dialog";
  import flowDetailsList from './components/flow-details'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import FormIndex from '@/components/modal/formIndex'
  import i18n from '@/lang';
  // import {monent} from 'vue-moment';

  export default {
    name: 'CellList',
    components: {Pagination, flowDetailsList, FormIndex},
    directives: {waves, elDragDialog},
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
        /**新增变量*/
        batchStateUpdateAndProcessCodeUpdate:[],
        formColumns: [
          {
            title: '电芯条码',
            key:'cellBarCode',
            type: 'textarea'
          }
        ],
        modalTemp: {
          cellBarCode: ''
        },
        dtlLoading: true,
        dtlTableList: [],
        markOkVisible: false,
        markNgVisible: false,
        dialogFormVisible: false,
        dialogChangeProcessFormVisible: false,
        cellUpdateProcessBatch: false,
        cellUpdateGradeBatch: false,
        flowDetailsVisible: false,
        dialogAddCellFormVisible: false,
        dialogDeleteCellFormVisible: false,
        dialogFilterCellFormVisible: false,
        dialogCancelCellFormVisible: false,
        // flowDetailsList: '',
        cellBarcode: '',
        dtsOfswitch: 'flowDetailsList',
        queryParams: {
          requestData: {
            lotNo: '',
            processId: '',
            orderNo: '',
            lineNo: '',
            allTime: '',
            trayNo: ''
          }
        },
        deleteParam: {
          cellBarCode: '',
        },
        cancelParam: {
          cellBarCode: '',
        },
        filterParam: {
          cellBarCode: '',
          stopProcessId: '',
          reason: '',
        },
        filterSelect: {
          processId: []
        },
        changeProcess: {
          currentProcess: '',
          cellBarCode: '',
          processId: '',
          gradeSelect:''
        },
        initSelectAdd: {
          cellTypeId: [],
          lineId: [],
          orderId: [],
          processId: [],
          cellState: []
        },
        addParam: {
          lotNo: '',
          cellTypeId: '',
          lineId: '',
          orderId: '',
          cellBarCode: '',
          processId: '',
          cellState: '',
          firstInjectWeight: '',
          firstBeforeWeight: '',
          firstAfterWeight: '',
        },
        initSelect: {
          gradeSelect:[],
          mark: [{label: ' ', value: '0'}, {label: '已标记', value: '1'}],
          lineNo: [],
          processId: [],
          cellState: [],
          status: [{label: '自动', value: '1'}, {label: '手工', value: '2'}],
          lineState: [{label: '上料', value: 0}, {label: '生产中', value: 1}, {label: '化成报工', value: 2}, {
            label: '包膜报工',
            value: 3
          }, {label: '下线', value: 4}]
        },
        table_mark: "fms_cell_info_lst",
        dialogFormVisible: false,
        dialogSelectFieldVisible: false,
        selectColumn: {
          origin: {},
          fields: [],
          colMap: []
        },
        selectViewCol: [],
        defaultForm: {
          row: {},
          params: {
            id: '',
            lineNo: '',
            lineName: ''
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
          {field: 'cellBarCode', title: '电芯条码', minWidth: 250, align: "center", query: true, queryType: 'input'},
          {field: 'cellState', title: '电芯状态', align: 'center', query: true, queryType: 'input', width: 150},
          {field: 'lineNo', title: '线体', width: 145, align: "center", query: true, queryType: 'select'},
          {field: 'orderId', title: '工单', minWidth: 120, align: "center", query: true, queryType: 'input'},
          {field: 'grade', title: '等级', minWidth: 120, align: "center",query: true, queryType: 'input',},
          {field: 'capacity', title: '容量', minWidth: 120, align: "center"},
          {field: 'lotNo', title: '批次', minWidth: 150, align: "center", query: true, queryType: 'input'},
          {field: 'trayNo', title: '托盘条码', minWidth: 150, align: "center", query: true, queryType: 'input'},
          {field: 'channel', title: '通道', width: 60, align: "center",query: true, queryType: 'input'},
          {field: 'processName', title: '当前工序', minWidth: 150, align: 'center'},
          {
            field: 'processId',
            title: '当前工序',
            minWidth: 150,
            align: 'center',
            hide: true,
            query: true,
            queryType: 'select'
          },
          {field: 'mark', minWidth: 150, title: '标记', align: 'center'},
          {field: 'stopProcessName', minWidth: 150, title: '拦截工序', align: 'center'},
          {field: 'reason', title: '拦截或标记原因', minWidth: 100, align: 'center'},
          {field: 'createTime', title: '创建日期', width: 200, align: 'center'},
          // {field: 'lastModifyTime', title: '修改日期', width: 200, align: 'center'},
          {field: 'createUser', hide: true, title: '创建人', align: 'center'},
          {field: 'lineState', width: 200, title: '上线状态', align: 'center'},
          {field: 'cellStateName', width: 200, title: '电芯状态', align: 'center', hide: true},
          {field: 'firstInjectWeight', title: '一注重量', minWidth: 100, align: 'right',query: true, queryType: 'input'},
          {field: 'firstBeforeWeight', title: '一注前重', minWidth: 150, align: 'left'},
          {field: 'firstAfterWeight', title: '一注后重', minWidth: 150, align: 'left'},
          {field: 'secondInjectWeight', title: '二注重量', width: 100, align: 'right',query: true, queryType: 'input'},
          {field: 'secondBeforeWeight', title: '二注前重', width: 100, align: 'right'},
          {field: 'secondAfterWeight', title: '二注后重', width: 100, align: 'right'},
          {field: 'ocv1', title: 'ocv1', width: 100, align: 'right'},
          {field: 'ir1', title: 'ir1', width: 80, align: 'right'},
          {field: 'ocv2', title: 'ocv2', width: 100, align: 'right'},
          {field: 'ir2', title: 'ir2', width: 80, align: 'right'},
          {field: 'k1', title: 'K值', width: 120, align: 'right'},
          {field: 'ocv3', title: 'ocv3', width: 100, align: 'right'},
          {field: 'ir3', title: 'ir3', width: 80, align: 'right'},
          {field: 'dcr1', title: 'dcr1', width: 100, align: 'right'},
          {field: 'dcrOcv1', title: 'dcrOcv1', width: 100, align: 'right'},
          {field: 'capacity', title: '分容容量', width: 150, align: 'right'},
          {field: 'k3', title: '拟合容量', width: 150, align: 'right'},
          // {field: 'capacity4', title: '预测容量', width: 150, align: 'right'},
          {field: 'voltage', title: 'DCR电压', width: 100, align: 'right'},
          {field: 'status', title: '数据导入', minWidth: 100, align: 'center'},
          {field: 'errorCode', title: '异常码', minWidth: 100, align: 'center',query: true, queryType: 'input'},
          {field: 'remark', title: '备注', minWidth: 150, align: 'left',query: true, queryType: 'input'},
          {field: 'allTime', title: '时间区间', minWidth: 150, align: 'left', query: true, queryType: 'date', hide: true},
          {field: 'processInfo', title: '工艺信息', minWidth: 150, align: 'left', query: true, queryType: 'input', hide: true},
        ]

      }
      Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
      return _initdata
    },
    created() {
      let bTime = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
      this.queryParams.requestData['allTime'] = [bTime, new Date()]
      // this.initCustomVol(data => {
      //   if (data && data.length > 0) {
      //     let fds = data.map(c => c.item)
      //     this.cols.forEach(item => {
      //       if (fds.indexOf(item.field) >= 0) {
      //         item.hide = false
      //       } else {
      //         item.hide = true
      //       }
      //     })
      //   }
      // })
      this.getList()
      this.selectOptions()
      this.initAddParamSelect()

    },
    methods: {
      // ProcessStatusUpdate(){
      //   Object.assign(this.queryParams, this.listQuery)
      //   const _data = {url: '/CwCellUploadController/list', params: this.queryParams} 
      //   this.$store.dispatch('fmsCommon/actionFmsPost', _data, 600 * 1000)
      //     .then(data => {
      //       this.list = data.data
      //       this.total = data.total
      //       this.listLoading = false
      //       this.queryParams.requestData.bTime = '';
      //       this.queryParams.requestData.eTime = '';
      //     }).catch(err => {
      //     console.error(err)
      //   })
      // },
      inputClick() {
          this.$refs.inputDialog.modalOpen();
      },
      // 电芯条码onfinish
      testOnFinish(val) {
          let msg = val.cellBarCode;
          //加g是替换字符串里出现的所有\n，不加g是替换字符串里出现的第一个\n
          if (val.cellBarCode && val.cellBarCode.indexOf('\n') > 0) {
             msg = val.cellBarCode.replace(/\n/g, ',')
          }
          let param = {
            requestData: {cellBarCode: msg}
          }
          if (msg && typeof(msg) === 'string' && msg.split(',').length > 1000) {
            this.$message({
                message: "单次批量查询电芯超过1000PCS,请减少查询数量！",
                type: 'warning',
            })
            return
          }
          this.queryParams = {
            requestData: {cellBarCode: msg}
          }
          this.listLoading = true
          Object.assign(param, this.listQuery)
          const _data = {url: '/cell/getcells', params: param}
          this.$store.dispatch('fmsCommon/actionFmsPost', _data, 600 * 1000)
            .then(data => {
              this.list = data.data
              this.total = data.total
              this.listLoading = false
              this.queryParams.requestData.bTime = '';
              this.queryParams.requestData.eTime = '';
            }).catch(err => {
            console.error(err)
          })
      },
      handleSelectionChange(val) {
        this.batchStateUpdateAndProcessCodeUpdate = val
      },
      markOkSave() {

        this.$confirm(i18n.t("common.cellList.markOk"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
          const _data = {url: '/cell/cell-mark', params: {data: this.filterParam}}
          this.$store.dispatch('fmsCommon/actionFmsPost', _data)
            .then(data => {
              this.getList();
              this.markOkVisible = false;
              this.$message({
                type: 'success',
                message: '标记成功'
              });
            }).catch(err => {
            console.error(err)
          })
        });
      },
      markNgSave() {
        if (this.cancelParam.cellBarCode.length < 1) {
          this.$message.error(this.$t('common.cellList.inputCellCheck'))
          return false;
        }
        this.$confirm(i18n.t("common.cellList.markNg"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
          const _data = {url: '/cell/cell-unmark', params: {data: this.cancelParam.cellBarCode}}
          this.$store.dispatch('fmsCommon/actionFmsPost', _data)
            .then(data => {
              this.getList();
              this.markNgVisible = false;
              this.$message({
                type: 'success',
                message: '取消标记成功'
              });
            }).catch(err => {
            console.error(err)
          })
        });
      },
      initCustomVol(callback) {
        const customColumn = {mark: this.table_mark, userName: sessionStorage.getItem("userInfo")}
        const _data = {url: '/custom-item/guest/query', params: customColumn}
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            if (callback && typeof callback == "function") {
              callback(data)
            }
          }).catch(err => {
          console.error(err)
        }).finally(() => {

        })
      },
      selectFields() {
        this.dialogSelectFieldVisible = true
        this.initCustomVol((data) => {
          this.selectColumn.colMap = []
          this.selectColumn.fields = []
          this.selectColumn.origin = {}
          this.selectColumn.fields = data.map(c => c.item)
          this.cols.forEach(item => {
            this.selectColumn.origin[item.field] = item.title
            this.selectColumn.colMap.push({
              key: item.field,
              label: item.title,
              disabled: false
            })
          })
        })
      },
      saveSelectField() {
        const fields = {}
        // this.currScripts.cols.forEach(item=>{
        //    if(item.export){
        //      fields[item.field] = item.title
        //    }
        // })
        let arr = []
        this.selectViewCol.length = 1
        this.selectColumn.fields.forEach(item => {
          if (this.selectColumn.origin[item]) {
            fields[item] = this.selectColumn.origin[item]
            arr.push({item: item})
            this.selectViewCol.push(item)
          }
        })

        if (this.selectColumn.fields.length == 0) {
          this.$message({
            type: 'info',
            message: '没有选择字段'
          });
          return
        }

        const customColumn = {mark: this.table_mark, userName: sessionStorage.getItem("userInfo"), items: arr}
        const _data = {url: '/custom-item/guest/save', params: customColumn}
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            this.$message({
              type: 'success',
              message: 'change success!=>' + data
            });
            this.dialogSelectFieldVisible = false
            this.cols.forEach(item => {
              if (this.selectViewCol.indexOf(item.field) >= 0) {
                item.hide = false
              } else {
                item.hide = true
              }

            })
            //this.query()
          }).catch(err => {
          console.error(err)
        }).finally(() => {

        })
      },

      deleteCellRequest() {
        this.$confirm(i18n.t("common.cellList.deleteCell"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
          let data = this.deleteParam.cellBarCode.split(",")
          const _data = {url: '/cell/cell_cancel_by_cell', params: {data: data}}
          this.$store.dispatch('fmsCommon/actionFmsPost', _data)
            .then(data => {
              this.getList();
              this.dialogDeleteCellFormVisible = false;
            }).catch(err => {
            console.error(err)
          })
        });
      },
      deleteCell() {
        this.dialogDeleteCellFormVisible = true;
      },

      filterCellRequest() {
        this.$confirm(i18n.t("common.cellList.filterCell"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
          for (let key in this.filterParam) {
            if(key === 'cellBarCode' && this.filterParam[key].indexOf('\n') >0) {
                let tt = this.filterParam[key];
                this.filterParam[key] = tt.replace(/\n/g, ';')
              }
          }

          const _data = {url: '/cell/cell-filter', params: {data: this.filterParam}}
          this.$store.dispatch('fmsCommon/actionFmsPost', _data)
            .then(data => {
              this.getList();
              this.dialogFilterCellFormVisible = false;
            }).catch(err => {
            console.error(err)
          })
        });
      },
      filterCell() {
        this.dialogFilterCellFormVisible = true;
      },


      markOk() {
        this.markOkVisible = true
      },
      markNg() {
        this.markNgVisible = true
      },

      batchStateUpdate(){
        let arr = this.batchStateUpdateAndProcessCodeUpdate.map(obj => obj.cellBarCode);
        if(arr.length < 1){
          this.$message.error("当前需要修改电芯数量小于1，请确认是否选择对应电芯！")
          return false;
        }
        if(arr.length > 100){
          this.$message.error("当前需要修改电芯数量大于100，请减少单次批量修改电芯状态数据！")
          return false;
        }
        this.$confirm(i18n.t("common.tip_info.cell_update_info") + `;当前变更状态条码为：${arr && Array.isArray(arr) && arr.toString().replace(/[,]/g,'\n')}`, i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning',
          customClass: 'box-logout'
        }).then(() => {
         const _data = {url: '/cell/cell-updateCellStateBatch', params: {data: arr}}
          this.$store.dispatch('fmsCommon/actionFmsPost', _data)
            .then(data => {
              this.$message({
                type: 'success',
                message: 'change success!'
              });
              this.dialogChangeProcessFormVisible = false
              this.query()
            }).catch(err => {
            console.error(err)
          })
          this.batchStateUpdateAndProcessCodeUpdate = []
        }).catch(() => {
        });
      },

      batchProcessCodeUpdate(){
        let arr = this.batchStateUpdateAndProcessCodeUpdate.map(obj => obj.cellBarCode);
        if(arr.length < 1){
          this.$message.error("当前需要修改电芯数量小于1，请确认是否选择对应电芯！")
          return false;
        }
        if(arr.length > 100){
          this.$message.error("当前需要修改电芯数量大于100，请减少单次批量修改电芯状态数据！")
          return false;
        }
        this.cellUpdateProcessBatch = true
      },


      batchGradeUpdate(){
        let arr = this.batchStateUpdateAndProcessCodeUpdate.map(obj => obj.cellBarCode);
        if(arr.length < 1){
          this.$message.error("当前需要修改电芯数量小于1，请确认是否选择对应电芯！")
          return false;
        }
        if(arr.length > 100){
          this.$message.error("当前需要修改电芯数量大于100，请减少单次批量修改电芯状态数据！")
          return false;
        }
        this.cellUpdateGradeBatch = true
      },

      cancelCellRequest() {
        if (this.cancelParam.cellBarCode.length < 1) {
          this.$message.error(this.$t('common.cellList.inputCellCheck'))
          return false;
        }
        this.$confirm(i18n.t("common.cellList.cancelCell"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
          let newParam = this.cancelParam.cellBarCode;
          if (newParam &&  (newParam.indexOf('\n') > 0)) {
            newParam = this.cancelParam.cellBarCode.replace(/\n/g,';')
          }
          const _data = { url: '/cell/cell-unfilter', params: {data: newParam} }
          this.$store.dispatch('fmsCommon/actionFmsPost', _data)
            .then(data => {
              this.getList();
              this.dialogCancelCellFormVisible = false;
            }).catch(err => {
            console.error(err)
          })
        });
      },
      cancelCell() {
        this.dialogCancelCellFormVisible = true;
      },

      addCell() {
        for (let item in this.addParam) {
          if (this.addParam[item].length < 1) {
            this.$message.error("有参数未输入,请输入后保存！");
            return false;
          }
        }
        const _data = {url: '/cell/manualSave', params: {data: this.addParam}}
        this.$store.dispatch('fmsCommon/actionFmsPost', _data)
          .then(data => {
            this.getList();
            this.dialogAddCellFormVisible = false;
          }).catch(err => {
          console.error(err)
        })
      },
      initAddParamSelect() {
        /**电芯型号*/
        let json = {col: "cellType", current: 1, pageSize: 99999, requestData: {cellType: ""}}
        const _dataType = {url: '/cell-type/list', params: json}
        this.$store.dispatch('fmsCommon/actionFmsPost', _dataType)
          .then(data => {
            this.initSelectAdd.cellTypeId = data.data.map(item => {
              item.label = item.productTypeName;
              item.value = item.id;
              return item;
            });
          }).catch(err => {
          console.error(err)
        })

        /**线别*/
        // json = {col: "lineNo", current: 1, pageSize: 99999, requestData: {lineNo: ""}}
        // const _dataLine = {url: '/line/list', params: json}
        // this.$store.dispatch('fmsCommon/actionFmsPost', _dataLine)
        //   .then(data => {
        //     this.initSelectAdd.lineId = data.data.map(item => {
        //       item.label = item.lineName;
        //       item.value = item.id;
        //       return item;
        //     });
        //   }).catch(err => {
        //   console.error(err)
        // })

        /**电芯状态*/
        // const _dataStatus = {url: '/constant/cell-state', params: {}}
        // this.$store.dispatch('fmsCommon/actionFmsPost', _dataStatus)
        //   .then(data => {
        //     this.initSelectAdd.cellState = data.map(item => {
        //       item.label = item.name;
        //       item.value = item.value;
        //       return item;
        //     });
        //   }).catch(err => {
        //   console.error(err)
        // })


        /**工单*/
        // json = {col: "orderId", current: 1, pageSize: 99999, requestData: {orderId: ""}}
        // const _dataOrder = {url: '/order/get-orders', params: json}
        // this.$store.dispatch('fmsCommon/actionFmsPost', _dataOrder)
        //   .then(data => {
        //     this.initSelectAdd.orderId = data.data.map(item => {
        //       item.label = item.orderId;
        //       item.value = item.id;
        //       return item;
        //     });
        //   }).catch(err => {
        //   console.error(err)
        // })


        /*拦截工序*/
        const _dataFilterProcess = {url: '/process/getall', params: {}}
        this.$store.dispatch('fmsCommon/actionFmsPost', _dataFilterProcess)
          .then(data => {
            this.filterSelect.processId = data.map(item => {
              item.label = item.processName;
              item.value = item.id;
              return item;
            });
          }).catch(err => {
          console.error(err)
        })


      },

      initProcessId(val) {
        let json = {cellId: val}
        const _dataOrder = {url: '/process-flow/process-flow-cell_id', params: json}
        this.$store.dispatch('fmsCommon/actionFmsPost', _dataOrder)
          .then(data => {
            if (data.length < 1) {
              this.$message.error("当前电芯类型暂无工序,请进行添加之后再进行电芯新增！")
              return false;
            }
            this.initSelectAdd.processId = data.map(item => {
              item.label = item.processName;
              item.value = item.processId;
              return item;
            });
          }).catch(err => {
          console.error(err)
        })
      },

      initData(arr) {
        let args = {}
        arr.map(c => {
          if (c.set) {
            args[c.field] = null
          }
        })
        return args
      },
      commonFilter(value, type) {

        if (this.initSelect.hasOwnProperty(type) && typeof this.initSelect[type] != undefined && Array.isArray(this.initSelect[type])) {
          return this.getValueConvert(this.initSelect[type], value)
        }
        if (this.initSelect.hasOwnProperty(type) && !Array.isArray(this.initSelect[type]) && this.initSelect[type].hasOwnProperty(value)) {
          return this.initSelect[type][value]
        }
        return value
      },
      getList() {
        if (this.queryParams.requestData['allTime'] != undefined && this.queryParams.requestData['allTime'].length > 0) {
          this.queryParams.requestData.bTime = this.formatDate(this.queryParams.requestData['allTime'][0])
          this.queryParams.requestData.eTime = this.formatDate(this.queryParams.requestData['allTime'][1])
        }
        if (this.queryParams.requestData.cellBarCode != undefined) {
          this.queryParams.requestData.cellBarCode = JSON.stringify(this.queryParams.requestData.cellBarCode).replaceAll(" ", "").replaceAll("\"", "")
        }

        this.listLoading = true
        Object.assign(this.queryParams, this.listQuery)
        console.log(this.queryParams.requestData)
        const _data = {url: '/CwCellUploadController/list', params: this.queryParams}    // /cell/getcellsc
      
        this.$store.dispatch('fmsCommon/actionFmsPost', _data, 600 * 1000)
          .then(data => {
            this.list = data.data
            this.total = data.total
            this.listLoading = false
            this.queryParams.requestData.bTime = '';
            this.queryParams.requestData.eTime = '';
          }).catch(err => {
          console.error(err)
        })
        //   httpUtils.actionFmsPost('/line/list',this.listQuery).then(data => {
        //       console.log(data)
        //   })
      },
      formatDate(val) {
        let date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + "-";
        let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
        let D = (date.getDate() < 10 ? "0" + (date.getDate()) : date.getDate()) + " ";
        let h = (date.getHours() < 10 ? "0" + (date.getHours()) : date.getHours()) + ":";
        let m = (date.getMinutes() < 10 ? "0" + (date.getMinutes()) : date.getMinutes()) + ":";
        let s = (date.getSeconds() < 10 ? "0" + (date.getSeconds()) : date.getSeconds());
        return Y + M + D + h + m + s;
      },
      // 详情弹窗
      getDtlsList(code) {
        this.dtlLoading = true
        const _data = {url: '/cell/guest/getcells_process_flows_by_code', params: {data: code}, timeout: 600 * 1000}
        this.$store.dispatch('fmsCommon/actionFmsPost', _data)
          .then(data => {
            this.dtlTableList = data
            this.dtlLoading = false
          }).catch(err => {
          console.error(err)
        })
      },
      // 操作按钮事件
      // dropBtnClick(val) {
      //   let row = val.row, num = val.num;
      //   switch (num) {
      //     case 1:
      //       this.cellBarcode = row.cellBarCode
      //       // this.flowDetailsList = row.cellBarCode
      //       this.getDtlsList(row.cellBarCode)
      //       this.flowDetailsVisible = true;
      //       break;
      //     case 2:
      //       this.changeProcess.cellBarCode = row.cellBarCode
      //       this.changeProcess.processId = row.processId
      //       this.dialogChangeProcessFormVisible = true
      //       break;
      //     case 3:
      //       this.$confirm(i18n.t("common.tip_info.unbind_info"), i18n.t("common.tip_info.tips"), {
      //         confirmButtonText: i18n.t("common.btn.ok"),
      //         cancelButtonText: i18n.t("common.btn.cancel"),
      //         type: 'warning'
      //       }).then(() => {
      //         const _data = {url: '/cell/single-split', params: {data: row.cellBarCode}}
      //         this.$store.dispatch('fmsCommon/actionFmsPost', _data)
      //           .then(data => {
      //             this.$message({
      //               type: 'success',
      //               message: 'unbind success!'
      //             });
      //             this.query()
      //           }).catch(err => {
      //           console.error(err)
      //         })
      //       }).catch(() => {
      //         this.$message({
      //           type: 'info',
      //           message: 'cancel unbind'
      //         });
      //       });
      //       break;

      //     default:
      //       break;
      //   }

      // },
      flowDts(row) {
        this.cellBarcode = row.cellBarCode
        // this.flowDetailsList = row.cellBarCode
        this.getDtlsList(row.cellBarCode)
        this.flowDetailsVisible = true;
      },
      getValueConvert(arr, value) {
        for (let v of arr) {
          if (v.value == value) {
            return v.label
          }
        }
        return value
      },
      openDialog(row) {
        this.defaultForm.row = row
        this.defaultForm.params.lineNo = row.lineNo
        this.defaultForm.params.id = row.id
        this.defaultForm.params.lineName = row.lineName
        this.dialogFormVisible = true
      },
      changCellState(row) {
        this.$confirm(i18n.t("common.tip_info.cell_update_info"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
          const _data = {url: '/cell/cell-updateCellState', params: {data: row.cellBarCode}}
          this.$store.dispatch('fmsCommon/actionFmsPost', _data)
            .then(data => {
              this.$message({
                type: 'success',
                message: 'change success!'
              });
              this.dialogChangeProcessFormVisible = false
              this.query()
            }).catch(err => {
            console.error(err)
          })
        }).catch(() => {
        });
      },
      openChangeProcDialog(row) {
        this.changeProcess.cellBarCode = row.cellBarCode
        this.changeProcess.processId = row.processId
        this.dialogChangeProcessFormVisible = true
      },
      edit() {
        const _data = {
          url: '/line/add', params: {
            data: this.defaultForm.params
          }
        }
        this.$store.dispatch('fmsCommon/actionFmsPost', _data)
          .then(data => {
            this.dialogFormVisible = false
            if (this.defaultForm.params.id != null && this.defaultForm.params.id != '') {
              this.defaultForm.row.lineNo = this.defaultForm.params.lineNo
              this.defaultForm.row.lineName = this.defaultForm.params.lineName
            }
          }).catch(err => {
          console.error(err)
        })
      },
      query() {
        this.listQuery.current = 1
        this.getList()
      },
      reset() {
        for (let p in  this.queryParams.requestData) {
          if (this.queryParams.requestData.hasOwnProperty(p)) {
            this.queryParams.requestData[p] = ''
          }
        }
      },
      selectOptions() {
        //初始化线体信息
        let _data = {url: '/CwLineInfoController/guest/all', params: {}} // /line/guest/all
        this.$store.dispatch('fmsCommon/actionFmsPost', _data)
          .then(data => {
            this.initSelect.lineNo = data.map(c => {
              return {
                label: c.lineNo,
                value: c.lineNo
              }
            })
          }).catch(err => {
          console.error(err)
        })

          //初始化工序信息
          _data = {url: '/process/getall', params: {}}
        this.$store.dispatch('fmsCommon/actionFmsPost', _data)
          .then(data => {
            this.initSelect.processId = data.map(c => {
              return {
                label: c.processName,
                value: c.id
              }
            })
          }).catch(err => {
          console.error(err)
        })

        //   _data = {url: '/constant/cell-state', params: {}}
        // this.$store.dispatch('fmsCommon/actionFmsPost', _data)
        //   .then(data => {
        //     this.initSelect.cellState = data.map(c => {
        //       return {
        //         label: c.name,
        //         value: c.value
        //       }
        //     })
        //   }).catch(err => {
        //   console.error(err)
        // })

        let json = {data: 'GRADE'}
        _data = {url: '/sys/get-param-by-code', params: json}
        this.$store.dispatch('fmsCommon/actionAuthPost', _data)
          .then(data => {
            this.initSelect.gradeSelect = data.map(c => {
              return {
                label: c.paramDsc + '-['+c.paramValue+']',
                value: c.paramValue
              }
            })
          }).catch(err => {
          console.error(err)
        })

      },
      changCellProc() {
        this.$confirm(i18n.t("common.tip_info.change_process_info"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning',
        }).then(() => {
          const _data = {url: '/cell/update-process-by-cell', params: {data: this.changeProcess}}
          this.$store.dispatch('fmsCommon/actionFmsPost', _data)
            .then(data => {
              this.$message({
                type: 'success',
                message: 'change success!'
              });
              this.dialogChangeProcessFormVisible = false
              this.query()
            }).catch(err => {
            console.error(err)
          })
        }).catch(() => {
        });
      },

      changCellProcessBatch() {
        let arr = this.batchStateUpdateAndProcessCodeUpdate.map(obj => obj.cellBarCode);
        console.log(arr)
        this.$confirm(i18n.t("common.tip_info.change_process_info") + `;当前变更状态条码为：${arr && Array.isArray(arr) && arr.toString().replace(/[,]/g, '\n')}`, i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning',
          customClass: 'box-logout'
        }).then(() => {
          this.changeProcess.cellBarCode = arr
          const _data = {url: '/cell/update-process-by-cell-batch', params: {data: this.changeProcess}}
          this.$store.dispatch('fmsCommon/actionFmsPost', _data)
            .then(data => {
              this.$message({
                type: 'success',
                message: 'change success!'
              });
              this.cellUpdateProcessBatch = false
              this.query()
            }).catch(err => {
            console.error(err)
          })
        }).catch(() => {
        });
      },
      changCellGradeBatch() {
        let arr = this.batchStateUpdateAndProcessCodeUpdate.map(obj => obj.cellBarCode);
        this.$confirm(i18n.t("common.tip_info.change_grade_info") + `;当前变更条码为：${arr && Array.isArray(arr) && arr.toString().replace(/[,]/g, '\n')}`, i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning',
          customClass: 'box-logout'
        }).then(() => {
          this.changeProcess.cellBarCode = arr
          const _data = {url: '/cell/update-grade-by-cell-batch', params: {data: this.changeProcess}}
          this.$store.dispatch('fmsCommon/actionFmsPost', _data)
            .then(data => {
              this.$message({
                type: 'success',
                message: 'change success!'
              });
              this.cellUpdateGradeBatch = false
              this.query()
            }).catch(err => {
            console.error(err)
          })
        }).catch(() => {
        });
      },
      add() {
        this.defaultForm.row = {}
        this.defaultForm.params.lineNo = ''
        this.defaultForm.params.id = ''
        this.defaultForm.params.lineName = ''
        this.dialogAddCellFormVisible = true
      },
      unbind(row) {
        this.$confirm(i18n.t("common.tip_info.unbind_info"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
          const _data = {url: '/cell/single-split', params: {data: row.cellBarCode}}
          this.$store.dispatch('fmsCommon/actionFmsPost', _data)
            .then(data => {
              this.$message({
                type: 'success',
                message: 'unbind success!'
              });
              this.query()
            }).catch(err => {
            console.error(err)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'cancel unbind'
          });
        });
      }
    }
  }
</script>

<style lang="less" scoped>
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

  .el-dropdown-link {
    cursor: pointer;
  }

  /deep/ .modal-class {
    width: 85% !important;
    min-width: 70% !important;
  }
  .cellbarcode-style {
      .el-input__icon {
          font-size: 20px;
          &:hover {
            cursor:pointer
            }
      }
  }
</style>

<style>
  .box-logout > .el-message-box__content {
    height: 300px !important;
    overflow-y: scroll !important;
}
</style>
