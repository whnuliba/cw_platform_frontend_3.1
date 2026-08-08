<template>
    <div class="">
      <div class="filter-container" style="padding-bottom: 8px;">
        <el-input readonly placeholder="项目名称" size="mini" style="width:18%;" v-model="projectName">
        </el-input>
        &nbsp;&nbsp;
        <el-input readonly placeholder="项目代码" size="mini" style="width: 18%;" v-model="projectCode">
        </el-input>
        &nbsp;&nbsp;
        <el-input readonly placeholder="项目经理" size="mini" style="width: 10%;" v-model="pmUser">
        </el-input>
        &nbsp;&nbsp;
        <el-date-picker style="width:25%;" size="mini" readonly v-model="dateRange" type="daterange" range-separator="至"
          start-placeholder="开始日期" :picker-options="pickerOptions" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
          @change="dateRangeHander" end-placeholder="结束日期">
        </el-date-picker>
        &nbsp;&nbsp;
        <div class="filterItem" style="">
          <el-button v-if="this.component.attribute.showprojectButton" icon=el-icon-document plain @click="projectListVisible=true" size="mini">项目</el-button>
          <el-button plain @click="addRow" icon="el-icon-plus" size="mini">增加</el-button>
          <el-button plain @click="saveRow" icon="el-icon-document-add" size="mini">保存</el-button>
          <el-button size='mini' title="导入" icon="el-icon-upload2" @click="uploadClick" plain>导入</el-button>
          <el-button   size='mini' title="导出" icon="el-icon-download" @click="exportClick" plain>导出</el-button>
        </div>
  
      </div>
      <CwGantta ref="CwGantta" :dateRange="dateRange" :loadGanttaData="ganttaData" :projectName="projectName" 
      :rightclickInfo="rightclickInfo" :projectCode="projectCode" :pmUser="pmUser" :id="id" @rmenuControllUser="rmenuControllUser" @onContextmenu="onContextmenu"  />
  
      <el-drawer :title="'项目列表'" :visible.sync="projectListVisible" :direction="'ltr'" :size="'60%'" :withHeader="false"
        :before-close="handleClose">
        <div style="padding: 10px;"></div>
        <CwTable :bizCode="bizCode" :dataLoading="dataLoading" :data="data" :page="page" :columns="columns"
          :customToolBar="customToolBar" :boxSelect="true" :multipleSelect="false" @loadData="loadData"
          @handleAdd="handleAdd" @handleDelete="handleDelete" @handleReset="handleReset"
          @handleRowDbClick="handleRowDbClick" @init="init" />
      </el-drawer>
  
      <CwUserControll :dialogVisible="controllUserVisible" @controllUserClose="controllUserClose"
        :rowData="projectRowData" />
  

     <CwDialog  title="导出选择" :dialogVisible.sync="dialogExportVisible" width="700px" @handleClose="handleExportClose"> 
      <template slot="body">
        <el-form ref="exportColumn" :inline="true"  label-width="80px">
        <template>
          <exportExcel :header ="header" :columnName="columnName" :filter="filter" :list="list" @handleDownload="handleDownload">  </exportExcel>  
        </template>
      </el-form>
      </template>
    </CwDialog>

    <CwDialog  title="Import Data" :dialogVisible.sync="dialogUploadVisible" width="80%"@handleClose="handleUploadClose"> 
      <template slot="body">
        <div class="import-data-div" style="max-height: 500px;overflow-y: auto;">
          <el-form ref="uploadColumn" :inline="true" :model="uploadColumn" label-width="80px">
          <template>
            <uploadExcel  @handleUpload="handleUpload" >  </uploadExcel>  
          </template>
        </el-form>
        </div>
      </template>
    </CwDialog>
    </div>
  </template>
  <script>
    import CwGantta from "@/components/Cw/CwGantta"
    import i18n from "@/lang";
    import CwTable from "@/components/Cw/CwTable"
    import CwUserControll from "@/components/Cw/CwUserControll"
    import CwDialog from "@/components/Cw/CwDialog"; // waves directive
    import exportExcel from "@/components/Excel/export-excel"; // waves directive
    import uploadExcel from "@/components/Excel/upload-excel"; // waves directive
  
    //,transform : 'rotate(' + item.attribute.rotationAngle + 'deg)'  对于带有模态的不能增加旋转
    export default {
      name: 'CwProject',
      components: { CwGantta, CwTable, CwUserControll,CwDialog,exportExcel,uploadExcel },
      directives: {},
      filters: {},
      props: {
        componentModalObj: {
          type: Object,
          default: () => {
            return {}
          }
        },
        fieldName: {
          type: String,
          default: ''
        },
        selfAttribute:{

        },  
        myStyle: {
          type: Object,
          default: () => {
            return { color:'black' }
          }
        },
        itemVal: {
          type: String,
          default: ''
        },
        compId: {
          type: String,
          default: ''
        },
        component:{
          type: Object,
          default: () =>{}
        },
    bindData:{
      type: Object,
      default: () =>{}
    },
      },
      watch:{
        'component.attribute.showprojectButton': {
        handler: function(newVal, oldVal){
            if (newVal !== oldVal) {
              this.showprojectButton = newVal
            }
        },
        deep: true,
        },
      },
      data() {
        const _initdata = {
          methods:{},
          vueContext:{},
          dateRange: [],
          projectName: '',
          projectCode: '',
          pmUser: '',
          id: '',
          projectListVisible: false,
          pickerOptions: {
            onPick: (start, end) => {
              this.dateRangeTrigger(start, end)
            }
          },
  
          bizCode: 'CW_PMS_PROJECT',
          data: [],
          count: 0,
          dataLoading: false,
          dialogExportVisible:false,
          dialogUploadVisible:false,
          filter:[],
          header:[],
          columnName:[],
          list: null,
          uploadColumn:{},
          rightclickInfo: {},


          showprojectButton:false,
          controllUserVisible: false,
          controllUserData: [],
          projectRowData: {},
          page: {
            showPage: true,
            total: 0,
            listQuery: {
              current: 1,
              pageSize: 15
            },
            queryParams: {
              requestData: {
                tableName: '',
                orderBy: '',
                columns: [],
                sqlWhere: [],
              }
            },
          },
          cols: [],
          columns: [
            { field: 'PROJECT_NAME', title: '项目名称', width: 150, align: "center", queryType: 'input', set: true, require: true, query: false, hide: false, disabled: false, },
            { field: 'PROJECT_CODE', title: '项目代码', minWidth: 150, align: "center", queryType: 'input', set: true, require: true, query: false, hide: false, disabled: false, },
            { field: 'BEGIN_DATE', title: '开始时间', minWidth: 150, align: "center", queryType: 'date', set: true, require: true, query: false, hide: false },
            { field: 'END_DATE', title: '结束时间', minWidth: 150, align: "center", queryType: 'date', set: true, require: true, query: false, hide: false },
            { field: 'PM', title: '项目经理', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: false, hide: false },
            { field: 'DESCRIPTION', title: '备注', width: 200, align: 'center', queryType: 'input', set: true, require: true, query: false, hide: false },
          ],
          customToolBar: {
            show: true,
            showFilter: true,
            showSelectField: true,
            showExport: true,
            columnSelectFilter: true,
            buttons: [
              {
                text: '查询', icon: 'el-icon-search', permCode: 'fms_task_external_add', background: '', size: 'mini', hideText: true, callback: function (e, self) {
                  self.fieldFormQuery()
                },
                style: {
  
                }
              },
              {
                text: '重置', icon: 'el-icon-refresh-left', background: '', hideText: true, size: 'mini', callback: function (e, self) {
                  self.reset()
                }
              },
              {
                text: '增加', icon: 'el-icon-plus', permCode: 'project_createBaseComponent', background: '', size: 'mini', hideText: true, callback: function (e, self) {
                  self.add()
                }
              },
              {
                text: '编辑', icon: 'el-icon-edit', permCode: 'project_updateById', background: '', size: 'mini', hideText: true, callback: function (e, self) {
                  self.edit(self.boxSelectValue[0])
                }
              },
              {
                text: '删除', icon: 'el-icon-delete', permCode: 'project_deleteById', background: '', size: 'mini', hideText: true, callback: function (e, self) {
                  self.handleDelete(self.boxSelectValue[0])
                }
              },
            ]
          },
          ganttaData: [],
          initScript: {
            url: {
              deleteUri: '/cw-pms-task/project/deleteById',
              editUri: '/cw-pms-app/pms_pro_wbs_item/updateById',
              addUri: '/cw-pms-app/pms_pro_wbs_item/createBaseComponent',
              addBatchUri:'/cw-pms-app/pms_pro_wbs_item/createBaseComponents',
              queryUri: '/cw-pms-app/pms_pro_wbs_item/queryPage',
            },
          },
        }
        //Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
        return _initdata
      },
      created() {

      },
      mounted() {

      },
      methods: {
        handleUpload(param,callback){
         if(!param || (param && param.length==0)){
            this.$message({
                type: 'error',
                message: '上传的数据不能为空'
                
              })
            return
          }

       this.$confirm("您确定需要导入项目计划吗？", i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
            }).then(() => {
              const _data = { url: this.component.attribute.addUri, params:{data:{data:param}}}
                this.$store.dispatch('fmsCommon/actionPost', _data)
                .then(data => {
                  if(callback && typeof callback==='function')
                      callback(data)
                      this.pullProjectTaskData()
                }).catch(err => {

                }).finally(()=>{

                })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: 'cancel upload'
              });
            })

          },
        uploadClick(){
          this.dialogUploadVisible=true
        },
        handleDownload(callback,error,complete){
        // //构造参数
        let gantta = this.$refs['CwGantta']
        let columns = []
        let header = []
        gantta.cols.forEach(element => {
          columns.push(element.field)
          header.push(element.title)
        });
          this.filter = columns
          this.header = header
          this.columnName=columns
      
           this.list = this.ganttaData
          if(callback && typeof callback==='function')
              callback(this.ganttaData)
      },
        exportClick(){
          this.dialogExportVisible=true

        },
        handleExportClose(){
        this.dialogExportVisible=false
        },

        handleUploadClose(){
          this.dialogUploadVisible=false
        },
        comText() {
          return '计划图'
        },
        ificationType() {
          return {
            classification: '布局容器组件',
            isCanvasview: false,
          }
        },
        renderGettableData(row) {
          this.dateRange = [row.BEGIN_DATE, row.END_DATE]
          this.projectName = row.PROJECT_NAME
          this.projectCode = row.PROJECT_CODE
          this.pmUser = row.PM
          this.id = row.ID
          let sqlWheres = []
          sqlWheres.push({
            column: 'PROJECT_ID',
            condition: '=',
            value: row.ID
          })
          const _data = { url: this.component.attribute.queryUri, params: { data: { sqlWhere: sqlWheres, orderBy: 'ORDER BY TASK_INDEX ASC' } } }
          this.$store.dispatch('fmsCommon/actionPost', _data)
            .then(data => {
              this.ganttaData = data
            }).catch(err => {
              this.$message({
                type: 'error',
                message: '获取任务项目失败' + JSON.stringify(err)
              });
            })

          },

         getAttributeCols() {
        return [
          { field: 'deleteUri', title: '删除地址', queryType: 'input', require: false, query: true, hide: false },
          { field: 'editUri', title: '编辑地址', queryType: 'input', require: false, query: true, hide: false },
          { field: 'addUri', title: '增加地址', queryType: 'input', require: false, query: true, hide: false },
          { field: 'queryUri', title: '查询地址', queryType: 'input', require: false, query: true, hide: false },
          { field: 'showprojectButton', title: '项目按钮', queryType: 'switch', require: false, query: true, hide: false },
           ]
         },
        handleRowDbClick(row) {
          this.dateRange = [row.BEGIN_DATE, row.END_DATE]
          this.projectName = row.PROJECT_NAME
          this.projectCode = row.PROJECT_CODE
          this.pmUser = row.PM
          this.id = row.ID
          this.projectListVisible = false
          this.pullProjectTaskData()
        },
  
  
  
        pullProjectTaskData() {
          let sqlWheres = []
          sqlWheres.push({
            column: 'PROJECT_ID',
            condition: '=',
            value: this.id
          })
          const _data = { url: this.component.attribute.queryUri, params: { data: { sqlWhere: sqlWheres, orderBy: 'ORDER BY TASK_INDEX ASC' } } }
          this.$store.dispatch('fmsCommon/actionPost', _data)
            .then(data => {
              this.ganttaData = data
            }).catch(err => {
              this.$message({
                type: 'error',
                message: '获取任务项目失败' + JSON.stringify(err)
              });
            })
        },
        handleClose(done) {
          this.$confirm(this.$t('common.btn.sureClose'))
            .then(_ => {
              done();
            })
            .catch(_ => { });
        },
        dateRangeHander() {
        },
        dateRangeTrigger(start, end) {
          // console.log(start,end,this.dateRange)
        },
        addRow() {
          let gantta = this.$refs['CwGantta']
          gantta.addRow()
        },
        saveRow() {
  
          if (this.id === '' || this.id === undefined || this.id === null) {
            this.$message({
              type: 'error',
              message: '当前没有选择可用的项目无法保存'
            });
            return
          }
          this.$confirm('确定要保存吗?', i18n.t("common.tip_info.tips"), {
            confirmButtonText: i18n.t("common.btn.ok"),
            cancelButtonText: i18n.t("common.btn.cancel"),
            type: 'warning'
          }).then(() => {
  
            let gantta = this.$refs['CwGantta']
            //let ganttaCols = this.gantta.cols
            let ganttaData = gantta.ganttaData()
  
            let projectItems = ganttaData.map(item => {
              return {
                ID:item.ID,
                TASK_INDEX: item.TASK_INDEX,
                TASK_NAME: item.TASK_NAME,
                TASK_CODE: item.TASK_CODE,
                TASK_MODE: item.TASK_MODE,
                BEGIN_TIME: item.BEGIN_TIME,
                END_TIME: item.END_TIME,
                PRE_TASK: item.PRE_TASK.join(','),
                TIME_LIMIT: item.TIME_LIMIT,
                DESCRIPTION: item.DESCRIPTION,
                WIDTH: item.WIDTH,
                HEIGHT: item.HEIGHT,
                BACKGROUND_COLOR: item.BACKGROUND_COLOR,
                MATGIN_LEFT: item.MATGIN_LEFT,
                UDF1: item.UDF1,
                PROJECT_ID: this.id
              }
            })
            let _data = { url: this.component.attribute.addUri, params: { data: { data: projectItems } } }
            this.$store.dispatch('fmsCommon/actionPost', _data)
              .then(data => {
                this.$message({
                  type: 'success',
                  message: '任务创建成功' + data
                });
                this.pullProjectTaskData()
  
              }).catch(err => {
                this.$message({
                  type: 'error',
                  message: '执行失败' + JSON.stringify(err)
                });
              })
  
          }).catch(() => {
            this.$message({
              type: 'info',
              message: 'cancel'
            });
          })
  
  
        },
        handleReset() { },
        handleDelete(row) {
          this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
            confirmButtonText: i18n.t("common.btn.ok"),
            cancelButtonText: i18n.t("common.btn.cancel"),
            type: 'warning'
          }).then(() => {
            const _data = { url: this.component.attribute.deleteUri, params: { data: row.ID } }
            this.$store.dispatch('fmsCommon/actionPost', _data)
              .then(data => {
                //this.list.splice($index, 1)
                this.loadData();
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
        },
        handleSave(data, success, fail, complete) {
          let _data = { url: this.component.attribute.addUri, params: { data: { data: data } } }
          this.$store.dispatch('fmsCommon/actionPost', _data)
            .then(data => {
              this.$message({
                type: 'success',
                message: 'change success!=>' + data
              });
              if (success && typeof success === 'function') {
                success(data)
              }
            }).catch(err => {
              if (fail && typeof fail === 'function') {
                fail(err)
              }
            }).finally(() => {
              if (complete && typeof complete === 'function') {
                complete()
              }
            })
        },
        handleUpdate(data, success, fail, complete) {
          const _data = {
            url: this.component.attribute.editUri, params: {
              data: data
            }
          }
          this.$store.dispatch('fmsCommon/actionPost', _data)
            .then(data => {
              this.$message({
                type: 'success',
                message: 'change success!=>' + data
              });
              if (success && typeof success === 'function') {
                success(data)
              }
            }).catch(err => {
              if (fail && typeof fail === 'function') {
                fail(err)
              }
            }).finally(() => {
              if (complete && typeof complete === 'function') {
                complete()
              }
            })
        },
        handleAdd(type, data, success, fail, complete) {
          if (type === 'add') {
            this.handleSave(data, success, fail, complete)
          }
          if (type === 'update') {
            this.handleUpdate(data, success, fail, complete)
          }
        },
        init(script) {
  
          this.initScript = script
          this.cols = this.initScript.cols
        },
        // loadData(){
        //     Object.assign(this.page.queryParams, this.page.listQuery)
        //     const _data = { url: '/data-base/queryPage', params: this.page.queryParams }
        //     this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        //     .then(data => {
        //         this.data = data.data
        //         this.page.total = data.total
        //         this.dataLoading = false
        //     }).catch(err => {
        //         console.error(err)
        //     })
        // }
        loadList(param, callback, error, complete) {
          const _data = { url: this.component.attribute.queryUri, params: param }
          this.$store.dispatch('fmsCommon/actionPost', _data)
            .then(data => {
              if (callback && typeof callback === 'function')
                callback(data)
            }).catch(err => {
              if (error && typeof error === 'function')
                error(err)
            }).finally(() => {
              if (complete && typeof complete === 'function')
                complete()
            })
        },
        loadData(param, callback, error, complete) {
          Object.assign(this.page.queryParams, this.page.listQuery)
          let params = param || this.page.queryParams
          let that = this
          if (param) {
            this.loadList(params, callback, error, complete)
            return
          }
          this.loadList(params, (data) => {
            that.data = data.data
            that.page.total = data.total
            that.dataLoading = false
          }, (error) => {
            console.error(error)
          })
        },
        onContextmenu(event, row, ri, ci) {
        if (ci == 0) { ci = 1 }
                this.rightclickInfo = {
                    menuId: 'menu' + '-' + row.ID,
                    position: {
                        x: event.offsetX + (ci) * 100 - 50,
                        y: event.clientY-150,
                    },
                    menulists: [
                        {
                            fnName: "rmenuDelete",
                            params: { event, row },
                            btnName: "删除",
                            shortcutKey: "delete",
                            children: [],
                        },
                        {
                            fnName: "rmenuControllUser",
                            params: { event, row },
                            btnName: "管理人员",
                            shortcutKey: "",
                            children: [],
                        },
                    ],
                };
                 if(!row.ID){
                    this.rightclickInfo.menulists=[
                        {
                            fnName: "rmenuDelete",
                            params: { event, row },
                            btnName: "删除",
                            shortcutKey: "delete",
                            children: [],
                        }
                    ]
                }
        },
        // 管理人员
        rmenuControllUser(params, row) {
          this.controllUserVisible = true;
          this.projectRowData = params.row
        },
        controllUserClose() {
          this.controllUserVisible = false;
        }
      }
    }
  </script>
  
  <style lang="less" scoped>
    .preview {
      width: 100%;
      height: 100%;
    }
  
    .filterItem {
      width: 25%;
      display: inline-block;
      vertical-align: middle;
  
    }
  </style>