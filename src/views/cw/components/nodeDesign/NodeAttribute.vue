<template>
  <div class="cw-attribute">
    <el-form ref="defaultForm.params" :model="itemattributeObj" label-width="30%" size="mini">
      <div class="itemform" v-for="(item) in cols" :key="item.id">
        <el-form-item v-if="item.queryType === 'input'" :label="commonI18n(item) + ':'" :prop="item.field"
          :rules="[{ required: item.require, message: item.title + '不能为空', trigger: 'blur' }]">
          <!--:disabled="item.isEdit && item.disable"-->
          <el-input size="mini" :show-password="item.password" v-model="itemattributeObj[item.field]" :disabled="item.disabled" />
        </el-form-item>
        <el-form-item v-if="item.queryType === 'select'" :label="commonI18n(item) + ':'"
          :rules="[{ required: item.require, message: item.title + '不能为空', trigger: 'change' }]">
          <el-select size="mini" v-model="itemattributeObj[item.field]" @change="selectChange" placeholder="请选择" filterable>
            <el-option v-for="item in selectOptionsData[item.field]" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="item.queryType === 'switch'" :label="commonI18n(item) + ':'"
        >
          <el-switch
            v-model="itemattributeObj[item.field]"
           >
          </el-switch>
        </el-form-item>
        <el-form-item v-if="item.queryType === 'colorpicker'" :label="commonI18n(item) + ':'"
          :rules="[{ required: item.require, message: item.title + '不能为空', trigger: 'change' }]">
          <el-color-picker v-model="itemattributeObj[item.field]"></el-color-picker>
        </el-form-item>
        <el-form-item v-if="item.queryType === 'code'" :label="commonI18n(item) + ':'" :prop="item.field"
          :rules="[{ required: item.require, message: item.title + '不能为空', trigger: 'blur' }]">
          <!--:disabled="item.isEdit && item.disable"-->
          <el-button size="mini" @click="editCode" plain>编写函数</el-button>
          <!-- <el-input  v-model="itemattributeObj[item.field]" @focus="editCode" /> -->
        </el-form-item>
      </div>

    </el-form>
    <!-- <el-drawer
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
      </el-drawer> -->
  </div>
</template>
<script>
// import i18n from "@/lang";
// import EditScript from '@/components/EditScript'
import modules from "../loadModule.js";
import {getProcessInfo} from '@/api/process'
export default {
  name: 'NodeAttribute',
  // components: {EditScript},
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
  },
  watch: {
    compId: {
      handler: function (newVal, oldVal) {
        if (newVal.split('-')[0]) {
          for(let key in modules) { 
            // if (modules[key].methods.hasOwnProperty('getAttributeCols') && modules[key].name == newVal.split('-')[0]) {
            //   this.cols = [...this.mcols,...modules[key].methods.getAttributeCols()]
            //   return
            // }else{
            //   this.cols = [...this.mcols,]
            // }

            if (modules[key].name == newVal.split('-')[0]) {
              if (modules[key].methods.hasOwnProperty('getAttributeCols')) {
                this.cols = [...this.mcols,...modules[key].methods.getAttributeCols()]
              } else {
                this.cols = [...this.mcols]
              }
              if (modules[key].methods.hasOwnProperty('selectOptions')) {
                this.selectOptionsData = { ...this.selectOptionsData, ...modules[key].methods.selectOptions() }
              } else {
                this.selectOptionsData = { ...this.selectOptionsData }
              }
            }
          }
        }
        // if(newVal.length != oldval.length){
        // }
      },
      deep: true,
    },
    itemattributeObj: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          if(this.itemattributeObj.comPname === 'CwRectSvg' || this.itemattributeObj.comPname === 'CwProcessNodeSvg') {
              this.selectOptionsData['text'] = this.CwBrineTankSvgSelData
          }
          this.CwBrineTankSvgSelData.forEach(item => { 
            if(item.value == newVal.text){
              newVal.processTemplate = item.template
              newVal.nodeLabel = item.nodeLabel
            }
          })
          let attributeObj = {
            compId: this.compId,
            component:this.component,
            data: newVal,
          }
          this.$bus.$emit('attributeDataProcess', attributeObj)
          
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    const _initdata = {
      scriptsVisible:false,
      // dtsOfswitch:EditScript,
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
      selectOptionsData:{

      },
      itemattributeObj:{},
      cols:[],
      mcols: [
        { field: 'comPname', title: '名称', queryType: 'input', require: false, query: true, disabled: true },
        { field: 'fieldName', title: 'key', queryType: 'input', require: false, query: true, disabled: false },
        { field: 'id', title: '组件ID', queryType: 'input', require: false, query: true, disabled: true },
        // { field: 'elementCode', title: '代码', queryType: 'code', require: false, query: true, disabled: false },

      ],
      CwBrineTankSvgSelData: [],
    }
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
    return _initdata
  },
  created() {

  },
  mounted() {
    this.$nextTick(() => {
      this.selectOptions()
      this.$bus.$on("attributeDataProcess", (attributeObj) => {
        this.itemattributeObj = attributeObj.data
         const {component} = attributeObj
         this.component = component
         this.scriptsEditer = component['elementCode'] || undefined
      });    
    })

  },
  methods: {
    selectChange(val){
    },
    selectOptions(){
      this.selectOptionsData['position'] = [
        {value: 'absolute', label: 'absolute'},
        {value: 'relative', label: 'relative'},
        {value: 'fixed', label: 'fixed'},
      ];
      let json = { current: 1, pageSize: 100 };
      getProcessInfo(json).then((response) => {
            this.CwBrineTankSvgSelData = 
              response.data.map(item => {
                    return {
                      label: item.processName,
                      value: `${item.processName}\ [${item.processCode}]`,
                      nodeLabel: item.processCode,
                      template: item.template,
                    };
                  });
      });

    },

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
        if(data.styles){
          let styleObj = {
            compId: this.compId,
            data: data.styles,
          }
          this.$bus.$emit('styleData', styleObj)
        }
        this.$store.dispatch('app/triggerChildComponent',true);
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

.cw-attribute{
  background:rgba(0, 161, 255, .16862745098039217);
  height:100%;
  .itemform {
    padding-right: 10%;
  }
  .el-form-item{
    margin-bottom: 12px;
  }
}
</style>