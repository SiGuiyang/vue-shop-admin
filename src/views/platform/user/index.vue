<template>
  <div class="app-container">dd</div>
</template>

<script>

import waves from '@/directive/waves' // Waves directive

export default {
  name: 'User',
  directives: { waves },
  data () {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize: 20,
        brandName: undefined,
        timeRange: undefined
      },
      dialogFormVisible: false,
      dialogFormTitle: '编辑',
      brandGroup: [],
      formData: {
        id: undefined,
        brandGroupId: undefined,
        sequence: undefined,
        brandName: undefined,
        brandCode: undefined,
        icon: undefined,
        createUser: undefined,
        updateUser: undefined
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () { // 商品品牌列表
      this.listLoading = true
    },
    handleFilter () { // 搜索
      this.listQuery.page = 1
      this.getList()
    },
    restForm () {
      this.formData.id = undefined
      this.formData.brandName = undefined
      this.formData.icon = undefined
      this.formData.createUser = undefined
      this.formData.brandGroupId = undefined
      this.formData.sequence = undefined
      this.formData.brandCode = undefined
      this.formData.icon = undefined
      this.formData.createUser = undefined
      this.formData.updateUser = undefined
    },
    handleCreate () { // 创建
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
      this.restForm()
    },
    handleModify (row) { // 编辑弹框
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
    },
    handleDelete (id) { // 删除
    }
  }
}
</script>
