<template>
  <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
    <slot name="menuItem"/>
  </ul>
</template>
<script>
export default {
  name: 'RightClickMenu',
  props: {
    offset: {
      type: Object,
      default: () => {
        return {
          offsetLeft: 0,
          offsetWidth: 0,
          clientX: 0,
          clientY: 0
        }
      }
    }
  },
  data() {
    return {
      left: 0,
      top: 0,
      visible: false
    }
  },
  watch: {
    offset: {
      handler: function() {
        const { offsetLeft, offsetWidth, clientX, clientY } = this.offset
        const menuMinWidth = 105
        const maxLeft = offsetWidth - menuMinWidth // left boundary
        const left = clientX - offsetLeft + 15 // 15: margin right

        if (left > maxLeft) {
          this.left = maxLeft
        } else {
          this.left = left
        }
        this.top = clientY - 55

        this.visible = true
      },
      deep: true
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  methods: {
    closeMenu() {
      this.visible = false
    }
  }
}
</script>
<style scoped>
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
  }
  .contextmenu li {
    list-style-type: none;
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
  }
  .contextmenu li:hover {
    background: #eee;
  }
</style>
