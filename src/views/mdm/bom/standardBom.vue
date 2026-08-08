<template>
  <div class="app-container">
       <div class="container-body-top">
         <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane label="标准物料信息" name="first">
                    <div>
                    <component :is="bomItemComponents" ref="bomItemId" :bomItemId="bomItemId"  @changeBomItem = "myChangeBomItem"> </component >
                    </div>    
                  </el-tab-pane>
              </el-tabs>
       </div>
       <div class="container-body-bottom">
           <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane label="替换件信息" name="first">
                    <div>
                    <component :is="bomItemSubComponents" ref="bomItemSubId" :bomItemSubId="bomItemSubId" > </component >
                    </div>    
                  </el-tab-pane>
              </el-tabs>
       </div>
  </div>

</template>

<script>
import waves from "@/directive/waves"; // waves directive
import elDragDialog from "@/directive/el-drag-dialog";
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import BomItem from './components/BomItem'
import BomItemSub from './components/BomItemSub'

import i18n from '@/lang';
export default {
  name: 'standardBom',
  components: { Pagination,BomItem,BomItemSub},
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
    const  _initdata ={
      bomItemComponents:"BomItem",
      bomItemSubComponents:"BomItemSub",
      bomItemId:"",
      bomItemSubId:"",
      activeName:"first"
    }
    return _initdata
  },
  created() {
  
  },
  methods: {
    myChangeBomItem(row){
         this.bomItemSubId = row.id||''
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
    max-height: 600px;
    overflow-y:auto;
}

.container-body-bottom{
    width: 100%;
    margin-top:10px ;
    max-height: 200px;
    overflow-y:auto;
}


</style>
