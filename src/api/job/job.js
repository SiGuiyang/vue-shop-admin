import service from '@/utils/request'

/**
 * Job列表
 */
export function postJobList (data) {
  return service({
    url: '/job/page',
    method: 'get',
    data
  })
}
/**
 * 任务状态列表
 * @param {*} data 
 */
export function getJobStatusList () {
  return service({
    url: `/job/status/list`,
    method: 'get'
  })
}
/**
 * job任务组列表
 * @param {*} data 
 */
export function getJobGroupList (data) {
  return service({
    url: `/job/group/list`,
    method: 'get',
    params: data
  })
}

/**
 * 新增Job任务组
 * @param {*} data 
 */
export function postJobGroupCreate (data) {
  return service({
    url: '/job/group/create',
    method: 'post',
    data
  })
}

/**
 * 新增品牌
 */
export function postJobCreate (data) {
  return service({
    url: '/job/create',
    method: 'post',
    data
  })
}

/**
 * 修改品牌
 */
export function putJobModify (data) {
  return service({
    url: '/job/modify',
    method: 'put',
    data
  })
}

/**
 * 删除job任务
 * @param {*} data 
 */
export function deleteJob (data) {
  return service({
    url: `/job/delete/${data}`,
    method: 'delete'
  })
}

/**
 * 暂停job任务
 * @param {*} data 
 */
export function parseJob (data) {
  return service({
    url: `/job/pause/${data}`,
    method: 'get'
  })
}

/**
 * 恢复job任务
 * @param {*} data 
 */
export function resumeJob (data) {
  return service({
    url: `/job/resume/${data}`,
    method: 'get'
  })
}

/**
 * 执行job任务
 * @param {*} data 
 */
export function executeJob (data) {
  return service({
    url: `/job/exeute/${data.id}`,
    method: 'post',
    data
  })
}
