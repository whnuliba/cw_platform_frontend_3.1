/*
 * @CreatAuthor: 杨沛霖
 * @UpdateAuthor: (...)
 * @Description: 系统管理-人员架构
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

      <el-table :data="tableData" style="width: 100%; margin-top: 30px" border :key="renderTable" row-key="id" @row-click="getAtcolumdata">
        <el-table-column :label="$t('common.no') " width="50px" align="center" fixed="left">
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
        <el-table-column align="center" label="操作" min-width='300' fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="reesetpwd(scope)">
              {{$t('config.resetPwd') }}
            </el-button>
            <el-button type="primary" size="mini" @click="handleEdit(scope)">
              {{ $t('config.update') }}
            </el-button>
             <el-button size="mini" @click="authorization(scope)" type="primary"> {{$t("table.role")}}</el-button >
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
        custom-class=""
        :title="textMap[dialogStatus]"
       
      >
        <el-form
          ref="dataForm"
          :model="Menu"
          :rules="rules"
          label-width="120px"
          inline="true"
        >
          <div v-for="(item, i) in (dialogStatus == 'create' ? modalOptions : modalupdateOptions)" :key="i" style="display:inline">
            <!-- 单行文本 -->
            <el-form-item
              v-if="item.columns_type == 'input'"
              :prop="item.key"
              :label="commonI18n(item) + ': '"
              :rules="{ required: true, message: item.COLUMN_RULES_MSG, trigger: 'blur' } "
            >
              <el-input
                auto-complete="new-password"
                v-model="Menu[item.key]"
                :type="item.columns_input_type"
                :placeholder="item.label"
                :disabled="item.disabled"
                style="width:250px;"
              />
            </el-form-item>
            <!-- 图标 -->
            <el-form-item
              v-if="item.columns_type == 'icon'"
              :label="commonI18n(item) + ': '"
            >
              <icon-picker v-model="Menu[item.key]" style="width:250px;" />
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
                @change="$forceUpdate()"
                :placeholder="item.label"
                :disabled="item.disabled"
                style="width:250px;" 
              >
                  <el-option
                    v-for="(item1, i) in menulevelOptions[item.select_text]"
                    :key="item1.menu_"
                    :label="item1.title"
                    :value="item1.value"
                  />
              </el-select>
            </el-form-item>
             <el-form-item label="用户状态"
               v-if="item.columns_type == 'usestateselect'"
              :prop="item.key"
              :label="commonI18n(item) + ': '"
              :rules="{ required: true, message: item.label, trigger: 'blur' }"
            >
                
              <el-select v-model="Menu[item.key]" style="width:250px;" >
                <el-option label="正常使用" :value='0'></el-option>
                <el-option label="限制用户" :value='1'></el-option>
              </el-select>
            </el-form-item>
             <el-form-item  
               v-if="item.columns_type == 'lockselect'"
              :prop="item.key"
              :label="commonI18n(item) + ': '"
              :rules="{ required: true, message: item.label, trigger: 'blur' }"
            >
                
              <el-select v-model="Menu[item.key]" style="width:250px;" >
                <el-option label="Y" :value='Y'></el-option>
                <el-option label="N" :value='N'></el-option>
              </el-select>
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
                :placeholder="item.label"
                clearable style="width:250px;" 
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
              :label="commonI18n(item) + ': '"
              :rules="{ required: false, message: item.label, trigger: 'change' }"
            >
              <el-select style="width:250px;" 
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
              :label="commonI18n(item) + ': '"
              v-if="item.columns_type == 'sexradio'"
              :rules="{ required: true, message: item.label, trigger: 'change' }"

            >
            <div style="width:250px;" >

               <el-radio v-model="Menu[item.key]" :label='0'>{{$t("const.sex.male")}}</el-radio>
               <el-radio v-model="Menu[item.key]" :label='1'>{{$t("const.sex.female")}}</el-radio>
               <el-radio v-model="Menu[item.key]" :label='2'>{{$t("const.sex.secret")}}</el-radio>
            </div>
            </el-form-item>
            <el-form-item
               v-if="item.columns_type == 'cascader'"
              :prop="item.key"
              :label="commonI18n(item) + ': '"
              :rules="{ required: true, message: item.label, trigger: 'change' }"
            >
              <!-- <el-cascader
               :options="options"
               :show-all-levels="false"
               :props="{ checkStrictly: true }"
                v-if="item.columns_type == 'cascader'"
                v-model="Menu[item.key]"
                @change="handleChange($event)"

               ></el-cascader> -->
              <elTreeSelect  style="width:250px;" 
                :slectvalue.sync="Menu[item.key]" 
                :options="options" 
                :props="eltreeselectprops"
                nodeKey="id" 
                :placeholder="$t('config.selectParentTree')" 
                :filterable="true"
              />
            </el-form-item>

            <el-form-item  v-if="item.columns_type=='datetime'" :prop="item.key"  :label="commonI18n(item)">
              <el-date-picker format="yyyy-MM-dd HH:mm:ss" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"   v-model="Menu[item.key]" style="width: 250px"> </el-date-picker>
            </el-form-item>

            <el-form-item  v-if="item.columns_type=='user'" :prop="item.key" :label="commonI18n(item)" :rules="[
                      {
                        required: item.require,
                        message: item.title + $t('common.cannotEmpty'),  
                        trigger: 'blur',
                      },
                    ]">
                  <CwUserDropdown :selectRange="[300]"  v-model="Menu[item.key]" :disabled="item.disabled" :orgType="300"  :style="{width: '250px',...item.style}"
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
        <!-- 授权页面 -->
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
import elTreeSelect from '@/components/treeselect'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import {newgetRole,addUser,editUser,roleAll,saveUserRole,delUserRole} from "@/api/roles";
import CwUserDropdown from "@/components/Cw/CwUserDropdown";

const calendarTypeOptions = [
  { key: 0, display_name: '否' },
  { key: 1, display_name: '是' }
]

export default {
  name: 'Menu',
  components: { Pagination, elTreeSelect,CwUserDropdown},
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
      roleData: [],
      checkedroleData: [],
      options: [],
      routes: [],
      MenusList: [],
      total: 0,
      pagesNum: 1,
      currPraentNodeId:'',
      authorizationtitle:'',
      dialogauthorization:false,
      self:this,
      activeName: '1',
      menulevel: {
        MENU_LEVEL: '1'
      },
      tablename: {},
      willediteData: {},
      clickData:{},
      tableData: [],
      menuTmpTableData:[],
      eltreeselectprops: {
        label: "label",
        children: "children",
      },
      itemOptions: [
        {
          key: 'userName',
          label: '用户名',
          title: 'userName',
          width:100,
        },
        {
          key:'realName',
          label:'姓名',
          title: 'realName',
          width:100,
        },
        {
          key:'email',
          title:'email',
          label:'用户邮箱',
          width:170,
        },
        {
          key:'sex',
          title:'sex',
          label:'性别',
          Formatter: (row, column, cellValue, index)=> cellValue === 0 ? '男' : cellValue === 0 ? '女' : '保密',
          width:100,
        },
        {
          key:'useState',
          title:'useState',
          label:'用户状态',
          Formatter: (row, column, cellValue, index)=> cellValue === 0 ? '正常使用' : '限制用户',
          width:100,
        },
        {
          key:'roleName',
          title:'roleName',
          label:'角色',
          width:200,
        },
        {
          key:'jobName',
          title: 'jobName',
          label:'岗位',
          width:200,
        },
        {
          key:'leaderName',
          title: 'leaderName',
          label:'直属领导',
          width:200,
        },
        // {
        //   prop:'roleName',
        //   label:'角色',
        //   width:200,
        // },
        // {
        //   prop:'deptId',
        //   label:'部门',
        //   width:200,
        // },
        
        {
          key:'nameSpell',
          title:'nameSpell',
          label:'拼写',
          width:100,
        },
        {
          key:'accountExpireTime',
          label:'登录过期',
          title:'accountExpireTime',
          width:200,
        },
        {
          key:'passwordExpireTime',
          label:'密码过期',
          title:'passwordExpireTime',
          width:200,
        },
        {
          key:'lock',
          label:'锁定',
          width:50,
          title:'lock'
        },
        {
          key:'alias',
          label:'别名',
          width:50,
          title:'alias'
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
        {
          key:'jobName',
          title:'jobName',
          label:'岗位',
          columns_type: 'select',
          select_text:'jobName'
        },
        {
          key:'leaderId',
          title:'直属领导',
          label:'直属领导',
          columns_type: 'user',
          select_text:'leaderId',
          userChange:function(result,value,item){
            this.Menu.leaderName= result.name
            this.Menu.leader = result.code
            this.Menu.leaderId = result.id
          }
        },

        {
          key:'nameSpell',
          title:'nameSpell',
          label:'拼写',
          width:100,
          columns_type:'input'
        },
        {
          key:'accountExpireTime',
          label:'登录过期',
          title:'accountExpireTime',
          width:200,
         columns_type:'datetime'
        },
        {
          key:'passwordExpireTime',
          label:'密码过期',
          title:'passwordExpireTime',
          width:200,
            columns_type:'datetime'
        },
        {
          key:'lock',
          label:'锁定',
          width:50,
          title:'lock',
            columns_type:'lockselect'
        },
        {
          key:'alias',
          label:'别名',
          width:50,
          title:'alias',
          columns_type:'input'
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
          key:'jobName',
          title:'jobName',
          label:'岗位',
          columns_type: 'select',
          select_text:'jobName'
        },
        {
          key:'id',
          title:'id',
          label:'',
        },
        {
          key:'leaderId',
          title:'直属领导',
          label:'直属领导',
          columns_type: 'user',
          select_text:'leaderId',
          userChange:function(result,value,item){
            this.Menu.leaderName= result.name
            this.Menu.leader = result.code
            this.Menu.leaderId = result.id
          }
        },
        
        {
          key:'nameSpell',
          title:'nameSpell',
          label:'拼写',
          width:100,
          columns_type:'input'
        },
        {
          key:'accountExpireTime',
          label:'登录过期',
          title:'accountExpireTime',
          width:200,
         columns_type:'datetime'
        },
        {
          key:'passwordExpireTime',
          label:'密码过期',
          title:'passwordExpireTime',
          width:200,
            columns_type:'datetime'
        },
        {
          key:'lock',
          label:'锁定',
          width:50,
          title:'lock',
            columns_type:'lockselect',
             select_text:'lock'
        },
        {
          key:'alias',
          label:'别名',
          width:50,
          title:'alias',
          columns_type:'input'
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
        jobName:'',
        id:'',
        leaderName:'',
        leader:'',
        leaderId:'',
        accountExpireTime:'',
        passwordExpireTime:'',
        alias:'',
        lock:'',
        nameSpell:''
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
      isClickMenu: false, // 是否点击目录变量
      lastX: '400',
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
    this.getMenuTreeData()
    document.addEventListener("mouseup", this.mouseUp);
  },
  mounted() {
    this.getMenus()
    this.getJobnamedata()
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
    reesetpwd({ $index, row }) {
      console.log(row);
      this.$confirm(`确定重置密码吗?`, '提示信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let _data = {}
        _data = {url: '/user/reset-pwd',params: {data:{userName:row.userName}}}
        this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
            this.$message({
              title: '成功',
              message: '重置成功',
              type: 'success',
              duration: 2000
            })
        })

      })
    },
    cascaderselect(val,key){
      this.Menu[key] = val
    },
    getAtcolumdata(row, column, event){
      // for(let key in this.useredit_form){
      //   this.useredit_form[key] = row[key]?.toString();
      // }
      // console.log(row);
      this.editID = row.id
    },
    // 授权
    authorization(row){
      this.authorizationtitle = row.row.realName
      if(row.row.roles){
        row.row.roles.forEach(item =>{
          this.checkedroleData.push(item.id)
        })
      }else{
        this.checkedroleData = []
      }
      this.dialogauthorization=true
      roleAll().then(res=>{
        this.roleData=res.data.data;
      })
    },
     translateText(type){
      return this.textI18n[type][this.$store.state.app.language];
    },
    //岗位数据
    getJobnamedata(){
      let _data = {url:'/job/guest/all-job',params:{}}
       this.$store.dispatch('fmsCommon/actionAuthPost',_data)
      .then(data => {
           this.menulevelOptions.jobName = data.map(c=>{
             return {
               title:c.jobName,
               value:c.id,
               menu_:c.id,
             }
           })
       }).catch(err => {
          console.error(err)
       })
         //初始化工序信息
    },
    //提交授权
    SubmitAuthorization(){
      let data=[]
      this.checkedroleData.forEach(item=>{
        for(let c in this.roleData){
          if(this.roleData[c].id ===item){
            let obj={
             roleId:item,
             userId:this.editID,
             roleType:this.roleData[c].roleType
            }
            data.push(obj);
          }
        }
      })
            //若全部取消，则置为#
     if(data.length == 0){
        data.push({roleId:'#',userId:this.editID})
      }
      saveUserRole({data}).then(res=>{
        if(res.data.status === 'SUCCESS'){
          this.$message({
          message: '授权成功',
          type: 'success'
          });
          this.dialogauthorization = false;
          this.checkedroleData=[]
          let params={
            current:  this.listQuery.page,
            pageSize: this.listQuery.limit,
            requestData:{
            realName: "",
            userName: ""
            }
          }
          this.initData(params)
        }else{
          this.$message.error(res.data.data);
        }
      })
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
       const _data = {url: '/org/org-tree'}
        this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
          const newData = this.treeData(data, '0')
           this.treeMenuData = newData
           this.options = newData
           this.defaultShowNodes = [newData[0].id]
        })

    },
    // 获取菜单对应表格数据
    getMenuTableData(row) {
      let _data = {url: '/user/dept-user',params: {data:row.id}}
      this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
        this.tableData = data
        this.tableData.forEach(item=>{
          let arr = []
            if(item.roles){
              arr=item.roles.map(v=>{
                return v.roleName
              })
            }
          this.menulevelOptions.jobName.forEach(val=>{
              // console.log(item.jobId);
              // console.log(val);

            if(val.value === item.jobId){
              item['jobName'] = val.title
            }
          })
          item['roleName'] = arr.toString();
        })
      })
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

      // for (let p in this.Menu) {
      //     // if (this.Menu.hasOwnProperty(p)) {
      //       this.Menu[p] = ''
      //     // }
      // }

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
        leader:'',
        leaderId:'',
        leaderName:'',
        deptId: this.clickData.id,
        id:'',
        accountExpireTime:'',
        passwordExpireTime:'',
        alias:'',
        lock:'',
        nameSpell:''
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
              deptId:val.deptId,
              jobId:val.jobName
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
      // console.log(scope);
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

          let _data = {url: '/user/add',params: {data:{
            ...this.Menu,
            jobId:val.jobName
            // deptId:this.Menu.deptId[this.Menu.deptId.length-1]
            }}}
          console.log(this.Menu)
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
