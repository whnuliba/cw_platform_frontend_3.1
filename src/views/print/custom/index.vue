<template>
  <div class="app-container1">

    <!-- <el-row :gutter="[8,0]" style="margin-bottom:5px;border-bottom: 1px solid #f1e8e8;padding-bottom:10px">
      <el-col :span="4">
       
      </el-col>
      <el-col :span="20">
       
      </el-col>
    </el-row> -->

    <el-row>
      <el-col :span="3" style="padding-right:5px">
        <div style="height: 80vh">
          <div>
            <el-select v-model='mode' showSearch @change="changeMode" :defaultValue="0" option-label-prop="label"
              style="width: 90%; margin-bottom:20px">
              <el-option v-for='(opt,idx) in modeList' :key='idx' :label="opt.name" :value='idx'>
                {{ opt.name }}
              </el-option>
            </el-select>
          </div>
          <el-row>
            <el-col :span="24" class="rect-printElement-types hiprintEpContainer">
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="15" style="padding:0px 20px 0 10px;border-right: 1px solid #f1e8e8; border-left: 1px solid #f1e8e8;">
         <div>
          <!-- 纸张设置 -->
         
            <template v-for="(value,type) in paperTypes">
              <el-button :type="curPaperType === type ? 'primary' : 'info'" @click="setPaper(type,value)" :key="type" size="small">
                {{ type }}
              </el-button>
            </template>
            
            <el-popover style="margin-left:10px" v-model="paperPopVisible" title="设置纸张宽高(mm)" trigger="click" width="300">
              <div  style="text-align: center; margin: 0">
                <el-input type="number" v-model="paperWidth" style=" width: 100px; text-align: center"
                           placeholder="宽(mm)"/>
                  <el-input style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff"
                           placeholder="~" disabled
                  />
                  <el-input type="number" v-model="paperHeight" style="width: 100px; text-align: center; border-left: 0"
                           placeholder="高(mm)"/>
                <el-button  type="primary" style="width: 100%" @click="otherPaper" size="small">确定</el-button>
              </div>
              <el-button slot="reference" :type="'other'==curPaperType?'primary':'info'" size="small">自定义纸张</el-button>
            </el-popover>
         
          <el-button style="margin-left:10px" type="primary" icon="el-icon-zoom-out" @click="changeScale(false)" size="small"></el-button>
          <el-input
            :value="scaleValue"
            :min="scaleMin"
            :max="scaleMax"
            :step="0.1"
            disabled
            style="width: 70px;"
            :formatter="value => `${(value * 100).toFixed(0)}%`"
            :parser="value => value.replace('%', '')"
          />
          <el-button type="primary" icon="el-icon-zoom-in" @click="changeScale(true)" size="small"></el-button>
          <!-- 预览/打印 -->
            <el-button type="primary" icon="eye" @click="preView" size="small">
              预览
            </el-button>
            <!-- <el-button type="primary" @click="print" size="small">
              直接打印
              <el-icon type="printer"/>
            </el-button> -->
          <!-- 保存/清空 -->
          <el-button type="primary" icon="save" @click="saveprint" size="small">
              保存
            </el-button>
            <el-button type="danger" size="small" @click="clearPaper">
                清空
                <el-icon type="close"/>
            </el-button>
            <el-select value-key="id" style="margin-left:10px" :value="selectvalue" placeholder="请选择" @change="selectchange">
              <el-option
                v-for="item in scriptData"
                :key="item.id"
                :label="item.pageName"
                :value="item">
              </el-option>
            </el-select>
           <!-- <json-view :template="template"/> -->
        </div>
        <div id="hiprint-printTemplate" class="hiprint-printTemplate" style="margin-top: 10px; height: 80vh; overflow:auto; "></div>

      </el-col>
      <el-col :span="5" class="params_setting_container" style="height: 80vh ">
        <div id="PrintElementOptionSetting"></div>
      </el-col>
    </el-row>
    <el-dialog title="编辑" v-el-drag-dialog :visible.sync="dialogFormVisible" width="700px" >
      <el-form ref="defaultForm.params" :inline="true" :model="defaultForm.params" label-width="80px">
        <div v-for="(item) in cols" :key="item.id" style="display:inline">
          <el-form-item  v-if="item.set && item.queryType==='input'" :label="commonI18n(item)" :prop="item.field"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'blur' }]"
          >
            <!--:disabled="item.isEdit && item.disable"-->
             <el-input  :show-password="item.password" v-model="defaultForm.params[item.field]" style="width:220px;"  />
          </el-form-item>
           <el-form-item  v-if="item.set && item.queryType==='select'" :label="item.title"
            :rules="[{ required: item.require, message: item.title+'不能为空', trigger: 'change' }]"
           >
              <el-select v-model="defaultForm.params[item.field]" @change="$forceUpdate()" placeholder="请选择" style="width:220px;">
                <el-option
                  v-for="item in initSelect[item.field]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="destory(false)">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.id==='' || defaultForm.params.id===null" @click="save('defaultForm.params')">  {{ $t("common.btn.save") }}</el-button>
        <el-button type="primary" v-if="defaultForm.params.id!='' && defaultForm.params.id!=null" @click="submit('defaultForm.params')">  {{ $t("common.btn.submit") }}</el-button>
      </div>
    </el-dialog>
    <!-- 预览 -->
    <print-preview ref="preView"/>

  </div>
