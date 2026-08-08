<template>
  <div class="app-container">
    <CwGantta ref="CwGantta" :editGantta="false" :dateRange="dateRange" :loadGanttaData="ganttaData" :projectName="projectName"
      :projectCode="projectCode" :pmUser="pmUser" :id="id" />
  </div>
</template>
<script>
import i18n from "@/lang";
import CwTable from "@/components/Cw/CwTable"
import CwGantta from "@/components/Cw/CwGantta"

import SqlSearchIndex from "@/components/searchCommon/sqlSearchIndex"

export default {
  name: 'CwGanttCompt',
  components: { CwTable, SqlSearchIndex,CwGantta },
  directives: {},
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
    selfAttribute: {

    },
    myStyle: {
      type: Object,
      default: () => {
        return { color: 'black' }
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
    component: {
      type: Object,
      default: () => { }
    },
    bindData: {
      type: Object,
      default: () => { }
    },
  },
  data() {
    const _initdata = {
      methods:{},
      vueContext:{},
      dateRange: [],
      ganttaData: [
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} }
                ],
      projectName: '',
      projectCode: '',
      pmUser: '',
      id: '',

      bizCode: '',
      data: [],
      count: 0,
      dataLoading: false,
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
      initScript: undefined,
    }
    //Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
    return _initdata
  },
  created() {

  },
  watch: {
    'component.elementCode': {
        handler: function(newVal, oldVal){
            if (newVal !== oldVal) {
              this.initGantt();

            }
        },
        deep: true,
        //immediate: true,
      },
    'component.attribute.url': {
        handler: function(newVal, oldVal){
            if (newVal !== oldVal) {
                this.ganttUrlData(newVal,this.component.attribute.params)
            }
        },
        deep: true,
      },
  },
  mounted() {
    this.$nextTick(() => {
      this.initGantt();
    });

  },
  methods: {
    ganttUrlData(urls,eParams){
      const _data = {url:urls,params:eval(`(${eParams})`)}
        this.$store.dispatch('fmsCommon/actionTaskPost',_data)
          .then(data => {
            
            let begintimeArr = []
            data.forEach(item=>{
              if(item.BEGIN_TIME){
                begintimeArr.push(item.BEGIN_TIME)

              }
            })
            let endtimeArr = data.map(item=>item.END_TIME)
            function getEarliestDate(dates,range) {
              const dateObjects = dates.map(dateStr => new Date(dateStr));
              const earliestDate = range=='min' ? new Date(Math.min.apply(null, dateObjects)) : new Date(Math.max.apply(null, dateObjects));
              return earliestDate.toISOString().split('T')[0]; // 返回YYYY-MM-DD格式的字符串
            }
            let mintime = getEarliestDate(begintimeArr,'min')
            let maxtime = getEarliestDate(endtimeArr,'max')
            this.dateRange = [mintime, maxtime]
            this.ganttaData = data


          }).catch(err => {
              console.error(err)
          })

    },
    initGantt() {
         let url = this.component.attribute.url, params = this.component.attribute.params;
         if (url && params) {
            this.ganttUrlData(url,params)
         } else if(this.component.elementCode){
            let obj = eval(`(${this.component.elementCode})`)
              this.ganttaData = obj.ganttData 
           
        } 
        
    },
    renderGettableData(row){
      this.dateRange = [row.BEGIN_DATE, row.END_DATE]
      this.projectName = row.PROJECT_NAME
      this.projectCode = row.PROJECT_CODE
      this.pmUser = row.PM
      let sqlWheres = []
        sqlWheres.push({
          column: 'PROJECT_ID',
          condition: '=',
          value: row.ID
        })
        const _data = { url: '/project-item/query', params: { data: { sqlWhere: sqlWheres, orderBy: 'ORDER BY TASK_INDEX ASC' } } }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            this.ganttaData = data
          }).catch(err => {
            this.$message({
              type: 'error',
              message: '获取任务项目失败' + JSON.stringify(err)
            });
          })

    },
    comText() {
      return '甘特图'
    },
    ificationType() {
      return {
        classification: '图表组件',
        isCanvasview: false,
      }
    },
    getStyleCols() {
        return [
          { field: 'width', title: '长度', queryType: 'input', defaultValue: '', },
          { field: 'height', title: '高度', queryType: 'input', defaultValue: '', },
          { field: 'borderColor', title: '边框颜色', queryType: 'colorpicker', defaultValue: '', },
          { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', defaultValue: '', },
        ]
    },
    getAttributeCols() {
      return [
        { field: 'url', title: 'url', queryType: 'input', require: false, query: true, hide: false },
        { field: 'params', title: 'params', queryType: 'input', require: false, query: true, hide: false },
      ]
    },
    handleReset() { },
    handleDelete(row) {
      this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
        confirmButtonText: i18n.t("common.btn.ok"),
        cancelButtonText: i18n.t("common.btn.cancel"),
        type: 'warning'
      }).then(() => {
        const _data = { url: this.initScript.url.deleteUri, params: { data: row.ID } }
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
      let _data = { url: this.initScript.url.addUri, params: { data: { data: data } } }
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
        url: this.initScript.url.editUri, params: {
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
    
   
    loadList(param, callback, error, complete) {
      const _data = { url: this.initScript.url.queryUri, params: param }
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
    }
  }
}
</script>

<style lang="less" scoped>
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

::v-deep .el-input-group__append {
  width: 18px;
  border: 1px solid #0370AA;
  border-left: none;
  background-color: white;
}

//::v-deep .el-input__inner {
//  padding: 0 10px 0 5px;
//}


.dropdownicon {
  display: inline-block;
  height: 28px;
  border: 1px solid #0370AA;
  border-left: none;
  border-radius: 0 3px 3px 0;
  line-height: 28px;
  margin-right: 10px;
  padding: 0 10px;
}

::v-deep .el-form--inline .el-form-item {
  margin-right: 0;
}

::v-deep .el-input__inner:hover {
  border: 1px solid #0370AA;
}

.dropdownicon:hover {
  /* border: 1px solid #DCDFE6; */
  /* border-left: none; */
  cursor: pointer;
}
</style>