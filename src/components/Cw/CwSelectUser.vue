<template>
    <div class="cw-select-user-div">
     <div style="width: 500px;max-height: 100px;min-height: 30px; padding-bottom: 5px; padding-right: 5px; overflow-y: auto; border: 1px solid #D7DAE2; border-radius: 0px;">
      <el-tag
          v-for="tag in usernames"
          :key="tag.id"
          closable
          @close="()=>tagClose(tag)"
          :type="tag.type">
          {{tag.name}}
        </el-tag>
    </div> 
    <div >
      <el-input
      v-show="showFilterInput"
      @input="funcMngClick"
      style="width: 500px; height: 35px;margin-top: 5px; "
      
      v-model="filterUserName" placeholder="搜索"  prefix-icon="el-icon-search"></el-input>
    </div>
    <div style="max-height: 300px;width: 500px; overflow: auto;margin-top: 10px;">
     <el-tree
         :data="funcMngData"
         :props="defaultProps"
         show-checkbox
         node-key="id"
         ref="tree"
         :default-expanded-keys="defaultShowNodes"
         :default-checked-keys="userIdList"
         :check-strictly="true"
         :check-on-click-node="true"
         @check="checkFunc"
         :default-expand-all	="true"
         @check-change="checkChange"
       />
       </div>
       <!-- :load="loadNode"
         lazy -->
    </div>
  </template>
  <script>
  export default {
   name: 'CwSelectUser',
   components: {},
   props: {
    radio:Function,
    orgType: {
       type: Number,
       default: () => {
         return 300
       }
     },
    checkType: {
       type: Array,
       default: () => {
         return [300]
       }
     },
   },
   watch: {
  
   },
   computed: {},
   data() {
     return {
       funcMngData: [], // 功能管理变量
       defaultShowNodes: [],
       defaultShowKeys: [],
       allMenuId:[],
       userCurrNode: undefined,
       userCurrNodes:undefined,
       isCheckSelect:false,
       isTreeDialogShow:false,
       clickRow:undefined,
       userCurrRow:undefined,
       nodeType:undefined,
       usernames:[],
       filterUserName:null,
       defaultProps: {
       children: "children",
       label: "label",
       isLeaf: "leaf",
     },
     userIdList:[],
       cwDialogVisible: false,
       showFilterInput:true
     };
   },
   created() {
   },
   mounted() {

   },
   beforeDestroy() { },
  
   methods: {
        initData(callback){
            this.$nextTick(()=>{
                this.funcMngClick(callback)
             })
        },
    // 递归生成菜单树结构数据
        loop(data, id) {
          const res = [];
          data.forEach((item) => {
            item.label = item.name;
            item.value = item.id;
            item["leaf"] = false;
  
            if(this.checkType.indexOf(item.deptType)>-1)
            {
              item["disabled"] = false;
            }else{
              item["disabled"] = true;
            }
            if (item.children && item.children.length > 0) {
              item.children = this.loop(item.children, item.id);
            }
            res.push(item);
          });
          return res;
        },
        treeData(data, id) {
          return this.loop(data, id);
        },
        funcMngClick(callback) {
        let filter = this.filterUserName
        let url = "/org/org-tree-user"
        if(this.orgType==200){
            url = "/org/org-tree"
            this.showFilterInput=false
        }
       // this.defaultShowKeys = this.userIdList
        const _data = { url: url,params:{data:filter} };
        this.$store.dispatch("fmsCommon/actionAuthPost", _data).then((data) => {
            const newData = this.treeData(data, "0");
            this.funcMngData = newData;
           // this.defaultShowKeys =this.userIdList
            this.$nextTick(() => {
              this.$refs.tree.getCheckedNodes().forEach(c=>{
              this.checkFunc(c)
  
              if(this.usernames && this.usernames.length){
                let ids = this.usernames.map(c=>c.id)
                if(ids.indexOf(c.id)==-1){
                  this.usernames.push({name:c.name,type:'success',id:c.id,code:c.code,node:c})
                }
              }else{
                this.usernames = []
                this.usernames.push({name:c.name,type:'success',id:c.id,code:c.code,node:c})
              }
              this.userIdList = this.usernames.map(c=>c.id)
              
            })
            if(callback && typeof callback==='function')
            {
                callback.call(this,data)
            }
        })
        });
            //this.defaultShowKeys.length = 0
            // let uids = []
            // if(this.userCurrNode && this.userCurrNode.id)
            // uids =this.userCurrNode.id.split(",")    
            //this.defaultShowKeys =this.userIdList  
        },
       loadNode(node, resolve) {
         if (node.level === 0) {
           }else{
           // resolve(node.data.children);
           let _data = {url: '/user/dept-user',params: {data:node.data.id}}
           this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
             let arr = []
  
             if(data.length > 0){
               arr = data.map(val=>{
                 val.label = val.realName;
                 val.value = val.id;
                 val["leaf"] = true;
                 return val
               })
             }
             resolve([...node.data.children,...arr])
             })
           }
         },  
         checkChange(data, isSelect) {
         // 变量获取选中状态
         this.isCheckSelect = isSelect;
       },
    checkFunc(data, treeChoseObj) {
        // let { checkedKeys } = treeChoseObj;
         if(this.radio && typeof this.radio==='function' && this.radio()){
           this.$refs.tree.setCheckedNodes([])
           this.userIdList=[]
           this.usernames=[]
         }
         if(this.allMenuId && this.allMenuId.indexOf(data.id)!=-1){
           this.$refs.tree.setChecked(data.id,false)
           if(treeChoseObj){
              //点击树节点触发的时间
              if(this.usernames && this.usernames.length){
                  for(let i=0 ; i<this.usernames.length ;i++){
                      if(this.usernames[i].id==data.id){
                        this.usernames.splice(i,1)
                        break;
                      }
                  }
                  this.userIdList = this.usernames.map(c=>c.id)
              }
          }
         }else{
           this.$refs.tree.setChecked(data.id,true)
           if(treeChoseObj){
              //点击树节点触发的时间
              if(this.usernames && this.usernames.length){
                let ids = this.usernames.map(c=>c.id)
                if(ids.indexOf(data.id)==-1){
                  this.usernames.push({name:data.name,type:'success',id:data.id,code:data.code,node:data})
                }
              }else{
                this.usernames = []
                this.usernames.push({name:data.name,type:'success',id:data.id,code:data.code,node:data})
              }
              this.userIdList = this.usernames.map(c=>c.id)
          }
         }
         this.allMenuId = this.$refs.tree.getCheckedKeys();
         let nodes = this.$refs.tree.getCheckedNodes();
         this.userCurrNode = nodes[0]
         this.userCurrNodes = nodes
         //this.$refs.tree.setCheckedKeys(this.allMenuId)
       },
       tagClose(node){
         //let ids = this.usernames.filter(c=>c.node.id !=node.node.id).map(c=>c.node.id)
         this.$refs.tree.setChecked(node.id,false)
         if(this.usernames && this.usernames.length){
                  for(let i=0 ; i<this.usernames.length ;i++){
                      if(this.usernames[i].id==node.id){
                        this.usernames.splice(i,1)
                      }
                  }
           }
           this.userIdList = this.usernames.map(c=>c.id)
       }
   },
  
  }
  </script>
  <style lang="scss" scoped>
  ::v-deep .el-input__inner {
   height: 100%;
  }
  .cw-select-user-div{
    margin-top: 5px;
    margin-left: 5px;
  }
   .cw-select-user-div .el-tag {
      margin-left: 5px;
      margin-top: 5px;
    }
  </style>