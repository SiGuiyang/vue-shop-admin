/** When your routing table is too long, you can split it into small modules**/``

import Layout from '@/views/layout/Layout'

const activityRouter = {
  path: '/activity',
  component: Layout,
  redirect: '/activity/coupon/template',
  name: 'Table',
  meta: {
    title: 'activity',
    icon: 'table',
    permission: ['admin']
  },
  children: [
    {
      path: '/activity/coupon',
      component: () => import('@/views/activity/coupon/couponTemplate'),
      name: 'Coupon',
      redirect: '/activity/coupon/template',
      meta: { title: 'coupon', permission: ['admin'] },
      children: [
        {
          path: 'template',
          component: () => import('@/views/activity/coupon/couponTemplate'),
          name: 'CouponTemplate',
          meta: { title: 'couponTemplate', permission: ['admin'] }
        },
        {
          path: 'list',
          component: () => import('@/views/activity/coupon/coupons'),
          name: 'Coupons',
          meta: { title: 'coupon', permission: ['admin'] }
        }
      ]
    },
    {
      path: '/activity/fightGroup',
      component: () => import('@/views/activity/fightGroup/rule'),
      redirect: '/activity/fightGroup/rule',
      name: 'FightGroup',
      meta: { title: 'fightGroup', permission: ['admin'] },
      children: [
        {
          path: 'rule',
          component: () => import('@/views/activity/fightGroup/rule'),
          name: 'FightGroupRule',
          meta: { title: 'fightGroupRule', permission: ['admin'] }
        },
        {
          path: 'goods',
          component: () => import('@/views/activity/fightGroup/goods'),
          name: 'FightGroupGoods',
          meta: { title: 'fightGroupGoods', permission: ['admin'] }
        }
      ]
    },
    {
      path: 'banner',
      component: () => import('@/views/activity/banner'),
      name: 'BannerManage',
      meta: { title: 'bannerManage', permission: ['admin'] }
    }
  ]
}
export default activityRouter
