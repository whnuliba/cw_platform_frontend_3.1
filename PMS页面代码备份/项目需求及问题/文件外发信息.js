{
 page:{
   showPage:true,
   listQuery: {
      current: 1,
      pageSize: 15
   } 
 },
 url:{
    deleteUri:'/cw-pms-app/pms-project-release-file/deleteById',
    editUri:'/cw-pms-app/pms-project-release-file/updateById',  
    addUri:'/cw-pms-app/pms-project-release-file/createBaseComponent',  
    queryUri:'/cw-pms-app/pms-project-release-file/queryPage', 
	batchAddUri:'/cw-pms-app/pms-project-release-file/batchCreateBaseComponent',
    fileUpload:'/cw-pms-app/pms-project-release-file/uploadFile',
    fileDownload:'/cw-pms-app/pms-project-release-file/downloadFile',
    removeFile:'/cw-pms-app/pms-project-release-file/removeFile',      
 },  
 customToolBar:{
           show:true,
           showFilter:true,
           showSelectField:true,  
           showExport:true,
           columnSelectFilter:true,
           showUpload:true,
           buttons:[
		        {text:'文件信息',icon:'el-icon-folder-opened',permCode:undefined,background:'',size:'mini',hideText:false,callback:function(e,self){
                   if(self.boxSelectValue===undefined || self.boxSelectValue.length==0){
                         self.$message({
                             type: 'error',
                             message: '没有选择申请单'
                        });  
                      return
                   }
				   this.currentAttachmentRow['attachmentVisible']=self.boxSelectValue[0]
				   if(!this.checkHasFile("attachmentVisible"))
				   {
					   this.$message.error("没有附件信息")
					   return
				   }
                   this.dialogAttacmentVisible['attachmentVisible']=true
                },
                style:{
                float: 'left'
                }
               },
			   {text:'审批状态',icon:'el-icon-document',background:'',size:'mini',hideText:false,callback:function(e,self){
                     if(self.boxSelectValue===undefined || self.boxSelectValue.length==0){
                         self.$message({
                             type: 'error',
                             message: '没有选择申请单'
                        });  
			
                      return
                   }
				  let form = self.boxSelectValue[0]
						this.$router.push({
							path:'/cw/CwPageView/pms/out_file_approval',
							query:{id:form.ID,sourceType:'FORM'}

					})
                },
                style:{
                  float: 'left'
                }
               }, 
               {text:'查询',icon:'el-icon-search',background:'',size:'mini',hideText:false,callback:function(e,self){
                   self.fieldFormQuery()
                },
                style:{
                  float: 'left'
                }
               },
              {text:'重置',icon:'el-icon-refresh-left',background:'',hideText:false,size:'mini',callback:function(e,self){
                   self.reset()
                },
                style:{
                  float: 'left'
                }}

           ]
        }, 
		
attachmentModels:[
{
	currentAttachmentRow:{},
	title:'外发附件',
	dialogVisible:'attachmentVisible',
	attachments :[
	       { field: 'FILE_NAME', title: '外发文件信息', minWidth: 200, align: "center", queryType: 'file', set: false, require: false, query: false, hide: false,
             viewShow:function(fn,row,item){
				  let user= this.getCurrentUser()
                  if(user===undefined)
                    return false
                  let username=user.userInfo.username
                  let realname=user.userInfo.realName
                  let id =user.userInfo.id
				  if(row && row.CREATE_USER!==username)
					 return false
				  return true
			 },
         viewClick: function(e,fn,item,column) {
            this.viewFile(e,fn,item,column)
          },
			 removeShow:function(fn,row,item){
				  let user= this.getCurrentUser()
                  if(user===undefined)
                    return false
                  let username=user.userInfo.username
                  let realname=user.userInfo.realName
                  let id =user.userInfo.id
				  if(row  && row.CREATE_USER===username)
					 return true
				  return false
			 },
        removeClick:function(e,fn,item,column){
                   let user= this.getCurrentUser()
                  if(user===undefined)
                    return
                  let username=user.userInfo.username
                  let realname=user.userInfo.realName
                  let id =user.userInfo.id
                  //我创建的文件可以下载也可以查看，指派给我的可以查看，不可以上传，不可以删除
                  if(item && item.CREATE_USER!==username)
                  {
                    
                      this.$message({
                          type: 'error',
                          message: '当前没有权限删除该文件'
                        }); 
                     return
                  }               
               
               this.removeFile(fn,item,column)
              return
              
             },    
			 downloadShow:function(fn,row,item){
				  return true
			 },
			 downloadClick:function(e,fn,item,column){
                 //查看文件是否是我自己的
                  //我创建的文件可以下载也可以查看，指派给我的可以查看，不可以上传，也可以删除
				 let row_record = {...item,ROW_RECORD:'ID',FIELD:'FILE_NAME',ROW_INDEX_ONLY:'ID'}  
                 let data = {fileName:fn,details:row_record}  
                 this.$downloadFile('/cw-pms-app/pms-project-release-file/downloadFile',data)
                 return       
             },
			},
	]
},
],		
		
 cols: [
         { field: 'PROJECT_ID', title: '关联项目', minWidth: 150, align: "center", queryType: 'select-filter',url:'/cw-pms-app/pms_pro/select-filter',
			lazy:true,
			modeValue:'id',
			loadData:(val,item,callback)=>{
				   let op = {url:item.url,params:{data:val}}
				   this.actionPost(op).then((data)=>{
					    let arr =[]
					    if(data && data.length){
							arr = data.map(c=>{
								return {name:c.PROJECT_NAME,code:c.PROJECT_CODE,id:c.ID}
							})
						}
						 if(callback&& typeof callback==='function')
		                     callback.call(this,arr)
				   })
				
			}, 
			onChange(result,form,item){
				form['PROJECT_NO']=result.code
			},
			set: true, require: false, query: true, hide: true },
			{ field: 'PROJECT_NO', title: '关联项目', minWidth: 150, align: "center", queryType: 'input', set: false, require: false, query: false, hide: false},           
			{ field: 'PERMISSION', title: '审批状态',minWidth: 100,  align: 'center', queryType: 'input', set: false, require: false, query: false, hide: false },
            { field: 'EDIT_TIME', title: '编辑时间', minWidth: 100, align: "center", queryType: 'datetime', set: false, require: false, query: false, hide: true},
            { field: 'CREATE_TIME', title: '创建时间', minWidth: 150, align: "center", queryType: 'datetime', set: false, require: false, query: false, hide: false},           
            { field: 'FILE_NAME', title: '文件名',minWidth: 500,  align: 'left', queryType: 'input', set: false, require: false, query: true, hide:false },
  			{ field: 'FILE_TYPE', title: '文件类型',minWidth: 100,  align: 'center', queryType: 'input', set: false, require: false, query: false, hide: true },
 			{ field: 'FILE_PATH', title: '文件路径',minWidth: 100,  align: 'center', queryType: 'input', set: false, require: false, query: false, hide: true },
    		{ field: 'ALIAS_NAME', title: '文件别名',minWidth: 100,  align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true },
            { field: 'EDIT_USER', title: '编辑者',minWidth: 100,  align: 'center', queryType: 'input', set: false, require: false, query: false, hide: false },
            { field: 'FILE_GROUP', title: '文件组',minWidth: 100,  align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true },
            { field: 'CLASS_NAME', title: '文件分类1',minWidth: 100,  align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true },
            { field: 'CLASS_NAME2', title: '文件分类2',minWidth: 150,  align: 'center', queryType: 'input', set: false, require: false, query: false, hide: true },
            { field: 'CLASS_NAME3', title: '文件分类3',minWidth: 150,  align: 'center', queryType: 'input', set: false, require: false, query: false, hide: true },
            { field: 'FILE_SIZE', title: '文件大小',minWidth: 150,  align: 'center', queryType: 'input', set: false, require: false, query: false, hide: true },
            { field: 'CONTENT_TYPE', title: '内容类型',minWidth: 150,  align: 'center', queryType: 'input', set: false, require: false, query: false, hide: false },
            { field: 'OUT_REASON', title: '外发原因',minWidth: 150,  align: 'center', queryType: 'input', set: false, require: false, query: false, hide: false },
            { field: 'FILE_ABSTRACT', title: '文件摘要',minWidth: 150,style:{width:'600px',height:'100px'},  align: 'center', queryType: 'textarea', set: true, require: true, query: false, hide: false },
            { field: 'REMARK', title: '备注',minWidth: 150,  align: 'center',style:{width:'600px',height:'100px'}, queryType: 'textarea', set: true, require: true, query: false, hide: false },
          ],
toolColumns:[
                 {field: 'OPER', title: '操作', width: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: true,showFilter:false,showField:false,
                     buttons:[
                              {text:'删除',icon:'el-icon-delete',background:'',permCode:'pms-project-release-file_delete',size:'mini',callback: function(e,self,row,selected){ self.handleDelete(row)}}
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