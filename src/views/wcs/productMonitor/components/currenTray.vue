/*
 * @CreatAuthor: 杨沛霖
 * @UpdateAuthor: (...)
 * @Description: 当前托盘信息模态框
*/ 
<template>
  <div class="modal-class ">
           <el-dialog v-el-drag-dialog :visible.sync="modalVisible" :title="modalTitle" customClass="contextReadStyle">
               <div class="table-content">
                    <div>
                        <div :style="{display:'flex','margin-bottom':'10px'}">
                            <div :style="{width:'50%'}">{{modalTitle}}</div>
                            <!-- <div v-if="roadWindow" :style="{width:'50%',display:'flex',justifyContent:'flex-end'}">
                                <el-button type="primary" @click="doClick(1)" size="mini"  plain>启用</el-button>
                                <el-button type="primary" @click="stopClick(1)" size="mini" plain>禁用</el-button>
                                <el-button type="primary" @click="modifyCache(1)" size="mini" plain>修改缓存</el-button>
                            </div> -->
                            <!-- <div v-else-if="curLotWindow">
                                <v-button type="primary" @click="unBind">解绑<v-button/>
                                <v-button type="primary" @click="bindClick">梆盘<v-button/>
                            </div> -->
                        </div>
                        <div class="from-content">
                            <el-table
                                    ref="tableA"
                                    height='400px'
                                    :data="contextTableOne"
                                    @row-click="tableOneRow"
                                    :border='true'
                                    highlight-current-row
                                    @current-change="handleOneChange"
                                    style="width: 100%">
                                    <el-table-column v-for="(row,i) in this.contenttraycolums" :key="`rowOne${i}`"
                                        :prop="row.field"
                                        :label="commonI18n(row)"
                                        :width="row.width||defaultWidth">
                                      
                                    </el-table-column>
                            </el-table> 
                           
                        </div>
                        <div class="to-content">
                            <div :style="{display:'flex','margin-bottom':'10px'}">
                            <div :style="{width:'50%'}">{{$t('const.carryTask')}}</div>
                            <!-- <div v-if="roadWindow" :style="{width:'50%',display:'flex',justifyContent:'flex-end'}">
                                <el-button type="primary" @click="doClick(2)" size="mini" plain>启用</el-button>
                                <el-button type="primary" @click="stopClick(2)" size="mini" plain>禁用</el-button>
                                <el-button type="primary" @click="modifyCache(2)" size="mini" plain>修改缓存</el-button>
                            </div> -->
                            <!-- <div v-else-if="curLotWindow">
                                <v-button type="primary" @click="unBind">解绑<v-button/>
                                <v-button type="primary" @click="bindClick">梆盘<v-button/>
                            </div> -->
                            </div>
                            <el-table
                                    :data="contextTableTwo"
                                    ref="tableB"
                                    highlight-current-row
                                    :border='true'
                                    @current-change="handleTwoChange"
                                    @row-click="tableTwoRow"
                                    style="width: 100%">
                                    <el-table-column v-for="(rowT,i) in this.contenttraycolums_child" :key="`rowTwo${i}`"
                                        :prop="rowT.field"
                                        :label="commonI18n(rowT)"
                                        :width="rowT.width">
                                        <el-table-column v-for="(val,ind) in rowT.children" :key="`rowOne${ind}`"
                                        :prop="val.field"
                                        :label="commonI18n(val)"
                                        :width="val.width||defaultWidth">
                                        
                                        </el-table-column>
                                    </el-table-column>
                            </el-table>
                         
                        </div> 
                    </div>
               </div> 
        </el-dialog>
        
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog';
import Pagination from '@/components/Pagination';
export default {
 components: { Pagination },
 directives: {elDragDialog},
  props: {
    'roadWindow':Boolean,
    'curLotWindow':Boolean,
   
    "tableOneTitle":String,
    "tableTwoTitle":String,
    'tableTwoData':Array,
    'isRightTable':Boolean,
    'stockerlayOrPick': String,
    'carryType': Number,
    'staTempp': Object,
    'selColumns': Object,
    'initSelect': Object,
    'locSelOption': Object,
    'pltCate': Array,
    'MatlCate': Array,
    modalTitle: {
        type: String,
    },

  },
  watch: {
    staTempp:function (newValue,oldValue){
      if(newValue.locId) {
        let params1 = {
              pageSize: this.pageSize,
              current: this.current,
              requestData: {
                  locId : newValue.locId,
              },
          }
          let params2 = {
              pageSize: this.toPageSize,
              current: this.toCurrent,
              requestData: {
                  toLocId: newValue.locId,
              },
          }
        this.lineApi(params1,params2)
      }else{
          this.contextTableOne = [];
          this.contextTableTwo = [];
      }
    },
  },
  computed: {},
  data() {
    return {
        defaultWidth:'90px',
      toCache:null,
      inputNumber:{
          cacheCount:0
          },
      NumberVisible: false,
      pageSize:10,
      current:1,
      toPageSize:10,
      toCurrent:1,
      modalTemp:{
          forkNum:undefined,
          locType:undefined,
          ctrlCode2:undefined,
          row:undefined,
          list:undefined,
          layer:undefined,
      },
      activeName:'first',
      modalVisible: false,
      contenttraycolums:[
        {field: 'pltCode',label:'托盘条码',},
        {field: 'pltCtrlCode',label:'托盘编号',width:'100'},
        {field: 'pltCateName',label:'托盘类型',width:'110'},
        {field: 'locName',label:'当前位置',},
        {field: 'carryState',label:'搬运状态',},        
        {field: 'matlState',label:'电池状态',},        
        {field: 'pltLoadState',label:'载货状态',width:'110'},        
        {field: 'mesState',label:'接口状态',},    
        {field: 'taskTime',label:'任务时间'},    
        {field: 'carryTime',label:'搬运时间',},  
        {field: 'readyTime',label:'到位时间',},  
      ],
      contenttraycolums_child:[
        {field: 'taskInfo',label:'任务信息',children:[
            {field: 'taskNum',label:'任务号',},
            {field: 'carryType',label:'搬运类型',},
            {field: 'carryPriority',label:'优先级',width:'110'},
        ]},
        {field: 'pltInfo',label:'托盘信息',children:[
            {field: 'pltCateName',label:'托盘类型',width:'110'},
            {field: 'pltCode',label:'托盘条码',},
            {field: 'containerCtrlCode',label:'容器号',width:'140'},
        ]},
        {field: 'fromLoc',label:'起始位置',children:[
            {field: 'fromLocName',label:'位置名称',width:'120'},
            {field: 'fromMatlState',label:'电池状态',width:'120',},
            {field: 'fromMesState',label:'接口状态',width:'120'},
        ]},
        {field: 'toLoc',label:'目标位置',children:[
            {field: 'toLocName',label:'位置名称',width:'100'},
            {field: 'toMatlState',label:'电池状态',width:'100'},
            {field: 'toMesState',label:'接口状态',width:'100'},
        ]},
        {field: 'postInfo',label:'执行信息',children:[
            {field: 'postState',label:'下达状态',},
            {field: 'postTime',label:'下达时间',},
        ]},
                
      ],
      ctrlCodeData: [
          {title:'排'},
          {title:'列'},
          {title:'层'},
      ],
      locSel:{selOne:[], selTwo:[]},  // 位置类型下拉数据
      forkSelData: [],
      contextTableOne: [],
      contextTableTwo: [],
      loadData:[],
      staSelect:[],
      fromRow:{},
      toRow:{},
      cacheNum:0,
    }
  },
  created() {
   
  },
  mounted() {
      this.getLoaddata()
   

  },
  beforeDestroy() {
  },
  methods: {
    getLoaddata(){
       let  _data = { url: '/api/Const/PltLoadState', params: {}}
        this.$store.dispatch('fmsCommon/actionWcsPost', _data)
          .then(data => {
              this.loadData = data
          }).catch(err => {
              console.error(err)
          })
    },
    lineApi(pa1,pa2) {
      let _data = { url: '/api/PltInfo/list', params: pa1}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
      .then(data => {
         let carryTypeData = this.selColumns['selOne'],newData = data.data,
                                tt = this.pltCate,Matl = this.MatlCate,{interfaceState,matlState,scanState} = this.initSelect,{selTen} = this.locSelOption;
        let _this = this;
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
                interfaceState.forEach(ca=> {
                    if (parseInt(item.mesState) === parseInt(ca.value)) {
                            item.mesState = ca.label        
                    }
                })
                matlState.forEach(ca=> {
                    if (parseInt(item.matlState) === parseInt(ca.value)) {
                            item.matlState = ca.label        
                    }
                })
                _this.loadData.forEach(ca=> {
                    if (parseInt(item.pltLoadState) === parseInt(ca.id)) {
                            item.pltLoadState = ca.name        
                    }
                })
                selTen.forEach(ca=> {
                    if (parseInt(item.carryState) === parseInt(ca.id)) {
                            item.carryState = ca.name        
                    }
                })
                  return item;
        })
          this.contextTableOne = tbData;
      }).catch(err => {
          console.error(err)
      })
     
    },
        //   单击表格行
        handleTwoChange(val) {
            // this.currentRow = val;
        },
        handleOneChange(val) {
            // this.currentRow = val;
        },
        // 路径单行点击
        tableOneRow(row, col, e) {
            this.fromRow = row
              let pa2 = {
                  pageSize: this.pageSize,
                  current: this.current,
                  requestData: {
                    containerCtrlCode: row.containerCtrlCode,
                    // pltId: 'B51359A2FABB46BFA616911A3C0B4F37',
                  },
              };
              let _data2 = { url: '/api/CarryTask/GetCurrentTask', params: pa2}
              this.$store.dispatch('fmsCommon/actionWcsPost', _data2)
                .then(data => {
                    let newData = data.data, {interfaceState,matlState,scanState} = this.initSelect,{selTen} = this.locSelOption;
                    let tbData = newData.map(item => {
                       
                        interfaceState.forEach(ca=> {
                            if (parseInt(item.mesState) === parseInt(ca.value)) {
                                    item.mesState = ca.label        
                            }
                        })
                        matlState.forEach(ca=> {
                            if (parseInt(item.matlState) === parseInt(ca.value)) {
                                    item.matlState = ca.label        
                            }
                        })
                        return item;
                    })
                    this.contextTableTwo = tbData;

                }).catch(err => {console.error(err)})
        },
        tableTwoRow(row, col, e) {
            this.toRow = row
        },
       
       
        // 模态框方法 
        modalCancel() {
            this.modalVisible = false;
        },
        modalOpen() {
            this.modalVisible = true;  
        },

    }
}
</script>
<style lang="less" scoped>
    .from-content{
        margin-bottom: 20px;
    }
     
</style>
