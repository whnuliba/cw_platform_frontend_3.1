<template>
  <div class="app-container pdalayout">
  <div class="filter-container" style="width:100%">
    <el-tabs>
      <el-tab-pane label="开始生产">
      <el-form ref="form" :model="barcode" label-width="35%">
      <el-form-item label="设备编码:">
        <el-input v-model="barcode.deviceNo" placeholder="设备编码" style="width: 160px"   class="filter-item"></el-input>
      </el-form-item>
      <el-form-item label="条码:">
        <el-input v-model="barcode.barCode" placeholder="条码" style="width: 160px"   class="filter-item"></el-input>
      </el-form-item>
      <el-form-item label="人员:">
        <el-input disabled v-model="barcode.person" placeholder="人员" style="width: 160px"   class="filter-item"></el-input>
      </el-form-item>
      <!-- <el-form-item label="班次:">
        <el-input v-model="barcode.workShfit" placeholder="班次" style="width: 160px"   class="filter-item"></el-input>
      </el-form-item> -->
      <el-form-item label="班次:">
        <el-select v-model="barcode.workShfit" placeholder="请选择" style="width: 160px"   class="filter-item" >
          <el-option
          v-for="item in workShfitData"
          :key="item.shiftName"
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
      <el-tab-pane label="分卷">
          <el-form ref="form1" :model="subsection" label-width="35%">
            <el-form-item label="条码:">
              <el-input v-model="subsection.barCode" placeholder="条码" style="width: 150px"   class="filter-item"></el-input>
            </el-form-item>
            <el-form-item label="分卷1卷号:">
              <el-input v-model="subsection.rollNameA" placeholder="分卷1卷号" style="width: 150px"   class="filter-item"></el-input>
            </el-form-item>
            <el-form-item label="分卷2卷号:">
              <el-input v-model="subsection.rollNameB" placeholder="分卷2卷号" style="width: 150px"   class="filter-item"></el-input>
            </el-form-item>
            <el-form-item>
            <el-button type="warning" class="filter-item" @click="submintsubsection">
              {{ '提交' }}
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
        //  orderNo:"",
         person:"",
        //  mwindNo:"",
         workShfit:"",
         barCode:"",
      },
       end:{
         deviceNo:"",
      },
      subsection:{
        barCode:'',
        rollNameA:'',
        rollNameB:'',
      },
      workShfitData:[
        {
          shiftName:'白班',
        },
        {
          shiftName:'夜班',
        },
      ],
    }

    return _initdata
  },
  created() {
  },
  mounted() {
    this.barcode.person = sessionStorage.getItem('userInfo')
  },
  methods: {
    destory(obj,key='') {
      for (const p in obj) {
        if (obj.hasOwnProperty(p) && p != key) {
          obj[p] = ''
        }
      }
    },
    endsubmit(){
      const _data = {url:'/cutting/pdaCompleteProduct',params:this.end}
      this.$store.dispatch('fmsCommon/actionProductPost',_data)
        .then(data => {
          this.$message({
            type: 'success',
            message: '完成生产'
          });
          this.destory(this.end)
        }).catch(err => {
            console.error(err)
        }).finally(()=>{
        })
    },
    submit(){
       const _data = {url:'/cutting/startProduct',params:this.barcode}
      this.$store.dispatch('fmsCommon/actionProductPost',_data)
        .then(data => {
          this.$message({
            type: 'success',
            message: '开始生产'
          });
          this.destory(this.end,'person')
        }).catch(err => {
          console.error(err)
        }).finally(()=>{
        })
    },
    submintsubsection(){
      this.$confirm("确认分卷吗?", "提示", {
        customClass: 'message-logout',
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
         const _data = {url:'/cutting/subsection',params:{data:this.subsection}}
        this.$store.dispatch('fmsCommon/actionProductPost',_data)
          .then(data => {
            this.$message({
              type: 'success',
              message: '开始分卷'
            });
            this.destory(this.subsection)
          }).catch(err => {
            console.error(err)
          }).finally(()=>{
         })
      });
        
    },


  }
}
</script>

<style scoped>
.pdalayout{
  display: flex;
  justify-content: center;
}
.filter-item{
  margin-left: 3px;
}
.el-form-item {
    margin-bottom: 8px !important;
}

</style>
<style>
.message-logout{
 width: 300px !important;
}
</style>
