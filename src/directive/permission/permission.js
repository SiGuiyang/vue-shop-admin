
import store from '@/store'

export default{
  inserted(el, binding, vnode) {
    const { value } = binding
    // 用户所有的权限集
    const permission = store.getters && store.getters.permission
    const permissions = value

    const hasPermission = permission.some(perm => {
      return permissions.includes(perm)
    })

    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
