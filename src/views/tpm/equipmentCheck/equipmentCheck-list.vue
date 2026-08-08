<template>
  <div class="app-container">
    <div class="container-body-top">
      <el-tabs v-model="activeName" type="border-card" :before-leave="eqCommpBeforeLeave">
        <el-tab-pane label="设备点检" name="first">
          <div>
            <component :is="equipmentCheckComponents" @equipmentMtRowClick="myChangeequipmentMtItem"> </component>
          </div>
        </el-tab-pane>
        <el-tab-pane label="设备点检项" name="second">
          <div>
            <component :is="equipmentCheckItemComponents" ref="equipmentCheckId" :equipmentCheckId="equipmentCheckId"> </component>
          </div>
        </el-tab-pane>
        <el-tab-pane label="新增" name="equipmentCheck_add">
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- <div class="container-body-bottom">
      <el-tabs v-model="activeName" type="border-card" :before-leave="eqCommpBeforeLeave">
        
      </el-tabs>
    </div> -->
  </div>

</template>

<script>
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import equipmentCheck from './components/equipmentCheck'
import equipmentCheckItem from './components/equipmentCheckItem'

import i18n from '@/lang';
export default {
    name: 'equipmentCheck-list',
    components: { Pagination, equipmentCheck, equipmentCheckItem },
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
      equipmentCheckComponents: 'equipmentCheck',
      equipmentCheckItemComponents: 'equipmentCheckItem',
      equipmentCheckId: '',
      activeName: 'first'
    }
    return _initdata
  },
  created() {

  },
  methods: {
    myChangeequipmentMtItem(row) {
      this.equipmentCheckId = row.id || ''
      this.activeName = 'second'
    },
    eqCommpBeforeLeave(activeName, oldActiveName) {
      if (activeName == 'equipmentCheck_add') {
        if (this.equipmentCheckId == null || this.equipmentCheckId == ''){
          this.$message({
            message: '请先选择设备点检！',
            type: 'warning'
          })
          return false
        }
        this.$refs.equipmentCheckId.add()
        return false
      }
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
