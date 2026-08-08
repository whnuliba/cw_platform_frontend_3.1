<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item,index) in cols" :key="index" style="display:inline">
        <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item" />
        <el-select clearable  v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
          <el-option
            v-for="item in initSelect[item.field]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-button type="primary" class="filter-item" @click="query()">
        {{ $t("common.btn.query") }}
      </el-button>
      <el-button type="info" class="filter-item" @click="reset">
        {{ $t("common.btn.reset") }}
      </el-button>
      <el-button v-ele-show="{btnCode:'wcs_matlLevelAdd'}" type="warning" class="filter-item" @click="add">
        {{ $t("common.btn.add") }}
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @row-dblclick="showDetails">
      <el-table-column min-width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(item) in cols"  :sortable="true" :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width" :min-width="item.minWidth" :align="item.align" show-overflow-tooltip>
        <template slot-scope="{row}">{{ commonFilter(row[item.field],item.field) }}</template>
      </el-table-column>
      <el-table-column align="left" :label="$t('common.oper')" fixed="right" width="250">
        <template slot-scope="scope">
          <el-button v-ele-show="{btnCode:'wcs_matlLevelEdit'}" type="primary" size="small" icon="el-icon-edit" @click="edit(scope.row)">
            {{ $t("common.btn.edit") }}
          </el-button>
                &nbsp;
          <el-button v-ele-show="{btnCode:'wcs_matlLevelDel'}" type="warning" size="small" icon="el-icon-edit" @click="del(scope.$index,scope.row)">
            {{ $t("common.btn.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog v-el-drag-dialog :title="dialogtitle" :visible.sync="dialogFormVisible" width="400px">
      <el-form ref="defaultForm.params" :inline="false" :model="defaultForm.params" label-width="120px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item
            v-if="item.set && item.queryType==='input'"
            :label="commonI18n(item)"
            :prop="item.field"
            :rules="[{ required: item.required, message: commonI18n(item)+$t('const.cannotNull'), trigger: 'blur' }]"
          >
            <el-input v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" :placeholder="$t('const.pleaseInput')" style="width:70%" />
          </el-form-item>
          <el-form-item
            v-if="item.set && item.queryType==='select'"
            :label="commonI18n(item)"
            :rules="[{ required: item.required, message: commonI18n(item)+$t('const.cannotNull'), trigger: 'blur' }]"
          >
            <el-select clearable  v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" :placeholder="$t('const.pleaseSelect')" style="width:70%" @change="$forceUpdate()">
              <el-option
                v-for="item in initSelect[item.field]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="destory(false)">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button v-if="defaultForm.params.levelNum==='' || defaultForm.params.levelNum===null" type="primary" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
        <el-button v-if="defaultForm.params.levelNum!='' && defaultForm.params.levelNum!=null" type="primary" @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
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
  name: 'MatlStateList',
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
            allowDisable: false,
            dialogtitle:'编辑',
            queryParams: {
                requestData: { }
                },
            initSelect: {
                defaultFlag: [{ label: '1', value: true }, { label: '0', value: false }]
            },
            defaultForm: {
                row: {},
                params: {
                id: '',
                levelNum: ''
                }
            },
            list: null,
            total: 0,
            listLoading: false,
            listQuery: {
                current: 1,
                pageSize: 15
            },

            cols: [
                    { field: 'levelNum', title: '物料等级编号', minWidth: 100, hide: false, align: 'center', query: true, queryType: 'input', set: true, required: true, editReadonly: true },
                    { field: 'levelName', title: '物料等级名称', minWidth: 100, hide: false, align: 'center', query: true, queryType: 'input', set: true, required: true, editReadonly: true },
                    { field: 'defaultFlag', title: '默认标志', minWidth: 50, align: 'center', query: false, queryType: 'select', set: true, required: true },
                    { field: 'interfaceCode', title: '接口代码', minWidth: 50, align: 'center', query: false, queryType: 'input', set: true, required: false },
                    { field: 'remark', title: '备注', minWidth: 50, align: 'center', query: false, queryType: 'input', set: true, required: false }
            ]
        }
        Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
        return _initdata
  },

  created() {
        this.getList()
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
            const _data = { url: '/api/Common/GetMatlLevels', params: this.queryParams }
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
                if (v.value == value) {
                    return v.label
                }
            }
            return value
        },

        destory(hide = false) {
            this.dialogFormVisible = hide
            this.$nextTick(()=>{    
                this.$refs['defaultForm.params'].resetFields(); })
            for (const p in this.defaultForm.params) {
                if (this.defaultForm.params.hasOwnProperty(p)) {
                if (p == 'interfaceCode') this.defaultForm.params[p] = '#';
                else if (p == 'defaultFlag') this.defaultForm.params[p] = false;
                else if (p == 'remark') this.defaultForm.params[p] = null;
                else this.defaultForm.params[p] = ''
                }
            }
        },

        add() {
             this.allowDisable = false
             this.destory(true)
             this.dialogtitle = this.$t('common.btn.add')
        },

        showDetails(row, column) {
        },

        edit(row) {
            for (const p in this.defaultForm.params) {
                if (this.defaultForm.params.hasOwnProperty(p)) {
                this.defaultForm.params[p] = row[p]
                }
            }
            this.allowDisable = true
            this.dialogFormVisible = true
             this.dialogtitle = this.$t('common.btn.edit')
        },

            // 提交更改
        submit(formName) {
            const _data = { url: '/api/Common/SaveMatlLevel', params: { data: this.defaultForm.params }}
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                    .then(data => {
                    this.$message({
                            type: 'success',
                            message:  this.$t('common.btn.updateSuccess')
                        })
                        this.dialogFormVisible = false
                        this.getList()
                    }).catch(err => {
                        console.error(err)
                    }).finally(() => {
                        this.destory()
                        })
                } else {
                    this.$message({
                            type: 'error',
                            message: this.$t('const.savedData')+this.$t('const.cannotNull')
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

            // 保存新增
        save(formName) {
            this.defaultForm.row = {}
            this.defaultForm.params.id = ''
            const _data = { url: '/api/Common/SaveMatlLevel', params: { data: this.defaultForm.params }}
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                    .then(data => {
                    this.$message({
                            type: 'success',
                            message: this.$t('common.btn.addSuccess')
                        })
                        this.dialogFormVisible = false
                        this.getList()
                    }).catch(err => {
                        console.error(err)
                    }).finally(() => {
                        this.destory()
                        })
                } else {
                    this.$message({
                            type: 'error',
                            message:this.$t('const.savedData')+this.$t('const.cannotNull')
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
                        const _data = { url: '/api/Common/DeleteMatlLevel', params: { data: row.levelNum }}
                        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                        .then(data => {
                            this.list.splice(index, 1)
                            this.$message({
                            type: 'success',
                            message:this.$t('common.btn.deleteSuccess')
                            })
                            this.getList()
                        }).catch(err => {
                            console.error(err)
                        })
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: this.$t('common.btn.Cancelled')
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

</style>
