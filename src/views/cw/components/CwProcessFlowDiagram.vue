/*
 * @CreatAuthor: xwt
 * @UpdateAuthor: (...)
 * @Description: 页面设计 -- 工艺流程图组件
*/
<template>
  <div class="app-container" ref="formRef" :class="className" :style="myStyle"  @click="onClick"  :itemStyle="itemStyle" :panelStyle="panelStyle">
        <div id="flow-chart-area1" :style="{overflowY:'scroll'}">
           <div class="palette-div" :style="{height: windowHeight}">
            <!-- 中间流程图部分 -->
            <div id="myDiagramDiv1"></div>
           </div>
        </div>
  </div>
  </template>
  <script>
    import {getProcessInfo} from '@/api/process'
    import { Inspector } from './processChartInspector/DataInspector';   // gojs节点控制外部文件
    import {dispatchEvent} from "../utils/eventUtils";
    const goBase = go.GraphObject.make;

    export default {
        name: "CwProcessFlowChart",
        directives: {  },
        props: {
          vueContext: {
            type: Object,
            default: () => {
              return {}
            }
          },
          isApproval: {
            type:Boolean,
            default: true
          },
          className: {
              type: String,
              default: "chart",
            },
          panelStyle: {
            type: Object,
            default: () => {
              return {
                width:'100%'
              }
            }
          },
          componentModalObj: {
            type: Object,
            default: () => {
              return {}
            }
          },
          fieldName: {
            type: String,
            default: ''
          },
          myStyle: {
            type: Object,
            default: () => {
              return { color:'black',height:'900px',width:'100%',backgroundColor: 'rgba(227, 237, 233, 1)'}
            }
          },
          itemStyle: {
            handler: function (newVal, oldVal) {
                if (newVal) {
                    for (let i in newVal) {
                        this.$refs.formsRef.style[i] = newVal[i]
                    }
                }
            },
            deep: true
          },
          itemVal: {
            type: String,
            default: ''
          },
          compId: {
            type: String,
            default: ''
          },
          component:{
            type: Object,
            default: () =>{}
          },
          componentData:{
            type: Array,
            default: () =>[]
          },
          bindData:{
            type: Object,
            default: () =>{}
          },

        },
        watch: {
          itemVal: {
            handler: function (newVal, oldVal) {
              if (newVal) {
                this.compVal = newVal
              }
            },
            deep: true
          }
        },
        data() {
          return {
            ProcessAddSelect: [],
            processAddList: [],
            processClick: {},
            compVal: [],
            nodeContextclick: false,
            nodeSelectNum: [],
            approvalJson: {
              data: {
                userId: "",
                bizCode: "BS0001",
                model: "processapprovalmodel",
                currentState: "",
                bizId: "",
              },
            },
            approval: [],
            tableDefineData: [],
            linkNum: 0,
            userId: "",
            paramsTempData: [
              "SelectModel",
              "OCV1Model",
              "DCIRModel",
              "standTimeModel",
              "pointsForModel",
              "chargeModel",
              "injectingLiquidModel",
              "IROCVModel",
              "envelope",
              "postHeliumTest",
              "weld",
            ],
            variable: "",
            myDiagramEntity: null,
            myPaletteDev: null,
            myPalette: null,
            activeName: '1',
            windowHeight: 0,
            rightTop: 0,
            rightLeft: 0,
            nodeData: "",
            picArr: [
              // {pic:switchPic, category:'pic'},
              // {pic:cabiNet, category:'cabinet'},
              // {pic:ysj, category:'ysj'},
              // {pic:PBA2, category:'PBA2'},
              // {pic:PBA10, category:'PBA10'},
            ],
            preDelLinks: [],
            nodeCodeArr: [],
          };
        },
        components: {

        },
        created() {
          this.windowHeight = window.innerHeight - 170 + "px";
        },
        mounted() {
          this.chartInit();
          this.defineInitList();
          this.initApproval();
          // this.load(this.rowInfo);
        },
        beforeDestroy() {
        },
        methods: {
          initApproval() {
            let json = { data: "BS0001" };
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
          getStyleCols() {
            return [
              { field: 'width', title: '长度', queryType: 'input', defaultValue: '100%', },
              { field: 'height', title: '高度', queryType: 'input', },
              { field: 'borderColor', title: '边框颜色', queryType: 'colorpicker', defaultValue: '#127310', },
              { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', defaultValue: 'rgba(227, 237, 233, 1)', },
            ]
          },
          getAttributeCols() {
            return [
              //{ field: 'bizCode', title: 'bizCode', queryType: 'input', require: false, query: true, hide: false },
              //{ field: 'bizType', title: 'bizType', queryType: 'input', require: false, query: true, hide: false },
            ]
          },
          comText() {
            return '工艺流程图';
          },
          ificationType() {
            return {
              classification: '布局容器组件',
              isCanvasview: false,
            }
          },
          handleDragStart(event) {
              event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY,action:'setLocation',compId:this.compId}));
            },
          handleDragEnd() { },
          onClick(e){},
          handlerEvent(tag,v1,v2,v3,v4){
              let args = []
              if(v1)  args.push(v1)
              if(v2)  args.push(v2)
              if(v3)  args.push(v3)
              if(v4)  args.push(v4)
              //console.log(this,this.$refs,this.$refs.myrefTree)
              this.$nextTick(()=>{
                const ele = this.$el //$refs.myrefTree.$el

              if(ele){
                dispatchEvent(ele,tag,args)
              }
              })
            },
            initProcessAddSelect(apiUrl, params) {
              const _data = { url: apiUrl, params: params }; // "/process/getall" {}
              this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((data) => {
                this.ProcessAddSelect = data;
                if (data.length > 0) {
                  // 获取工艺编码
                  this.nodeCodeArr = data.map((item) => {
                    return { text: item.processName, value: item.processCode };
                  });
                }
              });
            },
          defineInitList() {
            let json = { current: 1, pageSize: 100 };
            getProcessInfo(json).then((response) => {
              this.tableDefineData = response.data; 
            });
          },

          initProcessAddTable() {
            const _data = {
              url: "/process-flow-dts/guest/get-dts",
              params: { data: this.rowInfo.id },    
            };
            this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((data) => {
              this.processAddList = data;
              document.body.ondrop = function (event) {
                event.preventDefault();
                event.stopPropagation();
              };
            });
          },
          handleRules() {},
          // gojs初始化
          chartInit() {
            let newData = this.paramsTempData.map((item) => {
              return { text: item, value: item };
            });
            let _this = this;
            let myDiagram1 = goBase(go.Diagram, "myDiagramDiv1", {
              LinkDrawn: showLinkLabel,
              LinkRelinked: showLinkLabel,
              "undoManager.isEnabled": true,
              "toolManager.hoverDelay": 100,
            });
            this.myDiagramEntity = myDiagram1;
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
              myDiagram1.nodeTemplateMap.add(
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

            myDiagram1.nodeTemplate = goBase(
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
                    isMultiline: false, //是否能多行
                    maxLines: 3, //最多三行
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
                text = `${_this.commonI18n('const.pageDesign.page.processName')}: ${data.text}`;
                if (data.status && data.status.value === 1) {
                  text = `${_this.commonI18n('const.pageDesign.page.processName')}: ${data.text}_${_this.commonI18n('common.processFlowTmpList.jumpStation')}`;
                } else if (data.status && data.status.value === 2) {
                  text = `${_this.commonI18n('const.pageDesign.page.processName')}: ${data.text}`;
                  // (过站)
                }
              } else {
                text = `${_this.commonI18n('const.pageDesign.page.processName')}: ${data.category}`;
              }
              return text;
            }
            /*节点双击事件*/
            function handlerDC(e, node) {
              if (node.data.templateCode && node.data.templateCode.value) {
                _this.variable = node.data.templateCode.value;
                //_this.dialogVisible = true;
                let chartFlowData = _this.processAddList, row = {};

                chartFlowData.forEach((item) => {
                  if (item.processCode === node.data.nodeCode.value) {
                    _this.processClick = item;
                    row = item
                  }
                });
                _this.$nextTick(() => {
                    _this.handlerEvent('params-temp', node, row)
                });
              } else {
                _this.$message({
                  type: "warning",
                  message: "当前工艺无需设置参数!",
                });
              }
            }


            function showContextMenu(obj, diagram, tool) {
              _this.linkNum = obj.linksConnected.count;
              _this.preDelLinks = JSON.parse(myDiagram1.model.toJson()).linkDataArray;
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
            myDiagram1.nodeTemplateMap.add(
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

            myDiagram1.commandHandler.doKeyDown = function () {
              const e = myDiagram1.lastInput;
              const control = e.control || e.meta;
              const key = e.key;

              // 取消 Ctrl+A/Z/Y/G  A-全选、Z-撤销、Y-重做、G-分组
              // if (control && ['A', 'Z', 'Y', 'G'].includes(key)) return
              // 取消 Del/Backspace 删除键
              if (key === "Del" || key === "Backspace") return;

              go.CommandHandler.prototype.doKeyDown.call(this);
            };
            // 替换链接模板映射中的默认链接模板
            myDiagram1.linkTemplate = goBase(
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
                      myDiagram1.commandHandler.deleteSelection();
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
            myDiagram1.addDiagramListener("LinkDrawn", function (e) {
              // console.log(e)
            });
            myDiagram1.addDiagramListener("SelectionDeleting", function (e) {
              // DiagramEvent.subject 是要删除的 Parts 的集合
              e.subject.each(function (part) {
                /**  if (!(part instanceof go.Node)) return;
                              var animation = new go.Animation();
                              var deletePart = part.copy();
                              animation.add(deletePart, "scale", deletePart.scale, 0.01);
                              animation.add(deletePart, "angle", deletePart.angle, 360);
                              animation.addTemporaryPart(deletePart, myDiagram1);
                              animation.start();*/
              });
            });
            //  图表和内部元素选中之后触发事件 
            myDiagram1.addDiagramListener("ChangedSelection", function (e) {
              let selectedNodesNum = [];
              let myDiagramSel = e.diagram;
              let selectedNodes = myDiagramSel.selection; // 获取当前选中的所有节点
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
            myDiagram1.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
            myDiagram1.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

           },
          // 选择模块nodeCode获取参数template
          //nodeCode数据关联templateCode和text
          // codeGetTemplate(node, myDiagram1, propertyValue) {
          //   const datas = this.tableDefineData;
          //   let nodes = myDiagram1.model.findNodeDataForKey(node.data.key);
          //   if (propertyValue != "") {
          //     let newTemplateCode = datas.find((item) => {
          //       if (item.processCode == propertyValue.value) {
          //         return item;
          //       }
          //     });
          //     let template = newTemplateCode.template;
          //     myDiagram1.model.setDataProperty(nodes, "templateCode", {
          //       text: template,
          //       value: template,
          //     });
          //   }
          //   myDiagram1.model.setDataProperty(nodes, "text",propertyValue.text ? `${_this.commonI18n(propertyValue.text)}\
          //   (${propertyValue.value})`: `${_this.commonI18n('common.processFlowTmpList.node')}`);
          // },
          nodeClick(e, obj) {
            // this.isNodeInfo = true;
            // this.isParamsSet = false;
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


          load(graphJson) {
            let _this = this;
            this.rowInfo = graphJson;
            this.initProcessAddTable()
            if (
              graphJson &&
              graphJson.graph &&
              JSON.parse(graphJson.graph).nodeDataArray.length
            ) {
              let nodeArrt = JSON.parse(graphJson.graph);
              for (let i = 0; i < nodeArrt.nodeDataArray.length; i++) {
                let item = nodeArrt.nodeDataArray[i];
              //  item.text = item.text ? `${_this.commonI18n(item.text.split(' ')[0])} ${item.text.split(' ')[1]}` : item.text;
                if (item.status && item.status.value === 1) {
                  item.fill = "#FFFF77";
                  item.color = "#000";
                } else {
                  item.fill = "#000";
                }
              }

              _this.myDiagramEntity.model = go.Model.fromJson(JSON.stringify(nodeArrt));
            } else {
              _this.myDiagramEntity.model = go.Model.fromJson({ "class": "GraphLinksModel","nodeDataArray": [],"linkDataArray": [] });
            }
          },

        },
};
</script>

<style lang="less" scoped>
  #flow-chart-area1 {
    div {
      flex-grow: 1;
      #myDiagramDiv1 {
        border: 1px solid #aaa;
        position: relative;
        border-radius: 3px;
        background-color: #00a1ff2b;
        position: relative;
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
        cursor: auto;
      }
    }
    .palette-div {
      margin: 0 0 5px 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    > div {
      .el-collapse-item ::v-deep .el-collapse-item__header {
        background-color: #00a1ff2b;
        border: 1px solid #aaa;
        border-radius: 3px;
      }
    }
  }

/deep/.el-dialog__body {
  height: 85vh;
  overflow-y: scroll;
}

.show-menu {
  display: block;
}
</style>
