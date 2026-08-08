import CwTable from "@/components/Cw/CwTable"
export default {
  name: 'CreateDenfineRalex',
  props: {
     bizType: {
        type: String,
        default: ''
     },
     bizCode: {
        type: String,
        default: ''
     }, 
     componentData:{
       type: Object,
       default :()=>{
         return {}
       }
     }
  },
  data(){
      return {
          modeTree:[],
          activeName:'test2'

      }

  },
 async created(){

 },
  mounted(){
    let h = this.$createElement
    let vnode = this.createEle(h)

    console.log(this.bizType,this.componentData)
    //let el = document.createElement(vnode.tag)
    //this.$el.appendChild(el)
  },
  methods: {
      async initMode(callback){
        //获取组件
        const _data = { url: '/biz-define-relax/bizTree/model', params: {data:{bizType:this.bizType,bizCode:this.bizCode}} }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
            .then(data => {
            this.modeTree = data
            if(callback && callback==='function')
               callback(data)
            }).catch(err => {
               console.error(err)
            })
      },
      createTab(h,options,pane){
        return h("el-tabs", {
            props:options.props,
            attrs:options.attrs,
            on: { tabClick: this.handleTabClick }
          },pane)
      },
      createTabPane(h,options,tag){
        return h("el-tab-pane", {
          props:options.props,
          attrs:options.attrs
        },tag)
      },
      handleTabClick() {
        console.log("Tab clicked");
      },
      handleModel(model){
         let modeTree = model
         //第一个是创建一张页面
         if(modeTree==null || modeTree==undefined || modeTree.length==0)
           return 
          let m = modeTree[0]
          const childs = m.children[0]
          console.log(childs)
          

      },
      createEle(h){
        let props ={ activeName: this.activeName } 
        let arr = []
        let paneOption = {props:{},attrs:{label: '标签1',name:'test'}}
        let pane = this.createTabPane(h,paneOption, 'Content of Tab Panel 1')
        arr.push(pane)
        let paneOption1 = {props:{},attrs:{label: '标签2',name:'test2'}}
        let pane1 = this.createTabPane(h,paneOption1, 'Content of Tab Panel 2')
        arr.push(pane1)
        let tabOption = {props:props,attrs:{}}
        let tab = this.createTab(h,tabOption,arr)
        return tab
      }
  }
  ,
    render(h){
      console.log(this)
      // this.initMode()
       let v = this.createEle(h)
       console.log(v)
       return   h("div",{id:111111111111111},'Content of Tab Panel 2')//this.createEle(h)
  }
  // render(h) {
  //   return h('div', [
  //     // 创建 el-tabs 标签并设置属性
  //     h('el-tabs', { props: { activeName: 'tab1' }, on: { tabClick: this.handleTabClick }}, [
  //       // 添加选项卡内容
  //       h('el-tab-pane', { attrs: { label: 'Tab 1' }}, 'Content of Tab Panel 1'),
  //       h('el-tab-pane', { attrs: { label: 'Tab 2' }}, 'Content of Tab Panel 2')
  //     ])
  //   ])
  // }
}