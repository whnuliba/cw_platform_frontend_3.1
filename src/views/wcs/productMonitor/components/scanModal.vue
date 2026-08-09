/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: 扫码枪模态框
*/ 
<template>
  <div class="modal-class">
           <el-dialog v-el-drag-dialog :visible.sync="scanVisible" :title="$t('const.scanInfo')" customClass="layPickStyle">
                   <div class="modal-content">
                        <el-form ref="scanForm" :model="modalScanInfo" label-position="left" label-width="100px"
                            :close-on-click-modal="false">
                            <div class='pick-layout'>
                                <div>
                                    <el-form-item v-for="(item,i) in lpColumns"  
                                    :label="commonI18n(item)+ ': '" 
                                    :prop="item.key" 
                                    :key='i'
                                        >
                                        <el-input v-if="!item.type" v-model="modalScanInfo[item.key]" :placeholder="$t('const.pleaseInput')+commonI18n(item)" :type="item.type" 
                                        :disabled="item.disabled"
                                        />
                                        <el-select v-else-if="item.type==='select'" :filterable="true" v-model="modalScanInfo[item.key]"
                                                @change="selChanged"  :placeholder="$t('const.pleaseInput')+commonI18n(item)" :disabled="item.disabled">
                                            <el-option
                                                v-for='(sel,i) in checkFlagData'
                                                :key="'sel'+i"
                                                :label="sel.name"
                                                :value="sel.id"
                                            />
                                        </el-select>
                                        <el-date-picker v-else-if="item.type === 'datePicker'"
                                            v-model="dateProps"
                                            type="datetime" 
                                        />
                                        <div v-else-if="item.type === 'num'" :label="item.label"></div>
                                        <el-input-number v-else-if="item.type === 'numInput'"  v-model="modalScanInfo[item.key]" 
                                        controls-position="right" @change="handleChange(item.key)" :min="1" :max="50"/>
                                    </el-form-item>  
                                </div>
                                
                            </div>
                            <!-- 按钮 -->
                             <el-form-item>
                                <el-button type="primary" @click="onFinish">{{$t('common.btn.ok')}}</el-button>
                                <el-button @click="modalCancel()">{{$t('common.btn.cancel')}}</el-button>
                            </el-form-item> 
                        </el-form>
                    </div>
        </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog';
export default {
 directives: {elDragDialog},
  props: {
    "locationNum":Number,
    'stockerlayOrPick': String,
    'scanCarryType': Number,
    'scancheckFlag': String,
    modalTitle: {
        type: String,
    },
    "modalScanInfo": Object,
    columns: {
        type: Array,
    },
    dateProps: {type: String},
  },

  computed: {},
  data() {
    return {
      scanVisible: false,
      scanTitle:"读码器信息查看",
      modalTemp:{
          locNum:undefined,
          carryType:undefined,
          checkFlag_PLC:undefined,
          checkFlag_PC:undefined,
          trayNum:undefined,
          trayBarCode:undefined,
      },
      lpColumns: [
                    {key:'carryType',label:'所在区域',disabled:true},
                    {key:'locNum',label:'站台编号',disabled:true},
                    {key:'checkFlag_PLC',label:'信号_PLC',type:'select',disabled:true},
                    {key:'checkFlag_PC',label:'信号_PC',type:'select'},
                    {key:'trayNum',label:'托盘编号',disabled:true},
                    {key:'trayBarCode',label:'托盘条码',disabled:true},
                ],
      checkFlagData: [],
    }
  },
  created() {
      this.selData();
  },
  mounted() {
  },
  beforeDestroy() {

  },
  methods: {
    
      selData() {
        // 交互标识数据
        let _data = {url:'/api/Const/ScanerCheckFlag',params: {}}
        this.$store.dispatch('fmsCommon/actionWcsPost',_data)
                .then(data => {
                    this.checkFlagData = data;
                }).catch(err => {
                    console.error(err)
                })

      },
      // 下拉框改变事件
      selChanged(val,sel) {
         
      },
      modalCancel() {
        this.scanVisible = false;
      },
      modalScanOpen() {
        this.scanVisible = true;
        this.$nextTick(() => {
           this.$refs['scanForm'].clearValidate(); 
        })
      },
      onFinish() {
          let paramData = {
            data: this.modalScanInfo   
          }
          let _data = {url:'/api/Scaner/WriteScanerFlag',params: paramData}
          this.$store.dispatch('fmsCommon/actionWcsPost',_data)
                    .then(data => {
                        console.log(data)
                       this.$message(this.$t('common.btn.updateSuccess'))
                    }).catch(err => {
                        console.error(err)
                    })
          this.scanVisible = false;
      },
  }
}
</script>
<style lang="less" scoped>
    .layPickStyle{
        height:30% !important;
    }
     
</style>
