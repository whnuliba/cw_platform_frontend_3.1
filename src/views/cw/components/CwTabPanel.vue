/*
* @CreatAuthor: sdf
*/
<template>
    <div class="cw-el-tab-panel">
        <el-tabs ref="myTabPanel"  @tab-remove="(val)=>handlerEvent('tab-remove',val)"	 @tab-click="(val)=>handlerEvent('tab-click',val)" >
            <el-tab-pane  v-for="(item,i) in this.component.tabPanels" :v-if="false" :key="'tabPanel'+i"  :label="commonI18n(item.label)"  :name="item.name" :disabled="item.disabled">
                <div class="cw-el-tab-panel-item">
                        <CwSubPanel 
                            :component="item.component"
                            :componentData="componentData"  
                            :itemStyle="{ width : component.styles.width, height : component.styles.height}"
                        />
                    </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
  import CwSubPanel from "./CwSubPanel.vue"
  import {dispatchEvent,deepCopy} from "../utils/eventUtils"
export default {
  name: 'CwTabPanel',
  components: { CwSubPanel },
  directives: {},
  filters: {},
  props: {
    itemStyle: {
        type: Object,
        default: () => {
          return {}
        }
      },
      componentModalObj: {
        type: Object,
        default: () => {
          return {}
        }
      },
      itemVal: {
        type: String,
        default: ''
      },
      compId: {
        type: String,
        default: ''
      },
      fieldName: {
        type: String,
        default: ''
      },
      component:{
          type: Object,
          default: () =>{
            //tabPanels:[{label:'页签1',name:'first'},{label:'页签2',name:'second'}]
          }
        },
        componentData: {
        type: Array,
        default: () => {
          return []
        }
       },
       bindData:{
      type: Object,
      default: () =>{}
    },
    dataSource: {
            type: Array,
            default: () => []
    },
  },
  watch: {
    'component.elementCode':{
        handler: function (newVal, oldVal) {
        if (newVal) {
            //const json  = JSON.parse(newVal)
            let json =  this.renderElementCode(newVal)//eval("("+newVal+")") //JSON.parse(val.scripts)

            // let arr = []
            // //获取私有的属性
            // if(json && json.tabs){
            //     this.createTabPanel(json.tabs )
            //     this.tabs = this.component.tabPanels
            // }
        }
      },
      deep: true
    },
    itemStyle: {
      handler: function (newVal, oldVal) {
        if (newVal) {
              this.height=newVal.height
        }
      },
      deep: true
    },
  },
  data() {
    const _initdata = {
      methods:{},
        vueContext:{},
        width:'100%',
        height:'400px',
        //  tabPanels:[{label:'页签1',name:'first',component:{}}]
        sourceObj: this.component,
        tabs:[{label:'页签1',name:'tabname1'},{label:'页签2',name:'tabname2'}]
    }
    return _initdata
  },
  created() {
    if(!this.component.tabPanels)
        this.component.tabPanels = []
 
     this.$nextTick(()=>{
        // if(this.component.elementCode)
        // this.renderElementCode(this.component.elementCode)
        if(this.component.tabPanels.length>0)
            this.tabs = this.component.tabPanels 
        if(this.component.tabPanels.length==0){
            this.component.elementCode = JSON.stringify({tabs:this.tabs})

       }
     })
     this.width=this.component.styles.width
     this.height=this.component.styles.height

   },
  mounted() { 
   
    // for (let i in this.itemStyle) {
    //         this.$refs.myref.$el.children[1].style[i] = this.itemStyle[i]
    //       }
  },
  methods: {
    comText() {
      return '页签面板'
    },
    ificationType() {
      return {
        classification: '布局容器组件',
        isCanvasview: false,
      }
    },
    getStyleCols() {
      return [
        { field: 'width', title: '长度', queryType: 'input', defaultValue: '100%', unit: 'px' },
        { field: 'height', title: '高度', queryType: 'input', defaultValue: '400px', unit: 'px' },
        { field: 'display', title: '显示', queryType: 'input', defaultValue: 'block', unit: '' },
        { field: 'overflow', title: '显示', queryType: 'input', defaultValue: 'visible', unit: '' },
      ]
    },
    renderElementCode(script){
        let json =  eval("("+script+")") //JSON.parse(val.scripts)
        let arr = []
        //获取私有的属性
        if(json && json.tabs){
            this.createTabPanel(json.tabs )
        }
        return json
    },
    updateTabPanel(tabs){
      this.component.tabPanels = []
      tabs.forEach(item=>{
            let dcopy = deepCopy(this.component)
            dcopy.tabPanels =[]
            let comp = {
                 name: item.name,
                 label: item.label,
                 component: dcopy
            }
            if(tabMap[item.name]){
                comp = tabMap[item.name]
                comp.label = item.label
            }
            // if(compKey && compKey.indexOf(item.name)===-1){
            //     //Object.assign(this.component.tabPanels,comp)
            //     this.component.tabPanels.push(comp)
            // }
            //this.component.tabPanels.push(comp)
            this.component.tabPanels.push(comp)     
        })
        //this.tabs = this.component.tabPanels
    },
    createTabPanel(tabs){
        const compKey = this.component.tabPanels.map(c=>c.name)
        const tabnames = tabs.map(c=>c.name)
        let tabMap = {}
        //this.tabs = []
        //不存在就删除
        if(this.component.tabPanels && this.component.tabPanels.length>0){
            for(let i=0 ;i<this.component.tabPanels.length;i++){
                if(tabnames.indexOf(this.component.tabPanels[i].name)===-1){
                    this.component.tabPanels.splice(i,1)
                }
            }
            this.component.tabPanels.forEach(c=>{
                tabMap[c.name] = c
            })
        }
        this.component.tabPanels= []

        tabs.forEach(item=>{
            let dcopy = deepCopy(this.component)
            dcopy.tabPanels =[]
            let comp = {
                 name: item.name,
                 label: item.label,
                 component: dcopy
            }
            if(tabMap[item.name]){
                comp = tabMap[item.name]
                comp.label = item.label
            }
            // if(compKey && compKey.indexOf(item.name)===-1){
            //     //Object.assign(this.component.tabPanels,comp)
            //     this.component.tabPanels.push(comp)
            // }
            //this.component.tabPanels.push(comp)
            this.component.tabPanels.push(comp)     
        })
        this.tabs = this.component.tabPanels

 
    },
    handlerEvent(tag,v1,v2,v3,v4){
        let args = []
        if(v1)  args.push(v1)
        if(v2)  args.push(v2)
        if(v3)  args.push(v3)
        if(v4)  args.push(v4)
        //console.log(this,this.$refs,this.$refs.myrefTree)
        this.$nextTick(()=>{
            const ele = this.$el//$refs.myrefTree.$el
            if(ele){
              dispatchEvent(ele,tag,args)
            }
        })
      },
      handleDragStart(event) {
         event.dataTransfer.setData('srcEventData', JSON.stringify({ offsetX: event.offsetX, offsetY: event.offsetY, action: 'setLocation', compId: this.compId }));
  
      },
  }
}
</script>
<style lang="less" scoped>
.cw-el-tab {
  margin: 0 10px;
}
</style>