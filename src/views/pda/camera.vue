<template>
  <div class="app-container">
  <div class="filter-container">
           <div>
            <el-input   v-model="barcode.projectNo" placeholder="项目费用号" style="width: 150px"   class="filter-item"></el-input>
           </div>
           <div>
           <el-input   v-model="barcode.orderNo" placeholder="产线工单" style="width: 150px"   class="filter-item"></el-input>
           </div>
           <div>
            <el-input   v-model="barcode.barcode" placeholder="物料条码" style="width: 150px"   class="filter-item"></el-input>
           </div>
           <div>
           <el-button type="warning"   class="filter-item" @click="submit">
               {{ $t("common.btn.submit") }}
           </el-button>
           <el-button type="primary"   class="filter-item" @click="getCamera">
               {{ '打开相机' }}
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
           projectNo:"",
           orderNo:"",
           barcode:"",
           ioFlag:1,

        }

    }

    return _initdata
  },
  created() {

  },
  methods: {
         //=========================================================调用摄像头
         getCamera () {
        //打开照相机
        navigator.camera.getPicture(this.success,this.fail, {
          quality: 50, //像素质量[0,100]
          //布尔值，照片在返回Cordova应用之前用户是否可以编辑，但并不是所有移动平台都支持。
          destinationType:true,
          //数值型，指明图像输出格式。Camera.EncodingType.JPEG让API返回JPEG图像
          encodingType: Camera.EncodingType.JPEG,
          /* sourceType :1. PHOTOLIBRARY 或 0 打开照片库。
      　　　　　　2.CAMERA 或 1 打开本机相机。
      　　　　　 3.SAVEDPHOTOALBUM 或 2 打开已保存的相册。 */
          sourceType:1,
          destinationType: Camera.DestinationType.FILE_URI
        });
      },
      success(imageURL){
        console.log(imageURL)
        alert('打开成功')
      },
      fail(message){
        console.log(message)
        alert('打开失败')
      },
     //================================================================


  submit(){
       const _data = {url:'/bus/api/guest/result',params:{
          data:this.barcode,  resourceNo:"MATERIAL_SCAN_PACKING"
       }}
      this.$store.dispatch('fmsCommon/actionServerPost',_data)
              .then(data => {
              this.$message({
                    type: 'success',
                    message: '产品上线成功'
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
