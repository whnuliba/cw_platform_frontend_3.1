<template>
  <div class="app-container pdalayout">
  <div class="filter-container" style="width:100%">
      <el-tabs>
        <el-tab-pane label="开始生产">
          <el-form ref="form" :model="barcode" label-width="35%">

          <el-form-item label="工作中心:">
            <el-select @change="workshopNochange" v-model="barcode.workshopNo" placeholder="请选择" style="width: 180px"   class="filter-item" >
            <el-option
            v-for="item in windingFeedTypeData"
            :key="item.paramKey"
            :label="item.paramValue"
            :value="item.paramKey">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="工单:">
            <el-select v-model="barcode.orderNo" placeholder="请选择" style="width: 180px"   class="filter-item" >
            <el-option
            v-for="item in orderNoarrSData"
            :key="item.id"
            :label="item.orderNo"
            :value="item.orderNo">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="设备编码:">
            <el-input v-model="barcode.deviceNo" placeholder="设备编码" style="width: 180px"   class="filter-item"></el-input>
          </el-form-item>
          <el-form-item label="锅次编码:">
            <el-input v-model="barcode.panTime" placeholder="锅次编码" style="width: 180px"   class="filter-item"></el-input>
          </el-form-item>
          <el-form-item label="人员:">
            <el-input disabled v-model="barcode.person" placeholder="人员" style="width: 180px"   class="filter-item"></el-input>
          </el-form-item>
          <!-- <el-form-item label="班次:">
            <el-input v-model="barcode.workShfit" placeholder="班次" style="width: 160px"   class="filter-item"></el-input>
          </el-form-item> -->
          <el-form-item label="班次:">
            <el-select v-model="barcode.workShfit" placeholder="请选择" style="width: 180px"   class="filter-item" >
            <el-option
            v-for="item in workShfitData"
            :key="item.id"
            :label="item.shiftName"
            :value="item.shiftName">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" class="filter-item" @click="submit">
              {{ '开始生产' }}
            </el-button>
          </el-form-item>
        </el-form>
        </el-tab-pane>
        <el-tab-pane label="完成生产">
          <el-form ref="form1" :model="end" label-width="35%">
            <el-form-item label="设备编码:">
              <el-input v-model="end.deviceNo" placeholder="设备编码" style="width: 150px"   class="filter-item"></el-input>
            </el-form-item>
            <el-form-item>
            <el-button type="warning" class="filter-item" @click="endsubmit">
              {{ '完成生产' }}
            </el-button>
          </el-form-item>
          </el-form>
        </el-tab-pane>
       
      </el-tabs>
   
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
         deviceNo:"",
         panTime:"",
         person:"",
         workShfit:"",
         workshopNo:'',
         orderNo:'',
      },
      end:{
         deviceNo:"",
      },
      windingFeedTypeData:[],
      orderNoarrSData:[],
      workShfitData:[],
    }

    return _initdata
  },
  created() {
    this.selectOptions()
  },
  mounted() {
    this.barcode.person = sessionStorage.getItem('userInfo')
  },
  methods: {
    workshopNochange(val){
      const _data1 = {url:'/pm-order/selectByFactoryNo',params: {data:val}}
      this.$store.dispatch('fmsCommon/actionProductPost',_data1)
      .then(data => {
        this.barcode.orderNo = '';
        this.orderNoarrSData = data;
      }).catch(err => {
        console.error(err)
      })
      const _data2 = {url:'/workShift/selectWorkShiftByWNo',params: {data:val}}
      this.$store.dispatch('fmsCommon/actionMdmPost',_data2)
      .then(data => {
        this.barcode.workShfit = '';
        this.workShfitData = data;
      }).catch(err => {
        console.error(err)
      })
    },
    destory(obj,key='') {
      for (const p in obj) {
        if (obj.hasOwnProperty(p) && p != key) {
          obj[p] = ''
        }
      }
    },
    selectOptions() {
      const _data = {url:'/homogenate/selectWorkshopBySysParam'}
      this.$store.dispatch('fmsCommon/actionProductPost',_data)
      .then(data => {
        // console.log(data);
        this.windingFeedTypeData = data;
      }).catch(err => {
        console.error(err)
      })
    },
    endsubmit(){
      const _data = {url:'/homogenate/pdaCompleteProduct',params:this.end}
      this.$store.dispatch('fmsCommon/actionProductPost',_data)
        .then(data => {
          this.$message({
            type: 'success',
            message: '完成生产'
          });
          this.dialogFormVisible = false
          this.destorcy(this.end)
        }).catch(err => {
          console.error(err)
        }).finally(()=>{
        })
    },
    submit(){
      const _data = {url:'/homogenate/startProduct',params:this.barcode}
      this.$store.dispatch('fmsCommon/actionProductPost',_data)
        .then(data => {
          this.$message({
            type: 'success',
            message: '开始生产'
          });
          this.dialogFormVisible = false
          this.destory(this.barcode,'person')
        }).catch(err => {
          console.error(err)
        }).finally(()=>{
       })
    },


  }
}
</script>

<style scoped>
.pdalayout{
  width: 100%;
  display: flex;
  justify-content: center;
}
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
