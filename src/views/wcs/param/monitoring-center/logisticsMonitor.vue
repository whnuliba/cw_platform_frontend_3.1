/* * @CreatAuthor: 宋丹峰 * @UpdateAuthor: (...) * @Description: 监控中心-调度界面设计 */
<template>
  <el-row>
    <div :style="{ display: 'flex' }">
      <el-col :span="4" class="left-palette">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item name="1">
            <template slot="title">
              <i class="header-icon el-icon-s-unfold"></i>输送线
            </template>
            <div ref="myTransferDiv" style="height: 300px"></div>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title">
              <i class="header-icon el-icon-loading"></i>堆垛机
            </template>
            <div ref="myStackerDiv" style="height: 100px"></div>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template slot="title">
              <i class="header-icon el-icon-guide"></i>单机
            </template>
            <div ref="myAloneDiv" style="height: 100px"></div>
          </el-collapse-item>
          <el-collapse-item name="4">
            <template slot="title">
              <i class="header-icon el-icon-s-grid"></i>货位
            </template>
            <div ref="myCellDiv" style="height: 80px"></div>
          </el-collapse-item>
          <el-collapse-item name="5">
            <template slot="title">
              <i class="header-icon el-icon-s-help"></i>其他
            </template>
            <div ref="myOthersDiv" style="height: 80px"></div>
          </el-collapse-item>
        </el-collapse>
      </el-col>
      <el-col :span="20">
        <div class="design-and-inspect" :style="{ display: 'flex' }">
          <span style="display: inline-block; vertical-align: top; width: 84%">
            <div
              ref="myDiagramDiv"
              :style="{ height: '600px' }"
              v-loading="viewLoading"
            ></div>
          </span>
          <span
            :style="
              inspectorTableStyle
                ? { display: 'inline-block', verticalAlign: 'top', width: '16%' }
                : { display: 'inline-block', verticalAlign: 'top' }
            "
          >
            <div
              id="myInspector"
              class="inspector"
              :style="
                inspectorTableStyle
                  ? { height: '597px' }
                  : { height: '597px', overflowY: 'scroll' }
              "
            >
              <table>
                <tbody>
                  <tr ref="inspectorForm">
                    <td>
                      <div className="nodeInfo">
                        {{ $t("const.nodeInfo") }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </span>
        </div>

        <div :style="{ display: 'flex', 'justify-content': 'center', margin: '5px 0' }">
          <el-select
            class="selectSchedule"
            @change="changeSchedule"
            v-model="scheduleType"
          >
            <el-option :value="1" :label="translateText('conveyorDrawing')" />
            <el-option :value="2" :label="translateText('rackDrawing')" />
            <el-option :value="3" :label="translateText('trayDrawing')" />
          </el-select>
          <el-button id="SaveButton" @click="save" type="primary">{{
            saveOrEdit
          }}</el-button>
          <el-button id="reset" @click="reset" :title="translateText('resetTitle')">{{
            $t("common.btn.reset")
          }}</el-button>
          <el-button id="zoom" type="primary" @click="zoom">{{
            $t("common.btn.enlarge")
          }}</el-button>
          <el-button id="zoomOut" type="primary" @click="zoomOut">{{
            $t("common.btn.lessen")
          }}</el-button>
          <el-button id="setCtrlCode" type="primary" @click="setCtrlCode" >控制号设置</el-button>
        </div>
        <!-- 设计完成的调度表 -->
        <el-table
          v-loading="listLoading"
          :data="logisticsTableData"
          border
          fit
          highlight-current-row
          style="width: 100%"
          height="150"
        >
          <el-table-column width="50px" :label="$t('common.no')" align="center">
            <template slot-scope="scope">
              <span>{{
                (listQuery.current - 1) * listQuery.pageSize + (scope.$index + 1)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, i) in tableColumns"
            :key="item.field + i"
            :label="commonI18n(item)"
            :prop="item.field"
            :min-width="item.minWidth"
            :align="item.align"
            show-overflow-tooltip
          >
            <!-- <template  slot-scope="{row}">{{item.field}}</template> -->
          </el-table-column>
          <el-table-column align="center" :label="$t('common.oper')" min-width="200">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="read(scope.row)"
                >{{ $t("common.btn.read") }}</el-button
              >
              <!-- <el-button type="primary" size="small"  icon="el-icon-edit" @click="edit(scope.row)">
                            {{ $t("common.btn.edit") }}
                        </el-button> -->
              &nbsp;
              <el-button
                type="warning"
                size="small"
                icon="el-icon-edit"
                @click="del(scope.row)"
              >
                {{ $t("common.btn.delete") }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <textarea :style="{width:'100%',height:'200px',borderRadius:'4px'}" id="mySavedModel" v-model="savedModelText"></textarea> -->
      </el-col>
    </div>
    <!-- 调度图保存弹窗 -->
    <el-dialog
      v-el-drag-dialog
      :visible.sync="dialogFormVisible"
      :title="logisticsTitle"
      customClass="customStyle"
    >
      <div>
        <el-form
          ref="diagramForm"
          :model="designTemp"
          label-position="left"
          label-width="100px"
          :rules="logisticRules"
          :close-on-click-modal="false"
        >
          <el-form-item
            v-for="(item, i) in columnsDesign"
            :label="commonI18n(item) + ': '"
            :prop="item.key"
            :key="i"
          >
            <!-- :disabled="saveOrEdit === '编辑' && item.title === 'sortNum' ? true : false" -->
            <el-input
              v-model="designTemp[item.title]"
              :placeholder="$t('const.pleaseInput')"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="logisticsDesignSave">{{
              $t("common.btn.ok")
            }}</el-button>
            <el-button @click="dialogFormVisible = false">{{
              $t("common.btn.cancel")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 货位弹窗 -->
    <el-dialog
      v-el-drag-dialog
      :visible.sync="nodeFormVisible"
      :title="logisticsTitle"
      customClass="customStyle"
    >
      <div>
        <el-form
          ref="dataForm"
          :model="nodeTemp"
          label-position="left"
          label-width="100px"
          :rules="nodeRules"
          :close-on-click-modal="false"
        >
          <el-form-item
            v-for="(item, i) in shelvesColumns"
            :label="commonI18n(item) + ': '"
            :prop="item.key"
            :key="i"
          >
            <el-input
              v-model="nodeTemp[item.title]"
              :placeholder="$t('const.pleaseInput')"
              v-if="!item.type"
            />
            <el-select
              v-else-if="item.type === 'select'"
              v-model="nodeTemp[item.title]"
              :placeholder="$t('const.pleaseSelect')"
            >
              <el-option
                v-for="sel in nodeSel"
                :key="sel.val"
                :label="sel.lab"
                :value="sel.val"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="() => shelvesSave(1)">{{
              $t("common.btn.ok")
            }}</el-button>
            <el-button @click="nodeFormVisible = false">{{
              $t("common.btn.cancel")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 货位编码弹窗 -->
    <el-dialog
      v-el-drag-dialog
      :visible.sync="numFormVisible"
      :title="logisticsTitle"
      customClass="customStyle"
    >
      <div>
        <el-form
          ref="numForm"
          :model="numTemp"
          label-position="left"
          label-width="100px"
          :rules="numRules"
          :close-on-click-modal="false"
        >
          <el-form-item
            v-for="(item, i) in numColumns"
            :label="commonI18n(item) + ': '"
            :prop="item.key"
            :key="i"
          >
            <el-input
              v-if="!item.type"
              v-model="numTemp[item.title]"
              :placeholder="$t('const.pleaseInput')"
            />
            <el-select
              v-else-if="item.type === 'select'"
              v-model="numTemp[item.title]"
              :placeholder="$t('const.pleaseSelect')"
            >
              <el-option
                v-for="sel in numSel"
                :key="sel.val"
                :label="sel.lab"
                :value="sel.val"
              />
            </el-select>
            <el-color-picker
              v-else-if="item.type === 'colorPicker'"
              v-model="numTemp[item.title]"
              show-alpha
              :predefine="predefineColors"
            >
            </el-color-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="() => shelvesSave(2)">{{
              $t("common.btn.ok")
            }}</el-button>
            <el-button @click="numFormVisible = false">{{
              $t("common.btn.cancel")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import { Inspector } from "./Inspector/DataInspector";
// import { NodeLabelDraggingTool } from "./Inspector/NodeLabelDragTool";
import { GeometryReshapingTool } from "./Inspector/GeometryReshapingTool";
import elDragDialog from "@/directive/el-drag-dialog";
import elImageViewer from "element-ui/packages/image/src/image-viewer";
// import jq from 'jquery';
import i18n from "@/lang";
const Make = go.GraphObject.make;
export default {
  name: "monitorDrawing",
  components: { elImageViewer },
  directives: { elDragDialog },
  data() {
    return {
      inspectorTableStyle: true,
      textI18n: {
        conveyorDrawing: { zh: "物流图", en: "conveyorDrawing" },
        rackDrawing: { zh: "货位图", en: "rackDrawing" },
        trayDrawing: { zh: "托盘图", en: "trayDrawing" },
        resetTitle: { zh: "重置后变成新建图", en: "reset to new drawing" },
      },
      logisticRules: {
        // sortNum: [
        //      {required: true, message: '请输入序列号', trigger: 'blur'}
        // ],
        fileName: [{ required: true, message: "请输入调度图名称", trigger: "blur" }],
      },
      nodeRules: {
        node_direc: [{ required: true, message: "请输入方向", trigger: "blur" }],
        x: [{ required: true, message: "请输入层数", trigger: "blur" }],
        y: [{ required: true, message: "请输入列数", trigger: "blur" }],
        z: [{ required: true, message: "请输入行数", trigger: "blur" }],
        startRowNum: [{ required: true, message: "请输入初始层数", trigger: "blur" }],
      },
      numRules: {
        direction: [{ required: true, message: "请输入方向", trigger: "blur" }],
        z: [{ required: true, message: "请输入层数", trigger: "blur" }],
        startRowNum: [{ required: true, message: "请输入初始层数", trigger: "blur" }],
      },
      nodeSel: [
        { val: 1, lab: "从下到上" },
        { val: 2, lab: "从上到下" },
        { val: 3, lab: "从左到右" },
        { val: 4, lab: "从右到左" },
      ],
      numSel: [
        { val: 1, lab: "从下到上" },
        { val: 2, lab: "从左到右" },
        { val: 3, lab: "从右到左" },
        { val: 4, lab: "从上到下" },
      ],
      saveOrEdit: "新建",
      viewLoading: false,
      listLoading: false,
      listQuery: {
        current: 1,
        pageSize: 10,
      },
      logisticsTableData: [],
      tableColumns: [
        {
          title: "调度图名称",
          field: "fileName",
          minWidth: 200,
          width: 100,
          align: "center",
        },
        {
          title: "调度图类型",
          field: "fileType",
          minWidth: 200,
          width: 100,
          align: "center",
        },
        { title: "备注", field: "remark", minWidth: 200, width: 150, align: "center" },
      ],
      disableBtn: true,
      diagramData: {
        class: "GraphLinksModel",
        copiesArrays: true,
        copiesArrayObjects: true,
        linkFromPortIdProperty: "fid",
        linkToPortIdProperty: "tid",
        nodeDataArray: [],
        linkDataArray: [],
      },
      currentNode: null,
      nodeTemp: {
        node_direc: 1,
        x: undefined,
        y: undefined,
        z: undefined,
        startRowNum: 1,
      },
      designTemp: {
        fileName: undefined,
        sortNum: 0,
        remark: undefined,
      },
      numTemp: {
        direction: 1,
        z: undefined,
        startRowNum: 1,
        color: "rgba(128, 128, 128, 0.5)",
      },
      // 货位层列数
      numColumns: [
        {
          title: "direction",
          key: "direction",
          label: "方向",
          type: "select",
        },
        {
          title: "z",
          key: "z",
          label: "层数",
        },
        {
          title: "startRowNum",
          key: "startRowNum",
          label: "起始层号",
        },
        {
          title: "color",
          key: "color",
          label: "节点颜色",
          type: "colorPicker",
        },
      ],
      predefineColors: [
        "#fff",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "rgba(255, 69, 0, 0.68)",
        "rgb(255, 120, 0)",
        "hsv(51, 100, 98)",
        "hsva(120, 40, 94, 0.5)",
        "hsl(181, 100%, 37%)",
        "hsla(209, 100%, 56%, 0.73)",
        "#c7158577",
      ],
      addSave: true,
      logisticsTitle: "",
      shelvesColumns: [
        {
          title: "node_direc",
          key: "node_direc",
          label: "方向",
          type: "select",
        },
        {
          title: "z",
          key: "z",
          label: "层数",
        },
        {
          title: "y",
          key: "y",
          label: "列号",
        },
        {
          title: "x",
          key: "x",
          label: "排号",
        },
        {
          title: "startRowNum",
          key: "startRowNum",
          label: "起始层号",
        },
      ],
      columnsDesign: [

        {
          title: "fileName",
          key: "fileName",
          label: "调度图名称",
        },
        {
          title: "remark",
          key: "remark",
          label: "备注",
          columns_type: "textarea",
        },
        {
            title:'sortNum',
            key: 'sortNum',
            label:'序号',
        }
      ],
      dialogFormVisible: false,
      nodeFormVisible: false,
      showviewer: false,
      urlList: [],
      savedModelText: undefined,
      diagram: null,
      node: null,
      nodepropertys: {
        key: undefined,
        text: undefined,
      },
      activeNames: "",
      tt: true,
      modalKey: "",
      logisticsId: "",
      tableRow: {},
      myPalette: null, // 设计左边零件选择实体
      scheduleType: 1,
      inputDisable: false,
      nodeLoc: "", // 节点坐标
      shelvesNode: {},
      doubleClickRow: 0,
      groupNum: "",
      numFormVisible: false,
      numLoc: "",
      numNode: {},
      groupName: "",
      nodeAnimate: false,
    };
  },
  // 初始化
  created() {

               console.log(111,this.nodeLoc)

  },
  mounted() {
    this.init();
    this.listLoading = true;
    this.initTableData();
  },
  computed: {},
  methods: {
    setCtrlCode(){
      var nodes = this.diagram.selection.toArray();
        for(let x of nodes){
          var text = x?.data?.text;
          if(text && text.length>0){
            x.data.ctrlCode=text;
          }
        }
    },
      translateText(type) {
      return this.textI18n[type][this.$store.state.app.language];
    },
    zoom() {
      // 放大
      this.diagram.scale = this.diagram.scale + 0.1;
    },
    zoomOut() {
      // 缩小
      this.diagram.scale = this.diagram.scale - 0.1;
    },
    // 弹窗生成货位节点
    shelvesSave(num) {
      let ref_name = num === 1 ? "dataForm" : "numForm";
      this.$refs[ref_name].validate((valid) => {
        if (valid) {
          switch (num) {
            case 1:
              this.nodeFormVisible = false;
              if (this.logisticsTitle === "货位设置") {
                this.addNode();
              } else {
                for (var nit = this.diagram.nodes; nit.next(); ) {
                  let node = nit.value;
                  // 设置节点对应属性
                  if (node.data.linkKey === this.doubleClickRow) {
                    this.diagram.startTransaction("dele node");
                    let nodes = this.diagram.model.findNodeDataForKey(node.data.key);
                    this.diagram.model.removeNodeData(nodes);
                    this.diagram.commitTransaction("dele node");
                  }
                }
                this.addNode();
              }
              break;
            case 2:
              if (this.logisticsTitle === "货位编码设置") {
                this.numFormVisible = false;
                this.addNum();
              } else {
                for (var nit = this.diagram.nodes; nit.next(); ) {
                  let node = nit.value;
                  // 设置节点对应属性
                  if (node.data.numKey === this.doubleClickRow) {
                    this.diagram.startTransaction("dele n");
                    let nodes = this.diagram.model.findNodeDataForKey(node.data.key);
                    this.diagram.model.removeNodeData(nodes);
                    this.diagram.commitTransaction("dele n");
                  }
                }
                this.numFormVisible = false;
                this.addNum();
              }
              break;
            default:
              break;
          }
        } else {
          return false;
        }
      });
    },
    addNum() {
      // 自动设置货位编码
      let { z, startRowNum, direction, color } = this.numTemp;
      let loc_x = Array.isArray(this.numLoc.split(" ")) ? this.numLoc.split(" ")[0] : "0";
      let loc_y = Array.isArray(this.numLoc.split(" ")) ? this.numLoc.split(" ")[1] : "0";
      // 给初始节点设置货位号
      let node = this.diagram.model.findNodeDataForKey(this.numNode),
        hwfirstCode = parseInt(startRowNum);
      this.diagram.model.setDataProperty(node, "text", hwfirstCode);
      this.diagram.model.setDataProperty(node, "z", z);
      this.diagram.model.setDataProperty(node, "color", color);
      // 点击遍历生成节点
      for (let i = 0; i < z; i++) {
        this.diagram.startTransaction("make new node");
        this.diagram.model.addNodeData({
          key: Math.random() + 1,
          loc:
            direction === 1
              ? `${loc_x} ${Number(loc_y) - 20 * (i + 1)}`
              : direction === 2
              ? `${Number(loc_x) + 20 * (i + 1)} ${loc_y}`
              : direction === 3
              ? `${Number(loc_x) - 20 * (i + 1)} ${loc_y}`
              : `${loc_x} ${Number(loc_y) + 20 * (i + 1)}`,
          geo: "F1 M665,508h-20v-20h20V508z",
          color: color, //"rgba(128, 128, 128, 0.5)",
          text: `${parseInt(startRowNum) + (i + 1)}`,
          startRowNum: startRowNum,
          move: false,
          group: this.groupName,
          numKey: this.numNode,
          z: z,
        });
        this.diagram.commitTransaction("make new node");
      }
    },
    addNode() {
     
      // 自动设置节点货位编码
      let _this = this;
      let { x, y, z, startRowNum, node_direc } = this.nodeTemp;
      // 获取坐标数据
      let loc_x = Array.isArray(this.nodeLoc.split(" "))
        ? this.nodeLoc.split(" ")[0]
        : "0";
      let loc_y = Array.isArray(this.nodeLoc.split(" "))
        ? this.nodeLoc.split(" ")[1]
        : "0";
      let newX = parseInt(x) < 10 ? `0${x}` : x,
        newY = parseInt(y) < 10 ? "00" + y : "0" + y;
      // 给初始节点设置货位号
      let node = this.diagram.model.findNodeDataForKey(_this.shelvesNode),
        hwfirstCode =
          parseInt(startRowNum) < 10
            ? `${newX}${newY}0${startRowNum}`
            : `${newX}${newY}${startRowNum}`;
      this.diagram.model.setDataProperty(node, "rackCode", hwfirstCode);
      this.diagram.model.setDataProperty(node, "x", x);
      this.diagram.model.setDataProperty(node, "y", y);
      this.diagram.model.setDataProperty(node, "z", z);

      // 点击遍历生成节点
      for (let i = 0; i < z; i++) {
        this.diagram.startTransaction("make new node");
        this.diagram.model.addNodeData({
          key: Math.random(),
          geo: "F1 M665,508h-20v-20h20V508z",
          bg1: "rgba(245,245,245)",
          bg2: "rgba(245,245,245)",
          bg3: "rgba(245,245,245)",
          bg4: "rgba(245,245,245)",
          rackCode:
            parseInt(startRowNum) + (i + 1) < 10
              ? `${newX}${newY}0${parseInt(startRowNum) + (i + 1)}`
              : `${newX}${newY}${parseInt(startRowNum) + (i + 1)}`, // 几排几列几层
          loc:
            node_direc === 1
              ? `${loc_x} ${Number(loc_y) - 20 * (i + 1)}`
              : node_direc === 2
              ? `${loc_x} ${Number(loc_y) + 20 * (i + 1)}`
              : node_direc === 3
              ? `${Number(loc_x) + 20 * (i + 1)} ${loc_y}`
              : `${Number(loc_x) - 20 * (i + 1)} ${loc_y}`,
          group: this.groupNum,
          move: false,
          initNodeLoc: this.nodeLoc,
          linkKey: _this.shelvesNode,
          x: x,
          y: y,
          z: z,
          node_direc: node_direc,
          startRowNum: startRowNum,
        });
        this.diagram.commitTransaction("make new node");
      }
    },
    // 节点双击事件
    nodeDoubleClick(e, node) {
      if (!node.data.text && node.data.bg1) {
        this.nodeFormVisible = true;
        this.logisticsTitle = "货位修改";
        let { x, y, z, node_direc, startRowNum } = node.data;
        this.nodeTemp = {
          node_direc: node_direc === undefined ? 1 : node_direc,
          x: x,
          y: y,
          z: z,
          startRowNum: startRowNum === undefined ? 1 : startRowNum,
        };
        // 判断双击的是初始节点还是后生成的节点
        if (node.data.linkKey) {
          this.doubleClickRow = node.data.linkKey;
          //  this.nodeLoc = node.data.initNodeLoc;
          for (var nit = this.diagram.nodes; nit.next(); ) {
            let nodesData = nit.value;
            // 设置节点对应属性
            if (nodesData.data.key === node.data.linkKey) {
              this.nodeLoc = nodesData.data.loc;
            }
          }
          this.shelvesNode = node.data.linkKey;
        } else {
          this.doubleClickRow = node.data.key;
          this.nodeLoc = node.data.loc;
          this.shelvesNode = node.data.key;
        }
        this.groupNum = node.data.group;
      } else if (node.data.group === '编号') {
        this.numFormVisible = true;
        this.logisticsTitle = "货位编码修改";
        let { z, direction, color, startRowNum } = node.data;
        this.numTemp = {
          startRowNum: startRowNum === undefined ? 1 : startRowNum,
          z: z,
          direction: direction === undefined ? 1 : direction,
          color: color === undefined ? "rgba(128,128,128,0.5)" : color,
        };
        if (node.data.numKey) {
          this.doubleClickRow = node.data.numKey;
          //  this.nodeLoc = node.data.initNodeLoc;
          for (var nit = this.diagram.nodes; nit.next(); ) {
            let nodesData = nit.value;
            // 设置节点对应属性
            if (nodesData.data.key === node.data.numKey) {
              this.numLoc = nodesData.data.loc;
            }
          }
          this.numNode = node.data.numKey;
        } else {
          this.doubleClickRow = node.data.key;
          this.numLoc = node.data.loc;
          this.numNode = node.data.key;
        }
        this.groupName = node.data.group;
      }
    },

    changeSchedule() {
      this.viewLoading = true;
      let params = {
        pageSize: 100,
        current: 1,
        requestData: {
          fileType: this.scheduleType,
        },
      };
      const _data = { url: "/monitor-drawing/guest/list", params: params };
      this.$store
        .dispatch("fmsCommon/actionTaskPost", _data)
        .then((data) => {
          this.logisticsTableData = data.data.sort((a,b)=>{return a.sortNum-b.sortNum});
          this.viewLoading = false;
          this.listLoading = false;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // gojs初始化
    init() {
      var _this = this;
      // let nodeAnimate = new go.Animation();
      // var CellSize = new go.Size(20, 20);
      let myDiagram = Make(go.Diagram, this.$refs.myDiagramDiv, {
        initialScale: 1, //拖入画板后形成的图形初始化大小是原来的1.5倍
        "commandHandler.defaultScale": 1,
        allowLink: false,
        // initialPosition : new go.Point(100,-100),
        // draggingTool: new SnappingTool(),   // 使用自定义的DraggingTool代替下面定义的标准工具
        contextMenu: Make(
          "ContextMenu",
          makeButton(
            "Paste",
            (e, obj) =>
              e.diagram.commandHandler.pasteSelection(
                e.diagram.toolManager.contextMenuTool.mouseDownPoint
              ),
            (o) =>
              o.diagram.commandHandler.canPasteSelection(
                o.diagram.toolManager.contextMenuTool.mouseDownPoint
              )
          ),
          makeButton(
            "Undo",
            (e, obj) => e.diagram.commandHandler.undo(),
            (o) => o.diagram.commandHandler.canUndo()
          ),
          makeButton(
            "Redo",
            (e, obj) => e.diagram.commandHandler.redo(),
            (o) => o.diagram.commandHandler.canRedo()
          )
        ),
        "undoManager.isEnabled": true, //isEnabled属性设置为true，以便UndoManager记录更改并让用户执行撤消或重做操作
      });
      myDiagram.grid.visible = true; //增加网格背景
      // 通过设置 Panel.grid.Grid 来更改网格单元的属性
      myDiagram.grid = Make(
        go.Panel,
        "Grid",
        { gridCellSize: new go.Size(5, 5) },
        Make(go.Shape, "BarH", { fill: "#fff", strokeWidth: 0.5 }), //#d0d9dd #00a1ff2b
        Make(go.Shape, "BarV", { fill: "#fff", strokeWidth: 0.5 }),
        Make(go.Shape, "LineH", { stroke: "rgba(204,204,204,0.8)", strokeWidth: 0.3 }),
        Make(go.Shape, "LineV", { stroke: "rgba(204,204,204,0.8)", strokeWidth: 0.3 })   //#ccc
      );

      // draggingTool 和 ResizingTool 可以根据背景网格模式更改其行为。
      myDiagram.toolManager.draggingTool.isGridSnapEnabled = true;
      myDiagram.toolManager.resizingTool.isGridSnapEnabled = true;
      // myDiagram.toolManager.mouseMoveTools.insertAt(0, new NodeLabelDraggingTool());
      myDiagram.toolManager.mouseDownTools.insertAt(3, new GeometryReshapingTool());
      // 定义一个用于创建上下文菜单按钮的函数：
      function makeButton(text, action, visiblePredicate) {
        return Make(
          "ContextMenuButton",
          Make(go.TextBlock, text),
          { click: action },
          visiblePredicate
            ? new go.Binding("visible", "", (o, e) =>
                o.diagram ? visiblePredicate(o, e) : false
              ).ofObject()
            : {}
        );
      }

      myDiagram.addDiagramListener("Modified", (e) => {
        // 修改图形触发的事件
        let button = document.getElementById("SaveButton");
        if (button) button.disabled = !myDiagram.isModified;
      });

      // palette节点拖到画布后触发的事件
      myDiagram.addDiagramListener("externalobjectsdropped", function (e) {
        e.subject.each(function (n) {
          //得到从Palette拖过来的节点
          if (n.data.bg1 && n.data.bg2) {
            _this.nodeFormVisible = true;
            _this.logisticsTitle = "货位设置";
            _this.shelvesNode = n.data.key;
            _this.nodeLoc = n.data.loc;
            _this.groupNum = n.data.group;
          } else if (n.data.text && n.data.group) {
            _this.numFormVisible = true;
            _this.logisticsTitle = "货位编码设置";
            _this.numLoc = n.data.loc;
            _this.numNode = n.data.key;
            _this.groupName = n.data.group;
          }
        });
      });
      // 复制节点后（键盘ctrl+CV）
      myDiagram.addDiagramListener("ClipboardPasted", function (e) {
        copyEvent(e, "ClipboardPasted");
      });
      // 直接鼠标复制触发
      myDiagram.addDiagramListener("SelectionCopied", function (e) {
        copyEvent(e, "SelectionCopied");
      });
      // 复制货位节点设置正确的关联key
      function copyEvent(params, event_name) {
        let nodeKey = null,
          param_attr = null;
        switch (event_name) {
          case "ClipboardPasted":
            param_attr = params.subject.$e.value;
            break;
          case "SelectionCopied":
            param_attr = params.subject.ga.$e.key;
            break;
          default:
            break;
        }
        // 修改linkKey和numKey
        params.subject.each(function (n) {
          let nodeAttr = n.data;
          if (param_attr.data.group && param_attr.data.text) {
            if (nodeAttr.group && !nodeAttr.numKey) {
              nodeKey = nodeAttr.key;
            }
            if (nodeAttr.group && nodeAttr.numKey) {
              let numKeyNode = myDiagram.model.findNodeDataForKey(nodeAttr.key);
              myDiagram.model.setDataProperty(numKeyNode, "numKey", nodeKey);
            }
          } else if (param_attr.data.group && param_attr.data.bg1) {
            if (nodeAttr.group && !nodeAttr.linkKey) {
              nodeKey = nodeAttr.key;
            }
            if (nodeAttr.group && nodeAttr.linkKey) {
              let numKeyNode = myDiagram.model.findNodeDataForKey(nodeAttr.key);
              myDiagram.model.setDataProperty(numKeyNode, "linkKey", nodeKey);
            }
          }
        });
      }

      //定义一种通用类型的节点
      myDiagram.nodeTemplateMap.add(
        "Comment",
        Make(
          go.Node,
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          Make(
            go.TextBlock,
            { stroke: "brown", font: "9pt sans-serif", editable: true },
            new go.Binding("text")
          )
        )
      );
      // 提示框板块
      var partContextMenu = Make("ContextMenu");
      //定义通用的“管道”节点
      // Shape从绑定数据中的几何路径字符串获取Geometry
      //此节点还从绑定数据中的端口数据数组中获取所有端口
      let nodeGlobalAttr = {};
      myDiagram.nodeTemplate = Make(
        go.Node,
        "Spot",
        {
          locationObjectName: "SHAPE",
          locationSpot: go.Spot.Center,
          // selectionAdorned: false,  // 在Shape.stroke上使用Binding来显示选择
          resizable: false, //自定义大小
          cursor: "move",
          movable: true,
          // contextClick: function(e,obj){
          //     console.log(e,obj)
          // },
          itemTemplate:
            // 每个端口均为“X”形，其对齐点和端口ID由数据决定
            Make(
              go.Panel,
              new go.Binding("portId", "id"),
              new go.Binding("alignment", "spot", go.Spot.parse),
              Make(
                go.Shape,
                "XLine",
                {
                  width: 6,
                  height: 6,
                  background: "transparent",
                  fill: null,
                  stroke: "gray",
                },
                new go.Binding("figure", "id", portFigure), // portFigure转换器定义如下
                new go.Binding("angle", "angle")
              )
            ),
          // 连接时隐藏“x”端口
          linkConnected: (node, link, port) => {
            if (link.category === "") port.visible = false;
          },
          linkDisconnected: (node, link, port) => {
            if (link.category === "") port.visible = true;
          },
        },
        new go.Binding("resizable", "resizable").makeTwoWay(),

        {
          doubleClick: this.nodeDoubleClick, // 双击事件
          click: function (e, obj) {
            _this.inspectorTableStyle = false;
            nodeGlobalAttr = obj.data
            // 单击事件
            // _this.nodeLoc = obj.part.data.loc;
            // let n = _this.diagram.model.findNodeDataForKey(obj.part.data.key);
            // nodeAnimate.add(n, "opacity", n.part.data.opacity, 0.2);
            // nodeAnimate.duration = 2000;
            // nodeAnimate.runCount = Infinity;
            // _this.nodeAnimate = !_this.nodeAnimate;
            // if (_this.nodeAnimate) {
            //   nodeAnimate.start();
            // } else {
            //   nodeAnimate.stop();
            // }
          },
          selectionChanged: function (part) {
            // 选择改变事件（拖拽 palette 到画板也会触发）
          },
        },
        Make(
          go.Panel,
          "Spot",
          { name: "SHAPE" },
          Make(
            go.Shape,
            {
              name: "SHAPE",
              // 以下是默认值，实际值会通过数据绑定来获取节点数据对象
              geometryString: "F1 M0 0 L20 0 20 20 0 20 z",
              fill: "rgba(128, 128, 128, 0.3)", // 每个节点的背景颜色
              stroke:  'rgba(153,153,153,0.5)',
              strokeWidth: 0.1,
              strokeDashArray: null,
              // 设置矩形图初始化大小
              // minSize: CellSize,
              // desiredSize: CellSize  // 初始化1x1的cell
            },
            new go.Binding("fill", "color").makeTwoWay(),
            new go.Binding("strokeDashArray", "dashLine"),
            // shape形状由geometryString定义
            new go.Binding("geometryString", "geo").makeTwoWay(),
            // 点击图形会使节点外边框变成蓝色
            // new go.Binding("stroke", "isSelected", s => s ? "dodgerblue" : "#999").ofObject(),
            new go.Binding("stroke", "st"),
            new go.Binding("strokeWidth", "isSelected", (s) =>
              s ? 0.5 : 0.5
            ).ofObject(),
            new go.Binding("width", "width").makeTwoWay(),
            new go.Binding("height", "height").makeTwoWay(),
            new go.Binding("scale", "scale").makeTwoWay(),
            new go.Binding("createCount", "createCount").makeTwoWay()

            // new go.Binding("opacity", "opacity").makeTwoWay(),
          ), //shape块

          Make(
            go.TextBlock,
            {
              font: "Bold 10px Lato, sans-serif",
              editable: true,
              textAlign: "center",
              maxSize: new go.Size(100, NaN),
              cursor: "pointer",
              wrap: go.TextBlock.WrapDesiredSize,
              stroke: "#000",
              width: 35, //文本长度
              angle: 0,
              // flip: go.GraphObject.FlipHorizontal,
              // verticalAlignment: go.Spot.Top,
              // margin: 5,
              isMultiline: true,  //是否能多行
              overflow: go.TextBlock.OverflowClip /* the default value */,
              // maxLines:1, //最多三行
              // alignment: new go.Spot(4, 0, 0, -1),
              // alignmentFocus: new go.Spot(4,0,0,-1) //go.Spot.TopCenter
            },
            new go.Binding("text", "text").makeTwoWay(),
            new go.Binding("font", "font").makeTwoWay(),
            new go.Binding("stroke", "textColor").makeTwoWay(),
            new go.Binding("angle", "textAngle").makeTwoWay(),
            new go.Binding("width", "textWidth").makeTwoWay(),
            // new go.Binding("alignment", "label_offset", go.Spot.parse).makeTwoWay(go.Spot.stringify),
            new go.Binding("overflow", "", function (s) {
              return s.lot1 && s.lot2 && s.lot3 && s.lot4
                ? go.TextBlock.OverflowEllipsis
                : go.TextBlock.OverflowClip;
            }),
            new go.Binding("maxLines", "", function (s) {
              return s.lot1 && s.lot2 && s.lot3 && s.lot4 ? 1 : "";
            }),
            new go.Binding("width", "", function (s) {
              return s.lot1 && s.lot2 && s.lot3 && s.lot4 ? 20 : "";
            })
            // new go.Binding("stroke","lot1",function(s) { return s ? "transparent" : "rgba(0,0,0,0.7)"; }),
          ),
          Make(
            go.Panel,
            "Table",
            Make(
              go.TextBlock,
              new go.Binding("text", "lot1"),
              { font: "10pt serif", stroke: "none" },
              { row: 0, column: 0, margin: 0, width: 8, height: 8 },
              new go.Binding("background", "bg1")
            ),
            Make(
              go.TextBlock,
              new go.Binding("text", "lot2"),
              { font: "10pt serif", stroke: "none" },
              { row: 0, column: 1, margin: 0, width: 8, height: 8 },
              new go.Binding("background", "bg2")
            ),
            Make(
              go.TextBlock,
              new go.Binding("text", "lot3"),
              { font: "10pt serif", stroke: "none" },
              { row: 1, column: 0, margin: 0, width: 8, height: 8 },
              new go.Binding("background", "bg3")
            ),
            Make(
              go.TextBlock,
              new go.Binding("text", "lot4"),
              { font: "10pt serif", stroke: "none" },
              { row: 1, column: 1, margin: 0, width: 8, height: 8 },
              new go.Binding("background", "bg4")
            )
          )
        ),
        new go.Binding("movable", "move"),
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
        // 将选定的零件移至“画板”图层，因此不会被任何未选定的零件遮盖
        new go.Binding("layerName", "isSelected", function (s) {
          return s ? "Foreground" : "";
        }).ofObject(),
        // 提示框
        {
          toolTip: Make(
            "ToolTip",
            Make(go.TextBlock, { margin: 4 }, new go.Binding("text", "", nodeInfo)) // 提示框展示nodeInfo(data)的返回信息
          ),
          //右键菜单将会在所有节点中显示
          contextMenu: partContextMenu,
        }
      ); // node 括号

      myDiagram.nodeTemplate_1 = Make(
        go.Node,
        "Spot",
        {
          locationObjectName: "SHAPE",
          locationSpot: go.Spot.Center,
          selectionAdorned: false, // 在Shape.stroke上使用Binding来显示选择
          resizable: false, //自定义大小
          cursor: "move",
          movable: true,
        },

        Make(
          go.Panel,
          "Spot",
          { name: "SHAPE" },
          Make(
            go.Shape,
            {
              name: "SHAPE",
              // 以下是默认值，实际值会通过数据绑定来获取节点数据对象
              geometryString: "F1 M0 0 L20 0 20 20 0 20 z",
              fill: "rgba(128, 128, 128, 0.3)", // 每个节点的背景颜色
              stroke: "#70645C",
              strokeWidth: 1,
              strokeDashArray: null,
              // 设置矩形图初始化大小
              // minSize: CellSize,
              // desiredSize: CellSize  // 初始化1x1的cell
            },
            new go.Binding("fill", "color").makeTwoWay(),
            new go.Binding("strokeDashArray", "dashLine"),
            // shape形状由geometryString定义
            new go.Binding("geometryString", "geo").makeTwoWay(),
            // 点击图形会使节点外边框变成蓝色
            new go.Binding("stroke", "isSelected", (s) =>
              s ? "dodgerblue" : "rgba(153,153,153,0.5)"
            ).ofObject(),
            new go.Binding("stroke", "st", "#70645C"),
            new go.Binding("strokeWidth", "isSelected", (s) =>
              s ? 0.8 : 0.8
            ).ofObject(),
            new go.Binding("width", "width").makeTwoWay(),
            new go.Binding("height", "height").makeTwoWay()
          ), //shape块

          Make(
            go.TextBlock,
            {
              font: "Bold 10px Lato, sans-serif",
              editable: true,
              textAlign: "center",
              maxSize: new go.Size(100, NaN),
              cursor: "pointer",
              wrap: go.TextBlock.WrapDesiredSize,
              stroke: "#000",
              width: 35,
            },
            new go.Binding("text", "text").makeTwoWay(),
            new go.Binding("font", "font").makeTwoWay(),
            new go.Binding("stroke", "textColor").makeTwoWay(),
            // new go.Binding("alignment", "label_offset", go.Spot.parse).makeTwoWay(go.Spot.stringify),
            new go.Binding("overflow", "", function (s) {
              return s.lot1 && s.lot2 && s.lot3 && s.lot4
                ? go.TextBlock.OverflowEllipsis
                : go.TextBlock.OverflowClip;
            }),
            new go.Binding("maxLines", "", function (s) {
              return s.lot1 && s.lot2 && s.lot3 && s.lot4 ? 1 : "";
            }),
            new go.Binding("width", "", function (s) {
              return s.lot1 && s.lot2 && s.lot3 && s.lot4 ? 20 : "";
            })
            // new go.Binding("stroke","lot1",function(s) { return s ? "transparent" : "rgba(0,0,0,0.7)"; }),
          ),
          Make(
            go.Panel,
            "Table",
            Make(
              go.TextBlock,
              new go.Binding("text", "lot1"),
              { font: "10pt serif", stroke: "none" },
              { row: 0, column: 0, margin: 0, width: 8, height: 8 },
              new go.Binding("background", "bg1")
            ),
            Make(
              go.TextBlock,
              new go.Binding("text", "lot2"),
              { font: "10pt serif", stroke: "none" },
              { row: 0, column: 1, margin: 0, width: 8, height: 8 },
              new go.Binding("background", "bg2")
            ),
            Make(
              go.TextBlock,
              new go.Binding("text", "lot3"),
              { font: "10pt serif", stroke: "none" },
              { row: 1, column: 0, margin: 0, width: 8, height: 8 },
              new go.Binding("background", "bg3")
            ),
            Make(
              go.TextBlock,
              new go.Binding("text", "lot4"),
              { font: "10pt serif", stroke: "none" },
              { row: 1, column: 1, margin: 0, width: 8, height: 8 },
              new go.Binding("background", "bg4")
            )
          )
        ),
        new go.Binding("movable", "move"),
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
        // 将选定的零件移至“画板”图层，因此不会被任何未选定的零件遮盖
        new go.Binding("layerName", "isSelected", function (s) {
          return s ? "Foreground" : "";
        }).ofObject(),
        new go.Binding("zOrder", "zOrder").makeTwoWay()
      ); // node 括号
      // 组节点属性
      myDiagram.groupTemplate = Make(
        go.Group,
        "Vertical",
        {
          layerName: "Background",
          resizable: false,
          resizeObjectName: "GroupShape",
          minSize: new go.Size(20, 20),
          desiredSize: new go.Size(70, 50), // 初始化1x1的cell
          cursor: "move",
          locationSpot: new go.Spot(0, 0.25, 0, 0), //go Spot(x,y,offx,offy) x - spot的x轴,y - spot的y轴，offx（可选）绝对 x 偏移量，offy（可选）绝对 y 偏移量。
          // handlesDragDropForMembers: true
        },

        new go.Binding("position", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("desiredSize", "groupSize", go.Size.parse).makeTwoWay(
          go.Point.stringify
        ),
        {
          // 当 Group 发生拖拽或拖放时事件
          mouseDragEnter: function (e, grp, prev) {
            // if (!highlightGroup(grp, true)) e.diagram.currentCursor = "not-allowed"; else e.diagram.currentCursor = "";
          },
          mouseDragLeave: function (e, grp, next) {
            // highlightGroup(grp, false);
          },
          mouseDrop: function (e, grp) {
            // var ok = grp.addMembers(grp.diagram.selection, true);
            // if (!ok) grp.diagram.currentTool.doCancel();
          },
        },
        Make(
          go.TextBlock,
          {
            alignment: go.Spot.TopCenter,
            font: "bold 9px sans-serif",
          },
          new go.Binding("text", "groupText").makeTwoWay(),
          new go.Binding("stroke", "groupTextColor").makeTwoWay()
        ),
        Make(
          go.Shape,
          {
            name: "GroupShape",
            fill: "#ccc",
            stroke: "transparent",
            minSize: new go.Size(20, 20),
          },
          new go.Binding("stroke", "st")
        )
      );

      // 提示框信息
      function nodeInfo(data) {
        let angle = data.angle ? data.angle : "无";
        let info = `节点(key) :${data.key}
                        设备号 :${data.text}
                        产线区域 :${data.carryType}
                        产线编码 :${data.ctrlCode}
                        位置 :${data.loc}
                        角度 :${angle}
                        货位号:${data.rackCode}
                        `;
        return info;
      }

      // 通过在此绑定转换器中使用不同的形状来显示不同类型的端口配件
      function portFigure(pid) {
        if (pid === null || pid === "") return "XLine";
        if (pid[0] === "T") return "";
        if (pid[0] === "F") return "CircleLine";
        if (pid[0] === "M") return "PlusLine";
        return "XLine"; // 包括第一个字符是 'U' 时
      }

      // 更改与给定节点连接的节点的角度
      window.rotate = function (node, angle) {
        const tool = myDiagram.toolManager.draggingTool; // 捕捉工具
        myDiagram.startTransaction("rotate " + angle.toString());
        const sel = new go.Set(/*go.Node*/);
        sel.add(node);
        const coll = tool.computeEffectiveCollection(sel).toKeySet();
        const bounds = myDiagram.computePartsBounds(coll);
        const center = bounds.center;
        coll.each((n) => {
          n.angle += angle;
          n.location = n.location.copy().subtract(center).rotate(angle).add(center);
        });
        myDiagram.commitTransaction("rotate " + angle.toString());
      };

      myDiagram.nodeTemplate.contextMenu = Make(
        "ContextMenu",
        makeButton("旋转 +90°", function (e, obj) {
          window.rotate(obj.part.adornedPart, 90);
        }),
        makeButton("旋转 -90°", function (e, obj) {
          window.rotate(obj.part.adornedPart, -90);
        }),
        makeButton("旋转 -45°", function (e, obj) {
          window.rotate(obj.part.adornedPart, -45);
        }),
        makeButton("旋转 180°", function (e, obj) {
          window.rotate(obj.part.adornedPart, 180);
        }),
        // makeButton("分离", function (e, obj) {
        //   detachSelection();
        // }),
        makeButton(
          "剪切",
          function (e, obj) {
            e.diagram.commandHandler.cutSelection();
          },
          function (o) {
            return o.diagram.commandHandler.canCutSelection();
          }
        ),
        makeButton(
          "复制",
          function (e, obj) {
            e.diagram.commandHandler.copySelection();
          },
          function (o) {
            return o.diagram.commandHandler.canCopySelection();
          }
        ),
        makeButton(
          "粘贴",
          function (e, obj) {
            e.diagram.commandHandler.pasteSelection(
              e.diagram.toolManager.contextMenuTool.mouseDownPoint
            );
          },
          function (o) {
            return o.diagram.commandHandler.canPasteSelection(
              o.diagram.toolManager.contextMenuTool.mouseDownPoint
            );
          }
        ),
        makeButton(
          "删除",
          function (e, obj) {
            e.diagram.commandHandler.deleteSelection();
          },
          function (o) {
            return o.diagram.commandHandler.canDeleteSelection();
          }
        ),
        makeButton(
          "回退",
          function (e, obj) {
            e.diagram.commandHandler.undo();
          },
          function (o) {
            return o.diagram.commandHandler.canUndo();
          }
        ),
        makeButton(
          "Redo",
          function (e, obj) {
            e.diagram.commandHandler.redo();
          },
          function (o) {
            return o.diagram.commandHandler.canRedo();
          }
        )
      );

      // function detachSelection() {
      //   myDiagram.startTransaction("detach");
      //   const coll = new go.Set(/*go.Link*/);
      //   myDiagram.selection.each((node) => {
      //     if (!(node instanceof go.Node)) return;
      //     node.linksConnected.each((link) => {
      //       if (link.category !== "") return;
      //       // 忽略连接其他节点
      //       if (link.getOtherNode(node).isSelected) return;
      //       // 断开连接
      //       coll.add(link);
      //     });
      //   });
      //   myDiagram.removeParts(coll, false);
      //   myDiagram.commitTransaction("detach");
      // }

      // 没有任何链接数据的可视化表示
      myDiagram.linkTemplate = Make(go.Link, { visible: false });

      // 支持从Comment节点到管道节点的可选链接
      myDiagram.linkTemplateMap.add(
        "Comment",
        Make(
          go.Link,
          { curve: go.Link.Bezier },
          Make(go.Shape, { stroke: "brown", strokeWidth: 2 }),
          Make(go.Shape, { toArrow: "OpenTriangle", stroke: "brown" })
        )
      );

      // 该模型需要确定的特定节点
      myDiagram.model = new go.GraphLinksModel({
        copiesArrays: true,
        copiesArrayObjects: true,
        linkFromPortIdProperty: "fid",
        linkToPortIdProperty: "tid",
      });

      // 确保通过palette清单中的key对 '生产线'模型 进行排序（如果要根据模型数据上的某些属性对组件面板中的零件进行排序）
      function keyCompare(a, b) {
        const at = a.data.key;
        const bt = b.data.key;
        if (at < bt) return -1;
        if (at > bt) return 1;
        return 0;
      }

      //常规物流先 edit by wanghao 2023-12-01
      function createSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        let outBox = `F M 0 0 h ${width} v ${length} h ${-width} l ${interval} ${
          -length / 2
        } l ${-interval}  ${-length / 2} z v ${contact_h} l ${interval - 2}  ${
          (length - 8) / 2
        } l ${-(interval - 2)} ${(length - 8) / 2} v ${contact_h} z`;

        let innerBox = `M ${interval} ${boxSize} h ${width - (interval + boxSize)} v ${
          length - boxSize * 2
        } h  ${-(width - (interval + boxSize))}  z`;
        let direction1 = `m ${dirSiz} 0 h ${
          boxSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -boxSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;

        //let direction = `m ${dirSiz+boxSize} 0 h ${boxSize} v ${length-boxSize*2} h ${-boxSize} z`
        let direction = `m ${dirSiz + boxSize} 0 h ${
          boxSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -boxSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }
      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createStartContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        //let outBox = `F M 0 ${boxSize} h ${length} v ${-boxSize} h ${width-length} v ${length} h ${-width} z  M 0 ${boxSize} h ${boxSize} l ${interval-boxSize} ${(length-boxSize*2)/2} l ${-(interval-boxSize)} ${(length-boxSize*2)/2} h ${-boxSize} l ${(interval-boxSize)} ${-(length-boxSize*2)/2} z `

        let outBox = `F M 0 ${boxSize} v ${length - boxSize} h ${width} v ${-length} h ${
          -width + length
        } v ${boxSize} z M 0 ${boxSize} h ${boxSize} l ${interval - boxSize} ${
          (length - boxSize * 2) / 2
        } l ${-(interval - boxSize)} ${(length - boxSize * 2) / 2} h ${-boxSize} l ${
          interval - boxSize
        } ${-(length - boxSize * 2) / 2} z `;
        let innerBox = `M ${interval} ${boxSize} h ${width - (interval + boxSize)} v ${
          length - boxSize * 2
        } h  ${-(width - (interval + boxSize))}  z`;
        let direction1 = `m ${dirSiz} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;
        //let direction = `m ${dirSiz+boxSize} 0 h ${boxSize} v ${length-boxSize*2} h ${-boxSize} z`
        let direction = `m ${dirSiz + cellSize} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createStartDoubleContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        //let outBox = `F M 0 ${boxSize} h ${length} v ${-boxSize} h ${width-length} v ${length} h ${-width+length} v ${-boxSize} h ${-length} z  M 0 ${boxSize} h ${boxSize} l ${interval-boxSize} ${(length-boxSize*2)/2} l ${-(interval-boxSize)} ${(length-boxSize*2)/2} h ${-boxSize} l ${(interval-boxSize)} ${-(length-boxSize*2)/2} z `

        let outBox = `F M 0 ${boxSize}  v ${
          length - boxSize * 2
        } h ${length} v ${boxSize}  h ${width - length} v ${-length} h ${
          -width + length
        } v ${boxSize} z  M 0 ${boxSize} h ${boxSize} l ${interval - boxSize} ${
          (length - boxSize * 2) / 2
        } l ${-(interval - boxSize)} ${(length - boxSize * 2) / 2} h ${-boxSize} l ${
          interval - boxSize
        } ${-(length - boxSize * 2) / 2} z `;
        let innerBox = `M ${interval} ${boxSize} h ${width - (interval + boxSize)} v ${
          length - boxSize * 2
        } h  ${-(width - (interval + boxSize))}  z`;
        let direction1 = `m ${dirSiz} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;
        //let direction = `m ${dirSiz+boxSize} 0 h ${boxSize} v ${length-boxSize*2} h ${-boxSize} z`
        let direction = `m ${dirSiz + cellSize} 0 h ${
          boxSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createStartBottomContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        //let outBox = `F M 0 0  h ${width} v ${length}  h ${-width+length} v ${-boxSize} h ${-length} z  M 0 ${boxSize} h ${boxSize} l ${interval-boxSize} ${(length-boxSize*2)/2} l ${-(interval-boxSize)} ${(length-boxSize*2)/2} h ${-boxSize} l ${(interval-boxSize)} ${-(length-boxSize*2)/2} z `
        let outBox = `F M 0 0 v ${length - boxSize} h ${length} v ${boxSize} h ${
          width - length
        } v ${-length}  z  M 0 ${boxSize} h ${boxSize} l ${interval - boxSize} ${
          (length - boxSize * 2) / 2
        } l ${-(interval - boxSize)} ${(length - boxSize * 2) / 2} h ${-boxSize} l ${
          interval - boxSize
        } ${-(length - boxSize * 2) / 2} z `;
        let innerBox = `M ${interval} ${boxSize} h ${width - (interval + boxSize)} v ${
          length - boxSize * 2
        } h  ${-(width - (interval + boxSize))}  z`;
        let direction1 = `m ${dirSiz} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;
        //let direction = `m ${dirSiz+boxSize} 0 h ${boxSize} v ${length-boxSize*2} h ${-boxSize} z`
        let direction = `m ${dirSiz + cellSize} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createFullContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        // let outBox = `F M 0 0  h ${width} v ${length}  h ${-width}  v ${-length} z  M 0 ${boxSize} h ${boxSize} l ${interval-boxSize} ${(length-boxSize*2)/2} l ${-(interval-boxSize)} ${(length-boxSize*2)/2} h ${-boxSize} l ${(interval-boxSize)} ${-(length-boxSize*2)/2} z `

        let outBox = `F M 0 0 v ${length} h ${width} v ${-length}  z  M 0 ${boxSize} h ${boxSize} l ${
          interval - boxSize
        } ${(length - boxSize * 2) / 2} l ${-(interval - boxSize)} ${
          (length - boxSize * 2) / 2
        } h ${-boxSize} l ${interval - boxSize} ${-(length - boxSize * 2) / 2} z `;
        let innerBox = `M ${interval} ${boxSize} h ${width - (interval + boxSize)} v ${
          length - boxSize * 2
        } h  ${-(width - (interval + boxSize))}  z`;
        let direction1 = ` m ${dirSiz} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z `;
        //let direction = `m ${dirSiz+boxSize} 0 h ${boxSize} v ${length-boxSize*2} h ${-boxSize} z`
        let direction = `m ${dirSiz + cellSize} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //竖直方向 edit by wanghao 2023-12-04
      function createVerticalFullContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        let outBox = `F M 0 0  h ${length} v ${width}  h ${-length}  v ${-width} z M ${boxSize} 0 v ${boxSize} l ${
          (length - boxSize * 2) / 2
        } ${interval - boxSize} l ${(length - boxSize * 2) / 2} ${-(
          interval - boxSize
        )} v ${-boxSize} l ${-(length - boxSize * 2) / 2} ${interval - boxSize} z`;
        let innerBox = ` M ${boxSize} ${interval} v ${width - (interval + boxSize)} h ${
          length - boxSize * 2
        } v  ${-(width - (interval + boxSize))}  z `;
        let direction1 = ` m 0 ${dirSiz} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z `;
        let direction = ` m 0 ${dirSiz + cellSize} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z `;
        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;
        return containerBox;
      }

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createVerticalStartContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        let outBox = `F M ${boxSize} 0 h ${
          length - boxSize
        } v ${width}   h ${-length} v ${
          -width + length
        } h ${boxSize} z  M ${boxSize} 0 v ${boxSize} l ${(length - boxSize * 2) / 2} ${
          interval - boxSize
        } l ${(length - boxSize * 2) / 2} ${-(interval - boxSize)} v ${-boxSize} l ${
          -(length - boxSize * 2) / 2
        } ${interval - boxSize}  z `;

        //let outBox = `F M ${boxSize} 0 v ${length} h ${-boxSize} v ${width-length} h ${length} v ${-width} z  M ${boxSize} 0 v ${boxSize} l ${(length-boxSize*2)/2} ${interval-boxSize} l ${(length-boxSize*2)/2} ${-(interval-boxSize)} v ${-boxSize} l ${-(length-boxSize*2)/2} ${(interval-boxSize)}  z `
        let innerBox = `M ${boxSize} ${interval}  v ${width - (interval + boxSize)} h ${
          length - boxSize * 2
        } v  ${-(width - (interval + boxSize))}  z`;
        let direction1 = `m 0 ${dirSiz} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;
        let direction = `m 0 ${dirSiz + cellSize} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;
        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createVerticalStartBottomContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        //let outBox =  `F M 0 0  v ${width} h ${length}  v ${-width+length} h ${-boxSize} v ${-length} z  M ${boxSize} 0 v ${boxSize} l ${(length-boxSize*2)/2} ${interval-boxSize} l ${(length-boxSize*2)/2} ${-(interval-boxSize)} v ${-boxSize} l ${-(length-boxSize*2)/2} ${(interval-boxSize)} z `
        let outBox = `F M 0 0  h ${length - boxSize}  v ${length} h ${boxSize} v ${
          width - length
        } h ${-length} z  M ${boxSize} 0 v ${boxSize} l ${(length - boxSize * 2) / 2} ${
          interval - boxSize
        } l ${(length - boxSize * 2) / 2} ${-(interval - boxSize)} v ${-boxSize} l ${
          -(length - boxSize * 2) / 2
        } ${interval - boxSize} z `;
        let innerBox = `M ${boxSize} ${interval} v ${width - (interval + boxSize)} h ${
          length - boxSize * 2
        } v  ${-(width - (interval + boxSize))}  z`;
        let direction1 = `m 0 ${dirSiz} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;
        //let direction = `m ${dirSiz+boxSize} 0 h ${boxSize} v ${length-boxSize*2} h ${-boxSize} z`
        let direction = `m 0 ${dirSiz + cellSize} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createVerticalStartDoubleContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        //  let outBox = `F M ${boxSize} 0 v ${length} h ${-boxSize} v ${width-length} h ${length} v ${-width+length} h ${-boxSize} v ${-length} z  M ${boxSize} 0 v ${boxSize} l ${(length-boxSize*2)/2} ${interval-boxSize} l ${(length-boxSize*2)/2} ${-(interval-boxSize)} v ${-boxSize} l ${-(length-boxSize*2)/2} ${(interval-boxSize)} z `

        let outBox = `F M ${boxSize} 0 h ${
          length - boxSize * 2
        } v ${length} h ${boxSize} v ${width - length}  h ${-length} v ${
          -width + length
        } h ${boxSize}  z  M ${boxSize} 0 v ${boxSize} l ${(length - boxSize * 2) / 2} ${
          interval - boxSize
        } l ${(length - boxSize * 2) / 2} ${-(interval - boxSize)} v ${-boxSize} l ${
          -(length - boxSize * 2) / 2
        } ${interval - boxSize} z `;
        let innerBox = `M ${boxSize} ${interval}  v ${width - (interval + boxSize)} h ${
          length - boxSize * 2
        } v  ${-(width - (interval + boxSize))}  z`;
        let direction1 = `m 0 ${dirSiz} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;
        let direction = `m 0 ${dirSiz + cellSize} v ${
          boxSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //竖直方向下开口 begin

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createVerticalEndTopContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        //let outBox = `F M 0 0  v ${width-length} h ${boxSize} v ${length} h ${length-boxSize}  v ${-width}  h ${-length} z  M ${boxSize} 0 v ${boxSize} l ${(length-boxSize*2)/2} ${interval-boxSize} l ${(length-boxSize*2)/2} ${-(interval-boxSize)} v ${-boxSize} l ${-(length-boxSize*2)/2} ${(interval-boxSize)} z `
        let outBox = `F M 0 0  h ${length} v ${width} h ${
          -length + boxSize
        } v ${-length} h ${-boxSize} z  M ${boxSize} 0 v ${boxSize} l ${
          (length - boxSize * 2) / 2
        } ${interval - boxSize} l ${(length - boxSize * 2) / 2} ${-(
          interval - boxSize
        )} v ${-boxSize} l ${-(length - boxSize * 2) / 2} ${interval - boxSize} z `;

        let innerBox = `M ${boxSize} ${interval} v ${width - (interval + boxSize)} h ${
          length - boxSize * 2
        } v  ${-(width - (interval + boxSize))}  z`;

        let direction1 = `m 0 ${dirSiz} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;

        let direction = `m 0 ${dirSiz + cellSize} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createVerticalEndBottomContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        //let outBox = `F M 0 0  v ${width} h ${length-boxSize}  v ${-length}  h ${boxSize} v ${-(width-length)} z  M ${boxSize} 0 v ${boxSize} l ${(length-boxSize*2)/2} ${interval-boxSize} l ${(length-boxSize*2)/2} ${-(interval-boxSize)} v ${-boxSize} l ${-(length-boxSize*2)/2} ${(interval-boxSize)} z `
        let outBox = `F M 0 0 h ${length} v ${
          width - length
        } h ${-boxSize} v ${length}  h ${
          -length + boxSize
        } z  M ${boxSize} 0 v ${boxSize} l ${(length - boxSize * 2) / 2} ${
          interval - boxSize
        } l ${(length - boxSize * 2) / 2} ${-(interval - boxSize)} v ${-boxSize} l ${
          -(length - boxSize * 2) / 2
        } ${interval - boxSize} z `;

        let innerBox = `M  ${boxSize} ${interval} v ${width - (interval + boxSize)} h ${
          length - boxSize * 2
        } v  ${-(width - (interval + boxSize))}  z`;

        let direction1 = `m 0 ${dirSiz} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;

        let direction = `m 0 ${dirSiz + cellSize} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createVerticalEndDoubleContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        //let outBox = `F M 0 0 v ${width-length} h ${boxSize} v ${length} h ${length-boxSize*2}  v ${-length}  h ${boxSize} v ${-(width-length)} z  M ${boxSize} 0 v ${boxSize} l ${(length-boxSize*2)/2} ${interval-boxSize} l ${(length-boxSize*2)/2} ${-(interval-boxSize)} v ${-boxSize} l ${-(length-boxSize*2)/2} ${(interval-boxSize)} z `

        let outBox = `F M 0 0 h ${length} v ${
          width - length
        } h ${-boxSize} v ${length} h ${
          -length + boxSize * 2
        }  v ${-length}  h ${-boxSize}  z  M ${boxSize} 0 v ${boxSize} l ${
          (length - boxSize * 2) / 2
        } ${interval - boxSize} l ${(length - boxSize * 2) / 2} ${-(
          interval - boxSize
        )} v ${-boxSize} l ${-(length - boxSize * 2) / 2} ${interval - boxSize} z `;
        let innerBox = `M ${boxSize} ${interval} v ${width - (interval + boxSize)} h ${
          length - boxSize * 2
        } v  ${-(width - (interval + boxSize))}  z`;

        let direction1 = `m 0 ${dirSiz} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;
        let direction = `m 0 ${dirSiz + cellSize} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //竖直方向下开口 end

      //竖直方向箭头向上 begin ================================================================================================================================

      //竖直方向 edit by wanghao 2023-12-04
      function createDirTopVerticalFullContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        let outBox = `F M 0 0  h ${length} v ${width}  h ${-length}  v ${-width} z  M ${boxSize} ${width} l ${
          (length - boxSize * 2) / 2
        } ${-interval + boxSize} l ${(length - boxSize * 2) / 2} ${
          interval - boxSize
        } v  ${-boxSize} l ${-(length - boxSize * 2) / 2} ${-interval + boxSize} l ${
          -(length - boxSize * 2) / 2
        } ${interval - boxSize} z`;
        let innerBox = `M ${boxSize} ${boxSize} v ${width - (interval + boxSize)} h ${
          length - boxSize * 2
        } v  ${-(width - (interval + boxSize))}  z`;
        let direction1 = ` m 0 ${dirSiz} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z `;
        let direction = ` m 0 ${dirSiz + cellSize} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z `;
        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;
        return containerBox;
      }

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createDirTopVerticalStartContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        //let outBox = `F M ${boxSize} 0 v ${length} h ${-boxSize} v ${width-length} h ${length} v ${-width} z  M ${boxSize} ${width} l ${(length-boxSize*2)/2} ${-interval+boxSize} l ${(length-boxSize*2)/2} ${interval-boxSize} v  ${-boxSize} l ${-(length-boxSize*2)/2} ${-interval+boxSize} l ${-(length-boxSize*2)/2} ${interval-boxSize} zX`

        let outBox = `F M ${boxSize} 0 h ${length - boxSize} v ${width} h ${-length} v ${
          -width + length
        } h ${boxSize} z  M ${boxSize} ${width} l ${(length - boxSize * 2) / 2} ${
          -interval + boxSize
        } l ${(length - boxSize * 2) / 2} ${interval - boxSize} v  ${-boxSize} l ${
          -(length - boxSize * 2) / 2
        } ${-interval + boxSize} l ${-(length - boxSize * 2) / 2} ${
          interval - boxSize
        } z`;
        let innerBox = `M ${boxSize} ${boxSize}  v ${width - (interval + boxSize)} h ${
          length - boxSize * 2
        } v  ${-(width - (interval + boxSize))}  z`;
        let direction1 = `m 0 ${dirSiz} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;
        let direction = `m 0 ${dirSiz + cellSize} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;
        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createDirTopVerticalStartBottomContactSvgPath(
        createCount = 6,
        length = 30
      ) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        //let outBox =  `F M 0 0  v ${width} h ${length}  v ${-width+length} h ${-boxSize} v ${-length} z  M ${boxSize} ${width} l ${(length-boxSize*2)/2} ${-interval+boxSize} l ${(length-boxSize*2)/2} ${interval-boxSize} v  ${-boxSize} l ${-(length-boxSize*2)/2} ${-interval+boxSize} l ${-(length-boxSize*2)/2} ${interval-boxSize} zX`
        let outBox = `F M 0 0 h ${length - boxSize} v ${length} h ${boxSize}  v ${
          width - length
        } h ${-length} z  M ${boxSize} ${width} l ${(length - boxSize * 2) / 2} ${
          -interval + boxSize
        } l ${(length - boxSize * 2) / 2} ${interval - boxSize} v  ${-boxSize} l ${
          -(length - boxSize * 2) / 2
        } ${-interval + boxSize} l ${-(length - boxSize * 2) / 2} ${
          interval - boxSize
        } z`;

        let innerBox = `M ${boxSize} ${boxSize} v ${width - (interval + boxSize)} h ${
          length - boxSize * 2
        } v  ${-(width - (interval + boxSize))}  z`;

        let direction1 = `m 0 ${dirSiz} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;

        //let direction = `m ${dirSiz+boxSize} 0 h ${boxSize} v ${length-boxSize*2} h ${-boxSize} z`
        let direction = `m 0 ${dirSiz + cellSize} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createDirTopVerticalStartDoubleContactSvgPath(
        createCount = 6,
        length = 30
      ) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        //let outBox = `F M ${boxSize} 0 v ${length} h ${-boxSize} v ${width-length} h ${length} v ${-width+length} h ${-boxSize} v ${-length} z   M ${boxSize} ${width} l ${(length-boxSize*2)/2} ${-interval+boxSize} l ${(length-boxSize*2)/2} ${interval-boxSize} v  ${-boxSize} l ${-(length-boxSize*2)/2} ${-interval+boxSize} l ${-(length-boxSize*2)/2} ${interval-boxSize} zX`

        let outBox = `F M ${boxSize} 0 h ${
          length - 2 * boxSize
        } v ${length} h ${boxSize}  v ${width - length} h ${-length} v ${
          -width + length
        }  h ${boxSize}  z   M ${boxSize} ${width} l ${(length - boxSize * 2) / 2} ${
          -interval + boxSize
        } l ${(length - boxSize * 2) / 2} ${interval - boxSize} v  ${-boxSize} l ${
          -(length - boxSize * 2) / 2
        } ${-interval + boxSize} l ${-(length - boxSize * 2) / 2} ${
          interval - boxSize
        } z`;
        let innerBox = `M ${boxSize} ${boxSize}  v ${width - (interval + boxSize)} h ${
          length - boxSize * 2
        } v  ${-(width - (interval + boxSize))}  z`;
        let direction1 = `m 0 ${dirSiz} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;
        let direction = `m 0 ${dirSiz + cellSize} v ${
          boxSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //开口向上

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createDirTopVerticalEndTopContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        // let outBox = `F M 0 0  v ${width-length} h ${boxSize} v ${length} h ${length-boxSize}  v ${-width}  h ${-length} z M ${boxSize} ${width} l ${(length-boxSize*2)/2} ${-interval+boxSize} l ${(length-boxSize*2)/2} ${interval-boxSize} v  ${-boxSize} l ${-(length-boxSize*2)/2} ${-interval+boxSize} l ${-(length-boxSize*2)/2} ${interval-boxSize} zX `

        let outBox = `F M 0 0  h ${length} v ${width} h ${
          -length + boxSize
        } v ${-length}  h ${-boxSize} z M ${boxSize} ${width} l ${
          (length - boxSize * 2) / 2
        } ${-interval + boxSize} l ${(length - boxSize * 2) / 2} ${
          interval - boxSize
        } v  ${-boxSize} l ${-(length - boxSize * 2) / 2} ${-interval + boxSize} l ${
          -(length - boxSize * 2) / 2
        } ${interval - boxSize} z `;
        let innerBox = `M ${boxSize} ${boxSize} v ${width - (interval + boxSize)} h ${
          length - boxSize * 2
        } v  ${-(width - (interval + boxSize))}  z`;
        let direction1 = `m 0 ${dirSiz} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;

        let direction = `m 0 ${dirSiz + cellSize} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createDirTopVerticalEndBottomContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        //let outBox = `F M 0 0  v ${width} h ${length-boxSize}  v ${-length}  h ${boxSize} v ${-(width-length)} z M ${boxSize} ${width} l ${(length-boxSize*2)/2} ${-interval+boxSize} l ${(length-boxSize*2)/2} ${interval-boxSize} v  ${-boxSize} l ${-(length-boxSize*2)/2} ${-interval+boxSize} l ${-(length-boxSize*2)/2} ${interval-boxSize} zX `
        let outBox = `F M 0 0 h ${length} v ${
          width - length
        } h ${-boxSize} v ${length} h ${-length + boxSize}  z M ${boxSize} ${width} l ${
          (length - boxSize * 2) / 2
        } ${-interval + boxSize} l ${(length - boxSize * 2) / 2} ${
          interval - boxSize
        } v  ${-boxSize} l ${-(length - boxSize * 2) / 2} ${-interval + boxSize} l ${
          -(length - boxSize * 2) / 2
        } ${interval - boxSize} z `;

        let innerBox = `M  ${boxSize} ${boxSize} v ${width - (interval + boxSize)} h ${
          length - boxSize * 2
        } v  ${-(width - (interval + boxSize))}  z`;

        let direction1 = `m 0 ${dirSiz} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;

        let direction = `m 0 ${dirSiz + cellSize} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createDirTopVerticalEndDoubleContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        //let outBox = `F M 0 0 v ${width-length} h ${boxSize} v ${length} h ${length-boxSize*2}  v ${-length}  h ${boxSize} v ${-(width-length)} z M ${boxSize} ${width} l ${(length-boxSize*2)/2} ${-interval+boxSize} l ${(length-boxSize*2)/2} ${interval-boxSize} v  ${-boxSize} l ${-(length-boxSize*2)/2} ${-interval+boxSize} l ${-(length-boxSize*2)/2} ${interval-boxSize} zX `

        let outBox = `F M 0 0  h ${length} v ${
          width - length
        }  h ${-boxSize} v ${length} h ${
          -length + boxSize * 2
        }  v ${-length}  h ${-boxSize}  z M ${boxSize} ${width} l ${
          (length - boxSize * 2) / 2
        } ${-interval + boxSize} l ${(length - boxSize * 2) / 2} ${
          interval - boxSize
        } v  ${-boxSize} l ${-(length - boxSize * 2) / 2} ${-interval + boxSize} l ${
          -(length - boxSize * 2) / 2
        } ${interval - boxSize} z `;
        let innerBox = `M ${boxSize} ${boxSize} v ${width - (interval + boxSize)} h ${
          length - boxSize * 2
        } v  ${-(width - (interval + boxSize))}  z`;

        let direction1 = `m 0 ${dirSiz} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;
        let direction = `m 0 ${dirSiz + cellSize} v ${
          cellSize - contact_w
        } h ${contact_h} v ${contact_w} h ${
          length - (boxSize + contact_h) * 2
        } v ${-contact_w} h ${contact_h}  v ${
          -cellSize + contact_w * 2
        } h ${-contact_h} v ${-contact_w} h ${-(
          length -
          (boxSize + contact_h) * 2
        )} v ${contact_w} h ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //竖直方向箭头向上 end ===================================================================================================================================================================================

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createEndTopContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        //let outBox = `F M 0 0  h ${width-length} v ${boxSize} h ${length} v ${length-boxSize}  h ${-width}  v ${-length} z  M 0 ${boxSize} h ${boxSize} l ${interval-boxSize} ${(length-boxSize*2)/2} l ${-(interval-boxSize)} ${(length-boxSize*2)/2} h ${-boxSize} l ${(interval-boxSize)} ${-(length-boxSize*2)/2} z `

        let outBox = `F M 0 0  v ${length} h ${width} v ${
          -length + boxSize
        } h ${-length} v ${-boxSize} z M 0 ${boxSize} h ${boxSize} l ${
          interval - boxSize
        } ${(length - boxSize * 2) / 2} l ${-(interval - boxSize)} ${
          (length - boxSize * 2) / 2
        } h ${-boxSize} l ${interval - boxSize} ${-(length - boxSize * 2) / 2} z `;
        let innerBox = `M ${interval} ${boxSize} h ${width - (interval + boxSize)} v ${
          length - boxSize * 2
        } h  ${-(width - (interval + boxSize))}  z`;
        let direction1 = `m ${dirSiz} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;
        //let direction = `m ${dirSiz+boxSize} 0 h ${boxSize} v ${length-boxSize*2} h ${-boxSize} z`
        let direction = `m ${dirSiz + cellSize} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createEndBottomContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        // let outBox = `F M 0 0  h ${width} v ${length-boxSize}  h ${-length}  v ${boxSize} h ${-(width-length)} z M 0 ${boxSize} h ${boxSize} l ${interval-boxSize} ${(length-boxSize*2)/2} l ${-(interval-boxSize)} ${(length-boxSize*2)/2} h ${-boxSize} l ${(interval-boxSize)} ${-(length-boxSize*2)/2} z `

        let outBox = `F M 0 0 v ${length} h ${
          width - length
        }  v ${-boxSize}  h ${length}  v ${
          -length + boxSize
        } z M 0 ${boxSize} h ${boxSize} l ${interval - boxSize} ${
          (length - boxSize * 2) / 2
        } l ${-(interval - boxSize)} ${(length - boxSize * 2) / 2} h ${-boxSize} l ${
          interval - boxSize
        } ${-(length - boxSize * 2) / 2} z `;
        let innerBox = `M ${interval} ${boxSize} h ${width - (interval + boxSize)} v ${
          length - boxSize * 2
        } h  ${-(width - (interval + boxSize))}  z`;
        let direction1 = `m ${dirSiz} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;
        //let direction = `m ${dirSiz+boxSize} 0 h ${boxSize} v ${length-boxSize*2} h ${-boxSize} z`
        let direction = `m ${dirSiz + cellSize} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createEndDoubleContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        //let outBox = `F M 0 0 h ${width-length} v ${boxSize} h ${length} v ${length-boxSize*2}  h ${-length}  v ${boxSize} h ${-(width-length)} z  M 0 ${boxSize} h ${boxSize} l ${interval-boxSize} ${(length-boxSize*2)/2} l ${-(interval-boxSize)} ${(length-boxSize*2)/2} h ${-boxSize} l ${(interval-boxSize)} ${-(length-boxSize*2)/2} z  `

        let outBox = `F M 0 0 v ${length} h ${
          width - length
        } v ${-boxSize} h ${length} v ${
          -length + boxSize * 2
        }  h ${-length}  v ${-boxSize} z  M 0 ${boxSize} h ${boxSize} l ${
          interval - boxSize
        } ${(length - boxSize * 2) / 2} l ${-(interval - boxSize)} ${
          (length - boxSize * 2) / 2
        } h ${-boxSize} l ${interval - boxSize} ${-(length - boxSize * 2) / 2} z  `;
        let innerBox = `M ${interval} ${boxSize} h ${width - (interval + boxSize)} v ${
          length - boxSize * 2
        } h  ${-(width - (interval + boxSize))}  z`;
        let direction1 = `m ${dirSiz} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;
        //let direction = `m ${dirSiz+boxSize} 0 h ${boxSize} v ${length-boxSize*2} h ${-boxSize} z`
        let direction = `m ${dirSiz + cellSize} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //创建单叉堆垛机

      //处理箭头向左 begin ===============================================================================================================================

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createDirLeftFullContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        //let outBox = `F M 0 0  h ${width} v ${length}  h ${-width}  v ${-length} z  M  ${width} ${boxSize} l ${-interval+boxSize} ${(length-boxSize*2)/2} l ${interval-boxSize} ${(length-boxSize*2)/2} h ${-boxSize} l  ${-interval+boxSize} ${-(length-boxSize*2)/2} l ${interval-boxSize} ${-(length-boxSize*2)/2} z`

        let outBox = `F M 0 0  v ${length}  h ${width} v ${-length}   z  M  ${width} ${boxSize} l ${
          -interval + boxSize
        } ${(length - boxSize * 2) / 2} l ${interval - boxSize} ${
          (length - boxSize * 2) / 2
        } h ${-boxSize} l  ${-interval + boxSize} ${-(length - boxSize * 2) / 2} l ${
          interval - boxSize
        } ${-(length - boxSize * 2) / 2} z`;
        let innerBox = `M ${boxSize} ${boxSize} h ${width - (interval + boxSize)} v ${
          length - boxSize * 2
        } h  ${-(width - (interval + boxSize))}  z`;
        let direction1 = ` m ${dirSiz} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z `;
        //let direction = `m ${dirSiz+boxSize} 0 h ${boxSize} v ${length-boxSize*2} h ${-boxSize} z`
        let direction = `m ${dirSiz + cellSize} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z `;
        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createDirLeftStartContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        // let outBox = `F M 0 ${boxSize} h ${length} v ${-boxSize} h ${width-length} v ${length} h ${-width} z  M  ${width} ${boxSize} l ${-interval+boxSize} ${(length-boxSize*2)/2} l ${interval-boxSize} ${(length-boxSize*2)/2} h ${-boxSize} l  ${-interval+boxSize} ${-(length-boxSize*2)/2} l ${interval-boxSize} ${-(length-boxSize*2)/2} z`

        let outBox = `F M 0 ${boxSize} v ${length - boxSize} h ${width}  v ${-length} h ${
          -width + length
        } v ${boxSize} z  M  ${width} ${boxSize} l ${-interval + boxSize} ${
          (length - boxSize * 2) / 2
        } l ${interval - boxSize} ${(length - boxSize * 2) / 2} h ${-boxSize} l  ${
          -interval + boxSize
        } ${-(length - boxSize * 2) / 2} l ${interval - boxSize} ${
          -(length - boxSize * 2) / 2
        } z`;
        let innerBox = `M ${boxSize} ${boxSize} h ${width - (interval + boxSize)} v ${
          length - boxSize * 2
        } h  ${-(width - (interval + boxSize))}  z`;
        let direction1 = `m ${dirSiz} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;
        //let direction = `m ${dirSiz+boxSize} 0 h ${boxSize} v ${length-boxSize*2} h ${-boxSize} z`
        let direction = `m ${dirSiz + cellSize} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createDirLeftStartDoubleContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        //let outBox = `F M 0 ${boxSize} h ${length} v ${-boxSize} h ${width-length} v ${length} h ${-width+length} v ${-boxSize} h ${-length} z M  ${width} ${boxSize} l ${-interval+boxSize} ${(length-boxSize*2)/2} l ${interval-boxSize} ${(length-boxSize*2)/2} h ${-boxSize} l  ${-interval+boxSize} ${-(length-boxSize*2)/2} l ${interval-boxSize} ${-(length-boxSize*2)/2} z `

        let outBox = `F M 0 ${boxSize} v ${
          length - 2 * boxSize
        } h ${length} v ${boxSize} h ${width - length} v ${-length} h ${
          -width + length
        } v ${boxSize} z M  ${width} ${boxSize} l ${-interval + boxSize} ${
          (length - boxSize * 2) / 2
        } l ${interval - boxSize} ${(length - boxSize * 2) / 2} h ${-boxSize} l  ${
          -interval + boxSize
        } ${-(length - boxSize * 2) / 2} l ${interval - boxSize} ${
          -(length - boxSize * 2) / 2
        } z `;
        let innerBox = `M ${boxSize} ${boxSize} h ${width - (interval + boxSize)} v ${
          length - boxSize * 2
        } h  ${-(width - (interval + boxSize))}  z`;
        let direction1 = `m ${dirSiz} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;
        //let direction = `m ${dirSiz+boxSize} 0 h ${boxSize} v ${length-boxSize*2} h ${-boxSize} z`
        let direction = `m ${dirSiz + cellSize} 0 h ${
          boxSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createDirLeftStartBottomContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        //let outBox = `F M 0 0  h ${width} v ${length}  h ${-width+length} v ${-boxSize} h ${-length} z  M  ${width} ${boxSize} l ${-interval+boxSize} ${(length-boxSize*2)/2} l ${interval-boxSize} ${(length-boxSize*2)/2} h ${-boxSize} l  ${-interval+boxSize} ${-(length-boxSize*2)/2} l ${interval-boxSize} ${-(length-boxSize*2)/2} z`

        let outBox = `F M 0 0 v ${length - boxSize} h ${length} v ${boxSize}  h ${
          width - length
        } v ${-length}  z  M  ${width} ${boxSize} l ${-interval + boxSize} ${
          (length - boxSize * 2) / 2
        } l ${interval - boxSize} ${(length - boxSize * 2) / 2} h ${-boxSize} l  ${
          -interval + boxSize
        } ${-(length - boxSize * 2) / 2} l ${interval - boxSize} ${
          -(length - boxSize * 2) / 2
        } z`;
        let innerBox = `M ${boxSize} ${boxSize} h ${width - (interval + boxSize)} v ${
          length - boxSize * 2
        } h  ${-(width - (interval + boxSize))}  z`;
        let direction1 = `m ${dirSiz} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;
        //let direction = `m ${dirSiz+boxSize} 0 h ${boxSize} v ${length-boxSize*2} h ${-boxSize} z`
        let direction = `m ${dirSiz + cellSize} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createDirLeftEndTopContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        //let outBox = `F M 0 0  h ${width-length} v ${boxSize} h ${length} v ${length-boxSize}  h ${-width}  v ${-length} z  M  ${width} ${boxSize} l ${-interval+boxSize} ${(length-boxSize*2)/2} l ${interval-boxSize} ${(length-boxSize*2)/2} h ${-boxSize} l  ${-interval+boxSize} ${-(length-boxSize*2)/2} l ${interval-boxSize} ${-(length-boxSize*2)/2} z`

        let outBox = `F M 0 0 v ${length}   h ${width} v ${
          -length + boxSize
        } h ${-length} v ${-boxSize}  z  M  ${width} ${boxSize} l ${
          -interval + boxSize
        } ${(length - boxSize * 2) / 2} l ${interval - boxSize} ${
          (length - boxSize * 2) / 2
        } h ${-boxSize} l  ${-interval + boxSize} ${-(length - boxSize * 2) / 2} l ${
          interval - boxSize
        } ${-(length - boxSize * 2) / 2} z`;
        let innerBox = `M ${boxSize} ${boxSize} h ${width - (interval + boxSize)} v ${
          length - boxSize * 2
        } h  ${-(width - (interval + boxSize))}  z`;
        let direction1 = `m ${dirSiz} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;
        //let direction = `m ${dirSiz+boxSize} 0 h ${boxSize} v ${length-boxSize*2} h ${-boxSize} z`
        let direction = `m ${dirSiz + cellSize} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createDirLeftEndBottomContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        //let outBox = `F M 0 0  h ${width} v ${length-boxSize}  h ${-length}  v ${boxSize} h ${-(width-length)} z  M  ${width} ${boxSize} l ${-interval+boxSize} ${(length-boxSize*2)/2} l ${interval-boxSize} ${(length-boxSize*2)/2} h ${-boxSize} l  ${-interval+boxSize} ${-(length-boxSize*2)/2} l ${interval-boxSize} ${-(length-boxSize*2)/2} z`

        let outBox = `F M 0 0 v ${length} h ${
          width - length
        } v ${-boxSize}  h ${length}  v ${
          -length + boxSize
        } z  M  ${width} ${boxSize} l ${-interval + boxSize} ${
          (length - boxSize * 2) / 2
        } l ${interval - boxSize} ${(length - boxSize * 2) / 2} h ${-boxSize} l  ${
          -interval + boxSize
        } ${-(length - boxSize * 2) / 2} l ${interval - boxSize} ${
          -(length - boxSize * 2) / 2
        } z`;
        let innerBox = `M ${boxSize} ${boxSize} h ${width - (interval + boxSize)} v ${
          length - boxSize * 2
        } h  ${-(width - (interval + boxSize))}  z`;
        let direction1 = `m ${dirSiz} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;
        //let direction = `m ${dirSiz+boxSize} 0 h ${boxSize} v ${length-boxSize*2} h ${-boxSize} z`
        let direction = `m ${dirSiz + cellSize} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //开始处拼接的物流线 edit by wanghao 2023-12-01
      function createDirLeftEndDoubleContactSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let cellSize = 4;
        let interval = 10;
        let dirSiz = 6;
        let width = interval + boxSize + createCount * 10 + 5;
        let contact_w = 1;
        let contact_h = 4;
        let outBox = `F M 0 0 v ${length} h ${
          width - length
        } v ${-boxSize} h ${length} v ${
          -length + boxSize * 2
        }  h ${-length}  v ${-boxSize} z  M  ${width} ${boxSize} l ${
          -interval + boxSize
        } ${(length - boxSize * 2) / 2} l ${interval - boxSize} ${
          (length - boxSize * 2) / 2
        } h ${-boxSize} l  ${-interval + boxSize} ${-(length - boxSize * 2) / 2} l ${
          interval - boxSize
        } ${-(length - boxSize * 2) / 2} z`;
        let innerBox = `M ${boxSize} ${boxSize} h ${width - (interval + boxSize)} v ${
          length - boxSize * 2
        } h  ${-(width - (interval + boxSize))}  z`;
        let direction1 = `m ${dirSiz} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;
        //let direction = `m ${dirSiz+boxSize} 0 h ${boxSize} v ${length-boxSize*2} h ${-boxSize} z`
        let direction = `m ${dirSiz + cellSize} 0 h ${
          cellSize - contact_w
        } v ${contact_h} h ${contact_w} v ${
          length - (boxSize + contact_h) * 2
        } h ${-contact_w} v ${contact_h}  h ${
          -cellSize + contact_w * 2
        } v ${-contact_h} h ${-contact_w} v ${-(
          length -
          (boxSize + contact_h) * 2
        )} h ${contact_w} v ${-contact_h}  z`;

        let containerBox = `${outBox} ${innerBox} ${direction1}`;
        for (let i = 0; i < createCount - 1; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      //处理箭头向左 end ===============================================================================================================================

      function createSingleStockerSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 5;
        let boxHeight = 60;
        let interval = 5;
        let dirSiz = 10;
        let width = createCount * 10;
        let contact_w = 4;
        let contact_h = 2;
        let outBox = `F M 0 0 h ${dirSiz} v ${-dirSiz * 2} h ${boxSize + dirSiz * 2} v ${
          dirSiz * 2
        } h ${dirSiz * 2} v ${boxHeight / 2 - dirSiz * 2 - interval} h  ${
          width - dirSiz * 2 - boxSize
        } v ${interval}
               h ${-(width - dirSiz * 2 - boxSize)}  v ${
          boxHeight / 2 - dirSiz * 2 - interval
        } h ${-dirSiz * 2} v ${dirSiz * 2} h  ${-(boxSize + dirSiz * 2)} v ${
          -dirSiz * 2
        } h ${-dirSiz} z`;
        let innerBox = `F M ${dirSiz + contact_w} ${
          -dirSiz * 2 + contact_w
        } h ${contact_h} v ${boxHeight - dirSiz - interval} h ${-contact_h} z
                  F M ${dirSiz - contact_w - contact_h + boxSize + dirSiz * 2} ${
          -dirSiz * 2 + contact_w
        } h ${contact_h} v ${boxHeight - dirSiz - interval} h ${-contact_h} z `;
        let containerBox = `${outBox} ${innerBox}`;
        return containerBox;
      }
      //双叉

      function createDoubleStockerSvgPath(createCount = 6, length = 30) {
        //外框
        let boxSize = 20;
        let boxHeight = 60;
        let interval = 5;
        let dirSiz = 10;
        let width = createCount * 10;
        let contact_w = 4;
        let contact_h = 2;
        let outBox = `F M 0 0 h ${dirSiz} v ${-dirSiz * 2} h ${boxSize + dirSiz * 2} v ${
          dirSiz * 2
        } h ${dirSiz * 2} v ${boxHeight / 2 - dirSiz * 2 - interval} h  ${
          width - dirSiz * 2 - boxSize
        } v ${interval}
               h ${-(width - dirSiz * 2 - boxSize)}  v ${
          boxHeight / 2 - dirSiz * 2 - interval
        } h ${-dirSiz * 2} v ${dirSiz * 2} h  ${-(boxSize + dirSiz * 2)} v ${
          -dirSiz * 2
        } h ${-dirSiz} z`;
        let innerBox = `F M ${dirSiz + contact_w} ${
          -dirSiz * 2 + contact_w
        } h ${contact_h} v ${boxHeight - dirSiz - interval} h ${-contact_h} z
                F M ${dirSiz - contact_w - contact_h + boxSize} ${
          -dirSiz * 2 + contact_w
        } h ${contact_h} v ${boxHeight - dirSiz - interval} h ${-contact_h} z
                F m ${dirSiz} 0 h ${contact_h} v ${
          boxHeight - dirSiz - interval
        } h ${-contact_h} z
                F M ${dirSiz - contact_w - contact_h + boxSize + dirSiz * 2} ${
          -dirSiz * 2 + contact_w
        } h ${contact_h} v ${boxHeight - dirSiz - interval} h ${-contact_h} z `;
        let containerBox = `${outBox} ${innerBox}`;
        return containerBox;
      }

      function createSvgPath1(createCount = 34, length = 34) {
        //外框
        let boxSize = 4;
        let interval = 10;
        let dirSiz = 9.6;
        width = 72;

        //width:createCount = 12:1
        if (createCount < 2) createCount = 2;
        let width = createCount * 12; //减去一个系数

        //20*34 = 680
        //34 *l

        let outBox = `F M 0 0 h ${width} l ${interval} ${length / 2} l ${-interval} ${
          length / 2
        } h ${-width} l ${interval} ${-length / 2} z`;
        let innerBox = `m ${boxSize + boxSize / 2} ${boxSize}l h ${
          width - boxSize * 2
        } l ${interval - boxSize / 2} ${(length - boxSize * 2) / 2} l ${
          -interval + boxSize / 2
        } ${(length - boxSize * 2) / 2} h ${-(width - boxSize * 2)} l ${
          interval - boxSize / 2
        } ${-(length - boxSize * 2) / 2} z`;
        let direction = `m ${dirSiz}  0  l ${interval - boxSize / 2} ${
          (length - boxSize * 2) / 2
        } l  ${-interval + boxSize / 2} ${(length - boxSize * 2) / 2} h ${-boxSize} l ${
          interval - boxSize / 2
        } ${-(length - boxSize * 2) / 2}  l  ${-interval + boxSize / 2} ${
          -(length - boxSize * 2) / 2
        } h ${boxSize} z`;
        let containerBox = `${outBox} ${innerBox}`;
        for (let i = 0; i < createCount; i++)
          containerBox = `${containerBox} ${direction}`;

        return containerBox;
      }

      function targgerCellCountEvent(prop, val, inspector) {
        if (prop === "cellCount") {
          let node = inspector.inspectedObject;
          let geo = "";
          if (node.data.converyName == "1102") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createStartContactSvgPath(val)
            );
          } else if (node.data.converyName == "1101") {
            myDiagram.model.setDataProperty(node.data, "geo", createSvgPath(val));
          } else if (node.data.converyName == "1103") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createStartDoubleContactSvgPath(val)
            );
          } else if (node.data.converyName == "1104") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createStartBottomContactSvgPath(val)
            );
          } else if (node.data.converyName == "1105") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createFullContactSvgPath(val)
            );
          } else if (node.data.converyName == "1106") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createEndTopContactSvgPath(val)
            );
          } else if (node.data.converyName == "1107") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createEndBottomContactSvgPath(val)
            );
          } else if (node.data.converyName == "1108") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createEndDoubleContactSvgPath(val)
            );
          } else if (node.data.converyName == "1109") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createVerticalFullContactSvgPath(val)
            );
          } else if (node.data.converyName == "1110") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createVerticalStartContactSvgPath(val)
            );
          } else if (node.data.converyName == "1111") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createVerticalStartBottomContactSvgPath(val)
            );
          } else if (node.data.converyName == "1112") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createVerticalStartDoubleContactSvgPath(val)
            );
          } else if (node.data.converyName == "1113") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createVerticalEndTopContactSvgPath(val)
            );
          } else if (node.data.converyName == "1114") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createVerticalEndBottomContactSvgPath(val)
            );
          } else if (node.data.converyName == "1115") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createVerticalEndDoubleContactSvgPath(val)
            );
          } else if (node.data.converyName == "1116") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createDirTopVerticalFullContactSvgPath(val)
            );
          } else if (node.data.converyName == "1117") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createDirTopVerticalStartContactSvgPath(val)
            );
          } else if (node.data.converyName == "1118") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createDirTopVerticalStartBottomContactSvgPath(val)
            );
          } else if (node.data.converyName == "1119") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createDirTopVerticalStartDoubleContactSvgPath(val)
            );
          } else if (node.data.converyName == "1120") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createDirTopVerticalEndTopContactSvgPath(val)
            );
          } else if (node.data.converyName == "1121") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createDirTopVerticalEndBottomContactSvgPath(val)
            );
          } else if (node.data.converyName == "1122") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createDirTopVerticalEndDoubleContactSvgPath(val)
            );
          } else if (node.data.converyName == "1123") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createDirLeftFullContactSvgPath(val)
            );
          } else if (node.data.converyName == "1124") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createDirLeftStartContactSvgPath(val)
            );
          } else if (node.data.converyName == "1125") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createDirLeftStartDoubleContactSvgPath(val)
            );
          } else if (node.data.converyName == "1126") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createDirLeftStartBottomContactSvgPath(val)
            );
          } else if (node.data.converyName == "1127") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createDirLeftEndTopContactSvgPath(val)
            );
          } else if (node.data.converyName == "1128") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createDirLeftEndBottomContactSvgPath(val)
            );
          } else if (node.data.converyName == "1129") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createDirLeftEndDoubleContactSvgPath(val)
            );
          } else if (node.data.converyName == "2101") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createSingleStockerSvgPath(val)
            );
          } else if (node.data.converyName == "2102") {
            myDiagram.model.setDataProperty(
              node.data,
              "geo",
              createDoubleStockerSvgPath(val)
            );
          }
        }
      }

      // （构图零部件）调色板图
      _this.myPalette = Make(
        go.Palette,
        this.$refs.myTransferDiv, // 传输线
        {
          initialScale: 1.2,
          contentAlignment: go.Spot.Center,
          nodeTemplate: myDiagram.nodeTemplate_1, // 与主图共享
          "contextMenuTool.isEnabled": false,
          "textEditingTool.isEnabled": true,
          doubleClick: false,
          layout: Make(go.GridLayout, {
            cellSize: new go.Size(1, 1),
            spacing: new go.Size(5, 5),
            wrappingColumn: 12,
            comparer: keyCompare,
          }),

          // 用一些“管道”节点初始化构图零部件
          model: new go.GraphLinksModel({
            copiesArrays: true,
            copiesArrayObjects: true,
            linkFromPortIdProperty: "fid",
            linkToPortIdProperty: "tid",
            nodeDataArray: [
              {
                //直行接口（上）
                key: -1101,
                angle: 0,
                eqType: "输送线",
                converyName: "1101",
                geo: createSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle:0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
                // zOrder: 100,
              },
              {
                //直行接口（上）
                key: -1102,
                angle: 0,
                eqType: "输送线",
                converyName: "1102",
                geo: createStartContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
                // zOrder: 100,
              },
              {
                //直行接口（上）
                key: -1103,
                angle: 0,
                converyName: "1103",
                st:  "rgba(153,153,153,0.5)",
                eqType: "输送线",
                geo: createStartDoubleContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
                // zOrder: 100,
              },
              {
                //直行接口（上）
                key: -1104,
                angle: 0,
                converyName: "1104",
                // zOrder: 100,
                eqType: "输送线",
                geo: createStartBottomContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },
              {
                //直行接口（上）
                key: -1105,
                angle: 0,
                converyName: "1105",
                // zOrder: 100,
                eqType: "输送线",
                geo: createFullContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },
              {
                //直行接口（上）
                key: -1106,
                angle: 0,
                converyName: "1106",
                // zOrder: 100,
                eqType: "输送线",
                geo: createEndTopContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },

              {
                //直行接口（上）
                key: -1107,
                angle: 0,
                converyName: "1107",
                // zOrder: 100,
                eqType: "输送线",
                geo: createEndBottomContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },
              {
                //直行接口（上）
                key: -1108,
                angle: 0,
                converyName: "1108",
                // zOrder: 100,
                eqType: "输送线",
                geo: createEndDoubleContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },
              {
                //直行接口（上）
                key: -1109,
                angle: 0,
                converyName: "1109",
                // zOrder: 100,
                eqType: "输送线",
                geo: createVerticalFullContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },
              {
                //直行接口（上）
                key: -1110,
                angle: 0,
                converyName: "1110",
                // zOrder: 100,
                eqType: "输送线",
                geo: createVerticalStartContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },
              {
                //直行接口（上）
                key: -1111,
                angle: 0,
                converyName: "1111",
                // zOrder: 100,
                eqType: "输送线",
                geo: createVerticalStartBottomContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },
              {
                //直行接口（上）
                key: -1112,
                angle: 0,
                converyName: "1112",
                // zOrder: 100,
                eqType: "输送线",
                geo: createVerticalStartDoubleContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },
              {
                //直行接口（上）
                key: -1113,
                angle: 0,
                converyName: "1113",
                // zOrder: 100,
                eqType: "输送线",
                geo: createVerticalEndTopContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },

              {
                //直行接口（上）
                key: -1114,
                angle: 0,
                converyName: "1114",
                // zOrder: 100,
                eqType: "输送线",
                geo: createVerticalEndBottomContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },
              {
                //直行接口（上）
                key: -1115,
                angle: 0,
                converyName: "1115",
                // zOrder: 100,
                eqType: "输送线",
                geo: createVerticalEndDoubleContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },
              {
                //直行接口（上）
                key: -1116,
                angle: 0,
                converyName: "1116",
                // zOrder: 100,
                eqType: "输送线",
                geo: createDirTopVerticalFullContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                font: "Bold 10px Lato, sans-serif",
                textAngle: 0,
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },
              {
                //直行接口（上）
                key: -1117,
                angle: 0,
                converyName: "1117",
                // zOrder: 100,
                eqType: "输送线",
                geo: createDirTopVerticalStartContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },
              {
                //直行接口（上）
                key: -1118,
                angle: 0,
                converyName: "1118",
                // zOrder: 100,
                eqType: "输送线",
                geo: createDirTopVerticalStartBottomContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },
              {
                //直行接口（上）
                key: -1119,
                angle: 0,
                converyName: "1119",
                // zOrder: 100,
                eqType: "输送线",
                geo: createDirTopVerticalStartDoubleContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },
              {
                //直行接口（上）
                key: -1120,
                angle: 0,
                converyName: "1120",
                // zOrder: 100,
                eqType: "输送线",
                geo: createDirTopVerticalEndTopContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },

              {
                //直行接口（上）
                key: -1121,
                angle: 0,
                converyName: "1121",
                // zOrder: 100,
                eqType: "输送线",
                geo: createDirTopVerticalEndBottomContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },
              {
                //直行接口（上）
                key: -1122,
                angle: 0,
                converyName: "1122",
                // zOrder: 100,
                eqType: "输送线",
                geo: createDirTopVerticalEndDoubleContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },
              {
                //直行接口（上）
                key: -1123,
                angle: 0,
                converyName: "1123",
                // zOrder: 100,
                eqType: "输送线",
                geo: createDirLeftFullContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },

              {
                //直行接口（上）
                key: -1124,
                angle: 0,
                eqType: "输送线",
                converyName: "1124",
                geo: createDirLeftStartContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
                // zOrder: 100,
              },
              {
                //直行接口（上）
                key: -1125,
                angle: 0,
                converyName: "1125",
                // zOrder: 100,
                eqType: "输送线",
                geo: createDirLeftStartDoubleContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },
              {
                //直行接口（上）
                key: -1126,
                angle: 0,
                converyName: "1126",
                // zOrder: 100,
                eqType: "输送线",
                geo: createDirLeftStartBottomContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },

              {
                //直行接口（上）
                key: -1127,
                angle: 0,
                converyName: "1127",
                // zOrder: 100,
                eqType: "输送线",
                geo: createDirLeftEndTopContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },

              {
                //直行接口（上）
                key: -1128,
                angle: 0,
                converyName: "1128",
                // zOrder: 100,
                eqType: "输送线",
                geo: createDirLeftEndBottomContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                // zOrder: 100,
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },
              {
                //直行接口（上）
                key: -1129,
                angle: 0,
                converyName: "1129",
                // zOrder: 100,
                eqType: "输送线",
                geo: createDirLeftEndDoubleContactSvgPath(),
                cellCount: 6,
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },

              {
                //直行接口（上）
                key: 1,
                angle: 180,
                eqType: "输送线",
                geo:
                  "F1 M447.7,295.2v40h20v-40H447.7z M464.7,323.2l-3.5,3.5l-3.5,3.5l-3.5-3.5l-3.5-3.5h3.5v-23h7v23H464.7z",
                carryType: 0, // 产线区域
                ctrlCode: 0, // 编号 （一般是产线区域号 + CAD上显示的 生产线编号或货架编号）
                st:  "rgba(153,153,153,0.5)",
                textAngle: 180,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // textAngle: new go.Spot(0.5, 0.5, 0, 0),,
                // scale: 1,
                // color: 'red',
                // opacity: 1,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
                // zOrder: 100,
              },
              {
                //直行接口（左）
                key: 4,
                angle: 90,
                eqType: "输送线",
                geo:
                  "F1 M447.7,295.2v40h20v-40H447.7z M464.7,323.2l-3.5,3.5l-3.5,3.5l-3.5-3.5l-3.5-3.5h3.5v-23h7v23H464.7z",
                carryType: 0,
                ctrlCode: 0,
                st:  "rgba(153,153,153,0.5)",
                textAngle: 90,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // textAngle: new go.Spot(0.5, 0.5, 0, 0),,
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
                // zOrder: 100,
              },
              {
                //直行接口（下）
                key: 5,
                geo:
                  "F1 M447.7,295.2v40h20v-40H447.7z M464.7,323.2l-3.5,3.5l-3.5,3.5l-3.5-3.5l-3.5-3.5h3.5v-23h7v23H464.7z",
                eqType: "输送线",
                angle: 360,
                // zOrder: 100,
                carryType: 0,
                ctrlCode: 0,
                st:  "rgba(153,153,153,0.5)",
                textAngle: 90,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                //    ports: [
                //      { id: "U6", spot: "0.5 0 0 0.5" },
                //      { id: "U2", spot: "0.5 1 0 -0.5" },
                //    ]
              },
              {
                //直行接口（右）
                key: 6,
                angle: -90,
                eqType: "输送线",
                geo:
                  "F1 M447.7,295.2v40h20v-40H447.7z M464.7,323.2l-3.5,3.5l-3.5,3.5l-3.5-3.5l-3.5-3.5h3.5v-23h7v23H464.7z",
                carryType: 0,
                ctrlCode: 0,
                // zOrder: 100,
                st:  "rgba(153,153,153,0.5)",
                textAngle: -90,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // textAngle: new go.Spot(0.5, 0.5, 0, 0),,
                //   ports: [
                //     { id: "U6", spot: "0.5 0 0 0.5" },
                //     { id: "U2", spot: "0.5 1 0 -0.5" },
                //   ]
              },
              {
                key: 7,
                eqType: "输送线",
                geo:
                  "F1 M429,316.3h-13c-3.9,0-7,3.1-7,7v33h20v-13c0-3.9,3.1-7,7-7l0,0h13v-20H429z M444.1,326.5l-3.5,3.5l-3.5,3.5V330h-9c-3.1,0-5.6,2.5-5.6,5.6v13.1h-7V330l0,0c0-3.9,3.1-7,7-7l0,0h14.6v-3.5l3.5,3.5L444.1,326.5L444.1,326.5z",
                carryType: 0,
                ctrlCode: 0,
                angle: 360,
                // zOrder: 100,
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                //   ports: [
                //     { id: "U0", spot: "1 0.25 -0.5 0.25" },
                //     { id: "U2", spot: "0.25 1 0.25 -0.5" },
                //   ]
              },
              {
                key: 13, //三个接口（梯形右）
                angle: 180,
                eqType: "输送线",
                geo:
                  "F1 M332.1,376.6v20h15c2.8,0,5,2.2,5,5v15h20v-15c0-2.8,2.2-5,5-5h15v-20H332.1z M386.6,386.6l-3.5,3.5l-3.5,3.5 l0,0v-3.5h-14v14.5h3.5l-7,7l0,0l-7-7h3.5v-14.5h-17v-7h38v-3.5l0,0L386.6,386.6z",
                carryType: 0,
                ctrlCode: 0,
                // zOrder: 100,
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                //   ports: [
                //     { id: "U0", spot: "1 0.25 -0.5 0.25" },
                //     { id: "U4", spot: "0 0.25 0.5 0.25" },
                //     { id: "U2", spot: "0.5 1 0 -0.5" },
                //   ]
              },
              {
                //四个接口（十字形）
                key: 15,
                eqType: "输送线",
                geo:
                  "F1 M452.3,327.6c-2.2,0-4-1.8-4-4v-16h-20v15c0,2.8-2.2,5-5,5h-15v20h15c2.8,0,5,2.2,5,5l0,0v15h20v-15c0-2.8,2.2-5,5-5c0,0,0,0,0,0h15v-20H452.3z M462.8,337.6l-3.5,3.5l-3.5,3.5l0,0v-3.5h-14v14.5h3.5l-3.5,3.5l-3.5,3.5l-3.5-3.5l-3.5-3.5h3.5v-14.5h-17v-7h17v-16.8h7v16.8h14v-3.5l0,0c1.4,1.4,2.4,2.4,3.5,3.5C460.3,335.2,461.4,336.2,462.8,337.6z",
                carryType: 0,
                ctrlCode: 0,
                // zOrder: 100,
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                angle: 180,
                //   ports: [
                //     { id: "U0", spot: "1 0.5 -0.5 0.25" },
                //     { id: "U4", spot: "0 0.5 0.5 0.25" },
                //     { id: "U2", spot: "0.5 1 0 -0.5" },
                //     { id: "U6", spot: "0.5 0 0 -0.5" }
                //   ]
              },
              {
                key: 20,
                eqType: "输送线",
                geo:
                  "F1 M1133.13,486.83h-33v20h13a7,7,0,0,1,7,7v13h20v-33A7,7,0,0,0,1133.13,486.83Zm.47,32.46h-7V506.17a5.6,5.6,0,0,0-5.6-5.6h-9v3.5l-3.5-3.5-3.5-3.5h0c1.37-1.36,2.43-2.43,3.5-3.5l3.5-3.5v3.5h14.57a7,7,0,0,1,7,7Z",
                carryType: 0,
                ctrlCode: 0,
                angle: 180,
                // zOrder: 100,
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // textAngle: new go.Spot(0.5, 0.5, 0, 0),,
                //   ports: [
                //     { id: "U0", spot: "0 0.25 -0.5 0.25" },
                //     { id: "U2", spot: "0.75 1 0.25 -0.5" },
                //   ]
              },
              {
                key: 21, //三个接口（梯形左）
                eqType: "输送线",
                angle: 180,
                geo: `F1 M744.3,389h-40v20h15c2.8,0,5,2.2,5,5v15h20v-15c0-2.8,2.2-5,5-5h15v-20H744.3z M754.8,402.5h-17V417h3.5l-3.5,
                                            3.5l-3.5,3.5l0,0l-3.5-3.5l-3.5-3.5h3.5v-14.5h-14v3.5l0,0c-1.4-1.4-2.4-2.4-3.5-3.5l-3.5-3.5l0,0l3.5-3.5l3.5-3.5l0,0v3.5h38V402.5z`,
                carryType: 0,
                ctrlCode: 0,
                // zOrder: 100,
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // textAngle: new go.Spot(0.5, 0.5, 0, 0),,
                //   ports: [
                //     { id: "U0", spot: "1 0.25 -0.5 0.25" },
                //     { id: "U4", spot: "0 0.25 0.5 0.25" },
                //     { id: "U2", spot: "0.5 1 0 -0.5" },
                //     ]
              },
              {
                key: 22, //三个接口（梯形左）
                eqType: "输送线",
                angle: 180,
                geo: `F1 M744.3,389h-40v20h15c2.8,0,5,2.2,5,5v15h20v-15c0-2.8,2.2-5,5-5h15v-20H744.3z M754.8,402.5h-17V417l0,0v3.5h-7l0,0l0,0V417l0,0v-14.5h-14v3.5l0,0c-1.4-1.4-2.4-2.4-3.5-3.5l-3.5-3.5l0,0l3.5-3.5l3.5-3.5l0,0v3.5h38V402.5z`,
                carryType: 0,
                ctrlCode: 0,
                // zOrder: 100,
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                //   ports: [
                //     { id: "U0", spot: "1 0.25 -0.5 0.25" },
                //     { id: "U4", spot: "0 0.25 0.5 0.25" },
                //     { id: "U2", spot: "0.5 1 0 -0.5" },
                //     ]
              },
              {
                key: 27, //三个接口（梯形左）
                eqType: "输送线",
                angle: 180,
                geo: `F1 M654.56,390.74h-40v20h15a5,5,0,0,1,5,5v15h20v-15a5,5,0,0,1,5-5h15v-20Zm12.76,11.76H648.63l.13,18,4.57.15-8,5.33-7.6-5.06c-.38-1.16-1.47-.29,4.18-.42V417l-.35-14.37-8.09.13c-8.87-.13-9.4.09-11.81-.26l.11-6.62h0a.23.23,0,0,1,.17-.38h45.5Z`,
                carryType: 0,
                ctrlCode: 0,
                // zOrder: 100,
                st:  "rgba(153,153,153,0.5)",
                textAngle: 0,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                //   ports: [
                //     { id: "U0", spot: "1 0.25 -0.5 0.25" },
                //     { id: "U4", spot: "0 0.25 0.5 0.25" },
                //     { id: "U2", spot: "0.5 1 0 -0.5" },
                //     ]
              },
              {
                key: 44,
                eqType: "圆盘",
                width: 10,
                height: 10,
                carryType: 0,
                ctrlCode: 0,
                zOrder: 999,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                // textAngle: new go.Spot(0.5, 0.5, 0, 0),,
              },
            ],
          }),
        }
      ); // end Palette

      Make(
        go.Palette,
        this.$refs.myStackerDiv, // 堆垛机
        {
          initialScale: 1.2,
          contentAlignment: go.Spot.Center,
          nodeTemplate: myDiagram.nodeTemplate_1,
          // groupTemplate:myDiagram.groupTemplate,
          "contextMenuTool.isEnabled": false,
          layout: Make(go.GridLayout, {
            cellSize: new go.Size(1, 1),
            spacing: new go.Size(5, 5),
            wrappingColumn: 12,
            comparer: keyCompare,
          }),
          model: new go.GraphLinksModel({
            copiesArrays: true,
            copiesArrayObjects: true,
            linkFromPortIdProperty: "fid",
            linkToPortIdProperty: "tid",
            nodeDataArray: [
              {
                key: "堆垛机",
                isGroup: true,
                st: "transparent",
                groupSize: "70 60",
                groupText: "堆垛机",
              },
              {
                // 堆垛机
                key: 51,
                geo:
                  "F1 M775.8,527.5c-0.4,0-0.8-0.3-0.8-0.8v-3h-11.3c-2.1,0-3.8-1.7-3.8-3.8l0,0v-11.2h-15V520c0,2.1-1.7,3.8-3.8,3.8l0,0H730v15h11.3c2.1,0,3.8,1.7,3.8,3.8v11.3h15v-11.3c0-2.1,1.7-3.8,3.8-3.8H775v-3c0-0.4,0.3-0.8,0.8-0.8H790v-7.5H775.8zM770.1,536.5h-35.2V535h35.2V536.5z M770.1,527.5h-35.2V526h35.2V527.5z",
                carryType: 0,
                eqType: "堆垛机",
                color: "LightGrey",
                group: "堆垛机",
                move: true,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                textAngle: 0,
              },
              {
                //
                key: -2101,
                converyName: "2101",
                eqType: "堆垛机",
                geo: createSingleStockerSvgPath(),
                cellCount: 6,
                group: "堆垛机",
                color: "LightGrey",
                carryType: 0,
                move: true,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                textAngle: 0,
              },
              {
                //
                key: -2102,
                eqType: "堆垛机",
                converyName: "2102",
                geo: createDoubleStockerSvgPath(),
                cellCount: 6,
                group: "堆垛机",
                color: "LightGrey",
                carryType: 0,
                move: true,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                textAngle: 0,
              },
            ], // end nodeDataArray
          }), // end model
        }
      ); // end Palette

      Make(
        go.Palette,
        this.$refs.myCellDiv, // 货位图
        {
          initialScale: 1.2,
          contentAlignment: go.Spot.Center,
          nodeTemplate: myDiagram.nodeTemplate_1,
          "contextMenuTool.isEnabled": false,
          layout: Make(go.GridLayout, {
            cellSize: new go.Size(1, 1),
            spacing: new go.Size(4, 4),
            wrappingColumn: 12,
            comparer: keyCompare,
          }),
          model: new go.GraphLinksModel({
            copiesArrays: true,
            copiesArrayObjects: true,
            linkFromPortIdProperty: "fid",
            linkToPortIdProperty: "tid",
            nodeDataArray: [
              {
                key: "库位",
                isGroup: true,
                st: "transparent",
              },
              {
                key: 26,
                geo: "F1 M665,508h-20v-20h20V508z",
                bg1: "rgba(245,245,245)",
                bg2: "rgba(245,245,245)",
                bg3: "rgba(245,245,245)",
                bg4: "rgba(245,245,245)",
                rackCode: "1",
                eqType: "库位",
                move: false,
                group: "库位",
              },
              {
                key: "编号",
                isGroup: true,
                st: "transparent",
              },
              {
                key: 41,
                geo: "F1 M665,508h-20v-20h20V508z",
                color: "rgba(128, 128, 128, 0.5)",
                text: 1,
                eqType: "库位",
                move: false,
                group: "编号",
                // textAngle: new go.Spot(0.5, 0.5, 0, 0),,
              },
              {
                key: 42,
                color: "rgba(256, 0, 0, 0.5)",
                eqType: "上下标",
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
              },
              {
                key: 43,
                color: "rgba(0, 0, 256, 0.5)",
                eqType: "上下标",
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
              },
            ],
          }),
        }
      );

      Make(
        go.Palette,
        this.$refs.myAloneDiv, // 单机
        {
          initialScale: 1.2,
          contentAlignment: go.Spot.Center,
          nodeTemplate: myDiagram.nodeTemplate_1,
          "contextMenuTool.isEnabled": false,
          layout: Make(go.GridLayout, {
            cellSize: new go.Size(1, 1),
            spacing: new go.Size(10, 10),
            wrappingColumn: 12,
            comparer: keyCompare,
          }),

          model: new go.GraphLinksModel({
            copiesArrays: true,
            copiesArrayObjects: true,
            linkFromPortIdProperty: "fid",
            linkToPortIdProperty: "tid",
            nodeDataArray: [
              {
                key: 23,
                geo:
                  "F1 M8.3-5l13.3,24.7H-5L8.3-5z M8.3,12.4c-0.6,0-1,0.5-1,1.1V14v0.1c0.1,0.7,0.6,1.1,1.3,1.1c0.5-0.1,0.9-0.5,0.9-1.1v-0.7v-0.1C9.3,12.8,8.8,12.4,8.3,12.4z M8.3,3.5c-0.6,0-1,0.5-1,1.1v5.5v0.1c0.1,0.7,0.6,1.2,1.3,1.1c0.5-0.1,0.9-0.5,0.9-1.1V4.6V4.5C9.3,3.8,8.8,3.5,8.3,3.5z",
                carryType: 0,
                ctrlCode: 0,
                group: "报警设备",
                eqType: "报警设备",
                font: "Bold 8px Lato, sans-serif",
                // ports: [
                //     { id: "U0", spot: "1 0.4 -0.5 0.25" },
                //     { id: "U4", spot: "0 0.4 0.5 0.25" },
                // ]
              },
              {
                key: 23,
                geo:
                  "F1 M127.5,97.8h45v30h-15v4.5h-15v-4.5h-15V97.8z M169.8,100.3v24.8h-16.2v4.5h-7.5v-4.5h-16.1v-24.8H169.8z",
                carryType: 0,
                ctrlCode: 0,
                eqType: "扫码枪",
                font: "Bold 10px Lato, sans-serif",
                // ports: [
                //     { id: "U0", spot: "1 0.4 -0.5 0.25" },
                //     { id: "U4", spot: "0 0.4 0.5 0.25" },
                // ]
              },
              {
                // 扫码器
                key: 3.5,
                angle: 180,
                geo: `F1 M20.34,33h7.32A3.76,3.76,0,0,0,28,25.5H20.34A3.76,3.76,0,0,0,20,33Zm0-5.73h7.24a2,2,0,0,1,2.07,1.85,2,2,0,0,1-1.81,2.12H20.34a2,2,0,0,1-.26-4ZM21,24.62H27a.87.87,0,0,0,.86-.88v-.13l-1.07-4.94A.89.89,0,0,0,25.9,18H22.23a.89.89,0,0,0-.86.67l-1.16,4.94a.89.89,0,0,0,.73,1Zm1.46-5.29h3.06l.86,4H21.54Z`,
                carryType: 0,
                ctrlCode: 0,
                eqType: "扫码器",
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                textAngle: 180,
              },

              {
                key: 24,
                geo: "F1 M640.5,466h-45v30h45V466z M637.8,493.3v-24.8H598v24.8H637.8z",
                carryType: 0, // 产线区域
                ctrlCode: 0,
                eqType: "OCV",
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                textAngle: 0,
                // ports: [
                //     { id: "U0", spot: "1 0.5 -0.5 0.25" },
                //     { id: "U4", spot: "0 0.5 0.5 0.25" },
                // ]
              },
              {
                key: 25,
                geo:
                  "F1 M819.5,308h-45v7.5H770v15h4.5v7.5h45v-7.5h4.5v-15h-4.5V308z M816.8,310.5H777v7.5h-4.5v9.8h4.5v7.5h39.8v-7.5h4.5V318h-4.5V310.5z",
                carryType: 0, // 产线区域
                ctrlCode: 0,
                eqType: "拔钉机",
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                textAngle: 0,
                // ports: [
                //     { id: "U0", spot: "1 0.5 -0.5 0.25" },
                //     { id: "U4", spot: "0 0.5 0.5 0.25" },
                //  ]
              },
              {
                key: 28,
                carryType: 0, // 产线区域
                ctrlCode: 0,
                eqType: "机柜",
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                textAngle: 0,
                // ports: [
                //     { id: "U0", spot: "1 0.5 -0.5 0.25" },
                //     { id: "U4", spot: "0 0.5 0.5 0.25" },
                //  ],
                geo: `F1 M75 50V0L0 -6.55671e-06V50L75 50ZM35.0545 2.273C35 2.37996 35 2.51997 35 2.8V46.2C35 46.48 35 46.62 35.0545 46.727C35.1024 46.8211 35.1789 46.8976 35.273 46.9455C35.38 47 35.52 47 35.8 47H39.2C39.48 47 39.62 47 39.727 46.9455C39.8211 46.8976 39.8976 46.8211 39.9455 46.727C40 46.62 40 46.48 40 46.2V2.8C40 2.51997 40 2.37996 39.9455 2.273C39.8976 2.17892 39.8211 2.10243 39.727 2.0545C39.62 2 39.48 2 39.2 2H35.8C35.52 2 35.38 2 35.273 2.0545C35.1789 2.10243 35.1024 2.17892 35.0545 2.273ZM27.5 2.8C27.5 2.51997 27.5 2.37996 27.5545 2.273C27.6024 2.17892 27.6789 2.10243 27.773 2.0545C27.88 2 28.02 2 28.3 2H31.7C31.98 2 32.12 2 32.227 2.0545C32.3211 2.10243 32.3976 2.17892 32.4455 2.273C32.5 2.37996 32.5 2.51997 32.5 2.8V46.2C32.5 46.48 32.5 46.62 32.4455 46.727C32.3976 46.8211 32.3211 46.8976 32.227 46.9455C32.12 47 31.98 47 31.7 47H28.3C28.02 47 27.88 47 27.773 46.9455C27.6789 46.8976 27.6024 46.8211 27.5545 46.727C27.5 46.62 27.5 46.48 27.5 46.2V2.8ZM20.0545 2.273C20 2.37996 20 2.51997 20 2.8V46.2C20 46.48 20 46.62 20.0545 46.727C20.1024 46.8211 20.1789 46.8976 20.273 46.9455C20.38 47 20.52 47 20.8 47H24.2C24.48 47 24.62 47 24.727 46.9455C24.8211 46.8976 24.8976 46.8211 24.9455 46.727C25 46.62 25 46.48 25 46.2V2.8C25 2.51997 25 2.37996 24.9455 2.273C24.8976 2.17892 24.8211 2.10243 24.727 2.0545C24.62 2 24.48 2 24.2 2H20.8C20.52 2 20.38 2 20.273 2.0545C20.1789 2.10243 20.1024 2.17892 20.0545 2.273ZM12.5 2.8C12.5 2.51997 12.5 2.37996 12.5545 2.273C12.6024 2.17892 12.6789 2.10243 12.773 2.0545C12.88 2 13.02 2 13.3 2H16.7C16.98 2 17.12 2 17.227 2.0545C17.3211 2.10243 17.3976 2.17892 17.4455 2.273C17.5 2.37996 17.5 2.51997 17.5 2.8V46.2C17.5 46.48 17.5 46.62 17.4455 46.727C17.3976 46.8211 17.3211 46.8976 17.227 46.9455C17.12 47 16.98 47 16.7 47H13.3C13.02 47 12.88 47 12.773 46.9455C12.6789 46.8976 12.6024 46.8211 12.5545 46.727C12.5 46.62 12.5 46.48 12.5 46.2V2.8ZM5.0545 2.273C5 2.37996 5 2.51997 5 2.8V46.2C5 46.48 5 46.62 5.0545 46.727C5.10243 46.8211 5.17892 46.8976 5.273 46.9455C5.37996 47 5.51997 47 5.8 47H9.2C9.48003 47 9.62004 47 9.727 46.9455C9.82108 46.8976 9.89757 46.8211 9.9455 46.727C10 46.62 10 46.48 10 46.2V2.8C10 2.51997 10 2.37996 9.9455 2.273C9.89757 2.17892 9.82108 2.10243 9.727 2.0545C9.62004 2 9.48003 2 9.2 2H5.8C5.51997 2 5.37996 2 5.273 2.0545C5.17892 2.10243 5.10243 2.17892 5.0545 2.273ZM42.5 2.8C42.5 2.51997 42.5 2.37996 42.5545 2.273C42.6024 2.17892 42.6789 2.10243 42.773 2.0545C42.88 2 43.02 2 43.3 2H46.7C46.98 2 47.12 2 47.227 2.0545C47.3211 2.10243 47.3976 2.17892 47.4455 2.273C47.5 2.37996 47.5 2.51997 47.5 2.8V46.2C47.5 46.48 47.5 46.62 47.4455 46.727C47.3976 46.8211 47.3211 46.8976 47.227 46.9455C47.12 47 46.98 47 46.7 47H43.3C43.02 47 42.88 47 42.773 46.9455C42.6789 46.8976 42.6024 46.8211 42.5545 46.727C42.5 46.62 42.5 46.48 42.5 46.2V2.8ZM50.0545 2.273C50
                                        2.37996 50 2.51997 50 2.8V46.2C50 46.48 50 46.62 50.0545 46.727C50.1024 46.8211 50.1789 46.8976 50.273 46.9455C50.38 47 50.52 47 50.8 47H54.2C54.48 47 54.62 47 54.727 46.9455C54.8211 46.8976 54.8976 46.8211 54.9455 46.727C55 46.62 55 46.48 55 46.2V2.8C55 2.51997 55 2.37996 54.9455 2.273C54.8976 2.17892 54.8211 2.10243 54.727 2.0545C54.62 2 54.48 2 54.2 2H50.8C50.52 2 50.38 2 50.273 2.0545C50.1789 2.10243 50.1024 2.17892 50.0545 2.273ZM57.5 2.8C57.5 2.51997 57.5 2.37996 57.5545 2.273C57.6024 2.17892 57.6789 2.10243 57.773 2.0545C57.88 2 58.02 2 58.3 2H61.7C61.98 2 62.12 2 62.227 2.0545C62.3211 2.10243 62.3976 2.17892 62.4455 2.273C62.5 2.37996 62.5 2.51997 62.5 2.8V46.2C62.5 46.48 62.5 46.62 62.4455 46.727C62.3976 46.8211 62.3211 46.8976 62.227 46.9455C62.12 47 61.98 47 61.7 47H58.3C58.02 47 57.88 47 57.773 46.9455C57.6789 46.8976 57.6024 46.8211 57.5545 46.727C57.5 46.62 57.5 46.48 57.5 46.2V2.8ZM65.0545 2.273C65 2.37996 65 2.51997 65 2.8V46.2C65 46.48 65 46.62 65.0545 46.727C65.1024 46.8211 65.1789 46.8976 65.273 46.9455C65.38 47 65.52 47 65.8 47H69.2C69.48 47 69.62 47 69.727 46.9455C69.8211 46.8976 69.8976 46.8211 69.9455 46.727C70 46.62 70 46.48 70 46.2V2.8C70 2.51997 70 2.37996 69.9455 2.273C69.8976 2.17892 69.8211 2.10243 69.727 2.0545C69.62 2 69.48 2 69.2 2H65.8C65.52 2 65.38 2 65.273 2.0545C65.1789 2.10243 65.1024 2.17892 65.0545 2.273Z`,
              },
              {
                key: 70,
                text: "盐水箱",
                eqType: "盐水箱",
                width: 20,
                height: 20,
                carryType: 0,
                ctrlCode: 0,
                zOrder: 999,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                textAngle: 0,
              },
              {
                key: 71,
                text: "机械臂",
                eqType: "机械臂",
                width: 80,
                height: 80,
                carryType: 0,
                ctrlCode: 0,
                zOrder: 999,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                textAngle: 0,
                geo: `F1 M43.10041850713519 6.684693087095781 A7.604 7.604 0 0 1 41.29741850713519 12.869693087095781 A7.604 7.604 0 0 1 47.20941850713519 10.316693087095782 L43.09941850713519 6.684693087095782z M51.88941850713519 12.09169308709578 L40.19441850713519 1.759693087095779 A7.062 7.062 0 0 0 30.34541850713519 2.247693087095779 A0.341 0.341 0 0 1 30.09841850713519 2.358693087095779 L22.61241850713519 2.374693087095779 L22.61241850713519 1.4716930870957807 L13.083418507135187 1.4716930870957807 L13.083418507135187 6.235693087095781 L11.178418507135188 6.235693087095781 L11.178418507135188 4.328693087095781 L6.413418507135187 0.5196930870957807 L6.413418507135187 4.156693087095782 C6.413418507135187 4.266693087095781 6.463418507135186 4.370693087095782 6.5494185071351865 4.439693087095781 L9.453418507135188 6.762693087095782 A0.36 0.36 0 0 1 9.589418507135187 7.045693087095781 L9.589418507135187 9.238693087095783 A0.36 0.36 0 0 1 9.453418507135188 9.521693087095782 L6.5494185071351865 11.843693087095781 A0.36 0.36 0 0 0 6.413418507135187 12.12669308709578 L6.413418507135187 15.763693087095781 L11.177418507135187 11.95369308709578 L11.177418507135187 10.04669308709578 L13.082418507135186 10.04669308709578 L13.082418507135186 14.810693087095782 L22.609418507135185 14.810693087095782 L22.609418507135185 13.470693087095782 L30.402418507135184 13.453693087095782 L30.491418507135183 13.531693087095782 L30.519418507135182 13.556693087095782 L30.54741850713518 13.581693087095783 L36.06641850713518 18.45869308709578 A0.36 0.36 0 0 1 36.09841850713518 18.968693087095783 L24.984418507135178 31.547693087095784 L24.692418507135176 31.877693087095782 A7.625 7.625 0 0 0 22.571418507135178 41.45969308709578 A0.315 0.315 0 0 1 22.608418507135177 41.60969308709578 L22.608418507135177 45.53369308709578 A0.362 0.362 0 0 1 22.24641850713518 45.89569308709578 L2.532418507135187 45.89569308709578 A2.65 2.65 0 0 0 2.532418507135187 51.19069308709578 L55.497418507135194 51.19069308709578 A2.648 2.648 0 1 0 55.497418507135194 45.89469308709578 L36.31041850713519 45.89469308709578 A0.362 0.362 0 0 1 35.94841850713519 45.53269308709578 L35.94841850713519 41.73869308709578 L36.199418507135185 41.454693087095784 L51.29841850713519 24.36269308709579 C51.66741850713519 24.08369308709579 52.01341850713519 23.76169308709579 52.333418507135185 23.40169308709579 L52.836418507135186 22.83269308709579 A7.424 7.424 0 0 0 52.18641850713519 12.354693087095791 L52.040418507135186 12.22069308709579 L51.89041850713519 12.091693087095791z M38.985418507135186 21.032693087095783 L30.687418507135185 30.425693087095784 A7.624 7.624 0 0 1 35.94841850713519 41.71269308709578 A7.641 7.641 0 0 0 36.60941850713519 35.65869308709578 L45.48141850713519 25.61669308709578 A7.02 7.02 0 0 1 42.36741850713519 24.02069308709578 L38.98641850713519 21.03369308709578z M37.507418507135185 17.372693087095783 L40.415418507135186 14.081693087095783 A7.645 7.645 0 0 1 41.263418507135185 12.908693087095783 A7.606 7.606 0 0 1 35.34741850713518 15.461693087095782 L37.50841850713518 17.37169308709578z M34.18241850713518 43.80669308709578 L34.18241850713518 45.89469308709578 L24.374418507135182 45.89469308709578 L24.374418507135182 43.72069308709578 A7.625 7.625 0 0 0 34.18241850713518 43.80669308709578z M37.22941850713518 9.90569308709578 L22.60941850713518 9.93769308709578 L22.60941850713518 5.905693087095781 L37.220418507135186 5.873693087095781 A2.018 2.018 0 0 1 37.229418507135186 9.90569308709578z M43.68041850713518 15.00869308709578 A4.419 4.419 0 1 0 50.30641850713518 20.85969308709578 A4.419 4.419 0 0 0 43.68041850713518 15.008693087095782z M26.018418507135188 35.003693087095776 A4.419 4.419 0 1 0 32.644418507135185 40.854693087095775 A4.419 4.419 0 0 0 26.018418507135184 35.003693087095776z M20.844418507135188 3.2366930870957806 L14.849418507135187 3.2366930870957806 L14.849418507135187 13.044693087095782 L20.845418507135186 13.044693087095782 L20.845418507135186 3.2366930870957806z M6.413418507135187 0.5196930870957807 L1.6494185071351868 4.331693087095781 L3.2364185071351868 6.236693087095782 L6.412418507135188 4.331693087095781 L6.412418507135188 0.5196930870957807z M1.6494185071351868 11.951693087095782 L6.413418507135187 15.763693087095781 L6.413418507135187 11.951693087095782 L3.237418507135187 10.04669308709578 L1.6494185071351868 11.951693087095782z`
              }
              
            ],
          }),
        }
      );

      Make(
        go.Palette,
        this.$refs.myOthersDiv, //其他
        {
          initialScale: 1.2,
          contentAlignment: go.Spot.Center,
          nodeTemplate: myDiagram.nodeTemplate_1,
          "contextMenuTool.isEnabled": false,
          layout: Make(go.GridLayout, {
            cellSize: new go.Size(10, 10),
            spacing: new go.Size(50, 50),
            wrappingColumn: 12,
            comparer: keyCompare,
          }),

          model: new go.GraphLinksModel({
            copiesArrays: true,
            copiesArrayObjects: true,
            linkFromPortIdProperty: "fid",
            linkToPortIdProperty: "tid",
            nodeDataArray: [
              {
                // 文本框
                key: 61,
                color: "white",
                // width: 60,
                height: 20,
                font: "Bold 10px Lato, sans-serif",
                textColor: "#000",
                text: "文本框",
                eqType: "文本框",
                textWidth: 100,
              },
              {
                // 区域框
                key: 62,
                color: "rgba(200, 54, 54, 0)",
                st: "transparent",
                geo: `F1 M253.64,326.5v20h20v-20Zm19.5,19.5h-19V327h19Z`, //M 20 230 q 40 205, 50 230 t 90230
                // width:200,height:20,
                textColor: "#000",
                eqType: "区域框",
                textWidth: 100,
                dashLine: [6, 3],
                font: "Bold 10px Lato, sans-serif",
                text: "区域框",
              },
            ],
          }),
        }
      );

      _this.myPalette.nodeTemplateMap.add(
        "Comment",
        Make(
          go.Node,
          "Auto",
          { width: 60, height: 60 },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          Make(
            go.TextBlock,
            { stroke: "brown", font: "9pt sans-serif" },
            new go.Binding("text")
          )
        )
      );

      this.diagram = myDiagram;

      // 选择一个节点，以便第一个 Inspector 显示内容
      myDiagram.select(myDiagram.nodes.first());

      new Inspector("myInspector", myDiagram, {
        // 允许一次检查多个节点
        multipleSelection: true,
        // 当多项选择为真时，将显示最大数量的节点属性
        showSize: 4,
        showAllProperties: true,
        propertyModified: function (prop, val, inspector) {
          if (prop === "cellCount") {
            targgerCellCountEvent(prop, val, inspector);
          }
        }, //当节点属性变化时触发
        properties: {
          key: { show: Inspector.showIfPresent, readOnly: true },
          text: {
            show: (Inspector.showIfNode = function (t) {
              return t.data.rackCode ? false : Inspector.showIfNode;
            }),
          },
          textColor: {
            show: (Inspector.showIfNode = function (t) {
              return t.data.eqType && t.data.eqType !== "库位" ? Inspector.showIfNode : false;
            }),
            type: 'color'
          },
          textAngle: {
            show: Inspector.showIfPresent,
            type: "select",
            choices: function (node, propName) {
              if (Array.isArray(node.data.choices)) return node.data.choices;
              return [90,180,270,360,-90,-180,0];
              // new go.Spot(0.5, 1.5, 0, 0),new go.Spot(0.5, 1.5, 0, 0),new go.Spot(1.5, 0.5, 0, 0),new go.Spot(-0.5, 0.5, 0, 0),
            },
          },
          resizable: {
            show:  (Inspector.showIfNode = function (t) {
              return t.data.eqType && t.data.eqType !== "库位" && t.data.eqType !== "圆盘" ? Inspector.showIfNode : false;
                // t.data.eqType === "输送线" ||
                // t.data.eqType === "区域框" ||
                // t.data.eqType === "圆盘" || t.data.eqType === "OCV"
            }),
            type: "checkbox",
            choices: function (node) {
              return [true, false];
            },
          },
          font: { show: Inspector.showIfPresent }, 
          isGroup: { readOnly: true, show: Inspector.showIfPresent },
          group: { readOnly: true, show: Inspector.showIfPresent },
          geo: { readOnly: true },
          loc: { readOnly: true, show: Inspector.showIfPresent },
          ports: { readOnly: true },
          st: {
            show: (Inspector.showIfNode = function (t) {
              return t.data.eqType === "输送线" || t.data.eqType === "区域框"
                ? Inspector.showIfNode
                : false;
            }),
          },
          dashLine: { readOnly: true },
          x: { readOnly: true },
          y: { readOnly: true },
          z: { readOnly: true },
          node_direc: { readOnly: true },
          eqType: { show: Inspector.showIfPresent }, // 设备类型
          cellCount: { show: Inspector.showIfPresent },
          converyName: { show: false },
          zOrder: { show: false },
          color: { show: Inspector.showIfPresent, type: 'color' },
          angle: {
            show: Inspector.showIfPresent,
            type: "select",
            choices: function (node, propName) {
              if (Array.isArray(node.data.choices)) return node.data.choices;
              return [90,180,270,360,-90,-180,0];
            },
          },
          move: {
            show:  (Inspector.showIfNode = function (t) {
              return t.data.eqType && t.data.eqType === "堆垛机" ? Inspector.showIfNode : false;
            }),
            type: "checkbox",
            choices: function (node) { return [true, false]; },
          },
          // "locationSpot": { show: Inspector.showIfPresent },  // 设备类型
          // 'size': {show: Inspector.showIfNode,},
          // "state": {
          //     show: Inspector.showIfNode,
          //     type: "select",
          //     choices: function (node, propName) {
          //         if (Array.isArray(node.data.choices)) return node.data.choices;
          //         return ["空闲", "运行", "故障", "禁用"];
          //     }
          // },
        },
      });
    },
    // 重置
    reset() {
      let data = {
        class: "GraphLinksModel",
        copiesArrays: true,
        copiesArrayObjects: true,
        linkFromPortIdProperty: "fid",
        linkToPortIdProperty: "tid",
        nodeDataArray: [],
        linkDataArray: [],
      };
      this.diagram.model = go.Model.fromJson(data);
      this.logisticsId = ""; // 重置后保存的就是新建的图
      this.tableRow = {};
      this.saveOrEdit = this.$t("common.btn.add");
    },
    // 打开新增或编辑调度图弹窗
    save() {
      this.inputDisable = false;
      if (this.logisticsId) {
        this.logisticsTitle = this.$t("common.btn.edit");
        this.modalKey = "edit";
        for (let key in this.designTemp) {
          // 遍历对象
          if (this.designTemp.hasOwnProperty(key)) {
            this.designTemp[key] = this.tableRow[key];
          }
        }
      } else {
        this.logisticsTitle = this.$t("common.btn.add");
        this.modalKey = "add";
        for (let key in this.designTemp) {
          // 遍历对象
          if (this.designTemp.hasOwnProperty(key)) {
            this.designTemp[key] = this.tableRow[key];
          }
        }
      }
      this.dialogFormVisible = true;
      this.diagram.isModified = false;
    },

    read(row) {
      // 读取按钮
      this.tableRow = row;
      this.logisticsId = row.id;
      let params = {
        data: row.id,
      };
      const _data = { url: "/monitor-drawing/guest/get-script", params: params };
      this.$store
        .dispatch("fmsCommon/actionTaskPost", _data)
        .then((data) => {
          this.saveOrEdit = this.$t("common.btn.edit");
          this.diagram.model = go.Model.fromJson(data);
          this.viewLoading = false;
        })
        .catch((err) => {
          console.error(err);
        });
    },

    initTableData() {
      let params = {
        current: 1,
        pageSize: 15,
        requestData: {
          fileType: this.scheduleType,
        },
      };
      const _data = { url: "/monitor-drawing/guest/list", params: params };
      this.$store
        .dispatch("fmsCommon/actionTaskPost", _data)
        .then((data) => {
          this.logisticsTableData = data.data.sort((a,b)=>{return a.sortNum-b.sortNum});
          this.listLoading = false;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // edit(row) {
    //     this.inputDisable = true;
    //     for(let key in this.designTemp) {
    //         if (this.designTemp.hasOwnProperty(key)) {
    //             this.designTemp[key] = row[key]
    //         }
    //     }
    //     this.logisticsTitle = '调度图修改';
    //     this.dialogFormVisible = true;
    //     this.modalKey = 'edit';
    //     this.logisticsId = row.fileId;
    //     this.diagram.isModified = false;
    // },
    del(row) {
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
          const _data = { url: "/monitor-drawing/del", params: { data: row.id } }; // /api/MonitorFile/DelMonitorFileApi
          this.$store
            .dispatch("fmsCommon/actionTaskPost", _data)
            .then((data) => {
              this.$message({
                type: "success",
                message: this.$t("common.btn.deleteSuccess"),
              });
              this.initTableData();
              this.reset();
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("common.btn.Cancelled"),
          });
        });
    },

    // 折叠层改变时触发的回调
    handleChange(e) {},

    model() {
      return this.diagram.model;
    },

    // 保存设计图数据到数据库
    logisticsDesignSave() {
      // 保存和修改接口
      this.$refs["diagramForm"].validate((valid) => {
        if (valid) {
          if (this.modalKey === "add") {
            // 调度图JSON保存接口
            const params_data = {
              url: "/monitor-drawing/add",
              params: {
                data: {
                  ...this.designTemp,
                  fileContext: this.diagram.model.toJson(),
                  fileType: this.scheduleType,
                },
              },
            };
            this.$store
              .dispatch("fmsCommon/actionTaskPost", params_data)
              .then((data) => {
                this.$message({
                  message: this.$t("common.btn.addSuccess"),
                  type: "success",
                });
                this.dialogFormVisible = false;
                this.initTableData();
              })
              .catch((err) => {
                console.error(err);
              });
          } else {
            let params = {
              data: {
                ...this.designTemp,
                fileType: this.scheduleType,
                fileContext: this.diagram.model.toJson(),
                id: this.logisticsId,
              },
            };
            const _data = { url: "/monitor-drawing/edit", params: params };
            this.$store
              .dispatch("fmsCommon/actionTaskPost", _data)
              .then((data) => {
                this.$message({
                  message: this.$t("common.btn.editSuccess"),
                  type: "success",
                });
                this.dialogFormVisible = false;
                this.initTableData();
              })
              .catch((err) => {
                console.error(err);
              });
          }
        } else {
          return false;
        }
      });
    },
  },
};

