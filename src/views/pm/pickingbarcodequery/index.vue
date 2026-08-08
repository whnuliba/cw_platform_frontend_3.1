<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item,index) in cols" :key="index" style="display:inline">
        <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 150px" class="filter-item">
          <!-- {{queryParams.requestData[item.field]=''}} -->
        </el-input>
        <el-select v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 150px" class="filter-item">
          <el-option
            v-for="item in initSelect[item.field]"
            :key="item.value"
            :label="commonI18n(item)"
            :value="item.value"
          />
        </el-select>
        <el-date-picker v-if="item.query && item.queryType==='datetime'" v-model="queryParams.requestData[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="commonI18n(item)" style="width: 150px" class="filter-item" />
        <el-date-picker v-if="item.query && item.queryType==='date'" v-model="queryParams.requestData[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="date" :placeholder="commonI18n(item)" style="width: 150px" class="filter-item" />
      </div>
      <el-button type="primary" class="filter-item" @click="query">
        {{ $t("common.btn.query") }}
      </el-button>
      <el-button type="info"     class="filter-item" @click="reset" >
        {{ $t("common.btn.reset") }}
      </el-button>
      <!-- <el-button type="warning"   class="filter-item" @click="add" v-ele-show="{btnCode:'pressure_add'}">
        {{ $t("common.btn.add") }}
      </el-button> -->
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @row-click="rowClick">

      <el-table-column :width="50" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column v-for="(item) in cols" v-if="!item.hide" v-show="!item.hide" :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width" :min-width="item.minWidth" :align="item.align" show-overflow-tooltip>
        <template slot-scope="{row}">{{ commonFilter(row[item.field],item.field) }}</template>
        <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
       <el-table-column align="left" :label="$t('common.oper')" fixed="right" width="120">
        <template slot="header" slot-scope="scope">
          {{ $t('common.oper') }} <i style="margin-left: 10px;cursor:pointer;" class="el-icon-bank-card" @click="selectFields" />
        </template>
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 1"  type="primary"  size="small"  class="filter-item" @click="rollbackvisivle(scope.row)">{{ '回滚' }}</el-button>
          <el-button v-if="scope.row.status == 2"  type="primary"  size="small"  class="filter-item" @click="placeonfile(scope.row)">{{ '归档' }}</el-button>
          <el-button v-if="scope.row.status == 3"  type="primary"  size="small"  class="filter-item" @click="workOrderTransfer(scope.row)">{{ '工单转移' }}</el-button>
        </template>
      </el-table-column>
     
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog v-el-drag-dialog title="工单转移" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="120px">
        <div v-for="(item) in move_cols" :key="item.id" style="display:inline">
          <el-form-item
            v-if="item.set && item.queryType==='input'"
            :label="commonI18n(item)"
            :prop="item.field"
            label-width="120px"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
          >
            <!--:disabled="item.isEdit && item.disable"-->
            <el-input v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" style="width:180px;" />
          </el-form-item>
          <el-form-item
            v-if="item.set && item.queryType==='select'"
            :label="commonI18n(item)"
            label-width="120px"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'change' }]"
          >
            <el-select v-model="defaultForm.params[item.field]" placeholder="..." @change="$forceUpdate()" style="width:180px;">
              <el-option
                v-for="item in initSelect[item.field]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item  v-if="item.set && item.queryType==='datetime'"  :label="commonI18n(item)" :prop="item.field" >
            <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :disabled="allowDisable && item.editReadonly"  v-model="defaultForm.params[item.field]"  type="datetime"    :placeholder="commonI18n(item)"  style="width: 180px"> </el-date-picker>
          </el-form-item>
          <el-form-item  v-if="item.set && item.queryType==='date'"  :label="commonI18n(item)" :prop="item.field" >
            <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="allowDisable && item.editReadonly"  v-model="defaultForm.params[item.field]"  type="date"    :placeholder="commonI18n(item)"  style="width: 180px"> </el-date-picker>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="destory(false)">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button v-if="defaultForm.params.id==='' || defaultForm.params.id===null" type="primary" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
        <el-button v-if="defaultForm.params.id!='' && defaultForm.params.id!=null" type="primary" @click="save('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>
    <el-dialog v-el-drag-dialog title="回滚" :visible.sync="dialogrollbackFormVisible" width="700px">
      <el-form ref="roollbackdefaultForm.params" :inline="true" :model="roollbackdefaultForm.params" label-width="120px">
        <div v-for="(item) in rollback_cols" :key="item.id" style="display:inline">
          <el-form-item
            v-if="item.set && item.queryType==='input'"
            :label="commonI18n(item)"
            :prop="item.field"
            label-width="120px"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
          >
            <!--:disabled="item.isEdit && item.disable"-->
            <el-input v-model="roollbackdefaultForm.params[item.field]" :disabled="item.editReadonly" style="width:180px;" />
          </el-form-item>
          <el-form-item
            v-if="item.set && item.queryType==='select'"
            :label="commonI18n(item)"
            label-width="120px"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'change' }]"
          >
            <el-select v-model="roollbackdefaultForm.params[item.field]" placeholder="..." @change="$forceUpdate()" style="width:180px;">
              <el-option
                v-for="item in initSelect[item.field]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item  v-if="item.set && item.queryType==='datetime'"  :label="commonI18n(item)" :prop="item.field" >
            <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :disabled="allowDisable && item.editReadonly"  v-model="roollbackdefaultForm.params[item.field]"  type="datetime"    :placeholder="commonI18n(item)"  style="width: 180px"> </el-date-picker>
          </el-form-item>
          <el-form-item  v-if="item.set && item.queryType==='date'"  :label="commonI18n(item)" :prop="item.field" >
            <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="allowDisable && item.editReadonly"  v-model="roollbackdefaultForm.params[item.field]"  type="date"    :placeholder="commonI18n(item)"  style="width: 180px"> </el-date-picker>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogrollbackFormVisiblefalse">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" @click="roolbacksubmit">  {{ $t("common.btn.save") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog v-el-drag-dialog title="字段选择" :visible.sync="dialogSelectFieldVisible" width="700px">
      <el-form ref="exportColumn" :inline="true" :model="selectColumn" label-width="80px">

        <template>
          <el-transfer
            v-model="selectColumn.fields"
            :titles="['源字段', '目标字段']"
            :data="selectColumn.colMap"
          />
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveSelectField()">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import i18n from '@/lang'
export default {
  name: 'index',
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
  props: {
    // 外部传入的内容，用于实现双向绑定
    // value: String,
  },
  data() {
    const _initdata = {
      table_mark: 'pm_pressure_list',
      dialogFormVisible: false,
      dialogrollbackFormVisible: false,
      allowDisable: false,
      dialogSelectFieldVisible: false,
      value: new Date(),
      url: {
        add: '/pressure/add',
        del: '/pressure/del',
        list: '/pressure/list',
        submit: '/pressure/completeProduct',
        items:'/pack-barcode/items',
        barcodeMove:'/lineProcessPack/barcodeMove',
      },
      queryParams: {
        requestData: { }
      },
      initSelect: {
        trayType: [],
        state: [{ label: '创建', value: 1 }, { label: '完成', value: 2 }],
        useState: [{ label: '启用', value: 0 }, { label: '禁用', value: 1 }],
        electrode: [{ label: '正极', value: 1 }, { label: '负极', value: 2 }]
      },
      defaultForm: {
        row: {},
        params: {
          id: ''
        }
      },
      roollbackdefaultForm: {
        row: {},
        params: {
          // id: ''
        }
      },
      selectColumn: {
        origin: {},
        fields: [],
        colMap: []
      },
      selectViewCol: [],
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        current: 1,
        pageSize: 15
      },
      move_cols:[
        { field: 'extOrderNo', title: '原工单', align: 'left', queryType: 'input', set: true, require: true, editReadonly:true },
        { field: 'orderNo', title: '目标工单', align: 'left', queryType: 'input', set: true, require: true },
        { field: 'deviceNo', title: '设备', align: 'left', queryType: 'input', set: true, require: false },
        { field: 'state', title: '状态', align: 'left', queryType: 'select', set: true, require: false },
      ],
      rollback_cols:[
        { field: 'barcode', title: '物料条码', align: 'left', queryType: 'input', set: true, require: false, editReadonly:true },
        { field: 'packNo', title: '领料单', align: 'left', queryType: 'input', set: true, require: false, editReadonly:true },
        { field: 'qty', title: '数量', align: 'left', queryType: 'input', set: true, require: false },
      ],
      cols: [
        { field: 'barcode', title: '物料条码', align: 'left', query: true, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'materialNo', title: '物料编码', align: 'left', query: true, queryType: 'input', set: true, require: false, width:140 },
        { field: 'materialName', title: '物料名称', align: 'left', query: true, queryType: 'input', set: true, require: false, width:200 },
        { field: 'scanTime', title: '扫码时间', align: 'center', query: false, queryType: 'input', set: true, require: false, width:150 },
        { field: 'scanPersion', title: '扫码人', align: 'left', query: false, queryType: 'input', set: true, require: false },
        // { field: 'receiptQty', title: '消化接受数量', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'linePackId', title: 'linePackId', hide: true, align: 'left', query: false, queryType: 'input', set: true, require: false },
         { field: 'packNo', title: '领料单', align: 'left', query: false, queryType: 'input', set: true, require: false, width:140 },
        { field: 'orderNo', title: '工单', align: 'left', query: true, queryType: 'input', set: true, require: false, width:140 },
        { field: 'vendorNo', title: '供应商编码', align: 'left', query: true, queryType: 'input', set: true, require: false, width:100 },
        // { field: 'recordTime', title: '开单日期', align: 'left', query: true, queryType: 'input', set: true, require: false },
        // { field: 'packPerson', title: '领料人', align: 'left', query: false, queryType: 'input', set: true, require: false },
        // { field: 'completeTime', title: '完成时间', align: 'left', query: false, queryType: 'input', set: true, require: false },
        // { field: 'distPerson', title: '配送人', align: 'left', query: false, queryType: 'input', set: true, require: false },
        // { field: 'completeState', title: '完工状态', align: 'left', query: false, queryType: 'input', set: true, require: false },
        // { field: 'wsource', title: '原仓库', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'deviceNo', title: '目标机台', align: 'left', query: true, queryType: 'input', set: true, require: false, width:140 },
        // { field: 'processCode', title: '工序', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'actState', title: '激活状态', align: 'center', query: false, queryType: 'select', set: true, require: false },
        { field: 'status', title: '条码状态', align: 'center', query: false, queryType: 'select', set: true, require: false },
        // { field: 'priority', title: '优先级', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'qty', title: '数量', align: 'right', query: false, queryType: 'input', set: true, require: false },
        { field: 'unit', title: '单位', align: 'center', query: false, queryType: 'select', set: true, require: false },
        { field: 'prueflos', title: '检验批', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'znAtwrt5', title: '工序', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'znQualityStatus', title: '品质状态', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'znSubBatch', title: '子批次', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'znSingleGroup', title: '单独配组', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'znPrdSystem', title: '体系(代码)', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'znCap', title: '分容日期', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'znClassa', title: 'A品分类(级别)', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'znPrdMod', title: '生产型号', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'znClass', title: '等级', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'znPrdBatch', title: 'BAK生产批次', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'matterInfo', title: '物料描述', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'matterCode', title: '物料编码', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'boxUnit', title: '基本计量单位', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'produceDate', title: '生产日期', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'produceBatch', title: '生产批号', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'partnerName', title: '供应商名称', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'partnerbp', title: '供应商账号', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'packType', title: '包装类型', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'projectId', title: '采购订单信息', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'orderId', title: '采购订单号', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'refItemNo', title: '交货单行项目', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'refDocNo', title: '交货单号', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'charg', title: 'SAP流水批', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'boxunitqty', title: '一级单位', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
     
      ]
    }
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.move_cols))
    Object.assign(_initdata.roollbackdefaultForm.params, this.initData(_initdata.rollback_cols))
    return _initdata
  },
  created() {
    this.initCustomVol(data => {
      if (data && data.length > 0) {
        const fds = data.map(c => c.item)
        this.cols.forEach(item => {
          if (fds.indexOf(item.field) >= 0) {
            item.hide = false
          } else {
            item.hide = true
          }
        })
      }
    })
    // this.getList()
    this.selectOptions()
  },
  methods: {
    dialogrollbackFormVisiblefalse(){
      this.dialogrollbackFormVisible = false
      for (const p in this.roollbackdefaultForm.params) {
        if (this.roollbackdefaultForm.params.hasOwnProperty(p)) {
          this.roollbackdefaultForm.params[p] = ''
        }
      }
    },
    roolbacksubmit(){

      const _data = { url: '/lineProcessPack/rollbackPackInventoryBarcode', params: { data: this.roollbackdefaultForm.params }}
        this.$store.dispatch('fmsCommon/actionProductPost', _data)
          .then(data => {
            this.$message({
              type: 'success',
              message: 'change success!'
            })
            this.dialogrollbackFormVisible = false
            for (const p in this.roollbackdefaultForm.params) {
              if (this.roollbackdefaultForm.params.hasOwnProperty(p)) {
                this.roollbackdefaultForm.params[p] = ''
              }
            }
            this.query()

          }).catch(err => {
          console.error(err)
        })
    },
    rollbackvisivle(row){
      for (const p in this.roollbackdefaultForm.params) {
        if (this.roollbackdefaultForm.params.hasOwnProperty(p)) {
          this.roollbackdefaultForm.params[p] = row[p]
        }
      }

      this.dialogrollbackFormVisible = true
      
    },
     completeProduct(row){
      const _data = { url: this.url.submit, params: {id:row.id}}
      this.$store.dispatch('fmsCommon/actionProductPost', _data)
        .then(data => {
          this.$message({
            type: 'success',
            message: 'change success!=>' + data
          })
          this.dialogFormVisible = false
          this.query()
        }).catch(err => {
        console.error(err)
      }).finally(() => {
        this.destory()
      })

    },
    rowClick(row, column, event) {
      this.$emit('rowClick', row)
    },
    initCustomVol(callback) {
      const customColumn = { mark: this.table_mark, userName: sessionStorage.getItem('userInfo') }
      const _data = { url: '/custom-item/guest/query', params: customColumn }
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
          if (callback && typeof callback === 'function') {
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
      const arr = []
      this.selectViewCol.length = 1
      this.selectColumn.fields.forEach(item => {
        if (this.selectColumn.origin[item]) {
          fields[item] = this.selectColumn.origin[item]
          arr.push({ item: item })
          this.selectViewCol.push(item)
        }
      })

      if (this.selectColumn.fields.length == 0) {
        this.$message({
          type: 'info',
          message: '没有选择字段'
        })
        return
      }

      const customColumn = { mark: this.table_mark, userName: sessionStorage.getItem('userInfo'), items: arr }
      const _data = { url: '/custom-item/guest/save', params: customColumn }
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
          this.$message({
            type: 'success',
            message: 'change success!=>' + data
          })
          this.dialogSelectFieldVisible = false
          this.cols.forEach(item => {
            if (this.selectViewCol.indexOf(item.field) >= 0) {
              item.hide = false
            } else {
              item.hide = true
            }
          })
          // this.query()
        }).catch(err => {
        console.error(err)
      }).finally(() => {

      })
    },
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
      const _data = { url: this.url.items, params: this.queryParams }
      this.$store.dispatch('fmsCommon/actionProductPost', _data)
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

    getValueConvert(arr, value) {
      for (const v of arr) {
        if (v.value == value) {
          return v.label
        }
      }
      return value
    },
    destory(hide = false) {
      this.dialogFormVisible = hide
      for (const p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          this.defaultForm.params[p] = ''
        }
      }
    },
    placeonfile(row) {
      

      this.$confirm('确定要归档吗?', '提示', {
        confirmButtonText: i18n.t('common.btn.ok'),
        cancelButtonText: i18n.t('common.btn.cancel'),
        type: 'warning'
      }).then(() => {
        const _data = { url: '/lineProcessPack/barcodeCompleteByPackNoAndBarcode', params: {data:{barcode:row.barcode,packNo:row.packNo,}} }
      this.$store.dispatch('fmsCommon/actionProductPost', _data)
        .then(data => {
          this.$message({
            type: 'success',
            message: '归档成功'
          })
          this.query()

        }).catch(err => {
        console.error(err)
      })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'cancel delete'
        })
      })
     
    },
    workOrderTransfer(row) {
      this.allowDisable = true
      this.destory(true)
      this.$nextTick(() => {
        this.$refs['defaultForm.params'].resetFields(); 
      })  
      this.defaultForm.params.extOrderNo = row.orderNo
      this.defaultForm.params.deviceNo = row.deviceNo
      this.defaultForm.params['barcode'] = row.barcode
      this.defaultForm.params['id'] = row.id
    },
    edit(row) {
      this.dialogFormVisible = true
      this.allowDisable = true

      for (const p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          this.defaultForm.params[p] = row[p]
        }
      }
    },
    submit(formName) {
      const _data = { url: this.url.add, params: {
          data: this.defaultForm.params
        }}
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('fmsCommon/actionProductPost', _data)
            .then(data => {
              this.$message({
                type: 'success',
                message: 'change success!=>' + data
              })
              this.dialogFormVisible = false
              this.query()
            }).catch(err => {
            console.error(err)
          }).finally(() => {
            this.destory()
          })
        } else {
          this.$message({
            type: 'error',
            message: '输入数据不能为空'
          })
          this.destory()
        }
      })
    },
    query() {
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
    selectOptions() {
      // 初始化线体信息
     
      let _data = {url:'/prod-constant/pack-states',params:{}}
       this.$store.dispatch('fmsCommon/actionProductPost',_data)
      .then(data => {
            // console.log(data);
           this.initSelect.actState = data.map(c=>{
             return {
               label:c.name,
               value:c.value
             }
           })
           this.initSelect.status = data.map(c=>{
             return {
               label:c.name,
               value:c.value
             }
           })
       }).catch(err => {
          console.error(err)
       })
    },
    save(formName) {
      this.defaultForm.row = {}
      // this.defaultForm.params.id = ''
      // console.log(this.defaultForm.params);
      const _data = { url: this.url.barcodeMove, params: { data: this.defaultForm.params }}
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('fmsCommon/actionProductPost', _data)
            .then(data => {
              this.$message({
                type: 'success',
                message: 'change success!=>' + data
              })
              this.dialogFormVisible = false
              this.query()
            }).catch(err => {
            console.error(err)
          }).finally(() => {
            this.destory()
          })
        } else {
          this.$message({
            type: 'error',
            message: '输入数据不能为空'
          })
          this.destory()
        }
      })
    },
    del(index, row) {
      this.$confirm(i18n.t('common.tip_info.delete_info'), i18n.t('common.tip_info.tips'), {
        confirmButtonText: i18n.t('common.btn.ok'),
        cancelButtonText: i18n.t('common.btn.cancel'),
        type: 'warning'
      }).then(() => {
        const _data = { url: this.url.del, params: { data: row.id }}
        this.$store.dispatch('fmsCommon/actionProductPost', _data)
          .then(data => {
            this.list.splice(index, 1)
            this.$message({
              type: 'success',
              message: 'delete success!'
            })
          }).catch(err => {
          console.error(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'cancel delete'
        })
      })
    }

  }
}
</script>

<style lang="less" scoped>
/deep/.el-form-item {
    margin-bottom: 22px;
}
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
.model-factory{
  position: relative;
  width: 500px;
  height: calc(100vh - 120px);
  float: left;
  background: #D4D7D7;
}
.model-workshop{
  width: calc(100% - 505px);
  height: calc(100vh - 120px);
  float: left;
  margin-left:5px ;
  background: #D4D7D7;
}
</style>
