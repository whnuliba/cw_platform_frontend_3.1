<template>
  <div class="dyn-drawer-panel-view" ref="drawerview">
  <el-drawer class="cw-drawer" :ref="'cwDrawerRef'" :append-to-body="true"  :title="commonI18n(modelTitle) ? commonI18n(modelTitle) : modelTitle" direction="ltr"
      :visible.sync="drawerVisible" :size="component.attribute.modalWidth||'70%'" :before-close="handleClose">
      <CwSubPanelPreview 
        :style="{ width : '100%', height : component.styles.height,backgroundColor:'none'}"
        :component="component"
        :vueContext="vueContext"
        :componentData="componentData"  
        :itemStyle="{ width : component.styles.width, height : component.styles.height}"
      />
      <div slot="footer" class="drawer-footer"></div>
  </el-drawer>
</div> 
</template>
<script>
import CwSubPanelPreview from "./CwSubPanelPreview.vue"
import CwDrawer from "@/components/Cw/CwDrawer.vue"
import {dispatchEvent} from "../utils/eventUtils"


export default {
  name: 'CwDrawerPanelView',
  components: { CwSubPanelPreview,CwDrawer },
  // directives: {elDragDialog},

  props: {
    itemStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    vueContext: {
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
      modelTitle: this.component.attribute.modelTitle || 'Edit',
      drawerVisible:false,
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
    // drawerVisible: {
    //   handler: function (newVal, oldVal) {
    //     console.log(newVal)
    //   },
    //   deep: true
    // },
    itemStyle: {
      handler: function (newVal, oldVal) {
        if (newVal) {
              // for (let i in newVal) {
              //   console.log(this.$refs.drawerview)
              //     this.$refs.drawerview.style[i] = newVal[i]
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
      this.drawerVisible = true //:visible.sync="open"
      this.$refs.cwDrawerRef.rendered = true
      this.drawerVisible = false
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
  // /deep/ .el-dialog__body {
  //       padding: 5px;
        
  //       }
</style>