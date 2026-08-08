<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item,index) in cols" :key="index" style="display:inline">
        <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
          <!-- {{queryParams.requestData[item.field]=''}} -->
        </el-input>
        <el-select clearable  v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :filterable="true" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
          <el-option
            v-for="item in initSelect[item.field]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-date-picker v-if="item.query && item.queryType==='datetime'" v-model="queryParams.requestData[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="commonI18n(item)" style="width: 150" class="filter-item" />
        <el-date-picker v-if="item.query && item.queryType==='date'" v-model="queryParams.requestData[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="date" :placeholder="commonI18n(item)" style="width: 150" class="filter-item" />

      </div>
      <el-button type="primary" class="filter-item" @click="query()">
        {{ $t("common.btn.query") }}
      </el-button>
      <el-button type="info" class="filter-item" @click="reset">
        {{ $t("common.btn.reset") }}
      </el-button>
      <el-button v-ele-show="{btnCode:'wcs_staAdd'}" type="warning" class="filter-item" @click="add">
        {{ $t("common.btn.add") }}
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @row-dblclick="showDetails">

      <el-table-column width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="commonI18n(item)" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column v-for="(item) in cols" v-if="!item.hide"  :sortable="true" :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width||defalutWidth" :min-width="item.minWidth" :align="item.align" show-overflow-tooltip>
        <template slot-scope="{row}">{{ commonFilter(row[item.field],item.field) }}</template>
        <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="center" :label="$t('common.oper')" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button v-ele-show="{btnCode:'wcs_staAdd'}" type="primary" size="small" icon="el-icon-edit" @click="edit(scope.row)">
            {{ $t("common.btn.edit") }}
          </el-button>
           &nbsp;
          <el-button v-ele-show="{btnCode:'wcs_staDel'}" type="warning" size="small" icon="el-icon-edit" @click="del(scope.$index,scope.row)">
            {{ $t("common.btn.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog v-el-drag-dialog :title="dialogtitle" :visible.sync="dialogFormVisible" width="800px">

      <!-- <el-form :label-position="labelPosition" label-width="120px" :model="addParam" style="display:inline" ref="addParam"> 
        <el-row>
          <el-col :span="10">
            <el-form-item label="站台编号" :rules="[{ required:true, message: '站台编号不能为空', trigger: 'blur' }]">
              <el-input v-model="addParam.staCode" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="站台名称" :rules="[{ required:true, message: '站台名称不能为空', trigger: 'blur' }]">
              <el-input v-model="addParam.staName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="站台功能" :rules="[{ required:true, message: '站台功能不能为空', trigger: 'blur' }]">
              <el-select clearable  v-model="addParam.staFunc" style="width: 100%">
                <el-option v-for="item in initSelect.staFunc" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="关联巷道">
              <el-select clearable  v-model="addParam.laneId" style="width: 100%">
                <el-option v-for="item in initSelect.laneId" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="搬运类型" :rules="[{ required:true, message: '搬运类型不能为空', trigger: 'blur' }]">
              <el-select clearable  v-model="addParam.carryType" style="width: 100%">
                <el-option v-for="item in initSelect.carryType" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="箱号">
              <el-input v-model="addParam.boxCode" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="相对位置">
              <el-select clearable  v-model="addParam.duplexIdx" style="width: 100%">
                <el-option v-for="item in initSelect.duplexIdx" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="默认货叉" :rules="[{ required:true, message: '默认货叉为设置', trigger: 'blur' }]">
              <el-input v-model="addParam.useFork" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="调度号1" :rules="[{ required:true, message: '调度号1不能为空', trigger: 'blur' }]">
              <el-input v-model="addParam.ctrlCode1" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="调度号2">
              <el-input v-model="addParam.ctrlCode2" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="资源号">
              <el-input v-model="addParam.sourceCode" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="使用标志" :rules="[{ required:true, message: '使用标志不能为空', trigger: 'blur' }]">
              <el-select clearable  v-model="addParam.useState" style="width: 100%">
                <el-option v-for="item in initSelect.useState" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="托盘类型限定">
            <el-select clearable  v-model="addParam.limitPltCate" style="width: 100%">
              <el-option v-for="item in initSelect.limitPltCate" :value="item.value" :label="item.label" />
            </el-select>
            </el-form-item>
          </el-col> 
          <el-col :span="10">
            <el-form-item label="最大叠盘数" :rules="[{ required:true, message: '最大叠盘数不能为空', trigger: 'blur' }]">
              <el-input v-model="addParam.maxLayer" style="width: 100%" />
            </el-form-item>
          </el-col>
          </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div> -->
      <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="100px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item  v-if="item.set && item.queryType==='input'" :label="commonI18n(item)" :prop="item.field"
            :rules="[{ required: item.required, message: commonI18n(item)+$t('const.cannotNull'), trigger: 'blur' }]"
          >
             <el-input v-model="defaultForm.params[item.field]"  style="width:200px;"  />
          </el-form-item>
           <el-form-item  v-if="item.set && item.queryType==='select'" :label="commonI18n(item)" :prop="item.field"
            :rules="[{ required: item.required, message: commonI18n(item)+$t('const.cannotNull'), trigger: 'blur' }]"
           >
              <el-select clearable  v-model="defaultForm.params[item.field]" :filterable="true" :clearable="item.clearable" @change="$forceUpdate()" :placeholder="$t('const.pleaseSelect')" style="width:200px;" :allow-create="item.allowcreate" >
                <el-option
                  v-for="item in initSelect[item.field]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="destory(false)">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.staId==='' || defaultForm.params.staId===null" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.staId!='' && defaultForm.params.staId!=null"  @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
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
  name: 'staInfo',
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
      defalutWidth:110,
      dialogFormVisible: false,
      dialogtitle : '编辑',
      queryParams: {
        requestData: { }
        },
      initSelect: {
         carryType: [],
         staFunc: [],
         laneId: [],
         limitPltCate: [],
         useState: [{ label: this.$t('common.ProcessFlowList.enable'), value: 1 }, { label: this.$t('common.ProcessFlowList.disabled'), value: 0 }]
      },
      defaultForm: {
        row: {},
        params: {
         id: '',
         staId: ''
        }
      },
      list: null,
      labelPosition: 'right',
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 15
      },
      addParam: {
          staId: '',
          staCode: '',
          staName: '',
          staFunc: '',
          laneId: '',
          carryType: '',
          duplexIdx: '',
          useFork: '0',
          maxLayer: '0',
          lanePosition: '',
          boxCode: '#',
          ctrlCode1: '',
          ctrlCode2: '',
          sourceCode: '',
          useState: '',
          limitPltCate: ''
        },
      cols: [
                { field: 'staId', title: '站台Id', minWidth: 110, hide: true, align: 'center' },
                { field: 'staCode', title: '站台编号', minWidth: 110, align: 'center', query: true, queryType: 'input', set: true, required: true },
                { field: 'staName', title: '站台名称', minWidth: 110, align: 'center', query: false, queryType: 'input', set: true, required: true },
                { field: 'carryType', title: '搬运类型', minWidth: 110, align: 'center', query: true, queryType: 'select', set: true, required: true },
                { field: 'staFunc', title: '站台功能', minWidth: 110, align: 'center', query: true, queryType: 'select', set: true, required: true },
                { field: 'ctrlCode1', title: '调度号1', minWidth: 110, align: 'center', query: true, queryType: 'input', set: true, required: true },
                { field: 'ctrlCode2', title: '调度号2',minWidth: 110, align: 'center', query: false, queryType: 'input', set: true, required: true },
                { field: 'laneId', title: '关联巷道', minWidth: 110,align: 'center', query: true, queryType: 'select', set: true,  required: true, clearable: true, allowcreate: true },
                { field: 'duplexIdx', title: '相对位置',minWidth: 110, align: 'center', query: false, queryType: 'select', set: true, filter: true, required: true },
                { field: 'boxCode', title: '箱号',minWidth: 110, align: 'center', query: false, queryType: 'input', set: true, filter: true, required: true },
                { field: 'useFork', title: '默认货叉', minWidth: 110,align: 'center', query: false, queryType: 'input', set: true, required: true },
                { field: 'maxLayer', title: '最大叠盘数', minWidth: 110,align: 'center', query: false, queryType: 'input', set: true, required: true },
                { field: 'sourceCode', title: '资源号', minWidth: 110,hide: true, align: 'center', queryType: 'input', set: true, required: true },
                { field: 'useState', title: '使用标志', minWidth: 110,align: 'center', queryType: 'select', set: true, required: true },
                { field: 'limitPltCate', title: '限制托盘类型', width:130,minWidth: 130,align: 'center', query: false, queryType: 'select', set: true, required: false }
       ]
    }
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
    return _initdata
  },
  created() {
    this.selectOptions()
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
      const _data = { url: '/api/LocInfo/GetStaInfos', params: this.queryParams }
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
      .then(data => {
          this.list = data.data
          this.total = data.total
          this.listLoading = false
          this.autoWidth()
       }).catch(err => {
          console.error(err)
       })
    },
    autoWidth(){
      //获取当页所有数据
          this.cols.forEach(col=>{
            if(col.hide) return;
          //获取每一列数据的最大长度
            //输入框
            if(col.queryType === "input")
              {
                col.innerLen = 0;
                this.list.forEach(item =>{
                  if(item[col.field].length > col.innerLen)
                    col.innerLen = item[col.field].length
                 });
              }
              //下拉框
            else if(col.queryType === "select")
              {
                col.innerLen = 0;
                this.list.forEach(item =>{
                  var stores = this.initSelect[col.field];
                  if(col.field === "fromLocFinder")
                    stores = this.fromAllLocFinder
                  else if(col.field === "toLocFinder")
                    stores = this.toAllLocFinder
                  var label = stores.filter(f=>f.value === item[col.field]);
                  if(label[0] != undefined && label[0].label.length > col.innerLen)
                     col.innerLen = label[0].label.length
                 });
              } 
            if(col.innerLen < col.title.length)
              col.innerLen = col.title.length + 2 //+2是为了排序的宽度
            //制定字符长度和宽度的比例 基础宽度48 比率 1:10
            //cols的minWidth赋值 
            if(col.innerLen!=undefined&&col.innerLen!=0)
               col.minWidth = 48 + col.innerLen * 10
          });
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
    //重置提示信息
    this.$refs['defaultForm.params'].resetFields();
       for (const p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          if (p === 'ctrlCode2') { this.defaultForm.params[p] = '#' } 
          else if (p === 'laneId') { this.defaultForm.params[p] = '#' } 
          else if (p === 'boxCode') { this.defaultForm.params[p] = '#' } 
          else if (p === 'staDeep') { this.defaultForm.params[p] = 0 } 
          else if (p === 'duplexIdx') { this.defaultForm.params[p] = 0 } 
          else if (p === 'sourceCode') { this.defaultForm.params[p] = '#' } 
          else if (p === 'useState') { this.defaultForm.params[p] = 1 } 
          else if (p === 'useFork') { this.defaultForm.params[p] = 1 } 
          else if (p === 'lanePosition') { this.defaultForm.params[p] = 0 } 
          else if (p === 'limitPltCate') { this.defaultForm.params[p] = '#' } 
          else if (p === 'maxLayer') { this.defaultForm.params[p] = 6 } 
          else this.defaultForm.params[p] = ''
        }
     }
  },
  add() {
      for (const p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          if (p === 'ctrlCode2') { this.defaultForm.params[p] = '#' } 
          else if (p === 'laneId') { this.defaultForm.params[p] = '#' } 
          else if (p === 'boxCode') { this.defaultForm.params[p] = '#' } 
          else if (p === 'staDeep') { this.defaultForm.params[p] = 0 } 
          else if (p === 'duplexIdx') { this.defaultForm.params[p] = 0 } 
          else if (p === 'sourceCode') { this.defaultForm.params[p] = '#' } 
          else if (p === 'useState') { this.defaultForm.params[p] = 1 } 
          else if (p === 'useFork') { this.defaultForm.params[p] = 1 } 
          else if (p === 'lanePosition') { this.defaultForm.params[p] = 0 } 
          else if (p === 'limitPltCate') { this.defaultForm.params[p] = '#' } 
          else if (p === 'maxLayer') { this.defaultForm.params[p] = 6 } 
          else this.defaultForm.params[p] = ''
        }
     }
    this.dialogFormVisible = true
    this.dialogtitle = this.$t('common.btn.add')
  },
  showDetails(row, column) {
  },
  edit(row) { 
    this.dialogtitle = this.$t('common.btn.edit')
    this.allowDisable = true
    this.dialogFormVisible = true 
    for(let p in this.defaultForm.params){
        if(this.defaultForm.params.hasOwnProperty(p)){
          this.defaultForm.params[p]=row[p]
        }
     }
  },
  submit(formName) {
      const _data = { url: '/api/LocInfo/AddStaInfo', params: { data: this.defaultForm.params }}
      this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$store.dispatch('fmsCommon/actionWcsPost', _data)
              .then(data => {
              this.$message({
                    type: 'success',
                    message: this.$t('common.btn.submitSuccess')
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
       // 获取搬运类型
       let _data = { url: '/api/LocInfo/GetCarryTypes', params: {}}
       this.$store.dispatch('fmsCommon/actionWcsPost', _data)
      .then(data => {
           this.initSelect.carryType = data.map(c => {
             return {
               label: c.name,
               value: c.id
             }
           })
       }).catch(err => {
          console.error(err)
       }),
       // 获取站台功能
       _data = { url: '/api/LocInfo/GetStaFuncs', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.staFunc = data.map(c => {
                  return {
                    label: c.name,
                    value: c.id
                  }
                })
            }).catch(err => {
                console.error(err)
            }),
       // 获取关联巷道
       _data = { url: '/api/Cache/LaneInfo', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.laneId = data.map(c => {
                  return {
                    label: c.laneName,
                    value: c.laneId
                  }
                })
            }).catch(err => {
                console.error(err)
            }),
            // 获取托盘类型
       _data = { url: '/api/Cache/PltCate', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.limitPltCate = data.map(c => {
                  return {
                    label: c.pltCateName,
                    value: c.pltCateId
                  }
                })
            }).catch(err => {
                console.error(err)
            }),
      // 获取站台方位
       _data = { url: '/api/LocInfo/GetStaPoss', params: {}}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
                this.initSelect.duplexIdx = data.map(c => {
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
      const _data = { url: '/api/LocInfo/AddStaInfo', params: { data: this.defaultForm.params }}
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$store.dispatch('fmsCommon/actionWcsPost', _data)
              .then(data => {
              this.$message({
                    type: 'success',
                    message: this.$t('common.btn.addSuccess')
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
                const _data = { url: '/api/LocInfo/DelStaInfo', params: { data: row.staId }}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                      this.list.splice(index, 1)
                      this.$message({
                      type: 'success',
                      message:  this.$t('common.btn.deleteSuccess')
                    })
                    this.getList()
                }).catch(err => {
                    console.error(err)
                })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common.btn.delete')+this.$t('const.result.fail')
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
