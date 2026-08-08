<template>
  <div class="app-container">
    <div class="container-body-top">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="设备台账" name="first">
          <div>
            <component :is="equipmentInfoComponents" ref="equipmentInfoId" :equipmentInfoId="equipmentInfoId"  @equipmentInfoRowClick = "myChangeEqInfoItem"> </component >
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="container-body-bottom">
      <el-tabs v-model="activeName" type="border-card" :before-leave="eqCommpBeforeLeave">
        <el-tab-pane label="设备核心部件" name="first">
          <div>
            <component :is="equipmentCompComponents" ref="equipmentCompId" :equipmentCompId="equipmentCompId" > </component >
          </div>
        </el-tab-pane>
        <el-tab-pane label="新增" name="eq_comp_add">
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

</template>

<script>
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import EquipmentInfo from './components/EquipmentInfo'
import EquipmentComp from './components/EquipmentComp'

import i18n from '@/lang';
export default {
  name: 'EquipmentInfolist',
  components: { Pagination,EquipmentInfo,EquipmentComp},
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
      equipmentInfoComponents: 'EquipmentInfo',
      equipmentCompComponents: 'EquipmentComp',
      equipmentInfoId: '',
      equipmentCompId: '',
      activeName: 'first'
    }
    return _initdata
  },
  created() {

  },
  methods: {
    myChangeEqInfoItem(row) {
      this.equipmentCompId = row.id || ''
    },
    eqCommpBeforeLeave(activeName, oldActiveName) {
      if (activeName == 'eq_comp_add') {
        if (this.equipmentCompId == null || this.equipmentCompId == ''){
          this.$message({
            message: '请先选择设备！',
            type: 'warning'
          })
          return false
        }
        this.$refs.equipmentCompId.add()
      }
      return false
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
.container-body-top{
  max-height: 70%;
  overflow-y:auto;
}

.container-body-bottom{
  width: 100%;
  margin-top:10px ;
  max-height: 30%;
  overflow-y:auto;
}

</style>
