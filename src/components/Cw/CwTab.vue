/*
* @CreatAuthor: wanghao
*/
<template>
  <div class="cw-tab">
    <div v-if="bindValue.isTab">
        <el-tabs v-model="bindValue['activeName']" type="card" @tab-click="handleClick">
        <el-tab-pane v-for="item in tabPanes" :label="item.label" :name="item.name">
            <div style="margin-bottom: 15px;box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);max-height: 600px;overflow-y:auto;">
            <CwCommonTable v-if="item.bizCode!==undefined && item.bizCode!=='' && item.bizCode !==null" :bizCode="item.bizCode" :bindParams="item.bindParams" :bindMethods="item.bindMethods"/>
            </div>
            <div v-if="item.subTabPanes && item.subTabPanes.length && item.bindValue">
            <CwTab :tabPanes="item.subTabPanes" :bindValue="item.bindValue"></CwTab>
            </div>
          
        </el-tab-pane>
    </el-tabs>
    </div>
    <div v-else>
        <div v-for="item in tabPanes" > 
            <div style="margin-bottom: 15px;box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);max-height: 600px;overflow-y:auto;">
              <CwCommonTable v-if="item.bizCode!==undefined && item.bizCode!=='' && item.bizCode !==null" :bizCode="item.bizCode" :bindParams="item.bindParams" :bindMethods="item.bindMethods"/>
            </div>
           <div v-if="item.subTabPanes && item.subTabPanes.length && item.bindValue">
            <CwTab :tabPanes="item.subTabPanes" :bindValue="item.bindValue"></CwTab>
         </div>
    </div>
   </div>
  </div>
</template>

<script>
  import CwCommonTable from "@/components/Cw/CwCommonTable"
  export default {
    name:'CwTab',
    directives: {},
    components: {CwCommonTable},
    props: {
      tabPanes:{
        type: Array,
        default: ()=>{return []}
      },
      bindValue:{
        type: Object,
        default: ()=>{return {activeName:"activeName"}}
      },
    },
    computed: {},
    data() {
      return {
      };
    },
    created() { },
    mounted() {
    },
    beforeDestroy() { },
    watch: {

    },
    methods: {
        handleClick() {
        console.log("Tab clicked");
      },
    },
  };
</script>
<style lang="less" scoped>

</style>