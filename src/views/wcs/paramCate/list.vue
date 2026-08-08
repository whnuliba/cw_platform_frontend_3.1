<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item,index) in cols" :key="index" style="display:inline">
        <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]"  :placeholder="commonI18n(item)" style="width: 120px" class="filter-item" />
        <el-select clearable  v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]"  :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
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
      <el-button v-ele-show="{btnCode:'wcs_pcsParamCateAdd'}" type="warning" class="filter-item" @click="add">
        {{ $t("common.btn.add") }}
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column min-width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(item) in cols" v-if="!item.hide"  :sortable="true" :key="item.id"  :label="commonI18n(item)" :prop="item.field" :width="item.width" :min-width="item.minWidth" :align="item.align" show-overflow-tooltip>
        <template slot-scope="{row}">{{ commonFilter(row[item.field],item.field,item.queryType) }}</template>
      </el-table-column>
      <el-table-column align="center" :label="$t('common.oper')" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button v-ele-show="{btnCode:'wcs_pcsParamCateEdit'}" type="primary" size="small" icon="el-icon-edit" @click="edit(scope.row)">
            {{ $t("common.btn.edit") }}
          </el-button>
                            &nbsp;
          <el-button v-ele-show="{btnCode:'wcs_pcsParamCateDel'}" type="warning" size="small" icon="el-icon-edit" @click="del(scope.$index,scope.row)">
            {{ $t("common.btn.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" /> -->

    <el-dialog v-el-drag-dialog :title="dialogtitle" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="defaultForm.params" :inline="false" :model="defaultForm.params" label-width="150px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item
            v-if="item.set && item.queryType==='input'"
             :label="commonI18n(item)"
            :prop="item.field"
            :rules="[{ required: item.required, message: commonI18n(item)+$t('const.cannotNull'), trigger :'blur' }]"
          >
            <el-input v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly"  placeholder="请输入" style="width:80%" />
          </el-form-item>
          <el-form-item
            v-if="item.set && item.queryType==='select'"
             :label="commonI18n(item)"
            :rules="[{ required: item.required, message: commonI18n(item)+$t('const.cannotNull'), trigger: 'blur' }]"
          >
            <el-select clearable  v-model="defaultForm.params[item.field]"  :disabled="allowDisable && item.editReadonly"  placeholder="请选择" style="width:70%" @change="$forceUpdate()">
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
        <el-button v-if="defaultForm.params.paramCateId==='' || defaultForm.params.paramCateId===null" type="primary" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
        <el-button v-if="defaultForm.params.paramCateId!='' && defaultForm.params.paramCateId!=null" type="primary" @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
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
  name: 'paramCate',
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
      dialogtitle : '编辑',
      allowDisable: false,
      queryParams: {
        requestData: { }
        },
      initSelect: {
         paramCateName: [],
         sortNum:[]
      },
      defaultForm: {
        row: {},
        params: {
         id: '',
         paramCateId:'',
         paramCateName:'',
         sortNum:''
        }
      },
      list: null,
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 15
      },
      cols: [
                { field: 'paramCateId', title: '参数类型', minWidth: 100, align: 'center', query: false, queryType: 'input', set: true, required: false ,editReadonly: true},
                { field: 'paramCateName', title: '参数类型名称', minWidth: 100, align: 'center', query: false, queryType: 'input', set: true, required: false ,editReadonly: true},
                { field: 'sortNum', title: '排序号', minWidth: 100, align: 'center', query: false, queryType: 'input', set: true, required: true },

       ]
    }
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
    return _initdata
  },

  created() {
     this.getList()
  },

 methods: {
       getItem(arr,field){
      for(let item of arr){
        if(item.field==field)
          return item;
      }
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
      const _data = { url: '/api/Common/GetpcsParamCates', params: this.queryParams }
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
          if (p === 'sortNum') this.defaultForm.params[p] = 0
          else this.defaultForm.params[p] = ''
        }
     }
  },

  add() {
    this.allowDisable = false
    this.dialogtitle = this.$t('table.add')
     this.destory(true)
  },

  edit(row) {
    this.allowDisable = true
    this.dialogtitle = this.$t('table.edit')
    this.dialogFormVisible = true
     for (const p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          this.defaultForm.params[p] = row[p]
        }
     }
  },

  check(){
      if(this.checkParam() != null){
        this.$message({
          message: this.checkParam(),
          type: 'error'
        })
        return true;
      }
      return false;
    },
  checkParam(){
    if(this.defaultForm.params.paramCateId.length < 1){
      return this.$t('const.pleaseInput')+this.commonI18n(this.getItem(this.cols,'paramCateId'))
    }if(this.defaultForm.params.paramCateName.length < 1){
      return this.$t('const.pleaseInput')+this.commonI18n(this.getItem(this.cols,'paramCateName'))
    }
    return null
  },

    // 提交更改
  submit(formName) {    
      if(this.check()){
          return false;
        } 
      const _data = { url: '/api/Common/SavepcsParamCate', params: {
        data: this.defaultForm.params
      }} 
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
      .then(data => {
        this.$message({
          message: this.$t('common.btn.submitSuccess') ,
          type: 'success'
        })
        this.getList()
        this.dialogFormVisible = false
        this.query()
      }).catch(err => {
          console.error(err)
        })    
  },

  query() {
     this.listQuery.current = 1
     this.getList()
   },

        // 保存新增
   save(formName) {
     if(this.check()){
          return false;
        }
      this.defaultForm.row = {}
      this.defaultForm.params.id = ''
      const _data = { url: '/api/Common/SavepcsParamCate', params: {
          data: this.defaultForm.params
          }}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
      .then(data => {
        this.$message({
          message: this.$t('common.btn.addSuccess') ,
          type: 'success'
        })
        this.getList()
        this.dialogFormVisible = false
        this.query()
      }).catch(err => {
        tconsole.error(err)
      }).finally(() => {
              this.destory()
            })
   },

   del(index, row) {
      this.$confirm(i18n.t('common.tip_info.delete_info'), i18n.t('common.tip_info.tips'), {
          confirmButtonText: i18n.t('common.btn.ok'),
          cancelButtonText: i18n.t('common.btn.cancel'),
          type: 'warning'
        }).then(() => {
                const _data = { url: '/api/Common/DelpcsParamCate', params: { data: row.paramCateId}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                      this.list.splice(index, 1)
                      this.$message({
                      type: 'success',
                      message:  this.$t('common.btn.deleteSuccess')
                    })
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
