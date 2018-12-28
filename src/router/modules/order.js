/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const orderRouter = {
  path: '/order',
  component: Layout,
  redirect: 'noredirect',
  name: 'Order',
  meta: {
    title: 'order',
    icon: 'component',
    permission: ['admin']
  },
  children: [
    {
      path: 'user',
      component: () => import('@/views/order/userOrder'),
      name: 'UserOrder',
      meta: { title: 'userOrder', permission: ['admin'] }
    },
    {
      path: '/afterSale',
      component: () => import('@/views/order/afterSaleOrder'),
      name: 'AfterSaleOrder',
      meta: { title: 'afterSaleOrder', permission: ['admin'] }
    },
    {
      path: 'seller',
      component: () => import('@/views/order/sellerOrder'),
      name: 'SellerOrder',
      meta: { title: 'sellerOrder', permission: ['admin'] }
    }
  ]
}

export default orderRouter
