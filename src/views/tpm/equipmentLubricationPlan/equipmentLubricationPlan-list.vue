<template>
  <div class="app-container">
    <div class="container-body-top">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="设备润滑计划" name="first">
          <div>
            <component :is="equipmentLubricationPlanComponents" ref="equipmentMtPlan" @equipmentMtPlanRowClick="myChangeMtPlanItem"> </component>
          </div>
        </el-tab-pane>
        <el-tab-pane label="设备润滑部件" name="part-first">
          <div>
            <component :is="equipmentLubricationPartComponents" ref="equipmentMtPlanId" :equipmentMtPlanId="equipmentMtPlanId" @equipmentMtPlanItemRowClick = "myChangeMtPlan"  @equipmentMtPartRowDbClick="myChangeLubricationPartItem"> </component>
          </div>
        </el-tab-pane>
        <el-tab-pane label="设备润滑计划项" name="part-second">
          <div>
            <component :is="equipmentLubricationPlanItemComponents" ref="equipmentMtPartId" :equipmentMtPartId="equipmentMtPartId"  > </component >
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- <div class="container-body-bottom">
      <el-tabs v-model="activeName1" type="border-card" >
        
      </el-tabs>
    </div> -->
  </div>

</template>

<script>
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import equipmentLubricationPart from './components/equipmentLubricationPart'
import equipmentLubricationPlan from './components/equipmentLubricationPlan'
import equipmentLubricationPlanItem from './components/equipmentLubricationPlanItem'
import i18n from '@/lang';
export default {
    name: 'equipmentLubricationPlan-list',
  components: { Pagination, equipmentLubricationPart, equipmentLubricationPlan,equipmentLubricationPlanItem },
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
      equipmentLubricationPartComponents: 'equipmentLubricationPart',
      equipmentLubricationPlanComponents: 'equipmentLubricationPlan',
      equipmentLubricationPlanItemComponents: 'equipmentLubricationPlanItem',
      equipmentMtPlanId: '',
      equipmentMtPartId: '',
      activeName: 'first',
      activeName1: 'part-first'
    }
    return _initdata
  },
  created() {

  },
  methods: {
    myChangeLubricationPartItem(row){
        this.equipmentMtPartId = ''
        this.activeName="part-second"
        this.equipmentMtPartId = row.id || ''
    },
    myChangeMtPlanItem(row) {
      this.equipmentMtPlanId = row.id || ''
      this.$refs.equipmentMtPartId.list = []
      this.activeName="part-first"
    },
    myChangeMtPlan(row) {
      const pId = this.equipmentMtPartId
      this.$refs.equipmentMtPlan.query()
    },
    eqCommpBeforeLeavePlan(activeName, oldActiveName) {
      if (activeName == 'equipmentMtItem_add') {
        if (this.equipmentMtPlanId == null || this.equipmentMtPlanId == ''){
          this.$message({
            message: '请先选择设备保养计划！',
            type: 'warning'
          })
          return false
        }
        this.$refs.equipmentMtPlanId.add()
        return false
      }
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

  .filter-item {
    margin-left: 3px;
  }

  .container-body-top {
    max-height: 100%;
    overflow-y: auto;
  }

  .container-body-bottom {
    width: 100%;
    margin-top: 10px;
    max-height: 50%;
    overflow-y: auto;
  }
</style>
