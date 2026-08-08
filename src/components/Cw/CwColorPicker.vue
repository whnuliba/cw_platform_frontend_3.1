<template>
    
    <el-color-picker 
      ref="myref"
      v-bind="$attrs" 
      v-on="$listeners"
    ></el-color-picker>
   

</template>
<script>
export default {
  name: 'ColorPickerCommon',
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
            this.$refs.myref.$el.children[0].style[i] = newVal[i]
            // if (i == 'width' || i == 'height') {
            //   this.$refs.myref.$el.children[0].style[i] = '100%'
            // }
          }
        }
      },
      deep: true
    },
  },
  data() {
    return {
    };
  },
  mounted() {
    for (let i in this.itemStyle) {
            this.$refs.myref.$el.children[0].style[i] = this.itemStyle[i]
          }
  },
  beforeDestroy() { },

  methods: {
  },
  created() {
  }
}
</script>
<style lang="scss" scoped></style>