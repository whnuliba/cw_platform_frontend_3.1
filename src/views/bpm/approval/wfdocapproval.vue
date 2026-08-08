<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item, index) in cols" :key="index" style="display: inline">
        <el-input
          v-if="item.query && item.queryType === 'input'"
          v-model="queryParams.requestData[item.field]"
          :placeholder="item.title"
          style="width: 120px"
          class="filter-item"
        >
          <!-- {{queryParams.requestData[item.field]=''}} -->
        </el-input>
        <el-select
          v-if="item.query && item.queryType === 'select'"
          v-model="queryParams.requestData[item.field]"
          :placeholder="item.title"
          style="width: 120px"
          class="filter-item"
        >
          <el-option
            v-for="item in initSelect[item.field]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-date-picker
          v-if="item.query && item.queryType === 'datetime'"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="queryParams.requestData[item.field]"
          type="datetime"
          :placeholder="item.title"
          style="width: 150"
          class="filter-item"
        >
        </el-date-picker>
        <el-date-picker
          v-if="item.query && item.queryType === 'date'"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="queryParams.requestData[item.field]"
          type="date"
          :placeholder="item.title"
          style="width: 150"
          class="filter-item"
        >
        </el-date-picker>
      </div>
      <el-button type="primary" class="filter-item" @click="query()">
        {{ $t("common.btn.query") }}
      </el-button>
      <el-button type="info" class="filter-item" @click="reset">
        {{ $t("common.btn.reset") }}
      </el-button>
      <el-button type="warning" class="filter-item" @click="add">
        {{ $t("common.btn.add") }}
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @row-dblclick="showDetails"
    >
      <el-table-column min-width="50px" label="序号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column
        v-for="item in cols"
        :key="item.id"
        :label="item.title"
        :prop="item.field"
        :width="item.width"
        :min-width="item.minWidth"
        v-if="!item.hide"
        :align="item.align"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">{{
          commonFilter(row[item.field], item.field)
        }}</template>
        <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" width="300">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit(scope.row)"
          >
            {{ $t("common.btn.edit") }}
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-user"
            @click="approval(scope.row)"
          >
            审批节点
          </el-button>
          <el-button
            type="warning"
            size="small"
            icon="el-icon-edit"
            @click="del(scope.$index, scope.row)"
          >
            {{ $t("common.btn.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.pageSize"
      @pagination="initDoc"
    />
    <el-dialog
      title="编辑"
      v-el-drag-dialog
      :visible.sync="dialogFormVisible"
      width="700px"
    >
      <el-form
        ref="defaultForm.params"
        :inline="true"
        :model="defaultForm.params"
        label-width="80px"
      >
        <div v-for="item in cols" :key="item.id" style="display: inline">
          <el-form-item
            v-if="item.set && item.queryType === 'input'"
            :label="item.title"
            :prop="item.field"
            :rules="[
              {
                required: item.require,
                message: item.title + '不能为空',
                trigger: 'blur',
              },
            ]"
          >
            <!--:disabled="item.isEdit && item.disable"-->
            <el-input
              v-model="defaultForm.params[item.field]"
              style="width: 220px"
              :disabled="allowDisable && item.editReadonly"
            />
          </el-form-item>
          <el-form-item
            v-if="item.set && item.queryType === 'select'"
            :label="item.title"
            :rules="[
              {
                required: item.require,
                message: item.title + '不能为空',
                trigger: 'change',
              },
            ]"
          >
            <el-select
              v-model="defaultForm.params[item.field]"
              @change="$forceUpdate()"
              :disabled="allowDisable && item.editReadonly"
              placeholder="请选择"
              style="width: 220px"
            >
              <el-option
                v-for="item in initSelect[item.field]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="destory(false)">
          {{ $t("common.btn.cancel") }}</el-button
        >
        <el-button
          type="primary"
          v-if="defaultForm.params.id === '' || defaultForm.params.id === null"
          @click="save('defaultForm.params')"
        >
          {{ $t("common.btn.save") }}</el-button
        >
        <el-button
          type="primary"
          v-if="defaultForm.params.id != '' && defaultForm.params.id != null"
          @click="submit('defaultForm.params')"
        >
          {{ $t("common.btn.submit") }}</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="管理审批节点"
      v-el-drag-dialog
      :visible.sync="approvalUserDiaLog"
      width="1200px"
    >
      <el-row>
        <el-col :span="7">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="文档编码">
              <el-input
                readonly
                disabled 
                v-model="rowdoc.docNo"
                placeholder="文档编码"
              ></el-input>
            </el-form-item>
            <el-form-item label="文档名称">
              <el-input
                readonly
                disabled 
                v-model="rowdoc.docName"
                placeholder="文档名称"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-col>

        <el-col :span="17">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <el-select
                v-model="rowdoc.userId"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.id"
                  :label="item.realName"
                  :value="item.userName"
                >
                </el-option>
              </el-select>
            </el-form-item>
 
            <el-form-item>
              <el-button type="primary" @click="addApprovalItem">新增节点</el-button>
            </el-form-item>
          </el-form>
          <el-table
            v-loading="listLoading"
            :data="approvalItem"
            border
            fit
            highlight-current-row
            style="width: 100%"
          >
            <el-table-column min-width="50px" label="序号" align="center">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>

            <el-table-column
              v-for="item in colsApproval"
              :key="item.id"
              :label="item.title"
              :prop="item.field"
              :width="item.width"
              :min-width="item.minWidth"
              v-if="!item.hide"
              :align="item.align"
              show-overflow-tooltip
            >
              <template slot-scope="{ row }">{{
                commonFilter(row[item.field], item.field)
              }}</template>
            </el-table-column>

            <el-table-column
              fixed="right"
              label="操作"
              width="100"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  @click="deleteUserRow(scope.row)"
                  type="primary"
                  size="small"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import elDragDialog from "@/directive/el-drag-dialog";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import i18n from "@/lang";
import { ref } from "vue";
export default {
  name: "approvalList",
  components: { Pagination },
  directives: { waves, elDragDialog },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "未启用",
        1: "启用",
      };
      return statusMap[status];
    },
  },
  data() {
    const _initdata = {
      dialogFormVisible: false,
      approvalUserDiaLog: false,
      allowDisable: false, //编辑禁用参数
      rowdoc:{
        userId: "",
        docId: "",
        docNo: "",
        docName: "",
      },
      addApprovalUser: {
        approveId:'',
        orgId:'',
        jobId:'',
        deptId:'',
        status:'',
        createTime:'',
        createUser:'',
      },
      queryParams: {
        requestData: {},
      },
      initSelect: {
        trayType: [],
        status: [
          { label: "启用", value: 0 },
          { label: "禁用", value: 1 },
        ],
      },
      defaultForm: {
        //编辑表单参数
        row: {},
        params: {
          id: "",
        },
      },
      list: null,
      total: 0,
      listLoading: true,
      userOptions: [],
      approvalItem: [],
      listQuery: {
        current: 1,
        pageSize: 15,
      },
      defaultUserData: {
        current: 1,
        pageSize: 15,
        data: "",
      },
      cols: [
        {
          field: "docNo",
          title: "文档编码",
          minWidth: 100,
          align: "center",
          query: true,
          queryType: "input",
          set: true,
          require: true,
          editReadonly: true,
        },
        {
          field: "docName",
          title: "文档名称",
          minWidth: 100,
          align: "center",
          query: true,
          queryType: "input",
          set: true,
        },
        {
          field: "docUri",
          title: "文档地址",
          align: "center",
          queryType: "input",
          set: true,
          require: true,
        },
        {
          field: "status",
          title: "状态",
          align: "center",
          query: true,
          queryType: "select",
          set: true,
          require: true,
        },
        { field: "createTime", title: "创建日期", align: "center" },
        { field: "createUser", title: "创建人", align: "center" },
      ],
      ///wf-work-node-item/items  流程节点衰 
      colsApproval:[
        { field: "wfId", title: "流程ID", align: "center" },
        { field: "roleCode", title: "审批角色", align: "center" },
        { field: "orgId", title: "人员", align: "center" },
        { field: "jobId", title: "岗位", align: "center" },
        { field: "deptId", title: "部门", align: "center" },
        { field: "status", title: "状态", align: "center" },
        { field: "createTime", title: "创建日期", align: "center" },
        { field: "createUser", title: "创建人", align: "center" },
      ]
    };
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols));
    return _initdata;
  },
  created() {
    this.initDoc();
    this.initUser();
  },
  methods: {
    initData(arr) {
      let args = {};
      arr.map((c) => {
        if (c.set) {
          args[c.field] = null;
        }
      });
      return args;
    },
    commonFilter(value, type) {
      if (
        this.initSelect.hasOwnProperty(type) &&
        typeof this.initSelect[type] != undefined &&
        Array.isArray(this.initSelect[type])
      ) {
        return this.getValueConvert(this.initSelect[type], value);
      }
      if (
        this.initSelect.hasOwnProperty(type) &&
        !Array.isArray(this.initSelect[type]) &&
        this.initSelect[type].hasOwnProperty(value)
      ) {
        return this.initSelect[type][value];
      }
      return value;
    },
    /** 初始化文件列表 */
    initDoc() {
      this.listLoading = true;
      Object.assign(this.queryParams, this.listQuery);
      const _data = { url: "/wf-doc/list", params: this.queryParams };
      this.$store
        .dispatch("fmsCommon/actionTaskPost", _data)
        .then((data) => {
          this.list = data.data;
          this.total = data.total;
          this.listLoading = false;
        })
        .catch((err) => {
          console.error(err);
        });
    },

    /** 初始化人员信息 */
    initUser() {
      this.listLoading = true;
      Object.assign(this.queryParams, this.listQuery);
      // 树状
      const _data = { url: "/org/org-tree" };
      this.$store.dispatch("fmsCommon/actionAuthPost", _data).then((data) => {
        const newData = this.treeData(data, "0");

        // 杭可人员
        const deptId = newData[0].children[2].children[0].id;
        let data2 = { url: "/user/dept-user", params: { data: deptId } };
        this.$store.dispatch("fmsCommon/actionAuthPost", data2).then((data) => {
          if (data.length > 0) {
            this.userOptions = data;
          }
        });
      });
      this.listLoading = false
    },

    /** 初始化节点信息*/
    initApproval(){
        this.listLoading = true;
        //const _data = { url: '/wf-work-approve-item/list', params: this.defaultUserData }
        //this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        //    .then(data => {
        //        this.approvalItem = data.data;
        //    }).catch(err => {
        //        console.error(err)
        //    })   
        this.listLoading = false    
    },

    /** 递归生成菜单树结构数据 */
    loop(data, id) {
      const res = [];
      data.forEach((item) => {
        item.label = item.name;
        item.value = item.id;
        item["leaf"] = false;
        item["disabled"] = true;
        if (item.children && item.children.length > 0) {
          item.children = this.loop(item.children, item.id);
        }
        res.push(item);
      });
      return res;
    },
    treeData(data, id) {
      this.loop(data, id);
      return this.loop(data, id);
    },

    getValueConvert(arr, value) {
      for (let v of arr) {
        if (v.value == value) {
          return v.label;
        }
      }
      return value;
    },
    destory(hide = false) {
      this.dialogFormVisible = hide;
      for (let p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          this.defaultForm.params[p] = "";
        }
      }
    },
    add() {
      this.destory(true);
    },
    showDetails(row, column) {},
    edit(row) {
      this.allowDisable = true;
      this.dialogFormVisible = true;
      for (let p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          this.defaultForm.params[p] = row[p];
        }
      }
    },
    submit(formName) {
      const _data = {
        url: "/wf-doc/add",
        params: {
          data: this.defaultForm.params,
        },
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("fmsCommon/actionTaskPost", _data)
            .then((data) => {
              this.$message({
                type: "success",
                message: "change success!=>" + data,
              });
              this.dialogFormVisible = false;
              this.query();
            })
            .catch((err) => {
              console.error(err);
            })
            .finally(() => {
              this.destory();
            });
        } else {
          this.$message({
            type: "error",
            message: "输入数据不能为空",
          });
          this.destory();
        }
      });
    },
    query() {
      this.listQuery.current = 1;
      this.initDoc();
    },
    reset() {
      for (let p in this.queryParams.requestData) {
        if (this.queryParams.requestData.hasOwnProperty(p)) {
          this.queryParams.requestData[p] = "";
        }
      }
    },
    save(formName) {
      this.defaultForm.row = {};
      this.defaultForm.params.id = "";
      let _data = {
        url: "/wf-doc/add",
        params: { data: this.defaultForm.params },
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("fmsCommon/actionTaskPost", _data)
            .then((data) => {
              this.$message({
                type: "success",
                message: "change success!=>" + data,
              });
              this.dialogFormVisible = false;
              this.query();
            })
            .catch((err) => {
              console.error(err);
            })
            .finally(() => {
              this.destory();
            });
        } else {
          this.$message({
            type: "error",
            message: "输入数据不能为空",
          });
          this.destory();
        }
      });
    },
    del(index, row) {
      this.$confirm(
        i18n.t("common.tip_info.delete_info"),
        i18n.t("common.tip_info.tips"),
        {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          const _data = { url: "/wf-doc/del", params: { data: row.id } };
          this.$store
            .dispatch("fmsCommon/actionTaskPost", _data)
            .then((data) => {
              this.list.splice(index, 1);
              this.$message({
                type: "success",
                message: "delete success!",
              });
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "cancel delete",
          });
        });
    },
    approval(row) {
      this.defaultUserData.data = row.docNo;
      this.rowdoc.docId = row.id;
      this.rowdoc.docNo = row.docNo;
      this.rowdoc.docName = row.docName;
      this.rowdoc.userId =
        this.userOptions.length > 0 ? this.userOptions[6].realName : "";
      this.approvalUserDiaLog = true;
  
      this.initUser();
      this.initApproval()
    },
    /** 添加节点 */
    addApprovalItem () {
        this.listLoading = true;
        this.addApprovalUser.orgId = this.rowdoc.userId;
        //const _data = { url: '/wf-work-approve-item/add', params: {data:this.addApprovalUser} }
        //this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
        //    if (data) {
        //        this.$message({
        //            message: '新增审批人成功！',
        //            type: 'success'
        //        })
        //        this.initApproval()
        //    }
        //        this.listLoading = false;
        //})   
    },
  },
};
</script>

<style scoped>
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
</style>
