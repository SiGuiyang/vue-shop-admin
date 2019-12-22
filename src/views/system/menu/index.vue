<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-permission="'ROLE_SUPER_ADMIN'" v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新增</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :default-expand-all="expand"
      row-key="id"
      stripe
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="菜单名称" prop="icon" width="200" align="center">
        <template slot-scope="scope">
          <el-tag> {{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="图标" prop="icon" width="100" align="center">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" style="height: 45px;width: 16px;" />
        </template>
      </el-table-column>
      <el-table-column label="请求地址" prop="path" width="200" align="center">
        <template slot-scope="scope">
          <el-tag> {{ scope.row.path }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="组建路径" prop="component" width="280" align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sequence" width="100" align="center">
        <template slot-scope="scope">
          <el-tag> {{ scope.row.sequence }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="隐藏" prop="hidden" width="100" align="center">
        <template slot-scope="scope">
          <el-tag> {{ scope.row.hidden ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="operation" width="200" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleModify(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--</tree-table>-->
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
      menuData: null,
      selectItem: null,
      list: [],
      total: 0,
      listLoading: false,
      expand: false,
      formData: {
        id: undefined,
        parentId: undefined,
        name: undefined,
        path: undefined,
        component: undefined,
        sequence: 0,
        hidden: false,
        icon: undefined,
        children: undefined
      }
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
        this.listLoading = false
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
        children: undefined
      }
    },
    handleModify(row) {
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
    },
    handleDelete(row) {
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
