<template>
    <div>
      <div class="main_designer">
        <div class="top_designer">
          <CwToolBar :panelStyle="panelStyle"/>
        </div>
        <div class="bottom_designer">
          <div class="main_designer_left">
            <CwLeftArea/>

          </div>
          <div class="main_designer_main" id="myScrollbarContent">
            <CwPanel :panelStyle="panelStyle" @savaQueueManager="savaQueueManager"/>

          </div>
          <div class="main_designer_right">
            <CwRightArea
            :panelStyle="panelStyle"
            />
            
          </div>
          <CwRightMenu
            :rightclickInfo="rightclickData.info"
            @rmenuCopy="rmenuCopy"
            @rmenuPaste="rmenuPaste"
            @rmenuDelete="rmenuDelete"
            @rmenuTop="rmenuTop"
            @rmenuUp="rmenuUp"
            @rmenuBottom="rmenuBottom"
            @rmenuDown="rmenuDown"
            @rmenuClear="rmenuClear"
          />
        </div>
      </div>
      <!-- <div style="width: 100%; height: 150px;">
      </div> -->
    <!-- <div  style="width: 1366px; height: 700px;overflow: auto;" id="myPanelContent">
    </div>  -->
  </div>
  </template>
  <script>
    import CwPanel from "./CwPanel.vue"
    import MyImage from "./components/MyImage.vue"
    import CwLeftArea from "./CwLeftArea.vue"
    import CwRightArea from "./CwRightArea.vue"
    import CwToolBar from "./CwToolBar.vue"
    import CwRightMenu from "./CwRightMenu.vue"
    export default {
      name: 'CwDesigner',
      components: {CwPanel,MyImage,CwLeftArea,CwRightArea,CwToolBar,CwRightMenu},
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
          panelStyle:{
            width:1920,
            height:1080,
            backgroundColor:''
          },
          drawingWidth:1920,
          drawingHeight:1080,

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
          }
        }
        //Object.assign(_initdata.defaultForm.params, this.initData(_initdata.cols))
        return _initdata
      },
      created() {
       
      },
      mounted(){
        this.$nextTick(()=>{
          // this.$bus.$on('panelStyleData', (newVal)=>{
          //   this.panelStyle = {...newVal}
          // }),
          this.$bus.$on("rightclick",(res)=>{
            this.rightclickData = res
          })
          this.$bus.$on("componentData",(res)=>{
            this.panel_componentData = res
          })
          this.queueManager.queue = []
          sessionStorage.setItem("queueManager",JSON.stringify(this.queueManager))
        })

      },
      methods: {
        handleDragEnd(event){
          event.preventDefault();
          console.log('handleDragEnd',event)
        },
        handleDragStart(event){
          //event.preventDefault();
          console.log("handleDragStart",event)
        },
        // 右键菜单方法
        rmenuCopy(params) {
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
        rmenuPaste(params) {
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
                  this.rightclickData.componentData.push(component_data);
                  this.savaQueueManager()
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
            this.rightclickData.componentData.push(component_data);
            this.savaQueueManager()
          }
          
          
        },
        rmenuDelete(params) {
          let componentData = this.rightclickData.componentData
          for (var i = 0; i < componentData.length; i++) {
            if (
              componentData[i].component + "-" + componentData[i].id == params.compId
            ) {
              this.$store.commit('app/DETE_COMPONENT', componentData[i])
              componentData.splice(i, 1);
              this.savaQueueManager()   
            }
          }
        },
        rmenuClear(params) {
          this.rightclickData.componentData.splice(0);
          this.savaQueueManager()   
        },
         // 获取index
        indexGet(item) {
          let componentData = this.rightclickData.componentData
          for (let i = 0; i < componentData.length; i++) {
            if (componentData[i].id == item) return i;
          }
        },
        rmenuTop(params) {
          let componentData = this.rightclickData.componentData
          let index = this.indexGet(params.compId.split("-")[1]);
          if (index < componentData.length - 1 && index >= 0) {
            let myComponments = componentData.splice(index, 1);
            componentData.push(myComponments[0]);
            this.savaQueueManager()  
          } else {
            this.$message({
              type: "info",
              message: "图层已经到顶了",
            });
          }
        },
        rmenuUp(params) {
          let componentData = this.rightclickData.componentData
          let index = this.indexGet(params.compId.split("-")[1]);
          if (index < componentData.length - 1 && index >= 0) {
            componentData.splice( index, 1, ...componentData.splice(index + 1, 1, componentData[index]));
            this.savaQueueManager()  
          } else {
            this.$message({
              type: "info",
              message: "图层已经到顶了",
            });
          }
        },
        rmenuDown(params) {
          let componentData = this.rightclickData.componentData
          let index = this.indexGet(params.compId.split("-")[1]);
          if (index > 0) {
            componentData.splice(index, 1, ...componentData.splice(index - 1, 1, componentData[index]));
            this.savaQueueManager()  
          } else {
            this.$message({
              type: "info",
              message: "图层已经到底了",
            });
          }
        },
        rmenuBottom(params) {
          let componentData = this.rightclickData.componentData
          let index = this.indexGet(params.compId.split("-")[1]);
          if (index > 0) {
            let myComponments = componentData.splice(index, 1);
            componentData.unshift(myComponments[0]);
            this.savaQueueManager()  
          } else {
            this.$message({
              type: "info",
              message: "图层已经到底了",
            });
          }
        },
        // 操作后保存componentData、curIndex+1；
        savaQueueManager(componentData){
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
          sessionStorage.setItem("queueManager",JSON.stringify(queueManager))
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
  .bottom_designer{
    width: 100%;
    height:85vh;
    display: flex;
  }
  .main_designer_left{
    width:15%;
    height:100%;
    border:1px solid #f1e8e8;
    border-right: none;
  }
  .main_designer_main{
    width:66%;
    height:100%;
    overflow:scroll;
    border:1px solid #f1e8e8;
  }
  .main_designer_right{
    width:19%;
    height:100%;
    border:1px solid #f1e8e8;
    border-left: none;

  }
  </style>