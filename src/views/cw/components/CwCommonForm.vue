<template>
  <div class="app-container" ref="formsRef" :class="className" :style="myStyle"  @click="onClick"  :itemStyle="itemStyle" :panelStyle="panelStyle">
        <div class="filter-container" style="padding:0;padding-top:10px;background:#D8DCE5" >
         <el-button type="primary"     class="filter-item" icon="el-icon-refresh"  @click="query()" >
             {{ $t("common.btn.query") }}
          </el-button>
          <el-button type="info"     class="filter-item" icon="el-icon-refresh-right" @click="reset" >
             {{ $t("common.btn.reset") }}
          </el-button>
          <el-button type="primary" v-show="isShowExport"  icon="el-icon-download"  class="filter-item" @click="selectFields" >
             {{ $t("common.btn.export") }}
          </el-button>
          <el-button type="primary"  v-show="reback!='' && (typeof reback !==undefined)"  icon="el-icon-arrow-left"   class="filter-item" @click="rebackEvent(reback)" >
             {{ $t("common.btn.reback") }}
          </el-button>
        </div>
        <hr style="background:#D8DCE5">
        <div class="filter-container">
            <div   v-for="(item,index1) in properties" :key="index1" style="display:inline">
                  <el-input  v-if="item.query && item.queryType==='input'" v-model="attr[item.field]" :placeholder="item.title" :style="'width:' +(item.width||180)+'px;min-width:'+item.minWidth+'px;'" class="filter-item">
                     <!-- {{queryParams.requestData[item.field]=''}} -->
               </el-input>
                  <el-select   v-if="item.query && item.queryType==='select'" v-model="attr[item.field]" :placeholder="item.title" :style="'width:' +(item.width||180)+'px;min-width:'+item.minWidth+'px;'" class="filter-item">
                    <el-option
                    v-for="item in initSelect[item.field]"
                    :key="item.value"
                    :label="commonI18n(item)"
                    :value="item.value">
                  </el-option>
               </el-select>
                <el-date-picker v-if="item.query && item.queryType==='datetime'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"  v-model="attr[item.field]"  type="datetime"   :placeholder="item.title"  style="width: 150" class="filter-item"> </el-date-picker>
                <el-date-picker v-if="item.query && item.queryType==='date'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"  v-model="attr[item.field]"  type="date"   :placeholder="item.title"  style="width: 150" class="filter-item"> </el-date-picker>
                 <!-- :picker-options="pickerOptions" -->

                <el-date-picker
                v-if="item.query && item.queryType==='datetimerange'"
                 range-separator="至"

                format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                v-model="attr[item.field]"
                type="datetimerange"
                :start-placeholder="'开始'+item.title"
                :end-placeholder="'结束'+item.title"
                :placeholder="commonI18n(item)"
                style="width: 150"
                class="filter-item"> </el-date-picker>

            </div>
            <br>
          <div v-for="(item,index) in cols" :key="index" style="display:inline">
                  <el-input  v-if="item.query && item.queryType==='input'" v-model="queryParams.requestData[item.field]" :placeholder="item.title" :style="'width:' +(item.width||180)+'px;min-width:'+item.minWidth+'px;'" class="filter-item">
                     <!-- {{queryParams.requestData[item.field]=''}} -->
               </el-input>
                  <el-select   v-if="item.query && item.queryType==='select'" v-model="queryParams.requestData[item.field]" :placeholder="item.title" :style="'width:' +(item.width||180)+'px;min-width:'+item.minWidth+'px;'" class="filter-item">
                    <el-option
                    v-for="item in initSelect[item.field]"
                    :key="item.value"
                    :label="commonI18n(item)"
                    :value="item.value">
                  </el-option>
               </el-select>
                <el-date-picker v-if="item.query && item.queryType==='datetime'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"  v-model="queryParams.requestData[item.field]"  type="datetime"   :placeholder="item.title"  style="width: 150" class="filter-item"> </el-date-picker>
                <el-date-picker v-if="item.query && item.queryType==='date'" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"  v-model="queryParams.requestData[item.field]"  type="date"   :placeholder="item.title"  style="width: 150" class="filter-item"> </el-date-picker>
                 <!-- :picker-options="pickerOptions" -->

                <el-date-picker
                v-if="item.query && item.queryType==='datetimerange'"
                 range-separator="至"

                format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                v-model="queryParams.requestData[item.field]"
                type="datetimerange"
                :start-placeholder="'开始'+item.title"
                :end-placeholder="'结束'+item.title"
                :placeholder="commonI18n(item)"
                style="width: 150"
                class="filter-item"> </el-date-picker>
          </div>

        </div>
     <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"  @row-dblclick="showDetails" >

      <el-table-column min-width="50px"  label="序号" align="center" fixed>
        <template slot-scope="scope">
           <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column   v-for="(item) in cols"  :key="item.id" :label="commonI18n(item)" :prop="item.field"  :width="item.width" :min-width="item.minWidth"  v-if="!item.hide" :fixed="item.oper?'right':false"  :align="item.align"  show-overflow-tooltip>
                  <template  slot-scope="{row}" >
                      <div  v-if="!item.oper"  >
                         {{commonFilter(row[item.field],item.field)}}
                      </div>
                      <div v-if="item.oper" >
                           <el-button type="primary" size="small"   :icon="btn.icon" v-for="(btn) in item.button" :key="btn.title" @click="(typeof item.click===undefined || !btn.click)?null:externalFunc('externalFunc_'+btn.click,btn,row)">
                             {{btn.title}}
                       </el-button>
                      </div>
                  </template>
      </el-table-column>

    </el-table>

    <pagination v-if="page" v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.pageSize" @pagination="getList" :page-sizes="pageSizes" />
    <el-dialog title="编辑" v-el-drag-dialog :visible.sync="dialogFormVisible" width="700px" >
      <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="80px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item  v-if="item.set && item.queryType==='input'" :label="item.title" :prop="item.field"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
          >
            <!--:disabled="item.isEdit && item.disable"-->
             <el-input  v-model="defaultForm.params[item.field]" />
          </el-form-item>
           <el-form-item  v-if="item.set && item.queryType==='select'" :label="item.title"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'change' }]"
           >
              <el-select v-model="defaultForm.params[item.field]" @change="$forceUpdate()" placeholder="请选择">
                <el-option
                  v-for="item in initSelect[item.field]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="destory(false)">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.id==='' || defaultForm.params.id===null" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.id!='' && defaultForm.params.id!=null" @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>


    <!--处理导出字段选择的穿梭-->

     <el-dialog title="导出字段选择" v-el-drag-dialog :visible.sync="dialogEcportVisible" width="700px" >
      <el-form ref="exportColumn" :inline="true" :model="exportColumn" label-width="80px">

          <template>
                 <el-transfer v-model="exportColumn.fields"
                  :titles="['源字段', '目标字段']"
                  :data="exportColumn.colMap"></el-transfer>
          </template>
      </el-form>
      <div>
         <span>
           {{'说明：当前最多导出['}}
         </span>
         <span style="color:red;margin-top:10px;">{{(currScripts.exportRow||1000)}}</span>
          <span>
           {{']条'}}
         </span>
      </div>
      <div slot="footer" class="dialog-footer" >
        <el-button type="primary"  @click="exportCSV()">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>
    <Chartmodule
      v-if="Object.values(allchartdata).length>0"
      :currScripts="currScripts"
      :allchartdata="allchartdata"
      :externalreportdata="externalreportdata"
    />


  </div>
