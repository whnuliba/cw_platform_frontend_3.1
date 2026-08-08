/* * @CreatAuthor: 宋丹峰 * @UpdateAuthor: (...) * @Description: 顶部导航栏 */
<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <!-- <div class="right-menu-item hover-effect" style="width: 60px;">
         <span>工厂</span>
      </div> -->
      <div class="fc-class right-menu-item hover-effect" style="width: 180px;">
        <el-select
          v-model="factoryNo"
          placeholder="工厂"
          width="50px"
          @change="updataFc"
          size="mini"
          class="right-menu-item hover-effect"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <template v-if="device !== 'mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->
        <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->
        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->
        <!--增加工厂选择器-->
        <el-tooltip
          :content="$t('navbar.size')"
          effect="dark"
          placement="bottom"
        >
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

        <lang-select class="right-menu-item hover-effect" />
      </template>

      <template v-if="device !== 'mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->
        <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->
        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->
        <!--增加工厂选择器-->
        <el-tooltip
          :content="$t('common.changeSys')"
          effect="dark"
          placement="bottom"
        >
           <HomeSelect class="right-menu-item hover-effect"/>
        </el-tooltip>

      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <el-badge :hidden="workTaskNum == 0 && waitNum === 0"
           :value="`${waitNum?waitNum:''}${waitNum && workTaskNum ? ' | ' : ''}${workTaskNum?workTaskNum:''}`" class="badgeitem"> 
            <div class="user-name">{{ userInfoName }}</div>
          </el-badge>
          <!-- <img :src="require('@/assets/login_images/'+avatar+'?imageView2/1/w/80/h/80')" class="user-avatar"> -->
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{ $t("navbar.dashboard") }}
            </el-dropdown-item>
          </router-link>
          <router-link to="/bpm/approval/todoList">
            <el-dropdown-item>
              <span class="wait-task" :style="{color: waitTaskColor}">
                {{ `${$t('navbar.backlog')}${waitNum ? '('+waitNum+')' : ''}`}}
              </span>
            </el-dropdown-item>
          </router-link>
          <router-link :to="{ name:'work_order_task', params: {isNavbarJump: true} }">
            <el-dropdown-item>
              <span class="work-task" :style="{color: fontColor}">{{ `${$t('navbar.task')}${workTaskNum ? '('+workTaskNum+')' : ''}` }}</span>
            </el-dropdown-item>
          </router-link>
          <router-link to="/fms/basic-data/edit-user">
            <el-dropdown-item>
              {{ $t("navbar.editPwd") }}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">{{ $t("navbar.logOut") }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import ErrorLog from "@/components/ErrorLog";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import HomeSelect from "@/components/HomeSelect";
import LangSelect from "@/components/LangSelect";
import Search from "@/components/HeaderSearch";
import common from "@/utils/common";
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    HomeSelect,
    Search,
  },
  data() {
    return {
      factoryNo: '',
      options: [],
      userInfoName: "",
      waitNum: 0,
      waitTaskColor:'#606266',
      // routerJumpParams: {
      //       pageSize:15,
      //       current:1,
      //       requestData:{
      //         tableName:"",orderBy:"",columns:["PROJECT_ID","PROJECT_CODE","TASK_TYPE","DEMAND_CODE","PROJECT_ID","CREATE_TIME","CREATE_USER","PLAN_START_TIME","PLAN_END_TIME","REAL_START_TIME","COMPLETE_TIME","TASK_NO","TASK_STATE","PERMISSION","RAISE_USER","APPROVAL_USER","COMPLETE_USER","COMPLETE_USER_ID","SOURCE_TYPE","SURE_USER","DEMAND_LEVEL","STYLE_COLOR","EXTEND_ATTR","ATTACHMENT1","DEMAND_CODE","ATTACHMENT2","ATTACHMENT3","DESCRIPTION","WORK_CONTENT","REMARK","FILE_NAME"],
      //         sqlWhere:[
      //             {
      //               column: 'COMPLETE_USER',
      //               condition: "=",
      //               value: sessionStorage.getItem("userName"),
      //             },
      //             {
      //               column: "TASK_STATE",
      //               condition: "=",
      //               value: "NON_ACTIVE",
      //             },
      //           ]
      //       }
            
          // }
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device", "name",'workTaskNum','fontColor']),
  },
  created() {
    this.userInfoName = sessionStorage.getItem("userName")
      ? sessionStorage.getItem("userName")
      : "";
      this.getFcUserInfo()
      //this.getWaitApproveItem()
      
  },
  mounted() {
    //this.workTNum();
  },
  methods: {
    ///...mapActions({ workTNum: 'app/getWorkTaskNum' }),
    getWaitApproveItem(){
      const username = sessionStorage.getItem("userInfo");
      const _data = {url:'/wf-work-approve/query-wait',params: { data: username }}
      this.$store.dispatch('fmsCommon/actionTaskPost',_data)
      .then(data => {
        this.waitNum = data;
        if (data) this.waitTaskColor = "#f00";
        else this.waitTaskColor = "#606266"; 
      }).catch(err => {
        console.error(err)
      })

    },
    getFcUserInfo() {
      const username = sessionStorage.getItem("userInfo");
      const _data = { url: "/user/fc-userinfo", params: { data: username } };
      this.$store
        .dispatch("fmsCommon/actionAuthPost", _data)
        .then((data) => {
           if(data.factoryInfo){
            this.options = []
            data.factoryInfo.forEach(item=>{
              if(this.options.some(el=>{
                 return el.value === item.factoryNo
              })){
                return
              }
              this.options.push({value:item.factoryNo,label:`${item.factoryName}`})
            })
            this.factoryNo = data.factoryInfo[0].factoryNo
            common.currentFc = this.factoryNo 
           }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    updataFc(val){
      common.currentFc = val
      this.$bus.$emit('changerkey',Math.random())
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      sessionStorage.removeItem("login_session_key");
      //this.$router.push(`/login`)
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.badgeitem{
::v-deep .el-badge__content.is-fixed {
  top:-5px
}
}
// .el-icon-caret-bottom:before {
//     content: "";
// }
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .user-name {
          font-size: 14px;
          text-align: center;
          line-height: 14px;
          padding-right: 5px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          font-size: 12px;
        }
      }
     
    }

  }
}
</style>
<style lang="scss" >
 .el-dropdown-menu__item:not(.is-disabled) {
    span{
          &:hover{
            color: #41ba9c !important;
          } 
        }
      }
.fc-class{

    .el-input__inner{
      color: #42B983;
      border: 0;
      font-weight: bold;
      font-size: 18px;
    }
  }
</style>
