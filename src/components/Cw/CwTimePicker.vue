/*
* @CreatAuthor: sdf
*/
<template>
    <el-date-picker ref="myref" v-bind="$attrs" v-on="$listeners" class="datePicker">
    </el-date-picker>
</template>

<script>
export default {
  name: 'datePickerCommon',
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
::v-deep .el-input__inner {
  height: 100%;
}
::v-deep .el-input__icon {
    line-height: 100%;
}
 .datePicker{
  width: 100%!important;
  height:100%!important;
}
</style>