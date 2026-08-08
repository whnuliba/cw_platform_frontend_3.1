/*
* @CreatAuthor: 宋丹峰
* @UpdateAuthor: (...)
* @Description: 单机信息-氦检信息
*/
<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item,index) in cols" :key="index" style="display:inline">
        <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="item.title" style="width: 120px" class="filter-item">
          <!-- {{queryParams.requestData[item.field]=''}} -->
        </el-input>
        <el-select v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="item.title" style="width: 120px" class="filter-item">
          <el-option v-for="item in initSelect[item.field]"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker v-if="item.query && item.queryType==='datetime'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]" type="datetime" :placeholder="item.title" style="width: 150" class="filter-item"> </el-date-picker>
        <el-date-picker v-if="item.query && item.queryType==='date'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]" type="date" :placeholder="item.title" style="width: 150" class="filter-item"> </el-date-picker>
      </div>
      <el-button type="primary" class="filter-item" @click="query()">
        {{ $t("common.btn.query") }}
      </el-button>
      <el-button type="info" class="filter-item" @click="reset">
        {{ $t("common.btn.reset") }}
      </el-button>
      <!--<el-button type="warning" class="filter-item" @click="add">
        {{ $t("common.btn.add") }}
      </el-button>-->
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @row-dblclick="showDetails">

      <el-table-column min-width="50px" label="序号" align="center">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column v-for="(item) in cols" :key="item.id" :label="item.title" :prop="item.field" :width="item.width" :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{commonFilter(row[item.field],item.field)}}
        </template>
        <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="left" fixed="right" width="50">
        <template slot="header" slot-scope="scope">
          <i style="margin-left: 10px;cursor:pointer;" class="el-icon-bank-card"  @click="selectFields" ></i>
        </template>
      </el-table-column>
      <!--<el-table-column align="left" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="edit(scope.row)">
            {{ $t("common.btn.edit") }}
          </el-button>
          &nbsp;
          <el-button type="warning" v-ele-show="{btnCode:'DEL_DEVICE_INFO'}" size="small" icon="el-icon-edit" @click="del(scope.$index,scope.row)">
            {{ $t("common.btn.delete") }}
          </el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog title="编辑" v-el-drag-dialog :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="80px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item v-if="item.set && item.queryType==='input'" :label="item.title" :prop="item.field"
                        :rules="[{ required: true, message: item.title+'不能为空', trigger: 'blur' }]">
            <el-input v-model="defaultForm.params[item.field]" />
          </el-form-item>
          <el-form-item v-if="item.set && item.queryType==='select'" :label="item.title">
            <el-select v-model="defaultForm.params[item.field]"   @change="$forceUpdate()" placeholder="请选择">
              <el-option v-for="item in initSelect[item.field]"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="destory(false)">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.id==='' || defaultForm.params.id===null" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.id!='' && defaultForm.params.id!=null" @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>


    <!--列显示呈现 -》所用组件 -->
    <ColTableInit ref="ColTableInit"  :cols="cols" :table_mark="table_mark" />

  </div>

</template>

