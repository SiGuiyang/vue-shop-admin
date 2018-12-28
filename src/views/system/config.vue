<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('system.config.configName')" v-model="listQuery.configName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.module" :placeholder="$t('system.config.module')" clearable style="width: 120px" class="filter-item">
        <el-option v-for="(item,index) in moduleOptions" :key="index" :label="item.value" :value="item.key"/>
      </el-select>
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
      <el-table-column :label="$t('table.id')" prop="id" width="65" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.config.module')" align="center">
        <template slot-scope="scope">
          <span class="link-type">{{ scope.row.module }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.config.configName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.configName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.config.configValue')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.configValue }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.config.status')" class-name="status-col" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.deleteStatus | statusFilter">{{ scope.row.deleteStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.config.description')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.config.createUser')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.config.createTime')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" class-name="small-padding fixed-width" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getConfigList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" width="50%">
        <el-form-item :label="$t('system.config.configName')" prop="configName">
          <el-input v-model="temp.configName" placeholder="请设置"/>
        </el-form-item>
        <el-form-item :label="$t('system.config.configValue')" prop="configValue">
          <el-input v-model="temp.configValue" placeholder="请设置"/>
        </el-form-item>
        <el-form-item :label="$t('system.config.module')" prop="module">
          <el-select v-model="temp.module" class="filter-item" placeholder="请选择">
            <el-option v-for="(item,index) in moduleOptions" :key="index" :label="item.value" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.config.description')">
          <el-input :autosize="{ minRows: 4, maxRows: 8}" v-model="temp.remark" type="textarea" placeholder="请添加说明"/>
        </el-form-item>
        <el-form-item :label="$t('system.config.status')" prop="deleteStatus">
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
import { fetchSystemConfig, modifySystemConfig } from '@/api/system'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ConfigManage',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
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
        configName: undefined,
        module: undefined
      },
      moduleOptions: [
        { key: 'activity', value: '活动模块' },
        { key: 'cart', value: '购物车模块' },
        { key: 'goods', value: '商品模块' },
        { key: 'admin', value: '平台模块' },
        { key: 'order', value: '订单模块' },
        { key: 'seller', value: '商家模块' },
        { key: 'settlement', value: '清结算模块' },
        { key: 'user', value: '用户模块' }
      ],
      textMap: {
        update: '编辑配置',
        create: '新增配置'
      },
      dialogStatus: undefined,
      dialogFormVisible: false,
      temp: {
        id: undefined,
        configName: undefined,
        configValue: undefined,
        module: undefined,
        description: undefined,
        deleteStatus: true
      },
      rules: {
        configName: [{ required: true, message: '配置项名称不能为空', trigger: 'change' }],
        configValue: [{ required: true, message: '配置项值不能为空', trigger: 'change' }],
        module: [{ required: true, message: '模块不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getConfigList()
  },
  methods: {
    getConfigList() {
      this.listLoading = true
      fetchSystemConfig(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getConfigList()
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
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.operationUser = 'vue-element-admin'
          modifySystemConfig(this.temp).then(() => {
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
          modifySystemConfig(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
          this.getConfigList()
        }
      })
    }
  }
}
</script>
