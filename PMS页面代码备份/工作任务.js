{
 page:{
   showPage:true,
   listQuery: {
      current: 1,
      pageSize: 15
   } 
 },
 url:{
    deleteUri:'/cw-pms-app/pms-work-task/deleteById',
    editUri:'/cw-pms-app/pms-work-task/updateById',  
    addUri:'/cw-pms-app/pms-work-task/createBaseComponent',  
    queryUri:'/cw-pms-app/pms-work-task/queryPage', 
    batchAddUri:'/cw-pms-app/pms-work-task/batchCreateBaseComponent',
    fileUpload:'/cw-pms-app/pms-work-task/uploadFile',
    fileDownload:'/cw-pms-app/pms-work-task/downloadFile',
    removeFile:'/cw-pms-app/pms-work-task/removeFile',      
 },  
 customToolBar:{
           show:true,
           showFilter:true,
           showSelectField:true,  
           showExport:false,
           columnSelectFilter:true,
           showUpload:false,
           showFileUpload:false,
               
           buttons:[
		           {text:'任务文件',icon:'el-icon-folder-opened',permCode:undefined,background:'',size:'mini',hideText:false,callback:function(e,self){
                   if(self.boxSelectValue===undefined || self.boxSelectValue.length==0){
                         self.$message({
                             type: 'error',
                             message: '没有选择任务'
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
			  {text:'需求附件',icon:'el-icon-folder-opened',permCode:undefined,background:'',size:'mini',hideText:false,callback:function(e,self){
                   if(self.boxSelectValue===undefined || self.boxSelectValue.length==0){
                         self.$message({
                             type: 'error',
                             message: '没有选择任务'
                        });  
                      return
                   }
				   const row =self.boxSelectValue[0]
				   let sqlWhere = []
				   sqlWhere.push({column:'ID',condition:'=',value:row.SOURCE_ID})
				   let params = {pageSize:1,current:1,requestData:{sqlWhere:sqlWhere}}
				   let op = {url:'/cw-pms-app/pms-soft-demand/queryPage',params:params}
                      this.actionPost(op).then((res)=>{
						let {data} = res  
					  if(data===null || data===undefined || data.length===0){
						 this.$message.error("没有找到需求文件")  
						 return
					  }  
                       this.currentAttachmentRow['attachmentDemandVisible']=data[0]
					   if(!this.checkHasFile("attachmentDemandVisible"))
					   {
						   this.$message.error("没有附件信息")
						   return
					   }
					   this.dialogAttacmentVisible['attachmentDemandVisible']=true
					  })

                },
                style:{
                float: 'left'
                }
               },
               {text:'日志',icon:'el-icon-edit-outline',permCode:undefined,background:'',size:'mini',hideText:false,callback:function(e,self){
                   if(self.boxSelectValue===undefined || self.boxSelectValue.length==0){
                         self.$message({
                             type: 'error',
                             message: '没有选择任务'
                        });  
                      return
                   }
				   
				   let row = self.boxSelectValue[0]
			      let user= this.getCurrentUser()
				  if(user===undefined)
					return 
				  let username=user.userInfo.username
				  let realname=user.userInfo.realName
				  let id =user.userInfo.id
					  
					  if(row.TASK_STATE==='RUNNING' && row.COMPLETE_USER_ID!==id ){
						self.$message.error('该任务不是指派给你的，你不可以增加日志！')
					   return
					  }
				   
				   if(row.TASK_STATE!=='RUNNING'){
                      self.$message({
                             type: 'error',
                             message: '当前任务不是执行中，不可增加任务日志'
                        });  
                      return					   
				   }
                   this.formDialogVisibles['workLogDialog']=true
                },
                style:{
                float: 'left'
                }
               },
             
        {text:'日志详情',icon:'el-icon-info',permCode:undefined,background:'',size:'mini',hideText:false,callback:function(e,self){
                   if(self.boxSelectValue===undefined || self.boxSelectValue.length==0){
                         self.$message({
                             type: 'error',
                             message: '没有选择任务'
                        });  
                      return
                   }
				   
				   let row = self.boxSelectValue[0]
			      let user= this.getCurrentUser()
				  if(user===undefined)
					return 
				  let username=user.userInfo.username
				  let realname=user.userInfo.realName
				  let id =user.userInfo.id
					  
					  if(row.TASK_STATE==='RUNNING' && row.COMPLETE_USER_ID!==id ){
						self.$message.error('该任务不是指派给你的，你不能查看日志详情！')
					   return
					  }

				   if(row.TASK_STATE!=='RUNNING' && row.TASK_STATE!=='COMPLETE'){
                      self.$message({
                             type: 'error',
                             message: '当前任务不是执行中或者完成，不可查看日志详情'
                        });  
                      return					   
				   } 
          this.$taskLogDetails(row,'pms_work_task_item');

                },
          style:{  float: 'left' }
       },
            
             
       {text:'完成',icon:'el-icon-success',permCode:undefined,background:'',size:'mini',hideText:false,callback:function(e,self){
                   
                    if(self.boxSelectValue===undefined || self.boxSelectValue.length==0){
                         self.$message({
                             type: 'error',
                             message: '没有选择任务'
                        });  
                      return
                   }
				  let row = self.boxSelectValue[0]
				  let user= this.getCurrentUser()
				  if(user===undefined)
					return 
				  let username=user.userInfo.username
				  let realname=user.userInfo.realName
				  let id =user.userInfo.id
				   if(row.TASK_STATE==='NON_ACTIVE'  ){
						self.$message.error('当前任务未开始，你不可以完成！')
					   return
					}
			    	if(row.TASK_STATE==='RUNNING' && row.COMPLETE_USER_ID!==id ){
						self.$message.error('该任务不是指派给你的，你不可以完成！')
					   return
					  }
				   
				   if(row.TASK_STATE==='RUNNING' && row.TASK_STATE==='ASSIGN'){
					   self.$message.error('当前任务不是执行中也不是指派原任务不可完成！')
					   return
				   }
				   
                   if(row.TASK_STATE==='COMPLETE'){
					   self.$message.error('当前任务已经完成，不可重复完成')
					   return
				   }
             
                   this.formDialogVisibles['completeDialog']=true
                   this.iform['completeDialog'].params.DESCRIPTION=row.DESCRIPTION 
                   this.iform['completeDialog'].params.WORK_CONTENT=row.WORK_CONTENT  
                   this.iform['completeDialog'].params.REMARK =row.REMARK 
				   this.iform['completeDialog'].params.TASK_NO =row.TASK_NO 
                   this.iform['completeDialog'].params.ID =row.ID 

                },
                style:{
                float: 'left'
                }
               },
               {text:'导入',icon:'el-icon-upload2',permCode:undefined,background:'',size:'mini',hideText:false,callback:function(e,self){
                   let row =self.boxSelectValue[0]           
                   self.uploadClick()
                },
                style:{
				   display:'none',
                   float: 'left'
                }
               },
             
               {text:'导出',icon:'el-icon-download',permCode:undefined,background:'',size:'mini',hideText:false,callback:function(e,self){
                   self.exportClick()
                },
                style:{
			    display:'none',		
                float: 'left'
                }
               },
             
               {text:'上传文件',icon:'el-icon-folder',permCode:undefined,background:'',size:'mini',hideText:false,callback:function(e,self){
                   let row =self.boxSelectValue[0]
				   
				   
				   		      let user= this.getCurrentUser()
				  if(user===undefined)
					return 
				  let username=user.userInfo.username
				  let realname=user.userInfo.realName
				  let id =user.userInfo.id
					  
				  if(row.TASK_STATE!=='CREATE' || row.CREATE_USER!==username ){
					self.$message.error('当前任务已经不可以上传文件，可能不是你创建的任务，也可能当前任务已经发起指派！')
				   return
				  }
				   
                   if(row && row.TASK_STATE==='COMPLETE')
                   {
                         self.$message({
                                            type: 'error',
                                            message: '任务已经完成'
                                        });   
                      return
                   }                 
                   self.fileUploadClick()
                },
                style:{
                float: 'left'
                }
               },
             
               {text:'查询',icon:'el-icon-search',permCode:'pms_work_queryPage_task',background:'',size:'mini',hideText:false,callback:function(e,self){
                   self.fieldFormQuery()
                },
                style:{
                float: 'left'
                }
               },
              {text:'重置',icon:'el-icon-refresh-left',background:'',hideText:false,size:'mini',callback:function(e,self){
                   self.reset()
                }, style:{
                float: 'left'
                }},
              {text:'增加',icon:'el-icon-plus',background:'',permCode:'pms-work-task_add',size:'mini',hideText:false,callback:function(e,self){
                   self.add()
                }, style:{
                float: 'left'
                }},
              {text:'编辑',icon:'el-icon-edit',background:'',permCode:'pms-work-task_edit',size:'mini',hideText:false,callback:function(e,self){
                   let row =self.boxSelectValue[0]
                   if(row && row.TASK_STATE==='COMPLETE')
                   {
                         self.$message({
                                            type: 'error',
                                            message: '任务已经完成'
                                        });   
                      return
                   }
				  let user= this.getCurrentUser()
				  if(user===undefined)
					return 
				  let username=user.userInfo.username
				  let realname=user.userInfo.realName
				  let id =user.userInfo.id
					  
				  if(row.TASK_STATE!=='CREATE' || row.CREATE_USER!==username ){
					self.$message.error('当前任务不是创建状态，或可能不是你创建的任务，也可能当前任务已经发起指派！')
				   return
				  }   
                self.edit(self.boxSelectValue[0])
                },
               style:{
                float: 'left'
                }
              },
              {text:'删除',icon:'el-icon-delete',background:'',permCode:'pms-work-task_delete',size:'mini',hideText:false,callback:function(e,self){
                   let row =self.boxSelectValue[0]
                   if(row && row.TASK_STATE!=='CREATE')
                   {
                         self.$message({
                                            type: 'error',
                                            message: '任务不是创建状态'
                                        });   
                      return
                   }
				  let user= this.getCurrentUser()
				  if(user===undefined)
					return 
				  let username=user.userInfo.username
				  let realname=user.userInfo.realName
				  let id =user.userInfo.id
					  
				  if(row.TASK_STATE!=='CREATE' || row.CREATE_USER!==username ){
					self.$message.error('当前任务不是创建状态，或可能不是你创建的任务，也可能当前任务已经发起指派！')
				   return
				  }  				   
                  self.handleDelete(self.boxSelectValue[0])
                },
               style:{
                float: 'left'
                }
              },
           ]
        }, 
          
 formModes:[
   {
       title: '完成任务',
       dialogVisible:'completeDialog',
       dialogShow:false,
       cancelBtnShow:true,
       forms:[
            { field: 'COMPLETE_TIME', title: '完成时间', minWidth: 150, align: "center", queryType: 'datetime', set: true, require: true, query: false, hide: false},
            { field: 'DESCRIPTION', title: '需求信息', minWidth: 100, align: "center", queryType: 'textarea',style:{width:'600px'}, set: true, require: false, query: false, hide: false },
            { field: 'WORK_CONTENT', title: '任务内容', minWidth: 100, align: "center", queryType: 'textarea',style:{width:'600px'}, set: true, require: false, query: false, hide: false },
            { field: 'REMARK', title: '备注', minWidth: 100, align: "center", queryType: 'textarea',style:{width:'600px'}, set: true, require: false, query: false, hide: false },
            { field: 'ATTACHMENT1', title: '附件1', minWidth: 100, align: "center", queryType: 'attachment',style:{width:'600px'}, set: true, require: false, query: false, hide: false,
              fileLimit:10,
			  httpRequest:function(item){
				item.name=item.file.name
			   // this.fileList.push(item)
			   let names = []
			   if(this.iformFile['completeDialog'].fileList &&  this.iformFile['completeDialog'].fileList['ATTACHMENT1']){
				   names = this.iformFile['completeDialog'].fileList['ATTACHMENT1'].map(c=>c.name);
			   }
				if(names.indexOf(item.file.name)==-1)
				{
				  this.iformFile['completeDialog'].fileList['ATTACHMENT1'].push(item)
				}
				 //this.fileData = item.file;
				  
			  },
              onRemove:function(file, fileList){
				   let names = []
					   if(this.iformFile['completeDialog'].fileList &&  this.iformFile['completeDialog'].fileList['ATTACHMENT1']){
						   names = this.iformFile['completeDialog'].fileList['ATTACHMENT1'].map(c=>c.name);
					   }
					if(names.indexOf(file.name)>-1)
					{
					  this.iformFile['completeDialog'].fileList['ATTACHMENT1'].splice(names.indexOf(file.name),0)
					}				  
			  },  
              beforeUpload:function(file){				  
				    const isLtSize = file.size / 1024 / 1024 < 1024*1024*10;
				     if (!isLtSize) {
					  this.$message.error(`文件不能超过 10MB!`);
					  // this.$refs.uploadDel[0].clearFiles()
					  return false
				  }
			  },
		      onExceed:function(files, fileList){ 
				 this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			  }
			},
			  { field: 'ATTACHMENT2', title: '附件2', minWidth: 100, align: "center", queryType: 'attachment',style:{width:'600px'}, set: true, require: false, query: false, hide: false,
              fileLimit:10,
			  httpRequest:function(item){
				item.name=item.file.name
			   // this.fileList.push(item)
				   let names = []
					   if(this.iformFile['completeDialog'].fileList &&  this.iformFile['completeDialog'].fileList['ATTACHMENT2']){
						   names = this.iformFile['completeDialog'].fileList['ATTACHMENT2'].map(c=>c.name);
					   }

				if(names.indexOf(item.file.name)==-1)
				{
				  this.iformFile['completeDialog'].fileList['ATTACHMENT2'].push(item)
				}
				 //this.fileData = item.file;
				  
			  },
              onRemove:function(file, fileList){
					   let names = []
					   if(this.iformFile['completeDialog'].fileList &&  this.iformFile['completeDialog'].fileList['ATTACHMENT2']){
						   names = this.iformFile['completeDialog'].fileList['ATTACHMENT2'].map(c=>c.name);
					   }

					if(names.indexOf(file.name)>-1)
					{
					  this.iformFile['completeDialog'].fileList['ATTACHMENT2'].splice(names.indexOf(file.name),0)
					}				  
			  },  
              beforeUpload:function(file){				  
				    const isLtSize = file.size / 1024 / 1024 < 1024*1024*10;
				     if (!isLtSize) {
					  this.$message.error(`文件不能超过 10MB!`);
					  // this.$refs.uploadDel[0].clearFiles()
					  return false
				  }
			  },
		      onExceed:function(files, fileList){ 
				 this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			  }
			}
       ],
     
      buttons:[
            {text:'确认',hideText:false,icon:'el-icon-success',permCode:undefined,background:'',size:'max',callback:function(e,row,form){
                 let fa = new FormData();
						const data = this.boxSelectValue
						if(data==null || data[0]==null || data.length==0)
						{
						  this.$message({
									  type: 'error',
									  message: '没有选择数据行'
								 })
						  return
						}						
					  let fileModel = 	this.iformFile['completeDialog'].fileList
				      if(fileModel['ATTACHMENT1']){
						let files = fileModel['ATTACHMENT1'].map(c=>c.file);
					    for(let i=0 ;i<files.length;i++){
					    fa.append(`file`,files[i]);
					  }
					  }
					 if(fileModel['ATTACHMENT2']){
						let files = fileModel['ATTACHMENT2'].map(c=>c.file);
					    for(let i=0 ;i<files.length;i++){
					    fa.append(`file1`,files[i]);
					  }
					 }
				      fa.append('data',JSON.stringify(form));  
                      let op = {url:'/cw-pms-app/pms-work-task/complete',params:fa}
                      this.actionPost(op).then((data)=>{
                      this.$message({
                       type: 'success',
                       message: '完成任务成功'
                      });     
					  this.claerFormData(form)
					  this.fieldFormQuery()
					  this.formDialogVisibles['completeDialog']=false


                   })					   
                },
                style:{
               
                }
        },
      ]
   },
   
   
   
     {
       title: '工作日志',
       dialogVisible:'workLogDialog',
       dialogShow:false,
       cancelBtnShow:true,
       forms:[
            { field: 'DEMAND_CODE', title: '需求编码', minWidth: 100, align: "center", queryType: 'input',set: false, require: false, query: true, hide: false },
            { field: 'PROJECT_ID', title: 'PROJECT_ID', minWidth: 120, align: "center", queryType: 'input', set: false, require: false, query: true, hide: true },
            { field: 'TASK_NO', title: '任务号', minWidth: 100, align: "center", queryType: 'input', set: false, require: false, query: false, hide: false },
            { field: 'DESCRIPTION', title: '已完成事项', minWidth: 150, align: "center", queryType: 'textarea',style:{width:'600px'}, charNum:5,set: true, require: false, query: false, hide: false },
            { field: 'WORK_CONTENT', title: '计划事项', minWidth: 150, align: "center", queryType: 'textarea',style:{width:'600px'}, charNum:5, set: true, require: false, query: false, hide: false },
            { field: 'REMARK', title: '备注', minWidth: 150, align: "center", queryType: 'textarea',style:{width:'600px'}, charNum:5, set: true, require: false, query: false, hide: false },
			{ field: 'ATTACHMENT1', title: '附件1', minWidth: 100, align: "center", queryType: 'attachment', set: true, require: false, query: false, hide: false,
              fileLimit:10,
			  httpRequest:function(item){
				item.name=item.file.name
			   // this.fileList.push(item)
				   let names = []
					   if(this.iformFile['completeDialog'].fileList &&  this.iformFile['completeDialog'].fileList['ATTACHMENT1']){
						   names = this.iformFile['completeDialog'].fileList['ATTACHMENT1'].map(c=>c.name);
					   }

				if(names.indexOf(item.file.name)==-1)
				{
				  this.iformFile['workLogDialog'].fileList['ATTACHMENT1'].push(item)
				}
				 //this.fileData = item.file;
				  
			  },
               onRemove:function(file, fileList){
				   let names = []
					   if(this.iformFile['completeDialog'].fileList &&  this.iformFile['completeDialog'].fileList['ATTACHMENT1']){
						   names = this.iformFile['completeDialog'].fileList['ATTACHMENT1'].map(c=>c.name);
					   }

					if(names.indexOf(file.name)>-1)
					{
					  this.iformFile['workLogDialog'].fileList['ATTACHMENT1'].splice(names.indexOf(file.name),0)
					}				  
			  },  
               beforeUpload:function(file){				  
				    const isLtSize = file.size / 1024 / 1024 < 1024*1024*10;
				     if (!isLtSize) {
					  this.$message.error(`文件不能超过 10MB!`);
					  // this.$refs.uploadDel[0].clearFiles()
					  return false
				  }
			   },
		       onExceed:function(files, fileList){ 
				 this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			   },
			},
            { field: 'ATTACHMENT2', title: '附件2', minWidth: 100, align: "center", queryType: 'input', set: false, require: false, query: false, hide: true },
            { field: 'ATTACHMENT3', title: '附件3', minWidth: 100, align: "center", queryType: 'input', set: false, require: false, query: false, hide: true },
    
       ],
     
      buttons:[
            {text:'确认',hideText:false,icon:'el-icon-success',permCode:undefined,background:'',size:'max',callback:function(e,row,form){
                  if(row===undefined || row.length==0){
                         this.$message({
                             type: 'error',
                             message: '没有选择任务'
                        });  
                      return
                   }
                    let taskRow =row[0]  
                    form.TASK_ID=taskRow.ID	 
					form.DEMAND_CODE=taskRow.TASK_NO				
				    let fa = new FormData();
					  let fileModel = 	this.iformFile['workLogDialog'].fileList
				      if(fileModel['ATTACHMENT1']){
						let files = fileModel['ATTACHMENT1'].map(c=>c.file);
					    for(let i=0 ;i<files.length;i++){
					    fa.append(`file`,files[i]);
					  }
				 }
				   fa.append('data',JSON.stringify(form));  
                   
                   let op = {url:'/cw-pms-app/pms-work-task-item/createLog',params:fa}
                   this.actionPost(op).then((data)=>{
                     this.$message({
                       type: 'success',
                       message: '增加日志成功'
                     });     
                   })
                   this.formDialogVisibles['workLogDialog']=false
                   this.claerFormData(form)
                },
                style:{
               
                }
        },
      ]
    }
   
   
   
 ],

attachmentModels:[
{
	currentAttachmentRow:{},
	title:'任务附件',
	dialogVisible:'attachmentVisible',
	attachments :[
	       { field: 'ATTACHMENT1', title: '附件1', minWidth: 200, align: "center", queryType: 'file', set: false, require: false, query: false, hide: false,
             viewShow:function(fn,row,item){
				  let user= this.getCurrentUser()
                  if(user===undefined)
                    return false
                  let username=user.userInfo.username
                  let realname=user.userInfo.realName
                  let id =user.userInfo.id
				  if(row && row.COMPLETE_USER_ID!==id && row.CREATE_USER!==username)
					 return false
				  return true
			 },
         viewClick: function(e,fn,item,column,a) {
            this.viewFile(e,fn,item,column,a)
          },
			 removeShow:function(fn,row,item){
				  let user= this.getCurrentUser()
                  if(user===undefined)
                    return false
                  let username=user.userInfo.username
                  let realname=user.userInfo.realName
                  let id =user.userInfo.id
				  if(row && row.TASK_STATE==='CREATE' && row.CREATE_USER===username)
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
				 let row_record = {...item,ROW_RECORD:'TASK_NO',FIELD:column.field,ROW_INDEX_ONLY:'ID'}  
                 let data = {fileName:fn,details:row_record}  
                 this.$downloadFile('/cw-pms-app/pms-work-task/downloadFile',data)
                 return       
             },
			},
			   { field: 'ATTACHMENT2', title: '附件2', minWidth: 200, align: "center", queryType: 'file', set: false, require: false, query: false, hide: false,
             viewShow:function(fn,row,item){
				  let user= this.getCurrentUser()
                  if(user===undefined)
                    return false
                  let username=user.userInfo.username
                  let realname=user.userInfo.realName
                  let id =user.userInfo.id
				  if(row && row.COMPLETE_USER_ID!==id && row.CREATE_USER!==username)
					 return false
				  return true
			 },
             viewClick: function(e,fn,item,column,a) {
            this.viewFile(e,fn,item,column,a)
          },
			 removeShow:function(fn,row,item){
				  let user= this.getCurrentUser()
                  if(user===undefined)
                    return false
                  let username=user.userInfo.username
                  let realname=user.userInfo.realName
                  let id =user.userInfo.id
				  if(row && row.TASK_STATE==='CREATE' && row.CREATE_USER===username)
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
				 let row_record = {...item,ROW_RECORD:'TASK_NO',FIELD:column.field,ROW_INDEX_ONLY:'ID'}  
                 let data = {fileName:fn,details:row_record}  
                 this.$downloadFile('/cw-pms-app/pms-work-task/downloadFile',data)
                 return       
             },
			},
			 { field: 'FILE_NAME', title: '项目文件',minWidth: 100,  align: 'center', queryType: 'file', set: false, require: true, query: true, hide: false,            
             viewShow:function(fn,row,item){
				  let user= this.getCurrentUser()
                  if(user===undefined)
                    return false
                  let username=user.userInfo.username
                  let realname=user.userInfo.realName
                  let id =user.userInfo.id
				  if(row && row.COMPLETE_USER_ID!==id && row.CREATE_USER!==username)
					 return false
				  return true
			 },
       viewClick: function(e,fn,item,column,a) {
            this.viewFile(e,fn,item,column,a)
          },
			 removeShow:function(fn,row,item){
				  let user= this.getCurrentUser()
                  if(user===undefined)
                    return false
                  let username=user.userInfo.username
                  let realname=user.userInfo.realName
                  let id =user.userInfo.id
				  if(row && row.TASK_STATE==='CREATE' && row.CREATE_USER===username)
					 return true
				  return false
			 },
			 downloadShow:function(fn,row,item){
				  return true
			 },
			 downloadClick:function(e,fn,item,column){
                 //查看文件是否是我自己的
                  //我创建的文件可以下载也可以查看，指派给我的可以查看，不可以上传，也可以删除
   
				 let row_record = {...item,ROW_RECORD:'ID',FIELD:column.field,ROW_INDEX_ONLY:'ID'}  
                 let data = {fileName:fn,details:row_record}  
                 this.$downloadFile('/cw-pms-app/pms-work-task/downloadFile',data)
                 return       
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
              
             } },
	]
},
{
	currentAttachmentRow:{},
	title:'需求附件',
	dialogVisible:'attachmentDemandVisible',
	attachments :[
	       { field: 'ATTACHMENT1', title: '附件1', minWidth: 200, align: "center", queryType: 'file', set: false, require: false, query: false, hide: false,
             viewShow:function(fn,row,item){
				  let user= this.getCurrentUser()
                  if(user===undefined)
                    return false
                  let username=user.userInfo.username
                  let realname=user.userInfo.realName
                  let id =user.userInfo.id
				  if(row && row.COMPLETE_USER_ID!==id && row.CREATE_USER!==username)
					 return false
				  return true
			 },
          viewClick: function(e,fn,item,column,a) {
            this.viewFile(e,fn,item,column,a)
          },
			 removeShow:function(fn,row,item){
				  let user= this.getCurrentUser()
                  if(user===undefined)
                    return false
                  let username=user.userInfo.username
                  let realname=user.userInfo.realName
                  let id =user.userInfo.id
				  if(row && row.TASK_STATE==='CREATE' && row.CREATE_USER===username)
					 return true
				  return false
			 },
			 downloadShow:function(fn,row,item){
				  return true
			 },
		     downloadClick:function(e,fn,item,column){
                 //查看文件是否是我自己的
                  //我创建的文件可以下载也可以查看，指派给我的可以查看，不可以上传，也可以删除
				 let row_record = {...item,ROW_RECORD:'ID',FIELD:column.field,ROW_INDEX_ONLY:'ID'}  
                 let data = {fileName:fn,details:row_record}  
                 this.$downloadFile('/cw-pms-app/pms-soft-demand/downloadFile',data)
                 return       
             },
			},
			 { field: 'FILE_NAME', title: '项目文件',minWidth: 100,  align: 'center', queryType: 'file', set: false, require: true, query: true, hide: false,            
             viewShow:function(fn,row,item){
				  let user= this.getCurrentUser()
                  if(user===undefined)
                    return false
                  let username=user.userInfo.username
                  let realname=user.userInfo.realName
                  let id =user.userInfo.id
				  if(row && row.COMPLETE_USER_ID!==id && row.CREATE_USER!==username)
					 return false
				  return true
			 },
             viewClick: function(e,fn,item,column,a) {
            this.viewFile(e,fn,item,column,a)
          },
			 removeShow:function(fn,row,item){
				  return false
			 },
			 downloadShow:function(fn,row,item){
				  let user= this.getCurrentUser()
                  if(user===undefined)
                    return false
                  let username=user.userInfo.username
                  let realname=user.userInfo.realName
                  let id =user.userInfo.id
				  return true
			 },
			 downloadClick:function(e,fn,item,column){
              //查看文件是否是我自己的
                  let user= this.getCurrentUser()
                  if(user===undefined)
                    return
                  let username=user.userInfo.username
                  let realname=user.userInfo.realName
                  let id =user.userInfo.id
                  //我创建的文件可以下载也可以查看，指派给我的可以查看，不可以上传，也可以删除	  
				 let row_record = {...item,ROW_RECORD:'ID',FIELD:column.field,ROW_INDEX_ONLY:'ID'}  
                 let data = {fileName:fn,details:row_record}  
                 this.$downloadFile('/cw-pms-app/pms-soft-demand/downloadFile',data)
                 return    
             }},
	]
}
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
				form['PROJECT_CODE']=result.code
			},
			set: true, require: false, query: true, hide: true },
			{ field: 'PROJECT_CODE', title: '关联项目', minWidth: 150, align: "center", queryType: 'input', set: false, require: false, query: false, hide: false},
      		{ field: 'TASK_TYPE', title: '任务类型', minWidth: 100,align: 'center', queryType: 'select', selUri:'/cw-pms-app/app/constant/work-task-types',TASK_TYPE:['name','value'], set: true, require: true, query: false, hide: false },

           // { field: 'DEMAND_CODE', title: '需求编码', minWidth: 100, align: "center", queryType: 'input',set: false, require: false, query: false, hide: true },
           // { field: 'PROJECT_ID', title: 'PROJECT_ID', minWidth: 120, align: "center", queryType: 'input', set: false, require: false, query: true, hide: true },
            { field: 'CREATE_TIME', title: '创建时间', minWidth: 150, align: "center", queryType: 'daterange', set: false, require: false, query: false, hide: false},
            { field: 'CREATE_USER', title: '创建人', minWidth: 100, align: "center", queryType: 'input', set: false, require: false, query: false, hide: false},

            { field: 'PLAN_START_TIME', title: '计划开始', minWidth: 150, align: "center", queryType: 'datetime', set: true, require: true, query: false, hide: false},
            { field: 'PLAN_END_TIME', title: '计划结束', minWidth: 150, align: "center", queryType: 'datetime', set: true, require: true, query: false, hide: false},
            { field: 'REAL_START_TIME', title: '实际开始', minWidth: 150, align: "center", queryType: 'datetime', set: false, require: true, query: false, hide: false},
            { field: 'COMPLETE_TIME', title: '实际结束', minWidth: 150, align: "center", queryType: 'datetime', set: false, require: true, query: false, hide: false},

		   { field: 'TASK_NO', title: '任务号', minWidth: 150, align: "center", queryType: 'input', set: false, require: false, query: true, hide: false },            
			{ field: 'TASK_STATE', title: '任务状态', minWidth: 100, align: "center",
       colunmStyle:function(row,item,value){
		   let style={}
		   if(value==='RUNNING')
		   {
			   style.backgroundColor='#1114C9'
			   style.color='#fff'
			   return style
		   }
		  if(value==='NON_ACTIVE')
		   {
			   style.backgroundColor='#156E07'
			   style.color='#fff'
			   return style
		   }
		   return {}
	   },
       queryType: 'select',selUri:'/cw-pms-app/app/constant/work-task-states',TASK_STATE:['name','value'], set: false, require: true, query: true, hide: false },
            { field: 'PERMISSION', title: '权限标识', minWidth: 100, align: "center", queryType: 'input', set: false, require: false, query: false, hide: true },
            { field: 'RAISE_USER', title: '提出人', minWidth: 100,align: 'center', queryType: 'input', set: false, require: false, query: true, hide: true },
            { field: 'APPROVAL_USER', title: '审核人', minWidth: 100, align: "center", queryType: 'input', set: false, require: false, query: false, hide: true },
            { field: 'COMPLETE_USER_ID', title: '指派给', minWidth: 100, align: "center", queryType: 'input',charNum:20, set: false, require: false, query: false, hide: true },
   			{ field: 'COMPLETE_USER', title: '指派给', minWidth: 100,align: 'center',multiple:true,charNum:20,orgType:300,selectRange:[300], queryType: 'user',userChange:function(result,form,item){
             
              let {name,code,id} = result
              form['COMPLETE_USER'] = name
			  form['COMPLETE_USER_ID']=id
              
            }, set: true, selectColumn:'label',formItemShow:function(form){
                  let row =this.boxSelectValue[0]
                  if(row && row.TASK_STATE && row.TASK_STATE!=='' && row.TASK_STATE!=='CREATE') {
                        return false
                  }
                   return true
              
            }, require: true, query: false, hide: false },
            { field: 'SOURCE_TYPE', title: '来源类型', minWidth: 100, align: "center", queryType: 'select', set: false, selUri:'/cw-pms-app/app/constant/task-source-types',SOURCE_TYPE:['name','value'],require: false, query: false, hide: false },
            { field: 'SURE_USER', title: '确认人', minWidth: 100, align: "center", queryType: 'input', set: false, require: false, query: false, hide: true },      
            { field: 'DEMAND_LEVEL', title: '任务等级', minWidth: 100, align: "center", queryType: 'select', set: true, selUri:'/cw-pms-app/app/constant/task-levels',DEMAND_LEVEL:['name','value'],require: false, query: false, hide: false },
            { field: 'STYLE_COLOR', title: '样式颜色', minWidth: 100, align: "center", queryType: 'input', set: false, require: false, query: false, hide: true },   
            { field: 'EXTEND_ATTR', title: '扩展属性', minWidth: 100, align: "center", queryType: 'input', set: false, require: false, query: false, hide: true },
            { field: 'ATTACHMENT1', title: '附件1', minWidth: 200, align: "center", queryType: 'file', set: false, require: false, query: false, hide: true,
             viewShow:function(fn,row,item){
				  let user= this.getCurrentUser()
                  if(user===undefined)
                    return false
                  let username=user.userInfo.username
                  let realname=user.userInfo.realName
                  let id =user.userInfo.id
				  if(row && row.COMPLETE_USER_ID!==id && row.CREATE_USER!==username)
					 return false
				  return true
			 },
         viewClick: function(e,fn,item,column,a) {
            this.viewFile(e,fn,item,column,a)
          },
			 removeShow:function(fn,row,item){
				  let user= this.getCurrentUser()
                  if(user===undefined)
                    return false
                  let username=user.userInfo.username
                  let realname=user.userInfo.realName
                  let id =user.userInfo.id
				  if(row && row.TASK_STATE==='CREATE' && row.CREATE_USER===username)
					 return true
				  return false
			 },
			 downloadShow:function(fn,row,item){
				  let user= this.getCurrentUser()
                  if(user===undefined)
                    return false
                  let username=user.userInfo.username
                  let realname=user.userInfo.realName
                  let id =user.userInfo.id
				  if(row && row.COMPLETE_USER_ID!==id && row.CREATE_USER!==username)
					 return false
				  return true
			 },
			},
			{ field: 'DEMAND_CODE', title: '关联需求', minWidth: 150, align: "center", queryType: 'input', set: false, require: false, query: false, hide: false },   
            { field: 'ATTACHMENT2', title: '附件2', minWidth: 100, align: "center", queryType: 'file', set: false, require: false, query: false, hide: true },
            { field: 'ATTACHMENT3', title: '附件3', minWidth: 100, align: "center", queryType: 'file', set: false, require: false, query: false, hide: true },
      		{ field: 'DESCRIPTION', title: '问题描述', minWidth: 100, align: "center", queryType: 'textarea',style:{width:'600px'}, set: false, require: false, query: false, hide: false },
            { field: 'WORK_CONTENT', title: '任务内容', minWidth: 150, align: "center", queryType: 'textarea',style:{width:'600px'}, set: true, require: true, query: false,charNum:5, hide: false },
            { field: 'REMARK', title: '备注', minWidth: 150, align: "center", queryType: 'textarea',style:{width:'600px'}, set: true, require: false, query: false,charNum:5, hide: false },
            { field: 'FILE_NAME', title: '项目文件',minWidth: 100,  align: 'center', queryType: 'file', set: false, require: true, query: true, hide: true,            
             viewShow:function(fn,row,item){
				  let user= this.getCurrentUser()
                  if(user===undefined)
                    return false
                  let username=user.userInfo.username
                  let realname=user.userInfo.realName
                  let id =user.userInfo.id
				  if(row && row.COMPLETE_USER_ID!==id && row.CREATE_USER!==username)
					 return false
				  return true
			 },
           viewClick: function(e,fn,item,column,a) {
            this.viewFile(e,fn,item,column,a)
          },
			 removeShow:function(fn,row,item){
				  let user= this.getCurrentUser()
                  if(user===undefined)
                    return false
                  let username=user.userInfo.username
                  let realname=user.userInfo.realName
                  let id =user.userInfo.id
				  if(row && row.TASK_STATE==='CREATE' && row.CREATE_USER===username)
					 return true
				  return false
			 },
			 downloadShow:function(fn,row,item){
				  let user= this.getCurrentUser()
                  if(user===undefined)
                    return false
                  let username=user.userInfo.username
                  let realname=user.userInfo.realName
                  let id =user.userInfo.id
				  if(row && row.COMPLETE_USER_ID!==id && row.CREATE_USER!==username)
					 return false
				  return true
			 },
			 downloadClick:function(e,fn,item,column){
              //查看文件是否是我自己的
                  let user= this.getCurrentUser()
                  if(user===undefined)
                    return
                  let username=user.userInfo.username
                  let realname=user.userInfo.realName
                  let id =user.userInfo.id
                  //我创建的文件可以下载也可以查看，指派给我的可以查看，不可以上传，也可以删除
                  if(item && item.CREATE_USER!==username && item.COMPLETE_USER_ID!==id )
                  {
                    
                      this.$message({
                          type: 'error',
                          message: '当前没有权限下载该文件'
                        }); 
                     return
                  }
              this.downloadFile(fn,item,column)
              return    
             },
             removeClick:function(e,fn,item,column){
                   let user= this.getCurrentUser()
                  if(user===undefined)
                    return
                  let username=user.userInfo.username
                  let realname=user.userInfo.realName
                  let id =user.userInfo.id
                  //我创建的文件可以下载也可以查看，指派给我的可以查看，不可以上传，也可以删除
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
              
             } },
          ],
				toolColumns:[
                 {field: 'OPER', title: '操作', width: 120, align: "center", queryType: 'input', set: false, require: true, query: false, hide: false,showFilter:false,showField:false,
                     buttons:[
                              //{text:'删除',icon:'el-icon-delete',background:'',permCode:'pms-work-task_delete',size:'mini',callback: function(e,self,row,selected){ self.handleDelete(row)}}
                              {text:'指派',icon:'el-icon-right',background:'',size:'mini',
                               show:function(row){
								  let user= this.getCurrentUser()
								  if(user===undefined)
									return false
								  let username=user.userInfo.username
								  let realname=user.userInfo.realName
								  let id =user.userInfo.id
								  if(row.TASK_STATE==='CREATE' && row.CREATE_USER===username)
									  return true
                                 return false
                               }
                               ,callback: function(e,self,row,selected){ 
									  this.$confirm(this.i18n("指派后不可更改，请谨慎操作"), this.i18n("common.tip_info.tips"), {
									  confirmButtonText: this.i18n("common.btn.ok"),
									  cancelButtonText: this.i18n("common.btn.cancel"),
									  type: 'warning'
										}).then(() => {
										   let op = {url:'/cw-pms-app/pms-work-task/assign',params:{data:row.ID}}
										   this.actionPost(op).then((data)=>{
												   self.$message({
													type: 'success',
													message: 'change success!=>' + data
												});     
											   self.fieldFormQuery()
										   })
										}).catch(() => {
										  this.$message({
											type: 'info',
											message: 'cancel delete'
										  });
										})
                              }},
							  {text:'开始',icon:'el-icon-video-play',background:'',size:'mini',
                               show:function(row){
								  let user= this.getCurrentUser()
								  if(user===undefined)
									return false
								  let username=user.userInfo.username
								  let realname=user.userInfo.realName
								  let id =user.userInfo.id
								  if(row.TASK_STATE==='NON_ACTIVE' && row.COMPLETE_USER_ID===id)
									  return true
                                 return false
                               }
                               ,callback: function(e,self,row,selected){ 
							           this.$confirm(this.i18n("开始后必须在指定时间完成，否则会影响你的KPI"), this.i18n("common.tip_info.tips"), {
										  confirmButtonText: this.i18n("common.btn.ok"),
										  cancelButtonText: this.i18n("common.btn.cancel"),
										  type: 'warning'
										}).then(() => {
										   let op = {url:'/cw-pms-app/pms-work-task/startTask',params:{data:row}}
										   this.actionPost(op).then((data)=>{
												   self.$message({
													type: 'success',
													message: 'change success!=>' + data
												});     
											   self.fieldFormQuery()
                         // 被指派的任务开始后刷新账号的任务数量及下拉框内工作任务颜色的展示
                         this.$store._actions['app/getWorkTaskNum'][0]()
										   }) 
										}).catch(() => {
										  this.$message({
											type: 'info',
											message: 'cancel delete'
										  });
										})
							  
                              }}

                          ]
                       }
                     ],
				formConfig: {
					inline: true,
					fileLimit: 1,
					fileSizeLimit: 10, //MB,
					file_row_record:'TASK_NO',
					file_row_index_only:'ID'
					},
}