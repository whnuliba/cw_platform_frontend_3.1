<template>
  <el-dialog title="管理人员" class="cw-dialog" v-el-drag-dialog :visible.sync="dialogVisible" width="700px"
    :before-close="handleClose">
    <!-- 人员列表 -->
    <div class="container_left">
      <div class="list_data" v-for="item in userList">
        {{item.REAL_NAME}}
      </div>
    </div>
    <div class="container_right">
      <!-- 树 -->
      <el-tree :data="allUserData" :props="defaultProps" show-checkbox node-key="id" ref="tree"
        :default-expanded-keys="defaultShowNodes" :default-checked-keys="defaultShowKeys" :check-strictly="true"
        :check-on-click-node="true" @check="checkFunc" @check-change="checkChange" :load="loadNode" lazy />
    </div>
    <!-- <el-table :data="userList" style="width: 100%" border>
      <el-table-column v-for="item in columns" :key="item.field" :label="item.title" :prop="item.field"
        :width="item.width" :min-width="item.minWidth" v-if="!item.hide" :align="item.align" />
    </el-table> -->

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleSubmit()" plain>保存</el-button>
    </div>
  </el-dialog>


</template>
<script>
  import elDragDialog from "@/directive/el-drag-dialog";
  export default {
    name: 'CwUserControll',
    components: {},
    directives: { elDragDialog },
    filters: {},
    props: {
      dialogVisible: {
        type: Boolean,
        default: () => { return false }
      },
      rowData: {
        type: Object,
        default: null
      }
    },
    watch: {
      dialogVisible: {
        handler: function (newVal, oldVal) {
          if (newVal) {
            this.getTreeList();
            this.getUserList();
          }
        },
        deep: true
      },
    },
    data() {
      const _initdata = {
        dataList : [],
        userList: [],  
        columns: [
          { field: 'USER_NAME', title: '用户Login', minWidth: 150, align: "center", queryType: 'input', set: true, require: true, query: false, hide: false, disabled: false, },
          { field: 'REAL_NAME', title: '用户姓名', minWidth: 150, align: "center", queryType: 'input', set: true, require: true, query: false, hide: false, disabled: false, },
        ],
        allUserData: [],
        defaultProps: {
          children: "children",
          label: "label",
          isLeaf: "leaf",
        },
        defaultShowNodes: [],
        defaultShowKeys: [],
      }

      return _initdata
    },
    created() {
    },
    mounted() {
    },
    methods: {
      // 获得人员信息
      getUserList() {
        if (this.rowData.ID) {
          let sqlWheres = []
          sqlWheres.push({
            column: 'ITEM_ID',
            condition: '=',
            value: this.rowData.ID
          })
          const _data1 = { url: "/project-item-user/query", params: { data: { sqlWhere: sqlWheres } } };
          this.$store.dispatch("fmsCommon/actionTaskPost", _data1).then((data) => {
            this.userList = data;
            this.dataList = data
            this.userList.forEach(item => {
              this.defaultShowKeys.push(item.USER_ID)
            })
          }).catch(err => {
            this.$message({
              type: 'error',
              message: '执行失败' + JSON.stringify(err)
            });
          })
        }
      },
      // 获得用户树
      getTreeList() {
        const _data = { url: "/org/org-tree" };
        this.$store.dispatch("fmsCommon/actionAuthPost", _data).then((data) => {
          const newData = this.treeData(data, "0");
          this.allUserData = newData;
        }).catch(err => {
          this.$message({
            type: 'error',
            message: '执行失败' + JSON.stringify(err)
          });
        })
      },
      treeData(data, id) {
        this.loop(data, id);
        return this.loop(data, id);
      },
      loop(data, id) {
        const res = [];
        data.forEach((item) => {
          item.label = item.name;
          item.value = item.id;
          item["leaf"] = false;
          item["disabled"] = true;
          if (item.children && item.children.length > 0) {
            item.children = this.loop(item.children, item.id);
          }
          res.push(item);
        });
        return res;
      },
      //check事件 当复选框被点击的时候触发
      checkFunc(data, treeChoseObj) {
        this.hanleCheck(data, treeChoseObj, "tree");
        let checkDataList = []
        if (treeChoseObj.checkedNodes) {
          for (let i in treeChoseObj.checkedNodes) {
            let checkData = treeChoseObj.checkedNodes[i]
            checkDataList.push(checkData)
          }
        }
        // console.log("checkDataList", checkDataList)
        this.userList = checkDataList.map(item => {
          return {
            "REAL_NAME": item.realName,
            "USER_ID": item.id,
            "USER_NAME": item.userName,
            ...item
          }
        })
      },
      hanleCheck(data, node, treeName) {
        const _this = this;
        // 获取当前节点是否被选中
        const isChecked = this.$refs[treeName].getNode(data).checked;
        // 如果当前节点被选中，则遍历下级子节点并选中，如果当前节点取消选中，则遍历下级节点并取消选中
        if (isChecked) {
          // 判断是否有上级节点，如果有那么遍历设置上级节点选中
          if (data.pid || data.pid === 0) {
            setParentChecked(data.pid);
          }
          // 判断该节点是否有下级节点，如果有那么遍历设置下级节点为选中
          data.children && data.children.length > 0 && setChildreChecked(data.children, true);
        } else {
          // 如果节点取消选中，则取消该节点下的子节点选中
          data.children && data.children.length > 0 && setChildreChecked(data.children, false);
        }
        function setParentChecked(pid) {
          // 获取该id的父级node
          const parentNode = _this.$refs[treeName].getNode(pid);
          // 如果该id的父级node存在父级id则继续遍历
          parentNode && parentNode.data && parentNode.data.pid && setParentChecked(parentNode.data.pid);
          //  设置该id的节点为选中状态
          _this.$refs[treeName].setChecked(pid, true);
        }
        function setChildreChecked(node, isChecked) {
          node.forEach((item) => {
            data.children && item.children.length > 0 && setChildreChecked(item.children, isChecked);
            _this.$refs[treeName].setChecked(item.id, isChecked);
          });
        }
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
        } else {
          // resolve(node.data.children);
          let _data = { url: '/user/dept-user', params: { data: node.data.id } }
          this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
            let arr = []
            if (data.length > 0) {
              arr = data.map(val => {
                val.label = val.realName;
                val.value = val.id;
                val["leaf"] = true;
                return val
              })
            }
            resolve([...node.data.children, ...arr])
          })
        }
      },
      checkChange(data, isSelect) {
        // 变量获取选中状态
        this.isCheckSelect = isSelect;
      },
      handleClose() {
        // this.dialogVisible = false
        this.userList = []
        this.allUserData = []
        this.defaultShowKeys = []
        this.$emit('controllUserClose', false);
      },
      handleSubmit() {
        // 为空值或未改变值时，不触发保存接口
        if (this.userList.length == 0 || this.userList == this.dataList) {
          this.handleClose()
          return
        }
        let userItems = this.userList.map(item => {
          return {
            "REAL_NAME": item.REAL_NAME,
            "PERMISSION": this.rowData.PERMISSION,
            "ITEM_ID": this.rowData.ID,
            "USER_ID": item.USER_ID,
            "USER_NAME": item.USER_NAME,
            "DESCRIPTION": this.rowData.DESCRIPTION,
          }
        })
        if (this.rowData.ID) {
          let _data = { url: '/project-item-user/batchCreateBaseComponent', params: { data: { data: userItems } } }
          let _this = this
          this.$store.dispatch('fmsCommon/actionTaskPost', _data)
            .then(data => {
              _this.handleClose()
              this.$message({
                type: 'success',
                message: '保存成功'
              });
            }).catch(err => {
              this.$message({
                type: 'error',
                message: '执行失败' + JSON.stringify(err)
              });
            })
        } else {
          this.$message({
            type: 'error',
            message: '当前没有选择可用的项目无法保存'
          });
        }
        // if (this.rowData.ID) {
        //   userItems.map(userItem => {
        //     let _data = { url: '/project-item-user/add', params: { data: userItem } }
        //     let _this = this
        //     this.$store.dispatch('fmsCommon/actionTaskPost', _data)
        //       .then(data => {
        //         _this.handleClose()
        //         this.$message({
        //           type: 'success',
        //           message: '新增成功' + data
        //         });
        //       }).catch(err => {
        //         this.$message({
        //           type: 'error',
        //           message: '执行失败' + JSON.stringify(err)
        //         });
        //       })
        //   })
        // } else {
        //   this.$message({
        //     type: 'error',
        //     message: '当前没有选择可用的项目无法保存'
        //   });
        // }
      }
    }
  }

</script>

<style lang="less" scoped>
  .container_left {
    float: left;
    width: 25%;
    min-height: 100%;
    border-right: 1px solid rgb(226, 224, 224);
  }

  .container_right {
    float: left;
    width: 75%;
    padding-left: 5px;
    border-left: 1px solid rgb(226, 224, 224);
    margin-left: -1px;
    min-height: 100%;
  }

  .list_data {
    text-align: center;
    line-height: 30px;
  }

  .el-tree {
    padding-top: 15px;
  }

  ::v-deep .el-dialog__body {
    height: 500px;
    overflow: auto;
  }
</style>