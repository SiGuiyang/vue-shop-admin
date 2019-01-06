<template>
  <div class="app-container">
    <tree-table :data="list" :columns="columns" border/>
  </div>
</template>

<script>
import { fetchMenuList } from '@/api/system'
import treeTable from '@/components/TreeTable'

export default {
  name: 'MenuManage',
  components: { treeTable },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      columns: [
        {
          text: '序号',
          value: 'id',
          width: 200
        },
        {
          text: '菜单名称',
          value: 'name'
        },
        {
          text: '权限',
          value: 'permission'
        },
        {
          text: '类型',
          value: 'permissionTypeName'
        },
        {
          text: '创建时间',
          value: 'createTimeName'
        },
        {
          text: '操作人',
          value: 'createUser'
        }
      ]
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    getMenuList() {
      this.listLoading = true
      fetchMenuList().then(response => {
        this.list = response.data
        this.total = response.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    }
  }
}
</script>
