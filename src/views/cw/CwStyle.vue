<template>
  <div class="stylebox">
    <el-form ref="defaultForm.params" :model="itemStyleData" label-width="50%" size="mini">
      <div class="itemform" v-for="(item, index) in cols" :key="index">
        <el-form-item v-if="item.queryType === 'input'" :label="item.field + ':'" :prop="item.field"
          :rules="[{ required: item.require, message: item.title + '不能为空', trigger: 'blur' }]">
          <!--:disabled="item.isEdit && item.disable"-->
          <el-input size="mini" :show-password="item.password" v-model="itemStyleData[item.field]" />
        </el-form-item>
        <el-form-item v-if="item.queryType === 'select'" :label="item.field + ':'"
          :rules="[{ required: item.require, message: item.title + '不能为空', trigger: 'change' }]">
          <el-select size="mini" v-model="itemStyleData[item.field]" @change="$forceUpdate()" placeholder="请选择">
            <el-option v-for="item in selectOptionsData[item.field]" :key="item.value" :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="item.queryType === 'colorpicker'" :label="item.field + ':'"
          :rules="[{ required: item.require, message: item.title + '不能为空', trigger: 'change' }]">
          <el-color-picker size="mini" v-model="itemStyleData[item.field]" show-alpha></el-color-picker>
        </el-form-item>
        <el-form-item v-if="item.queryType === 'colorbutton'" :label="item.field + ':'"
          :rules="[{ required: item.require, message: item.title + '不能为空', trigger: 'change' }]">
          <!-- <el-select size="mini" v-model="itemStyleData[item.field]" @change="$forceUpdate()" placeholder="请选择">
            <el-option v-for="item in selectOptionsData[item.field]" :key="item.value" :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> -->
          <!-- <el-color-picker v-if="itemStyleData[item.field] === 'backgroundColor'" show-alpha  size="mini" v-model="itemStyleData['backgroundColor']" style="width: 100%;margin-top: 5px;"></el-color-picker> -->
          <el-upload 
            class="upload-demo" 
            action="#" 
            multiple
            :before-upload="beforeUpload"
            :limit="1"
            :file-list="fileList">
          <el-button size="mini" plain>上传</el-button>
          </el-upload>
          <el-button size="mini" plain @click="dialogVisible = true">选择</el-button>
       
        </el-form-item>
          <!-- <BackImage  :itemStyleData="itemStyleData" v-if="item.queryType === 'colorbutton'&&(itemStyleData[item.field] === 'backgroundImage')" /> -->

        <el-form-item v-if="item.queryType === 'switch'" :label="item.field + ':'" :prop="item.field">
          <el-switch v-model="itemStyleData[item.field]" />
        </el-form-item>
      </div>

    </el-form>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <div  v-for="(val, index) in srcList" style=" width: 200px;height: 200px;">
        <el-image 
          style="width: 200px; height: 100px"
          :src="require(`@/assets/resource${val}`)" 
          @click="imageClick(val)"
        >
        </el-image>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import i18n from "@/lang";
import modules from "./components/loadModule.js";
import BackImage from "./components/BackImage.vue";

