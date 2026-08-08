const _module = []
const files = require.context('./', false, /\.vue$/)
files.keys().forEach((key) => {
    _module[key.replace(/(\.\/|\.vue)/g, '')] = files(key).default
})
export   function modules(){
    const modules = []
    const files = require.context('./', false, /\.vue$/)
    files.keys().forEach((key) => {
    modules[key.replace(/(\.\/|\.vue)/g, '')] = files(key).default
    })
    return modules
}
export default _module
