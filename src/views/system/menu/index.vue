<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-permission="'ROLE_ADMIN'" v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新增</el-button>
    </div>
    <tree-table :data="list" :columns="columns" border>
      <el-table-column label="图标" prop="icon" align="center">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" style="height: 45px;width: 16px;" />
        </template>
      </el-table-column>
      <el-table-column label="请求地址" prop="path" align="center">
        <template slot-scope="scope">
          <el-tag> {{ scope.row.path }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="组建路径" prop="component" align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sequence" align="center" >
        <template slot-scope="scope">
          <el-tag> {{ scope.row.sequence }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="隐藏" prop="hidden" align="center">
        <template slot-scope="scope">
          <el-tag> {{ scope.row.hidden ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="operation" align="center" fixed="right" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleModify(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </tree-table>
    <i-form ref="dataForm" :form-data="formData" :menus="menuData"/>
  </div>
</template>

<script>
import { fetchList, del } from '@/api/menu'
import treeTable from '@/components/TreeTable'
import IForm from './form'
import permission from '@/directive/permission'
import waves from '@/directive/waves' // Waves directive
export default {
  directives: { waves, permission },
  components: { treeTable, IForm },
  data() {
    return {
      menuData: [],
      selectItem: null,
      list: [],
      total: 0,
      listLoading: true,
      formData: {
        id: undefined,
        parentId: undefined,
        name: undefined,
        path: undefined,
        component: undefined,
        sequence: 0,
        hidden: false,
        icon: undefined,
        children: []
      },
      listQuery: {
        page: 1,
        pageSize: 20
      },
      columns: [
        {
          text: '菜单名称',
          value: 'name'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList({}).then(response => {
        this.list = response.data
        this.menuData = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCreate() {
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
      this.formData = {
        id: undefined,
        parentId: undefined,
        name: undefined,
        path: undefined,
        component: undefined,
        sequence: 0,
        hidden: false,
        icon: undefined,
        children: []
      }
    },
    handleModify(row) {
      const temp = Object.assign({}, row) // copy obj
      this.formData.id = temp.id
      this.formData.parentId = temp.parentId
      this.formData.name = temp.name
      this.formData.path = temp.path
      this.formData.component = temp.component
      this.formData.sequence = 0
      this.formData.hidden = false
      this.formData.children = []
      this.formData.icon = temp.icon
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
    },
    handleDelete(row) {
      console.log(row.id)
      if (row.parentId === undefined || row.parentId === '' || row.parentId === null) {
        this.$confirm('此操作将永久删除关联下级菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del(row.id).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        del(row.id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getList()
        })
      }
    }
  }
}
</script>
