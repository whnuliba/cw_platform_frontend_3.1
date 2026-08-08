<template>
     <el-upload
                      class="upload-demo"
                      action="#"
                      ref="uploadDel"
                      :http-request="dataUpload"
                      :on-remove="handleRemove"
                      :before-upload="uploadFunc"
                      accept=".doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png,.mp4,.rm, .rmvb,.wmv"
                      multiple
                      :limit="1"
                      :on-exceed="handleExceed"
                      :file-list="fileList"
                    >
                      <el-button size="small" type="primary">点击上传</el-button>
                      <div slot="tip" class="el-upload__tip">文件不超过10M</div>
      </el-upload>
  </template>
  <script>
  export default {
    name: 'CwFileUpload',
    components: {  },
    props: {
      panelStyle: {
        type: Object,
        default: () => {
          return {}
        }
      },
      componentModalObj: {
        type: Object,
        default: () => {
          return {}
        }
      },
      fieldName: {
        type: String,
        default: ''
      },
      myStyle: {
        type: Object,
        default: () => {
          return { color:'black' }
        }
      },
      itemStyle: {
        type: Object,
        default: () => {
          return {}
        }
      },
      itemVal: {
        type: String,
        default: ''
      },
      compId: {
        type: String,
        default: ''
      },
      component:{
        type: Object,
        default: () =>{}
      },
      bindData:{
        type: Object,
        default: () =>{}
      },
    },
    watch: {
      itemVal: {
        handler: function (newVal, oldVal) {
          if (newVal) {
            this.compVal = newVal
          }

        },
        deep: true
      },
      itemStyle: {
        handler: function (newVal, oldVal) {
          if (newVal) {
           
          }
        },
        deep: true
      },
    },
    computed: {},
    data() {
      return {
        methods:{},
        vueContext:{},
        myAttribute:{
          onClckEventName:'Event_Button',
        }, 
        compVal: '',
        fileData: {},
        fileList: [],
      };
    },
    created() {
      this.comText();
    },
    mounted() {
    },
    beforeDestroy() { },
  
    methods: {
      handleRemove(file, fileList) {
            // console.log(file, fileList,this.$refs.upload);
        },
      handleExceed(files, fileList) {
              this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
          },
      dataUpload(item) {
          console.log(item)
              this.fileData = item.file;
          },
      uploadFunc(file) {
            const isLtSize = file.size / 1024 / 1024 < 10;
            if (!isLtSize) {
                this.$message.error('上传图片大小不能超过 10MB!');
                // this.$refs.uploadDel[0].clearFiles()
            }
          },
      getStyleCols() {
        return [
          { field: 'width', title: '长度', queryType: 'input', defaultValue: '70px', unit: 'px' },
          { field: 'height', title: '高度', queryType: 'input', defaultValue: '36px', unit: 'px' },
          { field: 'borderColor', title: '边框颜色', queryType: 'colorpicker', defaultValue: '#127310', },
          { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', defaultValue: '#fff', },
        ]
      },
      getAttributeCols() {
        return [
          { field: 'buttonName', title: '按钮名称', queryType: 'input', require: false, query: true, hide: false },
          { field: 'test', title: '测试', queryType: 'input', require: false, query: true, hide: false },

        ]
      },
      onClick(e){
         
      },
      comText() {
        return '文本上传'
      },
      ificationType() {
        return {
          classification: '基础组件',
          isCanvasview: false,
        }
      },
      handleDragStart(event) {
        event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY,action:'setLocation',compId:this.compId}));
      },
      handleDragEnd() { },
      addBtn() {
        
      },
    },
  }
  </script>
  <style lang="scss" scoped>

  </style>