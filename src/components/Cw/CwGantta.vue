<template>
    <div>
        <div class="gantta-main" ref="ganttaMain">
            <div class="gantta-content gantta-left" id="gantta-left-id" @scroll="leftScroll">
                <div class="gantta-left-head">
                    <table class="head-table">
                        <colgroup>
                            <col v-for="(item,index) in cols" :name="'head-th-'+index"
                                :style="{minWidth:item.minWidth+'px',width:!item.width?'100px':item.width+'px'}">
                        </colgroup>
                        <thead>
                            <tr class="head-tr">
                                <th v-for="(item,index) in cols" :class="index==0?'head-one':'head-th'">
                                    <div
                                        :style="{minWidth:item.minWidth+'px',width:!item.width?'100px':item.width+'px', paddingTop:'10px',paddingBottom:'10px'}">
                                        {{item.title}}</div>
                                </th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div class="gantta-left-content">
                    <table class="body-table">
                        <colgroup>
                            <col v-for="(item,index) in cols" :name="'head-th-'+index"
                                :style="{minWidth:item.minWidth+'px',width:!item.width?'100px':item.width+'px'}">
                        </colgroup>
                        <tbody>
                            <tr v-for="(row,rowInx) in data" class="cw-tbody_tr cw-tbody_tr_left" :key="'cw-tbody_t'+rowInx"  @mouseover.prevent="(e)=>itemHover(rowInx)" @mouseout="itemHoverOut(rowInx)" >
                                <td v-for="(item,index) in cols"
                                    @contextmenu.prevent="onContextmenu($event,row,rowInx,index)" :prop="item.field"
                                    :class="rowInx==0 
                            ?index==0 ? 'body-row-one':'body-row'
                            :index==0?'body-one':'body-td'">
                                    <div
                                        :style="{minWidth:item.minWidth+'px',width:!item.width?'100px':item.width+'px',height:'25px',textAlign:'center'}">

                                        <!-- <input :value="row[item.field]" style="width: 100%;height: 25px;border: 0;"> -->

                                        <el-input v-if="item.queryType==='input' && editGantta" :readonly="!allowEdit" :disabled="!editGantta"
                                            v-model="row[item.field]" style="width: 100%;height: 25px;border: 0;font-size: 13px;" />
                                        <el-date-picker :readonly="!allowEdit"
                                            :style="{minWidth:item.minWidth+'px',width:!item.width?'100px':item.width+'px',height:'25px'}"
                                            v-else-if="item.queryType==='datetime' && editGantta" size="mini"
                                            v-model="row[item.field]" align="right" type="date"
                                            @change="(date)=>changeDate(row,date)" format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd" placeholder="">
                                        </el-date-picker>
                                        <el-color-picker :readonly="!allowEdit"
                                            :style="{minWidth:item.minWidth+'px',width:!item.width?'100px':item.width+'px',height:'25px'}"
                                            v-else-if="item.queryType==='colorpicker' && editGantta" size="mini"
                                            v-model="row[item.field]" align="right"
                                            @change="(val)=>changeColor(row,val)" placeholder="">
                                        </el-color-picker>
                                        <el-select
                                            :style="{minWidth:item.minWidth+'px',width:!item.width?'100px':item.width+'px',height:'25px',fontSize:'10px'}"
                                            v-else-if="item.queryType==='select' && editGantta" v-model="row[item.field]">
                                            <el-option v-for="op in initSelect[item.field]" :key="op.value"
                                                :label="op.label" :value="op.value">
                                            </el-option>
                                        </el-select>
                                        <el-select
                                            :style="{minWidth:item.minWidth+'px',width:!item.width?'100px':item.width+'px',height:'25px',fontSize:'10px'}"
                                            multiple collapse-tags @change="(v)=>onSelectChang(v,row)"
                                            v-else-if="item.queryType==='multipleselect' && editGantta" v-model="row[item.field]">
                                            <el-option v-for="op in initSelect[item.field]" :key="op.value"
                                                :disabled="row.TASK_CODE == op.value" :label="op.label"
                                                :value="op.value">
                                            </el-option>
                                        </el-select>
                                            <div v-else-if="item.queryType==='index' && editGantta" style="">{{row[item.field]?row[item.field]:row[item.field]=rowInx+1}}</div>
                                            <div v-else-if="!editGantta">{{row[item.field]}}</div>
                                        
                                            <!-- <el-input v-else readonly
                                            v-model="row[item.field]" style="width: 100%;height: 25px;border: 0;;font-size: 13px;" /> -->
                                            <div style="line-height: 25px" v-else>{{row[item.field]}}</div>
                                        
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
            </div>
            <div class="midline"></div>
            <div class="gantta-content gantta-right" id="gantta-right-id" @scroll="rightScroll">
                <div class="gantta-left-head">
                    <table class="head-table">
                        <colgroup>
                            <col v-for="(item,index) in cols_date" :name="'head-th-'+index"
                                :style="{minWidth:item.minWidth+'px',width:!item.width?'100px':item.width+'px'}">
                        </colgroup>
                        <thead>
                            <tr class="head-tr">
                                <!-- :style="{minWidth:item.minWidth+'px',width:!item.width?'100px':item.width+'px', paddingTop:'3px',paddingBottom:'2px',textAlign:'left'}" -->
                                <th v-for="(item,index) in date" :colspan="item.colspan"
                                    :class="index==0?'head-one':'head-th'">
                                    <div :style="{paddingTop:'3px',paddingBottom:'2px',textAlign:'left'}">{{item.date}}
                                    </div>
                                </th>
                            </tr>
                            <tr class="head-tr">
                                <th v-for="(item,index) in cols_date" :class="index==0?'head-one':'head-th'">
                                    <div
                                        :style="{minWidth:item.minWidth+'px',width:!item.width?'100px':item.width+'px'}">
                                        {{item.title}}</div>
                                </th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div class="gantta-right-content">
                    <canvas class="mycanvas" id="onlymyCanvas" :width="((31)*cols_date.length)+'px'" :height="((26)*data.length)+'px'"></canvas>
                    <table class="body-table">
                        <!-- <colgroup>
                            <col v-for="(item,index) in cols_date" :name="'head-th-'+index" :style="{minWidth:item.minWidth+'px',width:!item.width?'100px':item.width+'px'}">                                                   
                        </colgroup> -->
                        <tbody>
                            <!-- <tr v-for="(row,rowInx) in data" class="cw-tbody_tr">
                            <td v-for="(item,index) in cols_date"
                            :prop="item.field"
                            :class="rowInx==0 
                            ?index==0 ? 'body-row-one':'body-row'
                            :index==0?'body-one':'body-td'"><div :style="{minWidth:item.minWidth+'px',width:!item.width?'100px':item.width+'px',height:'25px'}">
                        </div>
                        </td>     
                         </tr>    -->
                            <tr v-for="(row,rowInx) in data" class="cw-tbody_tr cw-tbody_tr_right" @mouseenter="(e)=>itemHover(rowInx)"  @mouseleave="itemHoverOut(rowInx)">
                                <td v-for="(item,index) in [{width:30}]" :prop="item.field" :colspan="cols_date.length"
                                    :class="rowInx==0 
                            ?index==0 ? 'body-row-one':'body-row'
                            :index==0?'body-one':'body-td'">
                                    <div
                                        :style="{minWidth:item.minWidth+'px',width:!item.width?'100px':((item.width+1)*cols_date.length)+'px',height:'25px',paddingTop:'5px'}">
                                        <!-- <div :style="{width: '300px',height: '15px',backgroundColor: 'aqua',marginLeft:'62px'}"></div> -->
                                        <div class="item-task" @mousedown="editGantta ? onTaskMousedown($event,row,rowInx) : null"
                                            @click="onTaskClick" @mouseover="editGantta ? onTaskHover($event,row) : null"
                                            @mouseout="onTaskHoverout" :style="{...row.style}">
                                            <div v-show="dragTask.ID == 'tr'+rowInx" class="drag-item-task"
                                                @dragstart="editGantta? dragMethod : null"
                                                :style="{width:row.style.width,height:row.style.height,left:dragTask.left}">
                                            </div>
                                        </div>

                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-- hover 看板 -->
        <div v-show="infoCard.show" class="info-card" :style="infoCardStyle()">
            <div>
                <div style="text-align: center">{{ infoCard.row.TASK_MODE}}任务</div>
                <div>任务名称:<span>{{ infoCard.row.TASK_NAME}}</span></div>
                <div>任务代码:<span>{{ infoCard.row.TASK_CODE}}</span></div>
                <div>开始时间:<span>{{ infoCard.row.BEGIN_TIME}}</span></div>
                <div>结束时间:<span>{{ infoCard.row.END_TIME}}</span></div>



            </div>
        </div>
        <CwRightMenu :class-index="rightclickInfo.menuId" :rightclickInfo="rightclickInfo"
                    @rmenuDelete="rmenuDelete" @rmenuControllUser="rmenuControllUser" />

    </div>
