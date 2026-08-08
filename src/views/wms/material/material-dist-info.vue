<template>
  <div class="app-container">
       <div class="container-body-top">
         <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane label="物料配送单" name="material-dist">
                    <div>
                    <component :is="materialDistComponents" ref="materialDistId" :materialDistId="materialDistId"  @changeMaterialDistId = "myChangeMaterialDistId"> </component >
                    </div>    
                  </el-tab-pane>
              </el-tabs>
       </div>
       <div class="container-body-bottom" style="min-height:300px">
           <el-tabs v-model="activeName1" type="border-card" :before-leave="materialOperBeforeLeave">
                <el-tab-pane label="配送单明细" name="material-item">
                    <div>
                    <component :is="materialDistItemComponents" ref="materialDistItemId" :materialDistItemId="materialDistItemId" > </component >
                    </div>    
                  </el-tab-pane>
             <el-tab-pane label="拣货完成" v-if="is_edit" name="material-item-save">
             </el-tab-pane>
             <el-tab-pane label="配送完成" name="material-item-complete">
             </el-tab-pane>
              </el-tabs>
       </div>
  </div>

</template>

<script>
import waves from "@/directive/waves"; // waves directive
import elDragDialog from "@/directive/el-drag-dialog";
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import materialDist from './components/material-dist'
import materialDistItem from './components/material-dist-item'
import i18n from '@/lang';
export default {
  name: 'materialDistItemInfo',
  components: { Pagination,materialDist,materialDistItem},
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
      materialDistComponents:"materialDist",
      materialDistItemComponents:"materialDistItem",
      materialDistId:"",
      materialDistItemId:"",
      is_edit:false,
      activeName:"material-dist",
      activeName1:'material-item'
    }
    return _initdata
  },


  created() {
  
  },
  methods: {
    myChangeMaterialDistId(row){
         this.materialDistItemId = row.id||''
         this.is_edit = row.status==100?true:false
         this.$refs.materialDistItemId.materialDistItem( row)
    },
    materialOperBeforeLeave(activeName, oldActiveName){
        if(activeName=='material-item-save'){
          this.$refs.materialDistItemId.updateActualQty()
        }
       return false
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
