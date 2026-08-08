/*
 * @CreatAuthor: 杨沛霖
 * @UpdateAuthor: (...)
 * @Description: PLC补录模态框
*/ 
<template>
  <div class="modal-class plc">
           <el-dialog  v-el-drag-dialog :visible.sync="modalVisible" :title="modalTitle" custom-class="contextReadStyle" >
               <div class="table-content">
                    <div>
                      <div :style="{display:'flex','margin-top':'10px'}">
                            <div :style="{width:'50%', 'font-weight':'bold'}">{{$t('const.pltInfo')}}</div>
                      </div>
                      <div class="iptcontent">
                        <div :style="{display:'flex','margin-bottom':'10px', 'justify-content':'flex-start'}">
                          <div :style="{display:'flex','margin-top':'10px','margin-right':'50px'}">
                            <div :style="{width:'50%','line-height':'36px'}">{{commonI18n(getItem(contenttraycolums,'pltCtrlCode'))}}:</div>
                            <el-input v-model="input1" :placeholder="$t('const.pleaseInput')"></el-input>
                            <el-button :style="{'margin-left':'10px'}" type="primary"  @click="doClick(1)">{{$t('common.btn.query')}}</el-button>
                          </div>
                          <!-- <div :style="{display:'flex','margin-top':'10px'}">

                            <div :style="{width:'40%','line-height':'36px'}">{{commonI18n(getItem(contenttraycolums,'pltCode'))}}:</div>
                            <el-input v-model="input2" :placeholder="$t('const.pleaseInput')"></el-input>
                            <el-button :style="{'margin-left':'10px'}" type="primary"  @click="doClick(2)">{{$t('common.btn.query')}}</el-button>
                          </div> -->
                        </div>
                      </div>
                    </div>
                    <el-table
                      ref="tableA"
                      height='200px'
                      :border='true'
                      :data="contextTableOne"
                      @row-click="tableRow"
                      highlight-current-row
                      @current-change="handleOneChange"
                      style="width: 100%">
                      <el-table-column v-for="(row,i) in this.contenttraycolums" :key="`rowOne${i}`"
                          :prop="row.field"
                          :label="commonI18n(row)"
                          :width="row.width||defaultWidth">
                        
                      </el-table-column>
                    </el-table> 
                    <div class="datadata" :style="{display:'flex','margin-top':'10px'}">
                      <div class="olddata" :style="{width:'50%'}">
                        <fieldset>
                          <legend>{{$t('const.data.old')}}</legend>
                          <el-form size='mini' ref="form0" :model="oldform" label-width="120px">
                            <el-form-item v-for="(row,i) in this.oldcolums" :key="`rowOne${i}`" :label="commonI18n(row)">
                              <el-input :disabled="true" v-model="oldform[row.field]"></el-input>

                            </el-form-item>
                          </el-form>
                        </fieldset>
                      </div>
                      <div class="newdata" :style="{width:'50%', color:'blue!important'}">
                        <fieldset>
                          <legend>{{$t('const.data.new')}}</legend>
                          <el-form size='mini' ref="form1" :model="newform" label-width="120px">
                           <el-form-item v-for="(item,i) in newcolums"  :key="i" :label="commonI18n(item)" :prop="item.field">
                                <el-input v-if="!item.type"  v-model="newform[item.field]" :disabled="item.readonly != 'true'?false:true" />
                                <el-select v-else-if="item.type === 'select'" v-model="newform[item.field]" :disabled="item.readonly != 'true'?false:true">
                                    <el-option
                                        v-for="(sel,s) in initSelect[item.selOption]"
                                        :key="item.field+s"
                                        :label="sel[item.selLabel]"
                                        :value="sel[item.selVal]">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                          </el-form>
                        </fieldset>
                      </div>
                    </div>
                    <span slot="footer" class="dialog-footer" :style="{'margin-top':'10px',display:'flex',justifyContent:'flex-end'}">
                      <el-button @click="modalVisible = false">{{$t('common.btn.cancel')}}</el-button>
                      <el-button type="primary" @click="write">{{$t('common.btn.ok')}}</el-button>
                    </span>
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
    'domobjData': Object,
    'selColumns': Object,
    'initSelect': Object,
    'pltCate': Array,
    'MatlCate': Array,
    'locInfo': Array,
    'locSelOption': Object,
    modalTitle: {
        type: String,
    },

  },
  watch: {
    'newform.taskNum':{
      handler(newValue,oldValue){
        
      },
      // immediate: true, 
      deep: true
    },
    

    modalVisible:function(newValue,oldValue){
      if(newValue === false){
        Object.assign(this.$data, this.$options.data())
      }else{
        if (this.domobjData){
      
          if(this.domobjData.carryType) {
            if (this.domobjData.eqType === '堆垛机') {
              return;
            }
            let params = {
              carryType:this.domobjData.carryType,
              locNum:String(this.domobjData.ctrlCode) ,
            }
            let _data = { url: '/api/Conveyor/GetConveyorTask', params: {data:params}}
            this.$store.dispatch('fmsCommon/actionWcsPost', _data)
            .then(data => {
              this.oldform = data.conveyorTask
               let {interfaceState,matlState,scanState,otherState_PLC,otherState_PC} = this.initSelect;
              interfaceState.forEach(ca=> {
                  if (parseInt(this.oldform.interfaceState) === parseInt(ca.value)) {
                          this.oldform.interfaceState = ca.label        
                  }
              })
              matlState.forEach(ca=> {
                  if (parseInt(this.oldform.matlState) === parseInt(ca.value)) {
                          this.oldform.matlState = ca.label        
                  }
              })
              scanState.forEach(ca=> {
                  if (parseInt(this.oldform.scanState) === parseInt(ca.value)) {
                          this.oldform.scanState = ca.label        
                  }
              })
              otherState_PLC.forEach(ca=> {
                  if (parseInt(this.oldform.otherState_PLC) === parseInt(ca.value)) {
                          this.oldform.otherState_PLC = ca.label        
                  }
              })
              otherState_PC.forEach(ca=> {
                  if (parseInt(this.oldform.otherState_PC) === parseInt(ca.value)) {
                          this.oldform.otherState_PC = ca.label        
                  }
              })
            }).catch(err => {
                console.error(err)
            })
          let _data1 = { url: '/api/Conveyor/GetPlcAddTask', params: {data:params}}
          this.$store.dispatch('fmsCommon/actionWcsPost', _data1)
          .then(data => {
             let carryTypeData = this.selColumns['selOne'],newData = data,
                                    tt = this.pltCate,Matl = this.MatlCate,{interfaceState,matlState,scanState} = this.initSelect,{selTen} = this.locSelOption;
              console.log(tt);
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
                      scanState.forEach(ca=> {
                        if (parseInt(item.codeState) === parseInt(ca.value)) {
                                item.codeState = ca.label        
                        }
                      })
                       selTen.forEach(ca=> {
                        if (parseInt(item.carryState) === parseInt(ca.id)) {
                                item.carryState = ca.name        
                        }
                      })
                       this.loadData.forEach(ca=> {
                        if (parseInt(item.pltLoadState) === parseInt(ca.id)) {
                                item.pltLoadState = ca.name        
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
                      return item;
                  })
              this.contextTableOne = tbData;
              this.total = data.total;
          }).catch(err => {
              console.error(err)
          })
          }
        }


      }
    },
    staTempp:function (newValue,oldValue){
      if(newValue.locId) {
        let params1 = {
              pageSize: this.pageSize,
              current: this.current,
              requestData: {
                  fromLocId: newValue.locId,
                  carryState:0,
              },
          }
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
      input1:'',
      input2:'',
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
        {field: 'carryState',label:'搬运状态',},        
        {field: 'pltLoadState',label:'载货状态',width:'110px'},        
        {field: 'pltCode',label:'托盘编号',width:'100px'},
        {field: 'pltCtrlCode',label:'托盘类型',width:'110px'},
        {field: 'taskNum',label:'任务号',},
        {field: 'matlState',label:'电池状态',},        
        {field: 'codeState',label:'扫码状态',},        
        {field: 'mesState',label:'接口状态',},        
        {field: 'fromLocId',label:'来源位置',width:'120px'},      
        {field: 'fromCtrlCode',label:'来源调度号',},
        {field: 'toLocId',label:'目标位置',width:'100px'},
        {field: 'toCtrlCode',label:'目标调度号',},
        // {prop: 'locId',label:'任务时间',},
        // {prop: 'locId',label:'搬运时间',},
        // {prop: 'locId',label:'到位时间',},
                
      ],
      oldform:{
        taskNum:'',
        trayNum:'',
        trayType:'',
        matlState:'',
        scanState:'',
        interfaceState:'',
        otherState_PC:'',
        otherState_PLC:'',
        fromLocNum:'',
        toLocNum:'',
        trayCount:'',
      },
      newform:{
        taskNum:'',
        trayNum:'',
        trayType:'',
        matlState:'',
        scanState:'',
        interfaceState:'',
        otherState_PC:'',
        otherState_PLC:'',
        fromLocNum:'',
        toLocNum:'',
        trayCount:'',
      },
      oldcolums:[
        {field: 'taskNum',label:'任务号',},
        {field: 'trayNum',label:'托盘编号',},        
        {field: 'trayType',label:'托盘类型',},        
        {field: 'matlState',label:'电池状态',},
        {field: 'scanState',label:'扫码状态',},
        {field: 'interfaceState',label:'接口状态',},
        {field: 'otherState_PC',label:'其他状态PC',},        
        {field: 'otherState_PLC',label:'其他状态PLC',},        
        {field: 'fromLocNum',label:'来源位置',},        
        {field: 'toLocNum',label:'目标位置',},        
        {field: 'trayCount',label:'托盘数量',},        
      ],
      newcolums:[
        {field: 'taskNum',label:'任务号',},
        {field: 'trayNum',label:'托盘编号',},        
        {field: 'trayType',label:'托盘类型',type:'select',selOption:'trayType',selVal:'value',selLabel:'label'},        
        {field: 'matlState',label:'电池状态',type:'select',selOption:'matlState',selVal:'value',selLabel:'label'},
        {field: 'scanState',label:'扫码状态',type:'select',selOption:'scanState',selVal:'value',selLabel:'label'},
        {field: 'interfaceState',label:'接口状态',type:'select',selOption:'interfaceState',selVal:'value',selLabel:'label'},
        {field: 'otherState_PC',label:'其他状态PC',type:'select',selOption:'otherState_PC',selVal:'value',selLabel:'label'},        
        {field: 'otherState_PLC',label:'其他状态PLC',type:'select',selOption:'otherState_PLC',selVal:'value',selLabel:'label'},        
        {field: 'fromLocNum',label:'来源位置',},        
        {field: 'toLocNum',label:'目标位置',},        
        {field: 'trayCount',label:'托盘数量',},        
      ],
      contextTableOne: [],
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
    getItem(arr,field){
      for(let item of arr){
          if(item.field==field)
          return item;
      }
    },
    write(){
      let _data = { url: '/api/Conveyor/WriteConveyorTask', params: {data:{...this.newform,carryType:this.domobjData.carryType,locNum:this.domobjData.ctrlCode}}}
       this.$store.dispatch('fmsCommon/actionWcsPost', _data)
     .then(data => {
         this.$message.success('补录成功');
         this.modalVisible = false;
      }).catch(err => {
          console.error(err)
      })
    },
    doClick(val){
      let inpdata = ''
      if(val==1){
        inpdata = this.input1
      }else{
        inpdata = this.input2
      }

     
       let _data_1 = { url: '/api/Conveyor/GetConveyorTaskByCode', params: {data:inpdata}}
       this.$store.dispatch('fmsCommon/actionWcsPost', _data_1)
      .then(data => {
        let {interfaceState,matlState,scanState,otherState_PLC,otherState_PC} = this.initSelect;

        if(data.carryType == 0){
          this.$message.error('搬运类型错误');
          return null;
        }

          this.newform = data 

       
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
        tableRow(row, col, e) {
            this.fromRow = row
              let _data_1 = { url: '/api/Conveyor/GetConveyorTaskByCode', params: {data:row.pltCtrlCode}}
             this.$store.dispatch('fmsCommon/actionWcsPost', _data_1)
            .then(data => {
              this.newform = data
           
             
            }).catch(err => {
                console.error(err)
            })
             
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
    .el-form-item{
      margin-bottom: 0px;
    }
    .el-select {
   
    width: 100%;
  }
</style>
