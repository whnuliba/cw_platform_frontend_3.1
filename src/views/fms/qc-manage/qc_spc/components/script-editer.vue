<template>
  <div class="app-container">
          <div class="in-coder-panel" >
            <codemirror v-model="code" :options="options" ></codemirror>
           
        </div>
  </div>

</template>

<script>
import waves from "@/directive/waves"; // waves directive
import elDragDialog from "@/directive/el-drag-dialog";
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import i18n from '@/lang';
  // 引入全局实例
  //import CodeMirror from 'codemirror'
  import {codemirror} from 'vue-codemirror'
  // 核心样式
  import 'codemirror/lib/codemirror.css'
  // 引入主题后还需要在 options 中指定主题才会生效
  import 'codemirror/theme/cobalt.css'

  // 需要引入具体的语法高亮库才会有对应的语法高亮效果
  // codemirror 官方其实支持通过 /addon/mode/loadmode.js 和 /mode/meta.js 来实现动态加载对应语法高亮库
  // 但 vue 貌似没有无法在实例初始化后再动态加载对应 JS ，所以此处才把对应的 JS 提前引入
  import 'codemirror/mode/javascript/javascript.js'
  import 'codemirror/mode/css/css.js'
    import 'codemirror/mode/yaml/yaml.js'
        import 'codemirror/mode/yaml-frontmatter/yaml-frontmatter.js'
  import 'codemirror/mode/xml/xml.js'
  import 'codemirror/mode/clike/clike.js'
  import 'codemirror/mode/markdown/markdown.js'
  import 'codemirror/mode/python/python.js'
  import 'codemirror/mode/r/r.js'
  import 'codemirror/mode/shell/shell.js'
  import 'codemirror/mode/sql/sql.js'
  import 'codemirror/mode/swift/swift.js'
  import 'codemirror/mode/vue/vue.js'

export default {
  name: 'script_eidtor',
  components: { Pagination,codemirror },
 directives: { waves, elDragDialog },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '未启用',
        1: '启用'
      }
      return statusMap[status]
    }
  },
 props: {
      // 外部传入的内容，用于实现双向绑定
      value: String,
      // 外部传入的语法类型
      language: {
        type: String,
        default: null
      },
      scriptsEditer:String,
      width:{
        type:String,
        default:()=>'100%'
      },
      height:{
        type:String,
        default:()=>'calc(100vh - 100px)'
      },
    },
    mounted () {
      // 初始化
      //this._initialize()
      this.initRact()
    },
  data() {
    const  _initdata ={

       content: '',
        // 默认配置
        // options: {
        //   tabSize: 2, // 缩进格式
        //   theme: 'rubyblue', // 指定主题，对应主题库 JS 需要提前引入
        //   lineNumbers: true, // 是否显示行号
        //   //指定语言类型,如果需要编辑和显示其他语言,需要import语言js然后修改此配置
        //   mode: 'Javascript',
        //   line: true,
        //   styleActiveLine: true, // 高亮选中行
        //   //是否为只读,如果为"nocursor" 不仅仅为只读 连光标都无法在区域聚焦
        //   readOnly: true,
        //   hintOptions: {
        //     completeSingle: true // 当匹配只有一项的时候是否自动补全
        //   }
        // },
        scriptValue:'',
// 内部真实的内容
        code: '',
        // 默认的语法类型
        mode: 'yaml',
        // 编辑器实例
        coder: null,
        // 默认配置
        options: {
          height:'1024px',
          // 缩进格式
          tabSize: 2,
          // 主题，对应主题库 JS 需要提前引入
          theme: 'cobalt',
          // 显示行号
          lineNumbers: true,
          line: true
        },

        // 支持切换的语法高亮类型，对应 JS 已经提前引入
        // 使用的是 MIME-TYPE ，不过作为前缀的 text/ 在后面指定时写死了
        modes: [{
          value: 'css',
          label: 'CSS'
        }, {
          value: 'javascript',
          label: 'Javascript'
        }, {
          value: 'html',
          label: 'XML/HTML'
        }, {
          value: 'x-java',
          label: 'Java'
        }, {
          value: 'x-objectivec',
          label: 'Objective-C'
        }, {
          value: 'x-python',
          label: 'Python'
        }, {
          value: 'x-rsrc',
          label: 'R'
        }, {
          value: 'x-sh',
          label: 'Shell'
        }, {
          value: 'x-sql',
          label: 'SQL'
        }, {
          value: 'x-swift',
          label: 'Swift'
        }, {
          value: 'x-vue',
          label: 'Vue'
        }, {
          value: 'markdown',
          label: 'Markdown'
        }]
    }
    //Object.assign(_initdata.defaultForm.params,this.initData(_initdata.cols))
    return _initdata
  },
  watch:{
   code(val){
       this.$emit('changeScript', val)
    },
    
  },
  created() {
   
    //     this.coder.setOption('mode', `text/javascript`)
    //   // 获取修改后的语法
    //     let label = this._getLanguage('javascript').label.toLowerCase()

    //     // 允许父容器通过以下函数监听当前的语法值
    //     this.$emit('language-change', label)

  },
  methods: {
    initRact(style){
        const el = this.$el
        const codemirror = el.getElementsByClassName('CodeMirror')[0]
        if(style){
          codemirror.style.width=style.width||this.width
          codemirror.style.height=style.height||this.height
        }else{
          codemirror.style.height=this.height
          codemirror.style.width=this.width
        }

      },
    initScript(val){
      if(val){
        let params = {
          url:val.url,
          title:val.title,
          calcNo:val.calcNo,
          ...JSON.parse(val.fieldText)
        }
        let str = JSON.stringify(params).split(',').map(item=>{
          return item = item +'\n'
        })
        this.code = str.toString()
      }else{
        //  let params = {
        //   data:{},
        //   resourceNo:'TEST_DEMO_EL_SPC'
        // }
        //  const _data = {url:'/esb/api/invoke',params}
        //   this.$store.dispatch('fmsCommon/actionTaskPost',_data)
        //   .then(data => {
            let params = {
              url:'/esb/api/invoke',
              title:'无标题',
              calcNo:'',
              resourceNo:'',
              // ...data,
            }
            
            
            let str = JSON.stringify(params).split(',').map(item=>{
              return item = item +'\n'
            })
            this.code = str.toString()

          // }).catch(err => {
          //     console.error(err)
          // }).finally(()=>{
      //  })

      }
     
             
    },
     
    
  }
}
</script>
<style scoped>
.spclayout{
  background-color: #f0f2f5;
  
}
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.filter-item{
  margin-left: 3px;
}
/* .Codemirror{
  height: 1000px !important;
} */
.CodeMirror-scroll {
  /* height: 600px !important; */
  overflow-y: hidden;
  overflow-x: auto;
}
.CodeMirror {
    font-family: monospace;
    min-height: 600px !important;
    color: black;
    direction: ltr;
}
</style>
