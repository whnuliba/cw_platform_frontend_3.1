/*
*  create: 宋丹峰
*  生产信息 - 叠盘信息
*  update: (...)
*/
<template>
  <div class="app-container">
    <div class="filter-container">
      <div v-for="(item,index) in cols" :key="index" style="display:inline">
        <el-input v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]"
                  :placeholder="item.title" style="width: 120px" class="filter-item">
          <!-- {{queryParams.requestData[item.field]=''}} -->
        </el-input>
        <el-select v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]"
                   :placeholder="item.title" style="width: 120px" class="filter-item">
          <el-option v-for="item in initSelect[item.field]"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker v-if="item.query && item.queryType==='datetime'" format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]" type="datetime"
                        :placeholder="item.title" style="width: 150" class="filter-item"></el-date-picker>
        <el-date-picker v-if="item.query && item.queryType==='date'" format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss" v-model="queryParams.requestData[item.field]" type="date"
                        :placeholder="item.title" style="width: 150" class="filter-item"></el-date-picker>
      </div>
      <el-button type="primary" class="filter-item" @click="query()">
        {{ $t("common.btn.query") }}
      </el-button>
      <el-button type="info" class="filter-item" @click="reset">
        {{ $t("common.btn.reset") }}
      </el-button>
      <el-button type="warning" class="filter-item" v-ele-show="{btnCode:'SEND_BTN'}" @click="send">
        {{ '发送' }}
      </el-button>
      <!--<el-button type="warning" class="filter-item" @click="add">
        {{ $t("common.btn.add") }}
      </el-button>-->
    </div>
    <el-table v-loading="listLoading" :data="list" border fit
              highlight-current-row style="width: 100%" @row-dblclick="showDetails" :row-class-name="tableRowStyleSet">

      <el-table-column min-width="50px" label="序号" align="center">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
      <el-table-column v-for="(item) in cols" :key="item.id" :label="item.title" :prop="item.field" :width="item.width"
                       :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{commonFilter(row[item.field],item.field)}}
        </template>
        <!-- <template v-else-if="!item.fliter || typeof item.fliter === undefined " slot-scope="{row}">{{ row[item.field] }}</template> -->
      </el-table-column>
      <el-table-column align="center" fixed="right" width="100">
        <template slot="header" slot-scope="scope">
          <i style="margin-left: 10px;cursor:pointer;" class="el-icon-bank-card" @click="selectFields"></i>
        </template>
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="dtsData(scope.row)">
            {{ $t("common.btn.detail") }}
          </el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column align="left" label="操作"  width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" v-ele-show="{btnCode:'SEND_BTN'}"  @click="send(scope.row)">
            {{ '发送' }}
          </el-button>
          &nbsp;
          <el-button type="warning" v-ele-show="{btnCode:'DEL_DEVICE_INFO'}" size="small" icon="el-icon-edit" @click="del(scope.$index,scope.row)">
            {{ $t("common.btn.delete") }}
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>
    <el-dialog title="编辑" v-el-drag-dialog :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="80px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item v-if="item.set && item.queryType==='input'" :label="item.title" :prop="item.field"
                        :rules="[{ required: true, message: item.title+'不能为空', trigger: 'blur' }]">
            <el-input v-model="defaultForm.params[item.field]"/>
          </el-form-item>
          <el-form-item v-if="item.set && item.queryType==='select'" :label="item.title">
            <el-select v-model="defaultForm.params[item.field]" @change="$forceUpdate()" placeholder="请选择">
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
        <el-button @click="destory(false)"> {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.id==='' || defaultForm.params.id===null"
                   @click="save('defaultForm.params')"> {{ $t("common.btn.save") }}
        </el-button>
        <el-button type="primary" v-if="defaultForm.params.id!='' && defaultForm.params.id!=null"
                   @click="submit('defaultForm.params')"> {{ $t("common.btn.submit") }}
        </el-button>
      </div>
    </el-dialog>

    <!--列显示呈现 -》所用组件 -->
    <ColTableInit ref="ColTableInit" :cols="cols" :table_mark="table_mark"/>

    <el-drawer
      title="叠盘(子托)详细信息"
      :visible.sync="selectDrawer"
      :direction="direction"
      size="70%"
      :before-close="handleClose">
      <el-row style="margin-left: 20px">
        <el-button v-for="(item) in trayCodeList" v-html="item" @click="selectDataClick(item)" />
      </el-row>


      <el-table  height="500px" v-loading="listSelectLoading" :data="selectDataByTrayCode" border fit highlight-current-row style="width: 95%;margin-left: 20px;margin-top: 20px" @row-dblclick="showDetails">
        <el-table-column width="50px"  label="序号" align="center">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column sortable :fixed="item.fixed" v-for="(item) in selectCols" :key="item.id" :label="item.title" :prop="item.field" :width="item.width" :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip>
          <template slot-scope="{row}">
            {{commonFilter(row[item.field],item.field)}}
          </template>
        </el-table-column>
      </el-table>

    </el-drawer>


  </div>

</template>

<script>
  import request_proxy from '@/utils/request_proxy'
  import common from '@/utils/common'
  import waves from "@/directive/waves"; // waves directive
  import elDragDialog from "@/directive/el-drag-dialog";
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import i18n from '@/lang';
  // 列显示呈现 -》 加载组件
  import ColTableInit from '../../common/ColTableInit.vue';

  export default {
    name: 'CellList',
    components: {Pagination, ColTableInit},
    directives: {waves, elDragDialog},
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
        table_mark: "STACKED_DISK",
        dialogFormVisible: false,
        /**分档相关*/
        selectDrawer: false,
        listSelectLoading: false,
        direction: 'rtl',
        trayCodeList: [],
        selectDataByTrayCode: [],
        cellBarCodeList: '',
        packId: '',

        queryParams: {
          requestData: {}
        },
        initSelect: {
          dispatchState: [],
          boxState: [],
          lineId: [],
          cellState: [],
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
          {field: 'deviceNo', title: '设备编号', width: 150, align: "center", query: false, queryType: 'select', set: true},
          {field: 'trayCode', title: '托盘(子托)', width: 150, align: "center", query: true, queryType: 'input', set: true},
          {field: 'grage', title: '等级', minWidth: 150, align: "center", query: false, queryType: 'input', set: true},
          {field: 'boxCode', title: '托盘(母托)', width: 145, align: "center", query: true, queryType: 'input', set: true},
          {field: 'station', title: '站点', width: 200, align: "center", query: false, queryType: 'input', set: true},
          {field: 'trayQty', title: '托盘数量', align: 'center', width: 200},
          {field: 'cellQty', title: '电芯数量', align: 'center', width: 200},
          {field: 'boxState', title: '箱体状态', align: 'center', width: 200},
          {
            field: 'dispatchState',
            title: '分发状态',
            align: 'center',
            width: 200,
            query: true,
            queryType: 'select',
            set: true
          },
          {field: 'uploadTime', title: '上传时间', align: 'center', width: 200},
          // { field: 'udf1', title: 'udf1', align: 'center', width: 200 },
          { field: 'udf2', title: '电芯条码', align: 'center', width: 200 },
          {field: 'udf3', title: 'Mes返回异常', align: 'center', width: 200},
          // { field: 'udf4', title: 'udf4', align: 'center', width: 200 },
        ],

        selectCols: [
          { field: 'cellBarCode', title: '电芯条码', width: 220, align: "center", query: false, queryType: 'input', fixed:'left'},
          { field: 'trayNo', title: '托盘号', align: 'center', width: 200  , query: false, queryType: 'input' },
          { field: 'cellState', title: '电芯状态', width: 150, align: "center"},
          //  { field: 'Grade', title: '等级', align: 'center', width: 200 },
          { field: 'remark', title: '等级名称', align: 'center', width: 200 },
          { field: 'lineId', title: '线体', width: 145, align: "center" },
          { field: 'cellType', title: '电芯型号', width: 200, align: "center"},
          { field: 'processCode', title: '流程编码', align: 'center', width: 200 },
          { field: 'selectThick1', title: '厚度', align: 'center', width: 200 },
          { field: 'selectThick2', title: '电压', align: 'center', width: 200 },
          { field: 'selectWeight1', title: '内阻', align: 'center', width: 200 },
          { field: 'selectWeight2', title: 'K值', align: 'center', width: 200 },
          { field: 'value9', title: '容量下限', align: 'center', width: 200 },
          { field: 'value13', title: '容量', align: 'center', width: 200 },
          { field: 'value10', title: '容量上限', align: 'center', width: 200 },
          { field: 'value5', title: 'DCIR', align: 'center', width: 200 },
          { field: 'value6', title: '包膜后重', align: 'center', width: 200 },
          { field: 'channelNo', title: '通道号', align: 'center', width: 200 },
          { field: 'inStation', title: '入站时间', align: 'center', width: 200 },
          { field: 'outStation', title: '出站时间', align: 'center', width: 200 },
          { field: 'createTime', title: '创建时间', align: 'center', width: 200 },
          { field: 'deviceCode', title: '设备号', align: 'center', width: 200 },
          { field: 'value1', title: '内阻下限', align: 'center', width: 200 },
          { field: 'value2', title: '内阻上限', align: 'center', width: 200 },
          { field: 'value3', title: '电压下限', align: 'center', width: 200 },
          { field: 'value4', title: '电压上限', align: 'center', width: 200 },
          { field: 'value7', title: 'K值下限', align: 'center', width: 200 },
          { field: 'value8', title: 'K值上限', align: 'center', width: 200 },
          { field: 'value15', title: '厚度上下限', align: 'center', width: 200 },
          { field: 'value11', title: 'DCIR下限', align: 'center', width: 200 },
          { field: 'value12', title: 'DCIR上限', align: 'center', width: 200 },
          { field: 'value14', title: '生产班次', align: 'center', width: 200 },
          // { field: 'errorCode', title: '错误代码', align: 'center', width: 200 },
        ],

      }
      Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
      return _initdata
    },

    created() {
      this.getList()
      this.selectOptions()
    },
    mounted() {
      // 列显示呈现 -》 初始化显示字段
      this.initSaveCols();
    },
    methods: {
      dtsData(row) {
        let trayCodeList = row.trayCode.split(';')
        this.trayCodeList = trayCodeList
        this.selectDataByTrayCode = []
        this.cellBarCodeList = row.udf2
        // this.packId = row.id
        if(trayCodeList.length > 0){
          this.selectDataClick(trayCodeList[0])
        }
        this.selectDrawer = true
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      },

      selectDataClick(trayCode){
        let _this = this
        let json = {
          "requestData": {trayNo:trayCode,errorCode:_this.packId},
          "current": 1,
          "pageSize": 100
        }
        this.listSelectLoading = true
        Object.assign(this.queryParams, this.listQuery)
        const _data = { url: '/selectinfo/list', params: json }
        this.$store.dispatch('fmsCommon/actionFmsPost', _data)
          .then(data => {
            let selectList = data.data
            this.selectDataByTrayCode = selectList
            this.listSelectLoading = false
          }).catch(err => {
          console.error(err)
        })

      },

      /******************************/
      send() {
        request_proxy({
          url: common.fmsPath('/fmsToMesPack/guest/pack'),
          method: 'get',
          params: {}
        }).then(res => {
          console.log(res)
          if (res.status === 200) {
            this.$message({
              message: '发送成功!',
              type: 'success'
            })
          }
        })

      },
      tableRowStyleSet({row, rowIndex}) {
        if (row.dispatchState === 1) {
          return 'warning-row'
        }
        return ''
      },
      // 列显示呈现 -》 更新显示字段
      initSaveCols() {
        this.$refs.ColTableInit.initCols();
        this.getList()
      },
      // 列显示呈现 -》 点击显示选择框
      selectFields() {
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
        const _data = {url: '/selectpackingbox/list', params: this.queryParams}
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
        this.initSelect.dispatchState = [
          {label: 'ToMes等待', value: 1},
          {label: '完成', value: 2},
          {label: 'ToDb等待', value: 3},
          {label: '取消', value: 4},
        ];
        this.initSelect.boxState = [
          {label: '占用', value: 1},
          {label: '解除', value: 2},
        ];

      },
    }
  }
</script>

<style lang="less" scoped>


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

  ::v-deep .hover-row {
    &:hover {
      /* background-color: #6495ED !important; */
      color: #000;
    }

  }

  ::v-deep .current-row {
    td {
      /* background: #6495ED !important; */
      color: #000;
    }

  }

</style>
<style>
  .el-table--scrollable-x .el-table__body-wrapper {
    　　z-index: 1;
  }

  .el-table .warning-row {
    background: lightcoral;
    color: #fff;
  }

  .el-table .success-row {
    background: #f0f9eb;
    color: #fff;
  }

</style>
