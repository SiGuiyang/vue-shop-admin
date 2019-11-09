<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.phone" placeholder="手机号码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-permission="'ROLE_SUPER_ADMIN'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新增</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="手机号码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拥有角色" align="center">
        <template slot-scope="scope">
          <span>{{ getRoles(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100" align="center">
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
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right" class-name="small-padding fixed-width" align="center">
        <template slot-scope="scope">
          <el-button v-permission="'ROLE_SUPER_ADMIN'" type="primary" size="mini" @click="handleModify(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button v-permission="'ROLE_SUPER_ADMIN'" v-if="scope.row.deleteStatus" type="success" size="mini" @click="handleDelete(scope.row, false)">启用</el-button>
          <el-button v-permission="'ROLE_SUPER_ADMIN'" v-else type="danger" size="mini" @click="handleDelete(scope.row, true)">禁用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getUserList" />
    <i-form ref="dataForm" :form-data="formData" :role-code-options="roleCodeOptions"/>
  </div>
</template>

<script>
import { fetchList, del } from '@/api/sysuser'
import { fetchRoleClassification } from '@/api/role'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import IForm from './form'

export default {
  name: 'UserManage',
  components: { Pagination, IForm },
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
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        phone: undefined
      },
      statusOptions: ['published', 'draft', 'deleted'],
      formData: {
        avatar: undefined,
        deleteStatus: false,
        id: undefined,
        password: undefined,
        phone: undefined,
        roleIds: [],
        roles: [],
        sysName: undefined,
        username: undefined
      },
      roleCodeOptions: []
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.list.forEach(k => {
          this.roleIds = JSON.parse(k.roleIds)
        })
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    getRoles(row) { // 拥有的角色
      let content = ''
      if (row.roles !== null) {
        for (let i = 0; i < row.roles.length; i++) {
          content += row.roles[i].roleName + '|'
        }
      }
      return content
    },
    initRoleCodes() { // 获取角色列表
      fetchRoleClassification({}).then(response => {
        this.roleCodeOptions = response.data
      })
    },
    handleFilter() { // 查询列表
      this.listQuery.page = 1
      this.getUserList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    handleCreate() { // 创建
      this.initRoleCodes()
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.passwordDisabled = false
      _this.dialogFormVisible = true
      this.restForm()
    },
    handleModify(row) { // 编辑弹框
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      this.initRoleCodes()
      _this.dialogStatus = 'update'
      _this.passwordDisabled = true
      _this.dialogFormVisible = true
    },
    handleDelete(row, data) {
      this.formData = Object.assign({}, row) // copy obj
      this.formData.deleteStatus = data
      del(this.formData).then(() => {
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
        this.getUserList()
      })
    },
    restForm() {
      this.formData = {
        avatar: undefined,
        deleteStatus: false,
        id: undefined,
        password: undefined,
        phone: undefined,
        roleIds: [],
        roles: [],
        sysName: undefined,
        username: undefined
      }
    }
  }
}
</script>
