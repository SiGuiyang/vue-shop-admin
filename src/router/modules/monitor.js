import Layout from '@/views/layout/Layout'

const monitorRouter = {
  path: '/monitor',
  component: Layout,
  redirect: '/monitor/hystrix',
  name: 'MonitorService',
  meta: {
    title: 'monitor',
    icon: 'table',
    permission: '/admin/monitor/serviceUrl'
  },
  children: [
    {
      path: 'hystrix',
      component: () => import('@/views/monitor/hystrix'),
      name: 'Hystrix',
      meta: { title: 'hystrix', permission: '/admin/monitor/serviceUrl' }
    },
    {
      path: 'interface',
      component: () => import('@/views/monitor/interface/index'),
      name: 'InterfaceService',
      meta: { title: 'interfaceService', permission: '/admin/monitor/serviceUrl' },
      children: [
        {
          path: 'activity',
          component: () => import('@/views/monitor/interface/activity'),
          name: 'ActivityInterface',
          meta: { title: 'activityInterface', permission: '/admin/monitor/serviceUrl' }
        },
        {
          path: 'admin',
          component: () => import('@/views/monitor/interface/admin'),
          name: 'AdminInterface',
          meta: { title: 'adminInterface', permission: '/admin/monitor/serviceUrl' }
        },
        {
          path: 'goods',
          component: () => import('@/views/monitor/interface/goods'),
          name: 'GoodsInterface',
          meta: { title: 'goodsInterface', permission: '/admin/monitor/serviceUrl' }
        },
        {
          path: 'order',
          component: () => import('@/views/monitor/interface/order'),
          name: 'OrderInterface',
          meta: { title: 'orderInterface', permission: '/admin/monitor/serviceUrl' }
        },
        {
          path: 'settlement',
          component: () => import('@/views/monitor/interface/settlement'),
          name: 'SettlementInterface',
          meta: { title: 'settlementInterface', permission: '/admin/monitor/serviceUrl' }
        },
        {
          path: 'user',
          component: () => import('@/views/monitor/interface/user'),
          name: 'UserInterface',
          meta: { title: 'userInterface', permission: '/admin/monitor/serviceUrl' }
        }
      ]
    },
    {
      path: 'database',
      component: () => import('@/views/monitor/database/index'),
      redirect: '/monitor/database/user',
      name: 'DatabaseService',
      meta: { title: 'databaseService', permission: '/admin/monitor/serviceUrl' },
      children: [
        {
          path: 'activity',
          component: () => import('@/views/monitor/database/activity'),
          name: 'ActivityDatabase',
          meta: { title: 'activityDatabase', permission: '/admin/monitor/serviceUrl' }
        },
        {
          path: 'admin',
          component: () => import('@/views/monitor/database/admin'),
          name: 'AdminDatabase',
          meta: { title: 'adminDatabase', permission: '/admin/monitor/serviceUrl' }
        },
        {
          path: 'goods',
          component: () => import('@/views/monitor/database/goods'),
          name: 'GoodsDatabase',
          meta: { title: 'goodsDatabase', permission: '/admin/monitor/serviceUrl' }
        },
        {
          path: 'order',
          component: () => import('@/views/monitor/database/order'),
          name: 'OrderDatabase',
          meta: { title: 'orderDatabase', permission: '/admin/monitor/serviceUrl' }
        },
        {
          path: 'settlement',
          component: () => import('@/views/monitor/database/settlement'),
          name: 'SettlementDatabase',
          meta: { title: 'settlementDatabase', permission: '/admin/monitor/serviceUrl' }
        },
        {
          path: 'user',
          component: () => import('@/views/monitor/database/user'),
          name: 'UserDatabase',
          meta: { title: 'userDatabase', permission: '/admin/monitor/serviceUrl' }
        }
      ]
    }
  ]
}

export default monitorRouter
