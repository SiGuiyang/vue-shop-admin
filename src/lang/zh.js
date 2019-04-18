export default {
  route: {
    dashboard: '首页',
    introduction: '简述',
    documentation: '文档',
    guide: '引导页',
    order: '订单管理',
    userOrder: '用户订单',
    afterSaleOrder: '售后订单',
    sellerOrder: '商户订单',
    avatarUpload: '头像上传',
    dropzone: 'Dropzone',
    sticky: 'Sticky',
    countTo: 'CountTo',
    statistics: '统计管理',
    couponStatistics: '优惠券统计',
    fightGroupStatistics: '拼团统计',
    integralStatistics: '积分统计',
    document: '文章管理',
    goods: '商品管理',
    goodsEdit: '商品编辑',
    goodsManageList: '商品管理',
    classification: '商品分类',
    activity: '活动管理',
    couponTemplate: '优惠券模版管理',
    coupon: '优惠券管理',
    userCoupon: '用户优惠券',
    bannerManage: 'Banner 管理',
    stationLetter: '站内信管理',
    fightGroup: '拼团管理',
    fightGroupActivity: '拼团活动',
    fightGroupRule: '拼团规则',
    fightGroupGoods: '拼团商品',
    fightGroupRecord: '成团记录',
    fullExchange: '满赠换购管理',
    createArticle: '创建文章',
    editArticle: '编辑文章',
    articleList: '文章列表',
    finance: '财务管理',
    fundManage: '资金管理',
    tradeManage: '交易流水',
    riskManage: '风控管理',
    riskRule: '规则配置',
    riskBlackList: '黑名单管理',
    system: '系统管理',
    systemUser: '用户管理',
    systemMenu: '菜单管理',
    systemRole: '角色管理',
    systemConfig: '配置管理',
    monitor: '监控服务',
    hystrix: 'Hystrix 监控',
    interfaceService: '接口Swagger',
    activityInterface: '活动中心模块',
    adminInterface: '系统平台模块',
    goodsInterface: '商品中心模块',
    orderInterface: '订单中心模块',
    settlementInterface: '结算中心模块',
    userInterface: '用户中心模块',
    databaseService: '数据库监控',
    adminDatabase: '管理数据中心',
    activityDatabase: '活动数据中心',
    goodsDatabase: '商品数据中心',
    orderDatabase: '订单数据中心',
    settlementDatabase: '结算数据中心',
    userDatabase: '用户中心',
    generatorManage: '代码生成'
  },
  activity: {
    banner: {
      title: '活动标题',
      bannerUrl: 'banner 图片地址',
      bannerClickUrl: 'Banner跳转地址',
      bannerType: '类型',
      shareUrl: '分享地址',
      shareTitle: '分享标题',
      shareSubtitle: '分享副标题',
      shareIcon: '分享图标',
      shareChannel: '分享渠道',
      createTime: '创建时间',
      createUser: '创建人',
      status: '状态'
    },
    coupon: {
      templateName: '模板名称',
      couponName: '优惠券活动名称',
      templateType: '模板类型',
      orderAmount: '订单满减金额',
      couponAmount: '优惠券金额',
      deleteStatus: '是否禁用',
      discountType: '优惠券类型',
      description: '优惠券说明',
      discountStrength: '折扣力度',
      phone: '手机号',
      username: '用户名'
    },
    exchange: {
      title: '  活动标题'
    },
    fightGroup: {
      activityName: '活动名称',
      activityImg: '活动图片',
      activityTime: '活动周期',
      rule: '规则',
      goods: '商品',
      record: '记录',
      purchaseLimit: '限购数量',
      fightCount: '成团人数',
      description: '说明',
      time: '开团时间',
      master: '团长'
    },
    station: {
      content: '内容'
    }
  },
  goods: {
    goodsName: '商品名称',
    goodsCode: '商品编码',
    goodsType: '商品类型',
    description: '商品简介',
    goodsStatus: '状态',
    goodsAmount: '商品价格',
    goodsDiscountAmount: '折扣价格',
    integral: '商品积分',
    goodsInventory: '库存',
    createTime: '创建时间',
    classificationName: '分类名称',
    classificationImg: '分类图片',
    placeOrigin: '产地',
    storage: '储存',
    goodsImg: '商品LOGO',
    bannerFirst: '商品banner第一页',
    bannerSecond: '商品banner第二页',
    bannerThird: '商品banner第三页',
    detailsImgFirst: '商品详情图片 一',
    detailsImgSecond: '商品详情图片 二',
    detailsImgThird: '商品详情图片 三',
    detailsImgFourth: '商品详情图片 四',
    detailsImgFifth: '商品详情图片 五'
  },
  order: {
    orderCode: '订单号',
    orderStatus: '订单状态',
    phone: '手机号码',
    username: '用户名',
    orderAmount: '订单金额',
    integral: '积分',
    orderType: '订单类型',
    integralAmount: '积分减免金额',
    discountAmount: '优惠券减免金额',
    address: '送货地址',
    createTime: '下单时间'
  },
  system: {
    user: { // 系统管理 用户管理
      sysName: '系统用户',
      username: '登陆账号',
      roleCode: '角色',
      password: '密码',
      status: '状态',
      avatar: '用户头像'
    },
    role: {
      roleName: '角色名称',
      roleCode: '角色代码',
      status: '状态'
    },
    config: {
      module: '模块',
      configName: '配置项名称',
      configValue: '配置项值',
      status: '状态',
      description: '说明'
    },
    menu: {
      menuName: '菜单名称',
      permission: '权限',
      type: '类型',
      createTime: '创建时间'
    }
  },
  navbar: {
    logOut: '退出登录',
    dashboard: '首页',
    github: '项目地址',
    screenfull: '全屏',
    theme: '换肤',
    size: '布局大小'
  },
  login: {
    title: 'Pager 电商系统平台',
    logIn: '登录',
    username: '账号',
    password: '密码',
    any: '随便填'
  },
  permission: {
    roles: '你的权限',
    switchRoles: '切换权限'
  },
  guide: {
    description: '引导页对于一些第一次进入项目的人很有用，你可以简单介绍下项目的功能。本 Demo 是基于',
    button: '打开引导'
  },
  components: {
    documentation: '文档',
    tinymceTips: '富文本是管理后台一个核心的功能，但同时又是一个有很多坑的地方。在选择富文本的过程中我也走了不少的弯路，市面上常见的富文本都基本用过了，最终权衡了一下选择了Tinymce。更详细的富文本比较和介绍见',
    dropzoneTips: '由于我司业务有特殊需求，而且要传七牛 所以没用第三方，选择了自己封装。代码非常的简单，具体代码你可以在这里看到 @/components/Dropzone',
    stickyTips: '当页面滚动到预设的位置会吸附在顶部',
    backToTopTips1: '页面滚动到指定位置会在右下角出现返回顶部按钮',
    backToTopTips2: '可自定义按钮的样式、show/hide、出现的高度、返回的位置 如需文字提示，可在外部使用Element的el-tooltip元素',
    imageUploadTips: '由于我在使用时它只有vue@1版本，而且和mockjs不兼容，所以自己改造了一下，如果大家要使用的话，优先还是使用官方版本。'
  },
  table: {
    dynamicTips1: '固定表头, 按照表头顺序排序',
    dynamicTips2: '不固定表头, 按照点击顺序排序',
    dragTips1: '默认顺序',
    dragTips2: '拖拽后顺序',
    title: '标题',
    permission: '授权',
    type: '类型',
    remark: '点评',
    search: '搜索',
    add: '添加',
    export: '导出',
    reviewer: '审核人',
    id: '序号',
    date: '时间',
    author: '作者',
    readings: '阅读数',
    status: '状态',
    actions: '操作',
    edit: '编辑',
    publish: '发布',
    draft: '草稿',
    delete: '删除',
    cancel: '取 消',
    confirm: '确 定',
    close: '关 闭',
    query: '查 看',
    detail: '详情',
    operationUser: '操作人',
    reissueCoupon: '补发优惠券',
    downloadTemplate: '下载模板'
  },
  errorLog: {
    tips: '请点击右上角bug小图标',
    description: '现在的管理后台基本都是spa的形式了，它增强了用户体验，但同时也会增加页面出问题的可能性，可能一个小小的疏忽就导致整个页面的死锁。好在 Vue 官网提供了一个方法来捕获处理异常，你可以在其中进行错误处理或者异常上报。',
    documentation: '文档介绍'
  },
  excel: {
    export: '导出',
    selectedExport: '导出已选择项',
    placeholder: '请输入文件名(默认excel-list)'
  },
  zip: {
    export: '导出',
    placeholder: '请输入文件名(默认file)'
  },
  theme: {
    change: '换肤',
    documentation: '换肤文档',
    tips: 'Tips: 它区别于 navbar 上的 theme-pick, 是两种不同的换肤方法，各自有不同的应用场景，具体请参考文档。'
  },
  tagsView: {
    refresh: '刷新',
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  },
  time: {
    beginTime: '开始时间',
    endTime: '结束时间'
  },
  common: {
    createTime: '创建时间',
    createUser: '创建人'
  }
}
