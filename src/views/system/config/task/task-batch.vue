<template>
    <div class="app-container">
      <div class="filter-container">
        <div v-for="(item,index) in cols" :key="index" style="display:inline">
          <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="item.title" style="width: 120px" class="filter-item">
            <!-- {{queryParams.requestData[item.field]=''}} -->
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
        <el-button type="warning" class="filter-item" @click="add" v-ele-show="{btnCode:'ADD_TIMER_TASK'}">
          {{ $t("common.btn.add") }}
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
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"
       @selection-change="handleSelectionChange"
        ref="multipleTable"
       @row-dblclick="showDetails">
         <el-table-column
        type="selection"
        width="55">
        </el-table-column>
        <el-table-column min-width="50px" :label="$t('common.no')" align="center">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
        <el-table-column v-for="(item) in cols" :key="item.id" :label="commonI18n(item)"  :prop="item.field" :width="item.width" :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip>
          <template slot-scope="{row}">
            {{commonFilter(row[item.field],item.field)}}
          </template>
          <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
        </el-table-column>
        <el-table-column align="left" :label="$t('common.btn.operate')" width="280" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit" @click="edit(scope.row)">
              {{ $t("common.btn.edit") }}
            </el-button>
             &nbsp;
            <el-button type="warning" v-ele-show="{btnCode:'DEL_TIMER_TASK'}" size="small" icon="el-icon-edit" @click="del(scope.$index,scope.row)">
              {{ $t("common.btn.delete") }}
            </el-button>
            <el-button type="primary" size="small"  icon="el-icon-edit" @click="myscript(scope.row)">
             {{ $t("common.btn.script") }}
          </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <el-dialog :title="$t('common.btn.edit')" v-el-drag-dialog :visible.sync="dialogFormVisible" width="700px">
        <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="80px">
          <div v-for="(item) in cols" :key="item.id" style="display:inline">
            <el-form-item v-if="item.set && item.queryType==='input'" :label="commonI18n(item)" :prop="item.field"
                          :rules="[{ required: true, message: item.title+'不能为空', trigger: 'blur' }]">
              <el-input v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" placeholder=""  />
            </el-form-item>
            <el-form-item v-if="item.set && item.queryType==='select'" :label="item.title">
              <el-select v-model="defaultForm.params[item.field]" :disabled="allowDisable && item.editReadonly" @change="$forceUpdate()" placeholder="请选择">
                <el-option v-for="item in initSelect[item.field]"
                           :key="item.value"
                           :label="item.label"
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


      <el-drawer
        :title="'脚本编写'"
        :visible.sync="scriptsVisible"
        :direction="'ltr'"
        :size="'80%'"
        :withHeader="false"
        :before-close="handleClose"
        >
          <component  :is="dtsOfswitch" ref="scriptsEditer" :scriptsEditer="scriptsEditer" @changeScript="setScript"> </component >
            <div style="margin-left:42%">
             <el-button @click="scriptsVisible = false">  {{ $t("common.btn.cancel") }}</el-button>
             <el-button type="primary"  @click="saveScript()">  {{ $t("common.btn.submit") }}</el-button>
            </div>
      </el-drawer>
    </div>
  
  </template>
  
  <script>
    import waves from "@/directive/waves"; // waves directive
    import elDragDialog from "@/directive/el-drag-dialog";
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    import i18n from '@/lang';
    import script_editer from './components/script-editer'
    import jsyaml from "js-yaml"
      const parseYamlFn = (str) => {
      let isYaml = false;
      let errorMessage = '';
      try {
        jsyaml.load(str)
        isYaml = true
      } catch(e) {
        isYaml = false
        errorMessage = e;
      }
      return {
        isYaml, errorMessage
      };
    }
    export default {
      name: 'taskEsb',
      components: { Pagination,script_editer },
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
          allowDisable:false,
          queryParams: {
            requestData: {
              scheduleType:'BATCH', //定时批处理,
              jobClass:'com.chr.task.job.BatchExecuteTask'
            }
          },
          scriptsVisible:false,
          dtsOfswitch:'script_editer',

          scriptsEditer:'',
          scriptOps:{
              scriptValue:'',
              scriptId:''
          },          
          initSelect: {
            protocol: [],
            useState: [{ label: '启用', value: 0 }, { label: '警用', value: 1 }],

          },
          defaultForm: {
            row: {},
            params: {
              id: '',
              scheduleType:'BATCH' //定时批处理
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
            { field: 'scheduleCode', title: '调度编码', minWidth: 150, align: "left" ,query: true, queryType: 'input', set: true,editReadonly:true  },
            { field: 'businessCode', title: '业务编码', minWidth: 150, align: "left" ,query: true, queryType: 'input', set: true,  },
            { field: 'scheduleGrpCode', title: '调度组码', minWidth: 150, align: 'left', query: true, queryType: 'input', set: true ,editReadonly:true  },
            { field: 'cron', title: 'Cron', edit: 'text', align: 'center', width: 130 ,queryType: 'input', set: true},
            { field: 'scheduleName', title: '任务名称', edit: 'text', align: 'left', width: 200, queryType: 'input',set: true },
            { field: 'triggerState', title: '状态', width: 120, align: 'center'} ,
            {
              field: 'jobClass', title: '执行类', edit: 'text', width: 500, align: 'left' ,queryType: 'input', set: true },
            { field: 'createUser', title: '创建人', width: 150, align: 'center' },
            { field: 'nextFireTimeStr', title: '下次执行时间', width: 150, align: 'center' },
            { field: 'preFireTimeStr', title: '上次执行时间', width: 150, align: 'center' },
            { field: 'startTimeStr', title: '开始时间', width: 150, align: 'center' },
            { field: 'endTimeStr', title: '结束时间', width: 150, align: 'center' },
            { field: 'createTime', title: '创建日期', align: 'center', width: 150 },
            { field: 'scheduleType', title: '任务类型', minWidth: 150, align: 'left', query: false, queryType: 'input', set: false ,editReadonly:true  },

          ]
        }
        Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
        return _initdata
      },
      created() {
        this.getList()
        this.selectOptions()
      },
      methods: {
        handleClose(done) {
        this.$confirm(this.$t('common.btn.sureClose'))
          .then(_ => {
            done();
          })
          .catch(_ => {});
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
      toggleSelection(rows) {
            console.log('toggleSelection',rows)
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
          const _data = { url: '/schedule/getall', params: this.queryParams }
          this.$store.dispatch('fmsCommon/actionTaskPost', _data)
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
  
        setScript(data){
        this.scriptOps.scriptValue=data
    },
    myscript(row){
        this.scriptOps.scriptValue=''
        this.scriptsEditer =row.id
        this.scriptsVisible = true
        this.scriptOps.scriptId = row.id

        console.log(this.$refs.scriptsEditer)
        this.$nextTick(function(){
          this.$refs.scriptsEditer.initScript(row.id)
        })

    },
    saveScript(){

      const _this = this
       const {isYaml,errorMessage} = parseYamlFn(_this.scriptOps.scriptValue)
       if(!isYaml){
           this.$message({
                    type: 'info',
                    message: 'formatter error!=>'+errorMessage
              });
              return
       }

      const _data = {url:'/esb/save-script',params:{data:{scriptText: _this.scriptOps.scriptValue,taskId: _this.scriptOps.scriptId}}}
      this.$store.dispatch('fmsCommon/actionTaskPost',_data)
      .then(data => {
          this.$message({
                    type: 'success',
                    message: 'change success!=>'+data
              });
          this.scriptsVisible = false
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
          this.defaultForm.params.scheduleType='BATCH'
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
          this.destory(true)
        },
        showDetails(row, column) {
        },
        edit(row) {
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
            url: '/schedule/updateCronJobClass', params: {
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
          //初始通讯协议
          // let _data = { url: '/constant/protocol-type', params: {} }
          // this.$store.dispatch('fmsCommon/actionFmsPost', _data)
          //   .then(data => {
          //     this.initSelect.protocol = data.map(c => {
          //       return {
          //         label: c.name,
          //         value: c.value
          //       }
          //     })
          //   }).catch(err => {
          //     console.error(err)
          //   })
  
          //初始化工序信息
        },
        save(formName) {
          this.defaultForm.row = {}
          this.defaultForm.params.id = ''
          let _data = { url: '/schedule/createJob', params: { data: this.defaultForm.params } }
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
            const _data = { url: '/schedule/deleteJob', params: { data: row.id } }
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
  