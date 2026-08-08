/*
 * @CreatAuthor: 杨沛霖
 * @UpdateAuthor: (...)
 * @Description: 任务信息模态框
*/ 
<template>
  <div class="modal-class ">
           <el-dialog v-el-drag-dialog :visible.sync="modalVisible" :title="modalTitle" customClass="contextReadStyle">
               <div class="table-content">
                    <div>
                      <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane :label="$t('const.taskType.import')+'/'+$t('const.taskType.changeRack')" name="first">
                          <div :style="{display:'flex','margin-bottom':'10px'}">
                            <div :style="{width:'50%'}">{{$t('const.carryTask')}}</div>
                          </div>
                           <el-table
                              ref="tableA"
                              height='250px'
                              :data="contextTableOne"
                              highlight-current-row
                              @row-click="tableOneRow"
                              @current-change="handleOneChange"
                              style="width: 100%">
                              <el-table-column v-for="(rowT,i) in this.alreadysentcolums" :key="`rowTwo${i}`"
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
                             <div :style="{display:'flex','margin-bottom':'10px'}">
                            <div :style="{width:'50%'}">{{$t('const.pltInfo')}}</div>
                          </div>
                          <el-table
                              ref="tableA"
                              height='250px'
                              :data="contextTableOne_child"
                              highlight-current-row
                              @current-change="handleOneChange"
                              style="width: 100%">
                              <el-table-column v-for="(row,i) in this.contenttraycolums" :key="`rowOne${i}`"
                                  :prop="row.field"
                                  :label="commonI18n(row)"
                                  :width="row.width||defaultWidth">
                                
                              </el-table-column>
                            </el-table> 
                        </el-tab-pane>
                        <el-tab-pane :label="$t('const.taskType.export')+'/'+$t('const.taskType.changeStation')" name="second">
                          <div :style="{display:'flex','margin-bottom':'10px'}">
                            <div :style="{width:'50%'}">{{$t('const.carryTask')}}</div>
                          </div>
                          <el-table
                            :data="contextTableTwo"
                            ref="tableB"
                            height='250px'
                            highlight-current-row
                            @current-change="handleTwoChange"
                            @row-click="tableTwoRowTwo"
                            style="width: 100%">
                            <el-table-column v-for="(rowT,i) in this.alreadysentcolums" :key="`rowTwo${i}`"
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
                          <div :style="{display:'flex','margin-bottom':'10px'}">
                            <div :style="{width:'50%'}">{{$t('const.pltInfo')}}</div>
                          </div>
                          <el-table
                              ref="tableA"
                              height='250px'
                              :data="contextTableTwo_child"
                              highlight-current-row
                              @current-change="handleOneChange"
                              style="width: 100%">
                              <el-table-column v-for="(row,i) in this.contenttraycolums" :key="`rowOne${i}`"
                                  :prop="row.field"
                                  :label="commonI18n(row)"
                                  :width="row.width||defaultWidth">
                                
                              </el-table-column>
                            </el-table> 
                        </el-tab-pane>
                      </el-tabs>
                        
                      
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
    "total":Number,
    "toTotal":Number,
    "tableOneTitle":String,
    "tableTwoTitle":String,
    'tableTwoData':Array,
    'isRightTable':Boolean,
    'stockerlayOrPick': String,
    'carryType': Number,
    'staTempp': Object,
    'selColumns': Object,
    'pltCate': Array,
    'MatlCate': Array,
    'domobjData': Object,
    modalTitle: {
        type: String,
    },

  },
  watch: {
    modalVisible:function(newValue,oldValue){
      console.log(newValue);
    if(newValue === false){
      Object.assign(this.$data, this.$options.data())
    }else if(newValue === true){
      if(this.domobjData){
          let params1 = {
              pageSize: this.pageSize,
              current: this.current,
              requestData: {
                  carryType: this.domobjData.carryType,
                  taskState :0,
                  ExecState :0,
              },
          }
          let params2 = {
              pageSize: this.toPageSize,
              current: this.toCurrent,
              requestData: {
                  toLocId: this.domobjData.locId,
              },
          }
          console.log(1);
        this.lineApi(params1,params2)
      }
    }
  },
    // domobjData:function (newValue,oldValue){

    //   if(newValue.carryType) {

    //     let params1 = {
    //           pageSize: this.pageSize,
    //           current: this.current,
    //           requestData: {
    //               carryType: newValue.carryType,
    //               taskState :0,
    //               ExecState :0,
    //           },
    //       }
    //       let params2 = {
    //           pageSize: this.toPageSize,
    //           current: this.toCurrent,
    //           requestData: {
    //               toLocId: newValue.locId,
    //           },
    //       }
    //     this.lineApi(params1,params2)
    //   }else{
    //       this.contextTableOne = [];
        
    //   }
    // },
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
        {field: 'pltCtrlCode',label:'托盘编号',width:'120'},
        {field: 'pltCateName',label:'托盘类型',width:'120'},
        {field: 'locName',label:'当前位置',},
        {field: 'carryState',label:'搬运状态',},        
        {field: 'matlState',label:'电池状态',},        
        {field: 'pltLoadState',label:'载货状态',width:'120'},        
        {field: 'mesState',label:'接口状态',},    
        {field: 'taskTime',label:'任务时间',width:'120'},    
        {field: 'carryTime',label:'搬运时间',},  
        {field: 'readyTime',label:'到位时间',},  
      ],
      alreadysentcolums:[
        {field: 'taskInfo',label:'任务信息',children:[
            {field: 'taskNum',label:'任务号',},
            {field: 'carryType',label:'搬运类型',},
            {field: 'carryPriority',label:'优先级',width:'120'},
        ]},
        {field: 'pltInfo',label:'托盘信息',children:[
            {field: 'pltCateName',label:'托盘类型',width:'120'},
            {field: 'pltCode',label:'托盘条码',},
            {field: 'containerCtrlCode',label:'托盘编号',width:'140'},
        ]},
        {field: 'fromLoc',label:'起始位置',children:[
            {field: 'fromLocName',label:'位置名称',width:'120'},
            {field: 'fromMatlState',label:'电池状态',width:'120'},
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
      contextTableThree: [],
      contextTableOne_child: [],
      contextTableTwo_child: [],
      staSelect:[],
      fromRow:{},
      toRow:{},
      activeName: 'first',
      cacheNum:0,
    }
  },
  created() {
   
  },
  mounted() {
   

  },
  beforeDestroy() {

  },
  methods: {
    handleClick(tab, event) {
   
    
    },

    lineApi(pa1,pa2) {
      let _data = { url: '/api/CarryTask/GetCurrentTask', params: pa1}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
      .then(data => {
        if(data.data.length > 0){
            let carryTypeData = this.selColumns['selOne'],newData = data.data,
                                tt = this.pltCate,Matl = this.MatlCate;
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
                
                  return item;
              })
            tbData.forEach(item=>{
              if(item.toLocType  === 2){
                  this.contextTableOne = [...this.contextTableOne,item];
              }else if(item.toLocType === 5){
                this.contextTableTwo = [...this.contextTableTwo,item];
              }
            })
        }else{
          this.contextTableOne = [];
          this.contextTableTwo = [];
        }
         
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
              let _data2 = { url: '/api/PltInfo/list', params: pa2}
              this.$store.dispatch('fmsCommon/actionWcsPost', _data2)
              .then(data => {
                  this.contextTableOne_child = data.data
              }).catch(err => {console.error(err)})
        },
        // 路径单行点击
        tableTwoRowTwo(row, col, e) {
            this.fromRow = row
              let pa2 = {
                  pageSize: this.pageSize,
                  current: this.current,
                  requestData: {
                    containerCtrlCode: row.containerCtrlCode,
                    // pltId: 'B51359A2FABB46BFA616911A3C0B4F37',
                  },
              };
              let _data2 = { url: '/api/PltInfo/list', params: pa2}
              this.$store.dispatch('fmsCommon/actionWcsPost', _data2)
              .then(data => {
                  this.contextTableTwo_child = data.data
              }).catch(err => {console.error(err)})
        },
     
       
        // 表2页码修改事件
        toHandleFilter(page){
            this.$emit('toPage',page)
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
