/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: 生产物流监控 - 堆垛机信息弹窗组件
*/ 
<template>
  <div class="modal-class" id="stockerModal">
           <el-dialog v-el-drag-dialog :visible.sync="modalVisible" :title="modalTitle" customClass="updateStyle" >
               <!-- btn_area -->
                    <div v-if="funcBtnShow" :style="btnStyle">
                        <div v-for="(item,i) in btn_all" :key="i+'btn'" >
                           <el-button :type="colorBtn[i]" @click="btnClick(item)" :style="!Array.isArray(item) ? {color:'#FFF'} :
                           (Array.isArray(item) && btnNum ? {color:'green'} : {color:'red'})">{{Array.isArray(item) ? commonI18n(item[Number(btnNum)]) : commonI18n(item)}}</el-button> 
                        </div> 
                    </div>
               <!-- 只有Form -->
                   <div class="modal-content" v-show="isForm">
                        <el-form ref="modalForm" :model="modalTemp" label-position="left" label-width="110px" 
                            :close-on-click-modal="false">
                            <div class='content-layout'>
                                <div v-show='imgExist'>
                                    <img :src="srcObj" :width="img_width" height="100%" />
                                </div>
                                <div>
                                    <el-form-item v-for="(item,i) in firColumns"  
                                    :label="commonI18n(item)+ ': '" 
                                    :prop="item.key" 
                                    :key='i'
                                        >
                                        <el-input v-if="!item.type" v-model="modalTemp[item.key]" :placeholder="$t('const.pleaseInput')" :type="item.type" 
                                        :disabled="item.disabled"
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
                                    </el-form-item>  
                                </div>
                                
                            </div>
                            <!-- 按钮 -->
                             <el-form-item>
                                <el-button type="primary" @click="()=>onFinish()">{{$t('common.btn.ok')}}</el-button>
                                <el-button @click="modalCancel()">{{$t('common.btn.cancel')}}</el-button>
                            </el-form-item> 
                        </el-form>
                    </div>
            <!-- Tab+Form -->
               <el-tabs v-model="activeName"  @tab-click="handleClick" v-show="isTab">
                <el-tab-pane :label="parentLabel['first']" name="first">
                    <div class="modal-content">
                        <el-form ref="modalForm" :model="modalTemp" label-position="left" label-width="115px" :inline='true'
                            :close-on-click-modal="false">
                            <div class='content-layout'>
                                <div v-show='imgExist' >
                                    <img :src="srcObj" :style="{display:'block',width:'230px',height:'100%'}"/>
                                </div>
                                <div>
                                    <el-form-item v-for="(item,i) in firColumns"  
                                    :label="commonI18n(item)+ ': '"
                                    :prop="item.key"
                                    :key='i'
                                    :style="{width:'48%'}"
                                        >
                                        <el-input v-if="!item.type" v-model="modalTemp[item.key]" :placeholder="$t('const.pleaseInput')" :type="item.type" 
                                        :disabled="item.disabled"
                                        />
                                        <el-select v-else-if="item.type==='select'" v-model="modalTemp[item.key]" :placeholder="$t('const.pleaseSelect')" :disabled="item.disabled">
                                            <el-option
                                            v-for='(sel,i) in selColumns[item.selType]'
                                            :key="'sele'+i"
                                            :label="sel[item.selLabel]"
                                            :value="sel[item.selVal]"
                                            />
                                        </el-select>
                                        <el-date-picker v-else-if="item.type === 'datePicker'"
                                            v-model="dateProps"
                                            type="datetime"
                                            :placeholder="$t('const.pleaseSelect')"
                                        />
                                        <el-input class="ta" v-else-if="item.type === 'textarea'" v-model="modalTemp[item.key]" :placeholder="$t('const.pleaseInput')" type="textarea" 
                                        :disabled="item.disabled"
                                        />
                                    </el-form-item>  
                                </div>
                                
                            </div>
                            <!-- 按钮 -->
                            <!-- <el-form-item>
                                <el-button type="primary" @click="()=>onFinish()">确定</el-button>
                                <el-button @click="modalCancel()">取消</el-button>
                            </el-form-item> -->
                        </el-form>
                    </div>
                </el-tab-pane>
                <!-- TAB二 -->
                <el-tab-pane :label="parentLabel['second']" name="second">
                        <!-- 只有FORM表单 -->
                        <div class='tab-task' v-if="formOnly">
                            <el-form ref="modalForm_s" :model="modalTemp" label-position="left" label-width="120px"
                                :close-on-click-modal="false">
                            <el-form-item v-for="(item,i) in secColumns"  
                                    :label="commonI18n(item)+ ': '" 
                                    :prop="item.key" 
                                    :key='i'
                                        >
                                    <el-input v-if="!item.type" v-model="modalTemp[item.key]" :placeholder="$t('const.pleaseInput')" :type="item.type"
                                    :disabled="item.disabled"    />
                                    <el-select v-else-if="item.type==='select'" v-model="modalTemp[item.key]" :placeholder="$t('const.pleaseSelect')" :disabled="item.disabled">
                                            <el-option
                                                v-for='(sel,i) in selColumns[item.selType]'
                                                :key="'sel'+i"
                                                :label="sel.lab"
                                                :value="sel.val"
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
                                </el-form-item> 
                                </el-form> 
                        </div>
                        <!--多个图表类型 -->
                        <div class='tab-task2' v-else-if="alltype" :style="{height:'600px',overflowY:'scroll'}">
                            <div :style="{display:'flex',marginBottom:'8px'}">
                               <div v-text="rowOne" :style="{width:'50%'}"/> 
                               <div :style="{width:'50%','margin-right':'10px',display:'flex',justifyContent:'flex-end'}">
                                   <el-button type="warning" size="mini" @click="rePost">{{$t('taskOperate.postAgain')}}</el-button>
                                   <el-button type="warning" size="mini" @click="forceFinish">{{$t('taskOperate.completeForcibly')}}</el-button>
                               </div>
                            </div>
                            <el-form ref="modalForm_s" :model="modalTempOne" label-position="left" label-width="120px"  :inline="true"
                                :close-on-click-modal="false">
                                <el-row>
                                    <div v-for="(item,i) in secColumns" :key='i'>
                                    <el-col :span="8">
                                    <el-form-item  
                                            :label="commonI18n(item)+ ': '" 
                                            :prop="item.key" 
                                                >
                                        <el-input v-if="!item.type" v-model="modalTempOne[item.key]" :placeholder="$t('const.pleaseInput')" :type="item.type"
                                        :disabled="item.disabled" />
                                        <el-select v-else-if="item.type==='select'" v-model="modalTempOne[item.key]"
                                        :placeholder="$t('const.pleaseInput')" :disabled="item.disabled" >
                                                <el-option
                                                    v-for='(sel,i) in selColumns[item.selType]'
                                                    :key="'sel'+i"
                                                    :label="sel[item.selLabel]"
                                                    :value="sel[item.selVal]"
                                                    />
                                                </el-select>
                                        <el-date-picker v-else-if="item.type === 'datePicker'"
                                                    v-model="dateProps"
                                                    type="datetime"
                                                    :placeholder="$t('const.pleaseSelect')"
                                            />
                                        <el-input v-else-if="item.type === 'textarea'" v-model="modalTempOne[item.key]" :placeholder="$t('const.pleaseInput')" type="textarea" 
                                                :disabled="item.disabled"
                                                />
                                    </el-form-item> 
                                    </el-col>
                                 </div>
                                 </el-row>
                                </el-form>
                            <div>
                            <el-tabs v-model="innerActiveName" @tab-click="innerHandleClick">
                                <el-tab-pane :label="rowTwo['first']" name="one">
                                <el-table
                                    :data="tableOneData"
                                    style="width: 100%">
                                    <el-table-column v-for="(row,i) in rowTwoTable" :key="`row${i}`"
                                        :prop="row.prop"
                                        :label="commonI18n(row)"
                                        :width="row.width">
                                    </el-table-column>
                                    </el-table> 
                                </el-tab-pane>
                                <el-tab-pane :label="rowTwo['second']" name="two">
                                    <el-table
                                    :data="tableTwoData"
                                    style="width: 100%">
                                    <el-table-column v-for="(row,i) in rowSecondTable" :key="`row${i}`"
                                        :prop="row.prop"
                                        :label="commonI18n(row)"
                                        :width="row.width">
                                    </el-table-column>
                                    </el-table> 
                                </el-tab-pane>
                            </el-tabs>  
                            </div>
                            <!-- 版块三 -->
                            <div v-text="rowThree" :style="{margin:'10px 0'}"/> 
                            <el-table
                                :data="tableThreeData"
                                style="width: 100%">
                                <el-table-column v-for="(row,i) in rowThreeTable" :key="`row${i}`"
                                    :prop="row.prop"
                                    :label="commonI18n(row)"
                                    :width="row.width">
                                </el-table-column>
                            </el-table>  
                        </div>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog';
export default {
 directives: {elDragDialog},
//   mixins: [],
  props: {
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
    isForm: {type: Boolean, default: false},
    'isTab': Boolean, 
    'parentLabel': Object,
    'imgExist': Boolean,
    'srcObj': String,
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
  },
  mounted() {
  },
  beforeDestroy() {

  },
  methods: {
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
      modalCancel() {
        this.modalVisible = false;
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
    .el-dialog {
         .updateStyle{
            .tab-task2 {
                height:470px !important;
                overflow-y:scroll;
            } 
        }
        
        .content-layout {
                display: flex;
            } 
    }
    .el-input{
        width: 200px;
    }
    .el-select{
        width: 200px;
    }
    .ta{
        width: 200px;
    }
    
</style>
<style>
    #stockerModal .updateStyle {
        width:1100px !important;
    }
</style>
