/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: 生产监控-生产货位监控
 */
<template>
    <el-row>
        <el-col :span="24">
            <div :style="{display: 'flex','justify-content':'center',margin: '5px 0'}">
                <el-select class="selectSchedule" @change="changeLocation" v-model='scheduleType'>
                    <el-option v-for="(item,i) in seleConfig" :key="`loca${i}`"
                    :value='item.id' 
                    :label="item.fileName"
                    />
                </el-select>
                <!-- <el-button @click='monitorBtn' type="primary" id='monitorBtn'>{{$t('common.btn.monitor')}}</el-button> -->
                <el-button id="SaveButton" @click="zoomIn" type="primary">{{$t('common.btn.enlarge')}}</el-button>  
                <el-button id="SaveDesign" @click="zoomOut" type="primary">{{$t('common.btn.lessen')}}</el-button>  
            </div>
            <div class="design-and-inspect">
               <span>
                  <div ref='myDiagramDiv' class="myDiagramDiv" :style="monitorArea" v-loading="loading"/>
               </span>
            </div> 
        </el-col>  
        <!-- 节点信息模态 -->
        <modalComponent 
            ref='modalchild'
            :isTab="true"
            :firColumns='firColumns'
            :secColumns='secColumns'
            :selColumns="selColumns"
            :modalTitle='title'
            :parentLabel="parentLabel"
            :modalTemp="TempObj['modalTemp']"
            :modalFormInfo="modalFormInfo"
            :imgExist="imgExist"
            :srcObj='srcObj'
            @nodeCancel= 'nodeCancel'
        />
    </el-row>
</template>

