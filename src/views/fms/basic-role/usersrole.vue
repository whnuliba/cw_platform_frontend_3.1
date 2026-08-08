<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item, i) in itemOptions" :key="i" style="float: left">
        <!-- 单行文本 -->
        <el-input
          v-if="item.COLUMN_ISQUERY == '1' && item.COLUMN_TYPE == 'input'"
          v-model="listQuery[item.COLUMN_KEY]"
          :placeholder="item.COLUMN_TITLE"
          style="width: 100px"
          class="filter-item"
        ></el-input>
        <!-- 下拉菜单 -->
        <el-select
          v-if="
            item.COLUMN_ISQUERY == '1' &&
            item.COLUMN_TYPE == 'select' &&
            item.COLUMN_KEY == 'ROLE_FLAG'
          "
          v-model="listQuery[item.COLUMN_KEY]"
          clearable
          :placeholder="item.COLUMN_TITLE"
          :style="'width:' + item.COLUMN_WIDTH + 'px'"
          class="filter-item"
        >
          <span v-for="item1 in calendarTypeOptions">
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
    </div>
    <el-table
      :key="tableKey"
      :data="rolesList"
      style="width: 100%; overflow: auto"
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
          <span
            v-else-if="item.COLUMN_KEY == 'ROLE_FLAG'"
            v-html="roleflag(scope.row, scope.row[item.COLUMN_KEY])"
          ></span>
          <span v-else>{{ scope.row[item.COLUMN_KEY] }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <KtButton
            size="mini"
            @click="handleEdit(scope)"
            perms="userrole_edit"
            type="primary"
            >{{ $t("permission.editRole") }}</KtButton
          >
          <KtButton
            size="mini"
            @click="handleDelete(scope)"
            perms="userrole_delete"
            type="danger"
            >{{ $t("permission.delete") }}</KtButton
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-el-drag-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '编辑角色' : '新建角色'"
      customClass="customStyle"
    >
      <el-form
        ref="dataForm"
        :model="role"
        :rules="rules"
        label-width="100px"
        label-position="left"
        :close-on-click-modal="false"
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
              v-model="role[item.COLUMN_KEY]"
              :placeholder="role.COLUMN_TITLE"
              :disabled="item.COLUMN_DISABLED == '1'"
            ></el-input>
          </el-form-item>
          <!-- 图标 -->
          <el-form-item
            :label="item.COLUMN_TITLE + ': '"
            v-if="item.COLUMN_TYPE == 'icon' && item.COLUMN_SHOW == '1'"
          >
            <icon-picker v-model="role[item.COLUMN_KEY]"></icon-picker>
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
              v-if="item.COLUMN_KEY == 'ROLE_FLAG'"
              v-model="role[item.COLUMN_KEY]"
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
              v-model="role[item.COLUMN_KEY]"
              :on-value="true"
              :off-value="false"
            ></el-switch>
          </el-form-item>
        </div>
      </el-form>
      <div style="text-align: right">
        <el-button @click="dialogVisible = false">
          {{ $t("permission.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ $t("permission.confirm") }}
        </el-button>
      </div>
    </el-dialog>

    <el-divider direction="horizontal" content-position="center" />

    <el-transfer
      filterable
      :filter-method="filterMethod"
      :titles="transfertext"
      filter-placeholder="请输入用户名"
      v-model="userrolevalue"
      :data="userroledata"
    >
    </el-transfer>
    <el-divider direction="horizontal" content-position="center" />
    <el-button type="primary" @click="updaterelation">{{
      $t("table.confirm")
    }}</el-button>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import path from "path";
import { deepClone } from "@/utils";
import elDragDialog from "@/directive/el-drag-dialog"; // base on element-ui
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { getRolesNormal, updateRole, deleteRole } from "@/api/roles";
import { getUserList } from "@/api/users";
import { getRelationsByRoleID, updateRelation } from "@/api/relation";
import { getSysTableColumnByTableCode } from "@/api/sys_table";
import { GetItemList } from "@/api/sysitem";

export default {
  name: "Usersrole",
  components: { Pagination },
  directives: { waves, elDragDialog },
  data() {
    const calendarTypeOptions = [
      { key: "0", display_name: "禁用" },
      { key: "1", display_name: "启用" },
    ];
    const defaultRole = {
      ROLE_ID: undefined,
      ROLE_CODE: "",
      ROLE_NAME: "",
      ROLE_REMARK: "",
      ROLE_AVATAR: "",
      ROLE_ORDER: undefined,
      ROLE_FLAG: "1",
      routes: [],
    };
    return {
      tableKey: 0,
      total: 0,
      pagesNum: 1,
      rules: {},
      rolesList: [],
      dialogVisible: false,
      dialogType: "new",
      checkStrictly: false,
      tablename: {},
      itemOptions: [],
      transfertext: ["未选中", "选中"],
      calendarTypeOptions: [],
      role: Object.assign({}, defaultRole),
      listQuery: {
        page: 1,
        limit: 10,
        ROLE_FLAG: undefined,
        ROLE_CODE: undefined,
      },
      userroledata: [],
      userrolevalue: [],
      relationrole: {},
      relationchecked: [],
      E_COMM_RETURN: {
        TYPE: undefined,
        MESSAGE: undefined,
      },
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1;
      },
    };
  },
  created() {
      this.GetFlagOptions();
    this.getSysTable();
    this.getRoles();
    
  },
  mounted() {},
  methods: {
    GetFlagOptions() {
      let query = {
        item_code: "AREA_FLAG",
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
    roleflag: function (row, column) {
      let code = undefined;
      this.calendarTypeOptions.map((item, index) => {
        if (row.ROLE_FLAG == item.key) {
          return (code = item.display_name);
        }
      });
      return code;
    },
    getSysTable() {
      this.$set(this.tablename, "TABLE_CODE", "SYS_ROLE");
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
    getRoles() {
      this.listLoading = true;
      let rolelist = [];
      getRolesNormal(this.listQuery).then((response) => {
        //循环遍历将对象转成数组
        for (let i in response.data) {
          rolelist.push(response.data[i]);
        }

        const { ROLE_CODE, ROLE_NAME, ROLE_FLAG, page = 1, limit = 10 } = this.listQuery;

        let mockList = rolelist.filter((item) => {
          if (ROLE_FLAG && item.ROLE_FLAG !== ROLE_FLAG) return false;
          if (ROLE_CODE && item.ROLE_CODE.indexOf(ROLE_CODE) < 0) return false;
          if (ROLE_NAME && item.ROLE_NAME.indexOf(ROLE_NAME) < 0) return false;
          return true;
        });

        //加载数据
        this.rolesList = mockList;

        setTimeout(() => {
          this.listLoading = false;
        }, 0 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getRoles();
    },
    selectrow(row) {
      this.getUsers();
      this.getUserRoles(row);
    },
    getUsers() {
      let userlist = [];
      getUserList().then((response) => {
        const allData = response.data;
        const data = [];
        for (let i = 0; i < allData.length; i++) {
          data.push({
            label: allData[i].USER_NAME,
            key: allData[i].USER_ID,
            pinyin: allData[i].USER_CODE,
          });
        }
        this.userroledata = data;
      });
    },
    getUserRoles(row) {
      var _this = this;
      this.$set(this.relationrole, "relationid", 1);
      this.$set(this.relationrole, "relationid1", row.ROLE_ID);
      getRelationsByRoleID(this.relationrole).then((response) => {
        let roleid = [];
        const relation = response.data;
        roleid = relation.map((item, i) => {
          return item.RELATION_ID2;
        });
        _this.userrolevalue = roleid;
      });
    },
    handleEdit(scope) {
      this.role = Object.assign({}, scope.row); // copy obj
      this.dialogStatus = "edit";
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.role);
          updateRole(tempData).then((response) => {
            if (response.data.E_COMM_RETURN.TYPE === "S") {
              const index = this.rolesList.findIndex(
                (v) => v.ROLE_ID === this.role.ROLE_ID
              );
              this.rolesList.splice(index, 1, this.role);
              this.dialogVisible = false;
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
        this.role = Object.assign({}, row);
        deleteRole(this.role).then(() => {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000,
          });
          this.rolesList.splice(index, 1);
        });
      });
    },
    updaterelation() {
      var _this = this;
      this.userrolevalue.forEach((item, i) => {
        _this.relationchecked.push({
          RELATION_ID: 1,
          RELATION_ID1: this.relationrole.relationid1,
          RELATION_ID2: parseInt(item),
        });
      });
      updateRelation(_this.relationchecked).then((response) => {
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
    handleClear() {
      this.listQuery = {
        page: 1,
        limit: 10,
        ROLE_FLAG: undefined,
        ROLE_NAME: undefined,
      };
    },
  },
};
</script>

<style>
.el-dialog.customStyle {
  width: 80%;
  height: 100%;
}
</style>
