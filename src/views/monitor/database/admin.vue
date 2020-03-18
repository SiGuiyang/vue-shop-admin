<template>
  <div class="app-container">
    <iframe id="admin"
            ref="iframe"
            :src="url"
            frameborder="0" />
  </div>
</template>
<script>
import { getServiceUrl } from '@/api/common'

export default {
  name: 'AdminDatabase',
  data () {
    return {
      url: 'https://www.baidu.com/'
    }
  },
  mounted () {
    const admin = document.getElementById('admin')
    const deviceWidth = document.documentElement.clientWidth
    const deviceHeight = document.documentElement.clientHeight
    admin.style.width = (Number(deviceWidth) - 220) + 'px' // 数字是页面布局宽度差值
    admin.style.height = (Number(deviceHeight) - 120) + 'px' // 数字是页面布局高度差
  },
  created () {
    this.getServiceUrl()
  },
  methods: {
    getServiceUrl () {
      const params = {}
      params.serviceId = 'shop-manage'
      getServiceUrl(params).then(response => {
        this.url = response.data + '/druid'
      })
    }
  }
}
</script>
