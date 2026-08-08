<template>
  <div class="configuration_container">
    <!-- <MyImage />           -->
    <!-- <inputComponent />           -->
    <div class="combox">
      <div class="combox_title">
        <!-- <el-tabs v-model="activeName" :stretch="true">
          <el-tab-pane  name="first">
            <span slot="label"><i class="el-icon-menu"></i><span class="tab-icon">{{'组件'}}</span></span>-->
            <el-menu default-active="2" class="el-menu-vertical-demo" :style="{height: compLabelHeight}"  :default-openeds="['1']">
              <el-submenu  v-for="(comval, comi) in newCompData" :key="'com' + comi" index="1">
                <template slot="title">
                  <span>{{'基础模板'}}</span>
                </template>
                  <div class="draggable_all" >
                    <div :class="item.modules.methods.comSvg ? '' : 'text_draggable_item'" v-for="(item, i) in comval" :key="'com' + i" draggable
                    @dragstart="handleDragStart($event, item.compName)" @dragend="handleDragEnd" style="cursor: pointer;">
                      <div v-if=" item.modules.methods.comSvg " style="margin-right: 10px;">
                        <ShowSvg :svgData="item" />
                      </div>
                      <div v-else class="draggable_item" >
                        <span >{{ item.title }}</span>
                      </div>
                    </div>
                    
                  </div>
              </el-submenu>
            </el-menu>
            
          <!-- </el-tab-pane> -->
          <!-- <el-tab-pane name="second">
            <span slot="label">
              <i class="el-icon-document-copy"></i><span class="tab-icon">{{'图层'}}</span>
            </span>
            <el-menu v-if="menuData.length"  class="el-menu-vertical-demo" :style="{height: compLabelHeight}" @open="handleOpen" @close="handleClose" @select="onMenuSelect">
              <LayerMenu :menuData="menuData"></LayerMenu>
            </el-menu>
            <div v-else>
              <el-empty :image-size="120" description="画布为空"></el-empty>
            </div>
          </el-tab-pane> -->
        <!-- </el-tabs> -->
      </div>

    </div>
  </div>
