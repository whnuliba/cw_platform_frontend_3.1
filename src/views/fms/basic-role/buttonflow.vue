<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.ROLE_ID"
        placeholder="角色"
        clearable
        style="width: 120px"
        class="filter-item"
      >
        <el-option
          v-for="item in roleOptions"
          :key="item.ROLE_ID"
          :label="item.ROLE_NAME"
          :value="item.ROLE_ID"
        />
      </el-select>
      <el-select
        v-model="listQuery.MENU_PARENT_ID"
        placeholder="上级菜单"
        clearable
        style="width: 120px"
        class="filter-item"
      >
        <el-option
          v-for="item in menulevelOptions"
          :key="item.MENU_ID"
          :label="item.TITLE"
          :value="item.MENU_ID"
        />
      </el-select>
      <el-input
        v-model="listQuery.TITLE"
        placeholder="菜单名称"
        style="width: 150px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.STATUS"
        placeholder="状态"
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
        type="warning"
        icon="el-icon-remove"
        @click="handleClear"
      >
        {{ $t("table.reset") }}
      </el-button>
      <el-button
        
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        {{ $t("table.export") }}
      </el-button>
    </div>

    <el-table
      :data="MenusList"
      style="width: 100%; height: 400px; margin-top: 0px; overflow: auto"
      border
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
          <el-tag
            :type="scope.row[item.COLUMN_KEY]"
            v-else-if="item.COLUMN_TYPE === 'tag'"
          >
            {{ scope.row[item.COLUMN_KEY] | statusNameFilter }}
          </el-tag>
          <span
            v-else-if="item.COLUMN_KEY == 'ROLE_ID'"
            v-html="roleidflag(scope.row, scope.row[item.COLUMN_KEY])"
          ></span>
          <span v-else>{{ scope.row[item.COLUMN_KEY] }}</span>
          <span
            v-else-if="item.COLUMN_KEY == 'MENU_PARENT_ID'"
            v-html="menuparentflag(scope.row, scope.row[item.COLUMN_KEY])"
          ></span>
          <span v-else>{{ scope.row[item.COLUMN_KEY] }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-divider direction="horizontal" content-position="center" />

    <div v-if="isReloadData" style="float: left">
      <el-checkbox-group v-model="checkList">
        <el-checkbox
          v-for="item in menubuttonOptions"
          :label="item.ROLE_BUTTON_ID"
          :key="item.ROLE_BUTTON_ID"
          :checked="item.ROLE_BUTTON_STATUS == '1' ? true : false"
          border
        >
          {{ item.ROLE_BUTTON_NAME }}
        </el-checkbox>
      </el-checkbox-group>
      <el-button type="primary" size="mini" @click="handleButtonEdit"> 确认 </el-button>
    </div>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import { deepClone } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import elDragDialog from "@/directive/el-drag-dialog"; // base on element-ui
import {
  getMenuList,
  getMenuListByLevel,
  addMenu,
  updateMenu,
  deleteMenu,
} from "@/api/menu";
import { getRoles } from "@/api/roles";
import { getRoleMenuListByLevelReturn } from "@/api/role_menu";
import { getRoleButtonList, updateRoleButton } from "@/api/role_button";
import { getSysTableColumnByTableCode } from "@/api/sys_table";

const calendarTypeOptions = [
  { key: 0, display_name: "否" },
  { key: 1, display_name: "是" },
];

export default {
  name: "Buttonflow",
  components: { Pagination },
  directives: { elDragDialog, waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "success",
        0: "info",
      };
      return statusMap[status];
    },
    statusNameFilter(status) {
      const statusMap = {
        1: "启动",
        0: "停止",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      Menu: {
        MENU_ID: undefined,
        MENU_PARENT_ID: undefined,
        MENU_NAME: undefined,
        MENU_PATH: undefined,
        MENU_COMPONENT: undefined,
        REDIRECT: undefined,
        URL: undefined,
        TITLE: undefined,
        META_ICON: undefined,
        META_NOCACHE: true,
        ALWAYSSHOW: true,
        META_AFFIX: false,
        HIDDEN: false,
        pid: 0,
        SORT: 1,
        STATUS: true,
      },
      routes: [],
      MenusList: [],
      total: 0,
      pagesNum: 1,
      activeName: "2",
      checkList: [],
      rolebutton: [],
      menulevel: {
        MENU_LEVEL: "1",
      },
      tablename: {},
      itemOptions: [],
      roleOptions: [],
      menulevelOptions: [],
      menubuttonOptions: [],
      listQuery: {
        page: 1,
        limit: 10,
        ROLE_ID: undefined,
        MENU_PARENT_ID: undefined,
        TITLE: undefined,
        MENU_NAME: undefined,
        STATUS: undefined,
        MENU_LEVEL: undefined,
      },
      rolemenuid: {},
      rolemenu: {},
      calendarTypeOptions,
      E_COMM_RETURN: {
        TYPE: undefined,
        MESSAGE: undefined,
      },
      isAble: false,
      isReloadData: false,
      dialogFormVisible: false,
      dialogStatus: "",
      downloadLoading: false,
      checkStrictly: false,
      textMap: {
        update: "编辑菜单",
        create: "创建主菜单",
        createsub: "创建子菜单",
      },
      rules: {
        MENU_NAME: [{ required: true, message: "请输入菜单名称", trigger: "change" }],
        MENU_PATH: [{ required: true, message: "请输入菜单路径", trigger: "change" }],
        MENU_COMPONENT: [{ required: true, message: "请输入组件", trigger: "change" }],
        URL: [{ required: true, message: "", trigger: "change" }],
        TITLE: [{ required: true, mes请输入路由sage: "请输入标题", trigger: "change" }],
        STATUS: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },
  created() {
    this.getSysTable();
    this.getRoleOption();
    this.getMenuLevelOption();
  },
  mounted() {
    this.getMenus();
  },
  methods: {
    getSysTable() {
      this.$set(this.tablename, "TABLE_CODE", "SYS_ROLE_MENU");
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
    getRoleOption() {
      var _this = this;
      getRoles().then((response) => {
        for (let i in response.data) {
          _this.roleOptions.push(response.data[i]);
        }
      });
    },
    roleidflag: function (row, column) {
      let role = undefined;
      var _this = this;
      _this.roleOptions.find((item, index) => {
        if (row.ROLE_ID == item.ROLE_ID) {
          return (role = item.ROLE_NAME);
        }
      });
      return role;
    },
    getMenuLevelOption() {
      var _this = this;
      getMenuListByLevel(this.menulevel).then((response) => {
        for (let i in response.data) {
          _this.menulevelOptions.push(response.data[i]);
        }
      });
    },
    menuparentflag: function (row, column) {
      let menuparent = undefined;
      var _this = this;
      _this.menulevelOptions.map((item, index) => {
        if (row.MENU_PARENT_ID == item.MENU_ID) {
          return (menuparent = item.TITLE);
        }
      });
      return menuparent;
    },
    async getMenus() {
      this.listLoading = true;
      let menulist = [];
      this.listQuery.MENU_LEVEL = "2";
      getRoleMenuListByLevelReturn(this.listQuery).then((response) => {
        //循环遍历将对象转成数组
        for (let i in response.data) {
          menulist.push(response.data[i]);
        }

        const {
          ROLE_ID,
          MENU_PARENT_ID,
          MENU_LEVEL,
          MENU_NAME,
          TITLE,
          URL,
          STATUS,
          page = 1,
          limit = 10,
        } = this.listQuery;

        let mockList = menulist.filter((item) => {
          if (this.activeName && item.MENU_LEVEL !== this.activeName) return false;
          if (ROLE_ID && item.ROLE_ID !== ROLE_ID) return false;
          if (MENU_PARENT_ID && item.MENU_PARENT_ID !== MENU_PARENT_ID) return false;
          if (STATUS && item.STATUS !== STATUS) return false;
          if (MENU_NAME && item.MENU_NAME.indexOf(MENU_NAME) < 0) return false;
          if (TITLE && item.TITLE.indexOf(TITLE) < 0) return false;
          return true;
        });

        //总行数
        /* this.total = mockList.length */

        //分页处理
        /*  const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
         */
        //加载数据
        this.MenusList = mockList;

        setTimeout(() => {
          this.listLoading = false;
        }, 0 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getMenus();
    },
    selectrow(row) {
      let rolebuttonlist = [];
      var _this = this;
      _this.checkList = [];
      this.$set(_this.rolemenuid, "ROLE_MENU_ID", row.ROLE_MENU_ID);
      getRoleButtonList(this.rolemenuid).then((response) => {
        //循环遍历将对象转成数组
        for (let i in response.data) {
          rolebuttonlist.push(response.data[i]);
        }
        _this.menubuttonOptions = rolebuttonlist;
        this.isReloadData = false;
        if (_this.menubuttonOptions.length !== 0) {
          this.$nextTick(() => {
            this.isReloadData = true;
          });
        }
      });
    },
    handleButtonEdit() {
      var _this = this;
        _this.rolebutton.push({
          ROLE_MENU_ID: parseInt(_this.rolemenuid.ROLE_MENU_ID),
          ROLE_BUTTON_ID: this.checkList
        });
      updateRoleButton(_this.rolebutton).then((response) => {
        if (response.data.E_COMM_RETURN.TYPE === "S") {
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
    },
    resetTemp() {
      this.isAble = false;
      this.Menu = {
        MENU_ID: undefined,
        MENU_NAME: undefined,
        MENU_PATH: undefined,
        MENU_COMPONENT: undefined,
        REDIRECT: undefined,
        URL: undefined,
        TITLE: undefined,
        META_ICON: undefined,
        META_NOCACHE: true,
        ALWAYSSHOW: true,
        META_AFFIX: false,
        HIDDEN: false,
        pid: 0,
        SORT: 1,
        STATUS: true,
      };
    },
    handleAddMenu(scope) {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.isAble = false;
      this.Menu.MENU_LEVEL = "1"; //父层级菜单
      this.Menu.MENU_COMPONENT = "#";
      this.Menu.URL = "/*";
      this.isAble = true;
      this.Menu.pid = scope.row ? scope.row.id : 0;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleAddSubMenu(scope) {
      this.resetTemp();
      this.dialogStatus = "createsub";
      this.dialogFormVisible = true;
      this.isAble = true;
      this.Menu.MENU_PARENT_ID = scope.row.MENU_ID;
      this.Menu.MENU_LEVEL = "2"; //子层级菜单
      this.Menu.MENU_COMPONENT = scope.row.MENU_PATH;
      this.Menu.URL = scope.row.MENU_PATH;
      this.Menu.pid = scope.row ? scope.row.id : 0;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.Menu.STATUS = this.Menu.STATUS === true ? 1 : 0;
          this.Menu.META_NOCACHE = this.Menu.META_NOCACHE === true ? 1 : 0;
          this.Menu.HIDDEN = this.Menu.HIDDEN === true ? 1 : 0;
          this.Menu.ALWAYSSHOW = this.Menu.ALWAYSSHOW === true ? 1 : 0;
          addMenu(this.Menu).then((response) => {
            if (response.data.E_COMM_RETURN.TYPE === "S") {
              this.MenusList.push(this.Menu);
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: response.data.E_COMM_RETUR.MESSAGE,
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
    handleEdit(scope) {
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.checkStrictly = true;
      this.isAble = false;
      this.Menu = Object.assign({}, scope.row); // copy obj
      this.Menu.STATUS = this.Menu.STATUS === 1 ? true : false;
      this.Menu.META_NOCACHE = this.Menu.META_NOCACHE === 1 ? true : false;
      this.Menu.HIDDEN = this.Menu.HIDDEN === 1 ? true : false;
      this.Menu.ALWAYSSHOW = this.Menu.ALWAYSSHOW === 1 ? true : false;
      this.$nextTick(() => {
        this.$refs["formData"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.Menu.STATUS = this.Menu.STATUS === true ? 1 : 0;
          this.Menu.META_NOCACHE = this.Menu.META_NOCACHE === true ? 1 : 0;
          this.Menu.HIDDEN = this.Menu.HIDDEN === true ? 1 : 0;
          this.Menu.ALWAYSSHOW = this.Menu.ALWAYSSHOW === true ? 1 : 0;
          const tempData = Object.assign({}, this.Menu);
          updateMenu(tempData).then((response) => {
            if (response.data.E_COMM_RETURN.TYPE === "S") {
              const index = this.MenusList.findIndex(
                (v) => v.MENU_ID === this.Menu.MENU_ID
              );
              this.MenusList.splice(index, 1, this.Menu);
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
    handleDelete({ $index, row }) {
      this.$confirm("确认删除菜单?", "Warning", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          deleteMenu(row).then((response) => {
            if (response.data.E_COMM_RETURN.TYPE === "S") {
              this.MenusList.splice($index, 1);
              this.$message({
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
        })
        .catch((err) => {
          console.error(err);
        });
    },
    handleClear() {
      this.listQuery = {
        page: 1,
        limit: 10,
        TITLE: undefined,
        MENU_NAME: undefined,
        STATUS: undefined,
        MENU_LEVEL: undefined,
      };
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = ["菜单名称", "路径", "组件", "跳转", "路由", "标题", "图标"];
        const filterVal = [
          "MENU_NAME",
          "MENU_PATH",
          "MENU_COMPONENT",
          "REDIRECT",
          "URL",
          "TITLE",
          "META_ICON",
        ];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list",
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.userData.map((v) =>
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
  height: 100%;
}

.el-form-item {
  margin-bottom: 12px;
}
</style>
