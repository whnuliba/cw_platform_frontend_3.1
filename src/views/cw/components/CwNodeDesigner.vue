<template>
  <div ref="myref" v-bind="$attrs" :itemStyle="itemStyle" :panelStyle="panelStyle">
    <div class="main_designer">
      <div class="top_designer">
        <NodeToolBar ref="NodeToolBar" :panelStyle="panelStyle" @tableDataRefresh="() => handlerEvent('chart-save')" @approveSubmit="(param) => handlerEvent('approval-submit',param)"/>
      </div>
      <div class="bottom_designer1">
        <div class="main_designer_left1">
          <NodeLeftArea/>

        </div>
        <div class="main_designer_main1" id="myScrollbarContentNode">
          <NodePanel :panelStyle="panelStyle" @nodeSavaQueueManager="nodeSavaQueueManager"/>
          <!-- @nodeSavaQueueManager="nodeSavaQueueManager" -->
        </div>
        <div class="main_designer_right1">
          <NodeRightArea
          :panelStyle="panelStyle"
          />
          
        </div>
        <NodeRightMenu
          :rightclickInfo="rightclickData.info"
          @rmenuCopyNode="rmenuCopyNode"
          @rmenuPasteNode="rmenuPasteNode"
          @rmenuDeleteNode="rmenuDeleteNode"
          @rmenuTopNode="rmenuTopNode"
          @rmenuUpNode="rmenuUpNode"
          @rmenuBottomNode="rmenuBottomNode"
          @rmenuDownNode="rmenuDownNode"
          @rmenuClearNode="rmenuClearNode"
        />
      </div>
    </div>
