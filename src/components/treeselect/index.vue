
<template>
  <el-select
    :value="slectvalue"
    :placeholder="placeholder"
    style="width: 180px"
    :filterable="filterable"
    :clearable="clearable"
    @visible-change="selectBlur"
    :filter-method="filterText"
    @clear="clear"
    ref="select"
    :size="size"
  >
    <el-option style="height: auto; padding: 0" :value="slectvalue" :label="propname">
      <el-tree
        :data="options"
        :node-key="nodeKey"
        ref="tree"
        :check-strictly="true"
        :expand-on-click-node="false"
        highlight-current
        :current-node-key="slectvalue"
        :props="props"
        @node-click="trreClick"
        :filter-node-method="filterNode"
      >
        <div slot-scope="{ node, data }">
          <div v-if="disabled" :style="typeofDisabledval(data[nodeKey]) ? 'color:#ccc;' : undefined">{{ node.label }}</div>
          <div v-else>{{ node.label }}</div>
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
  //disabledval 传入数组或者字符串/数字
  //disabledText 点击禁用弹出提示
  //size 选择器大小
  //clearable 是否显示可清空
  props: ["slectvalue", "props", "options", "nodeKey", "placeholder", "filterable", "disabled", "disabledval", "disabledText", "size", "clearable"],
  // 组件使用v-mode
  // event:'asd' 子组件发出asd信号 就能使props:'slectvalue'改变 就是父组件v-model的值会改变
  model: {
    prop: "slectvalue",
    event: "newid",
  },
  data() {
    return {
      thisProps: {
        children: "children",
        label: "label",
      },
    };
  },
  //方法集合
  methods: {
    // 点击树形选择器选项
    trreClick(data, node, item) {
      //存在禁用
      if (this.disabled) {
        if (this.typeofDisabledval(data[this.nodeKey])) {
          this.$message.error(this.disabledText || "不可用");
          this.$refs.tree.setCurrentKey(this.slectvalue);
          return;
        }
      }
      if (data[this.nodeKey] != this.slectvalue) {
        this.$emit("update:slectvalue", data[this.nodeKey]);
        this.$emit("newdata", data); //往外发出选中的数据包
      }
      this.$refs.select.blur(); //点击后下拉框收起来
    },
    //判断禁用类型
    typeofDisabledval(data) {
      if (this.disabledval) {
        if (typeof this.disabledval == "number" || typeof this.disabledval == "string") {
          return data == this.disabledval;
        } else {
          return this.disabledval.indexOf(data) != -1;
        }
      } else {
        return false;
      }
    },
    selectBlur(key) {
      key ? this.$refs.tree.filter(undefined) : undefined;
    },
    //搜索树形选择器
    filterText(value) {
      this.$refs.tree.filter(value);
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
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
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
        this.thisProps.children = newVal.children || this.thisProps.children;
        this.thisProps.label = newVal.label || this.thisProps.children;
      },
      immediate: true,
      deep: true,
    },
  },

  beforeDestroy() {},
};
</script>
<style lang="scss" scoped>

</style>