/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: 公共组件 - Form模态框组件
*/ 
<template>
  <div class="form-modal-class">
           <el-dialog v-el-drag-dialog :visible.sync="modalVisible" :title="modalTitle" customClass="formStyle">
               <!-- 顶部按钮 -->
                    <div v-if="funcBtnShow" :style="btnStyle">
                        <div v-for="(item,i) in btn_all" :key="i+'btn'" >
                           <el-button :type="colorBtn[i]" @click="btnClick(item)">{{item}}</el-button> 
                        </div> 
                    </div>
                <!--Form -->
                   <div class="form-content">
                        <el-form ref="modalTemp" :inline="true" :model="modalTemp" :rules="rules" label-position="left" label-width="80px" 
                            :close-on-click-modal="false">
                            <div class='content-layout'>
                                <div v-show='imgExist'>
                                    <img :src="srcObj" :width="img_width" height="100%" />
                                </div> 
                                <el-row>
                                <div v-for="(item,i) in formColumns" :key='i' style="display: inline">
                                 <el-col :span="spanNum">
                                    <el-form-item  
                                        :label="commonI18n(item)+ ': '" 
                                        :prop="item.key" 
                                        >
                                        <el-input v-if="item.type === 'input'" v-model="modalTemp[item.key]" :placeholder="$t('const.pleaseInput')" :type="item.type" 
                                        :disabled="item.disabled"
                                        />
                                        <el-select v-else-if="item.type==='select'" :filterable="true" v-model="modalTemp[item.key]" 
                                                @change="(val)=>selChanged(val,item.selType)"   :placeholder="$t('const.pleaseInput')" :disabled="item.disabled">
                                            <el-option
                                                v-for='sel in selColumns[item.selType]'
                                                :key="sel[item.selVal]"
                                                :label="sel[item.selLabel]"
                                                :value="sel[item.selVal]"
                                            />
                                        </el-select>
                                        <el-date-picker v-else-if="item.type === 'datePicker'"
                                            v-model="modalTemp[item.key]"
                                            type="datetime"
                                            :placeholder="$t('const.pleaseSelect')"
                                        />
                                        <el-input v-else-if="item.type === 'textarea'" v-model="modalTemp[item.key]" :placeholder="$t('const.pleaseInput')" type="textarea" 
                                        :disabled="item.disabled"
                                        />
                                        <el-switch v-else-if="item.type === 'switch'" v-model="modalTemp[item.key]"></el-switch>
                                        <!-- checkbox的v-model必须是Array形式 -->
                                        <el-checkbox-group v-else-if="item.type === 'checkbox'" v-model="modalTemp[item.key]">  
                                            <el-checkbox v-for="(check,i) in checkBoxArr" :key="`check${i}`" :label="check.label" name="type">{{check.label}}</el-checkbox>
                                        </el-checkbox-group>
                                         <el-radio-group v-else-if="item.type === 'radio'" v-model="modalTemp[item.key]">
                                            <el-radio v-for="(ra,i) in radioArr" :key="`radio${i}`" :label="ra.label"></el-radio>
                                         </el-radio-group> 
                                    </el-form-item>
                                    </el-col>
                                </div>
                                </el-row>  
                            </div>
                            <!-- 底部按钮 -->
                             <el-form-item>
                                <el-button type="primary" @click="()=>onFinish()">{{$t('common.btn.ok')}}</el-button>
                                <el-button @click="modalCancel()">{{$t('common.btn.cancel')}}</el-button>
                            </el-form-item> 
                        </el-form>
                    </div>
           
        </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog';
import jq from "jquery";
export default {
  directives: {elDragDialog},
//   mixins: [],
  props: {
    'spanNum': Number,
    'dialogWidth': String,
    'funcBtnShow':{ type:Boolean, default:false },
    'radioArr':Array,
    'rules':Object,
    'checkBoxArr':Array,
    'btnStyle': Object,
    'imgExist':{ type:Boolean, default:false },
    'img_width':{ type:Number },
    'srcObj': String,
    modalTemp:{
         type: Object
    },
    modalTitle: {
        type: String,
    },
    formColumns: {type: Array},
    selColumns: {type: Object},
  },
  watch: {

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
    console.log()
  },
  mounted() {
      let modalWidth = jq('.formStyle')
      modalWidth.width(this.dialogWidth)
  },
  beforeDestroy() {

  },
  methods: {
      btnClick(item){
          this.$emit("btnClick", item);
      },
      // 下拉框改变事件
      selChanged(val,sel) {
          this.$emit('selFunc',val,sel) 
      },
      modalCancel() {
        this.modalVisible = false
      },
      modalOpen() {
        this.modalVisible = true;
        this.$nextTick(() => {
           this.$refs['modalTemp'].clearValidate(); 
        })  
      },
      onFinish() {
          this.$refs.modalTemp.validate((valid) => {
              if (valid) {
                  this.$emit('testOnFinish',this.modalTemp)
                  this.modalVisible = false;
              } else {
                  return false;
              }
          })
          
      },
  }
}
</script>
<style lang="less" scoped>
    .form-modal-class {
       .formStyle{
        height: 60% !important;
        .content-layout {
                display: flex;
            } 
        }
    }
     
</style>
