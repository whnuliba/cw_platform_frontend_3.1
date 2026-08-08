<template>
  <div>
    <CwUserDropdown v-model="name" style="width: 300px;"></CwUserDropdown>
    <el-button @click="handleClick">默认按钮</el-button>
  </div>
</template>
<script>
    import CwUserDropdown from "@/components/Cw/CwUserDropdown";
export default {
 name: 'CwSelectUser1',
 components: {CwUserDropdown},
 props: {
  deptType: {
     type: Array,
     default: () => {
       return [300]
     }
   },
 },
 watch: {

 },
 computed: {},
 data() {
   return {
       name:''
   };
 },
 created() {
 },
 mounted() {
  this.funcMngClick({})

 },
 beforeDestroy() { },

 methods: {
  handleClick(){
    console.log(123,this.name)
  }
 },

}
</script>
<style lang="scss" scoped>

</style>