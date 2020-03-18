<template>
  <div class="app-container">
    <iframe id="activity"
            ref="iframe"
            :src="url"
            frameborder="0" />
  </div>
</template>
<script>
import { getServiceUrl } from '@/api/common'

export default {
  name: 'ActivityDatabase',
  data () {
    return {
      url: 'https://www.baidu.com/'
    }
  },
  mounted () {
    const activity = document.getElementById('activity')
    const deviceWidth = document.documentElement.clientWidth
    const deviceHeight = document.documentElement.clientHeight
    activity.style.width = (Number(deviceWidth) - 220) + 'px' // 数字是页面布局宽度差值
    activity.style.height = (Number(deviceHeight) - 120) + 'px' // 数字是页面布局高度差
  },
  created () {
    this.getServiceUrl()
  },
  methods: {
    getServiceUrl () {
      const params = {}
      params.serviceId = 'shop-activity'
      getServiceUrl(params).then(response => {
        this.url = response.data + '/druid/login.html'
      })
    }
  }
}
</script>
