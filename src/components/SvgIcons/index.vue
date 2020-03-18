<template>
  <div class="icon-body">
    <el-input v-model="name"
              style="position: relative;"
              clearable
              placeholder="请输入图标名称"
              @clear="clearIcons">
      <i slot="suffix"
         class="el-icon-search el-input__icon" />
    </el-input>
    <div class="icon-list">
      <div v-for="(item, index) in icons"
           :key="index"
           @click="selectedIcon(item)">
        <svg-icon :icon-class="item"
                  style="height: 45px;width: 16px;" />
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import icons from './requireIcons'

export default {
  name: 'SvgIcons',
  data () {
    return {
      name: undefined,
      icons: icons
    }
  },
  methods: {
    clearIcons () {
      if (this.name) {
        this.icons = this.icons.filter(item => item.includes(this.name))
      } else {
        this.icons = icons
      }
    },
    selectedIcon (name) {
      this.$emit('selected', name)
      document.body.click()
    },
    reset () {
      this.name = undefined
      this.icons = icons
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-body {
  width: 100%;
  padding: 10px;

  .icon-list {
    height: 200px;
    overflow-y: scroll;

    div {
      height: 45px;
      line-height: 45px;
      margin-bottom: -5px;
      cursor: pointer;
      width: 33%;
      float: left;
    }

    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>
