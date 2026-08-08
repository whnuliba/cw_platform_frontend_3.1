/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: (...)
 * @Description: 文件预览公共组件
*/ 
<template>
  <div class="viewItemFile">
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
      <div class="docWrap" v-if="type === '.docx' || type === '.pdf' ||
       type === '.jpg' || type === '.png' || type === '.jpeg' || type === '.xls' || type === '.xlsx'">
        <iframe :src="frameUrl" frameBorder="0" 
          width="100%"
          v-loading.fullscreen.lock="fullscreenLoading"
          :height="viewHeight" 
        />
      </div>
      <div v-else-if="type === '.mp4' || type === '.rm' || type === '.rmvb' || type === '.wmv' || type === '.avi'|| type === '.flv'">
        <video :src="srcVideo" v-loading.fullscreen.lock="fullscreenLoading" controls 
          width="100%"  :height="viewHeight" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog';
import axios from 'axios';
import i18n from '@/lang';
import { getToken } from '@/utils/auth';
import {Base64} from 'js-base64';
import { urlCommon } from '@/utils/ajaxUrlCommon';
export default {
  directives: {elDragDialog},
  components: {  },
  props:  {
    viewTitle: String
   },
  watch: {},
  computed: {  },
  data() {
    return {
        fullscreenLoading: false,
        frameUrl:'',
        type: '',
        dialogVisible:false,
        srcVideo: '',
        viewHeight:'500px',
        loading: false,
    }
  },
  created() {
    this.viewHeight = window.innerHeight - 43;
  },
  mounted() {},
  beforeDestroy() {},
  watch: {
    
  },
  methods: {
      urlFunc(id, row){
          var url = `${urlCommon()}/bak-mes-task/file/download-file?id=${id}&fullfilename=${row.fileName}`; //要预览文件的访问地址
          this.frameUrl = `http://10.3.8.132:8012/onlinePreview?url=${encodeURIComponent(Base64.encode(url))}`;
          this.fullscreenLoading = false;
      },
      // 预览初始化
      init(type, row) {
          this.type = type;
          // this.fullscreenLoading = true;
          if (type == ".docx" || type == ".doc" || type == ".xls" || type === '.xlsx' || type == ".pdf" || 
          type == ".jpg" || type == ".jpeg" || type == ".png") {
              this.urlFunc(row.id, row)
          } 
          else if (type === '.mp4' || type === '.rm' || type === '.rmvb' || type === '.wmv' || type === '.avi'|| type === '.flv') {
              axios.request({
                          method: "post", 
                          url: '/bak-mes-task/file/download', 
                          data: {data: row.id},
                          responseType: "blob", //告诉服务器想到的响应格式
                          headers: {
                              'my-accept-lang': i18n.locale,
                              'Authorization': 'Bearer ' + getToken(),
                              'X-Token': getToken()
                          },
                      }).then(res => {
                        const blob = new Blob([res.data])
                        this.srcVideo = window.URL.createObjectURL(blob)
                        this.fullscreenLoading = false;
                      }).catch(err=> {
                        console.log(err)
                      })
              
          } 
          else {
                    this.$message({ type: "warning", message: "文档解析失败" });
                    this.loading = false;
          }
      // 打开预览弹窗
          this.dialogVisible = true;
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
