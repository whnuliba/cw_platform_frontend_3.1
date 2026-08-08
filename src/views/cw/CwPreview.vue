<template>
  <div class="preview" @wheel="(e)=>{panelScroll(e)}" ref="preview" style="">
    <CwView v-if="!isViewUseCanvasDraw" :page="page" :style="{height:page.panelStyle ? page.panelStyle.height + 'px' : '100%', width:page.panelStyle ? page.panelStyle.width + 'px' : '100%',transform: `scale(${scaleFactor})`,transformOrigin: `${transformOriginX}px ${transformOriginY}px` }"/>
    <CwCanvasView v-else ref="CwCanvasView" :page="page" :style="{height:page.panelStyle ? page.panelStyle.height + 'px' : '100%', width:page.panelStyle ? page.panelStyle.width + 'px' : '100%',transform: `scale(${scaleFactor})`,transformOrigin: `${transformOriginX}px ${transformOriginY}px` }"/>
    <CwRightMenu ref="cwrightmenu"/>
    <!-- <div ref="cwhovermenu" class="hoverpanel">
      <div>设备型号:输送线</div>
      <div>设备号:1260</div>
      <div>产线区域:102</div>
      <div>产线编码:1260</div>
    </div> -->
  </div>
</template>
<script>
import CwView from "./CwView.vue"
import CwCanvasView from "./CwCanvasView.vue"
import CwRightMenu from "./CwRightMenu.vue"

//,transform : 'rotate(' + item.attribute.rotationAngle + 'deg)'  对于带有模态的不能增加旋转
export default {
  name: 'CwPreview',
  components: {CwView, CwRightMenu,CwCanvasView},
  directives: {},
  filters: {},
  props: {
    width: {
      type: Number,
      default: () => { return 1920 }
    },
    height: {
      type: Number,
      default: () => { return 1080 }
    }
  },
  data() {
    const _initdata = {
      page:{},
      componentData:[],
      componentModalObj:{},
      fullElementCodeHanler : {},
      vueContext:{},
      methods:{},
      scaleFactor: 1,
      transformOriginX: 0,
      transformOriginY: 0,
      isViewUseCanvasDraw: false,

    }
    //Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
    return _initdata
  },
  created() {
    const padeCode = JSON.parse(JSON.stringify(this.$route.params.pageCode)) 
    this.page = padeCode
    console.log('预览页面数据', this.page)
    this.isViewUseCanvasDraw = padeCode.element.some(item => item.onCanvas === true);

  },
  mounted() {
  },
  methods: {
    panelScroll(e){
      if(this.isViewUseCanvasDraw){
        this.$refs.CwCanvasView.canvansHandleScroll(e)
      }else{
        console.log('canvas预览模式下不支持滚轮缩放')
        this.handleWheel(e)
      }
    },
    canvansHandleScroll(event) {
      if (!event.ctrlKey) {
        return;
      }
      event.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      // 鼠标在画布上的相对位置（未缩放前）
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // 更新缩放比例
      if (event.deltaY < 0 && this.scale < this.maxScale) {
        this.scale += this.scaleStep;
      } else if (event.deltaY > 0 && this.scale > this.minScale) {
        this.scale -= this.scaleStep;
      }

      // 计算缩放中心的偏移量
      const centerX = (mouseX - this.contentOffsetX) / this.preScale;
      const centerY = (mouseY - this.contentOffsetY) / this.preScale;

      // 更新偏移量
      this.contentOffsetX = mouseX - centerX * this.scale;
      this.contentOffsetY = mouseY - centerY * this.scale;

      this.preScale = this.scale;
      this.redrawCanvas(this.lineDatas);
    },
    handleWheel(event) {
      // event.preventDefault();
      const { altKey, metaKey, deltaY, ctrlKey } = event;
      if (ctrlKey || altKey || metaKey) {
        event.preventDefault(); 
        // 获取鼠标相对于预览区域的位置
        const rect = event.currentTarget.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        // 更新缩放中心
        this.transformOriginX = offsetX;
        this.transformOriginY = offsetY;
        // 使用更平滑的缩放因子变化
        const zoomFactor = 0.95;
        if (event.deltaY > 0) {
          this.scaleFactor *= zoomFactor;
        } else {
          this.scaleFactor /= zoomFactor;
        }
        this.scaleFactor = Math.max(0.1, Math.min(5, this.scaleFactor));
        // 计算新的 transform-origin
        const newTransformOriginX = (offsetX - this.transformOriginX) * (1 - zoomFactor) + this.transformOriginX;
        const newTransformOriginY = (offsetY - this.transformOriginY) * (1 - zoomFactor) + this.transformOriginY;
        this.transformOriginX = newTransformOriginX;
        this.transformOriginY = newTransformOriginY;
      }
    }
  }
}
</script>
   
<style lang="less" scoped>
.preview{
  width: 100%;
  height: calc(100vh - 84px);
  position: relative;
  overflow: scroll;
}
.hoverpanel{
  width: 150px;
  background-color: #fff;
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  padding: 8px 0;
  border-radius: 4px;
  font: bold 12px sans-serif;
  color: rgba(0, 0, 0, 0.87);
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
            0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
}
</style>