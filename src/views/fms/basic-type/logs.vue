/*
* @CreatAuthor: 宋丹峰
* @UpdateAuthor: (...)
* @Description: 系统管理-接口日志
*/
<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item,index) in cols" :key="index" style="display:inline">
        <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]"
                  :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
        </el-input>
        <el-select filterable v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]"
                   :placeholder="commonI18n(item)" style="width: 120px" class="filter-item">
          <el-option
            v-for="item in initSelect[item.field]"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker
          v-if="item.query && item.queryType==='date'"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="queryParams.requestData[item.field]"
          type="datetimerange"
          :range-separator="$t('common.btn.to')"
          :start-placeholder="commonI18n(cols[3])"
          :end-placeholder="commonI18n(cols[4])"
          style="width: 150"
          class="filter-item"/>
      </div>
      <el-button type="primary" class="filter-item" @click="query()">
        {{ $t("common.btn.query") }}
      </el-button>
      <el-button type="info" class="filter-item" @click="reset">
        {{ $t("common.btn.reset") }}
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"
              @row-dblclick="showDetails" :cell-class-name="getCellClass">

      <el-table-column min-width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
          <span>{{(listQuery.current - 1) * listQuery.pageSize + (scope.$index+1)}}</span>
        </template>
      </el-table-column>

      <el-table-column v-for="(item) in cols" :sortable="true" :key="item.id" :label="commonI18n(item)" :prop="item.field"
                       :width="item.width"
                       :min-width="item.minWidth" v-if="!item.hide" :align="item.align" 
                       :formatter="item.template == undefined ? function(row, column, cellValue, index) {
                           return cellValue;
                         } : item.template" >
                         <!-- show-overflow-tooltip -->
        <template  slot-scope="{row}">{{commonFilter(row[item.field],item.field,row)}}</template>
      </el-table-column>

      <el-table-column align="left" :label="$t('common.btn.operate')" fixed="right" width="280">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="detail(scope.row,0)"
          >
           {{ $t('common.btn.requestContent') }}
          </el-button>

          <el-button
            type="primary"
            size="small"
            @click="detail(scope.row,1)"
          >
          {{ $t('common.btn.responseContent') }}
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>

   <!-- <el-drawer
      title="请求内容"
      :visible.sync="drawer"
      :direction="direction"
      size="50%"
      :before-close="handleClose">
      <div  style="height: 700px;overflow: auto;padding-left: 30px;font-weight: bold;background: #000;">
        <pre style="color: #909090" v-html="content"></pre>
      </div>
    </el-drawer>-->


    <ContentShow ref="ContentShow"></ContentShow>
  </div>

</template>

