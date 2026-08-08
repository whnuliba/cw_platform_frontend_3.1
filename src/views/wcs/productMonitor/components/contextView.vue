/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: 路径查看模态框
*/ 
<template>
  <div class="modal-class ">
           <el-dialog v-el-drag-dialog :visible.sync="modalVisible" :title="modalTitle" customClass="contextReadStyle" @close="roadClose">
               <div class="table-content">
                    <div>
                        <div :style="{display:'flex','margin-bottom':'10px'}">
                            <div  class='row-title'>{{tableOneTitle}}</div>
                            <div v-if="roadWindow" :style="{width:'50%',display:'flex',justifyContent:'flex-end'}">
                                <el-button type="primary" @click="doClick(1)" size="mini"  plain>{{$t('common.ProcessFlowList.enable')}}</el-button>
                                <el-button type="primary" @click="stopClick(1)" size="mini" plain>{{$t('common.ProcessFlowList.disabled')}}</el-button>
                                <el-button type="primary" @click="modifyCache(1)" size="mini" plain>{{$t('const.editCache')}}</el-button>
                            </div>
                            <!-- <div v-else-if="curLotWindow">
                                <v-button type="primary" @click="unBind">解绑<v-button/>
                                <v-button type="primary" @click="bindClick">梆盘<v-button/>
                            </div> -->
                        </div>
                        <div class="from-content">
                            <el-table
                                    ref="tableA"
                                    :data="tableOneData"
                                    height='200'
                                    :border='true'
                                    @row-click="tableOneRow"
                                    :row-class-name="rowClassName"
                                    highlight-current-row
                                    @current-change="handleOneChange"
                                    style="width: 100%">
                                    <el-table-column min-width="50px" :label="$t('common.no')" align="center">
                                      <template slot-scope="scope">
                                        <span>{{ scope.$index+1 }}</span>
                                      </template>
                                    </el-table-column>
                                    <el-table-column v-for="(row,i) in rowOneTable" :key="`rowOne${i}`"
                                        :prop="row.field"
                                         :label="commonI18n(row)"
                                        :width="row.width||defalutWidth">
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
                        <!-- 到达路径表格 -->
                        <div class="to-content">
                            <div :style="{display:'flex','margin-bottom':'10px'}">
                            <div class='row-title'>{{tableTwoTitle}}</div>
                            <div v-if="roadWindow" :style="{width:'50%',display:'flex',justifyContent:'flex-end'}">
                                <el-button type="primary" @click="doClick(2)" size="mini" plain>{{$t('common.ProcessFlowList.enable')}}</el-button>
                                <el-button type="primary" @click="stopClick(2)" size="mini" plain>{{$t('common.ProcessFlowList.disabled')}}</el-button>
                                <el-button type="primary" @click="modifyCache(2)" size="mini" plain>{{$t('const.editCache')}}</el-button>
                            </div>
                            <!-- <div v-else-if="curLotWindow">
                                <v-button type="primary" @click="unBind">解绑<v-button/>
                                <v-button type="primary" @click="bindClick">梆盘<v-button/>
                            </div> -->
                            </div>
                            <el-table
                                    :data="tableTwoData"
                                    ref="tableB"
                                    height='200'
                                    :border='true'
                                    highlight-current-row
                                    @current-change="handleTwoChange"
                                    @row-click="tableTwoRow"
                                     :row-class-name="rowClassName"
                                    style="width: 100%">
                                    <el-table-column min-width="50px" :label="$t('common.no')" align="center">
                                      <template slot-scope="scope">
                                        <span>{{ scope.$index+1 }}</span>
                                      </template>
                                    </el-table-column>
                                    <el-table-column v-for="(rowT,i) in rowTwoTable" :key="`rowTwo${i}`"
                                        :prop="rowT.field"
                                        :label="commonI18n(rowT)"
                                        :width="rowT.width||defalutWidth">
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
         <el-dialog v-el-drag-dialog :visible.sync="NumberVisible" :title="$t('const.editCache')" >
               <el-form ref="inputNumber" :model="inputNumber" label-position="left" label-width="100px"
                            :close-on-click-modal="false">
                                    <el-form-item   
                                        :label="$t('const.cacheCount')" 
                                        prop="cacheCount" 
                                        >
                                        <el-input-number  v-model="inputNumber.cacheCount" :label="$t('const.pleaseInput')" :min="-1" />
                                    </el-form-item> 
                                    <el-form-item>
                                        <el-button type="primary" @click="submitForm()">{{$t('common.btn.submit')}}</el-button>
                                        <el-button @click="NumberVisible = false">{{$t('common.btn.cancel')}}</el-button>
                                    </el-form-item>
                </el-form> 
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
    'rowOneTable':Array,
    'rowTwoTable':Array,
    'tableOneData':Array,
    'tableTwoData':Array,
    'isRightTable':Boolean,
    'stockerlayOrPick': String,
    'carryType': Number,
    modalTitle: {
        type: String,
    },

  },
  watch: {
    //   carryType: {
    //       handler(newT, oldT) {
    //       },
    //       immediate: true,
    //       deep: true
    //   },
  },
  computed: {},
  data() {
    return {
        defalutWidth:'90px',
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
      ctrlCodeData: [
          {title:'排'},
          {title:'列'},
          {title:'层'},
      ],
      locSel:{selOne:[], selTwo:[]},  // 位置类型下拉数据
      forkSelData: [],
      staSelect:[],
      fromRow:{},
      toRow:{},
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
        // 模态关闭事件
        roadClose(){
            this.fromRow = {};
            this.toRow = {};
        },

        rowClassName({row,rowIndex}){
            if (row.useState == this.$t('common.ProcessFlowList.efficient')) {
                return 'rowUse'
            } else {
                return 'rowUnUse'
            }
        },
        translateText(type){
            return this.textI18n[type][this.$store.state.app.language];
        },
        // 确定修改缓存数  
        submitForm(){
             switch (this.toCache) {
                    case 1:
                            let pa1 = {
                                data:{
                                    roadId: this.fromRow.roadId,
                                    cacheCount: this.inputNumber.cacheCount,
                                }
                            };
                            let _data1 = { url: '/api/Job/MonitorEditCarryRoad', params: pa1}
                            this.$store.dispatch('fmsCommon/actionWcsPost', _data1)
                            .then(data => {
                                this.NumberVisible = false;
                                this.$emit('roadStartFresh')
                                this.$message({
                                    message: this.$t('common.btn.submitSuccess'),
                                    type: 'success'
                                });
                            }).catch(err => {console.error(err)})
                        break;
                    case 2:
                        let pa2 = {
                            data:{
                                roadId: this.toRow.roadId,
                                cacheCount: this.inputNumber.cacheCount,
                            }
                        };
                        let _data2 = { url: '/api/Job/MonitorEditCarryRoad', params: pa2}
                        this.$store.dispatch('fmsCommon/actionWcsPost', _data2)
                        .then(data => {
                            this.NumberVisible = false;
                            this.$emit('roadToFresh')
                            this.$message({
                                message:  this.$t('common.btn.submitSuccess'),
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
        tableOneRow(row, col, e) {
            this.fromRow = row
        },
        tableTwoRow(row, col, e) {
            this.toRow = row
        },
        // 表1页码修改事件
        handleFilter(page){
            this.$emit('fromPage',page)
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
                            this.$emit('roadStartFresh')
                            this.$message({
                                message: this.$t('const.useStateSet.enabled'),
                                type: 'success'
                            });
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
                            this.$emit('roadToFresh')
                            this.$message({
                                message: this.$t('const.useStateSet.enabled'),
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
                            this.$emit('roadStartFresh')
                            this.$message({
                                message: this.$t('const.useStateSet.disabled'),
                                type: 'success'
                            });
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
                            this.$emit('roadToFresh')
                            this.$message({
                                message: this.$t('const.useStateSet.disabled'),
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
                             this.$message(this.$t('const.pleaseSelectRow'))
                                return;
                            }
                        this.inputNumber.cacheCount = this.fromRow.cacheCount
                        this.NumberVisible = true;
                        this.toCache = 1;
                        break;
                    case 2:
                        if (!this.toRow.hasOwnProperty('roadId')) {
                             this.$message(this.$t('const.pleaseSelectRow'))
                                return;
                            }
                        this.inputNumber.cacheCount = this.toRow.cacheCount
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
<style lang="less" scope>
    .table-content{
        .row-title{
            width:50%;
            display:flex;
            align-items:center;
        }
       .from-content{
            margin-bottom: 20px;
        } 
        .el-table {
                .rowUse {
                    color:green !important;
                }
                .rowUnUse {
                    color:red !important;
                }
            }
    }
    
     
</style>
