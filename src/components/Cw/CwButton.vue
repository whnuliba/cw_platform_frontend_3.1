/*
* @CreatAuthor: sdf
*/
<template>
  <el-button ref="myref" v-bind="$attrs" v-on="$listeners">
    <slot name="title" />
  </el-button>
</template>

<script>
export default {
  name: 'ButtonCommon',
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
  created() { },
  mounted() {
    for (let i in this.itemStyle) {
      
      this.$refs.myref.$el.style[i] = this.itemStyle[i]
    }
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>
/deep/ .el-button {
  line-height: 10%;
  background-color:red!important;
}
</style>