<script>
  import waves from "@/directive/waves"; // waves directive
  import elDragDialog from "@/directive/el-drag-dialog";
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import i18n from '@/lang';
  import ContentShow from '../../common/ContentShow.vue';


  export default {
    name: 'CellList',
    components: {Pagination,ContentShow },
    directives: {waves, elDragDialog},
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
        queryParams: {
          requestData: {
            timeDate:undefined
          }
        },
        content:'',
        drawer: false,
        direction: 'rtl',
        initSelect: {
          trayType: [],
          type: [{label: '启用业务编码', value: 0}, {label: '禁用业务编码', value: 1}]
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
          {field: 'bizCode', title: '业务代码', Width: 200, query: true, align: 'left', queryType: 'input'},
          { field: 'content', title: '请求内容', Width: 200, align: 'left',query: true, queryType:'input',  },
          { field: 'result', title: '响应', minWidth: 200, align: 'left', query: false, queryType:'input',  },
          { field: 'status', title: '响应时间', minWidth: 200, align: 'left', query: false, queryType:'input',  },
          {field: 'startTime', title: '开始日期', Width: 100, query: false, align: "center", queryType: 'date', set: false,hide:true},
          {field: 'endTime', title: '结束日期', Width: 100, query: false, align: "center", queryType: 'date', set: false,hide:true},
          {field: 'ip', title: '请求IP', Width: 100, query: false, align: "center", queryType: 'input', set: false},
          {
            field: 'createTime',
            title: '创建日期',
            minWidth: 100,
            query: false,
            align: "center",
            queryType: 'date',
            set: false
          },
          {
            field: 'timeDate',
            title: '创建日期',
            minWidth: 100,
            query: true,
            hide:true,
            align: "center",
            queryType: 'date',
            set: false
          },
        ]
      }
      Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
      return _initdata
    },
    created() {
      let date = new Date();
      let endTime = this.getNowDate(date);
      date.setDate(date.getDate() - 1);
      let startTime = this.getNowDate(date);
      this.queryParams.requestData.timeDate = [startTime,endTime]
      this.selectOptions()
      this.getList()
    },
    methods: {
      getCellClass({ row, column, columnIndex }) {
      if (column.property && column.property === 'content') {
        return 'redClass'
      } 
    },

      selectOptions() {
        const _data = {url: '/codes/guest/get-type-code', params: {data: "FMS_IOT"}}
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            this.initSelect.bizCode = data.map(c => {
              return {
                label: c.bizValue,
                value: c.bizCode
              }
            })

          }).catch(err => {
          console.error(err)
        })


        let process_data = {url: '/codes/guest/get-type-code', params: {data: "PROCESS"}}
        this.$store.dispatch('fmsCommon/actionTaskPost', process_data)
          .then(data => {
            this.initSelect.process = data.map(c => {
              return {
                label: c.bizValue,
                value: c.bizCode
              }
            })

          }).catch(err => {
          console.error(err)
        })
      },
      getNowDate (date) {
        var sign2 = ":";
        var year = date.getFullYear() // 年
        var month = date.getMonth() + 1; // 月
        var day = date.getDate(); // 日
        var hour = date.getHours(); // 时
        var minutes = date.getMinutes(); // 分
        var seconds = date.getSeconds() //秒
        var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
        var week = weekArr[date.getDay()];
        // 给一位数的数据前面加 “0”
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (day >= 0 && day <= 9) {
          day = "0" + day;
        }
        if (hour >= 0 && hour <= 9) {
          hour = "0" + hour;
        }
        if (minutes >= 0 && minutes <= 9) {
          minutes = "0" + minutes;
        }
        if (seconds >= 0 && seconds <= 9) {
          seconds = "0" + seconds;
        }
        return year + "-" + month + "-" + day + " " + hour + sign2 + minutes + sign2 + seconds;
      },
      syntaxHighlight(json){
        if (typeof json != 'string') {
          json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
          var cls = 'number';
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'key';
            } else {
              cls = 'string';
            }
          } else if (/true|false/.test(match)) {
            cls = 'boolean';
          } else if (/null/.test(match)) {
            cls = 'null';
          }
          return '<span class="' + cls + '">' + match + '</span>';
        });
      },
      detail(row,state){
        if(state == 0){
          this.$refs.ContentShow.detail(row.content);
        }else {
          this.$refs.ContentShow.detail(row.result);
        }
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
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      commonFilter(value, type, row) {

        if (this.initSelect.hasOwnProperty(type) && typeof this.initSelect[type] != undefined && Array.isArray(this.initSelect[type])) {
          let convert = this.getValueConvert(this.initSelect[type], value);
          let process = this.getValueConvert(this.initSelect["process"], JSON.parse(row.content).processCode);
          return process == undefined ? convert : convert + "[" + process + "]"
        }
        if (this.initSelect.hasOwnProperty(type) && !Array.isArray(this.initSelect[type]) && this.initSelect[type].hasOwnProperty(value)) {
          return this.initSelect[type][value]
        }
        return value
      },
      rencentTime() {
        let d = new Date(), y = d.getFullYear(), m = d.getMonth() + 1,
          da = d.getDate(), h = d.getHours(), mi = d.getMinutes(), s = d.getSeconds();
        console.log(y + "-" + m + "-" + da + " " + h + ":" + mi + ":" + s)
        m = m < 10 ? `0${m}` : m;
        da = da < 10 ? `0${da}` : da;
        h = h < 10 ? `0${h}` : h;
        mi = mi < 10 ? `0${mi}` : mi;
        s = s < 10 ? `0${s}` : s;
        // console.log(y + "-" + m + "-" + da + " " + h + ":" + mi + ":" + s)
        return y + "-" + m + "-" + da + " " + h + ":" + mi + ":" + s;
      },
      //初始化表格信息
      getList() {
        Object.assign(this.queryParams, this.listQuery)
        if(this.queryParams.requestData.timeDate == undefined  || this.queryParams.requestData.timeDate.length < 1){
          this.$message({
            type: 'error',
            message: '请选择时间范围！'
          });
          return false
        }
        if (this.queryParams.requestData.timeDate) {
          this.queryParams.requestData.startTime = this.queryParams.requestData.timeDate[0]
          this.queryParams.requestData.endTime = this.queryParams.requestData.timeDate[1]
        }
        this.listLoading = true
        const _data = {url: '/interfaceLog/list-async', params: this.queryParams}
        this.$store.dispatch('fmsCommon/actionFmsPost', _data)
          .then(data => {
            this.list = data.data
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
        this.destory(true)
      },
      showDetails(row, column) {
      },

      submit(formName) {
        const _data = {
          url: '/ticket/add', params: {
            data: this.defaultForm.params
          }
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('fmsCommon/actionAuthPost', _data)
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
        this.listQuery.current = 1;
        let dateRange = this.queryParams.requestData.createTime;
        if (dateRange != undefined) {
          this.queryParams.requestData.startTime = dateRange[0];
          this.queryParams.requestData.endTime = dateRange[1];
        }
        delete this.queryParams.requestData.createTime;
        this.getList();
      },
      reset() {
        for (let p in  this.queryParams.requestData) {
          if (this.queryParams.requestData.hasOwnProperty(p)) {
            this.queryParams.requestData[p] = ''
          }
        }
      },
      save(formName) {
        this.defaultForm.row = {}
        this.defaultForm.params.id = ''
        let _data = {url: '/ticket/add', params: {data: this.defaultForm.params}}
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('fmsCommon/actionAuthPost', _data)
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
          const _data = {url: '/ticket/del', params: {data: row.id}}
          this.$store.dispatch('fmsCommon/actionAuthPost', _data)
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
  ::v-deep .el-table .cell{  
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1; /* 显示的行数，此处为1行 */
    -webkit-box-orient: vertical; /* 必须和 display: -webkit-box 一起使用 */
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
  pre {outline: 1px solid #000; padding: 5px; margin: 5px; }
  .string { color: green; }
  .number { color: darkorange; }
  .boolean { color: blue; }
  .null { color: magenta; }
  .key { color: #92278f; }

</style>
