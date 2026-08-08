<template>
  <div class="app-container">
    <div class="filter-container">
      <div style="float: left">
        <el-date-picker
          v-model="value2"
          @change="editMouthStatus"
          type="year"
          :picker-options="pickerYearOptions"
          placeholder="选择年"
        >
        </el-date-picker>
      </div>
      <!-- <div style="float: left">
        <el-date-picker
          v-model="value3"
          @change="editDayStatus"
          :disabled="isEditMonth"
          type="month"
          :picker-options="pickerMonthOptions"
          placeholder="选择月"
          :hidden="true"
        >
        </el-date-picker>
      </div>
      <div style="float: left">
        <el-date-picker
          type="dates"
          :disabled="isEditDay"
          @change="editDateTime"
          v-model="value4"
          :picker-options="pickerDayOptions"
          placeholder="选择一个或多个日期"
          :hidden="true"
        >
        </el-date-picker> -->
      <!-- </div> -->
      <div style="float: left">
        <el-button @click="pageIndex">查询</el-button>
        <el-button @click="printTable">打印</el-button>
      </div>
    </div>

    <div style="margin-top: 30px">
      <div id="printCode" ref="reportdiv" :style="{ width: divwidth }">
        <h3 style="text-align: center">
          {{ currentYear }}年{{ reportTableOptions.REPORT_TABLE_NAME }}
        </h3>
        <span style="float: right">{{ datetimeNow }}</span>
        <div v-for="n in tableIndex" :key="n">
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="reportlistdata[n]"
            :row-class-name="tableRowClassName"
            border
            fit
            highlight-current-row
            style="width: 100%"
            ref="tableFormate"
            cell
          >
            <el-table-column label="序号" width="50px" align="center">
              <template slot-scope="scope">
                <span v-if="direction == 'landscape'">{{ scope.row.currentIndex }}</span>
                <span v-else>{{ scope.row.index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="item in reportListOptions"
              :key="item.COLUMN_KEY"
              v-if="item.COLUMN_SHOW == '1' && item.COLUMN_WIDTH === 0"
              :label="item.COLUMN_TITLE"
              :prop="item.COLUMN_KEY"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row[item.COLUMN_KEY] }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="item.COLUMN_TITLE"
              :prop="item.COLUMN_KEY"
              v-else-if="item.COLUMN_SHOW == '1' && item.COLUMN_WIDTH !== 0"
              :width="item.COLUMN_WIDTH"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span
                  v-if="item.COLUMN_KEY == 'FLAG'"
                  v-html="flag(scope.row, scope.row[item.COLUMN_KEY])"
                ></span>
                <span v-else>{{ scope.row[item.COLUMN_KEY] }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div
            v-if="n == tableIndex ? false : true"
            style="page-break-after: always"
          ></div>
        </div>

        <span style="float: left; margin-left: 200px; margin-top: 50px">日期:</span>
        <span style="float: right; margin-right: 300px; margin-top: 50px">签字:</span>
      </div>
    </div>
  </div>
</template>

<script>
import print from "print-js";
import { getSysTableColumnByTableCode } from "@/api/sys_table";
import { GetRecordReport } from "@/api/record";
import Pagination from "@/components/Pagination";
import { GetReportTableByName } from "@/api/report";

const flagInfo = [
  { key: "0", display_name: "否" },
  { key: "1", display_name: "是" },
];
export default {
  name: "Detailreport",
  data() {
    return {
      pickerYearOptions: {
        disabledDate: (time) => {
          const date = new Date();
          const year = date.getFullYear();
          const currentdate = year.toString(); // 当前年月

          const page_year = time.getFullYear();
          const pageDate = page_year.toString(); //页面中的年月

          let min_year = date.getFullYear() - 2;
          const minDate = min_year.toString(); // 最小年月
          return currentdate < pageDate || pageDate < minDate;
        },
      },
      pickerMonthOptions: {
        disabledDate: (time) => {
          const date = new Date();
          const year = this.value2.getFullYear();
          let month = date.getMonth() + 1;
          if (month >= 1 && month <= 9) {
            month = "0" + month;
          }
          const currentdate = year.toString() + month.toString(); // 当前年月

          const page_year = time.getFullYear();
          let page_month = time.getMonth() + 1;
          if (page_month >= 1 && page_month <= 9) {
            page_month = "0" + page_month;
          }
          const pageDate = page_year.toString() + page_month.toString(); //页面中的年月

          let min_year = this.value2.getFullYear();
          let min_month = date.getMonth() + 1 - 11;
          if (min_month <= 0) {
            min_year = min_year - 1;
            min_month = 12 + min_month;
          }
          if (min_month >= 1 && min_month <= 9) {
            min_month = "0" + min_month;
          }
          const minDate = min_year.toString() + min_month.toString(); // 最小年月
          return currentdate < pageDate || pageDate < minDate;
        },
      },
      pickerDayOptions: {
        disabledDate: (time) => {
          const date = new Date();
          const year = this.value2.getFullYear();
          let month = this.value3.getMonth() + 1;
          if (month >= 1 && month <= 9) {
            month = "0" + month;
          }
          const currentdate = year.toString() + month.toString(); // 当前年月

          const page_year = time.getFullYear();
          let page_month = time.getMonth();
          if (page_month >= 1 && page_month <= 9) {
            page_month = "0" + page_month;
          }
          const pageDate = page_year.toString() + page_month.toString(); //页面中的年月

          let min_year = this.value2.getFullYear();
          let min_month = this.value3.getMonth();
          if (min_month <= 0) {
            min_year = min_year - 1;
            min_month = 12 + min_month;
          }
          if (min_month >= 1 && min_month <= 9) {
            min_month = "0" + min_month;
          }
          const minDate = min_year.toString() + min_month.toString(); // 最小年月
          return currentdate < pageDate || pageDate < minDate;
        },
      },
      isInput: true,
      title: undefined,
      value2: undefined,
      value3: undefined,
      value4: [],
      reportTableOptions: {},
      reportListOptions: [],
      isPrintShow: false,
      flagInfo,
      tablename: {},
      itemOptions: [],
      datetimeNow: {},
      tableKey: 0,
      listLoading: false,
      storagedetailData: [],
      listLambdaSearch: [],
      total: 0,
      reportlistdata: [],
      lambdaSearch: {
        KEY: undefined,
        LAMBDA: undefined,
      },
      listQuery: {
        page: 1,
        limit: 1000,
        MONTH_TIME: undefined,
        MANAGEOUT: undefined,
        MANAGEIN: undefined,
        TOTAL: undefined,
      },
      data: [],
      dttime: [],
      listLambdaQuery: [],
      isEditMonth: true,
      isEditDay: true,
      dateTimeArray: [],
      tableIndex: 0,
      direction: undefined,
      reportOptions: [],
      divwidth: "",
      currentIndex: 0,
      currentYear: undefined,
    };
  },
  created() {
    this.formatDate();
    this.getSysTable();
  },

  methods: {
    editMouthStatus(val) {
      if (val == null) {
        this.isEditMonth = true;
        return;
      }
      this.value3 = undefined;
      this.value2 = val;
      this.currentYear = val.getFullYear();
      this.isEditMonth = false;
    },
    editDayStatus(val) {
      if (val == null) {
        this.isEditDay = true;
        return;
      }
      this.value4 = undefined;
      this.value3 = val;
      this.isEditDay = false;
    },
    editDateTime(val) {
      this.value4 = val;
    },
    getSysTable() {
      this.$set(this.tablename, "tableCode", "RECORD_MONTH_REPORT");
      GetReportTableByName(this.tablename).then((response) => {
        this.reportTableOptions = response.data.REPORT_TABLE;
        this.reportListOptions = response.data.REPORT_TABLE_COLUMN;
        this.direction =
          this.reportTableOptions.REPORT_DIRECTION == "13"
            ? "landscape"
            : this.reportTableOptions.REPORT_DIRECTION == "9"
            ? "landscape"
            : this.reportTableOptions.REPORT_DIRECTION == "32"
            ? "portrait"
            : this.reportTableOptions.REPORT_DIRECTION == "22"
            ? "portrait"
            : "portrait";
        this.divwidth = this.reportTableOptions.REPORT_PAPER_SIZE + "px";
      });
    },
    formatDate() {
      let date = new Date();
      let year = date.getFullYear(); // 年
      let month = date.getMonth() + 1; // 月
      let day = date.getDate(); // 日
      let hour = date.getHours(); // 时
      hour = hour < 10 ? "0" + hour : hour; // 如果只有一位，则前面补零
      let minute = date.getMinutes(); // 分
      minute = minute < 10 ? "0" + minute : minute; // 如果只有一位，则前面补零
      let second = date.getSeconds(); // 秒
      second = second < 10 ? "0" + second : second; // 如果只有一位，则前面补零
      this.datetimeNow = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },
    flag: function (row, column) {
      return row.FLAG == 0 ? "否" : row.FLAG == 1 ? "是" : "----";
    },
    async GetDetailPage() {
      this.listLoading = true;
      let storagedetaillist = [];
      await GetStorageDetailList(this.listLambdaQuery).then((response) => {
        this.listLambdaQueryExcel = this.listLambdaQuery;
        //循环遍历将对象转成数组
        for (let i in response.data) {
          this.$set(response.data[i], "currentIndex", parseInt(i) + 1);
          storagedetaillist.push(response.data[i]);
        }

        this.listLambdaQuery = undefined;
        this.listLambdaQuery = new Array();

        //总行数
        if (storagedetaillist.length > 0) {
          this.total = storagedetaillist[0].TOTALCOUNT;
        } else {
          this.total = 0;
        }

        //加载数据
        //this.reportlistdata = storagedetaillist;
        this.tableIndex = Math.ceil(
          storagedetaillist.length / this.reportTableOptions.REPORT_DIRECTION
        );
        let findex = parseInt(this.reportTableOptions.REPORT_DIRECTION);
        let dindex = 0;
        let lindex = 0;
        let arraylist = [];
        storagedetaillist.forEach((item, index, array) => {
          if (lindex == 0 && index == findex - 1) {
            findex += findex - 1;
            dindex = 0;
            this.reportlistdata[lindex + 1] = arraylist;
            arraylist = undefined;
            arraylist = new Array();
            lindex++;
          }
          if (index == findex) {
            findex += parseInt(this.reportTableOptions.REPORT_DIRECTION);
            dindex = 0;
            this.reportlistdata[lindex + 1] = arraylist;
            arraylist = undefined;
            arraylist = new Array();
            lindex++;
          }
          arraylist[dindex] = item;
          dindex++;
        });
        if (arraylist.length > 0) {
          this.reportlistdata[lindex + 1] = arraylist;
        }
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    pageIndex() {
      this.listQuery.page = 1;
      this.handleFilter();
    },
    handleFilter() {
      this.listLoading = true;
      this.dateTimeArray = new Array();
      let obj = JSON.parse(JSON.stringify(this.listLambdaSearch));
      if (this.value2 != "" && this.value2 != undefined && this.value2 != null) {
        if (this.value3 != "" && this.value3 != undefined && this.value3 != null) {
          if (this.value4 != "" && this.value4 != undefined && this.value4 != null) {
            let monthDate = this.value3.getMonth() + 1;
            monthDate = monthDate < 10 ? "0" + monthDate : monthDate;
            this.value4.forEach((item, index, array) => {
              this.dateTimeArray[index] =
                this.value2.getFullYear() + "-" + monthDate + "-" + item.getDate();

              var lambdaSearch = {};
              lambdaSearch.LAMBDA_KEY = "CREATE_TIME";
              lambdaSearch.LAMBDA_VALUE = undefined;
              lambdaSearch.LAMBDA_START = this.dateTimeArray[index] + " " + "00:00:00";
              lambdaSearch.LAMBDA_END = this.dateTimeArray[index] + " " + "23:59:59";
              lambdaSearch.page = this.listQuery.page;
              lambdaSearch.limit = this.listQuery.limit;
              lambdaSearch.LAMBDA_LAMBDASEARCH = "range";
              this.listLambdaQuery.push(lambdaSearch);
            });
          } else {
            let monthDate = this.value3.getMonth() + 1;
            monthDate = monthDate < 10 ? "0" + monthDate : monthDate;
            this.dateTimeArray[0] = this.value2.getFullYear() + "-" + monthDate;

            var lambdaSearch = {};
            lambdaSearch.LAMBDA_KEY = "CREATE_TIME";
            lambdaSearch.LAMBDA_VALUE = undefined;
            lambdaSearch.LAMBDA_START = this.dateTimeArray[0] + "-" + "01 " + "00:00:00";
            lambdaSearch.LAMBDA_END = this.dateTimeArray[0] + "-" + "31 " + "23:59:59";
            lambdaSearch.page = this.listQuery.page;
            lambdaSearch.limit = this.listQuery.limit;
            lambdaSearch.LAMBDA_LAMBDASEARCH = "range";
            this.listLambdaQuery.push(lambdaSearch);
          }
        } else {
          this.listLoading = true;
          this.reportlistdata = new Array();
          let query = {
            year: this.value2.getFullYear(),
          };
          GetRecordReport(query).then((response) => {
            if (this.direction == "landscape") {
              for (let i in response.data) {
                this.$set(response.data[i], "currentIndex", parseInt(i) + 1);
              }
              this.tableIndex = Math.ceil(
                response.data.length / this.reportTableOptions.REPORT_DIRECTION
              );
              if (response.data.length == this.reportTableOptions.REPORT_DIRECTION) {
                this.tableIndex += 1;
              }
              let findex = parseInt(this.reportTableOptions.REPORT_DIRECTION);
              let dindex = 0;
              let lindex = 0;
              let arraylist = [];
              response.data.forEach((item, index, array) => {
                if (lindex == 0 && index == findex - 1) {
                  findex += findex - 1;
                  dindex = 0;
                  this.reportlistdata[lindex + 1] = arraylist;
                  arraylist = undefined;
                  arraylist = new Array();
                  lindex++;
                }
                if (index == findex) {
                  findex += parseInt(this.reportTableOptions.REPORT_DIRECTION);
                  dindex = 0;
                  this.reportlistdata[lindex + 1] = arraylist;
                  arraylist = undefined;
                  arraylist = new Array();
                  lindex++;
                }
                arraylist[dindex] = item;
                dindex++;
              });
              if (arraylist.length > 0) {
                this.reportlistdata[lindex + 1] = arraylist;
              }
            } else {
              this.tableIndex = 1;
              this.reportlistdata[1] = response.data;
            }
          });
        }
      } else {
        var lambdaSearch = {};
        lambdaSearch.LAMBDA_KEY = undefined;
        lambdaSearch.LAMBDA_VALUE = undefined;
        lambdaSearch.LAMBDA_START = undefined;
        lambdaSearch.LAMBDA_END = undefined;
        lambdaSearch.page = this.listQuery.page;
        lambdaSearch.limit = this.listQuery.limit;
        lambdaSearch.LAMBDA_LAMBDASEARCH = "unconditional";
        this.listLambdaQuery.push(lambdaSearch);
      }
      setTimeout(() => {
        this.listLoading = false;
      }, 500);
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    printTable() {
      print({
        printable: "printCode",
        type: "html",
        //header: "采购单",
        // <div v-if="isPrintShow" style="page-break-before:always"></div>
        //headerStyle: "text-align:center;", //color:#f00;width:100%;border:1px #000 solid;
        // targetStyles: ['border', 'padding: 15px'],
        scanStyles: false,
        style: `table tr td,th {text-align:center;border-collapse: collapse;padding-top:10px;padding-bottom: 10px;border:1px #000 solid;} @page{size:${this.direction};margin:0mm;margin:10px;margin:25px}`,
      });
    },
  },
};
</script>
