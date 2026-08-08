{
 page:{
   showPage:true,
   listQuery: {
      current: 1,
      pageSize: 15
   } 
 },
 url:{
    deleteUri:'/cw-pms-app/pms_base/deleteById',
    editUri:'/cw-pms-app/pms_base/updateById',  
    addUri:'/cw-pms-app/pms_base/createBaseComponent',  
    queryUri:'/cw-pms-app/pms_base/queryPage', 
    batchAddUri:'/cw-pms-app/pms_base/batchCreateBaseComponent',
    fileUpload:'/cw-pms-app/pms_base/uploadFile',
    fileDownload:'/cw-pms-app/pms_base/downloadFile',
    removeFile:'/cw-pms-app/pms_base/removeFile',
 },  
 customToolBar:{
           toolBarStyle:{backgroundColor:'#F3F2F2'},
           show:true,
           showFilter:true,
           showSelectField:true,  
           showExport:true,
           columnSelectFilter:true,
           showUpload:true,
           showFileUpload:true,
           //excelExportPerm:'123',  
             
           buttons:[
               {text:'查询',icon:'el-icon-search',permCode:'supplier_query',background:'',size:'mini',hideText:true,callback:function(e,self){
                   self.fieldFormQuery()
                },
                style:{
               
                }
               },
              {text:'重置',icon:'el-icon-refresh-left',background:'',hideText:true,size:'mini',callback:function(e,self){
                   self.reset()
                }},
              {text:'增加',icon:'el-icon-plus',background:'',permCode:'supplier_add',size:'mini',hideText:true,callback:function(e,self){
                   self.add()
                }},
              {text:'编辑',icon:'el-icon-edit',background:'',size:'mini',hideText:true,callback:function(e,self){
                self.edit(self.boxSelectValue[0])
                }},
              {text:'删除',icon:'el-icon-delete',background:'',size:'mini',hideText:true,callback:function(e,self){
                  self.handleDelete(self.boxSelectValue[0])
                }},
           ]
        }, 
 cols: [
            { field: 'ALIAS_NAME', title: '文档名称', minWidth: 300, align: "left", queryType: 'file', set: true, require: true, query: true, hide: false,disabled:false,
             downloadClick:function(e,fn,item,column){
              
              this.downloadFile(fn,item,column)
              return    
             },
             viewClick: function(e,fn,item,a,column){
              //console.log('文件预览',e,fn,item,a)
               this.viewFile(fn,item,a,column)
               return
              
             },
             removeClick:function(e,fn,item,column){
               console.log(1,e,fn,item)
               this.removeFile(fn,item,column)
              return
              
             }
            
            },
            { field: 'ENABLE_STATE', title: '启用状态', minWidth: 100, align: "center", queryType: 'input',set: true, require: true, query: false, hide: false},
            { field: 'CREATE_TIME', title: '创建时间', minWidth: 100, align: "center", queryType: 'daterange', set: true, require: true, query: false, hide: false},
            { field: 'ALIAS_NO', title: '编码', minWidth: 100, align: "center", queryType: 'input',set: true, require: true, query: false, hide: false },
            { field: 'CERTIFICATION_PATH', title: '资质文档', minWidth: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: false },
            { field: 'AUPPLIER_ADDRESS', title: '地址', align: 'center', queryType: 'input', set: true, require: true, query: false, hide: false },
            { field: 'SUPPLIER_CODE', title: '供应商编码', align: 'center', queryType: 'input', set: true, require: true, query: false, hide: false },
            { field: 'SUPPLIER_NAME', title: '供应商名称', minWidth: 100, align: "center", queryType: 'input', set: false, require: false, query: false, hide: false },
            { field: 'PHOEN', title: '电话', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: false, hide: false },
            { field: 'EMAIL', title: '邮件', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: false, hide: false },
               { field: 'TEST1', title: 'TEST1', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: false, hide: false }, 


         
   { field: 'STATUS', title: '状态', minWidth: 100, align: "center", queryType: 'switch', set: false, require: true, query: false, hide: false },
          ],
toolColumns:[
                 {field: 'OPER', title: '操作', width: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: true,showFilter:false,showField:false,
                     buttons:[
                              {text:'删除',icon:'el-icon-delete',background:'',permCode:'fms_task_external_add',size:'mini',callback: function(e,self,row,selected){ self.handleDelete(row)}}
                          ]
                       }
                     ],
formConfig: {
			inline: true,
      fileLimit: 1,
      fileSizeLimit: 10, //MB,
  	  file_row_record:'ID',
			file_row_index_only:'ID'
	},
}