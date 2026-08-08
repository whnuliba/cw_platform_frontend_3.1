import router from './router'

import {resetRouter}  from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getSToken,getRoles,getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
// import { asyncRoutes, constantRoutes } from '@/router'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // 启动进度条
  NProgress.start()
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)
  // 确定用户是否已登录
  //const hasToken = getSToken()
  //const hasToken = getToken()
  let role =  JSON.parse(sessionStorage.getItem('tmp_cache_roles'))
  let hasToken = role && role.length>0
  if (to.path.startsWith("/login")){
      // 如果已登录，请重定向到主页
      if (to.path === '/login')
        { 
          next()
        }
        else{
           if(hasToken){
            if(to.path.indexOf('redirect=')>=0)
            next(`${to.path}`)
            else
            next(`/login?redirect=${to.path}`)
            NProgress.done()
           }
        }
        return
  }
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，请重定向到主页
      next({ path: '/login' })
      NProgress.done()
    } else {
      // 判断路由
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      //console.log(2121,hasToken,getRoles())
      //const hasRoles = getRoles() && getRoles().length > 0
      if (hasRoles) {      
        next()
      } else {
        try {
          // 基于角色生成可访问的路由表
          //const accessRoutes = await store.dispatch('permission/generateRoutes', null)
          // 动态添加可访问的路由
          // console.log(accessRoutes)

          //获取权限内所有能访问的菜单组
          const  groups = await store.dispatch('permission/getMenuGroup')
          if(!groups || groups.length<=0){           
              // 删除令牌并转到登录页面重新登录
              await store.dispatch('user/resetToken')
              Message.error(error || '权限不足 或者没有授权功能')
              
              if(to.path.indexOf('redirect=')>=0)
                next(`${to.path}`)     
              else    
                next(`/login?redirect=${to.path}`)
              NProgress.done()
              return
          }
          //初始化渲染菜单
          let currMen = localStorage.getItem("current_application_code")
         
          if(!currMen)
          {
            currMen = groups.indexOf('SYS')!=0?'SYS':groups[0]
            localStorage.setItem("current_application_code",currMen)
          }else{
           if(groups.indexOf(currMen)<0){
              currMen = groups.indexOf('SYS')!=0?'SYS':groups[0]
              localStorage.setItem("current_application_code",currMen)
           }
          }
          //初始化角色
         const ros = await store.dispatch('user/getInfo')
         if(!ros || ros==null)
            {
              await store.dispatch('user/resetToken')
            if(to.path.indexOf('redirect=')>=0)
                next(`${to.path}`)     
            else    
                next(`/login?redirect=${to.path}`)
                NProgress.done()
              return
            }
          //设置当前系统
          //sessionStorage.setItem("current_application_code",currMen)
          await store.dispatch('permission/sysChange', currMen)          
          //注册路由
          const accessRoutes = await store.dispatch('permission/generateAllRoutes', groups)

        
          resetRouter()
          router.addRoutes(accessRoutes)
          //初始化按钮权限
          await store.dispatch('permission/get_button', currMen)
          // hack方法以确保addRoutes是完整的
          // 设置replace:true，这样导航将不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // 删除令牌并转到登录页面重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
                       //this.$router.push(`/login`)       
        if(to.path.indexOf('redirect=')>=0)
             next(`${to.path}`)     
         else    
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // 在免费登录白名单中，直接进入
      next()
    } else {
      // 没有访问权限的其他页面将重定向到登录页面。
      if(to.path.indexOf('redirect=')>=0)
        next(`${to.path}`)     
      else    
       next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach((to,from,next) => {
  document.querySelector("body").setAttribute("style","overflow:auto ! important;")
  NProgress.done()
})