// 定义一个拖拽工具事件
class SnappingTool extends go.DraggingTool {
  // 检查端口是否可以对齐。
  // 端口id的第一个字母应该是“U”、“F”或“M”，表示可以连接的端口类型。
  // port id 的第二个字母应该是一个数字，表示它可以连接的方向。
  // 端口还需要没有任何链接连接并且需要面向相反的方向。
  compatiblePorts(p1, p2) {
    const part1 = p1.part;
    const id1 = p1.portId;
    if (id1 === null || id1 === "") return false;
    if (part1.findLinksConnected(id1).filter((l) => l.category === "").count > 0)
      return false;
    const part2 = p2.part;
    const id2 = p2.portId;
    if (id2 === null || id2 === "") return false;
    if (part2.findLinksConnected(id2).filter((l) => l.category === "").count > 0)
      return false;
    // 是否兼容
    if (
      (id1[0] === "U" && id2[0] === "U") ||
      (id1[0] === "F" && id2[0] === "M") ||
      (id1[0] === "M" && id2[0] === "F")
    ) {
      // 旋转后找到它们的有效的一端
      const a1 = this.effectiveAngle(id1, part1.angle);
      const a2 = this.effectiveAngle(id2, part2.angle);
      // 判断是否在相反的方向
      if (a1 - a2 === 180 || a1 - a2 === -180) return true;
    }
    return false;
  }

