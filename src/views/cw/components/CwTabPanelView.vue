/*
* @CreatAuthor: sdf
*/
<template>
    <div class="cw-el-tab-panel">
        <el-tabs ref="myTabPanel"  v-model="activeName"   @tab-remove="(val)=>handlerEvent('tab-remove',val)"	 @tab-click="(val)=>handlerEvent('tab-click',val)" >
            <el-tab-pane  v-for="(item,i) in this.component.tabPanels" :v-if="flag" :key="'tabPanel'+i"  :label="commonI18n(item.label)"  :name="item.name" :disabled="item.disabled">
                <div class="cw-el-tab-panel-item">
                        <CwSubPanelPreview 
                            :style="getStyle(component.styles)"
                            :component="item.component"
                            :componentData="componentData"  
                            :vueContext="vueContext"  
                            :activeName="activeName"  
                            :itemStyle="{  height : component.styles.height}"                         
                        />
                    </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import CwSubPanelPreview from "./CwSubPanelPreview.vue"
import {dispatchEvent,deepCopy} from "../utils/eventUtils"
export default {
  name: 'CwTabPanelView',
  components: { CwSubPanelPreview },
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
      vueContext: {
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

  },
  data() {
    const _initdata = {
      methods:{},
        //  tabPanels:[{label:'页签1',name:'first',component:{}}]
        // vueContext:{},
        flag:false,
        sourceObj: this.component,
        // tabs:[{label:'页签1',name:'first'},{label:'页签2',name:'second'}],
        activeName:'tabname1'
    }
    return _initdata
  },
  created() {
  },
  mounted() { 
    // for (let i in this.itemStyle) {
    //         this.$refs.myref.$el.children[1].style[i] = this.itemStyle[i]
    //       }
    //console.log(123,this.component.tabPanels)
    this.tabs = this.component.tabPanels
  },
  methods: {
    getStyle(styles){
      let height = styles.height
      let obj = {
        height : (styles.height.includes('px') ? Number(styles.height.replace(/px/, ''))-60+'px' : styles.height),
        overflow:'auto'
      }
      return obj
    },
    comText() {
      return '页签面板'
    },
    updateTabPanel(tabs){
      this.component.tabPanels = []
      console.log(this.component)
      tabs.forEach(item=>{
            let dcopy = deepCopy(this.component)
            dcopy.tabPanels =[]
            let comp = {
                 name: item.name,
                 label: item.label,
                 component: dcopy
            }
           
            this.component.tabPanels.push(comp)     
        })
    },
    createTabPanel(tabs){
       if(!this.component.tabPanels)
        {
            this.component.tabPanels = []
             
        }
        const compKey = this.component.tabPanels.map(c=>c.name)
        tabs.forEach(item=>{
            let dcopy = deepCopy(this.component)
            dcopy.tabPanels =[]
            let comp = {
                 name: item.name,
                 label: item.label,
                 component: dcopy
            }
            if(!(compKey && compKey.some(c=>c===item.name))){
                //Object.assign(this.component.tabPanels,comp)
                this.component.tabPanels.push(comp)
            }
                 //this.component.tabPanels.push(comp)
                 
        })
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
  }
}
</script>
<style lang="less" scoped>
.cw-el-tab {
  margin: 0 10px;
}
</style>