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
       deleteUri:'/cw-wms-app/cw-wms-sku-attr/deleteById',
       editUri:'/cw-wms-app/cw-wms-sku-attr/updateById',
       addUri:'/cw-wms-app/cw-wms-sku-attr/createBaseComponent',
       queryUri:'/cw-wms-app/cw-wms-sku-attr/queryPage',
       batchAddUri:'/cw-wms-app/cw-wms-sku-attr/batchCreateBaseComponent',
       fileUpload:'/cw-wms-app/cw-wms-sku-attr/uploadFile',
       fileDownload:'/cw-wms-app/cw-wms-sku-attr/downloadFile',
       removeFile:'/cw-wms-app/cw-wms-sku-attr/removeFile',
       query:'/cw-wms-app/cw-wms-sku-attr/query',

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
