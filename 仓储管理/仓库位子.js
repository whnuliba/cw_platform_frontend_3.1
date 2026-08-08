{
  page:{
    showPage:true,
    listQuery: {
      current: 1,
      pageSize: 15
    }
  },
  url:{
           deleteUri:'/cw-wms-app/cw-wms-location/deleteById',
       editUri:'/cw-wms-app/cw-wms-location/updateById',
       addUri:'/cw-wms-app/cw-wms-location/createBaseComponent',
       queryUri:'/cw-wms-app/cw-wms-location/queryPage',
       batchAddUri:'/cw-wms-app/cw-wms-location/batchCreateBaseComponent',
       fileUpload:'/cw-wms-app/cw-wms-location/uploadFile',
       fileDownload:'/cw-wms-app/cw-wms-location/downloadFile',
       removeFile:'/cw-wms-app/cw-wms-location/removeFile',
       query:'/cw-wms-app/cw-wms-location/query',

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
      {text:'增加',icon:'el-icon-plus',permCode:'MF_WMS002599',background:'',size:'mini',hideText:false,callback:function(e,self){
        self.add()
      }},
      {text:'编辑',icon:'el-icon-edit',permCode:'MF_WMS002598',background:'',size:'mini',hideText:false,callback:function(e,self){
        self.edit(self.boxSelectValue[0])
      }},
      {text:'删除',icon:'el-icon-delete',permCode:'MF_WMS002595',background:'',size:'mini',hideText:false,callback:function(e,self){
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
        {"hide":true,"set":false,"field":"BASE_ID","query":false,"width":150,"require":false,"title":"基地ID","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"BASE_CODE","query":false,"width":150,"require":false,"title":"基地编码","align":"center","queryType":"select-filter",url:'/cw-wms-app/cw-wms-base-location/query',
            lazy:false,
            modeValue:'id',
            loadData:(val,item,callback)=>{
                 let op = {url:item.url,params:{data:{sqlWhere:[{column:'BASE_CODE',condition:'like%',value:val}] }}}
                 this.actionPost(op).then((data)=>{
                    let arr =[]
                    if(data && data.length){
                    arr = data.map(c=>{
                      return {name:c.BASE_NAME,code:c.BASE_CODE,id:c.ID}
                    })
                  }
                   if(callback&& typeof callback==='function')
                        callback.call(this,arr)
                 })

            }, 
            onChange(result,form,item){
              form['BASE_CODE']=result.code
               form['BASE_ID']=result.id
            }},
        {"hide":false,"set":true,"field":"WARE_CODE","query":false,"width":150,"require":false,"title":"仓库编码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"WARE_DETAILS","query":false,"width":150,"require":false,"title":"仓库描述","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"WARE_LOCATION","query":false,"width":150,"require":false,"title":"仓库位置","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"WARE_TYPE","query":false,"width":150,"require":false,"title":"仓库类型","align":"center","queryType":"select", selUri:'/cw-wms-app/cw-wms-code/query-code' ,selectArgs:{data:{code1:'WareTypes'}},WARE_TYPE:['CODE2_DETAILS','CODE2']},


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
