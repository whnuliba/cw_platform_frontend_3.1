 {
   lazy:true, 
   formModes:[
   {
	   loading:false,
       display:'block',
       title: '文件外发',
       dialogVisible:'fileOutputForm',
       dialogShow:false,
       cancelBtnShow:true,
       forms:[
                  { field: 'PROJECT_NO', title: '关联项目', minWidth: 150, align: "center", queryType: 'select-filter',url:'/cw-pms-app/pms_pro/select-filter',
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
                   form['PROJECT_ID']=result.id
                },
                set: true, require: false, query: true, hide: true,style:{width:'600px'} },
			{ field: 'PROJECT_ID', title: '关联项目', minWidth: 150, align: "center", queryType: 'input', set: false, require: false, query: false, hide: false,style:{width:'600px'}},        
            { field: 'CLASS_NAME', title: '文件分类1',minWidth: 100,  align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true,style:{width:'600px'} },
            { field: 'FILE_ABSTRACT', title: '文件摘要',minWidth: 150,style:{width:'600px'},  align: 'center', queryType: 'textarea', set: true, require: true, query: false, hide: false },
			{ field: 'OUT_REASON', title: '外发原因',minWidth: 150,style:{width:'600px'},  align: 'center', queryType: 'textarea', set: true, require: true, query: false, hide: false },
            { field: 'REMARK', title: '备注',minWidth: 150,  align: 'center',style:{width:'600px'}, queryType: 'textarea', set: true, require: false, query: false, hide: false },
            
			{ field: 'ALIAS_FILE', title: '文件列表', minWidth: 200, align: "center", queryType: 'filePreview',view:true, set: false, require: false, query: false, hide: false,
             viewShow:function(fn,row,item){
				  let user= this.getCurrentUser()
                  if(user===undefined)
                    return false
                  let username=user.userInfo.username
                  let realname=user.userInfo.realName
                  let id =user.userInfo.id
				  return false
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
				  return false
			 },
        removeClick:function(e,fn,item,column){
			  return false
              
             },    
			 downloadShow:function(fn,row,item){
				  return true
			 },
			 downloadClick:function(e,fn,item,column){
                 //查看文件是否是我自己的
                  //我创建的文件可以下载也可以查看，指派给我的可以查看，不可以上传，也可以删除
				 let row_record = {...item,ROW_RECORD:'ID',FIELD:"FILE_NAME",ROW_INDEX_ONLY:'ID'}  
                 let data = {fileName:fn,details:row_record}  
                 this.$downloadFile('/cw-pms-app/pms-project-release-file/downloadFile',data)
                 return       
             },
			},
			
			{ field: 'FILE_NAME', title: '外发文件', minWidth: 100, align: "center", queryType: 'attachment',style:{width:'600px'}, set: true, require: false, query: false, hide: false,
			  fileLimit:10,
			  httpRequest:function(item){
				item.name=item.file.name
			   // this.fileList.push(item)
			   let names = []
			   if(this.iformFile['fileOutputForm'].fileList &&  this.iformFile['fileOutputForm'].fileList['FILE_NAME']){
				   names = this.iformFile['fileOutputForm'].fileList['FILE_NAME'].map(c=>c.name);
			   }
				if(names.indexOf(item.file.name)==-1)
				{
				  this.iformFile['fileOutputForm'].fileList['FILE_NAME'].push(item)
				}
				 //this.fileData = item.file;
				  
			  },
              onRemove:function(file, fileList){
				  
				   let names = []
					   if(this.iformFile['fileOutputForm'].fileList &&  this.iformFile['fileOutputForm'].fileList['FILE_NAME']){
						   names = this.iformFile['fileOutputForm'].fileList['FILE_NAME'].map(c=>c.name);
					   }
					if(names.indexOf(file.name)>-1)
					{
					  this.iformFile['fileOutputForm'].fileList['FILE_NAME'].splice(names.indexOf(file.name),1)
					}				  
			  },  
              beforeUpload:function(file){				  
				    const isLtSize = file.size / 1024 / 1024 < 1024*1024*1024*1024*10;
				     if (!isLtSize) {
					  this.$message.error(`文件不能超过 10MB!`);
					  // this.$refs.uploadDel[0].clearFiles()
					  return false
				  }
			  },
			  onPreview:function(file){
				  console.log(file)
			  },
		      onExceed:function(files, fileList){ 
				 this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			  }
			}
			 
       ],
     
   }
 ]}