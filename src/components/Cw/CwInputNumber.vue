/*
* @CreatAuthor: sdf
*/
<template>
  <div class="cw-inputNumber">
    <el-input-number 
      ref="myref"
      v-bind="$attrs" 
      v-on="$listeners"
    >
    </el-input-number>
  </div>
</template>

<script>
  export default {
    name: 'inputNumberCommon',
    components: { },
    directives: { },
    filters: {},
    props: {
    itemStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  watch: {
    itemStyle: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          for (let i in newVal) {
            this.$refs.myref.$el.style[i] = newVal[i]
            // if (i == 'width' || i == 'height') {
            //   this.$refs.myref.$el.style[i] = '100%'
            // }
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
    mounted(){
      for (let i in this.itemStyle) {
        this.$refs.myref.$el.style[i] = this.itemStyle[i]
        
        
      }
    },
    methods: {

    }
  }
</script>
<style lang="less" scoped>
::v-deep .el-input__inner {
  height: 100%;
}
::v-deep .el-input-number__decrease {
  height: 93%;
  width: 15%;
  left: 1%;
  display: flex;
  align-items: center;
  justify-content: center;
}
::v-deep .el-input-number__increase {
  height: 93%;
  width: 15%;
  right: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
}
::v-deep .el-input__icon {
  width: 100%;
  line-height: 100%;
}
::v-deep .el-input-number--medium {
    line-height: 100%;
    height: 100%;
    width: 100%;
}
::v-deep .el-input--medium{
  height: 100%;
}
</style>