</template>
<script>
import MyImage from "../MyImage.vue"
import LayerMenu from "../LayerMenu.vue"
import modules from "../loadModule.js"
import ShowSvg from "../showSvg/index.vue"
export default {
      name: 'NodeLeftArea',
      components: {MyImage,LayerMenu,ShowSvg},
      directives: {},
      filters: {
        statusFilter(status) {
          const statusMap = {
            0: '未启用',
            1: '启用'
          }
          return statusMap[status]
        }
      },
      props: {
        //  h_width:{
        //    type: Number,
        //    default:()=>{return 1920}
        //  },
         h_height:{
            type: Number,
            default:()=>{return 16}
         },
         v_width:{
            type: Number,
            default:()=>{return 16}
         },
        //  v_height:{
        //     type: Number,
        //     default:()=>{return 1080}
        // },        
      },
  computed: {
    isCanvaview() {
      return this.$store.state.app.isCanvaview;
    }
  },
  watch: {
    isCanvaview(newVal, oldVal) {
      const filteredData = Object.fromEntries(Object.entries(this.compData).filter(([key, value]) => key.includes('调度')));
      this.newCompData = this.isCanvaview ? filteredData : this.compData; ;
    }
  },
      data() {
        // const componentsName =()=> {
        //     let aa = [];
        //     for(let key in modules) {
              
        //     if (modules[key].methods.hasOwnProperty('comText') && (key !== 'CwDesignDialogsPreview'&& key !== 'CwSubPanelPreview' && key !== 'CwWorkFlowPreview'
        //     && key !== 'CwIteratorView' 
        //     && key !== 'CwSubPanelPreview'
        //     && key !== 'CwTabPanelView'
        //     && key !== 'CwDialogPanelView'
        //     )) {

        //         aa.push({
        //           title: modules[key].methods.comText(), 
        //           compName: key, 
        //         })
        //       }
        //     }
        //     return aa;
        //   }
        const componentsClassification = () => {
          let aa = [];
          for (let key in modules) {
            // debugger
            if ((key === 'CwRectSvg' || key === 'CwProcessNodeSvg'
            )) {
              aa.push({
                title: modules[key].methods.comText(),
                compName: key,
                classification: modules[key].methods.ificationType()?.classification,
                modules: modules[key],
              })
            }
          }
          let bb = this.groupByProperty(aa, 'classification');
          return bb;
        }
        const _initdata = {
          // drawingWidth:1920,
          // drawingHeight:1080,
          // compArr: componentsName(),
          compData:componentsClassification(),
          newCompData:componentsClassification(),
          activeName:'first',
          menuData:[],
          compLabelHeight: '',
        }
        //Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
        return _initdata
      },
      created() {},
      mounted(){
        this.$bus.$on('componentData', (componentData) => {
          let arr = JSON.parse(JSON.stringify(componentData))
          this.loop(arr)
          this.menuData = [...arr]
          // arr = arr.map((item)=>{
          //   if(item.component == "CwTabPanel"){
          //     item.subComponent = item.tabPanels.map(val=>{
          //       return val.component
          //     })
          //   }
          //   return item
          // })
          // this.menuData = [...componentData]
        })
        this.$nextTick(()=>{
          this.compLabelHeight = window.innerHeight -180 + 'px'
        })
        
      },
      methods: {
        groupByProperty(array, property) {
          const sortedArray = [...array].sort((a, b) => {
            return a[property].length - b[property].length;
          });
          return sortedArray.reduce((grouped, item) => {
            const key = item[property];
            grouped[key] = grouped[key] || [];
            grouped[key].push(item);
            return grouped;
          }, {});
        },
        loop(arr){
          arr.forEach(val=>{
            for (let key in modules) {
              if (val.component == modules[key].name) {
                val['componentText'] = modules[key].methods.comText()
              }
            }
            
            if (val.subComponent && val.subComponent.length > 0) {
              this.loop(val.subComponent)
            } 
            
            if (val.tabPanels && val.tabPanels.length > 0) {
              let tt = []
              val.tabPanels.forEach(item => {
                tt.push(...item.component.subComponent)
                val.subComponent = tt;
              })
              if (val.subComponent && val.subComponent.length > 0) {
                this.loop(val.subComponent)
              } 
              
            } 
          })
        },
        onMenuSelect(key, keyPath) {
          this.$bus.$emit('layerValue', key )

        },
        handleOpen(key, keyPath) {
          this.$bus.$emit('layerValue', key )
        },
        handleClose(key, keyPath) {
          this.$bus.$emit('layerValue', key )
        },
        handleDragStart(event,comP) {
          event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY,name:comP}));
        },
    handleDragEnd() { },
    // initRuler() {
    //   let lineColor = '#CBCCCC'
    //   let textColor = '#CBCCCC'
    //   this.drawingWidth = this.h_width
    //   this.drawingHeight = this.v_height

    //   const oCanvas = document.getElementById('horizontalRuler')
    //   const ctx = oCanvas.getContext('2d')
    //   //ctx.clearRect(0,0,this.drawingWidth,16) 
    //   ctx.beginPath();
    //   for (let i = 10.5; i < this.drawingWidth; i += 5) {
    //     ctx.moveTo(i, 0.5)
    //     if (i % 50 == 0.5) {
    //       {
    //         ctx.lineTo(i, 15.5)
    //         ctx.save();
    //         //ctx.strokeText(i-0.5, i, 15.5)
    //         ctx.translate(i, 15.5);
    //         ctx.fillStyle = textColor
    //         ctx.fillText(i - 0.5, 0, 0);
    //         ctx.restore();
    //       }
    //     } else {
    //       ctx.lineTo(i, 7.5)
    //     }

    //     ctx.strokeStyle = lineColor

    //     //ctx.lineWidth = 0.5
    //     ctx.stroke()
    //   }

    //   const verticalRuler = document.getElementById('verticalRuler')

    //   const verticalRulerCtx = verticalRuler.getContext('2d')
    //   //verticalRulerCtx.clearRect(0,0,16,this.drawingWidth) 
    //   verticalRulerCtx.beginPath();
    //   for (let i = 10.5; i < this.drawingHeight; i += 5) {
    //     verticalRulerCtx.moveTo(0.5, i)
    //     if (i % 50 == 0.5) {
    //       verticalRulerCtx.lineTo(15.5, i)

    //       verticalRulerCtx.save();
    //       verticalRulerCtx.translate(15.5, i);
    //       verticalRulerCtx.rotate(-Math.PI / 2);
    //       verticalRulerCtx.fillStyle = textColor
    //       verticalRulerCtx.fillText(i - 0.5, 0, 0);
    //       //verticalRulerCtx.strokeText(i-0.5, 12.5, i)

    //       verticalRulerCtx.restore();
    //       // verticalRulerCtx.strokeText(i-0.5, 12.5, i)

    //     } else {
    //       verticalRulerCtx.lineTo(7.5, i)
    //     }

    //     verticalRulerCtx.strokeStyle = lineColor
    //     //verticalRulerCtx.lineWidth = 0.5
    //     verticalRulerCtx.stroke()
    //   }
    // }
  }
}
</script>
  
<style lang="less" scoped>
.configuration_container {
  .tab-icon {
    margin-left:5px;
  }
 
}

.combox_title {
  // display: flex;
  // align-items: center;
  // justify-content: space-around;
  padding: 0 0 5px 0;
  width: 100%;
  background: rgba(0, 161, 255, .16862745098039217);
  // border-bottom:1px solid black;
}

.draggable_all {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 10px 10px 5px 15px;
  overflow: auto;
  background: rgba(0, 161, 255, .16862745098039217);
}
.text_draggable_item{
  width: 45%;
}
.draggable_item {
  height: 32px;
  font-size: 14px;
  line-height: 32px;
  box-shadow: 0 1px 0 0 #a7e4d5;
  border: 1px solid #11A983;
  color: #11A983;
  margin-top: 10px;
  // padding: 0 6px;
  text-align: center;
  cursor: pointer;
}

.draggable_item:hover {
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: none;
  color: black;

}
::v-deep .el-menu{
  padding: 10px 10px 5px 15px;
  border-right: none;
}
::v-deep .el-submenu__icon-arrow {
  display: inline !important;;
}
.el-menu-vertical-demo{
  overflow: auto;
}
::v-deep .el-menu el-menu--inline{
  padding-top: 0px;

}
</style>