<template>
    <div style="padding-left:3px ;">
        <div style="width: 100%; display: flex; justify-content: space-between; float: left;">
           <div id="myDiagramDiv" style="flex-grow: 1; height: calc(100vh - 200px); border: 0 solid black; position: relative; -webkit-tap-highlight-color: rgba(255, 255, 255, 0); cursor: auto;"><canvas tabindex="0" width="1011" height="618" style="position: absolute; top: 0px; left: 0px; z-index: 2; user-select: none; touch-action: none; width: 1011px; height: 618px; cursor: auto;"></canvas><div style="position: absolute; overflow: auto; width: 1011px; height: 618px; z-index: 1;"><div style="position: absolute; width: 1px; height: 1px;"></div></div></div>
        </div>

        <div id="toolTipDIV" style="position: absolute; background: #fff;width: auto;max-width: 500px;height:auto; 
        max-height: 300px;box-shadow: 0px 5px 10px #000; z-index: 1000;padding: 10px; overflow: auto;display: none;">
            <p id="toolTipParagraph">{{'节点审批信息'}}</p>
            <div>
                <el-table
                :data="tipTableData"
                style="width: 100%">
                <el-table-column
                    prop="approveUsername"
                    label="审批人"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="approveTime"
                    label="审批日期"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="approveDetails"
                    label="描述">
                </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
       
  </template>
  <script>
  import elDragDialog from '@/directive/el-drag-dialog'
  export default {
    directives: { elDragDialog },
    props: {
      wfApproveDisplay: {
        type: Boolean,
        default: false
      },
      formData: {
        type: Object,
        default: function() {
          return {}
        }
      },
      formName: {
        type: Object
      },
      docInfo: {
        type: Object
      },
      items: {
        type: Array,
        default: function() {
          return []
        }
      },
      tempDoc: {
        type: String,
        default: ''
      },
      title: {  
        type: String,
        default: ''
      },
      nextNodeUser: {  
        type: String,
        default: ''
      },
      nextNodeJob: {  
        type: String,
        default: ''
      },
      nextNodeDept: {  
        type: String,
        default: ''
      },
      nextNodeType: {  
        type: String,
        default: 'USER'
      }
    },
    data() {
      return {
        url: {
          doApprove: '/wf-work-approve/doApprove',
          list: '/wf-work-approve/approveDetails',
          createFrom:'/wf-doc-approve/createForm',
          flowTempUri:'/wf-doc/doc-by-no',
          submitUrl:'/wf-doc-approve/submitFlow',
          docUrl:'/wf-doc-approve/doc-by-id'
        },
        alreadyApproveList:undefined,
        myDiagram:undefined,
        tipTableData:[],
        self:this
      }
    },
    created() {
      // this.initCustomVol(data => {
      //   if (data && data.length > 0) {
      //     const fds = data.map(c => c.item)
      //     this.cols.forEach(item => {
      //       if (fds.indexOf(item.field) >= 0) {
      //         item.hide = false
      //       } else {
      //         item.hide = true
      //       }
      //     })
      //   }
      // })
    //    this.$emit('initData',(docNo)=>{
    //   });
    
      this.selectOptions()
      
      //this.getList()
      this.$nextTick(()=>{
         
       })
    
    },
    mounted(){
    //window.addEventListener('DOMContentLoaded', this.init);
    this.init()
},
watch:{
    tempDoc(newData,oldData){
        if(this.docInfo){
            this.myDiagram.model = go.Model.fromJson(this.docInfo.graphScript);
            this.getNodes(this.docInfo.id) 
        }
    },
    // docInfo(newData,oldData){
    //     this.myDiagram.model = go.Model.fromJson(newData.graphScript); 
    //}
},

 methods: {

    rendenerApproveNode(){    
        if(this.myDiagram && this.myDiagram.nodes){
            this.myDiagram.nodes.map(c=>{
                //已经审批的改变显示的颜色，没有审批的也改变颜色
                const node = this.alreadyApproveList.filter(row=>row.currNodeId==c.data.props.id)
                if(c.data.nodeTye!=='COND'){
                    if(node && node.length && node.some(a=>a.wtState!=='WAIT')){
                       // this.myDiagram.model.setDataProperty(c.data,'fill','#BE9C07')
                    }
                }
            })
            let fromIfNode = {}
            this.myDiagram.links.map(c=>{
              let toNode = c.toNode;
              let fromNode = c.fromNode;
                              //已经审批的改变显示的颜色，没有审批的也改变颜色
              let node_from = this.alreadyApproveList.filter(row=>row.currNodeId==fromNode.data.props.id);
              let node_to = this.alreadyApproveList.filter(row=>row.currNodeId==toNode.data.props.id);
              
              if(fromNode.data.nodeType==='COND' && node_to && node_to.length>0){
                  if(fromIfNode.hasOwnProperty(fromNode.data.props.nodeNo)){
                     if(fromIfNode[fromNode.data.props.nodeNo].to){
                        fromIfNode[fromNode.data.props.nodeNo].to[toNode.data.props.nodeNo]=toNode
                     }else{
                       fromIfNode[fromNode.data.props.nodeNo]['to'] = {}
                       fromIfNode[fromNode.data.props.nodeNo]['to'][toNode.data.props.nodeNo]=toNode
                     }
                  }else{
                      fromIfNode[fromNode.data.props.nodeNo] = {}
                      fromIfNode[fromNode.data.props.nodeNo]['to'] = {}
                      fromIfNode[fromNode.data.props.nodeNo]['to'][toNode.data.props.nodeNo]=toNode
                  }
              } 
               if(toNode.data.nodeType==='COND' && node_from && node_from.length>0){
                 if(fromIfNode.hasOwnProperty(toNode.data.props.nodeNo)){
                    if(fromIfNode[toNode.data.props.nodeNo].hasOwnProperty('from')){
                       fromIfNode[toNode.data.props.nodeNo].from[fromNode.data.props.nodeNo]=fromNode
                    }else{
                      fromIfNode[toNode.data.props.nodeNo]['from'] = {}
                      fromIfNode[toNode.data.props.nodeNo]['from'][fromNode.data.props.nodeNo]=fromNode
                    }
                  }else{
                      fromIfNode[toNode.data.props.nodeNo] = {}
                      fromIfNode[toNode.data.props.nodeNo]['from'] ={}
                      fromIfNode[toNode.data.props.nodeNo]['from'][fromNode.data.props.nodeNo]=fromNode
                  }
               }
            })

            this.alreadyApproveList.sort((a,b)=>{
                let minA = new Date(a.createTime).getTime();
                let minB = new Date(b.createTime).getTime();
                return minB - minA; // 修改比较顺序为降序
              })

            //计算驳回节点
            let rejectNodes = this.alreadyApproveList.filter(row=>row.wtState ==='REJECT');
            if(rejectNodes && rejectNodes.length>0){
              rejectNodes.sort((a,b)=>{
                let minA = new Date(a.createTime).getTime();
                let minB = new Date(b.createTime).getTime();
                return minB - minA; // 修改比较顺序为降序
              })
               let rejectNode = rejectNodes[0]
               //若当前节点就是驳回节点，则不高亮显示
               if(this.alreadyApproveList[0]===rejectNode){
                this.alreadyApproveList.length=0
               }else{

               //判断是返回当前节点还是返回首节点
                 if(rejectNode.reSubmit==='START'){
                  this.alreadyApproveList = this.alreadyApproveList.filter(c=>{
                    let a = new Date(c.createTime).getTime()
                    let b = new Date(rejectNode.createTime).getTime() 
                    return a > b
                })
                  }
                  if(rejectNode.reSubmit==='CURRENT'){
         
                      //找到开始节点，否则找到最初节点
                     let startNodes = this.alreadyApproveList.filter(row=>row.wtState ==='REJECT' && row.reSubmit==='START');
                     console.log(startNodes)
                     if(startNodes && startNodes.length>0){
                      startNodes.sort((a,b)=>{
                            let minA = new Date(a.createTime).getTime();
                            let minB = new Date(b.createTime).getTime();
                            return minB - minA; // 修改比较顺序为降序
                        })
                        let startNode = startNodes[0]
                        this.alreadyApproveList = this.alreadyApproveList.filter(c=>{
                            let a = new Date(c.createTime).getTime()
                            let b = new Date(startNode.createTime).getTime() 
                            return a > b
                        })                        
                     }
                  }
               }

              
            }


            //判断流程是否已经结束

            let stopNode = this.alreadyApproveList.filter(row=>row.wtState ==='WAIT');
            
            this.myDiagram.links.map(c=>{
                let toNode = c.toNode;
                let fromNode = c.fromNode;

                //已经审批的改变显示的颜色，没有审批的也改变颜色
                let node = this.alreadyApproveList.filter(row=>row.currNodeId==fromNode.data.props.id);
                let node_to = this.alreadyApproveList.filter(row=>row.currNodeId==toNode.data.props.id);

                if(toNode.data.start==='Y' && node && node.length>0){
                   //找到指向开始的那条线，并且判断流程是都已经都审批完成
                   if(stopNode===null ||stopNode===undefined || stopNode.length===0){
                    this.myDiagram.model.setDataProperty(c.data,'strokeWidth',3)
                    this.myDiagram.model.setDataProperty(c.data,'lineColor','#03EA1E')
                    this.myDiagram.model.setDataProperty(c.data,'arrowHeadColor','#03EA1E')
                    this.myDiagram.model.setDataProperty(c.data,'arrowHeadBgColor','#03EA1E')
                   }
                }
  
                if(node && node_to && node.length>0 && node_to.length>0){
                    //this.myDiagram.model.setDataProperty(c.data,'lineColor','lightgreen')
                    //this.myDiagram.model.setDataProperty(c.data,'arrowHeadColor','lightgreen')
                    //this.myDiagram.model.setDataProperty(c.data,'arrowHeadBgColor','lightgreen')

                  node_to.forEach(n=>{
                   let fns = node.filter(c=>c.id===n.previousId)
                   if(fns && fns.length>0){  
                    this.myDiagram.model.setDataProperty(c.data,'strokeWidth',3)
                    this.myDiagram.model.setDataProperty(c.data,'lineColor','#03EA1E')
                    this.myDiagram.model.setDataProperty(c.data,'arrowHeadColor','#03EA1E')
                    this.myDiagram.model.setDataProperty(c.data,'arrowHeadBgColor','#03EA1E')

                    //
                   }
                })


                // if (this.myDiagram.model.findNodeDataForKey(c.data.from).nodeType === 'COND') {
                //   node = this.alreadyApproveList.filter(row=>row.currNodeId==toNode.data.props.id); // && row.wtState === 'FINISHED'
                // }
                // if(node && node.length) {
                //     this.myDiagram.model.setDataProperty(c.data,'lineColor','lightgreen')
                //     this.myDiagram.model.setDataProperty(c.data,'arrowHeadColor','lightgreen')
                //     this.myDiagram.model.setDataProperty(c.data,'arrowHeadBgColor','lightgreen')
                //     if (node.some(a=>a.wtState ==='WAIT')) {
                //       this.myDiagram.model.setDataProperty(c.data,'lineColor','#000')
                //       this.myDiagram.model.setDataProperty(c.data,'arrowHeadColor','#000')
                //       this.myDiagram.model.setDataProperty(c.data,'arrowHeadBgColor','#000')
                //     }
                //   } else {
                //     this.myDiagram.model.setDataProperty(c.data,'lineColor','#000')
                //     this.myDiagram.model.setDataProperty(c.data,'arrowHeadColor','#000')
                //     this.myDiagram.model.setDataProperty(c.data,'arrowHeadBgColor','#000')
                //   }

                 return
                }

                else if(node_to && node_to.length>0 && fromNode.data.nodeType==='COND'){
                  this.myDiagram.model.setDataProperty(c.data,'strokeWidth',3)

                  this.myDiagram.model.setDataProperty(c.data,'lineColor','#03EA1E')
                    this.myDiagram.model.setDataProperty(c.data,'arrowHeadColor','#03EA1E')
                    this.myDiagram.model.setDataProperty(c.data,'arrowHeadBgColor','#03EA1E')
                    return  
                }
                else if(node && node.length>0 && toNode.data.nodeType==='COND'){
                  
                  if(!fromIfNode.hasOwnProperty(toNode.data.props.nodeNo)){
                      return
                  }
                  //console.log(fromIfNode)
                  if(fromIfNode[toNode.data.props.nodeNo].to){
                    this.myDiagram.model.setDataProperty(c.data,'strokeWidth',3)

                    this.myDiagram.model.setDataProperty(c.data,'lineColor','#03EA1E')
                    this.myDiagram.model.setDataProperty(c.data,'arrowHeadColor','#03EA1E')
                    this.myDiagram.model.setDataProperty(c.data,'arrowHeadBgColor','#03EA1E')
                  }
                  //  this.myDiagram.model.setDataProperty(c.data,'lineColor','lightgreen')
                   // this.myDiagram.model.setDataProperty(c.data,'arrowHeadColor','lightgreen')
                   // this.myDiagram.model.setDataProperty(c.data,'arrowHeadBgColor','lightgreen')
                  return  
                }
                else{

                  return
                }

            })

        }
    },

    getAlreadyApproveList(){
        this.alreadyApproveList = this.items
        if(this.alreadyApproveList && this.alreadyApproveList.length>0){
            this.rendenerApproveNode()
            return
        }
        if(!this.formData || !this.formData.form){  return  }
        const _data = { url: '/wf-work-approve/approveDetails', params: {data:this.formData.form.id} }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
            .then(data => {
                this.alreadyApproveList =  data
                this.rendenerApproveNode()
            }).catch(err => {
            console.error(err)
        })

    },
    getNodes(modeId) {
      const _data = { url: "/wf-work-node-item/selectByWfId", params: {data: modeId} };
      this.$store
        .dispatch("fmsCommon/actionTaskPost", _data)
        .then((data) => {
         this.redenerNodeList(data)
        })
        .catch((err) => {
          console.error(err);
        });
    },

    redenerNodeList(list){
       if(!list || list==null || list.length==0)
          return
       if(this.myDiagram && this.myDiagram.nodes)
         this.myDiagram.nodes.map(c=>{
          const node = list.filter(row=>row.nodeNo==c.data.props.nodeNo)
          if(node && node.length>0)
          {
            if(!node[0].conditions && node[0].nodeType=='COND'){
               node[0].conditions = [{nodeNo:'',nodeNextNo:'',nodeOutput:''}]
            }
            this.myDiagram.model.setDataProperty(c.data,'props',node[0])
            if(node[0].approveRole=='USER' && node[0].approveUsername){
              this.myDiagram.model.setDataProperty(c.data,'text',`[${node[0].nodeNo}]${node[0].approveUsername}`)
            }else if((node[0].approveRole=='DEPT' || node[0].approveRole=='UGROUP') && node[0].groupName){
              this.myDiagram.model.setDataProperty(c.data,'text',`[${node[0].nodeNo}]${node[0].groupName}`)
            }          
          }
       })
       this.getAlreadyApproveList() 
     },
  init() {

// Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
// For details, see https://gojs.net/latest/intro/buildingObjects.html
const $ = go.GraphObject.make;  // for conciseness in defining templates

let myDiagram = this.myDiagram =
  new go.Diagram("myDiagramDiv",  // must name or refer to the DIV HTML element
    {
    //   grid: $(go.Panel, "Grid",
    //     $(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
    //     $(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 10 }),
    //     $(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
    //     $(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 10 })
    //   ),
      "allowDrop":false,
      "allowMove":false,
      "allowDragOut":false,
      "draggingTool.dragsLink": false,
      "draggingTool.isGridSnapEnabled": true,
      "linkingTool.isUnconnectedLinkValid": true,
      "linkingTool.portGravity": 20,
      "relinkingTool.isUnconnectedLinkValid": true,
      "relinkingTool.portGravity": 20,
      "relinkingTool.fromHandleArchetype":
        $(go.Shape, "Diamond", { segmentIndex: 0, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "tomato", stroke: "darkred" }),
      "relinkingTool.toHandleArchetype":
        $(go.Shape, "Diamond", { segmentIndex: -1, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "darkred", stroke: "tomato" }),
      "linkReshapingTool.handleArchetype":
        $(go.Shape, "Diamond", { desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
      "rotatingTool.handleAngle": 270,
      "rotatingTool.handleDistance": 30,
      "rotatingTool.snapAngleMultiple": 15,
      "rotatingTool.snapAngleEpsilon": 15,
      "toolManager.hoverDelay": 100,
      "undoManager.isEnabled": false,
      allowSelect:false,
      allowLink:false
    });

    myDiagram.toolManager.dragSelectingTool.isEnabled = false;
// when the document is modified, add a "*" to the title and enable the "Save" button
myDiagram.addDiagramListener("Modified", e => {
    return false
//   var button = document.getElementById("SaveButton");
//   if (button) button.disabled = !myDiagram.isModified;
//   var idx = document.title.indexOf("*");
//   if (myDiagram.isModified) {
//     if (idx < 0) document.title += "*";
//   } else {
//     if (idx >= 0) document.title = document.title.slice(0, idx);
//   }
});


//ExternalObjectsDropped
//ChangedSelection

myDiagram.addDiagramListener("ChangedSelection", (e) => {

    return false
})

// Define a function for creating a "port" that is normally transparent.
// The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
// and where the port is positioned on the node, and the boolean "output" and "input" arguments
// control whether the user can draw links from or to the port.
function makePort(name, spot, output, input) {
  // the port is basically just a small transparent circle
  return $(go.Shape, "Circle",
    {
      fill: null,  // not seen, by default; set to a translucent gray by showSmallPorts, defined below
      stroke: null,
      desiredSize: new go.Size(7, 7),
      alignment: spot,  // align the port on the main Shape
      alignmentFocus: spot,  // just inside the Shape
      portId: name,  // declare this object to be a "port"
      fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
      fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
      cursor: "pointer"  // show a different cursor to indicate potential link point
    });
}

var nodeSelectionAdornmentTemplate =
  $(go.Adornment, "Auto",
    $(go.Shape, { fill: null, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] }),
    $(go.Placeholder)
  );

var nodeResizeAdornmentTemplate =
  $(go.Adornment, "Spot",
    { locationSpot: go.Spot.Right },
    $(go.Placeholder),
    $(go.Shape, { alignment: go.Spot.TopLeft, cursor: "nw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
    $(go.Shape, { alignment: go.Spot.Top, cursor: "n-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
    $(go.Shape, { alignment: go.Spot.TopRight, cursor: "ne-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

    $(go.Shape, { alignment: go.Spot.Left, cursor: "w-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
    $(go.Shape, { alignment: go.Spot.Right, cursor: "e-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

    $(go.Shape, { alignment: go.Spot.BottomLeft, cursor: "se-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
    $(go.Shape, { alignment: go.Spot.Bottom, cursor: "s-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
    $(go.Shape, { alignment: go.Spot.BottomRight, cursor: "sw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" })
  );

var nodeRotateAdornmentTemplate =
  $(go.Adornment,
    { locationSpot: go.Spot.Center, locationObjectName: "ELLIPSE" },
    $(go.Shape, "Ellipse", { name: "ELLIPSE", cursor: "pointer", desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
    $(go.Shape, { geometryString: "M3.5 7 L3.5 30", isGeometryPositioned: true, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] })
  );      
let nodeClick =(e,node)=>{
  myDiagram.model.setDataProperty(node.data,'fill',"#2E0AF1")

};
function performLinkValidation(fromNode, fromGraphObject, toNode, toGraphObject, link, maxOutboundLinks){
        if(fromNode && fromNode.data.nodeType!=='COND'){
           let childrenLinks = fromNode.findTreeChildrenLinks();
            if (childrenLinks.count>maxOutboundLinks-1){
              return false;
            } else {
              return true;
            }
        }
         return true
        }
 let self = this       
 function showToolTip(obj, diagram, tool) {
    if(obj.data.nodeType=='COND')
     return
    let toolTipDIV = document.getElementById('toolTipDIV');
    let pt = diagram.lastInput.viewPoint;
    toolTipDIV.style.left = (pt.x + 4) + "px";
    toolTipDIV.style.top = (pt.y + 4) + "px";
    //document.getElementById('toolTipParagraph').textContent = "Tooltip for: " + obj.data.key;

    //获取审批人信息
     self.tipTableData = self.alreadyApproveList.filter(row=>row.currNodeId==obj.data.props.id)
     if(self.tipTableData && self.tipTableData.length>0)
         toolTipDIV.style.display = "block";
  }

  function hideToolTip(diagram, tool) {
   var toolTipDIV = document.getElementById('toolTipDIV');
   toolTipDIV.style.display = "none";
  }

  var myToolTip = $(go.HTMLInfo, {
    show: showToolTip,
    hide: hideToolTip
    /*
      since hideToolTip is very simple,
      we could have set mainElement instead of setting hide:
      mainElement: document.getElementById('toolTipDIV')
    */
  });

myDiagram.nodeTemplate =
  $(go.Node, "Spot",
    { locationSpot: go.Spot.Center },
    {linkValidation: function(fromNode, fromGraphObject, toNode, toGraphObject, link){
       //return false
       return performLinkValidation(fromNode, fromGraphObject, toNode, toGraphObject, link, 1)
     }
     },
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    { selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
    { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
    { rotatable: true, rotateAdornmentTemplate: nodeRotateAdornmentTemplate },
    new go.Binding("angle").makeTwoWay(),
    // the main object is a Panel that surrounds a TextBlock with a Shape
    $(go.Panel, "Auto",
      { name: "PANEL" },
      new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
      $(go.Shape, "Rectangle",  // default figure
        {
          portId: "", // the default port: if no spot on link data, use closest side
          fromLinkable: true, toLinkable: true, cursor: "pointer",
          fill: "white",  // default color
          strokeWidth: 2
        },
        new go.Binding("figure"),
        new go.Binding("fill")),
        new go.Binding("props"),
        new go.Binding("nodeType"),
        new go.Binding("nodeNo"),

      $(go.TextBlock,
        {
          font: "bold 10pt Helvetica, Arial, sans-serif",
          margin: 8,
          maxSize: new go.Size(160, NaN),
          wrap: go.TextBlock.WrapFit,
          editable: true
        },
        new go.Binding("text").makeTwoWay())
    ),
    
    // four small named ports, one on each side:
    makePort("T", go.Spot.Top, false, true),
    makePort("L", go.Spot.Left, true, true),
    makePort("R", go.Spot.Right, true, true),
    makePort("B", go.Spot.Bottom, true, false),
    { // handle mouse enter/leave events to show/hide the ports
      mouseEnter: (e, node) => {
        showSmallPorts(node, true)
      },
      mouseLeave: (e, node) => showSmallPorts(node, false),
      mouseDragEnter:(e,node) =>{
         //console.log(node)
      },
      mouseDrop:(e,node) =>{
         //console.log(node)
      },
    },
    {
      doubleClick:(e,node)=>{
    },
    click:(e,node)=>{
    },
    selectionAdorned: false
  },
  {
    toolTip:myToolTip
  }
//   { toolTip:                       // define a tooltip for each node
//           $(go.Adornment, "Spot",      // that has several labels around it
//             { background: "transparent" },  // avoid hiding tooltip when mouse moves
//             $(go.Placeholder, { padding: 5 }),
//             $(go.TextBlock,
//               { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom, stroke: "red" },
//               new go.Binding("text", "key", function(s) { return "key: " + s; })),
//             $(go.TextBlock, "Bottom",
//               { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top, stroke: "red" },
//               new go.Binding("text", "color", function(s) { return "color: " + s; }))
//           )  // end Adornment
//         }
  );
myDiagram.nodeTemplate1 =
  $(go.Node, "Spot",
    { locationSpot: go.Spot.Center },
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    { selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
    { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
    { rotatable: true, rotateAdornmentTemplate: nodeRotateAdornmentTemplate },
    new go.Binding("angle").makeTwoWay(),
    // the main object is a Panel that surrounds a TextBlock with a Shape
    $(go.Panel, "Auto",
      { name: "PANEL" },
      new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
      $(go.Shape, "Rectangle",  // default figure
        {
          portId: "", // the default port: if no spot on link data, use closest side
          fromLinkable: true, toLinkable: true, cursor: "pointer",
          fill: "white",  // default color
          strokeWidth: 2
        },
        new go.Binding("figure"),
        new go.Binding("fill")),
      $(go.TextBlock,
        {
          font: "bold 10pt Helvetica, Arial, sans-serif",
          margin: 8,
          maxSize: new go.Size(160, NaN),
          wrap: go.TextBlock.WrapFit,
          editable: true
        },
        new go.Binding("text").makeTwoWay())
    ),
    // four small named ports, one on each side:
    makePort("T", go.Spot.Top, false, true),
    makePort("L", go.Spot.Left, true, true),
    makePort("R", go.Spot.Right, true, true),
    makePort("B", go.Spot.Bottom, true, false),
    { // handle mouse enter/leave events to show/hide the ports
      mouseEnter: (e, node) => showSmallPorts(node, true),
      mouseLeave: (e, node) => showSmallPorts(node, false)
    }
  );

function showSmallPorts(node, show) {
  node.ports.each(port => {
    if (port.portId !== "") {  // don't change the default port, which is the big shape
      port.fill = show ? "rgba(0,0,0,.3)" : null;
    }
  });
}

var linkSelectionAdornmentTemplate =
  $(go.Adornment, "Link",
    $(go.Shape,
      // isPanelMain declares that this Shape shares the Link.geometry
      { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 })  // use selection object's strokeWidth
  );

myDiagram.linkTemplate =
  $(go.Link,  // the whole link panel
    { selectable: true, selectionAdornmentTemplate: linkSelectionAdornmentTemplate },
    { relinkableFrom: true, relinkableTo: true, reshapable: true },
    {
      routing: go.Link.AvoidsNodes,
      curve: go.Link.JumpOver,
      corner: 5,
      toShortLength: 4,
    },
    new go.Binding("points").makeTwoWay(),

    $(go.Shape,  // the link path shape
      { isPanelMain: true, strokeWidth: 2, stroke: '#000' },new go.Binding("stroke",'lineColor').makeTwoWay(),new go.Binding("strokeWidth",'strokeWidth').makeTwoWay()),
      
    $(go.Shape,  // the arrowhead
      { toArrow: "Standard", stroke: '#000',fill:'#000' },
      new go.Binding("stroke",'arrowHeadColor').makeTwoWay(),
      new go.Binding("fill",'arrowHeadBgColor').makeTwoWay(),
      
      ),
    $(go.Panel, "Auto",
      new go.Binding("visible", "isSelected").ofObject(),
      $(go.Shape, "RoundedRectangle",  // the link shape
        { fill: "#F8F8F8", stroke: null }),
      $(go.TextBlock,
        {
          textAlign: "center",
          font: "10pt helvetica, arial, sans-serif",
          stroke: "#919191",
          margin: 2,
          minSize: new go.Size(10, NaN),
          editable: true
        },
        new go.Binding("text").makeTwoWay())
    ),
    { click:(e,link)=>{
    }}
  );

//load();  // load an initial diagram from some JSON text

// initialize the Palette that is on the left side of the page
},
      initDocTempData(){
        let _data = { url: this.url.flowTempUri, params: {data:this.tempDocNo}}
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
              this.flowName = data.docName
          }).catch(err => {
           console.error(err)
        })
      },
      getList(id) {
        const _data = { url: this.url.list, params: {data:id} }
        this.$store.dispatch('fmsCommon/actionTaskPost', _data)
          .then(data => {
            this.detaillist = data
            // this.total = data.total
            //this.listLoading = false
          }).catch(err => {
          console.error(err)
        })
        //   httpUtils.actionFmsPost('/line/list',this.listQuery).then(data => {
        //       console.log(data)
        //   })
      },
      selectOptions(){
        // let _data = { url: '/wf-constant/approveOpinion', params: {}}
        // this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        //   .then(data => {
        //     this.initSelect.approveOpinion = data.filter(c=>c.value!='START').map(c => {
        //       return {
        //         label: c.name,
        //         value: c.value
        //       }
        //     })
        //   }).catch(err => {
        //   console.error(err)
        // })

      },

      getValueConvert(arr, value) {
                for (let v of arr) {
                    if (v.value == value) {
                        return v.label
                    }
                }
                return value
            },
      commonFilter(value, type) {
        if (this.initSelect.hasOwnProperty(type) && typeof this.initSelect[type] !== undefined && Array.isArray(this.initSelect[type])) {
          return this.getValueConvert(this.initSelect[type], value)
        }
        if (this.initSelect.hasOwnProperty(type) && !Array.isArray(this.initSelect[type]) && this.initSelect[type].hasOwnProperty(value)) {
          return this.initSelect[type][value]
        }
        return value
    }
}
  }
  </script>
  
  <style lang="scss" >
  
  </style>
  