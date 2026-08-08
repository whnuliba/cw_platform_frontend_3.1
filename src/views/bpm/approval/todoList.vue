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

      <el-table-column label="代办状态" align="center" prop="wtState">
        <template slot-scope="scope">
          <el-button :type="getType(scope.row)" size="mini" plain>
            {{ commonFilter(scope.row.wtState, "wtState") }}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="toFlowView(scope.row)"
          >
            预览
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
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
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import elDragDialog from "@/directive/el-drag-dialog";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import i18n from "@/lang";
import bpmCommonForm from '../bpm-common-form'
export default {
  name: "ConstantCode",
  components: { Pagination,bpmCommonForm },
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
      allowDisable: false,
      queryParams: {
        requestData: {wtState:'WAIT'},
      },
      initSelect: {
        trayType: [],
        approveRole: [
          { label: "用户", value: "USER" },
          { label: "部门", value: "DEPT" },
          { label: "岗位", value: "JOB" },
          { label: "用户组", value: "UGROUP" },
        ],
        wtState: [
          { label: "待办", value: "WAIT" },
          { label: "完结", value: "FINISHED" },
        ],
        approveOpinion: [
          { label: "同意", value: "AGREE" },
          { label: "驳回", value: "REJECT" },
        ],
      },
      defaultForm: {
        row: {},
        params: {
          id: "",
        },
      },
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        pageSize: 15,
      },
      cols: [
        { field: "docName", title: "表单名称", align: "center" },
        { field: "docNo", title: "表单编码", align: "center" },
        {
          field: "docUri",
          title: "文档地址",
          minWidth: 100,
          align: "center",
          query: true,
          queryType: "input",
        },
        {
          field: "wtState",
          title: "代办状态",
          align: "center",
          query: true,
          queryType: "select",
          hide: "true",
        },

        { field: "currUser", title: "审批人", align: "center" },
        { field: "approveUsername", title: "审批人", align: "center" },
        { field: "approveOpinion", title: "审批意见", align: "center" },
        { field: "createTime", title: "创建时间", align: "center" },
        { field: "createUser", title: "创建人", align: "center" },
      ],
    };
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols));
    return _initdata;
  },
  created() {
    this.getList();
  },
  methods: {
    /** 代办状态样式 */
    getType(row) {
      if (row.wtState == "WAIT") {
        return "warning";
      } else if (row.wtState == "FINISHED") {
        return "success";
      }
    },

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
    getList() {
      this.listLoading = true;
      Object.assign(this.queryParams, this.listQuery);
      const _data = { url: "/wf-work-approve/items", params: this.queryParams };
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
      //   httpUtils.actionFmsPost('/line/list',this.listQuery).then(data => {
      //       console.log(data)
      //   })
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
        url: "/codes/add",
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
      this.getList();
    },
    reset() {
      for (let p in this.queryParams.requestData) {
        if (this.queryParams.requestData.hasOwnProperty(p)) {
          this.queryParams.requestData[p] = "";
        }
      }
    },
    /** 预览 */
    toFlowView(row) {
      let cpName = undefined
      let cp = row.docUri

      if (cp && cp != null && cp.indexOf("\\") != -1)
                   cp = cp.replace("\\", "/");
                if(!cp.startsWith("/")){
                    cp = `/${cp}`
                }
      this.$router.push({
                    path:cp,
                    query:{id:row.id,sourceType:'TODO'}

                })



    // if (cp && cp != null && cp.indexOf("\\") != -1)
    //       cp = cp.replace("\\", "/");

    // if (cp) {
    //   let apArr = cp.split("/");
    //   if (apArr.length) 
    //    cpName = apArr[apArr.length-1];
    //   if(apArr.length>=2){
    //     // console.log({
    //     //   name: row.docUri,
    //     //   params: { formFlowData: { docId: row.docId,sourceId:row.id,sourceData:row,sourceType: 'TODO'} }
    //     // })
    //       this.$router.push({
    //       //path: row.docUri,
    //       //name: row.docUri,
    //       name: cpName,
    //       // prop: true,
    //       params: {bizType: apArr[apArr.length-2],bizCode:cpName, formFlowData: { docId: row.docId,sourceId:row.id,sourceData:row,sourceType: 'TODO'} },
    //     });
    //   }else{
    //     this.$router.push({
    //       name: row.docUri,
    //       params: { formFlowData: { docId: row.docId,sourceId:row.id,sourceData:row,sourceType: 'TODO'} },
    //     })
    //  }
    // }
  }
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
