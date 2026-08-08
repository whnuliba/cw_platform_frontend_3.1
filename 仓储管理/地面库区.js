{
  page:{
    showPage:true,
    listQuery: {
      current: 1,
      pageSize: 15
    }
  },
  url:{
           deleteUri:'/cw-wms-app/cw-wms-region/deleteById',
       editUri:'/cw-wms-app/cw-wms-region/updateById',
       addUri:'/cw-wms-app/cw-wms-region/createBaseComponent',
       queryUri:'/cw-wms-app/cw-wms-region/queryPage',
       batchAddUri:'/cw-wms-app/cw-wms-region/batchCreateBaseComponent',
       fileUpload:'/cw-wms-app/cw-wms-region/uploadFile',
       fileDownload:'/cw-wms-app/cw-wms-region/downloadFile',
       removeFile:'/cw-wms-app/cw-wms-region/removeFile',
       query:'/cw-wms-app/cw-wms-region/query',

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
      {text:'增加',icon:'el-icon-plus',permCode:'MF_WMS002935',background:'',size:'mini',hideText:false,callback:function(e,self){
        self.add()
      }},
      {text:'编辑',icon:'el-icon-edit',permCode:'MF_WMS002934',background:'',size:'mini',hideText:false,callback:function(e,self){
        self.edit(self.boxSelectValue[0])
      }},
      {text:'删除',icon:'el-icon-delete',permCode:'MF_WMS002933',background:'',size:'mini',hideText:false,callback:function(e,self){
        self.handleDelete(self.boxSelectValue[0])
      }},
	  {text:'批量创建',icon:'el-icon-edit',permCode:'MF_WMS002937',background:'',size:'mini',hideText:false,callback:function(e,self){
          this.formDialogVisibles['regionDialog']=true
      }}
    ]
  },
    formModes:[{
	   title: '批量创建',
       dialogVisible:'regionDialog',
       dialogShow:false,
       cancelBtnShow:true,
	   forms:[
        {"hide":true,"set":false,"field":"RW_ID","query":false,"width":150,"require":false,"title":"巷道ID","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"RW_CODE","query":false,"width":150,"require":false,"title":"巷道编码","align":"center","queryType":"select-filter",url:'/cw-wms-app/cw-wms-roadway/query',
            lazy:false,
            modeValue:'id',
            loadData:(val,item,callback)=>{
                 let op = {url:item.url,params:{data:{sqlWhere:[{column:'RW_CODE',condition:'like%',value:val}] }}}
                 this.actionPost(op).then((data)=>{
                    let arr =[]
                    if(data && data.length){
                    arr = data.map(c=>{
                      return {name:c.RW_DETAILS,code:c.RW_CODE,id:c.ID}
                    })
                  }
                   if(callback&& typeof callback==='function')
                        callback.call(this,arr)
                 })

            }, 
            onChange(result,form,item){
               form['RW_CODE']=result.code
               form['RW_ID']=result.id
          }},
        {"hide":false,"set":true,"field":"X_AXIS","query":false,"width":150,"require":false,"title":"排","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"Y_AXIS","query":false,"width":150,"require":false,"title":"列数","align":"center","queryType":"input"},
		{"hide":false,"set":true,"field":"Y_AXIS_START","query":false,"width":150,"require":false,"title":"起始列","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"Z_AXIS","query":false,"width":150,"require":false,"title":"层数","align":"center","queryType":"input"},
		{"hide":false,"set":true,"field":"Z_AXIS_START","query":false,"width":150,"require":false,"title":"起始层","align":"center","queryType":"input"},		
        {"hide":false,"set":false,"field":"COMMAND_CODE","query":false,"width":150,"require":false,"title":"通讯码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"RELAX_FORK","query":false,"width":150,"require":false,"title":"关联货叉","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"DEEP","query":false,"width":150,"require":false,"title":"深度","align":"center","queryType":"input"},
	   ],
	    buttons:[
            {text:'确认',hideText:false,icon:'el-icon-success',permCode:undefined,background:'',size:'max',callback:function(e,row,form){
				  //分解位置号
				  if(!(form.X_AXIS>0 &&form.Y_AXIS>0 && form.Y_AXIS_START>0&& form.Z_AXIS>0 && form.Z_AXIS_START>0))
				  {
					  this.$message.error("排列层需要维护")
					  return
				  }
				  let locFormArr = []
				  let x_s = form.X_AXIS<10?`0${form.X_AXIS}`:`${form.X_AXIS}`
				  for(let y=form.Y_AXIS_START;y<=form.Y_AXIS;y++){
					  let y_s = y<10 ? `00${y}`:((y>10 && y<100)?`0${y}`:`${y}`)
					  for(let z=form.Z_AXIS_START;z<=form.Z_AXIS;z++){
						    let z_s = z<10?`0${z}`:`${z}`
						   let locForm = {
							   RACK_CODE:`${x_s}${y_s}${z_s}`,
							   X_AXIS: form.X_AXIS,
							   Z_AXIS: z,
							   Y_AXIS: y,
							   RW_ID:form.RW_ID,
							   RW_CODE: form.RW_CODE,
							   DEEP: form.DEEP,
							   RELAX_FORK: form.RELAX_FORK
						   }
						   locFormArr.push(locForm)
					  }
				  }
				  
				  let op = {url:this.tableInfo.tableCtrlScript.url.batchAddUri,params:{data:{data:locFormArr }}}
				     this.actionPost(op).then((data)=>{
                     this.$message.success("创建成功")
					 this.formDialogVisibles['regionDialog']=false
                 })
			},
			style:{
		   
			}
        },
      ]
	  
  }],
  cols: [
            {"hide":true,"set":false,"field":"ID","query":false,"width":150,"require":false,"title":"Id","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"CREATE_TIME","query":false,"width":150,"require":false,"title":"创建时间","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"CREATE_USER","query":false,"width":150,"require":false,"title":"创建人","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"LAST_MODIFY_TIME","query":false,"width":150,"require":false,"title":"修改时间","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"LAST_MODIFY_USER","query":false,"width":150,"require":false,"title":"修改人","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"STATUS","query":false,"width":150,"require":false,"title":"状态","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"PERMISSION","query":false,"width":150,"require":false,"title":"权限码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"RW_CODE","query":false,"width":150,"require":false,"title":"巷道编码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"RW_ID","query":false,"width":150,"require":false,"title":"巷道ID","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"LOCATION_CODE","query":false,"width":150,"require":false,"title":"位置编码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"LOCATION_GROUP","query":false,"width":150,"require":false,"title":"组编码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"X_AXIS","query":false,"width":150,"require":false,"title":"X坐标","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"Y_AXIS","query":false,"width":150,"require":false,"title":"Y坐标","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"Z_AXIS","query":false,"width":150,"require":false,"title":"Z坐标","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"COMMAND_CODE","query":false,"width":150,"require":false,"title":"通讯码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"RELAX_FORK","query":false,"width":150,"require":false,"title":"关联货叉","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"DEEP","query":false,"width":150,"require":false,"title":"深度","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"RACK_CODE","query":false,"width":150,"require":false,"title":"排号","align":"center","queryType":"input"},

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
