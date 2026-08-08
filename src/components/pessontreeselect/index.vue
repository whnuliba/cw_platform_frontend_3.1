
<template>
  <el-select
    :value="selectname"
    placeholder=""
    :style="styles"
    :filterable="true"
    @visible-change="selectBlur"
    @remove-tag="removetag"
    :filter-method="filterText"
    @clear="clear"
    ref="select"
    :multiple="multiple"
  >
    <el-option style="height: auto; padding: 0" value="" >
      <el-tree
        v-show="lazy"
        key="1"
        :data="lazyMngData"
        node-key="id"
        ref="tree"
        :check-strictly="true"
        :check-on-click-node="true"
        :expand-on-click-node="true"
        highlight-current
        :props="defaultProps"
        @node-click="trreClick"
        :filter-node-method="filterNode"
        :load="lazy ? loadNode : ''"
        :lazy='lazy'
      >
        <div slot-scope="{ node, data }">
          <div class="personvalue" >{{ node.label }}</div>
        </div>
      </el-tree>
      <el-tree
        v-show="!lazy"
        key="2"
        :data="funcMngData"
        node-key="id"
        ref="tree"
        :default-expand-all='true'
        :check-strictly="true"
        :check-on-click-node="true"
        :expand-on-click-node="true"
        highlight-current
        :props="defaultProps"
        @node-click="trreClick"
        :filter-node-method="filterNode"
      >
        <div slot-scope="{ node, data }">
          <div class="personvalue">{{ node.label }}</div>
        </div>
      </el-tree>
    </el-option>
  </el-select>
