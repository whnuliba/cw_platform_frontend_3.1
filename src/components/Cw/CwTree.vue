/*
* @CreatAuthor: sdf
*/
<template>
  <div class="cw-tree">
    <el-tree
        ref="myref"
        v-bind="$attrs" 
        v-on="$listeners"
    >
    </el-tree>
  </div>
</template>

<script>
  export default {
    name: 'treeCommon',
    components: { },
    directives: { },
    filters: {},
    props: {
        dataSource: {
            type: Array,
            default: () => [],
        },
        radioVal: '',
        defaultProps: {
            type: Object,
            default: ()=> {
                    return  {children: 'children',label: 'label'}
                }
        }
    },
    data() {
      const _initdata = {

      }
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
  .cw-tree{
      margin: 0 10px;
  }
</style>