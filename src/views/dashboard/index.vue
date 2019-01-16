<template>
  <div class="dashboard-container">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  data() {
    return {
      msg: 'Welcome 进入 Pager 分布式电商系统'
    }
  }
}
</script>

<style scoped>
  .dashboard-container{
    position: relative;
    width: 100%;
    height: calc(100vh - 84px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  h1 {
    color: green;
  }
</style>

