<template>
    <div class="app-container">
       <!-- <CreateDefineRalex :bizType="bizType" :bizCode="bizCode"></CreateDefineRalex> -->
       <!-- <component :is="CreateDefineRalex"   :bizType="bizType" :bizCode="bizCode" :componentData="componentData"></component> -->
       <component :is="CwTab"   :tabPanes="tabPanes" :bindValue="bindValue" ></component>

    </div>
  </template>
  <script>
    import i18n from "@/lang";
    //import CreateDefineRalex from "@/components/Cw/CreateDefineRalex"
    export default {
      name: 'CwDenfineView',
      components: {
      CwTab:(resolve)=>{
        import('@/components/Cw/CwTab').then((module)=>{
              resolve(module.default)
          })
      }
    },
      directives: {},
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

      },
      data() {
        const _initdata = {
          bizType:'',
          bizCode:'',
          CreateDefineRalex:'CreateDefineRalex',
          CwTab:'CwTab',
          componentData: undefined,
          tabPanes:[],
          methods:{},
          script:undefined,
          bindValue:{isTab:true,activeName:'name1',bindParams:{}}
        }
        //Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
        return _initdata
      },
      created() {
          console.log(this)
          const fullpath =this.$route.fullPath
          let cp = fullpath
          if (cp && cp != null && cp.indexOf("\\") != -1)
                cp = cp.replace("\\", "/");
          let apArr = cp.split("/");
          if (!apArr.length || apArr.length<3) 
          {
            this.$message({
              type:"error",
              message: '路由错误'
            })
              return
          }     
         this.bizCode = apArr[apArr.length-1];
         this.bizType =apArr[apArr.length-2];
         this.initView()
      },
     mounted(){
       
     },
      methods: {
       renderTable(arr,item){
          let tag = (item.data && item.data.REF_MODEL)?{label:item.data.BIZ_NAME,name:item.data.BIZ_NAME,bizCode:item.data.REF_MODEL,bindValue:{}} : {label:item.data.BIZ_NAME,name:item.data.BIZ_NAME,bindValue:{}}
          if(item.data.REF_MODEL){
             arr.push(tag)
          }
          if(item.children && item.children.length && item.data){
            if(item.children && item.children.length && item.data){
                   let arr = []
                   tag.subTabPanes = arr
                   tag.bindValue.activeName = item.data.BIZ_NAME
                   tag.bindValue.isTab=true
                   item.children.forEach(pan =>{
                      this.renderTable(arr,pan)
                   })
               }
          }
       },
       initView(){
         const self = this
         this.initMode((data)=>{
          self.tabPanes =[]
          data.forEach(item=>{
              let tag = (item.data && item.data.REF_MODEL) ?{label:item.data.BIZ_NAME,name:item.data.BIZ_NAME,bizCode:item.data.REF_MODEL,bindValue:{}}:{label:item.data.BIZ_NAME,name:item.data.BIZ_NAME,bindValue:{}}
              self.tabPanes.push(tag)
              self.bindValue.activeName = item.data.BIZ_NAME
              self.bindValue.isTab=false
               if(item.children && item.children.length && item.data){
                   let arr = []
                   tag.subTabPanes = arr
                   tag.bindValue.activeName = item.data.BIZ_NAME
                   tag.bindValue.isTab=true
                   item.children.forEach(pan =>{
                      this.renderTable(arr,pan)
                   })
               }
          })
          if(data && data.length){
             const item = data[0]
             this.initScript(item.data.SCRIPT)
          }
         })
       }, 
       initMode(callback){
        //获取组件
        const _data = { url: '/biz-define-relax/bizTree/model', params: {data:{bizType:this.bizType,bizCode:this.bizCode}} }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
            .then(data => {
            if(callback && typeof callback==='function')
               callback(data)
            }).catch(err => {
               console.error(err)
            })
        },
        initScript(js){
          const script = eval("("+js+")")
          this.script = script
          this.methods = script.methods
          if(script && script.initAfter){
              script.initAfter(this,this.tabPanes)
          }
        }
      }
    }
  </script>
  
  <style lang="less" scoped>
    .edit-input {
      padding-right: 100px;
    }
  
    .cancel-btn {
      position: absolute;
      right: 15px;
      top: 10px;
    }
  
    .filter-item {
      margin-left: 3px;
    }
  
    ::v-deep .el-input-group__append {
      width: 18px;
      border: 1px solid #0370AA;
      border-left: none;
      background-color: white;
    }
  
   // ::v-deep .el-input__inner {
   //   padding: 0 10px 0 5px;
   // }
  
    .input-with-select {}
  
    .dropdownicon {
      display: inline-block;
      height: 28px;
      border: 1px solid #0370AA;
      border-left: none;
      border-radius: 0 3px 3px 0;
      line-height: 28px;
      margin-right: 10px;
      padding: 0 10px;
    }
  
    ::v-deep .el-form--inline .el-form-item {
      margin-right: 0;
    }
  
    ::v-deep .el-input__inner:hover {
      border: 1px solid #0370AA;
    }
  
    .dropdownicon:hover {
      /* border: 1px solid #DCDFE6; */
      /* border-left: none; */
      cursor: pointer;
    }
  </style>