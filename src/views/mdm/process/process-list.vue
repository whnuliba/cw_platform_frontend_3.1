<template>
  <div class="app-container">
       <div class="model-factory">
           <div class="model-factory-top">
           <el-tabs v-model="activeName" type="border-card"  >
           <el-tab-pane label="路径信息" name="first">
              <div class="mode-container">
              <component :is="processRouteComponents" ref="processRouteId" :processRouteId="processRouteId"  @changeprocessRoute="myChangeprocessRoute"> </component >
              </div>
           </el-tab-pane>
           </el-tabs>
         
          </div>
       </div>
       <div class="model-workshop">
          <div class="model-workshop-top">
          <el-tabs v-model="activeName" type="border-card"  :before-leave="processBeforeLeave">
           <el-tab-pane label="工序流程" name="first">
              <div class="mode-workshop-container-top">
              <component :is="processFlowComponents" ref="processFlowId" :processFlowId="processFlowId"  @changeprocessFlow="myChangeprocessFlow"> </component >
              </div>         
           </el-tab-pane>
             <el-tab-pane label="新增" name="process_add">
            </el-tab-pane>
           </el-tabs>
          </div>
          <div class="model-workshop-bottom">
            <div class="model-process-material model-process-material-left">
                <el-tabs v-model="activeName" type="border-card"  :before-leave="processBomBeforeLeave">
                  <el-tab-pane label="物料信息" name="first">
                      <div class="mode-workshop-container-bottom">
                      <component :is="processBomComponents" ref="processBomId" :processBomId="processBomId" > </component>
                      </div>    
                    </el-tab-pane>
                    <el-tab-pane label="新增" name="process_bom_add" >
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="model-process-material model-process-material-right">
              <el-tabs v-model="activeName" type="border-card"  :before-leave="processToolBeforeLeave" >
                <el-tab-pane label="工装信息" name="first">
                    <div class="mode-workshop-container-bottom">
                    <component :is="processToolAndModelComponents" ref="processToolAndModelId" :processToolAndModelId="processToolAndModelId" > </component >
                    </div>    
                  </el-tab-pane>
                  <el-tab-pane label="新增" name="process_tool_add">
                  </el-tab-pane>
              </el-tabs>
            </div>         
          </div>
       </div>
  </div>

</template>

<script>
import waves from "@/directive/waves"; // waves directive
import elDragDialog from "@/directive/el-drag-dialog";
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import i18n from '@/lang';
import processRoute from './components/processRoute'
import processFlow from './components/processFlow'
import processMaterial from './components/processMaterial'
import processToolAndModel from './components/processToolAndModel'
export default {
  name: 'ProcessList',
  components: { Pagination,processRoute,processFlow,processMaterial,processToolAndModel },
 directives: { waves, elDragDialog },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '未启用',
        1: '启用'
      }
      return statusMap[status]
    }
  },
  data() {
    const  _initdata ={
      processRouteComponents:"processRoute",
      processFlowComponents:"processFlow",
      processBomComponents:"processMaterial",
      processToolAndModelComponents:"processToolAndModel",
      processRouteId:"",
      processFlowId:"",
      processBomId:"",
      processToolAndModelId:"",
      activeName:"first"
    }
    return _initdata
  },
  created() {
  
  },
  methods: {
    processBeforeLeave(activeName, oldActiveName){
         if(activeName=='process_add' ){
         if(this.processFlowId==null||this.processFlowId==''){
          this.$message({
          message: '请先选择工艺流程',
          type: 'warning'
        });
         return false
         }
         this.$refs.processFlowId.add()
       }
       return false
    },
    processBomBeforeLeave(activeName, oldActiveName){
      if(activeName=='process_bom_add' ){
         if(this.processBomId==null||this.processBomId==''){
          this.$message({
          message: '请先选择工序',
          type: 'warning'
        });
         return false
         }
         this.$refs.processBomId.add()
       }
       return false
    },
    processToolBeforeLeave(activeName, oldActiveName){
            if(activeName=='process_tool_add' ){
         if(this.processToolAndModelId==null||this.processToolAndModelId==''){
          this.$message({
          message: '请先选择工序',
          type: 'warning'
        });
         return false
         }
         this.$refs.processToolAndModelId.add()
       }
       return false
    },
    myChangeprocessRoute(row){
       this.processFlowId = row.id
    },
    myChangeprocessFlow(row){
       this.processBomId = row.id
       this.processToolAndModelId =  row.id

    }
   }
  }
</script>

<style scoped>
.edit-input {
  
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.filter-item{
  margin-left: 3px;
}
.model-factory{
    position: relative;
   width: 600px;
   height: calc(100vh - 120px);
   float: left;
   background: #D4D7D7;
}
.model-workshop{
   width: calc(100% - 605px);
   height: calc(100vh - 120px);
   float: left;
   margin-left:5px ;
}

.mode-container{
  height: calc(100vh - 190px);
  overflow-y:auto;
}
.model-factory-top{
  height:calc(100vh - 120px);
  background: #E8EAE9;
}
.model-workshop-top{
  height: 300px;
}
.model-workshop-bottom{
  margin-top:10px ;
  height: calc(100vh - 540px);
}
.pagination-container {
    background: #fff;
    padding: 0 !important;
}
.pagination-container {
  margin-top: 5px  !important;; 
}

.mode-workshop-container-top{
    height: 230px;
  overflow-y:auto;
}
.mode-workshop-container-bottom{
   height: calc(100vh - 500px);
    overflow-y:auto;
}
.model-process-material{
  float: left;
  width: calc(50% - 2.5px);
  height: calc(100vh - 430px);
  background:#0A3C54;
}
.model-process-material-left{
  

}
.model-process-material-right{
  margin-left: 5px;

}
</style>
