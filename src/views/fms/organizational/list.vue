/*
 * @CreatAuthor: 杨沛霖
 * @UpdateAuthor: (...)
 * @Description: 系统管理-部门架构
 */
<template>
  <div id="configMenu" class="app-container">
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
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          @click="handleAddMenu"
        >
          {{ $t('config.new') }}
        </el-button>
      </div>

      <el-table :data="tableData" style="width: 100%; margin-top: 30px" border :key="renderTable" row-key="id">
        <el-table-column :label=" $t('common.no') " width="50px" align="center" fixed="left">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item,i) in itemOptions"
          :key="item.key"
          :label="commonI18n(item)"
          :prop="item.title"
          :width="item.width"
          :formatter="item.Formatter"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column align="center" :label="$t('common.btn.operate')" min-width='150' fixed="right">
          <template slot-scope="scope">
            <el-button v-if='scope.row.grade != 0' type="primary" size="mini" @click="authorization(scope)">
              {{ $t('config.role') }}
            </el-button>
            <el-button type="primary" size="mini" @click="handleEdit(scope)">
              {{ $t('config.update') }}
            </el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope)">
              {{ $t('config.delete') }}
            </el-button>
          </template>
        </el-table-column>
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
        :title="textMap[dialogStatus]"
        width="500px"
      >
        <el-form
          ref="dataForm"
          :model="Menu"
          :rules="rules"
          label-width="120px"
          label-position="left"
          
        >
          <div v-for="(item, i) in modalOptions" :key="i">
            <!-- 单行文本 -->
            <el-form-item
              v-if="item.columns_type == 'input'"
              :prop="item.key"
              :label="commonI18n(item) + ': '"
              :rules="{ required: false, message: item.COLUMN_RULES_MSG, trigger: 'change' } "
            >
              <el-input
                v-model="Menu[item.key]"
                :type="item.columns_input_type"
                :placeholder="commonI18n(item)"
                :disabled="item.disabled"
                style="width:180px;"

              />
            </el-form-item>
            <!-- 图标 -->
            <el-form-item
              v-if="item.columns_type == 'icon'"
              :label="commonI18n(item) + ': '"
            >
              <icon-picker v-model="Menu[item.key]" />
            </el-form-item>
            <!-- 下拉菜单 -->
            <el-form-item
              v-if="item.columns_type == 'select'"
              :prop="item.key"
              :label="commonI18n(item) + ': '"
              :rules="{ required: false, message: item.label, trigger: 'change' }"
            >
              <el-select
                v-if="item.columns_type == 'select'"
                v-model="Menu[item.key]"
                :placeholder="commonI18n(item)"
                clearable
                :disabled="item.disabled"
              >
                <span v-for="(item1, i) in menulevelOptions[item.select_text]" :key="item1 + i">
                  <el-option
                    :key="item1.menu_"
                    :label="commonI18n(item1)"
                    :value="item1.value"
                  />
                </span>
              </el-select>
            </el-form-item>
            <el-form-item v-if="item.columns_type=='user'" :prop="item.key" :label="commonI18n(item)" :rules="[
                      {
                        required: item.require,
                        message: item.title + $t('common.cannotEmpty'),
                        trigger: 'blur',
                      },
                    ]">
                  <CwUserDropdown :selectRange="[300]"  v-model="Menu[item.key]" :disabled="item.disabled" :orgType="300"  :style="{width: '200px',...item.style}"
                     :initValue="Menu[item.key]!==undefined && Menu[item.key]!==null?Menu[item.key].split(','):[]"
                     :radio="()=>{
                        return true
                     }"
                     @onChange="(result)=>{
                         if(item.columns_type === 'user' && item.userChange && typeof item.userChange==='function'){
                            item.userChange.call(self,result,Menu[item.key],item)
                         }
                        
                     }"
                  ></CwUserDropdown>

                  <!-- <el-input type="textarea" v-model="defaultForm.params[item.field]"  :disabled="item.disabled"  :style="{width: '220px',...item.style}" /> -->
                  </el-form-item>
            <el-form-item
              v-if="item.columns_type == 'select-group'"
              :prop="item.key"
              :label="commonI18n(item) + ': '"
              :rules="{ required: false, message: item.label, trigger: 'change' }"
            >
              <el-select
                v-if="item.columns_type == 'select-group'"
                v-model="Menu[item.key]"
                :placeholder="commonI18n(item)"
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
              :label="commonI18n(item)+ ': '"
              :rules="{ required: false, message: item.label, trigger: 'change' }"
            >
              <el-select
                v-if="item.columns_type == 'select-type'"
                v-model="Menu[item.key]"
                :placeholder="commonI18n(item)"
                clearable
                :disabled="isGroupDiasble && isRoot"
              >
                <span v-for="(item1, i) in menulevelOptions[item.select_text]" :key="item1 + i">
                  <el-option
                    :key="item1.menu_"
                    :label="commonI18n(item1)"
                    :value="item1.value"
                  />
                </span>
              </el-select>
            </el-form-item>

          </div>

        </el-form>
        <div style="text-align: right">
          <el-button @click="dialogFormVisible = false"> {{$t('common.btn.cancel')}} </el-button>
          <el-button
            type="primary"
            @click="
              dialogStatus === 'create' || dialogStatus === 'createsub'
                ? createData()
                : updateData()
            "
          >
          {{$t('common.btn.ok')}}
          </el-button>
        </div>
      </el-dialog>
        <!-- 角色页面 -->
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
    </div>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
