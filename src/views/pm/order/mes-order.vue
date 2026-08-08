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
      <el-button type="primary" class="filter-item" @click="query()">
        {{ $t("common.btn.query") }}
      </el-button>
      <el-button type="info"     class="filter-item" @click="reset" >
        {{ $t("common.btn.reset") }}
      </el-button>
      <el-button v-ele-show="{btnCode:'mes_order_add'}" type="primary" class="filter-item" @click="add">
        {{ $t("common.btn.add") }}
      </el-button>
    </div>
    <el-table  v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" :cell-style="cellStyle" @row-click="bomItemRowClick"  @row-dblclick="showqrcode">

      <el-table-column min-width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column v-for="(item) in cols" v-if="!item.hide" v-show="!item.hide" :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width" :min-width="item.minWidth" :align="item.align" show-overflow-tooltip>
        <template slot-scope="{row}">{{ commonFilter(row,item,row[item.field],item.field) }}</template>
        <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <!-- <el-table-column align="left" :label="$t('common.oper')" fixed="right" width="80">
        <template slot-scope="scope">
          <i v-ele-show="{btnCode:'mes_order_add'}" class="el-icon-edit" @click="edit(scope.row)" />
            &nbsp;
          <i v-ele-show="{btnCode:'mes_order_delete'}" class="el-icon-delete" @click="del(scope.$index,scope.row)" />
        </template>
      </el-table-column> -->
      <el-table-column align="left" :label="$t('common.oper')" fixed="right" width="210">
        <template slot-scope="scope">
          <el-button v-if="!(scope.row.orderState==101||scope.row.orderState==103)" size="mini" type="primary" :disabled="scope.row.orderState==101||scope.row.orderState==103" @click="productionScheduling(scope.row)" >排产</el-button>
          <el-button v-if="scope.row.orderState==101" size="mini" type="primary" @click="suspend(scope.row)" >暂停</el-button>
          <el-button v-if="scope.row.orderState==101||scope.row.orderState==102" size="mini" type="primary" @click="statement(scope.row)" >结单</el-button>

          <!-- <el-button size="mini" type="primary" @click="edit(scope.row)" >编辑</el-button>
          <el-button size="mini" type="primary" @click="del(scope.$index,scope.row)" >删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog v-el-drag-dialog :title="$t('common.btn.edit')" :visible.sync="dialogFormVisible" width="800px">
      <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="120px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item
            v-if="item.set && item.queryType==='input'"
            :label="commonI18n(item)"
            :prop="item.field"
            label-width="150px"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
          >
            <!--:disabled="item.isEdit && item.disable"-->
            <el-input v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" style="width:180px;" />
          </el-form-item>
          <el-form-item
            v-if="item.set && item.queryType==='select'"
            :label="commonI18n(item)"
            label-width="150px"
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
          <el-form-item v-if="item.set && item.queryType==='datetime'" :label="commonI18n(item)" :prop="item.field" label-width="150px">
            <el-date-picker v-model="defaultForm.params[item.field]" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :disabled="allowDisable && item.editReadonly" type="datetime" :placeholder="commonI18n(item)" style="width: 180px" />
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="destory(false)">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button v-if="defaultForm.params.id==='' || defaultForm.params.id===null" type="primary" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
        <el-button v-if="defaultForm.params.id!='' && defaultForm.params.id!=null" type="primary" @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>
    <el-dialog  :visible.sync="qrcodedialogVisible" width="300px">
      <!-- <div style="width: 100%;height: 150px;margin-left:25%;margin-bottom: 5%;"> -->
        <qrcode id="QrCode" :text="Schedulingobj.codeUrl" />
      <!-- </div> -->
      <div style="margin: 20px;margin-left:20%;margin-bottom:15%;">工单编码：{{Schedulingobj.orderNo}}</div>

    </el-dialog>
  </div>

