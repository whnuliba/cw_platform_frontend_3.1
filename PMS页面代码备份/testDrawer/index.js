{
  created(){
     let _this = this;
   //  console.log(this.vueContext)
     
    this.initProcessAddSelect()
   // this.initTreeData('cw-fms-fms/process-flow-tmp-dts/guest/get-dts',{data:'1709819688860725248'})

    _this.initProcessAddSelect()
    
    
   
  },
  mounted(){
    let _this = this;
   //	this.addEventListener('CwButton1','click',this.clickToJump)
    _this.initProcessAddSelect()
     this.addEventListener('CwTree1','node-click',this.treeSingelClick)
  },
    
   treeSingelClick(r){
     let _this = this
     //console.log(1,r.detail[0].template)
     if(r.detail[0].template=='standTimeModel'){
       _this.vueContext['CwForm1'].formModes[0].forms  =_this.vueContext['CwForm1'].formModes[0].standTimeforms
       _this.vueContext['CwForm2'].formModes[0].forms  =_this.vueContext['CwForm1'].formModes[0].standTimeforms
     }else if (r.detail[0].template=='OCV1Model'){
        _this.vueContext['CwForm1'].formModes[0].forms  =_this.vueContext['CwForm1'].formModes[0].OCV1forms
       _this.vueContext['CwForm2'].formModes[0].forms  = []
     }
   },
  initTreeData(url,param){
    let _this = this;
    _this.vueContext['CwTree1'].init(url,param)
   
  },
  clickToJump() {
        let _this = this;
     
        _this.vueContext['CwDrawerPanel1'].drawerVisible =true
      
    },
   initProcessAddSelect() {
      let _this = this;
      const _data = { url: "/cw-fms-auth/sys-params/sys-p-code", params: {data:"PROCESS.FLOW"} };
      this.$store.dispatch("fmsCommon/actionPost", _data).then((data) => {
      if (data.length > 0) {
       
       // console.log('11',  _this.vueContext['CwForm1'].initSelect)
        _this.$set(_this.vueContext['CwForm3'].initSelect,'flowType', data.map(sel => {
          return {
            label: sel.paramKey,
            value: sel.paramValue
          }	
        }))
      //	_this.vueContext['CwForm1'].initSelect['ocvChoose'] = 
        
     }
 
    });
      _this.$set(_this.vueContext['CwForm3'].initSelect,'useState',[
        {label: '禁用', value: '0'},
        {label: '启用', value: '1'},
      ])
     
  },
  tabChange(val) {
      let _this= this;
    this.vueContext['CwDrawerPanel1'].drawerVisible = true;
  },


  
}