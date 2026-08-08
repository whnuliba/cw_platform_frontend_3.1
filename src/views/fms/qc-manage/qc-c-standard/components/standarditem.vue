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
       @selection-change="handleSelectionChange"
        ref="multipleTable"
        @row-dblclick="rowClick"
       :height="470"
       >
         <el-table-column
        type="selection"
        width="55">
        </el-table-column>
        <el-table-column min-width="50px" :label="$t('common.no')" align="center" fixed="left">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>

        <el-table-column v-for="(item) in cols" :key="item.id" :label="commonI18n(item)" :fixed="item.fixed"  :prop="item.field" :width="item.width" :min-width="item.minWidth" :align="item.align" show-overflow-tooltip>
          <template slot-scope="{row}">
            {{commonFilter(row[item.field],item.field)}}
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('common.btn.operate')" fixed="right">
          <template slot-scope="scope">
            <!-- v-ele-show="{btnCode:'DEL_TIMER_TASK'}" -->
                <el-dropdown @command="(e)=>controlBtn(scope,e)">
                      <span class="el-dropdown-link">
                        <i class="el-icon-more"></i>
                      </span>
                      <el-dropdown-menu  slot="dropdown">
                        <el-dropdown-item v-for="(dr,a) in dropBtn" :key="`dropdown${a}`" 
                        :command="dr.key" v-text="dr.btnName"  :style="{textAlign: 'center',
                        display:scope.row.useState === 1 && dr.key ==='standardCompelete'? 
                        'none':(scope.row.useState === 2 && dr.key ==='standardClose'?
                        'none':(scope.row.useState === 1 && dr.key ==='dele'? 'none' :'block')) }"
                        />
                      </el-dropdown-menu>
                </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
  
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <el-dialog :title="modalComTitle" v-el-drag-dialog :visible.sync="dialogFormVisible" width="700px">
        <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="80px">
          <div v-for="(item) in cols" :key="item.id" style="display:inline">
            <el-form-item v-if="item.set && item.queryType==='input'" :label="commonI18n(item)" :prop="item.field"
                          :rules="[{ required: item.require ? true : false, message: item.title+'不能为空', trigger: 'blur' }]">
              <el-input v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" placeholder="" style="width: 180px" />
            </el-form-item>
            <!-- <el-form-item v-if="item.set && item.queryType==='switch' && item.field !== 'useState'" :label="commonI18n(item)" :prop="item.field">
                    <el-switch
                        v-model="defaultForm.params[item.field]"
                        active-text="是"
                        inactive-text="否">
                    </el-switch>
            </el-form-item> -->
            <el-form-item v-if="item.set && item.queryType==='date'" :label="commonI18n(item)" :prop="item.field">
                    <el-date-picker
                        style="width: 180px"
                        v-model="defaultForm.params[item.field]"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间">
                    </el-date-picker>
            </el-form-item>
            <el-form-item v-if="item.set && item.queryType==='select'" :label="item.title">
              <el-select filterable v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" @change="$forceUpdate()" placeholder="请选择" style="width: 180px">
                <el-option v-for="item in formSelect[item.field]"
                           :key="item.name"
                           :label="item.name"
                           :value="item.value">
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
      <ModalComponent
        ref="copyToprodStandard"
        :formColumns="formColumns"
        :modalTemp="modalTemp"
        @testOnFinish="testOnFinish"
        :modalTitle="'复制到产品标准'"
      />
    </div>
  
  </template>
  
  <script>
    import waves from "@/directive/waves"; // waves directive
    import elDragDialog from "@/directive/el-drag-dialog";
    import Pagination from '@/components/Pagination';
    import ModalComponent from "@/components/modal/formIndex";
    import i18n from '@/lang';
    export default {
      name: 'qc_c_standard',
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
          modalComTitle: '',
          formColumns: [
            {field: 'pn', title: '产品名称',type: 'input', key:'pn' },
            {field: 'planNo', title: '批次号',type: 'input', key:'planNo'}
          ],
          modalTemp: {
            pn:'',
            planNo: ''
          },
          formSelect:{},
          dialogFormVisible: false,
          allowDisable:false,
          queryParams: {
            requestData: {
              
            }
          },
          scriptOps:{
              scriptValue:'',
              scriptId:''
          },          
          initSelect: {
            qcType:[],
            processNo:[],
            useState: [{ label: '请选择', value: '' },{ label: '启用', value: 1 }, { label: '禁用', value: 2 }, { label: '暂存', value: 3 }]


          },
          defaultForm: {
            row: {},
            params: {
              id: '',
            }
          },
          routeObj: {},
          list: null,
          total: 0,
          listLoading: true,
          listQuery: {
            current: 1,
            pageSize: 15
          },
          cols: [
            { field: 'qcSName', title: '质量名称', minWidth: 150, align: "left" ,query: true, require:true, queryType: 'input', set: true,  },
            { field: 'qcSCode', title: '质量编码', minWidth: 150, align: 'left', query: true, require:true, queryType: 'input', set: false  },
            { field: 'processNo', title: '工序编码', minWidth: 150, align: "left" , queryType: 'select', require:false, set: true,editReadonly:true  },
            { field: 'qcType', title: '质量类型', minWidth: 150, align: 'left', queryType: 'select', require:true, set: false   },
            { field: 'version', title: '版本', edit: 'text', align: 'center', width: 130 ,queryType: 'input', require:true, set: false},
            { field: 'devTime', title: '制定日期', width: 180, align: 'center',queryType: 'date', require:true, set: true},
            // { field: 'scope', title: '范围', edit: 'text', width: 100, align: 'left' ,queryType: 'input', require:false, set: true },
            { field: 'remark', title: '备注', width: 200, align: 'center',queryType: 'input', set: true },
            { field: 'useState', title: '使用状态', edit: 'text', align: 'left', width: 100, queryType: 'select',query:true, require:false, set: false,fixed: 'right' },
          ],
          copyToProdId:'',
          dropBtn: [
            {key:'edit',btnName:this.$t("common.btn.edit")},
            {key:'dele',btnName:this.$t("common.btn.delete")},
            {key:'copy',btnName:this.$t("common.btn.copy")},
            {key:'copyToProd',btnName:'复制到产品标准'},
            {key:'standardCompelete',btnName:'启用'},
            {key:'standardClose',btnName:'禁用'},
          ]
        }
        Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
        return _initdata
      },
      created() {
        const fullpath =this.$route.fullPath
          let cp = fullpath
          if (cp && cp != null && cp.indexOf("\\") != -1)
                cp = cp.replace("\\", "/");
          let apArr = cp.split("/");
          if (!apArr.length || apArr.length<2) 
          {
            this.$message({
              type:"error",
              message: '路由错误'
            })
              return
          } 
         this.routeObj = {
            qcType: apArr[apArr.length - 1],
         };
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
                this.modalComTitle = this.$t('common.btn.edit');
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
                    const _data = { url: '/qc-standard/del', params: { data: scope.row.id } }
                    this.$store.dispatch('fmsCommon/actionProductPost', _data)
                      .then(data => {
                        this.list.splice(scope.$index, 1)
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
                      message: '取消删除'
                    });
                  })
              break;
            case 'copy':
              const dataCopy = { url: '/qc-standard/copyItem', params: {data: scope.row.id}}
              this.$store.dispatch('fmsCommon/actionProductPost', dataCopy)
                  .then(data => {
                      this.query();
                  }).catch(err => {
                    console.error(err)
                  })  
              break;
            case 'copyToProd':
              this.$refs.copyToprodStandard.modalOpen();
              this.copyToProdId = scope.row.id;
              break;
            case 'standardCompelete':
              const _data = { url: '/qc-standard/actStandardDef', params: {data: scope.row.id} }
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
              const dataClose = { url: '/qc-standard/closeStandardDef', params: {data: scope.row.id} }
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
          const _params = this.routeObj
          this.queryParams.requestData.qcType=_params.qcType
          const _data = { url: '/qc-standard/items', params: this.queryParams }
          this.$store.dispatch('fmsCommon/actionProductPost', _data)
            .then(data => {
              this.list = data.data.map((item,i) => {
               //item.useState = item.useState === 1 ? '启用' : (item.useState === 2 ? '禁用': '暂存');
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
            if (v.value == value && v.name) {
              return v.name
            } else if (v.value == value && v.label) {
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
            this.modalComTitle = this.$t('common.btn.add');
            this.allowDisable = false;
            this.destory(true)
        },
        showDetails(row, column) {
        },
        rowClick(row, column) {
            this.$emit('skiptable')
            const _data = { url: '/qc-standard/guest/getItems', params: {data:row.id} }
                  this.$store.dispatch('fmsCommon/actionProductPost', _data)
                    .then(data => {
                      // 传给兄弟组件
                       this.$bus.$emit('comToComItem', data, row)
                    }).catch(err => {
                      console.error(err)
                  })
        },
        // edit(row) {
        //   this.modalComTitle = this.$t('common.btn.edit');
        //   this.dialogFormVisible = true
        //   this.allowDisable = true
        //   for (let p in this.defaultForm.params) {
        //     if (this.defaultForm.params.hasOwnProperty(p)) {
        //       this.defaultForm.params[p] = row[p]
        //     }
        //   }
        // },
        submit(formName) {
          // const _params =this.$route.params
          const _params = this.routeObj

          this.defaultForm.params.qcType = _params.qcType
          const _data = {
            url: '/qc-standard/edit', params: {
              data: this.defaultForm.params
            }
          }
          delete _data.params.data.useState;
        //   debugger
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
          const _data = { url: '/prod-constant/guest/qc-types', params: {}}
          this.$store.dispatch('fmsCommon/actionProductPost', _data)
            .then(data => {
                this.formSelect['qcType'] = data;
                this.initSelect['qcType'] = data;
            }).catch(err => {
              console.error(err)
            })
          const _data1 = { url: '/process/guest/getAll'}
          this.$store.dispatch('fmsCommon/actionMdmPost', _data1)
            .then(data => {
              this.initSelect['processNo'] = data.map(c=>{
                return {
                  name:c.pcName,
                  value:c.pcNo
                }
              })
              this.formSelect['processNo'] = data.map(c=>{
                return {
                  name:c.pcName,
                  value:c.pcNo
                }
              })
              }).catch(err => {
                console.error(err)
              })
         },
        save(formName) {
          this.defaultForm.row = {}
          this.defaultForm.params.id = ''
          // const _params =this.$route.params
          const _params = this.routeObj

          console.log(_params)
          this.defaultForm.params.qcType = _params.qcType
          const _data = {
            url: '/qc-standard/add', params: {
              data: this.defaultForm.params
            }
          }
          delete _data.params.data.useState;

          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$store.dispatch('fmsCommon/actionProductPost', _data)
                .then(data => {
                  this.$message({
                    type: 'success',
                    message: '保存成功'
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
                    this.$message({
                        type: 'success',
                        message: '已复制到产品标准'
                      });
                }).catch(err => {
                  console.error(err)
                })  
        },
        del(index, row) {

        }
      }
    }
  </script>
  
  <style scoped>
    .qc-standard {
        /* width: 50%; */
        height:50%;
    }
    .el-dropdown-link{
        cursor: hand;
    }
  
    .filter-item {
      margin-left: 3px;
    }
  </style>
  