<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <div class="menu-search-div">
      <el-input
        :placeholder='$t("navbar.search")'
        @keyup.enter="menuChange(searchValue)"
        @change="menuChange"
        @blur="menuChange(searchValue)"
        v-model="searchValue">
        <i slot="prefix" class="el-input__icon el-icon-search" @click="menuChange(searchValue)"></i>
      </el-input>
    </div>

    <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        >
        <!--   @select="selectMenu" -->
          <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
        </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  data(){
    return {
       searchValue:undefined,
    }

  },
  mounted() {},
  methods:
  {
    menuChange(value){
      const code= localStorage.getItem("current_application_code");
      let menu = this.$store.dispatch("permission/sysChangeBySearch",{appCode:code,routeName:value});
      menu.then((data) => {
      });
    },
    // selectMenu(index, indexPath) {
    //     if(indexPath[0] === '/#/#'){ // 要实现路由跳转新页签设置菜单的时候要将菜单编码写成#号，这样indexPath会拼接成'#/#'
    //             let routeData = this.$router.resolve({
    //                //去掉开头防使用index做router的#符
    //                path: index.replace("#", ""),
    //                // query:{id: 110}
    //             });
    //             // console.log(routeData)
    //             window.open(routeData.href, "_blank");
    //             // this.$router.go(0)
    //     }
    // },
  }
}
</script>


<style>
.menu-search-div .el-input__inner{
  color: #fff;
  background-color: none !important;
  background: none !important;

}
.menu-search-div .el-input__prefix{
 cursor: pointer;
}
</style>

