/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: 生产监控-生产物流监控
 */
<template>
    <el-row>
        <el-col :span="24">
            <div :style="{display: 'flex','justify-content':'center',margin: '5px 0'}">
                 <el-select v-model="chartSel" @change="chartChange" class="chartSelect" :style="{'width':'12%',margin:'0 10px 0 0'}">
                            <el-option
                                v-for="(sel,s) in chartData"
                                :key="`chart${s}`"
                                :label="sel.fileName"
                                :value="{value:sel.id,label:sel.fileName}">
                            </el-option>
                </el-select>
                <el-button @click='monitorBtn' type="primary" id='monitorBtn'>{{$t('common.btn.monitor')}}</el-button>
                <el-button id="SaveButton" @click="zoomIn" type="primary">{{$t('common.btn.enlarge')}}</el-button>  
                <el-button id="SaveDesign" @click="zoomOut" type="primary">{{$t('common.btn.lessen')}}</el-button>
                <el-button  @click="fullScreen" type="primary">{{$t('common.btn.fullScreen')}}</el-button>            
            </div>
            <div class="design-and-inspect">
               <div ref='myDiagramSpan' class="myDiagramSpan">
                  <!-- 监控图画板 -->
                  <div ref='myDiagramDiv' class="myDiagramDiv" :style="monitorArea" v-loading="loading"/>    
                  <!-- 节点右键面板 -->
                    <ul id="contextMenu" class="menu">
                        <li id="read" class="menu-item" @click="cxcommand">{{translateText('roadInfo')}}</li>
                        <li id="current-lot" class="menu-item" @click="cxcommand" :style="{'display':this.stacker ? 'none':'block'}">{{translateText('pltInfo')}}</li>
                        <li id="task-info" class="menu-item" @click="cxcommand">{{translateText('taskInfo')}}</li>
                        <li id="plc-enter" class="menu-item" @click="cxcommand" :style="{'display':this.stacker ? 'none':'block'}">{{translateText('addPLC')}}</li>
                        <li id="plc-clear" class="menu-item" @click="cxcommand" :style="{'display':this.stacker ? 'none':'block'}">{{translateText('deletePLC')}}</li>
                   </ul>
                    <!-- 模态框 -->
                    <!-- 输送线弹出框 -->
                    <el-dialog width="70%" v-el-drag-dialog :visible.sync="dialogFormVisible" :title="translateText('deviceInfo')"  :modal="false" customClass="nodeModal" @close="closeDialog">
                                    <!-- 功能按钮 -->
                                    <el-row class="specialbutton">
                                        <el-button type="danger" icon="el-icon-delete" @click="clearPlc" round>{{translateText('clearPLC')}}</el-button>
                                        <el-button type="primary" icon="el-icon-edit" @click="writePlc" round>{{translateText('editPLC')}}</el-button>
                                        <el-button type="warning" icon="el-icon-star-off" @click="movePlc" round>{{translateText('movePLC')}}</el-button>
                                    </el-row>
                                    <el-tabs v-model="activeName"  @tab-click="handleClick">
                                        <el-tab-pane :label="translateText('deviceInfo')" name="first">
                                            <div class="eqInfo">
                                                <div>
                                                    <img :src="srcObj" width="100%" height="100%" />
                                                </div>
                                                <div style="margin-left:100px">
                                                    <el-form ref="dataForm" :model="conveyorTemp" label-width="120px" :close-on-click-modal="false" >
                                                        <el-row>
                                                            <el-col :span="12">
                                                                <el-form-item  :label="commonI18n(getItem(conveyorColumns,'locNum'))" >
                                                                    <el-input v-model="conveyorTemp.locNum" :disabled="true"/>
                                                                </el-form-item>
                                                            </el-col>
                                                            <el-col  :span="12">
                                                                <el-form-item :label="commonI18n(getItem(conveyorColumns,'taskNum'))">
                                                                    <el-input  v-model="conveyorTemp.conveyorTask.taskNum" :disabled="isDisabled"/>
                                                                </el-form-item>
                                                            </el-col>
                                                        </el-row>
                                                        <el-row>
                                                            <el-col :span="12">
                                                                <el-form-item :label="commonI18n(getItem(conveyorColumns,'trayNum'))">
                                                                    <el-input v-model="conveyorTemp.conveyorTask.trayNum" :disabled="isDisabled"/>
                                                                </el-form-item>
                                                            </el-col>
                                                            <el-col :span="12">
                                                                <el-form-item :label="commonI18n(getItem(conveyorColumns,'trayType'))">
                                                                    <el-select v-model="conveyorTemp.conveyorTask.trayType"  :popper-append-to-body="false" style="width: 100%"  :disabled="isDisabled">
                                                                        <el-option v-for="item in initSelect.trayType" :key="item.value"  :value="item.value" :label="item.label" />
                                                                    </el-select>
                                                                </el-form-item>
                                                            </el-col>
                                                        </el-row>
                                                        <el-row>
                                                            <el-col :span="12">
                                                                <el-form-item :label="commonI18n(getItem(conveyorColumns,'matlState'))">
                                                                    <el-select v-model="conveyorTemp.conveyorTask.matlState" style="width: 100%" :popper-append-to-body="false"  :disabled="isDisabled">
                                                                        <el-option v-for="item in initSelect.matlState" :key="item.value" :value="item.value" :label="item.label" />
                                                                    </el-select>
                                                                </el-form-item>
                                                            </el-col>
                                                            <el-col :span="12">
                                                                <el-form-item :label="commonI18n(getItem(conveyorColumns,'trayCount'))">
                                                                    <el-input v-model="conveyorTemp.conveyorTask.trayCount" :disabled="isDisabled"/>
                                                                </el-form-item>
                                                            </el-col>
                                                        </el-row>

                                                        <el-row>
                                                            <el-col :span="12">
                                                                <el-form-item :label="commonI18n(getItem(conveyorColumns,'otherState_PLC'))">
                                                                    <el-select v-model="conveyorTemp.conveyorTask.otherState_PLC" style="width: 100%" :popper-append-to-body="false" :disabled="isDisabled">
                                                                        <el-option v-for="item in initSelect.otherState_PLC" :key="item.value" :value="item.value" :label="item.label" />
                                                                    </el-select>
                                                                </el-form-item>
                                                            </el-col>
                                                            <el-col :span="12">
                                                                <el-form-item :label="commonI18n(getItem(conveyorColumns,'otherState_PC'))">
                                                                    <el-select v-model="conveyorTemp.conveyorTask.otherState_PC" :popper-append-to-body="false" style="width: 100%"  :disabled="isDisabled">
                                                                        <el-option v-for="item in initSelect.otherState_PC" :key="item.value" :value="item.value" :label="item.label" />
                                                                    </el-select>
                                                                </el-form-item>
                                                            </el-col>      
                                                        </el-row>
                                                        <el-row>
                                                            <el-col :span="12">
                                                                <el-form-item :label="commonI18n(getItem(conveyorColumns,'scanState'))">
                                                                    <el-select v-model="conveyorTemp.conveyorTask.scanState" style="width: 100%" :popper-append-to-body="false" :disabled="isDisabled">
                                                                        <el-option v-for="item in initSelect.scanState" :key="item.value" :value="item.value" :label="item.label" />
                                                                    </el-select>
                                                                </el-form-item>
                                                            </el-col>
                                                            <el-col :span="12">
                                                                <el-form-item :label="commonI18n(getItem(conveyorColumns,'interfaceState'))">
                                                                    <el-select v-model="conveyorTemp.conveyorTask.interfaceState" style="width: 100%" :popper-append-to-body="false" :disabled="isDisabled">
                                                                        <el-option v-for="item in initSelect.interfaceState" :key="item.value" :value="item.value" :label="item.label" />
                                                                    </el-select>
                                                                </el-form-item>
                                                            </el-col>
                                                        </el-row>
                                                        <el-row>
                                                            <el-col :span="12">
                                                                <el-form-item :label="commonI18n(getItem(conveyorColumns,'fromLocNum'))">
                                                                    <el-input v-model="conveyorTemp.conveyorTask.fromLocNum" :disabled="isDisabled"/>
                                                                </el-form-item>
                                                            </el-col>
                                                            <el-col :span="12">
                                                                <el-form-item :label="commonI18n(getItem(conveyorColumns,'toLocNum'))">
                                                                    <el-input v-model="conveyorTemp.conveyorTask.toLocNum" :disabled="isDisabled"/>
                                                                </el-form-item>
                                                            </el-col>
                                                        </el-row>
                                                        <el-row>
                                                            <el-col :span="24">
                                                                <el-form-item :label="commonI18n(getItem(conveyorColumns,'errInfo'))">
                                                                    <el-input type="textarea" :rows="2" v-model="conveyorTemp.errInfo" :disabled="true"></el-input>
                                                                </el-form-item>
                                                            </el-col>
                                                        </el-row>
                                                        <el-form-item v-if="btnVisible">
                                                            <el-button @click="cancelWritePlc">{{$t('common.btn.cancel')}}</el-button> 
                                                            <el-button type="primary" @click="submitWritePlc">{{$t('common.btn.ok')}}</el-button>
                                                        </el-form-item>
                                                    </el-form>  
                                                </div>
                                            </div>
                                            
                                        </el-tab-pane>
                                        <el-tab-pane :label="translateText('pltInfo')" name="second">
                                            <el-radio-group v-model="pltIndex" class="radio-group">
                                                <div v-for="(i,index) in radioSwitchData"  :key="`ra${index}`" style="display: inline">
                                                    <el-radio :label="index+1" style="width:16%" @change="(val)=>radioChange(val,index)">{{index+1}}</el-radio>
                                                </div>  
                                            </el-radio-group>
                                            <el-form ref="dataForm" class="dataForm" :model="trayTemp"  label-width="100px" :close-on-click-modal="false">
                                                <el-row>
                                                <div v-for="(item,i) in trayColumns"  :key="i" :style="{display: 'inline'}"> 
                                                    <el-col :span="8">
                                                    <el-form-item label-width="170px" :label="commonI18n(item)" :prop="item.field">
                                                        <el-input v-if="!item.type"  v-model="trayTemp[item.field]" :disabled="item.readonly != 'true'?false:true" />
                                                        <el-select v-else-if="item.type === 'select'" v-model="trayTemp[item.field]" :disabled="item.readonly != 'true'?false:true" style="width: 100%"  >
                                                            <el-option
                                                                v-for="(sel,s) in locSelOption[item.selOption]"
                                                                :key="item.field+s"
                                                                :label="sel[item.selLabel]"
                                                                :value="sel[item.selVal]">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                    </el-col>    
                                                </div>  
                                                </el-row>      
                                            </el-form>
                                        </el-tab-pane>
                                        <el-tab-pane :label="translateText('staInfo')" name="third" v-if="staTab">
                                            <el-form ref="dataForm" :model="staTemp" :inline="true"  label-width="100px" :close-on-click-modal="false">
                                            <el-row>
                                                <div v-for="(item,i) in staColumns"  :key="i" style="display: inline">
                                                <el-col :span="12">
                                                    <el-form-item  :label="commonI18n(item)" :prop="item.field">
                                                        <el-input v-if="item.field != 'useState' && !item.type" style="width:146%"  v-model="staTemp[item.field]" :disabled="item.readonly != 'true'?false:true" />
                                                        <el-select v-else-if="item.type === 'select'" v-model="staTemp[item.field]"  style="width:135%" :disabled="item.readonly">
                                                            <el-option
                                                                v-for="(sel,s) in locSelOption[item.selOption]"
                                                                :key="item.field+s"
                                                                :label="sel[item.selLabel]"
                                                                :value="sel[item.selVal]">
                                                            </el-option>
                                                        </el-select>
                                                        <el-select v-else-if="item.field === 'useState'" v-model="staTemp[item.field]" style="width:60%" :disabled="item.readonly">
                                                            <el-option
                                                                v-for="(sel,s) in locSelOption[item.selOption]"
                                                                :key="item.field+s"
                                                                :label="sel[item.selLabel]"
                                                                :value="sel[item.selVal]">
                                                            </el-option>
                                                        </el-select>
                                                        <el-button  :style="{width:'30%','margin-left':'2%'}" type="primary" v-if="item.field === 'useState'" @click="isUse" plain>{{staDisBtn}}</el-button>
                                                    </el-form-item>
                                                    </el-col>
                                                </div>
                                            </el-row> 
                                            </el-form>
                                        </el-tab-pane>
                                    </el-tabs>
                                    
                    </el-dialog> 
                    <!-- 节点右键弹窗 -->
                    <contextViewModal 
                            ref='contextViewModal'
                            :roadWindow="true"
                            :tableOneData="contextTableOne"
                            :tableOneTitle="tableOneTitle"
                            :tableTwoTitle="tableTwoTitle"
                            :tableTwoData="contextTableTwo"
                            :modalTitle='contextlineTitle'
                            :rowOneTable='rowFromTable'
                            :rowTwoTable='rowToTable'
                            :pageSize='pageSize'
                            :current='current'
                            :toPageSize='toPageSize'
                            :toCurrent='toCurrent'
                            @fromPage="fromPage"
                            @toPage="toPage"
                            @roadStartFresh="roadStartFresh"
                            @roadToFresh="roadToFresh"
                            :toTotal='toTotal'
                        />
                    <!-- 节点右键弹窗-当前托盘 -->
                    <currenTray 
                            ref='currenTray'
                            :roadWindow="true"
                            :tableOneData="contextTableOne"
                            :tableOneTitle="tableOneTitle"
                            :tableTwoTitle="tableTwoTitle"
                            :tableTwoData="contextTableTwo"
                            :modalTitle='contextlineTitle'
                            :pageSize='pageSize'
                            :current='current'
                            :toPageSize='toPageSize'
                            :toCurrent='toCurrent'
                            @fromPage="fromPage"
                            @toPage="toPage"
                            :toTotal='toTotal'
                            :staTempp='staTemp'
                            :pltCate='pltCate'
                            :MatlCate='MatlCate'
                            :selColumns='selColumns'
                            :initSelect="initSelect"
                            :locSelOption="locSelOption"
                        />
                    <!-- 节点右键弹窗-任务信息 -->
                    <missionInformation 
                            ref='missionInformation'
                            :roadWindow="true"
                            :tableOneData="contextTableOne"
                            :tableOneTitle="tableOneTitle"
                            :tableTwoTitle="tableTwoTitle"
                            :tableTwoData="contextTableTwo"
                            :modalTitle='contextlineTitle'
                            :pageSize='pageSize'
                            :current='current'
                            :toPageSize='toPageSize'
                            :toCurrent='toCurrent'
                            @fromPage="fromPage"
                            @toPage="toPage"
                            :toTotal='toTotal'
                            :staTempp='staTemp'
                            :pltCate='pltCate'
                            :MatlCate='MatlCate'
                            :selColumns='selColumns'
                            :initSelect="initSelect"
                            :locSelOption="locSelOption"
                        />
                    <!-- 节点右键弹窗-PLC补录 -->
                    <plcSupplement 
                            ref='plcSupplement'
                            :roadWindow="true"
                            :tableOneData="contextTableOne"
                            :tableOneTitle="tableOneTitle"
                            :tableTwoTitle="tableTwoTitle"
                            :tableTwoData="contextTableTwo"
                            :modalTitle='contextlineTitle'
                            :pageSize='pageSize'
                            :current='current'
                            :toPageSize='toPageSize'
                            :toCurrent='toCurrent'
                            @fromPage="fromPage"
                            @toPage="toPage"
                            :toTotal='toTotal'
                            :staTempp='staTemp'
                            :pltCate='pltCate'
                            :MatlCate='MatlCate'
                            :selColumns='selColumns'
                            :stockerSel='stockerSel'
                            :domobjData='domobjData'
                            :initSelect="initSelect"
                            :locSelOption="locSelOption"
                        />
                    <!-- 节点右键弹窗-PLC清除 -->
                        <el-dialog
                        :title="$t('common.tip_info.tips')"
                        :visible.sync="dialogVisible_plclear"
                        width="30%"
                        >
                        <span>{{getClearTipText(domobjData.ctrlCode)}}</span>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisible_plclear = false">{{$t('common.btn.cancel')}}</el-button>
                            <el-button type="primary" @click="plClear">{{$t('common.btn.ok')}}</el-button>
                        </span>
                        </el-dialog>

                    <!-- 节点右键弹窗-堆垛机-路径查看 -->
                    <stackerPath 
                            ref='currenTray_stacker'
                            :roadWindow="true"
                            :tableOneData="contextTableOne"
                            :tableOneTitle="tableOneTitle"
                            :tableTwoTitle="tableTwoTitle"
                            :tableTwoData="contextTableTwo"
                            :modalTitle='contextlineTitle'
                            :pageSize='pageSize'
                            :current='current'
                            :toPageSize='toPageSize'
                            :toCurrent='toCurrent'
                            @fromPage="fromPage"
                            @toPage="toPage"
                            :toTotal='toTotal'
                            :staTempp='staTemp'
                            :pltCate='pltCate'
                            :MatlCate='MatlCate'
                            :selColumns='selColumns'
                            :domobjData='domobjData'
                            :stockerSel="stockerSel"
                            :locInfo="locInfo"
                            :initSelect="initSelect"
                        />
                    <!-- 节点右键弹窗-堆垛机-任务信息 -->
                    <stackerMask 
                            ref='stackerMask'
                            :roadWindow="true"
                            :tableOneData="contextTableOne"
                            :tableOneTitle="tableOneTitle"
                            :tableTwoTitle="tableTwoTitle"
                            :tableTwoData="contextTableTwo"
                            :modalTitle='contextlineTitle'
                            :pageSize='pageSize'
                            :current='current'
                            :toPageSize='toPageSize'
                            :toCurrent='toCurrent'
                            @fromPage="fromPage"
                            @toPage="toPage"
                            :toTotal='toTotal'
                            :staTempp='staTemp'
                            :pltCate='pltCate'
                            :MatlCate='MatlCate'
                            :selColumns='selColumns'
                            :domobjData='domobjData'
                            :initSelect="initSelect"
                        />
                    <!-- 节点区域移动弹窗 -->
                    <contextModal 
                            ref='infoMoveWindow'
                            :isTab="false"
                            :isForm='true'
                            :firColumns='areaMoveColumns'
                            :selColumns="selColumns"
                            :modalTitle='infoMoveTitle'
                            :parentLabel="parentLabel"
                            :modalTemp="moveObj['modalTemp']"
                            :modalFormInfo="modalFormInfo"
                            :imgExist="false"
                            :srcObj="''"
                            :isInputDisAbled="isInputDisAbled"
                            @moveOnFinish="moveOnFinish"
                            @selFunc="selFunc"
                        />
                    <!-- 堆垛机弹窗 -->
                    <contextModal 
                            ref='stockerWindow'
                            :colorBtn="colorBtn"
                            :tableOneData="tableOneData"
                            :tableTwoData="tableTwoData"
                            :tableThreeData="tableThreeData"
                            :modalTempTwo="modalTempTwo"
                            :alltype="true"
                            :rowOne="rowOne"
                            :rowTwo="rowTwo"
                            :rowThree="rowThree"
                            :rowTwoTable="rowTwoTable"
                            :rowThreeTable="rowThreeTable"
                            :rowSecondTable="rowSecondTable"
                            :btnNum="btnNum"
                            :img_width="img_width"
                            :btnStyle="btnStyle"
                            :btn_all="btn_all"
                            :funcBtnShow="true"
                            :isTab="true"
                            :firColumns='moveColumns'
                            :secColumns='stockerTaskColumns'
                            :selColumns="stockerSel"
                            :modalTitle='infoMoveTitle'
                            :parentLabel="parentLabel"
                            :modalTemp="infoObj['modalTemp']"
                            :modalTempOne="modalTempOne"
                            :modalFormInfo="modalFormInfo"
                            :imgExist="true"
                            :srcObj="srcObj"
                            @moveOnFinish="moveOnFinish"
                            @btnClick="btnClick"
                            @handleClick="stockerHandleClick"  
                            @rePostFunc="rePostFunc"
                            @forceFinishFunc="forceFinishFunc"
                        />
                    <!-- 取放货弹窗 -->
                    <layOrPickModal 
                            ref='layPickWindow'
                            :modalTitle='layPickTitle'
                            :carryType="carryType"
                            :alltype="true"
                            :stockerlayOrPick="stockerlayOrPick"
                            @layModalFunc="layModalFunc"
                            :layModalShow="layModalShow"
                        />
                    <!-- 扫码枪弹窗 -->
                    <scanModal 
                            ref='scanWindow'
                            :scanCarryType="scanCarryType"
                            :locationNum="locationNum"
                            :modalScanInfo="modalScanInfo"
                        />
                    <!-- 堆垛机信息弹窗的按钮提示弹窗 -->
                    <stockBtnInfoModal 
                        ref="stockBtnInfoWindow"
                        :stockInfoTitle="stockBtnTitle"
                        :carryType="carryType"
                        @stockerEqInfo="stockerEqInfo"
                    />
               </div>
               <div ref="resizeHandle" class="handle-resize" />
            </div> 
        </el-col>
        <el-col :span="24" >
            <!-- <div :style="'height: calc(100vh - ' +monitorArea.height +'px)'"> -->
                <div :style="upArea">
                    <warnModal :upArea="upArea"/>
                

            </div>
        </el-col>  
   
    </el-row>
