<template>
    <div>
        <!-- input框 -->
              <el-form ref="defaultForm.params" :inline="formInline" :model="defaultForm.params" label-width="150px">
                <div v-for="item in cols" :key="item.field" style="display: inline">
                  <el-form-item v-if="item.set && item.queryType === 'input'" :label="commonI18n(item)" :prop="item.field"
                    :rules="[
                      {
                        required: item.require,
                        message: item.title + '不能为空',
                        trigger: 'blur',
                      },
                    ]">
                    <!--:disabled="item.isEdit && item.disable"-->
                    <el-input :show-password="item.password" v-model="defaultForm.params[item.field]"  :disabled="item.disabled" style="width: 220px" />
                  </el-form-item>
        <!-- 下拉框 -->
                  <el-form-item v-if="item.set && item.queryType === 'select'" :prop="item.field" :label="item.title" :rules="[
                      {
                        required: item.require,
                        message: item.title + '不能为空',
                        trigger: 'change',
                      },
                    ]">
                    <el-select v-model="defaultForm.params[item.field]" @change="$forceUpdate()" placeholder="请选择"
                      style="width: 220px" :disabled="item.disabled">
                      <el-option v-for="tt in initSelect[item.field]" :key="tt.value" :label="tt.label"
                        :value="tt.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
        <!-- 日期框 -->
                  <el-form-item v-if="item.set && item.queryType === 'date'" :prop="item.field" :label="item.title" :rules="[
                      {
                        required: item.require,
                        message: item.title + '不能为空',
                        trigger: 'change',
                      },
                    ]">
                    <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" 
                      v-model="defaultForm.params[item.field]" type="date" placeholder="请选择" style="width: 150"
                      class="filter-item">
                    </el-date-picker>
                  </el-form-item>
        <!-- Textarea -->
                  <el-form-item v-if="item.set && item.queryType === 'textarea'" :prop="item.field" :label="item.title" :rules="[
                      {
                        required: item.require,
                        message: item.title + '不能为空',
                        trigger: 'blur',
                      },
                    ]">
                    <el-input type="textarea" v-model="defaultForm.params[item.field]"  :disabled="item.disabled" style="width: 220px" />
                  </el-form-item>
        <!-- SWITCH开关 -->
                  <el-form-item v-if="item.set && item.queryType === 'switch'" :prop="item.field" :label="item.title" :rules="[
                      {
                        required: item.require,
                        message: item.title + '不能为空',
                        trigger: 'change',
                      },
                    ]">
                    <el-switch
                        v-model="defaultForm.params[item.field]"
                        active-color="#13ce66"
                        inactive-color="#ff4949" :disabled="item.disabled" style="width: 220px">
                        </el-switch>
                  </el-form-item>
        <!-- 计数器 -->
                  <el-form-item v-if="item.set && item.queryType === 'inputNumber'" :prop="item.field" :label="item.title" :rules="[
                      {
                        required: item.require,
                        message: item.title + '不能为空',
                        trigger: 'change',
                      },
                    ]">
                    <el-input-number v-model="defaultForm.params[item.field]" @change="handleChange" :min="1" :max="10" ></el-input-number>
                  </el-form-item>
        <!-- checkbox多选框 -->
                  <el-form-item v-if="item.set && item.queryType === 'checkbox'" :prop="item.field" :label="item.title" :rules="[
                      {
                        required: item.require,
                        message: item.title + '不能为空',
                        trigger: 'change',
                      },
                    ]">
                        <el-checkbox-group v-model="defaultForm.params[item.field]"  style="width: 220px">
                            <el-checkbox v-for="(aa,i) in initCheckBox[item.field]" :key="'che'+i" :label="aa.label" name="type"></el-checkbox>
                        </el-checkbox-group>
                  </el-form-item>
        <!-- radio单选框 -->
                  <el-form-item v-if="item.set && item.queryType === 'radio'" :prop="item.field" :label="item.title" :rules="[
                      {
                        required: item.require,
                        message: item.title + '不能为空',
                        trigger: 'blur',
                      },
                    ]">
                        <el-radio-group v-model="defaultForm.params[item.field]">
                            <el-radio v-for="(ra,i) in initRadioBox[item.field]" :key="'rad'+ i" :label="ra.value">{{ra.label}}</el-radio>
                        </el-radio-group>
                  </el-form-item>

                </div>
              </el-form>

             <div slot="foot" class="dialog-footer" style="display:flex;justify-content:center;">
                <CwButton @click="btnCancel"  >
                    <span slot="title">{{ $t("common.btn.cancel") }}</span>
                </CwButton>
                <CwButton  type="primary" size="medium"  v-if="defaultForm.params.ID === '' || defaultForm.params.ID === null"
                @click="save('defaultForm.params')">
                <span slot="title">{{ $t("common.btn.save") }}</span></CwButton>
                <CwButton  type="primary" size="medium"  v-if="defaultForm.params.ID != '' && defaultForm.params.ID != null"
                @click="submit('defaultForm.params')">
                <span slot="title">{{ $t("common.btn.submit") }}</span></CwButton>
            </div>
    </div>
  </template>
  
  <script>
    import CwButton from "@/components/Cw/CwButton";
    import i18n from "@/lang";
  
    export default {
      name: 'formCommon',
      components: { CwButton },
      directives: { },
      filters: {
        statusFilter(status) {
          const statusMap = {
            0: '未启用',
            1: '启用'
          }
          return statusMap[status]
        }
      },
      props: {
        cols: {
            type: Array,
            default: () => [],
        },
        formInline: {
            type: Boolean,
            default: false,
        },
        initSelect: {
            type: Object,
            default: {},
        },
        initCheckBox: {
            type: Object,
            default: {},
        },
        initRadioBox: {
            type: Object,
            default: {},
        },
      },
      data() {
        const _initdata = {
          keyC: false,
          self: this,
          dialogFormVisible: false,
          scriptsVisible: false,
          dialogSelectFieldVisible: false,
          dialogFillterFieldVisible: false,
          dialogFillterFieldColumnVisible: false,
          dialogExportVisible:false,
          selectColumn: {
            origin: {},
            fields: [],
            colMap: []
          },
          selectViewCol: [],
          dtsOfswitch: 'script_editer',
          scriptsEditer: '',
          scriptOps: {
            scriptValue: '',
            scriptId: ''
          },
          searchobj: {},
          matchobj: {},
          defaultForm: {
            row: {},
            params: {
              ID: '',
            },
          },
          filter:[],
          header:[],
          list: null,
          showPage: true,
          operColumns:[],
          tableData: [],
          origin_tableData: [], //存储提交的过滤条件
          tableInfo:{
            roleField:[],
            table:{},
            tableCtrlScript:undefined
          },
          toolBar:{
            toolBarStyle:{},
             buttons:[
               
             ]
          },
          boxSelectValue:[] 
        }
      
        return _initdata
      },
      watch: {
  
      },
      created() {
          //console.log(this.cols)
      },
     mounted(){
     },
     methods: {
      editDataShow(row){
        // 在父组件使用该方法的话需要先使用this.$nextTick方法不然拿不到$refs里的值
        this.cols.forEach(c=>{
            if (c.set) {
              this.$set(this.defaultForm.params,c.field,undefined)
             }
          })
         for (let p in this.defaultForm.params) {
           if (this.defaultForm.params.hasOwnProperty(p)) {
             this.defaultForm.params[p] = row[p]
           }
         }
      },
      btnCancel(){
        this.$emit('handleFormClose')
      },
      save(formName) {
        this.$emit('save',this.$refs[formName],this.defaultForm)
      },
      submit(formName){
        this.$emit('submit', this.$refs[formName],this.defaultForm)
      },
      handleChange() {},
     },
    }
  </script>
  
  <style lang="less" scoped>
  
  </style>