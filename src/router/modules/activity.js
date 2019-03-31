/** When your routing table is too long, you can split it into small modules**/``

import Layout from '@/views/layout/Layout'

const activityRouter = {
  path: '/activity',
  component: Layout,
  redirect: '/activity/coupon/template',
  name: 'CouponManage',
  meta: {
    title: 'activity',
    icon: 'table',
    permission: 'ROLE_ADMIN'
  },
  children: [
    {
      path: 'coupon',
      component: () => import('@/views/activity/coupon/index'),
      name: 'Coupon',
      redirect: '/activity/coupon/template',
      meta: { title: 'coupon', permission: 'ROLE_ADMIN' },
      children: [
        {
          path: 'template',
          component: () => import('@/views/activity/coupon/template'),
          name: 'CouponTemplate',
          meta: { title: 'couponTemplate', permission: 'ROLE_ADMIN' }
        },
        {
          path: 'user',
          component: () => import('@/views/activity/coupon/userCoupon'),
          name: 'UserCoupon',
          meta: { title: 'userCoupon', permission: 'ROLE_ADMIN' }
        }
      ]
    },
    {
      path: 'fullExchange',
      component: () => import('@/views/activity/exchange/activity'),
      name: 'FullExchange',
      meta: { title: 'fullExchange', permission: 'ROLE_ADMIN' }
    },
    {
      path: 'fightGroup',
      component: () => import('@/views/activity/fightGroup/activity'),
      name: 'FightGroup',
      meta: { title: 'fightGroup', permission: 'ROLE_ADMIN' }
    },
    {
      path: 'fightGroup/rule/:id(\\d+)',
      component: () => import('@/views/activity/fightGroup/rule'),
      name: 'FightGroupRule',
      hidden: true,
      meta: { title: 'fightGroupRule', noCache: true, permission: 'ROLE_ADMIN' }
    },
    {
      path: 'fightGroup/record/:id(\\d+)',
      component: () => import('@/views/activity/fightGroup/record'),
      name: 'FightGroupRecord',
      hidden: true,
      meta: { title: 'fightGroupRecord', noCache: true, permission: 'ROLE_ADMIN' }
    },
    {
      path: 'banner',
      component: () => import('@/views/activity/banner'),
      name: 'BannerManage',
      meta: { title: 'bannerManage', permission: 'ROLE_ADMIN' }
    },
    {
      path: 'station',
      component: () => import('@/views/activity/stationLetter'),
      name: 'StationLetter',
      meta: { title: 'stationLetter', permission: 'ROLE_ADMIN' }
    }
  ]
}

export default activityRouter
