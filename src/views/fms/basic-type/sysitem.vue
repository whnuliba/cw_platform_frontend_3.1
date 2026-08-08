<template>
  <div class="app-container">
    <el-row :gutter="50">
      <el-col :span="9">
        <div class="filter-container">
          <el-input
            v-model="ITEMCODE"
            placeholder="列表CODE"
            style="width: 120px"
            class="filter-item"
            clearable
          />
          <el-button
            
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="searchItemCode"
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
            @click="createItem"
          >
            {{ $t("table.add") }}
          </el-button>
        </div>
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="sysItemData"
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
                v-if="item.COLUMN_KEY == 'ITEM_FLAG'"
                v-html="goodsflag(scope.row, scope.row[item.COLUMN_KEY])"
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
                @click="handleCreatItemList(row, $index)"
              >
                {{ $t("table.add") }}
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click="handleUpdateItem(row, $index)"
              >
                {{ $t("table.edit") }}
              </el-button>
              <el-button
                v-if="row.status != 'deleted'"
                size="mini"
                type="danger"
                @click="handleDeleteItem(row, $index)"
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
          @pagination="GetSysItemData"
        />
      </el-col>
      <el-col :span="15" style="margin-top: 52px">
        <el-table
          :key="tableKey"
          v-loading="listcolumnLoading"
          :data="sysItemListData"
          border
          fit
          highlight-current-row
          :row-class-name="tableRowClassName"
          style="width: 100%; max-height: 540px; overflow: auto" 
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
            :width="item.COLUMN_WIDTH"
            v-if="item.COLUMN_SHOW == '1'"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="item.COLUMN_KEY == 'ITEM_LIST_FLAG'"
                v-html="goodsflag2(scope.row, scope.row[item.COLUMN_KEY])"
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
                @click="handleUpdateItemList(row, $index)"
              >
                {{ $t("table.edit") }}
              </el-button>
              <el-button
                v-if="row.status != 'deleted'"
                size="mini"
                type="danger"
                @click="handleDeleteItemList(row, $index)"
              >
                {{ $t("table.delete") }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog title="添加" :visible.sync="dialogDetailFormVisible">
      <el-form
        ref="dataForm2"
        :model="listQuery"
        :rules="rules2"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="列表配置CODE" label-width="120px" prop="ITEM_LIST_CODE">
          <el-input v-model="listQuery.ITEM_LIST_CODE"></el-input>
        </el-form-item>
        <el-form-item label="列表配置名称" label-width="120px" prop="ITEM_LIST_NAME">
          <el-input v-model="listQuery.ITEM_LIST_NAME"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" label-width="120px" prop="ITEM_LIST_FLAG">
          <el-select v-model="listQuery.ITEM_LIST_FLAG" placeholder="请选择">
            <el-option
              v-for="item in flagData"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="列表排序" label-width="120px" prop="ITEM_LIST_ORDER">
          <el-input type="number" v-model="listQuery.ITEM_LIST_ORDER"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createItemList"> 确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textName" :visible.sync="updateItemDialogFormVisible">
      <el-form
        ref="dataForm2"
        :model="listQuery2"
        :rules="rules"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="列表CODE" prop="ITEM_CODE">
          <el-input v-model="listQuery2.ITEM_CODE"></el-input>
        </el-form-item>
        <el-form-item label="列表名称" prop="ITEM_NAME">
          <el-input v-model="listQuery2.ITEM_NAME"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="ITEM_FLAG">
          <el-select v-model="listQuery2.ITEM_FLAG" placeholder="请选择">
            <el-option
              v-for="item in flagData"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="列表排序" prop="ITEM_ORDER">
          <el-input type="number" v-model="listQuery2.ITEM_ORDER"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateItemDialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="textName == '编辑' ? updateItem() : createItemData()"
        >
          确定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="列表配置编辑" :visible.sync="updateItemListDialogFormVisible">
      <el-form
        ref="dataForm2"
        :model="listQuery"
        :rules="rules"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="列表配置CODE" label-width="120px" prop="ITEM_LIST_CODE">
          <el-input v-model="listQuery.ITEM_LIST_CODE"></el-input>
        </el-form-item>
        <el-form-item label="列表配置名称" label-width="120px" prop="ITEM_LIST_NAME">
          <el-input v-model="listQuery.ITEM_LIST_NAME"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" label-width="120px" prop="ITEM_LIST_FLAG">
          <el-select v-model="listQuery.ITEM_LIST_FLAG" placeholder="请选择">
            <el-option
              v-for="item in flagData"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="列表配置排序" label-width="120px" prop="ITEM_LIST_ORDER">
          <el-input type="number" v-model="listQuery.ITEM_LIST_ORDER"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateItemListDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateItemList"> 确定</el-button>
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
  GetSysItem,
  GetSysItemList,
  CreateSysItemList,
  UpdateSysItem,
  DeleteSysItem,
  UpdateSysItemList,
  DeleteSysItemList,
  CreateSysItem,
} from "@/api/sysitem";

