 {
   lazy:false, 
   formStyle:{},
   formModes:[
   {
	   size:'mini',
	   labelWidth:'80px',
	   loading:false,
       display:'inline',
       title: '商品申请',
       dialogVisible:'spuApplyForm',
       dialogShow:false,
       cancelBtnShow:true,
       forms:[
        {"hide":false,"set":false,"field":"CREATE_TIME","query":false,"width":150,"require":false,"title":"创建时间","align":"center","queryType":"input"},
        {"hide":false,"set":false,"field":"CREATE_USER","query":false,"width":150,"require":false,"title":"创建人","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"STATUS","query":false,"width":150,"require":false,"title":"状态","align":"center","queryType":"input"},
        {"hide":true,"set":false,"field":"PERMISSION","query":false,"width":150,"require":false,"title":"权限码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"GOODS_CODE",readonly:true,"query":false,"width":150,"require":false,"title":"商品编码","align":"center","queryType":"input"},
        {"hide":false,"set":true,"field":"GOODS_NAME","query":false,"width":150,"require":false,"title":"商品描述","align":"center","queryType":"input"}, 
       ],
     
   }
 ]}