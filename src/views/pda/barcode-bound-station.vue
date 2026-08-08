<template>
  <div class="app-container">
  <div class="filter-container">
           <div>
            <el-input   v-model="barcode.type" placeholder="生产类型" style="width: 150px"   class="filter-item"></el-input>
           </div>
           <div>
           <el-input   v-model="barcode.stationNo" placeholder="工位编码" style="width: 150px"   class="filter-item"></el-input>
           </div>
            <div>
            <el-input   v-model="barcode.barcode" placeholder="产品条码" style="width: 150px"   class="filter-item"></el-input>
           </div>
           <div>
            <el-input   v-model="barcode.sn" placeholder="物料条码" style="width: 150px"   class="filter-item"></el-input>
           </div>
           <div>
            <el-input   v-model="barcode.orderNo" placeholder="当前工单" style="width: 150px"   class="filter-item"></el-input>
           </div>
           <div>
           <el-button type="warning"   class="filter-item" @click="submit">
               {{ $t("common.btn.submit") }}
           </el-button>
           </div>
     </div>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import elDragDialog from "@/directive/el-drag-dialog";
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import i18n from '@/lang';
export default {
  name: 'planInfo',
  components: { Pagination },
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
      props: {
      // 外部传入的内容，用于实现双向绑定
      value: String,
      machingPlanId:String
   },
  data() {
    const  _initdata ={
        barcode:{
           type:"BZ",
           stationNo:"HC_01",
           sn:"",
           orderNo:"",
           barcode:"barcode"         
        }

    }

    return _initdata
  },
  created() {

  },
  methods: {
  submit(){
       const _data = {url:'/bus/api/guest/result',params:{
          data:this.barcode,  resourceNo:"BARCODE_BOUND_SERVICE"
       }}
      this.$store.dispatch('fmsCommon/actionServerPost',_data)
              .then(data => {
              this.$message({
                    type: 'success',
                    message: '物料扫码成功'
                  });
                  this.dialogFormVisible = false
              }).catch(err => {
                  console.error(err)
              }).finally(()=>{
       })
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
.model-factory{
    position: relative;
   width: 500px;
   height: calc(100vh - 120px);
   float: left;
   background: #D4D7D7;
}
.model-workshop{
   width: calc(100% - 505px);
   height: calc(100vh - 120px);
   float: left;
   margin-left:5px ;
      background: #D4D7D7;
}
.el-dialog__body {
    padding: 5px 20px !important;
}
.el-form-item {
    margin-bottom: 8px !important;
}
</style>
