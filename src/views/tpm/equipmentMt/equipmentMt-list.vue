<template>
  <div class="app-container">
    <div class="container-body-top">
      <el-tabs v-model="activeName" type="border-card" :before-leave="eqCommpBeforeLeave">
        <el-tab-pane label="设备保养" name="first">
          <div>
            <component :is="equipmentMtComponents" @equipmentMtRowClick = "myChangeequipmentMtItem"> </component >
          </div>
        </el-tab-pane>
        <el-tab-pane label="设备保养项" name="second">
          <div>
            <component :is="equipmentMtItemComponents" ref="equipmentMtId" :equipmentMtId="equipmentMtId" > </component >
          </div>
        </el-tab-pane>
        <el-tab-pane label="新增" name="equipmentMtItem_add">
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
import equipmentMt from './components/equipmentMt'
import equipmentMtItem from './components/equipmentMtItem'

import i18n from '@/lang';
export default {
    name: 'equipmentMt-list',
  components: { Pagination, equipmentMt, equipmentMtItem },
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
      equipmentMtComponents: 'equipmentMt',
      equipmentMtItemComponents: 'equipmentMtItem',
      equipmentMtId: '',
      activeName: 'first'
    }
    return _initdata
  },
  created() {

  },
  methods: {
    myChangeequipmentMtItem(row) {
      this.equipmentMtId = row.id || ''
      this.activeName = 'second'
    },
    eqCommpBeforeLeave(activeName, oldActiveName) {
      if (activeName == 'equipmentMtItem_add') {
        if (this.equipmentMtId == null || this.equipmentMtId == ''){
          this.$message({
            message: '请先选择设备保养！',
            type: 'warning'
          })
          return false
        }
        this.$refs.equipmentMtId.add()
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
.filter-item{
  margin-left: 3px;
}
.container-body-top{
  max-height: 50%;
  overflow-y:auto;
}

.container-body-bottom{
  width: 100%;
  margin-top:10px ;
  max-height: 50%;
  overflow-y:auto;
}

</style>