export default {
  name: 'CwStyle',
  components: {BackImage},
  directives: {},
  filters: {},
  props: {
    compId: {
      type: String,
      default: ''
    },
  },
  watch: {
    compId: {
      handler: function (newVal, oldVal) {

        if (newVal.split('-')[0]) {

          for (let key in modules) {
            if (modules[key].name == newVal.split('-')[0]) {
              if (modules[key].methods.hasOwnProperty('getStyleCols')) {
                // const arr = this.filterDefaultStyles(modules[key].methods.getStyleCols(), this.styleCols)
                // this.cols = [...modules[key].methods.getStyleCols(), ...arr]
                if(this.itemStyleData.hasOwnProperty('types') && modules[key].components[this.itemStyleData.types].methods.hasOwnProperty('getStyleCols')){
                  const arr = this.filterDefaultStyles(modules[key].methods.getStyleCols(), this.styleCols)
                  this.cols = [...modules[key].methods.getStyleCols(), ...arr, ...modules[key].components[this.itemStyleData.types].methods.getStyleCols()]
                }else{
                  const arr = this.filterDefaultStyles(modules[key].methods.getStyleCols(), this.styleCols)
                  this.cols = [...modules[key].methods.getStyleCols(), ...arr]
                }
              } else {
                this.cols = [...this.styleCols]
              }
              if (modules[key].methods.hasOwnProperty('selectOptions')) {
                // this.selectOptionsData = { ...this.selectOptionsData, ...modules[key].methods.selectOptions() }
                if (this.itemStyleData.hasOwnProperty('types') && modules[key].components[this.itemStyleData.types].methods.hasOwnProperty('selectOptions')){
                  this.selectOptionsData = { ...this.selectOptionsData, ...modules[key].methods.selectOptions(), ...modules[key].components[this.itemStyleData.types].methods.selectOptions()}
                }else{
                  this.selectOptionsData = { ...this.selectOptionsData, ...modules[key].methods.selectOptions() }
                }
              } else {
                this.selectOptionsData = { ...this.selectOptionsData }
              }
            }
          }
        }
        // if(newVal.length != oldval.length){
        // }
      },
      immediate: true,
      deep: true,
    },
    itemStyleData: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          let styleObj = {
            compId: this.compId,
            data: newVal,
          }
          this.$bus.$emit('styleData', styleObj)
        }
      },
      deep: true,
      immediate: true,
    },
    newStyles: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          if(newVal.hasOwnProperty('types') && oldVal.hasOwnProperty('types') && newVal.types != oldVal.types){
            for(let key in modules) { 
              if(modules[key].name == this.compId.split('-')[0]){
                if (modules[key].methods.hasOwnProperty('getStyleCols')) {
                  if (newVal.hasOwnProperty('types') && modules[key].components[newVal.types].methods.hasOwnProperty('getStyleCols')) {
                    const arr = this.filterDefaultStyles(modules[key].methods.getStyleCols(), this.styleCols)
                    this.cols = [...modules[key].methods.getStyleCols(), ...arr, ...modules[key].components[newVal.types].methods.getStyleCols()]
                  } else {
                    const arr = this.filterDefaultStyles(modules[key].methods.getStyleCols(), this.styleCols)
                    this.cols = [...modules[key].methods.getStyleCols(), ...arr]
                  } 
                }else{
                  this.cols = { ...this.mcols }
                }

                if (modules[key].methods.hasOwnProperty('selectOptions')) {
                  if (newVal.hasOwnProperty('types') && modules[key].components[newVal.types].methods.hasOwnProperty('selectOptions')){
                    this.selectOptionsData = { ...this.selectOptionsData, ...modules[key].methods.selectOptions(), ...modules[key].components[newVal.types].methods.selectOptions()}
                  }else{
                    this.selectOptionsData = { ...this.selectOptionsData, ...modules[key].methods.selectOptions() }
                  }
                } else {
                  this.selectOptionsData = { ...this.selectOptionsData }
                }
              }
            }
            let styleObj = {
            compId: this.compId,
            data: newVal,
          }
          this.$bus.$emit('styleData', styleObj)
          }
          
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    const _initdata = {
      dialogVisible: false,
      fileList: [],
      itemStyleData: {},
      selectOptionsData: {},
      defaultForm: {
        row: {},
        params: {

        }
      },
      styleCols: [
        { field: 'position', title: 'position', queryType: 'select', require: false, query: true, hide: false },
        { field: 'left', title: 'left', queryType: 'input', require: false, query: true, hide: false },
        { field: 'top', title: 'top', queryType: 'input', require: false, query: true, hide: false },
        { field: 'marginTop', title: 'marginTop', queryType: 'input', require: false, query: true, hide: false },
        { field: 'marginRight', title: 'marginRight', queryType: 'input', require: false, query: true, hide: false },
        { field: 'marginBottom', title: 'marginBottom', queryType: 'input', require: false, query: true, hide: false },
        { field: 'marginLeft', title: 'marginLeft', queryType: 'input', require: false, query: true, hide: false },
        { field: 'rotationAngle', title: 'rotation', queryType: 'input', require: false, query: true, hide: false },

      ],
      cols: [],
    }
    Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
    return _initdata
  },
  computed: {
    srcList: function () {
      const images = []
      const moduleFilesTs = require.context('@/assets/resource/', false, /\.(png|svg)$/)

      moduleFilesTs.keys().forEach((key) => {
        const imageOptions = key.replace('.', "")
     
        images.push(imageOptions)
      })
      return images
    },
    newStyles(){
      return JSON.parse(JSON.stringify(this.itemStyleData))
    }
  },
  created() {

  },
  mounted() {
    this.selectOptions()
    this.$nextTick(() => {
      this.$bus.$on("styleData", (attributeObj) => {
        this.itemStyleData = attributeObj.data
      });
    })

  },
  methods: {
    beforeUpload(file) {
      console.log('beforeUpload', file);
    },
    imageClick(val){
     // this.itemStyleData.backgroundImage = `url(${require('@/assets/resource/6.png')})`
     this.$set(this.itemStyleData, 'backgroundImage', 'url('+require(`@/assets/resource${val}`)+')')
     // this.itemStyleData.backgroundImage = 'url('+require(`@/assets/resource${val}`)+')'
     this.dialogVisible = false
    },
    filterDefaultStyles(compStyle, commonStyle) {
      let arr = []
      if (compStyle && Array.isArray(compStyle)) {
        const fields = compStyle.map(c => c.field)
        commonStyle.forEach(item => {
          if (!fields.some(c => c === item.field)) {
            arr.push(item)
          }
        })
      }
      return arr
    },
    selectOptions() {
      this.selectOptionsData['position'] = [
        { value: 'absolute', label: 'absolute' },
        { value: 'relative', label: 'relative' },
        { value: 'fixed', label: 'fixed' },
      ]
    },
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
  padding-right: 5%;
}

.stylebox {
  overflow: auto;
  height: 78vh;
}

.el-form-item {
  margin-bottom: 12px;
}
::v-deep .el-color-picker__trigger{
  width: 100%;
}
::v-deep .el-color-picker{
  width: 100%;
}
::v-deep .upload-demo{
  width: 35%;
  display: inline-block;
}
</style>