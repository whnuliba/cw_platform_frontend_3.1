
/**
 * @param data 表格数据内容  array
 * @param fileName 文件标题。必须以 .xlsx结尾
 * 前端创建超链接，接收后端的文件流
 */
export function downloadXlsx(data, fileName) {
        if(!data) return
        // 构造一个blob对象来处理数据，并设置文件类型
        const xlsBlob = new Blob([data], { type: 'application/vnd.ms-excel' }) 
          
        if (window.navigator.msSaveOrOpenBlob) { //兼容IE10
            navigator.msSaveBlob(blob, fileName)
        } else {
            const href = URL.createObjectURL(xlsBlob) //创建新的URL表示指定的blob对象
            const a = document.createElement('a') //创建a标签
            a.style.display = 'none'
            a.href = href // 指定下载链接
            a.download = fileName //指定下载文件名
            a.click() //触发下载
            URL.revokeObjectURL(a.href) //释放URL对象
            a.remove(); // 一次性的，用完就删除a标签
        }
}

export function docDownload(data,fileName) {
    const blob = new Blob([data]); // 把得到的结果用流对象转一下
    var a = document.createElement("a"); //创建一个<a></a>标签
    a.href = URL.createObjectURL(blob); // 将流文件写入a标签的href属性值
    a.download = fileName; //设置文件名
    a.style.display = "none"; // 障眼法藏起来a标签
    document.body.appendChild(a); // 将a标签追加到文档对象中
    a.click(); // 模拟点击了a标签，会触发a标签的href的读取，浏览器就会自动下载了
    a.remove(); // 一次性的，用完就删除a标签
}

export function pdfDownload(data,fileName) {
    // 创建blob对象，解析流数据
    const blob = new Blob([data], {
        type: "application/pdf;chartset=UTF-8",
      });
      const a = document.createElement("a");
      const URL = window.URL || window.webkitURL;
      const herf = URL.createObjectURL(blob);
      a.href = herf;
      // 这里后台不给文件名字需要自己写
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(herf);
}

// 图片下载
export function imgDownload(data,fileName) {
    const blob = new Blob([data])
    if ('download' in document.createElement('a')) { // 非IE下载
	    const dlink = document.createElement('a')
	    dlink.download = fileName
	    dlink.style.display = 'none'
	    dlink.href = URL.createObjectURL(blob)
	    document.body.appendChild(dlink)
	    dlink.click()
	    URL.revokeObjectURL(dlink.href) // 释放URL 对象
	    document.body.removeChild(dlink)
	} else { // IE10+下载
	    navigator.msSaveBlob(blob, fileName)
	}

}

export function videoDownload(data,fileName) {
    const blob = new Blob([data], {
        type: 'application/vnd.ms-excel',
      });
      const a = document.createElement("a");
      const URL = window.URL || window.webkitURL;
      const herf = URL.createObjectURL(blob);
      a.href = herf;
      // 这里后台不给文件名字需要自己写
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(herf);
}
