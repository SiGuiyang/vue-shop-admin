import Layout from '@/views/layout/Layout'

const riskRouter = {
  path: '/risk',
  component: Layout,
  name: 'RiskManage',
  redirect: '/risk/rule',
  meta: {
    title: 'riskManage',
    icon: 'table',
    permission: '/admin/activity/banner/list'
  },
  children: [
    {
      path: 'rule',
      component: () => import('@/views/risk/rule'),
      name: 'RiskRule',
      meta: { title: 'riskRule', permission: '/admin/activity/banner/list' }
    },
    {
      path: 'blackList',
      component: () => import('@/views/risk/blackList'),
      name: 'RiskBlackList',
      meta: { title: 'riskBlackList', permission: '/admin/activity/banner/list' }
    }
  ]
}

export default riskRouter