</template>

<script>
    import elDragDialog from '@/directive/el-drag-dialog';
    import elImageViewer from 'element-ui/packages/image/src/image-viewer';
    import contextModal from '@/components/modal/index';
    import contextViewModal from './components/contextView';
    import currenTray from './components/currenTray';
    import stackerPath from './components/stackerPath';
    import stackerMask from './components/stackerMask';
    import missionInformation from './components/missionInformation';
    import plcSupplement from './components/plcSupplement';
    import layOrPickModal from './components/layOrPickModal';
    import scanModal from './components/scanModal';
    import stockBtnInfoModal from './components/stockBtnInfoModal';
    import warnModal from './components/warnModal';
    import { rePost,forceFinish,EnableStocker } from '@/api/proLineMonitor';
    import i18n from '@/lang';
    import jq from 'jquery';
    const ipSettings = require('../../../globalSetting.js')
    const Make = go.GraphObject.make;
    let redArr = [],timeDelay = 0;
    export default {
        name:"prodLogistics Monitor",
        components: { elImageViewer, contextModal,layOrPickModal,contextViewModal,currenTray,
                      scanModal,missionInformation,plcSupplement,stackerPath,stackerMask,stockBtnInfoModal,warnModal },
        directives: { elDragDialog },
        data() {
            return {
                stockBtnTitle:'',
                /*--------------- 分割 ----------------*/ 
                modalScanInfo:{
                        locNum:undefined,
                        carryType:undefined,
                        checkFlag:undefined,
                        trayNum:undefined,
                        trayBarCode:undefined,
                    },
                isInputDisAbled:true,
                chartSel: null,
                chartData: [],
                staTab: false,
                textI18n:{
                    clearPLC:{zh:'清除PLC数据',en:"Clear PLC",vn:"Xóa dữ liệu PLC"},
                    editPLC:{zh:'修改PLC数据',en:"Edit PLC",vn:"Sửa đổi dữ liệu PLC"},
                    movePLC:{zh:'移动PLC数据',en:"Move PLC",vn:"Dữ liệu PLC di động"},
                    deviceInfo:{zh:'设备信息',en:"Device info",vn:"Thông tin thiết bị"},
                    pltInfo:{zh:'托盘信息',en:"Plt info",vn:"Thông tin pallet"},
                    staInfo:{zh:'站台信息',en:"Station info",vn:"Thông tin trang web"},
                    roadInfo:{zh:'路径信息',en:"Road info",vn:"thông tin đường dẫn"},
                    taskInfo:{zh:'任务信息',en:"Task info",vn:"Thông tin nhiệm vụ"},
                    addPLC:{zh:'PLC补录',en:"Add PLC",vn:"Ghi bổ sung PLC"},
                    deletePLC:{zh:'PLC清除',en:"Clear PLC",vn:"PLC rõ ràng"},
                    beginRoad:{zh:'开始路径',en:"Start road",vn:"con đường bắt đầu"},
                    endRoad:{zh:'到达路径',en:"Arrival road",vn:"Đường đến"},
                    moveTo:{zh:'移动到',en:"Move to",vn:"di chuyển"},
                    stopMonitor:{zh:'停止监控',en:"Stop",vn:"Dừng giám sát"},
                    communicationError:{zh:'通讯故障',en:"Communication error",vn:"giao tiếp thất bại"},
                    deviceType:{zh:'设备类型',en:"deviceType",vn:"Loại thiết bị"},
                    deviceCode:{zh:'设备号',en:"deviceCode",vn:"Số thiết bị"},
                    carryType:{zh:'产线区域',en:"carryType",vn:"Khu vực dây chuyền sản xuất"},
                    ctrlCode:{zh:'产线编码',en:"ctrlCode",vn:"Mã hóa dây chuyền sản xuất"},
                    rackCode:{zh:'货位编码',en:"rackCode",vn:"Mã vị trí vận chuyển hàng hóa"},
                    trayNum:{zh:'托盘编码',en:"trayNum",vn:"Mã hóa pallet"},
                    faultInfos:{zh:'报警信息',en:"faultInfos",vn:"Thông tin cảnh báo"},
                    signal:{zh:'光电信号',en:"signal",vn:"Tín hiệu quang điện"},
                    deviceMode:{zh:'操作方式',en:"deviceMode",vn:"Phương thức vận hành"},
                    deviceState:{zh:'运行状态',en:"deviceState",vn:"Trạng thái hoạt động"},
                    forkStatus:{zh:'货叉安全',en:"forkStatus",vn:"An toàn ngã ba"},
                    autoTask:{zh:'自动任务',en:"autoTask",vn:"Tác vụ tự động"},
                    postTaskNum:{zh:'下发的任务号',en:"postTaskNum",vn:"Số nhiệm vụ đã ban hành"},
                    execTaskNum:{zh:'执行的任务号',en:"execTaskNum",vn:"Số nhiệm vụ được thực hiện"},
                    execState:{zh:'执行阶段',en:"execState",vn:"Giai đoạn thực hiện"},
                    fork1State:{zh:'货叉1状态',en:"fork1State",vn:"Trạng thái ngã ba 1"},
                    fork2State:{zh:'货叉2状态',en:"fork2State",vn:"Trạng thái ngã ba 2"},
                    filled:{zh:'有货',en:"filled",vn:"Trong kho"},
                    empty:{zh:'无货',en:"empty",vn:"Bán hết"},
                    forbidden:{zh:'屏蔽',en:"forbidden",vn:"cái khiên"},
                    location:{zh:'当前位置',en:"location",vn:"vị trí hiện tại"},
                    postFlag:{zh:'下发状态',en:"postFlag",vn:"Tình trạng giao hàng"},
                    rowNum:{zh:'排号区域',en:"rowNum",vn:"Khu vực đánh số"},
                    checkFlag:{zh:'交互标识',en:"checkFlag",vn:"nhận dạng tương tác"},
                    command:{zh:'下发的指令',en:"command",vn:"Hướng dẫn ban hành"},
                    doing:{zh:'正在搬运',en:"doing",vn:"Di chuyển"},
                    waiting:{zh:'等待搬运',en:"waiting",vn:"Đang chờ vận chuyển"}
                },
                scanVisible: false,
                layModalShow: false,
                dialogVisible_plclear: false,
                stacker: false,
                toPageSize:10,
                toCurrent:0,
                total:0,
                toTotal:0,
                pageSize:10,
                current:1,
                rowFromTable:[
                            {field: 'pltCateId',label:'托盘类型',},
                            {field: 'matlCateId',label:'物料类型',},
                            {field: 'carryType',label:'搬运类型',},
                            {field: 'cacheCount',label:'缓存数量',width:'100px'},
                            {field: 'carryPriority',label:'搬运顺序',},        
                            {field: 'useState',label:'有效标志',},        
                            {field: 'fromLocId',label:'起始位置',},        
                            {field: 'fromMatlState',label:'电池状态',width:'120px'},    
                            {field: 'fromMesState',label:'起始接口状态',width:'120px'},    
                            {field: 'toLocId',label:'到达位置',},        
                            {field: 'toMatlState',label:'电池状态',width:'100px'},    
                            {field: 'toMesState',label:'到达接口状态',width:'100px'},    
                ],
                rowToTable:[
                            {field: 'pltCateId',label:'托盘类型',},
                            {field: 'matlCateId',label:'物料类型',},
                            {field: 'carryType',label:'搬运类型',},
                            {field: 'cacheCount',label:'缓存数量',width:'100px'},
                            {field: 'carryPriority',label:'搬运顺序',},        
                            {field: 'useState',label:'有效标志',}, 
                            {field: 'fromLocId',label:'起始位置',},        
                            {field: 'fromMatlState',label:'电池状态',width:'120px'},    
                            {field: 'fromMesState',label:'起始接口状态',width:'120px'},          
                            {field: 'toLocId',label:'到达位置',},        
                            {field: 'toMatlState',label:'电池状态',width:'100px'},    
                            {field: 'toMesState',label:'到达接口状态',width:'100px'},    
                ],
               
                contextTableOne:[],
                contextTableTwo:[],
                contextlineTitle:'',
                colorBtn: ["danger","success","info","primary","primary","warning","warning"],
                areaMoveColumns:[ 
                    {key: 'carryType',label:'区域',type:"select",selVal:'id',selLabel:'name',selType:'selOne'},
                    {key: 'staCode',label:'设备号',disabled:false,type:"select",selVal:'staCode',selLabel:'staName',selType:'selTwo'},
                ],
                stockerSel:{
                    selOne:[],
                    selTwo:[],
                    selThree:[],
                    selFour:[],
                    selFive:[],
                    selSeven:[],
                    selEight:[],
                },
                rowOne:'',
                rowTwo:{},
                rowThree:'堆垛机指令',
                tableOneData:[],
                tableTwoData:[],
                tableThreeData:[],
                rowTwoTable:[
                            {prop: 'taskNum',label:'任务号',disabled:false,},
                            {prop: 'taskType',label:'任务类型',disabled:false,},
                            {prop: 'carryType',label:'搬运类型',disabled:false,},
                            {prop: 'pltCateName',label:'托盘类型',disabled:false,},
                            {prop: 'pltCode',label:'托盘条码',disabled:false,},        
                            {prop: 'fromLocName',label:'位置名称（源）',disabled:false,},        
                            {prop: 'fromMatlState',label:'物料状态（源）',disabled:false,},        
                            {prop: 'fromMesState',label:'接口状态（源）',disabled:false,},        
                ],
                rowSecondTable:[
                            {prop: 'taskNum',label:'任务号',disabled:false,},
                            {prop: 'taskType',label:'任务类型',disabled:false,},
                            {prop: 'carryType',label:'搬运类型',disabled:false,},
                            {prop: 'pltCateName',label:'托盘类型',disabled:false,},
                            {prop: 'pltCode',label:'托盘条码',disabled:false,},        
                            {prop: 'fromLocName',label:'位置名称（源）',disabled:false,},        
                            {prop: 'fromMatlState',label:'物料状态（源）',disabled:false,},        
                            {prop: 'fromMesState',label:'接口状态（源）',disabled:false,},  
                ],
                rowThreeTable:[
                            {prop: 'taskNum',label:'任务号'},
                            {prop: 'taskType',label:'任务类型'},
                            {prop: 'useFork',label:'使用货叉'},
                            {prop: 'cmdMode',label:'命令方式'},
                            {prop: 'fromLocType',label:'位置类型(源)'},
                            {prop: 'fromCtrlCode',label:'调度号(源)'},
                            {prop: 'toLocType',label:'位置类型(目标)'},
                            {prop: 'toCtrlCode',label:'调度号(目标)'},
                            {prop: 'fork1State',label:'货叉1'},  
                ],
                staSelect:[],
                img_width:'20%',
                btnNum: true,
                btnStyle:{
                    display:'flex',
                    justifyContent: 'space-around',
                    width:'100%'
                },
                // btn_all:[
                //     '急停','复位','取消','召回','行走','取货','放货',['禁用自动任务','启用自动任务']
                //     ],
                btn_all:[
                    {field:'stop',label:'急停'},
                    {field:'reset',label:'复位'},
                    {field:'cancel',label:'取消'},
                    {field:'recall',label:'召回'},
                    {field:'run',label:'行走'},
                    {field:'take',label:'取货'},
                    {field:'put',label:'放货'},
                    [
                        {field:'disable autoTask',label:'禁用自动任务'},
                        {field:'enable autoTask',label:'启用自动任务'},
                    ]
                ],
                infoMoveTitle:'',
                layPickTitle:'',
                moveColumns:[ 
                    {key: 'carryType',label:'区域',disabled:false,type:"select",selVal:'id',selLabel:'name',selType:'selOne'},
                    {key: 'staCode',label:'设备号',disabled:false,type:"select",selVal:'staCode',selLabel:'staName',selType:'selTwo'},
                ],
                btnVisible: false,
                isDisabled: true,
                // 节点公共组件弹窗变量
                firColumns:[ 
                    {key: 'rackName',label:'货架名称',disabled:true},
                    {key: 'rackCode',label:'货架编号',disabled:true},
                ],
                secColumns:[
                    {key: 'lotType',label:'托盘类型',disabled:true},
                    {key: 'lotCode',label:'货架编号',disabled:true},
                ],
                // 下发指令表单
                stockerTaskColumns:[
                            {key: 'taskNum',label:'任务编号',disabled:true,},
                            {key: 'taskGroupSort',label:'任务序号',disabled:true,},
                            {key: 'carryType',label:'搬运类型',disabled:true,type:"select",selVal:'id',selLabel:'name',selType:'selSix'},
                            {key: 'isFire',label:'是否火警',disabled:true,},
                            // {key: 'cmdMode',label:'命令方式',disabled:true,type:"select",selVal:'id',selLabel:'name',selType:'selEight'},
                            {key: 'useFork',label:'使用货叉',disabled:true,type:"select",selVal:'id',selLabel:'name',selType:'selSeven'},
                            {key: 'fork1State',label:'1号货叉',disabled:true,},
                            {key: 'fork2State',label:'2号货叉',disabled:true,},
                            {key: 'fromLocType',label:'起始位置',disabled:true,type:"select",selVal:'id',selLabel:'name',selType:'selFive'},
                            {key: 'fromCtrlCode',label:'起始调度号',disabled:true,},
                            {key: 'toLocType',label:'到达位置',disabled:true,type:"select",selVal:'id',selLabel:'name',selType:'selFive'},
                            {key: 'toCtrlCode',label:'目标调度号',disabled:true,},
                            {key: 'createTime',label:'创建时间',disabled:true,},
                            {key: 'postTime',label:'下达时间',disabled:true,},
                ],
                selColumns:{selOne:[],selTwo:[]},
                selFilter:[],
                title: '',
                parentLabel:{},
                contextParentLabel: {first: '货位信息', second: '托盘信息'},
                modalTempOne: {
                },
                modalTempTwo: {
                },
                TempObj: {
                    modalTemp:{}
                },
                moveObj: {
                  modalTemp:{
                    }  
                },
                contextObj: {
                    modalTemp:{

                    }
                },
                infoObj: {
                    modalTemp:{
                        carryType:undefined,
                        autoTask:undefined,
                        execTaskNum:undefined,
                        execState:undefined,
                        deviceMode:undefined,
                        deviceState:undefined,
                        fork1State:undefined,
                        fork2State:undefined,
                        row:undefined,
                        column:undefined,
                        layer:undefined,
                        errInfo:undefined,
                    }
                },
                modalFormInfo:{},
                // 非公共组件变量
                loading: false,
                srcObj: require('@/assets/logistics_monitor/productionLine.png'),
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
                eqColumns:[
                    {label: '设备名',field: 'eqName',},
                    {label: '光电信号',field: '光电信号',},
                    {label: '操作方式',field: '操作方式',},
                    {label: '货叉安全',field: '货叉安全',},
                    {label: '运行状态',field: '运行状态',},
                    {label: '警报信息',field: 'faultInfos',}
                    ],
                temp: {
                    eqName: undefined,
                    光电信号: undefined,
                    操作方式: undefined,
                    货叉安全: undefined,
                    运行状态: undefined,
                    faultInfos: undefined,
                },
                // nodeCode:null,
                carryType:0,
                initSelect:{
                    trayType:[],
                    matlState:[],
                    otherState_PLC:[],
                    otherState_PC:[],
                    scanState:[],
                    interfaceState:[],
                    postState:[],
                },
                //输送线
                conveyorColumns:[
                    {label: '位置编号',field: 'locNum',readonly:'true'},
                    {label: '任务号',field: 'taskNum',readonly:'true'},
                    {label: '托盘编号',field: 'trayNum',readonly:'true'},
                    {label: '托盘类型',field: 'trayType',readonly:'true'},
                    {label: '电池状态',field: 'matlState',readonly:'true'},
                    {label: '托盘数量',field: 'trayCount',readonly:'true'},
                    {label: '其它标记_PLC',field: 'otherState_PLC',readonly:'true'},
                    {label: '其它标记_PC',field: 'otherState_PC',readonly:'true'},
                    {label: '扫码状态',field: 'scanState',readonly:'true'},
                    {label: '接口状态',field: 'interfaceState',readonly:'true'},
                    {label: '来源位置',field: 'fromLocNum',readonly:'true'},
                    {label: '目标位置',field: 'toLocNum',readonly:'true'},
                    {label: '故障信息',field: 'errInfo',readonly:'true'},
                    ],
                conveyorTemp: {
                    conveyorTask:{
                        trayCount:undefined,
                        taskNum: undefined,
                        trayNum: undefined,
                        trayType: undefined,
                        matlState: undefined,
                        otherState_PLC: undefined,
                        otherState_PC: undefined,
                        scanState: undefined,
                        interfaceState: undefined,
                        tayCount: undefined,
                        fromLocNum: undefined,
                        toLocNum: undefined,
                    },
                    locNum:undefined,
                    errInfo: undefined,
                },
                //托盘信息
                trayColumns:[
                    {label: '托盘组号',field: 'containerCtrlCode',readonly:'true'},
                    {label: '叠盘序号',field: 'containerIndex',readonly:'true'},
                    {label: '托盘条码',field: 'pltCode',readonly:'true'},
                    {label: '调度号',field: 'pltCtrlCode',readonly:'true'},
                    {label: '托盘功能',field: 'pltFunc',readonly:'true',type:'select',selOption:'selSeven',selVal:'id',selLabel:'name'},
                    {label: '批次',field: 'lotNo',readonly:'true'},
                    {label: '物料类别',field: 'matlCateId',readonly:'true',type:'select',selOption:'selFive',selVal:'matlCateId',selLabel:'matlCateName'},
                    {label: '托盘类型',field: 'pltCateId',readonly:'true',type:'select',selOption:'selThree',selVal:'pltCateId',selLabel:'pltCateName'},
                    {label: '当前位置',field: 'locId',readonly:'true',type:'select',selOption:'selSix',selVal:'staId',selLabel:'staName'},
                    {label: '位置类型',field: 'locType',readonly:'true',type:'select',selOption:'selEight',selVal:'id',selLabel:'name'},
                    {label: '装载状态',field: 'pltLoadState',readonly:'true', type:'select',selOption:'selNine',selVal:'id',selLabel:'name'},
                    {label: '搬运状态',field: 'carryState',readonly:'true', type:'select',selOption:'selTen',selVal:'id',selLabel:'name'},
                    {label: '电池状态',field: 'matlState',readonly:'true', type:'select',selOption:'selEleven',selVal:'stateNum',selLabel:'stateName'},
                    {label: '扫码状态',field: 'codeState',readonly:'true', type:'select',selOption:'selTwelve',selVal:'id',selLabel:'name'},
                    {label: '接口状态',field: 'mesState',readonly:'true', type:'select',selOption:'selThirteen',selVal:'id',selLabel:'name'},
                    {label: '托盘方向',field: 'pltDirState',readonly:'true',readonly:'true', type:'select',selOption:'selFourteenth',selVal:'id',selLabel:'name'},
                    {label: '上线时间',field: 'inputTime',readonly:'true'},
                    {label: '就位时间',field: 'readyTime',readonly:'true'}, 
                    {label: '异常状态',field: 'pltErrorState',readonly:'true'},
                    {label: '电芯数量',field: 'matlCount',readonly:'true'},
                    {label: '线体',field: 'lineCode',readonly:'true'},
                    {label: '路线',field: 'routeCode',readonly:'true'},
                    {label: '等级',field: 'levelCode',readonly:'true'},
                    {label: '备注',field: 'remark',readonly:'true'},
                    ],
                trayTemp: {
                    containerCtrlCode: undefined,
                    containerIndex: undefined,
                    pltCode: undefined,
                    pltCtrlCode: undefined,
                    pltCateId: undefined,
                    pltFunc: undefined,
                    matlCateId: undefined,
                    lotNo: undefined,
                    locType: undefined,
                    locId: undefined,
                    pltLoadState: undefined,
                    carryState: undefined,
                    matlState: undefined,
                    codeState: undefined,
                    mesState: undefined,
                    pltDirState: undefined,
                    inputTime: undefined,
                    readyTime: undefined,
                    pltErrorState: undefined,
                    matlCount: undefined,
                    lineCode: undefined,
                    routeCode: undefined,
                    levelCode: undefined,
                    remark: undefined,
                },
                pltCount:6,//托盘数量
                pltIndex:1,//托盘序号
                //站台信息
                staColumns:[
                    {label: '站台编号',field: 'locCode',readonly:'true'},
                    {label: '站台名称',field: 'locName',readonly:'true'},
                    {label: '站台功能',field: 'locFunc',readonly:true,type:'select',selOption:'selOne',selVal:'id',selLabel:'name'},
                    {label: '调度号1',field: 'ctrlCode1',readonly:'true'},
                    {label: '调度号2',field: 'ctrlCode2',readonly:'true'},
                    {label: '搬运类型',field: 'carryType',readonly:'true'},
                    {label: '所属巷道',field: 'laneId',readonly:true,type:'select',selOption:'selTwo',selVal:'laneId',selLabel:'laneName'},
                    {label: '资源号',field: 'sourceCode',readonly:'true'},
                    {label: '托盘类型限定',field: 'limitPltCate',readonly:true,type:'select',selOption:'selThree',selVal:'pltCateId',selLabel:'pltCateName'},
                    {label: '最大叠盘数量',field: 'maxLayer',readonly:'true'},
                    {label: '备注',field: 'remark',readonly:'true'},
                    {label: '使用状态',field: 'useState',readonly:true,selOption:'selEight',selVal:'id',selLabel:'name'},
                    ],
                locSelOption:{selOne:[],selTwo:[],selThree:[],selFive:[],selSix:[],
                              selSeven:[],selEight:[
                                  {id:0,name:'[0]无效'},
                                  {id:1,name:'[1]有效'},
                              ],selNine:[],selTen:[],SelEleven:[],selTwelve:[],selThirteen:[],selFourteenth:[]},
                staTemp: {
                    staCode: undefined,
                    staName: undefined,
                    staFunc: undefined,
                    ctrlCode1: undefined,
                    ctrlCode2: undefined,
                    carryType: undefined,
                    laneId: undefined,
                    sourceCode: undefined,
                    limitPltCate: undefined,
                    maxLayer: undefined,
                    remark: undefined,
                    useState: undefined,
                },
                dialogFormVisible: false,
                showviewer: false,
                urlList: [],
                savedModelText: undefined,
                counter: 1, // used by addNode
                counter2: 4, // used by modifyStuff
                diagram: null,
                node: null,
                nodepropertys: {
                    key: undefined,
                    text: undefined
                },
                activeName: 'first',
                monitorArea: {},
                upArea: {},
                plcTaskData: [],  // PLC生产线任务数据，是否有任务
                plcInfoData: [],  // PLC产线信息数据
                timer: 0,
                flashTimer: 0,
                monitorNodeData: [],
                isMonitor: false,
                isAlert: false,
                trayArr: [], 
                tt: true,
                staNum:0,
                currentTaskDetailId:'',
                moveShowData:{},
                domobjData:{},
                useShow:false,
                radioSwitchData:[],
                stockerlayOrPick: '',
                pltCate:[], // 托盘类型数据
                MatlCate: [],
                locInfo:[],
                locationNum:0,
                scanCarryType:0,
                stockerRedArr: [],
                initChartParam:[],
                eqNumSel:[],
                diagramId:'',
            }
        },
        created() { 
            this.monitorArea = {
                height: `550px`,
                background: `#00a1ff2b`,
            } 
            this.upArea = {
                height: `230px`,
            } 
            // 监控计时器
            // this.monitorTimerFunc();
            this.selectOptions(); // 所有下拉框数据
        },
        mounted() {
            this.dragControllerDiv(this.$refs.resizeHandle)
            
            console.log(ipSettings.wcsIp)
            // gojs图形初始化
            this.init();
            // 调度图初始化请求
            let params = {
                        current:1,
                        pageSize:100,
                        requestData: {
                            fileType: 1
                        },  
                };
                const _data = {url:'/monitor-drawing/guest/list',params: params}
                this.$store.dispatch('fmsCommon/actionTaskPost',_data)
                .then(data => {
                    this.chartData = data.data.sort((a, b) => {
                        if(a.fileName.includes('-') || b.fileName.includes('-')){
                          if(escape(a.fileName.split('-')[1]) < escape(b.fileName.split('-')[1])){
                            return -1
                          }else{
                            return 1
                          }
                        } else{
                            return 0
                        }
                    })
                    this.chartSel = {value:data.data[0].id,label:data.data[0].fileName};  
                    this.initChartParam = this.chartSel && this.chartSel.hasOwnProperty('label') ? [parseInt(this.chartSel.label.slice(0,3))] : []
                    this.initDiagram(data.data[0].id)
                    this.diagramId = data.data[0].id;
                }).catch(err => {
                    console.error(err)
                })
            // 监控计时器
            // this.monitorTimerFunc();
            let fullscreen = ['fullscreenchange','webkitfullscreenchange','mozfullscreenchange'],
                that = this;
            fullscreen.forEach((item) => {
                window.addEventListener(item, ()=>that.fullScreenChange(),false);
            })
        },
        // 一般情况下，我们在 destroyed 中关闭即可，一旦页面中使用了keep-alive 进行缓存，此时 destroyed 会失效，
        // 需要在 deactivated 钩子函数去关闭，他是 keep-alive 特有的钩子函数。
        deactivated() {
        },
        destroyed() {
            this.isMonitor = false;
            this.isAlert = false;
            clearInterval(this.flashTimer);
            window.removeEventListener("pointerdown", this.hideCX, true);
        },
        computed: { // 计算属性
            staDisBtn:{
                get(){
                    return this.staTemp.useState ? this.$t('common.ProcessFlowList.disabled') : 
                    this.$t('common.ProcessFlowList.enable'); //站台禁用按钮 
                }
            },
            tableOneTitle:{
                get(){
                    return this.translateText('beginRoad')
                }
            },
            tableTwoTitle:{
                get(){
                    return  this.translateText('endRoad')
                }
            },
        },
        methods: {
            dragControllerDiv: function(resizeHandle) {
            //   resizeBox.style.height = this.resizeConf.height + 'px'
              // 鼠标按下事件
              resizeHandle.onmousedown = e => {
                // const resizeHeight = resizeBox.offsetHeight
                // const startY = e.clientY// 水平坐标
                // // 鼠标拖动事件
                document.onmousemove = ev => {
                  const moveY = ev.clientY
                //   const moveLen = resizeHeight + (moveY - startY)
                  this.monitorArea.height= `${ev.clientY-140}px`
                  this.upArea.height= `${1050-ev.clientY-140}px`
                //   console.log(this.upArea.height)
                //   if (this.resizeConf.heightRange[0] <= moveLen && this.resizeConf.heightRange[1] >= moveLen) {
                //     resizeBox.style.height = moveLen + 'px'
                //   }
                }
                // 鼠标松开事件
                document.onmouseup = function() {
                  document.onmousemove = null
                  document.onmouseup = null
                }
              }
            },
            // GOJS画板全屏
            fullScreen() {
                let diagramSpan = this.$refs.myDiagramSpan;
                // diagramDiv.style.background = `rgba(212, 239, 255, 1)`;
                this.monitorArea = {
                        height: `${window.screen.height}px`,
                        background: `rgba(212, 239, 255, 1)`,
                    }
                this.getFullScreen(diagramSpan);
            },
            getFullScreen(el) {
                el = el || document.documentElement;
                let rfs = 
                    el.requestFullScreen ||
                    el.webkitRequestFullScreen ||
                    el.mozRequestFullScreen ||
                    el.msRequestFullScreen,
                    wscript;
                if (typeof rfs != "undefined" && rfs) {
                    rfs.call(el);
                    return;
                }
                if (typeof window.ActiveXObject != "undefined") {
                    wscript = new ActiveXObject("WScript.Shell");
                    // if (wscript) {
                    // wscript.SendKeys("{F11}");
                    // }
                }
            },
            exitFullScreen(el) {
                el = el || document.documentElement;
                let cfs =
                    el.cancelFullScreen ||
                    el.webkitCancelFullScreen ||
                    el.mozCancelFullScreen ||
                    el.exitFullScreen,
                    wscript;
                if (typeof cfs != "undefined" && cfs) {
                    cfs.call(el);
                    return;
                }
                if (typeof window.ActiveXObject != "undefined") {
                    wscript = new ActiveXObject("WScript.Shell");
                    // if (wscript != null) {
                    //     wscript.SendKeys("{F11}");
                    // }
                }
            },
            fullScreenChange() { //监听进入或退出全屏
                let diagramSpan = this.$refs.myDiagramSpan;
                if (document.fullscreenElement) {  // 进入全屏
                        this.getFullScreen(diagramSpan);
                } else {   // 退出全屏
                    this.monitorArea = {
                            height: `${window.innerHeight-150}px`,
                            background: `rgba(212, 239, 255, 1)`,
                        }
                    this.exitFullScreen(diagramSpan);
                } 
            },
            getClearTipText(locCode){
                if(this.$store.state.app.language=='en')
                    return 'Are you sure to clear PLC data at '+locCode+' ?';
                    return '确定要清除'+locCode+'站台上的PLC的数据吗?'; 
            },

            ediTable(){
                this.$refs.ediTable.modalOpen();
            },
            chartChange(val) {
                // 如果没监控选择视图后不能直接监控
                if (this.isMonitor) {
                    this.monitorBtn()
                }
                // 根据视图变更监控请求参数
                let {value,label} = val;
                this.initDiagram(value);
                this.diagramId = value;
            },
            translateText(type){
                return this.textI18n[type][this.$store.state.app.language];
            },
            getItem(arr,field){
                for(let item of arr){
                    if(item.field==field)
                    return item;
                }
            },
            layModalFunc() {
                this.layModalShow = false;
            },
            plClear(){
                 let params = {
                      carryType:this.domobjData.carryType,
                      locNum:String(this.domobjData.ctrlCode) ,
                    }
                    let _data = { url: '/api/Conveyor/ClearConveyorTask', params: {data:params}}
                    this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                    .then(data => {
                        this.$message({
                          message: this.$t('common.btn.clearSuccess'),
                          type: 'success'
                        });
                        this.dialogVisible_plclear = false
                    }).catch(err => {
                        console.error(err)
                    })
            },
            fromPage(pages){ // 出发路径页码
                 if(!this.staTemp.hasOwnProperty('locId')) {
                    this.contextTableOne = [];
                    this.total = 0; 
                    return
                 }
                 let {limit,page} = pages;
                 let pa1 = {
                    pageSize: limit,
                    current: page,
                    requestData: {
                            fromLocId: this.staTemp.locId,
                        },
                 };
                 let _data = { url: '/api/Job/GetCarryRoad', params: pa1}
                 this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                        .then(data => {
                            let carryTypeData = this.selColumns['selOne'],newData = data.data,
                                tt = this.pltCate,Matl = this.MatlCate,locData = this.locInfo;
                            let tbData = newData.map(item => {
                                    carryTypeData.forEach(ca=> {
                                        if (parseInt(item.carryType) === parseInt(ca.id)) {
                                                item.carryType = ca.name        
                                        }
                                    })
                                    tt.forEach(t => {
                                        if (t.pltCateId === item.pltCateId) {
                                            item.pltCateId = t.pltCateName
                                        }
                                    })
                                    Matl.forEach(ma => {
                                        if (ma.matlCateId === item.matlCateId) {
                                            item.matlCateId = ma.matlCateName
                                        } 
                                    })
                                    locData.forEach(loc => {
                                        if (loc.locId === item.fromLocId) {
                                            item.fromLocId = loc.locName
                                        }
                                         if (loc.locId === item.toLocId) {
                                            item.toLocId = loc.locName
                                        }
                                    })
                                    return item;
                                })
                            this.contextTableOne = tbData;
                        }).catch(err => {
                            console.error(err)
                        })
            },
            toPage(pages){  // 到达路径页码
                if(!this.staTemp.hasOwnProperty('locId')) {
                    this.contextTableTwo = [];
                    this.toTotal = 0; 
                    return
                 }
                 let {limit,page} = pages;
                 let pa2 = {
                    pageSize: limit,
                    current: page,
                    requestData: {
                            toLocId: this.staTemp.locId,
                        },
                 };
                 let _data = { url: '/api/Job/GetCarryRoad', params: pa2}
                        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                        .then(data => {
                            let carryTypeData = this.selColumns['selOne'],newData = data.data,
                                tt = this.pltCate,Matl = this.MatlCate,locData = this.locInfo;
                            let tbData = newData.map(item => {
                                    carryTypeData.forEach(ca=> {
                                        if (parseInt(item.carryType) === parseInt(ca.id)) {
                                                item.carryType = ca.name        
                                        }
                                    })
                                    tt.forEach(t => {
                                        if (t.pltCateId === item.pltCateId) {
                                            item.pltCateId = t.pltCateName
                                        }
                                    })
                                    Matl.forEach(ma => {
                                        if (ma.matlCateId === item.matlCateId) {
                                            item.matlCateId = ma.matlCateName
                                        } 
                                    })
                                    locData.forEach(loc => {
                                         if (loc.locId === item.fromLocId) {
                                            item.fromLocId = loc.locName
                                        }
                                         if (loc.locId === item.toLocId) {
                                            item.toLocId = loc.locName
                                        }
                                    })
                                    return item;
                                })
                            this.contextTableTwo = tbData;
                        }).catch(err => {
                            console.error(err)
                        })
            },
            // 传输线是否禁用接口api/Conveyor/GetLocInfoByLocNum
            isUse(){
                let params = {
                     carryType: Number(this.carryType),
                     locNum: this.staNum,
                     useState: this.staTemp.useState ? 0 : 1
                };
                const _data = {url:'/api/Conveyor/CheckStaUseState',params: {data: params}}
                    this.$store.dispatch('fmsCommon/actionWcsPost',_data)
                            .then(data => {
                                this.staInfo(this.staNum)
                            }).catch(err => {console.error(err) })
            },
            // 堆垛机按钮API
            getApi(url, params,name) {
               const _data = {url:url,params: {data: params}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                        .then(data => {
                            this.$message({
                                    type: 'success',
                                    message: name+this.$t('const.result.success')
                                });
                        }).catch(err => {
                            console.error(err)
                        }) 
            },
            stockerEqInfo(carryType) {
                 // 堆垛机设备信息
                    let _data = { url: '/api/Stocker/GetStockerTask', params: {data: carryType}}
                    this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                        .then(data => {
                            let useData = { url: '/api/Stocker/GetStockerAutoState', params: {data: carryType}}
                            this.$store.dispatch('fmsCommon/actionWcsPost', useData)
                                .then(datas => {
                                    this.useShow = datas;
                                    this.btnNum = !this.useShow;
                                    let backShowData = {
                                            ...data.stockerInfo,
                                            carryType:data.stockerTask.carryType,
                                            autoTask: datas ? this.$t('common.ProcessFlowList.enable') :  this.$t('common.ProcessFlowList.disabled')
                                        }
                            this.infoObj.modalTemp = backShowData;
                                }).catch(err => {
                                    console.error(err)
                                })
                    }).catch(err => {
                        console.error(err)
                    })
            },
            // 堆垛机按钮点击
            btnClick(item) {
                let btn_name = item.label;
                switch(btn_name) {
                    case '急停':
                        this.stockBtnTitle = btn_name;
                        this.$refs.stockBtnInfoWindow.modalOnpen();
                        // this.$confirm(this.$t('const.sureToDo')+this.commonI18n(item)+' ?', this.$t('common.tip_info.tips'), {
                        //     confirmButtonText: this.$t('common.btn.ok'),
                        //     cancelButtonText: this.$t('common.btn.cancel'),
                        //     type: 'warning'
                        //     }).then(() => {
                        //         this.getApi('/api/Stocker/StopStocker',this.carryType,btn_name)
                        //     }).catch(() => {
                        //         this.$message({
                        //             type: 'info',
                        //             message: this.$t('common.btn.Cancelled')
                        //         });          
                        //     });

                        break;
                    case '复位':
                        this.stockBtnTitle = btn_name;
                        this.$refs.stockBtnInfoWindow.modalOnpen();
                        //   this.$confirm(this.$t('const.sureToDo')+this.commonI18n(item)+' ?', this.$t('common.tip_info.tips'), {
                        //         confirmButtonText: this.$t('common.btn.ok'),
                        //         cancelButtonText: this.$t('common.btn.cancel'),
                        //         type: "warning",
                        //     }).then(() => {
                        //         this.getApi('/api/Stocker/ResetStocker',this.carryType,btn_name)
                        //     });  
                        break;
                    case '取消':
                        this.stockBtnTitle = btn_name;
                        this.$refs.stockBtnInfoWindow.modalOnpen();
                        // this.$confirm(this.$t('const.sureToDo')+this.commonI18n(item)+' ?', this.$t('common.tip_info.tips'), {
                        //         confirmButtonText: this.$t('common.btn.ok'),
                        //         cancelButtonText: this.$t('common.btn.cancel'),
                        //         type: "warning",
                        //     }).then(() => {
                        //         this.getApi('/api/Stocker/CancelStocker',this.carryType,btn_name)
                        //     }).catch(() => {
                        //         this.$message({
                        //             type: 'info',
                        //             message: this.$t('common.btn.Cancelled')
                        //         });          
                        //     });
                        
                        break;
                    case '召回':
                        this.stockBtnTitle = btn_name;
                        this.$refs.stockBtnInfoWindow.modalOnpen();
                        // this.$confirm(this.$t('const.sureToDo')+this.commonI18n(item)+' ?', this.$t('common.tip_info.tips'), {
                        //         confirmButtonText: this.$t('common.btn.ok'),
                        //         cancelButtonText: this.$t('common.btn.cancel'),
                        //         type: "warning",
                        //     }).then(() => {
                        //     this.getApi('/api/Stocker/BackStocker',this.carryType,btn_name)
                        //      }).catch(() => {
                        //         this.$message({
                        //             type: 'info',
                        //             message:  this.$t('common.btn.Cancelled')
                        //         });          
                        //     });
                        break;
                    case '行走':
                        this.layPickTitle = `[${this.carryType}]`+this.commonI18n(item);
                        this.$refs.layPickWindow.modalOpen();
                        this.stockerlayOrPick = 'run';
                        this.layModalShow = true;
                        break;
                    case '取货':
                        this.$refs.layPickWindow.modalOpen();
                        this.layPickTitle = `[${this.carryType}]`+this.commonI18n(item);
                        this.stockerlayOrPick = 'pick';
                        this.layModalShow = true;
                        break;
                    case '放货':
                        this.$refs.layPickWindow.modalOpen();
                        this.layPickTitle = `[${this.carryType}]`+this.commonI18n(item);
                        this.stockerlayOrPick = 'lay';
                        this.layModalShow = true;
                        break;
                    default:
                        break;
                } 
                if (Array.isArray(item)) {
                    let btn_text = this.btn_all[7][Number(this.btnNum)].label;
                    this.stockBtnTitle = btn_text;
                    this.$refs.stockBtnInfoWindow.modalOnpen();
                    // this.$confirm(this.$t('const.sureToDo')+btn_text+' ?', this.$t('common.tip_info.tips'), {
                    //             confirmButtonText: this.$t('common.btn.ok'),
                    //             cancelButtonText: this.$t('common.btn.cancel'),
                    //             type: "warning",
                    // }).then(() => {
                    //     EnableStocker({data: this.carryType}).then(res => {
                    //                     if (res.data.code === 200) {
                    //                         this.$notify({
                    //                             title: this.$t('common.btn.operateSuccess'),
                    //                             message: btn_text+ this.$t('const.result.success'),
                    //                             type: "success",
                    //                             duration: 1000,
                    //                         });
                    //                         this.stockerEqInfo(this.carryType);
                    //                     }
                    //                 }).catch(err => {
                    //                     console.error(err)
                    //             })
                    // });   
                }
            },
            // 关闭产线信息弹窗
            closeDialog(){
                this.isDisabled = true;
                this.btnVisible = false;
            },
            // 渲染物流图
            initDiagram(id) {
                        this.loading = true;
                        let params = { data: id };
                        const _data = {url:'/monitor-drawing/guest/get-script',params: params}
                        this.$store.dispatch('fmsCommon/actionTaskPost',_data)
                        .then(data => {
                                this.diagram.model = go.Model.fromJson(data);
		                        this.monitorNodeData = JSON.parse(data).nodeDataArray;
                                let newMonitor = this.monitorNodeData.map(item => {
                                    item = item.carryType
                                    return item
                                })
                                let conveyorNum = this.monitorNodeData.filter(node => node.eqType === '输送线' || node.eqType === '圆盘'|| node.eqType === 'OCV' 
                                     || node.eqType === 'DCIR'|| node.eqType === '拔钉机'|| node.eqType === '预充电柜' || node.eqType === '盐水箱');
                                this.eqNumSel = conveyorNum.map(item => {
                                    item = item.ctrlCode  
                                    return item
                                });
                                // 筛选出相同的数据,new Set方法无法对元素是对象的数组去重
                                let filterEqNum = [...new Set(this.eqNumSel)];
                                let newEqNum = filterEqNum.map(f => {
                                    f = {staCode:f, staName:f}
                                    return f;
                                });
                                 this.selColumns.selTwo = newEqNum;
                                if ((newMonitor.includes(101) && newMonitor.includes(102) && newMonitor.includes(103)) || 
                                (newMonitor.includes(101) && newMonitor.includes(102)) || (newMonitor.includes(102) && newMonitor.includes(103)) 
                                || (newMonitor.includes(101) && newMonitor.includes(103))) {
                                    this.initChartParam = [];
                                    this.isInputDisAbled = false;
                                } else if (newMonitor.includes(101) && !newMonitor.includes(102) && !newMonitor.includes(103)) {
                                     this.initChartParam = [101];
                                     this.isInputDisAbled = true;
                                } else if (!newMonitor.includes(101) && newMonitor.includes(102) && !newMonitor.includes(103)) {
                                     this.initChartParam = [102];
                                     this.isInputDisAbled = true;
                                } else if (!newMonitor.includes(101) && !newMonitor.includes(102) && newMonitor.includes(103)) {
                                     this.initChartParam = [103];
                                     this.isInputDisAbled = true;
                                }
                                this.loading = false;
                            }).catch(err => {
                                console.error(err)
                            })
            },
            // tabs标签切换事件
            handleClick(tabName,e) {
                if(tabName.name === 'first'){}
            },
            // 堆垛机tab切换事件
            stockerHandleClick(val) {
                if (val === 'second') {

                }
            },
            // radio更改事件
            radioChange(val,i) {
                // console.log(this.radioSwitchData[i],this.pltIndex)
                this.trayTemp = this.radioSwitchData[i];
            },
            //获取输送线数据方法
            getConveyorTask(carryType,locNum,plclotNum){
                // 设备信息
                let _data = { url: '/api/Conveyor/GetConveyorTask', params: {data:{carryType:carryType,locNum:locNum}}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.conveyorTemp = data;
                    this.moveShowData = {
                        staCode:data.conveyorTask.locNum ? data.conveyorTask.locNum.toString() : '',
                        carryType:Number(data.conveyorTask.carryType)
                    }
                        console.log(this.conveyorTemp)

                     // 托盘信息
                if (this.conveyorTemp.conveyorTask.trayNum != null &&this.conveyorTemp.conveyorTask.trayNum!=0) {
                    _data = { url: '/api/Conveyor/GetPltByTrayNum', params: {data:this.conveyorTemp.conveyorTask.trayNum}}
                    this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                    .then(data => {
                        // console.log(data)

                        this.radioSwitchData = data;
                        this.trayTemp = data[this.pltIndex-1];
                    }).catch(err => {
                        this.radioSwitchData = [];
                        this.trayTemp = {};
                    })
                     
                } else {
                    this.radioSwitchData = [];
                    this.trayTemp = {};
                }
                }).catch(err => {
                    console.error(err)
                })

               
                
                // 站台信息
                this.staInfo(locNum)
            },
            staInfo(locNum) {
                let _data = { url: '/api/Conveyor/GetLocInfoByLocNum', params: {data:locNum}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    if (data) {
                        let addInfo = this.selFilter.filter(item => item.carryType === this.carryType && item.staNum === this.staCode);
                        this.staTemp ={...addInfo[0],...data};  
                    } else {
                        this.staTemp = {};
                    }
                    
                }).catch(err => {
                    this.staTemp = {};
                })
            },
            //获取托盘信息方法
            //获取站台信息方法
            //获取下拉数据源
            selectOptions(){
                // 获取托盘类型限定
                let _data = { url: '/api/Cache/PltCate', params: {}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.pltCate = data;
                    this.initSelect.trayType = data.map(c => {
                        return {
                            label: c.pltCateName,
                            value: parseInt(c.ctrlCode)
                        }
                    })
                    this.locSelOption.selThree = data;
                }).catch(err => {
                    console.error(err)
                }),
                // 托盘功能
                _data = { url: '/api/Const/PltFunc', params: {}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.locSelOption.selSeven = data;
                }).catch(err => {
                    console.error(err)
                }),
                //获取电池状态
                _data = { url: '/api/Cache/MatlState', params: {}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.initSelect.matlState = data.map(c => {
                        return {
                            label: "["+c.stateNum+"]"+ c.stateName,
                            value: c.stateNum
                        }
                    })
                    this.locSelOption.selEleven = data; // 托盘tab下拉数据
                }).catch(err => {
                    console.error(err)
                }),
                //获取扫码状态
                _data = { url: '/api/Const/CodeState', params: {}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.initSelect.scanState = data.map(c => {
                        return {
                            label: c.name,
                            value: c.id
                        }
                    })
                    this.locSelOption.selTwelve = data;
                }).catch(err => {
                    console.error(err)
                }),
                //获取托盘方向
                _data = { url: '/api/Const/DirState', params: {}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.locSelOption.selFourteenth = data;
                }).catch(err => {
                    console.error(err)
                }),
                //获取其它状态plc
                _data = { url: '/api/Const/OtherStatePlc', params: {}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.initSelect.otherState_PLC = data.map(c => {
                        return {
                            label: c.name,
                            value: c.id
                        }
                    });
                }).catch(err => {
                    console.error(err)
                }),
                //获取状态pc
                _data = { url: '/api/Const/OtherStatePc', params: {}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.initSelect.otherState_PC = data.map(c => {
                        return {
                            label: c.name,
                            value: c.id
                        }
                    })
                }).catch(err => {
                    console.error(err)
                }),
                //下达状态
                _data = { url: '/api/Const/TaskPostState', params: {}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.initSelect.postState = data.map(c => {
                        return {
                            label: c.name,
                            value: c.id
                        }
                    })
                }).catch(err => {
                    console.error(err)
                }),
                // 站台功能数据
                _data = { url: '/api/Const/LocFunc', params: {}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.locSelOption.selOne = data
                }).catch(err => {
                    console.error(err)
                }),
                _data = { url: '/api/Cache/LaneInfo', params: {}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.locSelOption.selTwo = data
                }).catch(err => {
                    console.error(err)
                }),
                //获取接口状态
                _data = { url: '/api/Const/MesState', params: {}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.initSelect.interfaceState = data.map(c => {
                        return {
                            label: c.name,
                            value: c.id
                        }
                    })
                    this.locSelOption.selThirteen = data
                }).catch(err => {
                    console.error(err)
                })
                // 信息移动和堆垛机任务信息下拉数据
                let areaData = { url: '/api/Const/CarryType', params: {}}
                this.$store.dispatch('fmsCommon/actionWcsPost', areaData)
                .then(data => {
                    this.stockerSel['selSix'] = data;
                    this.selColumns['selOne'] = data;
                }).catch(err => {
                    console.error(err)
                })
                let eqNumData = { url: '/api/Cache/staInfo', params: {}}
                this.$store.dispatch('fmsCommon/actionWcsPost', eqNumData)
                .then(data => {   // 移动弹窗设备号
                    this.selColumns['selTwo'] = data;
                    this.selFilter = data;
                    this.locSelOption.selSix = data;
                }).catch(err => {
                    console.error(err)
                })
                // 执行阶段数据
                _data = { url: '/api/Const/StockerExecState', params: {}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.stockerSel.selOne = data;
                }).catch(err => {
                    console.error(err)
                })
                // 操作方式数据
                _data = { url: '/api/Const/StockerMode', params: {}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.stockerSel.selTwo = data;
                }).catch(err => {
                    console.error(err)
                })
                // 设备状态数据
                _data = { url: '/api/Const/StockerState', params: {}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.stockerSel.selThree = data;
                }).catch(err => {
                    console.error(err)
                })
                // 货叉状态数据
                _data = { url: '/api/Const/StockerForkState', params: {}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.stockerSel.selFour = data;
                }).catch(err => {
                    console.error(err)
                })
                // 位置类型数据
                _data = { url: '/api/Cache/locTypes', params: {}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.stockerSel.selFive = data;
                    // this.locSelOption.selEight = data;
                }).catch(err => {
                    console.error(err)
                })
                // 装载数据
                _data = { url: '/api/Cache/pltLoadStates', params: {}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.locSelOption.selNine = data; //托盘tab下拉数据
                }).catch(err => {
                    console.error(err)
                })
                // 搬运类型数据
                _data = { url: '/api/Cache/pltCarryState', params: {}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.locSelOption.selTen = data; //托盘tab下拉数据
                }).catch(err => {
                    console.error(err)
                })
                // 货叉类型
                _data = {url:'/api/Const/StockerTaskUseFork',params: {}}
                this.$store.dispatch('fmsCommon/actionWcsPost',_data)
                    .then(data => {
                        this.stockerSel.selSeven = data;
                    }).catch(err => {
                        console.error(err)
                    })
                // 电芯类型
                _data = {url:'/api/Cache/MatlCate',params: {}}
                this.$store.dispatch('fmsCommon/actionWcsPost',_data)
                    .then(data => {
                        this.MatlCate = data;
                        this.locSelOption.selFive = data;
                    }).catch(err => {
                        console.error(err)
                    })
                _data = {url:'/api/Cache/LocInfo',params: {}}
                this.$store.dispatch('fmsCommon/actionWcsPost',_data)
                    .then(data => {
                        this.locInfo = data;
                    }).catch(err => {
                        console.error(err)
                    })
                // 命令方式
                // _data = {url:'/api/Const/StockerCmdMode',params: {}}
                // this.$store.dispatch('fmsCommon/actionWcsPost',_data)
                //     .then(data => {
                //         this.stockerSel.selEight = data;
                //     }).catch(err => {
                //         console.error(err)
                //     })
                
            },
            //按钮点击事件
            //清除PLC
            clearPlc(){
                var task = this.conveyorTemp.conveyorTask;
                this.$confirm(this.getClearTipText(this.conveyorTemp.locNum), i18n.t('common.tip_info.tips'), {
                confirmButtonText: i18n.t('common.btn.ok'),
                cancelButtonText: i18n.t('common.btn.cancel'),
                type: 'warning'
                }).then(() => {
                        const _data = { url: '/api/Conveyor/ClearConveyorTask', params: { data: {carryType:task.carryType,locNum:this.conveyorTemp.locNum} }}
                        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                        .then(data => {
                            this.$message({
                            type: 'success',
                            message: this.$t('common.btn.clearSuccess')
                            })
                            this.dialogVisible_plclear = false;
                        }).catch(err => {
                            console.error(err)
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('common.btn.Cancelled')
                    })
                })
            },
            //修改PLC
            writePlc(){
                this.activeName = 'first';
                this.btnVisible = true;
                this.isDisabled = false;
            },
            //确认写入PLC
            submitWritePlc(){
                let params = {
                    data:{...this.conveyorTemp.conveyorTask, locNum:Number(this.conveyorTemp.locNum)}
                };
                this.$confirm(i18n.t('common.tip_info.common_info'), i18n.t('common.tip_info.tips'), {
                    confirmButtonText: i18n.t('common.btn.ok'),
                    cancelButtonText: i18n.t('common.btn.cancel'),
                    type: 'warning'
                }).then(() => {
                        const _data = { url: '/api/Conveyor/WriteConveyorTask', params: params}
                        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                        .then(data => {
                            this.$message({
                            type: 'success',
                            message: i18n.t('common.tip_info.success_update_info')
                            })
                            this.dialogFormVisible = false;
                        }).catch(err => {
                            console.error(err)
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('common.btn.Cancelled')
                    })
                })   
            },
            //转移PLC（信息移动到弹窗）
            movePlc(){
                this.moveObj['modalTemp'] = this.moveShowData;
                this.$refs.infoMoveWindow.modalOpen();
                this.infoMoveTitle = this.translateText('moveTo');
            },
            // 信息移动弹窗onfinish
            moveOnFinish(moveInfo) {
               let param = {data: {
                    fromCarryType: Number(this.carryType),
                    fromLocNum: Number(this.staNum),
                    toCarryType: Number(moveInfo.carryType),
                    toLocNum: Number(moveInfo.staCode)
               }};
               let eqNumData = { url: '/api/Conveyor/MoveConveyorTask', params: param }
               this.$store.dispatch('fmsCommon/actionWcsPost', eqNumData)
                .then(data => {
                    this.$message({
                            type: 'success',
                            message: i18n.t('success_update_info')
                    })
                }).catch(err => {
                    console.error(err)
                })
            },
            // 信息移动弹窗根据区域筛选设备号
            selFunc(val,type){
                // if (type === 'selOne') {
                //   let newEq = this.selFilter.filter(item => item.carryType === val)
                //   this.selColumns.selTwo = newEq;
                // }
            },
            //取消写入PLC
            cancelWritePlc(){
                let _data = { url: '/api/Conveyor/GetConveyorTask', params: {data:{carryType:this.carryType,locNum:this.staNum}}}
                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                .then(data => {
                    this.conveyorTemp = data;
                }).catch(err => {
                    console.error(err)
                })
                this.isDisabled = true;
                this.btnVisible = false; 
            },

            // 监控定时器
            // monitorTimerFunc() {
            //      this.flashTimer = setInterval(()=> {
            //         if (this.isMonitor) {
            //             timeDelay += 500;
            //             if (timeDelay >= 5000) {
            //                 redArr = [];
            //                 this.trayArr = [];
            //                 this.stockerRedArr = [];
            //                 this.plcTask();
            //                 timeDelay = 0;
            //             }
            //         if (this.isAlert) {
            //                 redArr.forEach(item => {
            //                     this.flash(item)
            //                     }) 
            //                 this.stockerRedArr.forEach(item => { 
            //                     this.flash(item)
            //                 })
            //                 }   
                        
            //         } else {
            //             clearInterval(this.flashTimer)
            //         }
            //     },500)
            // },
            // gojs初始化
            init() {
                var _this = this;
                let myDiagram =
                    Make(go.Diagram, this.$refs.myDiagramDiv,
                        {
                            initialScale: 1.3,  //拖入画板后形成的图形初始化大小是原来的1.5倍
                            "commandHandler.defaultScale": 1.3,
                            // 'initialAutoScale': go.Diagram.Uniform,  // 全部节点展示
                            allowLink: false, 
                            // draggingTool: new SnappingTool(),   // 使用自定义的DraggingTool代替下面定义的标准工具
                            minScale:0.1,
                            maxScale:5,
                            "animationManager.isEnabled":false,
                            "toolManager.hoverDelay":200,
                            isReadOnly:true,   //只读
                            "undoManager.isEnabled": false  //isEnabled属性设置为true，以便UndoManager记录更改并让用户执行撤消或重做操作
                        });
                myDiagram.grid.visible = false;  //是否增加网格背景
                myDiagram.toolManager.panningTool.isEnabled = false
                // 图形改变后触发的方法
                myDiagram.addDiagramListener("Modified", e => { });

                // 定义一种通用类型的节点
                myDiagram.nodeTemplateMap.add("Comment",
                    Make(go.Node,
                        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                        Make(go.TextBlock,
                            { stroke: "brown", font: "9pt sans-serif" },
                            new go.Binding("text"))
                    ));

                //定义通用的“产线”节点
                // Shape从绑定数据中的几何路径字符串获取Geometry
                //此节点还从绑定数据中的端口数据数组中获取所有端口
                myDiagram.nodeTemplate =
                    Make(go.Node, "Spot",
                        {
                            locationObjectName: "SHAPE",
                            locationSpot: go.Spot.Center,
                            // selectionAdorned: false,  // 在Shape.stroke上使用Binding来显示选择
                            cursor: "pointer",
                            // contextClick: function(){},  // 鼠标右击事件
                            contextMenu: Make(go.HTMLInfo, {
                                show: showContextMenu,
                                hide: hideContextMenu,
                            }),
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
                        new go.Binding("zOrder"),
                        // 将选定的零件移至“画板”图层，因此不会被任何未选定的零件遮盖
                        new go.Binding("layerName", "isSelected", function (s) { return s ? "Foreground" : ""; }).ofObject(),
                        {
                            doubleClick: function (e, node) {// 双击事件
                                handlerDC(e, node);//双击执行的方法
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
                                    strokeDashArray: null,
                                    stroke: "gray"
                                },
                                new go.Binding('strokeDashArray','dashLine'),
                                new go.Binding("fill", "color"),  // 数据绑定（'属性名'，'属性值'）
                                // shape形状由geometryString定义
                                new go.Binding("geometryString", "geo"),
                                 // 点击图形会使节点外边框变成蓝色
                                // new go.Binding("stroke", "isSelected", 
                                //  (
                                //      s,node)=> s ? "dodgerblue" : (node.part.data.eqType && node.part.data.eqType === "区域框" ? 'transparent' : "#999")
                                //  ).ofObject(),
                                new go.Binding("stroke", "st").makeTwoWay(),
                                new go.Binding("width", "width").makeTwoWay(),
                                new go.Binding("height", "height").makeTwoWay(),
                            ), //shape块
                            Make(go.TextBlock,
                                {
                                    font: "Bold 6px Lato, sans-serif",
                                    editable: true,
                                    textAlign: "center",
                                    maxSize: new go.Size(100, NaN),
                                    isMultiline: false,  //是否能多行
                                    maxLines:3, //最多三行
                                },
                                new go.Binding("text", "text").makeTwoWay(),
                                new go.Binding("overflow","",function(s){return (s.lot1 && s.lot2 && s.lot3 && s.lot4) ? go.TextBlock.OverflowEllipsis : go.TextBlock.OverflowClip;}),
                                new go.Binding("maxLines","",function(s){return (s.lot1 && s.lot2 && s.lot3 && s.lot4) ? 1: "";}),
                                new go.Binding("width","",function(s){return (s.lot1 && s.lot2 && s.lot3 && s.lot4) ? 20: "";}),
                                new go.Binding("stroke","textColor"),
                            ),
                            Make(go.Panel,'Table',   // 面板的table布局 (注意:vue中要写在spot布局中，写在外面spot布局的块会缺失)
                                    Make(go.TextBlock, new go.Binding("text","lot1"),{font:"10pt serif",stroke:"none"},
                                    { row: 0, column: 0, margin:0,width:8,height:8},new go.Binding("background","bg1")),
                                    Make(go.TextBlock, new go.Binding("text","lot2"),{font:"10pt serif",stroke:"none"},
                                    { row: 0, column: 1, margin:0,width:8,height:8},new go.Binding("background","bg2")),
                                    Make(go.TextBlock,new go.Binding("text","lot3"),{font:"10pt serif",stroke:"none"},
                                    { row: 1, column: 0, margin:0,width:8,height:8},new go.Binding("background","bg3")),
                                    Make(go.TextBlock, new go.Binding("text","lot4"),{font:"10pt serif",stroke:"none"},
                                    { row: 1, column: 1, margin:0,width:8,height:8},new go.Binding("background","bg4"))
                            ),
                        ),

                    ); // node 括号属性

                    /*------------ 组节点属性 -------------*/
                	myDiagram.groupTemplate =
                            Make(go.Group, "Vertical",
                            {
                               layerName: "Background",
                               resizeObjectName: "GroupShape",
                               locationSpot: new go.Spot(0,0.25,0,0), 
                            },
                            new go.Binding("position", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                            new go.Binding("desiredSize", "groupSize", go.Size.parse).makeTwoWay(go.Point.stringify),
                            Make(go.TextBlock,
                                {
                                    alignment: go.Spot.TopCenter,
                                    font: "bold 9px sans-serif",
                                    stroke:'black',
                                },
                                new go.Binding("text", "groupText").makeTwoWay(),
                                new go.Binding("stroke", "groupTextColor").makeTwoWay(),
                                ),
                            Make(go.Shape,  
                                {
                                    name: "GroupShape",
                                    fill: 'transparent',
                                    stroke: 'transparent',
                                    minSize: new go.Size(20, 20)
                                },
                                new go.Binding("stroke", "st"),
                               )
                            );

                // function hideCX() {
                //     if (myDiagram.currentTool instanceof go.ContextMenuTool) {
                //         myDiagram.currentTool.doCancel();
                //     }
                // }
                jq(document).on('mouseout','#contextMenu',function() {
                     jq("#contextMenu").hide();
                })
                jq(document).on('mouseover','#contextMenu',function() {
                    jq("#contextMenu").show();
                })
                let cxElement = document.getElementById('contextMenu');
                             
                // 右键面板
                function showContextMenu(obj, diagram, tool) {
                    if (obj.data.eqType === '输送线' || obj.data.eqType === '堆垛机'|| obj.data.eqType === '圆盘'|| obj.data.eqType === 'OCV' 
                                     || obj.data.eqType === 'DCIR'|| obj.data.eqType === '拔钉机'|| obj.data.eqType === '预充电柜') {
                            if(obj.data.eqType === '堆垛机'){   // 右击获取站台信息
                                _this.stacker = true
                            }else if (obj.data.eqType === '输送线'){
                                _this.stacker = false
                            }
                            _this.domobjData = obj.data
                            _this.staInfo(obj.data.ctrlCode);
                        let hasMenuItem = false;
                        cxElement.style.display = 'block';
                        function maybeShowItem(ele, pred) {
                            if (pred) {
                                ele.style.display = 'block';
                                hasMenuItem = true;
                            } else {
                                ele.style.display = 'none'
                            }
                        }
                        maybeShowItem(document.getElementById('read'),true);
                        if (hasMenuItem) {
                            cxElement.classList.add('show-menu');
                            let mousePt = diagram.lastInput.viewPoint;
                            cxElement.style.left = mousePt.x - 10 + 'px';
                            cxElement.style.top = mousePt.y - 10 + 'px';
                        }
                        window.addEventListener("pointerdown", this.hideCX, true);
                   }
                }

                function hideContextMenu(obj, diagram, tool) {
                   cxElement.classList.remove('show-menu');
                   window.removeEventListener('pointerdown', this.hideCX, true);
                }
                cxElement.addEventListener("contextmenu", e => {
                        e.preventDefault();
                        return false;
                }, false);
                 

                //双击执行的方法
                function handlerDC(e, obj) {
                    _this.node = obj.part;  //拿到节点的json对象
                    let data = _this.node.data;
                    _this.temp = Object.assign({}, data) 
                    _this.temp.eqName = data.text;
                    // _this.nodeCode = data.text;
                    _this.carryType = data.carryType;
                    _this.staNum = data.ctrlCode;
                    if (_this.temp.eqType === '堆垛机' && data.color !== 'maroon') {
                        // 使用require的时候需要注意一点：require内容不能使用变量，require(变量)写法会直接导致编译报错
                        _this.srcObj = require('@/assets/logistics_monitor/stacker.jpg');
                        _this.parentLabel = {first:_this.translateText('deviceInfo'), second:_this.translateText('taskInfo')};
                        _this.rowOne = _this.translateText('command'),
                        _this.rowTwo = {first: _this.translateText('doing'), second:_this.translateText('waiting')},
                        _this.moveColumns = [
                            {key: 'carryType',label:'设备编号',disabled:true,},
                            {key: 'autoTask',label:'自动任务',disabled:true,},
                            {key: 'execTaskNum',label:'任务号',disabled:true},
                            {key: 'execState',label:'执行阶段',disabled:true,type:"select",selVal:'id',selLabel:'name',selType:'selOne'},
                            {key: 'deviceMode',label:'操作方式',disabled:true,type:"select",selVal:'id',selLabel:'name',selType:'selTwo'},
                            {key: 'deviceState',label:'设备状态',disabled:true,type:"select",selVal:'id',selLabel:'name',selType:'selThree'},
                            {key: 'fork1State',label:'货叉1',disabled:true,type:"select",selVal:'id',selLabel:'name',selType:'selFour'},
                            {key: 'fork2State',label:'货叉2',disabled:true,type:"select",selVal:'id',selLabel:'name',selType:'selFour'},
                            {key: 'row',label:'位置（排）',disabled:true,},
                            {key: 'column',label:'位置（列）',disabled:true,},
                            {key: 'layer',label:'位置（层）',disabled:true,},
                            {key: 'faultConText',label:'故障信息',disabled:true,type:"textarea",},
                        ];
                        // 堆垛机数据回显
                        _this.getStockerInfo(data.carryType,true)
                        _this.$refs.stockerWindow.modalOpen();
                        _this.infoMoveTitle = _this.$t('const.stockerInfo');
                    } else if ((_this.temp.eqType === '输送线' || _this.temp.eqType === '圆盘' 
                    || _this.temp.eqType === 'OCV'|| _this.temp.eqType === 'DCIR'|| _this.temp.eqType === '拔钉机'|| _this.temp.eqType === '预充电柜' || _this.temp.eqType === '盐水箱') && data.st !== 'red') {
                        _this.activeName = 'first';
                        console.log(data)
                        console.log(_this.temp.eqType)
                        _this.srcObj = require('@/assets/logistics_monitor/productionLine.png');
                        // 设备数据回显
                        let plclotNum = data.trayNum;
                        // 有托盘编码就展示托盘tab，反之消失
                        if (plclotNum) {
                            _this.staTab = true
                        } else {
                            _this.staTab = false
                        }

                        _this.getConveyorTask(data.carryType,data.ctrlCode,plclotNum);
                        _this.parentLabel = {first:_this.$t('const.rackInfo'), second: _this.$t('const.pltInfo')};
                        _this.dialogFormVisible = true
                        _this.$nextTick(() => {
                            _this.$refs['dataForm'].clearValidate()
                        })
                    } else if (_this.temp.eqType === '货位') {
                        _this.srcObj = require('@/assets/logistics_monitor/shelves.jpg');
                    } else if (_this.temp.eqType === '扫码器' && data.st !== 'red') {
                        _this.scanCarryType = data.carryType;
                        _this.locationNum = data.ctrlCode;
                        _this.modalScanInfo = {
                            locNum:data.ctrlCode,
                            carryType:data.carryType,
                            checkFlag:data.checkFlagNum,
                            trayNum:data.trayNum,
                            trayBarCode:data.trayBarCode,
                            };
                        // data;
                        console.log("*********")
                        console.log(data,_this.modalScanInfo)
                        console.log("*********")
                        _this.$refs.scanWindow.modalScanOpen();
                    }
                   
                }

                // 提示框信息
                function nodeInfo(data) {
                    let info = '';
                    if (data.st === 'red' || data.color === 'rgb(136, 0, 34, 0.5)' || data.color === 'maroon') {
                        info = data.text || data.carryType ? `[${ data.text || data.carryType }]`+ _this.translateText('communicationError'): _this.translateText('communicationError');
                    } else {
                        switch(data.eqType)  {
                            case '输送线' :
                            case '圆盘' :
                               info = `${ data.eqType ? _this.translateText('deviceType')+':'+ data.eqType : '' }
                                    ${ data.text ? _this.translateText('deviceCode')+':' + data.text : ''}
                                    ${ data.carryType ? _this.translateText('carryType')+':' + data.carryType : ''}
                                    ${ data.ctrlCode ? _this.translateText('ctrlCode')+':' + data.ctrlCode : ''}
                                    ${ data.rackCode ? _this.translateText('rackCode')+':' + data.rackCode : ''}
                                    ${ data.trayNum ? _this.translateText('trayNum')+':' + data.trayNum : ''}
                                    ${ data.faultInfos ? _this.translateText('faultInfos')+':'+ data.faultInfos : '' }
                                    ${ data.光电信号 ? _this.translateText('signal')+':'+ data.光电信号 : '' }
                                    ${ data.操作方式 ? _this.translateText('deviceMode')+':'+ data.操作方式 : '' }
                                    ${ data.运行状态 ? _this.translateText('deviceState')+':'+ data.运行状态 : '' }
                                    ${ data.货叉安全 ? _this.translateText('forkStatus')+':'+ data.货叉安全 : '' }
                                    ${ data.staName ?  '站台:' + data.staName : '' }
                                    `;    
                            break;
                            case '堆垛机': 
                                let newRow = data.row < 10 ? '0'+data.row : data.row;
                                let newolumn = data.column < 10 ? '00'+data.column : '0'+data.column;
                                let newLayer = data.layer < 10 ? '0'+data.layer : data.layer;
                                info = `${ data.eqType ? _this.translateText('deviceType')+':'+ data.eqType : '' }
                                    ${ data.taskAutoState ? _this.translateText('autoTask')+':'+_this.$t('common.ProcessFlowList.enable') : _this.translateText('autoTask')+':'+_this.$t('common.ProcessFlowList.disabled')}
                                    ${ data.taskNum ? _this.translateText('postTaskNum')+':' + data.taskNum : ''}
                                    ${ data.execTaskNum ?_this.translateText('execTaskNum')+':' + data.execTaskNum : ''}
                                    ${ data.deviceMode ?  _this.translateText('deviceMode')+':' + data.deviceMode : ''}
                                    ${ data.deviceState ? _this.translateText('deviceState')+':'+ data.deviceState : '' }
                                    ${ data.execState ? _this.translateText('execState')+':'+ data.execState : '' }
                                    ${ data.fork1State === 0 ? _this.translateText('fork1State')+':'+_this.translateText('empty') : data.fork1State === 1 ? _this.translateText('fork1State')+':'+_this.translateText('filled') : 
                                       data.fork1State ===  2 ? _this.translateText('fork1State')+':'+_this.translateText('forbidden') : ''}
                                    ${ data.fork2State === 0 ? _this.translateText('fork2State')+':'+_this.translateText('empty') : data.fork2State === 1 ? _this.translateText('fork2State')+':'+_this.translateText('filled') : 
                                       data.fork2State ===  2 ? _this.translateText('fork2State')+':'+_this.translateText('forbidden') : ''}
                                    ${ data.row && data.column && data.layer ? _this.translateText('location')+':'+ newRow+newolumn+newLayer
                                     : '' }
                                    ${ _this.translateText('postFlag')+':'+ (data.taskFlag ? _this.$t('const.permit.forbidden') : _this.$t('const.permit.allowed'))}
                                    `; 
                            break;
                            case '库位':
                                info = `${ data.eqType ? _this.translateText('deviceType')+':'+ data.eqType : '' }
                                    ${ data.text ? _this.translateText('rowNum')+':' + data.text : ''}
                                    `;
                                break;
                            case '扫码器':
                                info = `${ data.eqType ? _this.translateText('deviceType')+':'+ data.eqType : '' }
                                    ${ data.carryType ? _this.translateText('carryType')+':' + data.carryType : ''}
                                    ${ data.ctrlCode ? _this.translateText('ctrlCode')+':' + data.ctrlCode : ''}
                                    ${ data.checkFlag ? _this.translateText('checkFlag')+':' + data.checkFlag : ''}
                                    `;
                                    break;
                            case 'OCV':
                                info = `
                                ${ data.eqType ? _this.translateText('deviceType')+':'+ data.eqType : '' }
                                ${ data.text ? _this.translateText('deviceCode')+':'+ data.text : '' }
                                ${ data.staName ? '站台:' + data.staName : '' }
                                `;
                                break;
                            case 'DCIR':
                                info = `
                                ${ data.eqType ? _this.translateText('deviceType')+':'+ data.eqType : '' }
                                ${ data.text ? _this.translateText('deviceCode')+':'+ data.text : '' }
                                ${ data.staName ? '站台:' + data.staName : '' }
                                `;
                                break;
                            case '拔钉机':
                                info = `
                                ${ data.eqType ? _this.translateText('deviceType')+':'+ data.eqType : '' }
                                ${ data.text ? _this.translateText('deviceCode')+':'+ data.text : '' }
                                ${ data.staName ? '站台:' + data.staName : '' }
                                `;
                                break;
                            case '预充电柜':
                                info = `
                                ${ data.eqType ? _this.translateText('deviceType')+':'+ data.eqType : '' }
                                ${ data.text ? _this.translateText('deviceCode')+':'+ data.text : '' }
                                ${ data.staName ? '站台:' + data.staName : '' }
                                `;
                                break;
                            case '盐水箱':
                                info = `
                                ${ data.eqType ? _this.translateText('deviceType')+':'+ data.eqType : '' }
                                ${ data.staName ? '站台:' + data.staName : '' }
                                `;
                                break;
                            default:
                            break;
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
            }, 
            hideCX() {
                    if (this.diagram.currentTool instanceof go.ContextMenuTool) {
                        this.diagram.currentTool.doCancel();
                    }
                },
            // 开始路径表单刷新
            roadStartFresh(){
                 if (this.staTemp && this.staTemp.hasOwnProperty('locId')) {
                        let params = {
                                    pageSize: this.pageSize,
                                    current: this.current,
                                    requestData: {
                                        fromLocId: this.staTemp.locId,
                                    },
                                }
                        let _data = { url: '/api/Job/GetCarryRoad', params: params}
                        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                        .then(data => {
                            let carryTypeData = this.selColumns['selOne'],newData = data.data,
                                tt = this.pltCate,Matl = this.MatlCate,locData = this.locInfo,{interfaceState,matlState,scanState} = this.initSelect;
                            let tbData = newData.map(item => {
                                    carryTypeData.forEach(ca=> {
                                        if (parseInt(item.carryType) === parseInt(ca.id)) {
                                                item.carryType = ca.name        
                                        }
                                    })
                                    tt.forEach(t => {
                                        if (t.pltCateId === item.pltCateId) {
                                            item.pltCateId = t.pltCateName
                                        }
                                    })
                                    Matl.forEach(ma => {
                                        if (ma.matlCateId === item.matlCateId) {
                                            item.matlCateId = ma.matlCateName
                                        } 
                                    })
                                    locData.forEach(loc => {
                                        if (loc.locId === item.fromLocId) {
                                            item.fromLocId = loc.locName
                                        }
                                        if (loc.locId === item.toLocId) {
                                            item.toLocId = loc.locName
                                        }
                                    })
                                     interfaceState.forEach(ca=> {
                                        if (parseInt(item.toMesState) === parseInt(ca.value)) {
                                                item.toMesState = ca.label        
                                        }
                                        if (parseInt(item.fromMesState) === parseInt(ca.value)) {
                                                item.fromMesState = ca.label        
                                        }
                                    })
                                    matlState.forEach(ca=> {
                                        if (parseInt(item.fromMatlState) === parseInt(ca.value)) {
                                                item.fromMatlState = ca.label        
                                        }
                                        if (parseInt(item.toMatlState) === parseInt(ca.value)) {
                                                item.toMatlState = ca.label        
                                        }
                                    })
                                    scanState.forEach(ca=> {
                                        if (parseInt(item.fromCodeState) === parseInt(ca.value)) {
                                                item.fromCodeState = ca.label        
                                        }
                                    })
                                    item.useState = item.useState == 1 ? this.$t('common.ProcessFlowList.efficient') :  this.$t('common.ProcessFlowList.invalid')
                                    return item;
                                })
                            this.contextTableOne = tbData;
                        }).catch(err => {
                            console.error(err)
                        })
                                }
            },
            // 到达路径表单刷新
            roadToFresh(){
                 if (this.staTemp && this.staTemp.hasOwnProperty('locId')) {
                        let params = {
                                    pageSize: this.pageSize,
                                    current: this.current,
                                    requestData: {
                                        toLocId: this.staTemp.locId,
                                    },
                                }
                        let _data = { url: '/api/Job/GetCarryRoad', params: params}
                        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                        .then(data => {
                            let carryTypeData = this.selColumns['selOne'],newData = data.data,
                                tt = this.pltCate,Matl = this.MatlCate,locData = this.locInfo,{interfaceState,matlState,scanState} = this.initSelect;
                            let tbData = newData.map(item => {
                                    carryTypeData.forEach(ca=> {
                                        if (parseInt(item.carryType) === parseInt(ca.id)) {
                                                item.carryType = ca.name        
                                        }
                                    })
                                    tt.forEach(t => {
                                        if (t.pltCateId === item.pltCateId) {
                                            item.pltCateId = t.pltCateName
                                        }
                                    })
                                    Matl.forEach(ma => {
                                        if (ma.matlCateId === item.matlCateId) {
                                            item.matlCateId = ma.matlCateName
                                        } 
                                    })
                                    locData.forEach(loc => {
                                        if (loc.locId === item.fromLocId) {
                                            item.fromLocId = loc.locName
                                        }
                                        if (loc.locId === item.toLocId) {
                                            item.toLocId = loc.locName
                                        }
                                    })
                                     interfaceState.forEach(ca=> {
                                        if (parseInt(item.toMesState) === parseInt(ca.value)) {
                                                item.toMesState = ca.label        
                                        }
                                        if (parseInt(item.fromMesState) === parseInt(ca.value)) {
                                                item.fromMesState = ca.label        
                                        }
                                    })
                                    matlState.forEach(ca=> {
                                        if (parseInt(item.fromMatlState) === parseInt(ca.value)) {
                                                item.fromMatlState = ca.label        
                                        }
                                        if (parseInt(item.toMatlState) === parseInt(ca.value)) {
                                                item.toMatlState = ca.label        
                                        }
                                    })
                                    scanState.forEach(ca=> {
                                        if (parseInt(item.fromCodeState) === parseInt(ca.value)) {
                                                item.fromCodeState = ca.label        
                                        }
                                    })
                                    item.useState = item.useState == 1 ? this.$t('common.ProcessFlowList.efficient') :  this.$t('common.ProcessFlowList.invalid')
                                    return item;
                                })
                            this.contextTableTwo = tbData;
                        }).catch(err => {
                            console.error(err)
                        })
                                }
            },
            // 路径查看接口
            lineApi(pa1,pa2) {
                        let _data = { url: '/api/Job/GetCarryRoad', params: pa1}
                        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                        .then(data => {
                            let carryTypeData = this.selColumns['selOne'],newData = data.data,
                                tt = this.pltCate,Matl = this.MatlCate,locData = this.locInfo,{interfaceState,matlState,scanState} = this.initSelect;
                            let tbData = newData.map(item => {
                                    carryTypeData.forEach(ca=> {
                                        if (parseInt(item.carryType) === parseInt(ca.id)) {
                                                item.carryType = ca.name        
                                        }
                                    })
                                    tt.forEach(t => {
                                        if (t.pltCateId === item.pltCateId) {
                                            item.pltCateId = t.pltCateName
                                        }
                                    })
                                    Matl.forEach(ma => {
                                        if (ma.matlCateId === item.matlCateId) {
                                            item.matlCateId = ma.matlCateName
                                        } 
                                    })
                                    locData.forEach(loc => {
                                        if (loc.locId === item.fromLocId) {
                                            item.fromLocId = loc.locName
                                        }
                                        if (loc.locId === item.toLocId) {
                                            item.toLocId = loc.locName
                                        }
                                    })
                                     interfaceState.forEach(ca=> {
                                        if (parseInt(item.toMesState) === parseInt(ca.value)) {
                                                item.toMesState = ca.label        
                                        }
                                        if (parseInt(item.fromMesState) === parseInt(ca.value)) {
                                                item.fromMesState = ca.label        
                                        }
                                    })
                                    matlState.forEach(ca=> {
                                        if (parseInt(item.fromMatlState) === parseInt(ca.value)) {
                                                item.fromMatlState = ca.label        
                                        }
                                        if (parseInt(item.toMatlState) === parseInt(ca.value)) {
                                                item.toMatlState = ca.label        
                                        }
                                    })
                                    scanState.forEach(ca=> {
                                        if (parseInt(item.fromCodeState) === parseInt(ca.value)) {
                                                item.fromCodeState = ca.label        
                                        }
                                    })
                                    item.useState = item.useState == 1 ? this.$t('common.ProcessFlowList.efficient') :  this.$t('common.ProcessFlowList.invalid')
                                    return item;
                                })
                            this.contextTableOne = tbData;
                        }).catch(err => {
                            console.error(err)
                        })
                        _data = { url: '/api/Job/GetCarryRoad', params: pa2}
                        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                        .then(data => {
                            let carryTypeData = this.selColumns['selOne'],newData = data.data,
                                tt = this.pltCate,Matl = this.MatlCate,locData = this.locInfo,{interfaceState,matlState,scanState} = this.initSelect;
                            let tbData = newData.map(item => {
                                    carryTypeData.forEach(ca=> {
                                        if (parseInt(item.carryType) === parseInt(ca.id)) {
                                                item.carryType = ca.name        
                                        }
                                    })
                                    tt.forEach(t => {
                                        if (t.pltCateId === item.pltCateId) {
                                            item.pltCateId = t.pltCateName
                                        }
                                    })
                                    Matl.forEach(ma => {
                                        if (ma.matlCateId === item.matlCateId) {
                                            item.matlCateId = ma.matlCateName
                                        } 
                                    })
                                    locData.forEach(loc => {
                                         if (loc.locId === item.fromLocId) {
                                            item.fromLocId = loc.locName
                                        }
                                        if (loc.locId === item.toLocId) {
                                            item.toLocId = loc.locName
                                        }
                                    })
                                    interfaceState.forEach(ca=> {
                                        if (parseInt(item.toMesState) === parseInt(ca.value)) {
                                                item.toMesState = ca.label        
                                        }
                                        if (parseInt(item.fromMesState) === parseInt(ca.value)) {
                                                item.fromMesState = ca.label        
                                        }
                                    })
                                    matlState.forEach(ca=> {
                                        if (parseInt(item.fromMatlState) === parseInt(ca.value)) {
                                                item.fromMatlState = ca.label        
                                        }
                                        if (parseInt(item.toMatlState) === parseInt(ca.value)) {
                                                item.toMatlState = ca.label        
                                        }
                                    })
                                    scanState.forEach(ca=> {
                                        if (parseInt(item.fromCodeState) === parseInt(ca.value)) {
                                                item.fromCodeState = ca.label        
                                        }
                                    })
                                    item.useState = item.useState == 1 ? this.$t('common.ProcessFlowList.efficient') :  this.$t('common.ProcessFlowList.invalid')
                                    return item;
                                })
                            this.contextTableTwo = tbData;
                        }).catch(err => {
                            console.error(err)
                        })
            },
            // 右击面板单击事件
            cxcommand(e,val) {
                  if (val === undefined) val = e.currentTarget.id;
                  let btnTitle = e.currentTarget.innerHTML;
                  console.log("右键面板");
                  console.log(val);
                    switch (val) {
                        case "read":  // 路径查看
                            if(this.stacker){
                                this.$refs.currenTray_stacker.modalOpen(); 
                                this.contextlineTitle = btnTitle;
                            }else{
                            if (this.staTemp && this.staTemp.hasOwnProperty('locId')) {
                               
                               let params1 = {
                                    pageSize: 100,
                                    current: this.current,
                                    requestData: {
                                        fromLocId: this.staTemp.locId,
                                    },
                                }
                                let params2 = {
                                    pageSize: 100,
                                    current: this.toCurrent,
                                    requestData: {
                                        toLocId: this.staTemp.locId,
                                    },
                                }
                                this.lineApi(params1,params2); 
                                } else {
                                    this.contextTableOne = [];
                                    this.contextTableTwo = [];
                                    this.toTotal = 0;
                                }
                                this.$refs.contextViewModal.modalOpen(); 
                                this.contextlineTitle = btnTitle;
                        }
                       
                        break; 
                        case "current-lot": 
                        this.contextlineTitle = btnTitle;
                        this.$refs.currenTray.modalOpen(); 

                        break; 
                        case "task-info": 
                          if(this.stacker){
                            this.$refs.stackerMask.modalOpen(); 
                          }else{
                            this.$refs.missionInformation.modalOpen(); 
                          }
                          this.contextlineTitle = btnTitle;
                        break; 
                        case "plc-enter": 
                          this.$refs.plcSupplement.modalOpen(); 
                          this.contextlineTitle = btnTitle;
                        break; 
                        case "plc-clear": 
                        this.dialogVisible_plclear = true; 
                        break; 
                        default: 
                        break;
                    }
                    this.diagram.currentTool.stopTool();
              },
            // 节点闪烁回调
            flash(k){
                this.diagram.model.commit(function(m){
                let nodes = m.findNodeDataForKey(k); 
                if (nodes.color === "red") {
                    m.setDataProperty(nodes, "color","rgba(128, 128, 128, 0.5)");
                    } else {
                    m.setDataProperty(nodes, "color","red");
                    }    
                },"flash");
            },
            // 删除重复的报警节点
            delRedArr(key) {
                for(var i=0;i<redArr.length;i++) {
                    if (redArr[i] === key) {
                        redArr.splice(i,1)
                    }
                }
            },
            delStockerRedArr(key) {   // 删除堆垛机警报节点
                for(var i=0;i<this.stockerRedArr.length;i++) {
                    if (this.stockerRedArr[i] === key) {
                        this.stockerRedArr.splice(i,1)
                    }
                }
            },
            // 双击获取堆垛机信息
           getStockerInfo(carryType,searchApi) {
               if (searchApi) {
                    // 堆垛机设备信息
                  this.stockerEqInfo(carryType)
               }
                

                // 堆垛机任务信息
            let _data1 = { url: '/api/CarryTask/GetStockerCarryTasks', params: {data: carryType}}
               this.$store.dispatch('fmsCommon/actionWcsPost', _data1)  // 
                .then(data => {
                    if (data.length !== 0) {
                        let nowTable = data.filter(item => item.postState === 1);  // 正在搬运表
                        let waitTable = data.filter(item => item.postState === 0);  // 等待搬运表
                        this.tableOneData = nowTable;
                        this.tableTwoData = waitTable;
                        let transTb = data.map(item => {
                            this.stockerSel.selFive.forEach(sta => {
                                if(item.fromLocType === sta.id) {
                                    item.fromLocType = sta.name
                                }
                                if(item.toLocType === sta.id) {
                                    item.toLocType = sta.name
                                }
                            })
                            return item;
                        })
                        this.tableThreeData = transTb;  // 堆垛机指令表
                        let _data2 = { url: '/api/CarryTask/GetCurrentTaskDetail', params: {data:data[0].taskGroupId}}
                        this.$store.dispatch('fmsCommon/actionWcsPost', _data2)
                        .then(datas => {
                             let _data = { url: '/api/Stocker/GetStockerTask', params: {data: carryType}}
                                this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                                    .then(stackTaskData => {
                                       let NewData = datas.length !== 0 ? datas.filter(item => item.postState === 1) : [];
                                       this.currentTaskDetailId = NewData[0].id;
                                       let pltCodeArr = data.length !== 0 ? data.filter(item => item.taskId === NewData[0].taskId) : [];
                                       let pltCode = pltCodeArr.length !== 0 ? pltCodeArr[0].pltCode : '无';
                                       if (NewData.length!== 0) {
                                           NewData[0].useFork = stackTaskData.stockerTask.useFork;
                                        //    NewData[0].cmdMode = stackTaskData.stockerTask.cmdMode;
                                           switch (NewData[0].useFork) {
                                               case 1:
                                                   NewData[0].fork1State = pltCode; 
                                                   break;
                                               case 2:
                                                   NewData[0].fork2State = pltCode; 
                                                   break;
                                               default:
                                                   break;
                                           }
                                           NewData[0].isFire = NewData[0].isFire ? this.$t('const.yesNo.yes') : this.$t('const.yesNo.no');
                                           this.modalTempOne = NewData[0];
                                       }
                                       
                                    })
                            

                        }).catch(err => {
                            console.error(err)
                        })
                    } else {
                        this.tableOneData = [];
                        this.tableTwoData = [];
                        this.tableThreeData = [];  
                        this.modalTempOne = {};
                    }
                    
                }).catch(err => {
                    console.error(err)
                })
            },
            rePostFunc(){
                 this.$confirm(this.$t('const.sureToDo')+this.$t('taskOperate.postAgain')+' ?', this.$t('common.tip_info.tips'), {
                            confirmButtonText: this.$t('common.btn.ok'),
                            cancelButtonText: this.$t('common.btn.cancel'),
                        type: 'warning'
                    }).then(() => {
                        let params = {data: this.currentTaskDetailId};
                        rePost(params).then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message:this.$t('taskOperate.postAgain')+ this.$t('const.result.success')
                                });
                                this.getStockerInfo(carryType,false)
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: this.$t('common.btn.Cancelled')
                        });          
                    });
                
            },
            forceFinishFunc(){
                 this.$confirm(this.$t('const.sureToDo')+this.$t('taskOperate.completeForcibly')+' ?', this.$t('common.tip_info.tips'), {
                            confirmButtonText: this.$t('common.btn.ok'),
                            cancelButtonText: this.$t('common.btn.cancel'),
                        type: 'warning'
                    }).then(() => {
                        let params = {data: this.currentTaskDetailId};
                        forceFinish(params).then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: this.$t('taskOperate.completeForcibly')+ this.$t('const.result.success')
                                });
                                this.getStockerInfo(carryType,false)
                            }
                        })
                        
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: this.$t('common.btn.Cancelled')
                        });          
                    });
                
            },
            // PLC设备 监控请求
            plcTask() {
                // 传输线设备监控
                let conveyParams = {url: '/api/PlcData/ConveryorPlc', params: this.initChartParam}; //输送线设备信息和任务信息
                let newMonitorData = this.monitorNodeData.filter(node => node.eqType === '输送线' || node.eqType === '圆盘'|| node.eqType === 'OCV' 
                                            || node.eqType === 'DCIR'|| node.eqType === '拔钉机'|| node.eqType === '预充电柜' || node.eqType === '盐水箱');
                this.$store.dispatch('fmsCommon/actionWcsPost',conveyParams).then(data => {
                    let {task,info} = data;
                    // 用this.diagram.model.nodeDataArray =  newMonitorData  可以直接更新节点数据刷新视图
                    if (!task.length){   // task无信息所有节点通讯故障
                        this.monitorNodeData.forEach(node => {
                            if (node.ctrlCode && node.carryType) {
                                let node_all = this.diagram.model.findNodeDataForKey(node.key);
                                this.diagram.model.setDataProperty(node_all,"st","red");   
                                this.diagram.model.setDataProperty(node_all,"color","rgba(128, 128, 128, 0.5)");   
                                this.diagram.model.setDataProperty(node_all,"textColor","black");   
                            }
                        })
                    } else {
                        /*---------------------------------------------------------for START-----------------------------------------*/ 
                        for(let i = newMonitorData.length - 1;i >= 0;i--){
                            let node = newMonitorData[i];
                             if (node.eqType === '圆盘') {
                                        let nodeSet = this.diagram.model.findNodeDataForKey(node.key);
                                        this.diagram.model.setDataProperty(nodeSet,'zOrder',999)
                                     }
                            let onLine = false;
                            // 任务信息
                            for (let a = task.length - 1;a >= 0;a--) {
                                let item = task[a]
                                 if (parseInt(item.locNum) === parseInt(node.ctrlCode) && parseInt(item.carryType) === parseInt(node.carryType)) {
                                        onLine = true;
                                        let nodeSet = this.diagram.model.findNodeDataForKey(node.key);
                                        this.diagram.model.setDataProperty(nodeSet,"st","gray");
                                        if (item.trayNum) {
                                            let node_line = this.diagram.model.findNodeDataForKey(node.key);
                                            this.diagram.model.setDataProperty(node_line,"color",'rgba(0,255,0,0.5)'); // 有托盘就变绿色 
                                            this.diagram.model.setDataProperty(node_line,"trayNum",item.trayNum);
                                        } else {
                                            let node_line = this.diagram.model.findNodeDataForKey(node.key);
                                            this.diagram.model.setDataProperty(node_line,"color","rgba(128, 128, 128, 0.5)"); // 灰色
                                            this.diagram.model.setDataProperty(node_line,"st",'gray');
                                            this.diagram.model.setDataProperty(node_line,"trayNum",item.trayNum); 
                                 }
                                }
                            }
                            if (!onLine) {
                                if (node.eqType === '输送线' || node.eqType === '圆盘'|| node.eqType === 'OCV' 
                                     || node.eqType === 'DCIR'|| node.eqType === '拔钉机'|| node.eqType === '预充电柜' || node.eqType === '盐水箱') {
                                    let nodeSet = this.diagram.model.findNodeDataForKey(node.key);
                                    this.diagram.model.setDataProperty(nodeSet,"color",'rgba(128, 128, 128, 0.5)'); 
                                    this.diagram.model.setDataProperty(nodeSet,"st","red");
                                    // this.diagram.model.setDataProperty(nodeSet,"textColor","black");
                                }
                                
                            }
                            // 设备信息
                            for (let b = info.length - 1;b >= 0; b--) {
                                let item = info[b];
                                if (parseInt(item.locNum) === parseInt(node.ctrlCode) && parseInt(item.carryType) === parseInt(node.carryType)) {
                                    if (item.isFault) {
                                            // this.trayArr.push(item.trayNum)
                                            let node_line = this.diagram.model.findNodeDataForKey(node.key);
                                            if (node_line.st !== 'red') { // 如果通讯故障不用报警
                                                this.diagram.model.setDataProperty(node_line,"color","red");   // 报警先设为红色
                                                // redArr.push(node.key)  // 如果有故障: 把故障的产线节点key加到报警数组中
                                            }
                                            this.diagram.model.setDataProperty(node_line,"trayNum",false);
                                            this.diagram.model.setDataProperty(node_line,"faultInfos",item.faultInfos[0].code);
                                            this.diagram.model.setDataProperty(node_line, "操作方式", item.操作方式);
                                            this.diagram.model.setDataProperty(node_line, "光电信号", item.光电信号);
                                            this.diagram.model.setDataProperty(node_line, "运行状态", item.运行状态);
                                            this.diagram.model.setDataProperty(node_line, "货叉安全", item.货叉安全);
                                    } else {
                                            // this.delRedArr(node.key);
                                            let node_line = this.diagram.model.findNodeDataForKey(node.key);            
                                            this.diagram.model.setDataProperty(node_line,"faultInfos",'无');
                                            this.diagram.model.setDataProperty(node_line, "操作方式", item.操作方式);
                                            this.diagram.model.setDataProperty(node_line, "光电信号", item.光电信号);
                                            this.diagram.model.setDataProperty(node_line, "运行状态", item.运行状态);
                                            this.diagram.model.setDataProperty(node_line, "货叉安全", item.货叉安全);
                                    }
                                }
                            }

                        }
                   
                         // 站台信息监控，如果是站台节点文本是蓝色
                        let eqNumData = { url: '/api/Cache/staInfo', params: {}}
                        this.$store.dispatch('fmsCommon/actionWcsPost', eqNumData)
                        .then(data => {   // 移动站台设备号
                            for(let i = newMonitorData.length - 1;i >= 0;i--) {
                                let isSta = false;
                                let node = newMonitorData[i];
                                for(let da = data.length - 1;da >= 0; da--) {
                                    let sta = data[da];
                                    if (parseInt(node.ctrlCode) === parseInt(sta.staCode)) {
                                            isSta = true
                                            let nodeAttr = this.diagram.model.findNodeDataForKey(node.key);
                                            this.diagram.model.setDataProperty(nodeAttr,"textColor","blue"); 
                                            this.diagram.model.setDataProperty(nodeAttr,"staName",sta.staName); 
                                        }
                                }
                                if (!isSta) {
                                            let nodeAttr = this.diagram.model.findNodeDataForKey(node.key);
                                            this.diagram.model.setDataProperty(nodeAttr,"textColor","#000"); 
                                            this.diagram.model.setDataProperty(nodeAttr,"staName",false); 
                                    } 
                            }

                        }).catch(err => {
                            // console.error(err)
                        })
                        eqNumData = null;
                        //  this.isAlert = true;
                    }
                }).catch(err => {
                    console.log(err)
                })
                conveyParams = null;
                // 扫码器监控
                let scanMonitorData = this.monitorNodeData.filter(item => item.eqType === '扫码器');
                let scanParams = {url: '/api/PlcData/ScanerPlcInfo', params: []};
                this.$store.dispatch('fmsCommon/actionWcsPost',scanParams).then(data => {
                    scanMonitorData.forEach(node => {
                        let scanExist = false;
                        data.forEach(scan => {
                            if (parseInt(node.ctrlCode) === parseInt(scan.locNum) && parseInt(node.carryType) === parseInt(scan.carryType)) {
                                scanExist = true;
                                let nodeScan = null;
                                nodeScan = this.diagram.model.findNodeDataForKey(node.key);
                                this.diagram.model.setDataProperty(nodeScan,"st",'gray');
                                this.diagram.model.setDataProperty(nodeScan,"checkFlagNum",scan.checkFlag);
                                this.diagram.model.setDataProperty(nodeScan,"trayBarCode",scan.trayBarCode);
                                this.diagram.model.setDataProperty(nodeScan,"trayNum",scan.trayNum);
                                switch (scan.checkFlag) {
                                             case 0:  // 默认
                                                 nodeScan = this.diagram.model.findNodeDataForKey(node.key);
                                                 this.diagram.model.setDataProperty(nodeScan,"color",'gray');
                                                 this.diagram.model.setDataProperty(nodeScan,"checkFlag",this.$t('const.scanState.null'));
                                                 break;
                                             case 1: // 扫码完成
                                                 nodeScan = this.diagram.model.findNodeDataForKey(node.key);
                                                 this.diagram.model.setDataProperty(nodeScan,"color",'green');
                                                 this.diagram.model.setDataProperty(nodeScan,"checkFlag",this.$t('const.scanState.scanned'));
                                                 break;
                                             case 2: // 比对完成
                                                 nodeScan = this.diagram.model.findNodeDataForKey(node.key);
                                                 this.diagram.model.setDataProperty(nodeScan,"color",'blue');
                                                 this.diagram.model.setDataProperty(nodeScan,"checkFlag",this.$t('const.scanState.matched'));
                                                 break;
                                             case 3: // 比对失败
                                                 nodeScan = this.diagram.model.findNodeDataForKey(node.key);
                                                 this.diagram.model.setDataProperty(nodeScan,"color",'yellow');
                                                 this.diagram.model.setDataProperty(nodeScan,"checkFlag",this.$t('const.scanState.matchFail'));
                                                 break;
                                             case 9: // 申请重扫
                                                 nodeScan = this.diagram.model.findNodeDataForKey(node.key);
                                                 this.diagram.model.setDataProperty(nodeScan,"color",'rgba(128, 128, 128, 0.5)');
                                                 this.diagram.model.setDataProperty(nodeScan,"checkFlag",this.$t('const.scanState.Rescan'));
                                                 break;
                                             case 11: // 入库请求
                                                 nodeScan = this.diagram.model.findNodeDataForKey(node.key);
                                                 this.diagram.model.setDataProperty(nodeScan,"color",'rgba(128, 128, 128, 0.5)');
                                                 this.diagram.model.setDataProperty(nodeScan,"checkFlag",this.$t('const.scanState.inboundRequest'));
                                                 break;
                                             case 12: // 入库成功
                                                 nodeScan = this.diagram.model.findNodeDataForKey(node.key);
                                                 this.diagram.model.setDataProperty(nodeScan,"color",'green');
                                                 this.diagram.model.setDataProperty(nodeScan,"checkFlag",this.$t('const.scanState.inboundRequest'));
                                                 break;
                                             case 13: // 入库失败
                                                 nodeScan = this.diagram.model.findNodeDataForKey(node.key);
                                                 this.diagram.model.setDataProperty(nodeScan,"color",'red');
                                                 this.diagram.model.setDataProperty(nodeScan,"checkFlag",this.$t('const.scanState.importFail'));
                                                 break;
                                             default:
                                                 break;
                                         }
                                         
                            }
                        })
                        if (!scanExist) {
                                    let nodeSet = this.diagram.model.findNodeDataForKey(node.key);
                                    this.diagram.model.setDataProperty(nodeSet,"color",'rgba(128, 128, 128, 0.5)'); 
                                    this.diagram.model.setDataProperty(nodeSet,"st","red");
                                    this.diagram.model.setDataProperty(nodeSet,"textColor","black");
                        }
                    })
                }).catch(err => {
                    // console.log(err)
                })

                // 堆垛机监控
                let stockerData = this.monitorNodeData.filter(item => item.eqType === '堆垛机');
                // 过滤出堆垛机节点数据
                let stockerParams = {url: '/api/PlcData/StockerPlc', params: []};
                this.$store.dispatch('fmsCommon/actionWcsPost',stockerParams).then(data => {
                    let {task,info} = data;
                    stockerData.forEach(node => {
                        let isEqInfo = false;
                          // 任务信息
                        task.forEach(ta => {
                            if (Number(node.carryType) === Number(ta.carryType)) {
                                let nodeAttr = this.diagram.model.findNodeDataForKey(node.key);
                               // this.diagram.model.setDataProperty(nodeAttr,"color","gray");
                                this.diagram.model.setDataProperty(nodeAttr,"taskNum",ta.taskNum);
                                // TASKFLAG(任务下发标志)如果是1的时候堆垛机显示黄色，0还是以deviceMode和deviceState的状态为主
                                if (ta.taskFlag) {
                                    let nodeAttr = this.diagram.model.findNodeDataForKey(node.key);
                                    this.diagram.model.setDataProperty(nodeAttr,"color","Gold");
                                    this.diagram.model.setDataProperty(nodeAttr,"taskFlag",ta.taskFlag);
                                } else {
                                    let nodeAttr = this.diagram.model.findNodeDataForKey(node.key);
                                    this.diagram.model.setDataProperty(nodeAttr,"taskFlag",ta.taskFlag); 
                                }
                            }
                        })

                        // 堆垛机设备信息
                        info.forEach(fo => {
                             if (Number(node.carryType) === Number(fo.carryType)) {
                                isEqInfo = true;

                                let useData = { url: '/api/Stocker/GetStockerAutoState', params: {data: node.carryType} }
                                this.$store.dispatch('fmsCommon/actionWcsPost', useData)
                                    .then(res => {
                                    let nodeTask = this.diagram.model.findNodeDataForKey(node.key);
                                    this.diagram.model.setDataProperty(nodeTask,"taskAutoState",res);
                                    fo['taskAutoState'] = res
                                     //   联机状态
                                if (
                                    fo.deviceMode === 1 || fo.deviceMode === 2 || fo.deviceMode === 3
                                    || fo.deviceMode === 4 || fo.deviceMode === 5
                                    ) {
                                        let nodeAttr = this.diagram.model.findNodeDataForKey(node.key);
                                        let nodeAttr1 = this.diagram.model.findNodeDataForKey(node.group);
                                        this.diagram.model.setDataProperty(nodeAttr,"deviceMode",this.stockerSel.selTwo[fo.deviceMode].name);
                                        this.diagram.model.setDataProperty(nodeAttr1,"groupTextColor",'black');
                                        let nodeSet = null;
                                        if(fo.deviceMode == 5){
                                            switch(fo.deviceState) { // 设备状态
                                                case 3:  // 故障 = 红色闪烁报警
                                                    nodeSet = this.diagram.model.findNodeDataForKey(node.key);
                                                    if (!nodeSet.taskFlag) {
                                                        // this.stockerRedArr.push(node.key)
                                                         this.diagram.model.setDataProperty(nodeSet,"color","red");
                                                    }
                                                    this.diagram.model.setDataProperty(nodeSet,"deviceState",this.stockerSel.selThree[3].name);   
                                                break;
                                                case 2:  // 空闲 = 绿色
                                                    if(!fo.taskAutoState){
                                                        this.delStockerRedArr(node.key)
                                                        nodeSet = this.diagram.model.findNodeDataForKey(node.key);
                                                        this.diagram.model.setDataProperty(nodeSet,"deviceState",this.stockerSel.selThree[2].name);
                                                        if (!nodeSet.taskFlag) {
                                                            this.diagram.model.setDataProperty(nodeSet,"color","purple");
                                                        }
                                                    }else{
                                                        this.delStockerRedArr(node.key)
                                                        nodeSet = this.diagram.model.findNodeDataForKey(node.key);
                                                        this.diagram.model.setDataProperty(nodeSet,"deviceState",this.stockerSel.selThree[2].name);
                                                        if (!nodeSet.taskFlag) {
                                                            this.diagram.model.setDataProperty(nodeSet,"color","green");
                                                        }
                                                    }
                                                    
                                                break;
                                                case 1: // 工作 = 蓝色
                                                    this.delStockerRedArr(node.key)
                                                    nodeSet = this.diagram.model.findNodeDataForKey(node.key);
                                                    this.diagram.model.setDataProperty(nodeSet,"deviceState",this.stockerSel.selThree[1].name);
                                                    if (!nodeSet.taskFlag) {
                                                        this.diagram.model.setDataProperty(nodeSet,"color","blue");
                                                    }
                                                break;
                                                case 0: // 待机 = 棕色
                                                    this.delStockerRedArr(node.key)
                                                    nodeSet = this.diagram.model.findNodeDataForKey(node.key);
                                                    this.diagram.model.setDataProperty(nodeSet,"deviceState",this.stockerSel.selThree[0].name);
                                                    if (!nodeSet.taskFlag) {
                                                        this.diagram.model.setDataProperty(nodeSet,"color","chocolate");
                                                    }
                                                break;
                                                default:
                                                break;
                                            } 
                                        }else{
                                            this.delStockerRedArr(node.key)
                                            nodeSet = this.diagram.model.findNodeDataForKey(node.key);
                                            this.diagram.model.setDataProperty(nodeSet,"deviceState",this.stockerSel.selThree[fo.deviceMode].name);
                                            if (!nodeSet.taskFlag) {
                                                this.diagram.model.setDataProperty(nodeSet,"color","orange");
                                            }
                                        }
                                            
                
                                } else {  // 操作方式未知状态下变黄色（设备可能故障在修）
                                    this.delStockerRedArr(node.key)
                                    let nodeSet = this.diagram.model.findNodeDataForKey(node.key);
                                    this.diagram.model.setDataProperty(nodeSet,"deviceMode",this.stockerSel.selThree[fo.deviceMode].name);
                                    this.diagram.model.setDataProperty(nodeSet,"color","Gold");
                                }


                                }).catch(err => {  })

                                

                               
                                let nodeAttr = this.diagram.model.findNodeDataForKey(node.key);
                                this.diagram.model.setDataProperty(nodeAttr,"fork1State",fo.fork1State);
                                this.diagram.model.setDataProperty(nodeAttr,"fork2State",fo.fork2State);
                                this.diagram.model.setDataProperty(nodeAttr,"execTaskNum",fo.execTaskNum);
                                this.diagram.model.setDataProperty(nodeAttr,"execState",fo.execState);
                                this.diagram.model.setDataProperty(nodeAttr,"row",fo.row);
                                this.diagram.model.setDataProperty(nodeAttr,"column",fo.column);
                                this.diagram.model.setDataProperty(nodeAttr,"layer",fo.layer);
                            }
                        })
                        if (!isEqInfo) {
                            let nodeAttr = this.diagram.model.findNodeDataForKey(node.key);
                            let nodeAttr1 = this.diagram.model.findNodeDataForKey(node.group);
                            this.diagram.model.setDataProperty(nodeAttr,"color","maroon");
                            this.diagram.model.setDataProperty(nodeAttr1,"groupTextColor","red");
                        }
                      
                    })
                }).catch(err => {
                    // console.error(err)
                })
               
            },
            diagramReset(id) {
                        let params = { data: id };
                        const _data = {url:'/monitor-drawing/guest/get-script',params: params}
                        this.$store.dispatch('fmsCommon/actionTaskPost',_data)
                        .then(data => {
                                this.diagram.model = go.Model.fromJson(data);
		                        this.monitorNodeData = JSON.parse(data).nodeDataArray;
                            }).catch(err => {
                                console.error(err)
                            })
            },
            // 监控按钮
            monitorBtn() {
                if (!this.isMonitor) {
                    jq('#monitorBtn').text(this.translateText('stopMonitor'));
                    this.isMonitor = true; // 启动监控
                    this.flashTimer = setInterval(() => {
                        this.plcTask(); 
                      }, 3000);   
                } else {
                    jq('#monitorBtn').text(this.$t('common.btn.monitor'));
                    this.isMonitor = false;  // 关闭监控
                    this.isAlert = false;
                    // redArr = [];
                    // this.stockerRedArr = [];
                    clearInterval(this.flashTimer);
                     // 恢复监控前的颜色及提示信息
                    for(var nit = this.diagram.nodes;nit.next();){  
                        var node = nit.value;
                        let nodes = this.diagram.model.findNodeDataForKey(node.data.key);
                        if (nodes.hasOwnProperty('ctrlCode') || nodes.hasOwnProperty('carryType')) {
                            this.diagram.model.setDataProperty(nodes,"st",'gray');
                        }
                        if (nodes.hasOwnProperty('group')) {
                            let nodeGorup = this.diagram.model.findNodeDataForKey(node.data.group)
                            this.diagram.model.setDataProperty(nodeGorup,"groupTextColor",'black');
                        }
                        
                        // 设置节点对应属性
                        if (nodes.carryType) {
                            this.diagram.model.setDataProperty(nodes,"color","rgba(128, 128, 128, 0.5)");
                            this.diagram.model.setDataProperty(nodes,"faultInfos",'');
                            this.diagram.model.setDataProperty(nodes,"textColor",'black');
                            this.diagram.model.setDataProperty(nodes,"trayNum",false);
                            this.diagram.model.setDataProperty(nodes, "操作方式", '');
                            this.diagram.model.setDataProperty(nodes, "光电信号", '');
                            this.diagram.model.setDataProperty(nodes, "运行状态", '');
                            this.diagram.model.setDataProperty(nodes, "货叉安全", '');  
                            this.diagram.model.setDataProperty(nodes, 'taskFlag', 1);  
                            this.diagram.model.setDataProperty(nodes, 'staName', false);  
                            this.diagram.model.setDataProperty(nodes, 'checkFlag', false);  
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


    .el-col-24 {
        .design-and-inspect {
           .myDiagramSpan {
            display: block;
            position: relative;
            width: 98%;
            margin:3px auto;
            border: 2px solid #d0d9dd !important;
            border-radius: 4px;
                .menu{
                    
                    display:none;
                    position:absolute;
                    opacity:0;
                    margin:0;
                    padding:8px 0;
                    z-index: 999;
                    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12);
                    list-style: none;
                    background-color: #fff;
                    border-radius:4px;
                }
                .menu-item {
                    display: block;
                    display: inline;
                    position: relative;
                    min-width: 60px;
                    margin: 0;
                    padding: 6px 16px;
                    font: bold 12px sans-serif;
                    color: rgba(0, 0, 0, .87);
                    cursor: pointer;
                    }

                    .menu-item::before {
                    position: absolute;
                    top: 0;
                    left: 0;
                    opacity: 0;
                    pointer-events: none;
                    content: "";
                    width: 100%;
                    height: 100%;
                    background-color: #000000;
                    }

                    .menu-item:hover::before {
                    opacity: .04;
                    }
                 .show-menu,.menu-item:hover {
                    display: block;
                    opacity: 1;
                }
             
   
            }
            .handle-resize {
              cursor: row-resize;
              position: relative;
              right: -45%;
              bottom: 2px;
              width: 60px;
              height: 5px;
            //   border-top: 2px solid red;
            //   border-bottom: 2px solid red;
              border-top: 2px solid #c5c5c5;
              border-bottom: 2px solid #c5c5c5;
              // top: calc(50% - 25px);
            }
        } 
    }
    .el-dialog .updateStyle{
                            width: 40%;
                            height: 60%;
                            .eqInfo {
                                display: flex;
                            }
                    }
    /deep/ .el-dialog__wrapper .nodeModal {
                            //display: inline;
                            width: 1000px;
                            height: 75%;
                            z-index:9999 !important;
                            .eqInfo {
                                img{
                                    display: block;
                                }
                                display: flex;
                            }
                            .radio-group {
                                // ::deep.el-radio__inner{
                                //   width: 14px !important;;
                                // } 
                                width:100%;
                                margin-bottom:10px;
                                margin-left:44px;
                            }
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
}
// .specialbutton{
//     span{
//         display: inline;
//     }
// }
</style>


