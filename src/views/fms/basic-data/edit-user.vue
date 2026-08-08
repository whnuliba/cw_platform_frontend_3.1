<template>
  <div class="app-container">
          <el-form :model="useredit_form" ref="useredit_form">
            <el-form-item :label="commonI18n(getItem(colums,'userName'))" :label-width="formLabelWidth">
              <el-input :disabled="!this.editUser" v-model="useredit_form.userName" autocomplete="off"></el-input>
            </el-form-item>
            <!-- <el-form-item :label="commonI18n(getItem(colums,'realName'))" :label-width="formLabelWidth">
              <el-input :disabled="true"  v-model="useredit_form.realName" autocomplete="off"></el-input>
            </el-form-item> -->
            <el-form-item :label="commonI18n(getItem(colums,'password'))"   :rules="[
                { required: true, message: translateText('passwordInput'), trigger: 'blur' },
                {  message:  translateText('passwordInput'), trigger: ['blur', 'change'] }
              ]"  :label-width="formLabelWidth">
              <el-input v-model="useredit_form.password" autocomplete="off" type="password"             
               ></el-input>
            </el-form-item>
            <el-form-item :label="commonI18n(getItem(colums,'newPwassword'))"   :rules="[
                { required: true, message: translateText('passwordInput'), trigger: 'blur' },
                {  message:  translateText('passwordInput'), trigger: ['blur', 'change'] }
              ]"   :label-width="formLabelWidth">
             <el-tooltip content="The password length must not be less than 8 characters">
              <el-input v-model="useredit_form.newPassword" autocomplete="off" type="password"></el-input>
            </el-tooltip>
            </el-form-item> 
              <el-form-item :label="commonI18n(getItem(colums,'newPwassword1'))"   :rules="[
                { required: true, message: translateText('passwordInput'), trigger: 'blur' },
                {  message:  translateText('passwordInput'), trigger: ['blur', 'change'] }
              ]"   :label-width="formLabelWidth">
              <el-input v-model="useredit_form.newPassword1" autocomplete="off"  type="password" ></el-input>
            </el-form-item>
              <el-form-item v-if="defaultSave">
                <el-button  :loading="loading" type="primary" @click="submitForm('useredit_form')">{{$t('common.btn.save')}}</el-button>
              </el-form-item>
          </el-form>
    
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import elDragDialog from "@/directive/el-drag-dialog"; // base on element-ui
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import {newgetRole,addUser,editUser,roleAll,saveUserRole,delUserRole} from "@/api/roles";
import i18n from '@/lang';

