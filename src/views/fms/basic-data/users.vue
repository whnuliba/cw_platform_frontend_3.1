/*
 * @CreatAuthor: 杨沛霖
 * @UpdateAuthor: (...)
 * @Description: 用户中心-用户管理
 */
<template>
  <div class="app-container">
    <div class="filter-container">
      <div  style="float: left">
        <!-- 单行文本 -->
        <el-input
          v-model="logininput"
          :placeholder="commonI18n(getItem(colums,'userName'))"
          style="width: 120px"
          class="filter-item serach-input"
        ></el-input>
        <!-- 下拉菜单 -->
        <el-input
          v-model="nameinput"
          :placeholder="commonI18n(getItem(colums,'realName'))"
          style="width: 150px"
          class="filter-item serach-input"
        >
        </el-input>
      </div>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
        v-ele-show="{btnCode:'QUERY_USER_ALL'}"
      >
        {{ $t("table.search") }}
      </el-button>
      <el-button
        class="filter-item"
        type="warning"
        icon="el-icon-remove"
        @click="handleClear"
      >
        {{ $t("table.reset") }}
      </el-button>
      <el-button
        v-ele-show="{btnCode:'user_add'}"
        class="filter-item"
        type="warning"
        @click="openAdduserDiolag"
      >
        {{ $t("table.add") }}
      </el-button>
      <el-button
        v-ele-show="{btnCode:'user_del'}"
        class="filter-item"
        type="warning"
        @click="toggleSelection()"
      >
        {{ $t("table.multidelete") }}
      </el-button>

    </div>
    <el-table
      :key="tableKey"
      :data="tableData"
      style="width: 100%; overflow: auto"
      border
      @row-click="getAtcolumdata"
      @selection-change="handleSelectionChange"
    >
       <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column :label="$t('common.no')" width="50px" align="center"  fixed="left">
        <template slot-scope="scope">
          {{ (listQuery.page-1)*listQuery.limit+(scope.$index + 1) }}
        </template>
      </el-table-column>

      <el-table-column
        v-for="(item,i) in colums"
        :label="commonI18n(item)"
        :prop="item.field"
        :key="`user${i}`"
        :width="item.width"
        align="center"
        show-overflow-tooltip
      >
      <template  slot-scope="{row}">{{commonFilter(row[item.field],item.field)}}</template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.oper')" min-width="250" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="reesetpwd(scope)"
            type="primary"
            >
            {{$t('config.resetPwd') }}
            </el-button
          >
          <el-button
            size="mini"
            @click="dialogedituser=true"
            type="primary"
            >
            {{$t("table.edit")}}
            </el-button
          >
          <el-button
            size="mini"
            @click="authorization(scope)"
            type="primary"
            > {{$t("table.role")}}</el-button
          >
          <el-button
            size="mini"
            @click="handleDelete(scope)"
            type="danger"
            >{{ $t("permission.delete") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getSysTableList"
        />
    </div>
    <!-- 添加用户 -->
    <el-dialog :title="$t('table.add')" v-el-drag-dialog :visible.sync="dialogCraeteFormVisible">
          <el-form :model="form" :rules="rules1" ref="form" inline="true">
            <el-form-item :label="commonI18n(getItem(columsEditForm,'userName'))" :label-width="formLabelWidth">
              <el-input v-model="form.userName" autocomplete="off" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item :label="commonI18n(getItem(columsEditForm,'realName'))" :label-width="formLabelWidth">
              <el-input v-model="form.realName" autocomplete="off" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item :label="$t('login.password')" :label-width="formLabelWidth" prop="password">
              <el-input type="password" v-model="form.password" autocomplete="off" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item :label="$t('login.passwordagain')" :label-width="formLabelWidth" prop="password1">
              <el-input type="password" v-model="form.password1" autocomplete="off" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item :label="commonI18n(getItem(columsEditForm,'email'))" :label-width="formLabelWidth">
              <el-input v-model="form.email" autocomplete="off" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item  :label-width="formLabelWidth" :label="commonI18n(getItem(columsEditForm,'leaderId'))"  :rules="[
                      {
                        required: false,
                        message: 'cannot empty',
                        trigger: 'blur',
                      },
                    ]">
                  <CwUserDropdown :selectRange="[300]"  v-model="form.leaderId" :orgType="300"   style="width: 250px"
                     :initValue="form.leaderId!==undefined&&form.leaderId!==null?form.leaderId.split(','):[]"
                     :radio="()=>{
                        return true
                     }"
                     @onChange="(result)=>{
                          form.leaderName = result.name
                          form.leaderId = result.id
                          form.leader = result.code 
                        
                     }"
                  ></CwUserDropdown>

                  <!-- <el-input type="textarea" v-model="defaultForm.params[item.field]"  :disabled="item.disabled"  :style="{width: '220px',...item.style}" /> -->
                  </el-form-item>            
            <el-form-item :label="commonI18n(getItem(columsEditForm,'sex'))" :label-width="formLabelWidth">
              <div style="width: 250px">
                <el-radio v-model="form.sex" label='0'>{{$t("const.sex.male")}}</el-radio>
                <el-radio v-model="form.sex" label='1'>{{$t("const.sex.female")}}</el-radio>
                <el-radio v-model="form.sex" label='2'>{{$t("const.sex.secret")}}</el-radio>
              </div>

            </el-form-item>
            <el-form-item :label="commonI18n(getItem(columsEditForm,'useState'))" :label-width="formLabelWidth">
              <el-select v-model="form.useState" :placeholder="$t('const.pleaseSelect')" style="width: 250px">
                <el-option :label="$t('const.useState.normal')" value="0"></el-option>
                <el-option :label="$t('const.useState.limited')" value="1"></el-option>
              </el-select>
            </el-form-item>
             <el-form-item
              :label="commonI18n(getItem(columsEditForm,'deptId'))"
              :label-width="formLabelWidth"
            >
              <el-cascader
               :options="options"
               :show-all-levels="false"
               :props="{ checkStrictly: true }"
                v-model="form.deptId"
                @change="handleChange($event,form)"
                style="width: 250px"
               ></el-cascader>
            </el-form-item>
            <el-form-item   :label="commonI18n(getItem(columsEditForm,'jobName'))" :label-width="formLabelWidth"
              :rules="[{ required: true, message: '岗位不能为空', trigger: 'change' }]"
             >
                <el-select v-model="form.jobId" @change="$forceUpdate()" placeholder="..."  style="width: 250px">
                  <el-option
                    v-for="item in initSelect.job"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            
            <el-form-item  :label="commonI18n(getItem(columsEditForm,'accountExpireTime'))" :label-width="formLabelWidth">
              <el-date-picker format="yyyy-MM-dd HH:mm:ss"  type="datetime"  value-format="yyyy-MM-dd HH:mm:ss"  v-model="useredit_form.accountExpireTime" style="width: 250px"> </el-date-picker>
          </el-form-item>
          <el-form-item  :label="commonI18n(getItem(columsEditForm,'passwordExpireTime'))" :label-width="formLabelWidth">
              <el-date-picker format="yyyy-MM-dd HH:mm:ss"  type="datetime"  value-format="yyyy-MM-dd HH:mm:ss" v-model="useredit_form.passwordExpireTime"  style="width: 250px"> </el-date-picker>
          </el-form-item>

            <el-form-item :label="commonI18n(getItem(columsEditForm,'lock'))" :label-width="formLabelWidth">
              <el-select v-model="useredit_form.lock" :placeholder="$t('const.pleaseSelect')" style="width: 250px">
                <el-option :label="'Y'" value="Y"></el-option>
                <el-option :label="'N'" value="N"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="commonI18n(getItem(columsEditForm,'alias'))" :label-width="formLabelWidth">
              <el-input v-model="useredit_form.alias" autocomplete="off" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item :label="commonI18n(getItem(columsEditForm,'nameSpell'))" :label-width="formLabelWidth">
              <el-input v-model="useredit_form.nameSpell" autocomplete="off" style="width: 250px"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogCraeteFormVisible = false">{{$t("common.btn.cancel")}}</el-button>
            <el-button type="primary" @click="useradd">{{$t("common.btn.ok")}}</el-button>
          </div>
      </el-dialog>
    <!-- 用户编辑 -->
      <el-dialog :title="$t('table.edit')" v-el-drag-dialog :visible.sync="dialogedituser">
          <el-form :model="useredit_form" inline="true">
            <el-form-item :label="commonI18n(getItem(columsEditForm,'userName'))" :label-width="formLabelWidth">
              <el-input :disabled="true" v-model="useredit_form.userName" autocomplete="off" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item :label="commonI18n(getItem(columsEditForm,'realName'))" :label-width="formLabelWidth">
              <el-input v-model="useredit_form.realName" autocomplete="off" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item
              :rules="[
                { required: true, message: translateText('emailInput'), trigger: 'blur' },
                { type: 'email', message:  translateText('emailInputWarn'), trigger: ['blur', 'change'] }
              ]" prop="email" :label="commonI18n(getItem(columsEditForm,'email'))" :label-width="formLabelWidth">
              <el-input v-model="useredit_form.email" autocomplete="off" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item  :label-width="formLabelWidth" :label="commonI18n(getItem(columsEditForm,'leaderId'))"  :rules="[
                      {
                        required: false,
                        message: '不能为空',
                        trigger: 'blur',
                      },
                    ]">
                  <CwUserDropdown :selectRange="[300]"  v-model="useredit_form.leaderId" :orgType="300"   style="width: 250px"
                     :initValue="useredit_form.leaderId!==undefined && useredit_form.leaderId!==null?useredit_form.leaderId.split(','):[]"
                     :radio="()=>{
                        return true
                     }"
                     @onChange="(result)=>{
                          useredit_form.leaderName = result.name
                          useredit_form.leaderId = result.id
                          useredit_form.leader = result.code 
                        
                     }"
                  ></CwUserDropdown>

                  <!-- <el-input type="textarea" v-model="defaultForm.params[item.field]"  :disabled="item.disabled"  :style="{width: '220px',...item.style}" /> -->
                  </el-form-item>
            <el-form-item :label="commonI18n(getItem(columsEditForm,'sex'))" :label-width="formLabelWidth">
              <div  style="width: 250px">
                <el-radio v-model="useredit_form.sex" label='0'>{{$t("const.sex.male")}}</el-radio>
              <el-radio v-model="useredit_form.sex" label='1'>{{$t("const.sex.female")}}</el-radio>
              <el-radio v-model="useredit_form.sex" label='2'>{{$t("const.sex.secret")}}</el-radio>
              </div>

            </el-form-item>
            <el-form-item :label="commonI18n(getItem(columsEditForm,'useState'))" :label-width="formLabelWidth">
              <el-select v-model="useredit_form.useState" :placeholder="$t('const.pleaseSelect')" style="width: 250px">
                <el-option :label="$t('const.useState.normal')" value="0"></el-option>
                <el-option :label="$t('const.useState.limited')" value="1"></el-option>
              </el-select>
            </el-form-item>


            <el-form-item
              :label="commonI18n(getItem(columsEditForm,'deptId'))"
              :label-width="formLabelWidth"
            >
              <el-cascader
               :options="options"
               :show-all-levels="false"
               :props="{ checkStrictly: true }"
                v-model="useredit_form.deptId"
                @change="handleChange($event,useredit_form)" style="width: 250px"
               ></el-cascader>
            </el-form-item>
            <el-form-item   :label="commonI18n(getItem(columsEditForm,'jobName'))" :label-width="formLabelWidth"
            :rules="[{ required: true, message: '岗位不能为空', trigger: 'change' }]"
             >
                <el-select v-model="useredit_form.jobId" @change="$forceUpdate()" placeholder="..." style="width: 250px">
                  <el-option
                    v-for="item in initSelect.job"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>

            <el-form-item  :label="commonI18n(getItem(columsEditForm,'accountExpireTime'))" :label-width="formLabelWidth">
              <el-date-picker format="yyyy-MM-dd HH:mm:ss"  type="datetime"  value-format="yyyy-MM-dd HH:mm:ss"  v-model="useredit_form.accountExpireTime" style="width: 250px"> </el-date-picker>
          </el-form-item>
          <el-form-item  :label="commonI18n(getItem(columsEditForm,'passwordExpireTime'))" :label-width="formLabelWidth">
              <el-date-picker format="yyyy-MM-dd HH:mm:ss" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" v-model="useredit_form.passwordExpireTime"  style="width: 250px"> </el-date-picker>
          </el-form-item>

            <el-form-item :label="commonI18n(getItem(columsEditForm,'lock'))" :label-width="formLabelWidth" >
              <el-select v-model="useredit_form.lock" :placeholder="$t('const.pleaseSelect')"  style="width: 250px">
                <el-option :label="'Y'" value="Y"></el-option>
                <el-option :label="'N'" value="N"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="commonI18n(getItem(columsEditForm,'alias'))" :label-width="formLabelWidth">
              <el-input v-model="useredit_form.alias" autocomplete="off" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item :label="commonI18n(getItem(columsEditForm,'nameSpell'))" :label-width="formLabelWidth">
              <el-input v-model="useredit_form.nameSpell" autocomplete="off" style="width: 250px"></el-input>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogedituser = false">{{$t("common.btn.cancel")}}</el-button>
            <el-button type="primary" @click="userEdit">{{$t("common.btn.ok")}}</el-button>
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

    <el-divider direction="horizontal" content-position="center" />



  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import elDragDialog from "@/directive/el-drag-dialog"; // base on element-ui
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import {newgetRole,addUser,editUser,roleAll,saveUserRole,delUserRole} from "@/api/roles";
import i18n from '@/lang';
import CwUserDropdown from "@/components/Cw/CwUserDropdown";

