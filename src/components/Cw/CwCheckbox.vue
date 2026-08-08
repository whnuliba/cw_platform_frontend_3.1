/*
* @CreatAuthor: sdf
*/
<template>
  <div class="cw-checkbox">
    <el-checkbox-group v-bind="$attrs" v-on="$listeners">
        <el-checkbox v-for="(item,i) in dataSource" :key="'ite'+i"  :label="item.label">{{item.label}}</el-checkbox>
  </el-checkbox-group>
  </div>
</template>

<script>
  export default {
    name: 'checkboxCommon',
    components: { },
    directives: { },
    filters: {},
    props: {
        dataSource: {
            type: Array,
            default: () => []
        },
        checkboxVal: ''
    },
    data() {
      const _initdata = {}
      return _initdata
    },
    watch: {},
    created() {},
    mounted(){},
    methods: {

    }
  }
</script>
<style lang="less" scoped>
  .cw-checkbox{
      margin: 0 10px;
  }
</style>