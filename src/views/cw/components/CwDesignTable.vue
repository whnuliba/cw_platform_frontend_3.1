<template>
    <div class="dyn-btn" v-bind="$attrs">
      <CwDesignTables
        :bizCode="bizCode" 
        :loadLoading="dataLoading"
        :data="data"
        :page="page" 
        :cols="cols"
        :operColumns="operColumns"
        :boxSelect="boxSelect"
        :multipleSelect="multipleSelect"
        :tableInitSelect="tableInitSelect"
        :vueContext="vueContext"
        @loadData="loadData"
        @handleAdd="handleAdd"
        @handleUpdate="handleUpdate"
        @handleDelete="handleDelete"
        @handleReset="handleReset"
        @handleRowDbClick="handleRowDbClick"
        @handleRowClick	="(v1,v2,v3,v4)=>{handlerEvent('row-click',v1,v2,v3,v4)}"
        @init="init"
      />
      <!--   @loadData="loadData"  -->
    </div>
  </template>
  <script>
  import CwDesignTables from "@/components/Cw/CwDesignTable.vue"
  import i18n from "@/lang";
  import {dispatchEvent} from "../utils/eventUtils"

  export default {
    name: 'CwDesignTable',
    components: { CwDesignTables },
    props: {
      vueContext: {
        type: Object,
        default: () => {
          return {}
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
      bizCode: {
          type: String,
          default: ()=>{
             return ''
          }
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
    computed: {},
    data() {
      const _initdata = {
        methods:{},
        // vueContext:{},
        tableInitSelect:{},
        boxSelect: true,
        multipleSelect: false,
        compVal: '',
        dataLoading: false,
        data: [],
        count: 0,
        page:{
        showPage:true,
        total: 0,
        listQuery: {
                  current: 1,
                  pageSize: 15
             },
        queryParams: {
               requestData: {
                tableName: '',
                orderBy: '',
                columns: [],
                sqlWhere: [],
              }
          },
        },
        cols:[],
        operColumns: [],
        bindParams:{},
        initScript:undefined,
      };
      return _initdata;
    },
    created() {
      this.comText();
    },
    mounted() {
    },
    beforeDestroy() { },
  
    methods: {
      handlerEvent(tag,v1,v2,v3,v4){
        let args = []
        if(v1)  args.push(v1)
        if(v2)  args.push(v2)
        if(v3)  args.push(v3)
        if(v4)  args.push(v4)
        //console.log(this,this.$refs,this.$refs.myrefTree)
        this.$nextTick(()=>{
          const ele = this.$el//$refs.myrefTree.$el

        if(ele){
          dispatchEvent(ele,tag,args)
        }
        })
      },
        comText() {
            return '表格'
        },
        getStyleCols() {
          return [
            { field: 'width', title: 'width', queryType: 'input', defaultValue: '100%', unit: 'px' },
            { field: 'height', title: 'height', queryType: 'input', defaultValue: 'auto', unit: 'px' },
            { field: 'overflow', title: '显示', queryType: 'input', defaultValue: 'visible', unit: '' },
            // { field: 'fontSize', title: '字体大小', queryType: 'input', defaultValue: '16px', unit: 'px' },
            // { field: 'borderColor', title: '边框颜色', queryType: 'colorpicker', defaultValue: '#127310', },
            // { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', defaultValue: '#fff', },
          ]
        },
        ificationType() {
          return {
            classification: '布局容器组件',
            isCanvasview: false,
          }
        },
        loadDataBefore(data){
          if(this.bindMethods.loadDataBefore && typeof this.bindMethods.loadDataBefore ==='function')
           {
            this.bindMethods.loadDataBefore(data)
           }
        },
        loadDataAfter(data){
          if(this.bindMethods.loadDataAfter && typeof this.bindMethods.loadDataAfter ==='function')
           {
            this.bindMethods.loadDataAfter(data)
           }
        },
      handleDragStart(event) {
        event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY,action:'setLocation',compId:this.compId}));
      },
      handleDragEnd() { },

      handleRowDbClick(row, column, event){
           this.bindParams.row = row
           if(this.bindMethods.handleRowDbClick && typeof this.bindMethods.handleRowDbClick ==='function')
           {
            this.bindMethods.handleRowDbClick(row, column, event)
           }
        },
      // handleRowClick(row, column, event,callback){
      //   console.log(row)
      //     this.bindParams.row = row
      //      //if(this.bindMethods.handleRowClick && typeof this.bindMethods.handleRowClick ==='function')
      //      //{
      //      // this.bindMethods.handleRowClick(row, column, event)
      //      //}
      //      if(callback)callback()
      //   },
        handleReset(){},
        handleDelete(e,self,row,boxSelectValue,url){
          this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
          const _data = { url: url, params: { data: row.id } }
          this.$store.dispatch('fmsCommon/actionPost', _data)
            .then(data => {
              //this.list.splice($index, 1)
              this.loadData();
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
        },
        handleSave(data,url,success,fail,complete){
        let _data = { url: url, params: { data: {...data,}  } }
        this.$store.dispatch('fmsCommon/actionPost', _data)
              .then(data => {
                this.$message({
                  type: 'success',
                  message: 'change success!=>' + data
                });
              this.loadData();
               // if(success && typeof success==='function'){
               //    success(data)
                //}
              }).catch(err => {     
               // if(fail && typeof fail==='function'){
                //  fail(err)
                //}
                this.$message({
                  type: 'error',
                  message: 'change error!=>' + err
                });
              }).finally(() => {
               // if(complete && typeof complete==='function'){
               //   complete()
               // }
              })
        },
        handleUpdate(data,url, success, fail, complete){
          console.log('编辑')
          const _data = {
          url: url, params: {
            data: data
          }
          }
          this.$store.dispatch('fmsCommon/actionPost', _data)
              .then(data => {
                this.$message({
                  type: 'success',
                  message: 'change success!=>' + data
                });
                this.loadData();
               // if(success && typeof success==='function'){
                //   success(data)
               // }
              }).catch(err => {
                //if(fail && typeof fail==='function'){
               //   fail(err)
                //}
              }).finally(() => {
               // if(complete && typeof complete==='function'){
                //  complete()
               // }      
            })
        },
        handleAdd(type, data,url, success, fail, complete){
          if(type==='add')
          {
            this.handleSave(data,url, success, fail, complete)
          }
          if(type==='update')
          {
            this.handleUpdate(data,url, success, fail, complete)
          }
        },
        init(script){
            this.initScript = script
            this.cols = this.initScript.cols
        },

        loadList(param,queryUri,tableColumns,operCol){
            let that = this;
            that.cols = tableColumns
            const _data = { url: queryUri, params:param}
            this.$store.dispatch('fmsCommon/actionPost', _data)
            .then(data => {
             that.data = data.data
             that.page.total = data.total
             that.operColumns = operCol
             that.dataLoading = false
            }).catch(err => {
                this.$message.error(err)
            }).finally(()=>{
             // if(complete && typeof complete==='function')
             //    {
             //    complete()
             //    this.loadDataAfter()
             //  }
            })
        },
       loadData(page){
        let params = this.component.handler.urlParams
        if (page) {
            params[0].pageSize = page.limit
            params[0].current = page.page    
        }
        this.loadList(params[0],params[1],params[2],params[3])
       }   
    },
   
  }
  </script>
  <style lang="scss" scoped>
  
  </style>