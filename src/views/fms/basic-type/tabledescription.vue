<template>
  <div class="app-container">
    <el-row :gutter="50">
      <el-col :span="9">
        <div class="filter-container">
          <el-input
            v-model="listQuery.TABLE_CODE"
            placeholder="表格编码"
            style="width: 120px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-select
            v-model="listQuery.TABLE_FLAG"
            placeholder="启用"
            clearable
            style="width: 80px"
            class="filter-item"
          >
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
          <el-button
            
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >
            {{ $t("table.search") }}
          </el-button>
          <el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            icon="el-icon-edit"
            @click="handleCreate"
          >
            {{ $t("table.add") }}
          </el-button>
        </div>
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="systableData"
          border
          fit
          highlight-current-row
          style="width: 100%"
          @row-click="selectrow"
        >
          <el-table-column label="序号" width="50px" align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="show"
            label="表格ID"
            width="70"
            prop="TABLE_ID"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{ row.TABLE_ID }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="表格编码"
            width="200"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <span>{{ row.TABLE_CODE }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="表格名称"
            width="120"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <span>{{ row.TABLE_NAME }}</span>
            </template>
          </el-table-column>
          <el-table-column label="排序" width="60" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.TABLE_ORDER }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="启用"
            prop="TABLE_FLAG"
            width="60px"
            align="center"
            :formatter="flag"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="220"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{ row, $index }">
              <el-button type="primary" size="mini" @click="handlecolumnCreate(row)">
                {{ $t("table.add") }}
              </el-button>
              <el-button type="primary" size="mini" @click="handleUpdate(row)">
                {{ $t("table.edit") }}
              </el-button>
              <el-button
                v-if="row.status != 'deleted'"
                size="mini"
                type="danger"
                @click="handleDelete(row, $index)"
              >
                {{ $t("table.delete") }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getSysTableList"
        />
      </el-col>

      <el-col :span="15">
        <div class="filter-container">
          <el-button
            
            :loading="downloadLoading"
            class="filter-item"
            type="info"
            icon="el-icon-download"
            @click="handleDownload"
          >
            {{ $t("table.export") }}
          </el-button>
        </div>
        <el-table
          :key="1"
          v-loading="listcolumnLoading"
          :data="systablecolumnData"
          border
          fit
          highlight-current-row
          style="width: 100%; max-height: 540px; overflow: auto"
        >
          <el-table-column label="序号" width="50" align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="show"
            label="表行ID"
            width="70"
            prop="TABLE_COLUMN_ID"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{ row.TABLE_COLUMN_ID }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="show"
            label="父级ID"
            width="70"
            prop="TABLE_ID"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{ row.TABLE_ID }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="表头标题"
            width="120"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <span>{{ row.COLUMN_TITLE }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="表头KEY"
            width="190"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <span>{{ row.COLUMN_KEY }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="组件类型"
            width="80"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <span>{{ row.COLUMN_TYPE }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="组件宽度"
            width="80"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <span>{{ row.COLUMN_WIDTH }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="是否查询"
            width="100"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <el-switch
                v-model="row.COLUMN_ISQUERY"
                active-value="1"
                inactive-value="0"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="INPUT值类型"
            width="120"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <span>{{ row.COLUMN_INPUT_TYPE }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Lambda条件"
            width="120"
            align="center"
            show-overflow-tooltip
            :formatter="lambdaforChinese"
          >
            <!-- <template slot-scope="{ row }" v-html="lambdaforChinese(row)">
              <span>{{ row.COLUMN_LAMBDA }}</span>
            </template> -->
          </el-table-column>
          <el-table-column label="格式化" width="70" align="center" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <span>{{ row.COLUMN_FORMATTER }}</span>
            </template>
          </el-table-column>
          <el-table-column label="校验" width="100" align="center" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <el-switch
                v-model="row.COLUMN_RULES"
                active-value="1"
                inactive-value="0"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="校验信息"
            width="100"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <span>{{ row.COLUMN_RULES_MSG }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="不可编辑"
            width="100"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <el-switch
                v-model="row.COLUMN_DISABLED"
                active-value="1"
                inactive-value="0"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="显示"
            prop="COLUMN_SHOW"
            width="50"
            align="center"
            show-overflow-tooltip
            :formatter="tablecolumnflag"
          >
          </el-table-column>
          <el-table-column label="排序" width="50" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.COLUMN_ORDER }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{ row, $index }">
              <el-button type="primary" size="mini" @click="handlecolumnUpdate(row)">
                {{ $t("table.edit") }}
              </el-button>
              <el-button
                v-if="row.status != 'deleted'"
                size="mini"
                type="danger"
                @click="handlecolumnDelete(row, $index)"
              >
                {{ $t("table.delete") }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog
      v-el-drag-dialog
      :visible.sync="dialogFormVisible"
      title="创建表"
      customClass="customStyle"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="表格ID" prop="TABLE_ID">
          <el-input v-model="temp.TABLE_ID" disabled />
        </el-form-item>
        <el-form-item label="表格编码" prop="TABLE_CODE">
          <el-input v-model="temp.TABLE_CODE" />
        </el-form-item>
        <el-form-item label="表格名称" prop="TABLE_NAME">
          <el-input v-model="temp.TABLE_NAME" />
        </el-form-item>
        <el-form-item label="排序" prop="TABLE_ORDER">
          <el-input v-model.number="temp.TABLE_ORDER" v-limitNum />
        </el-form-item>
        <el-form-item label="是否启用" prop="TABLE_FLAG">
          <el-select v-model="temp.TABLE_FLAG" class="filter-item" placeholder="请选择">
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button @click="dialogFormVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      :visible.sync="dialogColumnVisible"
      title="行数据"
      customClass="customStyle"
      :close-on-click-modal="false"
    >
      <el-form
        ref="datacolumnForm"
        :rules="columnrules"
        :model="tempcolumn"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="表行ID" prop="TABLE_COLUMN_ID">
          <el-input v-model="tempcolumn.TABLE_COLUMN_ID" disabled />
        </el-form-item>
        <el-form-item label="表格ID" prop="TABLE_ID">
          <el-input v-model="tempcolumn.TABLE_ID" disabled />
        </el-form-item>
        <el-form-item label="表格名称" prop="TABLE_NAME">
          <el-input v-model="tempcolumn.TABLE_NAME" disabled />
        </el-form-item>
        <el-form-item label="表头标题" prop="COLUMN_TITLE">
          <el-input v-model="tempcolumn.COLUMN_TITLE" />
        </el-form-item>
        <el-form-item label="表头KEY" prop="COLUMN_KEY">
          <el-input v-model="tempcolumn.COLUMN_KEY" />
        </el-form-item>
        <el-form-item label="组件类型" prop="COLUMN_TYPE">
          <el-select
            v-model="tempcolumn.COLUMN_TYPE"
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in columntypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="组件宽度" prop="COLUMN_WIDTH">
          <el-input v-model.number="tempcolumn.COLUMN_WIDTH" />
        </el-form-item>
        <el-form-item label="是否查询" prop="COLUMN_ISQUERY">
          <el-switch
            v-model="tempcolumn.COLUMN_ISQUERY"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="LAMBDA" prop="COLUMN_LAMBDA">
          <el-select
            v-model="tempcolumn.COLUMN_LAMBDA"
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in lambdaOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="INPUT值类型" prop="COLUMN_INPUT_TYPE">
          <el-select
            v-model="tempcolumn.COLUMN_INPUT_TYPE"
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in columninputtypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="格式化方法" prop="COLUMN_FORMATTER">
          <el-input v-model="tempcolumn.COLUMN_FORMATTER" />
        </el-form-item>
        <el-form-item label="检验" prop="COLUMN_RULES">
          <el-switch
            v-model="tempcolumn.COLUMN_RULES"
            :on-value="true"
            :off-value="false"
          ></el-switch>
        </el-form-item>
        <el-form-item label="检验信息" prop="COLUMN_RULES_MSG">
          <el-input v-model="tempcolumn.COLUMN_RULES_MSG" />
        </el-form-item>
        <el-form-item label="不可编辑" prop="COLUMN_DISABLED">
          <el-switch
            v-model="tempcolumn.COLUMN_DISABLED"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="显示" prop="COLUMN_SHOW">
          <el-switch
            v-model="tempcolumn.COLUMN_SHOW"
            :on-value="true"
            :off-value="false"
          ></el-switch>
        </el-form-item>
        <el-form-item label="排序" prop="COLUMN_ORDER">
          <el-input v-model.number="tempcolumn.COLUMN_ORDER" v-limitNum />
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button @click="dialogColumnVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createcolumnData() : updatecolumnData()"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import elDragDialog from "@/directive/el-drag-dialog"; // base on element-ui
import { GetItemList } from "@/api/sysitem";
import {
  getSysTable,
  getSysTableColumn,
  createSysTable,
  updateSysTable,
  deleteSysTable,
  createSysTableColumn,
  updateSysTableColumn,
  deleteSysTableColumn,
} from "@/api/sys_table";

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

export default {
  name: "Tabledescription",
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
      systableData: [],
      systablecolumnData: [],
      tableKey: 0,
      total: 0,
      pagesNum: 1,
      show: false,
      query: {},
      listQuery: {
        page: 1,
        limit: 10,
        TABLE_FLAG: undefined,
        TABLE_CODE: undefined,
      },
      calendarTypeOptions:[],
      columntypeOptions:[],
      lambdaOptions: [],
      columninputtypeOptions,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新建",
      },
      dialogPvVisible: false,
      pvData: [],
      temp: {
        TABLE_ID: undefined,
        TABLE_CODE: undefined,
        TABLE_NAME: undefined,
        TABLE_ORDER: undefined,
        TABLE_FLAG: undefined,
      },
      tempcolumn: {
        TABLE_COLUMN_ID: undefined,
        TABLE_ID: undefined,
        COLUMN_TITLE: undefined,
        COLUMN_TYPE: undefined,
        COLUMN_KEY: undefined,
        COLUMN_SHOW: "1",
        COLUMN_DISABLED: "0",
        COLUMN_WIDTH: 100,
        COLUMN_LAMBDA: undefined,
        COLUMN_ORDER: undefined,
      },
      rules: {
        TABLE_CODE: [{ required: true, message: "请输入TABLE编码", trigger: "change" }],
        TABLE_NAME: [{ required: true, message: "请输入TABLE名", trigger: "change" }],
        TABLE_ORDER: [{ required: true, message: "请输入排序值", trigger: "change" }],
        TABLE_FLAG: [{ required: true, message: "请选择是否启用", trigger: "change" }],
      },
      columnrules: {
        COLUMN_TITLE: [{ required: true, message: "请输入标题名", trigger: "change" }],
        COLUMN_KEY: [{ required: true, message: "请输入标题值", trigger: "change" }],
        COLUMN_TYPE: [{ required: true, message: "请输入标签类型", trigger: "change" }],
        COLUMN_WIDTH: [{ required: true, message: "请输入标签宽度", trigger: "change" }],
        COLUMN_ORDER: [{ required: true, message: "请输入排序值", trigger: "change" }],
      },
      E_COMM_RETURN: {
        TYPE: undefined,
        MESSAGE: undefined,
      },
      listLoading: true,
      listcolumnLoading: false,
      dialogFormVisible: false,
      dialogColumnVisible: false,
      downloadLoading: false,
    };
  },
  created() {
    this.getLambdaSearchOptions();
    this.GetFlagOptions();
    this.getInputTypeOptions();
  },
  mounted() {
    this.getSysTableList();
  },
  methods: {
    getLambdaSearchOptions() {
      let query = {
        item_code: "LAMBDA_SEARCH",
      };
      GetItemList(query).then((response) => {
        response.data.forEach((item, index, array) => {
          let statesOption = {
            key: item.ITEM_LIST_CODE,
            display_name: item.ITEM_LIST_NAME,
          };
          this.lambdaOptions[index] = statesOption;
        });
      });
    },
    getInputTypeOptions() {
      let query = {
        item_code: "INPUT_TYPE",
      };
      GetItemList(query).then((response) => {
        response.data.forEach((item, index, array) => {
          let statesOption = {
            key: item.ITEM_LIST_CODE,
            display_name: item.ITEM_LIST_NAME,
          };
          this.columntypeOptions[index] = statesOption;
        });
      });
    },
    GetFlagOptions() {
      let query = {
        item_code: "FLAG",
      };
      GetItemList(query).then((response) => {
        response.data.forEach((item, index, array) => {
          let itemdata = {
            key: item.ITEM_LIST_CODE,
            display_name: item.ITEM_LIST_NAME,
          };
          this.calendarTypeOptions[index] = itemdata;
        });
      });
    },
    lambdaforChinese(row){
      let code = undefined;
      this.lambdaOptions.map((item, index) => {
        if (row.COLUMN_LAMBDA == item.key) {
          return (code = item.display_name);
        }
      });
      return code;
    },
    flag: function (row, column) {
      let code = undefined;
      this.calendarTypeOptions.map((item, index) => {
        if (row.TABLE_FLAG == item.key) {
          return (code = item.display_name);
        }
      });
      return code;
    },
    tablecolumnflag: function (row, column) {
      let code = undefined;
      this.calendarTypeOptions.map((item, index) => {
        if (row.COLUMN_SHOW == item.key) {
          return (code = item.display_name);
        }
      });
      return code;
    },
    tablecolumnruleflag: function (row, column) {
      let code = undefined;
      this.calendarTypeOptions.map((item, index) => {
        if (row.COLUMN_RULES == item.key) {
          return (code = item.display_name);
        }
      });
      return code;
    },
    getSysTableList() {
      this.listLoading = true;
      let systablelist = [];
      getSysTable(this.listQuery).then((response) => {
        //循环遍历将对象转成数组
        for (let i in response.data) {
          systablelist.push(response.data[i]);
        }

        const { TABLE_CODE, TABLE_FLAG, page = 1, limit = 10 } = this.listQuery;

        let mockList = systablelist.filter((item) => {
          if (TABLE_FLAG && item.TABLE_FLAG !== TABLE_FLAG) return false;
          if (TABLE_CODE && item.TABLE_CODE.indexOf(TABLE_CODE) < 0) return false;
          return true;
        });

        //总行数
        this.total = mockList.length;

        //分页处理
        const pageList = mockList.filter(
          (item, index) => index < limit * page && index >= limit * (page - 1)
        );

        //加载数据
        this.systableData = pageList;

        setTimeout(() => {
          this.listLoading = false;
        }, 0 * 1000);
      });
    },
    selectrow(row) {
      this.listcolumnLoading = true;
      let systablecolumnlist = [];
      this.$set(this.query, "TABLE_ID", row.TABLE_ID);
      getSysTableColumn(this.query).then((response) => {
        //循环遍历将对象转成数组
        for (let i in response.data) {
          systablecolumnlist.push(response.data[i]);
        }

        //总行数
        /* this.total = systablecolumnlist.length */

        //分页处理
        /* const pageList = systablecolumnlist.filter((item, index) => index < limit * page && index >= limit * (page - 1)) */

        //加载数据
        this.systablecolumnData = systablecolumnlist;

        setTimeout(() => {
          this.listcolumnLoading = false;
        }, 0 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getSysTableList();
    },
    resetTemp() {
      this.temp = {
        TABLE_ID: undefined,
        TABLE_CODE: undefined,
        TABLE_NAME: undefined,
        TABLE_ORDER: undefined,
        TABLE_FLAG: undefined,
      };
    },
    resetColumnTemp() {
      this.tempcolumn = {
        TABLE_COLUMN_ID: undefined,
        TABLE_ID: undefined,
        COLUMN_TITLE: undefined,
        COLUMN_TYPE: undefined,
        COLUMN_KEY: undefined,
        COLUMN_SHOW: "1",
        COLUMN_WIDTH: 100,
        COLUMN_ORDER: undefined,
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handlecolumnCreate(row) {
      this.resetColumnTemp();
      this.dialogStatus = "create";
      this.dialogColumnVisible = true;
      this.tempcolumn.TABLE_ID = row.TABLE_ID;
      this.tempcolumn.TABLE_NAME = row.TABLE_NAME;
      this.tempcolumn.COLUMN_TYPE = columntypeOptions[0].key;
      this.tempcolumn.COLUMN_SHOW = true;
      THIS.tempcolumn.COLUMN_RULES = true;
      this.$nextTick(() => {
        this.$refs["datacolumnForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          createSysTable(this.temp).then((response) => {
            if (response.data.E_COMM_RETURN.TYPE === "S") {
              this.systableData.push(this.temp);
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: response.data.E_COMM_RETUR.MESSAGE,
                type: "success",
                duration: 2000,
              });
              this.resetTemp();
            } else {
              this.$notify({
                title: "失败",
                message: response.data.E_COMM_RETURN.MESSAGE,
                type: "error",
                duration: 2000,
              });
            }
          });
        }
      });
    },
    createcolumnData() {
      this.$refs["datacolumnForm"].validate((valid) => {
        if (valid) {
          this.tempcolumn.COLUMN_SHOW = this.tempcolumn.COLUMN_SHOW === true ? "1" : "0";
          this.tempcolumn.COLUMN_RULES =
            this.tempcolumn.COLUMN_RULES === true ? "1" : "0";
          createSysTableColumn(this.tempcolumn).then((response) => {
            if (response.data.E_COMM_RETURN.TYPE === "S") {
              this.systablecolumnData.push(this.tempcolumn);
              this.dialogColumnVisible = false;
              this.$notify({
                title: "成功",
                message: response.data.E_COMM_RETUR.MESSAGE,
                type: "success",
                duration: 2000,
              });
              this.resetColumnTemp();
            } else {
              this.$notify({
                title: "失败",
                message: response.data.E_COMM_RETURN.MESSAGE,
                type: "error",
                duration: 2000,
              });
            }
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handlecolumnUpdate(row) {
      this.tempcolumn = Object.assign({}, row); // copy obj
      this.tempcolumn.TABLE_NAME = row.TABLE_NAME;
      this.tempcolumn.COLUMN_SHOW = this.tempcolumn.COLUMN_SHOW === "1" ? true : false;
      this.tempcolumn.COLUMN_RULES = this.tempcolumn.COLUMN_RULES === "1" ? true : false;
      this.dialogStatus = "update";
      this.dialogColumnVisible = true;
      this.$nextTick(() => {
        this.$refs["datacolumnForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          updateSysTable(tempData).then((response) => {
            if (response.data.E_COMM_RETURN.TYPE === "S") {
              const index = this.systableData.findIndex(
                (v) => v.TABLE_ID === this.temp.TABLE_ID
              );
              this.systableData.splice(index, 1, this.temp);
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: response.data.E_COMM_RETURN.MESSAGE,
                type: "success",
                duration: 2000,
              });
              this.resetTemp();
            } else {
              this.$notify({
                title: "失败",
                message: response.data.E_COMM_RETURN.MESSAGE,
                type: "error",
                duration: 2000,
              });
            }
          });
        }
      });
    },
    updatecolumnData() {
      this.$refs["datacolumnForm"].validate((valid) => {
        if (valid) {
          this.tempcolumn.COLUMN_SHOW = this.tempcolumn.COLUMN_SHOW === true ? "1" : "0";
          this.tempcolumn.COLUMN_RULES =
            this.tempcolumn.COLUMN_RULES === true ? "1" : "0";
          const tempData = Object.assign({}, this.tempcolumn);
          updateSysTableColumn(tempData).then((response) => {
            if (response.data.E_COMM_RETURN.TYPE === "S") {
              const index = this.systablecolumnData.findIndex(
                (v) => v.TABLE_COLUMN_ID === this.tempcolumn.TABLE_COLUMN_ID
              );
              this.systablecolumnData.splice(index, 1, this.tempcolumn);
              this.dialogColumnVisible = false;
              this.$notify({
                title: "成功",
                message: response.data.E_COMM_RETURN.MESSAGE,
                type: "success",
                duration: 2000,
              });
              this.resetColumnTemp();
            } else {
              this.$notify({
                title: "失败",
                message: response.data.E_COMM_RETURN.MESSAGE,
                type: "error",
                duration: 2000,
              });
            }
          });
        }
      });
    },
    handleDelete(row, index) {
      this.$confirm("确认执行操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.temp = Object.assign({}, row);
        deleteSysTable(this.temp).then(() => {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000,
          });
          this.systableData.splice(index, 1);
        });
      });
    },
    handlecolumnDelete(row, index) {
      this.$confirm("确认执行操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.tempcolumn = Object.assign({}, row);
        deleteSysTableColumn(this.tempcolumn).then(() => {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000,
          });
          this.systablecolumnData.splice(index, 1);
        });
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "表行ID",
          "父级ID",
          "表头标题",
          "表头KEY",
          "组件类型",
          "组件宽度",
          "显示",
          "排序",
        ];
        const filterVal = [
          "TABLE_COLUMN_ID",
          "TABLE_ID",
          "COLUMN_TITLE",
          "COLUMN_KEY",
          "COLUMN_TYPE",
          "COLUMN_WIDTH",
          "COLUMN_SHOW",
          "COLUMN_ORDER",
        ];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "动态表单",
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.systablecolumnData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
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
