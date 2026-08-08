<template>
  <div class="app-container">
    <div class="model-workshop">
      <div class="model-workshop-top">
        <el-tabs v-model="activeName1" type="border-card" >
          <el-tab-pane label="分切工单" name="an1Tab1">
            <div class="mode-workshop-container-top">
              <component :is="orderComponents" ref="orderId" :orderNo="orderId" @rowClick ="myChangeOrder"> </component >
            </div>
          </el-tab-pane>
          <el-tab-pane label="小卷" name="an2Tab2">
            <div class="mode-workshop-container-bottom">
              <component :is="cuttingComponents" ref="cuttingId" :activeName1="activeName1"  :cuttingId="cuttingId"  > </component >
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- <div class="model-workshop-bottom" >
        <el-tabs v-model="activeName2" type="border-card" >
        </el-tabs>
      </div> -->
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import cutting from './components/cutting'
import cuttingsmallvolume from './components/cuttingsmallvolume'

import i18n from '@/lang' ;
export default {
  name: 'cutting-list',
  components: { Pagination, cutting, cuttingsmallvolume },
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
    const _initdata = {
      orderComponents: 'cutting',
      cuttingComponents: 'cuttingsmallvolume',
      orderId: '',
      cuttingId: '',
      activeName1: 'an1Tab1',
      activeName2: 'an2Tab2'
    }
    return _initdata
  },
  created() {

  },
  methods: {
    myChangeOrder(row) {
      this.$refs.cuttingId.reloadData(row)
      this.activeName1 = 'an2Tab2'
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
  /* max-height: 50%; */
  overflow-y:auto;
}
.container-body-bottom{
  width: 100%;
  margin-top:10px ;
  max-height: 50%;
  overflow-y:auto;
}
.model-factory{
  position: relative;
  width: 600px;
  height: calc(100vh - 120px);
  float: left;
  background: #D4D7D7;
}
.model-workshop{
  width: calc(100%);
  height: calc(100vh - 120px);
  float: left;
  margin-left:5px ;
}
.mode-container{
  height: calc(100vh - 190px);
  overflow-y:auto;
}
.model-factory-top{
  height:calc(100vh - 120px);
  background: #E8EAE9;
}
.model-workshop-top{
  /* height: 400px; */
  background: #E8EAE9;
}
.model-workshop-bottom{
  margin-top:10px ;
  height: calc(100vh - 540px);
  background: #E8EAE9;
}
.mode-workshop-container-top{
  height: calc(100vh - 200px);
  overflow-y:auto;
}
.mode-workshop-container-bottom{
  height: calc(100vh - 200px);
  overflow-y:auto;
}
.model-process-material{
  float: left;
  width: calc(50% - 2.5px);
  height: calc(100vh - 430px);
  background:#0A3C54;
}

</style>
