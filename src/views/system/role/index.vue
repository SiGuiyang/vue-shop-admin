<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.roleName" placeholder="角色名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-permission="'ROLE_SUPER_ADMIN'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新增</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      stripe
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="角色名称" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.title }}</span>
          <el-tag>{{ scope.row.roleName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="角色编码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="80" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.deleteStatus | statusFilter">{{ scope.row.deleteStatus ? '禁用' : '启用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" fixed="right" width="220" align="center">
        <template slot-scope="scope">
          <el-button v-permission="'ROLE_SUPER_ADMIN'" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="'ROLE_SUPER_ADMIN'" v-if="scope.row.deleteStatus" type="success" size="mini" @click="handleEnable(scope.row, false)">启用</el-button>
          <el-button v-permission="'ROLE_SUPER_ADMIN'" v-else type="danger" size="mini" @click="handleEnable(scope.row, true)">禁用</el-button>
          <el-button v-permission="'ROLE_SUPER_ADMIN'" type="warning" size="mini" @click="handlePermission(scope.row)">授权</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getRoleList" />
    <i-form ref="dataForm" :form-data="formData" />
    <i-permission ref="permissionForm" :permissions="permissions" :selected-role-id="selectedRoleId" :had-permission="hadPermission" />
  </div>
</template>

<script>
import { fetchRoleList, modifyRole, fetchRolePermission } from '@/api/role'
import waves from '@/directive/waves'
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'
import IPermission from './permission'
export default {
  components: { Pagination, IForm, IPermission },
  directives: { waves, permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        false: 'success',
        true: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        roleName: undefined
      },
      showReviewer: false,
      formData: {
        id: undefined,
        roleName: undefined,
        roleCode: undefined,
        deleteStatus: false
      },
      selectedRoleId: 0,
      permissions: [], // 系统所有权限
      hadPermission: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    getRoleList() {
      this.listLoading = true
      fetchRoleList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getRoleList()
    },
    handleEnable(row, status) {
      this.formData = Object.assign({}, row) // copy obj
      this.formData.deleteStatus = status
      modifyRole(this.formData).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.getRoleList()
      })
    },
    handleCreate() {
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.dialogFormVisible = true
      this.formData = {}
    },
    handleUpdate(row) {
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'update'
      _this.dialogFormVisible = true
    },
    handlePermission(row) {
      this.selectedRoleId = row.id
      // 获取菜单列表
      fetchRolePermission({ roleId: row.id }).then(response => {
        this.permissions = response.data.menus
        this.hadPermission = response.data.hadPermissions
        const _this = this.$refs['permissionForm']
        _this.permissionVisible = true
      })
    }

  }
}
</script>
