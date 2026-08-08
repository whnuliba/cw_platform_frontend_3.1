<template>
  <el-input v-bind="$attrs" v-on="$listeners" ref="myref">
    <template v-for="(val, key) in $slots" :slot="key" style="color:red">
      <slot :name="key">{{ val.text }}</slot>
    </template>
  </el-input>
</template>
<script>
export default {
  name: 'CwInput',
  components: {},
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
            this.$refs.myref.$refs.input.style[i] = newVal[i]
            // if (i == 'width' || i == 'height') {
            //   this.$refs.myref.$refs.input.style[i] = '100%'
            // }
          }
        } 
      },
      deep: true
    },
  },
  computed: {},
  data() {
    return {
      cwDialogVisible: false
    };
  },
  mounted() {
    for (let i in this.itemStyle) {
      if (!(i == 'width' || i == 'height')) {
        this.$refs.myref.$refs.input.style[i] = this.itemStyle[i]
      }
    }
  },
  beforeDestroy() { },

  methods: {
  },
  created() {
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-input__inner {
  height: 100%;
}






</style>