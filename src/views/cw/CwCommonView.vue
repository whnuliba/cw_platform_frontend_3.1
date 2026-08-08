<template>
    <div class="app-container">
        <!-- <SqlSearchIndex 
            :tableColumns="cols" 
            :btnShow="false" 
        />  -->
        <!-- @query="query" -->
        <CwTable :bizCode="bizCode" 
        :dataLoading="dataLoading"
        :data="data"
        :page="page" 
        :boxSelect="true"
        :multipleSelect="false"
        @loadData="loadData" 
        @handleAdd="handleAdd"
        @handleDelete="handleDelete"
        @handleReset="handleReset"
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

      },
      data() {
        const _initdata = {
           bizCode:'',
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
          const fullpath =this.$route.fullPath
          let cp = fullpath
          if (cp && cp != null && cp.indexOf("\\") != -1)
                cp = cp.replace("\\", "/");
          let apArr = cp.split("/");
          if (!apArr.length || apArr.length<2) 
          {
            this.$message({
              type:"error",
              message: '路由错误'
            })
              return
          }     
         this.bizCode = apArr[apArr.length-1];
      },
     mounted(){
       
     },
      methods: {
        handleReset(){},
        handleDelete(row){
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
                  callback(data)
            }).catch(err => {
                if(error && typeof error==='function')
                  error(err)
            }).finally(()=>{
              if(complete && typeof complete==='function')
                 complete()
            })
        },
        loadData(param,callback,error,complete){
            Object.assign(this.page.queryParams, this.page.listQuery)
            let params = param || this.page.queryParams
            let that = this
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
  
    //::v-deep .el-input__inner {
    //  padding: 0 10px 0 5px;
    //}
  
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