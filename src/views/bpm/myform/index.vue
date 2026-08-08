<template>
  <div class="app-container">
      <div class="filter-container">
          <div v-for="(item,index) in cols" :key="index" style="display:inline">
              <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]"
                  :placeholder="item.title" style="width: 120px" class="filter-item">
                  <!-- {{queryParams.requestData[item.field]=''}} -->
              </el-input>
              <el-select v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]"
                  :placeholder="item.title" style="width: 120px" class="filter-item">
                  <el-option v-for="item in initSelect[item.field]" :key="item.value" :label="item.label"
                      :value="item.value">
                  </el-option>
              </el-select>
              <el-date-picker v-if="item.query && item.queryType==='datetime'" format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]" type="datetime"
                  :placeholder="item.title" style="width: 150" class="filter-item"> </el-date-picker>
              <el-date-picker v-if="item.query && item.queryType==='date'" format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]" type="date"
                  :placeholder="item.title" style="width: 150" class="filter-item"> </el-date-picker>

          </div>
          <el-button type="primary" class="filter-item" @click="query()">
              {{ $t("common.btn.query") }}
          </el-button>
          <el-button type="info" class="filter-item" @click="reset">
              {{ $t("common.btn.reset") }}
          </el-button>
          <!-- <el-button type="warning" class="filter-item" @click="add">
              {{ $t("common.btn.add") }}
          </el-button> -->
      </div>
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"
          @row-dblclick="showDetails">

          <el-table-column min-width="50px" label="序号" align="center">
              <template slot-scope="scope">
                  <span>{{scope.$index+1}}</span>
              </template>
          </el-table-column>
          <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
          <el-table-column v-for="(item) in cols" :key="item.id" :label="item.title" :prop="item.field"
              :width="item.width" :min-width="item.minWidth" v-if="!item.hide" :align="item.align"
              show-overflow-tooltip>
              <template slot-scope="{row}">{{commonFilter(row[item.field],item.field)}}</template>
              <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
          </el-table-column>
          <el-table-column align="center" label="操作" fixed="right" width="100">
              <template slot-scope="scope">
                  <el-button type="primary" size="small" icon="el-icon-edit" @click="toFlowView(scope.row)">
                      {{ $t("common.btn.view") }}
                  </el-button>
                  &nbsp;
              </template>
          </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize"
          @pagination="getList" />
      <el-dialog title="编辑" v-el-drag-dialog :visible.sync="dialogFormVisible" width="700px">
          <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="80px">
              <div v-for="(item) in cols" :key="item.id" style="display:inline">
                  <el-form-item v-if="item.set && item.queryType==='input'" :label="item.title" :prop="item.field"
                      :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]">
                      <!--:disabled="item.isEdit && item.disable"-->
                      <el-input v-model="defaultForm.params[item.field]" style="width:220px;"
                          :disabled="allowDisable && item.editReadonly" />
                  </el-form-item>
                  <el-form-item v-if="item.set && item.queryType==='select'" :label="item.title"
                      :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'change' }]">
                      <el-select v-model="defaultForm.params[item.field]" @change="$forceUpdate()"
                          :disabled="allowDisable && item.editReadonly" placeholder="请选择" style="width:220px;">
                          <el-option v-for="item in initSelect[item.field]" :key="item.value" :label="item.label"
                              :value="item.value">
                          </el-option>
                      </el-select>
                  </el-form-item>
              </div>

          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="destory(false)"> {{ $t("common.btn.cancel") }}</el-button>
              <el-button type="primary" v-if="defaultForm.params.id==='' || defaultForm.params.id===null"
                  @click="save('defaultForm.params')"> {{ $t("common.btn.save") }}</el-button>
              <el-button type="primary" v-if="defaultForm.params.id!='' && defaultForm.params.id!=null"
                  @click="submit('defaultForm.params')"> {{ $t("common.btn.submit") }}</el-button>
          </div>
      </el-dialog>
  </div>

</template>

