/*
 * @CreatAuthor: 宋丹峰
 * @UpdateAuthor: /.../
 * @Description: 质量管理--产品标准
 */
<template>
    <div class="app-container">
      <div class="prod-qc">
        <ProdStandard/>
        <ProdItems/>
      </div>
    </div>
  </template>
  
  <script>
    import ProdStandard from "./components/prod_standard";
    import ProdItems from "./components/prod_items";
    import waves from "@/directive/waves"; // waves directive
    import Pagination from '@/components/Pagination' 
    // import i18n from '@/lang';
    export default {
      name: 'qcProdStandard',
      components: { Pagination, ProdStandard, ProdItems },
      directives: { waves },
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
            params: {}
          }
        }
        Object.assign(_initdata.defaultForm.params)
        return _initdata
      },
      created() {
      },
      methods: {       
        
      }
    }
  </script>
  
  <style lang="less" scoped>
    .prod-qc {
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
  