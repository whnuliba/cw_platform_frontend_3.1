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
      <el-button v-ele-show="{btnCode:'wcs_procTimeAdd'}" type="warning" class="filter-item" @click="add">
        {{ $t("common.btn.add") }}
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column min-width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(item) in cols" :sortable="true"  v-if="!item.hide" :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width" :min-width="item.minWidth" :align="item.align" show-overflow-tooltip>
        <template slot-scope="{row}">{{ commonFilter(row[item.field],item.field,item.queryType) }}</template>
      </el-table-column>
      <el-table-column align="left" :label="$t('common.oper')" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button v-ele-show="{btnCode:'wcs_procTimeEdit'}" type="primary" size="small" icon="el-icon-edit" @click="edit(scope.row)">
            {{ $t("common.btn.edit") }}
          </el-button>
                            &nbsp;
          <el-button v-ele-show="{btnCode:'wcs_procTimeDel'}" type="warning" size="small" icon="el-icon-edit" @click="del(scope.$index,scope.row)">
            {{ $t("common.btn.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" /> -->

    <el-dialog v-el-drag-dialog :title="dialogtitle" :visible.sync="dialogFormVisible" width="600px">
      <hr>
      <el-form ref="defaultForm.params" :inline="false" :model="defaultForm.params" label-width="200px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item
            v-if="item.set && item.queryType==='input'"
            :label="commonI18n(item)"
            :prop="item.field"
            :rules="[{ required: item.required, message: commonI18n(item)+$t('const.cannotNull'), trigger :'blur' }]"
          >
            <el-input v-model="defaultForm.params[item.field]" :placeholder="$t('const.pleaseInput')" style="width:80%" />
          </el-form-item>
          <el-form-item
            v-if="item.set && item.queryType==='select'"
            :label="commonI18n(item)"
            :rules="[{ required: item.required, message: commonI18n(item)+$t('const.cannotNull'), trigger: 'blur' }]"
          >
            <el-select clearable  v-model="defaultForm.params[item.field]"  :filterable="true" :placeholder="$t('const.pleaseSelect')" style="width:80%" @change="$forceUpdate()">
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
      <hr>
      <div slot="footer" class="dialog-footer">
        <el-button @click="destory(false)">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button v-if="defaultForm.params.id==='' || defaultForm.params.id===null" type="primary" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
        <el-button v-if="defaultForm.params.id!='' && defaultForm.params.id!=null" type="primary" @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import waves from '@/directive/waves'
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination'
import i18n from '@/lang'
export default {
  name: 'proTime',
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
    initSelect:{
      get(){
        return {
         pltCateId: this.pltCateId,
         matlCateId: this.matlCateId,
         fromMatlState: this.fromMatlState,
         fromMesState: this.fromMesState,
         toMatlState: this.toMatlState,
         toMesState: this.toMesState,
         updateTime: [{ label: this.$t('const.yesNo.yes'), value: 1 }, { label: this.$t('const.yesNo.no'), value: 0 }],
         useState: [{ label: this.$t('common.ProcessFlowList.enable'), value: 1 }, { label: this.$t('common.ProcessFlowList.disabled'), value: 0 }]
      }
      }
    }
  },
  data() {
    const _initdata = {
      dialogFormVisible: false,
      dialogtitle: '编辑',
      queryParams: {
        requestData: { }
        },
      pltCateId: [],
      matlCateId: [],
      fromMatlState: [],
      fromMesState: [],
      toMatlState: [],
      toMesState: [],
      defaultForm: {
        row: {},
        params: {
         id: ''
        }
      },
      list: null,
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 15
      },
      cols: [
                { field: 'id', title: '工艺时间参数Id', minWidth: 100, hide: true, align: 'center' },
                { field: 'pltCateId', title: '托盘类型', minWidth: 100, align: 'center', query: false, queryType: 'select', set: true, required: true },
                { field: 'matlCateId', title: '物料类别', minWidth: 100, align: 'center', query: false, queryType: 'select', set: true, required: true },
                { field: 'lotNo', title: '批次号', minWidth: 100, align: 'center', query: false, queryType: 'input', set: true, required: true },
                { field: 'fromMatlState', title: '起始物料状态', minWidth: 100, align: 'center', query: false, queryType: 'select', set: true, required: true },
                { field: 'fromMesState', title: '起始接口状态', minWidth: 100, align: 'center', query: false, queryType: 'select', set: true, required: true },
                { field: 'toMatlState', title: '结束物料状态', minWidth: 100, align: 'center', query: false, queryType: 'select', set: true, required: true },
                { field: 'toMesState', title: '结束接口状态', minWidth: 100, align: 'center', queryType: 'select', set: true, required: true },
                { field: 'minMinutes', title: '静置时间（分钟）', minWidth: 60, align: 'center', query: false, queryType: 'input', set: true, required: true },
                { field: 'maxMinutes', title: '超时时间（分钟）', minWidth: 60, align: 'center', set: false, required: false },
                { field: 'mesCode', title: 'MES资源号', hide: true, align: 'center', query: false, queryType: 'input', set: true, required: true },
                { field: 'updateTime', title: '是否更新到位时间', hide: true, align: 'center', query: false, queryType: 'select', set: true, required: true },
                { field: 'useState', title: '使用标志', minWidth: 50, align: 'center', queryType: 'select', set: true, required: true }
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
      const _data = { url: 'api/Common/GetProcTimes', params: this.queryParams }
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
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
    // 默认值设置
  destory(hide = false) {
    this.dialogFormVisible = hide
    this.$nextTick(()=>{    
                this.$refs['defaultForm.params'].resetFields(); })
       for (const p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          if (p === 'capacity') this.defaultForm.params[p] = 24
          else if (p === 'lotNo') this.defaultForm.params[p] = '#'
          else if (p === 'useState') this.defaultForm.params[p] = 1
          else if (p === 'fromMesState') this.defaultForm.params[p] = -1
          else if (p === 'toMesState') this.defaultForm.params[p] = -1
          else if (p === 'updateTime') this.defaultForm.params[p] = 0
          else if (p === 'mesCode') this.defaultForm.params[p] = '#'
          else this.defaultForm.params[p] = ''
        }
     }
  },

  add() {
     this.destory(true)
     this.dialogtitle = this.$t('common.btn.add')
  },

  edit(row) {
    this.dialogFormVisible = true
     for (const p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          this.defaultForm.params[p] = row[p]
        }
     }
     this.dialogtitle = this.$t('common.btn.edit')
  },

    // 提交更改
  submit(formName) {
       const _data = { url: 'api/Common/AddProcTime', params: {
          data: this.defaultForm.params
       }}
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
                    message:  this.$t('const.savedData')+this.$t('const.cannotNull')
                  })
             this.destory()
          }
        })
  },

  query() {
     this.listQuery.current = 1
     this.getList()
   },

   selectOptions() {
        // /获取物料类别
      let _data = { url: '/api/Common/GetMatlCates', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.matlCateId = data.map(c => {
                  return {
                    label: c.matlCateName,
                    value: c.matlCateId
                  }
                })
            }).catch(err => {
                console.error(err)
            })
             // 获取托盘类型
       _data = { url: '/api/Cache/PltCate', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.pltCateId = data.map(c => {
                  return {
                    label: c.pltCateName,
                    value: c.pltCateId
                  }
                })
            }).catch(err => {
                console.error(err)
            })
            // 获取电池状态
       _data = { url: '/api/Cache/MatlState', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.fromMatlState = data.map(c => {
                  return {
                    label: `[${c.stateNum}]${c.stateName}`,
                    value: c.stateNum
                  }
                })
                this.toMatlState = data.map(c => {
                  return {
                    label: `[${c.stateNum}]${c.stateName}`,
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
                this.fromMesState = data.map(c => {
                  return {
                    label: c.name,
                    value: c.id
                  }
                })
                this.toMesState = data.map(c => {
                  return {
                    label: c.name,
                    value: c.id
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
      const _data = { url: '/api/Common/AddProcTime', params: {
          data: this.defaultForm.params
          }}
         this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$store.dispatch('fmsCommon/actionWcsPost', _data)
              .then(data => {
              this.$message({
                    type: 'success',
                    message:this.$t('common.btn.addSuccess')
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

   del(index, row) {
      this.$confirm(i18n.t('common.tip_info.delete_info'), i18n.t('common.tip_info.tips'), {
          confirmButtonText: i18n.t('common.btn.ok'),
          cancelButtonText: i18n.t('common.btn.cancel'),
          type: 'warning'
        }).then(() => {
                const _data = { url: '/api/Common/DelProcTime', params: { data: row.id }}
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
