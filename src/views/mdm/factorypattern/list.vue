/*
 * @CreatAuthor: 杨沛霖
 * @UpdateAuthor: (...)
 * @Description: 系统管理-组织架构
 */
<template>
  <div id="configMenu" class="app-container" style="width: 100%">
    <div class="tree-menu" :style="{ width: lastX + 'px' }" >
      <el-tree
        :data="treeMenuData"
        node-key="id"
        :highlight-current='true'
        :default-expanded-keys="defaultShowNodes"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-click="treeNodeClick"
      />
    </div>
    <div class="midline" @mousedown="mouseDown"></div>

    <div class="container-menu"  :style="{width: `calc(100%-${lastX}px)` }">
      <div class="filter-container">
        <!-- <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          @click="handleAddMenu"
        >
          {{ "添加" }}
        </el-button> -->
      </div>

      <el-table :data="tableData" style="width: 100%; margin-top: 30px" border :key="renderTable" row-key="id">
        <!-- <el-table-column type='index' label="序号" width="50px" align="center" fixed="left">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column> -->
        <el-table-column
          type='normal'
          v-for="(item,i) in itemOptions"
          :key="item.key"
          :label="item.label"
          :prop="item.title"
          :width="item.width"
          :formatter="item.Formatter"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <!-- <el-table-column align="center" label="操作" min-width='150' fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope)">
              编辑
            </el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope)">
              删除
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- 页码标签组件 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getMenus"
      />

      <el-dialog
        v-el-drag-dialog
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        custom-class=""
        :title="textMap[dialogStatus]"
      >
        <el-form
          ref="dataForm"
          :model="Menu"
          :rules="rules"
          label-width="120px"
          label-position="left"
        >
          <div v-for="(item, i) in (dialogStatus == 'create' ? modalOptions : modalupdateOptions)" :key="i" style="margin-top:15px">
            <!-- 单行文本 -->
            <el-form-item
              v-if="item.columns_type == 'input'"
              :prop="item.key"
              :label="item.label + ': '"
              :rules="{ required: true, message: item.COLUMN_RULES_MSG, trigger: 'blur' } "
            >
              <el-input
                auto-complete="new-password"
                v-model="Menu[item.key]"
                :type="item.columns_input_type"
                :placeholder="item.label"
                :disabled="item.disabled"
              />
            </el-form-item>
            <!-- 图标 -->
            <el-form-item
              v-if="item.columns_type == 'icon'"
              :label="item.label + ': '"
            >
              <icon-picker v-model="Menu[item.key]" />
            </el-form-item>
            <!-- 下拉菜单 -->
            <el-form-item
              v-if="item.columns_type == 'select'"
              :prop="item.key"
              :label="item.label + ': '"
              :rules="{ required: false, message: item.label, trigger: 'change' }"
            >
              <el-select
                v-if="item.columns_type == 'select'"
                v-model="Menu[item.key]"
                :placeholder="item.label"
                clearable            
                :disabled="item.disabled"
              >
                <span v-for="(item1, i) in menulevelOptions[item.select_text]" :key="item1 + i">
                  <el-option
                    :key="item1.menu_"
                    :label="item1.title"
                    :value="item1.value"
                  />
                </span>
              </el-select>
            </el-form-item>  
             <el-form-item label="用户状态"
               v-if="item.columns_type == 'usestateselect'"
              :prop="item.key"
              :label="item.label + ': '"
              :rules="{ required: true, message: item.label, trigger: 'blur' }"
            >
              <el-select v-model="Menu[item.key]" >
                <el-option label="正常使用" :value='0'></el-option>
                <el-option label="限制用户" :value='1'></el-option>
              </el-select>
            </el-form-item>    
            <el-form-item
              v-if="item.columns_type == 'select-group'"
              :prop="item.key"
              :label="item.label + ': '"
              :rules="{ required: false, message: item.label, trigger: 'change' }"
            >
              <el-select
                v-if="item.columns_type == 'select-group'"
                v-model="Menu[item.key]"
                :placeholder="item.label"
                clearable            
                :disabled="!isGroupDiasble && !isRoot"
              >
                <span v-for="(item1, i) in menulevelOptions[item.select_text]" :key="item1 + i">
                  <el-option
                    :key="item1.menu_"
                    :label="item1.title"
                    :value="item1.value"
                  />
                </span>
              </el-select>
            </el-form-item>    
                        <el-form-item
              v-if="item.columns_type == 'select-type'"
              :prop="item.key"
              :label="item.label + ': '"
              :rules="{ required: false, message: item.label, trigger: 'change' }"
            >
              <el-select
                v-if="item.columns_type == 'select-type'"
                v-model="Menu[item.key]"
                :placeholder="item.label"
                clearable            
                :disabled="isGroupDiasble && isRoot"
              >
                <span v-for="(item1, i) in menulevelOptions[item.select_text]" :key="item1 + i">
                  <el-option
                    :key="item1.menu_"
                    :label="item1.title"
                    :value="item1.value"
                  />
                </span>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="item.label + ': '"
              v-if="item.columns_type == 'sexradio'"
              :rules="{ required: true, message: item.label, trigger: 'change' }"

            >
             <el-radio v-model="Menu[item.key]" :label='0'>男</el-radio>
              <el-radio v-model="Menu[item.key]" :label='1'>女</el-radio>
              <el-radio v-model="Menu[item.key]" :label='2'>保密</el-radio>
            </el-form-item>
            <el-form-item
               v-if="item.columns_type == 'cascader'"
              :prop="item.key"
              :label="item.label + ': '"
              :rules="{ required: true, message: item.label, trigger: 'change' }"
            >
              <el-cascader
               :options="options" 
               :show-all-levels="false" 
               :props="{ checkStrictly: true }"
                v-if="item.columns_type == 'cascader'"
                v-model="Menu[item.key]"
                @change="handleChange($event)"

               ></el-cascader>
            </el-form-item>


          </div>

        </el-form>
        <div style="text-align: right">
          <el-button @click="dialogFormVisible = false"> 取消 </el-button>
          <el-button
            type="primary"
            @click="
              dialogStatus === 'create' || dialogStatus === 'createsub'
                ? createData()
                : updateData()
            "
          >
            确定
          </el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
