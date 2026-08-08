{
  page:{
    showPage:true,
    listQuery: {
      current: 1,
      pageSize: 15
    }
  },
  url:{
           deleteUri:'/cw-wms-app/cw-wms-sku/deleteById',
       editUri:'/cw-wms-app/cw-wms-sku/updateById',
       addUri:'/cw-wms-app/cw-wms-sku/createBaseComponent',
       queryUri:'/cw-wms-app/cw-wms-sku/queryPage',
       batchAddUri:'/cw-wms-app/cw-wms-sku/batchCreateBaseComponent',
       fileUpload:'/cw-wms-app/cw-wms-sku/uploadFile',
       fileDownload:'/cw-wms-app/cw-wms-sku/downloadFile',
       removeFile:'/cw-wms-app/cw-wms-sku/removeFile',
       query:'/cw-wms-app/cw-wms-sku/query',

  },
  customToolBar:{
    show:true,
    showFilter:true,
    showSelectField:true,
    showExport:true,
    columnSelectFilter:true,
    showUpload:true,
	showFilterBar:false,
    btnStyles:{
      float:'left'
    },
    buttons:[
      {text:'查询',icon:'el-icon-search',background:'',size:'mini',hideText:true,callback:function(e,self){
        self.fieldFormQuery()
      },
      style:{
      }
      },
      {text:'重置',icon:'el-icon-refresh-left',background:'',hideText:true,size:'mini',callback:function(e,self){
        self.reset()
      }},
      {text:'增加',icon:'el-icon-plus',permCode:'MF_WMS003007',background:'',size:'mini',hideText:true,callback:function(e,self){
        self.add()
      }},
      {text:'编辑',icon:'el-icon-edit',permCode:'MF_WMS003006',background:'',size:'mini',hideText:true,callback:function(e,self){
        self.edit(self.boxSelectValue[0])
      }},
      {text:'删除',icon:'el-icon-delete',permCode:'MF_WMS003005',background:'',size:'mini',hideText:true,callback:function(e,self){
        self.handleDelete(self.boxSelectValue[0])
      }},
    ]
  },
  cols: [
        {"hide":true,"set":false,"field":"CREATE_TIME","query":false,"width":150,"require":false,"title":"创建时间","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"CREATE_USER","query":false,"width":150,"require":false,"title":"创建人","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"STATUS","query":false,"width":150,"require":false,"title":"状态","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"PERMISSION","query":false,"width":150,"require":false,"title":"权限码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"SKU","query":false,"width":150,"require":false,"title":"SKU","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"GOODS_CODE","query":false,"width":150,"require":false,"title":"商品编码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"ATTR_ID","query":false,"width":150,"require":false,"title":"ATTR_ID","align":"center","queryType":"input"},

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
