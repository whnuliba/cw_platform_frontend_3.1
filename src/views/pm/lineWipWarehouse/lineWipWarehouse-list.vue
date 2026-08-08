<template>
  <div class="app-container">
    <div class="model-workshop">
      <div class="model-workshop-top">
        <el-tabs v-model="activeName1" type="border-card" >
          <el-tab-pane label="在制品仓" name="an1Tab1">
            <div class="mode-workshop-container-top">
              <component :is="lineWipWarehouseComponents" ref="lineWipWarehouseId" :lineWipWarehouseId="lineWipWarehouseId" @rowClick ="myChangelineWipWarehouse"> </component >
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="model-workshop-bottom" >
        <el-tabs v-model="activeName2" type="border-card" >
          <el-tab-pane label="在制品仓物料" name="an2Tab1">
            <div class="mode-workshop-container-bottom">
              <component :is="lineWipWarehouseBarcodeComponents" ref="lineWipWarehouseBarcodeId" :lineWipWarehouseBarcodeId="lineWipWarehouseBarcodeId"  > </component >
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import lineWipWarehouse from './components/lineWipWarehouse'
import lineWipWarehouseBarcode from './components/lineWipWarehouseBarcode'

import i18n from '@/lang' ;
export default {
  name: 'lineWipWarehouse-list',
  components: { Pagination, lineWipWarehouse, lineWipWarehouseBarcode },
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
      lineWipWarehouseComponents: 'lineWipWarehouse',
      lineWipWarehouseBarcodeComponents: 'lineWipWarehouseBarcode',
      lineWipWarehouseId: '',
      lineWipWarehouseBarcodeId: '',
      activeName1: 'an1Tab1',
      activeName2: 'an2Tab1'
    }
    return _initdata
  },
  created() {

  },
  methods: {
    myChangelineWipWarehouse(row) {
      this.$refs.lineWipWarehouseBarcodeId.reloadData(row.id)
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
.model-factory{
  position: relative;
  width: 600px;
  height: calc(100vh - 120px);
  float: left;
  background: #D4D7D7;
}
.model-workshop{
  width: calc(100%);
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
  height: 400px;
  background: #E8EAE9;
}
.model-workshop-bottom{
  margin-top:10px ;
  height: calc(100vh - 540px);
  background: #E8EAE9;
}
.mode-workshop-container-top{
  height: 330px;
  overflow-y:auto;
}
.mode-workshop-container-bottom{
  height: calc(100vh - 600px);
  overflow-y:auto;
}
.model-process-material{
  float: left;
  width: calc(50% - 2.5px);
  height: calc(100vh - 430px);
  background:#0A3C54;
}

</style>
