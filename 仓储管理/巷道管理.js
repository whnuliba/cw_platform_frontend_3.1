{
  page:{
    showPage:true,
    listQuery: {
      current: 1,
      pageSize: 15
    }
  },
  url:{
       deleteUri:'/cw-wms-app/cw-wms-roadway/deleteById',
       editUri:'/cw-wms-app/cw-wms-roadway/updateById',
       addUri:'/cw-wms-app/cw-wms-roadway/createBaseComponent',
       queryUri:'/cw-wms-app/cw-wms-roadway/queryPage',
       batchAddUri:'/cw-wms-app/cw-wms-roadway/batchCreateBaseComponent',
       fileUpload:'/cw-wms-app/cw-wms-roadway/uploadFile',
       fileDownload:'/cw-wms-app/cw-wms-roadway/downloadFile',
       removeFile:'/cw-wms-app/cw-wms-roadway/removeFile',
       query:'/cw-wms-app/cw-wms-roadway/query',

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
      {text:'增加',icon:'el-icon-plus',permCode:'MF_WMS003067',background:'',size:'mini',hideText:false,callback:function(e,self){
        self.add()
      }},
      {text:'编辑',icon:'el-icon-edit',permCode:'MF_WMS003066',background:'',size:'mini',hideText:false,callback:function(e,self){
        self.edit(self.boxSelectValue[0])
      }},
      {text:'删除',icon:'el-icon-delete',permCode:'MF_WMS003063',background:'',size:'mini',hideText:false,callback:function(e,self){
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
        {"hide":true,"set":false,"field":"LOCATION_ID","query":false,"width":150,"require":false,"title":"位置明细","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"LOCATION_CODE","query":false,"width":150,"require":false,"title":"位置编码","align":"center","queryType":"select-filter",url:'/cw-wms-app/cw-wms-location/query',
            lazy:false,
            modeValue:'id',
            loadData:(val,item,callback)=>{
                 let op = {url:item.url,params:{data:{sqlWhere:[{column:'WARE_CODE',condition:'like%',value:val}] }}}
                 this.actionPost(op).then((data)=>{
                    let arr =[]
                    if(data && data.length){
                    arr = data.map(c=>{
                      return {name:c.WARE_DETAILS,code:c.WARE_CODE,id:c.ID}
                    })
                  }
                   if(callback&& typeof callback==='function')
                        callback.call(this,arr)
                 })

            }, 
            onChange(result,form,item){
              form['LOCATION_CODE']=result.code
               form['LOCATION_ID']=result.id
            }},
        {"hide":false,"set":true,"field":"RW_CODE","query":false,"width":150,"require":false,"title":"巷道编码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"RW_DETAILS","query":false,"width":150,"require":false,"title":"巷道描述","align":"center","queryType":"input"},

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
