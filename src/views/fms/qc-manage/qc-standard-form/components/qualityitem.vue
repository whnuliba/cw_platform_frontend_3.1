<template>
    <div class="qc-standard">
      <div class="filter-container">
        <div v-for="(item,index) in cols" :key="index" style="display:inline">
          <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="item.title" style="width: 120px" class="filter-item">
          </el-input>
          <el-select v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="item.title" style="width: 120px" class="filter-item">
            <el-option v-for="item in initSelect[item.field]"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker v-if="item.query && item.queryType==='date'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]" type="datetime" :placeholder="item.title" style="width: 150" class="filter-item"> </el-date-picker>
        </div>
        <el-button type="primary" class="filter-item" @click="query()">
          {{ $t("common.btn.query") }}
        </el-button>
        <el-button type="info" class="filter-item" @click="reset">
          {{ $t("common.btn.reset") }}
        </el-button>
        <el-button type="warning" class="filter-item" @click="add">
          {{ $t("common.btn.add") }}
        </el-button>
        <el-button type="primary" class="filter-item" @click="copyrow">
        {{ '复制' }}
      </el-button>
      <el-button type="warning" class="filter-item" @click="del">
        {{ $t("common.btn.delete") }}
      </el-button>
          <el-button type="primary"  class="filter-item"  v-ele-show="{btnCode:'fms_task_mult_starts'}" icon="el-icon-edit" @click="start()">
              {{ $t("common.btn.start") }}
            </el-button>
            <el-button type="primary"  class="filter-item"  v-ele-show="{btnCode:'fms_task_mult_stops'}"  icon="el-icon-edit" @click="stop()">
          {{ $t("common.btn.stop") }}
            </el-button>
            <el-button type="primary"  class="filter-item"  v-ele-show="{btnCode:'fms_task_mult_restore'}"  icon="el-icon-edit" @click="restore()">
         {{ $t("common.btn.restore") }}
         </el-button>
         
      </div>
      <el-table :header-cell-class-name="headerCell" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        @row-dblclick="showDetails"
        @row-click="rowClick"
        :height="255"
        @select="selectRow"
       >
         <el-table-column
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column min-width="50px" :label="$t('common.no')" align="center" fixed="left">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>

        <el-table-column v-for="(item) in cols" :key="item.id" :label="commonI18n(item)"  :prop="item.field" :width="item.width" :min-width="item.minWidth" :align="item.align" show-overflow-tooltip>
          <template slot-scope="{row}">
            {{commonFilter(row[item.field],item.field)}}
          </template>
          <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
        </el-table-column>
        <el-table-column align="left" :label="$t('common.btn.operate')" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit" @click="skiptable(scope.row)">
              质量表单
            </el-button>
            <el-button type="primary" size="small" icon="el-icon-edit" @click="edit(scope.row)">
              {{ $t("common.btn.edit") }}
            </el-button>
             &nbsp;
            <!-- <el-button v-if="scope.row.useState !== 1" type="warning"  size="small" icon="el-icon-edit" @click="del(scope.$index,scope.row)">
              {{ $t("common.btn.delete") }}
            </el-button> -->
              <!-- v-ele-show="{btnCode:'DEL_TIMER_TASK'}" -->
            <!-- <el-button type="primary"  size="small" icon="el-icon-edit" @click="copy(scope.row)">
              {{ $t("common.btn.copy") }}
            </el-button>
            <span :style="{marginLeft:'10px'}">
                <el-dropdown @command="(e)=>controlBtn(scope,e)">
                      <span class="el-dropdown-link">
                        <i class="el-icon-caret-bottom"></i>
                      </span>
                      <el-dropdown-menu  slot="dropdown">
                        <el-dropdown-item v-for="(dr,a) in extraBtn" :key="`dropdown${a}`" 
                        :command="dr.key" v-text="dr.btnName"  :style="{textAlign: 'center',
                        display:scope.row.status === '启用' && dr.key ==='standardCompelete'? 
                        'none':(scope.row.status === '禁用' && dr.key ==='standardClose'?
                        'none':'block'), }"
                        />
                      </el-dropdown-menu>
                </el-dropdown>
            </span> -->
           
          </template>
        </el-table-column>
      </el-table>
  
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <el-dialog :title="modalTitle" v-el-drag-dialog :visible.sync="dialogFormVisible" width="700px">
        <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="80px">
          <div v-for="(item) in form_cols" :key="item.id" style="display:inline">
            <el-form-item v-if="item.set && item.queryType==='input'" :label="commonI18n(item)" :prop="item.field"
                          :rules="[{ required: item.required, message: item.title+'不能为空', trigger: 'blur' }]">
              <el-input v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" placeholder=""  />
            </el-form-item>
            <el-form-item v-if="item.set && item.queryType==='date'" :label="commonI18n(item)" :prop="item.field">
                    <el-date-picker
                        v-model="defaultForm.params[item.field]"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间">
                    </el-date-picker>
            </el-form-item>
            <el-form-item v-if="item.set && item.queryType==='select'" :label="item.title">
              <el-select :filterable="true" v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" @change="changeSele" placeholder="请选择">
                <el-option v-for="it in initSelect[item.field]"
                           :key="it[item.field]"
                           :label="it[item.label]+'('+it[item.combVal]+')'"
                           :value="it[item.field]+'|'+it[item.combVal]">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="item.set && item.queryType==='simpleSelect'" :label="item.title">
              <el-select v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" @change="changeSele" placeholder="请选择">
                <el-option v-for="it in initSelect[item.field]"
                           :key="it[item.field]"
                           :label="it[item.field]"
                           :value="it[item.field]">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
  
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="destory(false)">  {{ $t("common.btn.cancel") }}</el-button>
          <el-button type="primary" v-if="defaultForm.params.id==='' || defaultForm.params.id===null" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
          <el-button type="primary" v-if="defaultForm.params.id!='' && defaultForm.params.id!=null" @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
        </div>
      </el-dialog>
    </div>
  
  </template>
  
  <script>
    import waves from "@/directive/waves"; // waves directive
    import elDragDialog from "@/directive/el-drag-dialog";
    import Pagination from '@/components/Pagination';
    import ModalComponent from "@/components/modal/formIndex";
    import i18n from '@/lang';
    export default {
      name: 'taskEsb',
      components: { Pagination,ModalComponent },
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
      props:{
        activeName1:String,
      },
      watch: {
        activeName1(val){
        // console.log(val)
        //   if()
        },
      },
      data() {
        const _initdata = {
          selectRowData: {},
          modalTitle: '',
          formColumns: [
            {field: 'pn', title: '产品名称',type: 'input', key:'pn' },
            {field: 'planNo', title: '批次号',type: 'input', key:'planNo'}
          ],
          modalTemp: {
            pn:'',
            planNo: ''
          },
          dialogFormVisible: false,
          allowDisable:false,
          queryParams: {
            requestData: {}
          },
          scriptOps:{
              scriptValue:'',
              scriptId:''
          },          
          initSelect: {
            version: [],
            qcSCode: [],
            checkConclusion: [
              {checkConclusion: '合格'},
              {checkConclusion: '不合格'},
            ]
          },
          defaultForm: {
            row: {},
            params: {
              id: '',
              commId: '',
              pn: '',
              planNo:'',
              system: ''
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
            { field: 'pn', title: '产品型号', minWidth: 150, align: "left" , query: true, queryType: 'input', set: true,  },
            { field: 'qcSCode', title: '标准单', minWidth: 150, align: "left" ,query: true, queryType: 'input', set: true,  },
            { field: 'deviceNo', title: '干系机台', minWidth: 150, align: "left" ,query: false, queryType: 'input', set: true,  },
            { field: 'checkConclusion', title: '检验结论', minWidth: 150, align: "left" ,query: false, queryType: 'input', set: true,  },
            { field: 'checkNo', title: '检验单', minWidth: 150, align: "left" ,query: false, queryType: 'input', set: true,  },
            { field: 'planNo', title: '排产号', minWidth: 150, align: "left" ,query: false, queryType: 'input', set: true,  },
            { field: 'version', title: '标准版本', minWidth: 150, align: "left" , queryType: 'input', set: true,  },
            { field: 'standardType', title: '标准类型', minWidth: 150, align: 'left', query: false,  set: true  },
            { field: 'completeTime', title: '完成时间', minWidth: 150, align: 'left', query: false,  set: true  },
          ],
          form_cols: [
            { field: 'pn', title: '产品型号', minWidth: 150, align: "left" , query: true, queryType: 'input', set: true,  },
            { field: 'qcSCode', combVal:'version', title: '标准单', label:'qcSName', minWidth: 150, align: "left" ,query: true, queryType: 'select', set: true,  },
            // { field: 'standardType', title: '标准类型', minWidth: 150, align: 'left', query: false, queryType: 'input', set: true  },
            { field: 'deviceNo', title: '干系机台', minWidth: 150, align: "left" ,query: false, queryType: 'input', set: true,  },
            { field: 'checkConclusion', title: '检验结论', minWidth: 150, align: "left" ,query: false, queryType: 'simpleSelect', set: true,  },
            { field: 'checkNo', title: '检验单', minWidth: 150, align: "left" ,query: false, queryType: 'input', set: false,  },
            { field: 'planNo', title: '排产号', minWidth: 150, align: "left" ,query: false, queryType: 'input', set: true,  },
          ],
          copyToProdId:'',
          extraBtn: [
            {key:'standardCompelete',btnName:'启用'},
            {key:'standardClose',btnName:'禁用'},
          ],
        }
        Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
        return _initdata
      },
      created() {
        this.getList()
        this.selectOptions()
      },
      methods: {
        headerCell(row){
        	if (row.columnIndex === 0 && row.rowIndex === 0) {
	          return 'disabledCheck'
	        }
        },
        copyrow(){
        if(Object.keys(this.selectRowData).length==0){
          this.$message({
            type: 'info',
            message: '请先选中某一行'
          });
        }else{
          if(this.selectRowData.status != 2 ){
            this.$message({
              type: 'info',
              message: '无法复制'
            });
          }else{

            this.$confirm('确认执行复制操作?', i18n.t("common.tip_info.tips"), {
            confirmButtonText: i18n.t("common.btn.ok"),
            cancelButtonText: i18n.t("common.btn.cancel"),
            type: 'warning'
          }).then(() => {
          const _data = { url: '/qc-check-form/copyCheckForm',params: {data: this.selectRowData.id}}
            this.$store.dispatch('fmsCommon/actionProductPost', _data)
            .then(data => {
                if(data == '访问成功'){
                  this.query()
                  this.$message({
                    type: 'success',
                    message: '复制成功!'
                  });
                  this.selectRowData = {}
                }
              }).catch(err => {
                console.error(err)
          })}).catch(() => {
          this.$message({
            type: 'info',
            message: '取消复制'
          });
          })

          }
          
        }
        
        
      },
      selectRow(selection,val) {
        this.$refs.multipleTable.clearSelection();
        // if (selection.length == 0){
        //     // this.selectRowData = [];
        //     return
        // };
        this.$refs.multipleTable.toggleRowSelection(val, true);
        this.selectRowData = val;
      },       
        initData(arr) {
          let args = {}
          arr.map(c => {
            if (c.set) {
              args[c.field] = null
            }
          })
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
        changeSele(val) {
          console.log(val)
          
        },
        controlBtn(scope,e){
          switch (e) {
            case 'standardCompelete':
              const _data = { url: '/qc-prod-standard/actProdStandardDef', params: {data: scope.row.id} }
              this.$store.dispatch('fmsCommon/actionProductPost', _data)
                .then(data => {
                  this.$message({
                          type: 'success',
                          message: '标准启用'
                        });
                  this.query();
                }).catch(err => {
                  console.error(err)
                })
              break;
            case 'standardClose':
              this.$confirm(`确定禁用这个标准吗?`, '提示信息', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                const dataClose = { url: '/qc-prod-standard/closeProdStandardDef', params: {data: scope.row.id} }
                this.$store.dispatch('fmsCommon/actionProductPost', dataClose)
                  .then(data => {
                    this.$message({
                                type: 'success',
                                message: '标准关闭'
                              });
                    this.query();
                  }).catch(err => {
                    console.error(err)
                  })
                })
              break;   
            default:
              break;
          }
        },
    
        toggleSelection(rows) {
          if (rows) {
            rows.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row);
            });
          } else {
            this.$refs.multipleTable.clearSelection();
          }
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        getList() {
          this.listLoading = true
          Object.assign(this.queryParams, this.listQuery)
          const _data = { url: '/qc-check-form/guest/query', params: this.queryParams }
          this.$store.dispatch('fmsCommon/actionProductPost', _data)
            .then(data => {
              this.list = [
                ...data.data,
            ]
              this.total = data.total
              this.listLoading = false
            }).catch(err => {
              console.error(err)
            })
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
        start(){
          this.$confirm(i18n.t("common.tip_info.common_info"), i18n.t("common.tip_info.tips"), {
            confirmButtonText: i18n.t("common.btn.ok"),
            cancelButtonText: i18n.t("common.btn.cancel"),
            type: 'warning'
          }).then(() => {
              const val = this.multipleSelection.map(c=>c.id)
              if(val.length>0){
                 const _data = { url: '/schedule/starts', params: {data:val} }
                  this.$store.dispatch('fmsCommon/actionTaskPost', _data)
                    .then(data => {
                        this.$message({
                          type: 'success',
                          message: 'change success!=>' + data
                        });
                  this.query()
                    }).catch(err => {
                      console.error(err)
                  })
              }else{
                     this.$message({
                    type: 'info',
                    message: '没有选择数据对象'
                  });
              }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '没有选择数据对象'
            });
          })
        },
        stop(){
          this.$confirm(i18n.t("common.tip_info.common_info"), i18n.t("common.tip_info.tips"), {
            confirmButtonText: i18n.t("common.btn.ok"),
            cancelButtonText: i18n.t("common.btn.cancel"),
            type: 'warning'
          }).then(() => {
              const val = this.multipleSelection.map(c=>c.id)
              if(val.length>0){
                 const _data = { url: '/schedule/pauseJobs', params: {data:val} }
                  this.$store.dispatch('fmsCommon/actionTaskPost', _data)
                    .then(data => {
                        this.$message({
                    type: 'success',
                    message: 'change success!=>' + data
                  });
                  this.query()
                    }).catch(err => {
                      console.error(err)
                  })
              }else{
                     this.$message({
                    type: 'info',
                    message: '没有选择数据对象'
                  });
              }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '没有选择数据对象'
            });
          })
        },
        restore(){
          this.$confirm(i18n.t("common.tip_info.common_info"), i18n.t("common.tip_info.tips"), {
            confirmButtonText: i18n.t("common.btn.ok"),
            cancelButtonText: i18n.t("common.btn.cancel"),
            type: 'warning'
          }).then(() => {
              const val = this.multipleSelection.map(c=>c.id)
              if(val.length>0){
                 const _data = { url: '/schedule/resumeJobs', params: {data:val} }
                  this.$store.dispatch('fmsCommon/actionTaskPost', _data)
                    .then(data => {
                        this.$message({
                    type: 'success',
                    message: 'change success!=>' + data
                  });
                  this.query()
                    }).catch(err => {
                      console.error(err)
                  })
              }else{
                     this.$message({
                    type: 'info',
                    message: '没有选择数据对象'
                  });
              }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '没有选择数据对象'
            });
          })
        },
        add() {
            this.modalTitle = this.$t('common.btn.add')
            this.destory(true)
        },
        showDetails(row, column) {
        },
        skiptable(row){
            this.$emit('skiptable')
            this.$bus.$emit('calcBtnUse');
            const _data = { url: '/qc-check-form/getItems', params: {data: row.id} }
                  this.$store.dispatch('fmsCommon/actionProductPost', _data)
                    .then(data => {
                       this.$bus.$emit('qcToQcItem', data, row)
                    }).catch(err => {
                      console.error(err)
                  })
        },
        rowClick(row, column) {
           
        },
        edit(row) {
          this.modalTitle = this.$t('common.btn.edit')
          this.dialogFormVisible = true
          this.allowDisable = true
          for (let p in this.defaultForm.params) {
            if (this.defaultForm.params.hasOwnProperty(p)) {
              this.defaultForm.params[p] = row[p]
            }
          }
        },
        submit(formName) {
          const _data = {
            url: '/qc-check-form/edit', params: {
              data: {
                ...this.defaultForm.params,
                qcSCode: this.defaultForm.params.qcSCode.split("|")[0],
                version: this.defaultForm.params.qcSCode.split("|")[1]
              }
            }
          }
          delete _data.params.data.status;
          // debugger
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$store.dispatch('fmsCommon/actionProductPost', _data)
                .then(data => {
                  this.$message({
                    type: 'success',
                    message: '编辑成功' 
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
          // 产品标准
            Object.assign(this.queryParams, this.listQuery)
            const com_data = { url: '/qc-standard/guest/query', params: this.queryParams }
            this.$store.dispatch('fmsCommon/actionProductPost', com_data)
              .then(data => {
                this.initSelect.qcSCode = data.data.filter(item=>{
                  return item.useState == 1
                })
                this.initSelect.version = data.data.filter(item=>{
                  return item.useState == 1
                })

                // debugger
                // this.initSelect.qcSCode = data.data;
                // this.initSelect.version = data.data;
              }).catch(err => {
                console.error(err)
              })
         },
        save(formName) {
          this.defaultForm.row = {}
          this.defaultForm.params.id = ''
          const _data = {
            url: '/qc-check-form/add', params: {
              data: {...this.defaultForm.params,
                qcSCode: this.defaultForm.params.qcSCode.split('|')[0],
                version: this.defaultForm.params.qcSCode.split('|')[1]
              }
            }
          }

          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$store.dispatch('fmsCommon/actionProductPost', _data)
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
        copy(row) {
            const _data = { url: '/qc-prod-standard/copyProdItem', params: {data: row.id}}
            this.$store.dispatch('fmsCommon/actionProductPost', _data)
                .then(data => {
                    console.log(data)
                    this.query();
                }).catch(err => {
                  console.error(err)
                })  
        },

        testOnFinish(formData) {
            let params = {commId:this.copyToProdId,...formData}
            const _data = { url: '/qc-standard/copyCommToProdStandard', params: {data: params}}
            this.$store.dispatch('fmsCommon/actionProductPost', _data)
                .then(data => {
                    console.log(data)
                }).catch(err => {
                  console.error(err)
                })  
        },
        del(index, row) {
        if(Object.keys(this.selectRowData).length==0){
          this.$message({
            type: 'info',
            message: '请先选中某一行'
          });
        }else{
          this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
          const _data = { url: '/qc-check-form/del', params: { data: this.selectRowData.id.trim() } }
          this.$store.dispatch('fmsCommon/actionProductPost', _data)
            .then(data => {
              // this.list.splice(index, 1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.selectRowData = {}
              this.query()
            }).catch(err => {
              console.error(err)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          });
        })
        }
       
      }
      }
    }
  </script>
  
  <style scoped>
    .qc-standard {
        /* width: 50%; */
        height:80%;
        padding: 5px;
        margin:5px;
        /* border: 1px solid #ccc; */
        /* box-shadow: 3px 3px 3px #ccc; */
    }
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
    ::v-deep .disabledCheck .cell .el-checkbox{
      display: none !important;
    }
  </style>
  