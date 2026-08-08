<template>
  <div>
    <div class="filter-container">
      <div v-for="(item,index) in cols" :key="index" style="display:inline">
        <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 150px" class="filter-item">
          <!-- {{queryParams.requestData[item.field]=''}} -->
        </el-input>
        <el-select v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
          <el-option v-for="item in initSelect[item.field]"
                     :key="item.value"
                     :label="commonI18n(item)"
                     :value="item.value" />
        </el-select>
        <el-date-picker v-if="item.query && item.queryType==='datetime'" v-model="queryParams.requestData[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="commonI18n(item)" style="width: 150" class="filter-item" />
        <el-date-picker v-if="item.query && item.queryType==='date'" v-model="queryParams.requestData[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="date" :placeholder="commonI18n(item)" style="width: 150" class="filter-item" />
      </div>
      <!--<el-button  type="primary" class="filter-item" @click="query">
        {{ $t("common.btn.query") }}
      </el-button>
      <el-button v-ele-show="{btnCode:'work_shift_add'}" type="warning" class="filter-item" @click="add">
        {{ $t("common.btn.add") }}
      </el-button>-->
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"  @row-click="equipmentMtPartRowClick">

      <el-table-column min-width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column v-for="(item) in cols" v-if="!item.hide" v-show="!item.hide" :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width" :min-width="item.minWidth" :align="item.align" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{ commonFilter(row[item.field],item.field) }}
        </template>
        <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="left" :label="$t('common.oper')" fixed="right" width="160">
        <template slot="header" slot-scope="scope">
          {{ $t('common.oper') }}
          <i style="margin-left: 10px;cursor:pointer;" class="el-icon-bank-card" @click="selectFields" />
        </template>
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="showDetails(scope.row)">
            项目
          </el-button>
          <el-button type="warning" v-ele-show="{btnCode:'equipment_mt_part_finish'}" v-if="scope.row.status != 106" size="small" @click="edit(scope.row)">
            {{ "完成" }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog v-el-drag-dialog :title="$t('common.btn.edit')" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="120px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item v-if="item.set && item.queryType==='input'"
                        :label="commonI18n(item)"
                        :prop="item.field"
                        label-width="120px"
                        :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]">
            <!--:disabled="item.isEdit && item.disable"-->
            <el-input v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" style="width:180px;" />
          </el-form-item>
          <el-form-item v-if="item.set && item.queryType==='select'"
                        :label="commonI18n(item)"
                        label-width="120px"
                        :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'change' }]">
            <el-select v-model="defaultForm.params[item.field]" placeholder="..." style="width:180px;" @change="$forceUpdate()">
              <el-option v-for="item in initSelect[item.field]"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
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
        <el-button v-if="defaultForm.params.id!='' && defaultForm.params.id!=null" type="primary" @click="submit('defaultForm.params',defaultForm.params)">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog v-el-drag-dialog title="字段选择" :visible.sync="dialogSelectFieldVisible" width="700px">
      <el-form ref="exportColumn" :inline="true" :model="selectColumn" label-width="80px">

        <template>
          <el-transfer v-model="selectColumn.fields"
                       :titles="['源字段', '目标字段']"
                       :data="selectColumn.colMap" />
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
    name: 'equipmentMtPart',
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
    value: String,
    equipmentMtPlanId: String,
  },
  data() {
    const _initdata = {
      table_mark: 'mdm_works_lst',
      dialogFormVisible: false,
      allowDisable: false,
      dialogSelectFieldVisible: false,
      equipmentMtId: '',
      url: {
        add: '/equipmentMtPart/add',
        del: '/equipmentMtPart/del',
        list: '/equipmentMtPart/guest/get-equipmentMtPart',
        finish:'/equipmentMtPart/finsh-EquipmentMtPart'
      },
      queryParams: {
        requestData: { }
      },
      initSelect: {
        trayType: [],
        useState: [{ label: '启用', value: 0 }, { label: '禁用', value: 1 }],
        isQualified: [{ label: '否', value: 0 }, { label: '是', value: 1 }],
        isChangePart: [{ label: '否', value: 0 }, { label: '是', value: 1 }],
        workShift: [{ label: '白班', value: '白班' }, { label: '夜班', value: '夜班' }],
        status: []
      },
      defaultForm: {
        row: {},
        params: {
          id: '',
          isQualified: '是',
          isChangePart:'否',
          planId:'',
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
        { field: 'partNo', title: '部件编码', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: true },
        { field: 'deviceNo', title: '设备编码', align: 'left', query: false, queryType: 'input', editReadonly: true, set: true, require: false },
        { field: 'mtResult', title: '保养结论', align: 'left', query: false, queryType: 'input', set: true, require: true },
        { field: 'mtState', title: '结论状态', align: 'left', query: false, queryType: 'input', set: true, require: true },
        { field: 'isQualified', title: '是否合格', align: 'left', query: false, queryType: 'select', set: true, require: true },
        { field: 'mtTime', title: '保养完成时间', align: 'left', query: false, queryType: 'datetime', set: false, require: true },
        { field: 'mtPerson', title: '保养人员', align: 'left', query: false, queryType: 'input', set: false, require: false },
        { field: 'workShift', title: '班次', align: 'left', query: false, queryType: 'select', set: true, require: true },
        { field: 'isChangePart', title: '是否切换部件', align: 'left', query: false, queryType: 'select', set: true, require: true },
        { field: 'status', title: '状态', align: 'left', width: '80px', queryType: 'select', set: false, require: false },
        { field: 'createTime', title: '创建时间', align: 'center', width: '145px', queryType: 'datetime', set: false, require: false },
        // { field: 'planId', title: 'planId', align: 'left', query: false, queryType: 'input', editReadonly: true,set: true, require: false,hide:true  }
      ]
    }
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
    return _initdata
  },
  watch: {
    equipmentMtPlanId: function(val) {
      this.equipmentMtId = val
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
    equipmentMtPartRowClick(row, column, event) {
      //this.$emit('equipmentMtPartRowClick', row)
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
      const _data = { url: this.url.list, params: { data: this.equipmentMtId }}
      this.$store.dispatch('fmsCommon/actionTpmPost', _data)
        .then(data => {
          this.list = data
          this.listLoading = false
        }).catch(err => {
        console.error(err)
      })
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
      this.$emit('equipmentMtPartRowDbClick', row)
    },
    edit(row) {
     
      this.dialogFormVisible = true
      this.allowDisable = true

      for (const p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          this.defaultForm.params[p] = row[p]
        }
      }
      return false
    },
    submit(formName,row) {
      Object.assign(this.defaultForm.params, { hedId: this.equipmentMtId })
      const _data = {
        url: this.url.finish, params: {
          data: this.defaultForm.params
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('fmsCommon/actionTpmPost', _data)
            .then(data => {
              this.$message({
                type: 'success',
                message: 'change success!=>' + data
              })
              this.dialogFormVisible = false
              this.query()
              this.$emit('equipmentMtPlanItemRowClick',row)

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
      //初始化状态信息
      const _data = { url: '/device-constant/guest/plan-states', params: {} }
      this.$store.dispatch('fmsCommon/actionTpmPost', _data)
        .then(data => {
          this.initSelect.status = data.map(c => {
            return {
              label: c.name,
              value: c.value
            }
          })
        }).catch(err => {
          console.error(err)
        })
    },
    save(formName) {
      this.defaultForm.row = {}
      this.defaultForm.params.id = ''
      Object.assign(this.defaultForm.params, { hedId: this.equipmentMtId })
      const _data = { url: this.url.finish, params: { data: this.defaultForm.params }}
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('fmsCommon/actionTpmPost', _data)
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
        this.$store.dispatch('fmsCommon/actionTpmPost', _data)
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

  .filter-item {
    margin-left: 3px;
  }

  .model-factory {
    position: relative;
    width: 500px;
    height: calc(100vh - 120px);
    float: left;
    background: #D4D7D7;
  }

  .model-workshop {
    width: calc(100% - 505px);
    height: calc(100vh - 120px);
    float: left;
    margin-left: 5px;
    background: #D4D7D7;
  }
</style>