  // 端口可以连接什么角度，调整节点的旋转
  effectiveAngle(id, angle) {
    //  console.log(id, angle)
    const dir = id[1];
    let a = 0;
    if (dir === "1") a = 45;
    else if (dir === "2") a = 90;
    else if (dir === "3") a = 135;
    else if (dir === "4") a = 180;
    else if (dir === "5") a = 225;
    else if (dir === "6") a = 270;
    else if (dir === "7") a = 315;
    a += angle;
    if (a < 0) a += 360;
    else if (a >= 360) a -= 360;
    return a;
  }

  // 重写此方法以查找偏移量，以便移动端口可以
  // 被捕捉到与兼容的固定端口重合，
  // 然后将所有部分移动该偏移量。
  moveParts(parts, offset, check) {
    // console.log(parts, offset, check)
    // 移动实际复制的 Parts 集合时，使用在拖动期间计算的偏移量
    if (
      this._snapOffset &&
      this.isActive &&
      this.diagram.lastInput.up &&
      parts === this.copiedParts
    ) {
      super.moveParts(parts, this._snapOffset, check);
      this._snapOffset = undefined;
      return;
    }

    let commonOffset = offset;

    // 找出任何被拖动的节点是否需要任何捕捉
    const sit = parts.iterator;
    while (sit.next()) {
      const node = sit.key;
      if (!(node instanceof go.Node)) continue;
      const info = sit.value;
      // console.log(info,node)
      const newloc = info.point.copy().add(offset);

      // 现在计算这个节点的捕捉点
      const snapoffset = newloc.copy().subtract(node.location);
      let nearbyports = null;
      let closestDistance = 20 * 20; // don't bother taking sqrt
      let closestPort = null;
      let closestPortPt = null;
      let nodePort = null;
      const mit = node.ports;
      while (mit.next()) {
        const port = mit.value;
        if (
          node.findLinksConnected(port.portId).filter((l) => l.category === "").count > 0
        )
          continue;
        const portPt = port.getDocumentPoint(go.Spot.Center);
        portPt.add(snapoffset); // 没有捕捉的地方

        if (nearbyports === null) {
          // 这会收集与节点边界相交的节点，
          // 排除正在被拖动的节点（即在 PARTS 集合中）
          const nearbyparts = this.diagram.findObjectsIn(
            node.actualBounds,
            (x) => x.part,
            (p) => !parts.has(p),
            true
          );

          // 收集这个节点的固定“端口”的 GraphObjects 集合
          nearbyports = new go.Set(/*go.GraphObject*/);
          nearbyparts.each((n) => {
            if (n instanceof go.Node) {
              nearbyports.addAll(n.ports);
            }
          });
        }

        const pit = nearbyports.iterator;
        while (pit.next()) {
          const p = pit.value;
          if (!this.compatiblePorts(port, p)) continue;
          const ppt = p.getDocumentPoint(go.Spot.Center);
          const d = ppt.distanceSquaredPoint(portPt);
          if (d < closestDistance) {
            closestDistance = d;
            closestPort = p;
            closestPortPt = ppt;
            nodePort = port;
          }
        }
      }

      // 找到要捕捉的东西！
      if (closestPort !== null) {
        // 移动节点，使兼容端口重合
        const noderelpt = nodePort
          .getDocumentPoint(go.Spot.Center)
          .subtract(node.location);
        const snappt = closestPortPt.copy().subtract(noderelpt);
        // 保存偏移量，以确保一切都一起移动
        commonOffset = snappt.subtract(newloc).add(offset);
        // 忽略任何 node.dragComputation 函数
        // 忽略任何 node.minLocation 和 node.maxLocation
        break;
      }
    }

    // 现在使用单个（可能是对齐的）偏移量进行标准移动
    this._snapOffset = commonOffset.copy(); // 复制时记住鼠标向上
    super.moveParts(parts, commonOffset, check);
  }

