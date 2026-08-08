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
            <el-button size="mini" type="primary" :disabled="scope.row.completeState == 'Y'" @click="finish(scope.row)" >完成</el-button>
            <el-button size="mini" type="primary" @click="edit(scope.row)" >编辑</el-button>
            <el-button size="mini" type="primary" :disabled="scope.row.completeState == 'Y'" @click="del(scope.$index,scope.row)" >删除</el-button>
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
              v-if="item.set && item.queryType==='textarea'"
              :label="commonI18n(item)"
              :prop="item.field"
              label-width="150px"
              :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
            >
              <!--:disabled="item.isEdit && item.disable"-->
              <el-input
                type="textarea"
                :rows="1"
                v-model="defaultForm.params[item.field]"
                :disabled="allowDisable && item.editReadonly" style="width:180px;"
              >
              </el-input>
              <!-- <el-input v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" style="width:180px;" /> -->
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
          <el-button :disabled="rowData.completeState == 'Y'" v-if="defaultForm.params.id!='' && defaultForm.params.id!=null" type="primary" @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
        </div>
      </el-dialog>
      <el-dialog v-el-drag-dialog :title="'编辑'" :visible.sync="dialogfinsh" width="40%">
        <el-form ref="form" :model="finshobj" label-width="35%">

        <el-form-item label="处置结论:">
          <el-select  v-model="finshobj.checkConclusion" placeholder="请选择" style="width: 180px"   class="filter-item" >
          <el-option
          v-for="item in initSelect.decsisonState"
          :key="item.value"
          :label="item.name"
          :value="item.value">
          </el-option>
        </el-select>
        </el-form-item>

       
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="finishsave">确 定</el-button>
        </span>
        <!-- <el-button type="primary" class="filter-item" @click="textareasave" >
          保存
       </el-button> -->
      </el-dialog>
    </div>
  
  </template>
  
    <script>
    // import qrcode from './qrcode'
    import waves from '@/directive/waves' // waves directive
    import elDragDialog from '@/directive/el-drag-dialog'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    import i18n from '@/lang'
    export default {
      name: 'disposal',
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
          machingPlanId: String
       },
      data() {
        const _initdata = {
          Schedulingobj:{
            codeUrl: '',
            orderNo: '',
          },
          finshobj:{
            checkConclusion: '',
            id: '',
          },
          table_mark: 'ng-disposal',
          qrcodedialogVisible: false,
          dialogfinsh:false,
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
              add: '/ng-disposal/add',
              del: '/ng-disposal/del',
              list: '/ng-disposal/items'
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
          rowData:{},
          addcols:[],
          editcols:[],
          cols: [
            { field: 'orderNo', title: '工单', query: false, align: 'left', queryType: 'input', set: true, require: true, editReadonly:true, },
            { field: 'sn', title: '条码/编码', align: 'left', query: false, queryType: 'input', set: true, require: false, width:140, editReadonly:true },
            // { field: 'createTime', title: '创建时间', query: false, align: 'left', queryType: 'datetime', set: true, require: true, width:130 },
            { field: 'processNo', title: '工序', align: 'left', query: false, queryType: 'input', set: true, require: true, width:150, editReadonly:true },
            { field: 'qcSName', title: '标准单', align: 'left',hide:false, query: false, queryType: 'input', set: true, require: true, width:140, editReadonly:true },
            { field: 'qcSCode', title: '检验单', en_title: 'PN', align: 'left', query: false, queryType: 'input', set: true, require: true, width:150 },
            // { field: 'factoryNo', title: '工厂', editReadonly: false, align: 'left', query: false, queryType: 'input', set: true, require: false, width:100 },
            { field: 'deviceNo', title: '设备', align: 'left', query: true, queryType: 'input', set: true, require: true, editReadonly: false },
            { field: 'description', title: '异常原因', align: 'center', query: false, queryType: 'textarea', set: true, require: false },
            { field: 'disposal', title: '处置流程', query: true, align: 'left', queryType: 'input', set: true, require: true },
            // { field: 'decsisonUseer', title: '处置人', query: false, align: 'left', queryType: 'input', set: true, require: true },
            { field: 'decsisonState', title: '处置结论', en_title: 'PN', align: 'left', query: false, queryType: 'select', cellStyle: 'color:red', editReadonly: true, set: false, require: true },
            // { field: 'decsisonTime', title: '处置时间', query: false, align: 'left', queryType: 'input', set: true, require: true },
            { field: 'scopeDesc', title: '异常描述', query: false, align: 'left', queryType: 'input', set: true, require: true },
            { field: 'udf1', title: '不良数量', query: false, align: 'left', queryType: 'input', set: true, require: true },
            { field: 'udf2', title: '影响数量', query: false, align: 'left', queryType: 'input', set: true, require: true },
            { field: 'udf3', title: '异常情况复核人', query: false, align: 'left', queryType: 'input', set: true, require: true },
            { field: 'udf4', title: '影响工序', query: false, align: 'left', queryType: 'input', set: true, require: true },
            { field: 'udf5', title: '品质审核人', query: false, align: 'left', queryType: 'input', set: true, require: true },
            { field: 'lotNo', title: '批次', query: false, align: 'left', queryType: 'input', set: true, require: true, width:130 }
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
        finishsave(){
          // console.log(this.finshobj);

          if(this.finshobj.id){
            const _data = { url: '/ng-disposal/complete ', params: {data: this.finshobj} }
                  this.$store.dispatch('fmsCommon/actionProductPost', _data)
                    .then(data => {
                      this.tableData = data
                      this.finshobj = {
                        checkConclusion:'',
                        id:'',
                      }
                        this.$message({
                        type: 'success',
                        message: '完成'
                      });
                      this.getList()
                      this.dialogfinsh = false
                      
                      
                    }).catch(err => {
                      console.error(err)
                  })
          }
        },
          finish(row){

            this.dialogfinsh = true
            this.finshobj.id = row.id
          },
          showqrcode(row){
            this.qrcodedialogVisible = true;
            this.Schedulingobj.codeUrl = row.orderNo;
            this.Schedulingobj.orderNo = row.orderNo;
          },
          productionScheduling(row){
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
        this.rowData = row
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
         const _data1 = { url: '/process/guest/getAll'}
            this.$store.dispatch('fmsCommon/actionMdmPost', _data1)
            .then(data => {
               // console.log(data);
              this.initSelect['processNo'] = data.map(c=>{
                return {
                  label:c.pcName,
                  value:c.pcNo
                }
              })
              }).catch(err => {
                console.error(err)
              })
           // 初始化线体信息
          let _data2 = { url: '/prod-constant/disposal-states', params: {}}
           this.$store.dispatch('fmsCommon/actionProductPost', _data2)
          .then(data => {
               this.initSelect.decsisonState = data.map(c => {
                 return {
                   name: c.name,
                   value: c.value
                 }
               })
           }).catch(err => {
              console.error(err)
           })
          // let _data1 = { url: '/prod-constant/qc-states', params: {}}
          //  this.$store.dispatch('fmsCommon/actionProductPost', _data1)
          // .then(data => {
          //      this.initSelect.description = data.map(c => {
          //        return {
          //          label: c.name,
          //          value: c.value
          //        }
          //      })
          //  }).catch(err => {
          //     console.error(err)
          //  })
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
               this.initSelect.orderType = data.map(c => {
                 return {
                   label: c.name,
                   value: c.value
                 }
               })
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
  