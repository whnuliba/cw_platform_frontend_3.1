<template>
    <div class="standard-items">
      <div class="filter-container">
       <el-button type="primary" class="filter-item" @click="addStandardItem" :disabled="disabled">
          {{ $t("common.btn.add") }}
       </el-button>
       <el-button type="primary" class="filter-item" @click="batchSaveItem" >
          批量保存
       </el-button>
       <Table
       :tableData="tableData"
       :btnData="btnData"
       :tableColumns="tableColumns"
       :standardUseState="standardUseState"
       @deleItem="deleItem"
       @saveItem="saveItem"
       @selectionChange="selectionChange"
       />
      </div>
    </div>
  </template>
  
  <script>
    import waves from "@/directive/waves"; // waves directive
    import elDragDialog from "@/directive/el-drag-dialog";
    import Pagination from '@/components/Pagination' 
    import Table from "@/components/TableCommon/addAndEdit";
    export default {
      name: 'taskEsb',
      components: { Pagination, Table },
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
          standardUseState: '暂存',
          disabled: true,
          tableData: [],
          batchTableData:[],
          rowId: '',
          btnData:[
            {key: 'save', btnName: '保存',btndisabled:false},
            {key: 'dele', btnName: '删除',btndisabled:false}
          ],
          tableColumns: [
            { key: 'itemName', title: '项目名称',  align: "left" ,query: true, type: 'input', set: true,  },
            { key: 'checkWay', title: '检验方式',  align: 'left', query: true, type: 'input', set: true  },
            { key: 'presetValue', title: '预置值',  align: 'left', type: 'input', set: true ,editReadonly:true  },
            { key: 'contrastValue', title: '对比度值', edit: 'text', align: 'center', type: 'input', set: true},
            { key: 'limitUp', title: '上限值',  align: 'center',type: 'input', set: true},
            { key: 'limitDown', title: '下限值', edit: 'text',  align: 'left' ,type: 'input', set: true },
            { key: 'refCode', title: '变量', edit: 'text',  align: 'left' ,type: 'input', set: true },
            { key: 'hasEl', title: '是否存在公式',  align: 'center',type: 'switch',set: true },
            { key: 'elString', title: '计算公式', edit: 'text', align: 'left',  type: 'input',set: true },
            { key: 'remark', title: '备注', edit: 'text', align: 'left',  type: 'input',set: true },
            // { key: 'spc', title: 'SPC', edit: 'text', align: 'left', width: 150, type: 'input',set: true },
            { key: 'ctl', title: '操作', edit: 'text', align: 'center', fixed:'right'},
          ],
          defaultForm: {
            row: {},
            params: {}
          }
        }
        Object.assign(_initdata.defaultForm.params, this.initData(_initdata.tableColumns))
        return _initdata
      },
      watch:{
        standardUseState: {
          handler: function(val, oldVal) {
            if (val === '暂存') {
              this.disabled = false;
            } else {
              this.disabled = true;
            }
          },
          immediate: true,
          deep: true
        }
      },
      created() {
        this.$bus.$on('prodToProdItem', (res,row) => {
          this.tableData = res;
          this.rowId = row.id;
          this.standardUseState= row.status;
        })
        // this.$bus.$on('addProdBtnUse', (res) => {
        //   this.disabled = false;
        // })
      },
      methods: {       
        initData(arr) {
          let args = {}
          arr.map(c => {
            if (c.set) {
              args[c.field] = null
            }
          })
          return args
        },
        // 标准项数据初始化
        tableDatafresh(id) {
          const _data = { url: '/qc-prod-standard/guest/getItems', params: {data: id} }
                  this.$store.dispatch('fmsCommon/actionProductPost', _data)
                    .then(data => {
                      this.tableData = data
                    }).catch(err => {
                      console.error(err)
                  })
        },

        addStandardItem() {
          this.tableData.push(
            {
              hedId: this.rowId,
              itemName:'', checkWay:'', presetValue:'',
              contrastValue:'', limitUp:'',  limitDown:'',
              hasEl:'', elString:"", remark: '', spc:'',
            }
          )
        },
        // 批量保存
        batchSaveItem(){
          if (this.batchTableData.length) {
            for(let i=1;i<=this.batchTableData.length;i++){
              this.batchTableData[i-1].itemIndex = i
            }
            const _data = { url: '/qc-prod-standard/createProdItems', params: {data: this.batchTableData} }
                  this.$store.dispatch('fmsCommon/actionProductPost', _data)
                    .then(data => {
                      if (data.success) {
                           this.$message({
                              type: 'success',
                              message: '批量保存成功'
                            });
                      this.tableDatafresh(this.rowId)
                      }
                    }).catch(err => {
                      console.error(err)
                  })
          } else {
                    this.$message({
                          type: 'warning',
                          message: '请先勾选再保存'
                        });
          }
          
        },
        saveItem(scope,key) {
          let params = {hedId: this.rowId,itemIndex:scope.$index+1, ...scope.row};
          const _data = { url: '/qc-prod-standard/createProdItem', params: {data: params} }
                  this.$store.dispatch('fmsCommon/actionProductPost', _data)
                    .then(data => {
                      if(data.success) {
                        this.$message({
                        type: 'success',
                        message: '保存成功'
                      });
                      this.tableDatafresh(this.rowId)
                      }

                    }).catch(err => {
                      console.error(err)
                  })
        },
        deleItem(scope,key) {
          this.$confirm(`确定删除这条数据吗?`, '提示信息', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              const _data = { url: '/qc-prod-standard/deleteProdItem', params: {data: scope.row.id} }
                    this.$store.dispatch('fmsCommon/actionProductPost', _data)
                          .then(data => {
                            this.$message({
                              type: 'success',
                              message: '删除成功'
                            });
                            this.tableDatafresh(this.rowId)
                          }).catch(err => {
                            console.error(err)
                        })
       
            })
        },
        // 点击复选框时触发的事件
        selectionChange(val) {
          this.batchTableData = val;
        },
      }
    }
  </script>
  
  <style scoped>
    .standard-items {
        /* width: 50%; */
        height:50%;
        padding: 5px;
        margin:5px;
        border: 1px solid #ccc;
        box-shadow: 3px 3px 3px #ccc;
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
  