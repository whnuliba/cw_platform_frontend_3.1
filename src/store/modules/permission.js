import { asyncRoutes, constantRoutes } from "@/router";
import Vue from 'vue'

import {
  getRoleMenuListByCodeReturn,
  getRoleZeroMenuList,
  getRoleGroupMenuListByCodeReturn,
  getButton,
  getRoleMenuListByCodeAndRouteReturn,
} from "@/api/role_menu";
import Layout from "@/layout";
import MutiLeveLayout from "@/mutiLeveLayout";
import i18n from "@/lang";
import { Message } from "element-ui";
import Cookies from 'js-cookie'
import common from '@/utils/common';

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role));
  } else {
    return true;
  }
}

function commonI18n(item,_key) {

  let lu =Cookies.get("language") 
  let mlable = {title:item.title,field:"route."+item.componentName,en_title:item.enTitle}

  if(!(common.metaI18N && common.metaI18N["zh"] &&  common.metaI18N["zh"]["route"][item.componentName]))
    {  
      if(!common.metaI18N.hasOwnProperty("zh"))
        {
          common.metaI18N['zh'] = {}
        }
        if(!common.metaI18N["zh"].hasOwnProperty("route")){
           common.metaI18N["zh"]['route'] = {}
        }
      common.metaI18N["zh"]["route"][item.componentName] = item.title
    }
  if(!(common.metaI18N && common.metaI18N["en"] &&  common.metaI18N["en"]["route"][item.componentName]))
     {  
      if(!common.metaI18N.hasOwnProperty("en"))
        {
          common.metaI18N['en'] = {}
        }
        if(!common.metaI18N["en"].hasOwnProperty("route")){
           common.metaI18N["en"]['route'] = {}
        }
      common.metaI18N["en"]["route"][item.componentName] = item.enTitle
    }
  if(!(common.metaI18N && common.metaI18N["de"] &&  common.metaI18N["de"]["route"][item.componentName]))  //默认udf5是德语
       {
        if(!common.metaI18N.hasOwnProperty("de"))
        {
          common.metaI18N['de'] = {}
        }
        if(!common.metaI18N["de"].hasOwnProperty("route")){
           common.metaI18N["de"]['route'] = {}
        }
        common.metaI18N["de"]["route"][item.componentName] = item.udf5
   }
  //console.log(common.metaI18N)
  return item.componentName//common.getI18N(mlable,lu,_key)
  // let lu = i18n.t("common.common_data_transfer");
  // if (lu == "zh") return item.title;
  // if (lu == "en") return item.enTitle || item.title;
  //return item.title;
}

function modules(path){
  const modules = []
  const files = require.context('@/views/cw', false, /\CwPageView\.vue$/)
  files.keys().forEach((key) => {
  modules[key.replace(/(\.\/|\.vue)/g, '')] = files(key).default
  })
  return modules
}
function report_modules(path,vuefile){
  const modules = []
  const files = require.context(`@/views/fms/external`, false, /common-module\.vue$/)
  files.keys().forEach((key) => {
  modules[key.replace(/(\.\/|\.vue)/g, '')] = files(key).default
  })
  return modules
}
// function loadComponent(path) {
//   import('./MyComponent.vue').then(module => {
//      this.dynamicComponent = module.default;
//   }).catch(error => {
//      console.error('组件加载失败:', error);
//   });
//   }
/**
 * 后台查询的菜单数据拼接成路由格式的数据
 * @param routes
 * @param data
 * @param is_children
 */
