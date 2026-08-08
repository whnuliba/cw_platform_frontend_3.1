/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: 工艺管理 - 工艺编辑
*/ 
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline" :class="fromClass">
        <el-form-item>
          <el-input v-model="data.flowCode" :placeholder="commonI18n(cols[0])"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="data.flowName" :placeholder="commonI18n(cols[3])"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="data.useState" :placeholder="$t('common.processFlowTmpList.isEnable')">
            <el-option :label="$t('common.processFlowTmpList.enable')" value="1"></el-option>
            <el-option :label="$t('common.processFlowTmpList.disabled')" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{ $t("common.btn.query") }}</el-button>
          <el-button type="info" @click="reset">{{ $t("common.btn.reset") }}</el-button>
          <el-button type="warning" @click="newFlow">{{ $t("common.btn.add") }}</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="tableData"
        border
        size="mini"
        v-loading="listLoading"
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          fixed="left"
          width="50">
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
          :label="$t('common.processFlowTmpList.operate')"
          width="350"
          align="left">
          <template slot-scope="scope" id="buttonDiv">
            <el-button  @click="processFlowDts(scope.row,1)" type="primary" size="small" v-ele-show="{btnCode: 'CONFIG_FLOW_DTS'}">{{ $t("common.processFlowTmpList.configure") }}</el-button>
            <el-button v-if="scope.row.status != 1 && scope.row.changeType != 1 && scope.row.changeType != 3"
                       @click="processFlow(scope.row,2)" type="primary" size="small">{{ $t("common.processFlowTmpList.process") }}
            </el-button>
            <el-button v-if="scope.row.status==0 || scope.row.status==4 || scope.row.status==8 "
                       @click="processConfigure(scope.row)" type="primary" size="small">{{ $t("common.processFlowTmpList.edit") }}
            </el-button>
             <el-button v-if="scope.row.status == 0|| (!scope.row.changeType && scope.row.status == 4)" @click="deleteFlow(scope.row)"
                       type="warning" size="small">{{ $t("common.processFlowTmpList.delete") }}
            </el-button>
            <!--  || scope.row.status == 4 -->
            <el-button v-if="scope.row.status == 8 || (scope.row.changeType && scope.row.status == 4)" 
            @click="cancelFlow(scope.row)" type="primary" size="small">{{ $t("common.processFlowTmpList.cancel") }}
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

      <!--配置模态-->
      <el-drawer
        :title="$t('common.processFlowTmpList.editProcess')"
        :visible.sync="flowVisible"
        direction="ltr"
        size="80%"
        :before-close="handleClose">
        <el-col :span="24">
          <el-form :inline="true" class="demo-form-inline" v-if="isApproval" :class="fromClass">
            <el-form-item label="审批人">
              <el-select v-model="approvalJson.data.userId" placeholder="审批人">
                <el-option
                  v-for="item in approval"
                  :key="item.id"
                  :label="item.realName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitApproval">提交审批</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <div style="width: 100%; height:75vh;display:flex;overflow:auto">
          <div :class="processLeftClass">
            <el-tree
              :data="processData"
              node-key="id"
              default-expand-all
              highlight-current
              @node-click="handClick"
            >
            </el-tree>
          </div>
          <div style="width: 75%;">
            <component :is="variable" :isFlowDts="isFormDisabled ? true : false"  ref="mychild" @initOldDraggingNode="initOldDraggingNode" :isShowSubmit="paramsBtn" :ProcessAddSelect="ProcessAddSelect"/>
          </div>
        </div>
      </el-drawer>

      <!--流程编辑模态-->
      <!--  + $t('common.processFlowTmpList.processAdd') -->
      <el-dialog
        :title="rowInfo.flowName"
        :visible.sync="processAddVisible"
        v-el-drag-dialog
        width="86%"
        min-height='85vh'
        top="5vh"
        :class="menu"
        :before-close="modelBeforeClose"
        >
        <ProcessFlowChart
          ref="flowChart"
          :rowInfo="rowInfo"
          :ProcessAddSelect="ProcessAddSelect"
          :nodeCodeArr="nodeCodeArr"
          :tableDefineData="tableDefineData"
          :approval="approval"
          :processAddList="processAddList"
          :approvalJson="approvalJson"
          :isApproval="isApproval"
          :key="modalReFresh"
          :flowTypeOption="flowTypeOption"
          :userStateOption="userStateOption"
          :cellTypeOption="cellTypeOption"
          :tableData="tableData"
          @initList="initList"
          @initProcessAddTable="initProcessAddTable"
          @modelClose="modelClose"
          @modelFlowDrawOpen="modelFlowDrawOpen"
        />
        <!-- <el-col :span="24">
          <el-form :inline="true" class="demo-form-inline" :class="fromClass">
            <el-form-item   :label="$t('common.processFlowTmpList.processCode')">
              <el-input disabled v-model="processAddParam.processCode"></el-input>
            </el-form-item>
            <el-form-item   :label="$t('common.processFlowTmpList.processName')">
              <el-input disabled v-model="processAddParam.processName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="processAddParam.processId">
                <el-option
                  v-for="item in ProcessAddSelect"
                  :key="item.id"
                  :label="item.processName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="processAddRequest">{{ $t("common.btn.add") }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <div style="width: 100%" class="tableDts">
          <el-table
            :data="processAddList"
            border
            :row-key="getRowKey"
            size="mini"
            style="width: 100%">
            <el-table-column
              type="index"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column v-for="(item) in colsDts" :sortable="true" :key="item.id" :label="commonI18n(item)" :prop="item.field"
                             :width="item.width"
                             :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip
                             :formatter="item.template == undefined ? function(row, column, cellValue, index) {
                           return cellValue;
                         } : item.template">
            </el-table-column>

            <el-table-column
              prop="status"
              align="center"
              :label="commonI18n(colsDts[5])" >
              <template slot-scope="scope">
                <el-checkbox :true-label="1" :false-label="2" v-model="scope.row.status"
                             @change="isJumpStation(scope.row)"></el-checkbox>
              </template>
            </el-table-column>

            <el-table-column
              fixed="right"
              :label="$t('common.processFlowTmpList.operate')"
              width="280"
              align="center">
              <template slot-scope="scope">
                <el-button type="danger" size="small" @click="flowTempDel(scope.row)">{{ $t("common.btn.delete") }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div> -->
      </el-dialog>

      <!--添加工艺编辑-->
      <div>
        <el-dialog
          :title="$t('common.processFlowTmpList.'+cTitle)"
          :visible.sync="ConfigureVisible"
          v-el-drag-dialog
          width="700px"
          :class="menu">
          <div style="width: 100%; height: 350px;overflow:auto;">
            <el-form :inline="true" :label-position="labelPosition" label-width="100px" :model="flowRow"
            >
                <el-form-item  :label="commonI18n(cols[0])">
                  <el-input :disabled="flowCodeReadonly" suffix-icon="xxxx"  v-model="flowRow.flowCode" :placeholder="commonI18n(cols[0])"></el-input>
                </el-form-item>  
                <el-form-item  :label="commonI18n(cols[2])">
                  <el-input suffix-icon="xxxx" v-model="flowRow.flowName" :placeholder="commonI18n(cols[2])"></el-input>
                </el-form-item>
             
                <el-form-item  :label="commonI18n(cols[3])">
                  <!--<el-input :readonly="cellTypeReadonly" v-model="flowRow.cellType" placeholder="电芯类型"></el-input>-->
                  <el-select :disabled="cellTypeReadonly" v-model="flowRow.cellId" :placeholder="commonI18n(cols[3])" style="width:100%">
                    <el-option v-for="item in cellTypeOption" :value="item.id" :label="item.cellTypeName"></el-option>
                  </el-select>
                </el-form-item>
         
                <el-form-item :label="commonI18n(cols[9])">
                  <el-select v-model="flowRow.useState">
                    <el-option v-for="item in userStateOption" :value="item.value" :label="item.label"></el-option>
                  </el-select>
                </el-form-item>
            
                <el-form-item :label="commonI18n(cols[8])">
                  <el-select v-model="flowRow.flowType">
                    <el-option v-for="item in flowTypeOption" :value="item.value" :label="item.label"></el-option>
                  </el-select>
                </el-form-item>
                
              <el-col :span="24" style="text-align: center">
                <el-form-item>
                  <el-button type="primary" @click="nowAdd">{{ $t("common.btn."+cBtn) }}</el-button>
                  <el-button type="primary" @click="resetAdd">{{ $t("common.btn.reset") }}</el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
  import {getProcessFlowInfo, getApproveStateInfo, getProcessFlowDtsInfo, getProcessInfo} from '@/api/process'
  import common from '@/utils/common'
  import chargeModel from '@/components/paramsTemplate/chargeModel.vue';  //'../model/chargeModel.vue';
  import pointsForModel from '@/components/paramsTemplate/pointsForModel.vue';  //'../model/pointsForModel.vue';
  import standTimeModel from '@/components/paramsTemplate/standTimeModel'; //'../model/standTimeModel.vue';
  import OCV1Model from '@/components/paramsTemplate/OCV1Model'; //'../model/OCV1Model.vue';
  import tataChargeModel from '@/components/paramsTemplate/tataChargeModel';
  import tataDCRModel from '@/components/paramsTemplate/tataDCRModel';
  import DCIRModel from '../model/DCIRModel.vue';
  import SelectModel from '../model/SelectModel.vue';
  import injectingLiquidModel from '../model/injectingLiquidModel';
  import IROCVModel from '@/components/paramsTemplate/IROCVModel';  //'../model/IROCVModel';
  import envelope from '../model/envelope';
  import postHeliumTest from '../model/postHeliumTest';
  import weld from '../model/weld';
  // import Sortable from 'sortablejs'
  import elDragDialog from '@/directive/el-drag-dialog';
  import ProcessFlowChart from './components/processFlowChart.vue'

  export default {
  name: "processFlowTmpList",
  directives: { elDragDialog },
  data() {
    return {
      isFormDisabled: true,
      paramsBtn: 0,
      modalReFresh: false,
      rowInfo: {},
      checkedStatus: false,
      flowCodeReadonly: true,
      cellTypeReadonly: true,
      isApproval: true,
      cellTypeOption: [],
      ProcessAddSelect: [],
      nodeCodeArr: [],
      processAddList: [],
      cols: [
        { field: "flowCode", title: "流程编码", minWidth: 100, align: "center" },
        { field: "flowVersion", title: "版本号", minWidth: 140, align: "center" },
        { field: "flowName", title: "流程名称", minWidth: 100, align: "center" },
        { field: "cellType", title: "电芯型号", minWidth: 100, align: "center" },
        { field: "createTime", title: "创建日期", minWidth: 145, align: "center" },
        { field: "createUser", title: "创建人", align: "center", minWidth: 100 },
        {
          field: "changeType",
          title: "变更状态",
          minWidth: 110,
          align: "center",
          template: this.changeTypeFormatter,
        },
        {
          field: "status",
          title: "状态",
          align: "center",
          template: this.statusFormatter,
        },
        {
          field: "flowType",
          title: "流程类型",
          minWidth: 100,
          align: "center",
          template: this.flowTypeFormatter,
        },
        {
          field: "useState",
          title: "使用状态",
          minWidth: 100,
          align: "center",
          template: this.useStateFormatter,
        },
      ],
      colsDts: [
        { field: "flowSort", title: "流程", width: 100, align: "center" },
        { field: "processCode", title: "流程编码", width: 200, align: "center" },
        { field: "processName", title: "工序名称", width: 150, align: "center" },
        { field: "createUser", title: "创建人", width: 130, align: "center" },
        { field: "createTime", title: "创建时间", align: "center" },
        { field: "jumpStation", title: "跳站", align: "center", hide: true },
        { field: "template", title: "模板", align: "center" },
      ],
      userStateOption: [
        {
          label: this.$t("common.processFlowTmpList.enable"),
          value: 1,
        },
        {
          label: this.$t("common.processFlowTmpList.disabled"),
          value: 0,
        },
      ],
      flowTypeOption: [
        // {
        //   label: this.$t('common.processFlowTmpList.normalProcess'),
        //   value: 0
        // },
        // {
        //   label: this.$t('common.processFlowTmpList.retestProcess'),
        //   value: 1
        // }
      ],
      flowRow: {
        flowCode: "",
        flowName: "",
        cellId: "",
        useState: 1,
        flowType: "",
        id: "",
      },
      approval: [],
      variable: "",
      labelPosition: "right",
      processData: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      data: {
        flowCode: "",
        flowName: "",
        useState: "",
      },
      processAddParam: {
        processId: "",
        processName: "",
        processCode: "",
        flowId: "",
        flowSort: "",
        status: 2,
      },
      menu: "menu-dialog-height",
      oldDraggingNode: [],
      processLeftClass: "processLeftClass2",
      flowVisible: false,
      ConfigureVisible: false,
      processAddVisible: false,
      listLoading: true,
      isEdit: false,
      statusArray: [],
      tableData: [],
      pageClass: "pageClass",
      pageSize: 15,
      pageSizeS: [15, 30, 45, 200],
      total: 1000,
      currentPage: 1,
      fromClass: "fromClass",
      approvalBizCode: "BS0001",
      approvalModel: "processapprovalmodel",
      approvalJson: {
        data: {
          userId: "",
          bizCode: "BS0001",
          model: "processapprovalmodel",
          currentState: "",
          bizId: "",
        },
      },
      tableDefineData: [],
      // JSON数据渲染
      modifyProcessChart: "",
    };
  },
  components: {
    chargeModel,
    tataChargeModel,
    tataDCRModel,
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
    this.flowTypeData();
    this.initStatus();
    this.initCellType();
    this.initApproval();
    let json = { current: 1, pageSize: 15, requestData: {} };
    this.initList(json);
    this.defineInitList();
  },
  mounted() {},
  computed: {
    cTitle() {
      return this.isEdit ? "addCraftEdit" : "editProcess";
    },
    cBtn() {
      return this.isEdit ? "add" : "save";
    },
  },
  methods: {
    // 流程类型下拉数据
    flowTypeData() {
      const _data = { url: "/sys-params/sys-p-code", params: { data: "PROCESS.FLOW" } };
      this.$store.dispatch("fmsCommon/actionAuthPost", _data).then((data) => {
        let sysCode = data.map((item) => {
          return {
            label: item.paramKey,
            value: item.paramValue,
          };
        });
        this.flowTypeOption = sysCode;
      });
    },
    // 判断只剩一个节点不能关弹窗
    tt1() {
      // let currentNodeNum = this.$refs.flowChart.nodeCountChange();
      // if (this.processAddList.length === 1) {
      //   this.$confirm(
      //     "删除操作只剩一个节点时必须删完,保存或修改时必须点击按钮保存两个及以上节点后才能关闭!!!",
      //     this.$t("common.btn.hint"),
      //     {
      //       confirmButtonText: this.$t("common.btn.ok"),
      //       cancelButtonText: this.$t("common.btn.cancel"),
      //       type: "warning",
      //     }
      //   )
      //     .then(() => {})
      //     .catch(() => {});
      //   return;
      // }
      // if (this.processAddList.length === 1 && !this.rowInfo.status) {
      //   this.$confirm('未审批前节点只有一个时必须删完或者保存两个及以上节点才能关闭!!!', this.$t('common.btn.hint'), {
      //                                         confirmButtonText: this.$t('common.btn.ok'),
      //                                         cancelButtonText: this.$t('common.btn.cancel'),
      //                                         type: 'warning'
      //                                     }).then(() => {  }).catch(() => {  })
      //       return;
      // }
      /**  this.initProcessAddTable(0)
            let currentNodeStationInfo = this.$refs.flowChart.nodeArray()
            let currentNodeInfo = [...this.processAddList], isExist = false,dbExistNode = [];
            currentNodeStationInfo.forEach((item,i) => {
                currentNodeInfo.forEach((savedNode,n)=> {
                    if (item.nodeCode && (item.nodeCode.value === savedNode.processCode)) {

                        dbExistNode.push(savedNode.processName)
                            if (item.status&&item.status.value !== savedNode.status) {
                                isExist = true
                                this.$confirm(`已做[跳站/过站]操作，请确定要做跳过站操作吗?`, this.$t('common.btn.hint'), {
                                    confirmButtonText: this.$t('common.btn.ok'),
                                    showCancelButton: true, //是否显示取消按钮
                                    type: 'error'
                                    }).then(() => {
                                              this.$confirm('关闭操作也会保存当前流程,确认修改无误吗?', this.$t('common.btn.hint'), {
                                                confirmButtonText: this.$t('common.btn.ok'),
                                                cancelButtonText: this.$t('common.btn.cancel'),
                                                type: 'warning'
                                            }).then(() => {
                                              this.$refs.flowChart.moveOnFinishWhenClose();
                                              // this.processAddVisible = false;
                                            }).catch(() => {
                                                this.$message({
                                                    type: 'info',
                                                    message: this.$t('common.btn.Cancelled')
                                                    })
                                            })
                                     }).catch(() => {

                              })
                                // ${item.nodeCode.text}
                            }
                    }

                })
            })
            currentNodeStationInfo.forEach(item => {
                    if(item.nodeCode && dbExistNode.indexOf(item.nodeCode.text) < 0 && item.status && item.status.value === 1) {
                        isExist = true;
                        this.$confirm(`已做[跳站/过站]操作，请确定要做跳过站操作吗?`, this.$t('common.btn.hint'), {
                                    confirmButtonText: this.$t('common.btn.ok'),
                                    showCancelButton: true, //是否显示取消按钮
                                    type: 'error'
                              }).then(() => {
                                        this.$confirm('关闭操作也会保存当前流程,确认修改无误吗?', this.$t('common.btn.hint'), {
                                                confirmButtonText: this.$t('common.btn.ok'),
                                                cancelButtonText: this.$t('common.btn.cancel'),
                                                type: 'warning'
                                            }).then(() => {
                                              this.$refs.flowChart.moveOnFinishWhenClose();
                                              // this.processAddVisible = false;
                                            }).catch(() => {
                                                this.$message({
                                                    type: 'info',
                                                    message: this.$t('common.btn.Cancelled')
                                                    })
                                            })
                              }).catch(() => {

                              })
                    }
                })
            if (isExist) {
                return
            } */
      //如有修改请确认已点击修改按钮进行保存操作,再退出!!
      let confirmText = "关闭前请先确认是否图已保存!"; //"关闭操作也会保存流程图,确定当前修改无误吗?";
      // !this.$refs.flowChart.isFlowChartSaved() ? '如已新建流程图请先进行保存,再退出!!' :
      this.$confirm(confirmText, this.$t("common.btn.hint"), {
        confirmButtonText: this.$t("common.btn.ok"),
        cancelButtonText: this.$t("common.btn.cancel"),
        type: "warning",
      })
        .then(() => {
          // this.$refs.flowChart.moveOnFinishWhenClose();
          this.processAddVisible = false;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("common.btn.Cancelled"),
          });
        });
      // this.processAddVisible = false;
    },
    modelBeforeClose() {
      this.initProcessAddTable(1);
    },
    modelFlowDrawOpen() {
      this.processAddVisible = true;
    },
    // 弹窗关闭事件
    modelClose() {
      this.processAddVisible = false;
    },
    defineInitList() {
      let json = { current: 1, pageSize: 100 };
      getProcessInfo(json).then((response) => {
        this.tableDefineData = response.data;
      });
    },
    initOldDraggingNode() {
      setTimeout(() => {
        this.$refs.mychild.dataUpdate(
          this.oldDraggingNode,
          "/process-dts-tmp/guest/get-dts",
          2
        );
      }, 1);
    },
    handleClose(done) {
      // this.$confirm(this.$t('common.btn.sureClose'))
      //   .then(_ => {
      done();
      // })
      // .catch(_ => {
      // });
    },
    // 是否跳站
    // isJumpStation(row, val) {
    //   this.$confirm(this.$t('common.processFlowTmpList.skipProcess'), this.$t('common.btn.hint'), {
    //     confirmButtonText: this.$t('common.btn.ok'),
    //     cancelButtonText: this.$t('common.btn.cancel'),
    //     type: 'warning'
    //   }).then(() => {
    //     let json = {data: {id: row.id, state: row.status == 2 ? 1 : 2, status: row.status}}
    //     const _data = {url: '/process-flow-tmp-dts/flow-skip-process', params: json}
    //     this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
    //       this.$message({
    //         message: this.$t('common.btn.updateSuccess'),
    //         type: 'success'
    //       })
    //       this.initProcessAddTable()
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: this.$t('common.btn.Cancelled')
    //     })
    //     this.initProcessAddTable()
    //   })
    // },
    // flowTempDel(row) {
    //   this.$confirm(this.$t('common.processFlowTmpList.processDtsDel'), this.$t('common.btn.hint'), {
    //     confirmButtonText: this.$t('common.btn.ok'),
    //     cancelButtonText: this.$t('common.btn.cancel'),
    //     type: 'warning'
    //   }).then(() => {
    //     let json = {data: row.id}
    //     const _data = {url: '/process-flow-tmp-dts/del', params: json}
    //     this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
    //       this.$message({
    //         message: this.$t('common.btn.deleteSuccess'),
    //         type: 'success'
    //       })
    //       this.initProcessAddTable()
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: this.$t('common.btn.Cancelled')
    //     })
    //   })
    //   // /process-flow-tmp-dts/del
    // },
    // getRowKey(row) {
    //   return row.id
    // },
    // rowDrop() {
    //   const tbody = document.querySelector('.tableDts .el-table__body-wrapper tbody')
    //   const _this = this
    //   Sortable.create(tbody, {
    //     onEnd({newIndex, oldIndex}) {
    //       const currRow = _this.processAddList.splice(oldIndex, 1)[0]
    //       _this.processAddList.splice(newIndex, 0, currRow)

    //       _this.$confirm(_this.$t('common.processFlowTmpList.addProcessDts'), _this.$t('common.btn.hint'), {
    //         confirmButtonText: _this.$t('common.btn.ok'),
    //         cancelButtonText: _this.$t('common.btn.cancel'),
    //         type: 'warning'
    //       }).then(() => {
    //         for (let i = 0; i < _this.processAddList.length; i++) {
    //           _this.processAddList[i].flowSort = (i + 1);
    //         }
    //         const _data = {url: '/process-flow-tmp-dts/reload-sort', params: {data: _this.processAddList}}
    //         _this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
    //           if (data > 0) {
    //             _this.$message({
    //               type: 'success',
    //               message: _this.$t('common.btn.updateSuccess'),
    //             })
    //             _this.initProcessAddTable()
    //           }
    //         })
    //       }).catch(() => {
    //         _this.$message({
    //           type: 'info',
    //           message: _this.$t('common.btn.Cancelled')
    //         })
    //         _this.initProcessAddTable();
    //       })
    //     }
    //   })
    // },
    processFlow(row, num) {
      // 流程按钮
      this.isApproval = true;
      this.rowInfo = row;
      this.processAddParam.processCode = row.flowCode;
      this.processAddParam.processName = row.flowName;
      this.processAddParam.flowId = row.id;
      this.processFlowDts(row, num);
      this.initProcessAddSelect();
      this.initProcessAddTable(0);
      this.modalReFresh = !this.modalReFresh;
      this.processAddVisible = true;
      /*--------------------------   分隔线  ------------------------------*/
      this.flowRow.flowCode = row.flowCode;
      this.flowRow.flowName = row.flowName;
      this.flowRow.cellId = row.cellId;
      this.flowRow.id = row.id;
      this.flowRow.useState = row.useState;
      this.flowRow.flowType = row.flowType.toString();
      this.flowCodeReadonly = true;
      this.cellTypeReadonly = true;
    },
    // processAddRequest() {
    //   this.$confirm(this.$t('common.processFlowTmpList.addProcessDts'), this.$t('common.btn.hint'), {
    //     confirmButtonText: this.$t('common.btn.ok'),
    //     cancelButtonText: this.$t('common.btn.cancel'),
    //     type: 'warning'
    //   }).then(() => {
    //     const _data = {
    //       url: '/process-flow-tmp-dts/guest/get-max-flowsort',
    //       params: {data: this.processAddParam.flowId}
    //     }
    //     this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
    //       this.processAddParam.flowSort = (data + 1)
    //       const _data = {url: '/process-flow-tmp-dts/add', params: {data: this.processAddParam}}
    //       this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
    //         if (data > 0) {
    //           this.$message({
    //             type: 'success',
    //             message: this.$t('common.btn.addSuccess')
    //           })
    //           this.initProcessAddTable()
    //         }
    //       })
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: this.$t('common.btn.Cancelled')
    //     })
    //   })
    // },
    initProcessAddTable(num) {
      const _data = {
        url: "/process-flow-tmp-dts/guest/get-dts",
        params: { data: this.processAddParam.flowId },
      };
      this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((data) => {
        this.processAddList = data;
        document.body.ondrop = function (event) {
          event.preventDefault();
          event.stopPropagation();
        };
        if (num) {
          this.tt1();
        }
        // this.rowDrop()
      });
    },
    initProcessAddSelect() {
      const _data = { url: "/process/getall", params: {} };
      this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((data) => {
        if (data.length > 0) {
          this.ProcessAddSelect = data;
          this.processAddParam.processId = data[0].id;
          // 获取工艺编码
          this.nodeCodeArr = data.map((item) => {
            return { text: item.processName, value: item.processCode };
          });
        }
      });
    },
    handleRules() {
      this.flowVisible = false;
      let json = { current: 1, pageSize: 15 };
      this.initList(json);
    },
    cancelFlow(row) {
      this.$confirm(
        this.$t("common.processFlowTmpList.cancelUpdateProcess"),
        this.$t("common.btn.hint"),
        {
          confirmButtonText: this.$t("common.btn.ok"),
          cancelButtonText: this.$t("common.btn.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          let json = { data: { flowId: row.id, status: row.status } };
          const _data = {
            url: "/process-flow-tmp/process-flow-tmp-cancel",
            params: json,
          };
          this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((data) => {
            this.$message({
              message: this.$t("common.btn.Cancelled"),
              type: "success",
            });
            let json = { current: 1, pageSize: 15, requestData: {} };
            this.initList(json);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("common.btn.Cancelled"),
          });
        });
    },
    deleteFlow(row) {
      // this.$t('common.processFlowTmpList.processDel')
      this.$confirm(`确定删除工艺 ${row.flowName} 吗? `, this.$t("common.btn.hint"), {
        confirmButtonText: this.$t("common.btn.ok"),
        cancelButtonText: this.$t("common.btn.cancel"),
        type: "warning",
      })
        .then(() => {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let json = { data: row.id };
          const _data = { url: "/process-flow-tmp/del", params: json };
          this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((data) => {
            /**********删除script******/
            let paramChart = {
              data: {
                bizType: "COMM_PR_FLOW_TYPE",
                bizCode: row.flowCode,
              },
            };
            const _data1 = { url: "/page-conf/guest/biz-type-code", params: paramChart };
            this.$store.dispatch("fmsCommon/actionTaskPost", _data1).then((response) => {
              if (response.length) {
                let id = response[0].id;
                const _data2 = { url: "/page-conf/del", params: { data: id } };
                this.$store.dispatch("fmsCommon/actionTaskPost", _data2).then((data) => {
                  this.$message({
                    message: this.$t("common.btn.deleteSuccess"),
                    type: "success",
                  });
                });
              }
            });
            /*************************/
            // this.$message({
            //   message: this.$t('common.btn.deleteSuccess'),
            //   type: 'success'
            // })
            let json = { current: 1, pageSize: 15, requestData: {} };
            this.initList(json);
          }).finally(()=>{
            loading.close();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("common.btn.Cancelled"),
          });
        });
    },
    newFlow() {
      // 表格新增
      this.flowRow = {
        flowCode: "",
        flowName: "",
        cellId: "",
        useState: 1,
        flowType: "",
      };
      this.modifyProcessChart = "add";
      this.isEdit = true;
      this.flowCodeReadonly = false;
      this.cellTypeReadonly = false;
      this.ConfigureVisible = true;
    },
    checkParam() {
      if (this.flowRow.flowCode.length < 1) {
        return this.$t("common.processFlowTmpList.processCodeNotNull");
      }
      if (this.flowRow.flowName.length < 1) {
        return this.$t("common.processFlowTmpList.processNameNotNull");
      }
      if (this.flowRow.cellId.length < 1) {
        return this.$t("common.processFlowTmpList.cellTypeNotNull");
      }
      return null;
    },
    // 表格数据模态增加、修改接口
    nowAdd() {
      if (this.checkParam() != null) {
        this.$message.error(this.checkParam());
        return false;
      }
      let json = {
        data: {
          flowCode: this.flowRow.flowCode,
          flowName: this.flowRow.flowName,
          id: this.flowRow.id,
          useState: this.flowRow.useState,
          flowType: this.flowRow.flowType,
          cellId: this.flowRow.cellId,
          graph: this.modifyProcessChart === "modify" ? this.rowInfo.graph : null,
          // "{ \"class\": \"GraphLinksModel\",\n  \"nodeDataArray\": [],\n  \"linkDataArray\": []}"
        },
      };

      const _data = { url: "/process-flow-tmp/addflow", params: json };
      this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((data) => {
        this.$message({
          message: this.$t("common.btn.submitSuccess"),
          type: "success",
        });
        this.ConfigureVisible = false;
        let json = { current: 1, pageSize: 15, requestData: {} };
        this.initList(json);
      });
    },
    processConfigure(row) {
      this.isEdit = false;
      this.rowInfo = row;
      this.modifyProcessChart = "modify";
      this.ConfigureVisible = true;
      this.flowRow.flowCode = row.flowCode;
      this.flowRow.flowName = row.flowName;
      this.flowRow.cellId = row.cellId;
      this.flowRow.id = row.id;
      this.flowRow.useState = row.useState;
      this.flowRow.flowType = row.flowType.toString();
      this.flowCodeReadonly = true;
      this.cellTypeReadonly = row.status==0?false:true;
    },
    submitApproval() {
      this.$confirm(
        this.$t("common.processFlowTmpList.submitProcess"),
        this.$t("common.btn.hint"),
        {
          confirmButtonText: this.$t("common.btn.ok"),
          cancelButtonText: this.$t("common.btn.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          const _data = {
            url: "/process-flow-tmp/process-flow-appr",
            params: this.approvalJson,
          };
          this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((data) => {
            this.$message({
              message: this.$t("common.btn.submitSuccess"),
              type: "success",
            });
            this.flowVisible = false;
            let json = { current: 1, pageSize: 15, requestData: {} };
            this.initList(json);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("common.btn.Cancelled"),
          });
        });
    },
    initCellType() {
      const _data = { url: "/cell-type/guest/getall", params: {} };
      this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((response) => {
        this.cellTypeOption = response;
      });
    },
    initApproval() {
      let json = { data: this.approvalBizCode };
      const _data = { url: "/approval/guest/approval-getuser", params: json };
      this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((response) => {
        let jsonUser = { data: [] };
        for (let i = 0; i < response.length; i++) {
          jsonUser.data.push(response[i].userId);
        }
        const _data = { url: "/user/get-all-ids", params: jsonUser };
        this.$store.dispatch("fmsCommon/actionAuthPost", _data).then((response) => {
          this.approval = response;
          if (response.length > 0) {
            this.approvalJson.data.userId = response[0].id;
          }
        });
      });
    },
    changeFlow(row) {
      this.$confirm(
        this.$t("common.processFlowTmpList.sureChangeThisProcess"),
        this.$t("common.btn.hint"),
        {
          confirmButtonText: this.$t("common.btn.ok"),
          cancelButtonText: this.$t("common.btn.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          let json = { data: { bizId: row.id, changeType: 2 } };
          const _data = { url: "/process-flow/process-flow-change-apply", params: json };
          this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((data) => {
            if (data === "访问成功") {
              this.$message({
                message: this.$t("common.btn.submitSuccess"),
                type: "success",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("common.btn.Cancelled"),
          });
        });
    },
    initList(json) {
      this.listLoading = true;
      const _data = { url: "/process-flow-tmp/list", params: json };
      this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((response) => {
        this.tableData = response.data;
        this.total = response.total;
        this.listLoading = false;
        // console.log(this.tableData)
      });
    },
    initStatus() {
      getApproveStateInfo("{}").then((response) => {
        this.statusArray = response;
      });
    },
    useStateFormatter(row, column, cellValue, index) {
      return cellValue == "1"
        ? this.$t("common.processFlowTmpList.enable")
        : this.$t("common.processFlowTmpList.disabled");
    },
    changeTypeFormatter(row, column, cellValue, index) {
      if (cellValue === 0) {
        return this.$t("common.processFlowTmpList.normal");
      }
      if (cellValue === 1) {
        return this.$t("common.processFlowTmpList.parameterChanging");
      }
      if (cellValue === 2) {
        return this.$t("common.processFlowTmpList.processChange");
      }
      if (cellValue === 3) {
        return this.$t("common.processFlowTmpList.processDeletion");
      }
    },
    statusFormatter(row, column, cellValue, index) {
      let a = common.parseValue(this.statusArray, cellValue);
      if (a) return a.name;
      return cellValue;
    },
    flowTypeFormatter(row, column, cellValue, index) {
      let tbText = cellValue;
      this.flowTypeOption.forEach((item) => {
        if (cellValue.toString() === item.value) {
          tbText = item.label;
        }
      });
      return tbText;
      // if (cellValue == '0') return this.$t('common.processFlowTmpList.normalProcess')
      // if (cellValue == '1') return this.$t('common.processFlowTmpList.retestProcess')
    },
    currentChange(curr) {
      let json = { current: curr, pageSize: this.pageSize };
      this.currentPage = curr;
      this.initList(json);
    },
    sizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
      this.currentChange(this.currentPage);
    },
    onSubmit() {
      this.currentPage = 1;
      let json = {
        current: this.currentPage,
        pageSize: this.pageSize,
        requestData: {
          flowCode: this.data.flowCode,
          flowName: this.data.flowName,
          useState: this.data.useState,
        },
      };
      this.initList(json);
    },
    reset() {
      this.data.flowCode = "";
      this.data.flowName = "";
      this.data.useState = "";
    },
    resetAdd() {
      for (let item in this.flowRow) {
        this.flowRow[item] = "";
      }
    },
    handClick(draggingNode, dropNode, dropType, ev) {
      if (draggingNode.template == null || draggingNode.template.length < 1) {
        this.variable = draggingNode.template;
        this.$message({
          message: this.$t("common.processFlowTmpList.noNeedParam"),
          type: "warning",
        });
        return false;
      }
      this.variable = draggingNode.template;
      let mychildThis = this;
      this.oldDraggingNode = draggingNode;
      setTimeout(() => {
        mychildThis.$refs.mychild.dataUpdate(
          draggingNode,
          "/process-dts-tmp/guest/get-dts",
          2
        );
      }, 1);
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === "二级 3-1") {
        return type !== "inner";
      } else {
        return true;
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf("三级 3-2-2") === -1;
    },
    processFlowDts(row, num) {
      this.initProcessAddSelect();
      // 配置按钮
      if (row.status == 1) {
        //debugger
        this.isApproval = false;
      } else {
        this.isApproval = true;
      }
      if (row.status != 1) {
        this.isFormDisabled = false;
      } else {
        this.isFormDisabled = true;
      }
      this.paramsBtn = row.status;
      this.approvalJson.data.bizId = row.id;
      this.approvalJson.data.currentState = row.status;
      this.variable = "";
      this.processData = [];
      let jsonData = {};
      jsonData["id"] = row.id;
      jsonData["label"] = row.flowName;
      jsonData["template"] = row.template;
      jsonData["children"] = [];
      this.initApproval();
      let json = { data: row.id };
      const _data = { url: "/process-flow-tmp-dts/guest/get-dts", params: json };
      this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((response) => {
        let data = response;
        for (let i = 0; i < data.length; i++) {
          // [工序01]_G7003_负压化成
          let jsonTemp = {};
          jsonTemp["id"] = data[i].id;
          const st = data[i].status == 2 || data[i].status == null ? "" : "_[跳站]";
          jsonTemp["label"] =
            "[工序0" +
            data[i].flowSort +
            "]_" +
            data[i].processCode +
            "_" +
            data[i].processName +
            st;
          jsonTemp["template"] = data[i].template;
          jsonTemp["processId"] = data[i].processId;
          jsonTemp["processName"] = data[i].processName;
          jsonTemp["flowId"] = data[i].flowId;
          jsonData["children"].push(jsonTemp);
        }
        this.processData.push(jsonData);
      });
      if (num === 1) {
        this.flowVisible = true;
      }
    },
  },
};
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

  .processLeftClass2 {
    width: 22%;
    margin-top: 10px;
    height: 500px;
    border: #e6e6e6 solid 1px;
    /* float: left;
    position: relative; */
    /* margin-left: 2px; */
  }
</style>

<style lang='less'>
.processLeftClass2 {
    .el-tree--highlight-current .el-tree-node.is-current >  .el-tree-node__content {
        background-color: rgba(135, 206, 235, 0.2); 
        color: #409eff; 
        font-weight: bold;
      }
  }
</style>