</template>

<script>
import Chartmodule from "./chart_module";
import elDragDialog from "@/directive/el-drag-dialog";
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import i18n from '@/lang';
import axios from 'axios'
import { getToken } from '@/utils/auth'
import common from '@/utils/common'
export default {
  name: 'CwCommonForm',
  components: { Pagination,Chartmodule},
  directives: { elDragDialog },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '未启用',
        1: '启用'
      }
      return statusMap[status]
    }
  },
  data() {
    const  _initdata ={
      methods:{},
      vueContext:{},
      dialogFormVisible: false,
      dialogEcportVisible:false,
      queryParams:{
        requestData:{ }
        },
      reback:'',
      currScripts:{},
      initSelect:{
         trayType:[],
         useState:[{label:'启用',value:0},{label:'警用',value:1}]
      },
      externalEvent:{},
      querySql:{
        where:[],
        sqlArgs:[]
      },
      isShowExport:false,
      parameters:[],
      externalreportdata:[],
      allchartdata:{},
      paramType:0,
      biz:{
          reportOptions:[],
          reportTypes:[],
          bizId:'',
          bizCode:"",
          bizType:"",
          bizKey:{}
      },
      exportColumn:{
        origin:{},
        fields:[],
        colMap:[]
      },
      defaultForm: {
        row:{},
        params:{
         id:'',
        }
      },
      list: null,
      total: 0,
      pageSizes:[10,20,30,50],
      listLoading: false,
      page:true,
      listQuery: {
        current: 1,
        pageSize: 20
      },
      cols: [],
      timeData: "",
      properties:[],
      dynamicDataSource:undefined,
      attr:{}
    }
    Object.assign(_initdata.defaultForm.params,this.initData(_initdata.cols))
    return _initdata
  },
  props: {
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
          return { color:'black',width:'100%',backgroundColor: 'rgba(227, 237, 233, 1)'}
        }
      },
      itemStyle: {
        type: Object,
        default: () => {
          return {}
        }
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
      list(val){
       if(Array.isArray(val) && val.length>0)
         this.isShowExport=true
        else
         this.isShowExport=false
      },
      itemVal: {
        handler: function (newVal, oldVal) {
        },
        deep: true
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
      component: {
        handler: function(newVal, oldVal){
        },
        deep: true,
        immediate: true,
      },
      'component.elementCode': {
        handler: function(newVal, oldVal){},
        deep: true,
        //immediate: true,
      },
    },
  computed: {},
  created() {
    //this.getList()
    this.initScriptByCode()
    this.selectOptions()
  },
  methods: {
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
          { field: 'bizCode', title: 'bizCode', queryType: 'input', require: false, query: true, hide: false },
          { field: 'bizType', title: 'bizType', queryType: 'input', require: false, query: true, hide: false },
        ]
      },
      onClick(e){},
      handleDragStart(event) { 
        event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY,action:'setLocation',compId:this.compId}));
      },
      handleDragEnd() { },

      comText() {
            return '报表模板'
      },
      ificationType() {
        return {
          classification: '布局容器组件',
          isCanvasview: false,
        }
      },
      initReportMeta(typeCode,callback,action=true){
          if(!typeCode){
                this.$message({
                        type: 'info',
                        message: '初始化常量没有指定编码'
              });
          }
        if(callback && typeof callback =='function' && action){
          const _data = {url:'/codes/guest/get-type-code',params:{data:typeCode}}
          this.$store.dispatch('fmsCommon/actionTaskPost',_data)
          .then(data => {
              callback(this,this.cols,data)
          }).catch(err => {
              console.error(err)
          })
        }else{
              callback(this,this.cols)
        }
    },
    actionType(){
      //获取所有报表
       let _data = {url:'/external/guest/biz-id',params:{data:this.biz.bizType}}
       this.$store.dispatch('fmsCommon/actionTaskPost',_data)
      .then(data => {
             this.biz.reportOptions = data.map(c=>{
             this.biz.bizKey[c.bizCode] =c.id
             return {
               label:c.bizName,
               value:c.id
             }
           })
       }).catch(err => {
          console.error(err)
       })
    },
    initScriptByCode(){
       // const _params = this.$route.params
       let code = this.component.attribute.bizCode, type = this.component.attribute.bizType;
       const _params = {
          bizCode: code,
          bizType: type,
       }
       const _data = {url:'/external/guest/biz-type-code',params:{data:_params}}
       this.$store.dispatch('fmsCommon/actionTaskPost',_data).then(data => {
            if(data || data.length>0){
                 const scrpt = data[0]
                 this.biz.bizId = scrpt.id
                 this.actionReport(null)
            }else{
                  this.$message({
                    type: 'info',
                    message: '没有找到业务类型对应的报表，请联系管理员检查参数配置'
                  });
                  return
            }
        })
    },
    getScriptByCodeAndAction(bizType,bizCode,callback,load=false){
       const _params ={bizType:bizType,bizCode:bizCode}
       const _data = {url:'/external/guest/biz-type-code',params:{data:_params}}
        this.$store.dispatch('fmsCommon/actionTaskPost',_data).then(data => {
            if(data || data.length>0){
                if(callback && typeof callback ==="function"){
                   callback(bizType,bizCode)
                }
                const scrpt = data[0]
                this.biz.bizId = scrpt.id
                this.actionReportByCode(scrpt,load)
            }else{
                  this.$message({
                    type: 'info',
                    message: '没有找到业务类型对应的报表，请联系管理员检查参数配置'
                  });
                  return
            }
        })
    },

    actionReportByCode(data,load=false){
        this.listLoading= false
        const _this = this
         this.reback =''
        if(!load){
        this.queryParams.requestData = {}
        }
        const val = this.biz.bizId
        this.externalEvent = {}
        _this.currScripts = eval("("+data.scripts+")")
            //先初始化
            if(_this.currScripts.init){
                for(let func in _this.currScripts.init){
                    this.initReportMeta(bizType,_this.currScripts.init[func],false)
                }
            }
            if(_this.currScripts.initConstant){
                for(let bizType in _this.currScripts.initConstant){
                    this.initReportMeta(bizType,_this.currScripts.initConstant[bizType])
                }
            }

             this.properties =  _this.currScripts.properties
             if(this.properties && this.properties.length>0){
                 this.properties.forEach(c=>{
                    this.$set(this.attr,c.field,undefined)
                 })
             }
             this.dynamicDataSource = _this.currScripts.dynamicDataSource

            //先创建表单属性，否则会出现单向绑定的问题
             this.reback = _this.currScripts.back||''
             //处理分页
             this.listQuery.current = _this.currScripts.current || this.listQuery.current
             this.listQuery.pageSize= _this.currScripts.pageSize || this.listQuery.pageSize
             this.pageSizes = _this.currScripts.pageSizes||this.pageSizes
             this.initSelect= {..._this.currScripts.initSelect,...this.initSelect} || {...this.initSelect}
             this.page=_this.currScripts.page || this.page
             if(!this.page){
               this.listQuery.curren=1
               this.listQuery.pageSize=10000000000
             }
         if(!load){
             this.reback =''
             _this.currScripts.cols.map(c=>{
               _this.$set( this.queryParams.requestData,c.field,undefined)
            })
           }
            this.cols =  _this.currScripts.cols

            
            //externalFunc
            for(let item of _this.currScripts.cols ){
                if(item.button && typeof item.button!==undefined){
                  for(let btn of item.button){
                      this['externalFunc_'+btn.click] = _this.currScripts[btn.click]
                  }
                }
            }

            this.paramType = _this.currScripts.paramType||0
            this.list =[]
            this.total =0
            if(load) this.query()
      },
     actionReport(id,load=false){
        this.listLoading= false
        const _this = this
         this.reback =''
        if(!load){
        this.queryParams.requestData = {}
        }
        const val = this.biz.bizId
        const _data = {url:'/external/query-script',params:{data:val}}
        this.externalEvent = {}
        this.$store.dispatch('fmsCommon/actionTaskPost',_data)
        .then(data => {
            _this.currScripts = eval("("+data.scripts+")")
            //先初始化
            if(_this.currScripts.init){
                for(let func in _this.currScripts.init){
                    this.initReportMeta(bizType,_this.currScripts.init[func],false)
                }
            }
            if(_this.currScripts.initConstant){
                for(let bizType in _this.currScripts.initConstant){
                    this.initReportMeta(bizType,_this.currScripts.initConstant[bizType])
                }
            }

             this.properties =  _this.currScripts.properties
             if(this.properties && this.properties.length>0){
                 this.properties.forEach(c=>{
                    this.$set(this.attr,c.field,undefined)
                 })
             }
             this.dynamicDataSource = _this.currScripts.dynamicDataSource

            //先创建表单属性，否则会出现单向绑定的问题
             this.reback = _this.currScripts.back||''
             //处理分页
             this.listQuery.current = _this.currScripts.current || this.listQuery.current
             this.listQuery.pageSize= _this.currScripts.pageSize || this.listQuery.pageSize
             this.pageSizes = _this.currScripts.pageSizes||this.pageSizes
             this.initSelect= {..._this.currScripts.initSelect,...this.initSelect} || {...this.initSelect}
             this.page=_this.currScripts.page || this.page
             if(!this.page){
               this.listQuery.curren=1
               this.listQuery.pageSize=10000000000
             }
         if(!load){
             this.reback =''
             _this.currScripts.cols.map(c=>{
               _this.$set(this.queryParams.requestData,c.field,undefined)
            })
            
           }
            this.cols =  _this.currScripts.cols
            //externalFunc
            for(let item of _this.currScripts.cols ){
                if(item.button && typeof item.button!==undefined){
                  for(let btn of item.button){
                      this['externalFunc_'+btn.click] = _this.currScripts[btn.click]
                  }
                }
            }

            this.paramType = _this.currScripts.paramType||0

            this.list =[]
            this.total =0
            if(load) {
              this.query()
            }
        }).catch(err => {
            console.error(err)
        })
      },
      externalFunc(func,btn,row){
            // this.list =[]
            // this.total =0
            // this.querySql.where=[]
            // this.querySql.sqlArgs=[]
            // this.parameters = {}
            this[func](btn,row)
      },
      rebackEvent(val){
		    this.biz.bizId=this.biz.bizKey[val]
        this.$forceUpdate()
		    this.actionReport(null,true)
      },
      selectFields(){

          this.dialogEcportVisible = true
          this.exportColumn.colMap=[]
          this.exportColumn.fields=[]
          this.exportColumn.origin = {}
          this.currScripts.cols.forEach(item=>{
             if(item.export){
             this.exportColumn.origin[item.field] = item.title
             this.exportColumn.colMap.push({
                  key: item.field,
                  label: item.title,
                  disabled: false
              })
            }
          })
      },
      exportCSV(){
          const {where,sqlArgs,parameters} = this.setSqlWhere()
          const fields = {}
          // this.currScripts.cols.forEach(item=>{
          //    if(item.export){
          //      fields[item.field] = item.title
          //    }
          // })
          this.exportColumn.fields.forEach(item=>{
            if(this.exportColumn.origin[item])
               fields[item]=this.exportColumn.origin[item]
          })


          if(this.exportColumn.fields.length==0)
             {
                    this.$message({
                    type: 'info',
                    message: '没有需要导出的字段'
                  });
                  return
             }

          let args = {
           id:this.biz.bizId,
           //totalSql:this.currScripts.totalSql ,
           //sql:this.currScripts.sql,
           exportRow:this.currScripts.exportRow,
            exportType:this.currScripts.exportType||'csv',
           fields:fields,
           parameters:parameters,
           paramType:this.paramType
        }


       if(sqlArgs.length>0){
              Object.assign(args,{args:sqlArgs})
          }
        if(where.length>0){
          Object.assign(args,{where:' where ' +where.join(" and ")})
        }

        axios.post(common.taskPath("/external/report-export"), {data:args}, {
            responseType: 'arraybuffer',
            headers: {Authorization: 'Bearer ' + getToken() },
        }).then((res) => {
            let fileName = decodeURI(res.headers['content-disposition'].split(';')[1].split('=')[1]);
            this.exportSearchList(fileName, res.data);
        }).catch().finally(()=>{
          this.dialogEcportVisible = false
        });

      },
       exportSearchList(dowLoadFileName, result) {
                  let blob = new Blob([result]);
                  const fileName = dowLoadFileName;
                  // 判断浏览器
                  var brower = '';
                  if (navigator.userAgent.indexOf('Edge') > -1) {
                      brower = 'Edge';
                  }

                  if ('download' in document.createElement('a')) {
                      // 非IE下载
                      if (brower == 'Edge') {
                          navigator.msSaveBlob(blob, fileName);
                          return;
                      }
                      const elink = document.createElement('a');
                      elink.download = fileName;
                      elink.style.display = 'none';
                      elink.href = URL.createObjectURL(blob);
                      document.body.appendChild(elink);
                      elink.click();
                      URL.revokeObjectURL(elink.href);
                      // 释放URL 对象
                      document.body.removeChild(elink);
                  } else {
                      // IE10+下载
                      navigator.msSaveBlob(blob, fileName);
                  }
               },
      setSqlWhere(){
          const where = this.querySql.where=[]
          const sqlArgs = this.querySql.sqlArgs=[]
          const parameters =this.parameters = {}
          if(typeof this.currScripts.cols===undefined || !Array.isArray(this.currScripts.cols) || this.currScripts.cols.length<=0)
          {
            this.$message({
                    type: 'info',
                    message: '没有回去到报表信息，请先选择报表再查询'
            })
            return {where:undefined,sqlArgs:undefined,parameters:undefined}
          }
            let isRequest =  {where:undefined,sqlArgs:undefined,parameters:undefined}
          try{
           if(this.currScripts.queryCtrl && (typeof this.currScripts.queryCtrl=="function" || typeof this.currScripts.queryCtrl===Function)){
              const {isRelease,error} = this.currScripts.queryCtrl(this.queryParams.requestData)
              if(!isRelease){
                  throw new Error(`条参数错误:${error}`);
              }
           }
          this.currScripts.cols.forEach(item => {
              if(item.query|| item.where){

                  const cond = item.cond||'='
                  if(item.require){
                       if(typeof this.queryParams.requestData[item.field]===undefined ||this.queryParams.requestData[item.field] =='' || this.queryParams.requestData[item.field]==null){
                           throw new Error(`查询条件${item.title}不能为空`);
                       }
                  }
                  if(typeof this.queryParams.requestData[item.field]===undefined ||this.queryParams.requestData[item.field] =='' || this.queryParams.requestData[item.field]==null)
                   {return }
                    //先处理引用参数
                   parameters[item.field] =this.queryParams.requestData[item.field]
                   if(cond=='like')
                     {
                         where.push(item.field+" like '%"+this.queryParams.requestData[item.field]+"%'")
                     }
                    else if(cond=='like%' ) {
                     where.push(item.field+" like '"+this.queryParams.requestData[item.field]+"%'")
                    }
                    else if(cond=='%like' ) {
                     where.push(item.field+" like '%"+this.queryParams.requestData[item.field]+"'")
                    }
                    else  if(cond=='=~')
                     {
                         where.push(item.field+" =~/"+this.queryParams.requestData[item.field]+"/ ")
                     }
                    else if(cond=='^=~' ) {
                     where.push(item.field+" =~ /^"+this.queryParams.requestData[item.field]+"/ ")
                    }
                    else if(cond=='=~$' ) {
                     where.push(item.field+" like /"+this.queryParams.requestData[item.field]+"$/ ")
                    }
                    else if(cond =='in'){
                       if(this.paramType==1){
                           throw new Error(`不支持的条件参数`);
                       }
                        if(this.queryParams.requestData[item.field]){
                            const arrs = this.queryParams.requestData[item.field].split(",")
                            if(Array.isArray(arrs) && arrs.length>0){
                               const _args = []
                                arrs.forEach(item=>{
                                    _args.push('?')
                                    sqlArgs.push(item)
                                })
                                  where.push(item.field+ " "+cond+"("+_args.join(",")+")")
                            }

                        }
                    }
                    else if(item.queryType=='datetimerange'){
                         if(this.queryParams.requestData[item.field][1] && !this.queryParams.requestData[item.field][0]){
                           throw new Error(`时间范围不能只包含结束时间`);
                         }
                         if(item.time_size && item.time_size>0)
                           {
                             let start= new Date()
                             let stop = new Date()
                             if(this.queryParams.requestData[item.field][1]&& this.queryParams.requestData[item.field][1]!=null&& this.queryParams.requestData[item.field][1]!='')
                              {
                                 stop = new Date(this.queryParams.requestData[item.field][1])
                              }
                              if(this.queryParams.requestData[item.field][0] && this.queryParams.requestData[item.field][0]!=null&& this.queryParams.requestData[item.field][0]!=''){
                                 start = new Date(this.queryParams.requestData[item.field][0])
                              }
                              if(stop<start){
                                   throw new Error(`时间范围不正确`);
                              }
                             let dc = (stop - start)/1000/60/60
                             if(parseInt(dc)>parseInt(item.time_size)){
                                  throw new Error(`查询日期范围不能超过${item.time_size}h`);
                             }
                           }
                         where.push(item.field+ ">= ?")
                         sqlArgs.push(this.queryParams.requestData[item.field][0])
                         where.push(item.field+ "< ?")
                         sqlArgs.push(this.queryParams.requestData[item.field][1])

                    }

                     else
                     {
                     where.push(item.field+ " "+cond+" ?")
                     sqlArgs.push(this.queryParams.requestData[item.field])
                   }
              }
          });
          }catch(e){
            this.$message({
                  type: 'info',
                  message: e.message
              })
              return isRequest
          }
         return {where:where,sqlArgs:sqlArgs,parameters:parameters}
      },
      requestData(){
        //计算条件
        const {where,sqlArgs,parameters} = this.setSqlWhere()
        if(!where ||!sqlArgs ||!parameters)
          {
            this.listLoading=false
            return
          }
        let args = {
           id:this.biz.bizId,
           //totalSql:this.currScripts.totalSql ,
           //sql:this.currScripts.sql,
           parameters:parameters,
           paramType:this.paramType
        }
        if(this.properties){
           for(let prop of this.properties){
                if(prop.require && (!this.attr[prop.field] ||this.attr[prop.field]==null || this.attr[prop.field]=='' )){
                     this.$message({
                       type: 'info',
                      message: `字段${prop.title}是必填项`
                     })
                  return
                }
           }
           Object.assign(args,{properties:this.attr})
        }
        if(this.dynamicDataSource){
          Object.assign(args,{dynamicDataSource:this.dynamicDataSource})
        }
        Object.assign(args,this.listQuery)
        if(sqlArgs.length>0){
            Object.assign(args,{args:sqlArgs})
        }
        if(where.length>0){
          Object.assign(args,{where:' where ' +where.join(" and ")})
        }
        this.listLoading = true
        const _data = {url:'/external/report-data',params:{data:args}}
        this.$store.dispatch('fmsCommon/actionTaskPost',_data)
        .then(data => {
            this.list = data.data
            this.total = data.total
            this.listLoading = false
        }).catch(err => {
            console.error(err)
        })
      },
      //===================================================== 解决图表部分 BEGIN=========================================================================
      // requestChartData(){
      //     let script = this.currScripts
      //         if(!script.chart || !script.chart.allow){
      //             return;
      //         }             
      //         let qyList = script.chartListQuery||{  current: 1,pageSize: 20}
      //         //计算条件
      //         const {where,sqlArgs,parameters} = this.setSqlWhere()
      //         if(!where ||!sqlArgs ||!parameters)
      //           {
      //             this.listLoading=false
      //             return
      //           }
      //         let args = {
      //           id:this.biz.bizId,
      //           //totalSql:this.currScripts.totalSql ,
      //           //sql:this.currScripts.sql,
      //           parameters:parameters,
      //           paramType:this.paramType
      //         }
      //         if(this.properties){
      //           for(let prop of this.properties){
      //                 if(prop.require && (!this.attr[prop.field] ||this.attr[prop.field]==null || this.attr[prop.field]=='' )){
      //                     this.$message({
      //                       type: 'info',
      //                       message: `字段${prop.title}是必填项`
      //                     })
      //                   return
      //                 }
      //           }
      //           Object.assign(args,{properties:this.attr})
      //         }
      //         if(this.dynamicDataSource){
      //           Object.assign(args,{dynamicDataSource:this.dynamicDataSource})
      //         }
      //         Object.assign(args,qyList)
      //         if(sqlArgs.length>0){
      //             Object.assign(args,{args:sqlArgs})
      //         }
      //         if(where.length>0){
      //           Object.assign(args,{where:' where ' +where.join(" and ")})
      //         }
      //         this.listLoading = true
      //         const _data = {url:'/external/report-data',params:{data:args}}
      //         this.$store.dispatch('fmsCommon/actionTaskPost',_data)
      //         .then(data => {
      //             this.renderDataChart(script,data.data)
      //             this.externalreportdata = data.data

      //         }).catch(err => {
      //             console.error(err)
      //         })
      //  },
       
       renderDataChart(script,data){
          if(data==null || data.length==0)
            return;
            let cols = script.cols  
            if(cols && script.chart && script.chart.plot){
              script.cols.forEach(c=>{
                  if(c.isChart && script.chart.plot[c.field]){
                      
                      // let callback = script.chart.plot[c.field]
                      // if(callback && typeof callback =='function'){    
                         let  y_data = data.map(d=>d[c.field])
                        //  callback(c.title,script.cols,y_data,data)
                      // } 
                        //  this.allchartdata[c.field] = data.map(d=>d[c.field])
                        this.$set(this.allchartdata,c.field,data.map(d=>d[c.field]))
                  }
              })
          }
       },