export default {
  name: "Usersrole",
  components: { Pagination },
  directives: { waves, elDragDialog },
  computed:{
    initSelect:{
      get(){
        return {
         sex:[{label:this.$t('const.sex.male'),value:0},{label:this.$t('const.sex.female'),value:1},{label:this.$t('const.sex.secret'),value:2}],
         useState:[{label:this.$t('const.useState.normal'),value:0},{label:this.$t('const.useState.limited'),value:1}]
        }
      }
    }
  },
  props:{
     defaultSave:{
       type:Boolean,
       default:()=>{return true}
     },
     editUser:{
      type:Boolean,
      default:()=>{return false}
     }
     ,
     userInfo:{
      type:Object,
      default:()=>{
        return JSON.parse(sessionStorage.getItem("userInfoArray"))
      }
     }
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
      loading:false,
      dialogCraeteFormVisible:false,
      dialogauthorization:false,
      dialogedituser:false,
      tableData: [],
      calendarTypeOptions: [],
      logininput:'',
      authorizationtitle:'',
      nameinput:'',
      editID:'',
      multiSelectDelete:[],
      listQuery: {
        page: 1,
        limit: 15,
      },
      sex:'0',
      rules1: {
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          password1: [
            { validator: validatePass2, trigger: 'blur' }
          ],
      },
      // initSelect:{
      //    sex:[{label:this.$t('const.sex.male'),value:0},{label:this.$t('const.sex.female'),value:1},{label:this.$t('const.sex.secret'),value:2}],
      //    useState:[{label:this.$t('const.useState.normal'),value:0},{label:this.$t('const.useState.limited'),value:1}]
      // }, 
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
          field:'password',
          title:'原密码',
          width:170,
        },
       {
          field:'newPwassword',
          title:'新密码',
          width:170,
        },
        {
          field:'newPwassword1',
          title:'新密码确认',
          width:170,
        },
      ],
      form: {
        userName: '',
        realName: '',
        password:'',
        newPassword:'',
        newPassword1:'',
        email:'',
        useState: '',
        sex: '',
      },
      useredit_form: {
        userName: '',
        realName: '',
        password:'',
        newPassword:'',
        newPassword1:'',
        sex: '',
        email:'',
        useState: '',
      },
      formLabelWidth: '125px',
      checkedroleData: [],
      roleData: [],
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1;
      },
    };
  },
  created() {

    let user = {userInfo:{}}

    if(!this.defaultSave){
      user.userInfo = this.userInfo
      this.useredit_form.userName=user.userInfo.username
      this.useredit_form.realName=user.userInfo.realName
    }else{
      user = JSON.parse(sessionStorage.getItem("userInfoArray"))
      this.useredit_form.userName=user.userInfo.username
      this.useredit_form.realName=user.userInfo.realName
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
        let arr=item.roles.map(v=>{
          return v.roleName
        })
        item['roleName'] = arr.toString();
        // item['sexto'] = item.sex === 0 ? '男' : item.sex === 1 ? '女' : '保密'
        // item['useStateto'] = item.useState === 0 ? '正常使用' : '限制用户';
      })
      this.total = res.data.data.total;
    })
    }


  },
  mounted() {},
  methods: {
    submitForm(useredit_form){
       this.loading=true
       let username = this.useredit_form.userName
       let realName = this.useredit_form.realName
       let password=this.useredit_form.password
       let newPassword = this.useredit_form.newPassword
       let newPassword1 = this.useredit_form.newPassword1
      
      if(password==null || password==undefined || password==''
        ||newPassword==null || newPassword==undefined || newPassword==''
         ||newPassword1==null || newPassword1==undefined || newPassword1==''
      ){

        this.$message({
            message:'data is empty',
            type: 'warning'
        })
        this.loading=false
        return 
      }
      
      if(newPassword!=newPassword1){
          this.$message({
            message: 'The passwords are different',
            type: 'warning'
        })
        this.loading=false
        return 
      }
 
       this.$refs[useredit_form].validate((valid) => {
          if (valid) {
           const _data = {url:'/user/update-pwd',params:{
             data:{
               userName:username,
               password:password,
               newPassword:newPassword

             }
           }}
          this.$store.dispatch('fmsCommon/actionAuthPost',_data)
          .then(data => {  
             this.$message({
            message: 'success',
            type: 'success'
            })
          if(!this.defaultSave){
              this.$emit("recallActionLogin",newPassword,username)
              return
          }  
         this.$store.dispatch('user/logout')
         sessionStorage.removeItem('login_session_key')
        //this.$router.push(`/login`)       
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)       
       }).catch(err => {
          console.error(err)
       }).finally(()=>{
        this.loading=false
       })
      
          } else {
            console.log('error submit!!');
            this.loading=false
            return false;
          }
        });
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
    getValueConvert(arr, value) {
      for (let v of arr) {
        if (v.value == value) {
          return v.label;
        }
      }
      return value;
    },
    //多选
    handleSelectionChange(val){
      this.multiSelectDelete=val.map(item =>{
        return item.id
      })
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
        email:'',
        useState: '',
        sex: '0',
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
        let obj={
          roleId:item,
          userId:this.editID
        }
        data.push(obj);
      })
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
            let arr=item.roles.map(v=>{
              return v.roleName
            })
            item['roleName'] = arr.toString();
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
         if(res.data.status === 'SUCCESS'){
          this.$message({
          message: this.$t('common.btn.deleteSuccess'),
          type: 'success'
          });
          // this.initData()
          let params={
            current: row.$index === 0 ? this.listQuery.page-1 : this.listQuery.page,
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
