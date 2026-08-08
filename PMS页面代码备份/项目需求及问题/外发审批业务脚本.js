{
    mounted() {
       //this.vueContext['CwForm1']
       let _this = this
       this.addEventListener("CwWorkFlow1","beforeCreate",this.createBefore)
	   this.addEventListener("CwWorkFlow1","initFromData",this.initFromData)
	   this.addEventListener("CwWorkFlow1","beforeApprove",this.beforeApprove)
	    this.addEventListener("CwWorkFlow1","afterApprove",this.afterApprove)

  },
  afterApprove(e,data,fromData1,callback){
	  let resp = data.resp
	  let flowData = data.data
	  let form = flowData.formData
	  if(resp.handler === 'COMPLETE'){
		  //修改完结状态
		 let args = {PERMISSION:'complete',ID:form.ID}
		 let op = {url:'/cw-pms-app/pms-project-release-file/updateById',params:{data:args}}
		  this.actionPost(op).then((data)=>{    
		    
		 
	   }).catch(err=>{
			this.$message.error("流程审批已经完成，单回调业务完成状态时失败",JSON.stringify(err))
	   })
	  }
     }, 
	beforeApprove(e,data,fromData1,callback){
        if(callback && typeof callback==='function'){
		 const cwForm = this.vueContext['CwForm1']	
         cwForm.loading['fileOutputForm'] = true	   
          callback.call(this,data.formData)
		 cwForm.loading['fileOutputForm'] = false	   
        }
     },
  initFromData(e,flowData,fromData1,form,callback){
	   const cwForm = this.vueContext['CwForm1']	
       cwForm.loading['fileOutputForm'] = true	   
	   let url = '/cw-pms-app/pms-project-release-file/queryById'
	   if(flowData===undefined || flowData.formId===undefined){
		   //cwForm.formItem['fileOutputForm'].ALIAS_NAME.formItemShow=false
		   cwForm.formRender()
		         cwForm.loading['fileOutputForm'] = false
		   return
	   }
       let _data = { url: url, params: {data:flowData.formId}}
       this.$store.dispatch('fmsCommon/actionPost', _data)
          .then(data => {
			   cwForm.loading['fileOutputForm'] = false
              if(data && data.length){
                  let form = data[0]
                  this.$nextTick(()=>{
                    if(callback && typeof callback==='function'){
                      callback.call(this,form)
                    }
				
					cwForm.iform['fileOutputForm'].params = form
					//this.iformFile['fileOutputForm'].fileList['FILE_NAME']
					//cwForm.formItem['fileOutputForm'].FILE_NAME.formItemShow=false
					let filename = form.FILE_NAME
					form.ALIAS_FILE = form.FILE_NAME
					if(filename){
						let fns = filename.split(';')
						fns.forEach(fn=>{
							let cfile= {filename:'file',name:fn,alreadyIn:true}
							cwForm.iformFile['fileOutputForm'].fileList['FILE_NAME'].push(cfile)
						})
					}
					
                })  
				if(form.PERMISSION!=='save')
				{
					cwForm.formItem['fileOutputForm'].FILE_NAME.formItemShow=false
					
					//cwForm.formItem['fileOutputForm'].FILE_NAME.disabled=false
					cwForm.formItem['fileOutputForm'].CLASS_NAME.readonly = true
					cwForm.formItem['fileOutputForm'].OUT_REASON.readonly = true
					cwForm.formItem['fileOutputForm'].FILE_ABSTRACT.readonly = true
					cwForm.formItem['fileOutputForm'].REMARK.readonly = true
					cwForm.formItem['fileOutputForm'].PROJECT_NO.disabled = true
				}
                cwForm.formRender()				
              }
          }).catch(err => {
          console.error(err)
		  cwForm.loading['fileOutputForm'] = false
        })

  },
  createBefore(e,flow,gdata,callback){
    //fileOutputForm

					 const cwForm = this.vueContext['CwForm1']	 

					 cwForm.loading['fileOutputForm'] = true
					 let form = cwForm.iform['fileOutputForm'].params
					 form.PERMISSION=flow.type
					 let fa = new FormData();
					  if(form.OUT_REASON===undefined || form.OUT_REASON===null||form.OUT_REASON.trim()===''){
						  this.$message.error("外发原因不能为空")
							return
						  return
					  }
					if(form.FILE_ABSTRACT===undefined || form.FILE_ABSTRACT===null||form.FILE_ABSTRACT.trim()===''){
						  this.$message.error("摘要信息不能为空")
							return
						  return
					  }
					  let fileModel = 	cwForm.iformFile['fileOutputForm'].fileList
				      if(fileModel['FILE_NAME']){
						let files = fileModel['FILE_NAME'];
						if(files.length===0){
							this.$message.error("没有上传文件")
							return
						}
						let fileNames = fileModel['FILE_NAME'].map(c=>c.name);

					    for(let i=0 ;i<files.length;i++){
							
							if(files[i].alreadyIn)
							{
								continue
							}
					        fa.append(`file`,files[i].file);
					  }
					   form.FILE_NAME = fileNames.join(';')
					   form.ALIAS_FILE = form.FILE_NAME
					  }

				      fa.append('data',JSON.stringify(form));  
                      let op = {url:'/cw-pms-app/pms-project-release-file/createFileForm',params:fa}
                      this.actionPost(op).then((data)=>{    
					  cwForm.clearFormData(form)
					  callback.call(this,data,data.ID)
					  cwForm.loading['fileOutputForm'] = false
                   }).catch(err=>{
					     this.$message.error("流程提交失败",JSON.stringify(err))
						 cwForm.loading['fileOutputForm'] = false

				   }).finally(()=>{
					   cwForm.loading['fileOutputForm'] = false
				   })	
  }   
}