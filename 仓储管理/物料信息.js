{
  page:{
    showPage:true,
    listQuery: {
      current: 1,
      pageSize: 15
    }
  },
  url:{
           deleteUri:'/cw-wms-app/cw-wms-material/deleteById',
       editUri:'/cw-wms-app/cw-wms-material/updateById',
       addUri:'/cw-wms-app/cw-wms-material/createBaseComponent',
       queryUri:'/cw-wms-app/cw-wms-material/queryPage',
       batchAddUri:'/cw-wms-app/cw-wms-material/batchCreateBaseComponent',
       fileUpload:'/cw-wms-app/cw-wms-material/uploadFile',
       fileDownload:'/cw-wms-app/cw-wms-material/downloadFile',
       removeFile:'/cw-wms-app/cw-wms-material/removeFile',
       query:'/cw-wms-app/cw-wms-material/query',

  },
  customToolBar:{
    show:true,
    showFilter:true,
    showSelectField:true,
    showExport:true,
    columnSelectFilter:true,
    showUpload:true,
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
      {text:'增加',icon:'el-icon-plus',permCode:'MF_WMS002803',background:'',size:'mini',hideText:false,callback:function(e,self){
        self.add()
      }},
      {text:'编辑',icon:'el-icon-edit',permCode:'MF_WMS002802',background:'',size:'mini',hideText:false,callback:function(e,self){
        self.edit(self.boxSelectValue[0])
      }},
      {text:'删除',icon:'el-icon-delete',permCode:'MF_WMS002801',background:'',size:'mini',hideText:false,callback:function(e,self){
        self.handleDelete(self.boxSelectValue[0])
      }},
    ]
  },
  cols: [
        {"hide":false,"set":true,"field":"M_CODE","query":false,"width":150,"require":false,"title":"物料代码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"M_NAME","query":false,"width":150,"require":false,"title":"物料名称","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"M_DETAILS","query":false,"width":150,"require":false,"title":"物料描述","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"UNIT","query":false,"width":150,"require":false,"title":"单位","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"UNIT1","query":false,"width":150,"require":false,"title":"次要单位","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"DN","query":false,"width":150,"require":false,"title":"图号","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"PM_TYPE","query":false,"width":150,"require":false,"title":"采购类型","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"ABC_CATE","query":false,"width":150,"require":false,"title":"ABC分类","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"SP_PM_TYPE","query":false,"width":150,"require":false,"title":"特殊采购类型","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"SPEC","query":false,"width":150,"require":false,"title":"规格型号","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"IS_KEY","query":false,"width":150,"require":false,"title":"是否关键件","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"IS_LOT","query":false,"width":150,"require":false,"title":"是否批次管理","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"MIN_PACK","query":false,"width":150,"require":false,"title":"最小包装数量","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"PACK_SPEC","query":false,"width":150,"require":false,"title":"包装容器规格","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"PULL_TYPE","query":false,"width":150,"require":false,"title":"厂内拉动类型","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"SUPPLIER_NO","query":false,"width":150,"require":false,"title":"供应商编码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"LOT_NO","query":false,"width":150,"require":false,"title":"物料组","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"SEQ_NO","query":false,"width":150,"require":false,"title":"序列号","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"DIST_TYPE","query":false,"width":150,"require":false,"title":"配送方式","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"QTY","query":false,"width":150,"require":false,"title":"数量","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"ROW_NIO","query":false,"width":150,"require":false,"title":"行号","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"APPLY_USER","query":false,"width":150,"require":false,"title":"申请人","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"ORDER_STATE","query":false,"width":150,"require":false,"title":"下单状态","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"INVENTORY_STATE","query":false,"width":150,"require":false,"title":"在库状态","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"SIGN_USER","query":false,"width":150,"require":false,"title":"审批人","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"PRICE","query":false,"width":150,"require":false,"title":"价格","align":"center","queryType":"input"},
		{"hide":false,"set":false,"field":"CREATE_USER_NAME","query":false,"width":150,"require":false,"title":"创建人","align":"center","queryType":"input"},
        {"hide":false,"set":false,"field":"MODIFY_USER_NAME","query":false,"width":150,"require":false,"title":"修改人","align":"center","queryType":"input"},

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
