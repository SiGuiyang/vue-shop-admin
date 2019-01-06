/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const goodsRouter = {
  path: '/goods',
  component: Layout,
  redirect: '/goods/manage/list',
  name: 'GoodsManage',
  meta: {
    title: 'goods',
    icon: 'nested',
    permission: '/admin/goods/list'
  },
  children: [
    {
      path: 'manage/list',
      component: () => import('@/views/goods/goodsManage'), // Parent router-view
      name: 'GoodsManageList',
      meta: { title: 'goodsManageList', permission: '/admin/goods/list' }
    },
    {
      path: 'manage/classification',
      name: 'Classification',
      component: () => import('@/views/goods/classification'),
      meta: { title: 'classification', permission: '/admin/goods/classification' }
    }
  ]
}

export default goodsRouter