<script>
  import waves from "@/directive/waves"; // waves directive
  import elDragDialog from "@/directive/el-drag-dialog";
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import i18n from '@/lang';
  export default {
      name: 'approvalList',
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
              queryParams: {
                  requestData: {}
              },
              initSelect: {
                  trayType: [],
                  status: [{ label: '启用', value: 0 }, { label: '禁用', value: 1 }],
              },
              defaultForm: {
                  row: {},
                  params: {
                      id: '',
                  }
              },
              list: null,
              total: 0,
              listLoading: true,
              listQuery: {
                  current: 1,
                  pageSize: 15
              },
              cols: [
                  { field: 'docNo', title: '文档编码', minWidth: 100, align: "center", query: true, queryType: 'input', set: true, require: true, editReadonly: true },
                  { field: 'docName', title: '文档名称', minWidth: 100, align: "center", query: true, queryType: 'input', set: true, require: true },
                  // { field: 'docUri', title: '文档地址', align: 'center', queryType: 'input', set: true, require: true },
                  // { field: 'udf1', title: '不良数量', query: false, align: 'left', queryType: 'input', set: true, require: true },
                  // { field: 'udf2', title: '影响数量', query: false, align: 'left', queryType: 'input', set: true, require: true },
                  // { field: 'udf3', title: '异常情况复核人', query: false, align: 'left', queryType: 'input', set: true, require: true },
                  // { field: 'udf4', title: '影响工序', query: false, align: 'left', queryType: 'input', set: true, require: true },
                  // { field: 'udf5', title: '品质审核人', query: false, align: 'left', queryType: 'input', set: true, require: true },
                  { field: 'approveState', title: '审批状态', align: 'center', query: true, queryType: 'select', set: true, require: true },
                  // { field: 'status', title: '使用状态', align: 'center', query: true, queryType: 'select', set: true, require: true },
                  { field: 'tempDocNo', title: '模板', align: 'left' },
                  { field: 'createTime', title: '创建日期', align: 'center' },
                  { field: 'createUser', title: '创建人', align: 'center' },
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
              let args = {}
              arr.map(c => {
                  if (c.set) {
                      args[c.field] = null
                  }
              })
              console.log("args", args)
              return args
          },
          commonFilter(value, type) {

              if (this.initSelect.hasOwnProperty(type) && typeof this.initSelect[type] != undefined && Array.isArray(this.initSelect[type])) {
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
              const _data = { url: '/wf-doc-approve/items', params: this.queryParams }
              this.$store.dispatch('fmsCommon/actionTaskPost', _data)
                  .then(data => {
                      this.list = data.data
                      this.total = data.total
                      this.listLoading = false
                  }).catch(err => {
                      console.error(err)
                  })
          },

          toFlowView(row){ 
              let cpName = undefined
                let cp = row.tempDocUri
               if (cp && cp != null && cp.indexOf("\\") != -1)
                   cp = cp.replace("\\", "/");
                if(!cp.startsWith("/")){
                    cp = `/${cp}`
                }
                console.log(cp)
                this.$router.push({
                    path:cp,
                    query:{id:row.id,sourceType:'FORM'}

                })


            //     if (cp && cp != null && cp.indexOf("\\") != -1)
            //         cp = cp.replace("\\", "/");

            //     if (cp) {
            //     let apArr = cp.split("/");
            //     if (apArr.length) 
            //     cpName = apArr[apArr.length-1];
            //     if(apArr.length>=2){
            //         this.$router.push({
            //         //path: row.docUri,
            //         //name: row.docUri,
            //         name: cpName,
            //         // prop: true,
            //         params: {bizType: apArr[apArr.length-2],bizCode:cpName,  formFlowData:{docId:row.id,sourceId:row.id,sourceData:row,sourceType: 'FORM'} },
            //         });
            //     }else{
            //         this.$router.push({
            //         name: row.docUri,
            //         params: {   formFlowData:{docId:row.id,sourceId:row.id,sourceData:row,sourceType: 'FORM'} },
            //         })
            //     }
            //  }
          },

          getValueConvert(arr, value) {
              for (let v of arr) {
                  if (v.value == value) {
                      return v.label
                  }
              }
              return value
          },
          destory(hide = false) {
              this.dialogFormVisible = hide
              for (let p in this.defaultForm.params) {
                  if (this.defaultForm.params.hasOwnProperty(p)) {
                      this.defaultForm.params[p] = ''
                  }
              }
          },
        //   add() {
        //       this.destory(true)
        //   },
          showDetails(row, column) {
          },
          edit(row) {
              this.allowDisable = true
              this.dialogFormVisible = true
              for (let p in this.defaultForm.params) {
                  if (this.defaultForm.params.hasOwnProperty(p)) {
                      this.defaultForm.params[p] = row[p]
                  }
              }
          },
          submit(formName) {
              const _data = {
                  url: '/wf-doc/add', params: {
                      data: this.defaultForm.params
                  }
              }
              this.$refs[formName].validate((valid) => {
                  if (valid) {
                      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
                          .then(data => {
                              this.$message({
                                  type: 'success',
                                  message: 'change success!=>' + data
                              });
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
                      });
                      this.destory()
                  }
              });
          },
          query() {
              this.listQuery.current = 1
              this.getList()
          },
          reset() {
              for (let p in this.queryParams.requestData) {
                  if (this.queryParams.requestData.hasOwnProperty(p)) {
                      this.queryParams.requestData[p] = ''
                  }
              }
          },
          selectOptions() {
            let _data = { url: '/wf-constant/approveStates', params: {}}
            this.$store.dispatch('fmsCommon/actionTaskPost', _data)
              .then(data => {
                this.initSelect.approveState = data.map(c => {
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
              let _data = { url: '/wf-doc/add', params: { data: this.defaultForm.params } }
              this.$refs[formName].validate((valid) => {
                  if (valid) {
                      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
                          .then(data => {
                              this.$message({
                                  type: 'success',
                                  message: 'change success!=>' + data
                              });
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
                      });
                      this.destory()
                  }
              });


          },
          del(index, row) {
              this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
                  confirmButtonText: i18n.t("common.btn.ok"),
                  cancelButtonText: i18n.t("common.btn.cancel"),
                  type: 'warning'
              }).then(() => {
                  const _data = { url: '/wf-doc/del', params: { data: row.id } }
                  this.$store.dispatch('fmsCommon/actionTaskPost', _data)
                      .then(data => {
                          this.list.splice(index, 1)
                          this.$message({
                              type: 'success',
                              message: 'delete success!'
                          });
                      }).catch(err => {
                          console.error(err)
                      })
              }).catch(() => {
                  this.$message({
                      type: 'info',
                      message: 'cancel delete'
                  });
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
</style>