export default {
  name: "Usersrole",
  components: { Pagination,CwUserDropdown },
  directives: { waves, elDragDialog },
  computed:{
    // initSelect:{
    //   get(){
    //     return {
    //      sex:[{label:this.$t('const.sex.male'),value:0},{label:this.$t('const.sex.female'),value:1},{label:this.$t('const.sex.secret'),value:2}],
    //      useState:[{label:this.$t('const.useState.normal'),value:0},{label:this.$t('const.useState.limited'),value:1}],
    //      job:[{
    //       label:'',value:''
    //      }],
    //     }
    //   }
    // }
  },
  data() {
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.translateText('passwordInput')));
        } else {
          if (this.form.password !== '') {
            this.$refs.form.validateField('password1');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.translateText('passwordInputAgain')));
        } else if (value !== this.form.password) {
          callback(new Error(this.translateText('passwordInputDifferent')));
        } else {
          callback();
        }
      };
    return {
      tableKey: 0,
      total: 0,
      dialogCraeteFormVisible:false,
      dialogauthorization:false,
      dialogedituser:false,
      tableData: [],
      options: [],
      calendarTypeOptions: [],
      initSelect:{
         sex:[{label:this.$t('const.sex.male'),value:0},{label:this.$t('const.sex.female'),value:1},{label:this.$t('const.sex.secret'),value:2}],
         useState:[{label:this.$t('const.useState.normal'),value:0},{label:this.$t('const.useState.limited'),value:1}],
         job:[{
          label:'',value:''
         }],
        },
      logininput:'',
      authorizationtitle:'',
      nameinput:'',
      editID:'',
      multiSelectDelete:[],
      listQuery: {
        page: 1,
        limit: 15,
      },
      jobs: [{ label:'1',value:'1'
        }],

      sex:'0',
      rules1: {
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          password1: [
            { validator: validatePass2, trigger: 'blur' }
          ],
      },
      textI18n:{
        emailInput:{zh:'请输入邮箱地址',en:'Please input email address.'},
        emailInputWarn:{zh:'请输入正确的邮箱地址',en:'Please input correct email address.'},
        passwordInput:{zh:'请输入密码',en:'Please input password.'},
        passwordInputAgain:{zh:'请再次输入密码',en:'Please input password Again.'},
        passwordInputDifferent:{zh:'两次输入密码不一致!',en:'Twice password inputs are not equal!'},
        operationConfirm:{zh:'确认执行操作？',en:'Are you sure?'},
        authorizeSuccess:{zh:'授权成功',en:'authorized successfully'},
      },
      colums:[
        {
          field:'userName',
          title:'用户名',
          width:100,
        },
        {
          field:'realName',
          title:'姓名',
          width:100,
        },
        {
          field:'email',
          title:'用户邮箱',
          width:170,
        },
        {
          field:'sex',
          title:'性别',
          width:100,
        },
        {
          field:'useState',
          title:'用户状态',
          width:100,
        },
        {
          field:'deptName',
          title:'部门',
          width:100,
        },
        {
          field:'roleName',
          title:'角色',
          width:200,
        },
        {
          field:'leaderName',
          title:'直属领导',
          width:150,
        },
        {
          field:'jobName',
          title:'岗位',
          width:200,
        },
        {
          field:'nameSpell',
          title:'拼写',
          width:100,
        },
        {
          field:'accountExpireTime',
          title:'登录过期',
          width:200,
        },
        {
          field:'passwordExpireTime',
          title:'密码过期',
          width:200,
        },
        {
          field:'lock',
          title:'锁定',
          width:50,
        },
        {
          field:'alias',
          title:'别名',
          width:50,
        },
      ],
      columsEditForm:[
        {
          field:'userName',
          title:'用户名',
          width:100,
        },
        {
          field:'realName',
          title:'姓名',
          width:100,
        },
        {
          field:'email',
          title:'用户邮箱',
          width:170,
        },
        {
          field:'leaderId',
          title:'直属领导',
          width:200,
        },
        {
          field:'sex',
          title:'性别',
          width:100,
        },
        {
          field:'useState',
          title:'用户状态',
          width:100,
        },
        {
          field:'deptId',
          title:'部门',
          width:100,
        },
        {
          field:'roleName',
          title:'角色',
          width:200,
        },
        {
          field:'jobName',
          title:'岗位',
          width:200,
        },

        {
          field:'nameSpell',
          title:'拼写',
          width:100,
        },
        {
          field:'accountExpireTime',
          title:'登录过期',
          width:200,
        },
        {
          field:'passwordExpireTime',
          title:'密码过期',
          width:200,
        },
        {
          field:'lock',
          title:'锁定',
          width:50,
        },
        {
          field:'alias',
          title:'别名',
          width:50,
        },

      ],
      form: {
        userName: '',
        realName: '',
        password:'',
        password1:'',
        email:'',
        useState: '',
        sex: '',
        deptId:'',
        jobId:'',
        leader:'',
        leaderId:'',
        leaderName:'',
        accountExpireTime:'',
        passwordExpireTime:'',
        alias:'',
        lock:'',
        nameSpell:''
      },
      useredit_form: {
        userName: '',
        realName: '',
        sex: '',
        email:'',
        useState: '',
        deptId:'',
        jobId:'',
        leader:'',
        leaderId:'',
        leaderName:'',
        accountExpireTime:'',
        passwordExpireTime:'',
        alias:'',
        lock:'',
        nameSpell:''
      },
      formLabelWidth: '125px',
      checkedroleData: [],
      checkedAllroleData :[],
      roleData: [],
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1;
      },
    };
  },
  created() {
    this.selectOptions()
    newgetRole({
      current: 1,
      pageSize: 15,
      requestData:{
        realName: "",
        userName: ""
      }
    }).then(res=>{
      let {data} = res.data.data
      this.tableData = data;

      this.tableData.forEach(item=>{
        if(!(item.roles && Array.isArray(item.roles)))
            return;
        let arr=item.roles.map(v=>{
          return v.roleName
        })
        item['jobName'] = this.commonFilter(item.jobId,'job')
        item['roleName'] = arr.toString();
        // item['sexto'] = item.sex === 0 ? '男' : item.sex === 1 ? '女' : '保密'
        // item['useStateto'] = item.useState === 0 ? '正常使用' : '限制用户';
      })
      this.total = res.data.data.total;
    })
    this.getMenuTreeData()

  },
  mounted() {},
  methods: {
     reesetpwd({ $index, row }) {
      // console.log(row);
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
    //Cascader change事件
    handleChange(row,formobj){
      formobj.deptId = row[row.length-1]
    },
    // 递归生成菜单树结构数据
    loop(data, id) {
        const res = []
        data.forEach((item=>{
          item.label = item.name
          item.value = item.id
          if(item.children&&item.children.length>0){
            item.children = this.loop(item.children, item.id)
          }else{
            item.children = null
          }
          res.push(item)
        }))

        return res
      },
    treeData(data, id) {
      // console.log(data);
      this.loop(data, id)
      return this.loop(data, id)
    },
     // 获取菜单树结构数据
    getMenuTreeData() {
       const _data = {url: '/org/org-tree'}
        this.$store.dispatch('fmsCommon/actionAuthPost', _data).then(data => {
          const newData = this.treeData(data, '0')
          //  this.treeMenuData = newData
            // console.log(newData);
           this.options = newData
          //  this.defaultShowNodes = [newData[0].id]
        })

    },
    translateText(type){
      return this.textI18n[type][this.$store.state.app.language];
    },
    getItem(arr,field){
      for(let item of arr){
        if(item.field==field)
          return item;
      }
    },
    commonFilter(value, type) {
      if (
        this.initSelect.hasOwnProperty(type) &&
        typeof this.initSelect[type] != undefined &&
        Array.isArray(this.initSelect[type])
      ) {
        return this.getValueConvert(this.initSelect[type], value);
      }
      if (
        this.initSelect.hasOwnProperty(type) &&
        !Array.isArray(this.initSelect[type]) &&
        this.initSelect[type].hasOwnProperty(value)
      ) {
        return this.initSelect[type][value];
      }
      return value;
    },

    selectOptions(){
         //初始化线体信息
       let _data = {url:'/job/guest/all-job',params:{}}
       this.$store.dispatch('fmsCommon/actionAuthPost',_data)
      .then(data => {
           this.initSelect.job = data.map(c=>{
             return {
               label:c.jobName,
               value:c.id
             }
           })
       }).catch(err => {
          console.error(err)
       })
         //初始化工序信息
        },
      getValueConvert(arr,value){
            for(let v of arr){
              if(v.value ==value )
                {
                  return v.label
                }
          }
          return value
      },
    //多选
    handleSelectionChange(val){
      this.multiSelectDelete=val.map(item =>{
        return item.id
      })
    },
    handleSelectChange() {
    this.$forceUpdate()
},
    //批量删除
     toggleSelection(){
       this.$confirm(this.translateText('operationConfirm'), this.$t('common.btn.hint'), {
        confirmButtonText: this.$t('common.btn.ok'),
        cancelButtonText: this.$t('common.btn.cancel'),
        type: "warning",
      }).then(() => {
       this.multiSelectDelete.forEach(item=>{
        delUserRole({
         data:item
        }).then(res=>{
          if(res.data.status === 'SUCCESS'){
           this.$message({
           message: this.$t('common.btn.deleteSuccess') ,
           type: 'success'
           });
           // this.initData()
           let params={
             current:  this.listQuery.page,
             pageSize: this.listQuery.limit,
             requestData:{
               realName: "",
               userName: ""
             }
           }
           this.initData(params)
           this.listQuery={
            page: 1,
            limit: 10,
           }
         }else{
           this.$message.error(res.data.data);
         }
        })
        })
      });


    },
    //分页
    getSysTableList(val){
      let params = {
        current: val.page,
        pageSize: val.limit,
        requestData:{
        realName: "",
        userName: ""
        }
      }
      this.initData(params)
      this.listQuery = val
    },
    openAdduserDiolag(){
      this.dialogCraeteFormVisible = true;
      this.form={
        userName: '',
        realName: '',
        password:'',
        password1:'',
        leader:'',
        leaderId:'',
        leaderName:'',
        email:'',
        useState: '',
        sex: '0',
        accountExpireTime:'',
        passwordExpireTime:'',
        alias:'',
        lock:'',
        nameSpell:''
      }
    },

    //获取此行数据
    getAtcolumdata(row, column, event){
      for(let key in this.useredit_form){
        this.useredit_form[key] = row[key]?.toString();
      }
      this.editID = row.id
    },
    // 授权
    authorization(row){
      this.authorizationtitle = row.row.realName
      row.row.roles.forEach(item =>{
      this.checkedroleData.push(item.id)
      this.checkedAllroleData.push({roleId:item.id,roleType:item.roleType})
      })

      this.dialogauthorization=true
      roleAll().then(res=>{
        this.roleData=res.data.data;
      })
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
       if(data.length==0){
               data.push({roleId:"#",userId:this.editID})
            }
      saveUserRole({data}).then(res=>{
        if(res.data.status === 'SUCCESS'){
          this.$message({
          message: this.translateText('authorizeSuccess'),
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
      }).finally(()=>{
        this.checkedroleData=[]
      })
    },
    //编辑
    userEdit(){
      editUser({
        data: {
          id:this.editID,
          ...this.useredit_form
        }
      }).then(res=>{
        if(res.data.status === 'SUCCESS'){
          this.$message({
          message:this.$t('common.btn.updateSuccess') ,
          type: 'success'
          });
          this.dialogedituser = false;
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
    //添加用户
    useradd(){
      addUser({
        data:this.form
      }).then(res=>{
        if(res.data.status === 'SUCCESS'){
          this.$message({
          message: this.$t('common.btn.addSuccess') ,
          type: 'success'
          });
          this.dialogCraeteFormVisible = false;
          let params = {
            current: this.listQuery.page,
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


    //搜索
    handleFilter() {
      let params={
        current:  1,
        pageSize: this.listQuery.limit,
        requestData:{
          realName: this.nameinput,
          userName: this.logininput,
        }
      }
      this.initData(params)
    },
    // 重置
    handleClear() {
      this.logininput = '';
      this.nameinput = '';
    },

    initData(params) {
      newgetRole({
          ...params
      }).then(res=>{

          let {data} = res.data.data
          this.tableData = data;
          this.tableData.forEach(item=>{
            if(!(item.roles && Array.isArray(item.roles)))
            return;
            let arr=item.roles.map(v=>{
              return v.roleName
            })
            item['roleName'] = arr.toString();
            item['jobName'] = this.commonFilter(item.jobId,'job')
            // item['sexto'] = item.sex === 0 ? '男' : item.sex === 1 ? '女' : '保密'
            // item['useStateto'] = item.useState === 0 ? '正常使用' : '限制用户';
          })
          this.total = res.data.data.total;
        })
    },
   //删除
    handleDelete(row, index) {
      this.$confirm(this.translateText('operationConfirm'), this.$t('common.btn.hint'), {
        confirmButtonText:this.$t('common.btn.ok'),
        cancelButtonText:this.$t('common.btn.cancel'),
        type: "warning",
      }).then(() => {
       delUserRole({
         data:row.row.id
       }).then(res=>{
         if(res.data.code === 200){
          this.$message({
          message: this.$t('common.btn.deleteSuccess'),
          type: 'success'
          });
          // this.initData()
          let params={
            current: row.$index === 0 ? 1 : this.listQuery.page,
            pageSize: this.listQuery.limit,
            requestData:{
            realName: "",
            userName: ""
            }
          }
          this.initData(params)
        }else{
          this.$message.error(res.data.message);
        }
       })
      });
    },

  },
};
</script>

<style>
.serach-input {
  margin-right: 10px;
}
.el-dialog.customStyle {
  width: 80%;
  /* height: 100%; */
}
</style>
