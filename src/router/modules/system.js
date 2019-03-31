
import Layout from '@/views/layout/Layout'

const systemRouter = {
  path: '/system', // 系统管理
  component: Layout,
  redirect: '/system/user',
  name: 'system',
  meta: {
    title: 'system',
    icon: 'component',
    permission: 'ROLE_ADMIN'
  },
  children: [
    {
      path: 'user', // 用户管理
      component: () => import('@/views/system/user'),
      name: 'UserManage',
      meta: {
        title: 'systemUser',
        permission: 'ROLE_ADMIN'
      }
    },
    {
      path: 'menu', // 菜单管理
      component: () => import('@/views/system/menu'),
      name: 'MenuManage',
      meta: {
        title: 'systemMenu',
        permission: 'ROLE_ADMIN'
      }
    },
    {
      path: 'role', // 角色管理
      component: () => import('@/views/system/role'),
      name: 'RoleManage',
      meta: {
        title: 'systemRole',
        permission: 'ROLE_ADMIN'
      }
    },
    {
      path: 'config', // 系统配置管理
      component: () => import('@/views/system/config'),
      name: 'ConfigManage',
      meta: {
        title: 'systemConfig',
        permission: 'ROLE_ADMIN'
      }
    }
  ]
}

export default systemRouter
