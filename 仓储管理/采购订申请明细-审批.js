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
       deleteUri:'/cw-wms-app/cw-wms-po-item/deleteById',
       editUri:'/cw-wms-app/cw-wms-po-item/updateById',
       addUri:'/cw-wms-app/cw-wms-po-item/createBaseComponent',
       queryUri:'/cw-wms-app/cw-wms-po-item/queryPage',
       batchAddUri:'/cw-wms-app/cw-wms-po-item/batchCreateBaseComponent',
       fileUpload:'/cw-wms-app/cw-wms-po-item/uploadFile',
       fileDownload:'/cw-wms-app/cw-wms-po-item/downloadFile',
       removeFile:'/cw-wms-app/cw-wms-po-item/removeFile',
       query:'/cw-wms-app/cw-wms-po-item/query',

  },
  customToolBar:{
    show:true,
    showFilter:false,
    showSelectField:false,
    showExport:false,
    showExport:false,
    columnSelectFilter:false,
    showUpload:true,
    btnStyles:{
      float:'left'
    },
    buttons:[
      {text:'增加',icon:'el-icon-plus',key:'add',show:true,permCode:'MF_WMS002839',background:'',size:'mini',hideText:false,callback:function(e,self){
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
      {text:'删除',key:'delete',show:true,icon:'el-icon-delete',permCode:'MF_WMS002837',background:'',size:'mini',hideText:false,callback:function(e,self){
		  if(self.boxSelectValue[0] ===undefined){
			  this.$message.error("没有选择需要删除的行项目")
			  return
		  }
        //self.handleDelete(self.boxSelectValue[0])
		this.data.splice(this.data.indexOf(self.boxSelectValue[0]),1)
		
      }},
	  {text:'保存',key:'save',show:true,icon:'el-icon-document-checked',permCode:'MF_WMS002803',background:'',size:'mini',hideText:false,callback:function(e,self){
         const table =this.$parent
         if(!table)
		 {
			 this.$message.error("没有上下文关系，前端可能渲染有问题，请联系管理员")
			 return
		 }
		 const vueContext = table.vueContext
		 if(vueContext){
			 const formVue =vueContext['CwForm1']

			 let formData = formVue.iform['poApplyForm'].params
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
				 items: this.data
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
					 this.data = data.items
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
	{"hide":false,edit:true,"set":true,"field":"M_CODE","query":false,"width":150,"require":false,"title":"物料编号","align":"center","queryType":"select-filter",url:'/cw-wms-app/cw-wms-material/query',
            lazy:true,
            modeValue:'code',
            loadData:(val,item,callback)=>{
                 let op = {url:item.url,params:{data:{sqlWhere:[{column:'M_CODE',condition:'like%',value:val}] }}}
                 this.actionPost(op).then((data)=>{
                    let arr =[]
                    if(data && data.length){
                    arr = data.map(c=>{
                      return {name:c.M_DETAILS,code:c.M_CODE,id:c.ID,data:c}
                    })
                  }
                   if(callback&& typeof callback==='function')
                        callback.call(this,arr)
                 })

            }, 
            onChange(result,form,item){
               form['M_CODE']=result.code
			   form['UNIT1']=result.data[0].UNIT
			   form['UNIT2']=result.data[0].UNIT1
    }},
	{"hide":false,edit:true,"set":true,"field":"MGRP_CODE","query":false,"width":150,"require":false,"title":"物料组","align":"center","queryType":"input"},
	{"hide":false,edit:true,"set":true,"field":"S_M_CODE","query":false,"width":150,"require":false,"title":"供应商料号","align":"center","queryType":"input"},
	{"hide":false,edit:true,"set":true,"field":"QTY1","query":false,"width":150,"require":false,"title":"数量1","align":"center","queryType":"input"},
	{"hide":false,edit:true,"set":true,"field":"UNIT1","query":false,"width":150,"require":false,"title":"单位1","align":"center","queryType":"input"},
	{"hide":false,edit:true,"set":true,"field":"QTY2","query":false,"width":150,"require":false,"title":"数量2","align":"center","queryType":"input"},
	{"hide":false,edit:true,"set":true,"field":"UNIT2","query":false,"width":150,"require":false,"title":"单位2","align":"center","queryType":"input"},
	{"hide":false,"set":true,"field":"ROW_NO","query":false,"width":60,"require":false,"title":"行号","align":"center","queryType":"input"},
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
