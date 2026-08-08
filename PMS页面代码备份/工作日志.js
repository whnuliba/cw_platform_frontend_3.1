{
 page:{
   showPage:true,
   listQuery: {
      current: 1,
      pageSize: 15
   } 
 },
 url:{
    deleteUri:'/cw-pms-app/pms-work-task-item/deleteById',
    editUri:'/cw-pms-app/pms-work-task-item/updateById',  
    addUri:'/cw-pms-app/pms-work-task-item/createBaseComponent',  
    queryUri:'/cw-pms-app/pms-work-task-item/queryPage', 
    batchAddUri:'/cw-pms-app/pms-work-task-item/batchCreateBaseComponent'  
 },  
 customToolBar:{
           show:true,
           showFilter:true,
           showSelectField:true,  
           showExport:true,
           columnSelectFilter:true,
           showUpload:false,
               
           buttons:[
               {text:'查询',icon:'el-icon-search',permCode:'pms-work-task_query',background:'',size:'mini',hideText:true,callback:function(e,self){
                   self.fieldFormQuery()
                },
                style:{
                float: 'left'
                }
               },
              {text:'重置',icon:'el-icon-refresh-left',background:'',hideText:true,size:'mini',callback:function(e,self){
                   self.reset()
                },
                style:{
                float: 'left'
                }},
              {text:'增加',icon:'el-icon-plus',background:'',permCode:'no_permCode',size:'mini',hideText:true,callback:function(e,self){
                   self.add()
                },
                style:{
                float: 'left'
                }},
              {text:'编辑',icon:'el-icon-edit',background:'',permCode:'no_permCode',size:'mini',hideText:true,callback:function(e,self){
                self.edit(self.boxSelectValue[0])
                },
                style:{
                float: 'left'
                }},
              {text:'删除',icon:'el-icon-delete',background:'',permCode:'no_permCode',size:'mini',hideText:true,callback:function(e,self){
                  self.handleDelete(self.boxSelectValue[0])
                },
                style:{
                float: 'left'
                }},
           ]
        }, 
 cols: [
            { field: 'DEMAND_CODE', title: '任务编码', minWidth: 100, align: "center", queryType: 'input',set: false, require: false, query: true, hide: false },
            { field: 'PROJECT_ID', title: 'PROJECT_ID', minWidth: 120, align: "center", queryType: 'input', set: false, require: false, query: true, hide: true },
            { field: 'CREATE_TIME', title: '创建时间', minWidth: 100, align: "center", queryType: 'daterange', set: false, require: false, query: false, hide: false},
            { field: 'PERMISSION', title: '权限标识', minWidth: 100, align: "center", queryType: 'input', set: false, require: false, query: false, hide: true },
            { field: 'TASK_NO', title: '日志号', minWidth: 100, align: "center", queryType: 'input', set: true, require: false, query: false, hide: false },

            { field: 'RAISE_USER', title: '提出人', minWidth: 100,align: 'center', queryType: 'input', set: false, require: false, query: true, hide: true },
            { field: 'APPROVAL_USER', title: '审核人', minWidth: 100, align: "center", queryType: 'input', set: false, require: false, query: false, hide: true },
   					{ field: 'COMPLETE_USER', title: '指派到', minWidth: 100,align: 'center', queryType: 'input', set: false, require: false, query: false, hide: false },
            { field: 'SURE_USER', title: '确认人', minWidth: 100, align: "center", queryType: 'input', set: false, require: false, query: false, hide: true },
      
            { field: 'DEMAND_LEVEL', title: '任务等级', minWidth: 100, align: "center", queryType: 'select', set: false, selUri:'/cw-pms-app/app/constant/task-levels',DEMAND_LEVEL:['name','value'],require: false, query: false, hide: true },
            { field: 'STYLE_COLOR', title: '样式颜色', minWidth: 100, align: "center", queryType: 'input', set: false, require: false, query: false, hide: true },   
            { field: 'EXTEND_ATTR', title: '扩展属性', minWidth: 100, align: "center", queryType: 'input', set: false, require: false, query: false, hide: true },
            { field: 'ATTACHMENT2', title: '附件2', minWidth: 100, align: "center", queryType: 'input', set: false, require: false, query: false, hide: true },
            { field: 'ATTACHMENT3', title: '附件3', minWidth: 100, align: "center", queryType: 'input', set: false, require: false, query: false, hide: true },
             { field: 'DESCRIPTION', title: '已完成事项', minWidth: 150, align: "center", queryType: 'textarea',style:{width:'600px'}, charNum:5,set: true, require: false, query: false, hide: false },
            { field: 'WORK_CONTENT', title: '计划事项', minWidth: 150, align: "center", queryType: 'textarea',style:{width:'600px'}, charNum:5, set: true, require: false, query: false, hide: false },
            { field: 'REMARK', title: '异常说明', minWidth: 100, align: "center", queryType: 'textarea',style:{width:'600px'}, set: true, require: false, query: false, hide: true },
            { field: 'STATUS', title: '状态', minWidth: 100, align: "center", queryType: 'switch', set: false, require: true, query: false, hide: true },
            { field: 'ATTACHMENT1', title: '附件1', minWidth: 200, align: "center", queryType: 'file', set: false, require: false, query: false, hide: false },

          ],
toolColumns:[
                 {field: 'OPER', title: '操作', width: 100, align: "center", queryType: 'input', set: false, require: true, query: false, hide: true,showFilter:false,showField:false,
                     buttons:[
                              {text:'删除',icon:'el-icon-delete',background:'',permCode:'pms-work-task_delete',size:'mini',callback: function(e,self,row,selected){ self.handleDelete(row)}}
                          ]
                       }
                     ],
formConfig: {
			inline: true,
	},
}