<script>
  import waves from "@/directive/waves"; // waves directive
  import elDragDialog from "@/directive/el-drag-dialog";
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import i18n from '@/lang';
  // 列显示呈现 -》 加载组件
  import ColTableInit from '../../common/ColTableInit.vue';
  export default {
    name: 'CellList',
    components: { Pagination, ColTableInit },
    directives: { waves, elDragDialog },
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: '未启用',
          1: '启用'
        }
        return statusMap[status]
      }
    },
    data() {
      const _initdata = {
        //列显示呈现 -》 组件所需name,需唯一
        table_mark:"HE_CHECK_PROCESS",
        dialogFormVisible: false,
        queryParams: {
          requestData: {}
        },
        initSelect: {
          lineCode: [],
          cellState:[],
        },
        defaultForm: {
          row: {},
          params: {
            id: '',
          }
        },
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          current: 1,
          pageSize: 15
        },
        cols: [
          { field: 'cellBarcode', title: '电芯条码', width: 220, align: "center", query: true, queryType: 'input', set: true },
          { field: 'cellState', title: '电芯状态', width: 150, align: "center", query: true, queryType: 'select', set: true },
          { field: 'lotCode', title: '电芯批次', minWidth: 150, align: "center", query: true,queryType: 'input', set: true },
          { field: 'lineCode', title: '线体', width: 145, align: "center", query: true, queryType: 'select', set: true },
          { field: 'cellType', title: '电芯型号', width: 200, align: "center", query: true, queryType: 'input', set: true },
          { field: 'inStationTime', title: '入站时间', align: 'center', width: 200 },
          { field: 'outStationTime', title: '出站时间', align: 'center', width: 200 },

          { field: 'vacuumRate', title: '腔体真空度', align: 'center' ,width:200},
          { field: 'vacuumTime', title: '抽真空时间', align: 'center', width: 200 },
          { field: 'cavityInfo', title: '腔体信息', align: 'center', width: 200 },
          { field: 'vacuumPressure', title: '回收氦抽真空的压力', align: 'center', width: 200 },
          { field: 'backHeTime', title: '回HE时间', align: 'center', width: 200 },
          { field: 'liquidTime', title: '注液时间', align: 'center', width: 200 },
          { field: 'rackHeRate', title: '回氦后的真空度', align: 'center', width: 200 },
          { field: 'heCheckVal', title: 'He气检出值', align: 'center', width: 200 },
          { field: 'cavityPressure', title: '腔体压力', align: 'center', width: 200 },
          { field: 'checkTime', title: '氦检时间', align: 'center', width: 200 },
          { field: 'flowVersion', title: '流程版本', align: 'center', width: 200 },
          { field: 'flowCode', title: '流程编码', align: 'center', width: 200 },
          { field: 'temp', title: '温度', align: 'center', width: 200 },
          { field: 'humidity', title: '湿度', align: 'center', width: 200 },
          { field: 'airClean', title: '空气洁净度', align: 'center', width: 200 },
          { field: 'vacuumAlarm', title: '腔体预抽真空报警设定(s)', align: 'center', width: 200 },
          { field: 'actualVacuum', title: '腔体预抽真空实际(Pa)', align: 'center', width: 200 },
          { field: 'preVacuumtime', title: '预抽真空时间设定(s)', align: 'center', width: 200 },
          { field: 'cavityAlarm', title: '腔体真空报警设定(s)', align: 'center', width: 200 },
          { field: 'actCavityAlarm', title: '腔体真空实际(Pa)', align: 'center', width: 200 },
          { field: 'actVacuumtime', title: '腔体抽真空时间设定(s)', align: 'center', width: 200 },
          { field: 'leakPress', title: '检漏口压力设定(Pa)', align: 'center', width: 200 },
          { field: 'detectionTime', title: '氦检时间设定(s)', align: 'center', width: 200 },
          { field: 'heAlarm', title: '氦检报警', align: 'center', width: 200 },
          { field: 'lossRate', title: '氦检漏率', align: 'center', width: 200 },
          { field: 'retest', title: '是否复测', align: 'center', width: 200 },
          { field: 'createTime', title: '创建时间', align: 'center', width: 200 },
          { field: 'upLoadTime', title: '上传时间', align: 'center', width: 200 },
          { field: 'remark', title: '备注', align: 'center', width: 200 },
          { field: 'errorCode', title: '错误代码', align: 'center', width: 200 },

          { field: 'workNo', title: '生产工单', align: 'center', width: 200 },
          { field: 'flowVersion', title: '流程版本', align: 'center', width: 200 },
          { field: 'processName', title: '工序名称', align: 'center', width: 200 },
          { field: 'workShift', title: '生产班次', align: 'center', width: 200 },
          { field: 'workPeople', title: '作业人员', align: 'center', width: 200 },
          { field: 'equipmentCode', title: '设备号', align: 'center', width: 200 },
          { field: 'deviceState', title: '设备状态', align: 'center', width: 200 },



          // { field: 'bTime', title: '开始时间', hide: true, align: 'center', query: true, queryType: 'date' },
          // { field: 'eTime', title: '结束时间', hide:true, align: 'center', query: true, queryType: 'date' },

        ]
      }
      Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
      return _initdata
    },
    created() {
      this.getList()
      this.selectOptions()
    },
    mounted(){
      // 列显示呈现 -》 初始化显示字段
      this.initSaveCols();
    },
    methods: {
      // 列显示呈现 -》 更新显示字段
      initSaveCols(){
        this.$refs.ColTableInit.initCols();
        this.getList()
      },
      // 列显示呈现 -》 点击显示选择框
      selectFields(){
        this.$refs.ColTableInit.selectFields();
      },
      initData(arr) {
        let args = {}
        arr.map(c => {
          if (c.set) {
            args[c.field] = null
          }
        })
        return args
      },
      commonFilter(value, type) {

        if (this.initSelect.hasOwnProperty(type) && typeof this.initSelect[type] != undefined && Array.isArray(this.initSelect[type])) {
          return this.getValueConvert(this.initSelect[type], value)
        }
        if (this.initSelect.hasOwnProperty(type) && !Array.isArray(this.initSelect[type]) && this.initSelect[type].hasOwnProperty(value)) {
          return this.initSelect[type][value]
        }
        return value
      },
      getList() {
        this.listLoading = true
        Object.assign(this.queryParams, this.listQuery)
        const _data = { url: '/CwHeCheckProcessController/list', params: this.queryParams }
        this.$store.dispatch('fmsCommon/actionFmsPost', _data)
          .then(data => {
            this.list = data.data
            this.total = data.total
            this.listLoading = false
          }).catch(err => {
            console.error(err)
          })
      },

      getValueConvert(arr, value) {
        for (let v of arr) {
          if (v.value == value) {
            return v.label
          }
        }
        return value
      },
      destory(hide = false) {
        this.dialogFormVisible = hide
        for (let p in this.defaultForm.params) {
          if (this.defaultForm.params.hasOwnProperty(p)) {
            this.defaultForm.params[p] = ''
          }
        }
      },

      showDetails(row, column) {
      },
      query() {
        this.listQuery.current = 1
        this.getList()
      },
      reset() {
        for (let p in this.queryParams.requestData) {
          if (this.queryParams.requestData.hasOwnProperty(p)) {
            this.queryParams.requestData[p] = ''
          }
        }
      },
      selectOptions() {
        let _data = { url: '/CwCellStateCodeController/state/all', params: {} }   ///constant/cell-state
        this.$store.dispatch('fmsCommon/actionFmsPost', _data)
          .then(data => {
            this.initSelect.cellState = data.map(c => {
              return {
                label: c.stateName,
                value: c.stateValue
              }
            })
          }).catch(err => {
            console.error(err)
          })

        _data = { url: '/CwLineInfoController/guest/all', params: {} }
        this.$store.dispatch('fmsCommon/actionFmsPost', _data)
          .then(data => {
            this.initSelect.lineCode = data.map(c => {
              return {
                label: c.lineNo,
                value: c.lineNo
              }
            })
          }).catch(err => {
            console.error(err)
          })

        //初始化工序信息
      },
    }
  }
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