export function generaMenu1(routes, data, is_children = false, boot = true) {
  data.forEach((item) => {
    const menu = {
      path: item.path,
      component:
        item.component === "#" ||
        item.component === null ||
        item.component.trim() == ""
          ? Layout
          : (resolve) => require([`@/views${item.component}`], resolve),
      meta: { title: item.title, icon: item.textIcon },
      name: item.name,
    };
    // if(item.children){
    //   //menu = Object.assign(menu,{children:item.children})
    //   menu['children'] = item.children
    //   menu['name'] = item.name
    // }
    // else
    // {
    //   console.log(1)
    //   if(boot){
    //     const subMenu = {
    //       component :menu.component,
    //       path:item.path,
    //       name:item.name,
    //       meta: { title: item.title, icon: item.textIcon }
    //     }
    //     menu.path="/"
    //     menu.component=Layout
    //     menu.children = subMenu

    //   }
    // }
    // console.log(item.children)
    // if(!item.children ){
    //   const subMenu = {
    //     component :menu.component,
    //     path:menu.path,
    //     meta: { title: item.title, icon: item.textIcon }
    //   }
    //   menu.path="/"
    //   menu.component=Layout
    //   menu.children = subMenu
    // }
    if (is_children === false) {
      menu.alwaysShow =
        Array.isArray(item.children) && item.children.length === 0 ? 0 : 1;
      menu.redirect = item.redirect;
      menu.children = [];
    }
    if (item.children && is_children === false) {
      generaMenu(menu.children, item.children, true, false);
    }
    routes.push(menu);
  });
}

//实现一个三级菜单转二级菜单的功能
export function muiltLevelToTwoLevel(globalRoutes,routes, data, boot, parentPath) {
  data.forEach((item) => {
    //let _loyout = item.href==='_blank'?MutiLeveLayout:Layout
    let _loyout = Layout
    let menu = {};
    // console.log(222,item.name,item.component,item)
    if(item.component===null ||item.component ===undefined || item.component ==='')
    return;

    let cp = item.path;
    if(cp===null ||cp ===undefined || cp ==='')
    return;
    let cpName = undefined;
    if (cp && cp != null && cp.indexOf("\\") != -1) cp = cp.replace("\\", "/");

    if (cp) {
      let apArr = cp.split("/");
      if (apArr.length) cpName = apArr[apArr.length - 1];
    }

    let component //= 
      // item.component === "#" ||
      // item.component === null ||
      // item.component===undefined ||
      // item.component.trim() == ""
      //   ? _loyout
      //   :(resolve) => require([`@/views${item.component}`], resolve);

      //begin 处理报表主键的路由
      ///fms/external/common-module
      //end
      if(item.component.indexOf("CwPageView")>-1) {
          let module =modules()["CwPageView"]
          module.name= cpName
          module.key = cpName
          //Vue.component(cpName, module)
          component ={...module}
      }else if(item.component=='/fms/external/common-module'){
        let module = report_modules()["common-module"]  
        module.name= cpName
        module.key = cpName
        //Vue.component(cpName, module)
        component ={...module}
      }
      else
      {
      component =
      item.component === "#" ||
      item.component === null ||
      item.component===undefined ||
      item.component.trim() == ""
        ? _loyout
        :(resolve) => require([`@/views${item.component}`], resolve);
      }
     

    if (!item.udf1) item.udf1 == "false";
    let _cache = item.udf1 == "false" ? false : true;
    if (boot) {
      if (
        item.children &&
        Array.isArray(item.children) &&
        item.children.length > 0
      ) {
        Object.assign(menu, {
          route_data:item,
          component: _loyout,
          path: item.path, //+"/"+new Date().getTime(),
          alwaysShow: false,
          meta: {
            title: commonI18n(item),
            icon: item.textIcon,
            noCache: _cache,
          },
          children: [],
          name: cpName || item.name,
        });
        muiltLevelToTwoLevel(globalRoutes,menu.children, item.children, false);
      } else {
        const subMenu = {
          route_data:item,
          path: "", //item.path,
          component: component,
          meta: {
            title: commonI18n(item),
            icon: item.textIcon,
            origin: item,
            noCache: _cache,
          },
          name: cpName || item.name,
        };
        Object.assign(menu, {
          route_data:item,
          component: item.href==='_blank' ? MutiLeveLayout : _loyout,
          path: item.path, //item.path+"/"+new Date().getTime(),
          children: [subMenu],
        });
      }
    } else {
      if (
        item.children &&
        Array.isArray(item.children) &&
        item.children.length > 0
      ) {
        //let c = () => import("@/mutiLeveLayout/index").then((m) => m.default);
        Object.assign(menu, {
          route_data:item,
          component: () => import("@/mutiLeveLayout/index"),
          path: item.path,
          alwaysShow: false,
          meta: {
            title: commonI18n(item),
            icon: item.textIcon,
            noCache: _cache,
          }, //item.textIcon
          children: [],
          name: cpName || item.name,
        });
        muiltLevelToTwoLevel(globalRoutes,routes, item.children, false);
      } else {
        if(item.href==='_blank'){
          const subMenu = {
            route_data:item,
            path: "", //item.path,
            component: component,
            meta: {
              title: commonI18n(item),
              icon: item.textIcon,
              origin: item,
              noCache: _cache,
            },
            name: cpName || item.name,
          };
          Object.assign(menu, {
            route_data:item,
            component: MutiLeveLayout,
            path: item.path, //item.path+"/"+new Date().getTime(),
            children: [subMenu],
          });
          globalRoutes.push(menu)
          return
        }
        Object.assign(menu, {
          route_data:item,
          path: item.path,
          component: component,
          meta: {
            title: commonI18n(item),
            icon: item.textIcon,
            origin: item,
            noCache: _cache,
          },
          name: cpName || item.name,
        });
      }
    }
    routes.push(menu);
  });
}

