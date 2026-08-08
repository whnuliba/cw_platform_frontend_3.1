/*
 * @CreatAuthor: 叶文龙
 * @UpdateAuthor: 宋丹峰
 * @Description: 权限管理-角色管理
 */
<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- v-ele-show="{btnCode:'test_quth'}" -->
      <el-button type="primary" @click="roleNameFunc" >{{ $t("common.role.addRole") }}</el-button>
    </div>
    <el-table :data="tableData" border align="center" style="width: 100%" size="mini">
      <el-table-column :label="$t('common.no')" width="50px" align="center" fixed="left">
        <template slot-scope="scope">
          {{ (pageIndex - 1) * pageSize + (scope.$index + 1) }}
        </template>
      </el-table-column>


      <el-table-column v-for="(item) in cols" :sortable="true" :key="item.id" :label="commonI18n(item)" :prop="item.field"
                       :width="item.width"
                       :min-width="item.minWidth" v-if="!item.hide" :align="item.align" show-overflow-tooltip
                       :formatter="item.template == undefined ? function(row, column, cellValue, index) {
                           return cellValue;
                         } : item.template">
      </el-table-column>


      <el-table-column align="center" :label="$t('common.btn.operate')" fixed="right" width="400px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editUser(scope.row)">{{ $t("common.btn.edit") }}</el-button>
          <el-button size="mini" type="primary" @click="funcMngClick(scope.row)">{{ $t("common.role.function_management") }}</el-button>
          <el-button size="mini" type="primary" @click="authorization(scope.row)">{{ $t('config.subrole') }}</el-button>
          <el-button size="mini" type="primary" @click="factory(scope.row)">{{ $t('config.factory')  }}</el-button>

          <el-button size="mini" type="danger" @click="deleteUser(scope)">{{ $t("common.btn.delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格页码 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="pageIndex"
      :limit.sync="pageSize"
      @pagination="handleFilter"
    />
    <!-- 新增和编辑弹窗 -->
    <el-dialog v-el-drag-dialog :title="txtName" :visible.sync="isDialogShow" @close="isDialogShow = false">
      <el-form
        ref="dataForm"
        :model="listQuery"
        label-position="left"
        label-width="120px"
        :rules="rule"
      >
        <el-form-item prop="roleName" :label="commonI18n(cols[0]) + ':'">
          <el-input v-model="listQuery.roleName" />
        </el-form-item>
        <el-form-item v-if="txtName == $t('common.role.addRole')" prop="roleCode" :label="commonI18n(cols[1]) + ':'">
          <el-input v-model="listQuery.roleCode" />
        </el-form-item>
        <el-form-item prop="useState" :label="commonI18n(cols[2]) + ':'">
          <el-select v-model="listQuery.useState" :placeholder="commonI18n(cols[2])">
            <el-option :label="$t('common.role.enable')" value="0" />
            <el-option :label="$t('common.role.disabled')" value="1" />
          </el-select>
        </el-form-item>

        <el-form-item prop="scope" :label="commonI18n(cols[3]) + ':'">
          <el-select v-model="listQuery.scope" :placeholder="commonI18n(cols[3])">
            <el-option :label="'私有'" value="0" />
            <el-option :label="'全局'" value="1" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDialogShow = false">{{ $t("button.cancel") }}</el-button>
        <el-button
          type="primary"
          @click="txtName === $t('common.role.addRole') ? addUser() : updateUser()"
        >{{ $t("button.confirm") }}</el-button>
      </div>
    </el-dialog>
    <!-- 功能管理弹窗 -->
    <el-dialog v-el-drag-dialog :title="funcName" :visible.sync="isTreeDialogShow" @close="treeDialogCancel">
      <div :style="{height:'400px',overflowY:'scroll'}">
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

      <div slot="footer" class="dialog-footer">
        <el-button @click="treeDialogCancel()">{{ $t("button.cancel") }}</el-button>
        <el-button
          type="primary"
          @click="funcManage()"
        >{{ $t("button.confirm") }}</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="authorizationtitle" v-el-drag-dialog :visible.sync="dialogauthorization">
          <el-checkbox-group
            v-model="checkedroleData"
            >
            <div v-for="item in roleData" :key="item.id">
              <el-checkbox  :label="item.id">{{item.roleName}}</el-checkbox>
            </div>
            </el-checkbox-group>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogauthorization = false">{{$t("common.btn.cancel")}}</el-button>
            <el-button type="primary" @click="SubmitAuthorization">{{$t("common.btn.ok")}}</el-button>
          </div>
      </el-dialog>

      <el-dialog :title="factorytitle" v-el-drag-dialog :visible.sync="dialogfactory">
          <el-checkbox-group
            v-model="checkedFacroryData"
            >
            <div v-for="item in facroryData" :key="item.id">
              <el-checkbox  :label="item.id">{{item.factoryName}}</el-checkbox>
            </div>
            </el-checkbox-group>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogfactory = false">{{$t("common.btn.cancel")}}</el-button>
            <el-button type="primary" @click="SubmitFactory">{{$t("common.btn.ok")}}</el-button>
          </div>
      </el-dialog>

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
      defaultShowNodes: [],
      defaultShowKeys: [],
      isDialogShow: false,
      isTreeDialogShow: false,
      currentRow: {},
      authorizationtitle:'',
      dialogauthorization:false,
      dialogfactory:false,
      factorytitle:'',
      checkedroleData: [],
      checkedFacroryData: [],
      facroryData:[],
      jobId:'',
      myRowId:'',
      myRoleFacRowId:'',

      roleData: [],
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
        {field: 'scope', title: '范围', minWidth: 100, align: 'center',template:this.scopeC},

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
    this.GetRolesDataTable()
  },
  mounted() {
  },
  methods: {
    useStatetoC(data) {
      return data.useState == 0 ? this.$t('common.role.enable') : this.$t('common.role.disabled')
    },
    scopeC(data) {
      return data.scope == '0' ? '私有' : '全局'
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
    //=========================================================================================================================================================================
    /**
     * 添加子角色处
     */
     authorization(row){
        this.authorizationtitle = row.realName
        this.myRowId = row.id
        this.checkedroleData=[]
        const _data = {url:'/subRole/guest/already-role',params:{data:row.id}}
        this.$store.dispatch('fmsCommon/actionAuthPost',_data)
        .then(data => {
          data.forEach(item=>{
            this.checkedroleData.push(item.id)
          })
          this.dialogauthorization=true

          const _data = {url:'/subRole/guest/select-all-role',params:{data:row.id}}
          this.$store.dispatch('fmsCommon/actionAuthPost',_data)
         .then(data => {
                  this.roleData=data;
              }).catch(err => {
                  console.error(err)
              })
         }).catch(err => {
            console.error(err)
         })


     },

     factory(row){
        this.factorytitle = row.realName
         this.myRoleFacRowId = row.id
        this.checkedFacroryData=[]
        const _data = {url:'/base-factory/guest/role-factory',params:{data:row.id}}
        this.$store.dispatch('fmsCommon/actionAuthPost',_data)
        .then(data => {
          data.forEach(item=>{
                this.checkedFacroryData.push(item.factoryId)  
                })  
          const _data = {url:'/base-factory/guest/all',params:{}}
          this.$store.dispatch('fmsCommon/actionAuthPost',_data)
         .then(data => {
             this.facroryData=data;
             this.dialogfactory=true
             }).catch(err => {
                  console.error(err)
          })
         }).catch(err => {
            console.error(err)
         })

    },
    SubmitFactory(){
      let data=[]
      this.checkedFacroryData.forEach(item=>{
        for(let c in this.facroryData){
          if(this.facroryData[c].id ===item){
            let obj={
              factoryId:item,
               roleId:this.myRoleFacRowId,
            }
            data.push(obj);
          }
        }

      })
      //若全部取消，则置为#
      if(data.length == 0){
         data.push({factoryId:'#',roleId:this.myRoleFacRowId})
      }
      const _data = {url:'/base-factory/save-role-factory',params:{data:data}}
        this.$store.dispatch('fmsCommon/actionAuthPost',_data)
        .then(data => {
            this.checkedroleData=[]
            this.getList()
            this.$message({
              message: this.translateText('save factory Success'),
              type: 'success'
            });
         }).catch(err => {
            console.error(err)
            this.$message({
              message: err,
              type: 'success'
            });
         }).finally(()=>{
            this.dialogfactory = false;
            this.checkedFacroryData=[]
         })

    },
    //提交授权
     SubmitAuthorization(){
      let data=[]

      this.checkedroleData.forEach(item=>{
        for(let c in this.roleData){
          if(this.roleData[c].id ===item){
            let obj={
             subRoleId:item,
             roleId:this.myRowId,
            }
            data.push(obj);
          }
        }

      })
      //若全部取消，则置为#
      if(data.length == 0){
         data.push({subRoleId:'#',roleId:this.myRowId})
      }
      const _data = {url:'/subRole/batch-save-sub-role',params:{data:data}}
        this.$store.dispatch('fmsCommon/actionAuthPost',_data)
        .then(data => {
            this.checkedroleData=[]
            this.getList()
            this.$message({
              message: this.translateText('authorizeSuccess'),
              type: 'success'
            });
         }).catch(err => {
            console.error(err)
            this.$message({
              message: err,
              type: 'success'
            });
         }).finally(()=>{
            this.dialogauthorization = false;
            this.checkedroleData=[]
         })
    },
    //====================================================================================================================================================================================
    // 功能管理按钮点击

    funcMngClick(row) {
      funcMenu().then(res => {
        if (res.data.code === 200) {
          const { data } = res.data
          this.funcResData = data
          const newData = this.arrToTreeData(data, [], '0')
          if (Array.isArray(newData) && newData[0].children && newData[0].children.length !== 0) {
            let newArr = [newData[0].id];
            newData[0].children.forEach(item => {
                newArr.push(item.id)
            })
            this.defaultShowNodes = newArr;
          }
          this.funcMngData = newData  // 树形数据
          // 回显已勾选的菜单
          funcByRoleId({data: row.id}).then(res => {
              if (res.data.code === 200) {
                  let {data} = res.data;
                  let newCheckKeys = data.map(item => {
                    item = item.funcId;
                    return item;
                  })
                  this.allMenuId =newCheckKeys
                  this.defaultShowKeys = newCheckKeys;
                  this.funcName = row.roleName
                  this.tableRowId = row.id
                  this.isTreeDialogShow = true
              }
            })
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
        item = {funcId: item, roleId: this.tableRowId}
         return item
      })
     //若全部取消，则置为#
     if(paramArr.length == 0){
            paramArr.push({funcId:'#',roleId: this.tableRowId})
       }
      let params = {
        data: paramArr
      }
      batchSaveFuncMng(params).then(res => {
          if (res.data.code === 200) {
         this.isTreeDialogShow = false;
              this.$message({
                message: this.$t('common.role.authorization_succeeded'),
                type: 'success'
              })
          }
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
