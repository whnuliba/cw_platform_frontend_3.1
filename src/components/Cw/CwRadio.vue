/*
* @CreatAuthor: sdf
*/
<template>
    <el-radio-group v-bind="$attrs" v-on="$listeners">
        <el-radio v-for="(item,i) in dataSource" :key="'ite'+i"  :label="item.label">{{item.label}}</el-radio>
  </el-radio-group>
</template>

<script>
  export default {
    name: 'radioCommon',
    components: { },
    directives: { },
    filters: {},
    props: {
        dataSource: {
            type: Array,
            default: () => []
        },
        radioVal: ''
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
  .cw-radio{
      margin: 0 10px;
  }
</style>