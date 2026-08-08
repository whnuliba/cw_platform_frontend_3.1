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
         
      </div>
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        @row-dblclick="showDetails"
        @row-click="rowClick"
        :height="270"
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
        </el-table-column>
        <el-table-column align="center" :label="$t('common.btn.operate')" width="150" fixed="right">
          <template slot-scope="scope">
            <!-- v-ele-show="{btnCode:'DEL_TIMER_TASK'}" -->
                <el-dropdown @command="(e)=>controlBtn(scope,e)">
                      <span class="el-dropdown-link">
                        <i class="el-icon-more"></i>
                      </span>
                      <el-dropdown-menu  slot="dropdown">
                        <el-dropdown-item v-for="(dr,a) in dropBtn" :key="`dropdown${a}`" 
                        :command="dr.key" v-text="dr.btnName"  :style="{textAlign: 'center',
                        display: scope.row.status === '启用' && dr.key ==='standardCompelete'? 
                        'none':(scope.row.status === '禁用' && dr.key ==='standardClose'?
                        'none':(scope.row.status === '启用' && dr.key ==='dele'? 'none' :'block')), }"
                        />
                      </el-dropdown-menu>
                </el-dropdown>
           
          </template>
        </el-table-column>
      </el-table>
  
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <el-dialog :title="modalProdTitle" v-el-drag-dialog :visible.sync="dialogFormVisible" width="700px">
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
              <el-select v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" @change="$forceUpdate()" placeholder="请选择">
                <el-option v-for="item in initSelect[item.field]"
                           :key="item.qcSName"
                           :label="item.qcSName"
                           :value="item.id">
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
      data() {
        const _initdata = {
          modalProdTitle: '',
          formColumns: [
            {field: 'pn', title: '产品型号',type: 'input', key:'pn' },
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
            commId: [],
            qcType: []
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
            { field: 'planNo', title: '排产编码', minWidth: 150, align: "left" ,query: true, queryType: 'input', set: true,  },
            { field: 'system', title: '体系', minWidth: 150, align: 'left', query: query, queryType: 'input', set: true  },
            { field: 'status', title: '状态', width: 100, align: 'left', query: false, queryType: 'input', set: true  },
            { field: 'qcSName', title: '质量名称', minWidth: 150, align: "left" ,query: true, require:true, queryType: 'input', set: false,  },
            { field: 'qcSCode', title: '质量编码', minWidth: 150, align: 'left', query: true, require:true, queryType: 'input', set: false  },
            { field: 'processNo', title: '工序编码', minWidth: 150, align: "left" ,  query: true,queryType: 'input', require:false, set: false,editReadonly:true  },
            { field: 'qcType', title: '质量类型', minWidth: 150, align: 'left', queryType: 'select', require:true, set: false   },
            { field: 'version', title: '版本', edit: 'text', align: 'center', width: 130 ,queryType: 'input', require:true, set: false},
            { field: 'devTime', title: '制定日期', width: 180, align: 'center',queryType: 'date', require:true, set: true},
            { field: 'remark', title: '备注', width: 200, align: 'center',queryType: 'input', set: true },
          ],
          form_cols: [
            { field: 'pn', title: '产品型号', minWidth: 150, align: "left" , query: true, required: true,queryType: 'input', set: true,  },
            { field: 'planNo', title: '排产编码', minWidth: 150, align: "left" ,query: true, required: false,queryType: 'input', set: true,  },
            { field: 'commId', title: '通用标准', width: 150, align: 'left', query: false, required: true,queryType: 'select', set:true  },
            { field: 'system', title: '体系', minWidth: 150, align: 'left', query: false,required: false,queryType: 'input', set: false  },
          ],
          copyToProdId:'',
          dropBtn: [
            {key:'edit',btnName:this.$t("common.btn.edit")},
            {key:'dele',btnName:this.$t("common.btn.delete")},
            {key:'copy',btnName:this.$t("common.btn.copy")},
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
        controlBtn(scope,e){
          switch (e) {
            case 'edit':
              this.modalProdTitle = this.$t('common.btn.edit')
              this.dialogFormVisible = true
              this.allowDisable = true
              for (let p in this.defaultForm.params) {
                if (this.defaultForm.params.hasOwnProperty(p)) {
                  this.defaultForm.params[p] = scope.row[p]
                }
              }
              break;
            case 'dele':
              this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
                  confirmButtonText: i18n.t("common.btn.ok"),
                  cancelButtonText: i18n.t("common.btn.cancel"),
                  type: 'warning'
                }).then(() => {
                  const _data = { url: '/qc-prod-standard/del', params: { data: scope.row.id } }
                  this.$store.dispatch('fmsCommon/actionProductPost', _data)
                    .then(data => {
                      this.list.splice(scope.$index, 1)
                      this.$message({
                        type: 'success',
                        message: '删除成功!'
                      });
                    }).catch(err => {
                      console.error(err)
                    })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '取消删除'
                  });
                })
              break;
            case 'copy':
            const dataCopy = { url: '/qc-prod-standard/copyProdItem', params: {data: scope.row.id}}
            this.$store.dispatch('fmsCommon/actionProductPost', dataCopy)
                .then(data => {
                    this.query();
                }).catch(err => {
                  console.error(err)
                })  
              break;
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
          const _data = { url: '/qc-c-prod-standard/items', params: this.queryParams }
          this.$store.dispatch('fmsCommon/actionProductPost', _data)
            .then(data => {
              this.list = data.data.map((item,i) => {
                item.status = item.status === 1 ? '启用' : (item.status === 2 ? '禁用': '暂存');
                return item;
              })
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
       
        add() {
            this.modalProdTitle = this.$t('common.btn.add')
            this.destory(true)
        },
        showDetails(row, column) {
        },
        rowClick(row, column) {
            this.$bus.$emit('addProdBtnUse')
            const _data = { url: '/qc-prod-standard/guest/getItems', params: {data:row.id} }
                  this.$store.dispatch('fmsCommon/actionProductPost', _data)
                    .then(data => {
                       this.$bus.$emit('prodToProdItem', data, row)
                    }).catch(err => {
                      console.error(err)
                  })
        },

        submit(formName) {
          const _data = {
            url: '/qc-prod-standard/edit', params: {
              data: this.defaultForm.params
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
          // 质量类型数据
            const _data = { url: '/prod-constant/guest/qc-types', params: {}}
            this.$store.dispatch('fmsCommon/actionProductPost', _data)
                  .then(data => {
                      this.initSelect['qcType'] = data;
                  }).catch(err => {
                    console.error(err)
                  })
          // 产品标准
            Object.assign(this.queryParams, this.listQuery)
            const com_data = { url: '/qc-standard/guest/query', params: this.queryParams }
            this.$store.dispatch('fmsCommon/actionProductPost', com_data)
              .then(data => {
                // debugger
                this.initSelect.commId = data.data

              }).catch(err => {
                console.error(err)
              })
         },
        save(formName) {
          this.defaultForm.row = {}
          this.defaultForm.params.id = ''
          this.defaultForm.params.useState = 1
          const _data = {
            url: '/qc-prod-standard/add', params: {
              data: this.defaultForm.params
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


        testOnFinish(formData) {
            let params = {commId:this.copyToProdId,...formData}
            const _data = { url: '/qc-standard/copyCommToProdStandard', params: {data: params}}
            this.$store.dispatch('fmsCommon/actionProductPost', _data)
                .then(data => {
                    // console.log(data)
                }).catch(err => {
                  console.error(err)
                })  
        },
      }
    }
  </script>
  
  <style scoped>
    .qc-standard {
        /* width: 50%; */
        height:50%;
        padding: 5px;
        margin:5px;
        border: 1px solid #ccc;
        box-shadow: 3px 3px 3px #ccc;
    }

    .filter-item {
      margin-left: 3px;
    }
  </style>
  