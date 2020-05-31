import service from '@/utils/request'

// 获取table data
export function fetchList (data) {
  return service({
    url: '/admin/generator/tables',
    method: 'post',
    data
  })
}

// 获取表元素
export function getTableColumn (data) {
  return service({
    url: '/admin/generator/tables',
    method: 'get',
    params: data
  })
}

// 代码生成
export function generatorCode (data) {
  return service({
    url: '/admin/generator',
    method: 'post',
    data
  })
}