  // 在捕捉的端口之间建立链接，
  // 并删除过时的链接，因为它们的端口不再重合。
  doDropOnto(pt, obj) {
    super.doDropOnto(pt, obj);
    // 需要遍历所有被丢弃的节点以查看哪些端口恰好被捕捉到固定端口
    const coll = this.copiedParts || this.draggedParts;
    const it = coll.iterator;
    while (it.next()) {
      const node = it.key;
      if (!(node instanceof go.Node)) continue;
      // 用链接连接这个节点的所有快照端口（是的，可能不止一个）
      const pit = node.ports;
      while (pit.next()) {
        const port = pit.value;
        // 可能添加一个链接——查看端口是否在另一个兼容的端口
        const portPt = port.getDocumentPoint(go.Spot.Center);
        if (!portPt.isReal()) continue;
        const nearbyports = this.diagram.findObjectsAt(
          portPt,
          (x) => {
            // portPt 处的一些 GraphObject
            let o = x;
            // 沿着面板链向上走
            while (o !== null && o.portId === null) o = o.panel;
            return o;
          },
          (p) => {
            // 一个“端口”面板
            // 父节点不能在被拖动的集合中，并且
            // 这个端口 P 必须与 NODE 的 PORT 兼容
            if (coll.has(p.part)) return false;
            const ppt = p.getDocumentPoint(go.Spot.Center);
            if (portPt.distanceSquaredPoint(ppt) >= 0.25) return false;
            return this.compatiblePorts(port, p);
          }
        );
        // 我们找到兼容的端口了吗？
        const np = nearbyports.first();
        if (np !== null) {
          // 将 NODE 的 PORT 与在同一点找到的另一个端口连接起来
          this.diagram.toolManager.linkingTool.insertLink(node, port, np.part, np);
        }
      }
    }
  }

