<template>
    <div>
        <el-table :data="[]" style="width: 100%" :row-style="rowStyle" :header-cell-style="headerCellStyle">

                        <el-table-column v-if="showIndex" width="50px" label="序号" align="center" fixed="left">
                            <template slot-scope="scope">
                            <span>{{ (scope.$index +1) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column v-for="item in cols" :key="item.field" :label="commonI18n(item)" :prop="item.field"
                            :width="item.width" :min-width="item.minWidth" v-if="!item.hide" :align="item.align" :show-overflow-tooltip="true">
                        </el-table-column> 
        </el-table>
        <vueSeamlessScroll  :data="tableData" class="seamless-warp" id="roolingTbStyle" :class-option="defineScroll" :style="{height: '100%',width: '100%',overflow: 'hidden'}">
          <!-- <scrollList :id="'leftList'"> -->
            <el-table :data="tableData" style="width: 100%" :header-row-class-name="'table_header'" :header-cell-style="headerCellStyle" :row-style="rowStyle">
                        <el-table-column v-if="showIndex" width="50px" label="序号" align="center" fixed="left">
                            <template slot-scope="scope">
                            <span>{{(scope.$index +1) }}</span>
                            <!--  listQuery.pageSize*(listQuery.current -1) +  -->
                            </template>
                        </el-table-column>
                        <el-table-column v-for="item in cols" :key="item.field" :label="commonI18n(item)" :prop="item.field"
                            :width="item.width" :min-width="item.minWidth" v-if="!item.hide" :align="item.align" :show-overflow-tooltip="true">
                        </el-table-column> 
                     </el-table>
          <!-- </scrollList> -->
        </vueSeamlessScroll>
    </div>
  </template>
  <script>
  import vueSeamlessScroll from "vue-seamless-scroll";
  import  scrollList from "@/components/scrollList/index";
  export default {
    name: 'CwRollingTable',
    components: { vueSeamlessScroll,scrollList  },
    props: {
      panelStyle: {
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
      myStyle: {
        type: Object,
        default: () => {
          return { color:'black' }
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
      bindData:{
        type: Object,
        default: () =>{}
      },
      showIndex: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      itemVal: {
        handler: function (newVal, oldVal) {
          if (newVal) {
            this.compVal = newVal
          }
        },
        deep: true
      },
      itemStyle: {
        handler: function (newVal, oldVal) {
          if (newVal) {}
        },
        deep: true
      },
    },
   
    computed: {
        defineScroll() {
            return {
                step: this.itemStyle.speed, // 数值越大速度滚动越快
                limitMoveNum: this.itemStyle.limitMoveNum, // 开始无缝滚动的数据量 this.dataList.length
                hoverStop: true, // 是否开启鼠标悬停stop
                direction: 1, // 0向下 1向上 2向左 3向右
                openWatch: true, // 开启数据实时监控刷新dom
                singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
                singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
                waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
            };
        },
    },
    data() {
        //const _initData = 
        return {
                methods:{},
                vueContext:{},
                myAttribute:{
                    onClckEventName:'Event_Button',
                    }, 
                compVal: '',
                cols: [
                  { field: 'PROJECT_CODE', title: '项目编码', minWidth: 100, align: "center", queryType: 'input',set: false, require: false, query: true, hide: false },
                  { field: 'TASK_TYPE', title: '任务类型', minWidth: 120, align: "center", queryType: 'input', set: false, require: false, query: true, hide: true },
                  { field: 'CREATE_USER', title: '创建人', minWidth: 100, align: "center", queryType: 'input', set: false, require: false, query: false, hide: false },
                  { field: 'TASK_NO', title: '任务编号', minWidth: 150, align: "center", queryType: 'textarea',style:{width:'600px'}, charNum:5,set: true, require: false, query: false, hide: false },
                  { field: 'TASK_STATE', title: '任务状态', minWidth: 150, align: "center", queryType: 'textarea',style:{width:'600px'}, charNum:5, set: true, require: false, query: false, hide: false },
                ],
                tableData:  [
                  {PROJECT_CODE:1,TASK_TYPE:1,"CREATE_USER":"1","TASK_NO":1,"TASK_STATE":1,},
                  {PROJECT_CODE:1,TASK_TYPE:1,"CREATE_USER":"1","TASK_NO":1,"TASK_STATE":1,},
                  {PROJECT_CODE:1,TASK_TYPE:1,"CREATE_USER":"1","TASK_NO":1,"TASK_STATE":1,},
                  {PROJECT_CODE:1,TASK_TYPE:1,"CREATE_USER":"1","TASK_NO":1,"TASK_STATE":1,},
                  {PROJECT_CODE:1,TASK_TYPE:1,"CREATE_USER":"1","TASK_NO":1,"TASK_STATE":1,},
                  {PROJECT_CODE:1,TASK_TYPE:1,"CREATE_USER":"1","TASK_NO":1,"TASK_STATE":1,},
                  {PROJECT_CODE:1,TASK_TYPE:1,"CREATE_USER":"1","TASK_NO":1,"TASK_STATE":1,},
                ],
                listQuery: {
                        current: 1,
                        pageSize: 15
                },
                bizCode:'',
                page: {
                       showPage: true,
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
                        }

                },
                tableScript: {},
                pageScript: undefined,
      };
      // Object.assign(_initData.defaultForm.params, this.initData(_initData.cols))
     // return this.initData(_initData.cols)
    },
    created() {
      if(this.component.elementCode){ 
        try{
              const tableScript = eval("("+this.component.elementCode+")")
              this.pageScript = tableScript      
                     
            }catch(error){
              this.pageScript = undefined
            }
      }
    },
    mounted() {
      // this.loadDataQuery();
      this.$nextTick(() => {
        if(this.pageScript && this.pageScript.cols){
          let table = {TABLE_TYPE:undefined}
          this.parseTableInfo(this.pageScript,table)
        }else{
          this.initRoleField();
        }
      })
    },
    beforeDestroy() { },
  
    methods: { 
      headerCellStyle({row, rowIndex}) {
            return {
              background: this.itemStyle.backgroundColor,
              color: this.itemStyle.headerTextColor,
            }
      },
      rowStyle({row, rowIndex}) {
          if (rowIndex%2 === 0) {
            return {
              background: this.itemStyle.backgroundColor,
              color: this.itemStyle.rowTextColor,
            }
          }else{
            return {
              background: this.itemStyle.backgroundColor2,
              color: this.itemStyle.rowTextColor,
            }
          }
      },
      initRoleField(){
          //抓取表信息,并获取到脚本
          const bizCode = this.component.attribute.bizCode
         //获取到模型数据
        //1、判定是否是需要权限鉴定,在页面参数中可以配置,默认不需要
         let _params = {sqlWhere:[
             {column:'BIZ_CODE',condition:'=',value:bizCode}
         ]}
          let _data = { url: '/dyn-table/query', params: {data:_params} }
          this.$store.dispatch('fmsCommon/actionTaskPost', _data)
            .then(data => {
               if(!data || data.length===0)
                 return ;
               this.tableScript = eval("("+data[0].CTRL_SCRIPT+")")
               this.cols = eval("("+data[0].CTRL_SCRIPT+")").cols;
               
               this.loadDataQuery()
            }).catch(err => {
              console.error(err)
         })


      },
      // 点击搜索按钮或翻页时的回调
      loadDataQuery(param,callback,error,complete) {
            Object.assign(this.page.queryParams, this.page.listQuery)   
            let params = param || this.page.queryParams
            let that = this
            if(param){
              this.loadList(params,callback,error,complete)
              return
            }
            this.loadList(params,(data)=>{
              that.tableData = data.data
            },(error)=>{
               console.error(error)
            })
          },
      loadList(param,callback,error,complete){
            const _data = { url: this.tableScript.url.queryUri, params:param}
            this.$store.dispatch('fmsCommon/actionPost', _data)
            .then(data => {
               if(callback && typeof callback==='function')
                  callback(data)
            }).catch(err => {
                if(error && typeof error==='function')
                  error(err)
            }).finally(()=>{
              if(complete && typeof complete==='function')
                 complete()
            })
        },
   
      initData(arr) {
        let args = {}
        arr.map(c => {
          if (c.set) {
            args[c.field] = null
          }
        })
        return args
      },
      getStyleCols() {
        return [
          { field: 'width', title: '长度', queryType: 'input', defaultValue: '400px', unit: 'px' },
          { field: 'height', title: '高度', queryType: 'input', defaultValue: '400px', unit: 'px' },
          // { field: 'borderColor', title: '边框颜色', queryType: 'colorpicker', defaultValue: '#127310', },
          { field: 'headerTextColor', title: '表头字体颜色', queryType: 'colorpicker', defaultValue: '#000', },
          { field: 'rowTextColor', title: '行内字体颜色', queryType: 'colorpicker', defaultValue: '#000', },
          { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', defaultValue: '#fff', },
          { field: 'backgroundColor2', title: '背景颜色2', queryType: 'colorpicker', defaultValue: '#fff', },
          { field: 'speed', title: '速度', queryType: 'input', defaultValue: '0.5', },
          { field: 'limitMoveNum', title: '无缝滚动数据量', queryType: 'input', defaultValue: '2', },
        ]
      },
      getAttributeCols() {
        return [
            { field: 'bizCode', title: '业务编码', queryType: 'input', require: false, query: true, hide: false },
        ]
      },
      comText() {
        return '滚动表格'
      },
      ificationType() {
        return {
          classification: '图表组件',
          isCanvasview: false,
        }
      },
      handleDragStart(event) {
        event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY,action:'setLocation',compId:this.compId}));
      },
      handleDragEnd() { },
      parseTableInfo(tableScript,table){
        this.cols = tableScript.cols;
        if(tableScript.url.query && tableScript.pageParams){
          let _data = { url: tableScript.url.query, params: tableScript.pageParams}
          this.$store.dispatch('fmsCommon/actionPost', _data)
          .then(data => {
            this.tableData = data.data
            this.total = data.total
            this.listLoading = false
          })
        }
      }              
    },
  }
  </script>
  <style lang="scss" scoped>
    .seamless-warp {
            height: 100%;
            overflow: hidden;
    }
    ::v-deep .el-table__empty-block{
        display: none;
    }

    ::v-deep .table_header {
        display: none;
    }

    ::v-deep .el-table tbody tr{
      &:hover {
        color: lightseagreen;
      }

    }
  </style>
  
  <style>
    #roolingTbStyle .el-table__body {
          width: 100% !important;
        }
  </style>
