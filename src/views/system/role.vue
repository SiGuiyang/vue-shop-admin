<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('system.role.roleName')" v-model="listQuery.roleName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-permission="'/admin/system/role/modify'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
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
      <el-table-column :label="$t('system.role.roleName')">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.title }}</span>
          <el-tag>{{ scope.row.roleName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.role.roleCode')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.role.status')" class-name="status-col" align="center">
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
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" class-name="small-padding fixed-width" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button type="primary" size="mini" @click="handlePermissionList(scope.row)">{{ $t('table.permission') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getRoleList" />

    <!-- 新增编辑 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" width="50%">
        <el-form-item :label="$t('system.role.roleName')" prop="roleName">
          <el-input v-model="temp.roleName" placeholder="请设置"/>
        </el-form-item>
        <el-form-item :label="$t('system.role.roleCode')" prop="roleCode">
          <el-input v-model="temp.roleCode" placeholder="请设置"/>
        </el-form-item>
        <el-form-item :label="$t('system.user.status')" prop="deleteStatus">
          <el-switch
            v-model="temp.deleteStatus"
            active-text="启用"
            inactive-text="关闭"
            active-color="#13ce66"
            inactive-color="#ff4949" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <!-- 授权 -->
    <el-dialog :title="permissionTitle" :visible.sync="permissionVisible">
      <el-tree
        ref="tree"
        :data="permissions"
        :default-expanded-keys="hadPermission"
        show-checkbox
        node-key="id"
        highlight-current />
      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="handlePermission">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchSystemRole, modifySystemRole, fetchMenuList, fetchHadPermission } from '@/api/system'
import waves from '@/directive/waves'
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ConfigManage',
  components: { Pagination },
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
        pageSize: 20,
        roleName: undefined
      },
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: '',
      permissionVisible: false,
      permissionTitle: '授予权限',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      temp: {
        id: undefined,
        roleName: undefined,
        roleCode: undefined,
        deleteStatus: false
      },
      rules: {
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        roleCode: [{ required: true, message: '角色代码不能为空', trigger: 'blur' }]
      },
      permissions: [], // 系统所有权限
      hadPermission: [] // 系统用户所属的权限
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    getRoleList() {
      this.listLoading = true
      fetchSystemRole(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getRoleList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.temp = {}
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.createUser = this.$store.state.user.sysCode
          this.temp.event = 'add'
          modifySystemRole(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
          this.getRoleList()
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          this.temp.event = 'modify'
          modifySystemRole(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
          this.getRoleList()
        }
      })
    },
    handlePermissionList(row) {
      this.permissionVisible = true
      fetchMenuList().then(response => { // 权限列表
        this.permission = response.data
      })

      fetchHadPermission().then(response => { // 所属权限
        this.hadPermission = response.data
      })
    },
    handlePermission() {
      this.permissionVisible = false
    }

  }
}
</script>
