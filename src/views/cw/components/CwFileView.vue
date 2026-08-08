/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: 页面设计 - 文件预览组件
*/ 
<template>
  <div class="viewItemFile" ref="viewItemFile" :style="myStyle"  :itemStyle="itemStyle" :panelStyle="panelStyle">
    <!---- 预览文件 ---->
    <el-dialog
      width="80%"
      class="viewItemFileDialog"
      :title="viewTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
    >
      <!-- 判断类型 -->
      <div class="docWrap" v-if="type === 'pdf'">
        <iframe :src="frameUrl" frameBorder="0" 
          width="100%"
          v-loading.fullscreen.lock="fullscreenLoading"
          :height="viewHeight" 
        >
          <p>您的浏览器不支持 iframe 标签,请从列表中下载预览</p>
        </iframe>

      </div>
      <div class="docWrap1" v-else-if="type == 'docx' || type == 'doc'">
        <div ref="fileDoc" class="docView" :style="{height:'viewHeight'}"></div>
      </div>
      <div v-else-if="type == 'xlsx' || type == 'xls'">
        <div class="excel-view-container">
          <div id="excelView" v-html="excelView"></div>
        </div>
      </div>
      <div class="image" v-else-if="type == 'png' || type == 'jpg' || type == 'jpeg'">
        <div>
          <el-image :src="imgUrl" :preview-src-list="srcList"> </el-image>
        </div>
      </div>
      <div v-else-if="type === 'mp4' || type === 'rm' || type === 'rmvb' || type === 'wmv' || type === 'avi'|| type === 'flv'">
        <video :src="srcVideo"  controls  width="100%"  :height="viewHeight" v-loading.fullscreen.lock="fullscreenLoading"/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog';
