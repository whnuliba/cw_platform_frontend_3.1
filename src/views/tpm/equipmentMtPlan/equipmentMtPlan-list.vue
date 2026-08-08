<template>
  <div class="app-container">
    <div class="container-body-top">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="设备保养计划" name="first">
          <div>
            <component :is="equipmentMtPlanComponents"  ref="equipmentMtPlan"  @equipmentMtPlanRowClick = "myChangeMtPlanItem"> </component >
          </div>
        </el-tab-pane>
        <el-tab-pane label="设备保养部件" name="part-first">
          <div>
            <component :is="equipmentMtPartComponents" ref="equipmentMtPlanId" :equipmentMtPlanId="equipmentMtPlanId" @equipmentMtPartRowDbClick="myChangeMtPartItem" @equipmentMtPartRowClick = "myChangeMtPartItem"  @equipmentMtPlanItemRowClick = "myChangeMtPlan"> </component >
          </div>
        </el-tab-pane>
        <el-tab-pane label="设备保养计划项" name="part-second">
          <div>
            <component :is="equipmentMtPlanItemComponents" ref="equipmentMtPartId" :equipmentMtPartId="equipmentMtPartId"  > </component >
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- <div class="container-body-bottom">
      <el-tabs v-model="activeName1" type="border-card" :before-leave="eqCommpBeforeLeavePlan">
        
      </el-tabs>
    </div> -->
  </div>

</template>

<script>
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import equipmentMtPart from './components/equipmentMtPart'
import equipmentMtPlan from './components/equipmentMtPlan'
import equipmentMtPlanItem from './components/equipmentMtPlanItem'
import i18n from '@/lang';
export default {
  name: 'equipmentMtPlan-list',
  components: { Pagination, equipmentMtPart, equipmentMtPlan ,equipmentMtPlanItem },
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
    const _initdata = {
      equipmentMtPartComponents: 'equipmentMtPart',
      equipmentMtPlanComponents: 'equipmentMtPlan',
      equipmentMtPlanItemComponents: 'equipmentMtPlanItem',
      equipmentMtPlanId: '',
      equipmentMtPartId: '',
      activeName: 'first',
      activeName1:'part-first'
    }
    return _initdata
  },
  created() {

  },
  methods: {
    myChangeMtPlanItem(row) {
      this.equipmentMtPlanId = row.id || ''
      this.$refs.equipmentMtPartId.list = []
      this.activeName="part-first"
    },
    eqCommpBeforeLeavePlan(_activeName, oldActiveName) {
      this.activeName1=_activeName
    },
    myChangeMtPartItem(row){
        this.equipmentMtPartId = ''
        this.activeName="part-second"
        this.equipmentMtPartId = row.id || ''
    },

    myChangeMtPlan(row){
      const pId = this.equipmentMtPartId
       this.$refs.equipmentMtPlan.query()
    },
      eqCommpBeforeLeavePart(activeName, oldActiveName) {
      if (activeName == 'equipmentMtItem_add') {
        if (this.equipmentMtPartId == null || this.equipmentMtPartId == ''){
          this.$message({
            message: '请先选择设备保养部件！',
            type: 'warning'
          })
          return false
        }
        this.$refs.equipmentMtPlanItemId.add()
      }
      return false
    },
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
.container-body-top{
  height: 100%;
  overflow-y:auto;
}

.container-body-bottom{
  width: 100%;
  margin-top:10px ;
  max-height: 50%;
  overflow-y:auto;
}

</style>
