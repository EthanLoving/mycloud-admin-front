import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

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
    icon: 'svg-name'             the icon show in the sidebar
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
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  // 锁屏
  {
    path: '/lock',
    hidden: true,
    name: '锁屏页',
    component: () => import('@/views/common/lock')
  },
  {
    path: '/login',
    component: () => import('@/views/login/login'),
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
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'ios-desktop-outline', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  }
]

// // /**
// //  * asyncRoutes
// //  * the routes that need to be dynamically loaded based on user roles
// //  */
// export const asyncRoutes = [
//   {
//     path: '/system',
//     component: Layout,
//     redirect: '/system/user',
//     alwaysShow: true, // will always show the root menu
//     name: 'System',
//     meta: {
//       title: '用户管理',
//       icon: 'user',
//       roles: ['admin', 'editor'] // you can set roles in root nav
//     },
//     children: [
//       {
//         path: 'user',
//         component: () => import('@/views/system/user-manage/userManage'),
//         name: 'User',
//         meta: {
//           title: '用户管理',
//           roles: ['admin'] // or you can only set roles in sub nav
//         }
//       },
//       {
//         path: 'router',
//         component: () => import('@/views/system/router-manage/routerManage'),
//         name: 'Router',
//         meta: {
//           title: '路由管理',
//           roles: ['admin'] // or you can only set roles in sub nav
//         }
//       }
//       ]
//   },
//   {
//     path: '/permission',
//     component: Layout,
//     redirect: '/permission/page',
//     alwaysShow: true, // will always show the root menu
//     name: 'Permission',
//     meta: {
//       title: '权限',
//       icon: 'lock',
//       roles: ['admin', 'editor'] // you can set roles in root nav
//     },
//     children: [
//       {
//         path: 'page',
//         component: () => import('@/views/permission/page'),
//         name: 'PagePermission',
//         meta: {
//           title: 'Page Permission',
//           roles: ['admin'] // or you can only set roles in sub nav
//         }
//       },
//       {
//         path: 'directive',
//         component: () => import('@/views/permission/directive'),
//         name: 'DirectivePermission',
//         meta: {
//           title: 'Directive Permission'
//           // if do not set roles, means: this page does not require permission
//         }
//       },
//       {
//         path: 'role',
//         component: () => import('@/views/permission/role'),
//         name: 'RolePermission',
//         meta: {
//           title: 'Role Permission',
//           roles: ['admin']
//         }
//       }
//     ]
//   },
//
//   {
//     path: '/icon',
//     component: Layout,
//     children: [
//       {
//         path: 'index',
//         component: () => import('@/views/icons/index'),
//         name: 'Icons',
//         meta: { title: 'Icons', icon: 'icon', noCache: true }
//       }
//     ]
//   },
//   // 404 page must be placed at the end !!!
//   { path: '*', redirect: '/404', hidden: true }
// ]


export const otherRouter = [
  {
    path: '/other',
    name: 'otherRouter',
    component: '/Layout',
    hidden: true,
    children: [
      // { path: 'home', title: { i18n: 'home' }, name: 'home_index', component: () => import('@/views/home/home.vue') },
      // { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: () => import('@/views/own-space/own-space.vue') },
      // { path: 'ownspace-old', title: '个人中心(旧)', name: 'ownspace_old', component: () => import('@/views/own-space/own-space-old.vue') },
      // { path: 'change-pass', title: '修改密码', name: 'change_pass', component: () => import('@/views/change-pass/change-pass.vue') },
      // { path: 'message', title: '消息中心', name: 'message_index', component: () => import('@/views/message/message.vue') },
      // { path: 'add', title: '添加', name: 'add', component: () => import('@/views/xboot-vue-template/new-window/add.vue') },
      // { path: 'edit', title: '编辑', name: 'edit', component: () => import('@/views/xboot-vue-template/new-window/edit.vue') },
      // { path: 'add-edit-message', title: '消息详情', name: 'add_edit_message', component: () => import('@/views/sys/message-manage/addOrEditMessage.vue') },
      // { path: 'message-send-detail', title: '消息发送详情', name: 'message_send_detail', component: () => import('@/views/sys/message-manage/messageSendDetail.vue') },
      // { path: 'process-node-edit', title: '流程节点设置', name: 'process_node_edit', component: () => import('@/views/activiti/process-manage/processNodeEdit.vue') },
      { path: 'leave', title: '请假申请', name: 'leave', component: '/activiti/business/leave',meta:{title:'请假申请'} },
      { path: 'historic-detail', title: '流程进度历史详情', name: 'historic_detail', component: '/activiti/hostoric-detail/hostoricDetail',meta:{title:'流程进度历史详情'}},
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