</template>
<script>
    import CwRightMenu from "./CwRightMenu.vue";
    import { mapState } from 'vuex'
    import jq from "jquery";
    import { addClass, removeClass } from '@/utils'

    //,transform : 'rotate(' + item.attribute.rotationAngle + 'deg)'  对于带有模态的不能增加旋转
    export default {
        name: 'CwGantta',
        components: { CwRightMenu },
        directives: {},
        filters: {},
        props: {
            width: {
                type: Number,
                default: () => { return 1920 }
            },
            height: {
                type: Number,
                default: () => { return 1080 }
            },

            dateRange: {
                type: Array,
                default: () => { return [] }
            },
            rightclickInfo: {
                type: Object,
                default: () => { return {} }
            },
            projectName: {
                type: String,
                default: () => { return undefined }
            },
            projectCode: {
                type: String,
                default: () => { return undefined }
            },
            pmUser: {
                type: String,
                default: () => { return undefined }
            },
            id: {
                type: String,
                default: () => { return undefined }
            },
            allowEdit: {
                type: Boolean,
                default: () => { return true }
            },
            editGantta: {
                type: Boolean,
                default: () => { return true }
            },
            loadGanttaData: {
                type: Array,
                default: () => {
                    return [
                        { TASK_NAME: '', TASK_CODE: '', style: {} },
                        { TASK_NAME: '', TASK_CODE: '', style: {} },
                        { TASK_NAME: '', TASK_CODE: '', style: {} },
                        { TASK_NAME: '', TASK_CODE: '', style: {} },
                        { TASK_NAME: '', TASK_CODE: '', style: {} },
                        { TASK_NAME: '', TASK_CODE: '', style: {} },
                        { TASK_NAME: '', TASK_CODE: '', style: {} },
                        { TASK_NAME: '', TASK_CODE: '', style: {} },
                        { TASK_NAME: '', TASK_CODE: '', style: {} },
                        { TASK_NAME: '', TASK_CODE: '', style: {} },
                        { TASK_NAME: '', TASK_CODE: '', style: {} }]
                }
            }
        },
        data() {
            const _initdata = {
                page: {},
                cols: [
                    { field: 'TASK_INDEX', title: '序号', width: 30, align: "center", queryType: 'index', set: false, require: true, query: true, hide: false, disabled: false, },
                    { field: 'PROJECT_CODE', title: '项目号', width: 100, align: "center", queryType: 'text', set: false, require: true, query: true, hide: true, disabled: false, },
                    { field: 'TASK_NAME', title: '任务名称', minWidth: 15, align: "center", queryType: 'text', set: false, require: true, query: true, hide: false, disabled: false, },
                    { field: 'TASK_CODE', title: '任务代码', minWidth: 80, align: "center", queryType: 'text', PRODUCT_NAME: ['dsCode', 'dsName'], set: false, require: true, query: false, hide: false },
                    { field: 'TASK_MODE', title: '任务模式', minWidth: 80, align: "center", queryType: 'text', set: true, require: true, query: false, hide: false },
                    { field: 'BEGIN_TIME', title: '开始时间', minWidth: 130, align: "center", queryType: 'text', set: false, require: true, query: false, hide: false },
                    { field: 'END_TIME', title: '结束时间', minWidth: 130, align: "center", queryType: 'text', UNIT: ['bizValue', 'bizValue'], set: true, require: true, query: false, hide: false },
                    { field: 'PRE_TASK', title: '前置任务', minWidth: 180, align: "center", queryType: 'text', set: false, require: true, query: false, hide: false },
                    { field: 'TIME_LIMIT', title: '工期', align: 'center', queryType: 'text', set: false, require: true, query: false, hide: false },
                    { field: 'DESCRIPTION', title: '备注', width: 200, align: 'center', queryType: 'text', set: false, require: true, query: false, hide: false },
                    { field: 'UDF1', title: '背景颜色', width: 100, align: 'center', queryType: 'text', set: false, require: true, query: false, hide: false },
                ],
                cols_date: [

                ],
                default_data: [
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} }
                ],
                data: [
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} },
                    { TASK_NAME: '', TASK_CODE: '', style: {} }
                ],
                initSelect: {
                    TASK_MODE: [{ label: '自动', value: 'AUTO' }, { label: '手动', value: 'MANUAL' }],
                    PRE_TASK: []
                },
                componentData: [],
                // rightclickInfo: {},
                componentModalObj: {},
                fullElementCodeHanler: {},
                vueContext: {},
                methods: {},
                days: [],
                date: [],
                dateMap: {},
                dragTask: {
                    ID: '',
                    left: '',
                },
                infoCard: {
                    show: false,
                    x: 0,
                    y: 0,
                    row: {},
                    column: {},
                    cell: null,
                    timer: null,
                },
                ganttaMainWidth: 400,
            }
            //Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
            return _initdata
        },
        computed: {
            ...mapState({
                sidebarOpened: state => state.app.sidebar.opened,
            }),
        },
        watch: {
            dateRange: {
                handler: function (newVal, oldVal) {
                    this.createGanttaHeader()
                },
                deep: true,
                immediate: true,
            },
            loadGanttaData: {
                handler: function (newVal, oldVal) {

                    if (newVal && newVal.length > 0) {
                        this.data = newVal.map(item => {

                            let row = { ...item, style: {} }
                            row.PRE_TASK = row.PRE_TASK ? row.PRE_TASK.split(',') : (!this.editGantta ? '' : [])
                            row.BEGIN_TIME = this.convertDateToMonth(row.BEGIN_TIME)
                            row.END_TIME = this.convertDateToMonth(row.END_TIME)
                            this.calcStrip(row)
                            return row
                        })
                        this.initSelect.PRE_TASK = newVal.filter(item => {
                            if (item.TASK_NAME) return item
                        }).map(val => {
                            return {
                                label: val.TASK_NAME,
                                value: val.TASK_CODE,
                            }
                        })

                    } else {
                        this.data = this.default_data.map(item => {

                            let row = { ...item, style: {} }
                            row.PRE_TASK = row.PRE_TASK ? row.PRE_TASK.split(',') : (!this.editGantta ? '' : [])
                            row.BEGIN_TIME = this.convertDateToMonth(row.BEGIN_TIME)
                            row.END_TIME = this.convertDateToMonth(row.END_TIME)
                            this.calcStrip(row)
                            return row
                        })
                        this.initSelect.PRE_TASK = newVal.filter(item => {
                            if (item.TASK_NAME) return item
                        }).map(val => {
                            return {
                                label: val.TASK_NAME,
                                value: val.TASK_CODE,
                            }
                        })
                    }
                    this.$nextTick(() => {
                        this.createConnectionLine()
                    })
                   
                },
                // deep: true,
                // immediate: true,
            },
            data: {
                handler: function (newVal, oldVal) {
                    this.initSelect.PRE_TASK = newVal.filter(item => {
                        if (item.TASK_NAME) return item
                    }).map(val => {
                        return {
                            label: val.TASK_NAME,
                            value: val.TASK_CODE,
                        }
                    })
                    this.draWeekend()
                },
                // deep: true,


            },
            ganttaMainWidth: {
                handler: function (newVal, oldVal) {
                    if (newVal) {
                        let left = document.getElementsByClassName('gantta-left')
                        let right = document.getElementsByClassName('gantta-right')
                        left[0].style.width = newVal / 2 + 'px'
                        right[0].style.width = newVal * (0.49) + 'px'
                    }
                },
                deep: true,


            },
            sidebarOpened: {
                handler: function (newVal, oldVal) {
                    // if (newVal != oldVal) {
                        let offsetWidth = this.$refs.ganttaMain.offsetWidth
                        let left = document.getElementsByClassName('gantta-left')
                        let right = document.getElementsByClassName('gantta-right')
                        if (newVal == false) {
                            // left[0].style.width = left[0].offsetWidth - 4 + 'px'
                            right[0].style.width = offsetWidth-left[0].offsetWidth+130  + 'px'
                        } else {
                            // left[0].style.width = left[0].offsetWidth - 4 + 'px'
                            right[0].style.width = offsetWidth-left[0].offsetWidth-200  + 'px'

                        }

                    // }
                },
                deep: true,


            }
        },
        created() {
            this.createGanttaHeader()

        },
        mounted() {
            this.dragControllerDiv();
            this.$nextTick(() => {
                this.draWeekend();
            })
            window.addEventListener('resize', this.handleResize)
        },
        methods: {
        draWeekend(){
            let canvas1 = document.getElementById('onlymyCanvas');
            let ctx = canvas1.getContext('2d')
            ctx.clearRect(0, 0, canvas1.width, canvas1.height);
            let theDay = this.getDaysOfDay();
            let canvasHeight = canvas1.height;

            theDay.forEach((val,index)=>{
                if(val.weekend){
                    let startX = index*31
                    let startY = 0
                    ctx.fillStyle = 'rgba(230,232,233,0.5)'
                    ctx.fillRect(startX,startY,63,canvasHeight)
                }
            })
            
        },
        
        createConnectionLine() {
            let canvas1 = document.getElementById('onlymyCanvas');
            let ctx = canvas1.getContext('2d')
            ctx.clearRect(0, 0, canvas1.width, canvas1.height);
            this.draWeekend()
            this.data.forEach((end, endi) => {
                if (end.PRE_TASK.length > 0) {
                    end.PRE_TASK.forEach(rowPre => {

                        this.data.forEach((start, starti) => {
                            if (start.TASK_CODE == rowPre) {
                                this.$nextTick(() => {
                                    let startX = parseFloat(start.WIDTH) + parseFloat(start.style.marginLeft); //前置任务X
                                    let startY = (starti) * 27 - parseFloat(starti - 1) + 12.5; //前置任务Y
                                    let endX = parseFloat(end.style.marginLeft); //后置任务X
                                    let endY = (endi) * 27 - parseFloat(endi - 1)+12.5; //后置任务Y
                                    ctx.strokeStyle = 'green';
                                    if (endX >startX) {
                                        ctx.beginPath();
                                        ctx.strokeStyle = 'green';
                                        ctx.moveTo(startX, startY); //起点
                                        ctx.lineTo(startX + 15, startY); //右移
                                        ctx.lineTo(startX + 15, endY); //下移
                                        ctx.lineTo(endX, endY); //到终点
                                        ctx.stroke();
                                        //绘制终点箭头
                                        ctx.beginPath();
                                        ctx.strokeStyle = 'green';
                                        ctx.moveTo(endX - 7,   endY-3);
                                        ctx.lineTo(endX, endY);
                                        ctx.lineTo(endX - 7, endY + 3);
                                        ctx.stroke();
                                    }else{
                                        ctx.beginPath();
                                        ctx.strokeStyle = 'green';
                                        ctx.moveTo(startX, startY); //起点
                                        let left = startX - endX + 45
                                        ctx.lineTo(startX + 15, startY); //右移
                                        ctx.lineTo(startX + 15, endY >startY ? endY-13 : endY+13); //下移
                                        ctx.lineTo(startX - left + 15, endY >startY ? endY-13 : endY+13); //左移
                                        ctx.lineTo(startX - left + 15, endY); //下移
                                        ctx.lineTo(endX, endY); //到终点
                                        ctx.stroke();
                                        //绘制终点箭头
                                        ctx.beginPath();
                                        ctx.strokeStyle = 'green';
                                        ctx.moveTo(endX - 7,   endY-3);
                                        ctx.lineTo(endX, endY);
                                        ctx.lineTo(endX - 7, endY + 3);
                                        ctx.stroke();
                                    }
                                    //绘制起点球球
                                    ctx.beginPath();
                                    ctx.fillStyle = 'green';
                                    ctx.arc(startX, startY, 2, 0, 2 * Math.PI, false); //x,y,半径,*,弧长,时针
                                    ctx.fill();
                                })
                            }
                        })
                    })

                }
            })
        },
            itemHoverOut(rowInx){
                const rows_left = this.$el.querySelectorAll('.cw-tbody_tr_left');
                const rows_right = this.$el.querySelectorAll('.cw-tbody_tr_right');
                if (rows_left[rowInx]) {
                    removeClass(rows_left[rowInx], 'hover-row');
                    removeClass(rows_right[rowInx], 'hover-row');
                }
            },
            itemHover(rowInx){
                const rows_left = this.$el.querySelectorAll('.cw-tbody_tr_left');
                const rows_right = this.$el.querySelectorAll('.cw-tbody_tr_right');
                if (rows_left[rowInx]) {
                    addClass(rows_left[rowInx], 'hover-row')
                    addClass(rows_right[rowInx], 'hover-row')
                }
            },
         
            handleResize() {
                this.ganttaMainWidth = this.$refs.ganttaMain.clientWidth;
            },
            dragControllerDiv() {
                let _this = this;
                let resize = document.getElementsByClassName('midline')
                let left = document.getElementsByClassName('gantta-left')
                let right = document.getElementsByClassName('gantta-right')
                resize[0].onmousedown = function (e) {

                    let startX = e.clientX
                    document.onmousemove = function (e) {
                        let opened = _this.$store.state.app.sidebar.opened ? 170 : 0
                        let boxWidth = document.getElementsByClassName('gantta-main')[0].clientWidth

                        let move = e.clientX > 300 ? e.clientX > 1400 ? 1400 : e.clientX : 300 
                        resize[0].left = startX
                        left[0].style.width = move - (boxWidth * 0.04) + 'px'
                        right[0].style.width = (boxWidth - move + (boxWidth * 0.037)) + 'px'
                        if (boxWidth > 1500) {
                            left[0].style.width = move - (boxWidth * 0.04) - opened + 'px'
                            right[0].style.width = (boxWidth - move + (boxWidth * 0.037)) + opened + 'px'
                        } else {
                            left[0].style.width = move - (boxWidth * 0.07) - opened + 'px'
                            right[0].style.width = (boxWidth - move + (boxWidth * 0.064)) + opened + 'px'
                        }
                    }
                    document.onmouseup = function (evt) {
                        document.onmousemove = null
                        document.onmouseup = null
                        resize[0].releaseCapture && resize[0].releaseCapture() // 当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
                    }
                    resize[0].setCapture && resize[0].setCapture() // 该函数在属于当前线程的指定窗口里设置鼠标捕获
                    return false
                }
            },

            DateDiff(sDate1, sDate2) {    //sDate1和sDate2是2002-12-18格式  
                var aDate, oDate1, oDate2, iDays
                aDate = sDate1.split("-")
                oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])    //转换为12-18-2002格式  
                aDate = sDate2.split("-")
                oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
                iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数  
                return iDays
            },
            convertDateToMonth(dateStr) {
              const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
              if (regex.test(dateStr)) {
                return dateStr.slice(0, 10);
              }
              return dateStr;
            },
            onSelectChang(v, row) {
                let obj = { ...row }

                this.data.forEach(item => {
                    v.forEach(val => {
                        if (item.TASK_CODE == val) {

                            if (new Date(item.END_TIME).getTime() > new Date(row.BEGIN_TIME).getTime() || new Date(item.END_TIME).getTime() == new Date(row.BEGIN_TIME).getTime()) {
                                let diff = this.DateDiff(item.END_TIME, row.BEGIN_TIME)
                                row.BEGIN_TIME = this.timestampToDate(new Date(row.BEGIN_TIME).getTime() + (86400000 * (diff + 1)))
                                row.END_TIME = this.timestampToDate(new Date(row.END_TIME).getTime() + 86400000 * (diff + 1))
                                this.calcStrip(row)



                            }
                        }
                    })

                })
                    this.createConnectionLine()

            },
            rmenuDelete(params, row) {
                for (var i = 0; i < this.data.length; i++) {
                    if (
                        this.data[i].TASK_INDEX == params.row.TASK_INDEX
                    ) {
                        this.data.splice(i, 1);
                    }
                }
            },
            rmenuControllUser(params, row) {
                this.$emit('rmenuControllUser', params);
            },
            onContextmenu(event, row, ri, ci) {
                this.$emit('onContextmenu', event, row, ri, ci);

               
            },
            // 时间戳转日期
            timestampToDate(timestamp) {
                const date = new Date(timestamp);
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                return `${year}-${month}-${day}`;
            },
            dragMethod(e) {
                e.preventDefault();
            },
            onTaskMousedown(event, row, rowInx) {
                let _this = this
                let daybegin = 0
                let dayend = 0
                const downX = event.clientX
                const downY = event.clientY
                let day = 0
                function onMousemove(eventmove) {
                    if (eventmove.clientY - downY > 10 || downY - eventmove.clientY > 10) {
                        _this.dragTask.ID = ''
                        _this.dragTask.left = 0
                        document.removeEventListener('mousemove', onMousemove)
                    } else {
                        _this.infoCard.show = false
                        _this.dragTask.ID = 'tr' + rowInx
                        _this.dragTask.left = (eventmove.clientX - downX) + 'px'
                        day = Math.floor((eventmove.clientX - downX) / 30)
                        daybegin = new Date(row.BEGIN_TIME).getTime() + 86400000 * day;
                        dayend = new Date(row.END_TIME).getTime() + 86400000 * day;
                    }
                }
                function onMouseup(e) {
                    if (_this.dragTask.left) {
                        _this.dragTask.ID = ''
                        _this.dragTask.left = 0
                        row.BEGIN_TIME = _this.timestampToDate(daybegin),
                            row.END_TIME = _this.timestampToDate(dayend)
                        _this.calcStrip(row)
                        _this.isPre(row, day)
                        _this.havePre(row, day)
                        _this.createConnectionLine()
                    }

                    document.removeEventListener('mousemove', onMousemove)
                    document.removeEventListener('mouseup', onMouseup)
                };
                document.addEventListener('mousemove', onMousemove)
                document.addEventListener('mouseup', onMouseup)

            },
            havePre(row, day) {
                if (row.PRE_TASK && row.PRE_TASK.length > 0) {
                    this.data.forEach(item => {
                        row.PRE_TASK.forEach(val => {
                            if (item.TASK_CODE == val) {
                                // if(item.TASK_MODE == 'AUTO' || item.TASK_MODE == '自动'){
                                //     item.BEGIN_TIME = this.timestampToDate(new Date(item.BEGIN_TIME).getTime() + (86400000*day ))
                                //     item.END_TIME = this.timestampToDate(new Date(item.END_TIME).getTime()+86400000*day)
                                //     this.calcStrip(item)
                                // }else{
                                if (new Date(item.END_TIME).getTime() > new Date(row.BEGIN_TIME).getTime() || new Date(item.END_TIME).getTime() == new Date(row.BEGIN_TIME).getTime()) {
                                    // let diff =this.DateDiff(item.END_TIME,row.BEGIN_TIME)
                                    // item.BEGIN_TIME = this.timestampToDate(new Date(item.BEGIN_TIME).getTime() - (86400000*(diff+1) ))
                                    // item.END_TIME = this.timestampToDate(new Date(item.END_TIME).getTime()-86400000*(diff+1))
                                    // this.calcStrip(item)
                                    this.$message({
                                        type: 'error',
                                        message: '主任务日期与前置任务日期有重叠'
                                    })
                                }
                                // }

                            }
                        })

                    })
                }
            },
            isPre(row, day) {
                let _this = this

                this.data.forEach(item => {

                    item.PRE_TASK.forEach(val => {

                        if (row.TASK_CODE == val) {
                            if (item.TASK_MODE == 'AUTO' || item.TASK_MODE == '自动') {
                                item.BEGIN_TIME = this.timestampToDate(new Date(item.BEGIN_TIME).getTime() + (86400000 * day))
                                item.END_TIME = this.timestampToDate(new Date(item.END_TIME).getTime() + 86400000 * day)
                                this.calcStrip(item)
                            } else {
                                if (new Date(row.END_TIME).getTime() > new Date(item.BEGIN_TIME).getTime() || new Date(row.END_TIME).getTime() == new Date(item.BEGIN_TIME).getTime()) {
                                    let diff = this.DateDiff(row.END_TIME, item.BEGIN_TIME)
                                    item.BEGIN_TIME = this.timestampToDate(new Date(item.BEGIN_TIME).getTime() + (86400000 * (diff + 1)))
                                    item.END_TIME = this.timestampToDate(new Date(item.END_TIME).getTime() + 86400000 * (diff + 1))
                                    this.calcStrip(item)
                                }
                            }


                        }
                    })

                })
            },
            taskShowStyle(row, offset) {
                return {
                    width: row.style.width,
                    height: row.style.height,
                    left: offset ? offset.left : 0,
                };
            },
            infoCardStyle() {
                return {
                    left: this.infoCard.x + "px",
                    top: this.infoCard.y + "px",
                };
            },
            onTaskClick(event) {

            },
            onTaskHover(event, row) {
                this.infoCard.timer = setTimeout(() => {
                this.infoCard.show = true;
                this.infoCard.row = row;
                this.initSelect.TASK_MODE.forEach(item => {
                    if (item.value == row.TASK_MODE) {
                        this.infoCard.row.TASK_MODE = item.label
                    }
                })
                this.infoCard.x = event.pageX + 12;
                this.infoCard.y = event.pageY + 10;
                this.infoCard.timer && clearTimeout(this.infoCard.timer);
                }, 500);
            },
            onTaskHoverout(event) {
                this.infoCard.show = false;
                  clearTimeout(this.infoCard.timer);
                  this.infoCard.timer = null;
            },
            leftScroll(e) {
                let leftDiv = document.getElementById('gantta-right-id')
                leftDiv.scrollTop = e.target.scrollTop
            },
            rightScroll(e) {
                // document
                let leftDiv = document.getElementById('gantta-left-id')
                leftDiv.scrollTop = e.target.scrollTop
                // this.rightclickInfo = {}
                    
            },
            addRow() {
                this.data.push({ TASK_NAME: '', TASK_CODE: '', style: {} })

            },
            ganttaData() {
                return this.data
            },
            changeDate(row, date) {
                this.calcStrip(row)
                this.createConnectionLine()
            },
            changeColor(row, date) {
                this.calcStrip(row)
            },
            calcStrip(row) {

                let startDate = row.BEGIN_TIME
                let endDate = row.END_TIME

                if (startDate === '' || startDate === undefined || startDate === null)
                    return
                if (endDate === '' || endDate === undefined || endDate === null)
                    return
                if(startDate.length>10){
                    startDate = startDate.substring(0,10)
                }
                if(endDate.length>10){
                    endDate = endDate.substring(0,10)
                }
                let startItem = this.dateMap[startDate]
                let endItem = this.dateMap[endDate]
                if (startDate && endDate) {
                    let start = new Date(startDate)
                    let end = new Date(endDate)
                    if (start.getTime() >= end.getTime()) {
                        this.$message({
                            type: 'error',
                            message: '完成时间不能小于开始时间'
                        })
                        return
                    }
                    //计算位置
                    let startIndex = startItem.index
                    let endIndex = endItem.index
                    let width = (endIndex - startIndex + 1) * 31
                    let marginLeft = startIndex * 31
                    row.WIDTH = width + 'px'
                    row.MATGIN_LEFT = marginLeft + 'px'
                    row.UDF1 = row.UDF1 ? row.UDF1 : '#2D8CF2'
                    row.style = { width: row.WIDTH, height: '15px', backgroundColor: row.UDF1, marginLeft: row.MATGIN_LEFT }
                    //this.$forceupdate()
                }
                return { width: '300px', height: '15px', backgroundColor: '#2D8CF2', marginLeft: '62px' }
            },
            createGanttaHeader() {
                let result = this.getDaysOfDay();
                let i = 0
                this.dateMap = {}
                this.cols_date = result.map(c => {
                    let item = { title: c.weekday, width: 30, date: c.date, index: i }
                    this.dateMap[c.date] = item
                    i++
                    return item
                })

            },
            getDaysOfDay() {
                //计算时间
                let startDate = new Date()
                let dateStr1 = `${startDate.getFullYear()}-${(startDate.getMonth() + 1) < 10 ? '0' + (startDate.getMonth() + 1) : (startDate.getMonth() + 1)}-${startDate.getDate() < 10 ? '0' + startDate.getDate() : startDate.getDate()}`;
                startDate = new Date(dateStr1)
                let beginDateStr = undefined
                let endDateStr = undefined
                let dateEndStr = this.dateRange[1]
                if(dateEndStr &&  dateEndStr.length>10)
                    dateEndStr=dateEndStr.substring(0,10)
                let dateStartStr  = this.dateRange[0]
                if(dateStartStr && dateStartStr.length>10)
                    dateStartStr=dateStartStr.substring(0,10)

                let beginFullYear = startDate.getFullYear()
                let endFullYear = beginFullYear + 2
                if (this.dateRange && this.dateRange.length > 0) {
                    let beginDateStr = new Date(dateStartStr)
                    startDate = beginDateStr
                    if (this.dateRange.length > 1) {
                        endDateStr = new Date(dateEndStr)
                        endFullYear = endDateStr.getFullYear()
                    }
                }

                // 创建一个空数组 days，存放结果
                let days = [];
                // 遍历该年的所有月份
                this.date = []
                let i = 0
                let dayStr = undefined
                //计算三年
                let breakPoint = false
                for (let year = beginFullYear; year <= endFullYear; year++) {
                    for (let month = 1; month <= 12; month++) {
                        // 根据当前月份计算该月的最大日期
                        let maxDay = new Date(year, month, 0).getDate();
                        // 将该月的每一天添加到数组中
                        for (let day = 1; day <= maxDay; day++) {

                            // 构造日期字符串，格式为 "YYYY-MM-DD"
                            let dateStr = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
                            // 通过 JavaScript 内置的 Date 类型获取指定日期的星期几
                            let weekday = new Date(dateStr).toLocaleString('zh', { weekday: 'long' });
                            let curr = new Date(dateStr)
                            if (curr.getTime() < startDate.getTime()) {
                                i = 0
                                continue
                            }
                            if (endDateStr  && curr.getTime() > endDateStr.getTime()) {
                                if (i > 0) {
                                    if (weekday.substring(2, 3) === '四' || weekday.substring(2, 3) === '五' || weekday.substring(2, 3) === '六' || weekday.substring(2, 3) === '日') {
                                        this.date.push({ colspan: i, date: dayStr })
                                    } else {
                                        this.date.push({ colspan: i, date: '' })
                                    }

                                }
                                i = 0;
                                dayStr = undefined
                                breakPoint = true
                                break
                            }
                            // 将日期和星期几作为对象添加到数组中
                            days.push({ date: dateStr, weekday: weekday.substring(2, 3), start: weekday.substring(2, 3) === '一' ? 1 : 0, weekend: (weekday.substring(2, 3) === '六') ? true : false  });
                            if (weekday.substring(2, 3) === '一') {
                                dayStr = dateStr
                            }
                            i++
                            if (weekday.substring(2, 3) === '日') {
                                if (i > 0) {
                                    this.date.push({ colspan: i, date: dayStr })
                                }
                                i = 0;
                                dayStr = undefined
                            }
                            if (year === endFullYear && month == 12 && day === maxDay && weekday.substring(2, 3) !== '日') {
                                if (i > 0) {
                                    this.date.push({ colspan: i, date: dayStr })
                                }
                            }

                        }
                        if (breakPoint)
                            break;
                    }
                    if (breakPoint)
                        break;
                }
                return days;
            },
            getDaysOfYear(year) {
                // 创建一个空数组 days，存放结果
                let days = [];
                // 遍历该年的所有月份
                for (let month = 1; month <= 12; month++) {
                    // 根据当前月份计算该月的最大日期
                    let maxDay = new Date(year, month, 0).getDate();
                    // 将该月的每一天添加到数组中
                    for (let day = 1; day <= maxDay; day++) {
                        // 构造日期字符串，格式为 "YYYY-MM-DD"
                        let dateStr = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

                        // 通过 JavaScript 内置的 Date 类型获取指定日期的星期几
                        let weekday = new Date(dateStr).toLocaleString('zh', { weekday: 'long' });
                        // 将日期和星期几作为对象添加到数组中
                        days.push({ date: dateStr, weekday: weekday.substring(2, 3) });
                    }
                }

                return days;
            }
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.handleResize)
            if (this.infoCard.timer) {
                clearInterval(this.infoCard.timer);
            }
        }
    }
