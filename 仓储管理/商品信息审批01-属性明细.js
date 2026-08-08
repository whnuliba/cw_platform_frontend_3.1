{
  page:{
    showPage:false,
	lazy:true,
    listQuery: {
      current: 1,
      pageSize: 15
    }
  },
  url:{
       deleteUri:'/cw-wms-app/cw-wms-spu-attr/deleteById',
       editUri:'/cw-wms-app/cw-wms-spu-attr/updateById',
       addUri:'/cw-wms-app/cw-wms-spu-attr/createBaseComponent',
       queryUri:'/cw-wms-app/cw-wms-spu-attr/queryPage',
       batchAddUri:'/cw-wms-app/cw-wms-spu-attr/batchCreateBaseComponent',
       fileUpload:'/cw-wms-app/cw-wms-spu-attr/uploadFile',
       fileDownload:'/cw-wms-app/cw-wms-spu-attr/downloadFile',
       removeFile:'/cw-wms-app/cw-wms-spu-attr/removeFile',
       query:'/cw-wms-app/cw-wms-spu-attr/query',

  },
  customToolBar:{
    show:true,
    showFilter:false,
    showSelectField:false,
    showExport:false,
    showExport:false,
    columnSelectFilter:false,
    showUpload:false,
    btnStyles:{
      float:'left'
    },
    buttons:[
      {text:'增加',icon:'el-icon-plus',background:'',size:'mini',hideText:false,callback:function(e,self){
		 if(this.cols){
			 let row = {}
			 this.cols.forEach(item=>{
				 row[item.field] = undefined
			 })
			 if(this.data===undefined)
			 this.data=[]
		     this.data.push(row)
		 }
		 for(let i =0;i<this.data.length;i++){
			 this.data[i].ROW_NO=i+1
		 }

		//self.add()
      }},
      {text:'删除',icon:'el-icon-delete',background:'',size:'mini',hideText:false,callback:function(e,self){
		  if(self.boxSelectValue[0] ===undefined){
			  this.$message.error("没有选择需要删除的行项目")
			  return
		  }
        //self.handleDelete(self.boxSelectValue[0])
		this.data.splice(this.data.indexOf(self.boxSelectValue[0]),1)
		
      }},
	  {text:'保存',icon:'el-icon-document-checked',background:'',size:'mini',hideText:false,callback:function(e,self){
         const table =this.$parent
         if(!table)
		 {
			 this.$message.error("没有上下文关系，前端可能渲染有问题，请联系管理员")
			 return
		 }
		 const vueContext = table.vueContext
		 if(vueContext){
			 const formVue =vueContext['CwForm1']

			 let formData = formVue.iform['spuApplyForm'].params

			 let skuListVue =vueContext['CwCtrlList2']

			 if(!formData.GOODS_NAME){
				  this.$message.error("产品描述不能为空")
				  return
			 }
			 let poData = {
				 spu:formData,
				 spuItems: this.data,
				 skuItems: skuListVue.data
			 }
			 const loading = this.$loading({
				  lock: true,
				  text: 'Loading',
				  spinner: 'el-icon-loading',
				  background: 'rgba(0, 0, 0, 0.7)'
				});
			let op = {url:'/cw-wms-app/cw-wms-spu/create-spu',params:{data:poData}}
            this.actionPost(op).then((data)=>{
    				 this.$message.success("采购订单创建成功")
					 formVue.iform['spuApplyForm'].params = data.spu
					 this.data = data.spuItems
					 skuListVue.data = data.skuItems
					   loading.close();
                   }).catch(err=>{
					     loading.close();
					     this.$message.error("保存失败",JSON.stringify(err))

				   }).finally(()=>{
					 
			 })	 
		 }
      }},
    ]
  },
  cols: [
        {"hide":true,"set":false,"field":"CREATE_TIME","query":false,"width":150,"require":false,"title":"创建时间","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"CREATE_USER","query":false,"width":150,"require":false,"title":"创建人","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"STATUS","query":false,"width":150,"require":false,"title":"状态","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"PERMISSION","query":false,"width":150,"require":false,"title":"权限码","align":"center","queryType":"input"},
        {"hide":true,"set":true,"field":"GOODS_CODE","query":false,"width":150,"require":false,"title":"商品编码","align":"center","queryType":"input"},
        {"hide":false,edit:true,"set":true,"field":"SPU_ATTR","query":false,"width":150,"require":false,"title":"属性标识","align":"center","queryType":"input"},
        {"hide":false,edit:true,"set":true,"field":"SPU_ATTR_DETAILS","query":false,"minWidth":300,"require":false,"title":"属性描述","align":"center","queryType":"input"},
        {"hide":false,edit:true,"set":true,"field":"SPU_ATTR_DETAILS2","query":false,"minWidth":150,"require":false,"title":"二级属性描述","align":"center","queryType":"input"},
  ],

  toolColumns:[
    {field: 'OPER', title: '操作', width: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: true,showFilter:false,showField:false,
      buttons:[
        {text:'删除',icon:'el-icon-delete',background:'',permCode:'MF_WMS002837',size:'mini',callback: function(e,self,row,selected){ 
		   
		}}
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
