<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item, index) in cols" :key="index" style="display: inline">
        <el-input
          v-if="item.query && item.queryType === 'input'"
          v-model="queryParams.requestData[item.field]"
          :placeholder="commonI18n(item)"
          style="width: 120px"
          class="filter-item"
        >
          <!-- {{queryParams.requestData[item.field]=''}} -->
        </el-input>
        <el-select clearable 
          v-if="item.query && item.queryType === 'select'"
          v-model="queryParams.requestData[item.field]"
          :placeholder="commonI18n(item)"
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
      <!-- <el-table-column  v-for="item in cols" :key="item.id"  :label="commonI18n(item)" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
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
            v-ele-show="{ btnCode: 'wcs_addJobTime' }"
            icon="el-icon-edit"
            @click="edit(scope.row)"
          >
            {{ $t("common.btn.edit") }}
          </el-button>
          &nbsp;
          <el-button
            type="warning"
            v-ele-show="{ btnCode: 'wcs_delJobTime' }"
            size="small"
            icon="el-icon-edit"
            @click="del(scope.$index, scope.row)"
          >
            {{ $t("common.btn.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" /> -->
    <el-dialog
      :title="dialogtitle"
      v-el-drag-dialog
      :visible.sync="dialogFormVisible"
      width="500px"
    >
      <el-form
        ref="defaultForm.params"
        :inline="false"
        :model="defaultForm.params"
        label-width="120px"
      >
        <div v-for="item in cols" :key="item.id" style="display: inline">
          <el-form-item v-if="item.set && item.queryType === 'input'"  :label="commonI18n(item)" :prop="item.field"
            :rules="[
              {
                required: item.required,
                message: commonI18n(item) + $t('const.cannotNull'),
                trigger: 'blur',
              },
            ]"
          >
            <el-input :disabled="item.isDisable" v-model="defaultForm.params[item.field]"  placeholder="请输入" style="width:90%" />
          </el-form-item>
          <el-form-item
            v-if="item.set && item.queryType === 'time'"
             :label="commonI18n(item)"
            :prop="item.field"
            :rules="[
              {
                required: item.required,
                message:commonI18n(item) + $t('const.cannotNull'),
                trigger: 'blur',
              },
            ]"
          >
          <el-time-picker format="HH:mm:ss" :disabled="item.isDisable" value-format="HH:mm:ss" type="time" v-model="defaultForm.params[item.field]" style="width:90%" />
          </el-form-item>
          <el-form-item
            v-if="item.set && item.queryType === 'select'"
             :label="commonI18n(item)"
            :rules="[
              {
                required: item.required,
                message:commonI18n(item) + $t('const.cannotNull'),
                trigger: 'blur',
              },
            ]"
          >
            <el-select clearable 
              v-model="defaultForm.params[item.field]"
              @change="$forceUpdate()"
              :placeholder="$t('const.pleaseSelect')"
              style="width:90%"
              :disabled="item.isDisable"
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
            defaultForm.params.timeId === '' ||
            defaultForm.params.timeId === null
          "
          @click="save('defaultForm.params')" v-preventReClick
        >
          {{ $t("common.btn.save") }}</el-button
        >
        <el-button
          type="primary"
          v-if="
            defaultForm.params.timeId != '' && defaultForm.params.timeId != null
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
  name: "jobTime",
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
            timeType: [
              { label: this.$t('const.timeType.timeSpan'), value: 1 },
              { label:this.$t('const.timeType.everyDay'), value: 2 },
              { label: this.$t('const.timeType.everyWeek'), value: 3 },
              { label:this.$t('const.timeType.everyMonth'), value: 4 },
            ],
            weekDay: [
              { label: this.$t('const.null'), value: -1 },
              { label:  this.$t('const.weekDay.Sunday'), value: 0 },
              { label:  this.$t('const.weekDay.Monday'), value: 1 },
              { label:  this.$t('const.weekDay.Tuesday'), value: 2 },
              { label:  this.$t('const.weekDay.Wednesday'), value: 3 },
              { label:  this.$t('const.weekDay.Thursday'), value: 4 },
              { label:  this.$t('const.weekDay.Friday'), value: 5 },
              { label:  this.$t('const.weekDay.Saturday'), value: 6 },
            ],
          }
      }
    }
  },
  data() {
    const _initdata = {
      dialogFormVisible: false,
      isEditEn:[
        false,false,false,false,false
      ],
      dialogtitle: '编辑',
      queryParams: {
        requestData: {},
      },
      // initSelect: {
      //   timeType: [
      //     { label: this.$t('const.timeType.timeSpan'), value: 1 },
      //     { label:this.$t('const.timeType.everyDay'), value: 2 },
      //     { label: this.$t('const.timeType.everyWeek'), value: 3 },
      //     { label:this.$t('const.timeType.everyMonth'), value: 4 },
      //   ],
      //   weekDay: [
      //     { label: this.$t('const.null'), value: -1 },
      //     { label:  this.$t('const.weekDay.Sunday'), value: 0 },
      //     { label:  this.$t('const.weekDay.Monday'), value: 1 },
      //     { label:  this.$t('const.weekDay.Tuesday'), value: 2 },
      //     { label:  this.$t('const.weekDay.Wednesday'), value: 3 },
      //     { label:  this.$t('const.weekDay.Thursday'), value: 4 },
      //     { label:  this.$t('const.weekDay.Friday'), value: 5 },
      //     { label:  this.$t('const.weekDay.Saturday'), value: 6 },
      //   ],
      // },
      defaultForm: {
        row: {},
        params: {
          id: "",
          timeId: "",
        },
      },
      list: null,
      // initValue:[
      //   { field: 'atTime',value:"0:00:00"}
      // ],
      //   total: 0,
      listLoading: true,
      listQuery: {
        // current: 1,
        // pageSize: 10
      },
      cols: [
        {
          field: "timeId",
          title: "执行计划Id",
          minWidth: 100,
          hide: true,
          align: "center",
        },
        {
          field: "timeType",
          title: "时间类型",
          minWidth: 100,
          query: false,
          queryType: "select",
          align: "center",
          set: true,
          required: true,
        },
        {
          field: "timeName",
          title: "计划名称",
          minWidth: 100,
          query: false,
          isDisable : true,
          queryType: "input",
          align: "center",
          set: true,
          required: true,
        },
        {
          field: "interval",
          title: "时间间隔(每毫秒)",
          minWidth: 100,
          query: false,
          queryType: "input",
          align: "center",
          set: true,
          required: true,
          isDisable: true,
        },
        {
          field: "atTime",
          title: "执行时间(每天)",
          minWidth: 100,
          query: false,
          queryType: "time",
          align: "center",
          set: true,
          required: true,
          isDisable: true,
        },
        {
          field: "weekDay",
          title: "执行星期(星期-)",
          minWidth: 100,
          query: false,
          queryType: "select",
          align: "center",
          set: true,
          required: true,
          isDisable: true,
        },
        {
          field: "monthDay",
          title: "执行日期(每月-日)",
          query: false,
          align: "center",
          queryType: "input",
          set: true,
          required: true,
          isDisable: true,
        },
      ],
    };
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols));
    return _initdata;
  },
  created() {
    this.getList();
    this.selectOptions();
  },
  watch:{
    'defaultForm.params.timeType'(val){
        if(this.isEditEn[0]){
          this.isEditEn[0] = false;
          return;
        }
        let colsParams = this.cols.filter(item => item.field === 'interval' |item.field === 'atTime' | item.field === 'weekDay'|item.field === 'monthDay');

        this.defaultForm.params["interval"] = 0;
        this.defaultForm.params["atTime"] = '0:00:00';
        this.defaultForm.params["weekDay"] = -1;
        this.defaultForm.params["monthDay"] = 0;
        for(let item of colsParams)
        {
            if(parseInt(val) == 1 & item.field === 'interval')
           item.isDisable = false;
            else if(parseInt(val) == 2 & item.field === 'atTime')
           item.isDisable = false;
           else if(parseInt(val) == 3 & (item.field === 'atTime' | item.field === 'weekDay'))
           item.isDisable = false;
           else if(parseInt(val) == 4 & (item.field === 'atTime' | item.field === 'monthDay'))
           item.isDisable = false;
          else
           item.isDisable = true;
        }
    },
    'defaultForm.params.interval'(val){
      if(this.isEditEn[1]){
          this.isEditEn[1] = false;
          return;
        }
      let name = "每隔"+val+"毫秒执行";
      if(this.$store.state.app.language=='en')
        name="execute every "+val+" millisecond" ;
      this.defaultForm.params["timeName"] = name;
    },
    'defaultForm.params.atTime'(val){
      if(this.isEditEn[2]){
          this.isEditEn[2] = false;
          return;
        }
      let name="";
      if(this.defaultForm.params.timeType==2){
        name = "每天的"+val+"执行";
        if(this.$store.state.app.language=='en')
          name="execute at "+val+" every day";
      }else if(this.defaultForm.params.timeType==3){
        let weekName = this.initSelect.weekDay.filter(f=>f.value === this.defaultForm.params.weekDay);
        name = "每"+weekName[0].label+"的"+val+"执行";
        if(this.$store.state.app.language=='en')
          name="execute at "+val+" every "+weekName[0].label;
      }else if(this.defaultForm.params.timeType==4){
        name = "每月"+this.defaultForm.params.monthDay+"日的"+val+"执行";
        if(this.$store.state.app.language=='en')
          name="execute at "+val+" every "+this.defaultForm.params.monthDay+"th of month";
      }
      this.defaultForm.params["timeName"] = name;
    },
    'defaultForm.params.weekDay'(val){
      if(this.isEditEn[3]){
          this.isEditEn[3] = false;
          return;
        }
      let weekName = this.initSelect.weekDay.filter(f=>f.value === val);
      let name = "每"+weekName[0].label+"的"+this.defaultForm.params["atTime"]+"执行";
       if(this.$store.state.app.language=='en')
        name="execute at "+this.defaultForm.params["atTime"]+" every "+weekName[0].label;
      this.defaultForm.params["timeName"] = name;
    },
    'defaultForm.params.monthDay'(val){
      if(this.isEditEn[4]){
          this.isEditEn[4] = false;
          return;
        }
      let name = "每月"+val+"日的"+this.defaultForm.params["atTime"]+"执行";
       if(this.$store.state.app.language=='en')
        name="execute at "+this.defaultForm.params["atTime"]+" every "+val+"th of month";
      this.defaultForm.params["timeName"] = name;
    }
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
      //   Object.assign(this.queryParams,this.listQuery)
      const _data = { url: "/api/Job/GetJobTime", params: {} };
      this.$store
        .dispatch("fmsCommon/actionWcsPost", _data)
        .then((data) => {
          this.list = data;
          //   this.total = data.total
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
          if (p == "atTime") this.defaultForm.params[p] = "0:00:00";
          else if (p == "weekDay") this.defaultForm.params[p] = -1;
          else if (p == "monthDay") this.defaultForm.params[p] = 0;
          else if (p == "interval") this.defaultForm.params[p] = 0;
          else this.defaultForm.params[p] = "";
        }
      }
    },
    add() {
      this.destory(true);
      this.dialogtitle = this.$t('table.add')
    },
    showDetails(row, column) {},
    edit(row) {
      this.isEditEn = [true,true,true,true,true];
      this.dialogFormVisible = true;
      this.dialogtitle = this.$t('table.edit')
      for (let p in this.defaultForm.params) {
        if (this.defaultForm.params.hasOwnProperty(p)) {
          this.defaultForm.params[p] = row[p];
        }
      }
    },
    submit(formName) {
      const _data = {
        url: "/api/Job/AddJobTime",
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
                message:  this.$t('common.btn.submitSuccess') 
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
            message:  this.$t('const.cannotNull') ,
          });
          this.destory();
        }
      });
    },
    query() {
      //  this.listQuery.current =1
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
      //    let _data = {url:'/api/Job/GetJobTime',params:{}}
      //    this.$store.dispatch('fmsCommon/actionWcsPost',_data)
      //   .then(data => {
      //        this.initSelect.timeId = data.map(c=>{
      //          return {
      //            label:c.timeName,
      //            value:c.timeId
      //          }
      //        })
      //    }).catch(err => {
      //       console.error(err)
      //    })
    },
    //保存新增
    save(formName) {
      this.defaultForm.row = {};
      this.defaultForm.params.id = "";
      let _data = {
        url: "/api/Job/AddJobTime",
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
            message:this.$t('const.cannotNull'),
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
            url: "/api/Job/DelJobTime",
            params: { data: row.timeId },
          };
          this.$store
            .dispatch("fmsCommon/actionWcsPost", _data)
            .then((data) => {
              this.list.splice(index, 1);
              this.$message({
                type: "success",
                message: this.$t('common.btn.deleteSuccess') 
              });
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message:  this.$t('common.btn.Cancelled') 
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