</template>

  <script>
  import qrcode from './qrcode'
  import waves from '@/directive/waves' // waves directive
  import elDragDialog from '@/directive/el-drag-dialog'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import i18n from '@/lang'
  export default {
    name: 'PlanInfo',
    components: { Pagination,qrcode },
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
        machingPlanId: String
     },
    data() {
      const _initdata = {
        Schedulingobj:{
          codeUrl: '',
          orderNo: '',
        },
        table_mark: 'pm-order',
        qrcodedialogVisible: false,
        dialogFormVisible: false,
              allowDisable: false,
        dialogSelectFieldVisible: false,
        queryParams: {
          requestData: { }
          },
        initSelect: {
          orderState: [],
           orderType: [],
          electrode: [{ label: '正极', value: 1 }, { label: '负极', value: 2 }],
          useState: [{ label: '启用', value: 0 }, { label: '警用', value: 1 }],
          factoryNo: []
        },
        url: {
            add: '/pm-order/add',
            del: '/pm-order/del',
            list: '/pm-order/guest/query'
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
        listLoading: false,
        listQuery: {
          current: 1,
          pageSize: 15
        },
        cols: [
                  { field: 'orderNo', title: '工单编号', align: 'left', query: true, queryType: 'input', set: true, require: true, width:140 },
                  { field: 'extOrderNo', title: 'SAP单号', align: 'left', query: true, queryType: 'input', set: true, require: true, width:140 },
                  { field: 'pn', title: '产品编码', align: 'left', query: true, queryType: 'input', set: true, require: true, width:150 },
                  { field: 'pn2', title: '产品型号', align: 'left', query: false, queryType: 'input', set: true, require: true, width:150 },         
                  { field: 'factoryNo', title: '工作中心', editReadonly: true, align: 'left', query: false, queryType: 'select', set: true, require: true, width:100 },
                  { field: 'orderType', title: '工单类型', align: 'left', query: true, queryType: 'select', set: true, require: true, editReadonly: true },
                  { field: 'electrode', title: '极性', align: 'center', query: false, queryType: 'select', set: true, require: false },
                  { field: 'qty1', title: '数量', query: true, align: 'left', queryType: 'input', set: true, require: true },
                  { field: 'unit1', title: '单位', query: false, align: 'left', queryType: 'input', set: true, require: true },
                  { field: 'orderState', title: '工单状态', en_title: 'PN', align: 'left', query: true, queryType: 'select', cellStyle: 'color:red', editReadonly: true, set: true, require: true },
                  { field: 'system', title: '体系', query: false, align: 'left', queryType: 'input', set: true, require: true },
                  { field: 'priority', title: '优先级', query: false, align: 'left', queryType: 'input', set: true, require: true },
                  { field: 'workType', title: '生产类型', query: false, align: 'left', queryType: 'input', set: true, require: true },
                  { field: 'lotNo', title: '批次号', query: true, align: 'left', queryType: 'input', set: true, require: true, width:130 },
                  { field: 'createTime', title: '创建时间', en_title: 'PN', align: 'left', query: false, queryType: 'datetime', set: true, require: true, width:150 },
                  { field: 'planStartTime', title: '计划开始时间', en_title: 'PN', align: 'left', query: false, queryType: 'datetime', set: true, require: true, width:150 },
                  { field: 'planEndTime', title: '计划结束时间', align: 'left', query: false, queryType: 'datetime', set: true, require: true, width:150 },
                  { field: 'completeTime', title: '完成时间', align: 'left', query: false, queryType: 'datetime', set: true, require: true, width:150 },
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
        suspend(row){
          this.$confirm("确认执行操作?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            const _data = { url: '/pm-order/changeOrderState', params: {
              data: {
                orderNo: row.orderNo,
                state: 102,
              }
            }}
            this.$store.dispatch('fmsCommon/actionProductPost', _data)
            .then(data => {
            this.$message({
                  type: 'success',
                  message: 'change success!=>'
                })
                this.dialogFormVisible = false
                this.query()
            }).catch(err => {
                console.error(err)
            }).finally(() => {
                this.destory()
            })
          });

        

        },
        statement(row){
          this.$confirm("确认执行操作?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            const _data = { url: '/pm-order/changeOrderState', params: {
            data: {
              orderNo: row.orderNo,
              state: 103,
            }
         }}
          this.$store.dispatch('fmsCommon/actionProductPost', _data)
          .then(data => {
          this.$message({
                type: 'success',
                message: 'change success!=>'
              })
              this.dialogFormVisible = false
              this.query()
          }).catch(err => {
              console.error(err)
          }).finally(() => {
              this.destory()
          })

          });

        

        },
        showqrcode(row){
          this.qrcodedialogVisible = true;
          this.Schedulingobj.codeUrl = row.orderNo;
          this.Schedulingobj.orderNo = row.orderNo;
        },
        productionScheduling(row){
          this.$confirm("确认执行操作?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            const _data = { url: this.url.add, params: {
              data: {
                id: row.id,
                orderState: 101,
              }
            }}
            this.$store.dispatch('fmsCommon/actionProductPost', _data)
            .then(data => {
            this.$message({
                  type: 'success',
                  message: 'change success!=>'
                })
                this.dialogFormVisible = false
                this.query()
            }).catch(err => {
                console.error(err)
            }).finally(() => {
                this.destory()
            })
          });
          
         
        },
         bomItemRowClick(row, column, event) {
               this.$emit('changeBomItem', row)
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
          cellStyle(row, column, rowIndex, columnIndex) {
              //  if(field && field.hasOwnProperty("cellStyle")){
              //     return field["cellStyle"]
              //  }
              // if(row.hasOwnProperty("_$cellStyle")){
              //   console.log(row["_$cellStyle"])
              //    return row["_$cellStyle"]
              // }
               return ''
          },
          commonFilter(row, field, value, type) {
             if (this.initSelect.hasOwnProperty(type) && typeof this.initSelect[type] !== undefined && Array.isArray(this.initSelect[type])) {
                return this.getValueConvert(this.initSelect[type], value)
              }
             if (this.initSelect.hasOwnProperty(type) && !Array.isArray(this.initSelect[type]) && this.initSelect[type].hasOwnProperty(value)) {
               return this.initSelect[type][value]
             }
              // if(field && field.hasOwnProperty("cellStyle")){
              //    row['_$cellStyle'] = field["cellStyle"]
              // }
             return value
        },
      getList() {
        // let _cellStyle = {}
        // this.cols.forEach(item=>{
        //   if(item.hasOwnProperty("cellStyle")){
        //     _cellStyle[item.field+":cellStyle"] = item.cellStyle
        //    }
        // })
        Object.assign(this.queryParams, this.listQuery)
      //    //判断条件
      //    if(this.isNull(this.queryParams.requestData.ppn) && this.isNull(this.queryParams.requestData.pgn)  &&this.isNull(this.queryParams.requestData.bomNo))
      //    {
      //     this.$message({
      //        type: 'warning',
      //       message: '请输入BOM信息(图号、品号、BOM编码)不能同时为空'
      //     })
      //     return
      //    }
        this.listLoading = true
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
      isNull(val) {
        if (val == undefined || val == null || val == '') { return true }
        return false
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
        let _data = { url: '/pm-order/guest/order-states', params: {}}
         this.$store.dispatch('fmsCommon/actionProductPost', _data)
        .then(data => {
             this.initSelect.orderState = data.map(c => {
               return {
                 label: c.name,
                 value: c.value
               }
             })
         }).catch(err => {
            console.error(err)
         })
         // 获取工单类型
          _data = { url: '/pm-order/guest/order-types', params: {}}
         this.$store.dispatch('fmsCommon/actionProductPost', _data)
        .then(data => {
              // console.log(data)
             this.initSelect.orderType = data.filter(c => {
                if(c.name !='匀浆'&&c.name !='涂布'&&c.name !='辊压'&&c.name !='分切'&&c.name !='烘烤'){return c}
             }).map(val=>{
              return {
                    label: val.name,
                    value: val.value
                  }
             })
              // console.log(this.initSelect.orderType)
         }).catch(err => {
            console.error(err)
         })
        // 获取工作中心
       _data = { url: '/workshop/selectWorkshopModelAll', params: {}}
       this.$store.dispatch('fmsCommon/actionMdmPost', _data)
         .then(data => {
           this.initSelect.factoryNo = data.map(c => {
             return {
               label: c.workName,
               value: c.workNo
             }
           })
         }).catch(err => {
         console.error(err)
       })
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
  /deep/ .el-dialog__body {
    border-top: none;
  }
  .el-form-item {
      margin-bottom: 8px !important;
  }
  </style>
