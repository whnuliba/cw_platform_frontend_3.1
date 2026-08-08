/*
* @CreatAuthor: sdf
*/
<template>
  <el-cascader  ref="myref" v-bind="$attrs" v-on="$listeners" style="line-height: 100%;">
  </el-cascader>
</template>

<script>
export default {
  name: 'cascaderCommon',
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
  },
  watch: {
    itemStyle: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          for (let i in newVal) {
            this.$refs.myref.$children[0].$el.style[i] = newVal[i]
            // if (i == 'width' || i == 'height') {
            //   this.$refs.myref.$children[0].$el.style[i] = '100%'
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
  created() { },
  mounted() {
    for (let i in this.itemStyle) {
            this.$refs.myref.$children[0].$el.style[i] = this.itemStyle[i]
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
::v-deep .el-input__icon {
    line-height: 100%;
}

</style>