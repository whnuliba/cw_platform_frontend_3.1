/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: 工艺流程图基础模板(main-pub)
*/ 
<template>
    <div id="flow-approch1">
        <div style="display:flex;justify-content:center;margin-bottom:5px;" v-if="isShowBtnControl">
            <el-button id="SaveButton" class="el-btn" type="primary" @click="save" v-if="isShowSaveBtn">保存</el-button>
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
            <el-button type="primary" class="el-btn" style="margin-left:0" @click="modifyChart">修改</el-button> 
            <!-- <div class="uploadImg" ref="uploadImg">
                <input 
                type="file" 
                @change="nativeChange" 
                multiple
                name="file"
                accept=".jpg, .jpeg, .png, .JPG, .JPEG, .PNG, .bmp, .BMP" 
                ref="fileInput"
                id="uploadImg"
                >
            </div> -->
        </div>
        
        <div id="flow-chart-area">
           <div class="palette-div" :style="{height: windowHeight}">    
            <div  v-if="isShowNodeTemplate">
                <el-collapse v-model="activeName" accordion>
                <el-collapse-item title="基础模版" name="1">
                    <template slot="title">
                        <i class="header-icon el-icon-s-unfold"></i> 基础模版
                    </template>
                    <div class="collapse-div" ref="myPaletteBase" ></div>
                </el-collapse-item>
                <el-collapse-item title="设备模板" name="2">
                    <template slot="title">
                        <i class="header-icon el-icon-s-platform"></i> 设备模板
                    </template>
                    <div ref="parentDiv">
                        <div class="collapse-div" ref="myPaletteDev"></div>
                    </div>
                    
                </el-collapse-item>
                <el-collapse-item title="模板3" name="3">
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
                </el-collapse-item>
                </el-collapse>
            </div>  
            <div id="myDiagramDiv" ref="myDiagramDiv" :style="{width:'100%'}"></div>

            <!-- 节点属性调整区域 -->
            <span class="node-set" :style="{display: 'inline-block', verticalAlign: 'top', width:'16%'}"   v-if="isShowNodeTemplate">
                <div id='myInspector' class='inspector2' style='height: 597px'>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="nodeInfo" style="text-align: center">节点信息</div>
                                    </td>
                                </tr>
                            </tbody>
                    </table>
                </div>
            </span>  
            <!-- 节点右键面板 -->
            <ul id="contextMenu" ref="contextMenu" class="menu" :style="{top: rightTop,left: rightLeft}"   v-if="isShowNodeTemplate">
                <!-- <li id="task-info" class="menu-item" @click="cxcommand">任务信息</li> -->
                <li id="dele-node" class="menu-item" @click="cxcommand">删除</li> 
            </ul>
           </div>
        <!-- v-if="isShowNodePalette" -->
        <el-dialog
            v-el-drag-dialog
            title="提示"
            :visible.sync="dialogVisible"
            append-to-body
            width="70%"
            custom-class="param-dialog"
            >
            <component :is="variable" :isFlowDts="true" ref="mychild"  @handleRules="handleRules" @dialogSubmit="dialogSubmit"
            :ProcessAddSelect="ProcessAddSelect" />
            <!-- <span slot="footer" class="dialog-footer">
               <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogSubmit">确 定</el-button> 
            </span> -->
        </el-dialog>
            <!-- 保存按钮弹窗 -->
            <NodeInfoModal
                ref="nodeInfoModal"
                :modalTitle="'审批图保存'"
                :isForm="true"
                :firColumns="allflowColumns"
                :modal-append-to-body="false"
                :modalTemp="modalTemp"
                :parentLabel="parentLabel"
                @moveOnFinish="moveOnFinish"
            /> 
        </div>
        
    </div>

  </template>
  <script>
    import FormIndex from '@/components/Form/index';
    import { Inspector } from './Inspector/DataInspector';   // gojs节点控制外部文件
    import switchPic from '@/assets/technology_process/switchPic.png';
    import cabiNet from '@/assets/technology_process/cabinet.png';
    import ysj from '@/assets/technology_process/kyj.png';
    import PBA2 from '@/assets/technology_process/PBA2.png';
    import PBA10 from '@/assets/technology_process/PBA10.png';
    import NodeInfoModal from '@/components/modal/index.vue';
    import BasicTemplate from '@/components/paramsTemplate/basicTemplate';
    import chargeModel from '@/components/paramsTemplate/chargeModel';
    import pointsForModel from '@/components/paramsTemplate/pointsForModel';
    import standTimeModel from '@/components/paramsTemplate/standTimeModel';
    import SelectModel from '@/components/paramsTemplate/SelectModel';
    import OCV1Model from '@/components/paramsTemplate/OCV1Model';
    import DCIRModel from '@/components/paramsTemplate/DCIRModel';
    import IROCVModel from '@/components/paramsTemplate/IROCVModel'
    import elDragDialog from '@/directive/el-drag-dialog';
    import Table from '@/components/TableCommon/index';
    const goBase = go.GraphObject.make;

    export default {
      name: 'processFlowChart',
      directives: {elDragDialog},
      props:{
        'flowCodeData': String,
        'isShowBtnControl': {type: Boolean, default: false},
        'isShowNodeTemplate': {type: Boolean, default: false},
        'ProcessAddSelect': Array,
        'nodeCodeArr': Array,
        'tableDefineData': Array,
        'approval': Array,
        'processAddList': Array,
        'isApproval': Boolean,
        'approvalJson': Object,
        'btnNum': Number,
        'processType': String,
        'rowInfo': Object,
      },
      data() {
        return {
          userId: '',
          isShowSaveBtn: true,
          chartData: {},
          componentData:[
            'SelectModel','OCV1Model','DCIRModel','standTimeModel','pointsForModel','chargeModel' ,'IROCVModel'
          ],
          dialogVisible: false,
          variable:"",
          myDiagramEntity: null,
          myPaletteDev: null,
          myPalette: null,
          activeName:1,
          windowHeight:0,
          rightTop: 0,
          rightLeft: 0,
          divShow: 'none',
          nodeData: '',
         // 节点信息模态变量
         allflowColumns:[
            {field:'工艺类型',key:'bizType',label:'工艺类型',},
            {field:'工艺名称',key:'bizName',label:'工艺名称',},
            {field:'流程编码',key:'pageCode',label:'流程编码',},  // 每个编码必须不一样
            {field:'流程名称',key:'pageName',label:'流程名称',},
         ],
         modalTemp: {
            bizType:'',
            bizName:'',
            pageCode:'',
            pageName:'',
         },
         parentLabel:{
            first:'',
            second:'',
         },
         picArr: [
            {pic:switchPic, category:'pic'}, 
            {pic:cabiNet, category:'cabinet'}, 
            {pic:ysj, category:'ysj'}, 
            {pic:PBA2, category:'PBA2'}, 
            {pic:PBA10, category:'PBA10'}, 
         ],
         devArr: [  
                    { category: "pic"},  
                    { category: 'cabinet'},                   
                    { category: 'ysj'},                   
                    { category: 'PBA2'},                   
                    { category: 'PBA10'},                   
        ],
         newPic:[], 
         newDev:[],
         fileList: [],
         fileData: {},
         imgUpload: '',
         imgKey:0,
         oldJson:"",
        }
      },
      components: { NodeInfoModal, Table, FormIndex, BasicTemplate,SelectModel, 
        OCV1Model,DCIRModel,standTimeModel,pointsForModel,chargeModel,IROCVModel },
      created() {
        this.windowHeight = (window.innerHeight- 170)+'px'
      },
      mounted() {
        this.chartInit();
        this.load(this.flowCodeData);
      },
      methods: {
        approveSubmit() { // 审批确认按钮
            this.$confirm(this.$t('common.processFlowTmpList.submitProcess'), this.$t('common.btn.hint'), {
                confirmButtonText: this.$t('common.btn.ok'),
                cancelButtonText: this.$t('common.btn.cancel'),
                type: 'warning'
                }).then(() => {
                let param = {...this.approvalJson,userId: this.userId}
                const _data = {url: '/process-flow-tmp/process-flow-appr', params: param}
                this.$store.dispatch('fmsCommon/actionFmsPost', _data).then(data => {
                    this.$message({
                    message: this.$t('common.btn.submitSuccess'),
                    type: 'success'
                    })
                    this.$emit('initList',{'current': 1, 'pageSize': 15, requestData: {}})
                })
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: this.$t('common.btn.Cancelled')
                })
            })
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
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }?`);
        },
        // gojs初始化
        chartInit() {
            let newData = this.componentData.map(item => {
                                            return {text:item,value:item}
                                        })
            let _this = this;
            let myDiagram =
                goBase(go.Diagram, this.$refs.myDiagramDiv, 
                {
                "LinkDrawn": showLinkLabel,  
                "LinkRelinked": showLinkLabel,
                "undoManager.isEnabled": true,
                "toolManager.hoverDelay":100,  
            });
            this.myDiagramEntity = myDiagram;

            // 节点模板的帮助程序定义
            function nodeStyle() {
                return [
                    // 如果更改了 Node.location,它将更新节点数据的“loc”属性,使用 Point.stringify 静态方法转换回来。
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    {
                        // 节点位置在每个节点的中心
                        locationSpot: go.Spot.Center,
                        contextMenu: goBase(go.HTMLInfo, {
                                show: showContextMenu,
                                hide: hideContextMenu,
                            }),
                        cursor:'move',
                        /**  linkConnected: function(node, link, port) {
                                        console.log(node, link, port)
                                    },
                            linkDisconnected: function(node, link, port) {
                                    console.log(node, link, port)
                            },*/
                    }
                ];
            }
            // “输出”和“输入”参数控制用户是否可以从端口或到端口绘制链接
            function makePort(name, align, spot, output, input) {
                var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
               // 端口基本上只是一个沿着节点侧面延伸的透明矩形，并在鼠标经过它时会变色
                return goBase(go.Shape,
                        {   
                            fill: "transparent",  
                            strokeWidth: 0, 
                            width: horizontal ? NaN : 8,  // 如果不水平拉伸，只有 8 宽
                            height: !horizontal ? NaN : 8,  // 如果不垂直拉伸，只有 8 高
                            alignment: align,  // 对齐主形状上的端口
                            stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
                            portId: name,  // 声明这个对象作为一个端口
                            fromSpot: spot,  // 声明那条线会连接这个端口
                            fromLinkable: output,  // 声明用户是否可以从此处绘制链接
                            toSpot: spot,  // 声明链接可能在此端口连接的位置
                            toLinkable: input,  // 声明用户是否可以绘制指向此处的链接
                            cursor: "pointer",  
                            mouseEnter: function(e, port) {  // PORT 参数将是这个形状
                                if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
                            },
                            mouseLeave: function(e, port) {
                                port.fill = "transparent";
                            }
                        });
            }
            function textStyle() {
                return {
                    font: "bold 11pt Lato, Helvetica, Arial, sans-serif",
                    stroke: "#F8F8F8"
                }
            }

            //定义通用的“产线”节点
            // Shape从绑定数据中的几何路径字符串获取Geometry
            //此节点还从绑定数据中的端口数据数组中获取所有端口
            // 定义节点模板作为常规节点
            for(let i = 0;i < this.picArr.length;i++) { 
                let item = this.picArr[i]
                myDiagram.nodeTemplateMap.add( item.category,
                                goBase(go.Node, "Table", nodeStyle(),
                                {
                                    doubleClick: function (e, node, c=item.category) { // 双击事件
                                        handlerDC(e,node)
                                        // _this.devDbClick(e, node,c) 
                                    },
                                   click: function(e) {}
                                },
                                goBase(go.Picture, 
                                { source: item.pic, margin: new go.Margin(3,0,3,0), maxSize:new go.Size(120, 120)},
                                ),
                                goBase(go.TextBlock, textStyle(),
                                {
                                    margin: 8,
                                    maxSize: new go.Size(160, NaN),
                                    wrap: go.TextBlock.WrapFit,
                                    editable: true
                                },
                                new go.Binding("text").makeTwoWay()),
                                makePort("T", go.Spot.Top, go.Spot.Top, false, true),
                                makePort("L", go.Spot.Left, go.Spot.Left, true, true),
                                makePort("R", go.Spot.Right, go.Spot.Right, true, true),
                                makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false),
                                {
                                toolTip:
                                    goBase("ToolTip",
                                        goBase(go.TextBlock, { margin: 4 },
                                                new go.Binding("text", "", textShow))  // 提示框展示nodeInfo(data)的返回信息 nodeInfo
                                        )
                            },
                                ),
                                
                    );
            }
            
            myDiagram.nodeTemplate =
                goBase(go.Node, "Table",
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
                               goBase(go.Panel,
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
                        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                        // 根据数据为该Spot Panel创建可变数量的端口
                        new go.Binding("itemArray", "ports"),
                        // 获取这个节点的位置
                        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                        // 获取这个节点的角度 
                        new go.Binding("angle", "angle").makeTwoWay(),
                        new go.Binding("zOrder"),
                        // 将选定的零件移至“画板”图层，因此不会被任何未选定的零件遮盖
                        new go.Binding("layerName", "isSelected", function (s) { return s ? "Foreground" : ""; }).ofObject(),
                        {
                            doubleClick: function (e, node) {// 双击事件
                                handlerDC(e,node)
                            },
                            click: function(e) {
                                _this.nodeClick(e)
                            }
                        },

                        goBase(go.Panel, "Spot",  // 面板 Spot布局, 在主面板块的相对位置,此处是指XLine
                            { name: "SHAPE" },
                            goBase(go.Shape,
                                {
                                    name: "SHAPE",
                                    // 以下是默认值，实际值会通过数据绑定来获取节点数据对象
                                    figure:'Circle',
                                    fill: "rgba(128, 128, 128, 0.5)",
                                    strokeDashArray: null,
                                    stroke: "lightgreen"
                                },
                                new go.Binding('figure','figure'),
                                new go.Binding('strokeDashArray','dashLine'),
                                new go.Binding("fill", "fill"),  // 数据绑定（'属性名','属性值')
                                // shape形状由geometryString定义
                                new go.Binding("geometryString", "geo"),
                                new go.Binding("stroke", "st").makeTwoWay(),
                                new go.Binding("strokeWidth", "stWidth").makeTwoWay(),
                                new go.Binding("width", "width").makeTwoWay(),
                                new go.Binding("height", "height").makeTwoWay(),
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
                            goBase(go.TextBlock,
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
                                new go.Binding("stroke", "color").makeTwoWay(),
                            ),
                            // 提示框
                            {
                                toolTip:
                                    goBase("ToolTip",
                                        goBase(go.TextBlock, { margin: 4 },
                                                new go.Binding("text", "", textShow))  // 提示框展示nodeInfo(data)的返回信息 nodeInfo
                                        )
                            },
                        ),
                        makePort("T", go.Spot.Top, go.Spot.Top, false, true),
                        makePort("L", go.Spot.Left, go.Spot.Left, true, true),
                        makePort("R", go.Spot.Right, go.Spot.Right, true, true),
                        makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
                       
                    ); // node 括号属性
               
                    function textShow(data,diagram){
                    // 函数参数是(节点数据, 节点实体)
                        let text = '';
                        if (data.text) {
                            text = `工艺名称: ${data.text}`
                            if (data.status && data.status.value === 1) {
                                text = `工艺名称: ${data.text}(跳站)`
                            }
                        } else {
                            text = `名称: ${data.category}`
                        }
                        return text;
                    }
                /*节点双击事件*/
                function handlerDC(e,node) {
                    if(node.data.templateCode && node.data.templateCode.value) {
                        _this.variable = node.data.templateCode.value;
                        _this.dialogVisible = true; 
                        let chartFlowData = _this.processAddList, row={};
                        chartFlowData.forEach(item => {
                        if (item.processCode === node.data.nodeCode.value) {
                                row = item
                            }
                        })
                       
                        _this.$nextTick(() => {
                            switch(_this.processType) {
                                case 'flowList':
                                    _this.$refs.mychild.dataUpdate(row, '/process-dts/guest/get-dts', _this.btnNum)
                                break;
                                case 'approveWait':
                                    _this.$refs.mychild.dataUpdate(row, '/process-dts-tmp/guest/get-dts', _this.btnNum)
                                break;
                                default:
                                break;
                            }

                            
                        })
                        
                    } else {
                        _this.$message({
                            type: 'warning',
                            message: '当前工艺无需设置参数!'
                        })
                    } 
                    
                }
                // let cxElement = this.$refs.contextMenu;

                // function hideCX() {
                //     if (myDiagram.currentTool instanceof go.ContextMenuTool) {
                //         myDiagram.currentTool.doCancel();
                //     }
                // }

                function showContextMenu(obj, diagram, tool) {
                        // _this.nodeData = obj.data;
                        // let mousePt = diagram.lastInput.viewPoint;
                        // _this.rightLeft = (mousePt.x+185) + 'px';
                        // _this.rightTop = (mousePt.y+63) + 'px';
                        // cxElement.classList.add('show-menu');

                }
       
                function hideContextMenu(obj, diagram, tool) {
                        // cxElement.classList.remove('show-menu');
                }
                if (_this.isShowNodeTemplate) {
                    cxElement.addEventListener("contextmenu", e => {
                                                e.preventDefault();
                                                return false;
                                        }, false);
                }

            // defineFigureGenerator 来自 ../extensions/Figures.js:
            go.Shape.defineFigureGenerator("File", function(shape, w, h) {
                var geo = new go.Geometry();
                var fig = new go.PathFigure(0, 0, true); // starting point
                geo.add(fig);
                fig.add(new go.PathSegment(go.PathSegment.Line, .75 * w, 0));
                fig.add(new go.PathSegment(go.PathSegment.Line, w, .25 * h));
                fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
                fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
                var fig2 = new go.PathFigure(.75 * w, 0, false);
                geo.add(fig2);
                // 折叠
                fig2.add(new go.PathSegment(go.PathSegment.Line, .75 * w, .25 * h));
                fig2.add(new go.PathSegment(go.PathSegment.Line, w, .25 * h));
                geo.spot1 = new go.Spot(0, .25);
                geo.spot2 = go.Spot.BottomRight;
                return geo;
            });
            myDiagram.nodeTemplateMap.add("Comment",
                                        goBase(go.Node, "Auto", nodeStyle(),
                                            goBase(go.Shape, "File",
                                            { fill: "#282c34", stroke: "#DEE0A3", strokeWidth: 3 }),
                                            goBase(go.TextBlock, textStyle(),
                                            {
                margin: 8,
                maxSize: new go.Size(200, NaN),
                wrap: go.TextBlock.WrapFit,
                textAlign: "center",
                editable: true
            },
            new go.Binding("text").makeTwoWay())
            // 没有端口，因为不允许任何链接与注释连接
            ));
          
            // 替换链接模板映射中的默认链接模板
            myDiagram.linkTemplate =
                goBase(go.Link,  // 全部连线的面板
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
                    mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
                    mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; },
                    selectionAdorned: false,
               /**  linkConnected: function(node, link, port) {
                                        console.log(node, link, port)
                                    } */ 
                },
                {
                            doubleClick: function (e, node) {  // 双击事件
                                if(_this.isShowNodeTemplate) {
                                    _this.$confirm('确认删除连线?', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                    }).then(() => {
                                        // 删除连线和节点的统一方式
                                        myDiagram.commandHandler.deleteSelection();
                                    })
                                }
                                
                            },
                },
                new go.Binding("points").makeTwoWay(),
                goBase(go.Shape,  // 形状高亮,但是一般是透明
                    { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
                goBase(go.Shape,  // 链路路径形状
                    { isPanelMain: true, stroke: "gray", strokeWidth: 3 },
                    new go.Binding("stroke", "isSelected", function(sel) { return sel ? "dodgerblue" : "gray"; }).ofObject()),
                goBase(go.Shape,  // 箭头形状
                    { toArrow: "standard", strokeWidth: 2, fill: "gray" }),
                goBase(go.Panel, "Auto",  // 连接的标签, 通常不隐藏
                    { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
                    new go.Binding("visible", "visible").makeTwoWay(),
                    goBase(go.Shape, "RoundedRectangle",  // 标签形状
                    { fill: "#F8F8F8", strokeWidth: 0 }),
                    goBase(go.TextBlock, "Yes",  // 标签文本
                    {
                        textAlign: "center",
                        font: "10pt helvetica, arial, sans-serif",
                        stroke: "#333333",
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay())
                    )
                );

            // 如果来自“条件”节点, 则使链接标签可见, 此侦听器由“LinkDrawn”和“LinkRelinked”DiagramEvents调用。
            function showLinkLabel(e) {
                var label = e.subject.findObject("LABEL");
                if (label !== null) label.visible = (e.subject.fromNode.data.category === "Conditional");
            }
            // LinkingTool 和 RelinkingTool 使用的临时链接也是正交的：
            myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
            myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

            if (this.$refs.myPaletteBase && this.$refs.myPaletteDev) {
                // 初始化拖拽面板一般在左边
                let myPalette =
                    goBase(go.Palette, this.$refs.myPaletteBase,
                    {
                    // 使用自定义淡入淡出而不是默认动画
                    "animationManager.initialAnimationStyle": go.AnimationManager.None,
                    "InitialAnimationStarting": animateFadeDown, // 相反，使用此函数进行动画处理
                    nodeTemplateMap: myDiagram.nodeTemplateMap,  // 共享 myDiagram 使用的模板
                    model: new go.GraphLinksModel(  // 指定组件面板的内容
                        {
                                        copiesArrays: true,
                                        copiesArrayObjects: true,
                                        linkFromPortIdProperty: "fromPort",
                                        linkToPortIdProperty: "toPort",
                                        nodeDataArray: [
                                            {  
                                                key: 0,
                                                fill: '#282c34',
                                                st: '#00A9C9',
                                                stWidth: 3.5,
                                                font:"bold 11pt Lato, Helvetica, Arial, sans-serif",
                                                figure: "Circle",
                                                width:80,
                                                height:80,
                                                text: '开始'
                                            }, 
                                            {  
                                                key: 1,
                                                fill: '#282c34',
                                                st: '#09d3ac',
                                                font:"bold 11pt Lato, Helvetica, Arial, sans-serif",
                                                stWidth: 3.5,
                                                figure: "Rectangle",
                                                width:80,
                                                height:40,
                                                text: '步骤'
                                            }, 
                                            {  
                                                key: 2,
                                                fill: '#282c34',
                                                st: '#09d3ac',
                                                font:"bold 11pt Lato, Helvetica, Arial, sans-serif",
                                                stWidth: 3.5,
                                                figure: "Diamond",
                                                width:80,
                                                height:80,
                                                text: '条件'
                                            }, 
                                            {  
                                                key: 3,
                                                fill: '#282c34',
                                                st: '#DC3C00',
                                                font:"bold 11pt Lato, Helvetica, Arial, sans-serif",
                                                stWidth: 3.5,
                                                figure: "Circle",
                                                width:80,
                                                height:80,
                                                text: '结束'
                                            }, 
                                            {  
                                                key: 4,
                                                fill: '#282c34',
                                                st: '#DEE0A3',
                                                font:"bold 11pt Lato, Helvetica, Arial, sans-serif",
                                                stWidth: 3.5,
                                                figure: "Rectangle",
                                                width: 90,
                                                height: 40,
                                                text: '评论'
                                            }, 
                                            {  
                                                key: 5,
                                                fill: '#282c34',
                                                st: '#09d3ac',
                                                font:"bold 11pt Lato, Helvetica, Arial, sans-serif",
                                                stWidth: 3.5,
                                                figure: "Rectangle",
                                                width: 60,
                                                height: 60,
                                                text: '其他'
                                            }, 
                                    ]  
                        } 
                    )
                })
                this.myPalette = myPalette;
                let myPaletteDev =
                        goBase(go.Palette, this.$refs.myPaletteDev,
                        {
                        // 使用自定义淡入淡出而不是默认动画
                        "animationManager.initialAnimationStyle": go.AnimationManager.None,
                        "InitialAnimationStarting": animateFadeDown, // 相反，使用此函数进行动画处理
                        nodeTemplateMap: myDiagram.nodeTemplateMap,  // 共享 myDiagram 使用的模板
                        model: new go.GraphLinksModel(_this.devArr)
                    });
                this.myPaletteDev = myPaletteDev;
            }

            // 这是默认动画的重新实现，只不过它是从下而不是向上淡入。
            function animateFadeDown(e) {
                var diagram = e.diagram;
                var animation = new go.Animation();
                animation.isViewportUnconstrained = true; // 所以图表定位规则让动画在屏幕外开始
                animation.easing = go.Animation.EaseOutExpo;
                animation.duration = 900;
                // 淡入“向下”，换句话说，从上方淡入
                animation.add(diagram, 'position', diagram.position.copy().offset(0, 200), diagram.position);
                animation.add(diagram, 'opacity', 0, 1);
                animation.start();
                }
                if (_this.isShowNodeTemplate) {
                    new Inspector('myInspector', myDiagram,
                            {
                                // 允许一次检查多个节点
                                multipleSelection: true,
                                // 当多项选择为真时，将显示最大数量的节点属性
                                showSize: 4,
                                showAllProperties: true,
                                properties: {
                                    "key": { show: Inspector.showIfPresent, readOnly: true, },
                                    "flowSort": { show: Inspector.showIfNode },
                                    "text": {
                                        show: Inspector.showIfNode = function(t) {return t.data.RackCode ? false : Inspector.showIfNode}
                                    },
                                    "isGroup": { readOnly: true, show: Inspector.showIfPresent },
                                    "geo": { readOnly: true },
                                    "loc": { readOnly: true, show: Inspector.showIfPresent },
                                    "ports": { readOnly: true },
                                    // 'size': {show: Inspector.showIfNode,},
                                    // "color": { show: Inspector.showIfNode, type: 'color' },
                                    "nodeCode": {
                                            show: Inspector.showIfNode,
                                            type: "select",
                                            choices: function (node, propName,propertyValue) {
                                                let nodes = myDiagram.model.findNodeDataForKey(node.data.key);
                                                myDiagram.model.setDataProperty(nodes,'text',propertyValue.text)
                                                if (Array.isArray(node.data.choices)) return node.data.choices;
                                                return  _this.nodeCodeArr.filter(item => item.text !== "test");
                                            }
                                        }, 
                                    "templateCode": {
                                            show: Inspector.showIfNode,
                                            type: "select",
                                            choices: function (node, propName,propertyValue) {
                                                if (Array.isArray(node.data.choices)) return node.data.choices;
                                                return newData;
                                            }
                                        }, 
                                }
                            });
                }
    }, 

    nodeClick(e,obj) {
    },
    devDbClick(e,node,c) {
        switch (c) {
            case 'pic':
            console.log(e,node,c)
            break;
            case 'cabinet':
            console.log(e,node,c)
            break;
            case 'ysj':
            console.log(e,node,c)
            break;
            default:
            break;
        }
    },
    // 右击面板单击事件
    cxcommand(e) {
        let val = e.currentTarget.id;
        if (this.nodeData.category) {
                switch (val) {
                            case "task-info": 
                                console.log('111')
                            break; 
                            case "dele-node": 
                                    this.$confirm('确认删除节点?', '提示', {
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',
                                            type: 'warning'
                                            }).then(() => {
                                                this.myDiagramEntity.commandHandler.deleteSelection();
                                            })
                            break; 
                            default: 
                            break;
                        }
        } else {
                switch (val) {
                        case "task-info": 
                        console.log('222')
                        break; 
                        case "dele-node": 
                            this.$confirm('确认删除节点?', '提示', {
                                                confirmButtonText: '确定',
                                                cancelButtonText: '取消',
                                                type: 'warning'
                                                }).then(() => {
                                                    this.myDiagramEntity.commandHandler.deleteSelection();
                                            })
                        break; 
                        default: 
                        break;
                    }
                    
        }
        this.myDiagramEntity.currentTool.stopTool();              
    },

    save() {
        this.modalTemp = {
            pageCode: this.flowCodeData,
            bizType: 'COMM_PR_FLOW_TYPE'
        };
        this.$refs.nodeInfoModal.modalOpen();
    },
    // 流程图修改按钮 
    modifyChart(){
        this.modalTemp = this.chartData;
        this.$refs.nodeInfoModal.modalOpen();
    },
                

    // 保存确定事件
    moveOnFinish(){
        let i = 0, flowDataParams = [];
        for(var nit = this.myDiagramEntity.nodes;nit.next();){  
                                        let node = nit.value,linkArr = nit.value.linksConnected.rb.m, pre = 0, next = 0;
                                        // 设置节点对应属性
                                        this.myDiagramEntity.startTransaction("set nodeIndex");
                                        let nodes = this.myDiagramEntity.model.findNodeDataForKey(node.data.key);
                                        this.myDiagramEntity.commitTransaction("set nodeIndex");
                                        if (!nodes.nodeCode) {
                                            this.$message({
                                                type:'warning',
                                                message: '请先选择nodeCode'
                                            })
                                            return
                                        }

                                        if (linkArr.length === 1 && linkArr[0].data.from === nodes.key){
                                            pre = '##',next = linkArr[0].data.to;
                                        } else if((linkArr.length===2 && linkArr[0].data.to === nodes.key && linkArr[1].data.from === nodes.key) ){ 
                                            pre = linkArr[0].data.from,next = linkArr[1].data.to;
                                        } else if((linkArr.length===2 && linkArr[1].data.to === nodes.key && linkArr[0].data.from === nodes.key) ){ 
                                            pre = linkArr[1].data.from,next = linkArr[0].data.to;
                                        } else if(linkArr.length === 1 && linkArr[0].data.to === nodes.key){
                                            pre = linkArr[0].data.from,next = null;
                                        }
                                        flowDataParams.push({
                                            "flowId":'',
                                            "templateCode": '',
                                            "processCode": nodes.nodeCode.value,  // 每个工艺的编码
                                            "preProcessNode": pre === '##' ? '##' :this.myDiagramEntity.model.findNodeDataForKey(pre).nodeCode.value,
                                            "nextProcessNode": next === null ? null : this.myDiagramEntity.model.findNodeDataForKey(next).nodeCode.value,
                                        })
                                    }
        let newDataArr = flowDataParams.map(item => {
            let tt = '';
            this.tableDefineData.forEach(tb => {
                if (item.processCode === tb.processCode) {
                    tt = tb.template
                }
               
            })
            return {...item, templateCode:tt} 
        })
        newDataArr.forEach(item=> {
                for(var nit = this.myDiagramEntity.nodes;nit.next();){  
                                        let node = nit.value;
                                        // 设置节点对应属性
                                        this.myDiagramEntity.startTransaction("set nodeIndex1");
                                        let nodes = this.myDiagramEntity.model.findNodeDataForKey(node.data.key);
                                        if (nodes.nodeCode.value === item.processCode) {
                                          this.myDiagramEntity.model.setDataProperty(nodes,'templateCode',{text:item.templateCode,value:item.templateCode})  
                                        }
                                        this.myDiagramEntity.commitTransaction("set nodeIndex1");
                                }
        })                                
   if (!this.modalTemp.id) { // 保存
        let json = {
            data: {
                ...this.modalTemp,
                scripts: this.myDiagramEntity.model.toJson() 
            }
        };
        let _data = {url: '/page-conf/add', params: json}
        this.$store.dispatch('fmsCommon/actionTaskPost', _data).then((res => {
                if (res) {
                    this.isShowSaveBtn = false;
                    this.$message({
                        type: 'success',
                        message: this.$t('common.btn.addSuccess'), 
                    })
                }
            })) 

       } else {  // 修改
        
        let json = {
            data: {
                id: this.chartData.id,
                scripts: this.myDiagramEntity.model.toJson() 
            }
        };
        let _data = {url: '/page-conf/save-script', params: json}
        this.$store.dispatch('fmsCommon/actionTaskPost', _data).then((res => {
                if (res) {
                    this.$message({
                        type: 'success',
                        message: this.$t('common.btn.updateSuccess'), 
                    })
                }
            })) 

       }   
        
    // 新增和修改保存流程图数据 
     const dataParam = {url: '/process-flow-tmp-dts/createOrUpdate', params: {data: newDataArr}}
        this.$store.dispatch('fmsCommon/actionFmsPost', dataParam).then((response => {
            console.log(response)
        }))  
    },

    load(bizCode) {
       /**  let param = {
            data: {
                  bizType: 'COMM_PR_FLOW_TYPE',
                  bizCode: bizCode,
            }
        };
        const _data = {url: '/page-conf/guest/biz-type-code', params: param}
        this.$store.dispatch('fmsCommon/actionTaskPost', _data).then((response => {
           if (response.length) {
            this.chartData = response[0];
            this.modalTemp = response[0];
            if (this.chartData && this.chartData.id) {
                this.isShowSaveBtn = false;
            }
            this.myDiagramEntity.model = go.Model.fromJson(response[0].scripts);
           }
            
        })) */
         this.myDiagramEntity.model = go.Model.fromJson(this.rowInfo.graph);


    },
    // 上传时
    dataUpload(uploadfile) {
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

        /** delete fileObj.length;
            for(let key in fileObj) {
                if(key !== 'length' && key !== 'item') {
                    newFile.push(fileObj[key])
                }
                let file = fileObj[key];
               
            }
            newFile.forEach((item,i) => {
              let reader = new FileReader();
              reader.readAsDataURL(item); 
              reader.onload = (e) => {
                   let fileString = e.target.result;
                   this.imgUpload = fileString;
                   this.newPic.push({pic: fileString, category:'uploadPic'+i})
                   this.newDev.push({category:'uploadPic'+i})
               }
           }) 
        **/
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

            /** this.picArr.push(...this.newPic)
            this.devArr.push(...this.newDev) **/  
               
            // let file = e.target.files[0];
            // document.getElementById('mySavedModel').value 
            this.oldJson= this.myDiagramEntity.model.toJson();
            this.myDiagramEntity.model = go.Model.fromJson(this.oldJson); 
    },

    }
    }
  </script>
  
  <style lang="less" scoped> 
    #flow-approch1 { 
        width:100%;
        height: 100%;
        .approve-sel {
            margin:0 10px;
        }
        .el-btn{
            margin-right:10px;
        } 
        overflow-y: hidden !important;

        //    input#uploadImg::file-selector-button {
        //      background-color: #1890ff;
        //     color: #FFFFFF;
         //   border-radius: 3px;
        //    border: 0px;
        //    width: 90px;
        //    height: 36px;
       //     display: inline-block;
       //     margin-right: 10px;
        //     }

        #flow-chart-area{
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
           ::v-deep .el-dialog.param-dialog {
                        height:80%;           
           }
           .node-set {
                background: #00a1ff2b;
                border: 1px solid  #aaa;
                border-radius: 3px;
                margin-left:5px;
           }
            .palette-div{
                margin: 0 0 5px 0;
                width: 100%; 
                display: flex; 
                justify-content: space-between;
                >div:nth-child(1) {
                    width: 14%;
                    margin-right: 7px;
                    .collapse-div {
                        height:600px;
                        margin-right: 2px; 
                        background-color: CornflowerBlue; 
                        position: relative; 
                        -webkit-tap-highlight-color: rgba(255, 255, 255, 0); 
                        cursor: auto;
                    }
                }  
                >div:nth-child(2) {
                    width: 86%;
                }  
            }
            >div {
                .el-collapse-item ::v-deep .el-collapse-item__header{
                    background-color: #00a1ff2b;
                    border:1px solid #aaa;
                    border-radius: 3px;
                }
            }
        }
   }
   /deep/.el-dialog__body{
                height: 85vh;
                overflow-y: scroll;
        }
   .menu{
                  display: none;
                  position:absolute;
                  margin:0;
                  list-style:none;
                  padding:8px 0;
                  z-index: 999;
                  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12);
                  background-color: #fff;
                  border-radius:4px;
            .menu-item{
                &:hover{
                    cursor:pointer;
                    background-color: #282c34;
                    color: white;  
                }
                padding:5px;
                text-align: center;
            }
      }
    .show-menu {
        display: block;
    }
  </style>
