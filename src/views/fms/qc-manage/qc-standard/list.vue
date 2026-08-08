<template>
    <div class="app-container">
      <!-- <div>
        <el-button @click="fileClick">文件</el-button>
      </div> -->
      <div class="main-qc">
        <QcStandard/>
        <StandardItems/>
      </div>
      <!-- <FileView ref="fileView"/> -->
    </div>
  </template>
  
  <script>
    import QcStandard from "./components/qc_standard";
    import StandardItems from "./components/standard_items";
    // import FileView from "@/components/FileView/index";
    import waves from "@/directive/waves"; // waves directive
    import elDragDialog from "@/directive/el-drag-dialog";
    import Pagination from '@/components/Pagination' 
    // import i18n from '@/lang';
    export default {
      name: 'taskEsb',
      components: { Pagination, QcStandard, StandardItems },
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
          defaultForm: {
            row: {},
            params: {
              id: '',
              useState: 1,
            }
          }
        }
        Object.assign(_initdata.defaultForm.params)
        return _initdata
      },
      created() {
      },
      methods: {       
        // fileClick(file,type) {
        //   this.$refs.fileView.init();
        // },
      }
    }
  </script>
  
  <style lang="less" scoped>
    .main-qc {
      // display: flex;
      height:800px;
    }
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
  </style>
  