//===================================================== 解决图表部分 END===========================================================================

     initData(arr){
       let args = {}
          arr.map(c=>{
            if(c.set){
              args[c.field] = null
            }
          })
          return args
        },
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
    getList() {
    //   this.listLoading = true
    //   Object.assign(this.queryParams,this.listQuery)
    //   const _data = {url:'/tool/list',params:this.queryParams}
    //   this.$store.dispatch('fmsCommon/actionFmsPost',_data)
    //   .then(data => {
    //       this.list = data.data
    //       this.total = data.total
    //       this.listLoading = false
    //    }).catch(err => {
    //       console.error(err)
    //    })
    //   httpUtils.actionFmsPost('/line/list',this.listQuery).then(data => {
    //       console.log(data)
    //   })
          this.requestData()
    },

    getValueConvert(arr,value){
          for(let v of arr){
            if(v.value ==value )
              {
                return v.label
              }
        }
        return value
    },
  destory(hide=false){
    this.dialogFormVisible = hide
       for(let p in this.defaultForm.params){
        if(this.defaultForm.params.hasOwnProperty(p)){
          this.defaultForm.params[p]=''
        }
     }
  },
  add(){
     this.destory(true)
  },
  showDetails(row, column){
  },
  edit(row){
    this.dialogFormVisible = true
     for(let p in this.defaultForm.params){
        if(this.defaultForm.params.hasOwnProperty(p)){
          this.defaultForm.params[p]=row[p]
        }
     }
  },
  submit(formName){
       const _data = {url:'/tool/add',params:{
          data:this.defaultForm.params
       }}
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$store.dispatch('fmsCommon/actionFmsPost',_data)
              .then(data => {
              this.$message({
                    type: 'success',
                    message: 'change success!=>'+data
                  });
                  this.dialogFormVisible = false
                  this.query()
              }).catch(err => {
                  console.error(err)
              }).finally(()=>{
                  this.destory()
                })
          } else {
            this.$message({
                    type: 'error',
                    message: '输入数据不能为空'
                  });
             this.destory()
          }
        });
  },
  query(){
     this.listQuery.current =1
     this.requestData()
    //  this.requestChartData()
   },
   reset(){
     for(let p in  this.queryParams.requestData){
        if(this.queryParams.requestData.hasOwnProperty(p)){
          this.queryParams.requestData[p]=''
        }
     }
   },
   selectOptions(){
        //获取报表类别
    //    let _data = {url:'/external/guest/biz-types',params:{}}
    //    this.$store.dispatch('fmsCommon/actionTaskPost',_data)
    //   .then(data => {
    //        this.biz.reportTypes = data.map(c=>{
    //          return {
    //            label:c.bizTypeName,
    //            value:c.bizType
    //          }
    //        })
    //    }).catch(err => {
    //       console.error(err)
    //    })
       //初始化工序信息
      },
   save(formName){
      this.defaultForm.row = {}
      this.defaultForm.params.id=''
      let _data = {url:'/tool/add',params:{data:this.defaultForm.params}}
         this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$store.dispatch('fmsCommon/actionFmsPost',_data)
              .then(data => {
              this.$message({
                    type: 'success',
                    message: 'change success!=>'+data
                  });
                  this.dialogFormVisible = false
                  this.query()
              }).catch(err => {
                  console.error(err)
              }).finally(()=>{
                  this.destory()
                })
          } else {
            this.$message({
                    type: 'error',
                    message: '输入数据不能为空'
                  });
             this.destory()
          }
        });


   },
   del(index,row){
      this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
                const _data = {url:'/tool/del',params:{data:row.id}}
                this.$store.dispatch('fmsCommon/actionFmsPost',_data)
                .then(data => {
                      this.list.splice(index, 1)
                      this.$message({
                      type: 'success',
                      message: 'delete success!'
                    });
                }).catch(err => {
                    console.error(err)
                })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'cancel delete'
          });
        })
   }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.filter-item{
  margin-left: 3px;
}

</style>
