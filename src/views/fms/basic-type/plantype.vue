<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.PLAN_TYPE_CODE" placeholder="计划编码" style="width: 200px;" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.PLAN_TYPE_NAME" placeholder="计划名称" style="width: 200px;" class="filter-item"
        @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.PLAN_TYPE_INOUT" placeholder="计划类型" clearable style="width: 150px"
        class="filter-item">
        <el-option v-for="item in plantypeInoutOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select> -->

      <div v-for="(item, i) in itemOptions" :key="i" style="float: left">
        <!-- 单行文本 -->
        <el-input
          v-if="item.COLUMN_ISQUERY == '1' && item.COLUMN_TYPE == 'input'"
          v-model="listQuery[item.COLUMN_KEY]"
          :placeholder="item.COLUMN_TITLE"
          :style="'width:' + item.COLUMN_WIDTH + 'px'"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        ></el-input>
        <!-- 下拉菜单 -->
        <el-select
          v-if="
            item.COLUMN_ISQUERY == '1' &&
            item.COLUMN_TYPE == 'select' &&
            item.COLUMN_KEY == 'PLAN_TYPE_INOUT'
          "
          v-model="listQuery[item.COLUMN_KEY]"
          clearable
          :placeholder="item.COLUMN_TITLE"
          :style="'width:' + item.COLUMN_WIDTH + 'px'"
          class="filter-item"
        >
          <span v-for="item1 in plantypOptions">
            <el-option
              :key="item1.key"
              :label="item1.display_name"
              :value="item1.key"
            ></el-option>
          </span>
        </el-select>
      </div>

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
        type="warning"
        icon="el-icon-remove"
        @click="handleClear"
      >
        {{ $t("table.reset") }}
      </el-button>
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
        @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
      <el-button  :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
        @click="handleDownload">
        {{ $t('table.export') }}
      </el-button> -->
      <KtButton
        
        class="filter-item"
        @click="handleCreate"
        label="添加"
        icon="el-icon-edit"
        perms="plan_type_add"
        type="primary"
        >{{ $t("table.add") }}</KtButton
      >
      <KtButton
        
        class="filter-item"
        @click="handleDownload"
        label="导出"
        icon="el-icon-download"
        perms="plan_type_download"
        type="primary"
        >{{ $t("table.export") }}</KtButton
      >
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="plantypeData"
      border
      fit
      highlight-current-row
      @sort-change="sort_change"
      style="width: 100%"
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
        v-if="item.COLUMN_SHOW"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <i
            :class="scope.row[item.COLUMN_KEY]"
            v-if="item.COLUMN_TYPE === 'icon'"
            style="font-size: 20px"
          ></i>
          <span
            v-else-if="item.COLUMN_KEY == 'PLAN_TYPE_INOUT'"
            v-html="plantypeinoutflag(scope.row, scope.row[item.COLUMN_KEY])"
          ></span>
          <span
            v-else-if="item.COLUMN_KEY == 'PLAN_TYPE_FLAG'"
            v-html="plantypeflag(scope.row, scope.row[item.COLUMN_KEY])"
          ></span>
          <span v-else>{{ scope.row[item.COLUMN_KEY] }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <!-- <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            {{ $t('table.delete') }}
          </el-button> -->
          <KtButton
            size="mini"
            @click="handleUpdate(row)"
            label="编辑"
            perms="plan_type_edit"
            type="primary"
            >{{ $t("table.edit") }}</KtButton
          >
          <KtButton
            size="mini"
            @click="handleDelete(row, $index)"
            label="删除"
            perms="plan_type_delete"
            type="danger"
            >{{ $t("table.delete") }}</KtButton
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getPlanTypeList"
    />

    <el-dialog
      v-el-drag-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
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
        <div v-for="(item, i) in itemOptions" :key="i">
          <!-- 单行文本 -->
          <el-form-item
            :prop="item.COLUMN_KEY"
            :label="item.COLUMN_TITLE + ': '"
            v-if="item.COLUMN_TYPE == 'input' && item.COLUMN_SHOW == '1'"
            :rules="
              item.COLUMN_RULES == '0'
                ? { required: false, message: item.COLUMN_RULES_MSG, trigger: 'change' }
                : { required: true, message: item.COLUMN_RULES_MSG, trigger: 'change' }
            "
          >
            <el-input
              :type="item.COLUMN_INPUT_TYPE"
              v-model="temp[item.COLUMN_KEY]"
              :placeholder="temp.COLUMN_TITLE"
              :disabled="item.COLUMN_DISABLED == '1'"
            ></el-input>
          </el-form-item>
          <!-- 图标 -->
          <el-form-item
            :label="item.COLUMN_TITLE + ': '"
            v-if="item.COLUMN_TYPE == 'icon' && item.COLUMN_SHOW == '1'"
          >
            <icon-picker v-model="temp[item.COLUMN_KEY]"></icon-picker>
          </el-form-item>
          <!-- 下拉菜单 -->
          <el-form-item
            :prop="item.COLUMN_KEY"
            :label="item.COLUMN_TITLE + ': '"
            v-if="item.COLUMN_TYPE == 'select' && item.COLUMN_SHOW == '1'"
            :rules="
              item.COLUMN_RULES == '0'
                ? { required: false, message: item.COLUMN_RULES_MSG, trigger: 'change' }
                : { required: true, message: item.COLUMN_RULES_MSG, trigger: 'change' }
            "
          >
            <el-select
              v-if="item.COLUMN_KEY == 'PLAN_TYPE_INOUT'"
              v-model="temp[item.COLUMN_KEY]"
              :placeholder="item.COLUMN_TITLE"
              clearable
              :disabled="item.COLUMN_DISABLED == '1'"
            >
              <span v-for="item1 in plantypOptions">
                <el-option
                  :key="item1.key"
                  :label="item1.display_name"
                  :value="item1.key"
                ></el-option>
              </span>
            </el-select>
            <el-select
              v-if="item.COLUMN_KEY == 'PLAN_TYPE_FLAG'"
              v-model="temp[item.COLUMN_KEY]"
              :placeholder="item.COLUMN_TITLE"
              clearable
              :disabled="item.COLUMN_DISABLED == '1'"
            >
              <span v-for="item1 in calendarTypeOptions">
                <el-option
                  :key="item1.key"
                  :label="item1.display_name"
                  :value="item1.key"
                ></el-option>
              </span>
            </el-select>
          </el-form-item>
          <!-- 开关 -->
          <el-form-item
            :label="item.COLUMN_TITLE + ': '"
            v-if="item.COLUMN_TYPE == 'switch' && item.COLUMN_SHOW == '1'"
          >
            <el-switch
              v-model="temp[item.COLUMN_KEY]"
              :on-value="true"
              :off-value="false"
            ></el-switch>
          </el-form-item>
        </div>

        <!-- <el-form-item label="计划类型ID" prop="PLAN_TYPE_ID">
          <el-input v-model="temp.PLAN_TYPE_ID" disabled />
        </el-form-item>
        <el-form-item label="计划编码" prop="PLAN_TYPE_CODE">
          <el-input v-model="temp.PLAN_TYPE_CODE" />
        </el-form-item>
        <el-form-item label="计划名称" prop="PLAN_TYPE_NAME">
          <el-input v-model="temp.PLAN_TYPE_NAME" />
        </el-form-item>
        <el-form-item label="计划类型" prop="PLAN_TYPE_INOUT">
          <el-select v-model="temp.PLAN_TYPE_INOUT" class="filter-item" placeholder="请选择">
            <el-option v-for="item in plantypeInoutOptions" :key="item.key" :label="item.display_name"
              :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="计划分组" prop="PLAN_TYPE_GROUP">
          <el-input v-model="temp.PLAN_TYPE_GROUP" />
        </el-form-item>
        <el-form-item label="排序" prop="PLAN_TYPE_ORDER">
          <el-input v-model.number="temp.PLAN_TYPE_ORDER" />
        </el-form-item>
        <el-form-item label="是否启用" prop="PLAN_TYPE_FLAG">
          <el-select v-model="temp.PLAN_TYPE_FLAG" class="filter-item" placeholder="请选择">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name"
              :value="item.key" />
          </el-select>
        </el-form-item> -->
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
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import elDragDialog from "@/directive/el-drag-dialog"; // base on element-ui
import {
  getPlanTypeList,
  createPlanType,
  updatePlanType,
  deletePlanType,
} from "@/api/plan_type";
import { getSysTableColumnByTableCode } from "@/api/sys_table";
import { GetItemList } from "@/api/sysitem";

const plantypeInoutOptions = [
  { key: "1", display_name: "入库" },
  { key: "2", display_name: "出库" },
];

const managetypeCompleteOptions = [
  { key: "0", display_name: "否" },
  { key: "1", display_name: "是" },
];

const calendarTypeOptions = [
  { key: "0", display_name: "否" },
  { key: "1", display_name: "是" },
];

export default {
  name: "Plantype",
  components: { Pagination },
  inject: ["reload"],
  directives: { waves, elDragDialog },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
  },
  data() {
    return {
      managetypeData: [],
      tableKey: 0,
      total: 0,
      tablename: {},
      itemOptions: [],
      proptype: "",
      listQuery: {
        page: 1,
        limit: 10,
        PLAN_TYPE_CODE: undefined,
        PLAN_TYPE_NAME: undefined,
        PLAN_TYPE_INOUT: undefined,
      },
      calendarTypeOptions,
      plantypOptions: [],
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      dialogPvVisible: false,
      pvData: [],
      temp: {
        PLAN_TYPE_ID: undefined,
        PLAN_TYPE_CODE: undefined,
        PLAN_TYPE_NAME: undefined,
        PLAN_TYPE_INOUT: undefined,
        PLAN_TYPE_ORDER: undefined,
        PLAN_TYPE_FLAG: undefined,
      },
      plantypeData: [],
      rules: {
        PLAN_TYPE_CODE: [
          { required: true, message: "请输入任务编码", trigger: "change" },
        ],
        PLAN_TYPE_NAME: [
          { required: true, message: "请输入任务名称", trigger: "change" },
        ],
        PLAN_TYPE_INOUT: [
          { required: true, message: "请选择任务类型", trigger: "change" },
        ],
      },
      E_COMM_RETURN: {
        TYPE: undefined,
        MESSAGE: undefined,
      },
      downloadLoading: false,
      plantypeInoutOptions: [],
    };
  },
  created() {
    this.getSysTable();
    this.GetPlanTypeOptions();
    this.GetPlanTypeInOutOptions();
    this.GetFlagOptions();
  },
  mounted() {
    this.getPlanTypeList();
  },
  methods: {
    GetPlanTypeOptions() {
      let query = {
        item_code: "PLAN_TYPE",
      };
      GetItemList(query).then((response) => {
        response.data.forEach((item, index, array) => {
          let itemdata = {
            key: item.ITEM_LIST_CODE,
            display_name: item.ITEM_LIST_NAME,
          };
          this.plantypOptions[index] = itemdata;
        });
      });
    },
    GetPlanTypeInOutOptions() {
      let query = {
        item_code: "PLAN_TYPE_INOUT",
      };
      GetItemList(query).then((response) => {
        response.data.forEach((item, index, array) => {
          let itemdata = {
            key: item.ITEM_LIST_CODE,
            display_name: item.ITEM_LIST_NAME,
          };
          this.plantypeInoutOptions[index] = itemdata;
        });
      });
    },
    plantypeinoutflag: function (row, column) {
      let code = undefined;
      this.plantypeInoutOptions.map((item, index) => {
        if (row.PLAN_TYPE_INOUT == item.key) {
          return (code = item.display_name);
        }
      });
      return code;
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
    plantypeflag: function (row, column) {
      let code = undefined;
      this.calendarTypeOptions.map((item, index) => {
        if (row.PLAN_TYPE_FLAG == item.key) {
          return (code = item.display_name);
        }
      });
      return code;
    },
    getSysTable() {
      this.$set(this.tablename, "TABLE_CODE", "PLAN_TYPE");
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
    getPlanTypeList() {
      this.listLoading = true;
      let plantypelist = [];
      getPlanTypeList(this.listQuery).then((response) => {
        //循环遍历将对象转成数组
        for (let i in response.data) {
          plantypelist.push(response.data[i]);
        }

        const {
          PLAN_TYPE_CODE,
          PLAN_TYPE_NAME,
          PLAN_TYPE_INOUT,
          page = 1,
          limit = 10,
        } = this.listQuery;

        let mockList = plantypelist.filter((item) => {
          if (PLAN_TYPE_INOUT && item.PLAN_TYPE_INOUT !== PLAN_TYPE_INOUT) return false;
          if (PLAN_TYPE_CODE && item.PLAN_TYPE_CODE.indexOf(PLAN_TYPE_CODE) < 0)
            return false;
          if (PLAN_TYPE_NAME && item.PLAN_TYPE_NAME.indexOf(PLAN_TYPE_NAME) < 0)
            return false;
          return true;
        });

        //总行数
        this.total = mockList.length;

        //分页处理
        const pageList = mockList.filter(
          (item, index) => index < limit * page && index >= limit * (page - 1)
        );

        //加载数据
        this.plantypeData = pageList;

        setTimeout(() => {
          this.listLoading = false;
        }, 0 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getPlanTypeList();
    },
    resetTemp() {
      this.temp = {
        MANAGE_TYPE_ID: undefined,
        MANAGE_TYPE_CODE: undefined,
        MANAGE_TYPE_NAME: undefined,
        MANAGE_TYPE_INOUT: undefined,
        MANAGE_TYPE_COMPLETE: undefined,
        MANAGE_TYPE_ORDER: undefined,
        MANAGE_TYPE_FLAG: undefined,
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
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          createPlanType(this.temp).then((response) => {
            if (response.data.E_COMM_RETURN.TYPE === "S") {
              this.plantypeData.unshift(this.temp);
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: response.data.E_COMM_RETURN.MESSAGE,
                type: "success",
                duration: 2000,
              });
              this.reload();
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
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          updatePlanType(tempData).then((response) => {
            if (response.data.E_COMM_RETURN.TYPE === "S") {
              const index = this.plantypeData.findIndex(
                (v) => v.PLAN_TYPE_ID === this.temp.PLAN_TYPE_ID
              );
              this.plantypeData.splice(index, 1, this.temp);
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: response.data.E_COMM_RETURN.MESSAGE,
                type: "success",
                duration: 2000,
              });
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
        deletePlanType(this.temp).then(() => {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000,
          });
          this.plantypeData.splice(index, 1);
        });
      });
    },
    handleFetchPv(pv) {
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDrag() {
      this.$refs.select.blur();
    },
    handleClear() {
      this.listQuery = {
        page: 1,
        limit: 10,
        MANAGE_TYPE_CODE: undefined,
        MANAGE_TYPE_NAME: undefined,
        MANAGE_TYPE_INOUT: undefined,
      };
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "任务ID",
          "任务编码",
          "任务名称",
          "任务类型",
          "是否完成",
          "排序",
          "启用",
        ];
        const filterVal = [
          "MANAGE_TYPE_ID",
          "MANAGE_TYPE_CODE",
          "MANAGE_TYPE_NAME",
          "MANAGE_TYPE_INOUT",
          "MANAGE_TYPE_COMPLETE",
          "MANAGE_TYPE_ORDER",
          "MANAGE_TYPE_FLAG",
        ];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "manage_type_list",
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.goodsData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    // 排序方法
    sort_change(column) {
      this.page = 1; // 排序后返回第一页
      if (column.prop === "GOODS_ID") {
        // 表格每一列对应的字段，必须一一对应
        this.proptype = column.prop; // 将键名prop赋值给变量proptype
        if (column.order === "descending") {
          this.goodsData.sort(this.my_desc_sort);
        } else if (column.order === "ascending") {
          this.goodsData.sort(this.my_asc_sort);
        }
      } else if (column.prop === "GOODS_NAME") {
        // 第二列排序  表格每一列对应的字段，必须一一对应
        this.proptype = column.prop;
        if (column.order === "descending") {
          this.goodsData.sort(this.my_desc_sort);
        } else if (column.order === "ascending") {
          this.goodsData.sort(this.my_asc_sort);
        }
      }
    },
    //正序倒序方法
    my_desc_sort(a, b) {
      return b[this.proptype] - a[this.proptype];
    },
    my_asc_sort(a, b) {
      return a[this.proptype] - b[this.proptype];
    },
  },
};
</script>

<style>
.el-dialog.customStyle {
  width: 80%;
  height: 100%;
}
.el-dialog__body {
  border-top: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
</style>
