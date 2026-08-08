<template>
  <div class="dyn-myImage" v-bind="$attrs">
    <CwTrees ref="myrefTree" v-model="compVal" :itemStyle="itemStyle"
      :data="dataSource" show-checkbox node-key="id" 
      :props="this.confData.treeProps ? this.confData.treeProps : defaultProps"
      :lazy="this.confData.lazy ? this.confData.lazy : false"  
      :defaultExpandAll="this.confData.defaultExpandAll ? this.confData.defaultExpandAll : false"  
      :show-checkbox="this.confData.showCheckbox ? this.confData.showCheckbox : false"  
      :highlight-current="this.confData.highlightCurrent ? this.confData.highlightCurrent : false"  
      :load="(v1,v2,v3,v4)=>{handlerEvent('node-lazy-load',v1,v2,v3,v4)}" 
      @node-click="(v1,v2,v3,v4)=>{handlerEvent('node-click',v1,v2,v3,v4)}"
      @node-contextmenu	="(v1,v2,v3,v4)=>{handlerEvent('node-contextmenu',v1,v2,v3,v4)}"
      @check-change	="(v1,v2,v3,v4)=>{handlerEvent('check-change',v1,v2,v3,v4)}"
      @check="(v1,v2,v3,v4)=>{handlerEvent('check',v1,v2,v3,v4)}"
      @current-change	="(v1,v2,v3,v4)=>{handlerEvent('current-change',v1,v2,v3,v4)}"
      @node-expand	="(v1,v2,v3,v4)=>{handlerEvent('node-expand',v1,v2,v3,v4)}"
      @node-collapse="(v1,v2,v3,v4)=>{handlerEvent('node-collapse',v1,v2,v3,v4)}"
      @node-drag-start	="(v1,v2,v3,v4)=>{handlerEvent('node-drag-start',v1,v2,v3,v4)}"
      @node-drag-enter="(v1,v2,v3,v4)=>{handlerEvent('node-drag-enter',v1,v2,v3,v4)}"	 	
      @node-drag-leave	="(v1,v2,v3,v4)=>{handlerEvent('node-drag-leave',v1,v2,v3,v4)}"
      @node-drag-over	="(v1,v2,v3,v4)=>{handlerEvent('node-drag-over',v1,v2,v3,v4)}"
      @node-drag-end	="(v1,v2,v3,v4)=>{handlerEvent('node-drag-end',v1,v2,v3,v4)}"
      @node-drop	="(v1,v2,v3,v4)=>{handlerEvent('node-drop',v1,v2,v3,v4)}"
      :render-content="renderContent"
      >
      </CwTrees>
    <!-- v-model="compVal" fieldName ? componentModalObj[fieldName] : compVal ||  loadNode-->
  </div>
