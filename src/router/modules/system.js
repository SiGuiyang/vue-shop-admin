
import Layout from '@/views/layout/Layout'

const systemRouter = {
  path: '/system', // 系统管理
  component: Layout,
  redirect: '/system/user',
  name: 'system',
  meta: {
    title: 'system',
    icon: 'component',
    permission: '/admin/system/user'
  },
  children: [
    {
      path: 'user', // 用户管理
      component: () => import('@/views/system/user'),
      name: 'UserManage',
      meta: {
        title: 'systemUser',
        permission: '/admin/system/user'
      }
    },
    {
      path: 'menu', // 菜单管理
      component: () => import('@/views/system/menu'),
      name: 'MenuManage',
      meta: {
        title: 'systemMenu',
        permission: '/admin/system/menu'
      }
    },
    {
      path: 'role', // 角色管理
      component: () => import('@/views/system/role'),
      name: 'RoleManage',
      meta: {
        title: 'systemRole',
        permission: '/admin/system/role'
      }
    },
    {
      path: 'config', // 系统配置管理
      component: () => import('@/views/system/config'),
      name: 'ConfigManage',
      meta: {
        title: 'systemConfig',
        permission: '/admin/system/config'
      }
    }
  ]
}

export default systemRouter
