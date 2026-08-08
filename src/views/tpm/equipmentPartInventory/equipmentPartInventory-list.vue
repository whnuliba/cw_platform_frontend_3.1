<template>
  <div class="app-container">
    <div class="container-body-top">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="设备备件库存" name="first">
          <div>
            <component :is="equipmentPartInventoryComponents" @equipmentMtRowClick="myChangeequipmentMtItem"> </component>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="container-body-bottom">
      <el-tabs v-model="activeName" type="border-card" :before-leave="eqCommpBeforeLeave">
        <el-tab-pane label="设备备件条码" name="first">
          <div>
            <component :is="equipmentPartBarcodeComponents" ref="equipmentMtId" :equipmentMtId="equipmentMtId"> </component>
          </div>
        </el-tab-pane>
        <el-tab-pane label="新增" name="equipment_part_barcode_add">
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

</template>

<script>
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import equipmentPartInventory from './components/equipmentPartInventory'
  import equipmentPartBarcode from './components/equipmentPartBarcode'

import i18n from '@/lang';
export default {
    name: 'equipmentPartInventory-list',
    components: { Pagination, equipmentPartInventory, equipmentPartBarcode },
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
      equipmentPartInventoryComponents: 'equipmentPartInventory',
      equipmentPartBarcodeComponents: 'equipmentPartBarcode',
      equipmentMtId: '',
      activeName: 'first'
    }
    return _initdata
  },
  created() {

  },
  methods: {
    myChangeequipmentMtItem(row) {
      this.equipmentMtId = row.partNo || ''
    },
    eqCommpBeforeLeave(activeName, oldActiveName) {
      if (activeName == 'equipment_part_barcode_add') {
        if (this.equipmentMtId == null || this.equipmentMtId == ''){
          this.$message({
            message: '请先选择设备备件库存！',
            type: 'warning'
          })
          return false
        }
        this.$refs.equipmentMtId.add()
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

  .filter-item {
    margin-left: 3px;
  }

  .container-body-top {
    max-height: 50%;
    overflow-y: auto;
  }

  .container-body-bottom {
    width: 100%;
    margin-top: 10px;
    max-height: 50%;
    overflow-y: auto;
  }
</style>
