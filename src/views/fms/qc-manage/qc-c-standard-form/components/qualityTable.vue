<template>
    <div>
      <div class="filter-container">
       <el-button type="primary" class="filter-item" @click="batchSaveItem" :disabled="finishdisabled">
          批量保存
       </el-button>
       <el-button type="primary" class="filter-item" @click="calcItems" :disabled="disabled">
          计算
       </el-button>
       <el-button type="primary" class="filter-item" @click="finish" :disabled="finishdisabled">
          完成
       </el-button>
       <Table
       :tableData="tableData"
       :btnData="btnData"
       :tableColumns="tableColumns"
       :initSelect="initSelect"
       :rules="rules"
       :rowHeight="rowHeight"
       @saveItem="saveItem"
       @selectionChange="selectionChange"
       :proheight="510"
       @keyupNative="keyup"
       />
       <el-dialog v-el-drag-dialog :title="'完成'" :visible.sync="dialogfinsh" width="40%">
        <el-form ref="form" :model="finshobj" label-width="35%">

        <el-form-item label="检验结论:">
          <el-select  v-model="finshobj.checkConclusion" placeholder="请选择" style="width: 180px"   class="filter-item" >
          <el-option
          v-for="item in colusiondata"
          :key="item.value"
          :label="item.name"
          :value="item.value">
          </el-option>
        </el-select>
        </el-form-item>
       
        <el-form-item label="描述:">
          <el-input v-model="finshobj.udf1" placeholder="描述" style="width: 180px"   class="filter-item"></el-input>
        </el-form-item>

       
        </el-form>
        <div v-if="exceedingData.length" class="exceedform">
          <div class="exceedformtitle">超标数据:</div>
          <div class="exceedformcontent" v-for="item in exceedingData">{{item.itemName+':'+item.checkValue}}</div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="finishsave">确 定</el-button>
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
      props:{
        activeName1:String,
        allbtndisabled:Boolean,
      },
      watch: {
        activeName1(val){
          if(val == 'part-first'){
            this.tableData = []
          }
        },
        allbtndisabled(val){
          if(val == true){
            this.disabled = val
            this.finishdisabled = val
          }
        }, 
        dialogfinsh(val){
          if(val == false){
            for(let p in this.finshobj){
              if(this.finshobj.hasOwnProperty(p)){
                this.finshobj[p]=''
              }
            }
          }
        },
      },
      data() {
        const _initdata = {
          rowHeight: '10px !important',
          disabled: true,
          dialogfinsh: false,
          finishdisabled: true,
          rowData:undefined,
          tableData: [],
          exceedingData: [],
          batchTableData:[],
          formId: '',
          finshobj:{
            checkConclusion:'',
            udf1:'',
            id:'',
          },
          colusiondata:[
            {name:'合格',value:'OK'},
            {name:'异常',value:'NG'},
            {name:'作废',value:'SCRAP'},
          ],
          btnData:[
            {key: 'save', btnName: '保存', btndisabled: false}
          ],
          initSelect:{
            checkValue:[]
          },
          tableColumns: [
            { key: 'itemIndex', title: '行号',width:80, edit: 'text', align: 'center', type: 'text', set: true,width:80},
            { key: 'itemName', title: '引用检验项', minWidth: 130, align: "left" ,query: true,  set: true,width:140},
            { key: 'presetValue', title: '预置值', minWidth: 130, align: "left" ,query: true,  set: true,width:110},
            { key: 'contrastValue', title: '单位', minWidth: 130, align: "left" ,query: true,  set: true,width:80},
            { key: 'limitUp', title: '上限值',  align: 'center',width:100,type: 'text', set: true,width:90},
            { key: 'limitDown',title:'下限值',edit:'text',width:100,align: 'left',type:'text',set:true,width:90},
            // { key: 'deviceNo', title: '干系机台', minWidth: 130, align: "left" ,query: true,  set: true,  },
            { key: 'checkValue', title: '检出值',disabled:false, minWidth: 200, align: 'left', query: true, type: 'specil', set: true  },
            // { key: 'checkTime', title: '检验时间', minWidth: 130, align: 'left',  set: true ,editReadonly:true  },
            // { key: 'refCode', title: '变量', minWidth: 130, align: 'center',  set: true ,editReadonly:true  },
            { key: 'remark', title: '备注', edit: 'text', align: 'left', minWidth: 200, type: 'input',set: true },
            { key: 'ctl', title: '操作', edit: 'text', align: 'left',width:80},
            // { key: 'formId', title: '表单Id', edit: 'text', align: 'left', width: 200, type: 'input',set: true },
          ],
          rules: {
            refCode:[
            { required: true, message: '请输入refCode', trigger: 'blur' },
            ]
          },
          defaultForm: {
            row: {},
            params: {}
          }
        }
        Object.assign(_initdata.defaultForm.params, this.initData(_initdata.tableColumns))
        return _initdata
      },
      created() {
        this.$bus.$on('qcToQcItem', (res,row) => {
          this.rowData = row
          if(row.status == '2'){
            // console.log(row.status);
            this.finishdisabled = true
            this.btnData.forEach(item=>{
              if(item.btnName == '保存') item.btndisabled = true
            })
          }else{
            this.finishdisabled = false
            this.btnData.forEach(item=>{
              if(item.btnName == '保存') item.btndisabled = false
            })

          }
          this.tableData = res.data;
          this.formId = res.data.length ? res.data[0].formId : '';
          this.tableData.forEach(item=>{
            if(item.valSet){
               //console.log(item.valSet);
              item.valSet = item.valSet?.replace(/[\r\n]/g, "").split(';').map(val=>{
                return {name:val,value:val}
              })

            }else{
              item.valSet = ''
            }
          })
        })
        this.$bus.$on('calcBtnUse', (res) => {
          this.disabled = false;
        })
      },
      methods: {
      keyup(ev, row, col) {
        this.keyupTo(ev, row, col, this.tableData.length, 2)
      },
      keyupTo(ev, row, col, rowCount, colCount) {
        // 替代 switch 的优雅写法
        const actions = {
          'ArrowUp': () => {
            row--
            if (row < 0) row = rowCount - 1
          },
          'ArrowDown': () => {
            row++
            if (row >= rowCount) row = 0;
          },
          //'ArrowLeft': () => {
          //  col--
          //  if (col < 1) col = colCount;
          //},
          //'ArrowRight': () => {
          //  col++
          //  if (col > colCount) col = 1
          //},
        }
        let action = actions[ev.key];
        if (action !== undefined) {
          action.call()
          // 用 nextTick 避免 input 还没渲染出来
          this.$nextTick(() => {
            document.getElementById('inputRef'+row+col).focus()
          })
        }
      },
 

        tableDatafresh(id) {
          

          const _data = { url: '/qc-check-form/getItems', params: {data: this.rowData.id} }
          this.$store.dispatch('fmsCommon/actionProductPost', _data)
            .then(data => {
              this.tableData = data.data
            }).catch(err => {
              console.error(err)
          })
        },

        finishsave(){
          if(this.rowData.id){
            const _data = { url: '/qc-check-form/completeCheck ', params: {data: this.finshobj} }
                  this.$store.dispatch('fmsCommon/actionProductPost', _data)
                    .then(data => {
                      this.tableData = data
                      this.finshobj = {
                        checkConclusion:'',
                        udf1:'',
                        id:'',
                      }
                        this.$message({
                        type: 'success',
                        message: '完成'
                      });
                      this.dialogfinsh = false
                      
                      
                    }).catch(err => {
                      console.error(err)
                  })
          }
        },
        finish(){
          this.exceedingData = this.tableData.filter(item=>{
            if(Number(item.limitUp)&&Number(item.limitDown)&&Number(item.checkValue)&&(Number(item.checkValue)<Number(item.limitDown)||Number(item.checkValue)>Number(item.limitUp))){
              return item  
            }
          })
          this.dialogfinsh = true
          this.finshobj.id = this.rowData.id
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
        // tableDatafresh(id) {
        //   const _data = { url: '/qc-standard/guest/getItems', params: {data: id} }
        //           this.$store.dispatch('fmsCommon/actionProductPost', _data)
        //             .then(data => {
        //               this.tableData = data
        //             }).catch(err => {
        //               console.error(err)
        //           })
        // },

        // 单个保存
        saveItem(scope,key) {
          let params = scope.row;
          delete params.valSet
          if(!params.checkValue && scope.row.isRequire === 'Y'){
            this.$message({
              type: 'error',
              message: '检出值必填'
            })}
            else{

            const _data = { url: '/qc-check-form/saveFormItems', params: {data: params} }
                  this.$store.dispatch('fmsCommon/actionProductPost', _data)
                    .then(data => {
                      if(data.success) {
                        this.tableDatafresh(this.rowData.id)

                        this.$message({
                        type: 'success',
                        message: '保存成功'
                      });
                      }

                    }).catch(err => {
                      console.error(err)
                  })
          }

        },

        // 批量保存
        batchSaveItem(){
          if (this.batchTableData.length) {
            let savebollen = this.batchTableData.some(item =>{
               if (!item.checkValue && item.isRequire === 'Y' ) {return true}
            })
            if(savebollen){
              this.$message({
                type: 'error',
                message: '检出值必填'
              })
            }else{
              this.batchTableData.forEach(item=>{
                delete item.valSet
              })
              const _data = { url: '/qc-check-form/batchSaveFormItems', params: {data: this.batchTableData} }
                  this.$store.dispatch('fmsCommon/actionProductPost', _data)
                    .then(data => {
                      if (data.success) {
                        this.tableDatafresh(this.rowData.id)
                           this.$message({
                              type: 'success',
                              message: '批量保存成功'
                            });
                      }
                    }).catch(err => {
                      console.error(err)
                  })
            }
            
          } else {
                  this.$message({
                          type: 'warning',
                          message: '请先勾选再保存'
                        });
          }
          
        },
        calcItems() {
          // this.$refs.tableComponent.calcFunc();
          let tt = true;
          this.tableData.forEach(item => {
            if (!item.refCode) {
              tt = false;
              return
            }
          })

          if (tt) {
              const _data = { url: '/qc-check-form/calcCheckValue', params: {data: this.formId} }
                  this.$store.dispatch('fmsCommon/actionProductPost', _data)
                    .then(data => {
                      if (data.success) {
                           this.$message({
                              type: 'success',
                              message: '项目计算成功'
                            });
                            this.tableDatafresh()
                      }
                    }).catch(err => {
                      console.error(err)
                  })
          } else {
            this.$message({
                type: 'warning',
                message: '没有变量名称不能计算!'
              })
          }
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
    .exceedform{
      padding-left: 27%;
    }
    .exceedformtitle{
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .exceedformcontent{
      font-size: 14px;
    }
  </style>
  