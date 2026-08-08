<template>
     <div>
      <el-tree
          :data="funcMngData"
          :props="defaultProps"
          show-checkbox
          node-key="id"
          ref="tree"
          :default-expanded-keys="defaultShowNodes"
          :default-checked-keys="defaultShowKeys"
          :check-strictly="true"
          :check-on-click-node="true"
          @check="checkFunc"
          @check-change="checkChange"
          :load="loadNode"
          lazy
        />
     </div>
  </template>
  <script>
  export default {
    name: 'CwSelectUserGroup',
    components: {},
    props: {
      itemStyle: {
        type: Object,
        default: () => {
          return {}
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

        defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf",
      },
        cwDialogVisible: false
      };
    },
    created() {
    },
    mounted() {

    },
    beforeDestroy() { },
  
    methods: {
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
          let { checkedKeys } = treeChoseObj;
          // if(this.nodeType!='GROUP'){
          //   this.$refs.tree.setCheckedNodes([])
          // }
          if(this.allMenuId && this.allMenuId.indexOf(data.id)!=-1){
            this.$refs.tree.setChecked(data.id,false)
          }else{
            this.$refs.tree.setChecked(data.id,true)
          }
          this.allMenuId = this.$refs.tree.getCheckedKeys();
          let nodes = this.$refs.tree.getCheckedNodes();
          this.userCurrNode = nodes[0]
          this.userCurrNodes = nodes
          //this.$refs.tree.setCheckedKeys(this.allMenuId)
        },
    },
 
  }
  </script>
  <style lang="scss" scoped>
  ::v-deep .el-input__inner {
    height: 100%;
  }
  </style>