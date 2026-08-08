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
    show:false,
    showFilter:true,
    showSelectField:true,
    showExport:true,
    columnSelectFilter:true,
    showUpload:true,
	indexVisible:true,
	boxSelectVisible:false,
	showFilterBar:false,
    btnStyles:{
      float:'left'
    },
    buttons:[
      {text:'查询',show:true,key:'query',icon:'el-icon-search',background:'',size:'mini',hideText:false,callback:function(e,self){
        self.fieldFormQuery()
      },
      style:{
      }
      },
      {text:'重置',show:true,key:'reset',icon:'el-icon-refresh-left',background:'',hideText:false,size:'mini',callback:function(e,self){
        self.reset()
      }},
      {text:'增加' ,show:true,key:'add',icon:'el-icon-plus',permCode:'MF_WMS003115',background:'',size:'mini',hideText:false,callback:function(e,self){
        self.add()
      }},
      {text:'编辑',show:true,key:'edit',icon:'el-icon-edit',permCode:'MF_WMS003114',background:'',size:'mini',hideText:false,callback:function(e,self){
        self.edit(self.boxSelectValue[0])
      }},
      {text:'删除' ,show:true,key:'delete',icon:'el-icon-delete',permCode:'MF_WMS003113',background:'',size:'mini',hideText:false,callback:function(e,self){
        self.handleDelete(self.boxSelectValue[0])
      }},
    ]
  },
  cols: [
        {"hide":true,"set":false,"field":"CREATE_TIME","query":false,"width":150,"require":false,"title":"创建时间","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"CREATE_USER","query":false,"width":150,"require":false,"title":"创建人","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"STATUS","query":false,"width":150,"require":false,"title":"状态","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"PERMISSION","query":false,"width":150,"require":false,"title":"权限码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"GOODS_CODE","query":false,"width":150,"require":false,"title":"商品编码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"SPU_ATTR","query":false,"width":150,"require":false,"title":"属性标识","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"SPU_ATTR_DETAILS","query":false,"minWidth":150,"require":false,"title":"属性描述","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"SPU_ATTR_DETAILS2","query":false,"minWidth":150,"require":false,"title":"二级属性描述","align":"center","queryType":"input"},

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
