<template>
  <div class="app-container">
    <iframe id="hystrix" ref="iframe" :src="url" frameborder="0" />
  </div>
</template>
<script>
import { getServiceUrl } from '@/api/common'

export default {
  name: 'AdminInterface',
  data() {
    return {
      url: 'https://www.baidu.com/'
    }
  },
  mounted() {
    const hystrix = document.getElementById('hystrix')
    const deviceWidth = document.documentElement.clientWidth
    const deviceHeight = document.documentElement.clientHeight
    hystrix.style.width = (Number(deviceWidth) - 220) + 'px' // 数字是页面布局宽度差值
    hystrix.style.height = (Number(deviceHeight) - 120) + 'px' // 数字是页面布局高度差
  },
  created() {
    this.getServiceUrl()
  },
  methods: {
    getServiceUrl() {
      const params = {}
      params.serviceId = 'shop-hystrix-dashboard'
      getServiceUrl(params).then(response => {
        this.url = response.data + '/hystrix'
      })
    }
  }
}
</script>
