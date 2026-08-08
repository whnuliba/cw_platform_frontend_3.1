<template>
  <div class="app-container pdalayout">
  <div class="filter-container">
    <div >
      <el-form ref="form" :model="barcode" label-width="80px">
      <el-form-item label="设备编码:">
        <el-input v-model="barcode.deviceNo" placeholder="设备编码" style="width: 150px"   class="filter-item"></el-input>
      </el-form-item>
      <el-form-item label="工单:">
        <el-input v-model="barcode.orderNo" placeholder="工单" style="width: 150px"   class="filter-item"></el-input>
      </el-form-item>
      <el-form-item label="条码:">
        <el-input @keyup.enter.native="save" v-model="barcode.barcode" placeholder="条码" style="width: 150px"   class="filter-item"></el-input>
        <el-button type="primary"   class="filter-item" @click="save">{{ '提交' }}</el-button>
      </el-form-item>
      <el-form-item label="数量:">
        <el-input  v-model="barcode.qty" placeholder="数量" style="width: 150px"   class="filter-item"></el-input>
      </el-form-item>
      <el-form-item label="领料单:">
        <el-input @keyup.enter.native="savetableData"  v-model="barcode.packNo" placeholder="领料单" style="width: 150px"   class="filter-item"></el-input>
      </el-form-item>
      
      <el-form-item>
        <!-- <div class="submit_form_box"> -->
          <!-- <el-button type="primary"   class="filter-item" @click="save">{{ '保存' }}</el-button> -->
          <el-button type="primary"   class="filter-item" @click="submit">{{ '完成领料单' }}</el-button>
        <!-- </div> -->
       
      </el-form-item>
      </el-form>
    </div>
    
    <div>
       <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" :max-height='200'>
        <el-table-column v-for="(item) in cols" v-if="!item.hide" v-show="!item.hide" :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width" :min-width="item.minWidth" :align="item.align" show-overflow-tooltip>
          <template slot-scope="{row,$index}">{{item.field !== 'No' ? row[item.field] : $index+1}}</template>
        </el-table-column>
      </el-table>
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
      listLoading:false,
      list:[],
      barcode:{
         deviceNo:"",
         orderNo:"",
         barcode:"",
         packNo:"",
         qty:"",
      },
      cols: [
        { field: 'No', title: '序号', align: 'center', query: true, queryType: 'input', set: false, require: false, width:50,},
        { field: 'barcode', title: '条码', align: 'left', query: true, queryType: 'input', set: false, require: false, width:110,},
        { field: 'materialName', title: '物料名称', align: 'left', query: false, queryType: 'input', set: false, require: false, width:150 },
        { field: 'qty', title: '数量', align: 'left', query: false, queryType: 'input', set: false, require: false, width:62 },
        { field: 'unit', title: '单位', align: 'left', query: false, queryType: 'input', set: false, require: false, width:47 },
      ]
    }

    return _initdata
  },
  created() {
  },
  mounted() {
  },
  methods: {
    getList() {
      this.listLoading = true
      const _data = { url: "/lineProcessBarcodePack/selectByPackNo", params: {data:this.barcode.packNo} }
      this.$store.dispatch('fmsCommon/actionProductPost', _data)
        .then(data => {
          this.list = data.data
          this.listLoading = false
        }).catch(err => {
        console.error(err)
      })
    },
    savetableData(){
      this.getList()
    },
    submit(){
     
      const _data = {url:'/lineProcessPack/guest/autoPackingComplete',params:{packNo:this.barcode.packNo}}
      this.$store.dispatch('fmsCommon/actionProductPost',_data)
        .then(data => {
        this.$message({
            type: 'success',
            message: '提交成功'
          });
        }).catch(err => {
          console.error(err)
        }).finally(()=>{
      })
    },
    save(){
      let params = this.barcode;
      params.packNo= null;
      const _data = {url:'/lineProcessPack/guest/autoCreatePacking',params}
      this.$store.dispatch('fmsCommon/actionProductPost',_data)
        .then(data => {
          this.$message({
            type: 'success',
            message: '保存成功'
          });
          this.barcode.packNo = data.packNo
          this.barcode.qty = ''
          this.barcode.barcode = ''

          this.getList()
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
.submit_form_box{
  margin-left: 14%;
}
</style>
