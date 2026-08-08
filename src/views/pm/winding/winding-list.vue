<template>
  <div class="app-container">
    <div class="model-factory">
      <div class="model-factory-top">
        <el-tabs v-model="activeName1" type="border-card">
          <el-tab-pane label="工单" name="first">
            <div class="mode-container">
              <component :is="orderComponents" ref="order"   @rowClick = "myChangeorderNo"  > </component >
            </div>
          </el-tab-pane>
          <el-tab-pane label="卷绕工单" name="second">
            <div class="mode-workshop-container-top">
              <component :is="windingComponents" ref="windingorder" :activeName1="activeName1" @rowClick ="myChangeId"> </component >
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane label="小卷" name="third">
            <div class="mode-workshop-container-bottom">
              <component :is="windingSvolumeComponents" ref="windingSvolume" :activeName1="activeName1"   > </component >
            </div>
          </el-tab-pane> -->
        </el-tabs>
      </div>
    </div>
    <!-- <div class="model-workshop">
      <div class="model-workshop-top">
        <el-tabs v-model="activeName1" type="border-card" >
          
        </el-tabs>
      </div>
      <div class="model-workshop-bottom" >
        <el-tabs v-model="activeName2" type="border-card" >
          
        </el-tabs>
      </div>
    </div> -->
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import order from './components/order'
import windingorder from './components/windingorder'
import windingSvolume from './components/windingSvolume'

import i18n from '@/lang' ;
export default {
  name: 'winding-list',
  components: { Pagination, order, windingorder, windingSvolume },
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
      orderComponents: 'order',
      windingComponents: 'windingorder',
      windingSvolumeComponents: 'windingSvolume',
      activeName1: 'first',
      // activeName1: 'WindingComponents',
      // activeName2: 'WindingSvolumeComponents'
    }
    return _initdata
  },
  created() {

  },
  methods: {
    myChangeorderNo(row) {
      this.$refs.windingorder.reloadData(row.orderNo)
      this.activeName1 = 'second'
    },
    myChangeId(row) {
      this.$refs.windingSvolume.reloadData(row.id)
      this.activeName1 = 'third'

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
  /* width: 785px; */
  width: 100%;
  height: calc(100vh - 120px);
  float: left;
  background: #D4D7D7;
}
.model-workshop{
  width: calc(100% - 800px);
  height: calc(100vh - 120px);
  float: left;
  margin-left:5px ;
}
.mode-container{
  height: calc(100vh - 200px);
  overflow-y:auto;
}
.model-factory-top{
  height:calc(100vh - 120px);
  background: #E8EAE9;
}
/* .model-workshop-top{
  height: 400px;
  background: #E8EAE9;
} */
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
