<template>
  <div>
    <el-form ref="defaultForm.params" :model="panelStyle" label-width="33%" size="mini">
      <div class="itemform" v-for="(item) in cols" :key="item.id">
        <el-form-item v-if="item.queryType === 'input'" :label="commonI18n(item) + ':'" :prop="item.field"
          :rules="[{ required: item.require, message: item.title + '不能为空', trigger: 'blur' }]">
          <!--:disabled="item.isEdit && item.disable"-->
          <el-input :show-password="item.password" v-model="panelStyle[item.field]" />
        </el-form-item>
        <el-form-item v-if="item.queryType === 'inputnum'" :label="commonI18n(item) + ':'" :prop="item.field"
          :rules="[{ required: item.require, message: item.title + '不能为空', trigger: 'blur' }]">
          <!--:disabled="item.isEdit && item.disable"-->
          <el-input :show-password="item.password" v-model.number="panelStyle[item.field]" />
        </el-form-item>
        <el-form-item v-if="item.queryType === 'select'" :label="commonI18n(item) + ':'"
          :rules="[{ required: item.require, message: item.title + '不能为空', trigger: 'change' }]">
          <el-select v-model="panelStyle[item.field]" @change="$forceUpdate()" placeholder="请选择">
            <el-option v-for="item in initSelect[item.field]" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="item.queryType === 'colorpicker'" :label="commonI18n(item) + ':'"
          :rules="[{ required: item.require, message: item.title + '不能为空', trigger: 'change' }]">
          <el-color-picker v-model="panelStyle[item.field]" show-alpha></el-color-picker>
        </el-form-item>
        <el-form-item v-if="item.queryType === 'code'" :label="commonI18n(item) + ':'" :prop="item.field"
          :rules="[{ required: item.require, message: item.title + '不能为空', trigger: 'blur' }]">
          <!--:disabled="item.isEdit && item.disable"-->
          <el-button @click="editCode" plain>元素配置</el-button>
          <!-- <el-input  v-model="panelStyle[item.field]" @focus="editCode" /> -->
        </el-form-item>
        <el-form-item v-if="item.queryType === 'switch'" :label="commonI18n(item) + ':'" :prop="item.field"
          :rules="[{ required: item.require, message: item.title + '不能为空', trigger: 'blur' }]">
          <el-switch
            v-model="panelStyle[item.field]"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false">
          </el-switch>
        </el-form-item>
      </div>

    </el-form>
    <el-drawer
        :title="'脚本编写'"
        :visible.sync="scriptsVisible"
        :direction="'ltr'"
        :size="'80%'"
        :withHeader="false"
        :before-close="handleClose"
        >
          <component  :is="dtsOfswitch" ref="scriptsEditer" :scriptsEditer="scriptsEditer" @changeScript="setScript"> </component >
            <div style="margin-left:42%">
             <el-button @click="scriptsVisible = false">  {{ $t("common.btn.cancel") }}</el-button>
             <el-button type="primary"  @click="saveScript()">  {{ $t("common.btn.submit") }}</el-button>
            </div>
      </el-drawer>
  </div>
</template>
<script>
import i18n from "@/lang";
import EditScript from '@/components/EditScript'
import modules from "./components/loadModule.js";

export default {
  name: 'CwPanelStyle',
  components: {EditScript},
  directives: {},
  filters: {},
  props: {
    compId: {
      type: String,
      default: ''
    },
    itemAttributeData: {
      type: Object,
      default: null,
    },
    panelStyle: {
      type: Object,
      default: null,
    },
  },
  watch: {
    panelStyle: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          // this.$bus.$emit('panelStyleData', newVal)
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    const _initdata = {
      scriptsVisible:false,
      dtsOfswitch:EditScript,
      scriptsEditer:'',
      scriptOps:{
          scriptValue:'',
          scriptId:''
      },
      component:undefined,
      defaultForm: {
        row: {},
        params: {

        }
      },
      itemattributeObj:{},
      cols: [
        { field: 'width', title: '宽度', queryType: 'inputnum', require: false, query: true, hide: false },
        { field: 'height', title: '高度', queryType: 'inputnum', require: false, query: true, hide: false },
        { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', require: false, query: true, hide: false },
        // { field: 'netCableColor', title: '网线颜色', queryType: 'colorpicker', require: false, query: true, hide: false },
        { field: 'gridColor', title: '标线颜色', queryType: 'colorpicker', require: false, query: true, hide: false },
        { field: 'isUseCanvas', title: 'Canvas', queryType: 'switch', require: false, query: true, hide: false },
        { field: 'isConnectLine', title: '连线', queryType: 'switch', require: false, query: true, hide: false },
        { field: 'drawClear', title: '清空线', queryType: 'switch', require: false, query: true, hide: false },
      ],
      initSelect: {
        drawClear: [
          { label: 'true', value: 1 },
          { label: 'false', value: 0 },
        ],
        isUseCanvas: [
          { label: 'true', value: 1 },
          { label: 'false', value: 0 },
        ],
        isConnectLine: [
          { label: 'true', value: 1 },
          { label: 'false', value: 0 },
        ],
      }
    }
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
    return _initdata
  },
  created() {

  },
  mounted() {
    this.$nextTick(() => {
      this.$bus.$on("attributeData", (attributeObj) => {
        // this.itemattributeObj = attributeObj.data
        //  const {component} = attributeObj
        //  this.component = component
        //  this.scriptsEditer = component['elementCode'] || undefined
      });    
    })

  },
  methods: {
    editCode(){
      this.scriptsVisible = true
      this.$nextTick(function(){
         this.scriptsEditer = this.component['elementCode']
         this.$refs.scriptsEditer.initScript(this.scriptsEditer)
       })
    },
    setScript(data){
        this.scriptOps.scriptValue=data
        this.scriptsEditer = this.scriptOps.scriptValue    
    },
    saveScript(){
      try {
        let data =  eval("("+this.scriptsEditer+")") //JSON.parse(val.scripts)
        //this.component.handler=data
        this.component['elementCode'] = this.scriptsEditer
        this.scriptsVisible=false
        } catch (e) {
             this.$message({
                    type: 'info',
                    message: '脚本失败'+JSON.stringify(e)
           });
           return
      }
    },
    handleClose(done) {
        this.$confirm(this.$t('common.btn.sureClose'))
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
    // inputchange(val,item){
    //   if(item.field == 'top'){
    //     this.$bus.$emit('moveComponent',val,'top',this.itemAttributeData )
    //   }else if(item.field == 'left'){
    //     this.$bus.$emit('moveComponent',val,'left',this.itemAttributeData )
    //   }else if(item.field == 'rotationAngle'){
    //     this.$bus.$emit('moveComponent',val,'rotate',this.itemAttributeData )
    //   }
    // },
    // inputbulr(val,item){
    //   if(item.field == 'fieldName'){
    //     this.$bus.$emit('fieldName',val,this.itemAttributeData)
    //   }
    // },
    initData(arr) {
      let args = {}
      arr.map(c => {
        if (c.set) {
          args[c.field] = null
        }
      })
      return args
    },
  }
}
</script>
   
<style lang="less" scoped>
.itemform {
  padding-right: 10%;
}
.el-form-item{
  margin-bottom: 12px;
}
</style>