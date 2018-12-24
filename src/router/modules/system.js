
import Layout from '@/views/layout/Layout'

const systemRouter = {
  path: '/system', // 系统管理
  component: Layout,
  redirect: '/system/user',
  name: 'system',
  meta: {
    title: 'system',
    icon: 'component'
  },
  children: [
    {
      path: 'user', // 用户管理
      component: () => import('@/views/system/user'),
      name: 'UserManage',
      meta: {
        title: 'systemUser'
      }
    },
    {
      path: 'role', // 角色管理
      component: () => import('@/views/system/user'),
      name: 'RoleManage',
      meta: {
        title: 'systemRole'
      }
    },
    {
      path: 'config', // 系统配置管理
      component: () => import('@/views/system/config'),
      name: 'ConfigManage',
      meta: {
        title: 'systemConfig'
      }
    }
  ]
}

export default systemRouter