</template>
<script>
import CwTrees from "@/components/Cw/CwTree.vue"
import {dispatchEvent} from "../utils/eventUtils"
export default {
  name: 'CwTree',
  components: { CwTrees },
  props: {
    componentModalObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    fieldName: {
      type: String,
      default: ''
    },
    itemStyle: {
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
    defaultProps: {
      type: Object,
      default: () => {
        return { children: 'children', label: 'label' }
      }
    },
    component:{
        type: Object,
        default: () =>{}
      },
    bindData:{
      type: Object,
      default: () =>{}
    },
  },
  data() {
    return {
      methods:{},
      vueContext:{},
      confData:{},
      searchinputshow: '',
      compVal: [],
      dataObtainedByEditor:{},
      compStyles: {
        samplestyle: [
          {
            field: 'fontColor',
            title: '字体颜色',
            queryType: 'input',
            componentOptions: {
              defaultValue: '#5BACC1'
            }
          },
          {
            field: 'boardColor',
            title: '边框颜色',
            queryType: 'input',
            componentOptions: {
              defaultValue: '#073f97'
            }
          },
        ],
        sampleattribute: [],
        sampledata: [],
      },
      dataSource: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }
      ],
      treeselectNode: {},
      activeName1: '',

    };
  },
  watch: {
    itemVal: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.compVal = newVal
        }
      },
      deep: true
    },
    itemStyle: {
      handler: function (newVal, oldVal) {
        if (newVal) {

        }
      },
      deep: true
    },
    'component.elementCode':{
        handler: function (newVal, oldVal) {
        if (newVal) {
            this.initConf(newVal)
        }
      },
      deep: true
    },
  },
  computed: {},
  created() {
    this.comText();
    this.initConf(this.component.elementCode)
  },
  mounted() {
  },
    beforeDestroy() { },
    methods: {
      renderContent(h, { node, data, store }) {
        if (node.level == 1) {
          // v-model="searchiptval[node.data.ID]"
          return (
            <div  class="tree-title">
                <div>
                  <i class="el-icon-coin" />
                  <span> { node.label }</span>
                </div>
                {/* <div>
                    <el-button title="同步" class='tree-button' type="text" size="mini" icon="el-icon-plus"
                      on-click="{()=>this.opentablenamelog(node)}"></el-button>
                    <el-button title="查询" style="margin-right: 10px;" class='tree-button' type="text" size="mini" icon="el-icon-search"
                    on-click="{()=>this.searchtable(node)}"></el-button>
                    {this.searchinputshow == node.data.ID ? <el-input on-change="{()=>this.tabletreeChange(this.searchiptval,node)}"  class='searchinput' size="mini"  /> : ""}
                </div> */}
            </div>
          )

        } else if (node.level == 2) {
          return (
              <div  class="tree-title">
                <div>
                  <i class="el-icon-date" />
                  <span title={ node.label }> { node.label }</span>
                </div>
                {/* <div>
                    <el-button title="刷新" class='tree-button' type="text" size="mini" icon="el-icon-refresh-right"
                    on-click="{() => this.tablenamefresh(node)}"></el-button>
                    <el-button title="脚本" class='tree-button-edit' type="text" size="mini" icon="el-icon-edit"
                    on-click="{() => this.myscript('CTRL_SCRIPT', node.data)}"></el-button>
                </div> */}

              </div>
          )
        } else {
          return (
              <span style="font-size: 14px;"> 
                <i class="el-icon-document-remove" /><span> { node.label }</span>
              </span>
          )
        }
        
        },
      initConf(str){
        if(str===undefined || str===null || str==='')
        return
        let json =  eval("("+str+")")
        if(json){
          this.confData = json
        }
      },
      tabletreeChange() {},
      opentablenamelog(){},
      searchtable(){},
      tablenamefresh(){},
      myscript(){},
      loadNode(node, resolve,url,param,treeDataAttr) {
        if (node.level === 0) {
        } else if (node.level === 1) {
        const _data = {
          url: url[0], 
          params: param[0]
        }
        // if(this.searchiptval[node.data.ID]){
        //   _data.params.data.sqlWhere.push(
        //     {
        //       column: 'TABLE_NAME',
        //       condition: 'like',
        //       value: this.searchiptval[node.data.ID] ? this.searchiptval[node.data.ID] : ''
        //     }
        //   )
        // }
        this.$store.dispatch('fmsCommon/actionPost', _data)
          .then(data => {
            let arr = []
            if (data.length > 0) {
              arr = data.map(val => {
                val.label = val[treeDataAttr[0].label];
                val.value = val[treeDataAttr[0].value];
                return val
              })
            }

            resolve([...arr])
          })
      } else if (node.level === 2) {
        const _data = {
          url: url[1], 
          params: param[1]
        }
        this.$store.dispatch('fmsCommon/actionPost', _data)
          .then(data => {
            let arr = []

            if (data.length > 0) {
              arr = data.map(val => {
                val.label = val[treeDataAttr[1].label];
                val.value = val[treeDataAttr[1].value];
                val["isLeaf"] = treeDataAttr[1].isLeaf;
                return val
              })
            }

            resolve([...arr])
          })
      }
      },
      // 点击树节点回调
      treeNodeClick(node,url,param,vueComponent,colsTable,colsColumns) {
        this.listLoading = true;
        this.treeselectNode = node
        this.activeName1 = 'first'
        if (node && node.expanded === false) {
          node.loaded = false;
          node.expand();
        }else{
          node.expanded = !node.expanded
        }
        if (node.level === 1) {
         // this.tablelabel = '表数据'
          const _data = {
            url: url[0], params: param[0]
          }
          // if(this.searchiptval[this.treeselectNode.data.ID]){
          //   _data.params.data.sqlWhere.push(
          //     {
          //       column: 'TABLE_NAME',
          //       condition: 'like',
          //       value: this.searchiptval[this.treeselectNode.data.ID] ? this.searchiptval[this.treeselectNode.data.ID] : ''
          //     }
          //   )
          // }
          this.$store.dispatch('fmsCommon/actionTaskPost', _data)
            .then(data => {
              vueComponent.cols = colsTable;
              vueComponent.data = data;
              this.listLoading = false
            })

        } else if (node.level === 2) {
          // this.tablelabel = '列数据'

          const _data = {
            url: url[1], params: param[1]
          }
          this.$store.dispatch('fmsCommon/actionTaskPost', _data)
            .then(data => {
              vueComponent.cols = colsColumns;
              vueComponent.data = data;
              this.listLoading = false

            })
        //   const _data1 = {
        //     url: '/dyn-mapper/query', params: {
        //       data: {
        //         sqlWhere: [
        //           {
        //             column: 'TABLE_ID',
        //             condition: '=',
        //             value: this.treeselectNode.data.ID
        //           }]
        //       }
        //     }
        //   }
        //   this.$store.dispatch('fmsCommon/actionTaskPost', _data1)
        //     .then(data => {
        //       this.listbottom = data
        //       this.listLoadingbottom = false
        //       this.tablebottomshow = true
        //     })
        }

      },
      // 递归生成菜单树结构数据
      loop(data, id) {
        const res = []
        data.forEach((item => {
          item['children'] = []
          item["leaf"] = false;
          item.label = item.DATABASE_NAME
          item.value = item.ID
          if (item.children && item.children.length > 0) {
            item.children = this.loop(item.children, item.ID)
          }
          res.push(item)
        }))

        return res
      },
      treeData(data, id) {
        this.loop(data, id)
        return this.loop(data, id)
      },
      init(url,param) {
          const _data = { url: url, params:param}
          this.$store.dispatch('fmsCommon/actionPost', _data)
              .then(data => {
              const newData = this.treeData(data, '0')
              this.dataSource = newData
              //this.options = newData
              })
      },
      comText() {
        return '树结构'
      },
      ificationType() {
        return {
          classification: '基础组件',
          isCanvasview: false,
        }
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
      handleDragEnd() { }
  },

}
</script>
<style lang="scss">
.icontooltip {
  padding: 4px !important;
}
</style>
<style lang="scss" scoped>
.focusing {
  display: none;
}

::v-deep .tree-title {
  height: 26px;
  line-height: 26px;
  display: flex;
  font-size: 14px;
  .el-input__inner{
    border: 1px solid #9ea0a3;
    height: 18px;
  }
}

::v-deep .tree-button {
  margin-left: 10px;
}

::v-deep .tree-button-edit {
  margin-left: 10px;
}

::v-deep .el-button--mini {
  padding-top: 0px;
  padding-bottom: 0px;
}
::v-deep .el-tabs--border-card {
  box-shadow:none
}

#configMenu {
  display: flex;
  height: 100%;
}

.tree-menu {
  height: 790px;
  overflow-y: scroll;
  /* width: 30%; */
  /* flex: 1; */
  /* margin-right: 10px; */
  border: 1px solid #dfe6ec;
  /* cursor: w-resize; */
}

.midline {
  height: 790px;
  width: 2px;
  /* background-color: black; */
  cursor: w-resize;
}

.container-menu {
  min-width: 35%;
  flex: 1;
  height: 80%;
}
</style>