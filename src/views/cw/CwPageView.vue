<template>
    <div class="preview" style="overflow: auto;position: absolute;">
      <CwView :page="page" @initPageCode="initPageCode"/>
    </div>
  </template>
  <script>
  import CwView from "./CwView.vue"
  //,transform : 'rotate(' + item.attribute.rotationAngle + 'deg)'  对于带有模态的不能增加旋转
  export default {
    name: 'CwPageView',
    components: {CwView},
    directives: {},
    filters: {},
    props: {
      width: {
        type: Number,
        default: () => { return 1920 }
      },
      height: {
        type: Number,
        default: () => { return 1080 }
      }
    },
    data() {
      const _initdata = {
        page: undefined,
        componentData:[],
        componentModalObj:{},
        fullElementCodeHanler : {},
        vueContext:{},
        methods:{},
        bizCode:undefined
      }
      //Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
      return _initdata
    },
    created() {
        //通过路由获取  
        const fullpath =this.$route.path
        let cp = fullpath
        if (cp && cp != null && cp.indexOf("\\") != -1)
                cp = cp.replace("\\", "/");
        let apArr = cp.split("/");
        if (!apArr.length || apArr.length<2) 
        {
            this.$message({
            type:"error",
            message: '路由错误'
            })
            return
        }
    
        let bizCode  = apArr[apArr.length-1];
        if(!bizCode)
        {
            this.$message({
            type:"error",
            message: '路由编码不存在'
            })
            return 
        }
        this.bizCode =bizCode
    },
    mounted() {
    },
    methods: {
        // initPageCode(callback){
        //     this.initPage()
        // },
        initPageCode(callback){
            const _data = {
        url: '/biz-define-relax/query', params: {
          data: {
            sqlWhere: [
              {
                column: 'BIZ_CODE',
                condition: '=',
                value: this.bizCode
              }]
          }
        }
      }
      this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        .then(data => {
            if(data && data.length)
            {           
                   this.page = JSON.parse(data[0].SCRIPT) 
                   if(callback && typeof callback==='function'){
                      callback(this.page)
                   }
            }           
              else{
                this.$message({
                type:"error",
                message: '页面信息不存在'
            })
             }
        })
        }
    }
  }
  </script>
     
  <style lang="less" scoped>
  .preview{
    width: 100%;
    height: 100%;
  }
  </style>