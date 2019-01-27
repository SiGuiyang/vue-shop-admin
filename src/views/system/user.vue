<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('system.user.sysName')" v-model="listQuery.sysUser" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-permission="'/admin/system/user/modify'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
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
      <el-table-column :label="$t('system.user.sysName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sysName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.user.sysCode')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sysCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.user.roleCode')" align="center">
        <template slot-scope="scope">
          <span>{{ getRoleIds(scope.row.roleIds) }}</span>
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
      <el-table-column :label="$t('table.actions')" width="120" fixed="right" class-name="small-padding fixed-width" align="center">
        <template slot-scope="scope">
          <el-button v-permission="'/admin/system/user/modify'" type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getUserList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" width="50%">
        <el-form-item :label="$t('system.user.sysName')" prop="sysName">
          <el-input v-model="temp.sysName" placeholder="请设置"/>
        </el-form-item>
        <el-form-item :label="$t('system.user.sysCode')" prop="sysCode">
          <el-input v-model="temp.sysCode" placeholder="请设置"/>
        </el-form-item>
        <el-form-item :label="$t('system.user.password')" prop="password">
          <el-input v-model="temp.password" :disabled="passwordDisabled" type="password" placeholder="请设置"/>
        </el-form-item>
        <el-form-item :label="$t('system.user.roleCode')" prop="roleIds">
          <el-select v-model="temp.roleIds" class="filter-item" multiple placeholder="请选择">
            <el-option v-for="(item,index) in roleCodeOptions" :key="index" :label="item.roleName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.user.avatar')" prop="avatar">
          <div style="margin-bottom: 20px;">
            <Upload v-model="temp.avatar" />
          </div>
        </el-form-item>
        <el-form-item :label="$t('system.user.status')" prop="deleteStatus">
          <el-switch
            v-model="temp.deleteStatus"
            active-text="关闭"
            inactive-text="启用"
            active-color="#ff4949"
            inactive-color="#13ce66" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchSystemUser, modifySystemUser, fetchRoleClassification } from '@/api/system'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Upload from '@/components/Upload/singleImage3'

export default {
  name: 'UserManage',
  components: { Pagination, Upload },
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
        sysName: undefined
      },
      statusOptions: ['published', 'draft', 'deleted'],
      roleCodeOptions: null,
      temp: {
        id: undefined,
        sysName: undefined,
        sysCode: undefined,
        loginCode: undefined,
        password: undefined,
        avatar: '',
        roleIds: [],
        deleteStatus: false
      },
      passwordDisabled: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogPvVisible: false,
      rules: {
        sysName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        sysCode: [{ required: true, message: '系统登陆名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        roleIds: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
        avatar: [{ required: true, message: '用户头像不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.initRoleCodes()
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.listLoading = true
      fetchSystemUser(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.list.forEach(k => {
          k.roleIds = JSON.parse(k.roleIds)
        })
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    initRoleCodes() { // 获取角色列表
      fetchRoleClassification({}).then(response => {
        this.roleCodeOptions = response.data
      })
    },
    getRoleIds(roleIds) {
      if (roleIds === '' || roleIds === undefined || roleIds === undefined) {
        return '——'
      }
      let content = ''
      this.roleCodeOptions.forEach(rco => {
        for (let i = 0; i < roleIds.length; i++) {
          if (rco.id === roleIds[i]) {
            content = content + rco.roleName + '|'
          }
        }
      })
      return content
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
    restTemp() {
      this.temp.id = undefined
      this.temp.sysName = undefined
      this.temp.sysCode = undefined
      this.temp.password = undefined
      this.temp.roleIds = []
      this.temp.deleteStatus = false
    },
    handleCreate() {
      this.restTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.passwordDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.createUser = this.$store.state.user.sysCode
          this.temp.loginCode = this.temp.sysCode
          this.temp.event = 'add'
          modifySystemUser(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getUserList()
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.passwordDisabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.event = 'modify'
          modifySystemUser(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getUserList()
          })
        }
      })
    }
  }
}
</script>
