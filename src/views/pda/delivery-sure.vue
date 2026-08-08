<template>
  <div class="app-container">
  <div class="filter-container">
           <el-input   v-model="orderNo" placeholder="请扫工单条码" style="width: 150px"   class="filter-item"></el-input>
           <el-button type="warning"   class="filter-item" @click="submit">
               {{ $t("common.btn.submit") }}
           </el-button>
           <el-button type="warning"   class="filter-item" @click="save">
               {{ '扫码' }}
           </el-button>
     </div>

    
     <template>
  <!-- <p class="error">{{ error }}</p> -->
      <!--错误信息-->
 
      <!-- <p class="decode-result">
          扫描结果:
          <b>{{ result }}</b>
      </p> -->
      <!--扫描结果-->
      <!-- <p @click="openCamera">打开相机</p>
      <div v-show="show" class="cameraMessage">
          <p @click="closeCamera">关闭相机</p>
          <p @click="openFlash">打开手电筒</p>
          <p @click="switchCamera">相机反转</p>
      </div> -->
 
      <qrcode-stream
          v-show="qrcode"
          :camera="camera"
          :torch="torchActive"
          @decode="onDecode"
          @init="onInit"
      >
          <div>
              <div class="qr-scanner">
                  <div class="box">
                      <div class="line"></div>
                      <div class="angle"></div>
                  </div>
                  <div class="txt">
                      <div class="myQrcode">我的二维码</div>
                  </div>
              </div>
          </div>
      </qrcode-stream>
   </template>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import elDragDialog from "@/directive/el-drag-dialog";
import { QrcodeStream } from 'vue-qrcode-reader';
import * as dd from 'dingtalk-jsapi'; // 此方式为整体加载，也可按需进行加载

import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import i18n from '@/lang';
export default {
  name: 'planInfo',
  components: { QrcodeStream,Pagination },
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
         orderNo:'',
         result: '', // 扫码结果信息
          error: '', // 错误信息
          // show: false,
          // qrcode: false,
          qrcode: true,
          torchActive: false,
          camera: 'auto',
    }

    return _initdata
  },
  created() {

  },
  methods: {
    save(){

      dd.biz.util.scan({
    type: String , // type 为 all、qrCode、barCode，默认是all。
    onSuccess: function(data) {
    //onSuccess将在扫码成功之后回调
      /* data结构
        { 'text': String}
      */
     alert(JSON.stringify(data))
    },
   onFail : function(err) {
    alert(JSON.stringify(err))
   }
})
    },
    onDecode(result) {
          alert(result)
          this.result = result;
      },
      async onInit(promise) {
          const { capabilities } = await promise;
 
          const TORCH_IS_SUPPORTED = !!capabilities.torch;
          try {
              await promise;
          } catch (error) {
              if (error.name === 'NotAllowedError') {
                  this.error = 'ERROR: 您需要授予相机访问权限';
              } else if (error.name === 'NotFoundError') {
                  this.error = 'ERROR: 这个设备上没有摄像头';
              } else if (error.name === 'NotSupportedError') {
                  this.error = 'ERROR: 所需的安全上下文(HTTPS、本地主机)';
              } else if (error.name === 'NotReadableError') {
                  this.error = 'ERROR: 相机被占用';
              } else if (error.name === 'OverconstrainedError') {
                  this.error = 'ERROR: 安装摄像头不合适';
              } else if (error.name === 'StreamApiNotSupportedError') {
                  this.error = 'ERROR: 此浏览器不支持流API';
              }
          }
        },
  submit(){
       const _data = {url:'/section-order/sure-delivery',params:{
          data:this.orderNo
       }}
       if(this.orderNo==null || this.orderNo== undefined || this.orderNo=='' ){
             this.$message({
                    type: 'error',
                    message: '输入数据不能为空'
                  })
            return      
       }
      this.$store.dispatch('fmsCommon/actionMdmPost',_data)
              .then(data => {
              this.$message({
                    type: 'success',
                    message: '产线工位到货成功，可以开始生产'
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
.error {
  font-weight: bold;
  color: red;
}
.cameraMessage {
  width: 100%;
  height: 60px;
}
.qr-scanner {
  background-image: linear-gradient(
          0deg,
          transparent 24%,
          rgba(32, 255, 77, 0.1) 25%,
          rgba(32, 255, 77, 0.1) 26%,
          transparent 27%,
          transparent 74%,
          rgba(32, 255, 77, 0.1) 75%,
          rgba(32, 255, 77, 0.1) 76%,
          transparent 77%,
          transparent
      ),
      linear-gradient(
          90deg,
          transparent 24%,
          rgba(32, 255, 77, 0.1) 25%,
          rgba(32, 255, 77, 0.1) 26%,
          transparent 27%,
          transparent 74%,
          rgba(32, 255, 77, 0.1) 75%,
          rgba(32, 255, 77, 0.1) 76%,
          transparent 77%,
          transparent
      );
  background-size: 3rem 3rem;
  background-position: -1rem -1rem;
  width: 100%;
  /* height: 100%; */
  height: 100vh;
  /* height: 288px; */
  position: relative;
  background-color: #1110;
 
  /* background-color: #111; */
}
/* .qrcode-stream-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 82px;
  clear: both;
} */
/* .qrcode-stream-wrapper >>> .qrcode-stream-camera {
  width: 213px;
  height: 210px;
  clear: both;
  margin-top: 39px;
} */
.qr-scanner .box {
  width: 213px;
  height: 213px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  border: 0.1rem solid rgba(0, 255, 51, 0.2);
  /* background: url('http://resource.beige.world/imgs/gongconghao.png') no-repeat center center; */
}
.qr-scanner .txt {
  width: 100%;
  height: 35px;
  line-height: 35px;
  font-size: 14px;
  text-align: center;
  /* color: #f9f9f9; */
  margin: 0 auto;
  position: absolute;
  top: 70%;
  left: 0;
}
.qr-scanner .myQrcode {
  text-align: center;
  color: #00ae10;
}
.qr-scanner .line {
  height: calc(100% - 2px);
  width: 100%;
  background: linear-gradient(180deg, rgba(0, 255, 51, 0) 43%, #00ff33 211%);
  border-bottom: 3px solid #00ff33;
  transform: translateY(-100%);
  animation: radar-beam 2s infinite alternate;
  animation-timing-function: cubic-bezier(0.53, 0, 0.43, 0.99);
  animation-delay: 1.4s;
}
 
.qr-scanner .box:after,
.qr-scanner .box:before,
.qr-scanner .angle:after,
.qr-scanner .angle:before {
  content: '';
  display: block;
  position: absolute;
  width: 3vw;
  height: 3vw;
 
  border: 0.2rem solid transparent;
}
 
.qr-scanner .box:after,
.qr-scanner .box:before {
  top: 0;
  border-top-color: #00ff33;
}
 
.qr-scanner .angle:after,
.qr-scanner .angle:before {
  bottom: 0;
  border-bottom-color: #00ff33;
}
 
.qr-scanner .box:before,
.qr-scanner .angle:before {
  left: 0;
  border-left-color: #00ff33;
}
 
.qr-scanner .box:after,
.qr-scanner .angle:after {
  right: 0;
  border-right-color: #00ff33;
}
 
@keyframes radar-beam {
  0% {
      transform: translateY(-100%);
  }
 
  100% {
      transform: translateY(0);
  }
}

</style>
