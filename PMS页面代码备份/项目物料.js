{
 page:{
   showPage:true,
   listQuery: {
      current: 1,
      pageSize: 15
   } 
 },
 url:{
    deleteUri:'/cw-pms-app/pms_pro_material/deleteById',
    editUri:'/cw-pms-app/pms_pro_material/updateById',  
    addUri:'/cw-pms-app/pms_pro_material/createBaseComponent',  
    queryUri:'/cw-pms-app/pms_pro_material/queryPage', 
	batchAddUri:'/cw-pms-app/pms_pro_material/batchCreateBaseComponent',

 },  
 customToolBar:{
           show:true,
           showFilter:true,
           showSelectField:true,  
           showExport:true,
           columnSelectFilter:true,
		   showUpload:true,
		   showText:true,
		   btnStyles:{
			   float:'left'
		   },
           buttons:[
               {text:'查询',icon:'el-icon-search',permCode:'pms_pro_material_query',background:'',size:'mini',hideText:false,callback:function(e,self){
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
                }},
              {text:'增加',icon:'el-icon-plus',permCode:'pms_pro_material_add',background:'',size:'mini',hideText:false,callback:function(e,self){
                   self.add()
                },
                style:{
                 float: 'left'
                }},
              {text:'编辑',icon:'el-icon-edit',permCode:'pms_pro_material_edit',background:'',size:'mini',hideText:false,callback:function(e,self){
                self.edit(self.boxSelectValue[0])
                },
                style:{
                 float: 'left'
                }},
              {text:'删除',icon:'el-icon-delete',permCode:'pms_pro_material_delete',background:'',size:'mini',hideText:false,callback:function(e,self){
                  self.handleDelete(self.boxSelectValue[0])
                },
                style:{
                 float: 'left'
                }},
           ]
        }, 
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
			set: true, require: false, query: false, hide: true },
			{ field: 'PROJECT_CODE', title: '关联项目', minWidth: 150, align: "center", queryType: 'input', set: false, require: false, query: true, hide: false},
            { field: 'PRODUCT_CODE', title: '物料代码', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: true, hide: false,disabled:false, },
            { field: 'PRODUCT_NAME', title: '物料名称', minWidth: 100, align: "left", queryType: 'input',PRODUCT_NAME:['dsCode','dsName'],selUri:'/bak-mes-task/dsconf/list',set: true, require: true, query: true, hide: false},
            { field: 'CREATE_TIME', title: '创建时间', minWidth: 150, align: "center", queryType: 'daterange', set: true, require: true, query: false, hide: false},
            { field: 'PN_DSC', title: '物料描述', minWidth: 200,charNum:20, align: "left", queryType: 'input', set: true, require: true, query: false, hide: false },
            { field: 'UNIT', title: '单位', minWidth: 100, align: "center", queryType: 'input', UNIT:['bizValue','bizValue'],selUri:'/bak-mes-task/codes/guest/list',set: true, require: true, query: false, hide: false },
            { field: 'UNIT1', title: '次要单位', minWidth: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: false },
            { field: 'DN', title: '图号', align: 'center', queryType: 'input', set: true, require: true, query: false, hide: false },
            { field: 'PM_TYPE', title: '采购类型', align: 'center', queryType: 'input', set: true, require: true, query: false, hide: false },
            { field: 'ABC_CATE', title: 'ABC分类', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: false, hide: false },
            { field: 'SP_PM_TYPE', title: '特殊采购类型', minWidth: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: false },
            { field: 'SPEC', title: '规格型号', minWidth: 200, align: "left", queryType: 'input', set: true, require: true, query: false, hide: false },
            { field: 'IS_KEY', title: '是否关键件', minWidth: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: false },
            { field: 'IS_LOT', title: '是否批次管理', minWidth: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: false },
            { field: 'WH_NO', title: '仓库编号', align: 'center', queryType: 'input', set: false, require: false, query: false, hide: false },
            { field: 'WH_NAME', title: '仓库名称', align: 'center', queryType: 'input', set: false, require: false, query: false, hide: false },
            { field: 'MIN_PACK', title: '最小包装数量', minWidth: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: false },
            { field: 'PACK_SPEC', title: '包装容器规格', minWidth: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: false },
            { field: 'PULL_TYPE', title: '厂内拉动类型', minWidth: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: false },
            { field: 'SUPPLIER_NO', title: '供应商编码', minWidth: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: false },
            { field: 'LOT_NO', title: '批次信息', minWidth: 100, align: "center", queryType: 'textarea', set: true, require: true, query: false, hide: false },
            { field: 'SEQ_NO', title: '序列号', align: 'center', queryType: 'input', set: false, require: true, query: false, hide: false },
            { field: 'DIST_TYPE', title: '配送方式', align: 'center', queryType: 'input', set: false, require: false, query: false, hide: false },
            { field: 'PERMISSION', title: '权限标识', minWidth: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: false },
            { field: 'QTY', title: '数量', minWidth: 100, align: "center", queryType: 'checkbox',TEST:[{label: '111',value:1},{label: '222',value:2}], set: false, require: true, query: false, hide: false },
            { field: 'ROW_NIO', title: '行号', minWidth: 100, align: "center", queryType: 'input',set: true, require: true, query: false, hide: false },
            { field: 'APPLY_USER', title: '申请人', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: false, hide: false },
            { field: 'ORDER_STATE', title: '下单状态', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: false, hide: false },
            { field: 'INVENTORY_STATE', title: '在库状态', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: false, hide: false },
        		{ field: 'SIGN_USER', title: '审批人', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: false, hide: false },
        	{ field: 'PRICE', title: 'PRICE', minWidth: 100, align: "center", queryType: 'input', set: true, require: true, query: false, hide: false },
   					{ field: 'STATUS', title: '状态', minWidth: 100, align: "center", queryType: 'switch', set: false, require: true, query: false, hide: false },
 				],

		toolColumns:[
						 {field: 'OPER', title: '操作', width: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: false,showFilter:false,showField:false,
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