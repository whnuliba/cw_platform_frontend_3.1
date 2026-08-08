<template>
  <div class="app-container">
       <div class="container-body-top">
         <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane label="工位物料" name="material-dist">
                    <div>
                    <component :is="wsStockInventoryComponents" ref="stationStockInventoryId" :stationStockInventoryId="stationStockInventoryId"  @changeHeader = "myChangeHeader"> </component >
                    </div>    
                  </el-tab-pane>
              </el-tabs>
       </div>
       <div class="container-body-bottom" style="min-height:300px">
           <el-tabs v-model="activeName1" type="border-card">
                <el-tab-pane label="工位物料条码" name="material-item">
                    <div>
                    <component :is="wsStockBarcodeComponents" ref="stationStockBarcodeId" :stationStockBarcodeId="stationStockBarcodeId" > </component >
                    </div>    
                  </el-tab-pane>
              </el-tabs>
       </div>
  </div>

</template>

<script>
import waves from "@/directive/waves"; // waves directive
import elDragDialog from "@/directive/el-drag-dialog";
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import wsStockBarcode from './components/station-stock-barcode'
import wsStockInventory from './components/station-stock-inventory'
import i18n from '@/lang';
export default {
  name: 'stationStockInfo',
  components: { Pagination,wsStockBarcode,wsStockInventory},
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
    const  _initdata ={
     wsStockBarcodeComponents:"wsStockBarcode",
      wsStockInventoryComponents:"wsStockInventory",
      stationStockBarcodeId:"",
      stationStockInventoryId:"",
      is_edit:false,
      activeName:"material-dist",
      activeName1:'material-item'
    }
    return _initdata
  },


  created() {
  
  },
  methods: {
    myChangeHeader(row){
         this.stationStockInventoryId = row.id||''
         this.$refs.stationStockBarcodeId.detailsItem( row)
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
    max-height: 600px;
    overflow-y:auto;
}

.container-body-bottom{
    width: 100%;
    margin-top:10px ;
    max-height: 200px;
    overflow-y:auto;
}


</style>
