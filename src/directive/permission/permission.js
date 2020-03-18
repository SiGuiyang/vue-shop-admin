import store from '@/store'

export default {
  inserted (el, binding, vnode) {
    const { value } = binding
    // 用户所有的权限集
    const permissions = store.getters && store.getters.permissions
    if (permissions.indexOf(value) < 0) { // 不包含某访问权限，则移除元素
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
