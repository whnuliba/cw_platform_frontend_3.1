<template>
    <div class="dyn-dialog-panel-view" ref="dialogview">
      <!-- :dialogVisible="dialogVisible" -->
        <!-- <CwDialog  :ref="'cwDialogRef'"  :dialogVisible="dialogVisible" :before-close="handleClose" :width="component.attribute.modalWidth||'700px'">
          <template slot="body">
            <CwSubPanelPreview 
            :style="{ width : component.styles.width, height : component.styles.height,backgroudColor:'none'}"
            :component="component"
            :componentData="componentData"  
            :itemStyle="{ width : component.styles.width, height : component.styles.height}"
            />
          </template>
        </CwDialog>
    </div> -->
    <el-dialog class="cw-dialog" :ref="'cwDialogRef'"  :append-to-body="true"  v-el-drag-dialog :title="commonI18n(modelTitle) ? commonI18n(modelTitle) : modelTitle" 
        :visible.sync="dialogVisible" :width="component.attribute.modalWidth||'700px'" :before-close="handleClose">
        <CwSubPanelPreview 
          :style="{ width : '100%', height : component.styles.height,backgroundColor:'none'}"
          :component="component"
          :vueContext="vueContext"
          :componentData="componentData"  
          :itemStyle="{ width : component.styles.width, height : component.styles.height}"
        />
        <div slot="footer" class="dialog-footer"></div>
    </el-dialog>
  </div> 
  </template>
  <script>
import CwSubPanelPreview from "./CwSubPanelPreview.vue"
import CwDialog from "@/components/Cw/CwDialog.vue"
import elDragDialog from "@/directive/el-drag-dialog";
import {dispatchEvent} from "../utils/eventUtils"


  export default {
    name: 'CwDialogPanelView',
    components: { CwSubPanelPreview,CwDialog },
    directives: {elDragDialog},

    props: {
      vueContext: {
        type: Object,
        default: () => {
          return {}
        }
      },
      itemStyle: {
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
      itemVal: {
        type: String,
        default: ''
      },
      compId: {
        type: String,
        default: ''
      },
      fieldName: {
        type: String,
        default: ''
      },
      component:{
          type: Object,
          default: () =>{

          }
        },
        componentData: {
        type: Array,
        default: () => {
          return []
        }
       },
       bindData:{
      type: Object,
      default: () =>{}
    },
    },
    data() {
      return {
        methods:{},
        // vueContext:{},
        modelTitle: this.component.attribute.modelTitle || 'Edit',
        dialogVisible:false,
        value: this.componentModalObj[this.fieldName],
        compVal: '',
  
      };
    },
    watch: {
      compVal: {
        handler: function (newVal, oldVal) {
          if (newVal) {
          }
        },
        deep: true
      },
      itemStyle: {
        handler: function (newVal, oldVal) {
          if (newVal) {
                // for (let i in newVal) {
                //   console.log(this.$refs.dialogview)
                //     this.$refs.dialogview.style[i] = newVal[i]
                // }
            }
        },
        deep: true
      },
    },
    computed: {},
    created() {
    },
    mounted() {
        this.$el.style.backgroundColor=''
        this.$el.style.background=''
        this.dialogVisible = true //:visible.sync="open"
        this.$refs.cwDialogRef.rendered = true //updateInsertDialog是dialog的ref;
        this.dialogVisible = false
    },
    beforeDestroy() { },
    methods: {
      handleClose(done) {
        // this.$confirm('确认关闭？')
        //   .then(_ => {
        //     done();
        //   })
        //   .catch(_ => {});
        this.handlerEvent('before-close',done)
        done()
      },
      handlerEvent(tag,v1){
        let args = []
        if(v1)  args.push(v1)
        //console.log(this,this.$refs,this.$refs.myrefTree)
        this.$nextTick(()=>{
          const ele = this.$el//$refs.myrefTree.$el

        if(ele){
          dispatchEvent(ele,tag,args)
        }
        })
      },
      getStyleCols() {
        return [
          { field: 'width', title: '长度', queryType: 'input', defaultValue: '600px', unit: 'px' },
          { field: 'height', title: '高度', queryType: 'input', defaultValue: '400px', unit: 'px' },
          { field: 'borderColor', title: '边框颜色', queryType: 'colorpicker', defaultValue: '#127310', },
          { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', defaultValue: '#E8D9D9', },        ]
      },
      comText() {
        return '模态面板'
      },
      handleDragStart(event) {
       //  event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY, action: 'setLocation', compId: this.compId }));
  
      },
      handleDragEnd() { },
      inputchange(val) {},
    },
  
  }
  </script>
  <style lang="less" scoped>
    /deep/ .el-dialog__body {
          padding: 5px;
          
          }
</style>