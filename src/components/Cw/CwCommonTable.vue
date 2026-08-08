<template>
    <div>
        <CwTable 
        :bizCode="bizCode" 
        :dataLoading="dataLoading"
        :data="data"
        :page="page" 
        :boxSelect="true"
        :multipleSelect="false"
        @loadData="loadData" 
        @handleAdd="handleAdd"
        @handleDelete="handleDelete"
        @handleReset="handleReset"
        @handleRowDbClick="handleRowDbClick"
        @handleRowClick="handleRowClick"
        @init="init" />
    </div>
  </template>
  <script>
    import i18n from "@/lang";
    import CwTable from "@/components/Cw/CwTable"
    import SqlSearchIndex from "@/components/searchCommon/sqlSearchIndex"

    export default {
      name: 'CwCommonView',
      components: {CwTable, SqlSearchIndex },
      directives: {},
      filters: {
        statusFilter(status) {
          const statusMap = {
            0: '未启用',
            1: '启用'
          }
          return statusMap[status]
        }
      },
      props: {
        bizCode: {
          type: String,
          default: ()=>{
             return ''
          }
        },
        bindParams: {
          type: Object,
          default: ()=>{
             return {}
          }
        },
        bindMethods:{
          type: Object,
          default: ()=>{
             return {}
          }
        },
      },
      data() {
        const _initdata = {
           data: [],
           count: 0,
           dataLoading: false,
           page:{
                showPage:true,
                total: 0,
                listQuery: {
                  current: 1,
                  pageSize: 15
             },
            queryParams: {
               requestData: {
                tableName: '',
                orderBy: '',
                columns: [],
                sqlWhere: [],
              }
          },
          },
          cols:[],
          initScript:undefined,
        }
        //Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
        return _initdata
      },
      created() {
      },
     mounted(){
       
     },
      methods: {
        loadDataBefore(data){
          if(this.bindMethods.loadDataBefore && typeof this.bindMethods.loadDataBefore ==='function')
           {
            this.bindMethods.loadDataBefore(data)
           }
        },
        loadDataAfter(data){
          if(this.bindMethods.loadDataAfter && typeof this.bindMethods.loadDataAfter ==='function')
           {
            this.bindMethods.loadDataAfter(data)
           }
        },
        handleRowDbClick(row, column, event){
           this.bindParams.row = row
           if(this.bindMethods.handleRowDbClick && typeof this.bindMethods.handleRowDbClick ==='function')
           {
            this.bindMethods.handleRowDbClick(row, column, event)
           }
        },
        handleRowClick(row, column, event){
          this.bindParams.row = row
          if(this.bindMethods.handleRowClick && typeof this.bindMethods.handleRowClick ==='function')
           {
            this.bindMethods.handleRowClick(row, column, event)
           }
        },
        handleReset(){},
        handleDelete(row){
          console.log(row)
          this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
          const _data = { url: this.initScript.url.deleteUri, params: { data: row.ID } }
          this.$store.dispatch('fmsCommon/actionPost', _data)
            .then(data => {
              //this.list.splice($index, 1)
              this.loadData();
              this.$message({
                type: 'success',
                message: 'delete success!'
              });
            }).catch(err => {
              console.error(err)
            })
         }).catch(() => {
          this.$message({
            type: 'info',
            message: 'cancel delete'
          });
         })
        },
        handleSave(data,success,fail,complete){
        let _data = { url: this.initScript.url.addUri, params: { data: { data: data } } }
        this.$store.dispatch('fmsCommon/actionPost', _data)
              .then(data => {
                this.$message({
                  type: 'success',
                  message: 'change success!=>' + data
                });
                if(success && typeof success==='function'){
                   success(data)
                }
              }).catch(err => {     
                if(fail && typeof fail==='function'){
                  fail(err)
                }
              }).finally(() => {
                if(complete && typeof complete==='function'){
                  complete()
                }
              })
        },
        handleUpdate(data, success, fail, complete){
          const _data = {
          url: this.initScript.url.editUri, params: {
            data: data
          }
          }
          this.$store.dispatch('fmsCommon/actionPost', _data)
              .then(data => {
                this.$message({
                  type: 'success',
                  message: 'change success!=>' + data
                });
                if(success && typeof success==='function'){
                   success(data)
                }
              }).catch(err => {
                if(fail && typeof fail==='function'){
                  fail(err)
                }
              }).finally(() => {
                if(complete && typeof complete==='function'){
                  complete()
                }      
            })
        },
        handleAdd(type, data, success, fail, complete){
          if(type==='add')
          {
            this.handleSave(data, success, fail, complete)
          }
          if(type==='update')
          {
            this.handleUpdate(data, success, fail, complete)
          }
        },
        init(script){
       
            this.initScript = script
            this.cols = this.initScript.cols
        },
        // loadData(){
        //     Object.assign(this.page.queryParams, this.page.listQuery)
        //     const _data = { url: '/data-base/queryPage', params: this.page.queryParams }
        //     this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        //     .then(data => {
        //         this.data = data.data
        //         this.page.total = data.total
        //         this.dataLoading = false
        //     }).catch(err => {
        //         console.error(err)
        //     })
        // }
        loadList(param,callback,error,complete){
            const _data = { url: this.initScript.url.queryUri, params:param}
            this.$store.dispatch('fmsCommon/actionPost', _data)
            .then(data => {
               if(callback && typeof callback==='function')
               {
                callback(data)
                this.loadDataAfter(data)
               }
            }).catch(err => {
                if(error && typeof error==='function')
                 { error(err)
                   this.loadDataAfter()
                 }
            }).finally(()=>{
              if(complete && typeof complete==='function')
                 {
                  complete()
                  this.loadDataAfter()
                }
            })
        },
        loadData(param,callback,error,complete){
            Object.assign(this.page.queryParams, this.page.listQuery)
            let params = param || this.page.queryParams
            let that = this
            this.loadDataBefore(param)
            if(param){
              this.loadList(params,callback,error,complete)
              return
            }
            this.loadList(params,(data)=>{
              that.data = data.data
              that.page.total = data.total
              that.dataLoading = false
            },(error)=>{
               console.error(error)
            })
          }
      }
    }
  </script>
  
  <style lang="less" scoped>
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
  
    ::v-deep .el-input-group__append {
      width: 18px;
      border: 1px solid #0370AA;
      border-left: none;
      background-color: white;
    }
  
    .input-with-select {}
  
    .dropdownicon {
      display: inline-block;
      height: 28px;
      border: 1px solid #0370AA;
      border-left: none;
      border-radius: 0 3px 3px 0;
      line-height: 28px;
      margin-right: 10px;
      padding: 0 10px;
    }
  
    ::v-deep .el-form--inline .el-form-item {
      margin-right: 0;
    }
  
    ::v-deep .el-input__inner:hover {
      border: 1px solid #0370AA;
    }
  
    .dropdownicon:hover {
      /* border: 1px solid #DCDFE6; */
      /* border-left: none; */
      cursor: pointer;
    }
  </style>