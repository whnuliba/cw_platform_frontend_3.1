{
	lazy:false,
	formStyle:{},
	formModes:[
	  {
		size: 'mini',
		loading: false,
		display:'inline',
		title: '流程参数',
		dialogVisible:'processeditor',
		dialogShow: true,
		labelWidth:'170px',
		cancelBtnShow:true,
		forms:[
			  { field: 'flowCode', title: '流程编码',minWidth: 120,  align: 'center', queryType: 'input', set: true, require: false, query: false, hide: true, disabled:false },
			//  { field: 'flowVersion', title: '版本号', minWidth: 100, align: "center", queryType: 'input',set: true, require: false, query: false, hide: false },
			  { field: 'flowName', title: '流程名称', minWidth: 100, align: "center", queryType: 'input',set: true, require: false, query: false, hide: false },
			  //{ field: 'cellType', title: '电芯型号', minWidth: 100, align: "center", queryType: 'select', set: true, require: false, query: false, hide: false },  
			  //{ field: 'flowType', title: '流程类型',minWidth: 100,  align: 'center', queryType: 'select', set: true, require: false, query: false, hide: false, disabled:true  },
			  //{ field: 'useState', title: '使用状态',minWidth: 100,  align: 'center', queryType: 'select', set: true, require: false, query: false, hide: false },
			  { field: 'cellType', title: '电芯型号', align: 'center', width: 100, queryType: 'select', set: true, selUri: '/cw-fms-fms/cell-type/guest/getall', itemParams: {}, cellType: ['cellTypeName', 'id'] },
			  { field: 'flowType', title: '流程类型', align: 'center', width: 120, queryType: 'select', set: true, selUri: '/cw-fms-auth/sys-params/sys-p-code', itemParams: { data: "PROCESS.FLOW" }, 
			   flowType: ['paramKey', 'paramValue'] },
			  { field: 'useState', title: '使用状态', align: 'center', width: 120, query: true, set: true, queryType: 'select', jsonSelData: true, useState: [{ label: '启用', value: '1' }, { label: '禁用', value: '0' }] },
		  
		]
	  }
	]
  }