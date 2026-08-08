/*
* @CreatAuthor: wanghao
*/
<template>
  <div class="cw-dialog">
    <el-dialog class="cw-dialog" v-el-drag-dialog :title="title" :visible.sync="cwDialogVisible" :width="width" v-bind="$attrs" :fullscreen="fullscreen" :append-to-body="true" :before-close="handleClose"
      >
      <slot name="body"></slot>
      <div slot="footer" class="dialog-footer">
          <slot name="foot"></slot>
     </div>
    </el-dialog>
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
        cwDialogVisible:this.dialogVisible
      };
    },
    created() { },
    mounted() {
    },
    beforeDestroy() { },
    watch: {
        dialogVisible(val){
            this.cwDialogVisible = val
      },
      cwDialogVisible(val){
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