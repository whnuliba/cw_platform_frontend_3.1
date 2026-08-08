/*
 * @CreatAuthor: 叶文龙
 * @UpdateAuthor: 宋丹峰
 * @Description: 权限管理-角色管理
 */
<template>
  <div class="app-container">
   <div class="filter-container">
      <!-- v-ele-show="{btnCode:'test_quth'}" -->
        <el-button
          type="primary"
          @click="funcManage()"
        >{{ $t("common.btn.save") }}</el-button>
    </div>
      <div :style="{height: treeAuthHeight,overflowY:'scroll'}">
        <!-- '600px' -->
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
        />
      </div>
  </div>
</template>

<script>
import { getRoles, addRoles, editRoles, delRoles, funcMenu, batchSaveFuncMng,funcByRoleId } from '@/api/role'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  components: { Pagination },
  directives: { elDragDialog },
  data() {
    return {
      treeAuthHeight: 0,
      defaultShowNodes: [],
      defaultShowKeys: [],
      isDialogShow: false,
      isTreeDialogShow: false,
      currentRow: {},
      total: 0,
      pageIndex: 1,
      pageSize: 15,
      listQuery: {
        roleName: undefined,
        roleCode: undefined,
        useState: undefined
      },
      cols: [
        {field: 'roleName', title: '角色名称', minWidth: 100, align: "center"},
        {field: 'roleCode', title: '角色编码', minWidth: 150, align: "center"},
        {field: 'useState', title: '启动状态', minWidth: 100, align: 'center',template:this.useStatetoC},
      ],
      funcMngData: [], // 功能管理变量
      funcResData: [], // 功能管理按钮点击回调的数据
      txtName: undefined,
      funcName: '',
      rule: {
        roleName: [{ required: true, message: this.$t('common.role.enter_roleName'), trigger: 'blur' }],
        roleCode: [{ required: true, message: this.$t('common.role.enter_roleCode'), trigger: 'blur' }],
        useState: [{ required: true, message: this.$t('common.role.select_useState'), trigger: 'blur' }]
      },
      tableData: [],
      defaultProps: {
          children: 'children',
          label: 'label'
        },
      allMenuId: [], // 所有功能管理树结构中的选中的菜单id数组
      tableRowId: '',
      isCheckSelect: false
    }
  },
  created() {
    this.funcMngClick()
  },
  mounted() {
    this.treeAuthHeight = window.innerHeight - 170 + 'px';
  },
  methods: {
    useStatetoC(data) {
      return data.useState == 0 ? this.$t('common.role.enable') : this.$t('common.role.disabled')
    },
    arrToTreeData(data, tree, parentId) {
      data.forEach(item => {
        if (item.pid === parentId) {
          let mlable = {title:item.funcName,field:"route."+item.funcCode,en_title:item.menuNameEn}
          const child = {
              pid: item.pid,
              id: item.id,
              label: this.commonI18n(mlable),
              children: []
            }
            tree.push(child)
            this.arrToTreeData(data, child.children, item.id)
          }
        })
        return tree
    },

    // 功能管理按钮点击
    funcMngClick() {     
            //this.funcMngData = newData  // 树形数据
            const _data = {url:'/role/allow-auth-query-all',params:{}}
            this.$store.dispatch('fmsCommon/actionAuthPost',_data)
            .then(data => {
                    this.funcResData = data
                    const newData = this.arrToTreeData(data, [], '0')
                    if (Array.isArray(newData) && newData[0].children && newData[0].children.length !== 0) {
                        let newArr = [newData[0].id];
                        newData[0].children.forEach(item => {
                            newArr.push(item.id)
                        })
                        this.defaultShowNodes = newArr;
                    }
                    //allow-auth-query-all
                       this.funcMngData = newData  // 树形数据
                        const _data = {url:'/role/allow-auth',params:{data:["ticket"]}}
                        this.$store.dispatch('fmsCommon/actionAuthPost',_data)
                        .then(data => {
                            this.defaultShowKeys = data;
                        }).catch(err => {
                            console.error(err)
                        })
            }).catch(err => {
                console.error(err)
            })
      funcMenu().then(res => {
        if (res.data.code === 200) {
     
          // 回显已勾选的菜单
        //   funcByRoleId({data: row.id}).then(res => {
        //       if (res.data.code === 200) {
        //           let {data} = res.data;
        //           let newCheckKeys = data.map(item => {
        //             item = item.funcId;
        //             return item;
        //           })
        //           this.defaultShowKeys = newCheckKeys;
        //           this.funcName = row.roleName
        //           this.tableRowId = row.id
        //           this.isTreeDialogShow = true
        //       }
        //     })
        }
      })
    },
    // 点击复选框时获取父级节点id
    dgTreeData(checkData,menuData,tts) {
      menuData.forEach(item => {
        if (checkData.pid === item.id) {
            tts.push(item.id)
            this.dgTreeData(item,menuData,tts)
        }
      })
    },

    // 复选框点击事件
 checkFunc(data,treeChoseObj){ //check事件 当复选框被点击的时候触发
        this.hanleCheck(data,treeChoseObj,'tree');
        let {checkedKeys} = treeChoseObj;
        // let menuData = this.funcResData;
        // let tt = [...checkedKeys]
        // if (this.isCheckSelect) {
        //    this.dgTreeData(data,menuData,tt); //获取父级节点ID
        // }
        this.allMenuId = this.$refs.tree.getCheckedKeys();
        //this.$refs.tree.setCheckedKeys(this.allMenuId)

    },
  hanleCheck(data,node,treeName){
  const _this = this
  // 获取当前节点是否被选中
  const isChecked = this.$refs[treeName].getNode(data).checked
  // 如果当前节点被选中，则遍历下级子节点并选中，如果当前节点取消选中，则遍历下级节点并取消选中
  if(isChecked){
    // 判断是否有上级节点，如果有那么遍历设置上级节点选中
    if(data.pid||data.pid===0){
      setParentChecked(data.pid)
    }
    // 判断该节点是否有下级节点，如果有那么遍历设置下级节点为选中
    data.children && data.children.length>0 && setChildreChecked(data.children,true)
  }else{
    // 如果节点取消选中，则取消该节点下的子节点选中
    data.children && data.children.length>0 && setChildreChecked(data.children,false)
  }
  function setParentChecked(pid){
    // 获取该id的父级node
    const parentNode = _this.$refs[treeName].getNode(pid)
    // 如果该id的父级node存在父级id则继续遍历
    
     parentNode&&parentNode.data && parentNode.data.pid && setParentChecked(parentNode.data.pid)
    //  设置该id的节点为选中状态
    _this.$refs[treeName].setChecked(pid,true)
  }
  function setChildreChecked(node,isChecked){
    node.forEach(item => {
      data.children && item.children.length>0 && setChildreChecked(item.children,isChecked)
      _this.$refs[treeName].setChecked(item.id,isChecked)
    })
  }

},
    // 复选框点击改变事件
    checkChange(data,isSelect) {
      // 变量获取选中状态
      this.isCheckSelect = isSelect;
    },

    // 功能管理模态确定回调
    funcManage() {
      let newMenuId = this.allMenuId;
      let tt = [...new Set(newMenuId)];  // new Set拿到的是一个对象
      let paramArr = tt.map(item => {
       // item = {funcId: item}
        return item
      })
      let params = {
        data: paramArr
      }
      const _data = {url:'/role/allow-auth_edit',params:params}
            this.$store.dispatch('fmsCommon/actionAuthPost',_data)
            .then(data => {
               this.$message({
                message: this.$t('common.role.authorization_succeeded'),
                type: 'success'
              })
            }).catch(err => {
                console.error(err)
      })
    },
    // 功能管理模态取消回调
    treeDialogCancel(){
      this.defaultShowKeys = [];
      this.$refs.tree.setCheckedKeys([])
      this.allMenuId = [];
      this.isTreeDialogShow = false;
    },
    //  添加角色接口回调
    addUser() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const params = {
                data: this.listQuery
            }
          addRoles(params).then(res => {
              if (res.data.code === 200) {
                this.GetRolesDataTable()
                this.$message({
                  message: this.$t('common.btn.addSuccess'),
                  type: 'success'
                  })
              }
          }).catch(err => {
            console.log(err)
          })
          this.isDialogShow = false
          this.resetDialog()
        }
      })
    },
    handleFilter(val) {
     this.GetRolesDataPage(val)
    },
    // 页码切换数据回调
    GetRolesDataPage(val){
      const data = {
        current: val.page,
        pageSize: val.limit
      }
      getRoles(data).then((res) => {
        if (res.data.code === 200) {
          this.total = res.data.data.total
          this.tableData = res.data.data.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 初始化表格数据
    GetRolesDataTable() {
      const data = {
        current: this.pageIndex,
        pageSize: this.pageSize
      }
      getRoles(data).then((res) => {
        if (res.data.code === 200) {
          this.total = res.data.data.total
          this.tableData = res.data.data.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    resetDialog() {
      this.listQuery = {
        roleName: undefined,
        roleCode: undefined,
        useState: undefined
      }
    },
    roleNameFunc() {
      this.resetDialog()
      this.txtName = this.$t('common.role.addRole')
      this.isDialogShow = true
    },
    // 跳出编辑角色弹窗
    editUser(row) {
      row.useState = row.useState.toString();
      this.listQuery = row;
      this.currentRow = row;
      this.txtName = this.$t('common.role.editRole');
      this.isDialogShow = true;
    },
    // 编辑角色接口回调
    updateUser() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const params = {
            data: this.listQuery
          }
          editRoles(params).then(res => {
            if (res.data.code === 200) {
                  this.GetRolesDataTable()
                  this.$message({
                    message: this.$t('common.btn.editSuccess'),
                    type: 'success'
                    })
                  this.isDialogShow = false
            }
          })
        }
      })
    },
    deleteUser({row,$index}) {
      this.$confirm(this.$t('common.role.sure_delete') + `--${row.roleName}?`, this.$t('common.btn.hint'), {
            confirmButtonText: this.$t('button.confirm'),
            cancelButtonText: this.$t('button.cancel'),
            type: 'warning'
          }).then(() => {
            delRoles({ data: row.id }).then((response) => {
              if (response.data.code === 200) {
                  let params = {
                    page: ((this.pageIndex - 1) * this.pageSize + ($index + 1) - 1) % 15 === 0 &&
                    ((this.pageIndex - 1) * this.pageSize + ($index + 1) - 1) / 15 > 1 ?
                    this.pageIndex - 1 : this.pageIndex,
                    limit: this.pageSize
                  };
                  this.GetRolesDataPage(params);
                  this.$message({
                    message: this.$t('common.btn.deleteSuccess'),
                    type: 'success'
                    })
              } else {
                this.$notify({
                  title: this.$t('result.fail'),
                  message: response.data.data,
                  type: 'error',
                  duration: 2000
                })
              }
            })
          })
      }
    }
}
</script>