</script>
<style>

</style>
<style lang="less" scoped>
    .preview {
        width: 100%;
        height: 100%;
    }


    .gantta-main {
        // display: flex;
        width: 100%;
        height: calc(100vh - 261px);
        overflow-y: auto;

        .gantta-content {
            display: inline-block;
            overflow-x: auto;
            border: 1px solid #C8CDD2;
            // padding: 5px;
        }

        .gantta-left {
            // position: relative;
            width: 600px;
            //min-height: 800px;
            height: calc(100vh - 265px);
            overflow-y: auto;
            &::-webkit-scrollbar {
                width: 0px; /* 滚动条高度，因为是水平滚动条 */
            }
            //background-color: beige;

        }


        .gantta-right {
            width: calc(100% - 605px);
            //min-height: 800px;
            margin-left: 2px;
            overflow-y: auto;
            height: calc(100vh - 265px);
            //background-color: beige;
        }

        .gantta-left-content,
        .gantta-left-head {
            width: 100%;
        }

        .gantta-right-content {
            position: relative;
            width: 100%;
        }

        .head-table {
            border-collapse: separate;
            /* 分开边框 */
            border-spacing: 0;
            /* 去除间距 */
            border: 1px solid #D4D4D4;
            font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
            color: #606266;
            font-size: 13px !important;
        }

        .body-table {
            border-collapse: separate;
            /* 分开边框 */
            border-spacing: 0;
            /* 去除间距 */
            border-left: 1px solid #D4D4D4;
            border-right: 1px solid #D4D4D4;
            border-bottom: 1px solid #D4D4D4;
            font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
            color: #606266;
            font-size: 13px !important;
        }

        td {
            padding: 0;
        }

        .body-one {
            border-top: 1px solid #D4D4D4;
            padding: 0;
            line-height: 200%;
            /* 设置内边距 */
        }

        .head-one {
            padding: 0;
            /* 设置内边距 */
        }

        .body-row {
            border-left: 1px solid #D4D4D4;
            padding: 0;
            /* 设置内边距 */
        }

        .body-row-one {
            padding: 0;
            line-height: 200%;
            /* 设置内边距 */

        }

        .body-td {
            border-left: 1px solid #D4D4D4;
            border-top: 1px solid #D4D4D4;
            padding: 0;
            /* 设置内边距 */
        }

        .head-tr {
            background-color: #E6E6E6 !important;
        }

        .head-th {
            border-left: 1px solid #D4D4D4;
            padding: 0;
            /* 设置内边距 */
        }

    
        // .cw-tbody_tr:hover {
        //     background-color: #E6E8E9!important;
        //     cursor: pointer;
        // }
        .hover-row {
            background-color: #E6E8E9!important;
            cursor: pointer;
        }

        // .cw-tbody_tr:active {
        //     background-color: #E6E8E9;
        //     cursor: pointer;
        // }

        /deep/ .el-input__inner {
            border: 0 !important;
            height: 25px;
            background: none;

        }

        .item-task {
            position: relative;
        }

        .drag-item-task {
            position: absolute;
            border: 1px solid black;
        }

        /deep/.el-color-picker__trigger {
            border: none;
            height: 100%;
            width: 100%;
        }
    }

    .info-card {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
        padding: 10px;
        width: 260px;
        //   height: 120px;
        color: rgb(56, 55, 58);
        border: 1px solid #D4D4D4;
        background-color: #fff;
        font-size: 14px;
    }

    .midline {
        display: inline-block;
        // position: relative;
        height: calc(100vh - 265px);;
        width: 2px;
        cursor: w-resize;
        z-index: 999;
    }
    .mycanvas{
        position: absolute;
    }
</style>