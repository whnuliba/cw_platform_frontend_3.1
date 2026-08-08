<template>
  <div class="app-container">
   
    <div class="container-body-bottom">
      <el-tabs v-model="activeName1" type="border-card" :before-leave="eqCommpBeforeLeavePlan" @tab-click="tabclick">
        <el-tab-pane label="产品标准" name="part-first">
          <div>
            <component :is="proditemComponents" ref="equipmentMtPlanId"  :equipmentMtPlanId="equipmentMtPlanId" @skiptable="skiptable"> </component>
          </div>
        </el-tab-pane>
        <el-tab-pane label="产品表单" name="part-second">
          <div>
            <component :is="prodTableComponents" ref="equipmentMtPartId" :allbtndisabled="allbtndisabled" :activeName1="activeName1" :equipmentMtPartId="equipmentMtPartId"> </component>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import elDragDialog from '@/directive/el-drag-dialog'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import proditem from './components/proditem'
import prodTable from './components/prodTable'
import i18n from '@/lang';
export default {
    name: 'equipmentCheckPlan-list',
    components: { Pagination, proditem,prodTable },
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
      allbtndisabled: false,
      proditemComponents: 'proditem',
      prodTableComponents: 'prodTable',
      equipmentMtPlanId: '',
      equipmentMtPartId: '',
      activeName: 'first',
      activeName1: 'part-first'
    }
    return _initdata
  },
  created() {
  },
  methods: {
    tabclick(val){
      if(val._props.name == 'part-second'){
        this.allbtndisabled = true
      }else{
        this.allbtndisabled = false
      }
    },
    
    eqCommpBeforeLeavePlan(_activeName, oldActiveName) {
      this.activeName1 = _activeName
    },
    skiptable(){
      this.activeName1 = 'part-second'
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

  .filter-item {
    margin-left: 3px;
  }

  .container-body-top {
    max-height: 50%;
    overflow-y: auto;
  }

  .container-body-bottom {
    width: 100%;
    height: 80%;
    overflow-y: auto;
  }
  ::v-deep.el-tabs--border-card > .el-tabs__content{
    padding-bottom: 0px;
  }
</style>