<script>
    import elDragDialog from '@/directive/el-drag-dialog';
    import elImageViewer from 'element-ui/packages/image/src/image-viewer';
    import modalComponent from '@/components/modal/index';
    import jq from 'jquery';
    import i18n from '@/lang'; // internationalization
    const Make = go.GraphObject.make;
    let timeDelay = 0;   // redArr = [],
    export default {
        name: 'prodLocationMonitor',
        components: { elImageViewer, modalComponent },
        directives: { elDragDialog },
        data() {
            return {
                loading: false,
                modalFormInfo:{},
                imgExist: true,
                srcObj: require('@/assets/logistics_monitor/shelves.jpg'),
                title: '',
                firColumns:[
                    {key: 'rackName',label:'货架名称',disabled:true},
                    {key: 'rackCode',label:'货架编号',disabled:true},
                    
                ],
                secColumns:[
                    {key: 'lotType',label:'托盘类型',disabled:true},
                    {key: 'lotCode',label:'货架编号',disabled:true},
                    
                ],
                selColumns: {},
                TempObj:{
                   numTemp:{ },
                   modalTemp:{
                       rackName: undefined, 
                       rackCode: undefined
                    },
                },
                disableBtn: true,
                diagramData: {
                    "class": "GraphLinksModel",
                    "copiesArrays": true,
                    "copiesArrayObjects": true,
                    "linkFromPortIdProperty": "fid",
                    "linkToPortIdProperty": "tid",
                    "nodeDataArray": [],
                    "linkDataArray": []
                },
                currentNode: null,
                temp: {
                    DEVICE_ID: undefined,
                    TASKNO: undefined,
                    TRAYNO: undefined,
                    STATE: undefined,
                    TYPE: undefined,
                    ERRMSG: undefined
                },
                dialogFormVisible: false,
                showviewer: false,
                urlList: [],
                savedModelText: undefined,
                diagram: null,
                node: null,
                nodepropertys: {
                    key: undefined,
                    text: undefined
                },
                activeNames:'',
                tt: true,
                monitorArea: {},
                plcTaskData: [],  // PLC生产线任务数据，是否有任务
                plcInfoData: [],  // PLC产线信息数据
                timer: 0,
                flashTimer: null,
                monitorNodeData: [],
                monibegin: 0,
                isMonitor: true,
                isAlert: false,
                seleConfig: [],
                scheduleType: '',
                monitorTimer: 0,  
                monitorShelvesData:[],
                redArr: [],
            }
        },
        created() {   
            // 监控区域html的高度
            this.monitorArea = {
                height: `${window.innerHeight-150}px`,
                background: `#00a1ff2b`
            };
            // 货位监控下拉选项
            this.allLocationDiagram();
        },
        mounted() {
            // gojs图形初始化
            this.init();
        },
        destroyed() {
            clearInterval(this.flashTimer);
            clearInterval(this.monitorTimer);
        },
        computed: { // 计算属性
               parentLabel:{
                   get(){
                       return {
                            first: this.$t('const.rackInfo'),
                            second: this.$t('const.pltInfo'),
                        }
                   }
               }
        },
        methods: {
            nodeCancel(pData) {
            },
            changeLocation(val) {
                if (val) {
                    clearInterval(this.monitorTimer);
                    this.isMonitor=false;
                    jq('#monitorBtn').text(this.$t('common.btn.monitor'));
                    this.allLocationDiagram(val);
                    this.monibegin = setInterval(()=> {
                        if(this.loading == false){
                            this.isMonitor = false;
                            this.monitorBtn()
                            // console.log(this.isMonitor);
                            clearInterval(this.monibegin);
                        }
                    },500)
                }
            },
            shelvesInfo() {
                this.redArr = [];
                clearInterval(this.flashTimer)
                let params = {
                    data: ['W2']
                };
                let initData = {url: '/api/DataHelp/GetRackSimpleInfo', params: params};
                this.$store.dispatch('fmsCommon/actionWcsPost',initData).then(data => {
                    let nodeData = this.monitorShelvesData;  // 节点数据
                    nodeData.forEach((node,i) => {  // 节点数据
                        data.forEach((shelves,d) => { // 货位监控数据
                            if (node.rackCode === shelves.rackCode) {
                                let currentNode = this.diagram.model.findNodeDataForKey(node.key);
                                this.diagram.model.setDataProperty(currentNode, 'moveState',shelves.moveState)
                                this.diagram.model.setDataProperty(currentNode, 'rackLoadState',shelves.rackLoadState)
                                this.diagram.model.setDataProperty(currentNode, 'matlState',shelves.matlState)
                                this.diagram.model.setDataProperty(currentNode, 'rackUseState',shelves.rackUseState)
                                // 如果产线报错，发送闪烁警报
                                if (shelves.rackLoadState === 3) {  
                                    this.redArr.push(node.key);
                                } 
                                
                                // 根据货位四种维度状态改变颜色
                                // 状态0
                                if (shelves.moveState === 0) { // 不限定 (出入限定)
                                   this.diagram.model.setDataProperty(currentNode, 'bg1','green');
                                }
                                if (shelves.rackLoadState === 0) {  // 空置 (装载状态)
                                   this.diagram.model.setDataProperty(currentNode, 'bg1','#fff') 
                                   this.diagram.model.setDataProperty(currentNode, 'bg2','#fff') 
                                   this.diagram.model.setDataProperty(currentNode, 'bg3','#fff') 
                                   this.diagram.model.setDataProperty(currentNode, 'bg4','#fff') 
                                }
                                if (shelves.rackUseState === 0) {  // 无效 (使用标志)
                                   this.diagram.model.setDataProperty(currentNode, 'bg3','gray') 
                                }
                                if (shelves.matlState === 10030) {  // 一次高温静置 (电池工艺)
                                   this.diagram.model.setDataProperty(currentNode, 'bg4','#ccc') 
                                }
                                // 状态1
                                if (shelves.moveState === 1) { // 禁入
                                   this.diagram.model.setDataProperty(currentNode, 'bg1','purple') 
                                }
                                if (shelves.rackLoadState === 1) { // 移入分配
                                   this.diagram.model.setDataProperty(currentNode, 'bg2','blue') 
                                }
                                if (shelves.rackUseState === 1) {  // 有效
                                   this.diagram.model.setDataProperty(currentNode, 'bg3','gray') 
                                }

                                // 状态2
                                if (shelves.moveState === 2) { // 禁出
                                   this.diagram.model.setDataProperty(currentNode, 'bg1','pink') 
                                }
                                if (shelves.rackLoadState === 2) {  // 移入锁定
                                   this.diagram.model.setDataProperty(currentNode, 'bg2','yellow') 
                                }

                                // 状态3
                                // if (shelves.rackLoadState === 3) {  // 载货
                                //    this.diagram.model.setDataProperty(currentNode, 'bg2','pink') 
                                // }

                                // 状态4
                                if (shelves.rackLoadState === 4) {  // 移出分配
                                   this.diagram.model.setDataProperty(currentNode, 'bg2','red') 
                                }
                                if (shelves.matlState === 10040) {  // 一次高温完成
                                   this.diagram.model.setDataProperty(currentNode, 'bg4','#ccc') 
                                }
                                // 状态5
                                if (shelves.rackLoadState === 5) {  // 移出锁定
                                   this.diagram.model.setDataProperty(currentNode, 'bg2','#6f9419') 
                                }
                            }
                        })  
                    })
                    console.log(this.redArr)
                    if (this.redArr.length !== 0) {
                        this.flashTimer = setInterval(() => {
                            this.redArr.forEach(item => {
                                this.flash(item);
                            })
                        },100)
                    }


                })
            },
            
            allLocationDiagram(val) {
                this.loading = true;
                let params = {
                             current:1,
                             pageSize:100,
                             requestData: {
                                 fileType: 2
                             },  
                };
                const _data = {url:'/monitor-drawing/guest/list',params: params}
                this.$store.dispatch('fmsCommon/actionTaskPost',_data)
                .then(data => {
                   if (!val) {
                       this.seleConfig = data.data;
                       this.scheduleType = data.data[0].id;
                       this.initDiagram(data.data[0].id)
                   } else {
                      this.initDiagram(val) 
                   }
                     
                }).catch(err => {
                    console.error(err)
                })
            },
             // 初始化货位图
            initDiagram(id) {
                    let params = {
                            data: id
                            };
                        const _data = {url:'/monitor-drawing/guest/get-script',params: params}
                        this.$store.dispatch('fmsCommon/actionTaskPost',_data)
                        .then(data => {
                                this.loading = false;
                                this.diagram.model = go.Model.fromJson(data);
                                this.monitorShelvesData = JSON.parse(data).nodeDataArray; 
                                this.loading = false;
                            }).catch(err => {
                                console.error(err)
                            })
            },
            // 监控定时器
            monitorTimerFunc() {
                //  this.flashTimer = setInterval(()=> {
                //     if (this.isMonitor) {
                //         timeDelay += 500;
                //         if (timeDelay >= 5000) {
                //             this.redArr = [];
                //             this.shelvesInfo();
                //             timeDelay = 0;
                //         }
                //         if (this.isAlert) {
                //                 this.redArr.forEach(item => {
                //                     this.flash(item)
                //                     }) 
                //         }   
                //     } else {
                //         clearInterval(this.flashTimer)
                //     }
                // },500)
            },
            // gojs初始化
            init() {
                var _this = this;
                let myDiagram =
                    Make(go.Diagram, this.$refs.myDiagramDiv,
                        {
                            initialScale: 1.5,  //拖入画板后形成的图形初始化大小是原来的1.5倍
                            "commandHandler.defaultScale": 1.5,
                            allowLink: false, 
                            // draggingTool: new SnappingTool(),   // 使用自定义的DraggingTool代替下面定义的标准工具
                            minScale:0.1,
                            maxScale:4,
                            "toolManager.hoverDelay":100,
                            isReadOnly:true,   //只读
                            contextMenu:
                                Make("ContextMenu",
                                    makeButton("Paste",
                                        (e, obj) => e.diagram.commandHandler.pasteSelection(e.diagram.toolManager.contextMenuTool.mouseDownPoint),
                                        o => o.diagram.commandHandler.canPasteSelection(o.diagram.toolManager.contextMenuTool.mouseDownPoint)),
                                    makeButton("Undo",
                                        (e, obj) => e.diagram.commandHandler.undo(),
                                        o => o.diagram.commandHandler.canUndo()),
                                    makeButton("Redo",
                                        (e, obj) => e.diagram.commandHandler.redo(),
                                        o => o.diagram.commandHandler.canRedo())
                                ),
                            "undoManager.isEnabled": false  //isEnabled属性设置为true，以便UndoManager记录更改并让用户执行撤消或重做操作
                        });
                myDiagram.grid.visible = false;  //是否增加网格背景
                 // 定义一个用于创建上下文菜单按钮的函数：
                function makeButton(text, action, visiblePredicate) {
                    return Make("ContextMenuButton",
                        Make(go.TextBlock, text),
                        { click: action },
                        visiblePredicate ? new go.Binding("visible", "", (o, e) => o.diagram ? visiblePredicate(o, e) : false).ofObject() : {});
                }

                myDiagram.addDiagramListener("Modified", e => { });

                //定义一种通用类型的节点
                myDiagram.nodeTemplateMap.add("Comment",
                    Make(go.Node,
                        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                        Make(go.TextBlock,
                            { stroke: "brown", font: "9pt sans-serif" },
                            new go.Binding("text"))
                    ));

                //定义通用的“管道”节点
                // Shape从绑定数据中的几何路径字符串获取Geometry
                //此节点还从绑定数据中的端口数据数组中获取所有端口
                myDiagram.nodeTemplate =
                    Make(go.Node, "Spot",
                        {
                            locationObjectName: "SHAPE",
                            locationSpot: go.Spot.Center,
                            selectionAdorned: false,  // 在Shape.stroke上使用Binding来显示选择
                            cursor: "move",
                            itemTemplate:
                               // 每个端口均为“X”形，其对齐点和端口ID由数据决定
                                Make(go.Panel,
                                    new go.Binding("portId", "id"),
                                    new go.Binding("alignment", "spot", go.Spot.parse)
                                ),
                        },
                        // 改变形状
                        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                        // 根据数据为该Spot Panel创建可变数量的端口
                        new go.Binding("itemArray", "ports"),
                        // 获取这个节点的位置
                        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                        // 获取这个节点的角度
                        new go.Binding("angle", "angle").makeTwoWay(),
                        // 将选定的零件移至“画板”图层，因此不会被任何未选定的零件遮盖
                        new go.Binding("layerName", "isSelected", function (s) { return s ? "Foreground" : ""; }).ofObject(),
                        {
                            doubleClick: function (e, node) {// 双击事件
                                handlerDC(e, node);  //双击执行的方法
                            }
                        },
                        // 提示框
                        {
                            toolTip:
                                Make("ToolTip",
                                    Make(go.TextBlock, { margin: 4 },
                                        new go.Binding("text", "", nodeInfo))  // 提示框展示nodeInfo(data)的返回信息
                                )
                        },
                        Make(go.Panel, "Spot",  // 面板 Spot布局, 在主面板块的相对位置，此处是指XLine
                            { name: "SHAPE" },
                            Make(go.Shape,
                                {
                                    name: "SHAPE",
                                    // 以下是默认值，实际值会通过数据绑定来获取节点数据对象
                                    geometryString: "F1 M0 0 L20 0 20 20 0 20 z",
                                    fill: "rgba(128, 128, 128, 0.5)"
                                },
                                new go.Binding("fill", "color"),  // 数据绑定（'属性名'，'属性值'）
                                // shape形状由geometryString定义
                                new go.Binding("geometryString", "geo"),
                                 // 点击图形会使节点外边框变成蓝色
                                new go.Binding("stroke", "isSelected", s => s ? "dodgerblue" : "#999").ofObject(),
                                new go.Binding("width", "width"),
                                new go.Binding("height", "height"),
                            ), // 节点形状属性
                            Make(go.TextBlock,
                                {
                                    font: "Bold 6px Lato, sans-serif",
                                    editable: true,
                                    textAlign: "center",
                                    //margin: 5,
                                    maxSize: new go.Size(100, NaN),
                                    //cursor: "pointer",
                                    // wrap: go.TextBlock.WrapDesiredSize,
                                    // isMultiline: false,  //是否能多行
                                    // maxLines:3, //最多三行
                                    // width:5,  //文本长度
                                    //alignment: go.Spot.Left,
                                    //alignmentFocus: go.Spot.BottomCenter
                                },
                                new go.Binding("text", "text").makeTwoWay(),
                                //new go.Binding("alignment", "label_offset", go.Spot.parse).makeTwoWay(go.Spot.stringify)
                                new go.Binding("overflow","",function(s){return (s.lot1 && s.lot2 && s.lot3 && s.lot4) ? go.TextBlock.OverflowEllipsis : go.TextBlock.OverflowClip;}),
                                new go.Binding("maxLines","",function(s){return (s.lot1 && s.lot2 && s.lot3 && s.lot4) ? 1: "";}),
                                new go.Binding("width","",function(s){return (s.lot1 && s.lot2 && s.lot3 && s.lot4) ? 20: "";}),
                                new go.Binding("stroke","lot1",function(s) { return s ? "transparent" : "rgba(0,0,0,0.7)"; }),
                            ), //  文本属性
                            Make(go.Panel,'Table',   // 面板的table布局 (注意:vue中要写在spot布局中，写在外面spot布局的块会缺失)
                                    Make(go.TextBlock, new go.Binding("text","lot1"),{font:"10pt serif",stroke:"none"},
                                    { row: 0, column: 0, margin:0.5,width:8,height:8},new go.Binding("background","bg1")),
                                    Make(go.TextBlock, new go.Binding("text","lot2"),{font:"10pt serif",stroke:"none"},
                                    { row: 0, column: 1, margin:0.5,width:8,height:8},new go.Binding("background","bg2")),
                                    Make(go.TextBlock,new go.Binding("text","lot3"),{font:"10pt serif",stroke:"none"},
                                    { row: 1, column: 0, margin:0.5,width:8,height:8},new go.Binding("background","bg3")),
                                    Make(go.TextBlock, new go.Binding("text","lot4"),{font:"10pt serif",stroke:"none"},
                                    { row: 1, column: 1, margin:0.5,width:8,height:8},new go.Binding("background","bg4"))
                            ), // 面板表格属性
                        ),

                    );// node 括号

                   // 组节点属性
                	myDiagram.groupTemplate =
                            Make(go.Group,
                            {
                                layerName: "Background",
                                resizable: true, 
                                resizeObjectName: "GroupShape",
                                minSize: new go.Size(20,20),
                                desiredSize: new go.Size(30,20),  // 初始化1x1的cel
                            // locationSpot: new go.Spot(0, 0, 0, 0)
                            },
                            new go.Binding("position", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                            { 
                                mouseDragEnter: function(e, grp, prev) {
                                    // if (!highlightGroup(grp, true)) e.diagram.currentCursor = "not-allowed"; else e.diagram.currentCursor = "";
                                },
                                mouseDragLeave: function(e, grp, next) { 
                                    // highlightGroup(grp, false); 
                                    },
                                mouseDrop: function(e, grp) {
                                    // var ok = grp.addMembers(grp.diagram.selection, true);
                                    // if (!ok) grp.diagram.currentTool.doCancel();
                                }
                            },
                            Make(go.Shape,  
                                {
                                name: "GroupShape",
                                fill: 'transparent',
                                stroke: 'transparent',
                                minSize: new go.Size(20, 20)
                                },
                                new go.Binding("stroke", "st"),
                                new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                               )
                            );
                // 双击执行的方法
                function handlerDC(e, obj) {
                    if (obj.data.bg1 && obj.data.bg2) {
                        _this.$refs.modalchild.modalOpen();
                        _this.title = i18n.t("const.rackInfo");
                        _this.modalFormInfo = obj.data;
                        obj['data'].rackName = obj['data'].rackCode;
                        _this.TempObj['modalTemp'] = obj.data;
                    }
                }

                // 提示框信息
                function nodeInfo(data) {
                    let info = `
                                节点(key) :${data.key}
                                ${data.rackCode ? '货位号:'+data.rackCode : ''}
                                ${data.rackUseState ? '使用状态:'+data.rackUseState : ''}
                                ${data.matlState ? '电池状态:'+data.matlState : ''}
                                ${data.rackLoadState ? '装载状态:'+data.rackLoadState : ''}
                                ${data.moveState ? '出入限定:'+data.moveState : ''}
                                `;
                                if(i18n.t("common.common_data_transfer")=='en')
                                    info = `
                                        node(key) :${data.key}
                                        ${data.rackCode ? 'rackCode:'+data.rackCode : ''}
                                        ${data.rackUseState ? 'useState:'+data.rackUseState : ''}
                                        ${data.matlState ? 'matlState:'+data.matlState : ''}
                                        ${data.rackLoadState ? 'loadState:'+data.rackLoadState : ''}
                                        ${data.moveState ? 'moveState:'+data.moveState : ''}
                                        `;
                    return info;
                };

                // 没有任何链接数据的可视化表示
                myDiagram.linkTemplate = Make(go.Link, { visible: false });

                // 支持从Comment节点到管道节点的可选链接
                myDiagram.linkTemplateMap.add("Comment",
                    Make(go.Link,
                        { curve: go.Link.Bezier },
                        Make(go.Shape, { stroke: "brown", strokeWidth: 2 }),
                        Make(go.Shape, { toArrow: "OpenTriangle", stroke: "brown" })
                    ));

                // 该模型需要确定的特定节点
                myDiagram.model =
                    new go.GraphLinksModel(
                        {
                            copiesArrays: true,
                            copiesArrayObjects: true,
                            linkFromPortIdProperty: "fid",
                            linkToPortIdProperty: "tid"
                        });

                this.diagram = myDiagram; // 变量diagram获取gojs初始化实例
            },    // gojs初始化 END ------------------/
            // 节点闪烁回调
            flash(k){
                this.diagram.model.commit(function(m){
                    let nodes = m.findNodeDataForKey(k); 
                    if (nodes.color === "red") {
                         m.setDataProperty(nodes, "color","rgba(0, 0, 0, 0.5)");
                        } else {
                         m.setDataProperty(nodes, "color","red");
                        }    
                    },"flash");
            },
            // 删除重复的报警节点
            delRedArr(key) {
                for(var i=0;i<this.redArr.length;i++) {
                    if (this.redArr[i] === key) {
                        redArr.splice(i,1)
                    }
                }
            },
            plcTask() {

            },
            // 监控按钮
            monitorBtn() {
                if (!this.isMonitor) {
                    jq('#monitorBtn').text(this.$t('common.btn.stopMonitor'));
                    this.isMonitor = true; // 启动监控
                    // 轮询触发获取货位监控数据
                    this.monitorTimer = setInterval(() => {
                        this.shelvesInfo();
                    },3000);
                } else {
                    jq('#monitorBtn').text(this.$t('common.btn.monitor'));
                    this.redArr = [];
                    clearInterval(this.flashTimer);
                    clearInterval(this.monitorTimer);
                     // 恢复监控前的颜色
                    for(var nit = this.diagram.nodes;nit.next();){  
                        var node = nit.value;
                        let nodes = this.diagram.model.findNodeDataForKey(node.data.key);
                        if (nodes.rackCode) {
                            this.diagram.model.setDataProperty(nodes,"bg1","#fff");
                            this.diagram.model.setDataProperty(nodes,"bg2","#fff");
                            this.diagram.model.setDataProperty(nodes,"bg3","#fff");
                            this.diagram.model.setDataProperty(nodes,"bg4","#fff"); 
                            this.diagram.model.setDataProperty(nodes,"color","#ccc"); 
                        }
                    }
                }
                
            },

            // 缩放按钮
            zoomIn(){
                this.diagram.scale = this.diagram.scale + 0.1;
            },
            zoomOut(){
                this.diagram.scale = this.diagram.scale - 0.1;
            }
        }
    }

</script> 

<style lang='less' scoped>
    .el-row {
        margin-top: 5px;
        #mySavedModel {
            margin: 0 5px;
        }
    }

    .el-col-24 {
        .selectSchedule {
            min-width: 12%;
            margin:0 10px 0;
        }
        .design-and-inspect {
           span {
            display: block;
            width: 98%;
            margin:3px auto;
            //border: 2px solid #a8bec9 !important;
            //border-radius: 4px;
            }
        } 
    }
   .modal-class .el-dialog.customStyle {
        width: 60%;
        height: 80%;
    }

    .el-dialog__body {
        border-top: 1px solid #dcdfe6;
        border-bottom: 1px solid #dcdfe6;
        max-height: calc(100vh - 200px);
        overflow-y: auto;
    }

    .el-form-item {
        margin-bottom: 12px;
    }

    // .inspector {
    //     display: inline-block;
    //     font: bold 14px helvetica, sans-serif;
    //     color: #000;
    //     cursor: default;
    // }

    // .inspector table {
    //     border-collapse: separate;
    //     border-spacing: 2px;
    // }

    // .inspector td,
    // th {
    //     padding: 2px;
    // }

    // .inspector input {
    //     background-color: #fff;
    //     color: #F5F5F5;
    //     font: bold 12px helvetica, sans-serif;
    //     border: 1px solid #ccc;
    //     padding: 2px;
    // }

    // .inspector input:disabled {
    //     background-color: #BDBDBD;
    //     color: #1b1b1b;
    // }

    // .inspector select {
    //     background-color: #fff;
    // }
</style>

