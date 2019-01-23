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
    permission: '/admin/activity/banner/list'
  },
  children: [
    {
      path: 'coupon',
      component: () => import('@/views/activity/coupon/index'),
      name: 'Coupon',
      redirect: '/activity/coupon/template',
      meta: { title: 'coupon', permission: '/admin/activity/coupon/template' },
      children: [
        {
          path: 'template',
          component: () => import('@/views/activity/coupon/template'),
          name: 'CouponTemplate',
          meta: { title: 'couponTemplate', permission: '/admin/activity/coupon/template' }
        },
        {
          path: 'user',
          component: () => import('@/views/activity/coupon/userCoupon'),
          name: 'UserCoupon',
          meta: { title: 'userCoupon', permission: '/admin/activity/coupon/list' }
        }
      ]
    },
    {
      path: 'fightGroup',
      component: () => import('@/views/activity/fightGroup/activity'),
      name: 'FightGroup',
      meta: { title: 'fightGroup', permission: '/admin/activity/fightGroup/list' }
    },
    {
      path: 'fightGroup/rule/:id(\\d+)',
      component: () => import('@/views/activity/fightGroup/rule'),
      name: 'FightGroupRule',
      hidden: true,
      meta: { title: 'fightGroupRule', noCache: true, permission: '/admin/activity/fightGroup/rule' }
    },
    {
      path: 'fightGroup/record/:id(\\d+)',
      component: () => import('@/views/activity/fightGroup/record'),
      name: 'FightGroupRecord',
      hidden: true,
      meta: { title: 'fightGroupRecord', noCache: true, permission: '/admin/activity/fightGroup/record' }
    },
    {
      path: 'banner',
      component: () => import('@/views/activity/banner'),
      name: 'BannerManage',
      meta: { title: 'bannerManage', permission: '/admin/activity/banner/list' }
    },
    {
      path: 'station',
      component: () => import('@/views/activity/stationLetter'),
      name: 'StationLetter',
      meta: { title: 'stationLetter', permission: '/admin/activity/station/list' }
    }
  ]
}
export default activityRouter
