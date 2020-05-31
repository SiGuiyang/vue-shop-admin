import service from '@/utils/request'
// 获取动态表单列表
export function postFormList (data) {
  return service({
    url: '/platform/dynamic/form/page',
    method: 'post',
    data
  })
}

// 获取动态表单列表
export function getFormList (data) {
  return service({
    url: '/platform/dynamic/form/list',
    method: 'get',
    params: data
  })
}

// 获取动态表单保存
export function postFormCreate (data) {
  return service({
    url: '/platform/dynamic/form/create',
    method: 'post',
    data
  })
}

// 获取动态表单列表修改
export function putFormModify (data) {
  return service({
    url: '/platform/dynamic/form/modify',
    method: 'put',
    data
  })
}

/**
 * 生成表单模型数据
 * @param {*} data  数据
 */
export function postFormModelCreate (data) {
  return service({
    url: '/platform/dynamic/form/model/create',
    method: 'post',
    data
  })
}

/**
 * 获取表单
 * @param {*} data 
 */
export function getFormGet (data) {
  return service({
    url: '/platform/dynamic/form/get',
    method: 'get',
    params: data
  })
}
