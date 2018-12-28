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
      list: [
        {
          id: 0,
          name: '事件1',
          permission: 50,
          type: '无',
          createTime: '无',
          operationUser: '无'
        },
        {
          id: 1,
          name: '事件1',
          permission: 50,
          type: '无',
          createTime: '无',
          operationUser: '无',
          children: [
            {
              id: 2,
              name: '事件1',
              permission: 50,
              type: '无',
              createTime: '无',
              operationUser: '无'
            },
            {
              id: 3,
              name: '事件1',
              permission: 50,
              type: '无',
              createTime: '无',
              operationUser: '无',
              children: [
                {
                  id: 4,
                  name: '事件1',
                  permission: 50,
                  type: '无',
                  createTime: '无',
                  operationUser: '无'
                },
                {
                  id: 5,
                  name: '事件1',
                  permission: 50,
                  type: '无',
                  createTime: '无',
                  operationUser: '无'
                },
                {
                  id: 6,
                  name: '事件1',
                  permission: 50,
                  type: '无',
                  createTime: '无',
                  operationUser: '无',
                  children: [
                    {
                      id: 7,
                      name: '事件1',
                      permission: 50,
                      type: '无',
                      createTime: '无',
                      operationUser: '无',
                      children: [
                        {
                          id: 71,
                          name: '事件1',
                          permission: 50,
                          type: '无',
                          createTime: '无',
                          operationUser: '无'
                        },
                        {
                          id: 72,
                          name: '事件1',
                          permission: 50,
                          type: '无',
                          createTime: '无',
                          operationUser: '无'
                        },
                        {
                          id: 73,
                          name: '事件1',
                          permission: 50,
                          type: '无',
                          createTime: '无',
                          operationUser: '无'
                        }
                      ]
                    },
                    {
                      id: 8,
                      name: '事件1',
                      permission: 50,
                      type: '无',
                      createTime: '无',
                      operationUser: '无'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
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
          value: 'type'
        },
        {
          text: '创建时间',
          value: 'createTime'
        },
        {
          text: '操作人',
          value: 'operationUser'
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
