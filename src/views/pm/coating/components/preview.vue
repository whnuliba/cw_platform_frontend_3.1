<template>
  <el-dialog :visible.sync="diavisible" 
           :width="width+100+'mm'" :close-on-press-escape="true">
    <template slot="title">
      <div style="display:flex">
        <div style="margin-right: 20px; line-height:36px;">打印预览</div>
        <el-button :loading="waitShowPrinter" type="primary" icon="printer" @click.stop="print">打印</el-button>
        <!-- <el-button type="primary" icon="printer" @click.stop="toPdf">pdf</el-button> -->
        <!-- <el-select v-model="selectPrintData" placeholder="..." style="width:180px;" @change="selectChange">
              <el-option
                v-for="item in scriptData"
                :key="item.id"
                :label="item.pageName"
                :value="item.scripts"
              />
        </el-select> -->
      </div>
        
    </template>
    <div  id="preview_content_custom"></div>

    <template slot="footer">
      <el-button key="close" type="info" @click="hideModal">
        关闭
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
let hiprintTemplate;
import $ from "jquery";
// import {hiprint, defaultElementTypeProvider} from '@/hiprint/hiprint.bundle.js'
import {hiprint} from '@/views/print/index.js'

export default {
  name: "printPreview",
  props: {},
  data() {
    return {
      selectPrintData:'',
      scriptData: [],
      diavisible: false,
      spinning: true,
      waitShowPrinter: false,
      // 纸张宽 mm
      width: 0,
      // 模板
      hiprintTemplate: {},
      contentData: {},
      // 数据
      printData: {}
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getscript()
  },
  mounted() {
  },
  methods: {
    selectChange(val){
      //   let ja = `{"panels":[{"index":0,"name":1,"height":297,"width":210,"paperHeader":0,"paperFooter":842,"printElements":[{"options":{"left":20,"top":20,"height":56,"width":555,"field":"table","tableHeaderRepeat":"none","tableBorder":"noBorder","tableBodyRowBorder":"noBorder","tableBodyCellBorder":"noBorder","gridColumns":2,"gridColumnsGutter":3,"fields":[{"text":"商品名称","field":"name"},{"text":"商品编码","field":"code"}],"columns":[[{"width":138.75,"title":"商品名称","field":"name","checked":true,"columnId":"name","fixed":false,"rowspan":1,"colspan":1,"renderFormatter":"function(value,row,index,options){return 123456'}"},{"width":138.75,"title":"商品条码","field":"barcode","checked":true,"columnId":"barcode","fixed":false,"rowspan":1,"colspan":1,"tableTextType":"barcode"}]]},"printElementType":{"title":"表格","type":"table","editable":true,"columnDisplayEditable":true,"columnDisplayIndexEditable":true,"columnTitleEditable":true,"columnResizable":true,"columnAlignEditable":true,"isEnableEditField":true,"isEnableContextMenu":true,"isEnableInsertRow":true,"isEnableDeleteRow":true,"isEnableInsertColumn":true,"isEnableDeleteColumn":true,"isEnableMergeCell":true}}],"paperNumberLeft":565.5,"paperNumberTop":819,"watermarkOptions":{}}]}`
      let ja1 = JSON.parse(val)
      this.width = ja1.panels[0].width;
      // this.width = 500;
      
      let that = this;
     
      let isMounted = $('#preview_content_custom').length <= 0 
      do {
        setTimeout(() => {
          $('#preview_content_custom').empty()
          that.hiprintTemplate = hiprintTemplate = new hiprint.PrintTemplate({
            template: ja1,
          })
          hiprintTemplate.design($('#preview_content_custom'))
          that.isMultiPanel = ja1.panels.length > 1
          console.log('isMultiPanel', that.isMultiPanel)
          that.spinning = false
          $('#preview_content_custom').html(hiprintTemplate.getHtml(that.contentData))

          
        }, 200)
        return
      } while (isMounted)
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
    hideModal() {
      this.diavisible = false
    },
  
    show1(printdata,data){
       this.diavisible = true
      this.spinning = true
      this.contentData = data
      // let ja = `{"panels":[{"index":0,"name":1,"height":80,"width":220,"paperHeader":0,"paperFooter":226.7716535433071,"printElements":[{"options":{"left":130.5,"top":52.5,"height":90,"width":90},"printElementType":{"title":"椭圆","type":"oval"}}],"paperNumberLeft":565,"paperNumberTop":204,"watermarkOptions":{}}]}`
      let ja1 = JSON.parse(printdata)
      this.width = ja1.panels[0].width;
      
      let that = this;
     
      let isMounted = $('#preview_content_custom').length <= 0 
      do {
        setTimeout(() => {
          $('#preview_content_custom').empty()
          that.hiprintTemplate = hiprintTemplate = new hiprint.PrintTemplate({
            template: ja1,
          })
          hiprintTemplate.design($('#preview_content_custom'))
          that.isMultiPanel = ja1.panels.length > 1
          console.log('isMultiPanel', that.isMultiPanel)
          that.spinning = false
          $('#preview_content_custom').html(hiprintTemplate.getHtml(data))

          
        }, 200)
        return
      } while (isMounted)
    },
    print() {
      this.waitShowPrinter = true
      this.hiprintTemplate.print(this.contentData, {}, {
        callback: () => {
          this.waitShowPrinter = false
        }
      })
    },
    toPdf() {
      this.hiprintTemplate.toPdf(this.printData, '打印预览pdf');
    },
  }
}

</script>
<style lang="less" scoped>

/deep/ .ant-modal-body {
  padding: 0px;
}

/deep/ .ant-modal-content {
  margin-bottom: 24px;
}
</style>
