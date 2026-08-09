/*
 * @CreatAuthor: 杨沛霖
 * @UpdateAuthor: (...)
 * @Description: 堆垛机-查看路径
*/ 
<template>
  <div class="modal-class ">
           <el-dialog v-el-drag-dialog :visible.sync="modalVisible" :title="modalTitle" customClass="contextReadStyle">
               <div class="table-content">
                    <div>
                        <div :style="{display:'flex','margin-bottom':'10px'}">
                            <div :style="{width:'50%'}">{{$t('const.taskType.import')}}/{{$t('const.taskType.changeRack')}}</div>
                            <div v-if="roadWindow" :style="{width:'50%',display:'flex',justifyContent:'flex-end'}">
                                <el-button type="primary" @click="doClick(1)" size="mini"  plain>{{$t('common.ProcessFlowList.enable')}}</el-button>
                                <el-button type="primary" @click="stopClick(1)" size="mini" plain>{{$t('common.ProcessFlowList.disabled')}}</el-button>
                            </div>
                        </div>
                        <div class="from-content">
                            <el-table
                                    ref="tableA"
                                    :data="contextTableOne"
                                    @row-click="tableOneRow"
                                    highlight-current-row
                                    :row-style="showRow"
                                    @current-change="handleOneChange"
                                    style="width: 100%">
                                    <el-table-column min-width="50px" :label="$t('common.no')" align="center">
                                      <template slot-scope="scope">
                                        <span>{{ scope.$index+1 }}</span>
                                      </template>
                                    </el-table-column>
                                   <el-table-column v-for="(rowT,i) in this.contenttraycolums_child" :key="`rowTwo${i}`"
                                        :prop="rowT.prop"
                                        :label="commonI18n(rowT)"
                                        :width="rowT.width">
                                        <el-table-column v-for="(val,ind) in rowT.children" :key="`rowOne${ind}`"
                                        :prop="val.prop"
                                        :label="commonI18n(val)"
                                        :width="val.width||defaultWidth">
                                        
                                        </el-table-column>
                                    </el-table-column>
                            </el-table> 
                            <!-- 表格页码 -->
                            <!-- <pagination
                            v-show="total > 0"
                            :total="total"
                            :page.sync="current"
                            :limit.sync="pageSize"
                            @pagination="handleFilter"
                            /> -->
                        </div>
                        <div class="to-content">
                            <div :style="{display:'flex','margin-bottom':'10px'}">
                            <div :style="{width:'50%'}">{{$t('const.taskType.export')}}/{{$t('const.taskType.changeStation')}}</div>
                            <div v-if="roadWindow" :style="{width:'50%',display:'flex',justifyContent:'flex-end'}">
                                <el-button type="primary" @click="doClick(2)" size="mini" plain>{{$t('common.ProcessFlowList.enable')}}</el-button>
                                <el-button type="primary" @click="stopClick(2)" size="mini" plain>{{$t('common.ProcessFlowList.disabled')}}</el-button>
                            </div>
                            </div>
                            <el-table
                                    :data="contextTableTwo"
                                    ref="tableB"
                                    highlight-current-row
                                    @current-change="handleTwoChange"
                                    @row-click="tableTwoRow"
                                    :row-style="showRow"
                                    style="width: 100%">
                                    <el-table-column min-width="50px" :label="$t('common.no')" align="center">
                                      <template slot-scope="scope">
                                        <span>{{ scope.$index+1 }}</span>
                                      </template>
                                    </el-table-column>
                                    <el-table-column v-for="(rowT,i) in this.contenttraycolums_child" :key="`rowTwo${i}`"
                                        :prop="rowT.prop"
                                        :label="commonI18n(rowT)"
                                        :width="rowT.width">
                                        <el-table-column v-for="(val,ind) in rowT.children" :key="`rowOne${ind}`"
                                        :prop="val.prop"
                                        :label="commonI18n(val)"
                                        :width="val.width||defaultWidth">
                                        
                                        </el-table-column>
                                    </el-table-column>
                            </el-table>
                            <!-- 表格页码 -->
                            <!-- <pagination
                                v-show="toTotal > 0"
                                :total="toTotal"
                                :page.sync="toCurrent"
                                :limit.sync="toPageSize"
                                @pagination="toHandleFilter"
                            />  -->
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
    'locInfo': Array,
    'domobjData': Object,
    'initSelect': Object,
    modalTitle: {
        type: String,
    },

  },
  watch: {
    modalVisible:function(newValue,oldValue){
      if(newValue === false){
        Object.assign(this.$data, this.$options.data())
      }else if(newValue === true){
        if(this.domobjData){
            let params1 = {
              pageSize: this.pageSize,
              current: this.current,
              requestData: {
                 toLocType: 2,
                 carryType: this.domobjData.carryType,
              },
            }
          let params2 = {
              pageSize: this.toPageSize,
              current: this.toCurrent,
              requestData: {
                  toLocType: 5,
                 carryType: this.domobjData.carryType,
              },
          }
          if(this.domobjData.carryType == 206 || this.domobjData.carryType == 207){
            params2.requestData.toLocType = 6
          }
          this.lineApi(params1,params2)
        }
      }
    },
   
  },
  computed: {},
  data() {
    return {
      defaultWidth:'90px',
      toCache:null,
      pageSize:10,
      current:1,
      toPageSize:10,
      toCurrent:1,
      activeName:'first',
      modalVisible: false,
      contenttraycolums_child:[
        {prop: 'roadInfo',label:'路径',children:[
            {prop: 'sortNum',label:'序号',},
            {prop: 'pltCateId',label:'托盘类型',},
            {prop: 'matlCateId',label:'物料类别',},
            {prop: 'carryType',label:'搬运类型',},
            {prop: 'cacheCount',label:'缓存数量',width:'100px'},
            {prop: 'carryPriority',label:'搬运顺序',width:'110px'},
            {prop: 'useState',label:'有效标志',},
        ]},
       {prop: 'fromLoc',label:'起点',children:[
            {prop: 'fromLocId',label:'起始位置',},
            {prop: 'fromMatlState',label:'电池状态',width:'120px'},
            {prop: 'fromCodeState',label:'扫码状态',width:'120px'},
            {prop: 'fromMesState',label:'接口状态',width:'100px'},    
        ]}, 
        {prop:'toLoc',label:'终点',children:[
            {prop: 'toLocId',label:'到达位置',},        
            {prop: 'toMatlState',label:'电池状态',width:'100px'},    
            {prop: 'toMesState',label:'接口状态',width:'100px'},    
        ]}

      ],
      contextTableOne: [],
      contextTableTwo: [],
      loadData:[],
      fromRow:{},
      toRow:{},
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
    showRow({row, rowIndwx}) {
      let styleJson = {} 
      if (row.useState === this.$t('common.ProcessFlowList.efficient')) {
        styleJson = {
          'color': 'green'
        }
      } 
      else if(row.useState === this.$t('common.ProcessFlowList.invalid')){
        styleJson = {
          'color': 'red'
        }
      }
      else {
        //  styleJson = {
        //   'color': 'red'
        // }
      }
      return styleJson  // 返回对象
    },




    lineApi(pa1,pa2) {
      let _data = { url: '/api/Job/GetCarryRoad', params: pa1}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data)
      .then(data => {
         let carryTypeData = this.selColumns['selOne'],newData = data.data,
            tt = this.pltCate,Matl = this.MatlCate,{interfaceState,matlState,scanState} = this.initSelect;
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
                this.locInfo.forEach(loc => {
                    if (loc.locId === item.fromLocId) {
                        item.fromLocId = loc.locName
                    }
                    if (loc.locId === item.toLocId) {
                        item.toLocId = loc.locName
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
                })
                scanState.forEach(ca=> {
                    if (parseInt(item.fromCodeState) === parseInt(ca.value)) {
                            item.fromCodeState = ca.label        
                    }
                })
                _this.loadData.forEach(ca=> {
                    if (parseInt(item.pltLoadState) === parseInt(ca.id)) {
                            item.pltLoadState = ca.name        
                    }
                })
                item.useState = item.useState == 1 ? this.$t('common.ProcessFlowList.efficient') : this.$t('common.ProcessFlowList.invalid')
                return item;
            })
          this.contextTableOne = tbData;
        
      }).catch(err => {
          console.error(err)
      })
      let _data_1 = { url: '/api/Job/GetCarryRoad', params: pa2}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data_1)
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
                this.locInfo.forEach(loc => {
                    if (loc.locId === item.fromLocId) {
                        item.fromLocId = loc.locName
                    }
                    if (loc.locId === item.toLocId) {
                        item.toLocId = loc.locName
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
                })
                scanState.forEach(ca=> {
                    if (parseInt(item.fromCodeState) === parseInt(ca.value)) {
                            item.fromCodeState = ca.label        
                    }
                })
                this.loadData.forEach(ca=> {
                            if (parseInt(item.pltLoadState) === parseInt(ca.id)) {
                                    item.pltLoadState = ca.name        
                            }
                        })
                item.useState = item.useState == 1 ? this.$t('common.ProcessFlowList.efficient') : this.$t('common.ProcessFlowList.invalid')

                  return item;
              })
          this.contextTableTwo = tbData;
        
      }).catch(err => {
          console.error(err)
      })
    },
    refrashtable1(pa1){
      let _data = { url: '/api/Job/GetCarryRoad', params: pa1}
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
                this.locInfo.forEach(loc => {
                    if (loc.locId === item.fromLocId) {
                        item.fromLocId = loc.locName
                    }
                    if (loc.locId === item.toLocId) {
                        item.toLocId = loc.locName
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
                })
                scanState.forEach(ca=> {
                    if (parseInt(item.fromCodeState) === parseInt(ca.value)) {
                            item.fromCodeState = ca.label        
                    }
                })
                this.loadData.forEach(ca=> {
                            if (parseInt(item.pltLoadState) === parseInt(ca.id)) {
                                    item.pltLoadState = ca.name        
                            }
                })
                item.useState = item.useState == 1 ? this.$t('common.ProcessFlowList.efficient') : this.$t('common.ProcessFlowList.invalid')


                  return item;
        })
          this.contextTableOne = tbData;
        
      }).catch(err => {
          console.error(err)
      })
    },
    refrashtable2(pa2){
     let _data_1 = { url: '/api/Job/GetCarryRoad', params: pa2}
      this.$store.dispatch('fmsCommon/actionWcsPost', _data_1)
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
                this.locInfo.forEach(loc => {
                           if (loc.locId === item.fromLocId) {
                           item.fromLocId = loc.locName
                       }
                           if (loc.locId === item.toLocId) {
                           item.toLocId = loc.locName
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
                })
                scanState.forEach(ca=> {
                    if (parseInt(item.fromCodeState) === parseInt(ca.value)) {
                            item.fromCodeState = ca.label        
                    }
                })
                this.loadData.forEach(ca=> {
                    if (parseInt(item.pltLoadState) === parseInt(ca.id)) {
                            item.pltLoadState = ca.name        
                    }
                })
                item.useState = item.useState == 1 ? this.$t('common.ProcessFlowList.efficient') : this.$t('common.ProcessFlowList.invalid')

                  return item;
        })
          this.contextTableTwo = tbData;
        
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
            //   let pa2 = {
            //       pageSize: this.pageSize,
            //       current: this.current,
            //       requestData: {
            //         containerCtrlCode: row.containerCtrlCode,
            //         // pltId: 'B51359A2FABB46BFA616911A3C0B4F37',
            //       },
            //   };
            //   let _data2 = { url: '/api/CarryTask/GetCurrentTask', params: pa2}
            //   this.$store.dispatch('fmsCommon/actionWcsPost', _data2)
            //   .then(data => {
            //       this.contextTableTwo = data.data
            //   }).catch(err => {console.error(err)})
        },
        tableTwoRow(row, col, e) {
            this.toRow = row
        },
        // 表1页码修改事件
        handleFilter(pages){
            // this.$emit('fromPage',page)
          if(!this.staTemp.hasOwnProperty('locId')) {
             this.contextTableOne = [];
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
          let _data = { url: '/api/PltInfo/list', params: pa1}
          this.$store.dispatch('fmsCommon/actionWcsPost', _data)
                 .then(data => {
                     let newData = data.data,
                         tt = this.pltCate,Matl = this.MatlCate;
                     let tbData = newData.map(item => {
                            
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
                                 if (loc.id === item.fromLocId) {
                                     item.fromLocId = loc.name
                                 }
                             })
                             return item;
                         })
                     this.contextTableOne = tbData;
                 }).catch(err => {
                     console.error(err)
                 })
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
        doClick(a){ // 启用
            switch (a) {
                case 1:
                        if (!this.fromRow.hasOwnProperty('roadId')) {
                             this.$message(this.$t('const.pleaseSelectRow'))
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
                               message: this.$t('const.useStateSet.enabled'),
                                type: 'success'
                            });
                            let params1 = {
                              pageSize: this.pageSize,
                              current: this.current,
                              requestData: {
                                 toLocType: 2,
                                 carryType: this.domobjData.carryType,
                              },
                            };
                            this.refrashtable1(params1)
                        }).catch(err => {console.error(err)})
                    break;
                    case 2:
                        if (!this.toRow.hasOwnProperty('roadId')) {
                              this.$message(this.$t('const.pleaseSelectRow'))
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
                                message: this.$t('const.useStateSet.enabled'),
                                type: 'success'
                            });
                            let params1 = {
                              pageSize: this.pageSize,
                              current: this.current,
                              requestData: {
                                 toLocType: 5,
                                 carryType: this.domobjData.carryType,
                              },
                            };
                            this.refrashtable2(params1)
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
                              this.$message(this.$t('const.pleaseSelectRow'))
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
                                  message: this.$t('const.useStateSet.disabled'),
                                type: 'success'
                            });
                            let params1 = {
                              pageSize: this.pageSize,
                              current: this.current,
                              requestData: {
                                 toLocType: 2,
                                 carryType: this.domobjData.carryType,
                              },
                            };
                            this.refrashtable1(params1)
                        }).catch(err => {console.error(err)})
                    break;
                    case 2:
                        if (!this.toRow.hasOwnProperty('roadId')) {
                              this.$message(this.$t('const.pleaseSelectRow'))
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
                                 message: this.$t('const.useStateSet.disabled'),
                                type: 'success'
                            });
                            let params1 = {
                              pageSize: this.pageSize,
                              current: this.current,
                              requestData: {
                                 toLocType: 5,
                                 carryType: this.domobjData.carryType,
                              },
                            };
                            this.refrashtable2(params1)
                        }).catch(err => {console.error(err)})
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
