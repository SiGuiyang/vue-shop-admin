<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('system.user.sysName')" v-model="listQuery.sysName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-permission="'ROLE_ADMIN'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="$t('table.id')" prop="id" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.user.sysName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sysName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.user.username')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.user.roleCode')" align="center">
        <template slot-scope="scope">
          <span>{{ getRoles(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.user.status')" class-name="status-col" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.deleteStatus | statusFilter">{{ scope.row.deleteStatus ? '禁用' : '启用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.createUser')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.createTime')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" width="180" fixed="right" class-name="small-padding fixed-width" align="center">
        <template slot-scope="scope">
          <el-button v-permission="'ROLE_ADMIN'" type="primary" size="mini" @click="handleModify(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button v-permission="'ROLE_ADMIN'" type="danger" size="mini" @click="handleDelete(scope.row.id)">{{ $t('table.delete') }}</el-button>
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
        pageSize: 20,
        sysName: undefined
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
          k.roleIds = JSON.parse(k.roleIds)
        })

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    getRoles(row) {
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
    handleFilter() {
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
    handleCreate() {
      this.initRoleCodes()
      const _this = this.$refs['dataForm']
      _this.dialogStatus = 'create'
      _this.passwordDisabled = false
      _this.dialogFormVisible = true
      this.restForm()
    },
    handleModify(row) {
      this.formData = Object.assign({}, row) // copy obj
      const _this = this.$refs['dataForm']
      console.log(this.formData)
      this.initRoleCodes()
      _this.dialogStatus = 'update'
      _this.passwordDisabled = true
      _this.dialogFormVisible = true
    },
    handleDelete(id) {
      del(id).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
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