  // SHIFT 移动时只移动选中的节点，导致节点未对齐。
  // SHIFTing时，必须断开所有与未被拖动节点连接的链接。
  // 如果不使用 SHIFT，移动所有捕捉到选定节点的节点，即使是间接移动。
  computeEffectiveCollection(parts) {
    if (this.diagram.lastInput.shift) {
      const links = new go.Set(/*go.Link*/);
      const coll = super.computeEffectiveCollection(parts);
      coll.iteratorKeys.each((node) => {
        //断开该节点与固定节点连接的所有链接
        if (!(node instanceof go.Node)) return;
        node.findLinksConnected().each((link) => {
          if (link.category !== "") return;
          // 查看此链接是否连接到正在拖动的节点
          const othernode = link.getOtherNode(node);
          if (othernode !== null && !coll.has(othernode)) {
            links.add(link); // 记住以后超时
          }
        });
      });
      // 在嵌套循环之外，我们实际上可以删除链接
      links.each((l) => l.diagram.remove(l));
      return coll;
    } else {
      const map = new go.Map(/*go.Part, Object*/);
      if (parts === null) return map;
      parts.iterator.each((n) => this.gatherConnecteds(map, n));
      return map;
    }
  }

  // 查找其他附加节点。
  gatherConnecteds(map, node) {
    if (!(node instanceof go.Node)) return;
    if (map.has(node)) return;
    // 记录原始Node位置，用于相对定位和取消
    map.add(node, new go.DraggingInfo(node.location));
    // 现在递归地收集所有连接的节点和它们的链接
    node.findLinksConnected().each((link) => {
      if (link.category !== "") return; // 忽略 comment 链接
      map.add(link, new go.DraggingInfo());
      this.gatherConnecteds(map, link.getOtherNode(node));
    });
  }
}
</script>

