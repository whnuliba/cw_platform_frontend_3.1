 {
   lazy:false, 
   formStyle:{},
   formModes:[
   {
	   size:'mini',
	   loading:false,
       display:'inline',
       title: '采购订单申请',
       dialogVisible:'poApplyForm',
       dialogShow:false,
       cancelBtnShow:true,
       forms:[
        {"hide":true,"set":false,"field":"PERMISSION","query":false,"width":150,"require":false,"title":"权限码","align":"center",size:'mini',"queryType":"input"},
        {"hide":false,"set":true,"field":"COM_CODE","query":false,"width":150,"require":false,"title":"公司代码","align":"center",size:'mini',"queryType":"input"},
        {"hide":false,"set":true,"field":"FAC_CODE","query":false,"width":150,"require":false,"title":"工厂代码","align":"center",size:'mini',"queryType":"input"},
        {"hide":false,"set":true,"field":"SUPPILER_CODE","query":false,"width":150,"require":false,"title":"供应商","align":"center",size:'mini',"queryType":"input"},
        {"hide":false,"set":true,"field":"SUPPILER_NAME","query":false,"width":150,"require":false,"title":"供应商名","align":"center",size:'mini',"queryType":"input"},
        {"hide":false,"set":true,"field":"PO",readonly:true,"query":false,"width":150,"require":false,"title":"采购订单号","align":"center",size:'mini',"queryType":"input"},	
		{"hide":false,"set":true,"field":"DELIVER_TIME","query":false,"width":150,"require":false,"title":"交货日期","align":"center","queryType":"datetime"},	 
       ],
     
   }
 ]}