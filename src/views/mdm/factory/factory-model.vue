<template>
  <div class="app-container">
       <div class="model-factory">
          <div class="model-factory-top">
           <el-tabs v-model="activeName" type="border-card"  >
           <el-tab-pane label="工厂信息" name="first">
              <div class="mode-container">
              <component :is="factotyComponents" ref="factotyInfo" :factotyInfo="factotyInfo"  @changeWorkshop="myChangeWorkshop"> </component >
              </div>
           </el-tab-pane>
           </el-tabs>
         
          </div>
          <div class="model-factory-bottom">
          <el-tabs v-model="activeName" type="border-card" :before-leave="beforeLeave">
           <el-tab-pane label="车间/工段信息" name="first">
              <div class="mode-factory-container-bottom">
              <component :is="WorkshopComponents" ref="workshopinfo" :factotyInfoId="factotyInfoId"  @changeWorkshopSection="myChangeWorkshopSection"> </component >
              </div>         
           </el-tab-pane>
           <el-tab-pane label="新增" name="workshop_add">
            </el-tab-pane>
           </el-tabs>
           
          </div>
       </div>
       <div class="model-workshop">
            <div class="model-workshop-top">
          <el-tabs v-model="activeName" type="border-card"  :before-leave="sectionBeforeLeave">
           <el-tab-pane label="产线/工位信息" name="first">
              <div class="mode-workshop-container-top">
              <component :is="SectionOrStationComponents" ref="workshopInfoId" :workshopInfoId="workshopInfoId" @changeSectionclick="myChangeSectionclick"> </component >
              </div>         
           </el-tab-pane>
             <el-tab-pane label="新增" name="section_add">
            </el-tab-pane>
           </el-tabs>
          </div>
          <div class="model-workshop-bottom">
            <div class="model-workshop-bottom-dt model-workshop-bottom-left">
           <el-tabs v-model="activeName" type="border-card"  :before-leave="stationBeforeLeave">
           <el-tab-pane label="工位信息" name="first">
              <div class="mode-workshop-container-bottom">
              <component :is="StationComponents" ref="sectionInfoId" :sectionInfoId="sectionInfoId"  @changeStationclick="myChangeStationclick"> </component >
              </div>    
            </el-tab-pane>
            <el-tab-pane label="新增" name="station_add">
            </el-tab-pane>
           </el-tabs>
            </div>
           <div class="model-workshop-bottom-dt model-workshop-bottom-right">
           <el-tabs v-model="activeName" type="border-card"  :before-leave="stationDeviceBeforeLeave">
           <el-tab-pane label="工位设备" name="first">
              <div class="mode-workshop-container-bottom">
              <component :is="StationDeviceComponents" ref="stationDeviceId" :stationDeviceId="stationDeviceId"> </component >
              </div>    
            </el-tab-pane>
            <el-tab-pane label="新增" name="station_device_add">
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
import Factory from './components/Factory'
import Workshop from './components/Workshop'
import SectionOrStation from './components/SectionOrStation'
import Station from './components/Station'
import StationDevice from './components/StationDevice'
export default {
  name: 'factoryModel',
  components: { Pagination,Factory,Workshop,SectionOrStation,Station,StationDevice },
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
      factotyComponents:"Factory",
      WorkshopComponents:"Workshop",
      SectionOrStationComponents:"SectionOrStation",
      StationComponents:"Station",
       StationDeviceComponents:"StationDevice",
      factotyInfoId:"",
      factotyInfo:"",
      workshopInfoId:"",
      sectionInfoId:"",
      stationDeviceId:"",
      sectionInfo:{},
      activeName: 'first'
    }
    return _initdata
  },
  created() {

  },
  watch:{
      
  },
  methods: {
    beforeLeave(activeName, oldActiveName){
       if(activeName=='workshop_add'){
         if(this.factotyInfoId==null||this.factotyInfoId==''){
          this.$message({
          message: '请先选择工厂',
          type: 'warning'
        });
         return false
         }
         this.$refs.workshopinfo.add()
       }
       return false
    },
    sectionBeforeLeave(activeName, oldActiveName){
        if(activeName=='section_add'){
         if(this.workshopInfoId==null||this.workshopInfoId==''){
          this.$message({
          message: '请先选择车间',
          type: 'warning'
        });
         return false
         }
         this.$refs.workshopInfoId.add()
       }
       return false
    },
    stationBeforeLeave(activeName, oldActiveName){
       if(activeName=='station_add' ){
         if(this.sectionInfoId==null||this.sectionInfoId==''){
          this.$message({
          message: '请先选择工段',
          type: 'warning'
        });
         return false
         }
         if(this.sectionInfo.model!=104){
                  this.$message({
                message: '请先选择工段,工位下不可添加工位',
                type: 'warning'
         });
         return false
         }
         this.$refs.sectionInfoId.add()
       }
       return false
    },

    stationDeviceBeforeLeave(activeName, oldActiveName){
       if(activeName=='station_device_add' ){
         if(this.stationDeviceId==null||this.stationDeviceId==''){
          this.$message({
          message: '请先选择工位',
          type: 'warning'
        });
         return false
         }

         this.$refs.stationDeviceId.add()
       }
       return false
    },

    myChangeWorkshop(val){
      this.factotyInfoId = val
    },
    myChangeWorkshopSection(val){
      this.workshopInfoId = val
    },
    myChangeSectionclick(val){
      this.sectionInfoId=val.id
      this.sectionInfo = val
      if(val.model==105){
          this.stationDeviceId=val.id
      }
      this.$refs.sectionInfoId.sectionInfo(this.sectionInfo)
    },
     myChangeStationclick(val){
      this.stationDeviceId=val.id
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
   width: 500px;
   height: calc(100vh - 120px);
   float: left;
}
.model-workshop{
   width: calc(100% - 505px);
   height: calc(100vh - 120px);
   float: left;
   margin-left:5px ;
}
.model-factory-top{
  height: 300px;
  background: #E8EAE9;
}
.model-factory-bottom{
  margin-top:10px ;
  height: calc(100vh - 440px);
    background: #E8EAE9;
}

.model-workshop-top{
  height: 300px;
}
.model-workshop-bottom{
  margin-top:10px ;
  height: calc(100vh - 440px);
}
.mode-container{
  height: 230px;
  overflow-y:auto;
}
.mode-container-bottom{
  height: calc(100vh - 500px);
  overflow-y:auto;
}

.mode-workshop-container-top{
    height: 230px;
  overflow-y:auto;
}
.mode-factory-container-bottom{
   height: calc(100vh - 500px);
   overflow-y:auto;
}
.mode-workshop-container-bottom{
   height: calc(100vh - 500px);
   overflow-y:auto;
}
.model-workshop-bottom-dt{
  float: left;
  width: calc(50% - 2.5px);
  
}
.model-workshop-bottom-right{
  margin-left: 5px;
}
</style>
