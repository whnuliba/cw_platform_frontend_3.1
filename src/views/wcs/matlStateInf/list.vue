<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item,index) in cols" :key="index" style="display:inline">
        <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item" />
        <el-select clearable  v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]"  :filterable="true" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
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
      <el-button type="info"   class="filter-item" @click="reset" >
          {{ $t("common.btn.reset") }}
      </el-button>
      <el-button v-ele-show="{btnCode:'wcs_matlStateInfAdd'}" type="warning" class="filter-item" @click="add">
        {{ $t("common.btn.add") }}
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @row-dblclick="showDetails">
      <el-table-column min-width="50px" width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(item) in cols"   v-if="!item.hide"   :sortable="true"  :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width" :min-width="item.minWidth" :align="item.align" show-overflow-tooltip>
        <template slot-scope="{row}">{{ commonFilter(row[item.field],item.field) }}</template>
      </el-table-column>
      <el-table-column align="left" :label=" $t('common.oper') " fixed="right" width="220">
        <template slot-scope="scope">
          <el-button v-ele-show="{btnCode:'wcs_matlStateInfEdit'}" type="primary" size="small" icon="el-icon-edit" @click="edit(scope.row)">
            {{ $t("common.btn.edit") }}
          </el-button>
                &nbsp;
          <el-button v-ele-show="{btnCode:'wcs_matlStateInfDel'}" type="warning" size="small" icon="el-icon-edit" @click="del(scope.$index,scope.row)">
            {{ $t("common.btn.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog v-el-drag-dialog :title="dialogtitle" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="defaultForm.params" :inline="false" :model="defaultForm.params" label-width="120px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item
            v-if="item.set && item.queryType==='input'"
            :label="commonI18n(item)"
            :prop="item.field"
            :rules="[{ required: item.required, message: commonI18n(item)+$t('const.cannotNull'), trigger: 'blur' }]"
          >
            <el-input v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" :placeholder="$t('const.pleaseInput')" style="width:90%" />
          </el-form-item>
          <el-form-item
            v-if="item.set && item.queryType==='select'"
            :label="commonI18n(item)"
            :prop="item.field"
            :rules="[{ required: item.required, message:commonI18n(item)+$t('const.cannotNull'), trigger: 'change' }]"
          >
            <el-select clearable  v-model="defaultForm.params[item.field]"  :filterable="true" :disabled="allowDisable && item.editReadonly" :placeholder="$t('const.pleaseSelect')" style="width:90%" @change="$forceUpdate()" >
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
        <el-button v-if="defaultForm.params.id==='' || defaultForm.params.id===null" type="primary" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
        <el-button v-if="defaultForm.params.id!='' && defaultForm.params.id!=null" type="primary" @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
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
  name: 'matlStateInf',
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
            dialogtitle: '编辑',
            allowDisable: false,
            queryParams: {
                requestData: { }
                },
            initSelect: {
                fromMatlState: [],
                fromMesState: [],
                toMatlState: [],
                toMesState: [],
                partMatlState: [],
                partMesState: [],
                infStep:[]
            },
            defaultForm: {
                row: {},
                params: {
                id: '',
                fromMatlState:''
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
                    { field: 'id',  hide:true},
                    { field: 'infStep', title: '工艺', minWidth: 120, hide: false, align: 'center', query: true, queryType: 'select', set: true, required: true },
                    { field: 'fromMatlState', title: '起始物料状态', minWidth: 140, align: 'center', query: false, queryType: 'select', set: true, required: true, editReadonly: true },
                    { field: 'fromMesState', title: '起始接口状态', minWidth: 140, align: 'center', query: false, queryType: 'select', set: true, required: true },
                    { field: 'toMatlState', title: '到达物料状态', minWidth: 130, align: 'center', query: false, queryType: 'select', set: true, required: true, editReadonly: true },
                    { field: 'toMesState', title: '到达接口状态', minWidth: 130, align: 'center', query: false, queryType: 'select', set: true, required: true },
                    { field: 'partMatlState', title: '异常物料状态', minWidth: 130, align: 'center', query: false, queryType: 'select', set: true, required: true, editReadonly: true },
                    { field: 'partMesState', title: '异常接口状态', minWidth: 130, align: 'center', query: false, queryType: 'select', set: true, required: true },
                    { field: 'testTimeout', title: '超时时间(秒)', minWidth: 130, align: 'center', query: false, queryType: 'input', set: true, required: true },
                    { field: 'remark', title: '备注', minWidth: 100, align: 'center', query: false, queryType: 'input', set: true, required: false }
            ]
        }
        Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
        return _initdata
  },

  created() {
        this.getList()
        this.selectOptions()
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
            const _data = { url: '/api/Common/GetMatlStateInfs', params: this.queryParams }
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
                this.$refs['defaultForm.params'].resetFields(); 
                })
            for (const p in this.defaultForm.params) {
                if (this.defaultForm.params.hasOwnProperty(p)) {
                  if (p == 'fromMesState') this.defaultForm.params[p] = -1
                  else if (p == 'toMesState') this.defaultForm.params[p] = -1
                  else if (p == 'partMesState') this.defaultForm.params[p] = -1
                  else if (p == 'testTimeout') this.defaultForm.params[p] = -1
                  else if (p == 'remark') this.defaultForm.params[p] = null
                  else if (p == 'fromMatlState') this.defaultForm.params[p] = ''
                  else this.defaultForm.params[p] = null
                }
            }
        },

        add() {
             this.allowDisable = false
             this.dialogtitle = this.$t('common.btn.add')
             this.destory(true)
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
            const _data = { url: '/api/Common/SaveMatlStateInf', params: { data: this.defaultForm.params }}
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                    .then(data => {
                    this.$message({
                            type: 'success',
                            message: this.$t('common.btn.updateSuccess')
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
                    //this.destory()
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
            // 获取电池状态
            let _data = { url: '/api/Cache/MatlState', params: {}}
            this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                    .then(data => {
                        this.initSelect.fromMatlState = data.map(c => {
                            return {
                                label:`[${c.stateNum}]${c.stateName}`,
                                value: c.stateNum
                            }
                        })
                        this.initSelect.toMatlState = data.map(c => {
                            return {
                                label:`[${c.stateNum}]${c.stateName}`,
                                value: c.stateNum
                            }
                        })
                        this.initSelect.partMatlState = data.map(c => {
                            return {
                                label:`[${c.stateNum}]${c.stateName}`,
                                value: c.stateNum
                            }
                        })
                    }).catch(err => {
                        console.error(err)
                    })

                // 获取接口状态
            _data = { url: '/api/Const/MesState', params: {}}
            this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                    .then(data => {
                        this.initSelect.fromMesState = data.map(c => {
                            return {
                                label:c.name,
                                value:c.id
                            }
                        })
                        this.initSelect.toMesState = data.map(c => {
                            return {
                                label:c.name,
                                value:c.id
                            }
                        })
                        this.initSelect.partMesState = data.map(c => {
                            return {
                                label:c.name,
                                value:c.id
                            }
                        })
                    }).catch(err => {
                        console.error(err)
                    })
            // 获取工艺跳转步骤
            _data = { url: '/api/Const/InfStepTags', params: {}}
            this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                    .then(data => {
                      console.log(data)
                        this.initSelect.infStep = data.map(c => {
                            return {
                                label:c.name,
                                value:c.id
                            }
                        })
                    }).catch(err => {
                        console.error(err)
                    })
        },

        // 保存新增
        save(formName) {
            this.defaultForm.row = {}
            this.defaultForm.params.id = ''
            const _data = { url: '/api/Common/SaveMatlStateInf', params: { data: this.defaultForm.params }}
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
                            message: this.$t('const.savedData')+this.$t('const.cannotNull')
                        })
                    //this.destory()
                }
                })
        },

        del(index, row) {
            this.$confirm(i18n.t('common.tip_info.delete_info'), i18n.t('common.tip_info.tips'), {
                confirmButtonText: i18n.t('common.btn.ok'),
                cancelButtonText: i18n.t('common.btn.cancel'),
                type: 'warning'
                }).then(() => {
                        const _data = { url: '/api/Common/DeleteMatlStateInf', params: { data: row.id }}
                        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                        .then(data => {
                            this.list.splice(index, 1)
                            this.$message({
                            type: 'success',
                            message: this.$t('common.btn.deleteSuccess')
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
