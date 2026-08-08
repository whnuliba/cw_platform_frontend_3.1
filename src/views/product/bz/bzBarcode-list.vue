<template>
  <div class="app-container">
    <div class="container-body-top">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="生产信息" name="first">
          <div>
            <component :is="bzBarcodeInfoComponents" ref="barCodeInfoId" :barCodeInfoId="barCodeInfoId"  @barCodeInfoRowClick = "myChangeBarCodeInfoItem"> </component >
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="container-body-bottom" style="min-height:300px">
      <el-tabs v-model="activeName1" type="border-card" >
        <el-tab-pane label="出入站信息" name="Inout-Station">
          <div>
            <component :is="bzInoutStationComponents" ref="inoutStationId" :inoutStationId="inoutStationId" @inoutStationClick = "myChangeInoutStation" > </component >
          </div>
        </el-tab-pane>
        <el-tab-pane label="配料信息" name="Process-Material">
          <div>
            <component :is="bzProcessMaterialComponents" ref="processMaterialId" :processMaterialId="processMaterialId" > </component >
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import bzBarcodeInfo from './components/bzBarcodeInfo'
import bzInoutStation from './components/bzInoutStation'
import bzProcessMaterial from './components/bzProcessMaterial'

import i18n from '@/lang' ;
export default {
  name: 'BZBarcodelist',
  components: { Pagination, bzBarcodeInfo, bzInoutStation, bzProcessMaterial },
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
      bzBarcodeInfoComponents: 'bzBarcodeInfo',
      bzInoutStationComponents: 'bzInoutStation',
      bzProcessMaterialComponents: 'bzProcessMaterial',
      barCodeInfoId: '',
      inoutStationId: '',
      processMaterialId: '',
      activeName: 'first',
      activeName1: 'Inout-Station'
    }
    return _initdata
  },
  created() {

  },
  methods: {
    myChangeBarCodeInfoItem(row) {
      this.inoutStationId = row.sn || ''
    },
    myChangeInoutStation(row) {
      this.activeName1 = 'Process-Material'
      this.$refs.processMaterialId.reloadData(row.id)
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
