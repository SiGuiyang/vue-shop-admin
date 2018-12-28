
import Layout from '@/views/layout/Layout'

const systemRouter = {
  path: '/system', // 系统管理
  component: Layout,
  redirect: '/system/user',
  name: 'system',
  meta: {
    title: 'system',
    icon: 'component',
    permission: ['admin']
  },
  children: [
    {
      path: 'user', // 用户管理
      component: () => import('@/views/system/user'),
      name: 'UserManage',
      meta: {
        title: 'systemUser',
        permission: ['admin']
      }
    },
    {
      path: 'menu', // 角色管理
      component: () => import('@/views/system/menu'),
      name: 'MenuManage',
      meta: {
        title: 'systemMenu',
        permission: ['admin']
      }
    },
    {
      path: 'role', // 角色管理
      component: () => import('@/views/system/role'),
      name: 'RoleManage',
      meta: {
        title: 'systemRole',
        permission: ['admin']
      }
    },
    {
      path: 'config', // 系统配置管理
      component: () => import('@/views/system/config'),
      name: 'ConfigManage',
      meta: {
        title: 'systemConfig',
        permission: ['admin']
      }
    }
  ]
}

export default systemRouter