<style lang="less" scope>
.el-row {
  margin-top: 5px;
  textarea {
    border: 1px solid #a8bec9;
  }
  // 调度节点调控区域
  #myInspector {
    input {
      color: #000;
    }
  }
  #mySavedModel {
    margin: 0 5px;
  }
}
.el-col-4 {
  border: 1px solid #a8bec9;
  border-radius: 4px;
  height: 100%;
  margin-left: 5px;
  // height: 600px;
  // overflow-y: scroll;
}
.el-col-20 {
  .design-and-inspect {
    > span:nth-child(1) {
      width: 83% !important;
      margin: 0 5px;
      border: 1px solid #a8bec9 !important;
      border-radius: 4px;
    }
    > span:nth-child(2) {
      border: 1px solid #a8bec9 !important;
      border-radius: 4px;
    }
  }
  .selectSchedule {
    width: 100px;
    margin: 0 10px 0 0;
  }
}
.el-dialog.customStyle {
  width: 40%;
  height: 50%;
}

.el-dialog__body {
  border-top: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.el-form-item {
  margin-bottom: 18px;
}

.inspector {
  display: inline-block;
  font: bold 14px helvetica, sans-serif;
  color: #000;
  /* background-color: #212121; */
  cursor: default;
}

.inspector table {
  border-collapse: separate;
  border-spacing: 2px;
}

.inspector td,
th {
  padding: 2px;
}

.inspector input {
  background-color: #fff;
  /* Grey 800 */
  color: #f5f5f5;
  font: bold 12px helvetica, sans-serif;
  border: 1px solid #ccc;
  padding: 2px;
}

.inspector input:disabled {
  background-color: #bdbdbd;
  /* Grey 400 */
  color: #1b1b1b;
  /* Grey 700 */
}

.inspector select {
  background-color: #fff;
}
</style>
