<template>
  <div>
    <CwFlowComponent @submit="submit" 
    :formData = defaultForm.params 
    :tempDoc="component.attribute.templateDocNo" 
    :formName ="$refs['defaultForm.params']" 
    :wfApproveDisplay="true" 
    @initFromData="initFromData"
    @initData="init"
    ref="myFlowForm"
    @beforeApprove="beforeApprove"
    @afterApprove="afterApprove"
    @beforeCreate="beforeCreate"
    @afterCreate="afterCreate"
    >
      <template  #flowForm="{flowData}">
        <div  style="min-height: 400px;">
          <CwSubPanelPreview 
            :component="component"
            :componentData="componentData"
            :itemStyle="{width:'100%',minHeight:'400px',height:'auto'}"
         />
        </div>
      </template>
      </CwFlowComponent>
    </div>

</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
//import CwFlowComponent from '../RefComponent/CwFlowComponent'
import CwFlowComponent from '@/views/bpm/components/tabapproval.vue'

import CwSubPanelPreview from "./CwSubPanelPreview.vue"
import {dispatchEvent} from "../utils/eventUtils"


import common from '@/utils/common'
export default {
  name:'CwWorkFlowPreview',
  directives: { elDragDialog }, 
  components: { CwFlowComponent,CwSubPanelPreview },
  props: {
    items: {
      type: Array,
      default: function() {
        return []
      }
    },
    title: {
      type: String,
      default: 'vue'
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
      selfAttribute:{

      },  
      myStyle: {
        type: Object,
        default: () => {
          return { color:'black' }
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
      componentData: {
      type: Array,
      default: () => {
        return []
      }
     },
    bindData:{
      type: Object,
      default: () =>{}
    },
  },
  data() {
    const _initdata = {
      methods:{},
        vueContext:{},
        Schedulingobj:{
          codeUrl: '',
          orderNo: '',
        },
        finshobj:{
          decsisonState: '',
          id: '',
        },
        self:this,
        tempDocNo:'',
        table_mark: 'ng-disposal',
        qrcodedialogVisible: false,
        dialogfinsh:false,
        dialogFormVisible: false,
              allowDisable: false,
        dialogSelectFieldVisible: false,
        queryParams: {
          requestData: { }
          },
        flowSubmit:undefined,   
        initSelect: {
          orderState: [],
           orderType: [],
          electrode: [{ label: '正极', value: 1 }, { label: '负极', value: 2 }],
          useState: [{ label: '启用', value: 0 }, { label: '警用', value: 1 }],
          factoryNo: []
        },
        url: {
            add: '/ng-disposal/add',
            del: '/ng-disposal/del',
            list: '/ng-disposal/items'
        },
        defaultForm: {
          row: {},
          params: {
           id: '',
           items:[]
          }
        },
        selectColumn: {
          origin: {},
          fields: [],
          colMap: []
        },
        func:{},
        $script:undefined,
        handler:undefined,
        selectViewCol: [],
        list: null,
        total: 0,
        userInfo:undefined,
        listLoading: false,
        listQuery: {
          current: 1,
          pageSize: 15
        },
        rowData:{},
        addcols:[],
        editcols:[],
        cols: [   

        ],
        table:{
          column:[]
        },
        wfParams:{
              nextUser:'',
              nextUserName:'',
              nextUserId:''
          },
        globalData:undefined
      }
      Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
      return _initdata
  },
  created() {
       let userinfo = sessionStorage.getItem("sess_cuur_userinfo")
       if(userinfo){
          this.userInfo = JSON.parse(userinfo)          
       }
       this.tempDocNo=this.component.attribute.templateDocNo
  },
  methods: {
      comText() {
        return '流程模板'
      },
      getStyleCols() {
    return [
      { field: 'width', title: '长度', queryType: 'input', defaultValue: '100%', unit: 'px' },
      { field: 'height', title: '高度', queryType: 'input', defaultValue: '100%', unit: 'px' },
      { field: 'fontSize', title: '字体大小', queryType: 'input', defaultValue: '16px', unit: 'px' },
      { field: 'borderColor', title: '边框颜色', queryType: 'colorpicker', defaultValue: '', },
      { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', defaultValue: 'none', },
      { field: 'overflowX', title: 'X滚动轴', queryType: 'select', },
      { field: 'overflowY', title: 'Y滚动轴', queryType: 'select', },
      { field: 'minWidth', title: '最小宽度', queryType: 'input', },
      { field: 'maxWidth', title: '最大宽度', queryType: 'input', },
      { field: 'minHeight', title: '最小高度', queryType: 'input', },
      { field: 'maxHeight', title: '最大高度', queryType: 'input', },
    ]
  },
    convertUserData(item){
      if(this.userInfo && item.userProp){
        if(this.defaultForm.params[item.field]&& this.defaultForm.params[item.field]!==null && this.defaultForm.params[item.field]!=='')
          return this.defaultForm.params[item.field]
        this.defaultForm.params[item.field]=this.userInfo[item.userProp]
        return this.userInfo[item.userProp]
      }
    },
    tableEdit(table,flow){   
      if(table && typeof table.tableEdit==='function'){
            return table.tableEdit(table,flow)
          }
        else {
          return false
        }  
    },
    tableDisplay(table,flow){

      if(table && typeof table.tableDisplay==='function'){
            return table.tableDisplay(table,flow)
          }
        else {
          return false
        }   
  },
    btnOnclick(callback,v1,v2){
      const self = this
      if(!this.defaultForm.params.items){
        this.$set(this.defaultForm.params,'items',[])
      }
      if(callback && typeof callback==='function')
        return callback(self,this.defaultForm.params.items,v1,v2)
    },
    commonFilter(value, type) {
    if (
      this.initSelect.hasOwnProperty(type) &&
      typeof this.initSelect[type] != undefined &&
      Array.isArray(this.initSelect[type])
    ) {
      return this.getValueConvert(this.initSelect[type], value);
    }
    if (
      this.initSelect.hasOwnProperty(type) &&
      !Array.isArray(this.initSelect[type]) &&
      this.initSelect[type].hasOwnProperty(value)
    ) {
      return this.initSelect[type][value];
    }
    return value;
  },
   onchange(callback,v1,v2,v3){
      const self = this
      if(callback && typeof callback==='function')
        return callback(self,v1,v2,v3)
   }, 
   methodFunc(callback,v1,v2){
      const self = this
      if(callback && typeof callback==='function')
        return callback(self,v1,v2)
   },
   post(url,params,callback,errorBack){
    let _dataNode = { url: url, params: params}
       this.$store.dispatch('fmsCommon/action', _dataNode)
      .then(idata => {
         //绑定下一个节点
         if(callback && typeof callback==='function'){
          callback(data)
         }
      }).catch(err => {
        if(errorBack && typeof errorBack==='function')
           errorBack(err)
         else 
            console.error(err)
    })
   }, 
   beforeApprove(data,callback){
      let args = []
      args.push(data)
      args.push(this.globalData)
      args.push(callback)
      //console.log(this,this.$refs,this.$refs.myrefTree)
      this.$nextTick(()=>{
        const ele = this.$el//$refs.myrefTree.$el
        if(ele){
          dispatchEvent(ele,'beforeApprove',args)
         }
      })
     },
     afterApprove(data,callback){
      let args = []
      args.push(data)
      args.push(this.globalData)
      args.push(callback)
      //console.log(this,this.$refs,this.$refs.myrefTree)
      this.$nextTick(()=>{
        const ele = this.$el//$refs.myrefTree.$el
        if(ele){
          dispatchEvent(ele,'afterApprove',args)
         }
      })
     },

     beforeCreate(data,callback){
      let args = []
      args.push(data)
      args.push(this.globalData)
      args.push(callback)
      //console.log(this,this.$refs,this.$refs.myrefTree)
      this.$nextTick(()=>{

        const ele = this.$el//$refs.myrefTree.$el
        if(ele){
          dispatchEvent(ele,'beforeCreate',args)
         }
      })
     },
     afterCreate(data){
      let args = []
      args.push(data)
      args.push(this.globalData)
      //console.log(this,this.$refs,this.$refs.myrefTree)
      this.$nextTick(()=>{
        const ele = this.$el//$refs.myrefTree.$el
        if(ele){
          dispatchEvent(ele,'afterCreate',args)
         }
      })
     },
     afterCreate(data){
      let args = []
      args.push(data)
      args.push(this.globalData)
      //console.log(this,this.$refs,this.$refs.myrefTree)
      this.$nextTick(()=>{
        const ele = this.$el//$refs.myrefTree.$el
        if(ele){
          dispatchEvent(ele,'afterCreate',args)
         }
      })
     },
   init(callback){
    if(callback && typeof callback==='function')
      {
        callback(this.tempDocNo)
      }
    },
    initFromData(flowData,fromData1,callback){
        this.$nextTick(()=>{
               let args = []
                args.push(flowData)
                args.push(fromData1)
                args.push(this.defaultForm.params)
                args.push(callback)
              const ele = this.$el//$refs.myrefTree.$el
              if(ele){
                dispatchEvent(ele,'initFromData',args)
              }
        })
      },
    initData(arr) {
         const args = {}
            arr.map(c => {
              if (c.flowEdit) {
                args[c.field] = null
              }
            })
            return args
          },
  submit(data){
      if(this.flowSubmit && typeof this.flowSubmit ==='function')
          this.flowSubmit(data)
  }
  },

}
</script>

<style lang="less" scoped>

</style>
