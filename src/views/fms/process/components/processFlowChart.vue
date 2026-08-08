/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: 工艺管理 - 工艺流程图编辑模块
*/
<template>
    <div class="flow-approch">
        <!-- <img v-show="imgUpload" :src="imgUpload" alt="" style="display:block;width:100px;height:100px"> -->
        <div style="display:flex;justify-content:center;margin-bottom:5px;">
            <el-button id="SaveButton" class="el-btn" type="primary" @click="save" v-if="false">保存</el-button>
            <!-- isShowSaveBtn -->
            <div v-if='isApproval' style="display:flex;">
                <div class="approve-sel">
                    <el-select v-model="userId" placeholder="请选择审批人">
                        <el-option
                        v-for="item in approval"
                        :key="item.id"
                        :label="item.realName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <el-button id="approveBtn" class="el-btn" type="primary" @click="approveSubmit">提交审批</el-button>
            </div>
            <el-button type="primary" class="el-btn" style="margin-left:0" @click="modifyChart" v-if="true">修改</el-button>
            <!-- isShowModify -->
            <!-- <img :src="imgUpload" style="display:block;height:200px;width:200px;">
            <div class="uploadImg" ref="uploadImg">
                <input
                type="file"
                @change="nativeChange"
                multiple
                name="file"
                accept=".jpg, .jpeg, .png, .JPG, .JPEG, .PNG, .bmp, .BMP"
                ref="fileInput"
                id="uploadImg"
                >
            </div>
             <el-upload
                class="upload-demo"
                ref="uploadFile"
                action="#"
                accept=".jpg,.jpeg,.png"
                :http-request="dataUpload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :before-upload="beforeUpload"
                :show-file-list="false"
                multiple
                :on-exceed="handleExceed"
                :on-change="loadJsonFromFile"
                :file-list="fileList">
                :limit="5"
                <el-button class="el-btn" size="middle" type="primary">上传</el-button>
            </el-upload>
            <el-button class="el-btn" @click="picGet">获取模板</el-button>-->
        </div>

        <div id="flow-chart-area1" :style="{overflowY:'scroll'}">
           <div class="palette-div" :style="{height: windowHeight}">
             <!--左侧手风琴面板  -->
            <div>
                <el-collapse v-model="activeName" accordion>
                  <el-collapse-item v-for="(item,n) in collapseItems" :key="'node'+n" :title="item.title" :name="item.name">
                      <template slot="title">
                          <i class="header-icon el-icon-s-unfold"></i> {{item.title}}
                          <!-- 基础模版 myPaletteBase-->
                      </template>
                      <div class="collapse-div" :id="item.nodeChooseDivRef" :ref="item.nodeChooseDivRef" ></div>
                  </el-collapse-item>
                  <!-- <el-collapse-item title="设备模板" name="2">
                      <template slot="title">
                          <i class="header-icon el-icon-s-platform"></i> 设备模板
                      </template>
                      <div ref="parentDiv">
                          <div class="collapse-div" ref="myPaletteDev"></div>
                      </div>
                  </el-collapse-item> -->
                  <!-- <el-collapse-item title="模板3" name="3">
                      <template slot="title">
                          <i class="header-icon el-icon-s-operation"></i> 模板3
                      </template>
                      <div class="collapse-div"></div>
                  </el-collapse-item>
                  <el-collapse-item title="模板4" name="4">
                      <template slot="title">
                          <i class="header-icon el-icon-s-promotion"></i> 模板4
                      </template>
                      <div class="collapse-div"></div>
                  </el-collapse-item> -->
                </el-collapse>
            </div>
            <!-- 中间流程图部分 -->
            <div id="myDiagramDiv" ref="myDiagramDiv"></div>

            <!-- 节点属性调整区域(右侧节点信息表) -->
            <div id="node-set" :style="{verticalAlign: 'top', width:'18%'}">
                <div id='myInspector' class='inspector' style='height: 597px'>
                    <!--  v-show="isNodeInfo" -->
                        <table  style="width: 100%">
                            <tbody>
                                <tr>
                                    <td  style="text-align: center;width: 100%">
                                        <div className="nodeInfo" style="text-align: center;width: 100%">
                                          {{ '节点信息(当前为未选中状态)' }}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                    </table>
                </div>
            </div>

            <!-- 节点右键面板 -->
            <ul id="contextMenu" ref="contextMenu" class="menu" :style="{top: rightTop,left: rightLeft}">
                <!-- <li id="task-info" class="menu-item" @click="cxcommand">任务信息</li> -->
                <!-- <li id="condition-node" class="menu-item" @click="cxcommand">条件节点</li> -->
                <li id="dele-node" class="menu-item" @click="cxcommand">删除</li>
                <!-- <li id="jump-node" class="menu-item" @click="cxcommand">是否跳站</li>   -->
            </ul>
           </div>
            <!-- 双击弹窗 -->
            <el-dialog
                v-el-drag-dialog
                title="提示"
                :visible.sync="dialogVisible"
                append-to-body
                width="70%"
                custom-class="param-dialog"
                :before-close="modelChartBeforeClose"
            >
                <component @dialogSubmit="dialogSubmit" :is="variable" :isFlowDts="false" ref="mychild"  @handleRules="handleRules" 
                :ProcessAddSelect="ProcessAddSelect"/>
            </el-dialog>
            <!-- 保存按钮弹窗 -->
            <NodeInfoModal
                ref="nodeInfoModal"
                :modalTitle="modalTitle"
                :isForm="true"
                :firColumns="allflowColumns"
                :modalAppendToBody="false"
                :modalTemp="modalTemp"
                :parentLabel="parentLabel"
                @moveOnFinish="moveOnFinish"
            />
        <!-- 流程编辑弹窗的修改保存弹窗 -->
        <el-dialog
            title="流程修改"
            :visible.sync="flowVisible"
            :append-to-body="true"
            v-el-drag-dialog
            customClass="modify-chart"
        >
          <div style="width: 100%; overflow:auto;">
            <el-form :inline="true" label-position="right" label-width="100px" :model="flowRow">
                <el-form-item  :label="'流程编码'">
                  <el-input :disabled="true" suffix-icon="xxxx" v-model="flowRow.flowCode" ></el-input>
                </el-form-item>
                <el-form-item  :label="'流程名称'">
                  <el-input suffix-icon="xxxx" :disabled="true" v-model="flowRow.flowName" ></el-input>
                </el-form-item>

                <el-form-item  :label="'电芯型号'">
                  <!--<el-input :readonly="cellTypeReadonly" v-model="flowRow.cellType" placeholder="电芯类型"></el-input>-->
                  <el-select :disabled="true" v-model="flowRow.cellId" style="width:100%">
                    <el-option v-for="item in cellTypeOption" :value="item.id" :label="item.cellTypeName"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item :label="'使用状态'">
                  <el-select v-model="flowRow.useState" :disabled="true">
                    <el-option v-for="item in userStateOption" :value="item.value" :label="item.label"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item :label="'流程类型'">
                  <el-select v-model="flowRow.flowType" :disabled="true">
                    <el-option v-for="item in flowTypeOption" :value="item.value" :label="item.label"></el-option>
                  </el-select>
                </el-form-item>

              <el-col :span="24" style="text-align: center">
                <el-form-item>
                  <el-button type="primary" @click="moveOnFinish">{{ $t("common.btn.save") }}</el-button>
                  <!-- <el-button type="primary" @click="resetAdd">{{ $t("common.btn.reset") }}</el-button> -->
                </el-form-item>
              </el-col>
            </el-form>
          </div>
        </el-dialog>
        </div>
    </div>

  </template>
  <script>

    import { Inspector } from './Inspector/DataInspector';   // gojs节点控制外部文件
    //import switchPic from '@/assets/technology_process/switchPic.png';
    //import cabiNet from '@/assets/technology_process/cabinet.png';
    //import ysj from '@/assets/technology_process/kyj.png';
    //import PBA2 from '@/assets/technology_process/PBA2.png';
    //import PBA10 from '@/assets/technology_process/PBA10.png';
    import NodeInfoModal from '@/components/modal/index.vue';
    import BasicTemplate from '@/components/paramsTemplate/basicTemplate';
    import chargeModel from '@/components/paramsTemplate/chargeModel';
    import tataChargeModel from '@/components/paramsTemplate/tataChargeModel';
    import tataDCRModel from '@/components/paramsTemplate/tataDCRModel';
    import pointsForModel from '@/components/paramsTemplate/pointsForModel';
    import standTimeModel from '@/components/paramsTemplate/standTimeModel';
    import SelectModel from '@/components/paramsTemplate/SelectModel';
    import OCV1Model from '@/components/paramsTemplate/OCV1Model';
    import DCIRModel from '@/components/paramsTemplate/DCIRModel';
    import injectingLiquidModel from '@/components/paramsTemplate/injectingLiquidModel';
    import IROCVModel from '@/components/paramsTemplate/IROCVModel'
    import envelope from '@/components/paramsTemplate/envelope';
    import postHeliumTest from '@/components/paramsTemplate/postHeliumTest';
    import weld from '@/components/paramsTemplate/weld';
    import elDragDialog from '@/directive/el-drag-dialog';
    import Table from '@/components/TableCommon/index';
    const goBase = go.GraphObject.make;

    export default {
  name: "processFlowChart",
  directives: { elDragDialog },
  props: {
    rowInfo: Object,
    ProcessAddSelect: Array,
    nodeCodeArr: Array,
    tableDefineData: Array,
    approval: Array,
    processAddList: Array,
    isApproval: Boolean,
    approvalJson: Object,
    flowChartRendring: String,
    flowTypeOption: Array,
    userStateOption: Array,
    cellTypeOption: Array,
    tableData: Array,
  },
  data() {
    return {
      collapseItems: [
        {title:"基础模板",name:"1",nodeChooseDivRef:"myPaletteBase"},
        // {title:"设备模板",name:"2",nodeChooseDivRef:"myPaletteDev"},
      ],
      savedNodeKey:[],
      selectModelElement: null,
      nodeContextclick: false,
      nodeSelectNum: [],
      flowVisible: false,
      flowRow: {
        flowCode: "",
        flowName: "",
        cellId: "",
        useState: 1,
        flowType: "",
        id: "",
      },
      nodeCount: 0,
      linkNum: 0,
      userId: "",
      isShowModify: false,
      isShowSaveBtn: true,
      chartData: {},
      isJumpStation: [
        { text: "跳站", value: 1 },
        { text: "过站", value: 2 },
      ],
      componentData: [
        "SelectModel",
        "OCV1Model",
        "DCIRModel",
        "standTimeModel",
        "pointsForModel",
        "chargeModel",
        "injectingLiquidModel",
        "envelope",
        "IROCVModel",
        "postHeliumTest",
        "weld",
        "tataChargeModel",
        "tataDCRModel",
      ],

      dialogVisible: false,
      variable: "",
      myDiagramEntity: null,
      myPaletteDev: null,
      myPalette: null,
      activeName: "1",
      windowHeight: 0,
      rightTop: 0,
      rightLeft: 0,
      divShow: "none",
      nodeData: "",
      //修改保存界面属性
      modalTitle: "",
      allflowColumns: [
        { field: "流程编码", key: "pageCode", label: "流程编码" }, // 每个编码必须不一样
        { field: "流程名称", key: "pageName", label: "流程名称" },
      ],

      //修改保存界面属性数据
      modalTemp: {
        bizType: "",
        bizName: "",
        pageCode: "",
        pageName: "",
      },
      modalCustomTemp: {
        param1: "",
        param2: "",
      },
      parentLabel: {
        first: "",
        second: "",
      },
      picArr: [
        // {pic:switchPic, category:'pic'},
        // {pic:cabiNet, category:'cabinet'},
        // {pic:ysj, category:'ysj'},
        // {pic:PBA2, category:'PBA2'},
        // {pic:PBA10, category:'PBA10'},
      ],
      devArr: [
        { category: "pic" },
        { category: "cabinet" },
        { category: "ysj" },
        { category: "PBA2" },
        { category: "PBA10" },
      ],
      newPic: [],
      newDev: [],
      fileList: [],
      fileData: {},
      imgUpload: "",
      imgKey: 0,
      oldJson: "",
      preDelLinks: [],
      nectDelLinks: [],
      inspectorFunc: Function,
      nodeCodeValue: [],
    };
  },
  components: {
    NodeInfoModal,
    Table,
    BasicTemplate,
    SelectModel,
    OCV1Model,
    DCIRModel,
    standTimeModel,
    IROCVModel,
    pointsForModel,
    chargeModel,
    injectingLiquidModel,
    envelope,
    postHeliumTest,
    weld,
    tataChargeModel,
    tataDCRModel,
  },
  watch: {
      tableData: {
        handler: function (newVal, oldVal) {
          if (newVal !== oldVal) {
              newVal.forEach(item => {
                if (item.id === this.rowInfo.id) {
                    // 节点的键值
                    this.savedNodeKey =  JSON.parse(item.graph).nodeDataArray.map(it => {
                        return it.key  
                    })
                    // 节点的工步编码
                    this.nodeCodeValue =  JSON.parse(item.graph).nodeDataArray.map(it => {
                        return it.nodeCode.value
                    })
                }
              })
          }
        },
        deep: true,
        immediate: true
      }
  },
  created() {
    this.windowHeight = window.innerHeight - 170 + "px";
  },
  mounted() {
    this.chartInit();
    //this.load(this.rowInfo.flowCode);
    this.load(this.rowInfo);
    document.addEventListener("keydown",this.moveOnFinishByKeyboard);
  },
  beforeDestroy() {
    document.removeEventListener("keydown",this.moveOnFinishByKeyboard);
  },
  methods: {
    moveOnFinishByKeyboard(e) {  // 按住CTRL+S按钮的触发方法
        let key = window.event.keyCode ?  window.event.keyCode : window.event.which;
        if (key === 83 && e.ctrlKey) {
            this.moveOnFinish();
            e.preventDefault();
        }
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
    //<!-- 流程图json保存 -->
    chartJsonSave(node, isModifyBtn) {
      let json = {
        data: {
          flowCode: this.rowInfo.flowCode,
          flowName: this.rowInfo.flowName,
          id: this.rowInfo.id,
          useState: this.rowInfo.useState,
          flowType: this.rowInfo.flowType,
          cellId: this.rowInfo.cellId,
          graph: this.myDiagramEntity.model.toJson(),
        },
      };
      const _data = { url: "/process-flow-tmp/addflow", params: json };
      this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((data) => {
        this.$emit("initProcessAddTable", 0);
        if (!node.nodeDataArray.length) {
          this.$message({
            message: this.$t("common.btn.submitSuccess"),
            type: "success",
          });
          if (isModifyBtn) {
            this.$emit("modelClose");
          }
        }

        this.flowVisible = false;
        this.$emit("initList", { current: 1, pageSize: 15, requestData: {} });
      });
    },
    nodeArray() {
      let NodeInfo = JSON.parse(this.myDiagramEntity.model.toJson()).nodeDataArray;
      return NodeInfo;
    },

    // 参数弹窗关闭前确认提示框
    modelChartBeforeClose() {
      this.$confirm(this.$t("common.btn.sureClose"), this.$t("common.btn.hint"), {
        confirmButtonText: this.$t("common.btn.ok"),
        cancelButtonText: this.$t("common.btn.cancel"),
        type: "warning",
      })
        .then(() => {
          this.dialogVisible = false;
        })
        .catch(() => {});
    },
    approveSubmit() {
      // 审批确认按钮
      this.$emit("initProcessAddTable", 0);
      let currentNodeStationInfo = JSON.parse(this.myDiagramEntity.model.toJson())
        .nodeDataArray;
      let currentNodeInfo = [...this.processAddList],
        isExist = false,
        dbExistNode = [];
      currentNodeStationInfo.forEach((item, i) => {
        currentNodeInfo.forEach((savedNode, n) => {
          if (item.nodeCode && item.nodeCode.value === savedNode.processCode) {
            dbExistNode.push(savedNode.processName);
            if (item.status && item.status.value !== savedNode.status) {
              isExist = true;
              this.$confirm(
                `已做[跳站/过站]操作，请先点击修改，再提交审批!`,
                this.$t("common.btn.hint"),
                {
                  confirmButtonText: this.$t("common.btn.ok"),
                  showCancelButton: false, //是否显示取消按钮
                  type: "error",
                }
              ).then(() => {});
              // ${item.nodeCode.text}
            }
          }
        });
      });
      currentNodeStationInfo.forEach((item) => {
        if (
          item.nodeCode &&
          dbExistNode.indexOf(item.nodeCode.text) < 0 &&
          item.status &&
          item.status.value === 1
        ) {
          isExist = true;
          this.$confirm(
            `已做[跳站/过站]操作，请先点击修改，再提交申请!`,
            this.$t("common.btn.hint"),
            {
              confirmButtonText: this.$t("common.btn.ok"),
              showCancelButton: false, //是否显示取消按钮
              type: "error",
            }
          ).then(() => {});
        }
      });
      if (isExist) {
        return;
      }

      if (!this.userId) {
        this.$message({
          type: "warning",
          message: "请先选择审批人！",
        });
        return;
      }

      this.$confirm(
        this.$t("common.processFlowTmpList.submitProcess") + "(确定前请确保流程已保存！)",
        this.$t("common.btn.hint"),
        {
          confirmButtonText: this.$t("common.btn.ok"),
          cancelButtonText: this.$t("common.btn.cancel"),
          type: "warning",
        }
      )
        .then(() => {
          let param = { data: { ...this.approvalJson.data, userId: this.userId } };
          const _data = { url: "/process-flow-tmp/process-flow-appr", params: param };
          this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((data) => {
            this.$message({
              message: this.$t("common.btn.submitSuccess"),
              type: "success",
            });
            this.$emit("initList", { current: 1, pageSize: 15, requestData: {} });
            this.$emit("modelClose");
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("common.btn.Cancelled"),
          });
        });
    },
    handleRules() {},
    dialogSubmit() {
      this.dialogVisible = false;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}?`);
    },
    // gojs初始化
    chartInit() {
      let newData = this.componentData.map((item) => {
        return { text: item, value: item };
      });
      let _this = this;
      let myDiagram = goBase(go.Diagram, "myDiagramDiv", {
        LinkDrawn: showLinkLabel,
        LinkRelinked: showLinkLabel,
        "undoManager.isEnabled": true,
        "toolManager.hoverDelay": 100,
      });
      this.myDiagramEntity = myDiagram;

      // 节点模板的帮助程序定义
      function nodeStyle() {
        return [
          // Node.location 来自节点数据的 “loc” 属性,由 Point.parse 静态方法转换,
          // 如果更改了 Node.location,它将更新节点数据的“loc”属性,使用 Point.stringify 静态方法转换回来。
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          {
            // 节点位置在每个节点的中心
            locationSpot: go.Spot.Center,
            contextMenu: goBase(go.HTMLInfo, {
              show: showContextMenu,
              hide: hideContextMenu,
            }),
            cursor: "move",
            /**  linkConnected: function(node, link, port) {
                                        console.log(node, link, port)
                                    },
                            linkDisconnected: function(node, link, port) {
                                    console.log(node, link, port)
                            },*/
          },
        ];
      }
      // 定义一个函数去创建一个连接的端点, 通常是透明的
      // 命名是作为图形的端点id,
      // “对齐”用于确定端口相对于节点主体的位置，
      // SPOT”用于控制链路与端口的连接方式以及是否是端口
      // 沿着节点的一侧拉长延伸
      // “输出”和“输入”参数控制用户是否可以从端口或到端口绘制链接
      function makePort(name, align, spot, output, input) {
        var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
        // 端口基本上只是一个沿着节点侧面延伸的透明矩形，并在鼠标经过它时会变色
        return goBase(go.Shape, {
          fill: "transparent",
          strokeWidth: 0,
          width: horizontal ? NaN : 8, // 如果不水平拉伸，只有 8 宽
          height: !horizontal ? NaN : 8, // 如果不垂直拉伸，只有 8 高
          alignment: align, // 对齐主形状上的端口
          stretch: horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical,
          portId: name, // 声明这个对象作为一个端口
          fromSpot: spot, // 声明那条线会连接这个端口
          fromLinkable: output, // 声明用户是否可以从此处绘制链接
          toSpot: spot, // 声明链接可能在此端口连接的位置
          toLinkable: input, // 声明用户是否可以绘制指向此处的链接
          cursor: "pointer",
          mouseEnter: function (e, port) {
            // PORT 参数将是这个形状
            if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
          },
          mouseLeave: function (e, port) {
            port.fill = "transparent";
          },
        });
      }
      function textStyle() {
        return {
          font: "bold 11pt Lato, Helvetica, Arial, sans-serif",
          stroke: "#F8F8F8",
        };
      }

      //定义通用的“产线”节点
      // Shape从绑定数据中的几何路径字符串获取Geometry
      //此节点还从绑定数据中的端口数据数组中获取所有端口
      // 定义节点模板作为常规节点
      for (let i = 0; i < this.picArr.length; i++) {
        let item = this.picArr[i];
        myDiagram.nodeTemplateMap.add(
          item.category,
          goBase(
            go.Node,
            "Table",
            nodeStyle(),
            {
              doubleClick: function (e, node, c = item.category) {
                // 双击事件
                handlerDC(e, node);
                // _this.devDbClick(e, node,c)
              },
              click: function (e) {
                // alert('click')
              },
            },
            goBase(go.Picture, {
              source: item.pic,
              margin: new go.Margin(3, 0, 3, 0),
              maxSize: new go.Size(120, 120),
            }),
            goBase(
              go.TextBlock,
              textStyle(),
              {
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true,
              },
              new go.Binding("text").makeTwoWay()
            ),
            //创建节点的连接点
            makePort("T", go.Spot.Top, go.Spot.Top, false, true),
            makePort("L", go.Spot.Left, go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false),
            {
              toolTip: goBase(
                "ToolTip",
                goBase(go.TextBlock, { margin: 4 }, new go.Binding("text", "", textShow)) // 提示框展示nodeInfo(data)的返回信息 nodeInfo
              ),
            }
          )
        );
      }

      // myDiagram.nodeTemplateMap.add("geo",
      //            goBase(go.Node, "Table", nodeStyle(),
      //          goBase(go.Panel, "Spot",
      //        goBase(go.Shape,
      //        { geometry: go.Geometry.parse(),stroke: "#BDBDBD", desiredSize: new go.Size(60, 60),}),
      //         ),
      //        makePort("T", go.Spot.Top, go.Spot.Top, false, true),
      //        makePort("L", go.Spot.Left, go.Spot.Left, true, true),
      //        makePort("R", go.Spot.Right, go.Spot.Right, true, true),
      //        makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
      //       ),
      //);

      myDiagram.nodeTemplate = goBase(
        go.Node,
        "Table",
        {
          locationObjectName: "SHAPE",
          locationSpot: go.Spot.Center,
          // selectionAdorned: false,  // 在Shape.stroke上使用Binding来显示选择
          cursor: "move",
          // contextClick: function(){},  // 鼠标右击事件
          contextMenu: goBase(go.HTMLInfo, {
            show: showContextMenu,
            hide: hideContextMenu,
          }),
          itemTemplate:
            // 每个端口均为“X”形,其对齐点和端口ID由数据决定
            goBase(
              go.Panel,
              new go.Binding("portId", "id"),
              new go.Binding("alignment", "spot", go.Spot.parse)
            ),
          /**  linkConnected: function(node, link, port) {
                                        console.log(node, link, port)
                                    },
                            linkDisconnected: function(node, link, port) {
                                    console.log(node, link, port)
                            },*/
        },
        // 改变形状
        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(
          go.Size.stringify
        ),
        // 根据数据为该Spot Panel创建可变数量的端口
        new go.Binding("itemArray", "ports"),
        // 获取这个节点的位置
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        // 获取这个节点的角度
        new go.Binding("angle", "angle").makeTwoWay(),
        new go.Binding("zOrder"),
        // 将选定的零件移至“画板”图层，因此不会被任何未选定的零件遮盖
        new go.Binding("layerName", "isSelected", function (s) {
          return s ? "Foreground" : "";
        }).ofObject(),
        {
          doubleClick: function (e, node) {
            // 双击事件
            handlerDC(e, node);
            // myDiagram.model.setDataProperty(node.data, "fill", "red");
          },
          click: function (e, node) {
            _this.nodeClick(e, node);
          },
        },

        goBase(
          go.Panel,
          "Spot", // 面板 Spot布局, 在主面板块的相对位置,此处是指XLine
          { name: "SHAPE" },
          goBase(
            go.Shape,
            {
              name: "SHAPE",
              // 以下是默认值，实际值会通过数据绑定来获取节点数据对象
              figure: "Circle",
              fill: "rgba(128, 128, 128, 0.5)",
              strokeDashArray: null,
              stroke: "lightgreen",
            },
            new go.Binding("figure", "figure"),
            new go.Binding("strokeDashArray", "dashLine"),
            new go.Binding("status", "status"),
            new go.Binding("fill", "fill"), // 数据绑定（'属性名','属性值')
            // shape形状由geometryString定义
            new go.Binding("geometryString", "geo"),
            new go.Binding("stroke", "st").makeTwoWay(),
            new go.Binding("strokeWidth", "stWidth").makeTwoWay(),
            new go.Binding("width", "width").makeTwoWay(),
            new go.Binding("height", "height").makeTwoWay()
          ), //shape块
          // 顶部左右两个几何图形
          /**  goBase(go.Shape, "Triangle",
                                        {
                                    alignment: go.Spot.TopRight, alignmentFocus: go.Spot.TopRight,
                                    width: 12, height: 12, fill: "blue"
                                },
                                    new go.Binding("fill", "status", 'red'),
                                    new go.AnimationTrigger('fill')),
                            goBase(go.Shape, "Circle",
                                        {
                                    alignment: go.Spot.TopLeft, alignmentFocus: go.Spot.TopLeft,
                                    width: 12, height: 12, fill: "orange"
                                },
                                        new go.Binding("figure", "operation", 'Rectangle')),
                            */
          goBase(
            go.TextBlock,
            {
              font: "Bold 6px Lato, sans-serif",
              editable: false,
              stroke: "#fff",
              textAlign: "center",
              maxSize: new go.Size(100, NaN),
              isMultiline: true, //是否能多行
              maxLines: 4, //最多三行
              wrap: go.TextBlock.WrapFit,
            },
            new go.Binding("text", "text").makeTwoWay(),
            new go.Binding("font", "font").makeTwoWay(),
            new go.Binding("stroke", "color").makeTwoWay()
          ),
          // 提示框
          {
            toolTip: goBase(
              "ToolTip",
              goBase(go.TextBlock, { margin: 4 }, new go.Binding("text", "", textShow)) // 提示框展示nodeInfo(data)的返回信息 nodeInfo
            ),
          }
        ),
        makePort("T", go.Spot.Top, go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, go.Spot.Left, true, true),
        makePort("R", go.Spot.Right, go.Spot.Right, true, true),
        makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
      ); // node 括号属性

      function textShow(data, diagram) {
        // 函数参数是(节点数据, 节点实体)
        let text = "";
        if (data.text) {
          text = `工艺名称: ${data.text}`;
          if (data.status && data.status.value === 1) {
            text = `工艺名称: ${data.text}(跳站)`;
          } else if (data.status && data.status.value === 2) {
            text = `工艺名称: ${data.text}`;
            // (过站)
          }
        } else {
          text = `名称: ${data.category}`;
        }
        return text;
      }
      /*节点双击事件*/
      function handlerDC(e, node) {
        if (node.data.templateCode && node.data.templateCode.value) {
          _this.variable = node.data.templateCode.value;
          //_this.dialogVisible = true;
          let chartFlowData = _this.processAddList,
            row = {},
            rowId = "";

          chartFlowData.forEach((item) => {
            if (item.processCode === node.data.nodeCode.value) {
              row = item;
              rowId = item.id;
            }
          });
          if (rowId) {
            _this.dialogVisible = true;
            _this.$nextTick(() => {
              _this.$refs.mychild.dataUpdate(row, "/process-dts-tmp/guest/get-dts", 2);
            });
          } else {
            _this.$message({
              message: _this.$t("common.btn.saveOrEditPlsCheckParams"),
              type: "warning",
            });
          }
        } else {
          _this.$message({
            type: "warning",
            message: "当前工艺无需设置参数!",
          });
        }
      }
      let cxElement = this.$refs.contextMenu;

      function hideCX() {
        if (myDiagram.currentTool instanceof go.ContextMenuTool) {
          myDiagram.currentTool.doCancel();
        }
      }

      function showContextMenu(obj, diagram, tool) {
        _this.linkNum = obj.linksConnected.count;
        _this.preDelLinks = JSON.parse(myDiagram.model.toJson()).linkDataArray;
        _this.nodeData = obj.data;
        let mousePt = diagram.lastInput.viewPoint;
        _this.rightLeft = mousePt.x + 180 + "px";
        _this.rightTop = mousePt.y + 125 + "px";
        cxElement.classList.add("show-menu");
        // window.addEventListener("pointerdown", hideCX, true);
      }

      function hideContextMenu(obj, diagram, tool) {
        cxElement.classList.remove("show-menu");
        // window.removeEventListener('pointerdown', hideCX, true);
      }

      cxElement.addEventListener(
        "contextmenu",
        (e) => {
          e.preventDefault();
          return false;
        },
        false
      );

      // defineFigureGenerator 来自 ../extensions/Figures.js:
      go.Shape.defineFigureGenerator("File", function (shape, w, h) {
        var geo = new go.Geometry();
        var fig = new go.PathFigure(0, 0, true); // starting point
        geo.add(fig);
        fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0));
        fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h));
        fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
        fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
        var fig2 = new go.PathFigure(0.75 * w, 0, false);
        geo.add(fig2);
        // 折叠
        fig2.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0.25 * h));
        fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h));
        geo.spot1 = new go.Spot(0, 0.25);
        geo.spot2 = go.Spot.BottomRight;
        return geo;
      });
      myDiagram.nodeTemplateMap.add(
        "Comment",
        goBase(
          go.Node,
          "Auto",
          nodeStyle(),
          goBase(go.Shape, "File", {
            fill: "#282c34",
            stroke: "#DEE0A3",
            strokeWidth: 3,
          }),
          goBase(
            go.TextBlock,
            textStyle(),
            {
              margin: 8,
              maxSize: new go.Size(200, NaN),
              wrap: go.TextBlock.WrapFit,
              textAlign: "center",
              editable: true,
            },
            new go.Binding("text").makeTwoWay()
          )
          // 没有端口，因为不允许任何链接与注释连接
        )
      );

      myDiagram.commandHandler.doKeyDown = function () {
        const e = myDiagram.lastInput;
        const control = e.control || e.meta;
        const key = e.key;

        // 取消 Ctrl+A/Z/Y/G  A-全选、Z-撤销、Y-重做、G-分组
        // if (control && ['A', 'Z', 'Y', 'G'].includes(key)) return
        // 取消 Del/Backspace 删除键
        if (key === "Del" || key === "Backspace") return;

        go.CommandHandler.prototype.doKeyDown.call(this);
      };
      // 替换链接模板映射中的默认链接模板
      myDiagram.linkTemplate = goBase(
        go.Link, // 全部连线的面板
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5,
          toShortLength: 4,
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: true,
          resegmentable: true,
          // 鼠标悬停突出显示链接:
          mouseEnter: function (e, link) {
            link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)";
          },
          mouseLeave: function (e, link) {
            link.findObject("HIGHLIGHT").stroke = "transparent";
          },
          selectionAdorned: false,
          //linkConnected: function(node, link, port) {
          //                  console.log(node, link, port)
          //            }
        },
        {
          doubleClick: function (e, node) {
            // 双击事件
            _this
              .$confirm("确认删除连线?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
              .then(() => {
                // 删除连线和节点的统一方式
                myDiagram.commandHandler.deleteSelection();
              });
          },
        },
        new go.Binding("points").makeTwoWay(),
        goBase(
          go.Shape, // 形状高亮,但是一般是透明
          { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }
        ),
        goBase(
          go.Shape, // 链路路径形状
          { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
          new go.Binding("stroke", "isSelected", function (sel) {
            return sel ? "dodgerblue" : "gray";
          }).ofObject()
        ),
        goBase(
          go.Shape, // 箭头形状
          { toArrow: "standard", strokeWidth: 0, fill: "gray" }
        ),
        goBase(
          go.Panel,
          "Auto", // 连接的标签, 通常不隐藏
          { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
          new go.Binding("visible", "visible").makeTwoWay(),
          goBase(
            go.Shape,
            "RoundedRectangle", // 标签形状
            { fill: "#F8F8F8", strokeWidth: 0 }
          ),
          goBase(
            go.TextBlock,
            "Yes", // 标签文本
            {
              textAlign: "center",
              font: "10pt helvetica, arial, sans-serif",
              stroke: "#333333",
              editable: true,
            },
            new go.Binding("text").makeTwoWay()
          )
        )
      );
      // 监听连线事件
      myDiagram.addDiagramListener("LinkDrawn", function (e) {
        // console.log(e)
      });
      myDiagram.addDiagramListener("SelectionDeleting", function (e) {
        // DiagramEvent.subject 是要删除的 Parts 的集合
        e.subject.each(function (part) {
          /**  if (!(part instanceof go.Node)) return;
                        var animation = new go.Animation();
                        var deletePart = part.copy();
                        animation.add(deletePart, "scale", deletePart.scale, 0.01);
                        animation.add(deletePart, "angle", deletePart.angle, 360);
                        animation.addTemporaryPart(deletePart, myDiagram);
                        animation.start();*/
        });
      });

      // 监听拖拽放下事件
      // myDiagram.addDiagramListener("ExternalObjectsDropped", function(e) {
      //   const data = e.subject;  // 你拖拽的对象
      // });
      // // 监听拖拽事件
      // myDiagram.addDiagramListener("SelectionMoved", function(e) {
      //     console.log("SelectionMoved")
      //     let selectHtml = document.querySelectorAll("#myInspector table tr")[1].childNodes[1].childNodes[0];
      //       let savedNode = this.processAddList;
      //       selectHtml.childNodes.forEach(item => {
      //         if (item.nodeName === 'OPTION') {
      //           savedNode.forEach(sa => {
      //             if(sa.processCode == item.value) {
      //               console.log(sa.processCode )
      //                 item.disabled = true
      //             }
      //           })
      //         }
      //       })
      // });

     //  图表和内部元素选中之后触发事件 
      myDiagram.addDiagramListener("ChangedSelection", function (e) {
        // _this.nodeClick();
        let selectedNodesNum = [];
        var myDiagram = e.diagram;
        var selectedNodes = myDiagram.selection; // 获取当前选中的所有节点
        // 遍历 selectedNodes 并对每个节点执行操作
        selectedNodes.each(function(node) {
          // 对每个节点执行操作
          // console.log("节点 " + node.key + " 被选中");
          selectedNodesNum.push(node.key)
        });
         _this.nodeSelectNum = selectedNodesNum;
         if (_this.nodeSelectNum.length > 1) {
            _this.nodeContextclick = true
          } else if(_this.nodeSelectNum.length === 1){
            _this.nodeContextclick = false
          }
      });
      // 如果来自“条件”节点, 则使链接标签可见, 此侦听器由“LinkDrawn”和“LinkRelinked”DiagramEvents调用。
      function showLinkLabel(e) {
        var label = e.subject.findObject("LABEL");
        if (label !== null)
          label.visible = e.subject.fromNode.data.category === "Conditional";
      }
      // LinkingTool 和 RelinkingTool 使用的临时链接也是正交的：
      myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
      myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

      // 初始化拖拽面板一般在左边
      // 基础模板
      // console.log(this.$refs)
      let myPalette = goBase(go.Palette, "myPaletteBase", {
        // 使用自定义淡入淡出而不是默认动画 this.$refs.myPaletteBase
        "animationManager.initialAnimationStyle": go.AnimationManager.None,
        InitialAnimationStarting: animateFadeDown, // 相反，使用此函数进行动画处理
        nodeTemplateMap: myDiagram.nodeTemplateMap, // 共享 myDiagram 使用的模板
        model: new go.GraphLinksModel({
          // 指定组件面板的内容
          copiesArrays: true,
          copiesArrayObjects: true,
          linkFromPortIdProperty: "fromPort",
          linkToPortIdProperty: "toPort",
          nodeDataArray: [
            {
              key: 1,
              fill: "#282c34",
              st: "#00A9C9",
              stWidth: 3.5,
              font: "bold 11pt Lato, Helvetica, Arial, sans-serif",
              figure: "Circle",
              width: 80,
              height: 80,
              text: "节点1",
            },
            {
              key: 2,
              fill: "#282c34",
              st: "#09d3ac",
              font: "bold 11pt Lato, Helvetica, Arial, sans-serif",
              stWidth: 3.5,
              figure: "Rectangle",
              width: 80,
              height: 40,
              text: "节点2",
            },
            {
              key: 3,
              fill: "#282c34",
              st: "#09d3ac",
              font: "bold 11pt Lato, Helvetica, Arial, sans-serif",
              stWidth: 3.5,
              figure: "Diamond",
              width: 80,
              height: 80,
              text: "节点3",
            },
            {
              key: 4,
              fill: "#282c34",
              st: "#DC3C00",
              font: "bold 11pt Lato, Helvetica, Arial, sans-serif",
              stWidth: 3.5,
              figure: "Circle",
              width: 80,
              height: 80,
              text: "节点4",
            },
            {
              key: 5,
              fill: "#282c34",
              st: "#DEE0A3",
              font: "bold 11pt Lato, Helvetica, Arial, sans-serif",
              stWidth: 3.5,
              figure: "Rectangle",
              width: 90,
              height: 40,
              text: "节点5",
            },
            {
              key: 6,
              fill: "#282c34",
              st: "#09d3ac",
              font: "bold 11pt Lato, Helvetica, Arial, sans-serif",
              stWidth: 3.5,
              figure: "Rectangle",
              width: 60,
              height: 60,
              text: "节点6",
            },
          ],
        }),
      });
      this.myPalette = myPalette;
      /**   let myPaletteDev =
                    goBase(go.Palette, this.$refs.myPaletteDev,
                    {
                    // 使用自定义淡入淡出而不是默认动画
                    "animationManager.initialAnimationStyle": go.AnimationManager.None,
                    "InitialAnimationStarting": animateFadeDown, // 相反，使用此函数进行动画处理
                    nodeTemplateMap: myDiagram.nodeTemplateMap,  // 共享 myDiagram 使用的模板
                    model: new go.GraphLinksModel(_this.devArr)
                });
                this.myPaletteDev = myPaletteDev;  */
      // 这是默认动画的重新实现，只不过它是从下而不是向上淡入。
      function animateFadeDown(e) {
        var diagram = e.diagram;
        var animation = new go.Animation();
        animation.isViewportUnconstrained = true; // 所以图表定位规则让动画在屏幕外开始
        animation.easing = go.Animation.EaseOutExpo;
        animation.duration = 900;
        // 淡入“向下”，换句话说，从上方淡入
        animation.add(
          diagram,
          "position",
          diagram.position.copy().offset(0, 200),
          diagram.position
        );
        animation.add(diagram, "opacity", 0, 1);
        animation.start();
      }
      new Inspector("myInspector", myDiagram, {
        // 允许一次检查多个节点
        multipleSelection: true,
        // 当多项选择为真时，将显示最大数量的节点属性
        showSize: 4,
        showAllProperties: true,
        //propertyModified: function(propertyName, newVal, inspector){
        //  console.log(propertyName, newVal, inspector)
        //},
        properties: {
          key: {
            show: true,
            //Inspector.showIfPresent,
            readOnly: true,
          },
          // "flowSort": { show: Inspector.showIfNode },
          nodeCode: {
            show: Inspector.showIfNode,
            type: "select",
            choices: function (node, propName, propertyValue) {
              if (Array.isArray(node.data.choices)) return node.data.choices;
              _this.codeGetTemplate(node, myDiagram, propertyValue);
              return _this.nodeCodeArr.filter((item) => item.text !== "test");
            },
          },
          templateCode: {
            show: Inspector.showIfNode,
            readOnly: true,
            type: "select",
            choices: function (node, propName, propertyValue) {
              if (Array.isArray(node.data.choices)) return node.data.choices;
              return newData;
            },
             /** changes: function(val,node,name,select) {
                                        console.log(val,node,name,select)
                                    }  */
          },
          status: {
            show: Inspector.showIfNode,
            //readOnly: true,
            type: "select",
            choices: function (node, propName, propertyValue) {
              if (Array.isArray(node.data.choices)) return node.data.choices;
              if (propertyValue.value === 1) {
                // 跳站变成灰色
                let nodes = myDiagram.model.findNodeDataForKey(node.data.key);
                myDiagram.model.setDataProperty(nodes, "fill", "#FFFF77");
                myDiagram.model.setDataProperty(nodes, "color", "#000");
              } else {
                // 过站变成黑色
                let nodes = myDiagram.model.findNodeDataForKey(node.data.key);
                myDiagram.model.setDataProperty(nodes, "fill", "#000");
                myDiagram.model.setDataProperty(nodes, "color", "#fff");
              }
              return _this.isJumpStation;
            },
            /** changes: function(val,node,name,select) {
                                        console.log(val,node,name,select)
                                    }  */
          },
          text: {
            readOnly: true,
            show: (Inspector.showIfNode = function (t) {
              return t.data.RackCode ? false : Inspector.showIfNode;
            }),
          },
          // "color": { show: Inspector.showIfNode, type: 'color' },
          isGroup: { readOnly: true, show: Inspector.showIfPresent },
          geo: { show: false, readOnly: true },
          loc: { readOnly: true, show: false }, //Inspector.showIfPresent
          ports: { readOnly: true, show: false },
          fill: { show: false, type: "color" }, //Inspector.showIfNode
          st: { show: Inspector.showIfNode, type: "color" },
          // 'size': {show: Inspector.showIfNode,},
        },
      });
    },
    // 选择模块nodeCode获取参数template
    //nodeCode数据关联templateCode和text
    codeGetTemplate(node, myDiagram, propertyValue) {
      const datas = this.tableDefineData;
      let nodes = myDiagram.model.findNodeDataForKey(node.data.key);
      if (propertyValue != "") {
        let newTemplateCode = datas.find((item) => {
          if (item.processCode == propertyValue.value) {
            return item;
          }
        });
        let template = newTemplateCode.template;
        myDiagram.model.setDataProperty(nodes, "templateCode", {
          text: template,
          value: template,
        });
      }
      myDiagram.model.setDataProperty(nodes, "text",propertyValue.text ? `${propertyValue.text}
      \(${propertyValue.value})`: '节点');
    },
    nodeClick(e, obj) {
            // let selectHtml = document.querySelectorAll("#myInspector table tr")[1].childNodes[1].childNodes[0];
            // let savedNode = this.processAddList;
            // selectHtml.childNodes.forEach(item => {
            //   if (item.nodeName === 'OPTION') {
            //     savedNode.forEach(sa => {
            //       if(sa.processCode == item.value) {
            //         console.log(sa.processCode )
            //           item.disabled = true
            //       }
            //     })
            //   }
            // })
    },
    devDbClick(e, node, c) {
      switch (c) {
        case "pic":
          console.log(e, node, c);
          break;
        case "cabinet":
          console.log(e, node, c);
          break;
        case "ysj":
          console.log(e, node, c);
          break;
        default:
          break;
      }
    },
    // 右击面板单击事件
    cxcommand(e) {
      let val = e.currentTarget.id;
      if (this.nodeData.category) {
        // 设备模板节点
        switch (val) {
          case "task-info":
            console.log("设备模板节点");
            break;
          case "dele-node":
            // let chartFlowData = this.processAddList;
            // let nodeData = JSON.parse(this.myDiagramEntity.model.toJson()).nodeDataArray;
            // let rowId = "";
            // chartFlowData.forEach((item) => {
            //   if (
            //     this.nodeData.nodeCode &&
            //     item.processCode === this.nodeData.nodeCode.value
            //   ) {
            //     rowId = item.id;
            //   }
            // });
            // if (rowId && this.nodeData.nodeCode) {
            //   this.$confirm(
            //     this.$t("common.processFlowTmpList.productionProcessesDel"),
            //     this.$t("common.btn.hint"),
            //     {
            //       confirmButtonText: this.$t("common.btn.ok"),
            //       cancelButtonText: this.$t("common.btn.cancel"),
            //       type: "warning",
            //     }
            //   )
            //     .then(() => {
            //       let json = { data: rowId };
            //       const _data = { url: "/process-flow-tmp-dts/del", params: json };
            //       this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((data) => {
            //         this.myDiagramEntity.commandHandler.deleteSelection();
            //         this.nextDelLinks = JSON.parse(
            //           this.myDiagramEntity.model.toJson()
            //         ).linkDataArray;
            //         if (nodeData.length >= 2 && this.linkNum === 2) {
            //           this.AfterDelToConnect(this.preDelLinks, this.nextDelLinks);
            //         }
            //         this.moveOnFinish();
            //         this.$message({
            //           message: this.$t("common.btn.deleteSuccess"),
            //           type: "success",
            //         });
            //       });
            //     })
            //     .catch(() => {
            //       this.$message({
            //         type: "info",
            //         message: this.$t("common.btn.Cancelled"),
            //       });
            //     });
            // } else {
            //   this.myDiagramEntity.commandHandler.deleteSelection();
            //   this.nextDelLinks = JSON.parse(
            //     this.myDiagramEntity.model.toJson()
            //   ).linkDataArray;
            //   if (nodeData.length >= 2 && this.linkNum === 2) {
            //     this.AfterDelToConnect(this.preDelLinks, this.nextDelLinks);
            //   }
            // }
            break;
          default:
            break;
        }
      } else {
        // 基础模板节点
        switch (val) {
          case "task-info":
            // this.modalTemp = this.nodeData
            // this.$refs.nodeInfoModal.modalOpen();
            break;
          case "condition-node":
            console.log("条件节点");
            break;
          case "jump-node": // 跳站、过站按钮
            this.$confirm("是否要跳站?", this.$t("common.btn.hint"), {
              confirmButtonText: this.$t("common.btn.ok"),
              cancelButtonText: this.$t("common.btn.cancel"),
              type: "warning",
            })
              .then(() => {
                let nodes = this.myDiagramEntity.model.findNodeDataForKey(
                  this.nodeData.key
                );
                this.myDiagramEntity.model.setDataProperty(nodes, "status", {
                  text: "跳站",
                  value: 1,
                });
                this.myDiagramEntity.model.setDataProperty(nodes, "fill", "#FFFF77");
                this.myDiagramEntity.model.setDataProperty(nodes, "color", "#000");
              })
              .catch(() => {
                let nodes = this.myDiagramEntity.model.findNodeDataForKey(
                  this.nodeData.key
                );
                this.myDiagramEntity.model.setDataProperty(nodes, "status", {
                  text: "过站",
                  value: 2,
                });
                this.myDiagramEntity.model.setDataProperty(nodes, "fill", "#000");
                this.myDiagramEntity.model.setDataProperty(nodes, "color", "#fff");
              });
            break;
          case "dele-node": // 节点删除
            if(this.nodeContextclick) {
              this.$message({
                message: '无法同时删除多个节点!',
                type: "warning"
              })
              return;
            }
            let chartFlowData = this.processAddList;  // 已保存节点
            let nodeData = JSON.parse(this.myDiagramEntity.model.toJson()).nodeDataArray,aa = '';
            let rowId = "",DelKey = this.nodeData.key;
            chartFlowData.forEach((item) => {
              this.nodeCodeValue.forEach(valueItem => {
                    if (this.nodeData.nodeCode && item.processCode ===  valueItem) {
                      //item.processCode ===  this.nodeData.nodeCode.value     item.processCode ===  aa  
                      rowId = item.id; 
                    }
              })
          
            });
            // console.log(this.savedNodeKey,this.savedNodeKey.indexOf(DelKey) )
            if (this.savedNodeKey.indexOf(DelKey) !== -1 && rowId && this.nodeData.nodeCode) {
              this.$confirm(
                this.$t("common.processFlowTmpList.productionProcessesDel"),
                this.$t("common.btn.hint"),
                {
                  confirmButtonText: this.$t("common.btn.ok"),
                  cancelButtonText: this.$t("common.btn.cancel"),
                  type: "warning",
                }
              )
                .then(() => {
                  let json = { data: rowId };
                  const _data = { url: "/process-flow-tmp-dts/del", params: json };
                  this.$store
                    .dispatch("fmsCommon/actionFmsPost", _data)
                    .then((data) => {
                      this.myDiagramEntity.commandHandler.deleteSelection();
                      this.nextDelLinks = JSON.parse(
                        this.myDiagramEntity.model.toJson()
                      ).linkDataArray;

                      if (nodeData.length >= 2 && this.linkNum === 2) {
                        this.AfterDelToConnect(this.preDelLinks, this.nextDelLinks);
                      }
                      this.moveOnFinish();
                      this.$message({
                        message: this.$t("common.btn.deleteSuccess"),
                        type: "success",
                      });
                    })
                    .catch(() => {
                      this.$message({
                        type: "warning",
                        message: "请先保存后再进行操作",
                      });
                    });
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: this.$t("common.btn.Cancelled"),
                  });
                });
            } else {
              this.myDiagramEntity.commandHandler.deleteSelection();
              this.nextDelLinks = JSON.parse(
                this.myDiagramEntity.model.toJson()
              ).linkDataArray;
              if (nodeData.length >= 2 && this.linkNum === 2) {
                this.AfterDelToConnect(this.preDelLinks, this.nextDelLinks);
              }
            }
            break;

          case "params-set":
            // this.isNodeInfo = false;
            // this.isParamsSet = true;
            break;
          default:
            break;
        }
      }
      this.myDiagramEntity.currentTool.stopTool();
    },
    AfterDelToConnect(pre, next) {
      let preDLinkArr = pre,
        nextDLinkArr = next,
        delLinkArr = [],
        aa = [],
        repeatNum = 0;
      let preStr = [],
        nextStr = [],
        fNum,
        tNum;
      preDLinkArr.forEach((item, i) => {
        preStr.push(`f${item.from}` + "," + `t${item.to}`);
      });
      nextDLinkArr.forEach((item, i) => {
        nextStr.push(`f${item.from}` + "," + `t${item.to}`);
      });
      preStr.forEach((aa) => {
        if (!nextStr.includes(aa)) {
          delLinkArr.push(aa);
        }
      });
      delLinkArr.forEach((a) => {
        aa.push(...a.split(","));
      });
      let newArr1 = aa.map((item) => {
        return Number(item.slice(1));
      });

      for (let i = 0; i < newArr1.sort().length; i++) {
        if (newArr1[i] === newArr1[i + 1]) {
          repeatNum = newArr1[i];
        }
      }
      let newAa = aa.filter((item) => {
        if (item.slice(1) !== repeatNum.toString()) {
          return item;
        }
      });
      newAa.forEach((item) => {
        if (item.slice(0, 1) === "f") {
          fNum = item.slice(1);
        } else {
          tNum = item.slice(1);
        }
      });
      let diagram = this.myDiagramEntity;
      diagram.startTransaction("make new link");
      // 删除中间节点后自动连接上下两个节点
      diagram.model.addLinkData({ from: Number(fNum), to: Number(tNum) });
      diagram.commitTransaction("make new link");
    },
    save() {
      this.modalTemp = {
        pageCode: this.rowInfo.flowCode,
        bizType: "COMM_PR_FLOW_TYPE", // 需固定类型
        bizName: "工艺流程", // 需固定名称
        pageName: this.rowInfo.flowName,
      };
      this.modalTitle = "流程审批图保存";
      this.$refs.nodeInfoModal.modalOpen();
    },
    // 流程图修改按钮
    modifyChart() {
      this.flowRow.flowCode = this.rowInfo.flowCode;
      this.flowRow.flowName = this.rowInfo.flowName;
      this.flowRow.cellId = this.rowInfo.cellId;
      this.flowRow.id = this.rowInfo.id;
      this.flowRow.useState = this.rowInfo.useState;
      this.flowRow.flowType = this.rowInfo.flowType.toString();
      this.flowCodeReadonly = true;
      this.cellTypeReadonly = true;
      this.flowVisible = true;
      //this.modalTemp = this.chartData;
      //this.modalTitle='流程审批图修改'
      //this.$refs.nodeInfoModal.modalOpen();
    },

    // 工艺流程图JSON
    processFlowJson() {
      return this.myDiagramEntity.model.toJson();
    },
    // 保存/修改确定事件
    moveOnFinish() {
      let flowDataParams = [],
        isLineDirectionRight = false,
        pre = 0,
        next = 0;
      let nodeData = JSON.parse(this.myDiagramEntity.model.toJson());
      for (var nit = this.myDiagramEntity.nodes; nit.next(); ) {
        let node = nit.value;
        this.myDiagramEntity.startTransaction("set nodeIndex");
        let nodes = this.myDiagramEntity.model.findNodeDataForKey(node.data.key);
        this.myDiagramEntity.commitTransaction("set nodeIndex");
        if (!nit.value.linksConnected.rb) {
          // setTimeout(() => {
          //   if (!this.modalTemp.id) {
          //     this.$message({
          //       type: "warning",
          //       message: "如需保存节点间请连线且节点至少两个!",
          //     });
          //   } else {
          // if (nodeData.nodeDataArray.length >= 2) {
          //   this.$message({
          //     type: "warning",
          //     message: "如需修改节点间请连线且节点至少两个!",
          //   });
          // }
          //   }
          // });
          // return;
          if (nodeData.nodeDataArray.length === 1) {
            (pre = "##"), (next = null);
          } else if (nodeData.nodeDataArray.length >= 2) {
            this.$message({
              type: "warning",
              message: "如需修改节点间请连线且节点至少两个!",
            });
            return;
          }
        } else {
          let //node = nit.value,
            linkArr = nit.value.linksConnected.rb.m;
          // pre = 0,
          // next = 0;
          // 设置节点对应属性
          //this.myDiagramEntity.startTransaction("set nodeIndex");
          //let nodes = this.myDiagramEntity.model.findNodeDataForKey(node.data.key);
          // this.myDiagramEntity.commitTransaction("set nodeIndex");
          if (!nodes.nodeCode) {
            this.$message({
              type: "warning",
              message: "请先选择工艺节点!!",
            });
            return;
          }
          // if (this.modalTemp.id && nodeData.nodeDataArray.length >= 2) {
          //   linkArr = nit.value.linksConnected.rb.m;
          // }

          if (linkArr.length === 1 && linkArr[0].data.from === nodes.key) {
            (pre = "##"), (next = linkArr[0].data.to);
          } else if (
            linkArr.length === 2 &&
            linkArr[0].data.to === nodes.key &&
            linkArr[1].data.from === nodes.key
          ) {
            (pre = linkArr[0].data.from), (next = linkArr[1].data.to);
          } else if (
            linkArr.length === 2 &&
            linkArr[1].data.to === nodes.key &&
            linkArr[0].data.from === nodes.key
          ) {
            (pre = linkArr[1].data.from), (next = linkArr[0].data.to);
          } else if (linkArr.length === 1 && linkArr[0].data.to === nodes.key) {
            (pre = linkArr[0].data.from), (next = null);
          }
          // 判断连线方向是否一致
          linkArr.forEach((item, a) => {
            if (
              (linkArr[a].data &&
                linkArr[a].data.to === nodes.key &&
                linkArr[a + 1] &&
                linkArr[a + 1].data.to === nodes.key) ||
              (linkArr[a].data &&
                linkArr[a].data.from === nodes.key &&
                linkArr[a + 1] &&
                linkArr[a + 1].data.from === nodes.key)
            ) {
              this.$message({
                type: "warning",
                message: "连接线箭头指向要一致！",
              });
              isLineDirectionRight = true;
            }
          });
        }

        if (isLineDirectionRight) {
          return;
        }
        if (
          (pre !== "##" &&
            !this.myDiagramEntity.model.findNodeDataForKey(pre).nodeCode) ||
          (next !== null && !this.myDiagramEntity.model.findNodeDataForKey(next).nodeCode)
        ) {
          this.$message({
            type: "warning",
            message: "请先选工艺节点!!",
          });
          return;
        }

        flowDataParams.push({
          flowId: this.rowInfo.id,
          templateCode: "",
          processCode: nodes.nodeCode.value, // 每个工艺的编码
          preProcessNode:
            pre === "##"
              ? "##"
              : this.myDiagramEntity.model.findNodeDataForKey(pre).nodeCode.value,
          nextProcessNode:
            next === null
              ? null
              : this.myDiagramEntity.model.findNodeDataForKey(next).nodeCode.value,
        });
      }

      let newDataArr = flowDataParams.map((item) => {
        let isProcessJump = 2;
        nodeData.nodeDataArray.forEach((ndo) => {
          if (ndo.nodeCode.value === item.processCode && ndo.status) {
            isProcessJump = ndo.status.value;
          }
        });
        let tt = "";
        this.tableDefineData.forEach((tb) => {
          if (item.processCode === tb.processCode) {
            tt = tb.template;
          }
        });

        return { ...item, templateCode: tt, status: isProcessJump };
      });
      let duplicates = [],dupItem = [];
      newDataArr.forEach((item) => {
        duplicates.push(item.processCode)
        for (var nit = this.myDiagramEntity.nodes; nit.next(); ) {
          let node = nit.value;
          // 设置节点对应属性
          this.myDiagramEntity.startTransaction("set nodeIndex1");
          let nodes = this.myDiagramEntity.model.findNodeDataForKey(node.data.key);
          if (nodes.nodeCode.value === item.processCode) {
            this.myDiagramEntity.model.setDataProperty(nodes, "templateCode", {
              text: item.templateCode,
              value: item.templateCode,
            });
          }
          this.myDiagramEntity.commitTransaction("set nodeIndex1");
        }
      });
      duplicates.forEach((item,i) => {
        if(duplicates.indexOf(item) !== i) dupItem.push(item)
      }); 
      if(dupItem.length) {
        this.$message({
            type: "warning",
            message: `请勿重复添加节点${dupItem}!`,
          });
          return
      }
      // 保存流程图json
      // this.chartJsonSave(nodeData, 0);

      // 新增和修改保存流程图数据 (保存流程图节点信息(节点位置,参数,是否跳站))
      if (nodeData.nodeDataArray.length) {
        const dataParam = {
          url: "/process-flow-tmp-dts/createOrUpdate",
          params: { data: newDataArr },
        };
        this.$store.dispatch("fmsCommon/actionFmsPost", dataParam).then((res) => {
         // console.log(`保存/修改接口${res}`);
          this.$message({
            type: "success",
            message: this.$t("common.btn.updateSuccess"),
          });
          // 保存流程图json
          this.chartJsonSave(nodeData, 0);
        });
      } else {
        //写在这做删除操作时, 当节点都没有时图的json数据可保存;
        this.chartJsonSave(nodeData, 0);
      }
    },
    isFlowChartSaved() {
      return this.chartData.id;
    },
    moveOnFinishWhenClose() {
      //if (!this.modalTemp.id) { //  保存
      //      this.$emit('modelClose')
      //  } else {  // 修改
      let flowDataParams = [];
      let nodeData = JSON.parse(this.myDiagramEntity.model.toJson());
      let ArrProcessCode = [];
      for (var nit = this.myDiagramEntity.nodes; nit.next(); ) {
        if (!nit.value.linksConnected.rb) {
          setTimeout(() => {
            if (!this.modalTemp.id) {
              this.$message({
                type: "warning",
                message: "如需保存节点间请连线且节点至少两个!",
              });
            } else {
              if (nodeData.nodeDataArray.length >= 2) {
                this.$message({
                  type: "warning",
                  message: "如需修改节点间请连线且节点至少两个!",
                });
              }
            }
          });
          return;
        }

        let node = nit.value,
          linkArr = nit.value.linksConnected.rb.m,
          pre = 0,
          next = 0;
        // 设置节点对应属性
        this.myDiagramEntity.startTransaction("set nodeIndex");
        let nodes = this.myDiagramEntity.model.findNodeDataForKey(node.data.key);
        this.myDiagramEntity.commitTransaction("set nodeIndex");
        if (!nodes.nodeCode) {
          this.$message({
            type: "warning",
            message: "请先选择工艺节点!!",
          });
          return;
        } else {
          ArrProcessCode.push(nodes.nodeCode.value);
        }

        // if (this.modalTemp.id && nodeData.nodeDataArray.length >= 2) {
        //   linkArr = nit.value.linksConnected.rb.m;
        // }

        if (linkArr.length === 1 && linkArr[0].data.from === nodes.key) {
          (pre = "##"), (next = linkArr[0].data.to);
        } else if (
          linkArr.length === 2 &&
          linkArr[0].data.to === nodes.key &&
          linkArr[1].data.from === nodes.key
        ) {
          (pre = linkArr[0].data.from), (next = linkArr[1].data.to);
        } else if (
          linkArr.length === 2 &&
          linkArr[1].data.to === nodes.key &&
          linkArr[0].data.from === nodes.key
        ) {
          (pre = linkArr[1].data.from), (next = linkArr[0].data.to);
        } else if (linkArr.length === 1 && linkArr[0].data.to === nodes.key) {
          (pre = linkArr[0].data.from), (next = null);
        }
        if (
          (pre !== "##" && !this.myDiagramEntity.model.findNodeDataForKey(pre)) ||
          (next !== null && !this.myDiagramEntity.model.findNodeDataForKey(next))
        ) {
          this.$message({
            type: "warning",
            message: "连接线箭头指向要一致！！",
          });
        }
        if (
          (pre !== "##" &&
            !this.myDiagramEntity.model.findNodeDataForKey(pre).nodeCode) ||
          (next !== null && !this.myDiagramEntity.model.findNodeDataForKey(next).nodeCode)
        ) {
          this.$message({
            type: "warning",
            message: "请先选工艺节点!",
          });
          return;
        }

        flowDataParams.push({
          flowId: this.rowInfo.id,
          templateCode: "",
          processCode: nodes.nodeCode.value, // 每个工艺的编码
          preProcessNode:
            pre === "##"
              ? "##"
              : this.myDiagramEntity.model.findNodeDataForKey(pre).nodeCode.value,
          nextProcessNode:
            next === null
              ? null
              : this.myDiagramEntity.model.findNodeDataForKey(next).nodeCode.value,
        });
      }
      let repeatArr = [];
      ArrProcessCode.forEach((item, i) => {
        this.tableDefineData.forEach((tb) => {
          if (
            ArrProcessCode.indexOf(item) !== ArrProcessCode.lastIndexOf(item) &&
            ArrProcessCode.indexOf(item) === i
          ) {
            if (tb.processCode === item) {
              repeatArr.push(item);
              //tb.processName
            }
          }
        });
      });
      if (repeatArr.length) {
        this.$message({
          message: `存在重复的工艺--[${repeatArr.join(",")}],请修改!!!`,
          type: "error",
        });
        return;
      }

      let newDataArr = flowDataParams.map((item) => {
        let isProcessJump = 2;
        nodeData.nodeDataArray.forEach((ndo, i) => {
          if (ndo.nodeCode.value === item.processCode && ndo.status) {
            isProcessJump = ndo.status.value;
          }
        });
        let tt = "";
        this.tableDefineData.forEach((tb) => {
          if (item.processCode === tb.processCode) {
            tt = tb.template;
          }
        });

        return { ...item, templateCode: tt, status: isProcessJump };
      });

      newDataArr.forEach((item) => {
        for (var nit = this.myDiagramEntity.nodes; nit.next(); ) {
          let node = nit.value;
          // 设置节点对应属性
          this.myDiagramEntity.startTransaction("set nodeIndex1");
          let nodes = this.myDiagramEntity.model.findNodeDataForKey(node.data.key);
          if (nodes.nodeCode.value === item.processCode) {
            this.myDiagramEntity.model.setDataProperty(nodes, "templateCode", {
              text: item.templateCode,
              value: item.templateCode,
            });
          }
          this.myDiagramEntity.commitTransaction("set nodeIndex1");
        }
      });

      // 保存流程图json
      this.chartJsonSave(nodeData, 1);

      // 新增和修改保存流程图数据 (保存流程图节点信息(节点位置,参数,是否跳站))
      if (nodeData.nodeDataArray.length) {
        const dataParam = {
          url: "/process-flow-tmp-dts/createOrUpdate",
          params: { data: newDataArr },
        };
        this.$store.dispatch("fmsCommon/actionFmsPost", dataParam).then((res) => {
          this.$message({
            type: "success",
            message: this.$t("common.btn.updateSuccess"),
          });
          this.$emit("modelClose");
        });
      }
      //}
    },
    // 传节点数量值到父组件
    nodeCountChange() {
      this.nodeCount = JSON.parse(
        this.myDiagramEntity.model.toJson()
      ).nodeDataArray.length;
      return this.nodeCount;
    },
    /** load(bizCode) {
        let param = {
            data: {
                  bizType: 'COMM_PR_FLOW_TYPE',
                  bizCode: bizCode
            }
        };
        const _data = {url: '/page-conf/guest/biz-type-code', params: param}
        this.$store.dispatch('fmsCommon/actionTaskPost', _data).then((response => {
            if (response.length) {
                this.chartData = response[0];
                this.modalTemp = response[0];
                if (this.chartData && this.chartData.id) {
                    this.isShowSaveBtn = false;
                    this.isShowModify = true;
                }
                let nodeArrt = JSON.parse(response[0].scripts)
                for(let i=0;i<nodeArrt.nodeDataArray.length;i++){
                    let item = nodeArrt.nodeDataArray[i]
                    if (item.status && item.status.value === 1) {
                        item.fill = '#FFFF77'
                        item.color = '#000'
                    } else {
                        item.fill = '#000'
                    }
                }
                this.myDiagramEntity.model = go.Model.fromJson(JSON.stringify(nodeArrt));
            }

        }))
    },  */
    load(graphJson) {      
      // this.chartData = response[0];
      // this.modalTemp = response[0];
      // this.isShowSaveBtn = false;
      // this.isShowModify = true;
      if (
        graphJson &&
        graphJson.graph &&
        JSON.parse(graphJson.graph).nodeDataArray.length
      ) {
        this.savedNodeKey = [];   // 已经被保存在后台的键值key
        let nodeArrt = JSON.parse(graphJson.graph);
        for (let i = 0; i < nodeArrt.nodeDataArray.length; i++) {
          let item = nodeArrt.nodeDataArray[i];
          this.savedNodeKey.push(item.key);
         // item.text = this.commonI18n(item.text.split(" ")[0]) + " " + item.text.split(" ")[1];
          if (item.status && item.status.value === 1) {
            item.fill = "#FFFF77";
            item.color = "#000";
          } else {
            item.fill = "#000";
          }
        }

        this.myDiagramEntity.model = go.Model.fromJson(JSON.stringify(nodeArrt));
      }
    },

    // 上传时
    /** dataUpload(uploadfile) {
        //this.fileData = uploadfile.file;
    },
    // 上传前
    beforeUpload(data){
        console.log(data)
    },
    // 获取文件数据实体
    loadJsonFromFile(file, fileList) {
        this.fileData = fileList;
    },
    nativeChange(et) {
            this.imgKey +=1;
            let keys = this.imgKey;
            let fileObj = et.target.files,
                newFile = [];

       //delete fileObj.length;
         //   for(let key in fileObj) {
          //      if(key !== 'length' && key !== 'item') {
           //         newFile.push(fileObj[key])
           //     }
            //    let file = fileObj[key];

            //}
           // newFile.forEach((item,i) => {
           //   let reader = new FileReader();
            //  reader.readAsDataURL(item);
            //  reader.onload = (e) => {
            //       let fileString = e.target.result;
            //       this.imgUpload = fileString;
            //       this.newPic.push({pic: fileString, category:'uploadPic'+i})
            //       this.newDev.push({category:'uploadPic'+i})
           //    }
          // })

          let reader = new FileReader();
              reader.readAsDataURL(fileObj[0]);
              reader.onload = (e) => {
                   let fileString = e.target.result;
                   this.imgUpload = fileString;
                   this.picArr.push({pic: fileString, category:'uploadPic' + keys})
                   this.devArr.push({category:'uploadPic' + keys})
                   // 销毁画布原图重新渲染Gojs
                   this.myPalette.div = null;
                   this.myDiagramEntity.div = null
                   this.myPaletteDev.div = null
                   this.chartInit();
               }
            //this.picArr.push(...this.newPic)
            //this.devArr.push(...this.newDev)

            // let file = e.target.files[0];
            // document.getElementById('mySavedModel').value
            this.oldJson= this.myDiagramEntity.model.toJson();
            this.myDiagramEntity.model = go.Model.fromJson(this.oldJson);
    },
    picGet() {
        if (Array.isArray(this.fileData)) {
            let file = this.fileData[0];
            let reader = new FileReader();
            // reader.readAsText(file.raw)
            reader.onload = (e) => {
                const fileString = e.target.result
                this.imgUpload = fileString;
                this.picArr.push({pic: fileString, category:'uploadPic'})
                this.devArr.push({category:'uploadPic'})
                this.myPalette.div = null;
                this.myDiagramEntity.div = null;
                this.myPaletteDev.div = null;
                this.chartInit();
            }
            reader.readAsDataURL(file.raw)
        }

    }, */
  },
};
</script>

<style lang="less" scoped>
/deep/ .modify-chart {
  height: 50vh;
  .el-dialog__body {
    overflow-y: hidden;
  }
}
/deep/.inspector td {
  float: left;
  width: 50%;
  margin-bottom: 5px;
  font-weight: bold;
}
/deep/.inspector input {
  width: 95%;
  padding: 3px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}
/deep/.inspector select {
  width: 95%;
}
.flow-approch {
  .approve-sel {
    margin: 0 10px;
  }
  .el-btn {
    margin-right: 10px;
  }
  overflow-y: hidden !important;

  //input#uploadImg::file-selector-button {
  //    background-color: #1890ff;
  //    color: #FFFFFF;
  //    border-radius: 3px;
  //    border: 0px;
  //    width: 90px;
  //    height: 36px;
  //    display: inline-block;
  //    margin-right: 10px;
  //    cursor: pointer;
  //}

  #flow-chart-area1 {
    div {
      flex-grow: 1;
      #myDiagramDiv {
        border: 1px solid #aaa;
        position: relative;
        border-radius: 3px;
        background-color: #00a1ff2b;
        position: relative;
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
        cursor: auto;
      }
    }

    #node-set {
      background: #00a1ff2b;
      border: 1px solid #aaa;
      border-radius: 3px;
      margin-left: 5px;
    }
    .palette-div {
      margin: 0 0 5px 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      > div:nth-child(1) {
        width: 14%;
        margin-right: 7px;
        .collapse-div {
          height: 600px;
          margin-right: 2px;
          background-color: CornflowerBlue;
          position: relative;
          -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
          cursor: auto;
        }
      }
      > div:nth-child(2) {
        width: 86%;
      }
    }
    > div {
      .el-collapse-item ::v-deep .el-collapse-item__header {
        background-color: #00a1ff2b;
        border: 1px solid #aaa;
        border-radius: 3px;
      }
    }
  }
}
/deep/.el-dialog__body {
  height: 85vh;
  overflow-y: scroll;
}
.menu {
  display: none;
  position: absolute;
  margin: 0;
  list-style: none;
  padding: 8px 0;
  z-index: 999;
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12);
  background-color: #fff;
  border-radius: 4px;
  .menu-item {
    &:hover {
      cursor: pointer;
      background-color: rgb(16, 55, 182);
      color: white;
    }
    padding: 5px;
    text-align: center;
  }
}
.show-menu {
  display: block;
}
</style>

