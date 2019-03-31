import Layout from '@/views/layout/Layout'

const monitorRouter = {
  path: '/monitor',
  component: Layout,
  redirect: '/monitor/hystrix',
  name: 'MonitorService',
  meta: {
    title: 'monitor',
    icon: 'table',
    permission: 'ROLE_ADMIN'
  },
  children: [
    {
      path: 'hystrix',
      component: () => import('@/views/monitor/hystrix'),
      name: 'Hystrix',
      meta: { title: 'hystrix', permission: 'ROLE_ADMIN' }
    },
    {
      path: 'interface',
      component: () => import('@/views/monitor/interface/index'),
      name: 'InterfaceService',
      meta: { title: 'interfaceService', permission: 'ROLE_ADMIN' },
      children: [
        {
          path: 'activity',
          component: () => import('@/views/monitor/interface/activity'),
          name: 'ActivityInterface',
          meta: { title: 'activityInterface', permission: 'ROLE_ADMIN' }
        },
        {
          path: 'admin',
          component: () => import('@/views/monitor/interface/admin'),
          name: 'AdminInterface',
          meta: { title: 'adminInterface', permission: 'ROLE_ADMIN' }
        },
        {
          path: 'goods',
          component: () => import('@/views/monitor/interface/goods'),
          name: 'GoodsInterface',
          meta: { title: 'goodsInterface', permission: 'ROLE_ADMIN' }
        },
        {
          path: 'order',
          component: () => import('@/views/monitor/interface/order'),
          name: 'OrderInterface',
          meta: { title: 'orderInterface', permission: 'ROLE_ADMIN' }
        },
        {
          path: 'settlement',
          component: () => import('@/views/monitor/interface/settlement'),
          name: 'SettlementInterface',
          meta: { title: 'settlementInterface', permission: 'ROLE_ADMIN' }
        },
        {
          path: 'user',
          component: () => import('@/views/monitor/interface/user'),
          name: 'UserInterface',
          meta: { title: 'userInterface', permission: 'ROLE_ADMIN' }
        }
      ]
    },
    {
      path: 'database',
      component: () => import('@/views/monitor/database/index'),
      redirect: '/monitor/database/user',
      name: 'DatabaseService',
      meta: { title: 'databaseService', permission: 'ROLE_ADMIN' },
      children: [
        {
          path: 'activity',
          component: () => import('@/views/monitor/database/activity'),
          name: 'ActivityDatabase',
          meta: { title: 'activityDatabase', permission: 'ROLE_ADMIN' }
        },
        {
          path: 'admin',
          component: () => import('@/views/monitor/database/admin'),
          name: 'AdminDatabase',
          meta: { title: 'adminDatabase', permission: 'ROLE_ADMIN' }
        },
        {
          path: 'goods',
          component: () => import('@/views/monitor/database/goods'),
          name: 'GoodsDatabase',
          meta: { title: 'goodsDatabase', permission: 'ROLE_ADMIN' }
        },
        {
          path: 'order',
          component: () => import('@/views/monitor/database/order'),
          name: 'OrderDatabase',
          meta: { title: 'orderDatabase', permission: 'ROLE_ADMIN' }
        },
        {
          path: 'settlement',
          component: () => import('@/views/monitor/database/settlement'),
          name: 'SettlementDatabase',
          meta: { title: 'settlementDatabase', permission: 'ROLE_ADMIN' }
        },
        {
          path: 'user',
          component: () => import('@/views/monitor/database/user'),
          name: 'UserDatabase',
          meta: { title: 'userDatabase', permission: 'ROLE_ADMIN' }
        }
      ]
    }
  ]
}

export default monitorRouter
