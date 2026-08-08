{
  page:{
    showPage:true,
    listQuery: {
      current: 1,
      pageSize: 15
    }
  },
  url:{
           deleteUri:'/cw-wms-app/cw-wms-code/deleteById',
       editUri:'/cw-wms-app/cw-wms-code/updateById',
       addUri:'/cw-wms-app/cw-wms-code/createBaseComponent',
       queryUri:'/cw-wms-app/cw-wms-code/queryPage',
       batchAddUri:'/cw-wms-app/cw-wms-code/batchCreateBaseComponent',
       fileUpload:'/cw-wms-app/cw-wms-code/uploadFile',
       fileDownload:'/cw-wms-app/cw-wms-code/downloadFile',
       removeFile:'/cw-wms-app/cw-wms-code/removeFile',
       query:'/cw-wms-app/cw-wms-code/query',

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
      {text:'重置',icon:'el-icon-refresh-left',permCode:'',background:'',hideText:false,size:'mini',callback:function(e,self){
        self.reset()
      }},
      {text:'增加',icon:'el-icon-plus',permCode:'MF_WMS002755',background:'',size:'mini',hideText:false,callback:function(e,self){
        self.add()
      }},
      {text:'编辑',icon:'el-icon-edit',permCode:'MF_WMS002754',background:'',size:'mini',hideText:false,callback:function(e,self){
        self.edit(self.boxSelectValue[0])
      }},
      {text:'删除',icon:'el-icon-delete',permCode:'MF_WMS002753',background:'',size:'mini',hideText:false,callback:function(e,self){
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
        {"hide":false,"set":true,"field":"CODE1","query":false,"width":150,"require":false,"title":"一级编码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"CODE1_DETAILS","query":false,"width":150,"require":false,"title":"一级编码描述","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"CODE2","query":false,"width":150,"require":false,"title":"二级编码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"CODE2_DETAILS","query":false,"width":150,"require":false,"title":"二级编码描述","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"CODE3","query":false,"width":150,"require":false,"title":"三级编码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"CODE3_DETAILS","width":150,"query":false,"require":false,"title":"三级编码描述","align":"center","queryType":"input"},

  ],

  toolColumns:[
    {field: 'OPER', title: '操作', align: "center", queryType: 'input', set: false, require: true, query: false, hide: false,showFilter:false,showField:false,
      buttons:[
         
         {text:'新增',icon:'el-icon-plus',background:'',size:'mini',show:function(row){return true},permCode:'MF_WMS002755',callback: function(e,self,row,selected){ 
           let obj = {
           		CODE1:row.CODE1 ? row.CODE1 : '',
             	CODE1_DETAILS:row.CODE1_DETAILS ? row.CODE1_DETAILS : '',
            	 ID: '',
            	//CODE1:row.CODE1,
             	//CODE1:row.CODE1,
           }
             self.edit(obj)
         }},
         {text:'新增',icon:'el-icon-plus',background:'',size:'mini',show:function(row){return true},permCode:'MF_WMS002755',callback: function(e,self,row,selected){ 
           let obj = {
           		CODE1:row.CODE1 ? row.CODE1 : '',
             	CODE1_DETAILS:row.CODE1_DETAILS ? row.CODE1_DETAILS : '',
            	CODE2:row.CODE2 ? row.CODE2 : '',
             	CODE2_DETAILS:row.CODE2_DETAILS ? row.CODE2_DETAILS : '',
             ID: '',
           }
             self.edit(obj)
         }},
       // {text:'删除',icon:'el-icon-delete',background:'',size:'mini',show:function(row){return true},permCode:'MF_WMS002755',size:'mini',callback: function(e,self,row,selected){ self.handleDelete(row)}},
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
