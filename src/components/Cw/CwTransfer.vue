/*
* @CreatAuthor: sdf
*/
<template>
  <div class="cw-datePicker">
    <el-transfer
      v-bind="$attrs" 
      v-on="$listeners"
    >
    </el-transfer>
  </div>
</template>

<script>
  export default {
    name: 'transferCommon',
    components: { },
    directives: { },
    filters: {},
    props: {
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
  .cw-datePicker {
      margin: 0 10px;
  }
</style>