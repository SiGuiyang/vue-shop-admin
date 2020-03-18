<template>
  <div class="app-container">
    <span>优惠券统计</span>
  </div>
</template>

<script>

export default {
  data () {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 20,
        formData: {}
      }
    }
  }
}
</script>
