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
    permission: 'ROLE_ADMIN'
  },
  children: [
    {
      path: 'user',
      component: () => import('@/views/order/userOrder'),
      name: 'UserOrder',
      meta: { title: 'userOrder', permission: 'ROLE_ADMIN' }
    },
    {
      path: '/afterSale',
      component: () => import('@/views/order/afterSaleOrder'),
      name: 'AfterSaleOrder',
      meta: { title: 'afterSaleOrder', permission: 'ROLE_ADMIN' }
    },
    {
      path: 'seller',
      component: () => import('@/views/order/sellerOrder'),
      name: 'SellerOrder',
      meta: { title: 'sellerOrder', permission: 'ROLE_ADMIN' }
    }
  ]
}

export default orderRouter
