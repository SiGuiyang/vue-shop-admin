const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  permission: state => state.user.permission,
  setting: state => state.user.setting,
  sysCode: state => state.user.sysCode,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs,
  orderStatusOptions: state => state.serviceConst.orderStatusOptions,
  orderTypeOptions: state => state.serviceConst.orderTypeOptions,
  goodsTypeOptions: state => state.serviceConst.goodsTypeOptions,
  couponTypeOptions: state => state.serviceConst.couponTypeOptions
}
export default getters