</template>
<script>
export default {
  name: "elTreeSelect",
  //options 树形数据
  //nodeKey 对应el-tree的node-key
  //filterable 是否开启搜索功能
  props: ["multiple","styles","slectvalue", "props",],
  // 组件使用v-mode
  // event:'asd' 子组件发出asd信号 就能使props:'slectvalue'改变 就是父组件v-model的值会改变
  // props:{
  //   "multiple":{
  //     type:Boolean,
  //     default:true,
  //   },
  //   "styles":{
  //     type:String,
  //     default:"width:180px;",
  //   },
  //   "slectvalue":{
  //     type:Array,
  //     default:[],
  //   },
  // },
  model: {
    prop: "slectvalue",
    event: "newid",
  },
  data() {
    return {
      funcMngData: [],
      lazyMngData: [],
      multiplearr:[],
      multiplenamearr:[],
      lazy:true,
      isDown:true,
      selectname: [],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf",
      },
      thisProps: {
        children: "children",
        label: "label",
      },
      timer:undefined,
    };
  },
  //方法集合
  methods: {
    removetag(val){
      this.isDown = false
      this.multiplearr.forEach((item,index)=>{
        if(item.realName == val){
          this.multiplearr.splice(index,1)
        }
      })
      this.selectname = this.multiplearr.map(item1=>{return item1.realName})
      this.$emit("update:slectvalue", this.multiplearr);
        // this.isDown = true
      this.timer = setInterval(() => {
        this.isDown = true
        clearInterval(this.timer)
      },500)

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
     loop(data, id) {
      const res = [];
      data.forEach((item) => {
        item.label = item.name;
        item.value = item.id;
        item["leaf"] = false;
        if(item.deptType === 100 || item.deptType === 200){
          item["disabled"] = true;
        }
        if ( item.children.length > 0) {
          item.children = this.loop(item.children, item.id);
        }
        res.push(item);
      });

      return res;
    },
    treeData(data, id) {
      this.loop(data, id);
      return this.loop(data, id);
    },
    getPersonData(){
      const _data = { url: "/org/org-tree" };
      this.$store.dispatch("fmsCommon/actionAuthPost", _data).then((data) => {
        const newData = this.treeData(data, "0");
        this.lazyMngData = newData;

      });
    },
    // 点击树形选择器选项
    trreClick(data, node, item) {
      this.isDown = false
      // this.multiplearr.forEach()
      let identical = this.multiplearr.some(item=>{ if(item.id === data.id) return true })
      if(identical){return}
      if (data.disabled) {
          return;
      }
      if(this.multiple){
        
        // let obj = {
        //   realName: data.realName,
        //   userName: data.id,
        // }
        if(!this.slectvalue.push) {this.slectvalue = []}
        this.multiplearr.push(data)
        this.selectname.push(data.label)
        // this.selectname = [...this.selectname,...this.multiplenamearr]
        this.$emit("update:slectvalue", this.multiplearr);
        // this.isDown = true
      }else{
        this.selectname = data.label
        this.$emit("update:slectvalue", data.id);
        this.$emit("newdata", data.id); //往外发出选中的数据包
        this.$refs.select.blur(); //点击后下拉框收起来
      }
      this.timer = setInterval(() => {
        this.isDown = true
        clearInterval(this.timer)
      },500)
      
    
    },
    selectBlur(key) {
      key ? this.$refs.tree.filter(undefined) : undefined;
    },
    //搜索树形选择器
    filterText(value) {
      const _data = { url: "/org/org-tree-user", params:{data:value}};
      this.$store.dispatch("fmsCommon/actionAuthPost", _data).then((data) => {
        if(data.length>0){
          this.lazy = false
          const newData = this.treeData(data, "0");
          this.funcMngData = newData;
          this.$refs.tree.filter(value);
        }else{
          this.lazy = true
        }
        

      });
    },
    //树形选择器搜索需要
    filterNode(value, data, node) {
      if (!value) return true;
      return node.label.indexOf(value) !== -1;
    },
    //清空数据
    clear() {
      this.$emit("newid", "");
    },
    //找到选中对应id的name  调用时res可不传入，函数内部用作返回的值
    findTreeIdToName(tree, id, idkey = "id", namekey = "label", childrenkey = "children", res) {
      res = res;
      for (let item of tree) {
        if (id == item[idkey]) {
          res = item[namekey];
          break;
        }
        if (item[childrenkey] && item[childrenkey].length) {
          res = this.findTreeIdToName(item[childrenkey], id, idkey, namekey, childrenkey, res);
        }
      }
      return res;
    },
    //遍历树形数据 itemfun 传入一个方法 携带数据参数
    findTreeIdToName2(tree, childrenkey = "children", itemfun) {
      for (let item of tree) {
        itemfun(item);
        if (item[childrenkey] && item[childrenkey].length) {
          this.findTreeIdToName2(item[childrenkey], childrenkey, itemfun);
        }
      }
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getPersonData()
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
  },
  //监听属性 类似于data概念
  computed: {
    //树形选择器  选择器的label的值
    propname() {
      let name = "";
      this.findTreeIdToName2(this.options, this.thisProps.children, (item) => {
        if (item[this.nodeKey] == this.slectvalue) {
          name = item[this.thisProps.label];
          process.nextTick(() => {
            this.$refs.tree.setCurrentKey(this.slectvalue);
          });
        }
      });
      return name;
    },
  },
  //监控data中的数据变化
  watch: {
    props: {
      handler(newVal) {
        // this.thisProps.children = newVal.children || this.thisProps.children;
        // this.thisProps.label = newVal.label || this.thisProps.children;
      },
      immediate: true,
      deep: true,
    },
    slectvalue: {
      handler(val) {
        if(val && this.isDown){
          if(val.length>0){
            // if(val[0].userName && !/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/.test(val)){
            //   this.selectname = val.map(item1=>{
            //     return item1.userName
            //   })
            // }else{
              let idarr = val.map(item=>{
                return item.userId
              })
              let _data = {url: '/user/get-all-ids',params: {data:idarr}}
              this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
                this.multiplearr = data
                this.selectname = data.map(item1=>{
                  return item1.realName
                })
              })
            // }
           

          }else{
            this.selectname = []
            this.multiplearr = []
            this.multiplenamearr = []
          }
         
        }else if(!val){
          this.selectname = []
          this.selectname = []
        }
      },
      immediate: true,
      deep: true,
    },
  },

  beforeDestroy() {
  },
};
</script>
<style lang="scss" scoped>
.personvalue{
  font-weight: normal;
}
</style>