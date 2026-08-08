/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: 工艺审批 - 参数自定义设置form
*/ 
<template>
  <div class="form-class" id="formIndex">
            <div class="form-content">
                    <el-form ref="modalForm" :model="modalTemp" label-position="left" label-width="90px" 
                            :close-on-click-modal="false">
                            <div class='content-layout'>
                                <div>
                                    <el-form-item v-for="(item,i) in firColumns"  
                                    :label="commonI18n(item)+ ':'" 
                                    :prop="item.key" 
                                    :key='i'
                                        >
                                        <el-input v-if="!item.type" v-model="modalTemp[item.key]" :placeholder="$t('const.pleaseInput')" :type="item.type" 
                                        :disabled="item.disabled" width="50px"
                                        />
                                        <el-select v-else-if="item.type==='select'" :filterable="true" v-model="modalTemp[item.key]" 
                                                @change="(val)=>selChanged(val,item.selType)"   :placeholder="$t('const.pleaseInput')"
                                                 :disabled="item.label === '区域' ? isInputDisAbled : item.disabled">
                                            <el-option
                                                v-for='sel in selColumns[item.selType]'
                                                :key="sel[item.selVal]"
                                                :label="sel[item.selLabel]"
                                                :value="sel[item.selVal]"
                                            />
                                        </el-select>
                                        <el-date-picker v-else-if="item.type === 'datePicker'"
                                            v-model="dateProps"
                                            type="datetime"
                                            :placeholder="$t('const.pleaseSelect')"
                                        />
                                        <el-input v-else-if="item.type === 'textarea'" v-model="modalTemp[item.key]" :placeholder="$t('const.pleaseInput')" type="textarea" 
                                        :disabled="item.disabled"
                                        />
                                        <el-cascader  v-else-if="item.type === 'cascader'"
                                        :options="options"
                                        clearable
                                        v-model="modalTemp[item.key]"
                                        :props="{multiple: item.isMulti}"
                                        @change="cascaderChange"
                                       ></el-cascader>
                                    </el-form-item>  
                                </div>
                                
                            </div>
                            <!-- 按钮 -->
                             <el-form-item>
                                <el-button type="primary" @click="()=>onFinish()">{{$t('common.btn.ok')}}</el-button>
                                <!-- <el-button @click="modalReset()">{{$t('common.btn.reset')}}</el-button> -->
                            </el-form-item> 
                        </el-form>
                    </div>     
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog';
export default {
 directives: {elDragDialog},
//   mixins: [],
  props: {
    'options': Array,
    'isInputDisAbled':Boolean,
    'colorBtn':Array, 
    'tableOneData':Array,
    'tableTwoData':Array,
    'tableThreeData':Array,
    'rowThreeTable': Array,
    'rowTwoTable': Array,
    'rowSecondTable': Array,
    'alltype':Boolean,
    'formOnly':Boolean,
    'rowOne':String,
    'rowTwo':Object,
    'rowThree':String,
    'btnNum': Boolean,
    'img_width': String,
    'btnStyle':Object,
    'btn_all':Array,
    'funcBtnShow': Boolean,
    'nodeCancel': Function,
    modalTemp:{
        type: Object
    },
    modalTempOne: {
        type: Object
    },
    modalTempTwo: {
        type: Object
    },
    modalTitle: {
        type: String,
    },
    columns: {
        type: Array,
    },
    selColumns: {type: Object},
    firColumns: {type: Array},
    secColumns: {type: Array},
    dateProps: {type: String},
    numTemp:{
        type: Object
    },
    'modalFormInfo': Object
  },
  watch: {
    //   modalTitle: {
    //       handler(newTil, oldTil) {
    //           console.log(newTil, oldTil)
    //       },
    //       immediate: true,
    //       deep: true
    //   },
  },
  computed: {
     
  },
  data() {
    return {
      activeName:'first',
      modalVisible: false,
      innerActiveName:'one',
    }
  },
  created() {
    console.log('111', this.firColumns)
  },
  mounted() {
    console.log('111', this.firColumns)
  },
  beforeDestroy() {
},
  methods: {
      cascaderChange(val) {
        console.log(val)
        },
      btnClick(item){
          if (Array.isArray(item)) {
              this.activeName = 'first';
          }
          this.$emit("btnClick", item);
      },
      // 下拉框改变事件
      selChanged(val,sel) {
          this.$emit('selFunc',val,sel) 
      },
      modalReset() {
        // this.modalVisible = false;
      },
      modalOpen() {
        this.modalVisible = true;
        this.$nextTick(() => {
           this.$refs['modalForm'].clearValidate(); 
        })
          
      },
      onFinish() {
          this.$emit('moveOnFinish',this.modalTemp)
          this.modalVisible = false;
      },
      handleClick(val){
          this.$emit('stockerhandleClick',val)
      },
      innerHandleClick(){},
      rePost(){
          this.$emit("rePostFunc");
      },
      forceFinish(){
          this.$emit("forceFinishFunc");
      },
  }
}
</script>

<style lang="less" scoped>
    #formIndex {
        .content-layout {
                    display: flex;  
                } 
        .el-input{
            width: 140px;
        }
        .el-select{
            width: 140px;
        }
    }
    
    
</style>

