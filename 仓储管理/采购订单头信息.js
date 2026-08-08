{
  page:{
    showPage:true,
    listQuery: {
      current: 1,
      pageSize: 15
    }
  },
  url:{
           deleteUri:'/cw-wms-app/cw-wms-po-head/deleteById',
       editUri:'/cw-wms-app/cw-wms-po-head/updateById',
       addUri:'/cw-wms-app/cw-wms-po-head/createBaseComponent',
       queryUri:'/cw-wms-app/cw-wms-po-head/queryPage',
       batchAddUri:'/cw-wms-app/cw-wms-po-head/batchCreateBaseComponent',
       fileUpload:'/cw-wms-app/cw-wms-po-head/uploadFile',
       fileDownload:'/cw-wms-app/cw-wms-po-head/downloadFile',
       removeFile:'/cw-wms-app/cw-wms-po-head/removeFile',
       query:'/cw-wms-app/cw-wms-po-head/query',

  },
  customToolBar:{
    show:true,
    showFilter:true,
    showSelectField:false,
    showExport:false,
    columnSelectFilter:false,
    showUpload:false,
	hideText:false,
    btnStyles:{
      float:'left'
    },
    buttons:[
      {text:'查询',icon:'el-icon-search',background:'',size:'mini',hideText:false,callback:function(e,self){
        self.fieldFormQuery()
      },
      style:{
      }
      },
      {text:'重置',icon:'el-icon-refresh-left',background:'',hideText:false,size:'mini',callback:function(e,self){
        self.reset()
      }},	  
	 {text:'订单信息',icon:'el-icon-refresh-leftel-icon-document',background:'',hideText:false,size:'mini',callback:function(e,self){
		 let row = self.boxSelectValue[0]
		 if(row===undefined || row===null){
			  this.$message.error("没有选择订单信息！")
			 return
		 }
         const table =this.$parent
         if(!table)
		 {
			 this.$message.error("没有上下文关系，前端可能渲染有问题，请联系管理员")
			 return
		 }
		 const vueContext = table.vueContext
		 //获取模态
		 let modelVue = vueContext['CwDialogPanel1']
		 if(!modelVue)
			 return
		 const formVue =vueContext['CwForm1']
		 const cwCtrlList2 =vueContext['CwCtrlList2']
		 let op = {url:'/cw-wms-app/cw-wms-po-head/query-po',params:{data:row.PO}}
            this.actionPost(op).then((data)=>{
					 formVue.iform['poApplyForm'].params = data.po
					 cwCtrlList2.data = data.items
					 modelVue.dialogVisible=true
                   }).catch(err=>{
					     this.$message.error("保存失败",JSON.stringify(err))

				   }).finally(()=>{
					 
			 })	 
	 }},
	 
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
							path:'/cw/CwPageView/cw_wms_po_item',
							query:{id:form.ID,sourceType:'FORM'}

					})
                },
                style:{
                  float: 'left'
                }
               },
      //{text:'重置',icon:'el-icon-refresh-left',permCode:'',background:'',hideText:true,size:'mini',callback:function(e,self){
      //  self.reset()
      //}},
      //{text:'增加',icon:'el-icon-plus',permCode:'MF_WMS002827',background:'',size:'mini',hideText:true,callback:function(e,self){
      //  self.add()
      //}},
      //{text:'编辑',icon:'el-icon-edit',permCode:'MF_WMS002826',background:'',size:'mini',hideText:true,callback:function(e,self){
      //  self.edit(self.boxSelectValue[0])
      //}},
      //{text:'删除',icon:'el-icon-delete',permCode:'MF_WMS002823',background:'',size:'mini',hideText:true,callback:function(e,self){
      //  self.handleDelete(self.boxSelectValue[0])
      //}},
    ]
  },
  cols: [
        {"hide":true,"set":false,"field":"ID","query":false,"width":150,"require":false,"title":"Id","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"CREATE_TIME","query":false,"width":150,"require":false,"title":"创建时间","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"CREATE_USER","query":false,"width":150,"require":false,"title":"创建人","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"LAST_MODIFY_TIME","query":false,"width":150,"require":false,"title":"修改时间","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"LAST_MODIFY_USER","query":false,"width":150,"require":false,"title":"修改人","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"STATUS","query":false,"width":150,"require":false,"title":"状态","align":"center","queryType":"input"},
        {"hide":false,"set":false,"field":"PERMISSION","query":false,"width":150,"require":false,"title":"权限码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"COM_CODE","query":false,"width":150,"require":false,"title":"公司代码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"FAC_CODE","query":false,"width":150,"require":false,"title":"工厂代码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"SUPPILER_CODE","query":false,"width":150,"require":false,"title":"供应商","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"SUPPILER_NAME","query":false,"width":150,"require":false,"title":"供应商名","align":"center","queryType":"input"},
    	{"hide":false,"set":true,"field":"DELIVER_TIME","query":false,"width":200,"require":false,"title":"交货日期","align":"center","queryType":"datetime"},
        {"hide":false,"set":true,"field":"CREATE_USER_NAME","query":false,"width":150,"require":false,"title":"创建人名称","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"MODIFY_USER_NAME","query":false,"width":150,"require":false,"title":"修改人名称","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"PO","query":true,"width":150,"require":false,"title":"采购订单号","align":"center","queryType":"input"},

  ],

  toolColumns:[
    {field: 'OPER', title: '操作', width: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: true,showFilter:false,showField:false,
      buttons:[
        {text:'删除',icon:'el-icon-delete',background:'',permCode:'pms_pro_material_delete',size:'mini',callback: function(e,self,row,selected){ self.handleDelete(row)}}
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