const flagData = [
  { key: "0", display_name: "否" },
  { key: "1", display_name: "是" }
];

export default {
  name: "sysitem",
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
      textName: undefined,
      flagData,
      updateItemDialogFormVisible: false,
      updateItemListDialogFormVisible: false,
      ITEMCODE: undefined,
      itemOptions: [],
      itemOptions2: [],
      tableKey: 0,
      listLoading: false,
      sysItemData: [],
      sysItemListData: [],
      listcolumnLoading: false,
      dialogDetailFormVisible: false,
      rules2: {
        ITEM_LIST_CODE: [{ required: true, message: "请输入列表CODE", trigger: "blur" }],
        ITEM_LIST_NAME: [{ required: true, message: "请输入列表名称", trigger: "blur" }],
        ITEM_LIST_FLAG: [{ required: true, message: "请选择是否启用", trigger: "blur" }],
        ITEM_LIST_ORDER: [{ required: true, message: "请输入排序", trigger: "blur" }],
      },
      rules: {
        ITEM_CODE: [{ required: true, message: "请输入列表CODE", trigger: "blur" }],
        ITEM_NAME: [{ required: true, message: "请输入列表名称", trigger: "blur" }],
        ITEM_ORDER: [{ required: true, message: "请输入排序", trigger: "blur" }],
        ITEM_FLAG: [{ required: true, message: "请选择是否启用", trigger: "blur" }],
      },
      listQuery2: {
        ITEM_ID: undefined,
        ITEM_CODE: undefined,
        ITEM_NAME: undefined,
        ITEM_ORDER: undefined,
        ITEM_FLAG: undefined,
      },
      page:1,
      limit:10,
      listQuery: {
        page: 1,
        limit: 10,
        ITEM_ID: undefined,
        ITEM_LIST_ID: undefined,
        ITEM_LIST_CODE: undefined,
        ITEM_LIST_NAME: undefined,
        ITEM_LIST_FLAG: undefined,
        ITEM_LIST_ORDER: undefined,
      },
      selectItemRow: {},
      total: 0,
      tablename: {},
      tablename2: {},
      sysItemAllData: [],
    };
  },
  created() {
    this.getSysTable()
    this.getSysTable2()
    this.GetSysItemData()
  },
  mounted() {},
  methods: {
    goodsflag: function (row, column) {
      return row.ITEM_FLAG == "0" ? "否" : row.ITEM_FLAG == "1" ? "是" : "----";
    },
    goodsflag2: function (row, column) {
      return row.ITEM_LIST_FLAG == "0" ? "否" : row.ITEM_LIST_FLAG == "1" ? "是" : "----";
    },
    getSysTable() {
      this.$set(this.tablename, "TABLE_CODE", "SYS_ITEM");
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
      this.$set(this.tablename2, "TABLE_CODE", "SYS_ITEM_LIST");
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
    searchItemCode() {
      this.listLoading = true
      let searchData = [];
      if (this.ITEMCODE === "" || this.ITEMCODE === undefined) {
        this.GetSysItemData();
      } else {
        this.sysItemAllData.forEach((item, index, array) => {
          if (item.ITEM_CODE == this.ITEMCODE) {
            searchData.push(item);
          }
        });
        this.total = searchData.length;
        const pageList = searchData.filter(
          (item, index) =>
            index < this.limit * this.page &&
            index >= this.limit * (this.page - 1)
        );
        this.sysItemData = pageList;
        this.sysItemListData = new Array();
      }
      setTimeout(() => {
        this.listLoading = false
      }, 500);
    },
    createItem() {
      this.textName = "添加";
      (this.listQuery2 = {
        ITEM_ID: undefined,
        ITEM_CODE: undefined,
        ITEM_NAME: undefined,
        ITEM_ORDER: undefined,
        ITEM_FLAG: undefined,
      }),
        (this.updateItemDialogFormVisible = true);
    },
    createItemData() {
      CreateSysItem(this.listQuery2).then((response) => {
        if (response.data.E_COMM_RETURN.TYPE === "S") {
          this.$notify({
            title: "成功",
            type: "success",
            message: "添加成功",
            duration: 2000,
          });
          this.sysItemData.push(this.listQuery2);
          this.updateItemDialogFormVisible = false;
        } else {
          this.$notify({
            title: "失败",
            type: "error",
            message: response.data.E_COMM_RETURN.MESSAGE,
            duration: 2000,
          });
        }
        
      });
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    handleDeleteItemList(row, index) {
      this.$confirm("确认执行操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        DeleteSysItemList(row).then((response) => {
          if (response.data.E_COMM_RETURN.TYPE === "S") {
            this.$notify({
              title: "成功",
              type: "success",
              message: "删除成功",
              duration: 2000,
            });
            const index = this.sysItemListData.findIndex((m) => {
              if (m.ITEM_LIST_ID == row.ITEM_LIST_ID) {
                return true;
              }
            });
            this.sysItemListData.splice(index, 1);
            this.updateItemListDialogFormVisible = false;
          } else {
            this.$notify({
              title: "失败",
              type: "error",
              message: "删除失败",
              duration: 2000,
            });
          }
          
        });
      });
    },
    handleUpdateItemList(row, index) {
      this.updateItemListDialogFormVisible = true;
      this.listQuery = Object.assign({}, row);
    },
    updateItemList() {
      UpdateSysItemList(this.listQuery).then((response) => {
        if (response.data.E_COMM_RETURN.TYPE === "S") {
          this.$notify({
            title: "成功",
            type: "success",
            message: "更新成功",
            duration: 2000,
          });
          const index = this.sysItemListData.findIndex((m) => {
            if (m.ITEM_LIST_ID == this.listQuery.ITEM_LIST_ID) {
              return true;
            }
          });
          this.$set(
            this.sysItemListData[index],
            "ITEM_LIST_CODE",
            this.listQuery.ITEM_LIST_CODE
          );
          this.$set(
            this.sysItemListData[index],
            "ITEM_LIST_NAME",
            this.listQuery.ITEM_LIST_NAME
          );
          this.$set(
            this.sysItemListData[index],
            "ITEM_LIST_ORDER",
            this.listQuery.ITEM_LIST_ORDER
          );
          this.$set(
            this.sysItemListData[index],
            "ITEM_LIST_FLAG",
            this.listQuery.ITEM_LIST_FLAG
          );
          this.updateItemListDialogFormVisible = false;
        } else {
          this.$notify({
            title: "失败",
            type: "error",
            message: response.data.E_COMM_RETURN.MESSAGE,
            duration: 2000,
          });
        }
      });
    },
    GetSysItemData() {
      GetSysItem().then((response) => {
        this.sysItemAllData = response.data;
        this.total = response.data.length;
        const pageList = this.sysItemAllData.slice(
        (this.page - 1) * this.limit,
        this.page * this.limit
      )
        this.sysItemData = pageList;
      });
    },
    handleDeleteItem(row, index) {
      this.$confirm("确认执行操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        DeleteSysItem(row).then((response) => {
          if (response.data.E_COMM_RETURN.TYPE === "S") {
            this.$notify({
              title: "成功",
              type: "success",
              message: "删除成功",
              duration: 2000,
            });
            const index = this.sysItemData.findIndex((m) => {
              if (m.ITEM_ID == row.ITEM_ID) {
                return true;
              }
            });
            this.sysItemData.splice(index, 1);
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
    handleUpdateItem(row, index) {
      this.updateItemDialogFormVisible = true;
      this.textName = "编辑";
      this.listQuery2 = Object.assign({}, row);
    },
    updateItem() {
      this.listQuery2.ITEM_ID = this.selectItemRow.ITEM_ID;
      UpdateSysItem(this.listQuery2).then((response) => {
        if (response.data.E_COMM_RETURN.TYPE === "S") {
          this.$notify({
            title: "成功",
            type: "success",
            message: "更新成功",
            duration: 2000,
          });
          const index = this.sysItemData.findIndex((m) => {
            if (m.ITEM_ID == this.listQuery2.ITEM_ID) {
              return true;
            }
          });
          this.$set(this.sysItemData[index], "ITEM_CODE", this.listQuery2.ITEM_CODE);
          this.$set(this.sysItemData[index], "ITEM_NAME", this.listQuery2.ITEM_NAME);
          this.$set(this.sysItemData[index], "ITEM_ORDER", this.listQuery2.ITEM_ORDER);
          this.$set(this.sysItemData[index], "ITEM_FLAG", this.listQuery2.ITEM_FLAG);
          this.updateItemDialogFormVisible = false;
        } else {
          this.$notify({
            title: "失败",
            type: "error",
            message: response.data.E_COMM_RETURN.MESSAGE,
            duration: 2000,
          });
        }
      });
    },
    handleClear(){
      this.ITEMCODE = undefined
    },
    createItemList() {
      this.listQuery.ITEM_ID = this.selectItemRow.ITEM_ID;
      CreateSysItemList(this.listQuery).then((response) => {
        if (response.data.E_COMM_RETURN.TYPE === "S") {
          this.$notify({
            title: "成功",
            type: "success",
            message: "添加成功",
            duration: 2000,
          });
          this.sysItemListData.splice(0, 0, this.listQuery);
          this.dialogDetailFormVisible = false;
        } else {
          this.$notify({
            title: "失败",
            type: "error",
            message: response.data.E_COMM_RETURN.MESSAGE,
            duration: 2000,
          });
        }
      });
    },
    handleCreatItemList(row, index) {
      (this.listQuery = {
        ITEM_ID: undefined,
        ITEM_LIST_ID: undefined,
        ITEM_LIST_CODE: undefined,
        ITEM_LIST_NAME: undefined,
        ITEM_LIST_FLAG: undefined,
        ITEM_LIST_ORDER: undefined,
      }),
        (this.dialogDetailFormVisible = true);
    },
    selectrow(row) {
      this.selectItemRow = Object.assign({}, row);
      this.listcolumnLoading = true;
      let systablecolumnlist = [];
      let query = {
        itemId: row.ITEM_ID,
      };
      GetSysItemList(query).then((response) => {
        //循环遍历将对象转成数组
        for (let i in response.data) {
          systablecolumnlist.push(response.data[i]);
        }
        //加载数据
        this.sysItemListData = systablecolumnlist

        setTimeout(() => {
          this.listcolumnLoading = false;
        }, 0 * 1000);
      });
    },
  }
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
