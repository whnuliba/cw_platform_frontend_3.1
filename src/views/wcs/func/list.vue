<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item, index) in cols" :key="index" style="display: inline">
        <el-input
          v-if="item.query && item.queryType === 'input'"
          v-model="queryParams.requestData[item.field]"
          :placeholder="commonI18n(item)"
          style="width: 250px"
          class="filter-item"
        >
          <!-- {{queryParams.requestData[item.field]=''}} -->
        </el-input>
        <el-select clearable 
          v-if="item.query && item.queryType === 'select'"
          v-model="queryParams.requestData[item.field]"
          :placeholder="commonI18n(item)"
          style="width: 200px"
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
          :placeholder="commonI18n(item)"
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
          :placeholder="commonI18n(item)"
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
      <el-button
        type="warning"
        v-ele-show="{ btnCode: 'wcs_addFuncJob' }"
        class="filter-item"
        @click="add"
      >
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
      <el-table-column min-width="50px" :label="$t('common.no')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="commonI18n(item)" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column
        v-for="item in cols"
        :sortable="true"
        :key="item.id"
        :label="commonI18n(item)"
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
      <el-table-column align="left" :label="$t('common.oper')" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            v-ele-show="{ btnCode: 'wcs_addFuncJob' }"
            icon="el-icon-edit"
            @click="edit(scope.row)"
          >
            {{ $t("common.btn.edit") }}
          </el-button>
          &nbsp;
          <el-button
            type="warning"
            v-ele-show="{ btnCode: 'wcs_delFuncJob' }"
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
      @pagination="getList"
    />
    <el-dialog
      :title="dialogtitle"
      v-el-drag-dialog
      :visible.sync="dialogFormVisible"
      width="700px"
    >
      <el-form
        ref="defaultForm.params"
        :inline="false"
        :model="defaultForm.params"
        label-width="100px"
      >
      <div v-for="item in newCols" :key="item.id" style="display: inline">
          <el-form-item
            v-if="item.set && item.queryType === 'input'"
            :label="commonI18n(item)"
            :prop="item.field"
            :rules="[
              {
                required: item.required,
                message: commonI18n(item) + $t('const.cannotNull'),
                trigger: 'blur',
              },
            ]"
          >
            <el-input v-model="defaultForm.params[item.field]" :placeholder="$t('const.pleaseInput')" style="width:70%" />
          </el-form-item>
          <el-form-item
            v-if="item.set && item.queryType === 'select'"
            :label="commonI18n(item)"
            :rules="[
              {
                required: item.required,
                message: commonI18n(item) + $t('const.cannotNull'),
                trigger: 'blur',
              },
            ]"
          >
            <el-select clearable 
              v-model="defaultForm.params[item.field]"
              @change="$forceUpdate()"
             :placeholder="$t('const.pleaseSelect')"
              style="width:70%"
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
          v-if="
            defaultForm.params.jobId === '' || defaultForm.params.jobId === null
          "
          @click="save('defaultForm.params')" v-preventReClick
        >
          {{ $t("common.btn.save") }}</el-button
        >
        <el-button
          type="primary"
          v-if="
            defaultForm.params.jobId != '' && defaultForm.params.jobId != null
          "
          @click="submit('defaultForm.params')" v-preventReClick
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
export default {
  name: "func",
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
  computed:{
    initSelect:{
      get(){
        return {
          comName:this.comName,
          timeId: this.timeId,
          ctrlTag: [
            { label: this.$t('common.ProcessFlowList.enable'), value: 1 },
            { label: this.$t('common.ProcessFlowList.disabled'), value: 0 }
          ],
          useState: [
            { label: this.$t('common.ProcessFlowList.enable'), value: 1 },
            { label: this.$t('common.ProcessFlowList.disabled'), value: 0 }
          ],
        }
      }
    }
  },
  data() {
    const _initdata = {
      dialogFormVisible: false,
      dialogtitle: '编辑',
      queryParams: {
        requestData: {},
      },
      comName:[],
      timeId: [],
      defaultForm: {
        row: {},
        params: {
          id: "",
          jobId: "",
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
        {
          field: "jobId",
          title: "间隔时间",
          minWidth: 100,
          hide: true,
          align: "center",
        },
        {
          field: "timeId",
          title: "间隔时间",
          minWidth: 100,
          align: "center",
          query: true,
          queryType: "select",
          set: true,
          required: true,
        },
        {
          field: "jobName",
          title: "名称",
          minWidth: 100,
          align: "center",
          query: true,
          queryType: "input",
          set: true,
          required: true,
        },
        {
          field: "comName",
          title: "组件名称",
          minWidth: 100,
          align: "center",
          query: false,
          queryType: "select",
          set: true,
          required: true,
        },
        {
          field: "useState",
          title: "使用状态",
          minWidth: 100,
          align: "center",
          queryType: "select",
          set: true,
          required: true,
        },
        {
          field: "ctrlTag",
          title: "控制",
          hide: true,
          align: "center",
          queryType: "select",
          queryType: "select",
          set: true,
          required: true,
        },
        {
          field: "lockName",
          title: "锁",
          align: "center",
          queryType: "select",
          queryType: "input",
          set: true,
          required: true,
        },
        {field: 'param', title: '参数', align: 'center',query:false,queryType:'input',set:true,filter:true,required:false},
        {
          field: "sortNum",
          title: "序号",
          hide: true,
          align: "center",
          queryType: "input",
          set: true,
          filter: true,
          required: true,
        },
        {
          field: "jobText",
          title: "备注",
          align: "center",
          queryType: "input",
          set: true,
          required: false,
        },
      ],
      newCols: [
        {
          field: "jobName",
          title: "名称",
          minWidth: 100,
          align: "center",
          query: true,
          queryType: "input",
          set: true,
          required: true,
        },
        {
          field: "comName",
          title: "组件名称",
          minWidth: 100,
          align: "center",
          query: true,
          queryType: "select",
          set: true,
          required: true,
        },
        {
          field: "jobId",
          title: "间隔时间",
          minWidth: 100,
          hide: true,
          align: "center",
        },
        {
          field: "timeId",
          title: "间隔时间",
          minWidth: 100,
          align: "center",
          query: true,
          queryType: "select",
          set: true,
          required: true,
        },
        {field: 'param', title: '参数', align: 'center',query:false,queryType:'input',set:true,filter:true,required:false},
        
        {
          field: "lockName",
          title: "锁",
          align: "center",
          queryType: "select",
          queryType: "input",
          set: true,
          required: true,
        },
        {
          field: "useState",
          title: "使用状态",
          minWidth: 100,
          align: "center",
          queryType: "select",
          set: true,
          required: true,
        },
        {
          field: "ctrlTag",
          title: "控制",
          hide: true,
          align: "center",
          queryType: "select",
          queryType: "select",
          set: true,
          required: true,
        },
        {
          field: "jobText",
          title: "备注",
          align: "center",
          queryType: "input",
          set: true,
          required: false,
        },
      ],
    };
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.newCols));
    return _initdata;
  },
  created() {
    this.getList();
    this.selectOptions();
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
    getList() {
      this.listLoading = true;
      Object.assign(this.queryParams, this.listQuery);
      const _data = { url: "/api/Job/GetFuncJob", params: this.queryParams };
      this.$store
        .dispatch("fmsCommon/actionWcsPost", _data)
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
      this.$nextTick(()=>{    
                this.$refs['defaultForm.params'].resetFields(); })
      for (let p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          if (p == "ctrlTag") this.defaultForm.params[p] = 0;
          else if (p == "useState") this.defaultForm.params[p] = 1;
          else if (p == "lockName") this.defaultForm.params[p] = "#";
          else if (p == "sortNum") this.defaultForm.params[p] = 0;
          else this.defaultForm.params[p] = "";
        }
      }
    },
    add() {
      this.destory(true)
      this.dialogtitle = this.$t('common.btn.add')
    },
    showDetails(row, column) {},
    edit(row) {
      this.dialogFormVisible = true
      this.dialogtitle = this.$t('common.btn.edit')
      for (let p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          this.defaultForm.params[p] = row[p];
        }
      }
    },
    submit(formName) {
      const _data = {
        url: "/api/Job/AddFuncJob",
        params: {
          data: this.defaultForm.params,
        },
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("fmsCommon/actionWcsPost", _data)
            .then((data) => {
              this.$message({
                type: "success",
                message: this.$t('common.btn.updateSuccess')
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
            message: this.$t('const.savedData')+this.$t('const.cannotNull')
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
    selectOptions() {
      //获取功能定时器执行时间
      let _data = { url: "/api/Job/GetJobTime", params: {} };
      this.$store
        .dispatch("fmsCommon/actionWcsPost", _data)
        .then((data) => {
          this.timeId = data.map((c) => {
            return {
              label: c.timeName,
              value: c.timeId,
            };
          });
        })
        .catch((err) => {
          console.error(err);
        }),
      _data = { url: "/api/Job/GetFuncJobComponent", params: {} };
      this.$store
        .dispatch("fmsCommon/actionWcsPost", _data)
        .then((data) => {
          this.comName = data.map((c) => {
            return {
              label: c,
              value: c,
            };
          });
        })
        .catch((err) => {
          console.error(err);
        })
    },
    //保存新增
    save(formName) {
      this.defaultForm.row = {};
      this.defaultForm.params.id = "";
      let _data = {
        url: "/api/Job/AddFuncJob",
        params: { data: this.defaultForm.params },
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("fmsCommon/actionWcsPost", _data)
            .then((data) => {
              this.$message({
                type: "success",
                message:  this.$t('common.btn.addSuccess')
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
            message: this.$t('const.savedData')+this.$t('const.cannotNull')
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
          const _data = {
            url: "/api/Job/DelFuncJob",
            params: { data: row.jobId },
          };
          this.$store
            .dispatch("fmsCommon/actionWcsPost", _data)
            .then((data) => {
              this.list.splice(index, 1);
              this.$message({
                type: "success",
                message: this.$t('common.btn.deleteSuccess')
              });
              this.getList()
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t('common.btn.Cancelled')
          });
        });
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
