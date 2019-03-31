import Layout from '@/views/layout/Layout'

const riskRouter = {
  path: '/risk',
  component: Layout,
  name: 'RiskManage',
  redirect: '/risk/rule',
  meta: {
    title: 'riskManage',
    icon: 'table',
    permission: 'ROLE_ADMIN'
  },
  children: [
    {
      path: 'rule',
      component: () => import('@/views/risk/rule'),
      name: 'RiskRule',
      meta: { title: 'riskRule', permission: 'ROLE_ADMIN' }
    },
    {
      path: 'blackList',
      component: () => import('@/views/risk/blackList'),
      name: 'RiskBlackList',
      meta: { title: 'riskBlackList', permission: 'ROLE_ADMIN' }
    }
  ]
}

export default riskRouter
