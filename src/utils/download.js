import { downloadFile } from '@/api/oss'
import service from '@/utils/request'
/**
 * 以文件流方式下载文件
 * @param {*} downloadUrl 
 * @param {*} fileName 
 * @param {*} ossType 下载方式
 * @param {*} excel 当为true时下载的是excel文件
 */
export function download (ossKey, fileName, ossType, excel) {
  const params = {
    ossKey: ossKey,
    downloadFilename: fileName,
    ossType: ossType
  }
  downloadFile(params).then(response => {
    let blob = null
    if (excel) {
      blob = new Blob([response], { type: 'application/vnd.ms-excel' }) // 构造一个blob对象来处理数据
    } else {
      blob = new Blob([response])
    }
    const elink = document.createElement('a')
    elink.download = fileName
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink) // 释放标签
  })
}

/**
 * 以文件流方式下载文件
 * @param {*} requestUrl 请求地址
 * @param {*} data 请求业务数据参数, type = 'excel' 时，下载的是excel文件
 */
export function commonDownload (requestUrl, data) {
  service({
    url: requestUrl,
    method: 'post',
    data,
    responseType: 'blob'
  }).then(response => {

    let blob = null
    if (data.type === 'excel') {
      blob = new Blob([response], { type: 'application/vnd.ms-excel' }) // 构造一个blob对象来处理数据
    } else {
      blob = new Blob([response])
    }
    const elink = document.createElement('a')
    elink.download = data.fileName
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink) // 释放标签
  })
}
