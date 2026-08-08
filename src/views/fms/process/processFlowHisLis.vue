/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: 工艺管理 - 历史工艺
*/ 
<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="app-container">
        <el-form :inline="true" class="demo-form-inline" :model="data" :class="fromClass">
          <el-form-item>
            <el-input v-model="data.flowCode" placeholder="请输入流程编码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="data.flowName" placeholder="请输入流程名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="data.flowVersion" placeholder="请输入版本号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="data.useState" placeholder="是否启用">
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="tableData"
          border
          v-loading="listLoading"
          size="mini"
          style="width: 100%">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            fixed='left'
            width="50"> 
            <template slot-scope="scope">
              <span>{{ (currentPage-1) * pageSize + (scope.$index + 1)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="flowCode"
            label="流程编码"
            align="center"
            width="200">
          </el-table-column>
          <el-table-column
            prop="flowVersion"
            align="center"
            label="版本号">
          </el-table-column>
          <el-table-column
            prop="flowName"
            label="流程名称">
          </el-table-column>
          <el-table-column
            prop="cellType"
            label="电芯型号">
          </el-table-column>
          <!-- <el-table-column
            prop="createTime"
            align="center"
            label="创建日期"
            width="150">
          </el-table-column> -->
          <el-table-column
            prop="lastModifyTime"
            align="center"
            label="修改日期"
            width="150">
          </el-table-column>
          <el-table-column
            prop="lastModifyUser"
            width="150"
            align="center"
            label="修改人">
          </el-table-column>
          <el-table-column
            prop="changeType"
            align="center"
            :formatter="changeTypeFormatter"
            label="变更状态">
          </el-table-column>
          <el-table-column
            prop="status"
            align="center"
            :formatter="statusFormatter"
            label="状态">
          </el-table-column>
          <el-table-column
            prop="flowType"
            align="center"
            :formatter="flowTypeFormatter"
            label="流程类型">
          </el-table-column>
          <el-table-column
            prop="useState"
            align="center"
            :formatter="useStateFormatter"
            label="使用状态">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="150"
            align="center">
            <template slot-scope="scope" id="buttonDiv">
              <el-button @click="processFlowDts(scope.row)" type="primary" size="small">参数</el-button>
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
        <el-drawer
          title="编辑流程"
          :visible.sync="flowVisible"
          direction="ltr"
          size="70%"
          :before-close="handleClose">
          <div style="width: 100%; height: 700px;display:flex;">
            <div class="processLeftClass1">
              <el-tree
                :data="processData"
                node-key="id"
                default-expand-all
                highlight-current
                @node-click="handClick"
                >
                <!-- draggable -->
              </el-tree>
            </div>
            <div style="width: 100%;height: 90%;overflow:auto;">  
              <component :is="variable" :isFlowDts="true" ref="mychild" @handleRules="handleRules" :ProcessAddSelect="ProcessAddSelect"></component>
            </div>
          </div>
        </el-drawer>
      </div>

    </div>
  </div>
</template>
<script>
  import {getProcessFlowInfo, getApproveStateInfo, getProcessFlowDtsInfo} from '@/api/process';
  import common from '@/utils/common';
  import chargeModel from '@/components/paramsTemplate/chargeModel.vue';
  import pointsForModel from '@/components/paramsTemplate/pointsForModel.vue';  //'../model/pointsForModel.vue';
  import standTimeModel from '@/components/paramsTemplate/standTimeModel';  //'../model/standTimeModel.vue';
  import OCV1Model from '@/components/paramsTemplate/OCV1Model'; //'../model/OCV1Model.vue';
  import DCIRModel from '../model/DCIRModel.vue';
  import SelectModel from '../model/SelectModel.vue';
  import injectingLiquidModel from '../model/injectingLiquidModel';
  import IROCVModel from '@/components/paramsTemplate/IROCVModel.vue';  //'../model/IROCVModel.vue';
  import envelope from '../model/envelope';
  import postHeliumTest from '../model/postHeliumTest';
  import weld from '../model/weld';

  export default {
    data() {
      return {
        ProcessAddSelect: [],
        flowTypeOption: [],
        variable: '',
        processData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        data: {
          flowCode: '',
          flowName: '',
          useState: '',
          flowVersion: '',
        },
        menu: 'menu-dialog-height',
        flowVisible: false,
        listLoading: true,
        statusArray: [],
        tableData: [],
        pageClass: 'pageClass',
        pageSize: 15,
        pageSizeS: [15, 30, 45, 200],
        total: 1000,
        currentPage: 1,
        fromClass: 'fromClass'
      }
    },
    components: {
      chargeModel,
      pointsForModel,
      OCV1Model,
      DCIRModel,
      SelectModel,
      standTimeModel,
      injectingLiquidModel,
      envelope,
      postHeliumTest,
      IROCVModel,
      weld
    },
    created() {
      this.flowTypeData();
      this.initStatus()
      let json = {'current': 1, 'pageSize': 15}
      this.initList(json)
    },
    methods: {
      initProcessAddSelect() {
      const _data = { url: "/process/getall", params: {} };
      this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((data) => {
        if (data.length > 0) {
          this.ProcessAddSelect = data;
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
      handleClose(done) {
        this.$confirm(this.$t('common.btn.sureClose'))
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      handleRules() {
        this.flowVisible = false;
        let json = {'current': 1, 'pageSize': 15, requestData: {}}
        this.initList(json)
      },
      initList(json) {
        this.listLoading = true;
        const _data = {url: '/process-flow-his/list', params: json}
        this.$store.dispatch('fmsCommon/actionFmsPost', _data).then((response => {
          this.tableData = response.data
          this.total = response.total
          this.listLoading = false;
        }))
      },
      initStatus() {
        getApproveStateInfo('{}').then((response => {
          this.statusArray = response
        }))
      },
      useStateFormatter(row, column, cellValue, index) {
        return cellValue == '1' ? '启用' : '禁用'
      },
      changeTypeFormatter(row, column, cellValue, index) {
        if (cellValue === 0) {
          return '正常'
        }
        if (cellValue === 1) {
          return '参数变更中'
        }
        if (cellValue === 2) {
          return '流程变更中'
        }
        if (cellValue === 3) {
          return '流程删除'
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
        let json = {'current': curr, 'pageSize': this.pageSize, requestData: this.data}
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
            flowVersion: this.data.flowVersion,
          }
        }
        this.initList(json)
      },
      reset() {
        this.data.flowCode = ''
        this.data.flowName = ''
        this.data.useState = ''
        this.data.flowVersion = ''
      },
      handClick(draggingNode, dropNode, dropType, ev) {
        if (draggingNode.template == null || draggingNode.template.length < 1) {
          this.variable = draggingNode.template;
          this.$message({
            message: '当前工艺无需设置参数！',
            type: 'warning'
          });
          return false;
        }
        this.variable = draggingNode.template;
        let mychildThis = this;
        setTimeout(() => {
          mychildThis.$refs.mychild.dataUpdate(draggingNode, '/process-dts-his/guest/get-dts', 3)
        }, 1)
      },
      processFlowDts(row) {
        this.initProcessAddSelect();
        this.variable = '';
        this.processData = []
        let jsonData = {}
        jsonData['id'] = row.id
        jsonData['label'] = row.flowName
        jsonData['template'] = row.template
        jsonData['children'] = []
        let json = {'data': row.id}
        const _data = {url: '/process-flow-dts-his/guest/get-dts', params: json}
        this.$store.dispatch('fmsCommon/actionFmsPost', _data).then((response => {
          let data = response
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
        this.flowVisible = true
      }
    }
  }
</script>

<style scoped>
  .menu-dialog-height {
    height: 100%;
  }

  .pageClass {
    margin-top: 10px;
  }

  .fromClass {
    margin-top: 20px;
  }

  .processLeftClass1 {
    width: 20%;
    margin-top: 10px;
    height: 500px;
    border: #e6e6e6 solid 1px;
    float: left;
    position: relative;
    margin-left: 2px;
  }
</style>

<style lang='less'>
.processLeftClass1 {
    .el-tree--highlight-current .el-tree-node.is-current >  .el-tree-node__content {
        background-color: rgba(135, 206, 235, 0.2); 
        color: #409eff; 
        font-weight: bold;
      }
  }
</style>