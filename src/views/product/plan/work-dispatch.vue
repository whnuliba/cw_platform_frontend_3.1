<template>
  <div class="app-container">
       <div class="container-body-top">
         <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane label="计划信息" name="plan-order">
                    <div>
                    <component :is="productPlanComponents" ref="machingPlanId" :machingPlanId="machingPlanId"  @changeProductPlan = "myChangeProductPlan"> </component >
                    </div>    
                  </el-tab-pane>
              </el-tabs>
       </div>
       <div class="container-body-bottom" style="min-height:300px">
           <el-tabs v-model="activeName1" type="border-card">
                <el-tab-pane label="产线工单" name="line-work">
                    <div>
                    <component :is="sectionOrderComponents" ref="sectionOrderId" :sectionOrderId="sectionOrderId"
                     @changeSelectionOrder = "myChangeSelectionOrder"
                     @changeSelectionOrderMat = "myChangeSelectionOrderMat"
                     > </component >
                    </div>    
                  </el-tab-pane>
                  <!-- <el-tab-pane label="工位工序工单" name="station-work">
                    <div>
                    </div>    
                  </el-tab-pane> -->
                 <el-tab-pane label="工单物料需求" name="station-material">
                    <div>
                        <component :is="orderMaterialComponents" ref="orderMaterialId" :orderMaterialId="orderMaterialId" > </component >
                    </div>    
                  </el-tab-pane>       
                  <el-tab-pane label="工位物料信息" name="order-material">
                    <div>
                       <component :is="stationStockInventoryComponents" ref="stationStockInventoryId" :stationStockInventoryId="stationStockInventoryId" > </component >
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
import sectionOrder from './components/section-order'
import productPlan from './components/product-plan'
import orderMaterial from './components/order-material'
import stationStockInventory from './components/order-station-material'
import i18n from '@/lang';
export default {
  name: 'ProcessList',
  components: { Pagination,productPlan,sectionOrder,orderMaterial,stationStockInventory},
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
      productPlanComponents:"productPlan",
      sectionOrderComponents:"sectionOrder",
      orderMaterialComponents:"orderMaterial",
      stationStockInventoryComponents:'stationStockInventory',
      stationStockInventoryId:'',
      poId:"",
      machingPlanId:"",
      sectionOrderId:"",
      orderMaterialId:"",
      poItemId:"",
      activeName:"plan-order",
       activeName1:"line-work"
    }
    return _initdata
  },


  created() {
  
  },
  methods: {
    myChangeProductPlan(row){
         //this.sectionOrderId = row.orderNo||''
          this.activeName1 = "line-work"
        this.$refs.sectionOrderId.reloadData(row.orderNo)
    },
    myChangeSelectionOrder(row){
        this.activeName1 = "station-material"
        this.$refs.orderMaterialId.reloadData(row.orderNo)
    },
    myChangeSelectionOrderMat(row){
        this.activeName1 = "order-material"
        this.$refs.stationStockInventoryId.reloadData(row.orderNo)
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
