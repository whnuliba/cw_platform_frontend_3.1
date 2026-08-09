/*
* @CreatAuthor: 宋丹峰
* @UpdateAuthor: (...)
* @Description: 生产监控-生产货位监控
*/
<template>
    <el-row>
        <el-col :span="24">
            <div :style="{ display: 'flex', 'justify-content': 'center', margin: '5px 0' }">
                <el-select class="selectSchedule" @change="changeLocation" v-model='scheduleType'>
                    <el-option v-for="(item, i) in seleConfig" :key="`loca${i}`" :value='item.id'
                        :label="item.fileName" />
                </el-select>
                <el-button @click='monitorBtn' type="primary" id='monitorBtn'>{{ $t('common.btn.monitor') }}</el-button>
                <el-button id="SaveButton" @click="zoomIn" type="primary">{{ $t('common.btn.enlarge') }}</el-button>
                <el-button id="SaveDesign" @click="zoomOut" type="primary">{{ $t('common.btn.lessen') }}</el-button>
                <el-button @click="exportSvg" type="primary">{{ $t("common.btn.exportSvg") }}</el-button>
                <el-dropdown @command="saveMoveState" style="margin-left: 10px;">
                    <el-button type="primary">
                        {{ $t('common.btn.moveState') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item 
                            v-for="item in selColumns.moveState"
                            :key="item.id"
                            :command="item.id" 
                             >{{ item.name }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown @command="saveUseState" style="margin-left: 10px;">
                    <el-button type="primary">
                        {{ $t('common.btn.useState') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item 
                            v-for="item in selColumns.rackUseState"
                            :key="item.id"
                            :command="item.id" 
                             >{{ item.name }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="design-and-inspect">
                <span>
                    <div ref='myDiagramDiv' class="myDiagramDiv" :style="monitorArea" v-loading="loading" />
                </span>
            </div>
        </el-col>
        <!-- 节点信息模态 -->
        <modalComponent ref='modalchild' :isTab="true" :formOnly="true" :firColumns='firColumns'
            :secColumns='secColumns' :selColumns="selColumns" :modalTitle='title' :parentLabel="parentLabel"
            :modalTemp="TempObj['modalTemp']" :modalTempTwo="TempObj['modalTemp']" :modalFormInfo="modalFormInfo" :imgExist="imgExist" :srcObj='srcObj'
            @nodeCancel='nodeCancel' />
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
    name: 'prodRackMonitor',
    components: { elImageViewer, modalComponent },
    directives: { elDragDialog },
    data() {
        return {
            loading: false,
            modalFormInfo: {},
            imgExist: true,
            srcObj: require('@/assets/logistics_monitor/shelves.jpg'),
            title: '',
            firColumns: [
                { key: 'rackName', label: '货架名称', disabled: true },
                { key: 'rackCode', label: '货架编号', disabled: true },
                { key: 'wareCode', label: '所属仓库', disabled: true },
                { key: 'laneCode', label: '所属巷道', disabled: true },
                // {key: '',label:'所属货区',disabled:true},
                { key: 'carryType', label: '搬运类型', disabled: true, type: 'select', selType: 'carryType', selVal: "id", selLabel: "name" },
                { key: 'rackFunc', label: '货架功能', disabled: true, type: 'select', selType: 'rackFunc', selVal: "id", selLabel: "name" },
                { key: 'rackDirState', label: '货架方向', disabled: true, type: 'select', selType: 'pltDirState', selVal: "id", selLabel: "name"  },
                { key: 'x', label: '排', disabled: true },
                { key: 'y', label: '列', disabled: true },
                { key: 'z', label: '层', disabled: true },
                // {key: '',label:'双深标志',disabled:true},
                { key: 'rackSourceCode', label: '资源号', disabled: true },
                { key: 'rackUseState', label: '使用标志', disabled: true, type: 'select', selType: 'rackUseState', selVal: "id", selLabel: "name" },
                { key: 'rackCtrlCode1', label: '调度号1', disabled: true },
                { key: 'rackCtrlCode2', label: '调度号2', disabled: true },
                { key: 'moveState', label: '出入限定', disabled: true, type: 'select', selType: 'moveState', selVal: "id", selLabel: "name" },
                { key: 'rackLoadState', label: '载货状态', disabled: true, type: 'select', selType: 'rackLoadState', selVal: "id", selLabel: "name" },
            ],
            secColumns: [
                { key: "pltCateName", label: "托盘类型", disabled: true },
                { key: "pltCateFunc", label: "托盘功能", disabled: true, type: 'select', selType: 'pltCateFunc', selVal: "id", selLabel: "name" },
                { key: "pltCode", label: "托盘条码", disabled: true },
                { key: "pltCtrlCode", label: "托盘编号", disabled: true },
                { key: "locType", label: "位置类型", disabled: true, type: 'select', selType: 'locType', selVal: "id", selLabel: "name" },
                // { key: "", label: "当前位置", disabled: true },
                { key: 'pltLoadState', label: '载货状态', disabled: true, type: 'select', selType: 'pltLoadState', selVal: "id", selLabel: "name" },
                { key: 'carryState', label: '搬运状态', disabled: true, type: 'select', selType: 'carryState', selVal: "id", selLabel: "name" },
                { key: 'matlState', label: '电池状态', disabled: true, type: 'select', selType: 'matlState', selVal: "id", selLabel: "name" },
                { key: 'codeState', label: '扫码状态', disabled: true, type: 'select', selType: 'codeState', selVal: "id", selLabel: "name" },
                { key: 'mesState', label: '接口状态', disabled: true, type: 'select', selType: 'mesState', selVal: "id", selLabel: "name" },
                { key: 'pltDirState', label: '托盘方向', disabled: true, type: 'select', selType: 'pltDirState', selVal: "id", selLabel: "name" },
                { key: 'rackErrorState', label: '异常状态', disabled: true, type: 'select', selType: 'rackErrorState', selVal: "id", selLabel: "name" },
                { key: 'carryTime', label: '搬运时间', disabled: true },
                { key: 'readyTime', label: '到位时间', disabled: true },

            ],
            selColumns: {
                carryType: [],
                rackFunc: [],
                rackUseState: [],
                moveState: [],
                rackLoadState: [],
                pltCateFunc: [],
                locType: [],
                pltLoadState: [],
                carryState: [],
                matlState: [],
                codeState: [],
                mesState: [],
                pltDirState: [],
                rackErrorState: [],
                rackPressState:[],
                rackAutoState:[]
            },
            TempObj: {
                numTemp: {},
                modalTemp: {
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
            activeNames: '',
            tt: true,
            monitorArea: {},
            plcTaskData: [],  // PLC生产线任务数据，是否有任务
            plcInfoData: [],  // PLC产线信息数据
            timer: 0,
            flashTimer: null,
            monitorNodeData: [],
            isMonitor: false,
            isAlert: false,
            seleConfig: [],
            scheduleType: '',
            monitorTimer: 0,
            monitorShelvesData: [],
            redArr: [],
            laneCodes:''
        }
    },
    created() {
        // 监控区域html的高度
        this.monitorArea = {
            height: `${window.innerHeight - 150}px`,
            background: `#00a1ff2b`
        };
        // 货位监控下拉选项
        this.allLocationDiagram();
    },
    mounted() {
        this.selectOptions()
        // gojs图形初始化
        this.init();
    },
    destroyed() {
        clearInterval(this.flashTimer);
        clearInterval(this.monitorTimer);
    },
    computed: { // 计算属性
        parentLabel: {
            get() {
                return {
                    first: this.$t('const.rackInfo'),
                    second: this.$t('const.pltInfo'),
                }
            }
        }
    },
    methods: {
        saveMoveState(command){
            var nodes = this.diagram.selection.toArray();
            let arrRackCodes=[];
            for(let x of nodes){
                var rackCode = x?.data?.rackCode;
                if(rackCode &&rackCode.length==7){
                    arrRackCodes.push(rackCode)
                }
            }
            if(arrRackCodes.length==0) return;
            let _data = { url: '/api/LocInfo/UpdateRackMoveState', params: {data: { 'rackCodes': arrRackCodes ,'moveState':command}} }
            this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.shelvesInfo()
                }).catch(err => {
                    console.error(err)
                })
        },
        saveUseState(command){
            var nodes = this.diagram.selection.toArray();
            let arrRackCodes=[];
            for(let x of nodes){
                var rackCode = x?.data?.rackCode;
                if(rackCode &&rackCode.length==7){
                    arrRackCodes.push(rackCode)
                }
            }
            if(arrRackCodes.length==0) return;
            let _data = { url: '/api/LocInfo/UpdateRackUseState', params: {data: { 'rackCodes': arrRackCodes ,'useState':command}} }
            this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.shelvesInfo()
                }).catch(err => {
                    console.error(err)
                })
        },
        selectOptions() {
            //获取搬运类型
            let _data = { url: '/api/LocInfo/GetCarryTypes', params: {} }
            this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.selColumns.carryType = data
                }).catch(err => {
                    console.error(err)
                })

            //获取货架功能   
            _data = { url: '/api/Const/LocFunc', params: {} }
            this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.selColumns.rackFunc = data
                }).catch(err => {
                    console.error(err)
                })

            //获取使用标志
            _data = { url: '/api/Const/UseState', params: {} }
            this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.selColumns.rackUseState = data
                }).catch(err => {
                    console.error(err)
                })

            //获取出入限定
            _data = { url: '/api/Const/RackMoveState', params: {} }
            this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.selColumns.moveState = data
                }).catch(err => {
                    console.error(err);
                })

            //载货状态
            _data = { url: '/api/Const/RackLoadState', params: {} }
            this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.selColumns.rackLoadState = data
                }).catch(err => {
                    console.error(err)
                })

            //获取托盘功能
            _data = { url: '/api/Const/pltFunc', params: {} }
            this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.selColumns.pltCateFunc = data
                }).catch(err => {
                    console.error(err)
                })

            //获取位置类型
            _data = { url: '/api/Cache/locTypes', params: {} }
            this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.selColumns.locType = data
                }).catch(err => {
                    console.error(err)
                })

            //获取载货状态
            _data = { url: "/api/Cache/pltLoadStates", params: {} };
            this.$store.dispatch("fmsCommon/actionWcsPost", _data)
                .then((data) => {
                    this.selColumns.pltLoadState = data;
                })
                .catch((err) => {
                    console.error(err);
                });

            //获取搬运状态
            _data = { url: '/api/const/pltCarryState', params: {} }
            this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.selColumns.carryState = data
                }).catch(err => {
                    console.error(err)
                })

            //货区电池状态
            _data = { url: "/api/Cache/MatlState", params: {} }
            this.$store.dispatch("fmsCommon/actionWcsPost", _data)
                .then((data) => {
                    this.selColumns.matlState = data.map((v) => ({
                        name: "[" + v.stateNum + "]" + v.stateName,
                        id: v.stateNum,
                    }))
                })
                .catch((err) => {
                    console.error(err);
                })

            //获取扫码状态
            _data = { url: '/api/Const/CodeState', params: { data: { 'locType': this.locType } } }
            this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.selColumns.codeState = data
                }).catch(err => {
                    console.error(err)
                })

            // 获取接口状态
            _data = { url: '/api/Const/MesState', params: {} }
            this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.selColumns.mesState = data
                }).catch(err => {
                    console.error(err)
                })

            //获取托盘方向
            _data = { url: '/api/Const/DirState', params: {} }
            this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {

                    this.selColumns.pltDirState = data
                }).catch(err => {
                    console.error(err)
                })

            //获取异常状态
            _data = { url: '/api/Const/RackErrorStates', params: {} }
            this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.selColumns.rackErrorState = data
                }).catch(err => {
                    console.error(err)
                })
            
            //获取针床状态
            _data = { url: '/api/Const/RackPressState', params: {} }
            this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.selColumns.rackPressState = data
                }).catch(err => {
                    console.error(err)
                })

            //获取自动状态
            _data = { url: '/api/Const/RackAutoState', params: {} }
            this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.selColumns.rackAutoState = data
                }).catch(err => {
                    console.error(err)
                })

        },
        nodeCancel(pData) {
        },
        changeLocation(val) {
            if (val) {
                clearInterval(this.monitorTimer);
                this.isMonitor = false;
                jq('#monitorBtn').text(this.$t('common.btn.monitor'));
                this.allLocationDiagram(val);
            }
        },
        shelvesInfo() {
            this.redArr = [];
            clearInterval(this.flashTimer)
            let params = {
                data: this.laneCodes.split(',')
            };
            let initData = { url: '/api/DataHelp/GetRackSimpleInfo', params: params };
            this.$store.dispatch('fmsCommon/actionWcsPost', initData).then(data => {
                let nodeData = this.monitorShelvesData;  // 节点数据
                nodeData.forEach((node, i) => {  // 节点数据
                    data.forEach((shelves, d) => { // 货位监控数据
                        if (node.rackCode === shelves.rackCode) {
                            let currentNode = this.diagram.model.findNodeDataForKey(node.key);
                            this.diagram.model.setDataProperty(currentNode, 'shelfData', shelves);
                            this.diagram.model.setDataProperty(currentNode, 'moveState', shelves.moveState)
                            this.diagram.model.setDataProperty(currentNode, 'rackLoadState', shelves.rackLoadState)
                            this.diagram.model.setDataProperty(currentNode, 'matlState', shelves.matlState)
                            this.diagram.model.setDataProperty(currentNode, 'rackUseState', shelves.rackUseState)
                            this.diagram.model.setDataProperty(currentNode, 'rackErrorState', shelves.rackErrorState)
                            this.diagram.model.setDataProperty(currentNode, 'rackPressState', shelves.pressState)
                            this.diagram.model.setDataProperty(currentNode, 'rackAutoState', shelves.autoState)
                            this.diagram.model.setDataProperty(currentNode, 'pltCodes', shelves.pltCodes)
                            
                            this.diagram.model.setDataProperty(currentNode, 'bg1', 'rgba(245,245,245,1)')
                            this.diagram.model.setDataProperty(currentNode, 'bg2', 'rgba(245,245,245,1)')
                            this.diagram.model.setDataProperty(currentNode, 'bg3', 'rgba(245,245,245,1)')
                            this.diagram.model.setDataProperty(currentNode, 'bg4', 'rgba(245,245,245,1)')

                            if (shelves.matlState === 10240 || shelves.matlState === 10250 ||
                                shelves.matlState === 10770 || shelves.matlState === 10780 ||
                                shelves.matlState === 11300 || shelves.matlState === 11310 
                            ) { //常温 一  四  六
                                this.diagram.model.setDataProperty(currentNode, 'bg1', '#67C23A')
                                this.diagram.model.setDataProperty(currentNode, 'bg2', '#67C23A')
                                this.diagram.model.setDataProperty(currentNode, 'bg3', '#67C23A')
                                this.diagram.model.setDataProperty(currentNode, 'bg4', '#67C23A')
                            }
                            else if (
                                shelves.matlState === 10480 || shelves.matlState === 10490 ||
                                shelves.matlState === 10950 || shelves.matlState === 10960 
                            ) { //常温  三  五 
                                this.diagram.model.setDataProperty(currentNode, 'bg1', 'green')
                                this.diagram.model.setDataProperty(currentNode, 'bg2', 'green')
                                this.diagram.model.setDataProperty(currentNode, 'bg3', 'green')
                                this.diagram.model.setDataProperty(currentNode, 'bg4', 'green')
                            }
                            else if (shelves.matlState === 10410 || shelves.matlState === 10420 ||
                                shelves.matlState === 11230 || shelves.matlState === 11240

                            ) { //高温 一 二
                                this.diagram.model.setDataProperty(currentNode, 'bg1', '#e84e0e')
                                this.diagram.model.setDataProperty(currentNode, 'bg2', '#e84e0e')
                                this.diagram.model.setDataProperty(currentNode, 'bg3', '#e84e0e')
                                this.diagram.model.setDataProperty(currentNode, 'bg4', '#e84e0e')
                            }
                            else if (shelves.matlState === 10320 || shelves.matlState === 10330) { //化成
                                this.diagram.model.setDataProperty(currentNode, 'bg1', '#64b5f6')
                                this.diagram.model.setDataProperty(currentNode, 'bg2', '#64b5f6')
                                this.diagram.model.setDataProperty(currentNode, 'bg3', '#64b5f6')
                                this.diagram.model.setDataProperty(currentNode, 'bg4', '#64b5f6')
                            }

                            else if (shelves.matlState === 10680 || shelves.matlState === 10690) { //分容
                                this.diagram.model.setDataProperty(currentNode, 'bg1', '#90caf9')
                                this.diagram.model.setDataProperty(currentNode, 'bg2', '#90caf9')
                                this.diagram.model.setDataProperty(currentNode, 'bg3', '#90caf9')
                                this.diagram.model.setDataProperty(currentNode, 'bg4', '#90caf9')
                            }
                            
                            else if (shelves.matlState === 0 && shelves.pltId != null) { //空盘
                                this.diagram.model.setDataProperty(currentNode, 'bg1', '#9696c0')
                                this.diagram.model.setDataProperty(currentNode, 'bg2', '#9696c0')
                                this.diagram.model.setDataProperty(currentNode, 'bg3', '#9696c0')
                                this.diagram.model.setDataProperty(currentNode, 'bg4', '#9696c0')
                            }
                            else if (shelves.matlState) {
                                this.diagram.model.setDataProperty(currentNode, 'bg1', '#000')
                                this.diagram.model.setDataProperty(currentNode, 'bg2', '#000')
                                this.diagram.model.setDataProperty(currentNode, 'bg3', '#000')
                                this.diagram.model.setDataProperty(currentNode, 'bg4', '#000')
                            }

                            if (shelves.rackUseState === 0) { //货位状态
                                this.diagram.model.setDataProperty(currentNode, 'bg1', 'gray')
                            }else if(shelves.rackUseState === 1 &&shelves.rackLoadState === 0){
                                this.diagram.model.setDataProperty(currentNode, 'bg1', 'rgba(245,245,245,1)')
                            }

                            if (shelves.moveState === 1) { // 禁入
                                this.diagram.model.setDataProperty(currentNode, 'bg2', '#23e143')
                            }
                            else if (shelves.moveState === 2) { // 禁出
                                this.diagram.model.setDataProperty(currentNode, 'bg2', '#b5200e')
                            }else if (shelves.moveState === 0 && shelves.rackLoadState === 0){
                                this.diagram.model.setDataProperty(currentNode, 'bg2', 'rgba(245,245,245,1)')
                            }

                            if (shelves.rackLoadState === 1) { // 移入分配
                                this.diagram.model.setDataProperty(currentNode, 'bg3', 'blue')
                            }
                            else if (shelves.rackLoadState === 2) {  // 移入锁定
                                this.diagram.model.setDataProperty(currentNode, 'bg3', 'yellow')
                            }
                            // else if (shelves.rackLoadState === 3) {  // 载货
                            //     this.diagram.model.setDataProperty(currentNode, 'bg3', '#6a89cc')
                            // }
                            else if (shelves.rackLoadState === 4) {  // 移出分配
                                this.diagram.model.setDataProperty(currentNode, 'bg3', 'red')
                            }
                            else if (shelves.rackLoadState === 5) {  // 移出锁定
                                this.diagram.model.setDataProperty(currentNode, 'bg3', '#4d0000')
                            }else if (shelves.rackLoadState === 0){
                                this.diagram.model.setDataProperty(currentNode, 'bg3', 'rgba(245,245,245,1)')
                            }

                            if (shelves.readyTime && shelves.minMinutes) {
                                //开始时间
                                const readyDate = new Date(shelves.readyTime);
                                //流程时间(分钟)
                                const timeoutMinutes = shelves.minMinutes;
                                //计算截止时间
                                const timeoutDate = new Date(readyDate.getTime() + timeoutMinutes * 60000);
                                const now = new Date();
                                if (now > timeoutDate) {
                                    this.redArr.push(node.key);
                                }
                            }

                        }
                    })
                })
                // console.log(this.redArr)
                if (this.redArr.length !== 0) {
                    this.flashTimer = setInterval(() => {
                            this.flash( this.redArr);
                    }, 1000)
                }


            })

        },

        allLocationDiagram(val) {
            this.loading = true;
            
            if (!val) {
                let params = {
                    current: 1,
                    pageSize: 100,
                    requestData: {
                        fileType: 2
                    },
                };
                const _data = { url: '/monitor-drawing/guest/list', params: params }
                this.$store.dispatch('fmsCommon/actionTaskPost', _data)
                .then(data => {
                    this.seleConfig = data.data.sort((a,b)=>{return a.sortNum-b.sortNum});
                    this.scheduleType = this.seleConfig[0].id;
                    this.laneCodes = this.seleConfig[0].remark;
                    this.initDiagram(this.seleConfig[0].id)
                }).catch(err => {
                    console.error(err)
                })
            }else{
                for(let x of this.seleConfig){
                    if(x.id===val){
                        this.laneCodes=x.remark;
                        break;
                    }
                }
                this.initDiagram(val)
            }
  
        },
        // 初始化货位图
        initDiagram(id) {
            let params = {
                data: id
            };
            const _data = { url: '/monitor-drawing/guest/get-script', params: params }
            this.$store.dispatch('fmsCommon/actionTaskPost', _data)
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
                        minScale: 0.1,
                        maxScale: 4,
                        "toolManager.hoverDelay": 100,
                        isReadOnly: true,   //只读
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
                        // selectionAdorned: false,  // 在Shape.stroke上使用Binding来显示选择
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
                                fill: "rgba(128, 128, 128, 0.5)",
                                stroke:"#999"
                            },
                            new go.Binding("fill", "color"),  // 数据绑定（'属性名'，'属性值'）
                            // shape形状由geometryString定义
                            new go.Binding("geometryString", "geo"),
                            // 点击图形会使节点外边框变成蓝色
                            // new go.Binding("stroke", "isSelected", s => s ? "dodgerblue" : "#999").ofObject(),
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
                            new go.Binding("font", "font").makeTwoWay(),
                            //new go.Binding("alignment", "label_offset", go.Spot.parse).makeTwoWay(go.Spot.stringify)
                            new go.Binding("overflow", "", function (s) { return (s.lot1 && s.lot2 && s.lot3 && s.lot4) ? go.TextBlock.OverflowEllipsis : go.TextBlock.OverflowClip; }),
                            new go.Binding("maxLines", "", function (s) { return (s.lot1 && s.lot2 && s.lot3 && s.lot4) ? 1 : ""; }),
                            new go.Binding("width", "", function (s) { return (s.lot1 && s.lot2 && s.lot3 && s.lot4) ? 20 : ""; }),
                            new go.Binding("stroke", "lot1", function (s) { return s ? "transparent" : "rgba(0,0,0,0.7)"; }),
                        ), //  文本属性
                        Make(go.Panel, 'Table',   // 面板的table布局 (注意:vue中要写在spot布局中，写在外面spot布局的块会缺失)
                            Make(go.TextBlock, new go.Binding("text", "lot1"), { font: "10pt serif", stroke: "none" },
                                { row: 0, column: 0, margin: 0.5, width: 8, height: 8 }, new go.Binding("background", "bg1")),
                            Make(go.TextBlock, new go.Binding("text", "lot2"), { font: "10pt serif", stroke: "none" },
                                { row: 0, column: 1, margin: 0.5, width: 8, height: 8 }, new go.Binding("background", "bg2")),
                            Make(go.TextBlock, new go.Binding("text", "lot3"), { font: "10pt serif", stroke: "none" },
                                { row: 1, column: 0, margin: 0.5, width: 8, height: 8 }, new go.Binding("background", "bg3")),
                            Make(go.TextBlock, new go.Binding("text", "lot4"), { font: "10pt serif", stroke: "none" },
                                { row: 1, column: 1, margin: 0.5, width: 8, height: 8 }, new go.Binding("background", "bg4"))
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
                        minSize: new go.Size(20, 20),
                        desiredSize: new go.Size(30, 20),  // 初始化1x1的cel
                        // locationSpot: new go.Spot(0, 0, 0, 0)
                    },
                    new go.Binding("position", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    {
                        mouseDragEnter: function (e, grp, prev) {
                            // if (!highlightGroup(grp, true)) e.diagram.currentCursor = "not-allowed"; else e.diagram.currentCursor = "";
                        },
                        mouseDragLeave: function (e, grp, next) {
                            // highlightGroup(grp, false); 
                        },
                        mouseDrop: function (e, grp) {
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
                    // _this.TempObj['modalTemp'] = obj.data;
                    _this.TempObj['modalTemp'] = {
                        ...obj.data,
                        ...obj.data.shelfData
                    };
                    // console.log(_this.TempObj['modalTemp']);
                }
            }

            // 提示框信息
            function nodeInfo(data) {
                let matlState = data.matlState!=null?_this.selColumns.matlState.find(item =>item.id===data.matlState)?.name:'';
                let rackUseState =data.rackUseState!=null? _this.selColumns.rackUseState.find(item =>item.id===data.rackUseState)?.name:'';
                let rackLoadState = data.rackLoadState!=null?_this.selColumns.rackLoadState.find(item =>item.id===data.rackLoadState)?.name:'';
                let moveState = data.moveState!=null?_this.selColumns.moveState.find(item =>item.id===data.moveState)?.name:'';
                let rackAutoState = data.rackAutoState!=null?_this.selColumns.rackAutoState.find(item =>item.id===data.rackAutoState)?.name:'';
                let rackPressState = data.rackPressState!=null?_this.selColumns.rackPressState.find(item =>item.id===data.rackPressState)?.name:'';
                let rackErrorState = data.rackErrorState!=null?_this.selColumns.rackErrorState.find(item =>item.id===data.rackErrorState)?.name:'';
                let pltCodes= data.pltCodes!=null?data.pltCodes:'';
                let info = `
                                ${'货位号:' + data.rackCode}
                                ${'使用状态:' + rackUseState}
                                ${'电池状态:' + matlState}
                                ${'装载状态:' + rackLoadState}
                                ${'出入限定:' + moveState}
                                ${'托盘条码:' + pltCodes}
                                `;
                if(data?.shelfData.rackFunc =='404' || data?.shelfData.rackFunc =='405'){
                     info += `  ${'自动状态:' + rackAutoState}
                                ${'针床状态:' + rackPressState}
                                ${'异常状态:' + rackErrorState}
                            `;
                }
                if (i18n.t("common.common_data_transfer") == 'en'){
                    info = `
                                ${'rackCode:' + data.rackCode}
                                ${'useState:' + rackUseState}
                                ${'matlState:' + matlState}
                                ${'loadState:' + rackLoadState}
                                ${'moveState:' + moveState}
                                ${'pltCodes:' + pltCodes}
                                `;
                    if(data?.shelfData.wareCode =='W2' || data?.shelfData.wareCode =='W5'){
                     info += `  ${'autoState:' + rackAutoState}
                                ${'pressState:' + rackPressState}
                                ${'errorState:' + rackErrorState}
                            `;
                    }
                }
                    
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
        flash(arr) {
            this.diagram.model.commit(function (m) {
            arr.forEach(item => {
                let nodes = m.findNodeDataForKey(item);
                if (nodes.color === "red") {
                    m.setDataProperty(nodes, "color", "rgba(0, 0, 0, 0.5)");
                } else {
                    m.setDataProperty(nodes, "color", "red");
                }
            });
                
            }, "flash");
        },
        // 删除重复的报警节点
        delRedArr(key) {
            for (var i = 0; i < this.redArr.length; i++) {
                if (this.redArr[i] === key) {
                    redArr.splice(i, 1)
                }
            }
        },

        // 监控按钮
        monitorBtn() {
            if (!this.isMonitor) {
                jq('#monitorBtn').text(this.$t('common.btn.stopMonitor'));
                this.isMonitor = true; // 启动监控
                // 轮询触发获取货位监控数据
                this.shelvesInfo();
                this.monitorTimer = setInterval(() => {
                    this.shelvesInfo();
                }, 2000);
            } else {
                this.isMonitor = false;
                jq('#monitorBtn').text(this.$t('common.btn.monitor'));
                this.redArr = [];
                clearInterval(this.flashTimer);
                clearInterval(this.monitorTimer);
                // 恢复监控前的颜色
                for (var nit = this.diagram.nodes; nit.next();) {
                    var node = nit.value;
                    let nodes = this.diagram.model.findNodeDataForKey(node.data.key);
                    if (nodes.rackCode) {
                        this.diagram.model.setDataProperty(nodes, "bg1", "#fff");
                        this.diagram.model.setDataProperty(nodes, "bg2", "#fff");
                        this.diagram.model.setDataProperty(nodes, "bg3", "#fff");
                        this.diagram.model.setDataProperty(nodes, "bg4", "#fff");
                        this.diagram.model.setDataProperty(nodes, "color", "#ccc");
                    }
                }
            }

        },

        // 缩放按钮
        zoomIn() {
            this.diagram.scale = this.diagram.scale + 0.1;
        },
        zoomOut() {
            this.diagram.scale = this.diagram.scale - 0.1;
        },
        // 监控图导出
        myCallback(blob) {
            var url = window.URL.createObjectURL(blob);
            var filename = "mySVGFile.svg";
            var a = document.createElement("a");
            a.style = "display: none";
            a.href = url;
            a.download = filename;
            // IE 11
            if (window.navigator.msSaveBlob !== undefined) {
                window.navigator.msSaveBlob(blob, filename);
                return;
            }
            document.body.appendChild(a);
            requestAnimationFrame(function () {
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            });
        },
        exportSvg() {
            if (this.diagram.nodes.count) {
                var svg = this.diagram.makeSvg({ scale: 1.0, background: "white" });
                var svgstr = new XMLSerializer().serializeToString(svg);
                var blob = new Blob([svgstr], { type: "image/svg+xml" });
                this.myCallback(blob);
            } else {
                this.$message.warning("有监控图才能导出!");
            }
        },
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
        margin: 0 10px 0;
    }

    .design-and-inspect {
        span {
            display: block;
            width: 98%;
            margin: 3px auto;
            // border: 2px solid #a8bec9 !important;
            border-radius: 4px;
        }
    }
}

.el-dialog.customStyle {
    width: 60%;
    height: 50%;
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

.inspector {
    display: inline-block;
    font: bold 14px helvetica, sans-serif;
    color: #000;
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
    color: #F5F5F5;
    font: bold 12px helvetica, sans-serif;
    border: 1px solid #ccc;
    padding: 2px;
}

.inspector input:disabled {
    background-color: #BDBDBD;
    color: #1b1b1b;
}

.inspector select {
    background-color: #fff;
}
</style>
