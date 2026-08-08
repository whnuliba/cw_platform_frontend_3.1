<template>
    <div class=""  v-bind="$attrs" >
        <!-- <SqlSearchIndex 
            :tableColumns="cols" 
            :btnShow="false" 
        />  -->
        <!-- @query="query" -->
        <CwTable 
        :bizCode="component.attribute.bizCode" 
        :dataLoading="dataLoading"
        :data="data"
        :vueContext="vueContext"
        :page="page" 
        :pageScript="pageScript"
        :boxSelect="true"
        ref="CwTable"
        :multipleSelect="false"
        @loadData="loadData" 
        @loadDataQuery="loadDataQuery" 
        @uploadData="uploadData"
        @handleAdd="handleAdd"
        @handleDelete="handleDelete"
        @handleReset="handleReset"
        @handleRemovedFile="handleRemoveFile"
        @handleDownloadFile="handleDownloadFile"
        @handleFileUpload="handleFileUpload"
        @handleRowDbClick	="(v1,v2,v3,v4)=>{handlerEvent('row-dbclick',v1,v2,v3,v4)}"
        @handleRowClick	="(v1,v2,v3,v4)=>{handlerEvent('row-click',v1,v2,v3,v4)}"
        @chartShow="(v1,v2,v3,v4)=>{handlerEvent('chart-show',v1,v2,v3,v4)}"
        @viewPdf="(v1,v2,v3,v4)=>{handlerEvent('view-pdf',v1,v2,v3,v4)}"
        @operaOne="(v1,v2,v3,v4)=>{handlerEvent('opera-one',v1,v2,v3,v4)}"  
        @operaTwo="(v1,v2,v3,v4)=>{handlerEvent('opera-two',v1,v2,v3,v4)}"
        @enterRowsFunc="(v1,v2,v3,v4) => {handlerEvent('row-enter',v1,v2,v3,v4)}"
        @leaveRowsFunc="(v1,v2,v3,v4) => {handlerEvent('row-leave',v1,v2,v3,v4)}"
        @init="init" />
        <!-- @fileView="fileView1" <CwFileView  ref="docuView" :viewTitle="viewTitle" :url="url"/> -->
    </div>
  </template>
  <script>
    import i18n from "@/lang";
    import CwTable from "@/components/Cw/CwTable"
    import SqlSearchIndex from "@/components/searchCommon/sqlSearchIndex"
    import CwFileView from "./CwFileView"
    import {dispatchEvent} from "../utils/eventUtils"
    import { getToken } from '@/utils/auth'
    import axios from 'axios'
    export default {
      name: 'CwCtrlList',
      components: {CwTable, SqlSearchIndex,CwFileView },
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
        componentModalObj: {
          type: Object,
          default: () => {
            return {}
          }
        },
        vueContext: {
          type: Object,
          default: () => {
            return {}
          }
        },
        fieldName: {
          type: String,
          default: ''
        },
        selfAttribute:{

        },  
        myStyle: {
          type: Object,
          default: () => {
            return { color:'black' }
          }
        },
        itemVal: {
          type: String,
          default: ''
        },
        compId: {
          type: String,
          default: ''
        },
        component:{
          type: Object,
          default: () =>{}
        },
        bindData:{
          type: Object,
          default: () =>{}
        },
      },
      data() {
        const _initdata = {
           methods:{},
          // vueContext:{},
           dataObtainedByEditor:{},
           viewTitle: '',
           bizCode:'',
           pageScript: undefined,
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
          url: '',
        }
        //Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
        return _initdata
      },
     created() {
      if(this.component.elementCode){
        try{
              const tableScript = eval("("+this.component.elementCode+")")
              this.pageScript=tableScript               
            }catch(error){
              this.pageScript= undefined
            }
      }
     },
     watch:{
       'component.attribute.bizCode':{
        handler: function (newVal, oldVal) {
            if(newVal!==oldVal)
              this.$refs.CwTable.initRoleField()
          },
          deep: true,
       },
       'component.elementCode': {
        handler: function (newVal, oldVal) {
        if (newVal) {
            try{
              const tableScript = eval("("+newVal+")")
              this.pageScript=tableScript               
            }catch(error){
              this.pageScript= undefined
            }
        }
      },
      deep: true
    },
     },
     mounted(){},
      methods: {
        getTotableData(data){
          this.data = data
        },
        
      async fileView1(tag,fn,row,data) { // 这里的参数要按照handlerEvent里面的参数排序来
         let url = this.initScript.url.fileDownload
       let response  = await new Promise((resolve,reject) => axios.post(this.initScript.url.fileDownload, {data:JSON.stringify(data)}, {
            responseType: 'blob',
            headers: {Authorization: 'Bearer ' + getToken() },
            }).then((res) => {
                //let bs = new Blob([res.data],{ type: 'application/pdf'})
                // let fileUrl = window.URL.createObjectURL(bs);
                // this.url = fileUrl;
                //this.viewTitle = fName
                // this.$refs.docuView.init(fn.split('.')[1],aa)
                resolve(res.data);
            })
            );
            return response; 
        }, 
        
        comText() {
          return '控制列表'
        },
        ificationType() {
          return {
            classification: '布局容器组件',
            isCanvasview: false,
          }
        },
        handlerEvent(tag,v1,v2,v3,v4){
        let args = []
        if(v1)  args.push(v1)
        if(v2)  args.push(v2)
        if(v3)  args.push(v3)
        if(v4)  args.push(v4)
        //console.log(this,this.$refs,this.$refs.myrefTree)
        this.$nextTick(()=>{
          const ele = this.$el//$refs.myrefTree.$el

        if(ele){
          dispatchEvent(ele,tag,args)
        }
        })
      },
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
        getAttributeCols() {
        return [
          { field: 'bizCode', title: '业务编码', queryType: 'input', require: false, query: true, hide: false },
           ]
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


        handleRemoveFile(type,fileData,success,fail, complete){

          this.$confirm(i18n.t("common.tip_info.delete_info"), i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
          const _dataUpload = { url: this.initScript.url.removeFile, params: {data:JSON.stringify(fileData)}};
            this.$store.dispatch('fmsCommon/actionPost', _dataUpload)
                .then(data => {
                    this.$message({
                        type: 'success',
                        message: '文件删除成功'
                    })
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
         }).catch(() => {
          this.$message({
            type: 'info',
            message: 'cancel delete'
          });
         })

        },

        setDownloadHeader(dowLoadFileName, result) {
                  let blob = new Blob([result]);
                  const fileName = dowLoadFileName;
                  // 判断浏览器
                  var brower = '';
                  if (navigator.userAgent.indexOf('Edge') > -1) {
                      brower = 'Edge';
                  }
                  if ('download' in document.createElement('a')) {
                      // 非IE下载

                      if (brower == 'Edge') {
                          navigator.msSaveBlob(blob, fileName);
                          return;
                      }
                      const elink = document.createElement('a');
                      elink.download = fileName;
                      elink.style.display = 'none';
                      elink.href = window.URL.createObjectURL(blob);
                      document.body.appendChild(elink);
                      elink.click();
                      URL.revokeObjectURL(elink.href);
                      // 释放URL 对象
                      document.body.removeChild(elink);
                  } else {
                      // IE10+下载
                      navigator.msSaveBlob(blob, fileName);
                  }
               },
        handleDownloadFile(type,fileData,success,fail, complete){
          // const _dataUpload = { url: this.initScript.url.removeFile, params: {data:JSON.stringify(fileData)},
          //   options:{
          //     responseType: 'blob',
          //   }};
            axios.post(this.initScript.url.fileDownload, {data:JSON.stringify(fileData)}, {
            responseType: 'blob',
            headers: {Authorization: 'Bearer ' + getToken() },
            }).then((res) => {
                this.setDownloadHeader(fileData.fileName,res.data)
            }).catch(
              err => {
                    if(fail && typeof fail==='function'){
                      fail(err)
                    }
                  }

            ).finally(() => {
                    if(complete && typeof complete==='function'){
                      complete()
                    }      
                });

        },
        handleFileUpload(type,fileData,success,fail, complete)  {
            const _dataUpload = { url: this.initScript.url.fileUpload, params: fileData};
            this.$store.dispatch('fmsCommon/actionPost', _dataUpload)
                .then(data => {
                    this.$message({
                        type: 'success',
                        message: '文件上传成功'
                    })
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
         } ,
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
        pageChange(url,params) {
          const _data = { url: url, params: params }
            this.$store.dispatch('fmsCommon/actionProductPost', _data)
              .then(data => {
                this.data  = data.data;
                this.page.total = data.total;

              }).catch(err => {
              this.$message({
                type: 'error',
                message: '获取任务项目失败' + JSON.stringify(err)
              })
            })

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
        requestData(_data,callback,error,complete){

          const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$store.dispatch('fmsCommon/actionPost', _data)
            .then(data => {
              loading.close()
               if(callback && typeof callback==='function')
                {
                  if(this.initScript && this.initScript.callback && this.initScript.callback.querySuccessCallback&& typeof this.initScript.callback.querySuccessCallback==='function'){
                      let res = this.initScript.callback.querySuccessCallback.call(this,_data)
                      if(res && !res.success){
                          return; 
                      }
                    }
                  callback(data)
                }
            }).catch(err => {
              loading.close()
                if(error && typeof error==='function')
                 { 
                  if(this.initScript && this.initScript.callback && this.initScript.callback.queryErrorCallback&& typeof this.initScript.callback.queryErrorCallback==='function'){
                      let res = this.initScript.callback.queryErrorCallback.call(this,error)
                      if(res && !res.success){
                          return; 
                      }
                    }
                  error(err)
                }

            }).finally(()=>{
              loading.close()
              if(complete && typeof complete==='function')
               { 
                if(this.initScript && this.initScript.callback && this.initScript.callback.queryCompleteCallback&& typeof this.initScript.callback.queryCompleteCallback==='function'){
                      let res = this.initScript.callback.queryCompleteCallback.call(this)
                      if(res && !res.success){
                          return; 
                      }
               }
               loading.close()
                complete()}
            })
        },
        loadList(param,callback,error,complete){
            const _data = { url: this.initScript.url.queryUri, params:param}

            //查询触发前需要触发的事件
            let that = this;
            if(this.initScript && this.initScript.callback && this.initScript.callback.queryBeforeCallback&& typeof this.initScript.callback.queryBeforeCallback==='function'){
              let flag = true;
              let res = this.initScript.callback.queryBeforeCallback.call(this,_data,(data)=>{
                    if(data===undefined)
                       data=_data
                       flag = false
                     that.requestData(data,callback,error,complete)
               })
               if(res && !res.success){
                   return; 
               }
            }else{
               this.requestData(_data,callback,error,complete)
            }
        },

        uploadData(param,callback,error,complete){
          if(!param || (param && param.length==0)){
            this.$message({
                type: 'error',
                message: '上传的数据不能为空'
                
              })
            return
          }

       this.$confirm("您确定需要批量上传数据吗？", i18n.t("common.tip_info.tips"), {
          confirmButtonText: i18n.t("common.btn.ok"),
          cancelButtonText: i18n.t("common.btn.cancel"),
          type: 'warning'
        }).then(() => {
          const _data = { url: this.initScript.url.batchAddUri, params:{data:{data:param}}}
            this.$store.dispatch('fmsCommon/actionPost', _data)
            .then(data => {
               if(callback && typeof callback==='function')
                  callback(data)
                this.loadData()
            }).catch(err => {
                if(error && typeof error==='function')
                  error(err)
            }).finally(()=>{
              if(complete && typeof complete==='function')
                 complete()
            })
         }).catch(() => {
          this.$message({
            type: 'info',
            message: 'cancel upload'
          });
         })

        },
        // 表格初始化或其他页面跳转过来时的回调
        loadData(param,callback,error,complete){
            let routeJumpParams = this.$route.params, initJsonScript = this.initScript;
            //console.log(routeJumpParams,initJsonScript)
            Object.assign(this.page.queryParams, this.page.listQuery)
            if (routeJumpParams.isRouterJump) {  // 跳转页面获取sql参数
                let requestField = initJsonScript.params.sqlWhereSearchField,sqlWhereArr = [];
                requestField.forEach(item => {
                  sqlWhereArr.push({
                    column: item.column,
                    condition: item.condition,
                    value: routeJumpParams.row[item.value],
                  })
                })
                this.page.queryParams.requestData.sqlWhere = sqlWhereArr

            } else if (initJsonScript.routerJumpParams && routeJumpParams[initJsonScript.routerJumpParams.routerJumpAttrVal]) {  // 跳转特定模块时的sql参数
                this.page.queryParams.requestData.sqlWhere = initJsonScript.routerJumpParams.searchParams
              }  
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
          },
          getStyleCols() {
            return [
              { field: 'width', title: 'width', queryType: 'input', defaultValue: '100%', unit: 'px' },
              { field: 'height', title: 'height', queryType: 'input', defaultValue: 'auto', unit: 'px' },
              { field: 'fontSize', title: '字体大小', queryType: 'input', defaultValue: '16px', unit: 'px' },
              { field: 'borderColor', title: '边框颜色', queryType: 'colorpicker', defaultValue: '#127310', },
              { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', defaultValue: '#fff', },
            ]
          },
        // 点击搜索按钮或翻页时的回调
        loadDataQuery(param,callback,error,complete) {
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