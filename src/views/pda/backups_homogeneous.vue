<template>
  <div class="app-container">
    <!-- <el-button type="primary" class="filter-item" @click="productclick" :disabled='multipleSelection.length === 0'>
        {{ "开始生产" }}
      </el-button> -->
    <el-table  ref="multipleTable" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @row-click="rowClick" >
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
      <!-- <el-table-column align="center" :label="$t('common.oper')" fixed="right" width="100">
        <template slot-scope="scope">
          <el-button type="primary" class="filter-item"  @click="add(scope.row)" >
             {{'开始生产'}}
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" :small='true' /> -->
      <el-button style="margin-top:10px" type="primary" class="filter-item"  @click="add" >
             {{'新建工单'}}
      </el-button>
    <div style="margin-top:10px">
       <el-table  ref="multipleTable" v-loading="listLoading" :data="homogenateData" border fit highlight-current-row style="width: 100%">
      <el-table-column min-width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column v-for="(item) in cols_second" v-if="!item.hide" v-show="!item.hide" :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width" :min-width="item.minWidth" :align="item.align" show-overflow-tooltip>
        <template slot-scope="{row}">{{ commonFilter(row[item.field],item.field) }}</template>
        <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="center" :label="$t('common.oper')" fixed="right" width="100">
        <template slot-scope="scope">
          <el-button type="primary" class="filter-item"  @click="showcomplete_modal(scope.row)" >
             {{'完成生产'}}
          </el-button>
          <!-- <i v-ele-show="{btnCode:'bake_del'}" class="el-icon-delete" @click="del(scope.$index,scope.row)" /> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" :small='true' />
    </div>
    
    <el-dialog v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="90%" >
      <el-form ref="ruleForm" :inline="true" :model="defaultForm.params" label-width="120px">
        <div v-for="(item) in dialogform" :key="item.id" style="display:inline">
          <el-form-item
            v-if="item.set && item.queryType==='input'"
            :label="commonI18n(item)"
            :prop="item.field"
            label-width="120px"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
          >
            <!--:disabled="item.isEdit && item.disable"-->
            <el-input @input="$forceUpdate()" v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" style="width:180px;" />
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
            <el-date-picker @change="$forceUpdate()" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :disabled="allowDisable && item.editReadonly"  v-model="defaultForm.params[item.field]"  type="datetime"    :placeholder="commonI18n(item)"  style="width: 180px"> </el-date-picker>
          </el-form-item>
          <el-form-item  v-if="item.set && item.queryType==='date'"  :label="commonI18n(item)" :prop="item.field" >
            <el-date-picker @change="$forceUpdate()" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="allowDisable && item.editReadonly"  v-model="defaultForm.params[item.field]"  type="date"    :placeholder="commonI18n(item)"  style="width: 180px"> </el-date-picker>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="destory(false)">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button v-if="defaultForm.params.id==='' || defaultForm.params.id===null" type="primary" @click="save('defaultForm.params')">  {{ $t('开始生产') }}</el-button>
        <el-button v-if="defaultForm.params.id!='' && defaultForm.params.id!=null" type="primary" @click="submit('defaultForm.params')">  {{ '完成生产' }}</el-button>
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
  name: 'Bake',
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
  },
  data() {
    const _initdata = {
      table_mark: 'pm_bake_list',
      dialogTitle: '',
      dialogFormVisible: false,
      allowDisable: false,
      dialogSelectFieldVisible: false,
      value: new Date(),
      url: {
        add: '/bake/add',
        del: '/bake/del',
        list: '/pm-order/guest/allowProductByOrderType',
        startProduct: '/homogenate/startProduct',
      },
      queryParams: {
        requestData: { }
      },
      initSelect: {
        trayType: [],
        useState: [{ label: '启用', value: 0 }, { label: '禁用', value: 1 }]
      },
      defaultForm: {
        row: {},
        params: {
          id: ''
        }
      },
      complete_defaultForm: {
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
      dialogform: [],
      homogenateData: [],
      multipleSelection: [],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 15
      },
      cols: [
        { field: 'pn', title: 'PN', align: 'left', query: true, queryType: 'input', set: true, require: false },
        { field: 'planStartTime', title: '计划开始时间', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'planEndTime', title: '计划结束时间', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'orderNo', title: '内部工单码', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'factoryNo', title: '工厂编码', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'orderType', title: '工单类型', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'workType', title: '生产类型', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'system', title: '工单体系', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'orderState', title: '工单状态', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'capacity', title: '标称容量', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'hasMat', title: '物料齐套状态', align: 'left', query: false, queryType: 'input', set: true, require: false }
      ],
      cols_second: [
        { field: 'deviceNo', title: '设备编码', align: 'left', query: true, queryType: 'input', set: true, require: true },
        { field: 'panTime', title: '锅次编码', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'orderNo', title: '工单', align: 'left', query: false, queryType: 'input', set: true, require: false,editReadonly:true },
        { field: 'inStation', title: '上料时间', align: 'left', query: false, queryType: 'datetime', set: true, require: true },
        { field: 'outStation', title: '出料时间', align: 'left', query: false, queryType: 'datetime', set: true, require: true },
        { field: 'fqc', title: 'FQC状态码', align: 'left', query: false, queryType: 'datetime', set: true, require: true },
        { field: 'pn', title: '产品编码', align: 'left', query: true, queryType: 'input', set: true, require: false },
        { field: 'person', title: '人员', align: 'left', query: false, queryType: 'input', set: true, require: true },
        { field: 'workShfit', title: '班次', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'solidContent', title: '固含量', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'consistency', title: '粘稠度', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'weight', title: '出料重量', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'packNo', title: '领料单', align: 'left', query: false, queryType: 'input', set: true, require: true },
      ],
      completemodal_cloumns: [
        { field: 'id', title: 'id', align: 'left', query: false, queryType: 'input', require: false,editReadonly:true },
        { field: 'orderNo', title: '工单', align: 'left', query: false, queryType: 'input', set: true, require: false,editReadonly:true },
        { field: 'outStation', title: '出料时间', align: 'left', query: false, queryType: 'datetime', set: true, require: true },
        { field: 'solidContent', title: '固含量', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'consistency', title: '粘稠度', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'weight', title: '出料重量', align: 'left', query: false, queryType: 'input', set: true, require: false },

      ],
      beginProdectioncols: [
        { field: 'id', title: 'id', align: 'left', query: false, queryType: 'input', require: false,editReadonly:true },
        { field: 'orderNo', title: '工单', align: 'left', query: false, queryType: 'input', set: true, require: false,editReadonly:true },
        { field: 'deviceNo', title: '设备编码', align: 'left', query: true, queryType: 'input', set: true, require: true },
        { field: 'panTime', title: '锅次编码', align: 'left', query: false, queryType: 'input', set: true, require: true },
        { field: 'inStation', title: '上料时间', align: 'left', query: false, queryType: 'datetime', set: true, require: true },
        { field: 'person', title: '人员', align: 'left', query: false, queryType: 'input', set: true, require: true },
        { field: 'workShfit', title: '班次', align: 'left', query: false, queryType: 'input', set: true, require: false },
        { field: 'packNo', title: '领料单', align: 'left', query: false, queryType: 'input', set: true, require: true }
      ]
    }
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.beginProdectioncols))
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
    this.getList()
    this.selectOptions()
  },
  methods: {
    selectOptions(){
       let  _data = {url:'/pm-order/guest/order-states',params:{}}
         this.$store.dispatch('fmsCommon/actionProductPost',_data)
        .then(data => {
             this.initSelect.orderState = data.map(c=>{
               return {
                 label:c.name,
                 value:c.value
               }
             })
         }).catch(err => {
            console.error(err)
         })
         //获取工单类型
          _data = {url:'/pm-order/guest/order-types',params:{}}
         this.$store.dispatch('fmsCommon/actionProductPost',_data)
        .then(data => {
             this.initSelect.orderType = data.map(c=>{
               return {
                 label:c.name,
                 value:c.value
               }
             })
         }).catch(err => {
            console.error(err)
         })
    },
    // productclick(){
    //   console.log(this.multipleSelection);
    //   this.add()
    //   this.allowDisable = true
    //   this.defaultForm.params.orderNo = this.multipleSelection.orderNo
    // },
    // handleSelectionChange(val) {
    //     this.multipleSelection = val[0];

    //     if(val.length > 1) {
    //       this.$refs.multipleTable.toggleRowSelection(val[0],false)
    //       this.multipleSelection = val[1];
    //     }
       
    // },
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
      const _data = { url: this.url.list, params: {factoryNo:'YJ',orderType:'ZP'} }
      this.$store.dispatch('fmsCommon/actionProductPost', _data)
        .then(data => {
          // console.log(data)
          this.list = [data]
          // this.total = data.total
          // this.listLoading = false
        }).catch(err => {
        console.error(err)
      })
      const _data1 = { url: '/homogenate/list', params: this.listQuery }
      this.$store.dispatch('fmsCommon/actionProductPost', _data1)
        .then(data => {
          console.log(data)
          this.homogenateData = data.data
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
    // destory(hide = false) {
    //   this.dialogFormVisible = hide
    //   console.log(this.$refs.ruleForm);

    //    this.$refs.ruleForm.resetFields()
    //   for (const p in this.defaultForm.params) {
    //     if (this.defaultForm.params.hasOwnProperty(p)) {
    //       this.defaultForm.params[p] = ''
    //     }
    //   }
    // },
     destory(hide=false){
    this.dialogFormVisible = hide
    this.$nextTick(()=>{   
      console.log(this.$refs.ruleForm);
      this.$refs.ruleForm.clearValidate() 
                this.$refs.ruleForm.resetFields(); })
       for(let p in this.defaultForm.params){ 
        this.defaultForm.params[p]='' 
     }
  },
    showcomplete_modal(row) {
      this.dialogTitle = '完成生产'
      this.dialogform = this.completemodal_cloumns;
      this.allowDisable = true;
      // this.defaultForm.params={}
      // Object.assign(this.defaultForm.params, this.initData(this.completemodal_cloumns))
      this.defaultForm.params={
        id:'',
        orderNo:'',
        outStation:'',
        solidContent:'',
        consistency:'',
        weight:'',
      }
      this.destory(true)

      this.defaultForm.params.orderNo = row.orderNo
      this.defaultForm.params.id = row.id
      console.log(this.dialogform);

    },
    add() {
      this.dialogTitle = '新建工单'
      this.dialogform = this.beginProdectioncols;
      this.allowDisable = true;
      this.defaultForm.params={
        id:'',
        orderNo:'',
        deviceNo:'',
        panTime:'',
        inStation:'',
        person:'',
        workShfit:'',
        packNo:'',
      }
      // Object.assign(this.defaultForm.params, this.initData(this.beginProdectioncols)) 使用循环会影响页面刷新 form会不响应
      this.destory(true)
      this.defaultForm.params.orderNo = this.list[0].orderNo
      this.defaultForm.params.id = ''
      console.log(this.defaultForm.params);

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
      const _data = { url: '/homogenate/completeProduct', params: this.defaultForm.params}
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$store.dispatch('fmsCommon/actionProductPost', _data)
            .then(data => {
              console.log(data);
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
    save(formName) {
      this.defaultForm.row = {}
      this.defaultForm.params.id = ''
      const _data = { url: this.url.startProduct, params: this.defaultForm.params}
      this.$refs.ruleForm.validate((valid) => {
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
  width: 80px;
  display: flex;
  justify-content: center;
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

::v-deep .el-table .has-gutter .el-checkbox .el-checkbox__inner {
  display: none;
}

::v-deep .el-table .cell::before {
  content: '';
  text-align: center;
  line-height: 37px;
}
</style>
