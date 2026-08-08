/*
 * @CreatAuthor: 杨沛霖
 * @UpdateAuthor: (...)
 * @Description: 任务信息模态框
*/ 
<template>
  <div class="modal-class " :v-if="modalVisible">
           <el-dialog v-el-drag-dialog :visible.sync="modalVisible" :title="modalTitle" customClass="contextReadStyle">
               <div class="table-content">
                    <div>
                      <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane :label="$t('const.taskDetail.stay')" name="first">
                          <div :style="{display:'flex','margin-bottom':'10px'}">
                            <div :style="{width:'50%'}">{{$t('const.pltInfo')}}</div>
                          </div>
                           <el-table
                              ref="tableA"
                              height='300px'
                              :data="contextTableOne"
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
                        </el-tab-pane>
                        <el-tab-pane :label="$t('const.taskDetail.setOut')" name="second">
                          <div :style="{display:'flex','margin-bottom':'10px'}">
                            <div :style="{width:'50%'}">{{$t('const.carryTask')}}</div>
                          </div>
                          <el-table
                            :data="contextTableTwo"
                            ref="tableB"
                            height='300px'
                            highlight-current-row
                            :border='true'
                            @current-change="handleTwoChange"
                            @row-click="tableTwoRowTwo"
                            style="width: 100%">
                            <el-table-column v-for="(rowT,i) in this.alreadysentcolums" :key="`rowTwo${i}`"
                                :prop="rowT.field"
                                :label="commonI18n(rowT)"
                                :width="rowT.width||defaultWidth">
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
                              height='300px'
                              :data="contextTableTwo_child"
                              highlight-current-row
                              :border='true'
                              @current-change="handleOneChange"
                              style="width: 100%">
                              <el-table-column v-for="(row,i) in this.contenttraycolums" :key="`rowOne${i}`"
                                  :prop="row.field"
                                  :label="commonI18n(row)"
                                  :width="row.width||defaultWidth">
                                
                              </el-table-column>
                            </el-table> 
                        </el-tab-pane>
                        <el-tab-pane :label="$t('const.taskDetail.arriveSoon')" name="third">
                          <div :style="{display:'flex','margin-bottom':'10px'}">
                            <div :style="{width:'50%'}">{{$t('const.carryTask')}}</div>
                          </div>
                          <el-table
                            :data="contextTableThree"
                            ref="tableB"
                            height='300px'
                            :border='true'
                            highlight-current-row
                            @current-change="handleTwoChange"
                            @row-click="tableTwoRowThree"
                            style="width: 100%">
                            <el-table-column v-for="(rowT,i) in this.alreadysentcolums" :key="`rowTwo${i}`"
                                :prop="rowT.field"
                                :label="commonI18n(rowT)"
                                :width="rowT.width||defaultWidth">
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
                              height='300px'
                              :data="contextTableThree_child"
                              highlight-current-row
                              :border='true'
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
    'initSelect': Object,
    'locSelOption': Object,
    'locInfo': Array,
    modalTitle: {
        type: String,
    },

  },
  watch: {
    modalVisible:function(newValue,oldValue){
      if(newValue === false){
        this.activeName = 'first'
        Object.assign(this.$data, this.$options.data())
      }
    },
    staTempp:function (newValue,oldValue){
      if(newValue.locId) {
        let params1 = {
              pageSize: this.pageSize,
              current: this.current,
              requestData: {
                  locId : newValue.locId,
                  carryState:0,
              },
          }
          
        this.lineApi(params1)
      }else{
          this.contextTableOne = [];
        
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
        {field: 'pltCtrlCode',label:'托盘编号',width:'120'},
        {field: 'pltCateName',label:'托盘类型',width:'120'},
        {field: 'locId',label:'当前位置',},
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
      contextTableThree_child: [],
      contextTableTwo_child: [],
      staSelect:[],
      loadData:[],
      fromRow:{},
      toRow:{},
      activeName: 'first',
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
    handleClick(tab, event) {
        switch (tab.paneName) {
          case 'first':
            if(this.staTempp.locId){
               let params1 = {
              pageSize: this.pageSize,
              current: this.current,
              requestData: {
                  locId : this.staTempp.locId,
                  carryState:0,
              },
          }
                   let _data0 = { url: '/api/PltInfo/list', params: params1}
            this.$store.dispatch('fmsCommon/actionWcsPost', _data0)
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
            }else{
              this.contextTableOne = [];

            }
           
            break;
          case 'second':
            if(this.staTempp.locId){
              let _data = { url: '/api/CarryTask/GetCurrentTask', params: {
              pageSize: this.pageSize,
              current: this.current,
              requestData: {
                  fromLocId: this.staTempp.locId,
                  taskState: 0,
                  execState: 0,
              },
            }}
            this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
               let carryTypeData = this.selColumns['selOne'],newData = data.data,
                                      tt = this.pltCate,Matl = this.MatlCate,{interfaceState,matlState,scanState} = this.initSelect;
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
                        if (parseInt(item.fromMesState) === parseInt(ca.value)) {
                                item.fromMesState = ca.label        
                        }
                        if (parseInt(item.toMesState) === parseInt(ca.value)) {
                                item.toMesState = ca.label        
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
                    return item;
                })
                this.contextTableTwo = tbData;
            }).catch(err => {
                console.error(err)
            })
            }else{
                this.contextTableTwo = [];

            }

            
            break;
          case 'third':
            if(this.staTempp.locId){
              let _data1 = { url: '/api/CarryTask/GetCurrentTask', params: {
              pageSize: this.pageSize,
              current: this.current,
              requestData: {
                  toLocId: this.staTempp.locId,
                  taskState: 0,
                  execState: 0,
              },
            }}
            this.$store.dispatch('fmsCommon/actionWcsPost', _data1)
            .then(data => {
               let carryTypeData = this.selColumns['selOne'],newData = data.data,
                                      tt = this.pltCate,Matl = this.MatlCate,{interfaceState,matlState,scanState} = this.initSelect;
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
                        if (parseInt(item.fromMesState) === parseInt(ca.value)) {
                                item.fromMesState = ca.label        
                        }
                        if (parseInt(item.toMesState) === parseInt(ca.value)) {
                                item.toMesState = ca.label        
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
                    return item;
                })
                this.contextTableThree = tbData;
            }).catch(err => {
                console.error(err)
            })
            }else{
                this.contextTableThree = [];
            }
             
            break;
        }
    },

    lineApi(pa1) {
      let _data = { url: '/api/PltInfo/list', params: pa1}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
      .then(data => {
         let carryTypeData = this.selColumns['selOne'],newData = data.data,
                                tt = this.pltCate,Matl = this.MatlCate,{interfaceState,matlState,scanState} = this.initSelect,{selTen} = this.locSelOption,locData = this.locInfo;
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
                locData.forEach(loc => {
                    if (loc.locId === item.locId) {
                        item.locId = loc.locName
                    }
                })
                  return item;
              })
          this.contextTableOne = tbData;
      }).catch(err => {
          console.error(err)
      })
     
    },
        // 确定修改缓存数  
        submitForm(){
             switch (this.toCache) {
                    case 1:
                            // if (!this.fromRow.hasOwnProperty('roadId')) {
                            //     this.$message("请先点击表格行")
                            //     return;
                            // }
                            let pa1 = {
                                data:{
                                    roadId: this.fromRow.roadId,
                                    cacheCount: this.inputNumber.cacheCount,
                                }
                            };
                            let _data1 = { url: '/api/Job/MonitorEditCarryRoad', params: pa1}
                            this.$store.dispatch('fmsCommon/actionWcsPost', _data1)
                            .then(data => {
                                this.$message({
                                    message: '禁用成功',
                                    type: 'success'
                                });
                            }).catch(err => {console.error(err)})
                        break;
                    case 2:
                        // if (!this.toRow.hasOwnProperty('roadId')) {
                        //     this.$message("请先点击表格行")
                        //     return;
                        // }
                        let pa2 = {
                            data:{
                                roadId: this.toRow.roadId,
                                cacheCount: this.inputNumber.cacheCount,
                            }
                        };
                        let _data2 = { url: '/api/Job/MonitorEditCarryRoad', params: pa2}
                        this.$store.dispatch('fmsCommon/actionWcsPost', _data2)
                        .then(data => {
                            this.$message({
                                message: '禁用成功',
                                type: 'success'
                            });
                        }).catch(err => {console.error(err)})
                        break;
                    default:
                        break;  
                    }  
        },
        //   单击表格行
        handleTwoChange(val) {
            // this.currentRow = val;
        },
        handleOneChange(val) {
            // this.currentRow = val;
        },
        // 路径单行点击
        tableTwoRowTwo(row, col, e) {
            this.fromRow = row
              let pa2 = {
                data: row.containerCtrlCode,
              };
              let _data2 = { url: '/api/PltInfo/GetPltCodesByContainerCtrlCode', params: pa2}
              this.$store.dispatch('fmsCommon/actionWcsPost', _data2)
              .then(data => {
                  console.log(data);
                  let carryTypeData = this.selColumns['selOne'],newData = data,
                                      tt = this.pltCate,Matl = this.MatlCate,{interfaceState,matlState,scanState} = this.initSelect,{selTen} = this.locSelOption,locData = this.locInfo;
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
                        locData.forEach(loc => {
                            if (loc.locId === item.locId) {
                                item.locId = loc.locName
                            }
                        })
                        return item;
                    })
                this.contextTableTwo_child = tbData;
              }).catch(err => {console.error(err)})
        },
        tableTwoRowThree(row, col, e) {
            this.fromRow = row
              let pa2 = {
                data: row.containerCtrlCode,
              };
              let _data2 = { url: '/api/PltInfo/GetPltCodesByContainerCtrlCode', params: pa2}
              this.$store.dispatch('fmsCommon/actionWcsPost', _data2)
              .then(data => {
                     let carryTypeData = this.selColumns['selOne'],newData = data,
                                      tt = this.pltCate,Matl = this.MatlCate,{interfaceState,matlState,scanState} = this.initSelect,{selTen} = this.locSelOption,locData = this.locInfo;
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
                        locData.forEach(loc => {
                            if (loc.locId === item.locId) {
                                item.locId = loc.locName
                            }
                        })
                        return item;
                    })
                this.contextTableThree_child = tbData;
              }).catch(err => {console.error(err)})
        },
        // 模态框方法 
        modalCancel() {
            this.modalVisible = false;
        },
        modalOpen() {
            this.modalVisible = true;  
        },
        doClick(a){ // 启用
            switch (a) {
                case 1:
                        if (!this.fromRow.hasOwnProperty('roadId')) {
                            this.$message("请先点击表格行")
                            return;
                        }
                        let pa1 = {
                            data:{
                                roadId: this.fromRow.roadId,
                                useState: 1,
                            }
                        };
                        let _data1 = { url: '/api/Job/MonitorEditCarryRoad', params: pa1}
                        this.$store.dispatch('fmsCommon/actionWcsPost', _data1)
                        .then(data => {
                            this.$message({
                                message: '启用成功',
                                type: 'success'
                            });
                        }).catch(err => {console.error(err)})
                    break;
                    case 2:
                        if (!this.toRow.hasOwnProperty('roadId')) {
                            this.$message("请先点击表格行")
                            return;
                        }
                        let pa2 = {
                            data:{
                                roadId: this.toRow.roadId,
                                useState: 1,
                            }
                        };
                        let _data2 = { url: '/api/Job/MonitorEditCarryRoad', params: pa2}
                        this.$store.dispatch('fmsCommon/actionWcsPost', _data2)
                        .then(data => {
                            this.$message({
                                message: '启用成功',
                                type: 'success'
                            });
                        }).catch(err => {console.error(err)})
                        break;
                default:
                    break;
            }

                
        },
        stopClick(a){ // 禁用
            switch (a) {
                case 1:
                        if (!this.fromRow.hasOwnProperty('roadId')) {
                            this.$message("请先点击表格行")
                            return;
                        }
                        let pa1 = {
                            data:{
                                roadId: this.fromRow.roadId,
                                useState: 0,
                            }
                        };
                        let _data1 = { url: '/api/Job/MonitorEditCarryRoad', params: pa1}
                        this.$store.dispatch('fmsCommon/actionWcsPost', _data1)
                        .then(data => {
                            this.$message({
                                message: '禁用成功',
                                type: 'success'
                            });
                        }).catch(err => {console.error(err)})
                    break;
                    case 2:
                        if (!this.toRow.hasOwnProperty('roadId')) {
                            this.$message("请先点击表格行")
                            return;
                        }
                        let pa2 = {
                            data:{
                                roadId: this.toRow.roadId,
                                useState: 0,
                            }
                        };
                        let _data2 = { url: '/api/Job/MonitorEditCarryRoad', params: pa2}
                        this.$store.dispatch('fmsCommon/actionWcsPost', _data2)
                        .then(data => {
                            this.$message({
                                message: '禁用成功',
                                type: 'success'
                            });
                        }).catch(err => {console.error(err)})
                        break;
                default:
                    break;  
                    }
        },
        modifyCache(a){ // 修改缓存
                switch (a) {
                    case 1:
                         if (!this.fromRow.hasOwnProperty('roadId')) {
                             this.$message("请先点击表格行")
                                return;
                            }
                        this.NumberVisible = true;
                        this.toCache = 1;
                        break;
                    case 2:
                        if (!this.toRow.hasOwnProperty('roadId')) {
                             this.$message("请先点击表格行")
                                return;
                            }
                        this.NumberVisible = true;
                        this.toCache = 2;
                        break;
                    default:
                        break;  
                    }  
        },

    }
}
</script>
<style lang="less" scoped>
    .from-content{
        margin-bottom: 20px;
    }
    
</style>
