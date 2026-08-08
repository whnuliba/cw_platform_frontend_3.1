<template>
    <el-collapse ref="myref"
      v-bind="$attrs" 
      v-on="$listeners" style="width:500px">
        <el-collapse-item v-for="(item,i) in dataSource" :key="'panel'+i" :title="item.title" :name="item.name">
            <div>{{item.content}}</div>
        </el-collapse-item>
    </el-collapse>
</template>
<script>
export default {
  name: 'CollapseCommon',
  components: {},
  props: {
    itemStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dataSource: {
            type: Array,
            default: () => []
        },
  },
  watch: {
    itemStyle: {
      handler: function (newVal, oldVal) {
        console.log(this.$route)
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
    return {
    };
  },
  mounted() {
    for (let i in this.itemStyle) {
      this.$refs.myref.$el.style[i] = this.itemStyle[i]
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