/*
* @CreatAuthor: sdf
*/
<template>
    <div  ref="myref" class="node-base-style" v-bind="$attrs"  style="position: absolute; top:0;left: 0;">
        <!-- <svg id="nodeConnectLine" class="dv-border-svg-container" :width="itemStyle.width" :height="itemStyle.height">
            <path stroke="red" stroke-width="5" :d="`M ${startPosition0},${startPosition1} L ${endPosition0},${endPosition1}`" />
        </svg> -->
        <canvas id="nodeConnectLine" :width="width" :height="height"></canvas>
    </div>
</template>

<script>
export default {
  name: 'CwBasicNode',
  components: {},
  directives: {},
  filters: {},
  props: {
    itemStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    width:{
            type:Number,
            default:()=>{return 1920}
        },
    height:{
            type:Number,
            default:()=>{return 1080}
    },
    // startPosition0: {
    //   type: Number,
    //   default: () => {
    //     return 0
    //   }
    // },
    // startPosition1: {
    //   type: Number,
    //   default: () => {
    //     return 0
    //   }
    // },
    // endPosition0: {
    //   type: Number,
    //   default: () => {
    //     return 100
    //   }
    // },
    // endPosition1: {
    //   type: Number,
    //   default: () => {
    //     return 100
    //   }
    // },
  },
  watch: {
    itemStyle: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          for (let i in newVal) {
            this.$refs.myref.style[i] = newVal[i]
          }
        }
      },
      deep: true
    },
  },
  data() {
    const _initdata = {}
    return _initdata
  },
  created() {},
  mounted() {
    for (let i in this.itemStyle) {
      this.$refs.myref.style[i] = this.itemStyle[i]
    }

  },
  methods: {
    mouseToDrawLines(canvasEntity,startPosition0,startPosition1) {
          canvasEntity.beginPath();
          canvasEntity.moveTo(startPosition0,startPosition1)
    },
    mouseToDrawLines1(canvasEntity,endPosition0,endPosition1,stopMouse) {
      console.log(canvasEntity,endPosition0,endPosition1,stopMouse)
        if (stopMouse) {
          canvasEntity.lineTo(endPosition0,endPosition1)
          canvasEntity.stroke();
        }
       
    },
  }
}
</script>
<style lang="less" scoped>
// .node-base-style {
//     border: 2px dashed #f00;
// }
.node-base-style canvas{
  border: 2px dashed #f00;
}
</style>