 /*
   * @type { function } 
   * @description 跨域文件的URL的target地址，判断文件的ip地址
*/
const  proxyModule = require('@/settingGlobal');
export function urlCommon() {
    return proxyModule.proxyIp.indexOf("10.2.") > 0 ? 'http://10.2.200.219:7703' : 'http://10.3.8.63:7703';
};