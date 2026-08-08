<template>
  <div class="app-container pdalayout">
  <div class="filter-container" style="width:100%">
      <el-tabs>
        <el-tab-pane label="进站">
          <el-form ref="form" :model="barcode" label-width="35%">

          <el-form-item label="工单:">
            <el-input v-model="barcode.orderNo" placeholder="工单" style="width: 160px"   class="filter-item"></el-input>
          </el-form-item>
          <el-form-item label="线体:">
            <el-input v-model="barcode.deviceNo" placeholder="线体" style="width: 160px"   class="filter-item"></el-input>
          </el-form-item>
          
          <!-- <el-form-item label="线别:">
            <el-input v-model="barcode.lineNo" placeholder="线别" style="width: 160px"   class="filter-item"></el-input>
          </el-form-item> -->
          <el-form-item label="托盘码:">
            <el-input @keyup.enter.native="submit" v-model="barcode.trayNo" placeholder="托盘码" style="width: 160px"   class="filter-item"></el-input>
          </el-form-item>
          <!-- <el-form-item label="人员:">
            <el-input disabled v-model="barcode.person" placeholder="人员" style="width: 160px"   class="filter-item"></el-input>
          </el-form-item>
          <el-form-item label="班次:">
            <el-input v-model="barcode.workShfit" placeholder="班次" style="width: 160px"   class="filter-item"></el-input>
          </el-form-item> -->
          <!-- <el-form-item> -->
            <div style="margin-left:24%">

            <el-button  type="info" class="filter-item" @click="clear">
              {{ '清空'}}
            </el-button>
            <el-button  type="info" class="filter-item" @click="destory(barcode)">
              {{ '重置'}}
            </el-button>
            <el-button type="primary" class="filter-item" @click="submit">
              {{ '提交' }}
            </el-button>
            </div>

           
          <!-- </el-form-item> -->
        </el-form>
        <div>
               <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 50%;margin-left:27%" :max-height='200'>
                <el-table-column v-for="(item) in cols" v-if="!item.hide" v-show="!item.hide" :key="item.id" :label="commonI18n(item)" :prop="item.field" :width="item.width" :min-width="item.minWidth" :align="item.align" show-overflow-tooltip>
                  <template slot-scope="{row}">{{row[item.field]}}</template>
                </el-table-column>
              </el-table>
        </div>
        </el-tab-pane>
        <el-tab-pane label="出站">
          <el-form ref="form1" :model="end" label-width="35%">
            <el-form-item label="线体:">
              <el-input v-model="end.deviceNo" placeholder="线体" style="width: 150px"   class="filter-item"></el-input>
            </el-form-item>
            <el-form-item label="托盘码:">
              <el-input v-model="end.trayNo" placeholder="托盘码" style="width: 150px"   class="filter-item"></el-input>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" class="filter-item" @click="endsubmit">
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
       cols: [
        { field: 'trayNo', title: '托盘码', align: 'center', query: true, queryType: 'input', set: false, require: false,},
      ],
      list:[],

      barcode:{
         deviceNo:"",
         trayNo:"",
        //  lineNo:"",
         orderNo:"",
      },
      end:{
         deviceNo:"",
         trayNo:"",
      },
      windingFeedTypeData:[],
      orderNoarrSData:[],
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
    clear(){
      this.list=[]
    },
    destory(obj,key='') {
      for (const p in obj) {
        if (obj.hasOwnProperty(p) && p != key) {
          obj[p] = ''
        }
      }
    },
    selectOptions() {
      const _data = {url:'/homogenate/getAllWorkshop'}
      this.$store.dispatch('fmsCommon/actionProductPost',_data)
      .then(data => {
        this.windingFeedTypeData = data;
      }).catch(err => {
        console.error(err)
      })
    },
    endsubmit(){
      const _data = {url:'/assembly/outStation',params:{data:this.end}}
      this.$store.dispatch('fmsCommon/actionProductPost',_data)
        .then(data => {
          this.$message({
            type: 'success',
            message: '完成生产'
          });
          this.dialogFormVisible = false
          this.destory(this.end)
        }).catch(err => {
          console.error(err)
        }).finally(()=>{
        })
    },
    submit(){
      const _data = {url:'/assembly/inStation',params:{data:this.barcode}}
      this.$store.dispatch('fmsCommon/actionProductPost',_data)
        .then(data => {
          this.$message({
            type: 'success',
            message: '开始生产'
          });
          this.list.push({trayNo:this.barcode.trayNo})
          this.dialogFormVisible = false
          this.barcode.trayNo = ''
          // this.destory(this.barcode,'trayNo')
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
  /* width: 100%; */
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
