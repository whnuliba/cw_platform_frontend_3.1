/*
* @CreatAuthor: wanghao
*/
<template>
  <!-- <div class="cw-dialog"> -->
    <el-dialog ref="myref" class="cw-dialog" v-el-drag-dialog="isDraggable" :title="title" :visible.sync="cwDialogVisible"
      :width="width" v-bind="$attrs" :fullscreen="fullscreen" :before-close="handleClose" @click="eleAttrGet">
      <slot name="body"></slot>
      <div slot="footer" class="dialog-footer">
        <slot name="foot"></slot>
      </div>
    </el-dialog>
  <!-- </div> -->
</template>

<script>
import elDragDialog from "@/directive/el-drag-dialog";
export default {
  name: 'dialogCommon',
  directives: { elDragDialog },
  components: {},
  props: {
    itemStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dialogVisible: {
      type: Boolean,
      default: true
    },
    isDraggable: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '模态框'
    },
    width: {
      type: String,
      default: '700px'
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    cwDialogVisible: {
      type: Boolean,
      default: true
    },
  },
  computed: {},
  data() {
    return {
      //cwDialogVisible: true
    };
  },
  created() { },
  mounted() {
    for (let i in this.itemStyle) {
      this.$refs.myref.$el.children[0].style[i] = this.itemStyle[i]
    }
  },
  beforeDestroy() { },
  watch: {
    // dialogVisible(val) {
    //   this.cwDialogVisible = val
    // },
    itemStyle: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          for (let i in newVal) {
            this.$refs.myref.$el.children[0].style[i] = this.itemStyle[i]
          }
        }
      },
      deep: true,
 
    },
  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
    },
    eleAttrGet() {
      
    },
  },
};
</script>
<style lang="less" scoped>
// /deep/ .cw-dialog {
//   margin-top: 0;
//   .el-dialog__header {
//     // padding: 10px !important;
//     // padding-bottom: 5px !important;
//   }
// }
// /deep/.el-dialog {
//   margin-top: 0!important;
//   .el-dialog__body{
//     height:100%;
//   }
// }
</style>