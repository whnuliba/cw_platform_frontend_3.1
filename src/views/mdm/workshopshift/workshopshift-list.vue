<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item,index) in cols" :key="index" style="display:inline">
        <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 150px" class="filter-item">
          <!-- {{queryParams.requestData[item.field]=''}} -->
        </el-input>
        <el-select v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
          <el-option
            v-for="item in initSelect[item.field]"
            :key="item.value"
            :label="commonI18n(item)"
            :value="item.value"
          />
        </el-select>
        <el-date-picker v-if="item.query && item.queryType==='datetime'" v-model="queryParams.requestData[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="commonI18n(item)" style="width: 150" class="filter-item" />
        <el-date-picker v-if="item.query && item.queryType==='date'" v-model="queryParams.requestData[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="date" :placeholder="commonI18n(item)" style="width: 150" class="filter-item" />
      </div>
      <el-button type="primary" class="filter-item" @click="query">
        {{ $t("common.btn.query") }}
      </el-button>
      <el-button type="info" class="filter-item" @click="reset">
        {{ $t("common.btn.reset") }}
      </el-button>
      <el-button v-ele-show="{btnCode:'workshopshift_add'}" type="warning" class="filter-item" @click="add">
        {{ $t("common.btn.add") }}
      </el-button>
    </div>
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
      <el-table-column align="left" :label="$t('common.oper')" fixed="right" width="80">
        <template slot="header" slot-scope="scope">
          {{ $t('common.oper') }} <i style="margin-left: 10px;cursor:pointer;" class="el-icon-bank-card" @click="selectFields" />
        </template>
        <template slot-scope="scope">
          <i v-ele-show="{btnCode:'workshopshift_edit'}" class="el-icon-edit" @click="edit(scope.row)" />
          &nbsp;
          <i v-ele-show="{btnCode:'workshopshift_del'}" class="el-icon-delete" @click="del(scope.$index,scope.row)" />
        </template>
      </el-table-column>
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
            <el-select v-model="defaultForm.params[item.field]" placeholder="..." style="width:180px;" @change="(v)=>changeSelect(v,item.field)">
              <el-option
                v-for="item in initSelect[item.field]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
         <el-form-item v-if="item.set && item.queryType==='cascader'" :label="item.title" :prop="item.field"
                        :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]">
            <el-cascader
              ref="xzCascader"
              :show-all-levels="false"
              :options="initSelect[item.field]"
              :props="{ value: 'id',label: 'name',children: 'children', checkStrictly: true, multiple: true}"
              v-model="defaultForm.params[item.field]"
              style="width:180px;"  
            >
            </el-cascader>
          </el-form-item>
         <el-form-item v-if="item.set && item.queryType==='personselect'" :label="item.title" :prop="item.field"
                        :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]">
              <elTreeSelect :slectvalue.sync="defaultForm.params[item.field]" style="width:180px;" :multiple='true'  />
            
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
import elTreeSelect from '@/components/pessontreeselect'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import i18n from '@/lang'
export default {
  name: 'WorkshopShift',
  components: { Pagination, elTreeSelect},
  directives: { waves, elDragDialog,},
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
    workshopShiftId: String
  },
  data() {
    const _initdata = {
      table_mark: 'mdm_wss_lst',
      dialogFormVisible: false,
      allowDisable: false,
      dialogSelectFieldVisible: false,
      url: {
        add: '/workshopShift/saveWorkshopShiftAndPerson',
        del: '/workshopShift/del',
        list: '/workshopShift/list'
      },
      queryParams: {
        requestData: { }
      },
      initSelect: {
        trayType: [],
        useState: [{ label: '启用', value: 0 }, { label: '禁用', value: 1 }],
        wshopId: [],
        wshiftId: []
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
      shiftIdData: [],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 15
      },
      cols: [
        { field: 'clzNo', title: '班组编号', align: 'left', query: true, queryType: 'input', editReadonly: true, set: true, require: true },
        { field: 'clzName', title: '班组名称', align: 'left', query: true, queryType: 'input', set: true, require: true },
        { field: 'grpLeader', title: '班组长', align: 'left', query: false, queryType: 'input', set: true, require: true },
        { field: 'wshopId', title: '车间', align: 'left', query: true, queryType: 'select', set: true, require: false },
        { field: 'wshiftId', title: '班次', align: 'left', query: false, queryType: 'select', set: true, require: false },
        { field: 'status', title: '状态', align: 'left', width: '80px', queryType: 'input', set: false, require: false },
        { field: 'createTime', title: '创建时间', align: 'center', width: '145px', queryType: 'datetime', set: false, require: false },
        { field: 'mdmWorkShiftDeptList', title: '部门', align: "left",queryType: 'cascader', set: true, query: true, hide: true, require: false },
        { field: 'mdmWorkShiftPersonList', title: '人员', align: "left",queryType: 'personselect', set: true, query: true, hide: true, require: false },
      ]
    }
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
    return _initdata
  },
  created() {
    this.getallwshiftIdData()
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
    this.getPersonData()
    this.getList()
    this.selectOptions()
  },
  methods: {
    getallwshiftIdData(){
        const _data = { url: '/workShift/guest/selectWorkShiftAll', params: {}}
        this.$store.dispatch('fmsCommon/actionMdmPost', _data)
        .then(data => {
          this.shiftIdData = data.map(item=>{
            item['label'] =  item.shiftName
            item['value'] =  item.id
            return item
          })
        }).catch(err => {
          console.error(err)
        })
    },
    getPersonData(){
     
    },
    changeSelect(v,field){
      if(field == 'wshopId'){
        this.defaultForm.params.wshiftId = ''
        const _data = { url: '/workShift/guest/selectByWsNo', params: {data:v}}
        this.$store.dispatch('fmsCommon/actionMdmPost', _data)
        .then(data => {
          this.initSelect.wshiftId = data.map(c => {
            return {
              label: c.shiftName,
              value: c.id
            }
          })
        }).catch(err => {
          console.error(err)
        })
      }
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
      if(type == 'wshiftId'){
          return this.getValueConvert(this.shiftIdData, value)
      }
      if (this.initSelect.hasOwnProperty(type) && typeof this.initSelect[type] !== undefined && Array.isArray(this.initSelect[type]) ) {
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
      this.$store.dispatch('fmsCommon/actionMdmPost', _data)
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
      this.defaultForm.params.person = '6da4afdbc92a4b91b44d07d43b23feda'
    },
    showDetails(row, column) {
    },
    getParentsById(list, id) {
      for (let i in list) {
          if (list[i].id == id) {
              //查询到就返回该数组对象的value
              return [list[i].id]
          }
          if (list[i].children) {
              let node = this.getParentsById(list[i].children, id)
              if (node !== undefined) {
                  //查询到把父节把父节点加到数组前面
                  node.unshift(list[i].id)
                  return node
              }
          }
      }
    },
    edit(row) {
      let _this = this
      const _data = { url: '/workshopShift/selectById', params: {data:row.id}}
      this.$store.dispatch('fmsCommon/actionMdmPost', _data)
        .then(data => {
          this.dialogFormVisible = true
          this.allowDisable = true
          for (const p in this.defaultForm.params) {
            if (this.defaultForm.params.hasOwnProperty(p)) {
              this.defaultForm.params[p] = data[p]
            }
          }
          if(data.mdmWorkShiftDeptList.length>0){
             this.defaultForm.params.mdmWorkShiftDeptList = data.mdmWorkShiftDeptList.map(item=>{
              return  _this.getParentsById(_this.initSelect['mdmWorkShiftDeptList'], item.deptId)
            })
          }

        }).catch(err => {
        console.error(err)
      })
     
    },
    submit(formName) {
      let arr = []
      let personarr = []
      if(this.defaultForm.params.mdmWorkShiftDeptList){
        arr = this.defaultForm.params.mdmWorkShiftDeptList.map(item=>{
          return {
            deptId:item[item.length-1]
          }
        })
      }
      if(this.defaultForm.params.mdmWorkShiftPersonList){
        personarr = this.defaultForm.params.mdmWorkShiftPersonList.map(item1=>{
          return {
            userName: item1.realName,
            userId: item1.userId ? item1.userId : item1.id,
          }
        })
      }
      const _data = { url: this.url.add, params: {
          data: {...this.defaultForm.params,
            mdmWorkShiftDeptList: arr,
            mdmWorkShiftPersonList: personarr
          }
        }}
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('fmsCommon/actionMdmPost', _data)
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
    loop(data) {
        const res = []
        data.forEach((item=>{
          if(item.children&&item.children.length>0){
            item.children = this.loop(item.children, item.id)
          }else{
            delete item.children
          }
          res.push(item)
        }))
       
        return res
      },
    selectOptions() {
      const _departmentdata = { url: "/org/org-tree", params: {}}
      this.$store.dispatch('fmsCommon/actionAuthPost', _departmentdata)
        .then(data => {
          this.initSelect['mdmWorkShiftDeptList'] = data
          this.initSelect['mdmWorkShiftDeptList'] = this.loop(data)
        }).catch(err => {
        console.error(err)
      })
      // 初始化线体信息
      const _data = { url: '/workshop/guest/getall', params: {}}
      this.$store.dispatch('fmsCommon/actionMdmPost', _data)
        .then(data => {
          this.initSelect.wshopId = data.map(c => {
            return {
              label: c.wsName,
              value: c.id
            }
          })
        }).catch(err => {
        console.error(err)
      })
      const _dataShift = { url: '/workShift/guest/selectWorkShiftAll', params: {}}
      this.$store.dispatch('fmsCommon/actionMdmPost', _dataShift)
        .then(data => {
          this.initSelect.wshiftId = data.map(c => {
            return {
              label: c.shiftName,
              value: c.id
            }
          })
        }).catch(err => {
        console.error(err)
      })
      // 初始化工序信息
    },
    save(formName) {
      this.defaultForm.params.id = ''
      this.defaultForm.row = {}
      let deparr = []
      let personarr = []
      if(this.defaultForm.params.mdmWorkShiftDeptList){
        deparr = this.defaultForm.params.mdmWorkShiftDeptList.map(item=>{
          return {
            deptId:item[item.length-1]
          }
        })
      }
      if(this.defaultForm.params.mdmWorkShiftPersonList){
        personarr = this.defaultForm.params.mdmWorkShiftPersonList.map(item1=>{
          return {
            userName: item1.realName,
            userId: item1.userId ? item1.userId : item1.id,
          }
        })
      }
      const _data = { url: this.url.add, params: {
          data: {...this.defaultForm.params,
            mdmWorkShiftDeptList: deparr,
            mdmWorkShiftPersonList: personarr,
          }
        }}
      // const _data = { url: this.url.add, params: { data: this.defaultForm.params }}
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('fmsCommon/actionMdmPost', _data)
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
        this.$store.dispatch('fmsCommon/actionMdmPost', _data)
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
