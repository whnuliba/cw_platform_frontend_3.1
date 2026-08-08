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
       :rowHeight="rowHeight"
       :initSelect="valueSelect"
       :standardUseState="standardUseState"
       @deleItem="deleItem"
       @saveItem="saveItem"
       @selectionChange="selectionChange"
       />
      <el-dialog v-el-drag-dialog :title="'编辑'" :visible.sync="dialogedit" width="40%">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          :autofocus="true"
          ref="addressplateRef"
          v-model="textarea">
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="textareasave">确 定</el-button>
        </span>
        <!-- <el-button type="primary" class="filter-item" @click="textareasave" >
          保存
       </el-button> -->
      </el-dialog>
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
          valueSelect:{
            valueType: [],
            valType: [
              {name:'select',value:'select'},
              {name:'textarea',value:'textarea'},
              {name:'date',value:'date'},
            ],
          },
          standardUseState: '',
          textarea: '',
          rowHeight: '30px !important',
          disabled: true,
          dialogedit: false,
          dialogeditrow:{},
          tableData: [],
          batchTableData:[],
          rowId: '',
          btnData:[
            {key: 'save', btnName: '保存',btndisabled:false},
            {key: 'dele', btnName: '删除',btndisabled:false}
          ],
          tableColumns: [
            { key: 'itemName', title: '项目名称', minWidth: 130, align: "left" ,query: true, type: 'input', set: true,  },
            { key: 'checkWay', title: '检验方式', minWidth: 130, align: 'left', query: true, type: 'input', set: true  },
            { key: 'valueType', title: '值类型', minWidth: 130, align: 'left', query: true, type: 'select', set: true  },
            // { key: 'presetValue', title: '预置值', minWidth: 130, align: 'left', type: 'input', set: true ,editReadonly:true  },
            // { key: 'contrastValue', title: '对比度值', edit: 'text', align: 'center', width: 130 ,type: 'input', set: true},
            { key: 'valType', title: '输入类型', edit: 'text', align: 'center', type: 'select', set: true},
            { key: 'valSet', title: '值内容', edit: 'text', align: 'center', type: 'finput', set: true},
            { key: 'isRequire', title: '是否必填',  align: 'center',type: 'engswitch',set: true },

            { key: 'limitUp', title: '上限值', minWidth: 180, align: 'center',type: 'input', set: true},
            { key: 'limitDown', title: '下限值', edit: 'text', minWidth: 100, align: 'left' ,type: 'input', set: true },
            { key: 'refCode', title: '变量', minWidth: 100, align: 'center',type: 'input',set: true },
            { key: 'hasEl', title: '是否存在公式', minWidth: 100, align: 'center',type: 'switch',set: true },
            { key: 'elString', title: '计算公式', edit: 'text', align: 'left', minWidth: 100, type: 'input',set: true, },
            { key: 'remark', title: '备注', edit: 'text', align: 'left', minWidth: 200, type: 'input',set: true },
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
      created() {
        this.$bus.$on('focuschangemit', (ta,scope) => {
            this.dialogeditrow = {}
            this.$set(this.dialogeditrow, 'scope',scope)
            this.$set(this.dialogeditrow, 'ta',ta)

            console.log(this.dialogeditrow)
            if(this.dialogeditrow.ta.key === 'valSet'){
              console.log('valSet');
              this.textarea = scope.row.valSet
            }
            if(this.dialogeditrow.ta.key === 'elString'){
              console.log('elString');
              this.textarea = scope.row.elString
            }
            this.dialogedit = true
            // this.$nextTick(() => {
            //   console.log(this.$refs);

            //   this.$refs.addressplateRef.focus()
            // })
        })
        // this.$bus.$on('changeSeleemit', (val,scope) => {
        //   if(val=='select'){
        //     this.dialogedit = true
        //     this.dialogeditrow = scope
        //   }
        // })
        this.$bus.$on('comToComItem', (res,row) => {
          this.tableData = res;
          
          this.rowId = row.id;
          this.standardUseState = row.useState;
        })
        // this.$bus.$on('addBtnUse', (res) => { })
        this.selectData();
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
      methods: { 
        textareasave(){
          console.log(this.batchTableData);
          if(this.dialogeditrow.ta.key === 'valSet'){
            this.$set(this.tableData[this.dialogeditrow.scope.$index], 'valSet',this.textarea)

              // this.tableData[this.dialogeditrow.scope.$index].valSet = this.textarea

            }
          if(this.dialogeditrow.ta.key === 'elString'){
            this.$set(this.tableData[this.dialogeditrow.scope.$index], 'elString',this.textarea)

            // this.tableData[this.dialogeditrow.scope.$index].elString = this.textarea

          }
          // this.tableData[this.dialogeditrow.$index].valSet = this.textarea
          this.textarea = ''
          this.dialogedit = false
        },
        selectData() {
         
          const _data = { url: '/prod-constant/guest/value-types', params: {} }
                  this.$store.dispatch('fmsCommon/actionProductPost', _data)
                    .then(data => {
                      this.valueSelect.valueType = data;
                    }).catch(err => {
                      console.error(err)
                  })
        },     
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
          const _data = { url: '/qc-standard/guest/getItems', params: {data: id} }
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
            console.log(this.batchTableData);
            
            const _data = { url: '/qc-standard/createItems', params: {data: this.batchTableData} }
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
          const _data = { url: '/qc-standard/createItem', params: {data: params} }
                  this.$store.dispatch('fmsCommon/actionProductPost', _data)
                    .then(data => {
                      if(data.success) {
                        this.$message({
                        type: 'success',
                        message: '保存成功'
                      });
                      }
                      this.tableDatafresh(this.rowId)
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
              console.log(scope.row)
              const _data = { url: '/qc-standard/deleteItem', params: {data: scope.row.id} }
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

        selectionChange(val) {
          this.batchTableData = val;
        },
      }
    }
  </script>
  
  <style scoped lang="less">
    .standard-items {
        // width: 50%;
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
  