<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >

      <div class="title-container">
        <h3 class="title">
          <!-- $t('login.title') -->
          {{ $t('config.title')}}
        </h3>
        <lang-select class="set-language" :langArgs = 'langArgs' />
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          tabindex="1"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            :placeholder="$t('login.password')"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <!-- <el-form-item prop="code">
        <span class="svg-container">
          <svg-icon icon-class="skill" />
        </span>
        <el-input type="text" v-model="loginForm.code" :placeholder="$t('login.verificationcode')" style="width: 100px;"
          tabindex="3" @keyup.enter.native="handleLogin" />
        <div style="float:right;" @click="refreshCode">
          <Identify :identifyCode="identifyCode"></Identify>
        </div>
      </el-form-item> -->

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        tabindex="4"
        @click.native.prevent="handleLogin"
      >
        {{ $t('login.logIn') }}
      </el-button>
       <a href="javascript:void(0)" @click="dialogFormVisible=true" style="color:#fff;  font-size: 12px;margin-top: -20px;float: right; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">{{$t('navbar.editPwd')}}</a>
      <div style="position:relative">
        <!-- <el-button class="thirdparty-button" type="primary" @click="showGestrueDialog">
          {{ $t('login.gesture') }}
        </el-button> -->
      </div>
    </el-form>

    <!-- <el-dialog title="手势密码" :visible.sync="showDialog" customClass="customStyle" :close-on-click-modal="false">
      <GestrueUnlock ref="gestrueunlock" v-model="gestureData" @onReset="gestruereset"></GestrueUnlock>
    </el-dialog> -->

    <div class="v-code">
      <v-code
        :imgs="imgs"
        :show="isShow"
        :canvas-width="300"
        :canvas-height="180"
        @close="closeCallback"
        @success="vCodeSuccessListener"
        @fail="vCodeFailListener"
      />
    </div>

    <el-dialog :title="$t('nvabar.editPwd')" v-el-drag-dialog :visible.sync="dialogFormVisible" width="700px" :destroy-on-close="true" class="editPwd">
      <EditUser ref="editUser" :editUser="editUser" :userInfo="pwduserinfo" :defaultSave="false" @recallActionLogin ="recallActionLogin"></EditUser>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="dialogFormVisible=false">  {{ $t("common.btn.cancel") }}</el-button>
        <el-button type="primary" @click="save('useredit_form')">  {{ $t("common.btn.save") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VCode from 'vue-puzzle-vcode'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { validUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import Identify from '@/components/Identify'
import Cookies from 'js-cookie'
import { setSToken, setLToken, getLToken,setToken,removeToken, getToken } from '@/utils/auth'
import SocialSign from './components/SocialSignin'
import GestrueUnlock from '@/components/GestrueUnlock'
import { getUser, getUserByCode, getUserByGestrue } from '@/api/users'
import { getRelationByID } from '@/api/relation'
import { getRoleButtonListByRoleMenu } from '@/api/role_button'
import { setEncrypt, getDecrypt } from '@/utils/rsa'
import TransactionTableVue from '../dashboard/admin/components/TransactionTable.vue'
import img0 from '@/assets/login_images/chr1.jpg'
import {Base64} from 'js-base64'
import EditUser from '../fms/basic-data/edit-user.vue'
import { JSEncrypt } from 'jsencrypt'

  export default {
    name: 'Login',
    components: { VCode, LangSelect, SocialSign, Identify, GestrueUnlock,EditUser },
    directives: { elDragDialog },
    data() {
      /* const validateUsername = (rule, value, callback) => {
        if (!validUsername(value)) {
          callback(new Error('Please enter the correct user name'))
        } else {
          callback()
        }
      } */
      /* const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码不能少于6位数字'))
        } else {
          callback()
        }
      } */
      return {
        // 拼图验证码相关
        imgs: [
          img0
        ],
      langArgs:{type:'login'},
      publicKey:'',  
      isShow: false, // 是否显示拼图验证码
      vCodeFailCount: 0, // 校验失败次数
      isAuthenticated: false, // 拼图验证码是否校验成功
      editUser:true,
        msg: '',
        text: '向右滑动->',
        // 精确度小，可允许的误差范围小；为1时，则表示滑块要与凹槽完全重叠，才能验证成功。默认值为5
        accuracy: 1,
        dialogFormVisible: false,
        loginForm: {
          username: '',
          password: '',
          code: '',
          usergestrue: undefined
        },
        logintemp: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [{ required: true, trigger: 'change', message: '请输入账号' }],
          password: [{ required: true, trigger: 'change', message: '请输入密码' }]
        },
        passwordType: 'password',
        capsTooltip: false,
        gestruereset: undefined,
        gestureData: [],
        orignalval: undefined,
        identifyCodes: '1234567890',
        identifyCode: '',
        loading: false,
        showDialog: false,
        redirect: undefined,
        userName: '',
        userPassWorld: '',
        userInfo: JSON.parse(localStorage.getItem('userInfo')) || [],
        roleid: {},
        rolemenu: {},
        pwduserinfo:{},
        E_COMM_RETURN: {
          TYPE: undefined,
          MESSAGE: undefined,
          ACCESS_TOKEN: undefined,
          REFRESH_TOKEN: undefined,
          EXPIRES: undefined
        },
        otherQuery: {}
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          const query = route.query
          if (query) {
            this.redirect = query.redirect
            this.otherQuery = this.getOtherQuery(query)
          }
        },
        immediate: true
      },
      // 按绘制的顺序输出的数组
      gestureData(val) {
        let currentval = [] // 当前手势数组
        currentval = JSON.parse(JSON.stringify(val))
        this.loginForm.usergestrue = JSON.stringify(currentval)
        if (JSON.stringify(currentval) !== this.orignalval) {
          this.$message({
            message: '手势密码不正确',
            type: 'warning'
          })
          this.$refs.gestrueunlock.onUpdateerrorHandler()

          return
        }
        this.handleGestrueLogin()
        this.showDialog = false
      }
    },
    created() {
      // window.addEventListener('storage', this.afterQRScan)
      const _data = {url:'/encrypt-key',params:{}}
      this.$store.dispatch('fmsCommon/actionAuthPost',_data)
      .then(data => {
          this.publicKey = data
       }).catch(err => {
          console.error(err)
       })
    },
    mounted() {
      if (this.loginForm.username === '') {
        this.$refs.username.focus()
      } else if (this.loginForm.password === '') {
        this.$refs.password.focus()
      }
      // 初始化验证码
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    destroyed() {
      // window.removeEventListener('storage', this.afterQRScan)
    },
    methods: {
      save(da){
        this.$refs.editUser.submitForm(da);
      },
      getAppNAme(){
          return  window.global_parameters.appName
      },
      checkCapslock(e) {
        const { key } = e
        this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      showGestrueDialog() {
        if (this.loginForm.username === '') {
          this.$message({
            message: '请输入账号',
            type: 'warning'
          })
          return
        }
        getUserByCode(this.loginForm).then((response) => {
          if (response.data.E_COMM_RETURN.TYPE === 'S') {
            this.orignalval = response.data.E_COMM_RETURN.MESSAGE
            this.showDialog = true
          } else {
            this.$message({
              message: response.data.E_COMM_RETURN.MESSAGE,
              type: 'warning'
            })
          }
        })
        this.$refs.gestrueunlock.onReset()
      },
      async handleLogin() {
        this.$refs.loginForm.validate(async(valid) => {
          if (valid) {
            this.loading = true
            // if (this.loginForm.code.toLowerCase() !== this.identifyCode.toLowerCase()) {
            //   this.$message.warning('请填写正确验证码')
            //   this.loading = false
            //   this.refreshCode()
            //   return
            // }
            // this.isShow = true;
            await this.getUsers() // 获取用户信息
          }
        })
      },
      recallActionLogin(pwd,username){
        this.logintemp.password = pwd
        this.dialogFormVisible = true
        if(!this.logintemp.username){
          this.dialogFormVisible = false
          this.loginForm.username = username
          return 
        }
        this.actionLogin()
      },
      getPublicKey(){
           // window.addEventListener('storage', this.afterQRScan)
        const _data = {url:'/encrypt-key',params:{}}
        this.$store.dispatch('fmsCommon/actionAuthPost',_data)
        .then(data => {
            this.publicKey = data
            this.actionLogin()
        }).catch(err => {
            console.error(err)
        })
      },
      async actionLogin(){
        var _this = this
        let encrypt = new JSEncrypt()
        encrypt.setPublicKey(this.publicKey)
        this.logintemp.password = encrypt.encrypt(this.logintemp.password)
    // 登录获取token接口      
        await getUser(this.logintemp).then(response => {
          if (response.data.code === 200) {

            //判断用户是否需要修改密码
            const { data } = response.data
            let cpwd = data.userInfo.changePassword||'Y'
            this.pwduserinfo = data.userInfo
            if(cpwd==='Y'||cpwd===''){
              //const refreshtoken = data.token
             // setToken(refreshtoken)
             // _this.$store.dispatch('user/setToken', refreshtoken)
              this.dialogFormVisible = true
              this.loading = false
              if(response.data.message && response.data.message!==''){
                this.$message({
                message: '登录失败|Login failed: ' + response.data.message,
                type: 'warning'
                })
               
              }
              return
            }

            _this.$store.dispatch('user/login', response.data).then(res => {
                const { data } = response.data
                // 保存用户信息
                sessionStorage.setItem('userInfo', this.loginForm.username)
                sessionStorage.setItem('userName',data.userInfo.realName)
                sessionStorage.setItem("lastClickTime", new Date().getTime());
                this.$store.commit('app/USER_INFO',data);
                // 保存刷新令牌
                const refreshtoken = data.token
                setSToken(this.loginForm.username, refreshtoken)
                // 保存访问令牌有效期
                // sessionStorage.setItem('expires', '0') //response.data.E_COMM_RETURN.EXPIRES
                // 保存访问令牌
                const accesstoken = data.token

                setLToken(accesstoken)
                // Cookies.set('AccessToken', accesstoken)
                
                //获取用户登录的sessionKey
                let userDto = {
                  userName:_this.loginForm.username
                }
                const _data = {url:'/user/is-login',params:{data:userDto}}
                _this.$store.dispatch('fmsCommon/actionAuthPost',_data)
                .then(data => {
                  sessionStorage.setItem('login_session_key',data.sessionKey)
                  this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                }).catch(err => {
                    console.error(err)
                })

                //获取用户详细信息
                const _mydata = {url:'/user/fc-userinfo',params:{data: _this.loginForm.username}}
                _this.$store.dispatch('fmsCommon/actionAuthPost',_mydata)
                .then(data => {
                   sessionStorage.setItem("sess_cuur_userinfo",JSON.stringify(data))
                }).catch(err => {
                    console.error(err)
                })


                // Object.assign(resuser, response)
              })

        
          }else{
          this.loading = false
          let msg = response.data.message
          if(!msg){
            msg = response.data.data
          }
          this.$message({
                message: '登录失败|Login failed: ' + msg,
                type: 'warning'
              })
          }

          //  else {
          //   Object.assign(resuser, response)
          // }
        }).catch(error => {
          this.loading = false
          this.$message({
                message: 'token接口: ' + error,
                type: 'warning'
              })
        }).finally(()=>{
            this.loading = false
        })
      },
      async getUsers() {
        var _this = this
        // const resuser = {}
        // let encrypt = setEncrypt(_this.loginForm.password) //加密密码
        this.logintemp.username = _this.loginForm.username
        this.logintemp.password = _this.loginForm.password
        if(this.logintemp.password==null ||this.logintemp.password==''){
            this.$message({
                message: '登录失败 密码不能为空|Login failed. The password cannot be empty',
                type: 'warning'
              })
        }

        if(this.publicKey == undefined||this.publicKey==null||this.publicKey==''){
          //  this.publicKey="MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCTP1RhbTEcNcaBghweS2mfiXzV2IbqFBMC1FaKu059NTMLVjKhcHei5gVMhsOS2zWP6C076QLF5db9ollEjySmYtr7U0FL8H+ybNV7IEm+JL0rvMXQ6kq0zGdPmvxgtVnCFzhtKPrHCe6O2Q3eyuBkOTdjd92K4Lo0lpMVHvM6DwIDAQAB"
           this.getPublicKey()
        }else{
          this.actionLogin()
        }
        // return Promise.resolve(resuser)
      },

      async getSessions(response) {
        // 获取用户权限
        let role_id
        let relation = {}
        this.$set(this.roleid, 'relationid', 1)
        this.$set(this.roleid, 'relationid2', parseInt(response.data.E_COMM_RETURN.MESSAGE))
        await getRelationByID(this.roleid).then(response => {
          if (response == null) {
            role_id = -1
          } else {
            relation = response.data
            role_id = relation.RELATION_ID1
            // 存储权限ID
            sessionStorage.setItem('roleid', JSON.stringify(relation.RELATION_ID1))
          }
        })

        return role_id
      },
      async getRolebutton(role_id) {
        this.$set(this.rolemenu, 'ROLE_ID', role_id)
        const itemoption = []
        let perms = []
        await getRoleButtonListByRoleMenu(this.rolemenu).then(response => {
          // 循环遍历将对象转成数组
          for (const i in response.data) {
            itemoption.push(response.data[i])
          }
          perms = itemoption.map((item, i) => {
            return item.ROLE_BUTTON_CODE
          })

          // 保存按钮权限到store、sessionStorage
          this.$store.dispatch('btnrole/SET_PERMISSION', perms)
        })
      },
      // 手势密码登录
      handleGestrueLogin() {
        if (this.loginForm.username === '') {
          this.$message({
            message: '请输入用户名|Please enter your username',
            type: 'warning'
          })
          return
        }
        this.loading = true
        getUserByGestrue(this.loginForm).then((response) => {
          if (response.data.E_COMM_RETURN.TYPE === 'S') {
            this.$store.dispatch('user/login', this.loginForm).then(() => {
                this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })

            var obj = {
              userName: this.loginForm.username
            }
            // 保存用户信息
            this.userInfo.push(obj)
            sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo))

            // 获取用户权限
            let relation = {}
            this.$set(this.roleid, 'relationid', 1)
            this.$set(this.roleid, 'relationid2', parseInt(response.data.E_COMM_RETURN.MESSAGE))
            getRelationByID(this.roleid).then(response => {
              relation = response.data
              this.getRolebutton(relation.RELATION_ID1)
            })
            // 存储权限ID
            sessionStorage.setItem('roleid', JSON.stringify(response.data.E_COMM_RETURN.MESSAGE))
          } else {
            this.loading = false
            this.$message({
              message: response.data.E_COMM_RETURN.MESSAGE,
              type: 'warning'
            })
          }
        })
      },
      getOtherQuery(query) {
        return Object.keys(query).reduce((acc, cur) => {
          if (cur !== 'redirect') {
            acc[cur] = query[cur]
          }
          return acc
        }, {})
      },
      // 重置验证码
      refreshCode() {
        this.identifyCode = ''
        this.makeCode(this.identifyCodes, 4)
      },
      makeCode(o, l) {
        for (let i = 0; i < l; i++) {
          this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
        }
      },
      randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
      },
      /**
     * 5: 拼图验证码 ==> 点击遮罩层的回调
     */
    closeCallback() {
      setTimeout(() => {
        this.vCodeFailCount = 0
        this.isShow = false
        this.loading = false
      }, 300)
    },

    /**
     * 6: 拼图验证码 ==> 验证成功的监听器
     */
    async vCodeSuccessListener() {
      setTimeout(() => {
        this.isShow = false
        this.isAuthenticated = true
      }, 300)
      const resuser = await this.getUsers() // 获取用户信息
            if (resuser.data.status === 'SUCCESS') {
              const role_id = await this.getSessions(resuser) // 获取session
              if (role_id !== -1) {
                // await this.getRolebutton(role_id) //获取按钮权限
                this.$router.push({ path: this.redirect || '/', query: this.otherQuery }) // 路由跳转
              } else {
                this.loading = false
                this.$message({
                  message: '未分配角色，请联系管理员',
                  type: 'warning'
                })
              }
            } else {
              this.loading = false
              this.$message({
                message: resuser.data,
                type: 'warning'
              })
            }
    },

    /**
     * 7: 拼图验证码 ==> 验证失败的监听器
     */
    vCodeFailListener() {
      ++this.vCodeFailCount
      if (this.vCodeFailCount > 3) {
        this.isShow = false
        this.vCodeFailCount = 0
        alert('验证码失败次数过多, 请重试')
        this.loading = false
      }
    }
    }
  }
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    // .login-container .el-input input {
    //   color: $cursor;
    // }
  }

  /* reset element-ui css */
  .login-form {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }


    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
    
  }
  .editPwd{
    input{color: #000}
  }
</style>

<style lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    /* min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden; */
    width: 100%;
    height: 100vh;
    background-image: url("../../assets/login_images/chr.jpg");
    background-size: cover;
    background-position: center;
    position: relative;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }

      .set-language {
        color: #fff;
        position: absolute;
        top: -7px;
        font-size: 18px;
        right: -14px;
        cursor: pointer;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }
</style>

<style>
  .el-dialog.customStyle {
    width: 60%;
    height: 80%;
  }
</style>
