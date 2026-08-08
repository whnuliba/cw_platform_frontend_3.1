<template>
  <div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @row-dblclick="showDetails">

      <el-table-column min-width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column v-for="(item) in cols" v-if="!item.hide" v-show="!item.hide" :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width" :min-width="item.minWidth" :align="item.align" show-overflow-tooltip>
        <template slot-scope="{row}">{{ commonFilter(row[item.field],item.field) }}</template>
        <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <!-- <el-table-column align="left" :label="$t('common.oper')" fixed="right" width="80">
        <template slot="header" slot-scope="scope">
          {{ $t('common.oper') }} <i style="margin-left: 10px;cursor:pointer;" class="el-icon-bank-card" @click="selectFields" />
        </template>

      </el-table-column> -->
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog v-el-drag-dialog :title="$t('common.btn.edit')" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="120px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
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
            <el-select v-model="defaultForm.params[item.field]" placeholder="..." style="width:180px;" @change="$forceUpdate()">
              <el-option
                v-for="item in initSelect[item.field]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="item.set && item.queryType==='datetime'" :label="commonI18n(item)" :prop="item.field">
            <el-date-picker v-model="defaultForm.params[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :disabled="allowDisable && item.editReadonly" type="datetime" :placeholder="commonI18n(item)" style="width: 180px" />
          </el-form-item>
          <el-form-item v-if="item.set && item.queryType==='date'" :label="commonI18n(item)" :prop="item.field">
            <el-date-picker v-model="defaultForm.params[item.field]" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="allowDisable && item.editReadonly" type="date" :placeholder="commonI18n(item)" style="width: 180px" />
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="destory(false)">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button v-if="defaultForm.params.id==='' || defaultForm.params.id===null" type="primary" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
        <el-button v-if="defaultForm.params.id!='' && defaultForm.params.id!=null" type="primary" @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
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
  name: 'LineMaterialBarcode',
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
    lineMaterialBarcodeId: String
  },
  data() {
    const _initdata = {
      table_mark: 'pp_lineMaterialBarcode_list',
      dialogFormVisible: false,
      allowDisable: false,
      dialogSelectFieldVisible: false,
      sn: '',
      url: {
        add: '/lineMaterialBarcode/add',
        del: '/lineMaterialBarcode/del',
        list: '/lineMaterialBarcode/list'
      },
      queryParams: {
        requestData: { }
      },
      initSelect: {
        trayType: [],
        useState: [{ label: '未领用', value: 0 }, { label: '领用', value: 1 }],
      },
      defaultForm: {
        row: {},
        params: {
          id: ''
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
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 15
      },
      cols: [
        { field: 'materialNo', title: '物料编号', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false, width:150 },
        { field: 'barcode', title: '条码', align: 'left', query: false, queryType: 'input', set: true, require: false, width:150 },
        { field: 'procurement', title: '采购单号', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'vendorNo', title: '供应商编码', align: 'left', query: false, queryType: 'input', set: true, require: false, width:100 },
        { field: 'vendorName', title: '供应商名称', align: 'left', query: false, queryType: 'select', set: true, require: false, width:100 },
        { field: 'productTime', title: '生产时间', align: 'left', query: false, queryType: 'input', set: true, require: false, width:150 },
        // { field: 'inTime', title: '入库时间', align: 'left', query: false, queryType: 'input', set: true, require: false, width:150 },
        // { field: 'useState', title: '领用状态', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'receiptNo', title: '入库单号', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'qty', title: '数量', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'unit', title: '单位', align: 'left', query: false, queryType: 'input', set: true, require: false },
        // { field: 'orderNo', title: '工单', align: 'left', query: false, queryType: 'input', set: true, require: false, width:150 },
        { field: 'materialId', title: '物料ID', align: 'left', hide: true, query: false, queryType: 'input', set: true, require: false },
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
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
    return _initdata
  },
  watch: {
    lineMaterialBarcodeId: function(val) {
      this.queryParams.requestData.materialId = val
      this.getList()
      this.selectOptions()
    }
  },
  created() {
    /* this.initCustomVol(data => {
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
    }) */

    this.listLoading = false
    //this.getList()
    this.selectOptions()
  },
  methods: {
    reloadData(val) {
      this.queryParams.requestData.materialId = val
      this.getList()
      this.selectOptions()
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
      const _data = { url: this.url.list, params: this.queryParams }
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
    add() {
      this.allowDisable = false
      this.destory(true)
    },
    showDetails(row, column) {
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

      // 初始化工序信息
    },
    save(formName) {
      this.defaultForm.row = {}
      this.defaultForm.params.id = ''
      const _data = { url: this.url.add, params: { data: this.defaultForm.params }}
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