// import { deepClone } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

const calendarTypeOptions = [
  { key: 0, display_name: '否' },
  { key: 1, display_name: '是' }
]

export default {
  name: 'Menu',
  components: { Pagination },
  directives: { waves, elDragDialog },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'info'
      }
      return statusMap[status]
    },
    statusNameFilter(status) {
      const statusMap = {
        1: '启动',
        0: '停止'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      renderTable:true,
      defaultShowNodes: [],
      treeMenuData: [],
      options: [],
      routes: [],
      MenusList: [],
      total: 0,
      pagesNum: 1,
      currPraentNodeId:'',
      activeName: '1',
      menulevel: {
        MENU_LEVEL: '1'
      },
      tablename: {},
      willediteData: {},
      clickData:{},
      tableData: [],
      menuTmpTableData:[],
      itemOptions: [
        {
          key: 'name',
          label: '工厂名称',
          title: 'name',
          // width:100,
        },
        {
          key:'code',
          label:'工厂编码',
          title: 'code',
          // width:100,
        },
      ],
      modalOptions: [
        {
          key: 'userName',
          label: '用户名',
          title: 'userName',
          columns_type: 'input',

        },
        {
          key:'realName',
          label:'姓名',
          title: 'realName',
          columns_type: 'input',

        },
        {
          key:'sex',
          label:'性别',
          title: 'sex',
          columns_type: 'sexradio',
        },
        {
          key:'email',
          title:'email',
          label:'用户邮箱',
          columns_type: 'input',

        },
        {
          key:'password',
          title:'password',
          label:'密码',
          columns_input_type:'password',
          columns_type: 'input',
        },
        {
          key:'password1',
          title:'password1',
          label:'密码确认',
          columns_input_type:'password',
          columns_type: 'input',
        },
        {
          key:'useState',
          title:'useState',
          label:'用户状态',
          columns_type: 'usestateselect',
        },
        // {
        //   key:'roleName',
        //   title:'roleName',
        //   label:'角色',
        //   columns_type: 'input',
        // },
        {
          key:'deptId',
          title:'deptId',
          label:'部门',
          columns_type: 'cascader',
        },
      ],
      modalupdateOptions:[
        {
          key: 'userName',
          label: '用户名',
          title: 'userName',
          columns_type: 'input',

        },
        {
          key:'realName',
          label:'姓名',
          title: 'realName',
          columns_type: 'input',
        },
        {
          key:'sex',
          label:'性别',
          title: 'sex',
          columns_type: 'sexradio',
        },
        {
          key:'email',
          title:'email',
          label:'用户邮箱',
          columns_type: 'input',

        },
        {
          key:'useState',
          title:'useState',
          label:'用户状态',
          columns_type: 'usestateselect',

        },
        {
          key:'deptId',
          title:'deptId',
          label:'部门',
          columns_type: 'cascader',
        },
        {
          key:'id',
          title:'id',
          label:'',
        },
      ],
      isGroupDiasble:false,
      isRoot:false,
      Menu: {
        userName: '',
        realName: '',
        password:'',
        password1:'',
        email:'',
        useState: '',
        sex: 0,
        roleName:'',
        deptId: '',
        id:''
      },
      menulevelOptions: [
        [{ title: '正常使用', value: 1 }, { title: '禁用', value: 0 }],
        [{ title: '目录菜单', value: 0 }, { title: '功能菜单', value: 1 }, { title: '菜单组', value: 2 }],
        [
          { title: '化成系统', value: 'FMS' }, { title: '调度管理', value: 'WCS' },
          { title: '仓储管理', value: 'WMS' }, { title: '生产信息', value: 'PM' },
          { title: '报表中心', value: 'BI' }, { title: '设备监控', value: 'TPM' },
          { title: '系统配置', value: 'SYS' },
        ],
      ],
      listQuery: {
        page: 1,
        limit: 10,
        MENU_PARENT_ID: undefined,
        TITLE: undefined,
        MENU_NAME: undefined,
        STATUS: undefined,
        MENU_LEVEL: undefined
      },
      calendarTypeOptions,
      isAble: false,
      dialogFormVisible: false,
      dialogStatus: '',
      downloadLoading: false,
      checkStrictly: false,
      textMap: {
        update: '编辑',
        create: '创建',
        createsub: '创建子菜单'
      },
      rules: {
        MENU_NAME: [{ required: true, message: '请输入菜单名称', trigger: 'change' }],
        MENU_PATH: [{ required: true, message: '请输入菜单路径', trigger: 'change' }],
        MENU_COMPONENT: [{ required: true, message: '请输入组件', trigger: 'change' }],
        URL: [{ required: true, message: '', trigger: 'change' }],
        TITLE: [{ required: true, mes请输入路由sage: '请输入标题', trigger: 'change' }],
        STATUS: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      defaultProps: {
        children: 'children',
        label: 'title'
      },      
      lastX: '400',
      isClickMenu: false, // 是否点击目录变量
    }
  },
  computed: {
    /* routesData() {
                return this.routes
            } */
  },
  watch: {
    treeMenuData:function(newValue,oldValue){
      if(newValue){
        this.getMenuTableData(this.treeMenuData[0])

      }
    }
  },
  created() {
    this.getMenuTreeData();
    document.addEventListener("mouseup", this.mouseUp);
  },
  mounted() {
    this.getMenus()
  },
  destroyed() {
    document.removeEventListener("mouseup", this.mouseUp);
  },
  methods: {
     mouseDown(event) {
      console.log(event);
      document.addEventListener("mousemove", this.mouseMove);
      this.lastX = event.clientX-200;
    },
    mouseMove(event) {
      this.lastX = event.clientX-200;
    },
    mouseUp() {
      this.lastX = "";
      document.removeEventListener("mousemove", this.mouseMove);
    },
    //Cascader change事件
    handleChange(row){
      this.Menu.deptId = row[row.length-1]
    },
  
  
    // 拖拽树组件回调
    handleDragStart(node, ev) {
        // console.log('drag start', node)
      },
    handleDragEnter(draggingNode, dropNode, ev) {
    
        // console.log('tree drag enter: ', dropNode)
      },
    handleDragLeave(draggingNode, dropNode, ev) {
        // console.log('tree drag leave: ', dropNode)
      },
    handleDragOver(draggingNode, dropNode, ev) {
      },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      },
    // 拖拽成功完成时触发的事件
  
  
 
    // 点击树节点回调
    treeNodeClick(data) {
     
      this.isClickMenu = true
      this.currPraentNodeId=data.id
      if(this.clickData.id != data.id){
        this.getMenuTableData(data)
        this.clickData = data
      }
      
    },
   
    // 递归生成菜单树结构数据
    loop(data, id) {
        const res = []
        data.forEach((item=>{
          item.label = item.name
          item.value = item.id
          if(item.children&&item.children.length>0){
            item.children = this.loop(item.children, item.id)
          }
          res.push(item)
        }))
       
        return res
      },
    treeData(data, id) {
      this.loop(data, id)
      return this.loop(data, id)
    },
    getTreeData(){
       const _data = {url: '/org/org-tree'}
        this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
          return data
        })
    },
    // 获取菜单树结构数据
    getMenuTreeData() {
       const _data = {url: '/factory/guest/factory-dir'}
        this.$store.dispatch('fmsCommon/actionMdmPost', _data).then(data => {
          const newData = this.treeData(data, '0')
           this.treeMenuData = newData
           this.options = newData
           this.defaultShowNodes = [newData[0].id]
        })
       
    },
    // 获取菜单对应表格数据
    getMenuTableData(row) {
      // console.log(row);
      this.tableData = row.children
      // let _data = {url: '/user/dept-user',params: {data:row.id}}
      // this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
      //   this.tableData = data
      // })
    },

    
    
    async getMenus() {
      this.listLoading = true
    },
    
    handleFilter() {
      this.listQuery.page = 1
      this.getMenus()
    },
   
    //  添加菜单按钮点击事件(模态)
    handleAddMenu(scope) {
      this.dialogStatus = 'create'
      if (this.isClickMenu) {
        this.dialogFormVisible = true
      } else {
          this.$message({
              title: '信息',
              message: '请先选择一个目录',
              type: 'error'
            })
      }
      this.Menu = {
        userName: '',
        realName: '',
        password:'',
        password1:'',
        email:'',
        useState: '',
        sex: 0,
        roleName:'',
        deptId: this.clickData.id,
        id:''
      },
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        // this.$refs['dataForm'].resetField()

      })
    },
    // 添加菜单接口回调
    createData() {
    let val = this.Menu
   
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          
            let _data = {url: '/user/add',params: {data:{
              ...val,
              deptId:val.deptId
            }}}


          this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
            this.getMenuTableData(this.clickData)
            this.dialogFormVisible = false
            this.defaultShowNodes = [this.clickData.id]

            this.$message({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 2000
            })
          })
        }
      })

        

    
    },
    // 编辑弹窗事件
    handleEdit(scope) {
      
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      // this.checkStrictly = true
      /* this.isAble = false */
      // this.Menu = Object.assign({}, scope.row)
      // this.Menu.parentMenuName = scope.row.menuName
      this.Menu = scope.row

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑菜单接口回调
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let val = this.Menu
       
          let _data = {url: '/user/edit',params: {data:{
            ...this.Menu,
            // deptId:this.Menu.deptId[this.Menu.deptId.length-1]
            }}}

          this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
            this.defaultShowNodes = [this.clickData.id]
            this.getMenuTableData(this.clickData)
            this.dialogFormVisible = false
            this.$message({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
            })
          }).catch(err=>{
            console.log(err);
          })
        }

      })
      
    
    },
    // 删除菜单接口回调
    handleDelete({ $index, row }) {
      this.$confirm(`确定删除此条数据吗?`, '提示信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let _data = {}
        _data = {url: '/user/del',params: {data:row.id}}
        this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
            this.defaultShowNodes = [this.clickData.id]
            this.getMenuTableData(this.clickData)
            this.$message({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
        })
       
      })
    },
  
 
  
  }
}
</script>

<style scoped>
#configMenu {
  display: flex;
  height: 100%;
}
.tree-menu {
  height: 800px;
  overflow-y: scroll;
  /* width: 30%; */
  /* flex: 1; */
  /* margin-right: 10px; */
  border: 1px solid #dfe6ec;
  /* cursor: w-resize; */
}
.midline{
  height: 800px;
  width: 2px;
  /* background-color: black; */
  cursor: w-resize;
}
.container-menu {
  min-width:35%;
	flex: 1;
  height: 80%;
}
.el-dialog.customStyle {
  width: 80%;
}
.el-dialog__body {
  border-top: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
.el-form-item {
  margin-bottom: 12px;
}
</style>
