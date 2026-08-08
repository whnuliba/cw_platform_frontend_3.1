{
  page:{
    showPage:true,
    listQuery: {
      current: 1,
      pageSize: 15
    }
  },
  url:{
           deleteUri:'/cw-wms-app/cw-wms-base-location/deleteById',
       editUri:'/cw-wms-app/cw-wms-base-location/updateById',
       addUri:'/cw-wms-app/cw-wms-base-location/createBaseComponent',
       queryUri:'/cw-wms-app/cw-wms-base-location/queryPage',
       batchAddUri:'/cw-wms-app/cw-wms-base-location/batchCreateBaseComponent',
       fileUpload:'/cw-wms-app/cw-wms-base-location/uploadFile',
       fileDownload:'/cw-wms-app/cw-wms-base-location/downloadFile',
       removeFile:'/cw-wms-app/cw-wms-base-location/removeFile',
       query:'/cw-wms-app/cw-wms-base-location/query',

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
      {text:'增加',icon:'el-icon-plus',permCode:'MF_WMS002635',background:'',size:'mini',hideText:false,callback:function(e,self){
        self.add()
      }},
      {text:'编辑',icon:'el-icon-edit',permCode:'MF_WMS002634',background:'',size:'mini',hideText:false,callback:function(e,self){
        self.edit(self.boxSelectValue[0])
      }},
      {text:'删除',icon:'el-icon-delete',permCode:'MF_WMS002633',background:'',size:'mini',hideText:false,callback:function(e,self){
        self.handleDelete(self.boxSelectValue[0])
      }},
    ]
  },
  cols: [
            {"hide":true,"set":false,"field":"ID","query":false,"width":150,"require":false,"title":"Id","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"CREATE_TIME","query":false,"width":150,"require":false,"title":"创建时间","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"CREATE_USER","query":false,"width":150,"require":false,"title":"创建人","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"LAST_MODIFY_TIME","query":false,"width":150,"require":false,"title":"修改时间","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"LAST_MODIFY_USER","query":false,"width":150,"require":false,"title":"修改人","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"STATUS","query":false,"width":150,"require":false,"title":"状态","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"PERMISSION","query":false,"width":150,"require":false,"title":"权限码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"BASE_CODE","query":false,"width":150,"require":false,"title":"基地编码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"BASE_NAME","query":false,"width":150,"require":false,"title":"基地名称","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"BASE_PERSON","query":false,"width":150,"require":false,"title":"基地负责人","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"BASE_ATTR","query":false,"width":150,"require":false,"title":"基地属性","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"BASE_TYPE","query":false,"width":150,"require":false,"title":"基地类型","align":"center","queryType":"input"},

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
