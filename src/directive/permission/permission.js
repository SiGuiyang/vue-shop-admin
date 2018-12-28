
import store from '@/store'

export default{
  inserted(el, binding, vnode) {
    const { value } = binding
    // 用户所有的权限集
    const permission = store.getters && store.getters.permission

    if (value && value instanceof Array && value.length > 0) {
      const permissions = value

      const hasPermission = permission.some(perm => {
        return permissions.includes(perm)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}