export function generaMenuTree(routes, data, boot = true) {
  data.forEach((item) => {
    let menu = {};
    if(item.component===null ||item.component ===undefined || item.component ==='')
    return;
    let component =
      item.component === "#" ||
      item.component === null ||
      item.component.trim() == ""
        ? Layout
        : (resolve) => require([`@/views${item.component}`], resolve);
    let cp = item.path;
    if(cp===null ||cp ===undefined || cp ==='')
    return;
    let cpName = undefined;
    if (cp && cp != null && cp.indexOf("\\") != -1) cp = cp.replace("\\", "/");

    if (cp) {
      let apArr = cp.split("/");
      if (apArr.length) cpName = apArr[apArr.length - 1];
    }
    if (!item.udf1) item.udf1 == "false";
    let _cache = item.udf1 == "false" ? false : true;

    if (boot) {
      if (
        item.children &&
        Array.isArray(item.children) &&
        item.children.length > 0
      ) {
        Object.assign(menu, {
          //component:Layout,
          path: item.path, //+"/"+new Date().getTime(),
          alwaysShow: false,
          meta: {
            title: commonI18n(item),
            icon: item.textIcon,
            noCache: _cache,
          },
          children: [],
          name: cpName || item.name,
        });
        generaMenu(menu.children, item.children, false);
      } else {
        const subMenu = {
          path: "", //item.path,
          //component: component,
          meta: {
            title: commonI18n(item),
            icon: item.textIcon,
            origin: item,
            noCache: _cache,
          },
          name: cpName || item.name,
        };
        Object.assign(menu, {
          //component:Layout,
          path: item.path, //item.path+"/"+new Date().getTime(),
          children: [subMenu],
        });
      }
    } else {
      if (
        item.children &&
        Array.isArray(item.children) &&
        item.children.length > 0
      ) {
        Object.assign(menu, {
          //component:()=>import("@/mutiLeveLayout/index"),
          path: item.path,
          alwaysShow: false,
          meta: {
            title: commonI18n(item),
            icon: item.textIcon,
            noCache: _cache,
          }, //item.textIcon
          children: [],
          name: cpName || item.name,
        });
        generaMenu(menu.children, item.children, false);
      } else {
        Object.assign(menu, {
          path: item.path,
          //component: component,
          meta: {
            title: commonI18n(item),
            icon: item.textIcon,
            origin: item,
            noCache: _cache,
          },
          name: cpName || item.name,
        });
      }
    }
    routes.push(menu);
  });
}

