<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('system.user.sysUser')" v-model="listQuery.sysUser" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
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
      <el-table-column :label="$t('system.user.sysUser')" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.sysUser }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.user.sysCode')" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.sysCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.user.roleCode')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.user.status')" class-name="status-col" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.deleteStatus | statusFilter">{{ scope.row.deleteStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.user.createUser')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.user.createTime')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" width="120" fixed="right" class-name="small-padding fixed-width" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getUserList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" width="50%">
        <el-form-item :label="$t('system.user.sysUser')" prop="sysUser">
          <el-input v-model="temp.sysUser" placeholder="请设置"/>
        </el-form-item>
        <el-form-item :label="$t('system.user.sysCode')" prop="sysCode">
          <el-input v-model="temp.sysCode" placeholder="请设置"/>
        </el-form-item>
        <el-form-item :label="$t('system.user.password')" prop="password">
          <el-input v-model="temp.password" placeholder="请设置"/>
        </el-form-item>
        <el-form-item :label="$t('system.user.roleCode')" prop="roleCode">
          <el-select v-model="temp.roleCode" class="filter-item" multiple placeholder="请选择">
            <el-option v-for="(item,index) in roleCodeOptions" :key="index" :label="item.roleName" :value="item.roleCode"/>
          </el-select>
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

  </div>
</template>

<script>
import { fetchSystemUser, modifySystemUser, fetchSystemRole } from '@/api/system'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'UserManage',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
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
        limit: 20,
        sysUser: undefined
      },
      statusOptions: ['published', 'draft', 'deleted'],
      roleCodeOptions: [],
      temp: {
        id: '',
        sysUser: '',
        sysCode: '',
        password: '',
        role: '',
        deleteStatus: false
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogPvVisible: false,
      rules: {
        sysUser: [{ required: true, message: '用户名不能为空', trigger: 'change' }],
        sysCode: [{ required: true, message: '系统登陆名不能为空', trigger: 'change' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        roleCode: [{ required: true, message: '角色不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.listLoading = true
      fetchSystemUser(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getRoleCodes() { // 获取角色列表
      const params = {}
      params.event = 'roleCodes'
      fetchSystemRole(params).then(response => {
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
      this.temp = {}
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          modifySystemUser(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
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
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          modifySystemUser(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>
