{
    mounted() {
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
		 let op = {url:'/cw-pms-app/cw-wms-po-head/updateById',params:{data:args}}
		 this.actionPost(op).then((data)=>{    
		    
	   }).catch(err=>{
			this.$message.error("流程审批已经完成，单回调业务完成状态时失败",JSON.stringify(err))
	   })
	  }
     }, 
	beforeApprove(e,data,fromData1,callback){
        if(callback && typeof callback==='function'){
			const loading = this.$loading({
			  lock: true,
			  text: 'Loading',
			  spinner: 'el-icon-loading',
			  background: 'rgba(0, 0, 0, 0.7)'
			});   
           callback.call(this,data.formData)
		   loading.close();  
        }
     },
  initFromData(e,flowData,fromData1,form,callback){
	  

	  	 const vueContext = this.vueContext
		 //获取模态
		 const formVue =vueContext['CwForm1']
		 const cwCtrlList1 =vueContext['CwCtrlList1']
		 if(flowData===undefined || flowData.formId===undefined){
			   //cwForm.formItem['fileOutputForm'].ALIAS_NAME.formItemShow=false
			   formVue.formRender()
			   return
		 }
				const loading = this.$loading({
		  lock: true,
		  text: 'Loading',
		  spinner: 'el-icon-loading',
		  background: 'rgba(0, 0, 0, 0.7)'
		}); 
		 const table =cwCtrlList1.$refs.CwTable

		 let op = {url:'/cw-wms-app/cw-wms-po-head/query-po-id',params:{data:flowData.formId}}
         this.actionPost(op).then((data)=>{
					 formVue.iform['poApplyForm'].params = data.po
					 cwCtrlList1.data = data.items 
                     formVue.formRender()		
					 	if(data.po.PERMISSION!=='save')
							{
						
								formVue.formItem['poApplyForm'].COM_CODE.readonly = true
								formVue.formItem['poApplyForm'].FAC_CODE.readonly = true
								formVue.formItem['poApplyForm'].SUPPILER_CODE.readonly = true
								formVue.formItem['poApplyForm'].SUPPILER_NAME.readonly = true
								formVue.formItem['poApplyForm'].DELIVER_TIME.disabled = true
								 if(table){
									 table.toolBar.show = false
									 //table.toolBarMap['add'].show=false
									// table.toolBarMap['delete'].show=false
									 //table.toolBarMap['save'].show=false
								 }
						}
					 loading.close();
                   }).catch(err=>{
					      this.$message.error("保存失败1",JSON.stringify(err))
						  loading.close();
				   }).finally(()=>{					 
			 })
  },
  createBefore(e,flow,gdata,callback){
		 const vueContext = this.vueContext
		 if(vueContext){
			 const formVue =vueContext['CwForm1']
		 const cwCtrlList1 =vueContext['CwCtrlList1']
			 let formData = formVue.iform['poApplyForm'].params
			 formData.PERMISSION=flow.type
			 if(!formData.COM_CODE){
				  this.$message.error("公司代码不能为空")
				  return
			 }
			 if(!formData.SUPPILER_CODE){
				  this.$message.error("供应商代码不能为空")
				  return
			 }
			 let poData = {
				 po:formData,
				 items: cwCtrlList1.data
			 }
			 const loading = this.$loading({
				  lock: true,
				  text: 'Loading',
				  spinner: 'el-icon-loading',
				  background: 'rgba(0, 0, 0, 0.7)'
				});
			let op = {url:'/cw-wms-app/cw-wms-po-head/create-po',params:{data:poData}}
            this.actionPost(op).then((data)=>{
    				  this.$message.success("采购订单创建成功")
					  formVue.iform['poApplyForm'].params = data.po
					  cwCtrlList1.data = data.items
					  loading.close();
					  callback.call(this,data.po,data.po.ID)
                   }).catch(err=>{
					     loading.close();
					     this.$message.error("保存失败",JSON.stringify(err))

				   }).finally(()=>{
					 
			 })	 
		 }	 
  }   
}