export default {
  getParam (name) {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    const r = window.location.search.substr(1).match(reg)
    if (r != null) return decodeURI(r[2])
    return null
  }
}