// import axios from 'axios';
// import i18n from '@/lang';
// import { getToken } from '@/utils/auth';
// import {Base64} from 'js-base64';
// import { urlCommon } from '@/utils/ajaxUrlCommon';
export default {
  name: 'CwFileView',
  directives: {elDragDialog},
  components: {  },
  props:  {
    // viewTitle: String,
    url: String,
    componentModalObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    component: {
      type: Object,
      default: () => { }
    },
    panelStyle: {
        type: Object,
        default: () => {
          return {
            // width:'500px',height: '500px'
          }
        }
      },
      fieldName: {
        type: String,
        default: ''
      },
      myStyle: {
        type: Object,
        default: () => {
          return {
            //  color:'black',width:'500px',height: '500px',backgroundColor: 'transparent'
            }
        }
      },
      itemStyle: {
        type: Object,
        default: () => {
          return {}
        }
      },
   },
  watch: {
    itemStyle: {
        handler: function (newVal, oldVal) {
            if (newVal) {
                for (let i in newVal) {
                    this.$refs.viewItemFile.style[i] = newVal[i]
                }
            }
        },
        deep: true
      },
  },
  computed: {  },
  data() {
    return {
      methods:{},
        vueContext:{},
        viewTitle:'',
        fullscreenLoading: false,
        frameUrl:'',
        type: '',
        dialogVisible:false,
        srcVideo: '',
        viewHeight:'500px',
        loading: false,
        excelView:'',
        imgUrl:'',
        srcList: [],
        srcVideo: '',
    }
  },
  created() {
    this.viewHeight = window.innerHeight - 43;
    // this.handleDownloadFile();
  },
  mounted() {},
  beforeDestroy() {},
  watch: {
    
  },
  methods: {
    getStyleCols() {
        return [
          { field: 'width', title: '长度', queryType: 'input', defaultValue: '70px', unit: 'px' },
          { field: 'height', title: '高度', queryType: 'input', defaultValue: '36px', unit: 'px' },
          { field: 'borderColor', title: '边框颜色', queryType: 'colorpicker', defaultValue: '#127310', },
          { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', defaultValue: '#fff', },
        ]
      },
      getAttributeCols() {
        return []
      },
      comText() {
            return '文件预览'
        },
      ificationType() {
        return {
          classification: '表单组件',
          isCanvasview: false,
        }
      },
      // 预览初始化
      init(fileName, type, resData) {
        this.fullscreenLoading = true;
        this.viewTitle = fileName;
        this.type = type;
        let blobType = '';
        if(type == "pdf") {
          blobType = 'application/pdf';
          let bs = new Blob([resData],{type: blobType})
          let fileUrl = window.URL.createObjectURL(bs);
          this.type = type;
          this.frameUrl = fileUrl;
          this.fullscreenLoading = false;
        }  else if(type == "xlsx" ||  type == "xls"){
          // console.log(fileName, type,)
          let XLSX1 = require("xlsx");
          const workbook = XLSX1.read(new Uint8Array(resData), {
                type: "array",
              }); // 解析数据
              const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // workbook.SheetNames 下存的是该文件每个工作表名字,这里取出第一个工作表
              this.excelView = XLSX1.utils.sheet_to_html(worksheet); // 渲染
              this.$nextTick(function () {
                // DOM加载完毕后执行，解决HTMLConnection有内容但是length为0问题。
                this.setStyle4ExcelHtml();
              });
        }else if (type == "jpg" || type == "png"  || type == "jpeg") {
         // console.log(fileName, type,)
          let blob = new Blob([resData], { type: "image/jpeg" });
              const imageUrl = URL.createObjectURL(blob);
              this.imgUrl = imageUrl;
              this.srcList.push(imageUrl)
              //  = [imageUrl];
        } else if (type == "docx" || type == "doc") {
          // console.log(fileName, type,)
          let docx = require("docx-preview");
          this.$nextTick(()=> {
                docx.renderAsync(resData, this.$refs.fileDoc)
              });
        }else if (type === 'mp4' || type === 'rm' || type === 'rmvb' || type === 'wmv' || type === 'avi'|| type === 'flv') {
          // console.log(fileName, type,)
          let blobVideo = new Blob([resData])
          this.srcVideo = window.URL.createObjectURL(blobVideo)
          this.fullscreenLoading = false;
        }
        //打开文件预览弹窗
        this.dialogVisible = true;
      },
    // 设置Excel转成HTML后的样式
    setStyle4ExcelHtml() {
      const excelViewDOM = document.getElementById("excelView");
      if (excelViewDOM) {
        const excelViewTDNodes = excelViewDOM.getElementsByTagName("td"); // 获取的是HTMLConnection
        if (excelViewTDNodes) {
          const excelViewTDArr = Array.prototype.slice.call(excelViewTDNodes);
          for (const i in excelViewTDArr) {
            const id = excelViewTDArr[i].id; // 默认生成的id格式为sjs-A1、sjs-A2......
            if (id) {
              const idNum = id.replace(/[^0-9]/gi, ""); // 提取id中的数字，即行号
              if (idNum && (idNum === "1" || idNum === 1)) {
                // 第一行标题行
                excelViewTDArr[i].classList.add("class4Title");
              }
              if (idNum && (idNum === "2" || idNum === 2)) {
                // 第二行表头行
                excelViewTDArr[i].classList.add("class4TableTh");
              }
            }
          }
        }
      }
    },
  }
}
</script>

<style lang="less" scoped>
.viewItemFile {
  .image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    div {
      height: 600px;
      width: 600px;
    }
  }
  .divContent {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /deep/ .el-dialog {
    margin: 0 !important;
    height: 100vh !important;
    .el-dialog__footer {
      margin-bottom: 30px;
      padding: 0px;
    }
  }
  /deep/ .el-dialog__body {
    height: 96%;
    width: 100%;
    padding: 0;
    overflow: auto;
  }
}
.viewItemFile {
  /deep/ table {
    width: 100% !important;
    border-collapse: collapse !important;
    border-spacing: 0 !important;
    text-align: center !important;
    border: 0px !important;
    overflow-x: auto !important;
  }

  /deep/ table tr td {
    border-right: 1px solid gray !important;
    border-bottom: 1px solid gray !important;
    width: 300px !important;
    height: 33px !important;
  }
  /**整体样式 */
  /deep/ .excel-view-container {
    background-color: #ffffff;
  }
  /**标题样式 */
  /deep/ .class4Title {
    font-size: 22px !important;
    font-weight: bold !important;
    padding: 10px !important;
  }
  /**表格表头样式 */
  /deep/ .class4TableTh {
    font-weight: bold !important;
    padding: 2px !important;
    background-color: #ccc !important;
  }
     }
</style>

<style lang="scss">
.viewItemFileDialog {
  overflow: hidden;
  .el-dialog__header {
    padding: 10px 20px 10px;
    background-color: #065077;
  }
  .el-dialog__header .el-dialog__title {
    font-size: 15px;
    color: #ffffff;
    font-weight: 700;
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
  }
  .search-btn {
    background: #19a8a6;
    color: white;
    border: none;
    height: 30px;
    padding: 0px 20px;
  }
  .el-dialog__headerbtn {
    position: absolute;
    top: 13px;
    right: 20px;
  }

  .el-dialog__headerbtn .el-dialog__close {
    color: #ffffff;
  }
  .well {
    display: block;
    background-color: #f2f2f2;
    border: 1px solid #ccc;
    margin: 0px;
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}
</style>
