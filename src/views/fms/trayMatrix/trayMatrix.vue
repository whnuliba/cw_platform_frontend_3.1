/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: 生产监控-托盘矩阵
 */
<template>
 <el-row>
        <el-col :span="24">
            <div :style="{display: 'flex','justify-content':'center',margin: '5px 0'}">
                <div :style="{'margin-right':'10px'}">
                    <el-input size="small" v-model="inputData" placeholder="请输入内容"></el-input>

                </div>
                <el-button @click='search' type="primary">搜索</el-button>
                <!-- <el-button  @click='monitorBtn' type="primary" id='monitorBtn'>监控</el-button> -->
                <el-button id="SaveButton" @click="zoomPIn" type="primary">放大</el-button>  
                <el-button id="SaveDesign" @click="zoomPOut" type="primary">缩小</el-button>  
            </div> 
            <div >
                <div :style="{position:'relative'}">
                    <TrayMatrix
                    :isTab="true"
                    :isDoubleClk="false"
                    :isSingleClk="false"
                    :firColumns='firColumns'
                    :secColumns='secColumns'
                    :selColumns="selColumns"
                    :modalTitle='title'
                    :parentLabel="parentLabel"
                    :PTempObj="TempObj"
                    :modalFormInfo="modalFormInfo"
                    :imgExist="imgExist"
                    :srcObj='srcObj'
                    :loading='loading'
                    :monitorstyle='monitorstyle'
                    @singlecilck="singlecilck"
                    :tipString="tipString"
                    />
                    <div :style="{'background-color':'white', position:'absolute',right:'50px',top:'2px',height:'100%','z-index':'10'}" :class="[showmodal? 'messagemodal' : 'messagemodal_1']">
                        <el-table :data="modalData" border fit highlight-current-row style="width: 100%" height='100%'>
                            <el-table-column min-width="50px" width="55px" label="序号" align="center" fixed>
                                <template slot-scope="scope">
                                  <span>{{scope.$index+1}}</span>
                                </template>
                             </el-table-column>
                            <el-table-column v-for="(item) in cols" :key="item.id" :label="item.title" :prop="item.field" :width="item.width" :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip>
                                 <template slot-scope="{row}">
                                    {{commonFilter(row[item.field],item.field)}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                
            </div>
                
        </el-col>
    </el-row>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog';
import elImageViewer from 'element-ui/packages/image/src/image-viewer';
import modalComponent from '@/components/modal/index';
import TrayMatrix from '@/components/MonitorDiagram/index'; 
import jq from 'jquery';
let timeDelay = 0;
export default {
        name: 'Logistic',
        components: { elImageViewer, modalComponent,TrayMatrix },
        directives: { elDragDialog },
        data() {
            return {
                tipString:['ocv1','ocv2','ocv3','ocv4','k1','k2','k3','k4',],
                loading: false,
                modalFormInfo:{},
                inputData:'',
                labelPosition: 'right',
                trayData:[],
                modalData:[],
                initSelect:{
                    trayType:[],
                    useState: [{ label: '启用', value: 0 }, { label: '警用', value: 1 }],
                    cellState: [],
                },
                formLabelAlign: {
                  name: '',
                  region: '',
                  type: ''
                },
                cols: [
                    { field: 'id', title: 'id', hide: true, minWidth: 100, align: "center" },
                    { field: 'processName', title: '当前工序', minWidth: 100, width: 90, align: "center" },
                    { field: 'inStation', title: '入战时间', minWidth: 100, align: "center"},
                    { field: 'outStation', title: '出站时间', minWidth: 100, align: "center" },
                ],
                parentLabel:{
                    first: '货位信息',
                    second: '托盘信息',
                },
                imgExist: true,
                srcObj: require('@/assets/logistics_monitor/shelves.jpg'),
                title: '货位信息',
                firColumns:[
                    {key: 'ocv1',label:'货架名称',disabled:true},
                    {key: 'ocv2',label:'货架编号',disabled:true},
                    
                ],
                secColumns:[
                    {key: 'ocv1',label:'托盘类型',disabled:true},
                    {key: 'ocv2',label:'货架编号',disabled:true},
                    
                ],
                selColumns: [],
                TempObj:{
                   numTemp:{ },
                   modalT:{
                       ocv1: undefined, 
                       ocv2: undefined
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
                showmodal:false,
                flashTimer: 0,
                monitorNodeData: [],
                isMonitor: false,
                isAlert: false,
                seleConfig: [],
                scheduleType: '',
                monitorTimer: 0,  
                monitorShelvesData:[],
                redArr: [],
                monitorstyle:{
                    height: `${window.innerHeight-150}px`,
                    background: `#00a1ff2b`,
                    'margin-right':'480px'
                }
            }
        },
        created() {   
            // 监控区域html的高度
            this.monitorArea = {
                height: `${window.innerHeight-150}px`,
                background: `#00a1ff2b`
            };
            // 货位监控下拉选项并渲染gojs节点
            this.allLocationDiagram();
            // 监控
            // this.monitorTimerFunc();
        },
        mounted() {
            // this.monitorTimerFunc();
        },
        destroyed() {
            // clearInterval(this.flashTimer);
            clearInterval(this.monitorTimer);
        },
        computed: { // 计算属性
        },
        methods: {
              commonFilter(value,type) {

                if(this.initSelect.hasOwnProperty(type) && typeof this.initSelect[type] !=undefined && Array.isArray( this.initSelect[type]))
                 {
                   return this.getValueConvert(this.initSelect[type],value)
                 }
                if(this.initSelect.hasOwnProperty(type) && !Array.isArray( this.initSelect[type]) && this.initSelect[type].hasOwnProperty(value)){
                  return this.initSelect[type][value]
                }
                return value
            },
            singlecilck(a,b){
                console.log(b.data);
                // console.log(b.data);    
            },
            nodeCancel(pData) {
            },
            search(){
                this.showmodal=true
                let initData = {url: '/plt/guest/plt-flow-by_tray_no', params: {data: this.inputData}};
                this.$store.dispatch('fmsCommon/actionFmsPost',initData).then(res=>{
                    console.log(res);
                    this.modalData = res
                })
                this.shelvesInfo(this.inputData);
                //A21TP00002
            },
            shelvesInfo(v) {
                let params = {
                    current: 1,
                    pageSize: 400,
                    requestData: {trayNo: v}
                };
                this.diagram = this.$store.getters.diagramEntity;
                let initData = {url: '/cell/guest/get-cuv_tray_no', params: params};
                this.$store.dispatch('fmsCommon/actionFmsPost',initData).then(res => {
                    let nodeData = this.monitorShelvesData;  // 节点数据
                    let {data} = res
                    this.trayData = data
                    nodeData = nodeData.filter(item=>item.color=='white')

                    nodeData.forEach((node,i) => {  // 节点数据

                        data.forEach((shelves,d) => { // 货位监控数据
                            if (String(node.text) === String(shelves.channel)) {
                                let currentNode = this.diagram.model.findNodeDataForKey(node.key);
                                this.diagram.model.setDataProperty(currentNode, 'ocv1',shelves.ocv1)
                                this.diagram.model.setDataProperty(currentNode, 'ocv2',shelves.ocv2)
                                this.diagram.model.setDataProperty(currentNode, 'ocv3',shelves.ocv3)
                                this.diagram.model.setDataProperty(currentNode, 'ocv4',shelves.ocv4)
                                this.diagram.model.setDataProperty(currentNode, 'k1',shelves.k1)
                                this.diagram.model.setDataProperty(currentNode, 'k2',shelves.k2)
                                this.diagram.model.setDataProperty(currentNode, 'k3',shelves.k3)
                                this.diagram.model.setDataProperty(currentNode, 'k4',shelves.k4)
                              
                              
                                // 状态1
                                if (shelves.cellState === '100') { // 禁入
                                  this.diagram.model.setDataProperty(currentNode, 'color','lightblue') 
                                   
                                }
                                if (Number(shelves.cellState ) > 100) { // 禁入
                                  this.diagram.model.setDataProperty(currentNode, 'color','orange') 
                                   
                                }
                              
                            }
                        })  
                    })
                    this.isAlert = true;
                })
            },
            
            allLocationDiagram(id) {
                this.loading = true;
                let params = {
                    pageSize: 100,
                    total: 0,
                    current: 0,
                    requestData: {
                        fileType: 3,
                        fileId: id
                    },
                };
                if (!id) {
                    delete params.requestData.fileId
                }
            const _data = {url:'/api/MonitorFile/GetMonitorFileInfosWebApi',params: params}
            this.$store.dispatch('fmsCommon/actionWcsPost',_data)
            .then(data => {
                this.diagram = this.$store.getters.diagramEntity;
                this.diagram.model = go.Model.fromJson(data.data[0].fileContext);
                this.monitorShelvesData = JSON.parse(data.data[0].fileContext).nodeDataArray; 
                if (!id) {
                    this.seleConfig = data.data;
                    this.scheduleType = data.data[0].fileId;
                }
                this.loading = false;
                }).catch(err => {
                    console.error(err)
                })
            },
    
            // 监控按钮
            monitorBtn() {
                this.diagram = this.$store.getters.diagramEntity;
                if (jq("#monitorBtn").text() === '监控') {
                    jq('#monitorBtn').text('停止监控');
                    this.isMonitor = true; // 启动监控
                    // 轮询触发获取货位监控数据
                    // this.monitorTimerFunc();
                    this.monitorTimer = setInterval(() => {
                        this.shelvesInfo();
                    },5000);
                } else {
                    jq('#monitorBtn').text('监控');
                    this.isMonitor = false;  // 关闭监控
                    this.isAlert = false;
                    this.redArr = [];
                    // clearInterval(this.flashTimer);
                    clearInterval(this.monitorTimer);
                     // 恢复监控前的颜色
                    for(var nit = this.diagram.nodes;nit.next();){  
                        var node = nit.value;
                        let nodes = this.diagram.model.findNodeDataForKey(node.data.key);
                        if (node.data.color === 'white') {
                            this.diagram.model.setDataProperty(nodes,"color","white");
                        }
                        
                    }
                }
                
            },

         // 缩放按钮
            zoomPIn(){
                this.diagramEntity = this.$store.getters.diagramEntity;
                this.diagramEntity.scale = this.diagramEntity.scale + 0.1;
            },
            zoomPOut(){
                let newDiagram = this.$store.getters.diagramEntity;
                newDiagram.scale = newDiagram.scale - 0.1;
            }
        }
    }

</script> 

<style lang='less' scope>
 .messagemodal{
     width: 450px;
    //  background-color: rgb(201, 201, 201);
     transition:0.2s;
     display: block;
 }
 .messagemodal_1{
     width: 0px;
     display:none
    //  background-color:  rgb(201, 201, 201);
     
 }

</style>


       

