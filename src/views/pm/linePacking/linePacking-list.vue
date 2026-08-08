<template>
  <div class="app-container">
    <div class="model-factory">
      <div class="model-factory-top">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="备料入线边仓领料单" name="first">
            <div class="mode-container">
              <component :is="linePackingComponents" ref="linePackingId" :linePackingId="linePackingId"  @rowClick = "myChangelinePackingId"  > </component >
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
              <component :is="lineMaterialPackingComponents" ref="lineMaterialPackingId" :lineMaterialPackingId="lineMaterialPackingId" @rowClick ="myChangLineMaterial"> </component >
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="model-workshop-bottom" >
        <el-tabs v-model="activeName2" type="border-card" >
          <el-tab-pane label="物料条码信息" name="Material-Barcode">
            <div class="mode-workshop-container-bottom">
              <component :is="lineMaterialBarcodePackingComponents" ref="lineMaterialBarcodePackingId" :lineMaterialBarcodePackingId="lineMaterialBarcodePackingId"  > </component >
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
import linePacking from './components/linePacking'
import lineMaterialPacking from './components/lineMaterialPacking'
import lineMaterialBarcodePacking from './components/lineMaterialBarcodePacking'

import i18n from '@/lang' ;
export default {
  name: 'LineWarehouse',
  components: { Pagination, linePacking, lineMaterialPacking, lineMaterialBarcodePacking },
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
      linePackingComponents: 'linePacking',
      lineMaterialPackingComponents: 'lineMaterialPacking',
      lineMaterialBarcodePackingComponents: 'lineMaterialBarcodePacking',
      linePackingId: '',
      lineMaterialPackingId: '',
      lineMaterialBarcodePackingId: '',
      activeName: 'first',
      activeName1: 'Line-Material',
      activeName2: 'Material-Barcode'
    }
    return _initdata
  },
  created() {

  },
  methods: {
    myChangelinePackingId(row) {
      this.$refs.lineMaterialPackingId.reloadData(row.id)
    },
    myChangLineMaterial(row) {
      this.$refs.lineMaterialBarcodePackingId.reloadData(row.id)
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
  width: 885px;
  height: calc(100vh - 120px);
  float: left;
  background: #D4D7D7;
}
.model-workshop{
  width: calc(100% - 890px);
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
