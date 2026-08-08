<template>
  <div class="app-container">
    <el-row :gutter="50">
      <el-col :span="9">
        <div class="filter-container">
          <el-input
            v-model="searchName"
            placeholder="报表名称"
            style="width: 120px"
            class="filter-item"
            clearable
          />
          <el-button
            
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="searchReportTable"
          >
            {{ $t("table.search") }}
          </el-button>
          <el-button
            
            class="filter-item"
            type="warning"
            icon="el-icon-remove"
            @click="handleClear"
          >
            {{ $t("table.reset") }}
          </el-button>
          <el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            icon="el-icon-edit"
            @click="handleCreateTable"
          >
            {{ $t("table.add") }}
          </el-button>
        </div>
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="reportTableData"
          border
          fit
          highlight-current-row
          style="width: 100%"
          :row-class-name="tableRowClassName"
          @row-click="selectrow"
        >
          <el-table-column label="序号" width="50px" align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in itemOptions"
            :key="item.COLUMN_KEY"
            :label="item.COLUMN_TITLE"
            :prop="item.COLUMN_KEY"
            :width="item.COLUMN_WIDTH"
            v-if="item.COLUMN_SHOW == '1'"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="item.COLUMN_KEY == 'REPORT_PAPER_SIZE'"
                v-html="sizeChinese(scope.row)"
              ></span>
              <span
                v-else-if="item.COLUMN_KEY == 'REPORT_DIRECTION'"
                v-html="directionChinese(scope.row)"
              ></span>
              <span
                v-else-if="item.COLUMN_KEY == 'REPORT_FLAG'"
                v-html="flagChinese(scope.row)"
              ></span>
              <span v-else>{{ scope.row[item.COLUMN_KEY] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="220"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                size="mini"
                @click="handleCreateReprotList(row, $index)"
              >
                {{ $t("table.add") }}
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click="handleEditReportTable(row, $index)"
              >
                {{ $t("table.edit") }}
              </el-button>
              <el-button
                v-if="row.status != 'deleted'"
                size="mini"
                type="danger"
                @click="deleteReportTable(row, $index)"
              >
                {{ $t("table.delete") }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="page"
          :limit.sync="limit"
        />
      </el-col>
      <el-col :span="15" style="margin-top: 52px">
        <el-table
          :key="tableKey"
          v-loading="listcolumnLoading"
          :data="reportListData"
          border
          fit
          highlight-current-row
          style="width: 100%"
          :row-class-name="tableRowClassName"
        >
          <el-table-column label="序号" width="50px" align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in itemOptions2"
            :key="item.COLUMN_KEY"
            :label="item.COLUMN_TITLE"
            :prop="item.COLUMN_KEY"
            v-if="item.COLUMN_SHOW == '1'"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row[item.COLUMN_KEY] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="220"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                size="mini"
                @click="handleDeleteReportList(row, $index)"
              >
                {{ $t("table.edit") }}
              </el-button>
              <el-button
                v-if="row.status != 'deleted'"
                size="mini"
                type="danger"
                @click="deleteReprotList(row, $index)"
              >
                {{ $t("table.delete") }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog :title="textName" :visible.sync="reportTableDialogFormVisible">
      <el-form
        ref="dataForm2"
        :model="listQuery"
        :rules="rules"
        label-position="left"
        label-width="100px"
      >
        <el-form-item
          v-for="item in itemOptions"
          :key="item.COLUMN_KEY"
          :label="item.COLUMN_TITLE"
          v-if="item.COLUMN_SHOW == '1'"
          :prop="item.COLUMN_KEY"
        >
          <span v-if="item.COLUMN_KEY == 'REPORT_PAPER_SIZE'">
            <el-select v-model="listQuery.REPORT_PAPER_SIZE" @change="getdirection">
              <span v-for="item1 in REPORT_PAPER_SIZE">
                <el-option
                  :key="item1.key"
                  :label="item1.display_name"
                  :value="item1.key"
                ></el-option>
              </span>
            </el-select>
          </span>
          <span v-else-if="item.COLUMN_KEY == 'REPORT_DIRECTION'">
            <el-select v-model="listQuery.REPORT_DIRECTION" v-if="isShow">
              <span v-for="item1 in reportDirectionList">
                <el-option
                  :key="item1.key"
                  :label="item1.display_name"
                  :value="item1.key"
                ></el-option>
              </span>
            </el-select>
          </span>
          <span v-else-if="item.COLUMN_KEY == 'REPORT_FLAG'">
            <el-select v-model="listQuery.REPORT_FLAG">
              <span v-for="item1 in flagData">
                <el-option
                  :key="item1.key"
                  :label="item1.display_name"
                  :value="item1.key"
                ></el-option>
              </span>
            </el-select>
          </span>
          <span v-else>
            <el-input
              v-model="listQuery[item.COLUMN_KEY]"
              placeholder="报表名称"
              class="filter-item"
              clearable
            />
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearListQuery">取 消</el-button>
        <el-button
          type="primary"
          @click="textName == '编辑' ? updateReportTable() : createReportTable()"
        >
          确定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog :title="textName" :visible.sync="reportListDialogFormVisible">
      <el-form
        ref="dataForm3"
        :model="listQuery2"
        :rules="rules2"
        label-position="left"
        label-width="110px"
      >
        <el-form-item
          v-for="item in itemOptions2"
          :key="item.COLUMN_KEY"
          :label="item.COLUMN_TITLE"
          v-if="item.COLUMN_SHOW == '1'"
          :prop="item.COLUMN_KEY"
        >
          <span v-if="item.COLUMN_KEY == 'COLUMN_SHOW'">
            <el-switch
              v-model="listQuery2.COLUMN_SHOW"
              :on-value="true"
              :off-value="false"
            ></el-switch>
          </span>
          <span v-else>
            <el-input
              v-model="listQuery2[item.COLUMN_KEY]"
              :placeholder="item.COLUMN_TITLE"
              class="filter-item"
              clearable
            />
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearListQuery2">取 消</el-button>
        <el-button
          type="primary"
          @click="textName == '编辑' ? updateReportList() : createReportList()"
        >
          确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import elDragDialog from "@/directive/el-drag-dialog"; // base on element-ui
import { getSysTableColumnByTableCode } from "@/api/sys_table";
import {
  GetReportTable,
  CreateReport,
  GetReportTableColumn,
  UpdateReportTable,
  DeleteReportTable,
  CreateReportTableColumn,
  DeleteReportTableColumn,
  UpdateReportTableColumn,
} from "@/api/report";

const calendarTypeOptions = [
  { key: "0", display_name: "否" },
  { key: "1", display_name: "是" },
];

const columntypeOptions = [
  { key: "input", display_name: "单行文本" },
  { key: "icon", display_name: "图标" },
  { key: "tag", display_name: "标签" },
  { key: "select", display_name: "下拉菜单" },
  { key: "switch", display_name: "开关" },
  { key: "radio", display_name: "单选框" },
];

const lambdaOptions = [
  { key: "like", display_name: "模糊查询" },
  { key: "range", display_name: "范围查询" },
  { key: "equality", display_name: "等值查询" },
  { key: "greaterThan", display_name: "大于查询" },
  { key: "lessThan", display_name: "小于查询" },
  { key: "greaterEquality", display_name: "大于等于查询" },
  { key: "lessEquality", display_name: "小于等于查询" },
  { key: "notEquality", display_name: "不等于查询" },
  { key: "unconditional", display_name: "无条件查询" },
  { key: "", display_name: "无条件" },
];

const columninputtypeOptions = [
  { key: "text", display_name: "文本" },
  { key: "number", display_name: "数字" },
];

const flagData = [
  { key: "0", display_name: "否" },
  { key: "1", display_name: "是" },
];
const REPORT_PAPER_SIZE = [
  { key: "1100", display_name: "A4" },
  { key: "700", display_name: "A5" },
];
const REPORT_DIRECTION_A4 = [
  { key: "13", display_name: "横向" },
  { key: "32", display_name: "纵向" },
];
const REPORT_DIRECTION_A5 = [
  { key: "9", display_name: "横向" },
  { key: "22", display_name: "纵向" },
];

export default {
  name: "reporttable",
  components: { Pagination },
  inject: ["reload"],
  directives: { waves, elDragDialog },
  filters: {
    typeFilter(type) {
      return calendarTypeKeyValue[type], goodsclassTypeKeyValue[type];
    },
  },
  data() {
    return {
      listLoading: false,
      columntypeOptions,
      columninputtypeOptions,
      reportListDialogFormVisible: false,
      flagData,
      total: 0,
      REPORT_PAPER_SIZE,
      lambdaOptions,
      reportDirectionList: [],
      REPORT_DIRECTION_A4,
      REPORT_DIRECTION_A5,
      textName: undefined,
      page: 1,
      limit: 10,
      tableKey: 0,
      searchName: undefined,
      isShow: false,
      tablename: {},
      tablename2: {},
      itemOptions: [],
      itemOptions2: [],
      reportTableData: [],
      reportListData: [],
      currentRowData: {},
      selectReportList: [],
      reportTableDialogFormVisible: false,
      listcolumnLoading: false,
      reportTableAllData: [],
      rules: {
        REPORT_TABLE_NAME: [
          { required: true, message: "请输入报表名称", trigger: "blur" },
        ],
        REPORT_PAPER_SIZE: [{ required: true, message: "请选择纸张", trigger: "blur" }],
        REPORT_DIRECTION: [
          { required: true, message: "请选择打印方向", trigger: "blur" },
        ],
        REPORT_TABLE_CODE: [{ required: true, message: "请输入序号", trigger: "blur" }],
        REPORT_ORDER: [{ required: true, message: "请输入序号", trigger: "blur" }],
        REPORT_FLAG: [{ required: true, message: "请选择是否启用", trigger: "blur" }],
      },
      rules2: {
        COLUMN_TITLE: [{ required: true, message: "请输入表头标题", trigger: "blur" }],
        COLUMN_KEY: [{ required: true, message: "请输入表头key", trigger: "blur" }],
        COLUMN_SHOW: [{ required: true, message: "是否显示", trigger: "blur" }],
        COLUMN_WIDTH: [{ required: true, message: "请输入宽度", trigger: "blur" }],
        COLUMN_ORDER: [{ required: true, message: "请输入顺序", trigger: "blur" }],
      },
      listQuery: {
        REPORT_TABLE_ID: undefined,
        REPORT_TABLE_NAME: undefined,
        REPORT_TABLE_CODE: undefined,
        REPORT_PAPER_SIZE: undefined,
        REPORT_DIRECTION: undefined,
        REPORT_ORDER: undefined,
        REPORT_FLAG: undefined,
      },
      listQuery2: {
        REPORT_TABLE_COLUMN_ID: undefined,
        REPORT_TABLE_ID: undefined,
        COLUMN_TITLE: undefined,
        COLUMN_KEY: undefined,
        COLUMN_SHOW: undefined,
        COLUMN_WIDTH: 0,
        COLUMN_ORDER: undefined,
      },
    };
  },
  created() {
    this.getSysTable();
    this.getSysTable2();
  },
  mounted() {
    this.GetReportTableData();
  },
  methods: {
    clearListQuery() {
      this.listQuery = {
        REPORT_TABLE_ID: undefined,
        REPORT_TABLE_NAME: undefined,
        REPORT_PAPER_SIZE: undefined,
        REPORT_TABLE_CODE: undefined,
        REPORT_DIRECTION: undefined,
        REPORT_ORDER: undefined,
        REPORT_FLAG: undefined,
      };
      this.reportTableDialogFormVisible = false;
      this.isShow = false;
    },
    clearListQuery2() {
      this.listQuery2 = {
        REPORT_TABLE_COLUMN_ID: undefined,
        REPORT_TABLE_ID: undefined,
        COLUMN_TITLE: undefined,
        COLUMN_KEY: undefined,
        COLUMN_SHOW: "1",
        COLUMN_WIDTH: 0,
        COLUMN_ORDER: undefined,
      };
      this.isShow = false;
      this.reportListDialogFormVisible = false;
    },
    directionChinese(row) {
      return row.REPORT_DIRECTION == "13"
        ? "横向"
        : row.REPORT_DIRECTION == "9"
        ? "横向"
        : row.REPORT_DIRECTION == "32"
        ? "纵向"
        : row.REPORT_DIRECTION == "22"
        ? "纵向"
        : "----";
    },
    sizeChinese(row) {
      return row.REPORT_PAPER_SIZE == "1600"
        ? "A3"
        : row.REPORT_PAPER_SIZE == "1100"
        ? "A4"
        : row.REPORT_PAPER_SIZE == "700"
        ? "A5"
        : "----";
    },
    flagChinese(row) {
      return row.REPORT_FLAG == "0" ? "否" : "是";
    },
    getSysTable() {
      this.$set(this.tablename, "TABLE_CODE", "REPORT_TABLE");
      let itemoption = [];
      var _this = this;
      `这一步很重要`;
      getSysTableColumnByTableCode(this.tablename).then((response) => {
        //循环遍历将对象转成数组
        for (let i in response.data) {
          itemoption.push(response.data[i]);
        }
        _this.itemOptions = itemoption;
      });
    },

    getSysTable2() {
      this.$set(this.tablename2, "TABLE_CODE", "REPORT_TABLE_COLUMN");
      let itemoption = [];
      var _this = this;
      `这一步很重要`;
      getSysTableColumnByTableCode(this.tablename2).then((response) => {
        //循环遍历将对象转成数组
        for (let i in response.data) {
          itemoption.push(response.data[i]);
        }
        _this.itemOptions2 = itemoption;
      });
    },

    searchReportTable() {
      this.listLoading = true;
      let searchData = [];
      if (this.searchName === "" || this.searchName === undefined) {
        this.GetReportTableData();
      } else {
        this.reportTableAllData.forEach((item, index, array) => {
          if (item.REPORT_TABLE_NAME == this.searchName) {
            searchData.push(item);
          }
        });
        this.total = searchData.length;
        const pageList = searchData.filter(
          (item, index) =>
            index < this.limit * this.page && index >= this.limit * (this.page - 1)
        );
        this.reportTableData = pageList;
        this.reportListData = new Array();
      }
      setTimeout(() => {
        this.listLoading = false;
      }, 500);
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    createReportTable() {
      this.$refs["dataForm2"].validate((valid) => {
        if (valid) {
          CreateReport(this.listQuery).then((response) => {
            if (response.data.E_COMM_RETURN.TYPE === "S") {
              this.$notify({
                title: "成功",
                type: "success",
                message: "添加成功",
                duration: 2000,
              });
              this.reportTableData.push(this.listQuery);
              this.clearListQuery();
            } else {
              this.$notify({
                title: "失败",
                type: "error",
                message: response.data.E_COMM_RETURN.MESSAGE,
                duration: 2000,
              });
            }
          });
        }
      });
    },
    deleteReprotList(row, index) {
      this.$confirm("确认执行操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        DeleteReportTableColumn(row).then((response) => {
          if (response.data.E_COMM_RETURN.TYPE === "S") {
            this.$notify({
              title: "成功",
              type: "success",
              message: "删除成功",
              duration: 2000,
            });
            const index = this.reportListData.findIndex((m) => {
              if (m.REPORT_TABLE_COLUMN_ID == row.REPORT_TABLE_COLUMN_ID) {
                return true;
              }
            });
            this.reportListData.splice(index, 1);
          } else {
            this.$notify({
              title: "失败",
              type: "error",
              message: "删除成功",
              duration: 2000,
            });
          }
        });
      });
    },
    getdirection() {
      if (this.listQuery.REPORT_PAPER_SIZE == "1100") {
        this.reportDirectionList = this.REPORT_DIRECTION_A4;
      }
      if (this.listQuery.REPORT_PAPER_SIZE == "700") {
        this.reportDirectionList = this.REPORT_DIRECTION_A5;
      }
      this.isShow = true;
    },
    deleteReportTable(row, index) {
      this.$confirm("确认执行操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        DeleteReportTable(row).then((response) => {
          if (response.data.E_COMM_RETURN.TYPE === "S") {
            this.$notify({
              title: "成功",
              type: "success",
              message: "删除成功",
              duration: 2000,
            });
            const index = this.reportTableData.findIndex((m) => {
              if (m.REPORT_TABLE_ID == row.REPORT_TABLE_ID) {
                return true;
              }
            });
            this.reportTableData.splice(index, 1);
          } else {
            this.$notify({
              title: "失败",
              type: "error",
              message: "删除成功",
              duration: 2000,
            });
          }
        });
      });
    },
    GetReportTableData() {
      GetReportTable().then((response) => {
        this.reportTableAllData = response.data;
        this.reportTableData = response.data;
        const pageList = this.reportTableAllData.slice(
          (this.page - 1) * this.limit,
          this.page * this.limit
        );
        this.total = response.data.length;
        this.reportTableData = pageList;
      });
    },
    handleClear() {
      this.searchName = undefined;
    },
    createReportList() {
      this.$refs["dataForm3"].validate((valid) => {
        if (valid) {
          this.listQuery2.REPORT_TABLE_ID = this.selectReportList.REPORT_TABLE_ID;
          this.listQuery2.COLUMN_SHOW = this.listQuery2.COLUMN_SHOW === true ? "1" : "0";
          CreateReportTableColumn(this.listQuery2).then((response) => {
            if (response.data.E_COMM_RETURN.TYPE === "S") {
              this.$notify({
                title: "成功",
                type: "success",
                message: "添加成功",
                duration: 2000,
              });
              this.reportListData.push(this.listQuery2);
              this.clearListQuery2();
            } else {
              this.$notify({
                title: "失败",
                type: "error",
                message: response.data.E_COMM_RETURN.MESSAGE,
                duration: 2000,
              });
            }
          });
        }
      });
    },
    updateReportTable() {
      this.$refs["dataForm2"].validate((valid) => {
        if (valid) {
          UpdateReportTable(this.listQuery).then((response) => {
            if (response.data.E_COMM_RETURN.TYPE === "S") {
              this.$notify({
                title: "成功",
                type: "success",
                message: "修改成功",
                duration: 2000,
              });
              const index = this.reportTableData.findIndex((m) => {
                if (m.REPORT_TABLE_ID == this.currentRowData.REPORT_TABLE_ID) {
                  return true;
                }
              });
              this.$set(
                this.reportTableData[index],
                "REPORT_TABLE_NAME",
                this.listQuery.REPORT_TABLE_NAME
              );
              this.$set(
                this.reportTableData[index],
                "REPORT_TABLE_CODE",
                this.listQuery.REPORT_TABLE_CODE
              );
              this.$set(
                this.reportTableData[index],
                "REPORT_PAPER_SIZE",
                this.listQuery.REPORT_PAPER_SIZE
              );
              this.$set(
                this.reportTableData[index],
                "REPORT_DIRECTION",
                this.listQuery.REPORT_DIRECTION
              );
              this.$set(
                this.reportTableData[index],
                "REPORT_ORDER",
                this.listQuery.REPORT_ORDER
              );
              this.$set(
                this.reportTableData[index],
                "REPORT_FLAG",
                this.listQuery.REPORT_FLAG
              );
              this.clearListQuery();
            } else {
              this.$notify({
                title: "失败",
                type: "error",
                message: response.data.E_COMM_RETURN.MESSAGE,
                duration: 2000,
              });
            }
          });
        }
      });
    },
    updateReportList() {
      this.$refs["dataForm3"].validate((valid) => {
        if (valid) {
          this.listQuery2.COLUMN_SHOW = this.listQuery2.COLUMN_SHOW === true ? "1" : "0";
          this.listQuery2.REPORT_TABLE_COLUMN_ID = this.currentRowData.REPORT_TABLE_COLUMN_ID;
          this.listQuery2.REPORT_TABLE_ID = this.currentRowData.REPORT_TABLE_ID;
          UpdateReportTableColumn(this.listQuery2).then((response) => {
            if (response.data.E_COMM_RETURN.TYPE === "S") {
              this.$notify({
                title: "成功",
                type: "success",
                message: "修改成功",
                duration: 2000,
              });
              const index = this.reportListData.findIndex((m) => {
                if (
                  m.REPORT_TABLE_COLUMN_ID == this.currentRowData.REPORT_TABLE_COLUMN_ID
                ) {
                  return true;
                }
              });
              this.$set(
                this.reportListData[index],
                "COLUMN_TITLE",
                this.listQuery2.COLUMN_TITLE
              );
              this.$set(
                this.reportListData[index],
                "COLUMN_KEY",
                this.listQuery2.COLUMN_KEY
              );
              this.$set(
                this.reportListData[index],
                "COLUMN_WIDTH",
                this.listQuery2.COLUMN_WIDTH
              );
              this.$set(
                this.reportListData[index],
                "COLUMN_SHOW",
                this.listQuery2.COLUMN_SHOW
              );
              this.$set(
                this.reportListData[index],
                "COLUMN_ORDER",
                this.listQuery2.COLUMN_ORDER
              );
              this.clearListQuery2();
            } else {
              this.$notify({
                title: "失败",
                type: "error",
                message: response.data.E_COMM_RETURN.MESSAGE,
                duration: 2000,
              });
            }
          });
        }
      });
    },
    handleDeleteReportList(row, index) {
      this.currentRowData = Object.assign({}, row);
      this.listQuery2 = Object.assign({}, row);
      this.listQuery2.COLUMN_SHOW = this.listQuery2.COLUMN_SHOW == "1" ? true : false;
      this.textName = "编辑";
      this.reportListDialogFormVisible = true;
    },
    handleCreateReprotList(row, index) {
      this.textName = "添加";
      this.reportListDialogFormVisible = true;
    },
    handleEditReportTable(row, index) {
      this.currentRowData = Object.assign({}, row);
      this.listQuery = Object.assign({}, row);
      this.listQuery.REPORT_PAPER_SIZE = undefined;
      this.textName = "编辑";
      this.reportTableDialogFormVisible = true;
    },
    handleCreateTable() {
      this.textName = "添加";
      this.reportTableDialogFormVisible = true;
    },
    selectrow(row) {
      this.selectReportList = Object.assign({}, row);
      this.listcolumnLoading = true;
      let reportcolumnlist = [];
      let query = {
        tableId: row.REPORT_TABLE_ID,
      };
      GetReportTableColumn(query).then((response) => {
        //循环遍历将对象转成数组
        for (let i in response.data) {
          reportcolumnlist.push(response.data[i]);
        }
        //加载数据
        this.reportListData = reportcolumnlist;

        setTimeout(() => {
          this.listcolumnLoading = false;
        }, 0 * 1000);
      });
    },
  },
};
</script>

<style>
.el-dialog.customStyle {
  width: 80%;
}
.el-dialog__body {
  border-top: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
.el-form-item {
  margin-bottom: 12px;
}
</style>
