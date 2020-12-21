<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-permission="'PAGER_SYSTEM_MENU_CREATE'"
                 v-waves
                 class="filter-item"
                 style="margin-left: 10px;"
                 type="primary"
                 icon="el-icon-edit"
                 @click="handleCreate">创建
      </el-button>
    </div>
    <el-table v-loading="listLoading"
              :data="list"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              :default-expand-all="expand"
              row-key="id"
              stripe
              fit
              highlight-current-row
              style="width: 100%;">
      <el-table-column label="菜单名称"
                       prop="icon"
                       align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图标"
                       prop="icon"
                       align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.icon">
            <svg-icon :icon-class="scope.row.icon" />
          </template>
        </template>
      </el-table-column>
      <el-table-column label="请求地址"
                       prop="path"
                       align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.path">
            <el-tag> {{ scope.row.path }}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="组建路径"
                       prop="component"
                       align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序"
                       prop="sequence"
                       align="center">
        <template slot-scope="scope">
          <el-tag> {{ scope.row.sequence }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="隐藏"
                       prop="hidden"
                       align="center">
        <template slot-scope="scope">
          <el-tag> {{ scope.row.hidden ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更新时间"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       prop="operation"
                       width="200"
                       align="center"
                       fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="'PAGER_SYSTEM_MENU_MODIFY'"
                     size="small"
                     type="primary"
                     icon="el-icon-edit"
                     @click="handleModify(scope.row)">编辑
          </el-button>
          <el-button v-permission="'PAGER_SYSTEM_MENU_MODIFY'"
                     size="small"
                     type="danger"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <i-form ref="dataForm"
            :form-data="formData"
            :menus="menuData" />
  </div>
</template>

<script>
import { fetchList, del } from '@/api/menu'
import IForm from './form'
import permission from '@/directive/permission'
import waves from '@/directive/waves' // Waves directive
export default {
  directives: { waves, permission },
  components: { IForm },
  data () {
    return {
      menuData: null,
      selectItem: null,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize: 10,
        name: undefined,
        menuType: undefined
      },
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
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.menuData = response.data
        this.listLoading = false
        this.total = response.total
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCreate () {
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
    handleModify (row) {
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
    },
    handleDelete (row) {
      if (row.parentId === undefined || row.parentId === '' || row.parentId === null) {
        this.$confirm('此操作将永久删除关联下级菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del({ id: row.id }).then(() => {
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
        del({ id: row.id }).then(() => {
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
