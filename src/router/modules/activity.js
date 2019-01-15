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
      component: () => import('@/views/activity/fightGroup/rule'),
      redirect: '/activity/fightGroup/rule',
      name: 'FightGroup',
      meta: { title: 'fightGroup', permission: '/admin/activity/fightGroup/rule' },
      children: [
        {
          path: 'rule',
          component: () => import('@/views/activity/fightGroup/rule'),
          name: 'FightGroupRule',
          meta: { title: 'fightGroupRule', permission: '/admin/activity/fightGroup/rule' }
        },
        {
          path: 'goods',
          component: () => import('@/views/activity/fightGroup/goods'),
          name: 'FightGroupGoods',
          meta: { title: 'fightGroupGoods', permission: '/admin/activity/fightGroup/goods' }
        }
      ]
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
