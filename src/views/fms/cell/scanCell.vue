<template>

  <div class="app-container">
    <div class="filter-container">

      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="电芯条码">
          <el-input v-model="cellBarCodeTop"  @keyup.enter.native="keyClick()" @input="inputClick" :placeholder="commonI18n(cols[0])"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="cellBarCode" :placeholder="commonI18n(cols[2])"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="reset">{{ $t("common.btn.reset") }}</el-button>
        </el-form-item>
      </el-form>
      <el-col :span="24">
        <el-col :span="12" style="border: 1px solid #000;height: 700px;padding: 10px">
          <el-table
            :data="tableData"
            key="colsLeftTable"
            border
            size="mini"
            style="width: 100%">
            <!--  <el-table-column
                type="index"
                align="center"
                width="50">
              </el-table-column>-->
            <el-table-column v-for="(item) in cols" :sortable="true" :key="item.id" :label="commonI18n(item)"
                             :prop="item.field"
                             :width="item.width"
                             :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip
                             :formatter="item.template == undefined ? function(row, column, cellValue, index) {
                           return cellValue;
                         } : item.template">
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <el-col :span="24" style="padding-left: 20px;">
            <el-table
              :data="colsRightTopData"
              border
              key="colsRightTopTable"
              style="width: 100%">
                <el-table-column
                  type="index"
                  align="center"
                  width="50">
                </el-table-column>
              <el-table-column v-for="(item) in colsRightTop" :sortable="true" :key="item.id" :label="commonI18n(item)"
                               :prop="item.field"
                               :width="item.width"
                               :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip
                               :formatter="item.template == undefined ? function(row, column, cellValue, index) {
                           return cellValue;
                         } : item.template">
              </el-table-column>
            </el-table>
          </el-col>

          <el-col :span="24" style="padding-left: 20px;margin-top: 20px">
            <el-table
              :data="colsRightBottomData"
              border
              key="colsRightTopTable"
              style="width: 100%">
              <el-table-column
                type="index"
                align="center"
                width="50">
              </el-table-column>
              <el-table-column v-for="(item) in colsRightBottom" :sortable="true" :key="item.id" :label="commonI18n(item)"
                               :prop="item.field"
                               :width="item.width"
                               :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip
                               :formatter="item.template == undefined ? function(row, column, cellValue, index) {
                           return cellValue;
                         } : item.template">
              </el-table-column>
            </el-table>
          </el-col>

        </el-col>
      </el-col>

    </div>
  </div>
</template>

<script>
  import {getProcessInfo} from '@/api/process'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  export default {
    name: 'scanCell',
    components: {Pagination},
    data() {
      return {
        cellBarCodeTop: '',
        cellBarCode: '',
        tableData: [],
        colsRightTopData:[],
        colsRightBottomData:[],
        cells:[],
        cols: [
          {field: 'cellBarCode', title: '条码', minWidth: 100, align: "center"},
          {field: 'cellState', title: '状态', minWidth: 150, align: "center"},
          {field: 'processName', title: '工序', align: 'center'},
          {field: 'remark', title: '原因', align: 'center'},
        ],
        colsRightTop: [
          {field: 'id', title: 'id', hide: true, minWidth: 100, align: "center"},
          {field: 'cellBarCode', title: '电芯条码', minWidth: 220, align: "center"},
          {field: 'processName', title: '当前工序', minWidth: 150, align: 'center'},
          {field: 'cellState', title: '电芯状态', hide: true, align: 'center'},
          {field: 'cellStateName', width: 200, title: '电芯状态', align: 'center'},
          {field: 'errorCode', title: '异常码', minWidth: 120, align: 'center'},
          {field: 'remark', title: '原因', minWidth: 150, align: 'left'},
          {field: 'firstInjectWeight', title: '一注前重', minWidth: 180, align: 'right'},
          {field: 'secondInjectWeight', title: '二注后重', minWidth: 180, align: 'right'},
          {field: 'ocv1', title: 'ocv1', width: 100, align: 'right'},
          {field: 'ir1', title: 'ir1', width: 80, align: 'right'},
          {field: 'ocv2', title: 'ocv2', width: 100, align: 'right'},
          {field: 'ir2', title: 'ir2', width: 80, align: 'right'},
          {field: 'k1', title: 'K值', width: 120, align: 'right'},
          {field: 'ocv3', title: 'ocv3', width: 100, align: 'right'},
          {field: 'ir3', title: 'ir3', width: 80, align: 'right'},
          {field: 'dcr1', title: 'dcr1', width: 100, align: 'right'},
          {field: 'dcrOcv1', title: 'dcrOcv1', width: 100, align: 'right'},
          {field: 'capacity', title: '容量', width: 150, align: 'right'},
          {field: 'stopProcessName', minWidth: 180, title: '拦截工序', align: 'center'},
          {field: 'reason', title: '拦截原因', minWidth: 100, align: 'center'}
        ],
        colsRightBottom: [
          { field: 'cellBarCode', title: '电芯条码', minWidth: 200, align: "center" },
          { field: 'processCode',hide:true, title: '工序编码',align: 'center' },
          { field: 'processName', minWidth: 180, title: '工序',align: 'center' },
          { field: 'inStation', title: '入站时间',minWidth: 150, align: 'center' },
          { field: 'outStation', title: '出站时间',minWidth: 150, align: 'center' },
          { field: 'cellState',hide:true, title: '电芯状态', align: 'center' },
          { field: 'cellStateName', title: '状态',minWidth: 150, align: 'center' },
          { field: 'name1', title: '名称',minWidth: 100, align: 'center' },
          { field: 'value1', title: '值',minWidth: 100, align: 'center' },
          { field: 'name2', title: '名称',minWidth: 100, align: 'center' },
          { field: 'value2', title: '值',minWidth: 100, align: 'center' },
        ]
      }
    },
    created() {
      // this.initLeftData();
      // this.initRightData();
    },
    methods: {
      keyClick(){
        this.cells = [];
        this.cellBarCode = this.cellBarCodeTop;
        this.cellBarCodeTop = '';
        this.initLeftData();
        this.initRightData();
      },
      inputClick(){
        if(this.cellBarCodeTop.length == 24){
          this.cells = [];
          this.cellBarCode = this.cellBarCodeTop;
          this.cellBarCodeTop = '';
          this.initLeftData();
          this.initRightData();
        }
      },
      initLeftData() {
        let json = {
            current: 1,
            data: this.cellBarCode,
            pageSize: 100
        }
        const _data = {url: '/cell/guest/scan_cell_prop', params: json}
        this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
          if(data == null){
            this.$message.error("当前查询电芯数据不存在！")
            return ;
          }
          if(data != null && !this.containsCellBarCode(this.tableData,data.cellBarCode)){
            this.tableData.unshift(data);
          }
          this.colsRightTopData = [data];
        })
      },
      // MWMTEST0500000018
      initRightData() {
        let json = {
            current: 1,
            data: this.cellBarCode,
            pageSize: 100
        }
        const _data = {url: '/cell/guest/scan_process_list', params: json}
        this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
          this.colsRightBottomData = data;
        })
      },

      containsCellBarCode(cell,obj) {
        let i = cell.length;
        while (i--) {
          if (cell[i].cellBarCode === obj) {
            return true;
          }
        }
        return false;
      },

      reset() {
        this.cellBarCode = '';
      }
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

</style>
