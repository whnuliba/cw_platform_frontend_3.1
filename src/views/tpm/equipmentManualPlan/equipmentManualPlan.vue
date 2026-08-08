<template>
  <div class="app-container">
    <div class="model-factory">
      <div class="model-factory-top">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="设备编号" name="first">
            <div class="mode-container">
              <component :is="equipmentDeviceComponents"  @equipmentMtRowClick = "myChangeequipmentMtItem" @getRadioVal="radioValChanged"> </component>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="model-workshop">
      <div class="model-workshop-top">
        <el-tabs v-model="activeName1" type="border-card">
          <el-tab-pane label="部件编号" name="Line-Material">
            <div class="mode-container">
              <component :is="equipmentPartComponents" ref="equipmentMtId" :equipmentMtId="equipmentMtId" :equipmentSource="equipmentSource" > </component>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import waves from '@/directive/waves' // waves directive
  import elDragDialog from '@/directive/el-drag-dialog'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import equipmentDevice from './components/equipmentDevice'
  import equipmentPart from './components/equipmentPart'

  import i18n from '@/lang';
  export default {
    name: 'equipmentManualPlan',
    components: { Pagination, equipmentDevice, equipmentPart },
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
        equipmentDeviceComponents: 'equipmentDevice',
        equipmentPartComponents: 'equipmentPart',
        equipmentMtId: '',
        equipmentSource:'保养',
        activeName: 'first',
        activeName1: 'Line-Material',
      }
      return _initdata
    },
    created() {

    },
    methods: {
      myChangeequipmentMtItem(row) {
        this.equipmentMtId = row.deviceNo || ''
      },
      radioValChanged(source) {
      this.equipmentSource = source
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

  .filter-item {
    margin-left: 3px;
  }

  .container-body-top {
    max-height: 50%;
    overflow-y: auto;
  }

  .container-body-bottom {
    width: 100%;
    margin-top: 10px;
    max-height: 50%;
    overflow-y: auto;
  }

  .model-factory {
    position: relative;
    width: 450px;
    height: calc(100vh - 120px);
    float: left;
    background: #D4D7D7;
  }

  .model-workshop {
    width: calc(100% - 490px);
    height: calc(100vh - 120px);
    float: left;
    margin-left: 5px;
  }

  .mode-container {
    height: calc(100vh - 190px);
    overflow-y: auto;
  }

  .model-factory-top {
    height: calc(100vh - 190px);
    background: #E8EAE9;
  }

  .model-workshop-top {
    height: calc(100vh - 120px);
    background: #E8EAE9;
  }
  .mode-workshop-container-top {
    height: calc(100vh - 120px);
    overflow-y: auto;
  }


  .model-process-material {
    float: left;
    width: calc(50% - 2.5px);
    height: calc(100vh - 430px);
    background: #0A3C54;
  }
</style>
