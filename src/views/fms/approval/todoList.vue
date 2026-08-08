/*
 * @CreatAuthor: 徐高鹏
 * @UpdateAuthor: 宋丹峰
 * @Description: 工艺管理 - 审批待办
*/ 
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline" :class="fromClass">
        <el-form-item>
          <el-input v-model="data.flowCode" placeholder="请输入流程编码" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="data.flowName" placeholder="请输入流程名称" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="data.status">
            <el-option
              v-for="item in approvalStateOption"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%">

        <el-table-column min-width="50px" label="序号" align="center">
          <template slot-scope="scope">
            <span>{{ (currentPage-1) * pageSize + (scope.$index + 1)}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column  v-for="item in cols" :key="item.id" :label="item.title" :prop="item.field" v-if="!item.hide"  :width="item.width" :align="item.align"  show-overflow-tooltip> </el-table-column> -->
        <el-table-column
          v-for="(item) in cols"
          v-if="!item.hide"
          :key="item.id"
          :label="item.title"
          :prop="item.field"
          :width="item.width"
          :min-width="item.minWidth"
          :align="item.align"
          :formatter="item.template == undefined ? function(row, column, cellValue, index) {
            return cellValue;
          } : item.template"
          show-overflow-tooltip
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="250"
          align="center"
        >
          <template id="buttonDiv" slot-scope="scope">
            <el-button type="primary" size="small" @click="processFlowDts(scope.row)" :disabled="scope.row.status == 7 ? false:true">审批</el-button>
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
        :total="total"
        @current-change="currentChange"
        @size-change="sizeChange"
      />
      <el-dialog
        title="编辑流程"
        :visible.sync="flowVisible"
        v-el-drag-dialog
        width="80%"
        :class="menu"
      >
        <el-col :span="24">
          <el-form :inline="true" class="demo-form-inline" :class="fromClass">
            <el-form-item label="审批人">
              <el-select v-model="approvalJson.data.status" placeholder="审批人">
                <el-option
                  v-for="item in approval"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitApproval">提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- <ProcessFlowChart
          :flowCodeData="flowCodeData"
          :btnNum="btnNum"
          :processAddList="processAddList"
          :processType="'approveWait'"
          :key="modelKey"
        /> -->
        <div style="width: 100%; height: 600px;overflow:auto">
          <div :class="processLeftClass">
            <el-tree
              :data="processData"
              highlight-current
              node-key="id"
              default-expand-all
              draggable
              @node-click="handClick"
            />
          </div>
          <div style="width: 73%;float: left;">
            <component :is="variable" ref="mychild"  :isFlowDts="true" @handleRules="handleRules" :ProcessAddSelect="processNameSelect"/>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import { getApproveStateInfo } from '@/api/process'   // getProcessFlowInfo, getProcessFlowDtsInfo
  // import common from '@/utils/common'
  import chargeModel from '@/components/paramsTemplate/chargeModel.vue'  // '../model/chargeModel.vue'
  import pointsForModel from '@/components/paramsTemplate/pointsForModel.vue' //'../model/pointsForModel.vue'
  import standTimeModel from '@/components/paramsTemplate/standTimeModel';  //'../model/standTimeModel.vue'
  import OCV1Model from '@/components/paramsTemplate/OCV1Model'; //import OCV1Model from '../model/OCV1Model.vue'
  import DCIRModel from '../model/DCIRModel.vue'
  import SelectModel from '../model/SelectModel.vue'
  import injectingLiquidModel from '../model/injectingLiquidModel';
  import IROCVModel from '@/components/paramsTemplate/IROCVModel.vue'  //'../model/IROCVModel.vue'
  import envelope from '../model/envelope';
  import postHeliumTest from '../model/postHeliumTest';
  import weld from '../model/weld';
  // import ProcessFlowChart from '@/components/flowChartTemplate/processFlowChart'
  import elDragDialog from '@/directive/el-drag-dialog';

  export default {
    name: 'ProcessFlowList',
    components: {
      chargeModel,
      pointsForModel,
      OCV1Model,
      DCIRModel,
      SelectModel,
      standTimeModel,
      IROCVModel,
      injectingLiquidModel,
      envelope,
      postHeliumTest,
      weld
      // ProcessFlowChart
    },
    directives: { elDragDialog },
    data() {
      return {
        processNameSelect: [],
        processAddList: [],
        btnNum:3,
        modelKey: false,
        flowCodeData: '',
        variable: '',
        processData: [],
        listLoading: true,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        data: {
          flowCode: '',
          flowName: '',
          userId: '',
          status: 7
        },
        approvalStateOption: [
          { name: '待审批', value: 7 },
          { name: '退回', value: 4 },
          { name: '完结', value: 2 },
          { name: '同意', value: 6 }
        ],
        approvalJson: {
          data: {
            bizId: '',
            flowId: '',
            status: 6
          }
        },
        editRow: [],
        approval: [
          { name: '同意', value: 6 },
          { name: '驳回', value: 4 }
        ],
        menu: 'menu-dialog-height',
        processLeftClass: 'processLeftClass',
        flowVisible: false,
        statusArray: [],
        tableData: [],
        pageClass: 'pageClass',
        pageSize: 15,
        pageSizeS: [15, 30, 45, 200],
        total: 1000,
        currentPage: 1,
        fromClass: 'fromClass',
        cols: [
          { field: 'id', title: 'id', hide: true, minWidth: 100, align: 'center' },
          { field: 'flowName', title: '流程名称', minWidth: 100, align: 'center' },
          { field: 'flowVersion', title: '流程版本', minWidth: 100, align: 'center' },
          { field: 'productCode', title: '产品编码', minWidth: 100, align: 'center' },
          { field: 'productType', title: '产品型号', minWidth: 100, align: 'center' },
          { field: 'productTypeName', title: '类型名称', minWidth: 100, align: 'center' },
          { field: 'bizName', title: '业务名称', align: 'center' },
          { field: 'createTime', title: '创建日期', align: 'center' },
          { field: 'createUser', title: '创建人', align: 'center' },
          { field: 'status', title: '状态', align: 'center', template: this.statusFormatter },
          { field: 'uri', title: '地址模板', align: 'center' },
          { field: 'bizCode', title: '业务编码', minWidth: 100, align: 'center' },
          { field: 'flowCode', title: '流程编码', minWidth: 100, align: 'center' },
        ]
      }
    },
    created() {
      this.data.userId = sessionStorage.getItem('userInfoArray') && JSON.parse(sessionStorage.getItem('userInfoArray')).userInfo.id
      this.initStatus()
      this.processNameSelectGet()
      const json = { 'current': 1, 'pageSize': 15, requestData: this.data }
      if (this.data.userId) {
          this.initList(json)
      } else {
        this.$message({
          message: '未登录无法查看内容',
          type: 'error'
        })
      }
      
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
      submitApproval() {
        this.$confirm('确定要' + (this.approvalJson.data.status == 4 ? '驳回' : '通过') + '此流程吗？？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const _data = { url: '/process-flow-tmp/process-flow-approval-sb', params: this.approvalJson }
          this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
              this.$message({
                message: '审批' + (this.approvalJson.data.status == 4 ? '驳回' : '通过') + '成功！',
                type: 'success'
              })
              const json = { 'current': 1, 'pageSize': 15, requestData: this.data }
              this.flowVisible = false
              this.initList(json)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      handleRules() {
        this.flowVisible = false
        const json = { 'current': 1, 'pageSize': 15, requestData: this.data
        }
        this.initList(json)
      },
      initList(json) {
        // let json = {data:{bizId:row.id,changeType:2}};
        this.listLoading = true
        const _data = { url: '/approval-todo/list', params: json }
        this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(response => {
          this.tableData = response.data
          this.total = response.total
          this.listLoading = false
        })
      },
      initStatus() {
        getApproveStateInfo('{}').then(response => {
          this.statusArray = response
        })
      },
      statusFormatter(row, column, cellValue, index) {
        if (cellValue == 7) return '待审批'
        if (cellValue == 4) return '已驳回'
        if (cellValue == 2) return '完结'
        if (cellValue == 6) return '同意'
        return '错误状态'
      },
      currentChange(curr) {
        const json = { 'current': curr, 'pageSize': this.pageSize }
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
        const json = {
          'current': this.currentPage,
          'pageSize': this.pageSize,
          requestData: {
            flowCode: this.data.flowCode,
            flowName: this.data.flowName,
            status: this.data.status,
            userId: this.data.userId
          }
        }
        this.initList(json)
      },
      reset() {
        this.data.flowCode = ''
        this.data.flowName = ''
        this.data.useState = ''
      },
      handClick(draggingNode, dropNode, dropType, ev) {
        if (draggingNode.template == null || draggingNode.template.length < 1) {
          this.variable = draggingNode.template
          this.$message({
            message: '当前工艺无需设置参数！',
            type: 'warning'
          })
          return false
        }
        this.variable = draggingNode.template
        const mychildThis = this
        setTimeout(() => {
          mychildThis.$refs.mychild.dataUpdate(draggingNode, '/process-dts-tmp/guest/get-dts', 3)
        }, 1)
      },
      tt() {
        this.flowVisible = true
        this.modelKey = !this.modelKey;
      },
     async processFlowDts(row) {
        this.approvalJson.data.bizId = row.id
        this.approvalJson.data.flowId = row.sourceId
        this.variable = ''
        this.processData = []
        const jsonTop = { 'data': row.sourceId }
        const _dataTop = { url: '/process-flow-tmp/guest/process-flow-by-id', params: jsonTop }
        await this.$store.dispatch('fmsCommon/actionFmsPost', _dataTop).then(data => {
          const jsonData = {}
          this.flowCodeData = data.flowCode;
          jsonData['id'] = data.id
          jsonData['label'] = data.flowName
          jsonData['template'] = data.template
          jsonData['children'] = []
          const json = { 'data': row.sourceId }
          const _data = { url: '/process-flow-tmp-dts/guest/get-dts', params: json }
          this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(response => {
            const data = response
            this.processAddList = data;
            for (let i = 0; i < data.length; i++) {
              const jsonTemp = {}
              const st = (data[i].status == 2 || data[i].status == null) ? '' : '_[跳站]'
              jsonTemp['id'] = data[i].id
              jsonTemp['label'] = '[工序0' + data[i].flowSort + ']_' + data[i].processCode + '_' + data[i].processName + st
              jsonTemp['template'] = data[i].template
              jsonTemp['processId'] = data[i].processId
              jsonData['children'].push(jsonTemp)
            }
            this.processData.push(jsonData)
          })
         
          
        })
        await this.tt()
        
      }
    }
  }
</script>

<style lang='less' scoped>
  .menu-dialog-height {
    height: 100%;
  }

  .pageClass {
    margin-top: 10px;
  }

  .fromClass {
    margin-top: 10px;
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

<style lang='less'>
.processLeftClass {
    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
        background-color: rgba(135, 206, 235, 0.2); 
        color: #409eff; 
        font-weight: bold;
      }
  }
</style>