// import { deepClone } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Sortable from 'sortablejs';
import common from '@/utils/common';
import i18n from '@/lang';
import CwUserDropdown from "@/components/Cw/CwUserDropdown";
import {
  // getMenuList,
  getMenuListByLevel,
  addMenu,
  updateMenu,
  deleteMenu
} from '@/api/menu'
import { getMenuTree, getMenuTable } from '@/api/sys_table'
import {roleAll,saveUserRole} from "@/api/roles";

const calendarTypeOptions = [
  { key: 0, display_name: '否' },
  { key: 1, display_name: '是' }
]

export default {
  name: 'Menu',
  components: { Pagination,CwUserDropdown },
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
      routes: [],
      MenusList: [],
      total: 0,
      pagesNum: 1,
      currPraentNodeId:'',
      authorizationtitle:'',
      dialogauthorization:false,
      checkedroleData: [],
      roleData: [],
      activeName: '1',
      menulevel: {
        MENU_LEVEL: '1'
      },

      self:this,
      tablename: {},
      willediteData: {},
      clickData:{},
      tableData: [],
      menuTmpTableData:[],
      itemOptions: [
        {
          key: 'name',
          label: '组织名称',
          title: 'name',
          width: '120'
        },
        {
          key: 'code',
          label: '组织编码',
          title: 'code',
          width: '120'
        },
        {
          key: 'leaderName',
          label: '部门长',
          title: 'leaderName',
          width: '120'
        },
        // {
        //   key: 'deptType',
        //   label: '',
        //   title: 'deptType',
        //   width: '120',
        // },


      ],
      modalOptions: [
         {
          key: 'orgName',
          label: '组织名称',
          title: 'orgName',
          columns_type: 'input',

        },
        {
          key: 'orgCode',
          label: '组织编码',
          title: 'orgCode',
          columns_type: 'input',
        },
        {
          key: 'leaderId',
          label: '部门长',
          title: 'leaderId',
          columns_type: 'user',
          userChange:function(result,value,item){
            this.Menu.leaderName= result.name
            this.Menu.leader = result.code
            this.Menu.leaderId = result.id
            console.log( this.Menu)
          }
        },
      ],
      isGroupDiasble:false,
      isRoot:false,
      Menu: {
        orgCode: undefined,
        orgName: undefined
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
        update: '编辑菜单',
        create: '创建菜单',
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
      isClickMenu: false, // 是否点击目录变量
      treeParentId: '',
      selfId: '',
      menuTreeAllData:'',
      deptId:'',
      lastX: '400',
 }
  },
  computed: {
    /* routesData() {
                return this.routes
            } */
  },
  created() {
    this.getMenuTableData('1')
    this.getMenuTreeData()
    document.addEventListener("mouseup", this.mouseUp);
  },
  mounted() {
    this.getMenus()
    //    document.body.ondrop = function (event) {
    //      event.preventDefault();
    //       event.stopPropagation();
    //  }

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

    // 点击树节点回调
    treeNodeClick(data) {
      this.isClickMenu = true
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
       const _data = {url: '/org/org-tree'}
        this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
          const newData = this.treeData(data, '0')
           this.treeMenuData = newData
           this.defaultShowNodes = [newData[0].id]
        })

    },
    // 获取菜单对应表格数据
    getMenuTableData(row) {
      let _data = {}
       switch(row.deptType){
          case 100:
           _data = {url: '/org/org-dept',params: {data:row.id}}
          this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
            this.tableData = data
          })

          break;
          case 200:
          _data = {url: '/org/org-dept',params: {data:row.id}}
            this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
            this.tableData = data
          })
          break;
          case 300:
          break;
          default:
             _data = {url: '/org/list',params: {
            id:row.id,
            current: 1,
            pageSize: 10,
          }}
          this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
            let arr = data.data.map(item =>{
              item['name'] = item.orgName
              item['code'] = item.orgCode
              return item
            })
             this.tableData = arr
          })
          break;
        }
    },

     // 角色
    authorization(row){
        console.log(row.row);
        this.deptId = row.row.id
       const _data = {url:'/role/guest/query-grp-role-dept',params:{data:row.row.id}}
        this.$store.dispatch('fmsCommon/actionAuthPost',_data)
        .then(data => {
          data.forEach(item=>{
            this.checkedroleData.push(item.id)
          })
          this.dialogauthorization=true
          this.authorizationtitle = row.row.name

          roleAll().then(res=>{
          this.roleData=res.data.data;
           })
         }).catch(err => {
            console.error(err)
         })

    },
    //角色提交
    SubmitAuthorization(row){
      console.log(row);
      console.log(this.roleData);
      let data=[]
      this.checkedroleData.forEach(item=>{
        for(let c in this.roleData){
          if(this.roleData[c].id ===item){
            let obj={
             roleId:item,
             deptId:this.deptId,
             roleType:this.roleData[c].roleType
            }
            data.push(obj);
          }
        }
      })
       //若全部取消，则置为#
       if(data.length == 0){
           data.push({roleId:'#',deptId:this.deptId})
      }
      const _data = {url:'/department/batch-dept-role',params:{data:data}}
      this.$store.dispatch('fmsCommon/actionAuthPost',_data)
      .then(res => {
          this.$message({
          message: '授权成功',
          type: 'success'
          });
          this.dialogauthorization = false;
          this.checkedroleData=[]
       }).catch(err => {
          console.error(err)
       })
      // saveUserRole({data}).then(res=>{
      //   if(res.data.status === 'SUCCESS'){
      //     this.$message({
      //     message: '授权成功',
      //     type: 'success'
      //     });
      //     this.dialogauthorization = false;
      //     this.checkedroleData=[]
      //     let params={
      //       current:  this.listQuery.page,
      //       pageSize: this.listQuery.limit,
      //       requestData:{
      //       realName: "",
      //       userName: ""
      //       }
      //     }
      //     this.initData(params)
      //   }else{
      //     this.$message.error(res.data.data);
      //   }
      // })
    },

    async getMenus() {
      this.listLoading = true
    },

    handleFilter() {
      this.listQuery.page = 1
      this.getMenus()
    },
    resetTemp() {
      this.isAble = false
    },
    //  添加菜单按钮点击事件(模态)
    handleAddMenu(scope) {
      this.dialogStatus = 'create'
      // if (this.isClickMenu) {
        this.dialogFormVisible = true
      // } else {
      //     this.$message({
      //         title: '信息',
      //         message: '请先选择一个目录',
      //         type: 'error'
      //       })
      // }

      this.Menu={
        orgCode: undefined,
        orgName: undefined
      },
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 添加菜单接口回调
    createData() {
      let val = this.Menu

       let _data = {};
        switch(this.clickData.deptType){
          case 100:
          _data = {url: '/department/add',params: {data:{
            deptName:val.orgName,
            deptCode:val.orgCode,
            status:0,
            deptType:200,
            leader:val.leader,
            leaderId:val.leaderId,
            leaderName:val.leaderName,
            orgId:this.clickData.orgId,
            pid:this.clickData.id
          }}}
          break;
          case 200:
           _data = {url: '/department/add',params: {data:{
            deptName:val.orgName,
            deptCode:val.orgCode,
            leader:val.leader,
            leaderId:val.leaderId,
            leaderName:val.leaderName,
            status:0,
            deptType:200,
            orgId:this.clickData.orgId,
            pid:this.clickData.id
          }}}
          break;
          case 300:

          break;
          default:
            _data = {url: '/org/add',params: {data:{
            orgName:val.orgName,
            orgCode:val.orgCode,
            leader:val.leader,
            leaderId:val.leaderId,
            leaderName:val.leaderName,
            status:0,
            deptType:100,
            grade:0,
            // pid:this.clickData.id
          }}}
          break

        }
        this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
          this.getMenuTreeData()
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



      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // const params = { data: this.Menu }
          // const _data = {url: '/org/add',params: {data:{
          //   orgCode:'11',
          //   orgName:'1',
          //   status:0,
          //   grade:1,
          // }}}
          // this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
          // })
          // addMenu(params).then((response) => {
          //   if (response.data.code === 200) {
          //     // this.MenusList.push(this.Menu)
          //     this.dialogFormVisible = false
          //     this.getMenuTreeData()
          //     this.$message({
          //       title: '成功',
          //       message: '添加成功',
          //       type: 'success',
          //       duration: 2000
          //     })
          //   } else {
          //     this.$message({
          //       title: '失败',
          //       message: response.data.data,
          //       type: 'error',
          //       duration: 2000
          //     })
          //   }
          // })
        }
      })
    },
    // 编辑弹窗事件
    handleEdit(scope) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.checkStrictly = true
      /* this.isAble = false */
      // this.Menu = Object.assign({}, scope.row)
      // this.Menu.parentMenuName = scope.row.menuName
      this.Menu = {
        orgCode: scope.row.code,
        orgName: scope.row.name,
        leader:scope.row.leader,
        leaderId:scope.row.leaderId,
        leaderName:scope.row.leaderName,
      },
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.willediteData = scope.row
    },
    // 编辑菜单接口回调
    updateData() {
       let val = this.Menu
    //  this.$store.dispatch('permission/getMenuGroup').then(res =>{
    //         if(res.indexOf(val)>=0)
    //          {

    //           throw new Error("")
    //          }

    //    }).catch(error=>{
    //           this.$message({
    //                 title: '信息',
    //                 message: '已经存在系统组',
    //                 type: 'success'
    //            })
    //          return
    //    })
      let _data = {}
        switch(this.willediteData.deptType){
          case 100:
          _data = {url: '/org/edit',params: {data:{
            orgName:val.orgName,
            orgCode:val.orgCode,
            leader:val.leader,
            leaderId:val.leaderId,
            leaderName:val.leaderName,
            id:this.willediteData.id
          }}}
          break;
          case 200:
          _data = {url: '/department/edit',params: {data:{
            deptName:val.orgName,
            deptCode:val.orgCode,
            leader:val.leader,
            leaderId:val.leaderId,
            leaderName:val.leaderName,
            id:this.willediteData.id
          }}}
          break;
          // case 300:
          // _data = {url: '/user/edit',params: {data:{
          //   roleName:val.orgName,
          //   roleCode:val.orgCode,
          //   id:this.willediteData.id
          // }}}

          break;

        }
        this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
           this.getMenuTreeData()
          this.getMenuTableData(this.clickData)
          this.dialogFormVisible = false
          this.defaultShowNodes = [this.willediteData.pid]
          this.$message({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        })

    },
    // 删除菜单接口回调
    handleDelete({ $index, row }) {
      this.$confirm(`确定删除此条数据?`, '提示信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          let _data = {}
        console.log(row);
        switch(row.deptType){
          case 100:
          _data = {url: '/org/del',params: {data:row.id}}
          break;
          case 200:
          _data = {url: '/department/del',params: {data:row.id}}
          break;
          case 300:
          _data = {url: '/department/del',params: {data:row.id}}

          break;
          default:
          _data = {url: '/org/del',params: {data:row.id}}

            break;

        }
        this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
            // this.defaultShowNodes = [this.clickData.id]
            this.getMenuTableData(row)
            this.getMenuTreeData()
            this.$message({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          this.defaultShowNodes = [row.pid]

          let _data1 = {url: '/org/org-dept',params: {data:row.pid}}
          this.$store.dispatch('fmsCommon/actionAuthPost', _data1).then(data => {
            this.tableData = data
          })
        })
        // deleteMenu({ data: row.id }).then((response) => {
        //   if (response.data.code === 200) {
        //     this.currPraentNodeId=row.pid
        //     this.getMenuTableData(row.pid)
        //     this.getMenuTreeData()
        //     this.$message({
        //       title: '成功',
        //       message: '删除成功',
        //       type: 'success',
        //       duration: 2000
        //     })
        //   } else {
        //     this.$notify({
        //       title: '失败',
        //       message: response.data.data,
        //       type: 'error',
        //       duration: 2000
        //     })
        //   }
        // })
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
.midline{
  height: 800px;
  width: 2px;
  cursor: w-resize;
}
.tree-menu {
  height: 800px;
  overflow-y: scroll;
  /* width: 15%; */
  /* margin-right: 10px; */
  border: 1px solid #dfe6ec;
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
