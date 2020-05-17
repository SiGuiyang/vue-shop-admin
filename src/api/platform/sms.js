import service from '@/utils/request'

// 发送短信
export function postSendSMS (data) {
  return service({
    url: '/platform/sms/send',
    method: 'post',
    data
  })
}
