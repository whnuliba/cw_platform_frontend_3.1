/*
 * @CreatAuthor: 徐高鹏
 * @UpdateAuthor: 宋丹峰
 * @Description: 工艺管理 - 工艺流程
*/
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline" :class="fromClass">
        <el-form-item>
          <el-input v-model="data.flowCode" :placeholder="commonI18n(cols[0])"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="data.flowName" :placeholder="commonI18n(cols[2])"></el-input>
        </el-form-item>
        <el-form-item>
          <!--<el-input v-model="data.cellType" :placeholder="commonI18n(cols[3])"></el-input>-->
          <el-select  v-model="data.cellType"
                     filterable :placeholder="commonI18n(cols[3])" style="width: 120px" class="filter-item">
            <el-option v-for="item in initSelectAdd.cellTypeId"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="data.useState" :placeholder="this.$t('common.ProcessFlowList.isEnable')">
            <el-option :label="this.$t('common.ProcessFlowList.enable')" value="1"></el-option>
            <el-option :label="this.$t('common.ProcessFlowList.disabled')" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{ $t("common.btn.query") }}</el-button>
          <el-button type="info" @click="reset">{{ $t("common.btn.reset") }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        border
        size="mini"
        v-loading="listLoading"
        style="width: 100%">
        <el-table-column
          label='序号'
          type="index"
          align="center"
          width="50">
          <template slot-scope="scope">
            <span>{{ (currentPage-1) * pageSize + (scope.$index + 1)}}</span>
          </template>
        </el-table-column>
        <el-table-column v-for="(item) in cols" :sortable="true" :key="item.id" :label="commonI18n(item)" :prop="item.field"
                         :width="item.width"
                         :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip
                         :formatter="item.template == undefined ? function(row, column, cellValue, index) {
                           return cellValue;
                         } : item.template">
        </el-table-column>

        <el-table-column
          fixed="right"
          :label="$t('common.ProcessFlowList.operate')"
          width="280"
          align="center">
          <template slot-scope="scope" id="buttonDiv">
            <el-button v-if="scope.row.changeType == 0" @click="processFlowDts(scope.row)" type="primary" size="small">{{ $t("common.ProcessFlowList.parameter") }}</el-button>
            <!--  v-ele-show="{btnCode:'PARAMS_VIEW'}" -->
            <el-button v-if="scope.row.changeType == 0" v-ele-show="{btnCode:'PROCESS_CHANGE_APPLY'}" @click="changeFlow(scope.row)" type="primary" size="small">{{ $t("common.ProcessFlowList.change") }}
            </el-button>
            <el-button v-if="scope.row.changeType == 0" v-ele-show="{btnCode:'PROCESS_COPY_APPLY'}" @click="copyFlow(scope.row)" type="primary" size="small">{{ $t("common.ProcessFlowList.copy") }}
            </el-button>
            <el-button v-if="scope.row.status != 1" v-ele-show="{btnCode:'DEL_PROCESS_FLOW'}" @click="deleteFlow(scope.row)" type="warning" size="small">{{ $t("common.ProcessFlowList.delete") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :class="pageClass"
        layout="prev, pager, next, total, sizes, jumper"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizeS"
        @current-change="currentChange"
        @size-change="sizeChange"
        :total="total">
      </el-pagination>
      <!--  <el-dialog
          title="编辑流程"
          :visible.sync="flowVisible"
          width="80%"
          top="5vh"
          :class="menu"
        >-->
      <el-drawer
        :title="$t('common.ProcessFlowList.editProcess') + '--'+[ rowInfo.flowName ]"
        :visible.sync="flowVisible"
        direction="ltr"
        size="70%"
        >
        <!-- :before-close="handleClose" -->
        <div style="width: 100%; min-height: 85vh;overflow:auto;">
            <ProcessFlowChart
            :flowCodeData="flowCodeData"
            :btnNum="btnNum"
            :processAddList="processAddList"
            :ProcessAddSelect="processNameSelect"
            :processType="'flowList'"
            :rowInfo="rowInfo"
            :key="drawChartKey"
          />
          <!--     // :key="modelKey" -->
          <!-- <div :class="processLeftClass">
            <el-tree
              :data="processData"
              node-key="id"
              default-expand-all
              @node-click="handClick"
              draggable>
            </el-tree>
          </div>
          <div style="width: 70%;float: left;">
            <component :is="variable" ref="mychild" @handleRules="handleRules"
                       style="width: 900px;overflow:auto;"></component>
          </div> -->
        </div>
        <!--  <span slot="footer" class="dialog-footer">
              <el-button @click="flowVisible = false">取 消</el-button>
              <el-button type="primary" @click="flowVisible = false">确 定</el-button>
            </span>-->
        <!--</el-dialog>-->
      </el-drawer>
    </div>
  </div>
</template>
<script>
  import {getProcessFlowInfo, getApproveStateInfo, getProcessFlowDtsInfo} from '@/api/process';
  import common from '@/utils/common';
  import chargeModel from '@/components/paramsTemplate/chargeModel.vue';  //'../model/chargeModel.vue';
  import pointsForModel from '@/components/paramsTemplate/pointsForModel.vue'; //'../model/pointsForModel.vue';
  import standTimeModel from '@/components/paramsTemplate/standTimeModel'; //'../model/standTimeModel.vue';
  import OCV1Model from '@/components/paramsTemplate/OCV1Model.vue';  //'../model/OCV1Model.vue';
  import DCIRModel from '../model/DCIRModel.vue';
  import SelectModel from '../model/SelectModel.vue';
  import injectingLiquidModel from '../model/injectingLiquidModel';
  import IROCVModel from '@/components/paramsTemplate/IROCVModel.vue' //'../model/IROCVModel.vue';
  import envelope from '../model/envelope';
  import postHeliumTest from '../model/postHeliumTest';
  import weld from '../model/weld';
  import ProcessFlowChart from '@/components/flowChartTemplate/processFlowChart'

  export default {
    name: 'processFlowList',
    data() {
      return {
        rowInfo: {},
        drawChartKey: false,
        btnNum: 1,
        flowCodeData:'',
        processNameSelect: [],
        processAddList: [],
        variable: '',
        processData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        initSelectAdd:{cellTypeId:[]},
        cols: [
          {field: 'flowCode', title: '流程编码', minWidth: 100, align: "center"},
          {field: 'flowVersion', title: '版本号', minWidth: 150, align: "center"},
          {field: 'flowName', title: '流程名称', align: 'center'},
          {field: 'cellType', title: '电芯型号', align: 'center'},
          {field: 'createTime', title: '创建日期', minWidth: 145, align: 'center'},
          {field: 'createUser', title: '创建人', align: 'center'},
          {field: 'changeType', title: '变更状态', minWidth: 100, align: 'center',template:this.changeTypeFormatter},
          {field: 'status', title: '状态',  align: 'center',template:this.statusFormatter},
          {field: 'flowType', title: '流程类型', align: 'center',template:this.flowTypeFormatter},
          {field: 'useState', title: '使用状态', align: 'center',template:this.useStateFormatter},
        ],
        data: {
          flowCode: '',
          flowName: '',
          cellType: '',
          useState: ''
        },
        menu: 'menu-dialog-height',
        processLeftClass: 'processLeftClass',
        flowVisible: false,
        statusArray: [],
        tableData: [],
        listLoading: true,
        pageClass: 'pageClass',
        pageSize: 15,
        pageSizeS: [15, 30, 45, 200],
        total: 1000,
        currentPage: 1,
        fromClass: 'fromClass',
        flowTypeOption: [],
      }
    },
    components: {
      chargeModel,
      pointsForModel,
      OCV1Model,
      DCIRModel,
      SelectModel,
      standTimeModel,
      ProcessFlowChart,
      injectingLiquidModel,
      IROCVModel,
      envelope,
      postHeliumTest,
      weld
    },
    created() {
      this.processNameSelectGet()
      this.flowTypeData()
      this.initStatus()
      let json = {'current': 1, 'pageSize': 15}
      this.initList(json)
    },
    methods: {
      processNameSelectGet() {
        const _data = { url: "/process/getall", params: {} };
        this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((data) => {
          if (data.length > 0) {
            this.processNameSelect = data;
          }
        });
    },
      // 流程类型下拉数据
      flowTypeData() {
         const _data = {url: '/sys-params/sys-p-code', params: {data:'PROCESS.FLOW'}}
          this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
            let sysCode = data.map(item => {
              return {
                label: item.paramKey,
                value: item.paramValue
              }
            })
            this.flowTypeOption = sysCode;
          })
      },
      deleteFlow(row) {
        // this.$t('common.ProcessFlowList.deleteProcess')
        this.$confirm(`你确定删除流程 ${row.flowName} 吗?`, this.$t('common.btn.hint'), {
          confirmButtonText: this.$t('common.btn.ok'),
          cancelButtonText: this.$t('common.btn.cancel'),
          type: 'warning'
        }).then(() => {
          let json = {data: {bizId: row.id, changeType: 3}}
          const _data = {url: '/process-flow/process-flow-change-apply', params: json}
          this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
            this.$message({
              message:  this.$t('common.btn.deleteSuccess'),
              type: 'success'
            })
            let json = {'current': 1, 'pageSize': 15,
              requestData: {
                flowCode: this.data.flowCode,
                flowName: this.data.flowName,
                useState: this.data.useState,
                cellType: this.data.cellType
              }}
            this.initList(json)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message:  this.$t('common.btn.Cancelled'),
          })
        })
      },
      handleRules() {
        this.flowVisible = false;
        let json = {'current': 1, 'pageSize': 15}
        this.initList(json)
      },
      changeFlow(row) {this.$t('common.ProcessFlowList.sureChangeThisProcess')
        this.$confirm(`你确定要变更流程 ${row.flowName} 吗?`, this.$t('common.btn.hint'), {
          confirmButtonText: this.$t('common.btn.ok'),
          cancelButtonText: this.$t('common.btn.cancel'),
          type: 'warning'
        }).then(() => {
          let json = {data: {bizId: row.id, changeType: 2}};
          const _data = {url: '/process-flow/process-flow-change-apply', params: json}
          this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
            if (data) {
              this.$message({
                message: this.$t('common.btn.submitSuccess'),
                //
                type: 'success'
              });
              let json = {'current': 1, 'pageSize': 15,
                requestData: {
                  flowCode: this.data.flowCode,
                  flowName: this.data.flowName,
                  useState: this.data.useState,
                  cellType: this.data.cellType
                }}
              this.initList(json)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common.btn.Cancelled'),
          });
        });
      },


      copyFlow(row) {this.$t('common.ProcessFlowList.sureCopyThisProcess')
        this.$confirm(`你确定要复制流程 ${row.flowName} 吗?`, this.$t('common.btn.hint'), {
          confirmButtonText: this.$t('common.btn.ok'),
          cancelButtonText: this.$t('common.btn.cancel'),
          type: 'warning'
        }).then(() => {
            let json = {data: row.id};
            const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          const _data = {url: '/process-flow/process-flow-copy', params: json}
          this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
          
            this.$message({
                message: this.$t('common.btn.submitSuccess'),
                type: 'success'
              });
          }).finally(()=>{
            loading.close();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common.btn.Cancelled'),
          });
        });
      },

      initList(json) {
        this.listLoading = true;
        getProcessFlowInfo(json).then((response => {
          this.tableData = response.data;
          this.total = response.total;
          this.listLoading = false;
        }))
      },
      initStatus() {
        getApproveStateInfo('{}').then((response => {
          this.statusArray = response
        }))

/**初始化型号*/
        let json = {col: "cellType", current: 1, pageSize: 99999, requestData: {cellType: ""}}
        const _dataType = {url: '/cell-type/list', params: json}
        this.$store.dispatch('fmsCommon/actionFmsPost', _dataType)
          .then(data => {
            this.initSelectAdd.cellTypeId = data.data.map(item => {
              item.label = item.cellTypeName + "[" + item.cellType +"]";
              item.value = item.cellType;
              return item;
            });
          }).catch(err => {
          console.error(err)
        })
      },
      useStateFormatter(row, column, cellValue, index) {
        return cellValue == '1'
          ? this.$t('common.ProcessFlowList.enable')
          : this.$t('common.ProcessFlowList.disabled')
      },
      changeTypeFormatter(row, column, cellValue, index) {
        if (cellValue === 0) {
          return this.$t('common.ProcessFlowList.normal')
        }
        if (cellValue === 1) {
          return this.$t('common.ProcessFlowList.parameterChanging')
        }
        if (cellValue === 2) {
          return this.$t('common.ProcessFlowList.processChange')
        }
        if (cellValue === 3) {
          return this.$t('common.ProcessFlowList.processDeletion')
        }
      },
      statusFormatter(row, column, cellValue, index) {
        let a = common.parseValue(this.statusArray, cellValue)
        if (a) return a.name
        return cellValue
      },
      flowTypeFormatter(row, column, cellValue, index) {
        for(let i=0;i<this.flowTypeOption.length;i++) {
              let item = this.flowTypeOption[i];
              if (cellValue == item.value) {
                return item.label
              }
        }
      },
      currentChange(curr) {
        let json = {'current': curr, 'pageSize': this.pageSize}
        this.currentPage = curr
        this.initList(json)
      },
      sizeChange(size) {
        this.pageSize = size
        this.currentPage = 1
        this.currentChange(this.currentPage)
      },
      onSubmit() {
        this.currentPage = 1
        let json = {
          'current': this.currentPage,
          'pageSize': this.pageSize,
          requestData: {
            flowCode: this.data.flowCode,
            flowName: this.data.flowName,
            useState: this.data.useState,
            cellType: this.data.cellType
          }
        }
        this.initList(json)
      },
      reset() {
        this.data.flowCode = ''
        this.data.flowName = ''
        this.data.useState = ''
        this.data.cellType = ''
      },
      handClick(draggingNode, dropNode, dropType, ev) {
        if (draggingNode.template == null || draggingNode.template.length < 1) {
          this.variable = draggingNode.template;
          this.$message({
            message: this.$t('common.ProcessFlowList.noNeedParam'),
            type: 'warning'
          });
          return false;
        }
        this.variable = draggingNode.template;
        let mychildThis = this;
        setTimeout(() => {
          mychildThis.$refs.mychild.dataUpdate(draggingNode, '/process-dts/guest/get-dts', 1)
        }, 1)
      },
      allowDrop(draggingNode, dropNode, type) {
        if (dropNode.data.label === '二级 3-1') {
          return type !== 'inner'
        } else {
          return true
        }
      },
      allowDrag(draggingNode) {
        return draggingNode.data.label.indexOf('三级 3-2-2') === -1
      },
      handleClose(done) {
        this.$confirm(this.$t('common.btn.sureClose'))
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      },
      tt() {
          this.flowVisible = true;
          this.drawChartKey = !this.drawChartKey;
      },
      async processFlowDts(row) {
        this.variable = '';
        this.processData = []
        this.flowCodeData = row.flowCode
        let jsonData = {}
        jsonData['id'] = row.id
        jsonData['label'] = row.flowName
        jsonData['template'] = row.template
        jsonData['children'] = []
        let json = {'data': row.id}
        await getProcessFlowDtsInfo(json).then((response => {
          let data = response
          this.processAddList = data;
          for (let i = 0; i < data.length; i++) {
            let jsonTemp = {}
            jsonTemp['id'] = data[i].id
            const st = (data[i].status == 2 || data[i].status == null) ? '' : '_[跳站]'
            jsonTemp['label'] = '[工序0' + data[i].flowSort + ']_' + data[i].processCode + '_' + data[i].processName + st
            jsonTemp['template'] = data[i].template
            jsonTemp['processId'] = data[i].processId
            jsonTemp['processName'] = data[i].processName
            jsonData['children'].push(jsonTemp)
          }
          this.processData.push(jsonData)
        }))
        this.rowInfo = row;
        await this.tt();
      }
    }
  }
</script>

<style lang="less" scoped>

  .pageClass {
    margin-top: 10px;
  }

  .fromClass {
    margin-top: 20px;
  }

  /deep/ .el-drawer.rtl {
    background: #CCC;
  }

  .processLeftClass {
    width: 20%;
    margin-top: 10px;
    height: 500px;
    border: #e6e6e6 solid 1px;
    float: left;
    position: relative;
    margin-left: 2px;
  }
</style>
