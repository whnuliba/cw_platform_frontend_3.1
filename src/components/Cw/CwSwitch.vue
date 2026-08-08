/*
* @CreatAuthor: sdf
*/
<template>
  <el-switch ref="myref" v-bind="$attrs" v-on="$listeners" />
</template>

<script>
export default {
  name: 'switchCommon',
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
            this.$refs.myref.$el.children[1].style[i] = newVal[i]
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
            this.$refs.myref.$el.children[1].style[i] = this.itemStyle[i]
          }
  },
  methods: {
    
  }
}
</script>
<style lang="less" scoped>
.cw-switch {
  margin: 0 10px;
}
</style>