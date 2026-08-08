<template>
  <div class="cw-drawer">
    <el-drawer class="cw-drawer" :title="title" :visible.sync="cwDrawerVisible" :width="width" v-bind="$attrs" :fullscreen="fullscreen" :append-to-body="true" :before-close="handleClose"
      >
      <slot name="body"></slot>
      <div slot="footer" class="dialog-footer">
          <slot name="foot"></slot>
     </div>
    </el-drawer>
  </div>
</template>

<script>
  import elDragDialog from "@/directive/el-drag-dialog";
  export default {
    name: 'dialogBaseCommon',
    directives: {elDragDialog},
    components: {},
    props: {
      dialogVisible:{
        type: Boolean,
        default:false
      },
      title:{
        type: String,
        default: 'Edit'
      },
      width:{
        type: String,
        default: '700px'
      },
      fullscreen:{
        type: Boolean,
        default:false
      },
    },
    computed: {},
    data() {
      return {
        cwDrawerVisible:this.dialogVisible
      };
    },
    created() { },
    mounted() {
    },
    beforeDestroy() { },
    watch: {
        dialogVisible(val){
            this.cwDrawerVisible = val
      },
      cwDrawerVisible(val){
        this.$emit('update:dialogVisible', val)
      },
    },
    methods: {
        handleClose() {
          this.$emit('handleClose',false)
      },
    },
  };
</script>
<style lang="less" scoped>
  /deep/ .cw-dialog .el-dialog__header{
    padding: 10px !important;
    padding-bottom: 5px !important;
  }
</style>