</template>

<script>
import elDragDialog from "@/directive/el-drag-dialog";

import printPreview from './preview'
// import jsonView from './../json-view.vue'
import {hiprint} from './../index.js'
import providers from './providers'
import printData from './print-data'

let hiprintTemplate;
export default {
  name: "printCustom",
  components: {printPreview},
  directives: {elDragDialog},

  data() {
    return {
      template: null,
      dialogFormVisible:false,
      // 模板选择
      mode: 0,
      selectvalue:'',
      selectobj:{},
      modeList: [],
      scriptData: [],
      // 当前纸张
      curPaper: {
        type: 'other',
        width: 220,
        height: 80
      },
      defaultForm: {
        row:{},
        params:{
          pageCode:'',
          pageName:'',
          bizType:'',
          bizName:'',
          id:'',
        }
      },
      cols: [
        { field: 'pageCode', title: '页面编码', align: 'center',queryType:'input',set:true,require:true},
        { field: 'pageName', title: '页面名称', align: 'center',queryType:'input',set:true,require:true },
      ],
      // 纸张类型
      paperTypes: {
        'A3': {
          width: 420,
          height: 296.6
        },
        'A4': {
          width: 210,
          height: 296.6
        },
        'A5': {
          width: 210,
          height: 147.6
        },
        'B3': {
          width: 500,
          height: 352.6
        },
        'B4': {
          width: 250,
          height: 352.6
        },
        'B5': {
          width: 250,
          height: 175.6
        }
      },
      scaleValue: 1,
      scaleMax: 5,
      scaleMin: 0.5,
      // 自定义纸张
      paperPopVisible: false,
      paperWidth: '400',
      paperHeight: '80',
      lastjson: '',
    }
  },
  computed: {
    curPaperType() {
      let type = 'other'
      let types = this.paperTypes
      for (const key in types) {
        let item = types[key]
        let {width, height} = this.curPaper
        if (item.width === width && item.height === height) {
          type = key
        }
      }
      return type
    }
  },
  mounted() {
    this.init()
    this.otherPaper()
  },
  methods: {
    init() {
      this.modeList = providers.map((e) => {
        return {type: e.type, name: e.name, value: e.value}
      })
      this.getscript()
      this.changeMode()
    },
    getscript(){
      const _data = {url:'/page-conf/query-pages-type',params:{data:'打印条码'}}
      this.$store.dispatch('fmsCommon/actionTaskPost',_data)
      .then(data => {
        this.scriptData = data
      }).catch(err => {
          console.error(err)
          
       })
    },
    
    selectchange(val){
      console.log(val);
      let data = JSON.parse(val.scripts)
      this.selectvalue = val.pageName
      this.selectobj = val
      hiprintTemplate.setPaper(data.panels[0].width, data.panels[0].height)
      hiprintTemplate.update(data)
    },
    changeMode() {
      let {mode} = this
      let provider = providers[mode]
      hiprint.init({
        providers: [provider.f]
      });
      $('.hiprintEpContainer').empty()
      hiprint.PrintElementTypeManager.build('.hiprintEpContainer', provider.value);
      $('#hiprint-printTemplate').empty()
      console.log(this.$ls)
      let templates = {}//this.$ls.get('KEY_TEMPLATES', {})
      let template = templates[provider.value] ? templates[provider.value] : {}
      this.template = hiprintTemplate = new hiprint.PrintTemplate({
        template: template,
        dataMode: 1, // 1:getJson 其他：getJsonTid 默认1
        history: false, // 是否需要 撤销重做功能
        onDataChanged: (type, json) => {
          console.log(type); // 新增、移动、删除、修改(参数调整)、大小、旋转
          console.log(json); // 返回 template
          // 更新模板
          // hiprintTemplate.update(json)
          // console.log(hiprintTemplate.historyList)
        },
        settingContainer: '#PrintElementOptionSetting',
        paginationContainer: '.hiprint-printPagination'
      });
      hiprintTemplate.design('#hiprint-printTemplate');
      // 获取当前放大比例, 当zoom时传true 才会有
      this.scaleValue = hiprintTemplate.editingPanel.scale || 1;
    },
    /**
     * 设置纸张大小
     * @param type [A3, A4, A5, B3, B4, B5, other]
     * @param value {width,height} mm
     */
    setPaper(type, value) {
      try {
        if (Object.keys(this.paperTypes).includes(type)) {
          this.curPaper = {type: type, width: value.width, height: value.height}
          hiprintTemplate.setPaper(value.width, value.height)
        } else {
          this.curPaper = {type: 'other', width: value.width, height: value.height}
          hiprintTemplate.setPaper(value.width, value.height)
        }
      } catch (error) {
        this.$message.error(`操作失败: ${error}`)
      }
    },
    changeScale(big) {
      let scaleValue = this.scaleValue;
      if (big) {
        scaleValue += 0.1;
        if (scaleValue > this.scaleMax) scaleValue = 5;
      } else {
        scaleValue -= 0.1;
        if (scaleValue < this.scaleMin) scaleValue = 0.5;
      }
      if (hiprintTemplate) {
        // scaleValue: 放大缩小值, false: 不保存(不传也一样), 如果传 true, 打印时也会放大
        hiprintTemplate.zoom(scaleValue, false);
        this.scaleValue = scaleValue;
      }
    },
    otherPaper() {
      let value = {}
      value.width = this.paperWidth
      value.height = this.paperHeight
      this.paperPopVisible = false
      this.setPaper('other', value)
    },
    preView() {
      let {width} = this.curPaper
      this.$refs.preView.show(hiprintTemplate, printData, width)
    },
    print() {
      if (window.hiwebSocket.opened) {
        const printerList = hiprintTemplate.getPrinterList();
        console.log(printerList)
        hiprintTemplate.print2(printData, {printer: '', title: 'hiprint测试打印'});
        return
      }
      this.$message.error('客户端未连接,无法直接打印')
    },
    destory(hide=false){
    this.dialogFormVisible = hide
       for(let p in this.defaultForm.params){
        if(this.defaultForm.params.hasOwnProperty(p)){
          this.defaultForm.params[p]=''
        }
     }
    },
    save(formName){
      this.defaultForm.row = {}
      this.defaultForm.params.id=''
      this.defaultForm.params['scripts'] = JSON.stringify(hiprintTemplate.getJson()) 
      this.defaultForm.params['bizType'] = '打印条码'
      this.defaultForm.params['bizName'] = 'PrintBarcode'
      let _data = {url:'/page-conf/add',params:{data:this.defaultForm.params}}
         this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$store.dispatch('fmsCommon/actionTaskPost',_data)
              .then(data => {
                  this.$message({
                    type: 'success',
                    message: 'add success!=>'+data
                  });
                  this.getscript()
                  this.defaultForm['scripts'] = ''
                  this.dialogFormVisible = false
              }).catch(err => {
                  console.error(err)
              }).finally(()=>{
                  this.destory()
                })
          } else {
            this.$message({
                    type: 'error',
                    message: '输入数据不能为空'
                  });
             this.destory()
          }
        });
   },
    saveprint() {
      if(this.selectvalue == ''){
        this.dialogFormVisible = true

      }else{
         this.$confirm('确定要更新吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let _this = this
          const _data = {url:'/page-conf/save-script',params:{data:{scripts: JSON.stringify(hiprintTemplate.getJson()) ,id: _this.selectobj.id}}}
          this.$store.dispatch('fmsCommon/actionTaskPost',_data)
          .then(data => {
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
              this.getscript()

          }).catch(err => {
              console.error(err)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'cancel delete'
          });
        })
      }

      
    },
    setTemplate(payload) {
      let templates = this.$ls.get('KEY_TEMPLATES', {})
      console.log(payload.json)
      templates[payload.name] = payload.json
      this.$ls.set('KEY_TEMPLATES', templates)
      this.$message.info('保存成功')
    },
    clearPaper() {
      try {
        this.selectvalue = ''
        hiprintTemplate.clear();
      } catch (error) {
        // this.$message.error(`操作失败: ${error}`);
      }
    }
  }
}
</script>

<style lang="less" scoped>
.app-container1{
  padding:10px
}
/deep/.hiprint-printElement-type{
  margin: 0 !important;
  >li{
    padding: 0 0 20px;

    .title{
      font-size:16px
    }
  }
}


// build 拖拽
/deep/ .hiprint-printElement-type > li > ul > li > a {
  font-size: 14px;
  padding: 8px 10px;
  color: black;
  line-height: 1;
  height: auto;
  text-overflow: ellipsis;
  &:hover{
    color: #1296db;
    border-color: #1296db;

  }
}

// 默认图片
/deep/ .hiprint-printElement-image-content {
  img {
    content: url("~@/assets/login_images/CHR_LOGO.png");
  }
}

// 设计容器
.card-design {
  overflow: hidden;
  overflow-x: auto;
  overflow-y: auto;
}

</style>
