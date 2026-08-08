{
   mounted(pageContext){
	     const cwCtrlList1 = this.vueContext['CwCtrlList1']
		 pageContext.addEventListener("CwCtrlList1","row-click",this.rowClickhander)
	},
   	rowClickhander(e,row){
			  const vueContext =this.vueContext
			  const cwCtrlList2 =vueContext['CwCtrlList2']
			  const cwCtrlList3 =vueContext['CwCtrlList3']
	 	      let op = {url:'/cw-wms-app/cw-wms-spu/query-spu-id',params:{data:row.ID}}
				this.actionPost(op).then((data)=>{
				cwCtrlList2.data = data.spuItems
				cwCtrlList3.data = data.skuItems
			   }).catch(err=>{
					this.$message.error("获取货品信息失败",JSON.stringify(err))
			   })
	},
  page:{
    showPage:true,
    listQuery: {
      layout:'total, prev, pager, next',
       small:true,
      current: 1,
      pageSize: 10,
	  pageSizes:[5,10,15]
    }
  },
  url:{
       deleteUri:'/cw-wms-app/cw-wms-spu/deleteById',
       editUri:'/cw-wms-app/cw-wms-spu/updateById',
       addUri:'/cw-wms-app/cw-wms-spu/createBaseComponent',
       queryUri:'/cw-wms-app/cw-wms-spu/queryPage',
       batchAddUri:'/cw-wms-app/cw-wms-spu/batchCreateBaseComponent',
       fileUpload:'/cw-wms-app/cw-wms-spu/uploadFile',
       fileDownload:'/cw-wms-app/cw-wms-spu/downloadFile',
       removeFile:'/cw-wms-app/cw-wms-spu/removeFile',
       query:'/cw-wms-app/cw-wms-spu/query',

  },
  customToolBar:{
    show:true,
    showFilter:true,
    showSelectField:false,
    showExport:true,
    columnSelectFilter:false,
    showUpload:false,
	indexVisible:false,
	boxSelectVisible:true,
    btnStyles:{
      float:'left'
    },
    buttons:[
      {text:'查询',show:true,icon:'el-icon-search',background:'',size:'mini',hideText:true,callback:function(e,self){
        self.fieldFormQuery()
      },
      style:{
      }
      },
      {text:'重置',show:true,icon:'el-icon-refresh-left',background:'',hideText:false,size:'mini',callback:function(e,self){
        self.reset()
      }},
	  {text:'增加',icon:'el-icon-document',permCode:'MF_WMS003031',background:'',size:'mini',hideText:false,callback:function(e,self){
				// this.$router.push({
				// 		path:'/cw/CwPageView/cw_wms_spu_attr'
			    // })
			  const  {href}= this.$router.resolve('/cw/CwPageView/cw_wms_spu_attr')
			  window.open(href, "_blank");
			},
			style:{
			  float: 'left'
			}
		   },
	  {text:'变更',icon:'el-icon-document',permCode:'MF_WMS003030',background:'',size:'mini',hideText:false,callback:function(e,self){
				 if(self.boxSelectValue===undefined || self.boxSelectValue.length==0){
					 self.$message({
						 type: 'error',
						 message: '没有选择需要变更的品号单'
					});

				  return
			   }
			  let form = self.boxSelectValue[0]
				// 	this.$router.push({
				// 		path:'/cw/CwPageView/cw_wms_spu_attr',
				// 		query:{id:form.ID}
			 //
			 // })
			  const  {href}= this.$router.resolve('/cw/CwPageView/cw_wms_spu_attr')
			  window.open(href+"?id="+form.ID, "_blank");
			},
			style:{
			  float: 'left'
			}
		},
      {text:'删除',show:true,icon:'el-icon-delete',permCode:'MF_WMS003029',background:'',size:'mini',hideText:false,callback:function(e,self){
        self.handleDelete(self.boxSelectValue[0])
      }},
    ]
  },
  cols: [
        {"hide":false,"set":false,"field":"CREATE_TIME","query":false,"width":150,"require":false,"title":"创建时间","align":"center","queryType":"input"},
        {"hide":false,"set":false,"field":"CREATE_USER","query":false,"width":150,"require":false,"title":"创建人","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"STATUS","query":false,"width":150,"require":false,"title":"状态","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"PERMISSION","query":false,"width":150,"require":false,"title":"权限码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"GOODS_CODE","query":true,"width":150,"require":false,"title":"商品编码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"GOODS_NAME","query":false,"minWidth":150,"require":false,"title":"商品名称","align":"center","queryType":"input"},
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
