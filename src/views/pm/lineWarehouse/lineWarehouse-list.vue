<template>
  <div class="app-container">
    <div class="model-factory">
      <div class="model-factory-top">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="线边仓库" name="first">
            <div class="mode-container">
              <component :is="lineWarehouseComponents" ref="lineWarehouseId" :lineWarehouseId="lineWarehouseId"  @rowClick = "myChangeLineWarehouseId"  @rowdoubleClick="myChangeLineWarehouseId"> </component >
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="model-workshop">
      <div class="model-workshop-top">
        <el-tabs v-model="activeName1" type="border-card" >
          <el-tab-pane label="物料信息" name="Line-Material">
            <div class="mode-workshop-container-top">
              <component :is="lineMaterialComponents" ref="lineMaterialId" :LineWarehouseId="lineMaterialId" @rowClick ="myChangLineMaterial"> </component >
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="model-workshop-bottom" >
        <el-tabs v-model="activeName2" type="border-card" >
          <el-tab-pane label="物料条码信息" name="Material-Barcode">
            <div class="mode-workshop-container-bottom">
              <component :is="lineMaterialBarcodeComponents" ref="lineMaterialBarcodeId" :lineMaterialBarcodeId="lineMaterialBarcodeId"  > </component >
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
import lineWarehouse from './components/lineWarehouse'
import lineMaterial from './components/lineMaterial'
import lineMaterialBarcode from './components/lineMaterialBarcode'

import i18n from '@/lang' ;
export default {
  name: 'lineWarehouse-list',
  components: { Pagination, lineWarehouse, lineMaterial, lineMaterialBarcode },
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
      lineWarehouseComponents: 'lineWarehouse',
      lineMaterialComponents: 'lineMaterial',
      lineMaterialBarcodeComponents: 'lineMaterialBarcode',
      lineWarehouseId: '',
      lineMaterialId: '',
      lineMaterialBarcodeId: '',
      activeName: 'first',
      activeName1: 'Line-Material',
      activeName2: 'Material-Barcode'
    }
    return _initdata
  },
  created() {

  },
  methods: {
    myChangeLineWarehouseId(row) {
      this.$refs.lineMaterialId.reloadData(row.id)
    },
    myChangLineMaterial(row) {
      this.$refs.lineMaterialBarcodeId.reloadData(row.id)
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
