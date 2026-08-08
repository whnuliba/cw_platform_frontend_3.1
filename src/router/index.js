import Vue from 'vue'
import Router from 'vue-router'
import common from '@/utils/common'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
/* import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested' */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: false
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: common.getGlobalParameters('homePagePath'),//'/cw/CwPageView/pms/dashboard'
    children: [
      {
        path: common.getGlobalParameters('homePagePath'),
        component: () => import('@/views/cw/CwPageView'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }

]

export const asyncRoutes = [
  {
    path: '*',
    redirect: '/404',
    hidden: true
  },
  // {
  //   path: '/fms/external/common-module',
  //   component: Layout,  
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/fms/external/common-module/:bizType/:bizCode',
  //       component: () => import('@/views/fms/external/common-module'),
  //     }
  //   ]
  // },
  {
    path: '/preview',
    component: Layout,
    hidden: true,
    name:'页面预览',
    children: [
      {
        path: '/preview',
        name:'preview',
        meta: {title:'页面预览'},
        component: () => import('@/views/cw/CwPreview'),
      }
    ]
  },
  {
    path: '/bpm/approval/components/createNodeComponent',
    component: Layout,  
    hidden: true,
    children: [
      {
        path: '/bpm/approval/components/createNodeComponent/:id',
        component: () => import('@/views/bpm/approval/components/createNodeComponent'),
      }
    ]
  },
  {
    path: '/fms/qc-manage/chart_module',
    component: Layout,  
    hidden: true,
    children: [
      {
        path: '/fms/qc-manage/chart_module/:viewType/:status',
        component: () => import('@/views/fms/qc-manage/chart_module'),
      }
    ]
  },
  {
    path: '/common/index',
    component: Layout,  
    hidden: true,
    children: [
      {
        path: '/common/page/:bizCode/:bizType',
        component: () => import('@/views/common/index'),
      }
    ]
  },
  // {
  //   path: '/bpm/bpmFormCommon',
  //   component: Layout,  
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/bpm/bpmFormCommon/:bizCode/:bizType',
  //       name: 'bpmFormCommon',
  //       meta:{
  //         title:'审批表单'
  //       },
  //       component: () => import('@/views/bpm/bpmFormCommon'),

  //     }
  //   ]
  // },
  {
    path: '/fms/qc-manage/qc-c-standard/list',
    component: Layout,  
    hidden: true,
    children: [
      {
        path: '/fms/qc-manage/qc-c-standard/common-module/:qcType/',
        component: () => import('@/views/fms/qc-manage/qc-c-standard/list'),
      } 
    ]
  },
  {
    path: '/fms/qc-manage/qc-c-prod-standard/list',
    component: Layout,  
    hidden: true,
    children: [
      {
        path: '/fms/qc-manage/qc-c-prod-standard/common-module/:qcType/',
        component: () => import('@/views/fms/qc-manage/qc-c-prod-standard/list'),
      }
    ]
  },
  {
    path: '/fms/qc-manage/qc-c-standard-form/list',
    component: Layout,  
    hidden: true,
    children: [
      {
        path: '/fms/qc-manage/qc-c-standard-form/common-module/:qcType/',
        component: () => import('@/views/fms/qc-manage/qc-c-standard-form/list'),
      }
    ]
  },
  {
    path: '/fms/qc-manage/qc-c-ngdisposal/index',
    component: Layout,  
    hidden: true,
    children: [
      {
        path: '/fms/qc-manage/qc-c-ngdisposal/common-module/:qcType/',
        component: () => import('@/views/fms/qc-manage/qc-c-ngdisposal/index'),
      }
    ]
  },
  {
    path: '/fms/basic-data/edit-user',
    component: Layout,  
    hidden: true,
    children: [
      {
        path: '/fms/basic-data/edit-user',
        component: () => import('@/views/fms/basic-data/edit-user'),
      }
    ]
  },
]


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
