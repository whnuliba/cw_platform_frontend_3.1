<template>
  <div class="app-container">
       <div class="container-body-top">
         <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane label="订单信息" name="first">
                    <div>
                    <component :is="orderInfoComponents" ref="poId" :poId="poId"  @changePo = "myChangePo"> </component >
                    </div>    
                  </el-tab-pane>
              </el-tabs>
       </div>
       <div class="container-body-bottom">
           <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane label="工单信息" name="first">
                    <div>
                    <component :is="orderItemInfoComponents" ref="poItemId" :poItemId="poItemId" > </component >
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
import orderInfo from './components/order-info'
import productPlan from './components/product-plan'
import orderItemInfo from './components/order-item-info'
import i18n from '@/lang';
export default {
  name: 'ProcessList',
  components: { Pagination,orderInfo,orderItemInfo,orderItemInfo},
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
      orderInfoComponents:"orderInfo",
      orderItemInfoComponents:"orderItemInfo",
      poId:"",
      poItemId:"",
      machingPlanId:"",
      activeName:"first"
    }
    return _initdata
  },


  created() {
  
  },
  methods: {
    myChangePo(row){
         this.poItemId = row.id||''
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