</div>
</template>
<script>
  import NodePanel from "./nodeDesign/NodePanel.vue"
  // import MyImage from "./MyImage.vue"
  import NodeLeftArea from "./nodeDesign/NodeLeftArea.vue"
  import NodeRightArea from "./nodeDesign/NodeRightArea.vue"
  import NodeToolBar from "./nodeDesign/NodeToolBar.vue"
  import NodeRightMenu from "./nodeDesign/NodeRightMenu.vue"
  import {dispatchEvent} from "../utils/eventUtils";
  export default {
    name: 'CwNodeDesigner',
    components: {NodePanel,NodeLeftArea,NodeToolBar,NodeRightArea,NodeRightMenu},
      // MyImage 
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
            default: () =>{}
          },
        bindData:{
          type: Object,
          default: () =>{}
        },
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
              if (newVal) {}
            },
            deep: true
          },
    },
      data() {
        const _initdata = {
          panelStyle:{
            width:870,
            height:600,
            backgroundColor:''
          },
          element:undefined,
          rightclickData: {},
          panel_componentData:{},
          copydata: {},
          index: '',
          maxNumber: 0,
          queueManager:{
            curIndex: 0,
            maxLimit: 50,
            queue: []    //变化记录
          },
          dataObtainedByEditor: {},
          selectNode: {},
        }
        return _initdata
      },
      created() {},
      mounted(){
        this.$nextTick(()=>{
          this.$bus.$on("nodeRightclick",(res)=>{
            this.rightclickData = res
          })
          this.$bus.$on("componentDataProcess",(res)=>{
            this.panel_componentData = res
          })
          // this.queueManager.queue = []
          // sessionStorage.setItem("queueManager",JSON.stringify(this.queueManager))
        })

      },
      methods: {
        handlerEvent(tag,v1,v2,v3,v4,v5,v6){
              let args = []
              if(v1)  args.push(v1)
              if(v2)  args.push(v2)
              if(v3)  args.push(v3)
              if(v4)  args.push(v4)
              if(v5)  args.push(v5)
              if(v6)  args.push(v6)
              //console.log(this,this.$refs,this.$refs.myrefTree)
              this.$nextTick(()=>{
                const ele = this.$el //$refs.myrefTree.$el

              if(ele){
                dispatchEvent(ele,tag,args)
              }
              })
        },
        getStyleCols() {
          return [
            { field: 'width', title: '宽度', queryType: 'input', defaultValue: '187px', unit: 'px' },
            { field: 'height', title: '高度', queryType: 'input', defaultValue: '21px', unit: 'px' },
            { field: 'fontSize', title: '字体大小', queryType: 'input', defaultValue: '16px', unit: 'px' },
            { field: 'borderColor', title: '边框颜色', queryType: 'colorpicker', defaultValue: '#127310', },
            { field: 'backgroundColor', title: '背景颜色', queryType: 'colorpicker', defaultValue: '#fff', },
          ]
        },
        getAttributeCols() {
          return [
            { field: 'placeholder', title: 'placeholder', queryType: 'input', require: false, query: true, hide: false },
          ]
        },
        comText() {
          return '节点编辑模版'
        },
        ificationType() {
          return {
            classification: '布局容器组件',
            isCanvasview: false,
          }
        },
        handleDragEnd(event){
          event.preventDefault();
          console.log('handleDragEnd',event)
        },
        handleDragStart(event){
          //event.preventDefault();
          console.log("handleDragStart",event)
        },
        // 右键菜单方法
        rmenuCopyNode(params) {
          this.copyData = {
            data: JSON.parse(JSON.stringify(params.component)),
            selectedElements: JSON.parse(JSON.stringify(params.selectedElements)),
          };
        },
        getCompMaxIndex(componentData, name) {
          let i = 0;
          
          componentData.forEach((item) => {
            if (item.component === name) {
              if (item.fieldName.indexOf(name) > -1) {
                let c = item.fieldName.match(/\d+/g);
                if (c) {
                  let num = parseInt(c[0]);
                  this.maxNumber = this.maxNumber <= num ? num : this.maxNumber;
                } else {
                  this.maxNumber = 0;
                }
              }
            }
            if (item.tabPanels && item.tabPanels.length > 0) {
              item.tabPanels.forEach((t) => {
                if (t.component.component === name) {
                  if (t.component.fieldName.indexOf(name) > -1) {
                    let c = t.component.fieldName.match(/\d+/g);
                    if (c) {
                      let num = parseInt(c[0]);
                      this.maxNumber = this.maxNumber <= num ? num : this.maxNumber;
                    } else {
                      this.maxNumber = 0;
                    }
                  }
                }
                if (t.component.subComponent && t.component.subComponent.length) {
                  this.maxNumber = this.getCompMaxIndex(
                    t.component.subComponent,
                    name
                  );
                }
              });
            }
            if (item.subComponent && item.subComponent.length) {
              this.maxNumber = this.getCompMaxIndex(item.subComponent, name);
            }
          });
          return this.maxNumber;
        },
        rmenuPasteNode(params) {
          if (this.copyData == {}) {
            return;
          }
          let selectedElements = this.copyData.selectedElements;
          if(selectedElements && selectedElements.length > 0){
            this.panel_componentData.forEach(item=>{
              selectedElements.forEach(ele=>{
                if (ele == "shape" + item.id || ele == item.id) {
                  let uuid = this.uuid();
                  this.maxNumber = 0;
                  let i = this.getCompMaxIndex(this.panel_componentData, item.component) + 1;
                  let name = `${item.component}`;
                  if (i > 0) name += i;
                  let component_data = {
                    ...this.copyData.data,
                    isSelected: false,
                    component: item.component,
                    id: uuid,
                    subComponent: [],
                    styles: {
                      ...item.styles,
                      left: parseInt(item.styles.left, 10) + 20 + "px",
                      top: parseInt(item.styles.top, 10) + 20 + "px",
                    },
                    handler: {},
                    elementCode: "",
                    tabPanels: [],
                    fieldName: name,
                    attribute: {
                      ...item.attribute,
                      fieldName: name,
                    },
                  };
                  this.rightclickData.componentDataProcess.push(component_data);
                  this.nodeSavaQueueManager()
                }
              })
            })
          } else {
            let uuid = this.uuid();
            this.maxNumber = 0;
            let i = this.getCompMaxIndex(this.panel_componentData, this.copyData.data.component) + 1;
            let name = `${this.copyData.data.component}`;
            if (i > 0) name += i;
            let component_data = {
              ...this.copyData.data,
              isSelected: false,
              component: this.copyData.data.component,
              id: uuid,
              subComponent: [],
              styles: {
                ...this.copyData.data.styles,
                left: parseInt(this.copyData.data.styles.left, 10) + 20 + "px",
                top: parseInt(this.copyData.data.styles.top, 10) + 20 + "px",
              },
              handler: {},
              elementCode: "",
              tabPanels: [],
              fieldName: name,
              attribute: {
                ...this.copyData.data.attribute,
                fieldName: name,
              },
            };
            this.rightclickData.componentDataProcess.push(component_data);
            this.nodeSavaQueueManager()
          }
          
        },
        rmenuDeleteNode(params) {
          let componentData = this.rightclickData.componentDataProcess, tbRowData = this.$refs.NodeToolBar.FlowRowData;
          const _data = {
              url: "/process-flow-tmp-dts/guest/get-dts",
              params: { data: tbRowData.id },    //this.processAddParam.flowId
            };
            this.$store.dispatch("fmsCommon/actionFmsPost", _data).then((data) => {
              if(data.length){
                data.forEach(item => {
                          if(item.processCode == params.component.attribute.nodeLabel) {
                              this.selectNode = item
                          }
                      })
                for (var i = 0; i < componentData.length; i++) {
                    if (
                      componentData[i].component + "-" + componentData[i].id == params.compId
                    ) {
                      this.$store.commit('app/DETE_COMPONENT', componentData[i])  // 触发cwPanel界面的节点删除监听事件
                      if(this.selectNode.processCode == componentData[i].attribute.nodeLabel) {
                            // componentData.splice(i, 1);
                            this.handlerEvent("nodeDelete", {data: componentData[i].id}, componentData,i);
                            this.nodeSavaQueueManager()   
                          } else {
                            componentData.splice(i, 1);
                            this.nodeSavaQueueManager()   
                          }
                    }
                }
                
              }
            });
          
          
        },
        rmenuClearNode(params) {
          this.rightclickData.componentDataProcess.splice(0);
          this.nodeSavaQueueManager()   
        },
         // 获取index
        indexGet(item) {
          let componentData = this.rightclickData.componentDataProcess
          for (let i = 0; i < componentData.length; i++) {
            if (componentData[i].id == item) return i;
          }
        },
        rmenuTopNode(params) {
          let componentData = this.rightclickData.componentDataProcess
          let index = this.indexGet(params.compId.split("-")[1]);
          if (index < componentData.length - 1 && index >= 0) {
            let myComponments = componentData.splice(index, 1);
            componentData.push(myComponments[0]);
            this.nodeSavaQueueManager()  
          } else {
            this.$message({
              type: "info",
              message: "图层已经到顶了",
            });
          }
        },
        rmenuUpNode(params) {
          let componentData = this.rightclickData.componentDataProcess
          let index = this.indexGet(params.compId.split("-")[1]);
          if (index < componentData.length - 1 && index >= 0) {
            componentData.splice( index, 1, ...componentData.splice(index + 1, 1, componentData[index]));
            this.nodeSavaQueueManager()  
          } else {
            this.$message({
              type: "info",
              message: "图层已经到顶了",
            });
          }
        },
        rmenuDownNode(params) {
          let componentData = this.rightclickData.componentDataProcess
          let index = this.indexGet(params.compId.split("-")[1]);
          if (index > 0) {
            componentData.splice(index, 1, ...componentData.splice(index - 1, 1, componentData[index]));
            this.nodeSavaQueueManager()  
          } else {
            this.$message({
              type: "info",
              message: "图层已经到底了",
            });
          }
        },
        rmenuBottomNode(params) {
          let componentData = this.rightclickData.componentDataProcess
          let index = this.indexGet(params.compId.split("-")[1]);
          if (index > 0) {
            let myComponments = componentData.splice(index, 1);
            componentData.unshift(myComponments[0]);
            //this.nodeSavaQueueManager()  
          } else {
            this.$message({
              type: "info",
              message: "图层已经到底了",
            });
          }
        },
        // 操作后保存componentData、curIndex+1；
        nodeSavaQueueManager(componentData){
          let queueManager = JSON.parse(sessionStorage.getItem('queueManager'))
          let compData = JSON.parse(JSON.stringify(componentData?componentData:this.panel_componentData))
          if(queueManager.queue.length == queueManager.curIndex ){
            queueManager.queue.push(compData)
          }else{
            // 在撤销的过程中发生的任何改动, 都会清空当前步骤之后的所有记录，最终产生一个新的状态分支
            queueManager.queue.splice(queueManager.curIndex,queueManager.queue.length-queueManager.curIndex)
            queueManager.queue.push(compData)
          }  
          queueManager.curIndex += 1
          // sessionStorage.setItem("queueManager",JSON.stringify(queueManager))
        }
      }
    }
  </script>
  
  <style lang="less" scoped>
   .my-scrollbar-content {
    cursor: grab;
    transform-origin: left top;
    // transform: scale(v-bind(scaleValue));
    transition: all 0.3s;
  }
  .top_designer{
    width: 100%;
    height:5vh;
  }
  .bottom_designer1{
    width: 100%;
    height:80vh;
    display: flex;
  }
  .main_designer_left1{
    width:15%;
    height:100%;
    border:1px solid #f1e8e8;
    border-right: none;
  }
  .main_designer_main1{
    width:66%;
    height:100%;
    overflow:scroll;
    border:1px solid #f1e8e8;
  }
  .main_designer_right1{
    width:19%;
    height:100%;
    border:1px solid #f1e8e8;
    border-left: none;

  }
  </style>