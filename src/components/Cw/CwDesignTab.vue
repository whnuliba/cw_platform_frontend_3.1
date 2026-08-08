/*
* @CreatAuthor: sdf
*/
<template>
    <div class="cw-el-tab">
        <el-tabs ref="myref" v-bind="$attrs" v-on="$listeners">
            <el-tab-pane  v-for="(item,i) in dataSource" :key="'ite'+i"  :label="item.label"  :name="item.name">
                {{item.label}}
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
  name: 'tabCommon',
  components: {},
  directives: {},
  filters: {},
  props: {
    itemStyle: {
      type: Object,
      default: () => {
        return {}
      },
    },
    dataSource: {
            type: Array,
            default: () => []
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
.cw-el-tab {
  margin: 0 10px;
}
</style>