/**
 * 将指定组件设置自定义名称
 *
 * @param {String} name 组件自定义名称
 * @param {Component | Promise<Component>} component
 * @return {Component}
 */
export function createCustomComponent(name, component) {
  return {
    name,
    data() {
      return { component: null };
    },
    async created() {
      if (component instanceof Promise) {
        try {
          const module = await component;
          this.component = module?.default;
        } catch (error) {
          console.error(`can not resolve component ${name}, error:`, error);
        }

        return;
      }
      this.component = component;
    },
    render(h) {
      return this.component ? h(this.component) : null;
    },
  };
}

export function generaMenu(routes, data, boot = true) {
  data.forEach((item) => {
    let _loyout  = Layout
    let _alwaysShow =  item.udf2==='N'?false:true
    //let _loyout = Layout
    let menu = {};
    let component =
      item.component === "#" ||
      item.component === null ||
      item.component.trim() == ""
        ? _loyout
        : (resolve) => require([`@/views${item.component}`], resolve);
    let cp = item.path;
    let cpName = undefined;
    if (cp && cp != null && cp.indexOf("\\") != -1) cp = cp.replace("\\", "/");

    if (cp) {
      let apArr = cp.split("/");
      if (apArr.length) cpName = apArr[apArr.length - 1];
    }
    if (!item.udf1) item.udf1 == "false";
    let _cache = item.udf1 == "false" ? false : true;
    if (boot) {
      if (
        item.children &&
        Array.isArray(item.children) &&
        item.children.length > 0
      ) {
        Object.assign(menu, {
          component: _loyout,
          route_data:item,
          path: item.path, //+"/"+new Date().getTime(),
          alwaysShow: _alwaysShow,
          meta: {
            title: commonI18n(item),
            icon: item.textIcon,
            noCache: _cache,
          },
          children: [],
          name: cpName || item.name,
        });
        generaMenu(menu.children, item.children, false);
      } else {
        const subMenu = {
          path: "", //item.path,
          route_data:item,
          alwaysShow: _alwaysShow,
          component: component,
          meta: {
            title: commonI18n(item),
            icon: item.textIcon,
            origin: item,
            noCache: _cache,
          },
          name: cpName || item.name,
        };
        Object.assign(menu, {
          component: _loyout,
          alwaysShow: _alwaysShow,
          route_data:item,
          path: item.path, //item.path+"/"+new Date().getTime(),
          children: [subMenu],
        });
      }
    } else {
      if (
        item.children &&
        Array.isArray(item.children) &&
        item.children.length > 0
      ) {
        let c = () => import("@/mutiLeveLayout/index").then((m) => m.default);
        Object.assign(menu, {
          component: () => import("@/mutiLeveLayout/index"),
          path: item.path,
          alwaysShow: _alwaysShow,
          route_data:item,
          meta: {
            title: commonI18n(item),
            icon: item.textIcon,
            noCache: _cache,
          }, //item.textIcon
          children: [],
          name: cpName || item.name,
        });
        generaMenu(menu.children, item.children, false);
      } else {
        Object.assign(menu, {
          path: item.path,
          route_data:item,
          alwaysShow: _alwaysShow,
          component: component,
          meta: {
            title: commonI18n(item),
            icon: item.textIcon,
            origin: item,
            noCache: _cache,
          },
          name: cpName || item.name,
        });
      }
    }
    routes.push(menu);
  });
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = [];

  routes.forEach((route) => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });

  return res;
}

const state = {
  routes: [],
  addRoutes: [],
  roleid: { role_code: undefined },
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  },
};

const actions = {
  generateRoutes({ commit }) {
    return new Promise((resolve) => {
      const loadMenuData = [];
      getRoleZeroMenuList()
        .then((res) => {
          if (res.data.code === 200) {
            const { data } = res.data;
            // 根据系统编码查找菜单并返回
            getRoleMenuListByCodeReturn({ data: data[1] })
              .then((response) => {
                const { data } = response.data;
                Object.assign(loadMenuData, data);
                const tempAsyncRoutes = Object.assign([], asyncRoutes);
                generaMenu(tempAsyncRoutes, loadMenuData);
                const accessedRoutes = tempAsyncRoutes;
                const tempRouteAsyncRoutes = Object.assign([], asyncRoutes);
                muiltLevelToTwoLevel(
                  tempRouteAsyncRoutes,
                  tempRouteAsyncRoutes,
                  loadMenuData,
                  true,
                  ""
                );
                const _accessedRoutes = tempRouteAsyncRoutes;
                commit("SET_ROUTES", accessedRoutes);
                resolve(_accessedRoutes);
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  getMenuGroup({ commit }) {
    return new Promise((resolve) => {
      getRoleZeroMenuList()
        .then((res) => {
          if (res.data.code === 200) {
            localStorage.setItem("group_menus", res.data.data);
            resolve(res.data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  get_button({ commit }, code) {
    return new Promise((resolve) => {
      const loadMenuData = [];
      // 根据系统编码查找菜单并返回
      getButton({ data: code })
        .then((response) => {
          if (response.data.code == 200) {
            let btns = response.data.data.map((item) => {
              return item.menuCode;
            });
            sessionStorage.setItem("sys_buttons_code", JSON.stringify(btns));
            resolve(btns);
          } else {
            sessionStorage.removeItem("sys_buttons_code");
            resolve([]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  },
  generateAllRoutes({ commit }, groups) {
    return new Promise((resolve) => {
      const loadMenuData = [];
      // 根据系统编码查找菜单并返回
      getRoleGroupMenuListByCodeReturn({ data: groups })
        .then((response) => {
          const { data } = response.data;
          Object.assign(loadMenuData, data);
          const tempAsyncRoutes = Object.assign([], asyncRoutes);
          muiltLevelToTwoLevel(tempAsyncRoutes,tempAsyncRoutes, loadMenuData, true, "");
          // generaMenu(tempAsyncRoutes, loadMenuData)
          const accessedRoutes = tempAsyncRoutes;
          //commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  },
  sysChange({ commit }, sysCode) {
    return new Promise((resolve) => {
      const loadMenuData = [];
      // 根据系统编码查找菜单并返回
      getRoleMenuListByCodeReturn({ data: sysCode })
        .then((response) => {
          const { data } = response.data;
          Object.assign(loadMenuData, data);
          const tempAsyncRoutes = Object.assign([], asyncRoutes);
          generaMenu(tempAsyncRoutes, loadMenuData);
          const accessedRoutes = tempAsyncRoutes;
          commit("SET_ROUTES", accessedRoutes);
          resolve(accessedRoutes);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  },
  sysChangeBySearch({ commit }, menuName) {
    return new Promise((resolve) => {
      const loadMenuData = [];
      // 根据系统编码查找菜单并返回
      getRoleMenuListByCodeAndRouteReturn({ data: menuName })
        .then((response) => {
          const { data, code } = response.data;
          if (code != 200) {
            Message({
              message: data || "没有找到搜索的菜单",
              type: "error",
              duration: 3 * 1000,
            });
            return;
          }
          if (data && data.length == 0) {
            Message({
              message: "没有找到搜索的菜单",
              type: "error",
              duration: 3 * 1000,
            });
          }
          Object.assign(loadMenuData, data);
          const tempAsyncRoutes = Object.assign([], asyncRoutes);
          generaMenu(tempAsyncRoutes, loadMenuData);
          const accessedRoutes = tempAsyncRoutes;
          commit("SET_ROUTES", accessedRoutes);
          resolve(accessedRoutes);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  },
};

/* const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
} */

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
